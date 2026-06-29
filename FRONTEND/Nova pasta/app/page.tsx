import Button from "@/components/ui/Button";
import { Rocket, MoveRight, Sparkles, ArrowUpRight, Eye, RefreshCcw, Smartphone, ArrowRight, ArrowUp } from "lucide-react";
import PreviewChart from "@/components/dashboard/PreviewChart";
import PreviewDonut from "@/components/dashboard/PreviewDonut";
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function WelcomePage() {
  return (
    <div>
      <header className="border-border-main border-b bg-white">
        <nav className="flex items-center p-4">
          <Logo />
          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Entrar</Button>
            </Link>
            <Link href="/login">
              <Button variant="primary">
                <span className="flex items-center gap-1">
                  Começar grátis <ArrowUpRight className="w-4 h-4"/>
                </span>
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <div className="flex flex-col items-center text-center bg-bg p-20">
          <div className="bg-primary-light rounded-[15px] mb-6 border-primary-border border-2 w-max px-5 transition-transform hover:scale-105 cursor-default">
            <p className="flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4"/>
              Dados em tempo real com CoinGecko
            </p>
          </div>
          <h1 className="mb-6 text-6xl font-bold">
            Seu dinheiro,<br/>
            <span className="text-primary">sob controle.</span>
          </h1>
          <p className="max-w-xl text-muted">
            Acompanhe receitas, despesas e investimentos em um único lugar.
            Simples, bonito e atualizado em tempo real.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Link href="/login">
              <Button variant="primary">
                <span className="flex items-center gap-1 p-1">
                  <Rocket className="w-4 h-4"/>
                  Começar grátis
                </span>
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="semi">
                <span className="flex items-center gap-1 p-1">
                  Ver demo <MoveRight className="w-4 h-4"/>
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center bg-bg px-20 pb-20 border-border-main border-b">
          <div className="w-full bg-white rounded-[15px] border border-border-main overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
            <div className="bg-bg border-b border-border-main px-4 py-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57] transition-transform hover:scale-125 cursor-pointer"></span>
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] transition-transform hover:scale-125 cursor-pointer"></span>
              <span className="w-3 h-3 rounded-full bg-[#28C840] transition-transform hover:scale-125 cursor-pointer"></span>
              <span className="ml-3 text-xs text-muted bg-white border border-border-main px-3 py-1 rounded">
                moneto.vercel.app/dashboard
              </span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Saldo total', value: 'R$48.3k', change: '+4,2%' },
                  { label: 'Receita',     value: 'R$6.4k',  change: '+12%'  },
                  { label: 'Despesas',    value: 'R$3.2k',  change: '+8%'   },
                  { label: 'Invest.',     value: 'R$22.5k', change: '+2,8%' },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-bg rounded-[10px] p-3 border border-border-main transition-all hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5">
                    <p className="text-[9px] text-muted font-semibold uppercase mb-1">{kpi.label}</p>
                    <p className="text-base font-bold text-text">{kpi.value}</p>
                    <span className="flex items-center gap-1 text-[9px] text-primary font-semibold mt-1">
                      <ArrowUp className="w-3 h-3"/>{kpi.change}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 bg-bg rounded-[10px] p-4 border border-border-main transition-all hover:shadow-md hover:border-primary/30">
                  <p className="text-[9px] text-muted font-semibold uppercase mb-2">Evolução do patrimônio</p>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="flex items-center gap-1 text-[9px] text-muted">
                      <span className="w-3 h-1.5 bg-primary rounded inline-block"></span>Patrimônio
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-muted">
                      <span className="w-3 h-1.5 bg-[#2461EA] rounded inline-block"></span>Investimentos
                    </span>
                  </div>
                  <PreviewChart />
                </div>
                <div className="col-span-1 bg-bg rounded-[10px] p-4 border border-border-main transition-all hover:shadow-md hover:border-primary/30">
                  <p className="text-[9px] text-muted font-semibold uppercase mb-2">Distribuição</p>
                  <PreviewDonut />
                  <div className="flex flex-col gap-1 mt-1">
                    {[
                      { label: 'Renda Fixa', pct: '40%', color: '#1D9E75' },
                      { label: 'Ações',      pct: '25%', color: '#2461EA' },
                      { label: 'Cripto',     pct: '20%', color: '#D85A30' },
                      { label: 'Reserva',    pct: '15%', color: '#9EA1A9' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
                        <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: item.color }}></span>
                        <span className="text-[9px] text-text flex-1">{item.label}</span>
                        <span className="text-[9px] text-muted">{item.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Por que Moneto */}
        <div className="flex flex-col items-center text-center bg-white p-14">
          <p className="font-bold text-sm text-primary mb-3">POR QUE MONETO?</p>
          <h2 className="text-2xl font-bold mb-8">Tudo o que você precisa para controlar suas finanças</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              { Icon: Eye,         title: 'Visão completa',      desc: 'Dashboard unificado com todos os seus ativos, receitas e despesas em um só lugar.' },
              { Icon: RefreshCcw,  title: 'Dados em tempo real', desc: 'Preços de cripto via CoinGecko e taxas de câmbio atualizadas automaticamente.' },
              { Icon: Smartphone,  title: 'Mobile first',        desc: 'Interface responsiva que funciona perfeitamente no celular e no desktop.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="group flex flex-col items-start text-start gap-2 bg-bg p-6 rounded-[15px] border-border-main border-2 transition-all hover:shadow-md hover:border-primary/40 hover:-translate-y-1 cursor-default">
                <Icon className="bg-primary-light text-primary rounded-[10px] p-3 w-12 h-12 transition-transform group-hover:scale-110" />
                <p className="font-semibold transition-colors group-hover:text-primary">{title}</p>
                <p className="text-sm text-muted text-balance">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center text-center bg-white p-14 border-border-main border-y">
          <div className="rounded-[15px] border-border-main border-2 w-full">
            <div className="w-full flex flex-row items-center">
              {[
                { value: '100%', label: 'Gratuito' },
                { value: '4',   label: 'Páginas internas' },
                { value: '2',   label: 'APIs ao vivo' },
              ].map((stat, i) => (
                <div key={stat.label} className={`w-full py-8 transition-colors hover:bg-bg cursor-default ${i === 1 ? 'border-x-2 border-border-main' : ''}`}>
                  <p className="text-[40px] font-bold text-primary">{stat.value}</p>
                  <p className="text-[15px] text-muted mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center text-center bg-bg p-14">
          <div className="bg-primary text-white w-full rounded-[15px] p-10 transition-shadow hover:shadow-xl">
            <h2 className="text-[28px] font-bold">Pronto para ter controle?</h2>
            <p className="text-[12px] my-6 text-white/75">Crie sua conta em menos de 1 minuto. Sem cartão de crédito.</p>
            <Link href="/login" className="flex justify-center">
              <Button variant="secondary">
                <span className="flex items-center gap-1 text-primary">
                  <ArrowRight className="w-4 h-4"/>
                  Começar agora
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-main bg-white">
        <div className="flex items-center p-4">
          <Logo />
          <div className="ml-auto">
            <p className="text-[12px] text-muted">Projeto de portfólio — Wadton Rodrigues de Paula · 2026</p>
          </div>
        </div>
      </footer>
    </div>
  );
}