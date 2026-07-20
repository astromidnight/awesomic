import { House, MagnifyingGlass, Basket, BookOpen, User } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeIndicator } from './StatusBar'

interface NavItemProps {
  icon: Icon
  label: string
  active: boolean
  onClick: () => void
}

function NavItem({ icon: IconCmp, label, active, onClick }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className="flex min-h-12 flex-col items-center justify-center gap-[6px] px-2 py-1"
    >
      <IconCmp
        size={24}
        weight={active ? 'fill' : 'regular'}
        className={active ? 'text-emerald-500' : 'text-ink-600'}
      />
      <span
        className={`text-[10.5px] ${active ? 'font-semibold text-emerald-500' : 'font-medium text-ink-600'}`}
      >
        {label}
      </span>
    </button>
  )
}

const items: { icon: Icon; label: string; path: string }[] = [
  { icon: House, label: 'Home', path: '/' },
  { icon: MagnifyingGlass, label: 'Search', path: '/search' },
  { icon: Basket, label: 'Pantry', path: '/pantry' },
  { icon: BookOpen, label: 'Cookbook', path: '/cookbook' },
  { icon: User, label: 'Profile', path: '/profile' },
]

export function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  return (
    <nav
      aria-label="Main"
      className="flex h-[84px] w-full shrink-0 flex-col gap-2 bg-ink-0 pt-3 pb-2 shadow-nav"
    >
      <div className="flex w-full items-center justify-between px-7">
        {items.map((it) => (
          <NavItem
            key={it.path}
            icon={it.icon}
            label={it.label}
            active={it.path === '/' ? pathname === '/' : pathname.startsWith(it.path)}
            onClick={() => navigate(it.path)}
          />
        ))}
      </div>
      <HomeIndicator />
    </nav>
  )
}
