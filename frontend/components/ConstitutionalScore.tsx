'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts'

interface ConstitutionalScoreProps {
  score: number
}

export default function ConstitutionalScore({ score }: ConstitutionalScoreProps) {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score }
  ]

  const getColor = (score: number) => {
    if (score >= 80) return '#22c55e' // green-500
    if (score >= 60) return '#eab308' // yellow-500
    if (score >= 40) return '#f97316' // orange-500
    return '#ef4444' // red-500
  }

  const color = getColor(score)

  return (
    <div className="h-64 w-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={180}
            endAngle={0}
            paddingAngle={0}
            dataKey="value"
          >
            <Cell key="score" fill={color} />
            <Cell key="remaining" fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
        <div className="text-4xl font-bold" style={{ color }}>
          {score}
        </div>
        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
          Constitutional Score
        </div>
      </div>
    </div>
  )
}
