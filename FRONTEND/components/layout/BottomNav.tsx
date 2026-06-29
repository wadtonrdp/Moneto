'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BarChart2,
  Bell,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',    label: 'Início',      Icon: LayoutDashboard },
  { href: '/carteira',     label: 'Carteira',    Icon: Wallet          },
  { href: '/transacoes',   label: 'Transações',  Icon: ArrowLeftRight  },
  { href: '/relatorios',   label: 'Relatórios',  Icon: BarChart2       },
  { href: '/notificacoes', label: 'Alertas',     Icon: Bell            },
  { href: '/configuracoes',label: 'Config',      Icon: Settings        },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border-main flex z-50 safe-area-inset-bottom">
      {navItems.map(({ href, label, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors relative"
          >
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-primary" />
            )}
            <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted'}`} />
            <span className={`text-[9px] font-bold leading-none ${active ? 'text-primary' : 'text-muted'}`}>
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
