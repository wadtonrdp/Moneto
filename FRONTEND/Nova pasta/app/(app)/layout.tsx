'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuth, doLogin } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('session') === 'demo') {
      doLogin()
      window.history.replaceState({}, '', window.location.pathname)
    }

    if (!checkAuth()) {
      router.replace('/login')
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <p className="animate-pulse text-sm text-muted">Carregando painel...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}