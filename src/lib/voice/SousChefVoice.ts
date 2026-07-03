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
  private currentUtterance: SpeechSynthesisUtterance | null = null
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

  // macOS ships a pile of joke/robotic voices ("Zarvox", "Bells", "Bad News"…).
  // The old fallback (first en localService voice) could land on one of these,
  // and it always locked onto "Samantha" — the very voice that sounds robotic.
  private static NOVELTY =
    /albert|bad news|bahh|bells|boing|bubbles|cellos|fred|good news|jester|junior|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|grandma|grandpa|deranged|hysterical|kathy/i

  /** Higher = warmer / more human. Non-English and novelty voices are excluded. */
  private voiceScore(v: SpeechSynthesisVoice): number {
    if (!v.lang.startsWith('en') || SousChefVoice.NOVELTY.test(v.name)) return -Infinity
    const n = v.name.toLowerCase()
    let score = 0
    // 1. Cloud neural engines are the most natural (Google / Microsoft "Natural").
    if (/natural|neural/.test(n)) score += 100
    if (/google/.test(n)) score += 60
    if (/online/.test(n)) score += 40
    // 2. Apple's downloadable Premium/Enhanced + modern personas beat the compact
    //    "Samantha"-era voices.
    if (/premium|enhanced/.test(n)) score += 50
    if (/\b(ava|zoe|allison|susan|nicky|aaron|evan|noelle|nathan|flo|sandy|reed|shelley|rocko)\b/.test(n))
      score += 30
    if (/samantha/.test(n)) score += 20
    // 3. US English matches the app's copy and welcoming tone.
    if (v.lang === 'en-US') score += 10
    else if (v.lang.startsWith('en')) score += 4
    return score
  }

  private pickVoice() {
    const voices = window.speechSynthesis.getVoices()
    if (!voices.length) return
    let best: SpeechSynthesisVoice | null = null
    let bestScore = -Infinity
    for (const v of voices) {
      const s = this.voiceScore(v)
      if (s > bestScore) {
        bestScore = s
        best = v
      }
    }
    if (best) this.voice = best
  }

  /** Allow the cook to change the narration voice. */
  setVoice(v: SpeechSynthesisVoice) {
    this.voice = v
  }

  availableVoices(): SpeechSynthesisVoice[] {
    return this.synthSupported
      ? window.speechSynthesis
          .getVoices()
          .filter((v) => v.lang.startsWith('en') && !SousChefVoice.NOVELTY.test(v.name))
          .sort((a, b) => this.voiceScore(b) - this.voiceScore(a))
      : []
  }

  /** Speak with a calm rate; suspends recognition for the duration. */
  speak(text: string, { interrupt = true }: { interrupt?: boolean } = {}): Promise<void> {
    if (!this.synthSupported || this.disposed) return Promise.resolve()
    return new Promise((resolve) => {
      if (interrupt) window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      if (this.voice) u.voice = this.voice
      // Near-natural pace with a hair of warmth; a dragging rate reads as robotic.
      u.rate = 0.98
      u.pitch = 1.03
      this.currentUtterance = u
      this.speaking = true
      this.stopRecognitionInternal()
      const finish = () => {
        // A newer utterance (from an interrupt) already owns the mic — the
        // cancelled utterance's late onend must NOT flip `speaking` back or
        // restart recognition mid-narration (that made the assistant hear
        // itself). Only the current utterance resumes listening.
        if (this.currentUtterance === u) {
          this.currentUtterance = null
          this.speaking = false
          if (this.shouldListen && !this.disposed) this.startRecognitionInternal()
        }
        resolve()
      }
      u.onend = finish
      u.onerror = finish
      window.speechSynthesis.speak(u)
    })
  }

  stopSpeaking() {
    if (this.synthSupported) window.speechSynthesis.cancel()
    this.currentUtterance = null
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
    this.stopLevelMeter()
    this.events.onLevel(0)
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
      // Chrome throws InvalidStateError when start() races the teardown of a
      // just-ended session. Drop this instance and retry, otherwise the mic
      // dies silently while shouldListen stays true.
      this.recognition = null
      if (this.shouldListen && !this.speaking && !this.disposed) {
        setTimeout(() => {
          if (this.shouldListen && !this.speaking && !this.disposed) {
            this.startRecognitionInternal()
          }
        }, 300)
      }
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

  private stopLevelMeter() {
    cancelAnimationFrame(this.levelRaf)
    this.levelRaf = 0
    this.mediaStream?.getTracks().forEach((t) => t.stop())
    this.mediaStream = null
    this.audioCtx?.close().catch(() => {})
    this.audioCtx = null
    this.analyser = null
  }

  dispose() {
    this.disposed = true
    this.shouldListen = false
    this.stopRecognitionInternal()
    this.stopSpeaking()
    this.stopLevelMeter()
  }
}
