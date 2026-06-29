'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { doLogout } from '@/lib/auth'
import Logo from '@/components/ui/Logo'
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BarChart2,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard',    label: 'Dashboard',     Icon: LayoutDashboard },
  { href: '/carteira',     label: 'Carteira',       Icon: Wallet          },
  { href: '/transacoes',   label: 'Transações',     Icon: ArrowLeftRight  },
  { href: '/relatorios',   label: 'Relatórios',     Icon: BarChart2       },
]

const bottomItems = [
  { href: '/notificacoes',  label: 'Notificações',  Icon: Bell     },
  { href: '/configuracoes', label: 'Configurações', Icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    doLogout()
    router.replace('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-[210px] min-h-screen bg-white border-r border-border-main flex-shrink-0">

      {/* Logo */}
      <div className="p-4 border-b border-border-main">
        <Logo />
      </div>

      {/* Nav principal */}
      <nav className="flex flex-col gap-1 p-2 flex-1">
        <p className="text-[10px] font-black text-muted uppercase tracking-widest px-2 py-2">
          Principal
        </p>
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-semibold transition-all group
                ${active
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:bg-bg hover:text-text'
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110
                ${active ? 'text-primary' : 'text-muted'}`}
              />
              {label}
            </Link>
          )
        })}

        <p className="text-[10px] font-black text-muted uppercase tracking-widest px-2 py-2 mt-4">
          Conta
        </p>
        {bottomItems.map(({ href, label, Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-[8px] text-[13px] font-semibold transition-all group
                ${active
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:bg-bg hover:text-text'
                }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110
                ${active ? 'text-primary' : 'text-muted'}`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuário + logout */}
      <div className="p-2 border-t border-border-main">
        <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] mb-1">
          <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-[10px] font-black text-primary flex-shrink-0">
            GB
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-[12px] font-black text-text truncate">Gabriel</p>
            <p className="text-[10px] text-muted">Conta Demo</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-[8px] text-[13px] font-semibold text-muted hover:bg-red-50 hover:text-red-500 transition-all group"
        >
          <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
          Sair
        </button>
      </div>

    </aside>
  )
}
