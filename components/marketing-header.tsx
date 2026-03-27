'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { LanguageSelector } from '@/components/language-selector'

type BrandType = 'home' | 'construction' | 'hardscape' | 'maintenance'

interface SocialLinks {
  facebook?: string | null
  instagram?: string | null
  tiktok?: string | null
}

const brandConfig = {
  home: { color: '#C9A84C', name: 'Construction' },
  construction: { color: '#C9A84C', name: 'Construction' },
  hardscape: { color: '#2E7D32', name: 'Hardscape & Landscape' },
  maintenance: { color: '#1E88E5', name: 'Maintenance' },
}

export function MarketingHeader({ socialLinks }: { socialLinks?: SocialLinks }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const fbUrl  = socialLinks?.facebook  || 'https://www.facebook.com/AmenagementMonzon/'
  const igUrl  = socialLinks?.instagram || 'https://www.instagram.com/amenagement_monzon'
  const ttUrl  = socialLinks?.tiktok    || 'https://www.tiktok.com/@amenagements_monzon'
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  // Detect current brand based on route
  const getBrand = (): BrandType => {
    if (pathname.includes('/construction')) return 'construction'
    if (pathname.includes('/hardscape')) return 'hardscape'
    if (pathname.includes('/maintenance')) return 'maintenance'
    return 'home'
  }

  const brand = getBrand()
  const accentColor = brandConfig[brand].color

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-black/95 backdrop-blur' : 'bg-black/50 backdrop-blur'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/marketing" className="flex items-center">
            <Image
              src="/logo-am.png"
              alt="Aménagement Monzon"
              width={180}
              height={60}
              style={{ height: '48px', width: 'auto' }}
              className="w-auto h-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-12">
            <Link
              href="/marketing"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === '/marketing' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/marketing/services/construction"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname.includes('/construction') ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={pathname.includes('/construction') ? { color: accentColor } : {}}
            >
              Construction
            </Link>
            <Link
              href="/marketing/services/hardscape"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname.includes('/hardscape') ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={pathname.includes('/hardscape') ? { color: accentColor } : {}}
            >
              Hardscape
            </Link>
            <Link
              href="/marketing/services/maintenance"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname.includes('/maintenance') ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
              style={pathname.includes('/maintenance') ? { color: accentColor } : {}}
            >
              Maintenance
            </Link>
            <Link
              href="/marketing/portfolio"
              className={`text-sm font-medium transition-colors duration-300 ${
                pathname === '/marketing/portfolio' ? 'text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Portfolio
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-4 items-center">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 border-r border-white/10 pr-4">
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                </a>
              )}
              {igUrl && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              )}
              {ttUrl && (
                <a href={ttUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.77a4.85 4.85 0 01-1.02-.08z"/>
                  </svg>
                </a>
              )}
            </div>
            <Link href="/auth/login">
              <Button
                variant="ghost"
                className="text-white hover:text-white"
                style={{ borderColor: accentColor, color: accentColor }}
              >
                Client Portal
              </Button>
            </Link>
            <Link href="/marketing/contact">
              <Button style={{ backgroundColor: accentColor }} className="text-black hover:opacity-90">
                Get a Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-6 space-y-4 animate-in fade-in duration-200">
            <Link href="/marketing" className="block text-sm font-medium hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/marketing/services/construction" className="block text-sm font-medium hover:text-white transition-colors">
              Construction
            </Link>
            <Link href="/marketing/services/hardscape" className="block text-sm font-medium hover:text-white transition-colors">
              Hardscape
            </Link>
            <Link href="/marketing/services/maintenance" className="block text-sm font-medium hover:text-white transition-colors">
              Maintenance
            </Link>
            <Link href="/marketing/portfolio" className="block text-sm font-medium hover:text-white transition-colors">
              Portfolio
            </Link>
            <div className="pt-4 space-y-3">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                  Client Portal
                </Button>
              </Link>
              <Link href="/marketing/contact" className="block">
                <Button style={{ backgroundColor: accentColor }} className="w-full text-black">
                  Get a Quote
                </Button>
              </Link>
              <div className="flex items-center gap-4 pt-2">
                {fbUrl && (
                  <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
                  </a>
                )}
                {igUrl && (
                  <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                )}
                {ttUrl && (
                  <a href={ttUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.77a4.85 4.85 0 01-1.02-.08z"/></svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Accent underline that changes per brand */}
      <div
        className="h-0.5 transition-all duration-300"
        style={{ backgroundColor: accentColor, opacity: 0.3 }}
      />
    </nav>
  )
}
