import { supabase } from './supabase'
import { getOrCreateSession } from './session'

// ─── Types ──────────────────────────────────────────────────────────────────

export type Transacao = {
  id: string
  nome: string
  valor: number
  tipo: 'receita' | 'despesa'
  categoria: string
  data: string
  status: 'concluido' | 'pendente'
  icon: string
}

export type Ativo = {
  id: string
  nome: string
  ticker: string
  tipo: string
  valor: number
  color: string
}

// ─── Icon / visual mapping ───────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<string, { icon: string; bg: string; iconColor: string }> = {
  'Renda':         { icon: 'building', bg: 'bg-primary-light', iconColor: 'text-primary'    },
  'Alimentação':   { icon: 'cart',     bg: 'bg-orange-50',     iconColor: 'text-orange-500' },
  'Cripto':        { icon: 'bitcoin',  bg: 'bg-amber-50',      iconColor: 'text-amber-500'  },
  'Investimentos': { icon: 'trending', bg: 'bg-primary-light', iconColor: 'text-primary'    },
  'Assinaturas':   { icon: 'monitor',  bg: 'bg-blue-50',       iconColor: 'text-blue-500'   },
  'Moradia':       { icon: 'home',     bg: 'bg-red-50',        iconColor: 'text-red-500'    },
  'Transporte':    { icon: 'car',      bg: 'bg-zinc-100',      iconColor: 'text-zinc-500'   },
  'Saúde':         { icon: 'heart',    bg: 'bg-pink-50',       iconColor: 'text-pink-500'   },
  'Outros':        { icon: 'star',     bg: 'bg-gray-50',       iconColor: 'text-gray-500'   },
}

export const CATEGORIAS = Object.keys(CATEGORY_CONFIG)

export const ASSET_COLORS = [
  '#F0C14B', '#627EEA', '#0F6E56', '#2461EA',
  '#D85A30', '#9EA1A9', '#EC4899', '#8B5CF6',
]

// ─── Transações ──────────────────────────────────────────────────────────────

export async function getTransacoes(): Promise<Transacao[]> {
  const sessionId = await getOrCreateSession()
  const { data } = await supabase
    .from('transacoes')
    .select('*')
    .eq('session_id', sessionId)
    .order('data', { ascending: false })
  return (data ?? []) as Transacao[]
}

export async function addTransacao(
  tx: Omit<Transacao, 'id'>
): Promise<Transacao | null> {
  const sessionId = await getOrCreateSession()
  const { data } = await supabase
    .from('transacoes')
    .insert({ ...tx, session_id: sessionId })
    .select()
    .single()
  return data as Transacao | null
}

export async function removeTransacao(id: string): Promise<void> {
  await supabase.from('transacoes').delete().eq('id', id)
}

// ─── Ativos ──────────────────────────────────────────────────────────────────

export async function getAtivos(): Promise<Ativo[]> {
  const sessionId = await getOrCreateSession()
  const { data } = await supabase
    .from('ativos')
    .select('*')
    .eq('session_id', sessionId)
  return (data ?? []) as Ativo[]
}

export async function addAtivo(
  ativo: Omit<Ativo, 'id'>
): Promise<Ativo | null> {
  const sessionId = await getOrCreateSession()
  const { data } = await supabase
    .from('ativos')
    .insert({ ...ativo, session_id: sessionId })
    .select()
    .single()
  return data as Ativo | null
}

export async function removeAtivo(id: string): Promise<void> {
  await supabase.from('ativos').delete().eq('id', id)
}

// ─── Configurações ───────────────────────────────────────────────────────────

export type Configuracao = {
  session_id: string
  nome: string
  email: string
}

export async function getConfiguracoes(): Promise<Configuracao | null> {
  const sessionId = await getOrCreateSession()
  const { data } = await supabase
    .from('configuracoes')
    .select('*')
    .eq('session_id', sessionId)
    .single()
  return data as Configuracao | null
}

export async function updateConfiguracoes(
  updates: { nome?: string; email?: string }
): Promise<void> {
  const sessionId = await getOrCreateSession()
  await supabase
    .from('configuracoes')
    .update(updates)
    .eq('session_id', sessionId)
}
