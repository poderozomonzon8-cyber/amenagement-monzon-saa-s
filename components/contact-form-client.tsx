'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight, Check, AlertCircle, Hammer, Leaf, Wrench, Clock, Shield, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createLead } from '@/app/actions/leads'
import { useLanguage } from '@/lib/i18n-context'

export function ContactFormClient() {
  const { t } = useLanguage()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'construction',
    budget: '',
    projectDescription: '',
    preferredDate: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const services = [
    { value: 'construction', label: 'Construction & Renovations', icon: Hammer, color: 'text-yellow-600' },
    { value: 'hardscape', label: 'Hardscape & Landscape', icon: Leaf, color: 'text-green-500' },
    { value: 'maintenance', label: 'Maintenance & Services', icon: Wrench, color: 'text-blue-400' },
  ]

  const budgets = [
    { value: '<5000', label: '$0 - $5,000' },
    { value: '5000-15000', label: '$5,000 - $15,000' },
    { value: '15000-50000', label: '$15,000 - $50,000' },
    { value: '50000+', label: '$50,000+' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage(null)
    try {
      const result = await createLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service_type: formData.serviceType,
        description: formData.projectDescription,
        budget: formData.budget,
        preferred_date: formData.preferredDate || null
      })
      if (result.success) {
        setStep('success')
        setFormData({ name: '', email: '', phone: '', serviceType: 'construction', budget: '', projectDescription: '', preferredDate: '' })
      } else {
        setMessage({ type: 'error', text: result.error || t('contact.error_default') })
      }
    } catch {
      setMessage({ type: 'error', text: t('contact.error_occurred') })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">

      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-green-900/10 rounded-full filter blur-3xl" />
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(201,168,76,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.4) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 min-h-screen flex">

        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-5/12 xl:w-2/5 flex-col justify-between p-10 xl:p-14 border-r border-white/5">

          {/* Logo */}
          <div>
            <Link href="/marketing">
              <Image
                src="/logo-am.png"
                alt="Aménagement Monzon"
                width={180}
                height={60}
                style={{ height: '52px', width: 'auto' }}
                className="w-auto"
                priority
              />
            </Link>
          </div>

          {/* Headline */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="relative pl-6 mb-10">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-600 via-yellow-600/40 to-transparent" />
              <p className="text-xs tracking-[0.25em] uppercase text-yellow-600 mb-4">Get in Touch</p>
              <h2 className="font-serif text-3xl xl:text-4xl text-white leading-tight mb-4 text-balance">
                Every great property<br />starts with a conversation.
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Tell us about your project. We handle everything from routine maintenance to complete transformations — one trusted team for every need.
              </p>
            </div>

            {/* Services */}
            <div className="flex flex-col gap-4 mb-10">
              {services.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.value} className="flex items-center gap-4 p-4 border border-white/5 bg-white/2 hover:bg-white/5 hover:border-white/10 transition-all duration-300 group">
                    <div className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-600/30 transition-colors`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{s.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Contact Info Pills */}
            <div className="flex flex-col gap-3">
              <a href="tel:4381234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-600 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-yellow-600/10 border border-yellow-600/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                (438) 123-4567
              </a>
              <a href="mailto:info@amenagementmonzon.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-600 transition-colors">
                <div className="w-8 h-8 rounded-full bg-yellow-600/10 border border-yellow-600/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                info@amenagementmonzon.com
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-full bg-yellow-600/10 border border-yellow-600/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-yellow-600" />
                </div>
                Greater Montreal Area
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>Since 2014</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Fast Response</span>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full lg:w-7/12 xl:w-3/5 flex items-center justify-center p-6 sm:p-10 xl:p-14">
          <div className="w-full max-w-xl">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <Link href="/marketing">
                <Image
                  src="/logo-am.png"
                  alt="Aménagement Monzon"
                  width={160}
                  height={54}
                  style={{ height: '44px', width: 'auto' }}
                  className="w-auto"
                  priority
                />
              </Link>
            </div>

            {step === 'form' ? (
              <>
                <div className="mb-8">
                  <p className="text-xs tracking-[0.25em] uppercase text-yellow-600 mb-2">{t('contact.breadcrumb')}</p>
                  <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">{t('contact.title_form')}</h1>
                  <p className="text-gray-400 text-sm">{t('contact.subtitle_form')}</p>
                </div>

                <div className="bg-white/3 backdrop-blur-sm border border-white/10 p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {message && (
                      <div className={`flex items-start gap-3 rounded p-4 text-sm ${message.type === 'error' ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
                        <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
                        <p className={message.type === 'error' ? 'text-red-400' : 'text-green-400'}>{message.text}</p>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.name_label')} *</label>
                        <input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={t('contact.name_placeholder')}
                          className="bg-white/5 border border-white/15 focus:border-yellow-600/60 focus:bg-yellow-600/5 outline-none px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.email_label')} *</label>
                        <input
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder={t('contact.email_placeholder')}
                          className="bg-white/5 border border-white/15 focus:border-yellow-600/60 focus:bg-yellow-600/5 outline-none px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.phone_label')}</label>
                        <input
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={t('contact.phone_placeholder')}
                          className="bg-white/5 border border-white/15 focus:border-yellow-600/60 focus:bg-yellow-600/5 outline-none px-4 py-3 text-white text-sm transition-all placeholder:text-gray-600"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.service_label')} *</label>
                        <select
                          required
                          value={formData.serviceType}
                          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                          className="bg-black/80 border border-white/15 focus:border-yellow-600/60 outline-none px-4 py-3 text-white text-sm transition-all"
                        >
                          {services.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.budget_label')} *</label>
                        <select
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="bg-black/80 border border-white/15 focus:border-yellow-600/60 outline-none px-4 py-3 text-white text-sm transition-all"
                        >
                          <option value="">{t('contact.budget_select')}</option>
                          {budgets.map((b) => (
                            <option key={b.value} value={b.value}>{b.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.date_label')}</label>
                        <input
                          type="date"
                          value={formData.preferredDate}
                          onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                          className="bg-black/80 border border-white/15 focus:border-yellow-600/60 focus:bg-yellow-600/5 outline-none px-4 py-3 text-white text-sm transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.description_label')} *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        placeholder={t('contact.description_placeholder')}
                        className="bg-white/5 border border-white/15 focus:border-yellow-600/60 focus:bg-yellow-600/5 outline-none px-4 py-3 text-white text-sm transition-all resize-none placeholder:text-gray-600"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold px-8 py-4 text-sm tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-yellow-600/20 mt-1"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          {t('contact.submitting')}
                        </span>
                      ) : (
                        <>
                          {t('contact.submit_button')}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Mobile contact info */}
                <div className="lg:hidden mt-8 flex flex-col gap-3 border-t border-white/10 pt-6">
                  <a href="tel:4381234567" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-600 transition-colors">
                    <Phone className="w-4 h-4 text-yellow-600" /> (438) 123-4567
                  </a>
                  <a href="mailto:info@amenagementmonzon.com" className="flex items-center gap-3 text-sm text-gray-400 hover:text-yellow-600 transition-colors">
                    <Mail className="w-4 h-4 text-yellow-600" /> info@amenagementmonzon.com
                  </a>
                </div>
              </>
            ) : (
              /* Success State */
              <div className="bg-white/3 backdrop-blur-sm border border-white/10 p-10 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-yellow-600/10 border border-yellow-600/40 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">{t('contact.success_title')}</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">{t('contact.success_description')}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setStep('form')}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-yellow-600/50 text-white px-6 py-3 text-sm tracking-wide transition-all"
                  >
                    {t('contact.another_request')}
                  </button>
                  <a
                    href="/marketing"
                    className="inline-flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-6 py-3 text-sm tracking-wide transition-all hover:shadow-lg hover:shadow-yellow-600/20"
                  >
                    {t('contact.back_home')}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
