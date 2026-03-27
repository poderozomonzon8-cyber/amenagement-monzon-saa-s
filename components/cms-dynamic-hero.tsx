'use client'

import { useEffect, useState } from 'react'
import { getHeroContent, HeroContent } from '@/app/actions/cms'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface DynamicHeroProps {
  pageKey: string
  fallbackTitle?: string
  fallbackSubtitle?: string
  fallbackAccentColor?: string
}

export function CMSDynamicHero({
  pageKey,
  fallbackTitle = 'Premium Solutions',
  fallbackSubtitle = 'Excellence in every project',
  fallbackAccentColor = '#C9A84C',
}: DynamicHeroProps) {
  const [content, setContent] = useState<HeroContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      const data = await getHeroContent(pageKey)
      setContent(data)
      setLoading(false)
    }

    loadContent()
  }, [pageKey])

  const hero = content || {
    title: fallbackTitle,
    subtitle: fallbackSubtitle,
    cta_text: 'Get a Quote',
    cta_link: '/marketing/contact',
    media_url: undefined,
    overlay_color: 'rgba(0, 0, 0, 0.4)',
    accent_color: fallbackAccentColor,
    media_type: 'image',
  }

  const accentColor = hero.accent_color || fallbackAccentColor

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: hero.media_url && hero.media_type === 'image' 
          ? `linear-gradient(${hero.overlay_color}, ${hero.overlay_color}), url('${hero.media_url}')`
          : undefined,
        backgroundColor: !hero.media_url ? '#0a0a0a' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Video Background */}
      {hero.media_url && hero.media_type === 'video' && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={hero.media_url} type="video/mp4" />
          </video>
          <div
            className="absolute inset-0 z-10"
            style={{ backgroundColor: hero.overlay_color }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center fade-in-up">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance text-white">
          {loading ? 'Loading...' : hero.title}
        </h1>

        <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto text-pretty">
          {loading ? 'Please wait...' : hero.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={hero.cta_link}>
            <Button
              size="lg"
              style={{
                backgroundColor: accentColor,
                color: '#000',
              }}
              className="font-semibold hover-glow"
            >
              {hero.cta_text} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stats or accent line */}
        <div className="mt-16 flex justify-center">
          <div 
            className="h-1 w-24"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="text-white text-sm opacity-60">Scroll to explore</div>
      </div>
    </section>
  )
}
