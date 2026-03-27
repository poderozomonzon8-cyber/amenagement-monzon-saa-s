'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface DynamicHeroProps {
  title: string
  subtitle: string
  cta?: {
    text: string
    href: string
  }
  accentColor?: string
  backgroundImage?: string
  overlayIntensity?: number
  children?: ReactNode
}

export function DynamicHero({
  title,
  subtitle,
  cta,
  accentColor = '#C9A84C',
  backgroundImage,
  overlayIntensity = 0.7,
}: DynamicHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden page-transition">
      {/* Video or Image Background */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat parallax-hero"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0"
        style={{
          opacity: overlayIntensity,
          background: `linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0.7) 50%, rgba(10, 10, 10, 0.85) 100%)`,
        }}
      />

      {/* Dynamic Accent Gradient */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          backgroundColor: accentColor,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="space-y-4 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight text-balance">
            {title}
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
          {subtitle}
        </p>

        {cta && (
          <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link href={cta.href}>
              <Button
                size="lg"
                className="text-black font-semibold gap-2 hover-glow"
                style={{
                  backgroundColor: accentColor,
                }}
              >
                {cta.text} <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-gray-400">Scroll to explore</span>
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
