'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { useDemoData, Ativo } from '@/hooks/useDemoData'
import { useLivePrices, isCrypto, fmtBRL, fmtChange, timeAgo, COINGECKO_IDS } from '@/hooks/useLivePrices'
import { ASSET_COLORS } from '@/lib/demo-db'
import { useState, useEffect } from 'react'
import {
  ArrowUp, TrendingUp, TrendingDown, Plus, Trash2, X,
  Loader2, Zap, RefreshCw, AlertCircle, DollarSign,
} from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const TIPOS_ATIVO = ['Cripto', 'Ação', 'Fundo Imob.', 'Renda Fixa', 'ETF', 'Outro']

// ─── Modal: Novo Ativo ────────────────────────────────────────────────────────

type NovoAtivoForm = { nome: string; ticker: string; tipo: string; valor: string; color: string }

function ModalNovoAtivo({ onClose, onSave, saving }: {
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
    const v = parseFloat(form.valor.replace(',', '.'))
    if (!form.nome.trim() || !form.ticker.trim() || isNaN(v) || v <= 0) return
    await onSave({ nome: form.nome.trim(), ticker: form.ticker.trim().toUpperCase(), tipo: form.tipo, valor: v, color: form.color })
    onClose()
  }

  const detected = isCrypto(form.ticker.toUpperCase())
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
              <input className={inputCls} placeholder='Ex: Bitcoin' value={form.nome} onChange={field('nome')} />
            </div>
            <div>
              <label className='text-xs font-semibold text-muted mb-1 block'>Ticker</label>
              <input className={inputCls} placeholder='Ex: BTC' value={form.ticker} onChange={field('ticker')} />
              {form.ticker && (
                <p className={`text-[10px] mt-1 font-semibold ${detected ? 'text-primary' : 'text-muted'}`}>
                  {detected ? `⚡ Preço ao vivo via CoinGecko` : 'Sem preço ao vivo para este ticker'}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Tipo</label>
            <select className={inputCls} value={form.tipo} onChange={field('tipo')}>
              {TIPOS_ATIVO.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Valor na carteira (R$)</label>
            <input className={inputCls} type='number' min='0' step='0.01' placeholder='0,00'
              value={form.valor} onChange={field('valor')} />
          </div>

          <div>
            <label className='text-xs font-semibold text-muted mb-1 block'>Cor</label>
            <div className='flex gap-2 flex-wrap'>
              {ASSET_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  style={{ background: c }}
                  className={`w-7 h-7 rounded-full transition-all ${form.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}`} />
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
  const { ativos, loading: dbLoading, metrics, adicionarAtivo, removerAtivo } = useDemoData()
  const tickers = ativos.map(a => a.ticker)
  const { prices, cambio, loading: priceLoading, lastUpdated, error: priceError, refresh } = useLivePrices(tickers)

  const [showModal,  setShowModal]  = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [timeLabel,  setTimeLabel]  = useState('')

  // Atualiza o "X min atrás" a cada 10s
  useEffect(() => {
    if (!lastUpdated) return
    setTimeLabel(timeAgo(lastUpdated))
    const id = setInterval(() => setTimeLabel(timeAgo(lastUpdated)), 10_000)
    return () => clearInterval(id)
  }, [lastUpdated])

  const loading        = dbLoading
  const totalPatrimonio = metrics.totalPatrimonio

  const alocacaoData = ativos.map(a => ({
    name:  a.ticker,
    value: totalPatrimonio > 0 ? Math.round((a.valor / totalPatrimonio) * 100) : 0,
    color: a.color,
  }))

  const cryptoAtivos = ativos.filter(a => isCrypto(a.ticker))

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
          <p className='text-xs text-muted'>
            {ativos.length} ativos
            {cryptoAtivos.length > 0 && ` · ${cryptoAtivos.length} com preço ao vivo`}
          </p>
        </div>
        <div className='flex items-center gap-3'>

          {/* Badge câmbio */}
          {cambio && (
            <div className='flex items-center gap-1.5 bg-bg border border-border-main rounded-md px-3 py-1.5'>
              <DollarSign className='w-3 h-3 text-muted' />
              <span className='text-xs font-bold text-text font-mono'>
                1 USD = R${cambio.toFixed(2)}
              </span>
            </div>
          )}

          {/* Badge ao vivo */}
          {lastUpdated && !priceLoading && (
            <div className='flex items-center gap-1.5 bg-bg border border-border-main rounded-md px-3 py-1.5'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
              <span className='text-[10px] font-bold text-muted'>
                {timeLabel || 'agora'}
              </span>
              <button onClick={refresh} className='text-muted hover:text-primary transition-colors'>
                <RefreshCw className='w-3 h-3' />
              </button>
            </div>
          )}

          {priceLoading && (
            <div className='flex items-center gap-1.5 bg-bg border border-border-main rounded-md px-3 py-1.5'>
              <Loader2 className='w-3 h-3 animate-spin text-muted' />
              <span className='text-[10px] font-bold text-muted'>Buscando preços…</span>
            </div>
          )}

          {priceError && (
            <div className='flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5'>
              <AlertCircle className='w-3 h-3 text-amber-500' />
              <span className='text-[10px] font-bold text-amber-600'>Offline</span>
            </div>
          )}

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

              {/* Lista */}
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
                    {/* Cabeçalho da tabela */}
                    <div className='grid grid-cols-[1fr_120px_120px_40px] gap-2 px-2 mb-2'>
                      {['Ativo', 'Preço atual', 'Na carteira', ''].map((h, i) => (
                        <p key={i} className={`text-[10px] text-muted font-black uppercase tracking-wide ${i >= 1 ? 'text-right' : ''}`}>{h}</p>
                      ))}
                    </div>

                    <div className='flex flex-col'>
                      {ativos.map((ativo, i) => {
                        const live      = prices[ativo.ticker]
                        const haslive   = !!live
                        const change    = live?.brl_24h_change ?? 0
                        const positivo  = change >= 0

                        return (
                          <div key={ativo.id}
                            className={`grid grid-cols-[1fr_120px_120px_40px] gap-2 items-center px-2 py-3 rounded-lg transition-colors hover:bg-bg ${
                              i < ativos.length - 1 ? 'border-b border-border-main' : ''
                            }`}>

                            {/* Nome + tipo */}
                            <div className='flex items-center gap-3 min-w-0'>
                              <span className='w-8 h-8 rounded-[8px] flex items-center justify-center text-xs font-black flex-shrink-0'
                                style={{ background: ativo.color + '22', color: ativo.color }}>
                                {ativo.ticker.slice(0, 2)}
                              </span>
                              <div className='min-w-0'>
                                <div className='flex items-center gap-1.5'>
                                  <p className='text-xs font-bold text-text truncate'>{ativo.nome}</p>
                                  {haslive && (
                                    <span className='flex items-center gap-0.5 text-[9px] font-bold text-primary bg-primary-light px-1.5 py-0.5 rounded-full flex-shrink-0'>
                                      <Zap className='w-2.5 h-2.5' />live
                                    </span>
                                  )}
                                </div>
                                <p className='text-[10px] text-muted'>{ativo.tipo} · {ativo.ticker}</p>
                              </div>
                            </div>

                            {/* Preço ao vivo */}
                            <div className='text-right'>
                              {haslive ? (
                                <>
                                  <p className='text-xs font-bold text-text font-mono'>{fmtBRL(live.brl)}</p>
                                  <span className={`flex items-center justify-end gap-0.5 text-[10px] font-bold ${positivo ? 'text-primary' : 'text-red-500'}`}>
                                    {positivo
                                      ? <TrendingUp  className='w-3 h-3' />
                                      : <TrendingDown className='w-3 h-3' />}
                                    {fmtChange(change)}
                                  </span>
                                </>
                              ) : (
                                <p className='text-xs text-muted'>—</p>
                              )}
                            </div>

                            {/* Valor na carteira */}
                            <div className='text-right'>
                              <p className='text-xs font-bold font-mono text-text'>
                                R${ativo.valor.toLocaleString('pt-BR')}
                              </p>
                              <p className='text-[10px] text-muted font-mono'>
                                {totalPatrimonio > 0
                                  ? `${Math.round((ativo.valor / totalPatrimonio) * 100)}%`
                                  : '—'}
                              </p>
                            </div>

                            {/* Delete */}
                            <button onClick={() => handleDelete(ativo.id)}
                              disabled={deletingId === ativo.id}
                              className='w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40'>
                              {deletingId === ativo.id
                                ? <Loader2 className='w-3.5 h-3.5 animate-spin' />
                                : <Trash2  className='w-3.5 h-3.5' />}
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
                  <div className='flex items-center justify-center h-[200px] text-muted text-sm'>Sem ativos</div>
                ) : (
                  <>
                    <div className='relative flex justify-center'>
                      <ResponsiveContainer width='100%' height={160}>
                        <PieChart>
                          <Pie data={alocacaoData} cx='50%' cy='50%'
                            innerRadius={48} outerRadius={68} dataKey='value' strokeWidth={0}>
                            {alocacaoData.map(e => <Cell key={e.name} fill={e.color} />)}
                          </Pie>
                          {/* @ts-ignore */}
                          <Tooltip formatter={v => [`${v}%`]} />
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
                      {alocacaoData.map(item => {
                        const ativo = ativos.find(a => a.ticker === item.name)
                        const live  = prices[item.name]
                        return (
                          <div key={item.name} className='flex items-center gap-2 transition-opacity hover:opacity-70'>
                            <span className='w-2.5 h-2.5 rounded-sm flex-shrink-0' style={{ background: item.color }} />
                            <span className='text-xs text-text flex-1 font-medium truncate'>{ativo?.nome}</span>
                            {live && (
                              <span className={`text-[10px] font-bold font-mono ${live.brl_24h_change >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                {fmtChange(live.brl_24h_change)}
                              </span>
                            )}
                            <span className='text-xs font-mono text-muted'>{item.value}%</span>
                          </div>
                        )
                      })}
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
