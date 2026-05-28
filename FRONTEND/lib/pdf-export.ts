import { Transacao } from './demo-db'

const fmt = (v: number) =>
  `R$${Math.abs(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

export function exportTransacoesPDF(transacoes: Transacao[]) {
  const totalReceitas = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((s, t) => s + t.valor, 0)

  const totalDespesas = transacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((s, t) => s + Math.abs(t.valor), 0)

  const saldo = totalReceitas - totalDespesas

  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const rows = transacoes
    .map(tx => `
      <tr>
        <td>
          <div class="tx-name">${tx.nome}</div>
        </td>
        <td>
          <span class="cat-pill" style="background:${catColor(tx.categoria)}22;color:${catColor(tx.categoria)}">
            ${tx.categoria}
          </span>
        </td>
        <td>${tx.data}</td>
        <td>
          <span class="badge ${tx.status}">
            ${tx.status === 'concluido' ? 'Concluído' : 'Pendente'}
          </span>
        </td>
        <td class="valor ${tx.tipo}">
          ${tx.tipo === 'receita' ? '+' : '−'}${fmt(tx.valor)}
        </td>
      </tr>
    `)
    .join('')

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Transações – Moneto</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1A1D23;
      background: #fff;
      font-size: 13px;
    }

    .page { padding: 44px 48px; max-width: 820px; margin: 0 auto; }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid #0F6E56;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
      background: #0F6E56;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon svg {
      width: 21px;
      height: 21px;
    }

    .logo-name {
      font-size: 20px;
      font-weight: 800;
      color: #1A1D23;
      letter-spacing: -0.3px;
    }

    .header-right { text-align: right; }
    .report-title { font-size: 16px; font-weight: 700; }
    .report-date  { font-size: 11px; color: #6A6D77; margin-top: 3px; }

    /* ── Summary cards ── */
    .summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 28px;
    }

    .card {
      padding: 16px 18px;
      border-radius: 12px;
      border: 1px solid #E3E5E9;
    }

    .card-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #6A6D77;
      margin-bottom: 8px;
    }

    .card-value {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      font-variant-numeric: tabular-nums;
    }

    .card.receita  { border-top: 3px solid #0F6E56; }
    .card.despesa  { border-top: 3px solid #EF4444; }
    .card.saldo    { border-top: 3px solid #2461EA; }
    .card.receita .card-value { color: #0F6E56; }
    .card.despesa .card-value { color: #EF4444; }
    .card.saldo   .card-value { color: #2461EA; }

    /* ── Table ── */
    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .table-title { font-size: 13px; font-weight: 700; }
    .table-count { font-size: 11px; color: #6A6D77; }

    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #E3E5E9;
    }

    thead tr { background: #F5F6F8; }

    th {
      padding: 10px 14px;
      text-align: left;
      font-size: 10px;
      font-weight: 800;
      color: #6A6D77;
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    td {
      padding: 10px 14px;
      font-size: 12px;
      border-top: 1px solid #E3E5E9;
      vertical-align: middle;
    }

    tr:hover td { background: #F9FAFB; }

    .tx-name { font-weight: 600; color: #1A1D23; }

    .cat-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
    }

    .badge {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 100px;
      font-size: 10px;
      font-weight: 700;
    }

    .badge.concluido { background: #E6F4EF; color: #0F6E56; }
    .badge.pendente  { background: #FEF3C7; color: #D97706; }

    td.valor { font-weight: 700; font-variant-numeric: tabular-nums; text-align: right; }
    td.valor.receita { color: #0F6E56; }
    td.valor.despesa { color: #EF4444; }

    th:last-child { text-align: right; }

    /* ── Footer ── */
    .footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid #E3E5E9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-left { font-size: 10px; color: #9EA1A9; }
    .footer-brand {
      font-size: 12px;
      font-weight: 800;
      color: #0F6E56;
      letter-spacing: -0.2px;
    }

    /* ── Print ── */
    @media print {
      body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .page { padding: 24px 28px; }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Header -->
    <div class="header">
      <div class="logo">
        <div class="logo-icon">
          <!-- ChartPie icon (Lucide) -->
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
            <path d="M22 12A10 10 0 0 0 12 2v10z"/>
          </svg>
        </div>
        <span class="logo-name">Moneto</span>
      </div>
      <div class="header-right">
        <div class="report-title">Extrato de Transações</div>
        <div class="report-date">Gerado em ${today}</div>
      </div>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="card receita">
        <div class="card-label">Total Receitas</div>
        <div class="card-value">${fmt(totalReceitas)}</div>
      </div>
      <div class="card despesa">
        <div class="card-label">Total Despesas</div>
        <div class="card-value">${fmt(totalDespesas)}</div>
      </div>
      <div class="card saldo">
        <div class="card-label">Saldo do período</div>
        <div class="card-value">${saldo >= 0 ? '+' : '−'}${fmt(saldo)}</div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-header">
      <span class="table-title">Transações</span>
      <span class="table-count">${transacoes.length} registros</span>
    </div>

    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th>Categoria</th>
          <th>Data</th>
          <th>Status</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        © ${new Date().getFullYear()} Moneto · Documento gerado automaticamente
      </div>
      <div class="footer-brand">moneto.app</div>
    </div>

  </div>

  <script>
    window.onload = () => {
      window.print()
      setTimeout(() => window.close(), 800)
    }
  </script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function catColor(categoria: string): string {
  const map: Record<string, string> = {
    'Renda':         '#0F6E56',
    'Alimentação':   '#F59E0B',
    'Cripto':        '#D97706',
    'Investimentos': '#2461EA',
    'Assinaturas':   '#3B82F6',
    'Moradia':       '#EF4444',
    'Transporte':    '#D85A30',
    'Saúde':         '#EC4899',
    'Outros':        '#6B7280',
  }
  return map[categoria] ?? '#6B7280'
}
