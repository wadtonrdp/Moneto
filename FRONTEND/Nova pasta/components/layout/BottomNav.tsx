'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BarChart2,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',  label: 'Início',     Icon: LayoutDashboard },
  { href: '/carteira',   label: 'Carteira',   Icon: Wallet          },
  { href: '/transacoes', label: 'Transações', Icon: ArrowLeftRight  },
  { href: '/relatorios', label: 'Relatórios', Icon: BarChart2       },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-main flex z-50">
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
          >
            {active && (
              <span className="w-1 h-1 rounded-full bg-primary mb-0.5" />
            )}
            <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted'}`} />
            <span className={`text-[9px] font-bold ${active ? 'text-primary' : 'text-muted'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}