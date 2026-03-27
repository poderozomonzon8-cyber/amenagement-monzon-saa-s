import Link from 'next/link'
import { ArrowRight, Hammer, Leaf, Wrench, Shield, Clock, Award, ChevronRight } from 'lucide-react'
import { getHeroByPage, getFeaturedReviews, getAboutContent, type WebsiteHero, type Review, type WebsiteAbout } from '@/app/actions/cms'

const services = [
  {
    icon: Hammer,
    label: 'Construction',
    color: '#C9A84C',
    description: 'Interior renovations, French drains, foundation crack repair, basement waterproofing, and structural work.',
    href: '/marketing/services/construction',
  },
  {
    icon: Leaf,
    label: 'Hardscape & Landscape',
    color: '#2E7D32',
    description: 'Pavers, retaining walls, irrigation systems, lawn care, and full outdoor living design.',
    href: '/marketing/services/hardscape',
  },
  {
    icon: Wrench,
    label: 'Maintenance',
    color: '#1E88E5',
    description: 'Seasonal grass cutting plans, snow removal, power washing, and ongoing property upkeep.',
    href: '/marketing/services/maintenance',
  },
]

const reasons = [
  { icon: Shield, label: 'Licensed & Insured', description: 'Fully certified with comprehensive liability coverage on all projects.' },
  { icon: Clock, label: 'On-Time Delivery', description: 'We respect your schedule — all projects completed within agreed timelines.' },
  { icon: Award, label: 'Premium Materials', description: 'We source only top-grade materials, including certified Techno-Bloc pavers.' },
]

// Default fallback data
const defaultHero = {
  title: 'Built with precision.',
  subtitle: 'Premium construction, hardscape, and property maintenance across Montreal and the surrounding region. Over two decades of trusted craftsmanship.',
  cta_text: 'Request a Free Quote',
  accent_color: '#C9A84C',
  media_url: null,
} as const

const defaultStats = [
  { value: '20+', label: 'Years of Experience' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '$50M+', label: 'Value Constructed' },
]

const defaultTestimonials = [
  {
    client_name: 'David Tremblay',
    client_role: 'Homeowner, Laval',
    comment: 'Aménagement Monzon transformed our property completely. The attention to detail and quality of craftsmanship exceeded every expectation.',
    rating: 5,
  },
  {
    client_name: 'Sophie Gagnon',
    client_role: 'Property Manager',
    comment: 'Reliable, professional, and thorough. They handle all our seasonal maintenance and we have never had to worry about a thing.',
    rating: 5,
  },
  {
    client_name: 'Marc Beauchamp',
    client_role: 'Real Estate Developer',
    comment: 'Our go-to partner for hardscape and construction work. Their team delivers on time, on budget, every single time.',
    rating: 5,
  },
]

export default async function MarketingHome() {
  // Fetch CMS data
  const [hero, reviews, about] = await Promise.all([
    getHeroByPage('home'),
    getFeaturedReviews(),
    getAboutContent(),
  ])

  const heroData = hero || defaultHero
  const testimonials = reviews.length > 0 ? reviews : defaultTestimonials
  const stats = about ? [
    { value: `${about.years_experience}+`, label: 'Years of Experience' },
    { value: `${about.projects_completed}+`, label: 'Projects Delivered' },
    { value: '98%', label: 'Client Satisfaction' },
    { value: '$50M+', label: 'Value Constructed' },
  ] : defaultStats

  const accentColor = heroData.accent_color || '#C9A84C'

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-center bg-black px-4 sm:px-6 lg:px-16 overflow-hidden">
        {/* Background media */}
        {heroData.media_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroData.media_url} 
              alt="" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        
        {/* Subtle gold line accent */}
        <div className="absolute top-0 left-0 h-full w-px z-10" style={{ backgroundColor: `${accentColor}20` }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none z-10" style={{ backgroundColor: `${accentColor}05` }} />

        <div className="max-w-7xl mx-auto w-full relative z-20">
          {/* Eyebrow */}
          <p className="text-xs tracking-[0.25em] uppercase mb-4 sm:mb-8 font-sans" style={{ color: accentColor }}>
            Aménagement Monzon — Montréal, Québec
          </p>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-white leading-[1.05] max-w-5xl text-balance mb-4 sm:mb-8">
            {heroData.title.includes('.') ? (
              <>
                {heroData.title.split('.')[0]}.<br />
                <span style={{ color: accentColor }}>{heroData.title.split('.').slice(1).join('.').trim() || 'Finished with pride.'}</span>
              </>
            ) : (
              <>
                {heroData.title}<br />
                <span style={{ color: accentColor }}>Finished with pride.</span>
              </>
            )}
          </h1>

          <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-12 text-pretty">
            {heroData.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 hover:opacity-90 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              {heroData.cta_text}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              View Our Work
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="py-6 sm:py-8 px-4 sm:px-6" style={{ backgroundColor: accentColor }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-black font-bold">{stat.value}</p>
              <p className="text-black/70 text-xs sm:text-sm mt-1 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-black py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3" style={{ color: accentColor }}>What We Do</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-balance">Three divisions.<br />One standard of excellence.</h2>
            </div>
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 text-sm hover:underline underline-offset-4 self-start md:self-auto"
              style={{ color: accentColor }}
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {services.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="group bg-black hover:bg-[#0f0f0f] p-6 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-6 transition-colors"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border"
                  style={{ borderColor: `${service.color}40`, backgroundColor: `${service.color}10` }}
                >
                  <service.icon className="w-5 h-5" style={{ color: service.color }} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-3">{service.label}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
                <div
                  className="flex items-center gap-2 text-sm mt-auto font-medium transition-colors group-hover:gap-3"
                  style={{ color: service.color }}
                >
                  Learn More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-16" style={{ backgroundColor: accentColor }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 sm:mb-4 text-balance">Start your project today.</h2>
          <p className="text-black/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">Get your free, no-obligation quote within 24 hours. Our team is ready to help.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              Get Your Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-black/30 hover:border-black text-black px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              See Our Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-[#0a0a0a] border-y border-white/10 py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3" style={{ color: accentColor }}>Why Monzon</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-10 sm:mb-16 text-balance max-w-xl">The commitment behind every project.</h2>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {reasons.map((reason) => (
              <div key={reason.label}>
                <reason.icon className="w-6 h-6 mb-4 sm:mb-5" style={{ color: accentColor }} />
                <h3 className="font-serif text-lg sm:text-xl text-white mb-2 sm:mb-3">{reason.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3" style={{ color: accentColor }}>Client Testimonials</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-10 sm:mb-16 text-balance">What our clients say.</h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="border border-white/10 p-6 sm:p-8 flex flex-col gap-4 sm:gap-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= t.rating ? 'fill-[#C9A84C]' : 'fill-gray-700'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{t.comment}&rdquo;</p>
                <div className="border-t border-white/10 pt-4 sm:pt-5">
                  <p className="text-white font-medium text-sm">{t.client_name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.client_role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6" style={{ backgroundColor: accentColor }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 sm:gap-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black text-balance">Ready to start your project?</h2>
            <p className="text-black/70 mt-2 sm:mt-3 text-sm sm:text-base">Get a free, no-obligation quote from our team today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 bg-black hover:bg-black/80 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 border border-black/30 hover:border-black text-black px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
