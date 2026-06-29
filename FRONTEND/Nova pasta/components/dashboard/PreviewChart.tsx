// components/dashboard/PreviewChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const dados = [
  { mes: 'Nov', patrimonio: 40200, investimentos: 18000 },
  { mes: 'Dez', patrimonio: 41800, investimentos: 18500 },
  { mes: 'Jan', patrimonio: 43100, investimentos: 19200 },
  { mes: 'Fev', patrimonio: 44600, investimentos: 20100 },
  { mes: 'Mar', patrimonio: 45900, investimentos: 21000 },
  { mes: 'Abr', patrimonio: 46800, investimentos: 21800 },
  { mes: 'Mai', patrimonio: 48320, investimentos: 22500 },
]

export default function PreviewChart() {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={dados}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E3E5E9" />
        <XAxis
          dataKey="mes"
          tick={{ fontSize: 11, fill: '#6A6D77' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#6A6D77' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
        />
        {/* @ts-ignore */}
        <Tooltip formatter={(value) => [`R$${Number(value).toLocaleString('pt-BR')}`]} />
        <Line
          type="monotone"
          dataKey="patrimonio"
          stroke="#0F6E56"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="investimentos"
          stroke="#2461EA"
          strokeWidth={2}
          dot={false}
          strokeDasharray="4 3"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}