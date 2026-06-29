'use client'

import Avatar from '@/components/ui/Avatar'
import Link from 'next/link'
import { useDemoData, Transacao } from '@/hooks/useDemoData'
import { useLivePrices, isCrypto, fmtChange, fmtBRL, timeAgo } from '@/hooks/useLivePrices'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  Bell, ArrowUp, ArrowDown, Wallet, TrendingUp, TrendingDown, PiggyBank,
  Building2, ShoppingCart, Bitcoin, TrendingUp as TrendUp, Monitor,
  House, Car, Heart, Star, Loader2, Check, ExternalLink,
  DollarSign, RefreshCw, Zap,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell,
} from 'recharts'

type PeriodOption = '7d' | '1m' | '3m' | '1a'
const READ_KEY = 'moneto_read_notifs'

const ICON_MAP: Record<string, { Icon: React.ElementType; bg: string; iconColor: string }> = {
  building: { Icon: Building2,    bg: 'bg-primary-light', iconColor: 'text-primary'    },
  cart:     { Icon: ShoppingCart, bg: 'bg-orange-50',     iconColor: 'text-orange-500' },
  bitcoin:  { Icon: Bitcoin,      bg: 'bg-amber-50',      iconColor: 'text-amber-500'  },
  trending: { Icon: TrendUp,      bg: 'bg-primary-light', iconColor: 'text-primary'    },
  monitor:  { Icon: Monitor,      bg: 'bg-blue-50',       iconColor: 'text-blue-500'   },
  home:     { Icon: House,        bg: 'bg-red-50',        iconColor: 'text-red-500'    },
  car:      { Icon: Car,          bg: 'bg-zinc-100',      iconColor: 'text-zinc-500'   },
  heart:    { Icon: Heart,        bg: 'bg-pink-50',       iconColor: 'text-pink-500'   },
  star:     { Icon: Star,         bg: 'bg-gray-50',       iconColor: 'text-gray-500'   },
}

function TxIcon({ icon }: { icon: string }) {
  const { Icon, bg, iconColor } = ICON_MAP[icon] ?? ICON_MAP.star
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
  )
}

function filterByPeriod(txs: Transacao[], period: PeriodOption): Transacao[] {
  const days: Record<PeriodOption, number> = { '7d': 7, '1m': 30, '3m': 90, '1a': 365 }
  const limit = days[period]
  const now   = Date.now()
  return txs.filter(tx => {
    const [d, m, y] = tx.data.split('/').map(Number)
    return (now - new Date(y, m - 1, d).getTime()) / 86_400_000 <= limit
  })
}

function buildMonthlyData(txs: Transacao[]) {
  const map: Record<string, { mes: string; receita: number; despesa: number; ts: number }> = {}
  txs.forEach(tx => {
    const [, m, y] = tx.data.split('/').map(Number)
    const key   = `${y}-${String(m).padStart(2, '0')}`
    const label = new Date(y, m - 1).toLocaleDateString('pt-BR', { month: 'short' })
      .replace('.', '').replace(/^./, c => c.toUpperCase())
    if (!map[key]) map[key] = { mes: label, receita: 0, despesa: 0, ts: new Date(y, m - 1).getTime() }
    if (tx.tipo === 'receita') map[key].receita += tx.valor
    else map[key].despesa += Math.abs(tx.valor)
  })
  return Object.values(map).sort((a, b) => a.ts - b.ts)
}

