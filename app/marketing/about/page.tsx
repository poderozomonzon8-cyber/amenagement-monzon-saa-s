'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Award, Users, Shield, Heart, Clock, Leaf, Building, Wrench } from 'lucide-react'
import { useTranslation } from '@/lib/use-translation'

const companyValues = [
  {
    icon: Shield,
    titleKey: 'about.values.quality.title',
    descKey: 'about.values.quality.desc',
    defaultTitle: 'Quality First',
    defaultDesc: 'We never compromise on materials or craftsmanship. Every project receives our full attention to detail.'
  },
  {
    icon: Heart,
    titleKey: 'about.values.integrity.title',
    descKey: 'about.values.integrity.desc',
    defaultTitle: 'Integrity',
    defaultDesc: 'Honest pricing, transparent communication, and keeping our promises are at the core of how we work.'
  },
  {
    icon: Users,
    titleKey: 'about.values.family.title',
    descKey: 'about.values.family.desc',
    defaultTitle: 'Family Values',
    defaultDesc: 'As a family business, we treat every client and team member like extended family.'
  },
  {
    icon: Leaf,
    titleKey: 'about.values.sustainability.title',
    descKey: 'about.values.sustainability.desc',
    defaultTitle: 'Sustainability',
    defaultDesc: 'We prioritize eco-friendly practices and materials to protect our environment for future generations.'
  }
]

const milestones = [
  { year: '2014', event: 'Founded', desc: 'Started as a commercial cleaning service with a commitment to excellence and attention to detail' },
  { year: '2016', event: 'Landscape Division', desc: 'Scaled successfully into landscape design and maintenance services' },
  { year: '2018', event: 'Hardscape Services', desc: 'Expanded to include hardscape, patios, and outdoor living installations' },
  { year: '2020', event: 'Construction Division', desc: 'Added full-service construction and renovation to our service offerings' },
  { year: '2022', event: 'One-Stop Solution', desc: 'Achieved mission to become the complete property management partner' },
  { year: '2024', event: 'Regional Leader', desc: 'Now the trusted partner for comprehensive property care across Greater Montreal' }
]

const teamMembers = [
  {
    name: 'Carlos Monzon',
    role: 'Founder & CEO',
    image: '/team/carlos-monzon.jpg',
    bio: 'Carlos started Aménagement Monzon in 2014 with a commercial cleaning service. Through dedication and quality work, he scaled the business into landscape and hardscape services, then added construction. Today, his vision is to be the one-stop partner owners call to manage every aspect of their property—from maintenance to complete renovations.'
  },
  {
    name: 'Marie Tremblay',
    role: 'Operations Director',
    image: '/team/marie-tremblay.jpg',
    bio: 'Marie ensures every project runs smoothly from start to finish, coordinating teams and maintaining our high standards of quality and customer service.'
  },
  {
    name: 'Jean-Pierre Dubois',
    role: 'Head of Construction',
    image: '/team/jean-pierre-dubois.jpg',
    bio: 'A master builder with 15+ years of experience, Jean-Pierre leads our construction division with expertise in both traditional and modern building techniques.'
  }
]

