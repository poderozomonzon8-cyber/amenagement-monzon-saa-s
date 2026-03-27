'use client'

import Link from 'next/link'
import { ArrowRight, Hammer, Leaf, Wrench, Shield, Clock, Award, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/use-translation'

interface MarketingHomeClientProps {
  heroData: any
  stats: any[]
  testimonials: any[]
  accentColor: string
}

export function MarketingHomeClient({
  heroData,
  stats,
  testimonials,
  accentColor,
}: MarketingHomeClientProps) {
  const { t } = useTranslation()

  const servicesList = [
    {
      icon: Hammer,
      label: t('services.construction_label'),
      color: '#C9A84C',
      description: t('services.construction_desc'),
      href: '/marketing/services/construction',
    },
    {
      icon: Leaf,
      label: t('services.hardscape_label'),
      color: '#2E7D32',
      description: t('services.hardscape_desc'),
      href: '/marketing/services/hardscape',
    },
    {
      icon: Wrench,
      label: t('services.maintenance_label'),
      color: '#1E88E5',
      description: t('services.maintenance_desc'),
      href: '/marketing/services/maintenance',
    },
  ]

  const reasonsList = [
    { icon: Shield, label: t('why.licensed'), description: t('why.licensed_desc') },
    { icon: Clock, label: t('why.ontime'), description: t('why.ontime_desc') },
    { icon: Award, label: t('why.premium'), description: t('why.premium_desc') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex flex-col justify-center bg-background px-4 sm:px-6 lg:px-16 overflow-hidden">
        {heroData.media_url && (
          <div className="absolute inset-0 z-0">
            <img 
              src={heroData.media_url} 
              alt="" 
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background/80" />
          </div>
        )}
        
        <div className="absolute top-0 left-0 h-full w-px z-10" style={{ backgroundColor: `${accentColor}20` }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none z-10" style={{ backgroundColor: `${accentColor}05` }} />

        <div className="max-w-7xl mx-auto w-full relative z-20">
          <p className="text-xs tracking-[0.25em] uppercase mb-4 sm:mb-8 font-sans text-primary" style={{ color: accentColor }}>
            Aménagement Monzon — Montréal, Québec
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl text-foreground leading-[1.05] max-w-5xl text-balance mb-4 sm:mb-8">
            {heroData.title.includes('.') ? (
              <>
                {heroData.title.split('.')[0]}.<br />
                <span style={{ color: accentColor }}>{heroData.title.split('.').slice(1).join('.').trim() || t('hero.fallback_subtitle')}</span>
              </>
            ) : (
              <>
                {heroData.title}<br />
                <span style={{ color: accentColor }}>{t('hero.fallback_subtitle')}</span>
              </>
            )}
          </h1>

          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-12 text-pretty">
            {heroData.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 hover:opacity-90 text-background font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              {heroData.cta_text || t('buttons.get_quote')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center justify-center gap-2 border hover:border-foreground text-foreground px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
              style={{ borderColor: 'currentColor' }}
            >
              {t('hero.view_work')}
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
              <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-background font-bold">{stat.value}</p>
              <p className="text-background/70 text-xs sm:text-sm mt-1 tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3 text-primary" style={{ color: accentColor }}>{t('services.section_label')}</p>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground text-balance">{t('services.section_title_1')}<br />{t('services.section_title_2')}</h2>
            </div>
            <Link
              href="/marketing/contact"
              className="inline-flex items-center gap-2 text-sm hover:underline underline-offset-4 self-start md:self-auto"
              style={{ color: accentColor }}
            >
              {t('buttons.get_quote')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border">
            {servicesList.map((service) => (
              <Link
                key={service.label}
                href={service.href}
                className="group bg-card hover:bg-card/80 p-6 sm:p-8 md:p-10 flex flex-col gap-4 sm:gap-6 transition-colors"
              >
                <div
                  className="w-12 h-12 flex items-center justify-center border"
                  style={{ borderColor: `${service.color}40`, backgroundColor: `${service.color}10` }}
                >
                  <service.icon className="w-5 h-5" style={{ color: service.color }} />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl md:text-2xl text-foreground mb-2 sm:mb-3">{service.label}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
                </div>
                <div
                  className="flex items-center gap-2 text-sm mt-auto font-medium transition-colors group-hover:gap-3"
                  style={{ color: service.color }}
                >
                  {t('buttons.learn_more')} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-16" style={{ backgroundColor: accentColor }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-background mb-3 sm:mb-4 text-balance">{t('cta_mid.title')}</h2>
          <p className="text-background/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">{t('cta_mid.subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/80 text-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              {t('cta_mid.get_quote')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center justify-center gap-2 border border-background/30 hover:border-background text-background px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              {t('cta_mid.see_portfolio')}
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-card border-y border-border py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3 text-primary" style={{ color: accentColor }}>{t('why.label')}</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-10 sm:mb-16 text-balance max-w-xl">{t('why.title')}</h2>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
            {reasonsList.map((reason) => (
              <div key={reason.label}>
                <reason.icon className="w-6 h-6 mb-4 sm:mb-5" style={{ color: accentColor }} />
                <h3 className="font-serif text-lg sm:text-xl text-foreground mb-2 sm:mb-3">{reason.label}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-background py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3 text-primary" style={{ color: accentColor }}>{t('testimonials.label')}</p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-10 sm:mb-16 text-balance">{t('testimonials.title')}</h2>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.slice(0, 3).map((t_item, i) => (
              <div key={i} className="border border-border p-6 sm:p-8 flex flex-col gap-4 sm:gap-6">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= t_item.rating ? 'fill-primary' : 'fill-muted'}`} style={{fill: star <= t_item.rating ? accentColor : 'currentColor'}} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed flex-1">&ldquo;{t_item.comment}&rdquo;</p>
                <div className="border-t border-border pt-4 sm:pt-5">
                  <p className="text-foreground font-medium text-sm">{t_item.client_name}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{t_item.client_role}</p>
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
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-background text-balance">{t('cta_bottom.title')}</h2>
            <p className="text-background/70 mt-2 sm:mt-3 text-sm sm:text-base">{t('cta_bottom.subtitle')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 bg-background hover:bg-background/80 text-foreground font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              {t('cta_bottom.get_quote')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center gap-2 border border-background/30 hover:border-background text-background px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
            >
              {t('cta_bottom.client_portal')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
