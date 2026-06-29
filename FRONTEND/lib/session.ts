import { supabase } from './supabase'

const SESSION_KEY = 'moneto_session_id'
// Versão dos dados demo — incrementar força recriação em sessões antigas
const DATA_VERSION = '2'
const DATA_VERSION_KEY = 'moneto_data_version'

// ─── Helper: formata data relativa à hoje ──────────────────────────────────
function daysAgo(offset: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offset)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

// ─── Dados demo com datas sempre relativas a hoje ─────────────────────────
// Garante que o dashboard sempre exibe dados em qualquer data de acesso

function buildTransacoesIniciais() {
  return [
    // ── Semana atual (~0 a 7 dias atrás) ───────────────────────────────────
    { nome: 'Salário',      valor: 6400,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-2),  status: 'concluido', icon: 'building' },
    { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: daysAgo(-1),  status: 'concluido', icon: 'home'     },
    { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: daysAgo(-3),  status: 'concluido', icon: 'monitor'  },
    { nome: 'Supermercado', valor: -312,   tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-4),  status: 'concluido', icon: 'cart'     },
    { nome: 'Freelance',    valor: 1800,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-5),  status: 'concluido', icon: 'building' },
    { nome: 'Farmácia',     valor: -78,    tipo: 'despesa', categoria: 'Saúde',         data: daysAgo(-6),  status: 'concluido', icon: 'heart'    },

    // ── Últimos 30 dias ─────────────────────────────────────────────────────
    { nome: 'Dividendos',   valor: 420,    tipo: 'receita', categoria: 'Investimentos', data: daysAgo(-8),  status: 'concluido', icon: 'trending' },
    { nome: 'Internet',     valor: -99.90, tipo: 'despesa', categoria: 'Assinaturas',   data: daysAgo(-9),  status: 'pendente',  icon: 'monitor'  },
    { nome: 'Uber',         valor: -45,    tipo: 'despesa', categoria: 'Transporte',    data: daysAgo(-10), status: 'concluido', icon: 'car'      },
    { nome: 'Restaurante',  valor: -120,   tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-12), status: 'concluido', icon: 'cart'     },
    { nome: 'Venda ETH',    valor: 950,    tipo: 'receita', categoria: 'Cripto',        data: daysAgo(-14), status: 'concluido', icon: 'bitcoin'  },
    { nome: 'Compra BTC',   valor: -500,   tipo: 'despesa', categoria: 'Cripto',        data: daysAgo(-18), status: 'pendente',  icon: 'bitcoin'  },
    { nome: 'Restaurante',  valor: -85,    tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-22), status: 'concluido', icon: 'cart'     },
    { nome: 'Transporte',   valor: -60,    tipo: 'despesa', categoria: 'Transporte',    data: daysAgo(-25), status: 'concluido', icon: 'car'      },

    // ── Mês passado (~31 a 60 dias atrás) ──────────────────────────────────
    { nome: 'Salário',      valor: 6200,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-32), status: 'concluido', icon: 'building' },
    { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: daysAgo(-31), status: 'concluido', icon: 'home'     },
    { nome: 'Dividendos',   valor: 380,    tipo: 'receita', categoria: 'Investimentos', data: daysAgo(-33), status: 'concluido', icon: 'trending' },
    { nome: 'Freelance',    valor: 1500,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-42), status: 'concluido', icon: 'building' },
    { nome: 'Supermercado', valor: -290,   tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-38), status: 'concluido', icon: 'cart'     },
    { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: daysAgo(-34), status: 'concluido', icon: 'monitor'  },
    { nome: 'Transporte',   valor: -130,   tipo: 'despesa', categoria: 'Transporte',    data: daysAgo(-45), status: 'concluido', icon: 'car'      },
    { nome: 'Compra ETH',   valor: -800,   tipo: 'despesa', categoria: 'Cripto',        data: daysAgo(-50), status: 'concluido', icon: 'bitcoin'  },
    { nome: 'Restaurante',  valor: -95,    tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-55), status: 'concluido', icon: 'cart'     },

    // ── 2 meses atrás (~61 a 90 dias atrás) ────────────────────────────────
    { nome: 'Salário',      valor: 6200,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-62), status: 'concluido', icon: 'building' },
    { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: daysAgo(-61), status: 'concluido', icon: 'home'     },
    { nome: 'Dividendos',   valor: 410,    tipo: 'receita', categoria: 'Investimentos', data: daysAgo(-63), status: 'concluido', icon: 'trending' },
    { nome: 'Freelance',    valor: 1200,   tipo: 'receita', categoria: 'Renda',         data: daysAgo(-72), status: 'concluido', icon: 'building' },
    { nome: 'Supermercado', valor: -340,   tipo: 'despesa', categoria: 'Alimentação',   data: daysAgo(-68), status: 'concluido', icon: 'cart'     },
    { nome: 'Farmácia',     valor: -55,    tipo: 'despesa', categoria: 'Saúde',         data: daysAgo(-78), status: 'concluido', icon: 'heart'    },
    { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: daysAgo(-64), status: 'concluido', icon: 'monitor'  },
    { nome: 'Transporte',   valor: -180,   tipo: 'despesa', categoria: 'Transporte',    data: daysAgo(-80), status: 'concluido', icon: 'car'      },
    { nome: 'Venda BTC',    valor: 1200,   tipo: 'receita', categoria: 'Cripto',        data: daysAgo(-85), status: 'concluido', icon: 'bitcoin'  },
  ] as const
}

