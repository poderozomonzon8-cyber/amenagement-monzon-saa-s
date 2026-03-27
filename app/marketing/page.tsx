'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, LayoutGrid, Home, Clock, MessageCircle } from 'lucide-react'

export default function MarketingHome() {
  return (
    <div className="relative">
      {/* Full Screen Hero */}
      <section 
        className="relative min-h-screen flex items-end pb-16"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(13, 24, 41, 0.85) 0%, rgba(13, 24, 41, 0.4) 50%, rgba(13, 24, 41, 0.2) 100%), url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Captura%20de%20pantalla%202026-03-26%20203810-L3dwFgjLI9l1MdCZmJCo5NJh5aQVIw.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Main Headline */}
              <h1 className="text-[120px] md:text-[180px] font-serif italic text-white leading-none tracking-tight">
                Touch.
              </h1>

              {/* Tagline */}
              <p className="text-lg text-gray-300 max-w-xl leading-relaxed">
                Aménagement Monzon — where architectural precision meets cinematic storytelling. Every project, a masterpiece.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/marketing/portfolio">
                  <Button 
                    size="lg" 
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-8 py-6 text-sm tracking-wider"
                  >
                    EXPLORE OUR WORK
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/marketing/contact">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-sm tracking-wider"
                  >
                    GET IN TOUCH
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-16 pt-8">
                <div>
                  <div className="text-5xl font-light text-white">250+</div>
                  <div className="text-xs text-gray-400 tracking-widest mt-1">PROJECTS COMPLETED</div>
                </div>
                <div>
                  <div className="text-5xl font-light text-white">8+</div>
                  <div className="text-xs text-gray-400 tracking-widest mt-1">YEARS OF EXCELLENCE</div>
                </div>
                <div>
                  <div className="text-5xl font-light text-white">100%</div>
                  <div className="text-xs text-gray-400 tracking-widest mt-1">CLIENT SATISFACTION</div>
                </div>
              </div>
            </div>

            {/* Right Panel - Service Selection */}
            <div className="bg-[#0d1829]/80 backdrop-blur-xl border border-white/10 rounded-lg p-8 lg:mb-16">
              {/* Panel Header */}
              <div className="mb-8">
                <p className="text-xs text-amber-500 tracking-widest mb-2">BIENVENUE • WELCOME</p>
                <h2 className="text-2xl text-white font-light">Which are your needs?</h2>
              </div>

              {/* Service Options */}
              <div className="space-y-6">
                {/* Hardscape / Landscape */}
                <Link 
                  href="/marketing/services/hardscape"
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 border border-white/20 rounded-lg flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                    <LayoutGrid className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-medium group-hover:text-amber-500 transition-colors">
                      Hardscape / Landscape
                    </h3>
                    <p className="text-xs text-gray-500 tracking-widest">
                      PAVE • PATIOS • RETAINING WALLS
                    </p>
                  </div>
                </Link>

                {/* Construction / Renovation */}
                <Link 
                  href="/marketing/services/construction"
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 border border-white/20 rounded-lg flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                    <Home className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-medium group-hover:text-amber-500 transition-colors">
                      Construction / Renovation
                    </h3>
                    <p className="text-xs text-gray-500 tracking-widest">
                      RENOVATION • ADDITIONS • STRUCTURAL
                    </p>
                  </div>
                </Link>

                {/* Maintenance / Service Plans */}
                <Link 
                  href="/marketing/services/maintenance"
                  className="flex items-center gap-6 group cursor-pointer"
                >
                  <div className="w-14 h-14 border border-white/20 rounded-lg flex items-center justify-center group-hover:border-amber-500/50 transition-colors">
                    <Clock className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg text-white font-medium group-hover:text-amber-500 transition-colors">
                      Maintenance / Service Plans
                    </h3>
                    <p className="text-xs text-gray-500 tracking-widest">
                      PLANS MENSUELS • SAISONNIERS • COMMERCIAL
                    </p>
                  </div>
                </Link>
              </div>

              {/* Panel Footer */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 tracking-widest">
                  AMENAGEMENT MONZON • MONTREAL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center gap-3 bg-[#0d1829]/90 backdrop-blur border border-white/10 rounded-full pl-4 pr-2 py-2 hover:border-amber-500/50 transition-colors group">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Chat with Monzon AI</span>
          </span>
          <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  )
}
