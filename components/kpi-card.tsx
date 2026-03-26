'use client'

import { LucideIcon } from 'lucide-react'

export interface KPICard {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendUp?: boolean
}

export function KPICard({ card }: { card: KPICard }) {
  const Icon = card.icon

  return (
    <div className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/50 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {card.trend && (
          <div className={`text-xs font-medium px-2 py-1 rounded-full ${
            card.trendUp
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {card.trend}
          </div>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-1">{card.label}</p>
      <p className="text-2xl font-bold text-foreground">{card.value}</p>
    </div>
  )
}
