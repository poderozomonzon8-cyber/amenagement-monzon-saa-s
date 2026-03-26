'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, send to backend
    console.log('Contact form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
    }, 3000)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Contactez-nous</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Vous avez des questions ? Notre équipe est prête à vous aider.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <Mail className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-gray-400">support@amenagement-monzon.com</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <Phone className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="font-bold mb-2">Téléphone</h3>
            <p className="text-gray-400">+1 (555) 123-4567</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <MapPin className="w-8 h-8 text-yellow-600 mb-4" />
            <h3 className="font-bold mb-2">Adresse</h3>
            <p className="text-gray-400">Québec, Canada</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-8 max-w-2xl mx-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-2xl font-bold mb-2">Merci!</h3>
              <p className="text-gray-400">Votre message a été envoyé. Nous vous répondrons bientôt.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nom</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10"
                  placeholder="votre@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-white/5 border-white/10"
                  placeholder="Votre message..."
                  rows={5}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              >
                Envoyer
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
