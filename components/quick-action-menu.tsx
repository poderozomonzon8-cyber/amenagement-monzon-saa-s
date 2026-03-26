'use client'

import { MoreVertical, Trash2, Edit3, Copy, Share2 } from 'lucide-react'
import { useState } from 'react'

export interface QuickAction {
  label: string
  icon: React.ReactNode
  onClick: () => void
  variant?: 'default' | 'danger'
}

export function QuickActionMenu({ actions }: { actions: QuickAction[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-sm transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 bg-secondary border border-border rounded-sm shadow-lg z-10">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick()
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-background transition-colors ${
                action.variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-foreground'
              } ${index > 0 ? 'border-t border-border' : ''}`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