const ATIVOS_INICIAIS = [
  { nome: 'Bitcoin',       ticker: 'BTC',    tipo: 'Cripto',      valor: 9000,  color: '#F0C14B' },
  { nome: 'Ethereum',      ticker: 'ETH',    tipo: 'Cripto',      valor: 4200,  color: '#627EEA' },
  { nome: 'MXRF11',        ticker: 'MXRF11', tipo: 'Fundo Imob.', valor: 3800,  color: '#0F6E56' },
  { nome: 'Petrobras PN',  ticker: 'PETR4',  tipo: 'Ação',        valor: 2900,  color: '#2461EA' },
  { nome: 'Tesouro Selic', ticker: 'RF',     tipo: 'Renda Fixa',  valor: 2600,  color: '#9EA1A9' },
]

// ─── Seed helper ───────────────────────────────────────────────────────────
async function seedSession(sessionId: string) {
  // Limpa dados antigos antes de recriar
  await Promise.all([
    supabase.from('transacoes').delete().eq('session_id', sessionId),
    supabase.from('ativos').delete().eq('session_id', sessionId),
    supabase.from('configuracoes').delete().eq('session_id', sessionId),
  ])

  const transacoesIniciais = buildTransacoesIniciais()

  await supabase.from('transacoes').insert(
    transacoesIniciais.map(t => ({ ...t, session_id: sessionId }))
  )
  await supabase.from('ativos').insert(
    ATIVOS_INICIAIS.map(a => ({ ...a, session_id: sessionId }))
  )
  await supabase.from('configuracoes').insert({
    session_id: sessionId,
    nome:  'Usuário Demo',
    email: 'demo@moneto.app',
  })
}

// ─── Session management ────────────────────────────────────────────────────

export async function getOrCreateSession(): Promise<string> {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem(SESSION_KEY)
  const currentVersion = localStorage.getItem(DATA_VERSION_KEY)

  // Força recriação se versão dos dados está desatualizada
  const needsRefresh = currentVersion !== DATA_VERSION

  if (sessionId && !needsRefresh) {
    const { data } = await supabase
      .from('sessoes')
      .select('session_id')
      .eq('session_id', sessionId)
      .single()

    if (data) return sessionId
  }

  if (sessionId && needsRefresh) {
    // Sessão existe mas dados estão velhos → reseed com datas atuais
    const { data } = await supabase
      .from('sessoes')
      .select('session_id')
      .eq('session_id', sessionId)
      .single()

    if (data) {
      await seedSession(sessionId)
      localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
      return sessionId
    }
  }

  // Cria nova sessão do zero
  sessionId = crypto.randomUUID()

  await supabase.from('sessoes').insert({ session_id: sessionId })
  await seedSession(sessionId)

  sessionStorage.setItem(SESSION_KEY, sessionId)
  localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
  return sessionId
}

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(SESSION_KEY)
}

// Reseta sessão completamente (botão "Resetar Demo")
export async function resetSession(): Promise<void> {
  if (typeof window === 'undefined') return
  const sessionId = sessionStorage.getItem(SESSION_KEY)
  if (sessionId) {
    await seedSession(sessionId)
    localStorage.setItem(DATA_VERSION_KEY, DATA_VERSION)
  }
}
