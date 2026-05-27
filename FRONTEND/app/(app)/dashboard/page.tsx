'use client'

import Avatar from "@/components/ui/Avatar"
import Link from "next/link"
import {
  Bell, ArrowUp, ArrowDown,
  Wallet, TrendingUp, TrendingDown, PiggyBank,
  Building2, ShoppingCart, Bitcoin, Monitor
} from "lucide-react"
import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts'

type PeriodOption = '7d' | '1m' | '3m' | '1a'

// ===== DADOS MOCK =====
const evolucaoData = [
  { mes: 'Nov', patrimonio: 40200, investimentos: 18000 },
  { mes: 'Dez', patrimonio: 41800, investimentos: 18500 },
  { mes: 'Jan', patrimonio: 43100, investimentos: 19200 },
  { mes: 'Fev', patrimonio: 44600, investimentos: 20100 },
  { mes: 'Mar', patrimonio: 45900, investimentos: 21000 },
  { mes: 'Abr', patrimonio: 46800, investimentos: 21800 },
  { mes: 'Mai', patrimonio: 48320, investimentos: 22500 },
]

const distribuicaoData = [
  { name: 'Renda Fixa', value: 40, color: '#0F6E56' },
  { name: 'Ações',      value: 25, color: '#2461EA' },
  { name: 'Cripto',     value: 20, color: '#D85A30' },
  { name: 'Reserva',    value: 15, color: '#9EA1A9' },
]

