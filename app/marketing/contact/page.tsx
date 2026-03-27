'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react'

const services = ['Construction & Renovations', 'Hardscape & Landscape', 'Property Maintenance', 'Other / Not Sure']

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-black px-6 lg:px-16 pt-24 pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-4">Contact</p>
          <h1 className="font-serif text-5xl md:text-6xl text-white text-balance max-w-2xl">
            Let&apos;s talk about your project.
          </h1>
          <p className="text-gray-400 mt-5 text-base max-w-xl leading-relaxed">
            Request a free, no-obligation quote or simply ask us a question. Our team typically responds within one business day.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="bg-black py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          {/* Left: contact info */}
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

          {/* Right: form */}
          <div className="md:col-span-2 border border-white/10 p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                <div className="w-12 h-12 border border-[#C9A84C] flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-[#C9A84C] -rotate-45" />
                </div>
                <h3 className="font-serif text-2xl text-white">Message received.</h3>
                <p className="text-gray-400 text-sm max-w-sm">Thank you for reaching out. A member of our team will contact you within one business day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-2">Request a Quote</p>

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
                    <label className="text-xs text-gray-400 uppercase tracking-wider">Service Needed</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors"
                    >
                      <option value="">Select a service...</option>
                      {services.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">Project Description *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your project, timeline, and any specific requirements..."
                    className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-4 py-3 text-white text-sm transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-semibold px-8 py-4 text-sm tracking-wide transition-colors self-start disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
