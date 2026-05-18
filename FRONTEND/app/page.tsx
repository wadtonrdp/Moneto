import Button from "@/components/ui/Button";
import { Rocket, MoveRight, Sparkles, ChartPie, ArrowUpRight, Eye, RefreshCcw, Smartphone, ArrowRight } from "lucide-react";
import './globals.css';

export default function WelcomePage() {
  return (
    <div>
      <header className="border-[#E3E5E9] border-b">
        <nav className="flex  items-center p-4">
          <div className="flex items-center gap-2">
            <ChartPie className="bg-[#0F6E56] text-white p-1.5 w-8 h-8 rounded-[10px]" />
            <p>Moneto</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button variant="ghost">Entrar</Button>
            <Button variant="primary">
              <span className="flex items-center">
                Começar grátis <ArrowUpRight className="w-5 h-5"/>
              </span>
            </Button>
          </div>
        </nav>
      </header>
      <main>
        <div className="flex flex-col items-center text-center bg-[#F2F4F6] p-20"> {/* frase inicial */}
          <div className="bg-[#E0F5EC] rounded-[15px] mb-6 border-[#A3DECB] border-2 w-max px-5">
            <p className="flex items-center gap-2 text-[#0F6E56]">
              <Sparkles className="w-4 h-4"/>
              Dados em tempo real com CoinGecko
            </p>
          </div>
          <div className="mb-6 text-6xl">
            <h1>Seu dinheiro,<br/>
            <a className="text-[#0F6E56]">sob controle.</a></h1>
          </div>
          <div className="max-w-xl  text-[#6A6D77]">
            <p>Acompanhe receitas, despesas e investimentos em um único<br/>
              lugar. Simples, bonito e atualizado em tempo real.</p>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <Button variant="primary">
              <span className="flex items-center gap-1 p-1">
                <Rocket className="w-4 h-4"/>
                Começar grátis
              </span>
            </Button>
            <Button variant="ghost">
              <span className="flex items-center p-1">
                ver demo
                <MoveRight className="w-4 h-4"/>
              </span>
            </Button>
          </div>
        </div>
         <div className="flex flex-col items-center text-center bg-[#F2F4F6] p-20 border-[#E3E5E9] border-b"> {/* graficos*/}
          <h1>graficos</h1>
         </div>
         <div className="flex flex-col items-center text-center bg-[#FFFFFF] p-14"> {/* informações*/}
          <div>
            <p className="font-bold text-sm text-[#0F6E56] mb-3">POR QUE MONETO?</p>
          </div>
          <div className="mb-4">
            <h1 className="text-2xl">Tudo o que você precisa para controlar suas finanças</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            <div className="flex flex-col items-start text-start gap-2 bg-[#F2F4F6] p-6 rounded-[15px] border-[#E3E5E9] border-2 w-full">
              <Eye className="bg-[#E0F5EC] text-[#0F6E56] rounded-[10px] p-3 w-12 h-12"/>
              <p>Visão completa</p>
              <p className="text-sm text-[#6A6D77] text-balance ">Dashboard unificado com todos os seus ativos, receitas e despesas em um só lugar.</p>
            </div>
            <div className="flex flex-col items-start text-start  gap-2 bg-[#F2F4F6] p-6 rounded-[15px] border-[#E3E5E9] border-2 w-full">
              <RefreshCcw className="bg-[#E0F5EC] text-[#0F6E56] rounded-[10px] p-3 w-12 h-12"/>
              <p>Dados em tempo real</p>
              <p className="text-sm text-[#6A6D77]">Preços de cripto via CoinGecko e taxas de câmbio atualizadas automaticamente.</p>
            </div>
            <div className="flex flex-col items-start text-start  gap-2 bg-[#F2F4F6] p-6 rounded-[15px] border-[#E3E5E9] border-2 w-full">
              <Smartphone className="bg-[#E0F5EC] text-[#0F6E56] rounded-[10px] p-3 w-12 h-12"/>
              <p>Mobile first</p>
              <p className="text-sm text-[#6A6D77]">Interface responsiva que funciona perfeitamente no celular e no desktop.</p>
            </div>
          </div>
         </div>
         <div className="flex flex-col items-center text-center bg-[#FFFFFF] p-14 "> {/* dados*/}
          <div className="bg-[#FFFFFF] rounded-[15px] border-[#E3E5E9] border-2 rounded-[15px] w-full ">
            <div className="w-full flex flex-row items-center justify-around ">
              <div className="w-full">
                  <p className="text-[40px] text-[#0F6E56]">100%</p>
                  <p className="text-[15px]">Gratuito</p>
              </div>
              <div className="border-x-2 border-[#E3E5E9] w-full">
                  <p className="text-[40px] text-[#0F6E56]">4</p>
                  <p className="text-[15px]">Páginas internas</p>
              </div>
              <div className="w-full">
                  <p className="text-[40px] text-[#0F6E56]">2</p>
                  <p className="text-[15px]" >APIs ao vivo</p>
              </div>
            </div>
          </div>
         </div>
         <div className="flex flex-col items-center text-center bg-[#F2F4F6] p-14"> {/* botão para começar*/}
          <div className="bg-[#0F6E56] text-white w-full rounded-[15px] p-10">
            <h1 className="text-[28px] font-bold">Pronto para ter controle?</h1>
            <p className="text-[12px] font-sm my-6">Crie sua conta em menos de 1 minuto. Sem cartão de crédito.</p>
            <Button variant="secondary">
              <span className="flex items-center text-[#0F6E56]">
                <ArrowRight />
                Começar agora
              </span>
            </Button>
          </div>
         </div>
      </main>
      <footer>
        <div className="flex  items-center p-4">
          <div className="flex items-center gap-2">
            <ChartPie className="bg-[#0F6E56] text-white p-1.5 w-8 h-8 rounded-[10px]" />
            <p>Moneto</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <p className="text-[12px] text-[#6A6D77]">Projeto de portfólio — Wadton Rodrigues de Paula · 2026</p>
          </div>
        </div>

      </footer>
    </div>
  );
}