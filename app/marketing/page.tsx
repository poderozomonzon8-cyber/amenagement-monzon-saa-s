'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, CheckCircle, ArrowRight, Hammer, Leaf, Wrench, Star } from 'lucide-react'

export default function MarketingHome() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-black to-slate-900 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div>
              <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-balance">
                Premium Outdoor & Construction Solutions
              </h1>
              <p className="text-xl text-gray-300 mb-8 text-pretty">
                Hardscape, Landscape, Renovation & Maintenance — Done Right. From design to completion, trust Aménagement Monzon for quality craftsmanship and professional service.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/marketing/contact">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold w-full sm:w-auto">
                  Get a Quote <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/marketing/portfolio">
                <Button size="lg" variant="outline" className="border-yellow-600/50 hover:bg-yellow-600/10 text-yellow-600 w-full sm:w-auto">
                  View Our Work
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="font-bold text-3xl text-yellow-600">20+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div>
                <div className="font-bold text-3xl text-yellow-600">500+</div>
                <div className="text-gray-400">Projects Completed</div>
              </div>
              <div>
                <div className="font-bold text-3xl text-yellow-600">100%</div>
                <div className="text-gray-400">Client Satisfied</div>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-600/5 blur-3xl rounded-2xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/0 border border-yellow-600/30 rounded-2xl p-12 backdrop-blur-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🏗️</div>
                <p className="text-gray-300">Professional Construction & Landscaping</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services: 3 Main Divisions */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Complete solutions for all your construction, landscape, and maintenance needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Construction */}
            <div className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 hover:border-yellow-600/50 transition">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-600/30 transition">
                <Hammer className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-2xl mb-4">Construction</h3>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Interior renovations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>French drains</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Foundation crack repair</span>
                </li>
              </ul>
              <Link href="/marketing/contact">
                <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700 w-full justify-start pl-0">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Hardscape & Landscape */}
            <div className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 hover:border-yellow-600/50 transition">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-600/30 transition">
                <Leaf className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-2xl mb-4">Hardscape & Landscape</h3>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Pavers (Techno Block)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Retaining walls</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Irrigation & Lawn</span>
                </li>
              </ul>
              <Link href="/marketing/contact">
                <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700 w-full justify-start pl-0">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Maintenance */}
            <div className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl p-8 hover:border-yellow-600/50 transition">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-600/30 transition">
                <Wrench className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-bold text-2xl mb-4">Maintenance</h3>
              <ul className="space-y-3 mb-6 text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Grass cutting plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Snow removal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <span>Power washing</span>
                </li>
              </ul>
              <Link href="/marketing/contact">
                <Button variant="ghost" className="text-yellow-600 hover:text-yellow-700 w-full justify-start pl-0">
                  Learn More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Client Testimonials</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Hear from our satisfied clients about their experience with Aménagement Monzon
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'John Smith',
                role: 'Homeowner',
                text: 'Exceptional work quality and professionalism. The team transformed our backyard into a beautiful outdoor living space.',
                rating: 5,
              },
              {
                name: 'Sarah Johnson',
                role: 'Property Manager',
                text: 'Reliable, punctual, and detail-oriented. Aménagement Monzon handles all our maintenance needs seamlessly.',
                rating: 5,
              },
              {
                name: 'Mike Davis',
                role: 'Real Estate Developer',
                text: 'Perfect partner for renovation projects. Their design sense and execution are top-notch.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array(testimonial.rating).fill(0).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-600 text-yellow-600" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6">{testimonial.text}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-600/10 via-black to-yellow-600/5 border-y border-yellow-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Contact Aménagement Monzon today for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketing/contact">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button size="lg" variant="outline" className="border-yellow-600/50 hover:bg-yellow-600/10 text-yellow-600 w-full">
                Client Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
