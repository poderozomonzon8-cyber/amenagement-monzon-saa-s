'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { submitLead, getQuoteForLead } from '@/app/actions/leads'
import type { LeadData } from '@/app/actions/leads'

const services = [
  { value: 'construction', label: 'Construction & Renovations' },
  { value: 'hardscape', label: 'Hardscape & Landscape' },
  { value: 'maintenance', label: 'Property Maintenance' }
]

const budgets = [
  { value: '<5000', label: 'Under $5,000' },
  { value: '5000-15000', label: '$5,000 - $15,000' },
  { value: '15000-50000', label: '$15,000 - $50,000' },
  { value: '50000+', label: '$50,000+' }
]

export default function ContactPage() {
  const [step, setStep] = useState<'form' | 'quote'>('form')
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    service_type: 'construction',
    budget_range: '',
    project_description: '',
    preferred_date: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [quoteData, setQuoteData] = useState<any>(null)
  const [projectId, setProjectId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await submitLead(formData)

      if (result.success && result.projectId) {
        setProjectId(result.projectId)
        
        // Fetch quote data
        const quote = await getQuoteForLead(result.projectId)
        setQuoteData(quote)
        setStep('quote')
      } else {
        setError(result.error || 'Failed to submit form')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const priceRange = quoteData?.estimatedRange

  return (
    <>
      {/* Hero */}
      <section className="bg-black px-6 lg:px-16 pt-24 pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-4">Contact</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white text-balance max-w-2xl">
            {step === 'form' ? "Let's talk about your project." : 'Your estimated price range'}
          </h1>
          <p className="text-gray-400 mt-5 text-base max-w-xl leading-relaxed">
            {step === 'form' 
              ? 'Request a free, no-obligation quote or simply ask us a question. Our team typically responds within one business day.'
              : 'Based on your project details, here is your estimated budget range. Ready to move forward?'}
          </p>
        </div>
      </section>

      <section className="bg-black py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {step === 'form' ? (
            <div className="grid md:grid-cols-3 gap-16">
              {/* Contact Info */}
              <div className="flex flex-col gap-10">
                <div>
                  <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-6">Get In Touch</p>
                  <div className="flex flex-col gap-8">
                    <div className="flex items-start gap-4">
                      <Phone className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">Phone</p>
                        <a href="tel:4381234567" className="text-gray-400 text-sm hover:text-white transition-colors">(438) 123-4567</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">Email</p>
                        <a href="mailto:info@amenagementmonzon.com" className="text-gray-400 text-sm hover:text-white transition-colors">info@amenagementmonzon.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <MapPin className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">Service Area</p>
                        <p className="text-gray-400 text-sm">Montreal, Laval, Longueuil,<br />and surrounding regions</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 p-6">
                  <p className="text-white text-sm font-medium mb-2">Business Hours</p>
                  <div className="flex flex-col gap-1.5 text-sm text-gray-400">
                    <div className="flex justify-between"><span>Monday – Friday</span><span>7:00am – 6:00pm</span></div>
                    <div className="flex justify-between"><span>Saturday</span><span>8:00am – 4:00pm</span></div>
                    <div className="flex justify-between"><span>Sunday</span><span>Closed</span></div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-2 border border-white/10 p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-2">Get Your Free Quote</p>

                  {error && (
                    <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded p-4">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Full Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Jean Tremblay"
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Email Address *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jean@example.com"
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Phone Number</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(514) 000-0000"
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">Service Type *</label>
                      <select
                        required
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value as any })}
                        className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                      >
                        {services.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Budget Range *</label>
                    <select
                      required
                      value={formData.budget_range}
                      onChange={(e) => setFormData({ ...formData, budget_range: e.target.value })}
                      className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                    >
                      <option value="">Select a budget...</option>
                      {budgets.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Preferred Start Date</label>
                    <input
                      type="date"
                      value={formData.preferred_date || ''}
                      onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Project Description *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.project_description}
                      onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                      placeholder="Describe your project, timeline, and any specific requirements..."
                      className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold px-8 py-4 text-sm tracking-wide transition-colors self-start"
                  >
                    {loading ? 'Sending...' : 'Get Estimated Quote'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Success State */}
              <div className="border border-white/10 p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-[#C9A84C]/10 border border-[#C9A84C] rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-[#C9A84C]" />
                  </div>
                </div>

                <h2 className="font-serif text-3xl text-white mb-4">Thank You!</h2>
                <p className="text-gray-400 mb-8">Your quote request has been received. Based on the information you provided, here's your estimated price range:</p>

                {priceRange && (
                  <div className="grid md:grid-cols-2 gap-8 mb-12 py-8 border-y border-white/10">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Estimated Range</p>
                      <p className="text-4xl font-serif text-white">${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-2">*Final price depends on site assessment</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Service Type</p>
                      <p className="text-2xl font-serif text-[#C9A84C]">{quoteData.serviceType.charAt(0).toUpperCase() + quoteData.serviceType.slice(1)}</p>
                      <p className="text-sm text-gray-400 mt-2">{quoteData.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                )}

                <p className="text-gray-400 text-sm mb-8">Our team will contact you within 1 business day with a detailed quote and to answer any questions.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setStep('form')
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        service_type: 'construction',
                        budget_range: '',
                        project_description: '',
                        preferred_date: ''
                      })
                    }}
                    className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white px-8 py-3 text-sm tracking-wide transition-colors"
                  >
                    Submit Another Request
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-semibold px-8 py-3 text-sm tracking-wide transition-colors"
                  >
                    Back Home
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
