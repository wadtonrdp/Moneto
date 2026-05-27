'use client'

import Avatar from "@/components/ui/Avatar"
import { useState } from "react"
import { PiggyBank, TrendingDown, TrendingUp, ArrowUp } from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts'

type PeriodOption = 'Jan-Mar' | 'Abr-Jun' | 'Jul-Set' | 'Ano todo'

// ===== DADOS MOCK =====
const dadosPorPeriodo = {
  'Jan-Mar': {
    mensal: [
      { mes: 'Jan', receita: 5800, despesa: 2900 },
      { mes: 'Fev', receita: 6100, despesa: 3100 },
      { mes: 'Mar', receita: 5900, despesa: 2800 },
    ],
    poupado:      4100,
    maiorGasto:   980,
    maiorGastoCat:'Alimentação',
    rendimento:   480,
    rendPct:      '2,1%',
    taxaPoupanca: '46,2%',
    categorias: [
      { nome: 'Alimentação', valor: 980,  pct: 36, color: '#F0C14B' },
      { nome: 'Moradia',     valor: 1200, pct: 44, color: '#2461EA' },
      { nome: 'Transporte',  valor: 320,  pct: 12, color: '#D85A30' },
      { nome: 'Saúde',       valor: 180,  pct: 7,  color: '#0F6E56' },
      { nome: 'Outros',      valor: 220,  pct: 8,  color: '#9EA1A9' },
    ],
  },
  'Abr-Jun': {
    mensal: [
      { mes: 'Abr', receita: 6200, despesa: 3050 },
      { mes: 'Mai', receita: 6400, despesa: 3180 },
      { mes: 'Jun', receita: 6100, despesa: 2950 },
    ],
    poupado:      3220,
    maiorGasto:   1240,
    maiorGastoCat:'Alimentação',
    rendimento:   620,
    rendPct:      '2,8%',
    taxaPoupanca: '50,3%',
    categorias: [
      { nome: 'Alimentação', valor: 1240, pct: 39, color: '#F0C14B' },
      { nome: 'Assinaturas', valor: 680,  pct: 21, color: '#2461EA' },
      { nome: 'Transporte',  valor: 580,  pct: 18, color: '#D85A30' },
      { nome: 'Saúde',       valor: 340,  pct: 11, color: '#0F6E56' },
      { nome: 'Outros',      valor: 340,  pct: 11, color: '#9EA1A9' },
    ],
  },
  'Jul-Set': {
    mensal: [
      { mes: 'Jul', receita: 6300, despesa: 2800 },
      { mes: 'Ago', receita: 6500, despesa: 3200 },
      { mes: 'Set', receita: 6200, despesa: 3000 },
    ],
    poupado:      3800,
    maiorGasto:   1100,
    maiorGastoCat:'Moradia',
    rendimento:   710,
    rendPct:      '3,2%',
    taxaPoupanca: '52,1%',
    categorias: [
      { nome: 'Moradia',     valor: 1100, pct: 38, color: '#2461EA' },
      { nome: 'Alimentação', valor: 980,  pct: 34, color: '#F0C14B' },
      { nome: 'Transporte',  valor: 420,  pct: 15, color: '#D85A30' },
      { nome: 'Saúde',       valor: 220,  pct: 8,  color: '#0F6E56' },
      { nome: 'Outros',      valor: 180,  pct: 6,  color: '#9EA1A9' },
    ],
  },
  'Ano todo': {
    mensal: [
      { mes: 'Jan', receita: 5800, despesa: 2900 },
      { mes: 'Fev', receita: 6100, despesa: 3100 },
      { mes: 'Mar', receita: 5900, despesa: 2800 },
      { mes: 'Abr', receita: 6200, despesa: 3050 },
      { mes: 'Mai', receita: 6400, despesa: 3180 },
      { mes: 'Jun', receita: 6100, despesa: 2950 },
    ],
    poupado:      14200,
    maiorGasto:   1240,
    maiorGastoCat:'Alimentação',
    rendimento:   1980,
    rendPct:      '8,8%',
    taxaPoupanca: '49,8%',
    categorias: [
      { nome: 'Alimentação', valor: 4820, pct: 38, color: '#F0C14B' },
      { nome: 'Moradia',     valor: 3600, pct: 28, color: '#2461EA' },
      { nome: 'Transporte',  valor: 1920, pct: 15, color: '#D85A30' },
      { nome: 'Assinaturas', valor: 1280, pct: 10, color: '#0F6E56' },
      { nome: 'Outros',      valor: 1180, pct: 9,  color: '#9EA1A9' },
    ],
  },
}

