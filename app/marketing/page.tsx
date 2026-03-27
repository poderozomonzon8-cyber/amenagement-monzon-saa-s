import Link from 'next/link'
import { ArrowRight, Hammer, Leaf, Wrench, Shield, Clock, Award, ChevronRight } from 'lucide-react'

const stats = [
  { value: '20+', label: 'Years of Experience' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '$50M+', label: 'Value Constructed' },
]

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

const testimonials = [
  {
    name: 'David Tremblay',
    role: 'Homeowner, Laval',
    quote: 'Aménagement Monzon transformed our property completely. The attention to detail and quality of craftsmanship exceeded every expectation.',
  },
  {
    name: 'Sophie Gagnon',
    role: 'Property Manager',
    quote: 'Reliable, professional, and thorough. They handle all our seasonal maintenance and we have never had to worry about a thing.',
  },
  {
    name: 'Marc Beauchamp',
    role: 'Real Estate Developer',
    quote: 'Our go-to partner for hardscape and construction work. Their team delivers on time, on budget, every single time.',
  },
]

const reasons = [
  { icon: Shield, label: 'Licensed & Insured', description: 'Fully certified with comprehensive liability coverage on all projects.' },
  { icon: Clock, label: 'On-Time Delivery', description: 'We respect your schedule — all projects completed within agreed timelines.' },
  { icon: Award, label: 'Premium Materials', description: 'We source only top-grade materials, including certified Techno-Bloc pavers.' },
]

export default function MarketingHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-center bg-black px-6 lg:px-16 overflow-hidden">
        {/* Subtle gold line accent */}
        <div className="absolute top-0 left-0 h-full w-px bg-[#C9A84C]/20" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-[#C9A84C]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full">
          {/* Eyebrow */}
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-8 font-sans">
            Aménagement Monzon — Montréal, Québec
          </p>

          {/* Headline */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[1.05] max-w-5xl text-balance mb-8">
            Built with precision.<br />
            <span className="text-[#C9A84C]">Finished with pride.</span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-12 text-pretty">
            Premium construction, hardscape, and property maintenance across Montreal and the surrounding region. Over two decades of trusted craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-semibold px-8 py-4 text-sm tracking-wide transition-colors"
            >
              Request a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-8 py-4 text-sm tracking-wide transition-colors"
            >
              View Our Work
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-[#C9A84C] py-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl text-black font-bold">{stat.value}</p>
              <p className="text-black/70 text-sm mt-1 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-black py-28 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-3">What We Do</p>
              <h2 className="font-serif text-4xl md:text-5xl text-white text-balance">Three divisions.<br />One standard of excellence.</h2>
            </div>
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 text-[#C9A84C] text-sm hover:underline underline-offset-4 self-start md:self-auto"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {services.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="group bg-black hover:bg-[#0f0f0f] p-10 flex flex-col gap-6 transition-colors"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border"
                  style={{ borderColor: `${service.color}40`, backgroundColor: `${service.color}10` }}
                >
                  <service.icon className="w-5 h-5" style={{ color: service.color }} />
                </div>
                <div>
                  <h3 className="font-serif text-2xl text-white mb-3">{service.label}</h3>
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

      {/* Why choose us */}
      <section className="bg-[#0a0a0a] border-y border-white/10 py-28 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-3">Why Monzon</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-16 text-balance max-w-xl">The commitment behind every project.</h2>

          <div className="grid md:grid-cols-3 gap-12">
            {reasons.map((reason) => (
              <div key={reason.label}>
                <reason.icon className="w-6 h-6 text-[#C9A84C] mb-5" />
                <h3 className="font-serif text-xl text-white mb-3">{reason.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-28 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-3">Client Testimonials</p>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-16 text-balance">What our clients say.</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-white/10 p-8 flex flex-col gap-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-4 h-4 fill-[#C9A84C]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-white/10 pt-5">
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C9A84C] py-24 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-black text-balance">Ready to start your project?</h2>
            <p className="text-black/70 mt-3 text-base">Get a free, no-obligation quote from our team today.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 bg-black hover:bg-black/80 text-white font-semibold px-8 py-4 text-sm tracking-wide transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 border border-black/30 hover:border-black text-black px-8 py-4 text-sm tracking-wide transition-colors"
            >
              Client Portal
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
