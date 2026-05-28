'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useDemoData, Ativo } from '@/hooks/useDemoData'
import { ASSET_COLORS } from '@/lib/demo-db'
import { useState } from 'react'
import { ArrowUp, TrendingUp, TrendingDown, Plus, Trash2, X, Loader2 } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ data, positivo }: { data: number[]; positivo: boolean }) {
  return (
    <ResponsiveContainer width={80} height={36}>
      <LineChart data={data.map((v, i) => ({ i, v }))}>
        <Line type='monotone' dataKey='v'
          stroke={positivo ? '#0F6E56' : '#EF4444'}
          strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Modal: Novo Ativo ────────────────────────────────────────────────────────

type NovoAtivoForm = {
  nome:   string
  ticker: string
  tipo:   string
  valor:  string
  color:  string
}

const TIPOS_ATIVO = ['Cripto', 'Ação', 'Fundo Imob.', 'Renda Fixa', 'ETF', 'Outro']

function ModalNovoAtivo({
  onClose,
  onSave,
  saving,
}: {
  onClose: () => void
  onSave:  (a: Omit<Ativo, 'id'>) => Promise<void>
  saving:  boolean
}) {
  const [form, setForm] = useState<NovoAtivoForm>({
    nome: '', ticker: '', tipo: 'Ação', valor: '', color: ASSET_COLORS[0],
  })

  const field = (k: keyof NovoAtivoForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSave() {
    const valorNum = parseFloat(form.valor.replace(',', '.'))
    if (!form.nome.trim() || !form.ticker.trim() || isNaN(valorNum) || valorNum <= 0) return
    await onSave({
      nome:   form.nome.trim(),
      ticker: form.ticker.trim().toUpperCase(),
      tipo:   form.tipo,
      valor:  valorNum,
      color:  form.color,
    })
    onClose()
  }

  const inputCls = 'w-full border border-border-main rounded-[8px] px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white'

  return (
    <div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-[16px] p-6 w-full max-w-md shadow-xl'>

        <div className='flex items-center justify-between mb-5'>
          <h2 className='text-base font-bold text-text'>Novo Ativo</h2>
          <button onClick={onClose} className='p-1 hover:bg-bg rounded-md transition-colors'>
            <X className='w-4 h-4 text-muted' />
          </button>
        </div>

        <div className='flex flex-col gap-3'>

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs font-semibold text-muted mb-1 block'>Nome</label>
              <input className={inputCls} placeholder='Ex: Bitcoin'
                value={form.nome} onChange={field('nome')} />
            </div>
            <div>
              <label className='text-xs font-semibold text-muted mb-1 block'>Ticker</label>
              <input className={inputCls} placeholder='Ex: BTC'
                value={form.ticker} onChange={field('ticker')} />
            </div>
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Tipo</label>
            <select className={inputCls} value={form.tipo} onChange={field('tipo')}>
              {TIPOS_ATIVO.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Valor (R$)</label>
            <input className={inputCls} type='number' min='0' step='0.01' placeholder='0,00'
              value={form.valor} onChange={field('valor')} />
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Cor</label>
            <div className='flex gap-2 flex-wrap'>
              {ASSET_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{ background: c }}
                  className={`w-7 h-7 rounded-full transition-all ${
                    form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'
                  }`}
                />
              ))}
            </div>
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

export default function Carteira() {
  const { ativos, loading, metrics, adicionarAtivo, removerAtivo } = useDemoData()
  const [showModal,  setShowModal]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const dataHoje = new Date()
  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  const totalPatrimonio = metrics.totalPatrimonio

  const alocacaoData = ativos.map(a => ({
    name:  a.ticker,
    value: totalPatrimonio > 0 ? Math.round((a.valor / totalPatrimonio) * 100) : 0,
    color: a.color,
  }))

  // Fake sparkline generator (relative variation per ativo)
  function sparkline(ativo: Ativo): number[] {
    const base = ativo.valor
    return Array.from({ length: 7 }, (_, i) => {
      const noise = ((ativo.valor * 0.03) * Math.sin(i * 1.3 + ativo.ticker.charCodeAt(0))) 
      return Math.round(base * (0.95 + i * 0.008) + noise)
    })
  }

  async function handleSaveAtivo(a: Omit<Ativo, 'id'>) {
    setSaving(true)
    await adicionarAtivo(a)
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    await removerAtivo(id)
    setDeletingId(null)
  }

  return (
    <div className='flex min-h-screen flex-col'>

      {/* HEADER */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0'>
        <div>
          <h1 className='text-base font-bold'>Carteira</h1>
          <p className='text-xs text-muted'>{ativos.length} ativos · {dataBR}</p>
        </div>
        <div className='flex items-center gap-3'>
          <Button variant='primary' onClick={() => setShowModal(true)}>
            <Plus className='w-4 h-4' />
            Adicionar ativo
          </Button>
          <Avatar />
        </div>
      </header>

      <main className='flex-grow bg-bg p-6'>

        {loading ? (
          <div className='flex items-center justify-center h-64 text-muted gap-2'>
            <Loader2 className='w-6 h-6 animate-spin text-primary' />
            <span className='text-sm font-medium'>Carregando…</span>
          </div>
        ) : (
          <>

            {/* HERO CARD */}
            <div className='bg-primary rounded-[12px] p-5 mb-6 flex items-center justify-between shadow-md'>
              <div>
                <p className='text-white/70 text-xs font-semibold mb-1'>Portfólio total</p>
                <h2 className='text-white text-3xl font-bold font-mono tracking-tight'>
                  R${totalPatrimonio.toLocaleString('pt-BR')}
                </h2>
                <span className='flex items-center gap-1 text-white/80 text-xs font-semibold mt-2'>
                  <ArrowUp className='w-3 h-3' />
                  {ativos.length} ativos em carteira
                </span>
              </div>
              {ativos.length > 0 && (
                <div className='flex gap-8'>
                  <div className='text-right'>
                    <p className='text-white/60 text-[10px] font-semibold uppercase tracking-wide mb-1'>Maior ativo</p>
                    <p className='text-white text-sm font-bold'>
                      {[...ativos].sort((a, b) => b.valor - a.valor)[0]?.ticker}
                    </p>
                    <p className='text-white/80 text-xs font-mono'>
                      {totalPatrimonio > 0
                        ? `${Math.round(([...ativos].sort((a, b) => b.valor - a.valor)[0]?.valor / totalPatrimonio) * 100)}%`
                        : '—'}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='text-white/60 text-[10px] font-semibold uppercase tracking-wide mb-1'>Tipos</p>
                    <p className='text-white text-sm font-bold'>
                      {new Set(ativos.map(a => a.tipo)).size}
                    </p>
                    <p className='text-white/80 text-xs font-mono'>categorias</p>
                  </div>
                </div>
              )}
            </div>

            {/* LISTA + GRÁFICO */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

              {/* Lista de ativos */}
              <div className='lg:col-span-2 bg-white rounded-[12px] border border-border-main shadow-sm p-4'>
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-sm font-bold text-text'>Meus ativos</h2>
                  <span className='text-[10px] text-muted font-semibold'>{ativos.length} ativos</span>
                </div>

                {ativos.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-12 text-muted'>
                    <p className='text-sm font-semibold'>Sem ativos cadastrados</p>
                    <p className='text-xs mt-1'>Clique em "Adicionar ativo" para começar</p>
                  </div>
                ) : (
                  <>
                    <div className='grid grid-cols-[1fr_80px_80px_80px_40px] gap-2 px-2 mb-2'>
                      {['Ativo', '7 dias', 'Alocação', 'Valor', ''].map((h, i) => (
                        <p key={i} className={`text-[10px] text-muted font-black uppercase tracking-wide ${i === 3 ? 'text-right' : i === 2 ? 'text-right' : ''}`}>{h}</p>
                      ))}
                    </div>

                    <div className='flex flex-col'>
                      {ativos.map((ativo, i) => {
                        const pct = totalPatrimonio > 0
                          ? Math.round((ativo.valor / totalPatrimonio) * 100)
                          : 0
                        const spark = sparkline(ativo)
                        const positivo = spark[spark.length - 1] >= spark[0]

                        return (
                          <div key={ativo.id}
                            className={`grid grid-cols-[1fr_80px_80px_80px_40px] gap-2 items-center px-2 py-3 rounded-lg transition-colors hover:bg-bg ${
                              i < ativos.length - 1 ? 'border-b border-border-main' : ''
                            }`}>

                            <div className='flex items-center gap-3 min-w-0'>
                              <span className='w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-black flex-shrink-0'
                                style={{ background: ativo.color + '22', color: ativo.color }}>
                                {ativo.ticker.slice(0, 2)}
                              </span>
                              <div className='min-w-0'>
                                <p className='text-xs font-bold text-text truncate'>{ativo.nome}</p>
                                <p className='text-[10px] text-muted'>{ativo.tipo}</p>
                              </div>
                            </div>

                            <div className='flex justify-center'>
                              <Sparkline data={spark} positivo={positivo} />
                            </div>

                            <div className='flex items-center justify-end gap-1'>
                              {positivo
                                ? <TrendingUp className='w-3 h-3 text-primary flex-shrink-0' />
                                : <TrendingDown className='w-3 h-3 text-red-500 flex-shrink-0' />}
                              <span className={`text-xs font-bold font-mono ${positivo ? 'text-primary' : 'text-red-500'}`}>
                                {pct}%
                              </span>
                            </div>

                            <p className='text-xs font-bold font-mono text-text text-right'>
                              R${ativo.valor.toLocaleString('pt-BR')}
                            </p>

                            <button onClick={() => handleDelete(ativo.id)}
                              disabled={deletingId === ativo.id}
                              className='w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40'>
                              {deletingId === ativo.id
                                ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                : <Trash2 className='w-3.5 h-3.5' />}
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Alocação */}
              <div className='bg-white rounded-[12px] border border-border-main shadow-sm p-4'>
                <h2 className='text-sm font-bold text-text mb-4'>Alocação</h2>

                {ativos.length === 0 ? (
                  <div className='flex items-center justify-center h-[200px] text-muted text-sm'>
                    Sem ativos
                  </div>
                ) : (
                  <>
                    <div className='relative flex justify-center'>
                      <ResponsiveContainer width='100%' height={160}>
                        <PieChart>
                          <Pie data={alocacaoData} cx='50%' cy='50%'
                            innerRadius={48} outerRadius={68} dataKey='value' strokeWidth={0}>
                            {alocacaoData.map(entry => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          {/* @ts-ignore */}
                          <Tooltip formatter={value => [`${value}%`]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className='absolute inset-0 flex flex-col items-center justify-center pointer-events-none'>
                        <p className='text-base font-bold text-text font-mono'>
                          R${(totalPatrimonio / 1000).toFixed(1)}k
                        </p>
                        <p className='text-[9px] text-muted font-semibold'>portfólio</p>
                      </div>
                    </div>

                    <div className='flex flex-col gap-2.5 mt-4'>
                      {alocacaoData.map(item => (
                        <div key={item.name} className='flex items-center gap-2 transition-opacity hover:opacity-70'>
                          <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: item.color }} />
                          <span className='text-xs text-text flex-1 font-medium'>
                            {ativos.find(a => a.ticker === item.name)?.nome}
                          </span>
                          <span className='text-xs font-mono text-muted'>{item.value}%</span>
                          <span className='text-xs font-mono font-bold text-text'>
                            R${ativos.find(a => a.ticker === item.name)?.valor.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            </div>
          </>
        )}
      </main>

      {showModal && (
        <ModalNovoAtivo
          onClose={() => setShowModal(false)}
          onSave={handleSaveAtivo}
          saving={saving}
        />
      )}
    </div>
  )
}
