// components/dashboard/PreviewDonut.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const dados = [
  { name: 'Renda Fixa', value: 40, color: '#1D9E75' },
  { name: 'Ações',      value: 25, color: '#2461EA' },
  { name: 'Cripto',     value: 20, color: '#D85A30' },
  { name: 'Reserva',    value: 15, color: '#9EA1A9' },
]

export default function PreviewDonut() {
  return (
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={dados}
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={55}
          dataKey="value"
          strokeWidth={0}
        >
          {dados.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        {/* @ts-ignore */}
        <Tooltip formatter={(value) => [`${value}%`]} />
      </PieChart>
    </ResponsiveContainer>
  )
}