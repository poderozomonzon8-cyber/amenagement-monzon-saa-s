'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, ChevronDown, LayoutGrid, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0d1829]/95 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/marketing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#0d1829] border border-amber-600/30 rounded flex items-center justify-center">
              <span className="text-amber-500 font-bold text-lg">AM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold leading-tight">Aménagement</span>
              <span className="text-amber-500 font-semibold leading-tight">Monzon</span>
              <span className="text-[10px] text-gray-500 tracking-widest">SERVICE • MAINTENANCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/marketing"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                pathname === '/marketing' ? 'text-amber-500' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" />
              HOME
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                SERVICES
                <ChevronDown className={`w-4 h-4 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#0d1829]/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-xl">
                  <Link
                    href="/marketing/services/hardscape"
                    className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Hardscape / Landscape
                  </Link>
                  <Link
                    href="/marketing/services/construction"
                    className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Construction / Renovation
                  </Link>
                  <Link
                    href="/marketing/services/maintenance"
                    className="block px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                    onClick={() => setServicesOpen(false)}
                  >
                    Maintenance / Service Plans
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/marketing/contact"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              CONTACT
            </Link>

            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              ADMIN
            </Link>

            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              PORTAL
            </Link>
          </div>

          {/* Right Side CTAs */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="flex flex-col items-center text-[10px] text-gray-400 hover:text-white transition-colors">
              <LayoutGrid className="w-5 h-5 mb-1" />
              <span>WHICH</span>
              <span>ARE</span>
              <span>YOUR</span>
              <span>NEEDS</span>
            </button>

            <Link href="/marketing/contact">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-6 flex items-center gap-2">
                <span className="flex flex-col items-start text-xs leading-tight">
                  <span>GET A</span>
                  <span>SERVICE</span>
                  <span>PLAN</span>
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 space-y-4 animate-in fade-in duration-200">
            <Link href="/marketing" className="block text-sm font-medium text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/marketing/services/hardscape" className="block text-sm font-medium text-gray-300 hover:text-white">
              Hardscape / Landscape
            </Link>
            <Link href="/marketing/services/construction" className="block text-sm font-medium text-gray-300 hover:text-white">
              Construction / Renovation
            </Link>
            <Link href="/marketing/services/maintenance" className="block text-sm font-medium text-gray-300 hover:text-white">
              Maintenance / Service Plans
            </Link>
            <Link href="/marketing/contact" className="block text-sm font-medium text-gray-300 hover:text-white">
              Contact
            </Link>
            <Link href="/auth/login" className="block text-sm font-medium text-gray-300 hover:text-white">
              Portal
            </Link>
            <div className="pt-4">
              <Link href="/marketing/contact">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Get a Service Plan
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
