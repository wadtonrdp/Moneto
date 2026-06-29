'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useDemoData } from '@/hooks/useDemoData'
import { useState, useEffect } from 'react'
import {
  Bell, Check, CheckCheck,
  Building2, ShoppingCart, Bitcoin, TrendingUp, Monitor,
  House, Car, Heart, Star,
} from 'lucide-react'

const READ_KEY = 'moneto_read_notifs'

const ICON_MAP: Record<string, { Icon: React.ElementType; bg: string; iconColor: string }> = {
  building: { Icon: Building2,    bg: 'bg-primary-light', iconColor: 'text-primary'    },
  cart:     { Icon: ShoppingCart, bg: 'bg-orange-50',     iconColor: 'text-orange-500' },
  bitcoin:  { Icon: Bitcoin,      bg: 'bg-amber-50',      iconColor: 'text-amber-500'  },
  trending: { Icon: TrendingUp,   bg: 'bg-primary-light', iconColor: 'text-primary'    },
  monitor:  { Icon: Monitor,      bg: 'bg-blue-50',       iconColor: 'text-blue-500'   },
  home:     { Icon: House,        bg: 'bg-red-50',        iconColor: 'text-red-500'    },
  car:      { Icon: Car,          bg: 'bg-zinc-100',      iconColor: 'text-zinc-500'   },
  heart:    { Icon: Heart,        bg: 'bg-pink-50',       iconColor: 'text-pink-500'   },
  star:     { Icon: Star,         bg: 'bg-gray-50',       iconColor: 'text-gray-500'   },
}

function TxIcon({ icon }: { icon: string }) {
  const { Icon, bg, iconColor } = ICON_MAP[icon] ?? ICON_MAP.star
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
  )
}

export default function Notificacoes() {
  const { transacoes } = useDemoData()
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date()).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem(READ_KEY) || '[]')
    setReadIds(new Set(saved))
  }, [])

  function markAllRead() {
    const ids = transacoes.map(t => t.id)
    localStorage.setItem(READ_KEY, JSON.stringify(ids))
    setReadIds(new Set(ids))
  }

  function markOneRead(id: string) {
    const updated = new Set([...readIds, id])
    localStorage.setItem(READ_KEY, JSON.stringify([...updated]))
    setReadIds(updated)
  }

  const unreadCount = transacoes.filter(t => !readIds.has(t.id)).length

  const grouped = transacoes.reduce((acc, tx) => {
    if (!acc[tx.data]) acc[tx.data] = []
    acc[tx.data].push(tx)
    return acc
  }, {} as Record<string, typeof transacoes>)

  const sortedDates = Object.keys(grouped).sort((a, b) => {
    const parse = (s: string) => {
      const [d, m, y] = s.split('/').map(Number)
      return new Date(y, m - 1, d).getTime()
    }
    return parse(b) - parse(a)
  })

  function formatDateLabel(dateStr: string): string {
    const [d, m, y] = dateStr.split('/').map(Number)
    const date = new Date(y, m - 1, d)
    const diff = Math.floor((Date.now() - date.getTime()) / 86_400_000)
    if (diff === 0) return 'Hoje'
    if (diff === 1) return 'Ontem'
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  }

  return (
    // h-full herda o h-screen do layout pai. overflow-hidden impede scroll externo.
    <div className='flex flex-col h-full overflow-hidden'>

      {/* HEADER — fixo, não rola */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-4 sm:px-6 flex-shrink-0 gap-3'>
        <div className='min-w-0'>
          <h1 className='text-base font-bold'>Notificações</h1>
          <p className='text-xs text-muted truncate'>
            {unreadCount > 0 ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}` : 'Tudo em dia ✓'} · {dataBR}
          </p>
        </div>

        <div className='flex items-center gap-2 flex-shrink-0'>
          {unreadCount > 0 && (
            <>
              <span className='hidden sm:block'>
                <Button variant='semi' onClick={markAllRead}>
                  <CheckCheck className='w-4 h-4' />
                  Marcar todas como lidas
                </Button>
              </span>
              <button
                onClick={markAllRead}
                className='sm:hidden p-2 rounded-md border border-border-main text-muted hover:text-primary hover:bg-bg transition-colors'
                title='Marcar todas como lidas'
              >
                <CheckCheck className='w-4 h-4' />
              </button>
            </>
          )}
          <Avatar />
        </div>
      </header>

      {/* LISTA — flex-1 + overflow-y-auto: só ela rola, a página não */}
      <main className='flex-1 overflow-y-auto bg-bg pb-16 lg:pb-0'>
        <div className='max-w-2xl w-full mx-auto px-4 sm:px-6 py-5'>

          {transacoes.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-64 text-muted'>
              <Bell className='w-10 h-10 mb-3 opacity-30' />
              <p className='text-sm font-semibold'>Nenhuma notificação</p>
              <p className='text-xs mt-1'>Adicione transações para vê-las aqui</p>
            </div>
          ) : (
            <div className='flex flex-col gap-5'>
              {sortedDates.map(date => (
                <div key={date}>

                  {/* Label de data */}
                  <div className='flex items-center gap-3 mb-3'>
                    <p className='text-xs font-black text-muted uppercase tracking-widest whitespace-nowrap'>
                      {formatDateLabel(date)}
                    </p>
                    <div className='flex-1 h-px bg-border-main' />
                  </div>

                  {/* Notificações do dia */}
                  <div className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>
                    {grouped[date].map((tx, i) => {
                      const isRead    = readIds.has(tx.id)
                      const isReceita = tx.tipo === 'receita'
                      const msg = isReceita
                        ? `Você recebeu ${tx.nome} de ${tx.categoria}`
                        : `Despesa em ${tx.categoria}: ${tx.nome}`

                      return (
                        <div
                          key={tx.id}
                          onClick={() => !isRead && markOneRead(tx.id)}
                          className={`flex items-center gap-3 px-4 py-3.5 transition-colors cursor-pointer
                            ${i < grouped[date].length - 1 ? 'border-b border-border-main' : ''}
                            ${!isRead ? 'bg-primary-light/20 hover:bg-primary-light/40' : 'hover:bg-bg'}
                          `}
                        >
                          <TxIcon icon={tx.icon} />

                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2'>
                              <p className={`text-xs truncate ${!isRead ? 'font-bold text-text' : 'font-semibold text-text'}`}>
                                {msg}
                              </p>
                              {!isRead && (
                                <span className='w-2 h-2 rounded-full bg-primary flex-shrink-0' />
                              )}
                            </div>
                            <p className='text-[10px] text-muted mt-0.5'>
                              {tx.data} · Status:{' '}
                              <span className={tx.status === 'concluido' ? 'text-primary font-semibold' : 'text-amber-600 font-semibold'}>
                                {tx.status === 'concluido' ? 'Concluído' : 'Pendente'}
                              </span>
                            </p>
                          </div>

                          <div className='flex flex-col items-end gap-1 flex-shrink-0'>
                            <span className={`text-xs font-bold font-mono ${isReceita ? 'text-primary' : 'text-red-500'}`}>
                              {isReceita ? '+' : '−'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                            {isRead && <Check className='w-3 h-3 text-muted hidden sm:block' />}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
