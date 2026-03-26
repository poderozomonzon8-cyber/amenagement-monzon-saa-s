'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronRight, CheckCircle, ArrowRight } from 'lucide-react'

export default function MarketingHome() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-black via-black to-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Gérez vos projets de construction{' '}
                <span className="text-yellow-600">simplement</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                La plateforme complète pour gérer vos projets, facturer vos clients, suivre vos employés et analyser vos performances en temps réel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold w-full sm:w-auto">
                  Essai gratuit <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/marketing/portfolio">
                <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 w-full sm:w-auto">
                  Voir les projets
                </Button>
              </Link>
            </div>

            <div className="flex gap-8 text-sm">
              <div>
                <div className="font-bold text-yellow-600">500+</div>
                <div className="text-gray-400">Projets gérés</div>
              </div>
              <div>
                <div className="font-bold text-yellow-600">1000+</div>
                <div className="text-gray-400">Utilisateurs actifs</div>
              </div>
              <div>
                <div className="font-bold text-yellow-600">99.9%</div>
                <div className="text-gray-400">Disponibilité</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-yellow-600/5 blur-3xl" />
            <div className="relative bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-8 backdrop-blur">
              <div className="space-y-4">
                <div className="h-8 bg-white/10 rounded w-3/4" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/5 rounded w-full" />
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une solution complète pour gérer votre entreprise de construction de A à Z.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Gestion des projets',
                description: 'Suivez vos projets en temps réel avec timeline, budget et avancement.',
                icon: '📊',
              },
              {
                title: 'Facturation intégrée',
                description: 'Créez et envoyez des factures professionnelles en quelques clics.',
                icon: '💳',
              },
              {
                title: 'Suivi du temps',
                description: 'Enregistrez les heures travaillées par employé et par projet.',
                icon: '⏱️',
              },
              {
                title: 'Portail client',
                description: 'Partagez l\'avancement du projet avec vos clients de façon sécurisée.',
                icon: '👥',
              },
              {
                title: 'Rapports analytiques',
                description: 'Analysez vos performances avec des graphiques détaillés.',
                icon: '📈',
              },
              {
                title: 'App mobile',
                description: 'Accédez à votre entreprise depuis n\'importe où avec l\'app PWA.',
                icon: '📱',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-8 hover:border-yellow-600/50 transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-yellow-600/10 to-yellow-600/5 border-y border-yellow-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Prêt à transformer votre gestion ?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Rejoignez les centaines d'entreprises qui font confiance à Aménagement Monzon.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
              Démarrer gratuitement <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