export default function Relatorios() {
  const dataHoje = new Date()
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('Abr-Jun')

  const options: { value: PeriodOption; label: string }[] = [
    { value: 'Jan-Mar',  label: 'Jan–Mar'  },
    { value: 'Abr-Jun',  label: 'Abr–Jun'  },
    { value: 'Jul-Set',  label: 'Jul–Set'  },
    { value: 'Ano todo', label: 'Ano todo' },
  ]

  const dados = dadosPorPeriodo[selectedPeriod]

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje)
    .replace(' de ', ' ')
    .replace(/^\w/, (c) => c.toUpperCase())

  const maxCategoria = Math.max(...dados.categorias.map(c => c.valor))

  return (
    <div className="flex min-h-screen flex-col">

      {/* HEADER */}
      <header className="border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-base font-bold">Relatórios</h1>
          <p className="text-xs text-muted">Análise financeira · {dataBR}</p>
        </div>
        <div className="flex items-center gap-3">
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
          <Avatar />
        </div>
      </header>

      <main className="flex-1 bg-bg p-6">

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] bg-primary-light flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted font-semibold">Total Poupado</p>
            </div>
            <h2 className="text-2xl font-bold text-text font-mono mb-1">
              R${dados.poupado.toLocaleString('pt-BR')}
            </h2>
            <span className="flex items-center gap-1 text-xs text-primary font-semibold">
              <ArrowUp className="w-3 h-3" />
              Taxa de {dados.taxaPoupanca} da renda
            </span>
          </div>

          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] bg-red-50 flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-xs text-muted font-semibold">Maior Gasto</p>
            </div>
            <h2 className="text-2xl font-bold text-text font-mono mb-1">
              R${dados.maiorGasto.toLocaleString('pt-BR')}
            </h2>
            <p className="text-xs text-muted font-semibold">
              {dados.maiorGastoCat} este mês
            </p>
          </div>

          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-default">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] bg-primary-light flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted font-semibold">Rendimento Invest.</p>
            </div>
            <h2 className="text-2xl font-bold text-text font-mono mb-1">
              R${dados.rendimento.toLocaleString('pt-BR')}
            </h2>
            <span className="flex items-center gap-1 text-xs text-primary font-semibold">
              <ArrowUp className="w-3 h-3" />
              +{dados.rendPct} no período
            </span>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Receita vs Despesas — 2/3 */}
          <div className="lg:col-span-2 bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Receita vs Despesas — Mensal</h2>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <span className="w-3 h-1.5 bg-primary rounded inline-block"></span>Receita
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <span className="w-3 h-1.5 bg-red-400 rounded inline-block"></span>Despesas
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dados.mensal} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5E9" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6A6D77' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(1)}k`} />
                {/* @ts-ignore */}
                <Tooltip formatter={(value) => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                <Bar dataKey="receita" fill="#0F6E56" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="despesa" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gastos por categoria — 1/3 */}
          <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
            <h2 className="text-sm font-bold text-text mb-4">Gastos por categoria</h2>
            <div className="relative flex justify-center">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={dados.categorias}
                    cx="50%" cy="50%"
                    innerRadius={40} outerRadius={60}
                    dataKey="valor" strokeWidth={0}
                  >
                    {dados.categorias.map((entry) => (
                      <Cell key={entry.nome} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* @ts-ignore */}
                  <Tooltip formatter={(value) => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              {dados.categorias.map((item) => (
                <div key={item.nome} className="flex items-center gap-2 transition-opacity hover:opacity-70">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="text-xs text-text flex-1 font-medium">{item.nome}</span>
                  <span className="text-xs font-mono text-muted">{item.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GASTOS DETALHADOS */}
        <div className="bg-white p-4 rounded-[12px] border border-border-main shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-text">Gastos por categoria (detalhado)</h2>
            <span className="text-xs text-muted font-semibold">{selectedPeriod}</span>
          </div>
          <div className="flex flex-col gap-4">
            {dados.categorias.map((cat) => (
              <div key={cat.nome}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: cat.color }}></span>
                    <span className="text-xs font-semibold text-text">{cat.nome}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-muted">{cat.pct}%</span>
                    <span className="text-xs font-bold font-mono text-text w-20 text-right">
                      R${cat.valor.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(cat.valor / maxCategoria) * 100}%`,
                      background: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}