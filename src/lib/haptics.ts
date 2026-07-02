/** Haptic-like feedback via the Vibration API where supported. */
export function haptic(pattern: number | number[] = 12): void {
  try {
    navigator.vibrate?.(pattern)
  } catch {
    // vibration unavailable — never break cooking over feedback
  }
}

export const haptics = {
  step: () => haptic(12),
  swap: () => haptic([18, 40, 18]),
  done: () => haptic([20, 60, 20, 60, 40]),
}
