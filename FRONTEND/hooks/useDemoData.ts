import { useState, useCallback, useMemo } from 'react'
import { Transacao, Ativo, CATEGORY_CONFIG } from '@/lib/demo-db'

export type { Transacao, Ativo }

// ─── Derived metric types ─────────────────────────────────────────────────────

export type Metrics = {
  totalReceitas:      number
  totalDespesas:      number
  saldoMes:          number
  totalPatrimonio:   number
  taxaPoupanca:      string
  categoriasGasto:   { nome: string; valor: number; pct: number; color: string }[]
  maiorCategoria:    { nome: string; valor: number } | null
  distribuicaoAtivos: { name: string; value: number; color: string }[]
  monthlyData:       { mes: string; receita: number; despesa: number }[]
}

// ─── Dados de exemplo permanentes ────────────────────────────────────────────
// Estes dados são estáticos e aparecem sempre no site, ideal para portfólio.

const TRANSACOES_FIXAS: Transacao[] = [
  // ── Junho 2026 ──────────────────────────────────────────────────────────────
  { id: 't01', nome: 'Salário',       valor: 6400,    tipo: 'receita', categoria: 'Renda',         data: '05/06/2026', status: 'concluido', icon: 'building' },
  { id: 't02', nome: 'Freelance',     valor: 1800,    tipo: 'receita', categoria: 'Renda',         data: '10/06/2026', status: 'concluido', icon: 'building' },
  { id: 't03', nome: 'Dividendos',    valor: 420,     tipo: 'receita', categoria: 'Investimentos', data: '01/06/2026', status: 'concluido', icon: 'trending' },
  { id: 't04', nome: 'Venda ETH',     valor: 950,     tipo: 'receita', categoria: 'Cripto',        data: '18/06/2026', status: 'concluido', icon: 'bitcoin'  },
  { id: 't05', nome: 'Aluguel',       valor: -1200,   tipo: 'despesa', categoria: 'Moradia',       data: '01/06/2026', status: 'concluido', icon: 'home'     },
  { id: 't06', nome: 'Supermercado',  valor: -312,    tipo: 'despesa', categoria: 'Alimentação',   data: '12/06/2026', status: 'concluido', icon: 'cart'     },
  { id: 't07', nome: 'Restaurante',   valor: -120,    tipo: 'despesa', categoria: 'Alimentação',   data: '15/06/2026', status: 'concluido', icon: 'cart'     },
  { id: 't08', nome: 'Uber',          valor: -45,     tipo: 'despesa', categoria: 'Transporte',    data: '08/06/2026', status: 'concluido', icon: 'car'      },
  { id: 't09', nome: 'Assinaturas',   valor: -89.90,  tipo: 'despesa', categoria: 'Assinaturas',   data: '03/06/2026', status: 'concluido', icon: 'monitor'  },
  { id: 't10', nome: 'Farmácia',      valor: -78,     tipo: 'despesa', categoria: 'Saúde',         data: '14/06/2026', status: 'concluido', icon: 'heart'    },
  { id: 't11', nome: 'Internet',      valor: -99.90,  tipo: 'despesa', categoria: 'Assinaturas',   data: '20/06/2026', status: 'pendente',  icon: 'monitor'  },
  { id: 't12', nome: 'Compra BTC',    valor: -500,    tipo: 'despesa', categoria: 'Cripto',        data: '25/06/2026', status: 'pendente',  icon: 'bitcoin'  },

  // ── Maio 2026 ──────────────────────────────────────────────────────────────
  { id: 't13', nome: 'Salário',       valor: 6200,    tipo: 'receita', categoria: 'Renda',         data: '05/05/2026', status: 'concluido', icon: 'building' },
  { id: 't14', nome: 'Freelance',     valor: 1500,    tipo: 'receita', categoria: 'Renda',         data: '14/05/2026', status: 'concluido', icon: 'building' },
  { id: 't15', nome: 'Dividendos',    valor: 380,     tipo: 'receita', categoria: 'Investimentos', data: '02/05/2026', status: 'concluido', icon: 'trending' },
  { id: 't16', nome: 'Aluguel',       valor: -1200,   tipo: 'despesa', categoria: 'Moradia',       data: '01/05/2026', status: 'concluido', icon: 'home'     },
  { id: 't17', nome: 'Supermercado',  valor: -290,    tipo: 'despesa', categoria: 'Alimentação',   data: '10/05/2026', status: 'concluido', icon: 'cart'     },
  { id: 't18', nome: 'Assinaturas',   valor: -89.90,  tipo: 'despesa', categoria: 'Assinaturas',   data: '03/05/2026', status: 'concluido', icon: 'monitor'  },
  { id: 't19', nome: 'Transporte',    valor: -130,    tipo: 'despesa', categoria: 'Transporte',    data: '18/05/2026', status: 'concluido', icon: 'car'      },
  { id: 't20', nome: 'Compra ETH',    valor: -800,    tipo: 'despesa', categoria: 'Cripto',        data: '22/05/2026', status: 'concluido', icon: 'bitcoin'  },
  { id: 't21', nome: 'Restaurante',   valor: -95,     tipo: 'despesa', categoria: 'Alimentação',   data: '25/05/2026', status: 'concluido', icon: 'cart'     },
  { id: 't22', nome: 'Farmácia',      valor: -55,     tipo: 'despesa', categoria: 'Saúde',         data: '20/05/2026', status: 'concluido', icon: 'heart'    },

  // ── Abril 2026 ─────────────────────────────────────────────────────────────
  { id: 't23', nome: 'Salário',       valor: 6200,    tipo: 'receita', categoria: 'Renda',         data: '05/04/2026', status: 'concluido', icon: 'building' },
  { id: 't24', nome: 'Dividendos',    valor: 410,     tipo: 'receita', categoria: 'Investimentos', data: '01/04/2026', status: 'concluido', icon: 'trending' },
  { id: 't25', nome: 'Venda BTC',     valor: 1200,    tipo: 'receita', categoria: 'Cripto',        data: '20/04/2026', status: 'concluido', icon: 'bitcoin'  },
  { id: 't26', nome: 'Aluguel',       valor: -1200,   tipo: 'despesa', categoria: 'Moradia',       data: '01/04/2026', status: 'concluido', icon: 'home'     },
  { id: 't27', nome: 'Supermercado',  valor: -340,    tipo: 'despesa', categoria: 'Alimentação',   data: '08/04/2026', status: 'concluido', icon: 'cart'     },
  { id: 't28', nome: 'Assinaturas',   valor: -89.90,  tipo: 'despesa', categoria: 'Assinaturas',   data: '03/04/2026', status: 'concluido', icon: 'monitor'  },
  { id: 't29', nome: 'Transporte',    valor: -180,    tipo: 'despesa', categoria: 'Transporte',    data: '22/04/2026', status: 'concluido', icon: 'car'      },
  { id: 't30', nome: 'Restaurante',   valor: -110,    tipo: 'despesa', categoria: 'Alimentação',   data: '28/04/2026', status: 'concluido', icon: 'cart'     },
]

