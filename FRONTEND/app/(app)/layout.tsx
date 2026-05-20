'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuth } from '@/lib/auth' // Certifique-se de alinhar esse caminho com a sua pasta lib

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isAuthenticated = checkAuth()

    if (!isAuthenticated) {
      // Se deu F5 ou fechou a aba, o sessionStorage sumiu. Expulsa pro login!
      router.replace('/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    // Uma tela de carregamento elegante e rápida enquanto verifica o sessionStorage
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white font-sans text-sm tracking-wide">
        <p className="animate-pulse">Carregando painel demo...</p>
      </div>
    )
  }

  // Se estiver logado, renderiza o dashboard normalmente por cima do RootLayout global
  return <>{children}</>
}