export default function AboutPage() {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#C9A84C_0%,transparent_50%)]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase mb-6 text-yellow-600">
            {t('about.hero.label') || 'Our Story'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl text-white leading-tight max-w-4xl mb-8">
            {t('about.hero.title') || 'Built on Trust, Driven by Excellence'}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed">
            {t('about.hero.subtitle') || 'For over two decades, Aménagement Monzon has been transforming properties across Montreal with premium construction, hardscape, and maintenance services.'}
          </p>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-zinc-900 rounded-sm overflow-hidden relative">
                <Image
                  src="/team/founder.jpg"
                  alt="Carlos Monzon - Founder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-yellow-600/30" />
            </div>
            
            <div>
              <p className="text-xs tracking-[0.25em] uppercase mb-4 text-yellow-600">
                {t('about.founder.label') || 'Meet the Founder'}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                Carlos Monzon
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t('about.founder.bio_1') || 'What started as a passion for creating beautiful outdoor spaces has grown into one of Montreal\'s most trusted construction and landscaping companies. Carlos Monzon founded Aménagement Monzon in 2003 with a simple mission: deliver exceptional quality with honest, transparent service.'}
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                {t('about.founder.bio_2') || '"Every project is personal to me. When I see a family enjoying their new patio or a business owner welcoming customers to their renovated space, that\'s what drives us forward. We don\'t just build structures—we help create memories."'}
              </p>
              <p className="text-gray-500 italic">— Carlos Monzon, Founder & CEO</p>
              
              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
                <div>
                  <p className="font-serif text-3xl text-yellow-600">20+</p>
                  <p className="text-gray-500 text-sm mt-1">Years Experience</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-yellow-600">500+</p>
                  <p className="text-gray-500 text-sm mt-1">Projects Completed</p>
                </div>
                <div>
                  <p className="font-serif text-3xl text-yellow-600">98%</p>
                  <p className="text-gray-500 text-sm mt-1">Client Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase mb-4 text-yellow-600">
              {t('about.values.label') || 'What We Stand For'}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">
              {t('about.values.title') || 'Our Core Values'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyValues.map((value, idx) => (
              <div key={idx} className="bg-zinc-950 p-8 border border-white/5 hover:border-yellow-600/30 transition-colors group">
                <value.icon className="w-10 h-10 text-yellow-600 mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-serif text-xl text-white mb-3">
                  {t(value.titleKey) || value.defaultTitle}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {t(value.descKey) || value.defaultDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase mb-4 text-yellow-600">
              {t('about.history.label') || 'Our Journey'}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">
              {t('about.history.title') || 'Company History'}
            </h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 transform md:-translate-x-px" />
            
            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`relative flex items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-12 md:pl-0`}>
                    <div className="bg-black p-6 border border-white/5">
                      <p className="font-serif text-2xl text-yellow-600 mb-2">{milestone.year}</p>
                      <h3 className="text-white font-medium mb-2">{milestone.event}</h3>
                      <p className="text-gray-500 text-sm">{milestone.desc}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-yellow-600 rounded-full transform -translate-x-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.25em] uppercase mb-4 text-yellow-600">
              {t('about.services.label') || 'What We Do'}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">
              {t('about.services.title') || 'Three Divisions, One Standard of Excellence'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-px bg-white/10">
            <Link href="/marketing/services/construction" className="bg-black p-10 hover:bg-zinc-950 transition-colors group">
              <Building className="w-12 h-12 text-yellow-600 mb-6" />
              <h3 className="font-serif text-2xl text-white mb-3">Construction</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Residential and commercial construction, renovations, and custom building projects.
              </p>
              <span className="inline-flex items-center gap-2 text-yellow-600 text-sm font-medium group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/marketing/services/hardscape" className="bg-black p-10 hover:bg-zinc-950 transition-colors group">
              <Leaf className="w-12 h-12 text-green-600 mb-6" />
              <h3 className="font-serif text-2xl text-white mb-3">Hardscape & Landscape</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Patios, driveways, retaining walls, outdoor kitchens, and complete landscape design.
              </p>
              <span className="inline-flex items-center gap-2 text-green-600 text-sm font-medium group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <Link href="/marketing/services/maintenance" className="bg-black p-10 hover:bg-zinc-950 transition-colors group">
              <Wrench className="w-12 h-12 text-blue-500 mb-6" />
              <h3 className="font-serif text-2xl text-white mb-3">Property Maintenance</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Year-round property care including lawn care, snow removal, and seasonal services.
              </p>
              <span className="inline-flex items-center gap-2 text-blue-500 text-sm font-medium group-hover:gap-3 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-16" style={{ backgroundColor: '#C9A84C' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-black mb-6">
            {t('about.cta.title') || 'Ready to Start Your Project?'}
          </h2>
          <p className="text-black/70 text-lg mb-10 max-w-2xl mx-auto">
            {t('about.cta.subtitle') || 'Let\'s discuss how we can bring your vision to life with the quality and care that defines everything we do.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marketing/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white font-semibold px-8 py-4 text-sm tracking-wide hover:bg-zinc-900 transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/marketing/portfolio"
              className="inline-flex items-center justify-center gap-2 border-2 border-black text-black font-semibold px-8 py-4 text-sm tracking-wide hover:bg-black/10 transition-colors"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
