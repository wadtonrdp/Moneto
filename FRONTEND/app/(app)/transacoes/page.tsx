'use client'

import Avatar from "@/components/ui/Avatar"
import Button from "@/components/ui/Button"
import { useState, useMemo } from "react"
import {
  Building2, ShoppingCart, Bitcoin,
  TrendingUp, Monitor, Home, Car,
  ArrowUp, ArrowDown, Search, SlidersHorizontal
} from "lucide-react"

type FilterOption = 'Todos' | 'Receitas' | 'Despesas'

// ===== DADOS MOCK =====
const todasTransacoes = [
  { id: 1,  nome: 'Salário',        valor: 6400,   tipo: 'receita', data: '05/05/2026', categoria: 'Renda',        Icon: Building2,    bg: 'bg-primary-light', iconColor: 'text-primary',     status: 'concluido' },
  { id: 2,  nome: 'Supermercado',   valor: -312,   tipo: 'despesa', data: '12/05/2026', categoria: 'Alimentação',  Icon: ShoppingCart, bg: 'bg-orange-50',     iconColor: 'text-orange-500',  status: 'concluido' },
  { id: 3,  nome: 'Compra BTC',     valor: -500,   tipo: 'despesa', data: '28/04/2026', categoria: 'Cripto',       Icon: Bitcoin,      bg: 'bg-amber-50',      iconColor: 'text-amber-500',   status: 'pendente'  },
  { id: 4,  nome: 'Dividendos',     valor: 420,    tipo: 'receita', data: '01/05/2026', categoria: 'Investimentos',Icon: TrendingUp,   bg: 'bg-primary-light', iconColor: 'text-primary',     status: 'concluido' },
  { id: 5,  nome: 'Assinaturas',    valor: -89.90, tipo: 'despesa', data: '03/05/2026', categoria: 'Assinaturas',  Icon: Monitor,      bg: 'bg-blue-50',       iconColor: 'text-blue-500',    status: 'concluido' },
  { id: 6,  nome: 'Aluguel',        valor: -1200,  tipo: 'despesa', data: '01/05/2026', categoria: 'Moradia',      Icon: Home,         bg: 'bg-red-50',        iconColor: 'text-red-500',     status: 'concluido' },
  { id: 7,  nome: 'Uber',           valor: -45,    tipo: 'despesa', data: '08/05/2026', categoria: 'Transporte',   Icon: Car,          bg: 'bg-zinc-100',      iconColor: 'text-zinc-500',    status: 'concluido' },
  { id: 8,  nome: 'Freelance',      valor: 1800,   tipo: 'receita', data: '10/05/2026', categoria: 'Renda',        Icon: Building2,    bg: 'bg-primary-light', iconColor: 'text-primary',     status: 'concluido' },
  { id: 9,  nome: 'Farmácia',       valor: -78,    tipo: 'despesa', data: '14/05/2026', categoria: 'Saúde',        Icon: ShoppingCart, bg: 'bg-pink-50',       iconColor: 'text-pink-500',    status: 'concluido' },
  { id: 10, nome: 'Restaurante',    valor: -120,   tipo: 'despesa', data: '15/05/2026', categoria: 'Alimentação',  Icon: ShoppingCart, bg: 'bg-orange-50',     iconColor: 'text-orange-500',  status: 'concluido' },
  { id: 11, nome: 'Venda ETH',      valor: 950,    tipo: 'receita', data: '18/05/2026', categoria: 'Cripto',       Icon: Bitcoin,      bg: 'bg-amber-50',      iconColor: 'text-amber-500',   status: 'concluido' },
  { id: 12, nome: 'Internet',       valor: -99.90, tipo: 'despesa', data: '20/05/2026', categoria: 'Assinaturas',  Icon: Monitor,      bg: 'bg-blue-50',       iconColor: 'text-blue-500',    status: 'pendente'  },
]

const ITENS_POR_PAGINA = 8

