'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useDemoData, Transacao } from '@/hooks/useDemoData'
import { exportTransacoesPDF } from '@/lib/pdf-export'
import { CATEGORIAS, CATEGORY_CONFIG, ASSET_COLORS } from '@/lib/demo-db'
import { useState, useMemo } from 'react'
import {
  Building2, ShoppingCart, Bitcoin, TrendingUp, Monitor, House,
  Car, Heart, Star, ArrowUp, ArrowDown, Search, SlidersHorizontal,
  FileDown, Plus, Trash2, X, Loader2,
} from 'lucide-react'

// ─── Icon mapping ─────────────────────────────────────────────────────────────

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
    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
  )
}

type FilterOption = 'Todos' | 'Receitas' | 'Despesas'
const ITENS_POR_PAGINA = 8

// ─── Modal: Nova Transação ────────────────────────────────────────────────────

type NovaTransacaoForm = {
  nome:      string
  valor:     string
  tipo:      'receita' | 'despesa'
  categoria: string
  data:      string
  status:    'concluido' | 'pendente'
}

function ModalNovaTransacao({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void
  onSave:  (tx: Omit<Transacao, 'id'>) => Promise<void>
  saving:  boolean
}) {
  const today = new Date().toLocaleDateString('pt-BR').replace(/\//g, '/')
  const [form, setForm] = useState<NovaTransacaoForm>({
    nome: '', valor: '', tipo: 'despesa', categoria: 'Alimentação',
    data: today, status: 'concluido',
  })

  const field = (k: keyof NovaTransacaoForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSave() {
    const valorNum = parseFloat(form.valor.replace(',', '.'))
    if (!form.nome.trim() || isNaN(valorNum) || valorNum <= 0) return
    const cfg = CATEGORY_CONFIG[form.categoria] ?? CATEGORY_CONFIG['Outros']
    await onSave({
      nome:      form.nome.trim(),
      valor:     form.tipo === 'despesa' ? -Math.abs(valorNum) : Math.abs(valorNum),
      tipo:      form.tipo,
      categoria: form.categoria,
      data:      form.data,
      status:    form.status,
      icon:      cfg.icon,
    })
    onClose()
  }

  const inputCls = 'w-full border border-border-main rounded-[8px] px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white'

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[16px] p-6 w-full max-w-md shadow-xl'>

        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-base font-bold text-text'>Nova Transação</h2>
          <button onClick={onClose} className='p-1 hover:bg-bg rounded-md transition-colors'>
            <X className='w-4 h-4 text-muted' />
          </button>
        </div>

        <div className='flex flex-col gap-3'>

          {/* Tipo */}
          <div className='flex gap-2'>
            {(['despesa', 'receita'] as const).map(t => (
              <button
                key={t}
                onClick={() => setForm(f => ({ ...f, tipo: t }))}
                className={`flex-1 py-2 rounded-[8px] text-sm font-semibold transition-all border ${
                  form.tipo === t
                    ? t === 'receita'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-red-500 text-white border-red-500'
                    : 'border-border-main text-muted hover:bg-bg'
                }`}
              >
                {t === 'receita' ? '+ Receita' : '− Despesa'}
              </button>
            ))}
          </div>

          {/* Nome */}
          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Descrição</label>
            <input className={inputCls} placeholder='Ex: Salário, Supermercado…'
              value={form.nome} onChange={field('nome')} />
          </div>

          {/* Valor */}
          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Valor (R$)</label>
            <input className={inputCls} placeholder='0,00' type='number' min='0' step='0.01'
              value={form.valor} onChange={field('valor')} />
          </div>

          {/* Categoria */}
          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Categoria</label>
            <select className={inputCls} value={form.categoria} onChange={field('categoria')}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Data</label>
            <input className={inputCls} type='text' placeholder='DD/MM/AAAA'
              value={form.data} onChange={field('data')} />
          </div>

          {/* Status */}
          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Status</label>
            <select className={inputCls} value={form.status} onChange={field('status')}>
              <option value='concluido'>Concluído</option>
              <option value='pendente'>Pendente</option>
            </select>
          </div>
        </div>

        <div className='flex gap-2 mt-5'>
          <Button variant='ghost' onClick={onClose} className='flex-1'>Cancelar</Button>
          <Button variant='primary' onClick={handleSave} disabled={saving} className='flex-1'>
            {saving ? <Loader2 className='w-4 h-4 animate-spin' /> : <Plus className='w-4 h-4' />}
            {saving ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Transacoes() {
  const { transacoes, loading, metrics, adicionarTransacao, removerTransacao } = useDemoData()

  const [filtro,     setFiltro]     = useState<FilterOption>('Todos')
  const [busca,      setBusca]      = useState('')
  const [categoria,  setCategoria]  = useState('Todas')
  const [pagina,     setPagina]     = useState(1)
  const [showModal,  setShowModal]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const dataHoje = new Date()
  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  const categorias = ['Todas', ...Array.from(new Set(transacoes.map(t => t.categoria)))]

  const transacoesFiltradas = useMemo(() => {
    return transacoes.filter(tx => {
      const matchTipo      = filtro === 'Todos' || (filtro === 'Receitas' ? tx.tipo === 'receita' : tx.tipo === 'despesa')
      const matchBusca     = tx.nome.toLowerCase().includes(busca.toLowerCase()) || tx.categoria.toLowerCase().includes(busca.toLowerCase())
      const matchCategoria = categoria === 'Todas' || tx.categoria === categoria
      return matchTipo && matchBusca && matchCategoria
    })
  }, [transacoes, filtro, busca, categoria])

  const totalPaginas  = Math.ceil(transacoesFiltradas.length / ITENS_POR_PAGINA)
  const transacoesPag = transacoesFiltradas.slice((pagina - 1) * ITENS_POR_PAGINA, pagina * ITENS_POR_PAGINA)

  async function handleSaveTransacao(tx: Omit<Transacao, 'id'>) {
    setSaving(true)
    await adicionarTransacao(tx)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await removerTransacao(id)
    setDeletingId(null)
  }

  function handleExportarPDF() {
    exportTransacoesPDF(transacoesFiltradas)
  }

  return (
    <div className='flex min-h-screen flex-col'>

      {/* HEADER */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0'>
        <div>
          <h1 className='text-base font-bold'>Transações</h1>
          <p className='text-xs text-muted'>{transacoesFiltradas.length} transações · {dataBR}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='semi' onClick={handleExportarPDF}>
            <FileDown className='w-4 h-4' />
            Exportar PDF
          </Button>
          <Button variant='primary' onClick={() => setShowModal(true)}>
            <Plus className='w-4 h-4' />
            Nova transação
          </Button>
          <Avatar />
        </div>
      </header>

      <main className='flex-grow bg-bg p-6'>

        {/* CARDS RESUMO */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          {[
            {
              label: 'Total Receitas', value: metrics.totalReceitas,
              color: 'bg-primary', textColor: 'text-primary',
              change: `Taxa de poupança: ${metrics.taxaPoupanca}`, Icon: ArrowUp,
            },
            {
              label: 'Total Despesas', value: metrics.totalDespesas,
              color: 'bg-red-500', textColor: 'text-red-500',
              change: metrics.maiorCategoria
                ? `Maior: ${metrics.maiorCategoria.nome}`
                : 'Sem despesas',
              Icon: ArrowDown,
            },
            {
              label: 'Saldo do mês', value: metrics.saldoMes,
              color: 'bg-blue-500', textColor: 'text-blue-500',
              change: metrics.saldoMes >= 0 ? 'Saldo positivo ✓' : 'Saldo negativo',
              Icon: metrics.saldoMes >= 0 ? ArrowUp : ArrowDown,
            },
          ].map(({ label, value, color, textColor, change, Icon }) => (
            <div key={label} className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>
              <div className={`h-1 ${color} rounded-t-[12px]`} />
              <div className='p-4'>
                <p className='text-xs text-muted font-semibold mb-1'>{label}</p>
                <p className='text-xl font-bold text-text font-mono'>
                  R${Math.abs(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <span className={`flex items-center gap-1 text-xs font-semibold mt-2 ${textColor}`}>
                  <Icon className='w-3 h-3' />{change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* FILTROS */}
        <div className='flex items-center gap-3 mb-4 flex-wrap'>

          <div className='flex items-center gap-2 bg-white border border-border-main rounded-[8px] px-3 py-2 flex-1 min-w-[180px]'>
            <Search className='w-3.5 h-3.5 text-muted flex-shrink-0' />
            <input
              type='text' value={busca}
              onChange={e => { setBusca(e.target.value); setPagina(1) }}
              placeholder='Buscar transações…'
              className='text-xs text-text placeholder:text-muted bg-transparent outline-none w-full'
            />
          </div>

          <div className='flex items-center gap-1 bg-white border border-border-main rounded-[8px] p-1'>
            {(['Todos', 'Receitas', 'Despesas'] as FilterOption[]).map(op => (
              <button key={op}
                onClick={() => { setFiltro(op); setPagina(1) }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  filtro === op ? 'bg-bg text-primary shadow-sm' : 'text-muted hover:text-text'
                }`}
              >
                {op}
              </button>
            ))}
          </div>

          <div className='flex items-center gap-2 bg-white border border-border-main rounded-[8px] px-3 py-2'>
            <SlidersHorizontal className='w-3.5 h-3.5 text-muted' />
            <select value={categoria}
              onChange={e => { setCategoria(e.target.value); setPagina(1) }}
              className='text-xs text-text bg-transparent outline-none cursor-pointer'
            >
              {categorias.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* TABELA */}
        <div className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>

          {/* Cabeçalho */}
          <div className='grid grid-cols-[1fr_120px_100px_80px_100px_40px] gap-2 px-4 py-3 border-b border-border-main bg-bg'>
            {['Descrição', 'Categoria', 'Data', 'Status', 'Valor', ''].map((h, i) => (
              <p key={i} className={`text-[10px] text-muted font-black uppercase tracking-wide ${i === 4 ? 'text-right' : ''}`}>{h}</p>
            ))}
          </div>

          {loading ? (
            <div className='flex items-center justify-center py-16 text-muted gap-2'>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span className='text-sm'>Carregando…</span>
            </div>
          ) : transacoesPag.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-16 text-muted'>
              <Search className='w-8 h-8 mb-3 opacity-40' />
              <p className='text-sm font-semibold'>Nenhuma transação encontrada</p>
              <p className='text-xs mt-1'>Tente ajustar os filtros</p>
            </div>
          ) : (
            transacoesPag.map((tx, i) => (
              <div key={tx.id}
                className={`grid grid-cols-[1fr_120px_100px_80px_100px_40px] gap-2 items-center px-4 py-3 transition-colors hover:bg-bg ${
                  i < transacoesPag.length - 1 ? 'border-b border-border-main' : ''
                }`}
              >
                <div className='flex items-center gap-3 min-w-0'>
                  <TxIcon icon={tx.icon} />
                  <p className='text-xs font-bold text-text truncate'>{tx.nome}</p>
                </div>
                <p className='text-xs text-muted truncate'>{tx.categoria}</p>
                <p className='text-xs text-muted'>{tx.data}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
                  tx.status === 'concluido' ? 'bg-primary-light text-primary' : 'bg-amber-50 text-amber-600'
                }`}>
                  {tx.status === 'concluido' ? 'Concluído' : 'Pendente'}
                </span>
                <p className={`text-xs font-bold font-mono text-right ${
                  tx.tipo === 'receita' ? 'text-primary' : 'text-red-500'
                }`}>
                  {tx.tipo === 'receita' ? '+' : '−'}R${Math.abs(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <button
                  onClick={() => handleDelete(tx.id)}
                  disabled={deletingId === tx.id}
                  className='w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40'
                >
                  {deletingId === tx.id
                    ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                    : <Trash2 className='w-3.5 h-3.5' />}
                </button>
              </div>
            ))
          )}

          {/* Paginação */}
          {!loading && totalPaginas > 1 && (
            <div className='flex items-center justify-between px-4 py-3 border-t border-border-main bg-bg'>
              <p className='text-xs text-muted'>
                Mostrando {Math.min((pagina - 1) * ITENS_POR_PAGINA + 1, transacoesFiltradas.length)}–{Math.min(pagina * ITENS_POR_PAGINA, transacoesFiltradas.length)} de {transacoesFiltradas.length}
              </p>
              <div className='flex items-center gap-1'>
                <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}
                  className='w-7 h-7 flex items-center justify-center rounded-md border border-border-main text-muted hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs'>
                  ‹
                </button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPagina(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-bold transition-all ${
                      pagina === p ? 'bg-primary text-white' : 'border border-border-main text-muted hover:bg-white'
                    }`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                  className='w-7 h-7 flex items-center justify-center rounded-md border border-border-main text-muted hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs'>
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <ModalNovaTransacao
          onClose={() => setShowModal(false)}
          onSave={handleSaveTransacao}
          saving={saving}
        />
      )}
    </div>
  )
}
