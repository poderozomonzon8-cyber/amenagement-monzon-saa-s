'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const projects = [
  { id: 1, title: 'Full Kitchen Renovation', category: 'Construction', location: 'Laval, QC', year: '2024', description: 'Complete gut-and-rebuild with custom cabinetry, quartz countertops, and integrated high-end appliances.' },
  { id: 2, title: 'Paver Driveway & Patio', category: 'Hardscape', location: 'Montreal, QC', year: '2024', description: 'Full driveway and rear patio replacement using Techno-Bloc pavers with decorative border detailing.' },
  { id: 3, title: 'Residential Snow Contract', category: 'Maintenance', location: 'Longueuil, QC', year: '2023–2024', description: 'Full-season snow removal and ice management for a large residential property.' },
  { id: 4, title: 'Foundation Crack Repair', category: 'Construction', location: 'Laval, QC', year: '2024', description: 'Structural crack repair and full interior waterproofing system for a 1970s home.' },
  { id: 5, title: 'Backyard Landscape Design', category: 'Hardscape', location: 'Brossard, QC', year: '2024', description: 'Retaining walls, sod, perennial plantings, and full irrigation system for an outdoor living space.' },
  { id: 6, title: 'Basement Suite Addition', category: 'Construction', location: 'Montreal, QC', year: '2023', description: 'Full basement development with legal bedroom, bathroom, kitchenette, and egress window.' },
  { id: 7, title: 'Commercial Hardscape', category: 'Hardscape', location: 'Laval, QC', year: '2023', description: 'Professional hardscape and landscape design for a multi-unit commercial development.' },
  { id: 8, title: 'Annual Maintenance Plan', category: 'Maintenance', location: 'Repentigny, QC', year: 'Ongoing', description: 'Year-round grass cutting, fall cleanup, and snow removal for a large residential estate.' },
  { id: 9, title: 'Power Washing & Spring Cleanup', category: 'Maintenance', location: 'Laval, QC', year: '2024', description: 'Full-property spring cleanup including power washing, debris removal, and bed preparation.' },
]

const categories = ['All', 'Construction', 'Hardscape', 'Maintenance']

const categoryColors: Record<string, string> = {
  Construction: '#C9A84C',
  Hardscape: '#2E7D32',
  Maintenance: '#1E88E5',
}

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <>
      {/* Hero */}
      <section className="bg-black px-6 lg:px-16 pt-24 pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-4">Portfolio</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white text-balance max-w-2xl">
            Work we&apos;re proud of.
          </h1>
          <p className="text-gray-400 mt-5 text-base max-w-xl leading-relaxed">
            A selection of residential and commercial projects delivered across Montreal and the surrounding region.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-black py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
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
              <div key={project.id} className="bg-black p-8 flex flex-col gap-4 group">
                {/* Placeholder image area */}
                <div
                  className="h-44 border border-white/10 mb-2"
                  style={{ backgroundColor: `${categoryColors[project.category]}08` }}
                />
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs tracking-widest uppercase font-medium"
                    style={{ color: categoryColors[project.category] }}
                  >
                    {project.category}
                  </span>
                  <span className="text-gray-600 text-xs">{project.year}</span>
                </div>
                <h3 className="font-serif text-xl text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
                <p className="text-gray-600 text-xs mt-auto">{project.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C9A84C] py-20 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl text-black text-balance">Your project could be next.</h2>
            <p className="text-black/70 mt-2">Contact us today for a free consultation.</p>
          </div>
          <Link
            href="/marketing/contact"
            className="inline-flex items-center gap-2 bg-black hover:bg-black/80 text-white font-semibold px-8 py-4 text-sm tracking-wide transition-colors shrink-0"
          >
            Get a Free Quote <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
