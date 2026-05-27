'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { doLogin } from "@/lib/auth"
import { ChartPie, TrendingUp, Bitcoin, Smartphone, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Tab = 'login' | 'register' | 'forgot'

const DEMO_EMAIL = 'demo@moneto.app'
const DEMO_PASSWORD = 'demo123'

export default function Login() {
  const [tab, setTab] = useState<Tab>('login')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  function handleLogin(email: string, password: string, isDemo: boolean) {
    setError(null)

    const valid =
      isDemo ||
      (email === DEMO_EMAIL && password === DEMO_PASSWORD)

    if (valid) {
      doLogin()
      router.push('/dashboard')
    } else {
      setError('Credenciais inválidas! Use demo@moneto.app / demo123')
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    handleLogin(email, password, false)
  }

  return (
    <div className="grid grid-cols-2 min-h-screen">

      {/* Lado esquerdo */}
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-full max-w-xs text-white">
          <Link href="/" className="flex items-center gap-2 mb-10 w-max group">
            <ChartPie className="bg-white/20 p-1.5 w-8 h-8 rounded-[10px] transition-transform group-hover:scale-110" />
            <p className="font-semibold transition-all group-hover:text-white/80">Moneto</p>
          </Link>

          <h2 className="text-3xl font-bold mb-8">
            Controle total<br/>
            <span className="text-white/60">das suas finanças.</span>
          </h2>
          <p className="text-[12px] text-white/60 mb-8">
            Acompanhe seus investimentos, despesas e receitas com dados atualizados em tempo real.
          </p>

          {[
            { Icon: TrendingUp, label: 'Portfólio de ativos em tempo real' },
            { Icon: Bitcoin,    label: 'Integração com CoinGecko API' },
            { Icon: Smartphone, label: 'Funciona no celular e desktop' },
          ].map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 mb-4 group cursor-pointer">
              <Icon className="bg-white/20 p-2 w-8 h-8 rounded-[10px] transition-transform group-hover:scale-110 flex-shrink-0" />
              <p className="text-[12px] text-white/60 transition-all group-hover:text-white group-hover:text-[13px]">
                {label}
              </p>
            </div>
          ))}

          {/* Demo */}
          <div className="mt-10 p-4 bg-white/10 rounded-[12px] border border-white/20">
            <p className="text-[11px] text-white/60 mb-1 font-semibold uppercase tracking-wide">Acesso rápido</p>
            <p className="text-[12px] text-white/80 mb-3">Explore o Moneto sem criar conta.</p>
            <button
              onClick={() => handleLogin('', '', true)}
              className="w-full bg-white text-primary text-[12px] font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-all hover:bg-white/90 active:scale-95"
            >
              <Zap className="w-4 h-4" />
              Entrar como demo
            </button>
          </div>
        </div>
      </div>

      {/* Lado direito */}
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-xs">

          <Link href="/" className="flex items-center gap-2 mb-8 w-max group">
            <ChartPie className="bg-primary text-white p-1.5 w-8 h-8 rounded-[10px] transition-transform group-hover:scale-110" />
            <p className="font-semibold transition-colors group-hover:text-primary">Moneto</p>
          </Link>

          {error && (
            <div className="mb-4 p-2 text-[11px] bg-red-50 text-red-500 rounded border border-red-200 text-center font-semibold">
              {error}
            </div>
          )}

          {/* LOGIN */}
          {tab === 'login' && (
            <div>
              <h2 className="text-2xl font-bold mb-1">Entre na sua conta</h2>
              <p className="text-[12px] text-muted mb-6">Acesse seu painel financeiro pessoal.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="demo@moneto.app"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="demo123"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-primary hover:underline mt-1 transition-opacity hover:opacity-70"
                  >
                    Esqueci minha senha
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md transition-all hover:bg-primary-dark hover:shadow-md active:scale-95"
                >
                  Entrar
                </button>
              </form>
              <p className="text-center text-[10px] text-muted mt-6">
                Não tem conta?{" "}
                <button onClick={() => setTab('register')} className="text-primary hover:underline font-semibold">
                  Criar conta grátis
                </button>
              </p>
            </div>
          )}

          {/* CADASTRO */}
          {tab === 'register' && (
            <div>
              <button
                onClick={() => setTab('login')}
                className="flex items-center gap-1 text-[11px] text-muted hover:text-text mb-6 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao login
              </button>
              <h2 className="text-2xl font-bold mb-1">Criar conta</h2>
              <p className="text-[12px] text-muted mb-6">Comece a controlar suas finanças hoje.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Seu nome"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Mínimo 8 caracteres"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md transition-all hover:bg-primary-dark hover:shadow-md active:scale-95"
                >
                  Criar conta e entrar
                </button>
              </form>
            </div>
          )}

          {/* RECUPERAR SENHA */}
          {tab === 'forgot' && (
            <div>
              <button
                onClick={() => setTab('login')}
                className="flex items-center gap-1 text-[11px] text-muted hover:text-text mb-6 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao login
              </button>
              <h2 className="text-2xl font-bold mb-1">Recuperar senha</h2>
              <p className="text-[12px] text-muted mb-6">
                Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Link enviado! (Simulação Demo)')
                }}
                className="space-y-4"
              >
                <div className="group">
                  <label className="block text-[12px] font-black text-text mb-1 transition-colors group-focus-within:text-primary">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="text-[12px] block w-full px-3 py-2 border border-border-main rounded-md transition-all focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary hover:border-primary/50"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2 px-4 rounded-md transition-all hover:bg-primary-dark hover:shadow-md active:scale-95"
                >
                  Enviar link de recuperação
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}