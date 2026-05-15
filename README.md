# 💰 Moneto — Dashboard Financeiro Pessoal

> Acompanhe receitas, despesas e investimentos em um só lugar. Simples, bonito e com dados em tempo real.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)

---

## 📸 Preview

| Welcome | Login | Dashboard |
|---------|-------|-----------|
| Página inicial com apresentação do produto | Autenticação com acesso demo | Visão completa do portfólio |

| Carteira | Transações | Relatórios |
|----------|------------|------------|
| Ativos com sparklines em tempo real | Histórico com filtros e busca | Gráficos de análise mensal |

---

## ✨ Funcionalidades

- **Dashboard** com KPIs, gráfico de evolução do patrimônio e distribuição de ativos
- **Carteira** com lista de ativos, sparklines e alocação em donut chart
- **Transações** com filtros por tipo, categoria, período e busca
- **Relatórios** com comparativo mensal de receita vs despesas e gastos por categoria
- **Dados em tempo real** via CoinGecko API (cripto) e Frankfurter API (câmbio)
- **Autenticação mockada** com acesso rápido via conta demo
- **Responsivo** — sidebar no desktop, bottom navigation no mobile
- **Sessão persistida** via cookie gerenciado pelo middleware do Next.js

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework principal (App Router) |
| [React 19](https://react.dev/) | Interface e componentes |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização responsiva |
| [Chart.js](https://www.chartjs.org/) | Gráficos e sparklines |
| [CoinGecko API](https://www.coingecko.com/api) | Preços de criptomoedas (free, sem key) |
| [Frankfurter API](https://www.frankfurter.app/) | Taxas de câmbio (free, sem key) |
| [Vercel](https://vercel.com/) | Deploy e hospedagem |

---

## 📁 Estrutura do Projeto

```
FRONTEND/
├── middleware.ts                  # Gerencia sessão e proteção de rotas
│
├── app/
│   ├── layout.tsx                 # Layout raiz (fontes, metadata)
│   ├── globals.css                # Variáveis CSS e reset global
│   ├── page.tsx                   # Welcome page "/"
│   │
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx           # Tela de login
│   │
│   └── (app)/
│       ├── layout.tsx             # Layout com Sidebar + BottomNav + Header
│       ├── dashboard/page.tsx
│       ├── carteira/page.tsx
│       ├── transacoes/page.tsx
│       └── relatorios/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx            # Navegação lateral (desktop)
│   │   ├── BottomNav.tsx          # Navegação inferior (mobile)
│   │   └── Header.tsx             # Cabeçalho com título e controles
│   ├── dashboard/                 # KpiCard, LineChart, DonutChart, TxList, TopAssets
│   ├── carteira/                  # CartHero, AssetRow, AllocDonut
│   ├── transacoes/                # FilterBar, TxTable, TxSummaryCards
│   ├── relatorios/                # BarChart, CatDonut, ProgressBars
│   ├── auth/
│   │   └── LoginForm.tsx          # Formulário com botão de acesso demo
│   └── ui/
│       ├── Badge.tsx
│       ├── Card.tsx
│       └── Button.tsx
│
├── lib/
│   ├── coingecko.ts               # Funções de fetch da CoinGecko API
│   ├── frankfurter.ts             # Funções de fetch de câmbio
│   └── auth.ts                    # Lógica de login mockado e cookie de sessão
│
├── hooks/
│   ├── useCrypto.ts               # Hook para dados de cripto em tempo real
│   └── useRates.ts                # Hook para taxas de câmbio
│
└── types/
    └── finance.ts                 # Interfaces: Asset, Transaction, KPI...
```

---

## 🚀 Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/moneto.git
cd Moneto/FRONTEND

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## 🔐 Acesso Demo

Não é necessário criar conta. Use o botão **"Entrar como Demo"** na tela de login, ou:

```
E-mail: demo@moneto.app
Senha:  demo123
```

---

## 🌐 APIs utilizadas

### CoinGecko (Cripto)

```
GET https://api.coingecko.com/api/v3/simple/price
  ?ids=bitcoin,ethereum
  &vs_currencies=brl
  &include_24hr_change=true
```

Sem necessidade de API key. Limite de 30 req/min no plano gratuito.

### Frankfurter (Câmbio)

```
GET https://api.frankfurter.app/latest
  ?from=USD
  &to=BRL
```

Sem necessidade de API key. Atualizado diariamente com dados do BCE.

---

## 📱 Responsividade

| Breakpoint | Layout |
|---|---|
| `< 1024px` (mobile) | Bottom navigation + cards empilhados |
| `≥ 1024px` (desktop) | Sidebar lateral + grid de 2-4 colunas |

A troca é feita com as classes do Tailwind:

```tsx
{/* Sidebar — só no desktop */}
<aside className="hidden lg:flex ...">

{/* Bottom Nav — só no mobile */}
<nav className="flex lg:hidden fixed bottom-0 ...">
```

---

## 🗺 Rotas

| Rota | Descrição | Acesso |
|---|---|---|
| `/` | Welcome / Landing page | Público |
| `/login` | Tela de autenticação | Público |
| `/dashboard` | Visão geral do portfólio | Autenticado |
| `/carteira` | Ativos e alocação | Autenticado |
| `/transacoes` | Histórico de transações | Autenticado |
| `/relatorios` | Análise financeira mensal | Autenticado |

O `middleware.ts` redireciona automaticamente:
- Usuário logado tentando acessar `/` ou `/login` → `/dashboard`
- Usuário não logado tentando acessar rotas internas → `/login`

---

## 📦 Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Inicia o build de produção
npm run lint     # Verifica erros de lint
```

---

## 🚢 Deploy

O projeto está configurado para deploy automático na **Vercel**.

```bash
# Via Vercel CLI
npm i -g vercel
vercel
```

Ou conecte o repositório diretamente pelo [painel da Vercel](https://vercel.com/new).

---

## 👨‍💻 Autor

**Wadton Alves**

Estudante de Análise e Desenvolvimento de Sistemas — FatecSenai Cuiabá, MT.

[![Portfolio](https://img.shields.io/badge/Portfólio-ver-0F6E56?style=flat-square)](https://seu-portfolio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-conectar-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/seu-usuario)
[![GitHub](https://img.shields.io/badge/GitHub-seguir-black?style=flat-square&logo=github)](https://github.com/seu-usuario)

---

## 📄 Licença

Este projeto é open source e está disponível sob a licença [MIT](LICENSE).

---

> Projeto desenvolvido para composição de portfólio — 2026
