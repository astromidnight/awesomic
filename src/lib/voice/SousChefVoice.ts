/* eslint-disable @typescript-eslint/no-explicit-any */

export interface VoiceEvents {
  onTranscript: (finalText: string) => void
  onListeningChange: (listening: boolean) => void
  onLevel: (level: number) => void
  onUnsupported: () => void
}

type RecognitionCtor = new () => any

function getRecognitionCtor(): RecognitionCtor | null {
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

/**
 * Resilient wrapper around SpeechSynthesis + SpeechRecognition.
 *
 * - Recognition runs continuously and auto-restarts when the browser kills it.
 * - Recognition is suspended while the app is speaking so the assistant
 *   never hears itself.
 * - A WebAudio analyser feeds the live waveform; if the mic stream is denied
 *   the rest of the service still works (recognition asks its own permission).
 * - When nothing is supported, `supported` is false and the app degrades to a
 *   fully tap-driven Cook Mode.
 */
export class SousChefVoice {
  readonly synthSupported: boolean
  readonly recognitionSupported: boolean

  private events: VoiceEvents
  private recognition: any = null
  private disposed = false
  private shouldListen = false
  private speaking = false
  private voice: SpeechSynthesisVoice | null = null
  private audioCtx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private mediaStream: MediaStream | null = null
  private levelRaf = 0

  constructor(events: VoiceEvents) {
    this.events = events
    this.synthSupported = typeof window !== 'undefined' && 'speechSynthesis' in window
    this.recognitionSupported = getRecognitionCtor() !== null
    if (!this.recognitionSupported) queueMicrotask(() => events.onUnsupported())
    if (this.synthSupported) {
      // voices load async in Chrome
      const pick = () => this.pickVoice()
      pick()
      window.speechSynthesis.addEventListener?.('voiceschanged', pick)
    }
  }

  private pickVoice() {
    const voices = window.speechSynthesis.getVoices()
    this.voice =
      voices.find((v) => v.lang.startsWith('en') && /Samantha|Google US English/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith('en') && v.localService) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      null
  }

  /** Allow the cook to change the narration voice. */
  setVoice(v: SpeechSynthesisVoice) {
    this.voice = v
  }

  availableVoices(): SpeechSynthesisVoice[] {
    return this.synthSupported
      ? window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en'))
      : []
  }

  /** Speak with a calm rate; suspends recognition for the duration. */
  speak(text: string, { interrupt = true }: { interrupt?: boolean } = {}): Promise<void> {
    if (!this.synthSupported || this.disposed) return Promise.resolve()
    return new Promise((resolve) => {
      if (interrupt) window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      if (this.voice) u.voice = this.voice
      u.rate = 0.95
      u.pitch = 1
      this.speaking = true
      this.stopRecognitionInternal()
      const finish = () => {
        this.speaking = false
        if (this.shouldListen) this.startRecognitionInternal()
        resolve()
      }
      u.onend = finish
      u.onerror = finish
      window.speechSynthesis.speak(u)
    })
  }

  stopSpeaking() {
    if (this.synthSupported) window.speechSynthesis.cancel()
    this.speaking = false
  }

  /** Begin continuous listening (+ mic level metering for the waveform). */
  async startListening() {
    this.shouldListen = true
    if (!this.speaking) this.startRecognitionInternal()
    await this.startLevelMeter()
  }

  stopListening() {
    this.shouldListen = false
    this.stopRecognitionInternal()
    this.events.onListeningChange(false)
  }

  private startRecognitionInternal() {
    if (!this.recognitionSupported || this.disposed || this.recognition) return
    const Ctor = getRecognitionCtor()!
    const rec = new Ctor()
    rec.continuous = true
    rec.interimResults = false
    rec.lang = 'en-US'
    rec.onresult = (e: any) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i]
        if (res.isFinal && !this.speaking) {
          const text = res[0]?.transcript ?? ''
          if (text.trim()) this.events.onTranscript(text)
        }
      }
    }
    rec.onstart = () => this.events.onListeningChange(true)
    rec.onend = () => {
      this.recognition = null
      this.events.onListeningChange(false)
      // Chrome ends continuous sessions after silence — restart quietly
      if (this.shouldListen && !this.speaking && !this.disposed) {
        setTimeout(() => {
          if (this.shouldListen && !this.speaking && !this.disposed) {
            this.startRecognitionInternal()
          }
        }, 250)
      }
    }
    rec.onerror = (e: any) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
        // permission denied — degrade to tap-driven mode
        this.shouldListen = false
        this.events.onUnsupported()
      }
      // 'no-speech' and 'aborted' fall through to onend, which restarts
    }
    this.recognition = rec
    try {
      rec.start()
    } catch {
      this.recognition = null
    }
  }

  private stopRecognitionInternal() {
    const rec = this.recognition
    if (rec) {
      this.recognition = null
      rec.onend = null
      rec.onresult = null
      try {
        rec.stop()
      } catch {
        /* already stopped */
      }
      this.events.onListeningChange(false)
    }
  }

  private async startLevelMeter() {
    if (this.audioCtx || this.disposed || !navigator.mediaDevices?.getUserMedia) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (this.disposed) {
        stream.getTracks().forEach((t) => t.stop())
        return
      }
      this.mediaStream = stream
      this.audioCtx = new AudioContext()
      const src = this.audioCtx.createMediaStreamSource(stream)
      this.analyser = this.audioCtx.createAnalyser()
      this.analyser.fftSize = 256
      src.connect(this.analyser)
      const data = new Uint8Array(this.analyser.frequencyBinCount)
      const loop = () => {
        if (this.disposed || !this.analyser) return
        this.analyser.getByteTimeDomainData(data)
        let sum = 0
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128
          sum += v * v
        }
        this.events.onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4))
        this.levelRaf = requestAnimationFrame(loop)
      }
      loop()
    } catch {
      // mic metering denied — waveform idles, recognition may still work
    }
  }

  dispose() {
    this.disposed = true
    this.shouldListen = false
    this.stopRecognitionInternal()
    this.stopSpeaking()
    cancelAnimationFrame(this.levelRaf)
    this.mediaStream?.getTracks().forEach((t) => t.stop())
    this.audioCtx?.close().catch(() => {})
    this.audioCtx = null
    this.analyser = null
  }
}
