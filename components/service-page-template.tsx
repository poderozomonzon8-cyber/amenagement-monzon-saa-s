'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight, Star, Phone } from 'lucide-react'

interface ServicePageProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  whatWeDo: string[]
  process: Array<{ step: number; title: string; description: string }>
  whyChooseUs: string[]
  projects: Array<{ title: string; description: string; year: string }>
  testimonials: Array<{ name: string; role: string; text: string }>
}

export function ServicePageTemplate({
  title,
  subtitle,
  icon,
  whatWeDo,
  process,
  whyChooseUs,
  projects,
  testimonials,
}: ServicePageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-black via-black to-slate-900 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-600/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-yellow-600/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="text-4xl">{icon}</div>
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight text-balance">
                  {title}
                </h1>
                <p className="text-xl text-gray-300 text-pretty">{subtitle}</p>
              </div>
            </div>

            <Link href="/marketing/contact">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold w-full sm:w-auto">
                Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-600/5 blur-3xl rounded-2xl" />
            <div className="relative bg-gradient-to-br from-white/10 to-white/0 border border-yellow-600/30 rounded-2xl p-12 backdrop-blur-xl h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{icon}</div>
                <p className="text-gray-300">Professional Service Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">What We Do</h2>
          <div className="prose prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-8">
              {whatWeDo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-300 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-white/5 to-white/0 border border-yellow-600/30 rounded-xl p-8">
                  <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-12 -right-4 w-8 h-1 bg-yellow-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Why Choose Aménagement Monzon</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-3xl">
            With 20+ years of industry experience, we deliver premium quality work backed by professional expertise and attention to detail.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <Star className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.split(':')[0]}</h3>
                  <p className="text-gray-400">{item.split(':')[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Examples */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">Recent Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="group bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-600/50 transition">
                <div className="h-64 bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 flex items-center justify-center">
                  <div className="text-6xl opacity-50">🏗️</div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-yellow-600 mb-2">{project.year}</div>
                  <h3 className="font-bold text-xl mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <a href="#" className="text-yellow-600 hover:text-yellow-700 font-semibold inline-flex items-center">
                    View Project <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Approach */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Transparent Pricing</h2>
          <p className="text-gray-300 text-lg mb-8">
            We believe in clear, upfront pricing with no hidden costs. Every project is unique, and we provide detailed quotes based on your specific needs, materials, and scope of work. Our pricing reflects premium quality and professional expertise.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="font-bold text-yellow-600 text-2xl mb-2">Assessment</div>
              <p className="text-gray-400">Free on-site evaluation</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="font-bold text-yellow-600 text-2xl mb-2">Quote</div>
              <p className="text-gray-400">Detailed, itemized estimate</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="font-bold text-yellow-600 text-2xl mb-2">Execution</div>
              <p className="text-gray-400">Quality work, on schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">What Our Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-600 text-yellow-600" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">{testimonial.text}</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-600/10 via-black to-yellow-600/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Contact Aménagement Monzon today for a free consultation and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/marketing/contact">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                Request a Quote <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href="tel:5551234567">
              <Button size="lg" variant="outline" className="border-yellow-600/50 hover:bg-yellow-600/10 text-yellow-600 w-full sm:w-auto">
                <Phone className="mr-2 w-4 h-4" /> Call Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
