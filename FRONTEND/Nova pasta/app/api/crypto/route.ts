import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids')

  if (!ids) {
    return NextResponse.json({ error: 'Parâmetro ids obrigatório' }, { status: 400 })
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true`
    const res = await fetch(url, {
      next: { revalidate: 60 }, // cache 1 min no servidor
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao buscar preços' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
