'use client'

import { MarketingHeader } from '@/components/marketing-header'
import Link from 'next/link'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingHeader />

      {/* Content */}
      <main className="page-transition">{children}</main>

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
