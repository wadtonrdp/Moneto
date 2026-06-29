import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  getTransacoes, addTransacao as dbAddTx, removeTransacao as dbRemoveTx,
  getAtivos,     addAtivo as dbAddAtivo,  removeAtivo as dbRemoveAtivo,
  Transacao, Ativo, CATEGORY_CONFIG,
} from '@/lib/demo-db'

export type { Transacao, Ativo }

// ─── Derived metric types ─────────────────────────────────────────────────────

export type Metrics = {
  totalReceitas:     number
  totalDespesas:     number
  saldoMes:         number
  totalPatrimonio:  number
  taxaPoupanca:     string   // e.g. "48,2%"
  categoriasGasto:  { nome: string; valor: number; pct: number; color: string }[]
  maiorCategoria:   { nome: string; valor: number } | null
  distribuicaoAtivos: { name: string; value: number; color: string }[]
  monthlyData:      { mes: string; receita: number; despesa: number }[]
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDemoData() {
  const [transacoes,  setTransacoes]  = useState<Transacao[]>([])
  const [ativos,      setAtivos]      = useState<Ativo[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [txs, avs] = await Promise.all([getTransacoes(), getAtivos()])
      setTransacoes(txs)
      setAtivos(avs)
    } catch (e) {
      setError('Erro ao carregar dados. Tente recarregar a página.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  // ── Derived metrics ────────────────────────────────────────────────────────
  const metrics = useMemo<Metrics>(() => {
    const totalReceitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((s, t) => s + t.valor, 0)

    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((s, t) => s + Math.abs(t.valor), 0)

    const saldoMes = totalReceitas - totalDespesas

    const totalPatrimonio = ativos.reduce((s, a) => s + a.valor, 0)

    const taxaPoupanca = totalReceitas > 0
      ? ((saldoMes / totalReceitas) * 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 1, maximumFractionDigits: 1,
        }) + '%'
      : '0%'

    // Gastos por categoria
    const despMap: Record<string, number> = {}
    transacoes
      .filter(t => t.tipo === 'despesa')
      .forEach(t => {
        despMap[t.categoria] = (despMap[t.categoria] ?? 0) + Math.abs(t.valor)
      })

    const catColors: Record<string, string> = {
      'Renda': '#0F6E56', 'Alimentação': '#F0C14B', 'Cripto': '#D97706',
      'Investimentos': '#2461EA', 'Assinaturas': '#3B82F6', 'Moradia': '#EF4444',
      'Transporte': '#D85A30', 'Saúde': '#EC4899', 'Outros': '#9EA1A9',
    }

    const categoriasGasto = Object.entries(despMap)
      .map(([nome, valor]) => ({
        nome, valor,
        pct: totalDespesas > 0 ? Math.round((valor / totalDespesas) * 100) : 0,
        color: catColors[nome] ?? '#9EA1A9',
      }))
      .sort((a, b) => b.valor - a.valor)

    const maiorCategoria = categoriasGasto[0] ?? null

    // Distribuição dos ativos por tipo
    const tipoMap: Record<string, { valor: number; color: string }> = {}
    ativos.forEach(a => {
      if (!tipoMap[a.tipo]) tipoMap[a.tipo] = { valor: 0, color: a.color }
      tipoMap[a.tipo].valor += a.valor
    })

    const distribuicaoAtivos = Object.entries(tipoMap).map(([name, { valor, color }]) => ({
      name,
      value: totalPatrimonio > 0 ? Math.round((valor / totalPatrimonio) * 100) : 0,
      color,
    }))

    // Monthly data (from transaction dates DD/MM/YYYY)
    const monthMap: Record<string, { mes: string; receita: number; despesa: number; ts: number }> = {}
    transacoes.forEach(t => {
      const [d, m, y] = t.data.split('/').map(Number)
      const key = `${y}-${String(m).padStart(2, '0')}`
      const mesLabel = new Date(y, m - 1, d).toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '').replace(/^./, c => c.toUpperCase())
      if (!monthMap[key]) monthMap[key] = { mes: mesLabel, receita: 0, despesa: 0, ts: new Date(y, m - 1).getTime() }
      if (t.tipo === 'receita') monthMap[key].receita += t.valor
      else monthMap[key].despesa += Math.abs(t.valor)
    })

    const monthlyData = Object.values(monthMap)
      .sort((a, b) => a.ts - b.ts)
      .map(({ mes, receita, despesa }) => ({ mes, receita, despesa }))

    return {
      totalReceitas, totalDespesas, saldoMes, totalPatrimonio,
      taxaPoupanca, categoriasGasto, maiorCategoria,
      distribuicaoAtivos, monthlyData,
    }
  }, [transacoes, ativos])

  // ── Transação CRUD ─────────────────────────────────────────────────────────
  const adicionarTransacao = useCallback(
    async (tx: Omit<Transacao, 'id'>) => {
      const nova = await dbAddTx(tx)
      if (nova) setTransacoes(prev => [nova, ...prev])
    },
    []
  )

  const removerTransacao = useCallback(async (id: string) => {
    await dbRemoveTx(id)
    setTransacoes(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Ativo CRUD ─────────────────────────────────────────────────────────────
  const adicionarAtivo = useCallback(
    async (ativo: Omit<Ativo, 'id'>) => {
      const novo = await dbAddAtivo(ativo)
      if (novo) setAtivos(prev => [...prev, novo])
    },
    []
  )

  const removerAtivo = useCallback(async (id: string) => {
    await dbRemoveAtivo(id)
    setAtivos(prev => prev.filter(a => a.id !== id))
  }, [])

  return {
    transacoes, ativos, loading, error, metrics,
    adicionarTransacao, removerTransacao,
    adicionarAtivo, removerAtivo,
    refresh: loadData,
  }
}
