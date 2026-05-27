'use client'

import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"
import {
  PieChart, Pie, Cell, Tooltip,
  ResponsiveContainer, LineChart, Line
} from 'recharts'

// ===== DADOS MOCK =====
const ativos = [
  {
    nome: 'Bitcoin',       ticker: 'BTC',   tipo: 'Cripto',       valor: 9000,  change: 3.1,  positivo: true,  color: '#F0C14B',
    sparkline: [8200, 8600, 8100, 8900, 8700, 8800, 9000],
  },
  {
    nome: 'Ethereum',      ticker: 'ETH',   tipo: 'Cripto',       valor: 4200,  change: 1.8,  positivo: true,  color: '#627EEA',
    sparkline: [3900, 4000, 3800, 4100, 4050, 4150, 4200],
  },
  {
    nome: 'MXRF11',        ticker: 'FII',   tipo: 'Fundo Imob.',  valor: 3800,  change: 0.5,  positivo: true,  color: '#0F6E56',
    sparkline: [3700, 3720, 3710, 3730, 3750, 3780, 3800],
  },
  {
    nome: 'Petrobras PN',  ticker: 'PETR4', tipo: 'Ação',         valor: 2900,  change: -1.2, positivo: false, color: '#2461EA',
    sparkline: [3100, 3050, 2980, 2900, 2950, 2920, 2900],
  },
  {
    nome: 'Tesouro Selic', ticker: 'RF',    tipo: 'Renda Fixa',   valor: 2600,  change: 0.8,  positivo: true,  color: '#9EA1A9',
    sparkline: [2400, 2430, 2450, 2470, 2500, 2560, 2600],
  },
]

const totalPatrimonio = ativos.reduce((acc, a) => acc + a.valor, 0)

const maiorAlta  = [...ativos].sort((a, b) => b.change - a.change)[0]
const maiorBaixa = [...ativos].sort((a, b) => a.change - b.change)[0]

const alocacaoData = ativos.map((a) => ({
  name:  a.ticker,
  value: Math.round((a.valor / totalPatrimonio) * 100),
  color: a.color,
}))

// ===== SPARKLINE =====
function Sparkline({ data, positivo }: { data: number[], positivo: boolean }) {
  return (
    <ResponsiveContainer width={80} height={36}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line
          type="monotone" dataKey="v"
          stroke={positivo ? '#0F6E56' : '#EF4444'}
          strokeWidth={1.5} dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default function Carteira() {
  const dataHoje = new Date()

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje)
    .replace(' de ', ' ')
    .replace(/^\w/, (c) => c.toUpperCase())

  return (
    <div className="flex min-h-screen flex-col">

      {/* HEADER */}
      <header className="border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-base font-bold">Carteira</h1>
          <p className="text-xs text-muted">
            {ativos.length} ativos · {dataBR}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary">+ Adicionar ativo</Button>
          <Avatar />
        </div>
      </header>

      <main className="flex-grow bg-bg p-6">

        {/* HERO CARD */}
        <div className="bg-primary rounded-[12px] p-5 mb-6 flex items-center justify-between shadow-md">
          <div>
            <p className="text-white/70 text-xs font-semibold mb-1">Portfólio total</p>
            <h2 className="text-white text-3xl font-bold font-mono tracking-tight">
              R${totalPatrimonio.toLocaleString('pt-BR')}
            </h2>
            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold mt-2">
              <ArrowUp className="w-3 h-3" />
              +R$620,00 hoje (2,8%)
            </span>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide mb-1">Maior alta</p>
              <p className="text-white text-sm font-bold">{maiorAlta.ticker}</p>
              <p className="text-white/80 text-xs font-mono">+{maiorAlta.change}%</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wide mb-1">Maior baixa</p>
              <p className="text-white text-sm font-bold">{maiorBaixa.ticker}</p>
              <p className="text-white/80 text-xs font-mono">{maiorBaixa.change}%</p>
            </div>
          </div>
        </div>

        {/* LISTA + GRÁFICO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Lista de ativos — 2/3 */}
          <div className="lg:col-span-2 bg-white rounded-[12px] border border-border-main shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text">Meus ativos</h2>
              <span className="text-[10px] text-muted font-semibold">{ativos.length} ativos</span>
            </div>

            {/* Cabeçalho da tabela */}
            <div className="grid grid-cols-[1fr_80px_80px_80px] gap-2 px-2 mb-2">
              <p className="text-[10px] text-muted font-black uppercase tracking-wide">Ativo</p>
              <p className="text-[10px] text-muted font-black uppercase tracking-wide text-center">7 dias</p>
              <p className="text-[10px] text-muted font-black uppercase tracking-wide text-right">Variação</p>
              <p className="text-[10px] text-muted font-black uppercase tracking-wide text-right">Valor</p>
            </div>

            {/* Linhas */}
            <div className="flex flex-col">
              {ativos.map((ativo, i) => (
                <div
                  key={ativo.ticker}
                  className={`grid grid-cols-[1fr_80px_80px_80px] gap-2 items-center px-2 py-3 rounded-lg transition-colors hover:bg-bg cursor-pointer ${
                    i < ativos.length - 1 ? 'border-b border-border-main' : ''
                  }`}
                >
                  {/* Nome e ticker */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{ background: ativo.color + '22', color: ativo.color }}
                    >
                      {ativo.ticker.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text truncate">{ativo.nome}</p>
                      <p className="text-[10px] text-muted">{ativo.tipo}</p>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="flex justify-center">
                    <Sparkline data={ativo.sparkline} positivo={ativo.positivo} />
                  </div>

                  {/* Variação */}
                  <div className="flex items-center justify-end gap-1">
                    {ativo.positivo
                      ? <TrendingUp className="w-3 h-3 text-primary flex-shrink-0" />
                      : <TrendingDown className="w-3 h-3 text-red-500 flex-shrink-0" />
                    }
                    <span className={`text-xs font-bold font-mono ${ativo.positivo ? 'text-primary' : 'text-red-500'}`}>
                      {ativo.positivo ? '+' : ''}{ativo.change}%
                    </span>
                  </div>

                  {/* Valor */}
                  <p className="text-xs font-bold font-mono text-text text-right">
                    R${ativo.valor.toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Alocação — 1/3 */}
          <div className="bg-white rounded-[12px] border border-border-main shadow-sm p-4">
            <h2 className="text-sm font-bold text-text mb-4">Alocação</h2>

            {/* Donut com valor central */}
            <div className="relative flex justify-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={alocacaoData}
                    cx="50%" cy="50%"
                    innerRadius={48} outerRadius={68}
                    dataKey="value" strokeWidth={0}
                  >
                    {alocacaoData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* @ts-ignore */}
                  <Tooltip formatter={(value) => [`${value}%`]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-base font-bold text-text font-mono">
                  R${(totalPatrimonio / 1000).toFixed(1)}k
                </p>
                <p className="text-[9px] text-muted font-semibold">portfólio</p>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex flex-col gap-2.5 mt-4">
              {alocacaoData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 transition-opacity hover:opacity-70">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: item.color }}></span>
                  <span className="text-xs text-text flex-1 font-medium">
                    {ativos.find(a => a.ticker === item.name)?.nome}
                  </span>
                  <span className="text-xs font-mono text-muted">{item.value}%</span>
                  <span className="text-xs font-mono font-bold text-text">
                    R${ativos.find(a => a.ticker === item.name)?.valor.toLocaleString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}