export default function Dashboard() {
  const { transacoes, ativos, loading, metrics } = useDemoData()

  // Live prices para os tickers dos ativos
  const tickers = ativos.map(a => a.ticker)
  const { prices, cambio, loading: priceLoading, lastUpdated, refresh } = useLivePrices(tickers)

  const [selectedPeriod,  setSelectedPeriod]  = useState<PeriodOption>('3m')
  const [showNotifPanel,  setShowNotifPanel]   = useState(false)
  const [readIds,         setReadIds]          = useState<Set<string>>(new Set())
  const [timeLabel,       setTimeLabel]        = useState('')
  const bellRef = useRef<HTMLDivElement>(null)

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(new Date()).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  // Atualiza "X min atrás"
  useEffect(() => {
    if (!lastUpdated) return
    setTimeLabel(timeAgo(lastUpdated))
    const id = setInterval(() => setTimeLabel(timeAgo(lastUpdated)), 10_000)
    return () => clearInterval(id)
  }, [lastUpdated])

  // Read state
  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem(READ_KEY) || '[]')
    setReadIds(new Set(saved))
  }, [])

  // Click outside bell
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node))
        setShowNotifPanel(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const recentNotifs = transacoes.slice(0, 8)
  const unreadCount  = recentNotifs.filter(tx => !readIds.has(tx.id)).length

  function markAllRead() {
    const ids    = recentNotifs.map(t => t.id)
    const merged = [...new Set([...readIds, ...ids])]
    localStorage.setItem(READ_KEY, JSON.stringify(merged))
    setReadIds(new Set(merged))
  }

  // Period filtering
  const periodTxs = useMemo(() => filterByPeriod(transacoes, selectedPeriod), [transacoes, selectedPeriod])

  const periodKPIs = useMemo(() => {
    const r = periodTxs.filter(t => t.tipo === 'receita').reduce((s, t) => s + t.valor, 0)
    const d = periodTxs.filter(t => t.tipo === 'despesa').reduce((s, t) => s + Math.abs(t.valor), 0)
    return { totalReceitas: r, totalDespesas: d, saldo: r - d }
  }, [periodTxs])

  const evolucaoData      = useMemo(() => buildMonthlyData(periodTxs), [periodTxs])
  const totalPatrimonio   = metrics.totalPatrimonio
  const distribuicaoData  = metrics.distribuicaoAtivos.length > 0
    ? metrics.distribuicaoAtivos
    : [{ name: 'Sem ativos', value: 100, color: '#E3E5E9' }]
  const transacoesRecentes = periodTxs.slice(0, 5)
  const topAtivos          = [...ativos].sort((a, b) => b.valor - a.valor).slice(0, 5)

  const periodLabel: Record<PeriodOption, string> = {
    '7d': 'últimos 7 dias', '1m': 'último mês', '3m': 'últimos 3 meses', '1a': 'último ano',
  }
  const options: { value: PeriodOption; label: string }[] = [
    { value: '7d', label: '7d' }, { value: '1m', label: '1m' },
    { value: '3m', label: '3m' }, { value: '1a', label: '1a' },
  ]

  return (
    <div className='flex min-h-screen flex-col'>

      {/* HEADER */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0 gap-3'>
        <div className='flex-shrink-0'>
          <h1 className='text-base font-bold'>Dashboard</h1>
          <p className='text-xs text-muted'>{loading ? 'Carregando…' : `${periodLabel[selectedPeriod]} · ${dataBR}`}</p>
        </div>

        <div className='flex items-center gap-2 flex-wrap justify-end'>

          {/* USD/BRL ao vivo */}
          {cambio ? (
            <div className='flex items-center gap-1.5 bg-bg border border-border-main rounded-md px-2.5 py-1.5'>
              <DollarSign className='w-3 h-3 text-muted' />
              <span className='text-xs font-bold text-text font-mono'>R${cambio.toFixed(2)}</span>
              <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
              {timeLabel && (
                <button onClick={refresh} className='text-muted hover:text-primary transition-colors'>
                  <RefreshCw className='w-2.5 h-2.5' />
                </button>
              )}
            </div>
          ) : priceLoading ? (
            <div className='flex items-center gap-1.5 bg-bg border border-border-main rounded-md px-2.5 py-1.5'>
              <Loader2 className='w-3 h-3 animate-spin text-muted' />
              <span className='text-[10px] text-muted font-semibold'>Buscando…</span>
            </div>
          ) : null}

          {/* Seletor de período */}
          <div className='flex items-center gap-1 border border-border-main bg-bg p-1 rounded-lg'>
            {options.map(o => (
              <button key={o.value} onClick={() => setSelectedPeriod(o.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedPeriod === o.value ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-text cursor-pointer'
                }`}>
                {o.label}
              </button>
            ))}
          </div>

          {/* Bell */}
          <div ref={bellRef} className='relative'>
            <button onClick={() => setShowNotifPanel(v => !v)}
              className='relative border border-border-main p-2 rounded-md hover:bg-bg transition-colors cursor-pointer'>
              <Bell className='h-4 w-4 text-muted' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center'>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifPanel && (
              <div className='absolute right-0 top-full mt-2 w-80 bg-white rounded-[12px] border border-border-main shadow-xl z-50 overflow-hidden'>
                <div className='flex items-center justify-between px-4 py-3 border-b border-border-main'>
                  <div>
                    <p className='text-sm font-bold text-text'>Notificações</p>
                    {unreadCount > 0 && <p className='text-[10px] text-muted'>{unreadCount} não lida{unreadCount > 1 ? 's' : ''}</p>}
                  </div>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className='flex items-center gap-1 text-[10px] font-bold text-primary hover:opacity-70 transition-opacity'>
                      <Check className='w-3 h-3' />Marcar todas
                    </button>
                  )}
                </div>

                <div className='max-h-64 overflow-y-auto'>
                  {recentNotifs.length === 0
                    ? <p className='text-sm text-muted text-center py-8'>Sem notificações</p>
                    : recentNotifs.map((tx, i) => {
                        const isRead    = readIds.has(tx.id)
                        const isReceita = tx.tipo === 'receita'
                        return (
                          <div key={tx.id}
                            className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                              i < recentNotifs.length - 1 ? 'border-b border-border-main' : ''
                            } ${!isRead ? 'bg-primary-light/20' : 'hover:bg-bg'}`}>
                            <TxIcon icon={tx.icon} />
                            <div className='flex-1 min-w-0'>
                              <p className='text-xs font-bold text-text truncate'>{tx.nome}</p>
                              <p className='text-[10px] text-muted'>{tx.data} · {tx.categoria}</p>
                            </div>
                            <div className='flex flex-col items-end gap-1'>
                              <span className={`text-xs font-bold font-mono ${isReceita ? 'text-primary' : 'text-red-500'}`}>
                                {isReceita ? '+' : '−'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                              {!isRead && <span className='w-1.5 h-1.5 rounded-full bg-primary' />}
                            </div>
                          </div>
                        )
                      })}
                </div>

                <div className='px-4 py-2.5 border-t border-border-main bg-bg'>
                  <Link href='/notificacoes' onClick={() => setShowNotifPanel(false)}
                    className='flex items-center justify-center gap-1.5 text-xs font-bold text-primary hover:opacity-70 transition-opacity'>
                    <ExternalLink className='w-3 h-3' />Ver todas as notificações
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Avatar />
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className='flex-grow bg-bg p-6'>
        {loading ? (
          <div className='flex items-center justify-center h-64 text-muted gap-2'>
            <Loader2 className='w-6 h-6 animate-spin text-primary' />
            <span className='text-sm font-medium'>Carregando dados…</span>
          </div>
        ) : (
          <>
            {/* KPI CARDS */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6'>
              {[
                { label: 'Portfólio total',  value: totalPatrimonio,          change: `${ativos.length} ativos`,                                   icon: Wallet,       positivo: true                  },
                { label: 'Receitas',          value: periodKPIs.totalReceitas, change: `${periodTxs.filter(t=>t.tipo==='receita').length} entradas`, icon: TrendingUp,   positivo: true                  },
                { label: 'Despesas',          value: periodKPIs.totalDespesas, change: `${periodTxs.filter(t=>t.tipo==='despesa').length} saídas`,   icon: TrendingDown, positivo: false                 },
                { label: 'Saldo do período',  value: periodKPIs.saldo,         change: periodKPIs.saldo >= 0 ? 'Positivo ✓' : 'Negativo',           icon: PiggyBank,    positivo: periodKPIs.saldo >= 0 },
              ].map(kpi => {
                const Icon  = kpi.icon
                const Arrow = kpi.positivo ? ArrowUp : ArrowDown
                return (
                  <div key={kpi.label}
                    className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default'>
                    <div>
                      <div className='flex items-center gap-1.5 mb-2'>
                        <Icon className={`w-4 h-4 ${kpi.positivo ? 'text-primary' : 'text-red-500'}`} />
                        <p className='text-xs text-muted font-semibold'>{kpi.label}</p>
                      </div>
                      <p className='text-2xl font-bold text-text'>
                        R${Math.abs(kpi.value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-semibold mt-3 ${kpi.positivo ? 'text-primary' : 'text-red-500'}`}>
                      <Arrow className='w-3 h-3' />{kpi.change}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* GRÁFICOS */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>
              <div className='lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Receitas vs Despesas</h2>
                  <div className='flex items-center gap-3'>
                    <span className='flex items-center gap-1 text-[10px] text-muted'><span className='w-3 h-1.5 bg-primary rounded inline-block' />Receita</span>
                    <span className='flex items-center gap-1 text-[10px] text-muted'><span className='w-3 h-1.5 bg-red-400 rounded inline-block' />Despesa</span>
                  </div>
                </div>
                {evolucaoData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={200}>
                    <AreaChart data={evolucaoData}>
                      <defs>
                        <linearGradient id='gR' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%'  stopColor='#0F6E56' stopOpacity={0.15} />
                          <stop offset='95%' stopColor='#0F6E56' stopOpacity={0}    />
                        </linearGradient>
                        <linearGradient id='gD' x1='0' y1='0' x2='0' y2='1'>
                          <stop offset='5%'  stopColor='#EF4444' stopOpacity={0.1} />
                          <stop offset='95%' stopColor='#EF4444' stopOpacity={0}   />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray='3 3' stroke='#E3E5E9' />
                      <XAxis dataKey='mes' tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                      {/* @ts-ignore */}
                      <Tooltip formatter={value => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                      <Area type='monotone' dataKey='receita' stroke='#0F6E56' strokeWidth={2} fill='url(#gR)' dot={false} />
                      <Area type='monotone' dataKey='despesa' stroke='#EF4444' strokeWidth={2} fill='url(#gD)' dot={false} strokeDasharray='4 3' />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='flex items-center justify-center h-[200px] text-muted text-sm'>
                    Sem dados para {periodLabel[selectedPeriod]}
                  </div>
                )}
              </div>

              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <h2 className='text-sm font-bold text-text mb-4'>Distribuição</h2>
                <div className='relative flex justify-center'>
                  <ResponsiveContainer width='100%' height={140}>
                    <PieChart>
                      <Pie data={distribuicaoData} cx='50%' cy='50%' innerRadius={40} outerRadius={60} dataKey='value' strokeWidth={0}>
                        {distribuicaoData.map(e => <Cell key={e.name} fill={e.color} />)}
                      </Pie>
                      {/* @ts-ignore */}
                      <Tooltip formatter={v => [`${v}%`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                    <p className='text-base font-bold text-text font-mono'>R${(totalPatrimonio/1000).toFixed(1)}k</p>
                    <p className='text-[9px] text-muted font-semibold'>total</p>
                  </div>
                </div>
                <div className='flex flex-col gap-2 mt-2'>
                  {distribuicaoData.map(item => (
                    <div key={item.name} className='flex items-center gap-2 transition-opacity hover:opacity-70'>
                      <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: item.color }} />
                      <span className='text-xs text-text flex-1 font-medium'>{item.name}</span>
                      <span className='text-xs text-muted font-mono'>{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TRANSAÇÕES + TOP ATIVOS */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
              <div className='lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Transações recentes</h2>
                  <Link href='/transacoes' className='text-xs text-primary font-semibold hover:underline'>Ver todas</Link>
                </div>
                {transacoesRecentes.length === 0 ? (
                  <p className='text-sm text-muted text-center py-8'>Nenhuma transação neste período</p>
                ) : (
                  <div className='flex flex-col'>
                    {transacoesRecentes.map((tx, i) => (
                      <div key={tx.id}
                        className={`flex items-center gap-3 py-3 transition-colors hover:bg-bg rounded-lg px-2 -mx-2 ${
                          i < transacoesRecentes.length - 1 ? 'border-b border-border-main' : ''
                        }`}>
                        <TxIcon icon={tx.icon} />
                        <div className='flex-1 min-w-0'>
                          <p className='text-xs font-bold text-text truncate'>{tx.nome}</p>
                          <p className='text-[10px] text-muted'>{tx.data} · {tx.categoria}</p>
                        </div>
                        <span className={`text-xs font-bold font-mono flex-shrink-0 ${tx.tipo === 'receita' ? 'text-primary' : 'text-red-500'}`}>
                          {tx.tipo === 'receita' ? '+' : '−'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top ativos com preço ao vivo */}
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Top ativos</h2>
                  <Link href='/carteira' className='text-xs text-primary font-semibold hover:underline'>Ver carteira</Link>
                </div>
                {topAtivos.length === 0 ? (
                  <p className='text-sm text-muted text-center py-8'>Sem ativos</p>
                ) : (
                  <div className='flex flex-col gap-1'>
                    {topAtivos.map((ativo, i) => {
                      const live     = prices[ativo.ticker]
                      const positivo = (live?.brl_24h_change ?? 0) >= 0
                      return (
                        <div key={ativo.id}
                          className={`flex items-center gap-2 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-bg ${
                            i < topAtivos.length - 1 ? 'border-b border-border-main' : ''
                          }`}>
                          <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: ativo.color }} />
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-1'>
                              <p className='text-xs font-bold text-text truncate'>{ativo.nome}</p>
                              {live && <Zap className='w-2.5 h-2.5 text-primary flex-shrink-0' />}
                            </div>
                            <p className='text-[10px] text-muted'>{ativo.ticker}</p>
                          </div>
                          <div className='text-right flex-shrink-0'>
                            <p className='text-xs font-bold font-mono text-text'>
                              R${ativo.valor.toLocaleString('pt-BR')}
                            </p>
                            {live ? (
                              <p className={`text-[10px] font-bold font-mono ${positivo ? 'text-primary' : 'text-red-500'}`}>
                                {fmtChange(live.brl_24h_change)}
                              </p>
                            ) : (
                              <p className='text-[10px] font-bold font-mono text-muted'>
                                {totalPatrimonio > 0 ? `${Math.round((ativo.valor/totalPatrimonio)*100)}%` : '—'}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
