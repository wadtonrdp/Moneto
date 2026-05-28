'use client'

import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import { getConfiguracoes, updateConfiguracoes } from '@/lib/demo-db'
import { getOrCreateSession } from '@/lib/session'
import { useEffect, useState } from 'react'
import {
  User, Mail, Save, RotateCcw, Shield, Bell,
  ChevronRight, Loader2, Check, Info,
} from 'lucide-react'

const READ_KEY = 'moneto_read_notifs'

type Config = { nome: string; email: string }

export default function Configuracoes() {
  const [config,    setConfig]    = useState<Config>({ nome: '', email: '' })
  const [loading,   setLoading]   = useState(true)
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [notifOn,   setNotifOn]   = useState(true)

  const dataHoje = new Date()
  const dataBR = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
    .format(dataHoje).replace(' de ', ' ').replace(/^\w/, c => c.toUpperCase())

  useEffect(() => {
    async function load() {
      const [cfg, sid] = await Promise.all([getConfiguracoes(), getOrCreateSession()])
      if (cfg) setConfig({ nome: cfg.nome, email: cfg.email })
      setSessionId(sid)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    await updateConfiguracoes({ nome: config.nome, email: config.email })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleReset() {
    if (!confirm('Tem certeza? Todos os seus dados demo serão apagados e recarregados do zero.')) return
    sessionStorage.removeItem('moneto_session_id')
    localStorage.removeItem(READ_KEY)
    window.location.reload()
  }

  const initials = config.nome
    ? config.nome.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : 'DM'

  const inputCls = 'w-full border border-border-main rounded-[8px] px-3 py-2.5 text-sm text-text outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white'

  return (
    <div className='flex min-h-screen flex-col'>

      {/* HEADER */}
      <header className='border-border-main border-b bg-white flex h-16 items-center justify-between px-6 flex-shrink-0'>
        <div>
          <h1 className='text-base font-bold'>Configurações</h1>
          <p className='text-xs text-muted'>Conta Demo · {dataBR}</p>
        </div>
        <Avatar />
      </header>

      <main className='flex-grow bg-bg p-6 max-w-2xl w-full mx-auto'>

        {loading ? (
          <div className='flex items-center justify-center h-64 gap-2 text-muted'>
            <Loader2 className='w-5 h-5 animate-spin text-primary' />
            <span className='text-sm'>Carregando…</span>
          </div>
        ) : (
          <div className='flex flex-col gap-5'>

            {/* ── Perfil ────────────────────────────────────────── */}
            <div className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>
              <div className='px-5 py-4 border-b border-border-main bg-bg'>
                <p className='text-xs font-black text-muted uppercase tracking-widest'>Perfil</p>
              </div>

              <div className='p-5'>
                {/* Avatar */}
                <div className='flex items-center gap-4 mb-6'>
                  <div className='w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-black text-lg flex-shrink-0'>
                    {initials}
                  </div>
                  <div>
                    <p className='text-sm font-bold text-text'>{config.nome || 'Usuário Demo'}</p>
                    <p className='text-xs text-muted'>{config.email || 'demo@moneto.app'}</p>
                    <span className='text-[10px] font-bold bg-primary-light text-primary px-2 py-0.5 rounded-full mt-1 inline-block'>
                      Conta Demo
                    </span>
                  </div>
                </div>

                {/* Campos */}
                <div className='flex flex-col gap-4'>
                  <div>
                    <label className='flex items-center gap-1.5 text-xs font-semibold text-muted mb-1.5'>
                      <User className='w-3.5 h-3.5' />
                      Nome
                    </label>
                    <input className={inputCls} placeholder='Seu nome'
                      value={config.nome}
                      onChange={e => setConfig(c => ({ ...c, nome: e.target.value }))} />
                  </div>

                  <div>
                    <label className='flex items-center gap-1.5 text-xs font-semibold text-muted mb-1.5'>
                      <Mail className='w-3.5 h-3.5' />
                      E-mail
                    </label>
                    <input className={inputCls} placeholder='seu@email.com' type='email'
                      value={config.email}
                      onChange={e => setConfig(c => ({ ...c, email: e.target.value }))} />
                  </div>

                  <div className='flex justify-end'>
                    <Button variant='primary' onClick={handleSave} disabled={saving}>
                      {saving  ? <Loader2 className='w-4 h-4 animate-spin' /> :
                       saved   ? <Check   className='w-4 h-4' />             :
                                 <Save    className='w-4 h-4' />}
                      {saving ? 'Salvando…' : saved ? 'Salvo!' : 'Salvar alterações'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Notificações ──────────────────────────────────── */}
            <div className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>
              <div className='px-5 py-4 border-b border-border-main bg-bg'>
                <p className='text-xs font-black text-muted uppercase tracking-widest'>Notificações</p>
              </div>

              <div className='divide-y divide-border-main'>
                {[
                  { label: 'Novas transações',  desc: 'Receber alerta ao adicionar uma transação' },
                  { label: 'Variação de ativos', desc: 'Notificar sobre variações relevantes no portfólio' },
                  { label: 'Resumo semanal',     desc: 'Resumo financeiro toda segunda-feira' },
                ].map((item, i) => (
                  <div key={i} className='flex items-center justify-between px-5 py-4'>
                    <div>
                      <p className='text-sm font-semibold text-text'>{item.label}</p>
                      <p className='text-xs text-muted mt-0.5'>{item.desc}</p>
                    </div>
                    {/* Toggle */}
                    <button
                      onClick={() => setNotifOn(v => !v)}
                      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${notifOn ? 'bg-primary' : 'bg-border-main'}`}
                      style={{ height: '22px', width: '40px' }}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${notifOn ? 'translate-x-4' : 'translate-x-0'}`}
                        style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Conta Demo ────────────────────────────────────── */}
            <div className='bg-white rounded-[12px] border border-border-main shadow-sm overflow-hidden'>
              <div className='px-5 py-4 border-b border-border-main bg-bg'>
                <p className='text-xs font-black text-muted uppercase tracking-widest'>Conta Demo</p>
              </div>

              <div className='p-5 flex flex-col gap-4'>

                {/* Info da sessão */}
                <div className='flex items-start gap-3 bg-bg rounded-[8px] p-3 border border-border-main'>
                  <Info className='w-4 h-4 text-muted flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-xs font-semibold text-text'>Como funciona a conta demo</p>
                    <p className='text-xs text-muted mt-1 leading-relaxed'>
                      Seus dados são isolados por sessão — nenhuma outra pessoa vê o que você fez.
                      Ao fechar o navegador os dados são resetados automaticamente.
                    </p>
                  </div>
                </div>

                {/* Session ID */}
                <div>
                  <label className='flex items-center gap-1.5 text-xs font-semibold text-muted mb-1.5'>
                    <Shield className='w-3.5 h-3.5' />
                    ID da sessão atual
                  </label>
                  <div className='bg-bg border border-border-main rounded-[8px] px-3 py-2.5'>
                    <p className='text-[10px] font-mono text-muted break-all'>{sessionId || '—'}</p>
                  </div>
                </div>

                {/* Reset */}
                <div className='flex items-center justify-between pt-2 border-t border-border-main'>
                  <div>
                    <p className='text-sm font-semibold text-text'>Resetar dados demo</p>
                    <p className='text-xs text-muted mt-0.5'>Apaga tudo e recarrega com os dados iniciais</p>
                  </div>
                  <Button variant='danger' onClick={handleReset}>
                    <RotateCcw className='w-4 h-4' />
                    Resetar
                  </Button>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
