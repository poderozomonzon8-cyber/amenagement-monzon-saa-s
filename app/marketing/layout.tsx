'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/marketing" className="text-2xl font-bold">
              <span className="text-yellow-600">Aménagement</span> Monzon
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              <Link href="/marketing" className="hover:text-yellow-600 transition">
                Home
              </Link>
              <Link href="/marketing/portfolio" className="hover:text-yellow-600 transition">
                Portfolio
              </Link>
              <Link href="/marketing/contact" className="hover:text-yellow-600 transition">
                Contact
              </Link>
            </div>

            <div className="hidden md:flex gap-4 items-center">
              <Link href="/marketing/contact" className="text-sm hover:text-yellow-600 transition">
                Contact
              </Link>
              <Link href="/auth/login" className="hover:text-yellow-600 transition">
                <Button variant="ghost" className="text-white hover:text-yellow-600">
                  Client Portal
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 flex flex-col gap-4">
              <Link href="/marketing" className="hover:text-yellow-600">
                Home
              </Link>
              <Link href="/marketing/portfolio" className="hover:text-yellow-600">
                Portfolio
              </Link>
              <Link href="/marketing/contact" className="hover:text-yellow-600">
                Contact
              </Link>
              <Link href="/auth/login" className="hover:text-yellow-600">
                Client Portal
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="font-bold mb-4 text-yellow-600">Aménagement Monzon</h3>
              <p className="text-gray-400 text-sm">Premium construction, hardscape, and landscaping solutions with 20+ years of expertise.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#" className="hover:text-yellow-600">Construction</Link></li>
                <li><Link href="#" className="hover:text-yellow-600">Hardscape & Landscape</Link></li>
                <li><Link href="#" className="hover:text-yellow-600">Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/marketing/contact" className="hover:text-yellow-600">Contact</Link></li>
                <li><Link href="/auth/login" className="hover:text-yellow-600">Client Portal</Link></li>
                <li><Link href="/marketing/portfolio" className="hover:text-yellow-600">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>📞 (555) 123-4567</li>
                <li>📧 info@amenagementmonzon.com</li>
                <li>📍 Licensed & Insured</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Aménagement Monzon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
