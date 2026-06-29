import { useState, useEffect, useCallback } from 'react'

// ─── Mapeamento ticker → CoinGecko ID ────────────────────────────────────────

export const COINGECKO_IDS: Record<string, string> = {
  'BTC':   'bitcoin',
  'ETH':   'ethereum',
  'SOL':   'solana',
  'BNB':   'binancecoin',
  'ADA':   'cardano',
  'XRP':   'ripple',
  'DOT':   'polkadot',
  'MATIC': 'matic-network',
  'LINK':  'chainlink',
  'AVAX':  'avalanche-2',
  'DOGE':  'dogecoin',
  'LTC':   'litecoin',
  'UNI':   'uniswap',
  'ATOM':  'cosmos',
  'NEAR':  'near',
  'FTM':   'fantom',
  'SAND':  'the-sandbox',
  'MANA':  'decentraland',
  'SHIB':  'shiba-inu',
}

export function isCrypto(ticker: string): boolean {
  return ticker in COINGECKO_IDS
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type CryptoPrice = {
  brl:            number
  brl_24h_change: number
}

export type LivePricesResult = {
  prices:      Record<string, CryptoPrice>
  cambio:      number | null
  loading:     boolean
  lastUpdated: Date | null
  error:       string | null
  refresh:     () => void
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLivePrices(tickers: string[]): LivePricesResult {
  const [prices,      setPrices]      = useState<Record<string, CryptoPrice>>({})
  const [cambio,      setCambio]      = useState<number | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error,       setError]       = useState<string | null>(null)

  const cryptoTickers = [...new Set(tickers.filter(isCrypto))]
  const coinIds       = cryptoTickers.map(t => COINGECKO_IDS[t]).join(',')

  const fetchAll = useCallback(async () => {
    try {
      // ── Câmbio via rota interna (sem CORS) ─────────────────────────────
      const cambioRes = await fetch('/api/cambio')
      if (cambioRes.ok) {
        const { rates } = await cambioRes.json()
        if (rates?.BRL) setCambio(Number(rates.BRL.toFixed(4)))
      }

      // ── Preços cripto via rota interna (sem CORS) ───────────────────────
      if (coinIds) {
        const cryptoRes = await fetch(`/api/crypto?ids=${coinIds}`)
        if (cryptoRes.ok) {
          const data = await cryptoRes.json()
          const next: Record<string, CryptoPrice> = {}
          cryptoTickers.forEach(ticker => {
            const id    = COINGECKO_IDS[ticker]
            const entry = data[id]
            if (entry) {
              next[ticker] = {
                brl:            entry.brl            ?? 0,
                brl_24h_change: entry.brl_24h_change ?? 0,
              }
            }
          })
          setPrices(next)
        }
      }

      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Falha ao buscar preços')
    } finally {
      setLoading(false)
    }
  }, [coinIds])

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 60_000)
    return () => clearInterval(id)
  }, [fetchAll])

  return { prices, cambio, loading, lastUpdated, error, refresh: fetchAll }
}

// ─── Helpers de formatação ────────────────────────────────────────────────────

export function fmtBRL(value: number): string {
  if (value >= 1_000_000)
    return `R$${(value / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}M`
  if (value >= 1_000)
    return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
  return `R$${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}`
}

export function fmtChange(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000)
  if (s < 10)  return 'agora'
  if (s < 60)  return `${s}s atrás`
  if (s < 120) return '1 min atrás'
  return `${Math.floor(s / 60)} min atrás`
}
