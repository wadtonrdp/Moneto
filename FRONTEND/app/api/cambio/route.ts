import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res  = await fetch('https://api.frankfurter.app/latest?from=USD&to=BRL', {
      next: { revalidate: 300 }, // cache 5 min no servidor
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Falha ao buscar câmbio' }, { status: 502 })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
