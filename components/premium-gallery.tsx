'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryItem {
  id: string
  title: string
  category: string
  image: string
  before?: string
  description?: string
}

interface PremiumGalleryProps {
  items: GalleryItem[]
  accentColor?: string
  showBeforeAfter?: boolean
}

export function PremiumGallery({
  items,
  accentColor = '#C9A84C',
  showBeforeAfter = false,
}: PremiumGalleryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({})

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, itemId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const position = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPositions((prev) => ({ ...prev, [itemId]: position }))
  }

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="fade-in-up group cursor-pointer"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Gallery Item Card */}
            <div
              className="relative overflow-hidden rounded-xl bg-black border border-white/10 hover-glow transition-all duration-300"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onMouseMove={(e) => showBeforeAfter && item.before && handleMouseMove(e, item.id)}
            >
              <div className="relative h-80 overflow-hidden">
                {/* Main Image */}
                <div className="absolute inset-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Before/After Slider */}
                {showBeforeAfter && item.before && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      clipPath: `polygon(0 0, ${sliderPositions[item.id] || 50}% 0, ${sliderPositions[item.id] || 50}% 100%, 0 100%)`,
                    }}
                  >
                    <Image
                      src={item.before}
                      alt={`${item.title} Before`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Before/After Label */}
                {showBeforeAfter && item.before && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex items-center gap-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/50 px-3 py-1 rounded">Before</span>
                      <span className="bg-black/50 px-3 py-1 rounded">After</span>
                    </div>
                  </div>
                )}

                {/* Overlay Gradient */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, ${accentColor}20 100%)`,
                  }}
                />

                {/* Hover Content */}
                {hoveredId === item.id && (
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-300 text-sm">{item.category}</p>
                    {item.description && (
                      <p className="text-gray-400 text-sm mt-2">{item.description}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accent bar */}
              <div
                className="h-1"
                style={{
                  background: accentColor,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
