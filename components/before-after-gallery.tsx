'use client'

import { useState } from 'react'

interface BeforeAfterImage {
  id: string
  before: string
  after: string
  title: string
  category: 'construction' | 'hardscape' | 'maintenance'
}

const defaultImages: BeforeAfterImage[] = [
  {
    id: '1',
    before: 'https://images.unsplash.com/photo-1585399543344-bbc5b5e8d14f?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1551455394-5b629f9b8906?w=800&h=600&fit=crop',
    title: 'Backyard Transformation',
    category: 'hardscape'
  },
  {
    id: '2',
    before: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
    title: 'Kitchen Renovation',
    category: 'construction'
  },
  {
    id: '3',
    before: 'https://images.unsplash.com/photo-1584526446717-77ec0ed3f92f?w=800&h=600&fit=crop',
    after: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop',
    title: 'Landscape Design',
    category: 'hardscape'
  }
]

export function BeforeAfterGallery() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'construction' | 'hardscape' | 'maintenance'>('all')

  const images = filter === 'all' ? defaultImages : defaultImages.filter(img => img.category === filter)

  return (
    <section className="bg-black py-28 px-6 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-4">Transformation Gallery</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white text-balance mb-6">See the difference we make.</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Beautiful transformations across construction, hardscape, and maintenance projects.</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {(['all', 'construction', 'hardscape', 'maintenance'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                filter === cat
                  ? 'bg-[#C9A84C] text-black'
                  : 'border border-white/20 text-white hover:border-white/50'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {images.map(image => (
            <div
              key={image.id}
              onMouseEnter={() => setHoveredId(image.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative overflow-hidden aspect-square border border-white/10 hover:border-[#C9A84C]/50 transition-colors"
            >
              {/* Before/After Slider */}
              <div className="relative w-full h-full">
                {/* After image (background) */}
                <img
                  src={image.after}
                  alt={`${image.title} after`}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Before image (overlay with clip path controlled by hover) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-300"
                  style={{
                    width: hoveredId === image.id ? '0%' : '50%'
                  }}
                >
                  <img
                    src={image.before}
                    alt={`${image.title} before`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: '200%' }}
                  />
                </div>

                {/* Slider divider */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    left: hoveredId === image.id ? '0%' : '50%',
                    transition: 'left 0.3s ease'
                  }}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />

                {/* Labels */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#C9A84C] text-xs tracking-widest uppercase font-medium">Before</span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[#C9A84C] text-xs tracking-widest uppercase font-medium">After</span>
                </div>

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-serif text-lg">{image.title}</p>
                  <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase">{image.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hover hint */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">Hover over images to see the transformation</p>
        </div>
      </div>
    </section>
  )
}
