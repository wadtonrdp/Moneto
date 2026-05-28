import { supabase } from './supabase'

const SESSION_KEY = 'moneto_session_id'

// ─── Dados iniciais da demo ────────────────────────────────────────────────

const TRANSACOES_INICIAIS = [
  // Maio 2026
  { nome: 'Salário',      valor: 6400,   tipo: 'receita', categoria: 'Renda',         data: '05/05/2026', status: 'concluido', icon: 'building' },
  { nome: 'Supermercado', valor: -312,   tipo: 'despesa', categoria: 'Alimentação',   data: '12/05/2026', status: 'concluido', icon: 'cart'     },
  { nome: 'Compra BTC',   valor: -500,   tipo: 'despesa', categoria: 'Cripto',        data: '28/04/2026', status: 'pendente',  icon: 'bitcoin'  },
  { nome: 'Dividendos',   valor: 420,    tipo: 'receita', categoria: 'Investimentos', data: '01/05/2026', status: 'concluido', icon: 'trending' },
  { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: '03/05/2026', status: 'concluido', icon: 'monitor'  },
  { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: '01/05/2026', status: 'concluido', icon: 'home'     },
  { nome: 'Uber',         valor: -45,    tipo: 'despesa', categoria: 'Transporte',    data: '08/05/2026', status: 'concluido', icon: 'car'      },
  { nome: 'Freelance',    valor: 1800,   tipo: 'receita', categoria: 'Renda',         data: '10/05/2026', status: 'concluido', icon: 'building' },
  { nome: 'Farmácia',     valor: -78,    tipo: 'despesa', categoria: 'Saúde',         data: '14/05/2026', status: 'concluido', icon: 'heart'    },
  { nome: 'Restaurante',  valor: -120,   tipo: 'despesa', categoria: 'Alimentação',   data: '15/05/2026', status: 'concluido', icon: 'cart'     },
  { nome: 'Venda ETH',    valor: 950,    tipo: 'receita', categoria: 'Cripto',        data: '18/05/2026', status: 'concluido', icon: 'bitcoin'  },
  { nome: 'Internet',     valor: -99.90, tipo: 'despesa', categoria: 'Assinaturas',   data: '20/05/2026', status: 'pendente',  icon: 'monitor'  },

  // Abril 2026
  { nome: 'Salário',      valor: 6200,   tipo: 'receita', categoria: 'Renda',         data: '05/04/2026', status: 'concluido', icon: 'building' },
  { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: '01/04/2026', status: 'concluido', icon: 'home'     },
  { nome: 'Supermercado', valor: -290,   tipo: 'despesa', categoria: 'Alimentação',   data: '10/04/2026', status: 'concluido', icon: 'cart'     },
  { nome: 'Dividendos',   valor: 380,    tipo: 'receita', categoria: 'Investimentos', data: '02/04/2026', status: 'concluido', icon: 'trending' },
  { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: '03/04/2026', status: 'concluido', icon: 'monitor'  },
  { nome: 'Transporte',   valor: -130,   tipo: 'despesa', categoria: 'Transporte',    data: '18/04/2026', status: 'concluido', icon: 'car'      },
  { nome: 'Compra ETH',   valor: -800,   tipo: 'despesa', categoria: 'Cripto',        data: '22/04/2026', status: 'concluido', icon: 'bitcoin'  },
  { nome: 'Restaurante',  valor: -95,    tipo: 'despesa', categoria: 'Alimentação',   data: '25/04/2026', status: 'concluido', icon: 'cart'     },

  // Março 2026
  { nome: 'Salário',      valor: 6200,   tipo: 'receita', categoria: 'Renda',         data: '05/03/2026', status: 'concluido', icon: 'building' },
  { nome: 'Aluguel',      valor: -1200,  tipo: 'despesa', categoria: 'Moradia',       data: '01/03/2026', status: 'concluido', icon: 'home'     },
  { nome: 'Freelance',    valor: 1200,   tipo: 'receita', categoria: 'Renda',         data: '14/03/2026', status: 'concluido', icon: 'building' },
  { nome: 'Supermercado', valor: -340,   tipo: 'despesa', categoria: 'Alimentação',   data: '08/03/2026', status: 'concluido', icon: 'cart'     },
  { nome: 'Farmácia',     valor: -55,    tipo: 'despesa', categoria: 'Saúde',         data: '20/03/2026', status: 'concluido', icon: 'heart'    },
  { nome: 'Assinaturas',  valor: -89.90, tipo: 'despesa', categoria: 'Assinaturas',   data: '03/03/2026', status: 'concluido', icon: 'monitor'  },
  { nome: 'Dividendos',   valor: 410,    tipo: 'receita', categoria: 'Investimentos', data: '01/03/2026', status: 'concluido', icon: 'trending' },
  { nome: 'Transporte',   valor: -180,   tipo: 'despesa', categoria: 'Transporte',    data: '22/03/2026', status: 'concluido', icon: 'car'      },
]

const ATIVOS_INICIAIS = [
  { nome: 'Bitcoin',       ticker: 'BTC',    tipo: 'Cripto',      valor: 9000,  color: '#F0C14B' },
  { nome: 'Ethereum',      ticker: 'ETH',    tipo: 'Cripto',      valor: 4200,  color: '#627EEA' },
  { nome: 'MXRF11',        ticker: 'MXRF11', tipo: 'Fundo Imob.', valor: 3800,  color: '#0F6E56' },
  { nome: 'Petrobras PN',  ticker: 'PETR4',  tipo: 'Ação',        valor: 2900,  color: '#2461EA' },
  { nome: 'Tesouro Selic', ticker: 'RF',     tipo: 'Renda Fixa',  valor: 2600,  color: '#9EA1A9' },
]

// ─── Session management ────────────────────────────────────────────────────

export async function getOrCreateSession(): Promise<string> {
  if (typeof window === 'undefined') return ''

  let sessionId = sessionStorage.getItem(SESSION_KEY)

  if (sessionId) {
    const { data } = await supabase
      .from('sessoes')
      .select('session_id')
      .eq('session_id', sessionId)
      .single()

    if (data) return sessionId
  }

  // Cria nova sessão com dados demo frescos
  sessionId = crypto.randomUUID()

  await supabase.from('sessoes').insert({ session_id: sessionId })

  await supabase.from('transacoes').insert(
    TRANSACOES_INICIAIS.map(t => ({ ...t, session_id: sessionId }))
  )

  await supabase.from('ativos').insert(
    ATIVOS_INICIAIS.map(a => ({ ...a, session_id: sessionId }))
  )

  await supabase.from('configuracoes').insert({
    session_id: sessionId,
    nome:  'Usuário Demo',
    email: 'demo@moneto.app',
  })

  sessionStorage.setItem(SESSION_KEY, sessionId)
  return sessionId
}

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(SESSION_KEY)
}
