import Link from 'next/link'
import { ArrowRight, CheckCircle, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ProcessStep {
  step: number
  title: string
  description: string
}

interface Project {
  title: string
  description: string
  year: string
}

interface Testimonial {
  name: string
  role: string
  text: string
}

interface CMSHero {
  title?: string
  subtitle?: string
  cta_text?: string
  media_url?: string | null
  accent_color?: string
}

interface ServicePageProps {
  accentColor: string
  title: string
  subtitle: string
  Icon: LucideIcon
  whatWeDo: string[]
  process: ProcessStep[]
  whyChooseUs: string[]
  projects: Project[]
  testimonials: Testimonial[]
  cmsHero?: CMSHero | null
}

export function ServicePageTemplate({
  accentColor,
  title,
  subtitle,
  Icon,
  whatWeDo,
  process,
  whyChooseUs,
  projects,
  testimonials,
  cmsHero,
}: ServicePageProps) {
  // Use CMS data if available, otherwise fall back to props
  const heroTitle = cmsHero?.title || title
  const heroSubtitle = cmsHero?.subtitle || subtitle
  const heroCtaText = cmsHero?.cta_text || 'Request a Free Quote'
  const heroAccentColor = cmsHero?.accent_color || accentColor
  const heroMedia = cmsHero?.media_url

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex flex-col justify-center bg-black px-6 lg:px-16 overflow-hidden">
        {/* Background media */}
        {heroMedia && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroMedia} 
              alt="" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        
        <div className="absolute top-0 left-0 h-full w-px z-10" style={{ backgroundColor: `${heroAccentColor}30` }} />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none z-10"
          style={{ backgroundColor: `${heroAccentColor}08` }}
        />

        <div className="max-w-7xl mx-auto w-full relative z-20">
          <div
            className="w-12 h-12 flex items-center justify-center border mb-8"
            style={{ borderColor: `${heroAccentColor}40`, backgroundColor: `${heroAccentColor}12` }}
          >
            <Icon className="w-5 h-5" style={{ color: heroAccentColor }} />
          </div>

          <h1 className="font-serif text-5xl md:text-7xl text-white leading-[1.05] max-w-4xl text-balance mb-6">
            {heroTitle}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 text-pretty">
            {heroSubtitle}
          </p>
          <Link
            href="/marketing/contact"
            className="inline-flex items-center gap-2 font-semibold px-8 py-4 text-sm tracking-wide transition-colors text-black"
            style={{ backgroundColor: heroAccentColor }}
          >
            {heroCtaText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* What We Do */}
      <section className="bg-[#0a0a0a] border-y border-white/10 py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>Our Services</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">What we do</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-5">
            {whatWeDo.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accentColor }} />
                <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-black py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>How It Works</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Our process</h2>
          <div className="grid md:grid-cols-4 gap-px bg-white/10">
            {process.map((item, i) => (
              <div key={item.step} className="bg-black p-8 flex flex-col gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center text-sm font-bold text-black shrink-0"
                  style={{ backgroundColor: accentColor }}
                >
                  {String(item.step).padStart(2, '0')}
                </div>
                <h3 className="font-serif text-lg text-white">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-[#0a0a0a] border-y border-white/10 py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>Why Choose Us</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Our commitment to you</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {whyChooseUs.map((item) => {
              const [heading, ...rest] = item.split(':')
              return (
                <div key={item}>
                  <h3 className="font-serif text-lg text-white mb-2">{heading}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{rest.join(':').trim()}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="bg-black py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>Portfolio</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">Recent projects</h2>
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            {projects.map((project) => (
              <div key={project.title} className="bg-black p-8 flex flex-col gap-4">
                <div className="h-40 border border-white/10" style={{ backgroundColor: `${accentColor}08` }} />
                <p className="text-xs tracking-widest" style={{ color: accentColor }}>{project.year}</p>
                <h3 className="font-serif text-xl text-white">{project.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#0a0a0a] border-y border-white/10 py-24 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ color: accentColor }}>Client Reviews</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-12">What clients say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-white/10 p-8 flex flex-col gap-5">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className="w-3.5 h-3.5" style={{ fill: accentColor }} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white text-sm font-medium">{t.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ backgroundColor: accentColor }}>
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl text-black text-balance">Ready to get started?</h2>
            <p className="text-black/70 mt-2 text-base">Free on-site consultation, no obligations.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 bg-black hover:bg-black/80 text-white font-semibold px-8 py-4 text-sm transition-colors"
            >
              Get a Quote <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:4381234567"
              className="inline-flex items-center gap-2 border border-black/30 hover:border-black text-black px-8 py-4 text-sm transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