const ATIVOS_FIXOS: Ativo[] = [
  { id: 'a01', nome: 'Bitcoin',       ticker: 'BTC',    tipo: 'Cripto',      valor: 9000,  color: '#F0C14B' },
  { id: 'a02', nome: 'Ethereum',      ticker: 'ETH',    tipo: 'Cripto',      valor: 4200,  color: '#627EEA' },
  { id: 'a03', nome: 'MXRF11',        ticker: 'MXRF11', tipo: 'Fundo Imob.', valor: 3800,  color: '#0F6E56' },
  { id: 'a04', nome: 'Petrobras PN',  ticker: 'PETR4',  tipo: 'Ação',        valor: 2900,  color: '#2461EA' },
  { id: 'a05', nome: 'Tesouro Selic', ticker: 'RF',     tipo: 'Renda Fixa',  valor: 2600,  color: '#9EA1A9' },
]

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDemoData() {
  // Estado local para permitir adicionar/remover itens na sessão atual
  const [transacoes, setTransacoes] = useState<Transacao[]>(TRANSACOES_FIXAS)
  const [ativos,     setAtivos]     = useState<Ativo[]>(ATIVOS_FIXOS)
  const loading = false
  const error   = null

  // ── Derived metrics ────────────────────────────────────────────────────────
  const metrics = useMemo<Metrics>(() => {
    const totalReceitas = transacoes
      .filter(t => t.tipo === 'receita')
      .reduce((s, t) => s + t.valor, 0)

    const totalDespesas = transacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((s, t) => s + Math.abs(t.valor), 0)

    const saldoMes       = totalReceitas - totalDespesas
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
      'Renda':         '#0F6E56', 'Alimentação': '#F0C14B', 'Cripto':     '#D97706',
      'Investimentos': '#2461EA', 'Assinaturas': '#3B82F6', 'Moradia':    '#EF4444',
      'Transporte':    '#D85A30', 'Saúde':       '#EC4899', 'Outros':     '#9EA1A9',
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

    // Monthly data
    const monthMap: Record<string, { mes: string; receita: number; despesa: number; ts: number }> = {}
    transacoes.forEach(t => {
      const [d, m, y] = t.data.split('/').map(Number)
      const key      = `${y}-${String(m).padStart(2, '0')}`
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

  // ── CRUD local (apenas para a sessão atual, não persiste) ──────────────────
  const adicionarTransacao = useCallback(async (tx: Omit<Transacao, 'id'>) => {
    const nova: Transacao = { ...tx, id: crypto.randomUUID() }
    setTransacoes(prev => [nova, ...prev])
  }, [])

  const removerTransacao = useCallback(async (id: string) => {
    setTransacoes(prev => prev.filter(t => t.id !== id))
  }, [])

  const adicionarAtivo = useCallback(async (ativo: Omit<Ativo, 'id'>) => {
    const novo: Ativo = { ...ativo, id: crypto.randomUUID() }
    setAtivos(prev => [...prev, novo])
  }, [])

  const removerAtivo = useCallback(async (id: string) => {
    setAtivos(prev => prev.filter(a => a.id !== id))
  }, [])

  const refresh = useCallback(async () => {
    setTransacoes(TRANSACOES_FIXAS)
    setAtivos(ATIVOS_FIXOS)
  }, [])

  return {
    transacoes, ativos, loading, error, metrics,
    adicionarTransacao, removerTransacao,
    adicionarAtivo, removerAtivo,
    refresh,
  }
}
