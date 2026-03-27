'use client'

import { useState } from 'react'
import { type PortfolioItem } from '@/app/actions/cms'
import { Star } from 'lucide-react'

const categories = ['All', 'Construction', 'Hardscape', 'Maintenance']

const categoryColors: Record<string, string> = {
  construction: '#C9A84C',
  hardscape: '#2E7D32',
  maintenance: '#1E88E5',
}

interface PortfolioGridProps {
  projects: PortfolioItem[]
}

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' 
    ? projects 
    : projects.filter((p) => p.category.toLowerCase() === filter.toLowerCase())

  return (
    <>
      {/* Filter tabs */}
      <div className="flex gap-0 border border-white/20 w-fit mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="px-6 py-3 text-sm tracking-wide transition-colors"
            style={
              filter === cat
                ? { backgroundColor: '#C9A84C', color: '#000', fontWeight: 600 }
                : { color: '#9ca3af' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
        {filtered.map((project) => (
          <div key={project.id} className="bg-black p-8 flex flex-col gap-4 group relative">
            {/* Image or placeholder */}
            {project.image_url ? (
              <div className="h-44 border border-white/10 mb-2 overflow-hidden">
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div
                className="h-44 border border-white/10 mb-2"
                style={{ backgroundColor: `${categoryColors[project.category]}08` }}
              />
            )}
            
            {/* Featured badge */}
            {project.is_featured && (
              <div className="absolute top-10 right-10 bg-[#C9A84C] text-black px-2 py-1 flex items-center gap-1 text-xs font-medium">
                <Star className="w-3 h-3" />
                Featured
              </div>
            )}

            <div className="flex items-center gap-3">
              <span
                className="text-xs tracking-widest uppercase font-medium"
                style={{ color: categoryColors[project.category] }}
              >
                {project.category}
              </span>
            </div>
            <h3 className="font-serif text-xl text-white">{project.title}</h3>
            {project.description && (
              <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No projects found in this category.</p>
        </div>
      )}
    </>
  )
}
