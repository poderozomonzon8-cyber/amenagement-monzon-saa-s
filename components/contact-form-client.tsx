'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, ArrowRight, Check, AlertCircle } from 'lucide-react'
import { createLead } from '@/app/actions/leads'
import { useTranslation } from '@/lib/use-translation'

export function ContactFormClient() {
  const { t } = useTranslation()
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
    { value: 'construction', label: t('contact.service_construction') },
    { value: 'hardscape', label: t('contact.service_hardscape') },
    { value: 'maintenance', label: t('contact.service_maintenance') }
  ]

  const budgets = [
    { value: '<5000', label: t('contact.budget_under_5k') },
    { value: '5000-15000', label: t('contact.budget_5k_15k') },
    { value: '15000-50000', label: t('contact.budget_15k_50k') },
    { value: '50000+', label: t('contact.budget_50k_plus') }
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
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: 'construction',
          budget: '',
          projectDescription: '',
          preferredDate: ''
        })
      } else {
        setMessage({
          type: 'error',
          text: result.error || t('contact.error_default')
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: t('contact.error_occurred')
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-black px-4 sm:px-6 lg:px-16 pt-16 sm:pt-24 pb-10 sm:pb-16 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-3 sm:mb-4">{t('contact.breadcrumb')}</p>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-white text-balance max-w-2xl">
            {step === 'form' ? t('contact.title_form') : t('contact.title_success')}
          </h1>
          <p className="text-gray-400 mt-3 sm:mt-5 text-sm sm:text-base max-w-xl leading-relaxed">
            {step === 'form' 
              ? t('contact.subtitle_form')
              : t('contact.subtitle_success')}
          </p>
        </div>
      </section>

      <section className="bg-black py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {step === 'form' ? (
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
              {/* Contact Info */}
              <div className="flex flex-col gap-8 sm:gap-10">
                <div>
                  <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-4 sm:mb-6">{t('contact.get_in_touch')}</p>
                  <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Phone className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">{t('contact.phone_label')}</p>
                        <a href="tel:4381234567" className="text-gray-400 text-sm hover:text-white transition-colors">(438) 123-4567</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <Mail className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">{t('contact.email_label')}</p>
                        <a href="mailto:info@amenagementmonzon.com" className="text-gray-400 text-sm hover:text-white transition-colors">info@amenagementmonzon.com</a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <MapPin className="w-5 h-5 text-[#C9A84C] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium mb-1">{t('contact.area_label')}</p>
                        <p className="text-gray-400 text-sm">{t('contact.area_value')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-white/10 p-4 sm:p-6">
                  <p className="text-white text-sm font-medium mb-2 sm:mb-3">{t('contact.hours_title')}</p>
                  <div className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-400">
                    <div className="flex justify-between"><span>{t('contact.hours_weekday')}</span><span>{t('contact.hours_weekday_time')}</span></div>
                    <div className="flex justify-between"><span>{t('contact.hours_saturday')}</span><span>{t('contact.hours_saturday_time')}</span></div>
                    <div className="flex justify-between"><span>{t('contact.hours_sunday')}</span><span>{t('contact.hours_sunday_time')}</span></div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="md:col-span-2 border border-white/10 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6">
                  <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-1 sm:mb-2">{t('contact.form_label')}</p>

                  {message && (
                    <div className={`flex items-start gap-2 sm:gap-3 rounded p-3 sm:p-4 text-sm ${
                      message.type === 'error' 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-green-500/10 border border-green-500/20'
                    }`}>
                      <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 shrink-0 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`} />
                      <p className={message.type === 'error' ? 'text-red-400' : 'text-green-400'}>{message.text}</p>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.name_label')} *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('contact.name_placeholder')}
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.email_label')} *</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={t('contact.email_placeholder')}
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.phone_label')}</label>
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={t('contact.phone_placeholder')}
                        className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.service_label')} *</label>
                      <select
                        required
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                      >
                        {services.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.budget_label')} *</label>
                    <select
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                    >
                      <option value="">{t('contact.budget_select')}</option>
                      {budgets.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.date_label')}</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="bg-black border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider">{t('contact.description_label')} *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      placeholder={t('contact.description_placeholder')}
                      className="bg-transparent border border-white/20 focus:border-[#C9A84C] outline-none px-3 sm:px-4 py-2 sm:py-3 text-white text-sm transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 text-sm tracking-wide transition-colors"
                  >
                    {submitting ? t('contact.submitting') : t('contact.submit_button')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Success State */}
              <div className="border border-white/10 p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C9A84C]/10 border border-[#C9A84C] rounded-full flex items-center justify-center">
                    <Check className="w-7 h-7 sm:w-8 sm:h-8 text-[#C9A84C]" />
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3 sm:mb-4">{t('contact.success_title')}</h2>
                <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8">{t('contact.success_description')}</p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button
                    onClick={() => {
                      setStep('form')
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        serviceType: 'construction',
                        budget: '',
                        projectDescription: '',
                        preferredDate: ''
                      })
                    }}
                    className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/50 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm tracking-wide transition-colors"
                  >
                    {t('contact.another_request')}
                  </button>
                  <a
                    href="/"
                    className="inline-flex items-center justify-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-semibold px-6 sm:px-8 py-2 sm:py-3 text-sm tracking-wide transition-colors"
                  >
                    {t('contact.back_home')}
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