const transacoes = [
  { id: 1, nome: 'Salário',      valor: 6400,   tipo: 'receita', data: '05/05', categoria: 'Renda',         Icon: Building2,    bg: 'bg-primary-light', iconColor: 'text-primary'    },
  { id: 2, nome: 'Supermercado', valor: -312,   tipo: 'despesa', data: '12/05', categoria: 'Alimentação',   Icon: ShoppingCart, bg: 'bg-orange-50',     iconColor: 'text-orange-500' },
  { id: 3, nome: 'Compra BTC',   valor: -500,   tipo: 'despesa', data: '28/04', categoria: 'Cripto',        Icon: Bitcoin,      bg: 'bg-amber-50',      iconColor: 'text-amber-500'  },
  { id: 4, nome: 'Dividendos',   valor: 420,    tipo: 'receita', data: '01/05', categoria: 'Investimentos', Icon: TrendingUp,   bg: 'bg-primary-light', iconColor: 'text-primary'    },
  { id: 5, nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', data: '03/05', categoria: 'Assinaturas',   Icon: Monitor,      bg: 'bg-blue-50',       iconColor: 'text-blue-500'   },
]

const topAtivos = [
  { nome: 'Bitcoin',       ticker: 'BTC',   valor: 'R$9.000', change: '+3,1%', positivo: true,  color: '#F0C14B' },
  { nome: 'Ethereum',      ticker: 'ETH',   valor: 'R$4.200', change: '+1,8%', positivo: true,  color: '#627EEA' },
  { nome: 'MXRF11',        ticker: 'FII',   valor: 'R$3.800', change: '+0,5%', positivo: true,  color: '#0F6E56' },
  { nome: 'Petrobras',     ticker: 'PETR4', valor: 'R$2.900', change: '-1,2%', positivo: false, color: '#2461EA' },
  { nome: 'Tesouro Selic', ticker: 'RF',    valor: 'R$2.600', change: '+0,8%', positivo: true,  color: '#9EA1A9' },
]

export default function Home() {
  const dataHoje = new Date()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('1m')
  const [notificacoes] = useState(3)

  const options: { value: PeriodOption; label: string }[] = [
    { value: '7d', label: '7d' },
    { value: '1m', label: '1m' },
    { value: '3m', label: '3m' },
    { value: '1a', label: '1a' },
  ]

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje)
    .replace(' de ', ' ')
    .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="flex min-h-screen flex-col">

      {/* HEADER */}
      <header className="border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-base font-bold">Dashboard</h1>
          <p className="text-xs text-muted">Atualizado agora · {dataBR}</p>
        </div>
        <div className="flex items-center gap-3">

          {/* Seletor de período */}
          <div className="flex items-center gap-1 border border-border-main bg-bg p-1 rounded-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedPeriod(option.value)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedPeriod === option.value
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-muted hover:text-text cursor-pointer'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Sino com badge */}
          <button className="relative border border-border-main p-2 rounded-md hover:bg-bg transition-colors cursor-pointer">
            <Bell className="h-4 w-4 text-muted" />
            {notificacoes > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {notificacoes}
              </span>
            )}
          </button>

          <Avatar />
        </div>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-grow bg-bg p-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Saldo total',   value: 'R$48.320', change: '+5% desde ontem',  icon: Wallet,       positivo: true  },
            { label: 'Receita',       value: 'R$6.400',  change: '+12% vs anterior', icon: TrendingUp,   positivo: true  },
            { label: 'Despesas',      value: 'R$3.180',  change: '+8% vs anterior',  icon: TrendingDown, positivo: false },
            { label: 'Investimentos', value: 'R$22.500', change: '+2,8% hoje',        icon: PiggyBank,    positivo: true  },
          ].map((kpi) => {
            const Icon = kpi.icon
            const Arrow = kpi.positivo ? ArrowUp : ArrowDown
            return (
              <div
                key={kpi.label}
                className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Icon className={`w-4 h-4 ${kpi.positivo ? 'text-primary' : 'text-red-500'}`} />
                    <p className="text-xs text-muted font-semibold">{kpi.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-text">{kpi.value}</p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-semibold mt-3 ${kpi.positivo ? 'text-primary' : 'text-red-500'}`}>
                  <Arrow className="w-3 h-3" />
                  {kpi.change}
                </span>
              </div>
            )
          })}
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Evolução do patrimônio */}
          <div className="lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Evolução do patrimônio</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <span className="w-3 h-1.5 bg-primary rounded inline-block"></span>Patrimônio
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <span className="w-3 h-1.5 bg-[#2461EA] rounded inline-block"></span>Investimentos
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={evolucaoData}>
                <defs>
                  <linearGradient id="gradPatrimonio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0F6E56" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F6E56" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="gradInvestimentos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2461EA" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#2461EA" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5E9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                {/* @ts-ignore */}
                <Tooltip formatter={(value) => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                <Area type="monotone" dataKey="patrimonio"    stroke="#0F6E56" strokeWidth={2} fill="url(#gradPatrimonio)"    dot={false} />
                <Area type="monotone" dataKey="investimentos" stroke="#2461EA" strokeWidth={2} fill="url(#gradInvestimentos)" dot={false} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Distribuição */}
          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <h2 className="text-sm font-bold text-text mb-4">Distribuição</h2>
            <div className="relative flex justify-center">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={distribuicaoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {distribuicaoData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* @ts-ignore */}
                  <Tooltip formatter={(value) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Valor central */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-base font-bold text-text font-mono">R$48k</p>
                <p className="text-[9px] text-muted font-semibold">total</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {distribuicaoData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 transition-opacity hover:opacity-70">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="text-xs text-text flex-1 font-medium">{item.name}</span>
                  <span className="text-xs text-muted font-mono">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSAÇÕES + TOP ATIVOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Transações recentes */}
          <div className="lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Transações recentes</h2>
              <button className="text-xs text-primary font-semibold hover:underline transition-opacity hover:opacity-70">
                Ver todas
              </button>
            </div>
            <div className="flex flex-col">
              {transacoes.map((tx, i) => (
                <div
                  key={tx.id}
                  className={`flex items-center gap-3 py-3 transition-colors hover:bg-bg rounded-lg px-2 -mx-2 ${
                    i < transacoes.length - 1 ? 'border-b border-border-main' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.bg}`}>
                    <tx.Icon className={`w-4 h-4 ${tx.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{tx.nome}</p>
                    <p className="text-[10px] text-muted">{tx.data} · {tx.categoria}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono flex-shrink-0 ${
                    tx.tipo === 'receita' ? 'text-primary' : 'text-red-500'
                  }`}>
                    {tx.tipo === 'receita' ? '+' : '-'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top ativos */}
          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Top ativos</h2>
              <Link href="/carteira" className="text-xs text-primary font-semibold hover:underline transition-opacity hover:opacity-70">
                Ver carteira
              </Link>
            </div>
            <div className="flex flex-col gap-1">
              {topAtivos.map((ativo, i) => (
                <div
                  key={ativo.ticker}
                  className={`flex items-center gap-2 py-2.5 px-2 -mx-2 rounded-lg transition-colors hover:bg-bg ${
                    i < topAtivos.length - 1 ? 'border-b border-border-main' : ''
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: ativo.color }}></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{ativo.nome}</p>
                    <p className="text-[10px] text-muted">{ativo.ticker}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold font-mono text-text">{ativo.valor}</p>
                    <p className={`text-[10px] font-bold font-mono ${ativo.positivo ? 'text-primary' : 'text-red-500'}`}>
                      {ativo.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}