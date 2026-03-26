'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
  active?: boolean
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          {index > 0 && <ChevronRight className="w-4 h-4" />}
          {item.href && !item.active ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className={item.active ? 'text-foreground font-medium' : ''}>{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
