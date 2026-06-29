'use client'

import Avatar from '@/components/ui/Avatar'
import { useDemoData } from '@/hooks/useDemoData'
import { useMemo, useState } from 'react'
import { PiggyBank, TrendingDown, TrendingUp, ArrowUp, Loader2 } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell,
} from 'recharts'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseMonth(dateStr: string): number {
  // dateStr = 'DD/MM/YYYY'
  const parts = dateStr.split('/')
  return parseInt(parts[1] ?? '1', 10)
}

const MES_LABEL: Record<number, string> = {
  1: 'Jan', 2: 'Fev', 3: 'Mar', 4: 'Abr',
  5: 'Mai', 6: 'Jun', 7: 'Jul', 8: 'Ago',
  9: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez',
}

const CAT_COLORS: Record<string, string> = {
  'Alimentação': '#F0C14B', 'Moradia': '#2461EA',  'Transporte': '#D85A30',
  'Assinaturas': '#3B82F6', 'Saúde':   '#EC4899',  'Cripto':     '#D97706',
  'Investimentos':'#0F6E56','Renda':   '#9EA1A9',   'Outros':     '#9EA1A9',
}

type PeriodKey = 'mes_atual' | 'mes_anterior' | 'ultimos_3' | 'tudo'

const PERIOD_LABELS: Record<PeriodKey, string> = {
  mes_atual:    'Este mês',
  mes_anterior: 'Mês anterior',
  ultimos_3:    'Últimos 3m',
  tudo:         'Tudo',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Relatorios() {
  const { transacoes, loading } = useDemoData()
  const [period, setPeriod] = useState<PeriodKey>('tudo')

  const dataHoje = new Date()
  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  // ── Filter transactions by period ─────────────────────────────────────────
  const filtradas = useMemo(() => {
    const now = new Date()
    const mesAtual = now.getMonth() + 1
    const anoAtual = now.getFullYear()

    return transacoes.filter(tx => {
      const parts = tx.data.split('/')
      const mes = parseInt(parts[1] ?? '1', 10)
      const ano = parseInt(parts[2] ?? '2026', 10)

      if (period === 'mes_atual')
        return mes === mesAtual && ano === anoAtual

      if (period === 'mes_anterior') {
        const prevMes = mesAtual === 1 ? 12 : mesAtual - 1
        const prevAno = mesAtual === 1 ? anoAtual - 1 : anoAtual
        return mes === prevMes && ano === prevAno
      }

      if (period === 'ultimos_3') {
        const cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        const txDate = new Date(ano, mes - 1, parseInt(parts[0] ?? '1', 10))
        return txDate >= cutoff
      }

      return true // 'tudo'
    })
  }, [transacoes, period])

  // ── Derived metrics ────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const receitas  = filtradas.filter(t => t.tipo === 'receita')
    const despesas  = filtradas.filter(t => t.tipo === 'despesa')

    const totalReceitas = receitas.reduce((s, t) => s + t.valor, 0)
    const totalDespesas = despesas.reduce((s, t) => s + Math.abs(t.valor), 0)
    const poupado       = totalReceitas - totalDespesas
    const taxaPoupanca  = totalReceitas > 0
      ? ((poupado / totalReceitas) * 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 1, maximumFractionDigits: 1,
        }) + '%'
      : '0%'

    // Monthly bar chart
    const monthMap: Record<number, { mes: string; receita: number; despesa: number }> = {}
    filtradas.forEach(tx => {
      const m = parseMonth(tx.data)
      if (!monthMap[m]) monthMap[m] = { mes: MES_LABEL[m] ?? String(m), receita: 0, despesa: 0 }
      if (tx.tipo === 'receita') monthMap[m].receita += tx.valor
      else monthMap[m].despesa += Math.abs(tx.valor)
    })
    const mensal = Object.entries(monthMap)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, v]) => v)

    // Category breakdown
    const catMap: Record<string, number> = {}
    despesas.forEach(t => {
      catMap[t.categoria] = (catMap[t.categoria] ?? 0) + Math.abs(t.valor)
    })
    const categorias = Object.entries(catMap)
      .map(([nome, valor]) => ({
        nome, valor,
        pct: totalDespesas > 0 ? Math.round((valor / totalDespesas) * 100) : 0,
        color: CAT_COLORS[nome] ?? '#9EA1A9',
      }))
      .sort((a, b) => b.valor - a.valor)

    const maiorGasto     = categorias[0] ?? null
    const maxCategoria   = categorias[0]?.valor ?? 1

    return {
      totalReceitas, totalDespesas, poupado, taxaPoupanca,
      mensal, categorias, maiorGasto, maxCategoria,
    }
  }, [filtradas])

  const options = Object.entries(PERIOD_LABELS) as [PeriodKey, string][]

  return (
    <div className='flex min-h-screen flex-col'>

      {/* HEADER */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0'>
        <div>
          <h1 className='text-base font-bold'>Relatórios</h1>
          <p className='text-xs text-muted'>Análise financeira · {dataBR}</p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1 border border-border-main bg-bg p-1 rounded-lg'>
            {options.map(([key, label]) => (
              <button key={key} onClick={() => setPeriod(key)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  period === key
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted hover:text-text cursor-pointer'
                }`}>
                {label}
              </button>
            ))}
          </div>
          <Avatar />
        </div>
      </header>

      <main className='flex-1 bg-bg p-6'>

        {loading ? (
          <div className='flex items-center justify-center h-64 text-muted gap-2'>
            <Loader2 className='w-6 h-6 animate-spin text-primary' />
            <span className='text-sm font-medium'>Calculando relatório…</span>
          </div>
        ) : filtradas.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-64 text-muted'>
            <p className='text-sm font-semibold'>Sem transações neste período</p>
            <p className='text-xs mt-1'>Adicione transações ou mude o filtro de período</p>
          </div>
        ) : (
          <>

            {/* KPI CARDS */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>

              {/* Total Poupado */}
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 rounded-[8px] bg-primary-light flex items-center justify-center'>
                    <PiggyBank className='w-4 h-4 text-primary' />
                  </div>
                  <p className='text-xs text-muted font-semibold'>Total Poupado</p>
                </div>
                <h2 className={`text-2xl font-bold font-mono mb-1 ${stats.poupado >= 0 ? 'text-text' : 'text-red-500'}`}>
                  {stats.poupado < 0 ? '−' : ''}R${Math.abs(stats.poupado).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <span className={`flex items-center gap-1 text-xs font-semibold ${stats.poupado >= 0 ? 'text-primary' : 'text-red-500'}`}>
                  <ArrowUp className='w-3 h-3' />
                  Taxa de poupança: {stats.taxaPoupanca} da renda
                </span>
              </div>

              {/* Maior Gasto */}
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center'>
                    <TrendingDown className='w-4 h-4 text-red-500' />
                  </div>
                  <p className='text-xs text-muted font-semibold'>Maior Categoria de Gasto</p>
                </div>
                <h2 className='text-2xl font-bold text-text font-mono mb-1'>
                  {stats.maiorGasto
                    ? `R$${stats.maiorGasto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : '—'}
                </h2>
                <p className='text-xs text-muted font-semibold'>
                  {stats.maiorGasto ? `${stats.maiorGasto.nome} · ${stats.maiorGasto.pct}% das despesas` : 'Sem despesas'}
                </p>
              </div>

              {/* Receita vs Despesa */}
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-8 h-8 rounded-[8px] bg-primary-light flex items-center justify-center'>
                    <TrendingUp className='w-4 h-4 text-primary' />
                  </div>
                  <p className='text-xs text-muted font-semibold'>Receita vs Despesa</p>
                </div>
                <h2 className='text-2xl font-bold text-text font-mono mb-1'>
                  R${stats.totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <span className='flex items-center gap-1 text-xs text-red-500 font-semibold'>
                  <TrendingDown className='w-3 h-3' />
                  Despesas: R${stats.totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* GRÁFICOS */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4'>

              {/* Bar chart — Receita vs Despesa por mês */}
              <div className='lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Receita vs Despesas — Mensal</h2>
                  <div className='flex items-center gap-3'>
                    <span className='flex items-center gap-1 text-[10px] text-muted'>
                      <span className='w-3 h-1.5 bg-primary rounded inline-block' />Receita
                    </span>
                    <span className='flex items-center gap-1 text-[10px] text-muted'>
                      <span className='w-3 h-1.5 bg-red-400 rounded inline-block' />Despesas
                    </span>
                  </div>
                </div>
                {stats.mensal.length > 0 ? (
                  <ResponsiveContainer width='100%' height={200}>
                    <BarChart data={stats.mensal} barGap={4}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#E3E5E9' vertical={false} />
                      <XAxis dataKey='mes' tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false}
                        tickFormatter={v => `R$${(v / 1000).toFixed(1)}k`} />
                      {/* @ts-ignore */}
                      <Tooltip formatter={value => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                      <Bar dataKey='receita' fill='#0F6E56' radius={[4, 4, 0, 0]} maxBarSize={32} />
                      <Bar dataKey='despesa' fill='#EF4444' radius={[4, 4, 0, 0]} maxBarSize={32} fillOpacity={0.8} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='flex items-center justify-center h-[200px] text-muted text-sm'>
                    Sem dados para este período
                  </div>
                )}
              </div>

              {/* Donut — Gastos por categoria */}
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <h2 className='text-sm font-bold text-text mb-4'>Gastos por categoria</h2>

                {stats.categorias.length === 0 ? (
                  <div className='flex items-center justify-center h-[140px] text-muted text-sm'>
                    Sem despesas
                  </div>
                ) : (
                  <>
                    <div className='relative flex justify-center'>
                      <ResponsiveContainer width='100%' height={140}>
                        <PieChart>
                          <Pie data={stats.categorias} cx='50%' cy='50%'
                            innerRadius={40} outerRadius={60} dataKey='valor' strokeWidth={0}>
                            {stats.categorias.map(c => (
                              <Cell key={c.nome} fill={c.color} />
                            ))}
                          </Pie>
                          {/* @ts-ignore */}
                          <Tooltip formatter={value => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className='flex flex-col gap-2 mt-2'>
                      {stats.categorias.map(c => (
                        <div key={c.nome} className='flex items-center gap-2 transition-opacity hover:opacity-70'>
                          <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: c.color }} />
                          <span className='text-xs text-text flex-1 font-medium'>{c.nome}</span>
                          <span className='text-xs font-mono text-muted'>{c.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* GASTOS DETALHADOS */}
            {stats.categorias.length > 0 && (
              <div className='bg-white p-4 rounded-[12px] border border-border-main shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Gastos por categoria (detalhado)</h2>
                  <span className='text-xs text-muted font-semibold'>{PERIOD_LABELS[period]}</span>
                </div>
                <div className='flex flex-col gap-4'>
                  {stats.categorias.map(cat => (
                    <div key={cat.nome}>
                      <div className='flex items-center justify-between mb-1.5'>
                        <div className='flex items-center gap-2'>
                          <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: cat.color }} />
                          <span className='text-xs font-semibold text-text'>{cat.nome}</span>
                        </div>
                        <div className='flex items-center gap-3'>
                          <span className='text-[10px] text-muted'>{cat.pct}%</span>
                          <span className='text-xs font-bold font-mono text-text w-24 text-right'>
                            R${cat.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className='w-full h-1.5 bg-bg rounded-full overflow-hidden'>
                        <div
                          className='h-full rounded-full transition-all duration-500'
                          style={{
                            width: `${(cat.valor / stats.maxCategoria) * 100}%`,
                            background: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  )
}
