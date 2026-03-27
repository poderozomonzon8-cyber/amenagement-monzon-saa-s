import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPortfolioItems, type PortfolioItem } from '@/app/actions/cms'
import { PortfolioGrid } from './portfolio-grid'

// Default fallback projects
const defaultProjects = [
  { id: '1', title: 'Full Kitchen Renovation', category: 'construction' as const, description: 'Complete gut-and-rebuild with custom cabinetry, quartz countertops, and integrated high-end appliances.', image_url: '', is_featured: false, display_order: 0, created_at: '', updated_at: '' },
  { id: '2', title: 'Paver Driveway & Patio', category: 'hardscape' as const, description: 'Full driveway and rear patio replacement using Techno-Bloc pavers with decorative border detailing.', image_url: '', is_featured: false, display_order: 1, created_at: '', updated_at: '' },
  { id: '3', title: 'Residential Snow Contract', category: 'maintenance' as const, description: 'Full-season snow removal and ice management for a large residential property.', image_url: '', is_featured: false, display_order: 2, created_at: '', updated_at: '' },
  { id: '4', title: 'Foundation Crack Repair', category: 'construction' as const, description: 'Structural crack repair and full interior waterproofing system for a 1970s home.', image_url: '', is_featured: false, display_order: 3, created_at: '', updated_at: '' },
  { id: '5', title: 'Backyard Landscape Design', category: 'hardscape' as const, description: 'Retaining walls, sod, perennial plantings, and full irrigation system for an outdoor living space.', image_url: '', is_featured: false, display_order: 4, created_at: '', updated_at: '' },
  { id: '6', title: 'Basement Suite Addition', category: 'construction' as const, description: 'Full basement development with legal bedroom, bathroom, kitchenette, and egress window.', image_url: '', is_featured: false, display_order: 5, created_at: '', updated_at: '' },
]

export const metadata = {
  title: 'Portfolio — Aménagement Monzon',
  description: 'View our portfolio of construction, hardscape, and maintenance projects across Montreal and surrounding regions.',
}

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems()
  const projects = portfolioItems.length > 0 ? portfolioItems : defaultProjects

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
          <PortfolioGrid projects={projects} />
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
