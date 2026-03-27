'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type BrandType = 'home' | 'construction' | 'hardscape' | 'maintenance'

const brandConfig = {
  home: { color: '#C9A84C', name: 'Construction' },
  construction: { color: '#C9A84C', name: 'Construction' },
  hardscape: { color: '#2E7D32', name: 'Hardscape & Landscape' },
  maintenance: { color: '#1E88E5', name: 'Maintenance' },
}

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