export default function Transacoes() {
  const dataHoje = new Date()
  const [filtro, setFiltro]         = useState<FilterOption>('Todos')
  const [busca, setBusca]           = useState('')
  const [categoria, setCategoria]   = useState('Todas')
  const [pagina, setPagina]         = useState(1)

  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje)
    .replace(' de ', ' ')
    .replace(/^\w/, (c) => c.toUpperCase())

  // ===== FILTROS =====
  const categorias = ['Todas', ...Array.from(new Set(todasTransacoes.map(t => t.categoria)))]

  const transacoesFiltradas = useMemo(() => {
    return todasTransacoes.filter((tx) => {
      const matchTipo      = filtro === 'Todos' || (filtro === 'Receitas' ? tx.tipo === 'receita' : tx.tipo === 'despesa')
      const matchBusca     = tx.nome.toLowerCase().includes(busca.toLowerCase()) || tx.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoria === 'Todas' || tx.categoria === categoria
      return matchTipo && matchBusca && matchCategoria
    })
  }, [filtro, busca, categoria])

  const totalPaginas  = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA)
  const transacoesPag = transacoesFiltradas.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA)

  // ===== RESUMO =====
  const totalReceitas = todasTransacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
  const totalDespesas = todasTransacoes.filter(t => t.tipo === 'despesa').reduce((acc, t) => acc + Math.abs(t.valor), 0)
  const saldoMes      = totalReceitas - totalDespesas

  function handleExportar() {
    const linhas = [
      ['Descrição', 'Categoria', 'Data', 'Tipo', 'Status', 'Valor'],
      ...todasTransacoes.map(t => [
        t.nome, t.categoria, t.data, t.tipo, t.status,
        `R$${Math.abs(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      ])
    ]
    const csv     = linhas.map(l => l.join(',')).join('\n')
    const blob    = new Blob([csv], { type: 'text/csv' })
    const url     = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href        = url
    a.download    = 'transacoes-moneto.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex min-h-screen flex-col">

      {/* HEADER */}
      <header className="border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0">
        <div>
          <h1 className="text-base font-bold">Transações</h1>
          <p className="text-xs text-muted">{transacoesFiltradas.length} transações · {dataBR}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="semi" onClick={handleExportar}>Exportar CSV</Button>
          <Button variant="primary">+ Nova transação</Button>
          <Avatar />
        </div>
      </header>

      <main className="flex-grow bg-bg p-6">

        {/* CARDS RESUMO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden">
            <div className="h-1 bg-primary rounded-t-[12px]" />
            <div className="p-4">
              <p className="text-xs text-muted font-semibold mb-1">Total Receitas</p>
              <p className="text-xl font-bold text-text font-mono">
                R${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className="flex items-center gap-1 text-xs text-primary font-semibold mt-2">
                <ArrowUp className="w-3 h-3" />+12% vs anterior
              </span>
            </div>
          </div>
          <div className="bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden">
            <div className="h-1 bg-red-500 rounded-t-[12px]" />
            <div className="p-4">
              <p className="text-xs text-muted font-semibold mb-1">Total Despesas</p>
              <p className="text-xl font-bold text-text font-mono">
                R${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className="flex items-center gap-1 text-xs text-red-500 font-semibold mt-2">
                <ArrowUp className="w-3 h-3" />+8% vs anterior
              </span>
            </div>
          </div>
          <div className="bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden">
            <div className="h-1 bg-blue-500 rounded-t-[12px]" />
            <div className="p-4">
              <p className="text-xs text-muted font-semibold mb-1">Saldo do mês</p>
              <p className="text-xl font-bold text-text font-mono">
                R${saldoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className="flex items-center gap-1 text-xs text-blue-500 font-semibold mt-2">
                <ArrowUp className="w-3 h-3" />+18% vs anterior
              </span>
            </div>
          </div>
        </div>

        {/* FILTROS */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">

          {/* Busca */}
          <div className="flex items-center gap-2 bg-white border border-border-main rounded-[8px] px-3 py-2 flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-muted flex-shrink-0" />
            <input
              type="text"
              value={busca}
              onChange={(e) => { setBusca(e.target.value); setPagina(1) }}
              placeholder="Buscar transações..."
              className="text-xs text-text placeholder:text-muted bg-transparent outline-none w-full"
            />
          </div>

          {/* Tipo */}
          <div className="flex items-center gap-1 bg-white border border-border-main rounded-[8px] p-1">
            {(['Todos', 'Receitas', 'Despesas'] as FilterOption[]).map((op) => (
              <button
                key={op}
                onClick={() => { setFiltro(op); setPagina(1) }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filtro === op ? 'bg-bg text-primary shadow-sm' : 'text-muted hover:text-text'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          {/* Categoria */}
          <div className="flex items-center gap-2 bg-white border border-border-main rounded-[8px] px-3 py-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-muted" />
            <select
              value={categoria}
              onChange={(e) => { setCategoria(e.target.value); setPagina(1) }}
              className="text-xs text-text bg-transparent outline-none cursor-pointer"
            >
              {categorias.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden">

          {/* Cabeçalho */}
          <div className="grid grid-cols-[1fr_120px_100px_80px_100px] gap-2 px-4 py-3 border-b border-border-main bg-bg">
            <p className="text-[10px] text-muted font-black uppercase tracking-wide">Descrição</p>
            <p className="text-[10px] text-muted font-black uppercase tracking-wide">Categoria</p>
            <p className="text-[10px] text-muted font-black uppercase tracking-wide">Data</p>
            <p className="text-[10px] text-muted font-black uppercase tracking-wide">Status</p>
            <p className="text-[10px] text-muted font-black uppercase tracking-wide text-right">Valor</p>
          </div>

          {/* Linhas */}
          {transacoesPag.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <Search className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm font-semibold">Nenhuma transação encontrada</p>
              <p className="text-xs mt-1">Tente ajustar os filtros</p>
            </div>
          ) : (
            transacoesPag.map((tx, i) => (
              <div
                key={tx.id}
                className={`grid grid-cols-[1fr_120px_100px_80px_100px] gap-2 items-center px-4 py-3 transition-colors hover:bg-bg ${
                  i < transacoesPag.length - 1 ? 'border-b border-border-main' : ''
                }`}
              >
                {/* Descrição */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${tx.bg}`}>
                    <tx.Icon className={`w-4 h-4 ${tx.iconColor}`} />
                  </div>
                  <p className="text-xs font-bold text-text truncate">{tx.nome}</p>
                </div>

                {/* Categoria */}
                <p className="text-xs text-muted truncate">{tx.categoria}</p>

                {/* Data */}
                <p className="text-xs text-muted">{tx.data}</p>

                {/* Status */}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                  tx.status === 'concluido'
                    ? 'bg-primary-light text-primary'
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {tx.status === 'concluido' ? 'Concluído' : 'Pendente'}
                </span>

                {/* Valor */}
                <p className={`text-xs font-bold font-mono text-right ${
                  tx.tipo === 'receita' ? 'text-primary' : 'text-red-500'
                }`}>
                  {tx.tipo === 'receita' ? '+' : '-'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            ))
          )}

          {/* Paginação */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border-main bg-bg">
            <p className="text-xs text-muted">
              Mostrando {Math.min((pagina - 1) * ITENS_POR_PAGINA + 1, transacoesFiltradas.length)}–{Math.min(pagina * ITENS_POR_PAGINA, transacoesFiltradas.length)} de {transacoesFiltradas.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-main text-muted hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                ‹
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPagina(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                    pagina === p
                      ? 'bg-primary text-white'
                      : 'border border-border-main text-muted hover:bg-white'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-border-main text-muted hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
              >
                ›
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  )
}