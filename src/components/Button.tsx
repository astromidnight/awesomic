import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ink' | 'outline'

const variants: Record<Variant, string> = {
  primary: 'bg-emerald-700 text-ink-0 active:bg-emerald-800',
  ink: 'bg-ink-900 text-ink-0 active:opacity-90',
  outline: 'bg-ink-0 text-ink-900 border-[1.5px] border-ink-200 active:bg-ink-50',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
}

export function Button({ variant = 'primary', icon, children, className = '', ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`flex min-h-[48px] items-center justify-center gap-2 rounded-[13px] px-[22px] py-[14px] text-[15px] font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}

type IconVariant = 'ghost' | 'surface' | 'outline'

const iconVariants: Record<IconVariant, string> = {
  ghost: '',
  surface: 'bg-ink-0 shadow-float',
  outline: 'bg-ink-0 border-[1.5px] border-ink-200 shadow-ctl',
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconVariant
  size?: number
  label: string
}

/** Circular icon button; visual size per Figma, hit area extended to ≥48px. */
export function IconButton({ variant = 'surface', size = 40, label, children, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      className={`relative flex shrink-0 items-center justify-center rounded-full after:absolute after:-inset-2 after:content-[''] ${iconVariants[variant]} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </button>
  )
}
