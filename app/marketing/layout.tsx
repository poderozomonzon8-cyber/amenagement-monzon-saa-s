import { MarketingHeader } from '@/components/marketing-header'
import Link from 'next/link'
import Image from 'next/image'
import { getCompanySettings } from '@/app/actions/settings'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getCompanySettings()

  const fbUrl = settings.facebook_url || 'https://www.facebook.com/AmenagementMonzon/'
  const igUrl = settings.instagram_url || 'https://www.instagram.com/amenagement_monzon'
  const ttUrl = settings.tiktok_url || 'https://www.tiktok.com/@amenagement_monzon'

  const fbIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
    </svg>
  )
  const igIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
  const ttIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.77a4.85 4.85 0 01-1.02-.08z"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingHeader socialLinks={{ facebook: fbUrl, instagram: igUrl, tiktok: ttUrl }} />

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
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Aménagement Monzon. All rights reserved.</p>
            <div className="flex items-center gap-4">
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-[#C9A84C] transition-colors">
                  {fbIcon}
                </a>
              )}
              {igUrl && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-[#C9A84C] transition-colors">
                  {igIcon}
                </a>
              )}
              {ttUrl && (
                <a href={ttUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-gray-400 hover:text-[#C9A84C] transition-colors">
                  {ttIcon}
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
