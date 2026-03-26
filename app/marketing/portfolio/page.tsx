'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const PORTFOLIO_PROJECTS = [
  {
    id: 1,
    title: 'Rénovation Villa Moderne',
    category: 'Rénovation',
    image: 'bg-gradient-to-br from-blue-500 to-blue-600',
    description: 'Rénovation complète d\'une villa avec cuisine moderne et salle de bain spa.',
    budget: '$125,000',
    timeline: '6 mois',
  },
  {
    id: 2,
    title: 'Extension Résidentielle',
    category: 'Construction',
    image: 'bg-gradient-to-br from-green-500 to-green-600',
    description: 'Ajout de 2 chambres et d\'une salle de famille spacieuse.',
    budget: '$85,000',
    timeline: '4 mois',
  },
  {
    id: 3,
    title: 'Aménagement Commercial',
    category: 'Commercial',
    image: 'bg-gradient-to-br from-purple-500 to-purple-600',
    description: 'Design intérieur et construction d\'un espace commercial moderne.',
    budget: '$250,000',
    timeline: '8 mois',
  },
  {
    id: 4,
    title: 'Rénovation Cuisine',
    category: 'Rénovation',
    image: 'bg-gradient-to-br from-orange-500 to-orange-600',
    description: 'Cuisine entièrement rénovée avec appareils haut de gamme.',
    budget: '$45,000',
    timeline: '2 mois',
  },
  {
    id: 5,
    title: 'Terrasse Extérieure',
    category: 'Extérieur',
    image: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
    description: 'Terrasse en bois avec cuisine extérieure et foyer.',
    budget: '$35,000',
    timeline: '3 mois',
  },
  {
    id: 6,
    title: 'Salle de Bain Luxe',
    category: 'Rénovation',
    image: 'bg-gradient-to-br from-pink-500 to-pink-600',
    description: 'Salle de bain spa avec baignoire îlot et douche à l\'italienne.',
    budget: '$28,000',
    timeline: '1.5 mois',
  },
]

export default function PortfolioPage() {
  const [filter, setFilter] = useState('All')

  const categories = ['All', ...new Set(PORTFOLIO_PROJECTS.map((p) => p.category))]
  const filtered =
    filter === 'All'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === filter)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Notre Portfolio</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Découvrez quelques-uns de nos projets réalisés pour nos clients.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setFilter(cat)}
              variant={filter === cat ? 'default' : 'outline'}
              className={
                filter === cat
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                  : 'border-white/20 hover:bg-white/10'
              }
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-600/50 transition"
            >
              <div className={`h-48 ${project.image}`} />
              <div className="p-6">
                <div className="text-sm text-yellow-600 mb-2 font-medium">{project.category}</div>
                <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{project.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-400">Budget</div>
                    <div className="font-bold text-yellow-600">{project.budget}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Durée</div>
                    <div className="font-bold text-yellow-600">{project.timeline}</div>
                  </div>
                </div>
                <Button className="w-full bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-600/50">
                  Voir détails
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Jean Dupont',
                role: 'Propriétaire',
                text: 'Service excellent et projet réalisé dans les délais. Très professionnel!',
                rating: 5,
              },
              {
                name: 'Marie Leblanc',
                role: 'Gestionnaire Projet',
                text: 'L\'équipe était attentive aux détails et à notre budget. Recommandé!',
                rating: 5,
              },
              {
                name: 'Pierre Martin',
                role: 'Propriétaire',
                text: 'Communication constante et qualité de travail impeccable.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-600">★</span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
