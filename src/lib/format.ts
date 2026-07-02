const FRACTIONS: [number, string][] = [
  [0.25, '¼'],
  [0.33, '⅓'],
  [0.5, '½'],
  [0.66, '⅔'],
  [0.75, '¾'],
]

/** 0.5 → "½", 1.5 → "1½", 3 → "3" */
export function formatQty(q: number): string {
  const whole = Math.floor(q)
  const frac = q - whole
  if (frac < 0.1) return String(whole)
  const glyph = FRACTIONS.reduce((best, cur) =>
    Math.abs(cur[0] - frac) < Math.abs(best[0] - frac) ? cur : best,
  )[1]
  return whole === 0 ? glyph : `${whole}${glyph}`
}

/** 125 → "02:05" */
export function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

/** speakable quantity: 0.5 → "half", 1.5 → "1 and a half" */
export function speakQty(q: number): string {
  const whole = Math.floor(q)
  const frac = q - whole
  if (frac < 0.1) return String(whole)
  const names: [number, string][] = [
    [0.25, 'a quarter'],
    [0.33, 'a third'],
    [0.5, 'a half'],
    [0.66, 'two thirds'],
    [0.75, 'three quarters'],
  ]
  const name = names.reduce((b, c) => (Math.abs(c[0] - frac) < Math.abs(b[0] - frac) ? c : b))[1]
  return whole === 0 ? name : `${whole} and ${name}`
}

export function todayLabel(): string {
  const d = new Date()
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-GB', { month: 'short' })
  return `${weekday}, ${day} ${month}`.toUpperCase()
}

export function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
