import { MarketingHeader } from '@/components/marketing-header'
import Link from 'next/link'
import Image from 'next/image'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingHeader />

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <Image
                src="/logo-am.png"
                alt="Aménagement Monzon"
                width={160}
                height={54}
                style={{ height: '56px', width: 'auto' }}
                className="mb-4 h-auto"
              />
              <p className="text-gray-400 text-sm">Premium construction, hardscape, and landscaping solutions with 20+ years of expertise.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/marketing/services/construction" className="hover:text-yellow-600 transition-colors">Construction</Link></li>
                <li><Link href="/marketing/services/hardscape" className="hover:text-yellow-600 transition-colors">Hardscape</Link></li>
                <li><Link href="/marketing/services/maintenance" className="hover:text-yellow-600 transition-colors">Maintenance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/marketing/contact" className="hover:text-yellow-600 transition-colors">Contact</Link></li>
                <li><Link href="/auth/login" className="hover:text-yellow-600 transition-colors">Client Portal</Link></li>
                <li><Link href="/marketing/portfolio" className="hover:text-yellow-600 transition-colors">Portfolio</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>(438) 123-4567</li>
                <li>info@amenagementmonzon.com</li>
                <li>Licensed &amp; Insured</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Aménagement Monzon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
