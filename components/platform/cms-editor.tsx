"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Save, Eye, Layout, BarChart2, Wrench, User, Image, Type, Plus, Trash2, Move } from "lucide-react"

const cmsSections = [
  { id: "hero", label: "Hero", icon: Layout },
  { id: "metrics", label: "Métriques", icon: BarChart2 },
  { id: "services", label: "Services", icon: Wrench },
  { id: "founder", label: "Fondateur", icon: User },
]

const defaultHero = {
  headline: "Construire l'excellence, livrer le prestige.",
  subheadline: "Aménagement Monzon — Expertise en construction haut de gamme au Québec depuis 2005.",
  ctaLabel: "Voir nos projets",
  ctaLink: "#projets",
}

const defaultMetrics = [
  { value: "20+", label: "Années d'expérience" },
  { value: "350+", label: "Projets livrés" },
  { value: "98%", label: "Clients satisfaits" },
  { value: "$180M+", label: "Valeur construite" },
]

const defaultServices = [
  { title: "Construction résidentielle", desc: "Villas, maisons unifamiliales et résidences de luxe sur mesure." },
  { title: "Rénovation commerciale", desc: "Bureaux, commerces et espaces industriels rénovés avec précision." },
  { title: "Aménagement paysager", desc: "Jardins, terrasses et espaces extérieurs conçus pour durer." },
  { title: "Gestion de projets", desc: "Coordination complète du chantier, de la conception à la livraison." },
]

const defaultFounder = {
  name: "Marco Monzon",
  title: "Fondateur & Directeur général",
  bio: "Avec plus de 20 ans d'expérience dans la construction haut de gamme, Marco Monzon a fondé l'entreprise avec la vision de livrer des projets d'exception, combinant savoir-faire artisanal et gestion rigoureuse.",
  imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
}

export function CMSEditor() {
  const [activeSection, setActiveSection] = useState("hero")
  const [saved, setSaved] = useState(false)
  const [preview, setPreview] = useState(false)

  const [hero, setHero] = useState(defaultHero)
  const [metrics, setMetrics] = useState(defaultMetrics)
  const [services, setServices] = useState(defaultServices)
  const [founder, setFounder] = useState(defaultFounder)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateMetric = (i: number, field: "value" | "label", val: string) => {
    setMetrics(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  const updateService = (i: number, field: "title" | "desc", val: string) => {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Éditeur CMS</h1>
          <p className="text-muted-foreground text-sm mt-1">Modifier le contenu du site vitrine</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={cn("flex items-center gap-2 border border-border px-4 py-2.5 rounded-sm text-sm transition-colors",
              preview ? "text-primary border-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Eye className="w-4 h-4" /> Aperçu
          </button>
          <button
            onClick={handleSave}
            className={cn("flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm transition-colors",
              saved ? "bg-green-900/20 text-green-400 border border-green-900/30" : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            <Save className="w-4 h-4" />
            {saved ? "Sauvegardé !" : "Sauvegarder"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Section nav */}
        <div className="lg:w-48 shrink-0">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Sections</p>
            </div>
            <div className="p-1">
              {cmsSections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn("flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm w-full text-left transition-colors",
                    activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <s.icon className="w-4 h-4 shrink-0" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Editor panel */}
        <div className="flex-1 min-w-0">
          {!preview ? (
            <>
              {activeSection === "hero" && (
                <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Layout className="w-4 h-4 text-primary" />
                    <h2 className="font-serif text-base text-foreground">Section Hero</h2>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Titre principal</label>
                    <input
                      value={hero.headline}
                      onChange={e => setHero({ ...hero, headline: e.target.value })}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Sous-titre</label>
                    <textarea
                      rows={3}
                      value={hero.subheadline}
                      onChange={e => setHero({ ...hero, subheadline: e.target.value })}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Texte CTA</label>
                      <input
                        value={hero.ctaLabel}
                        onChange={e => setHero({ ...hero, ctaLabel: e.target.value })}
                        className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Lien CTA</label>
                      <input
                        value={hero.ctaLink}
                        onChange={e => setHero({ ...hero, ctaLink: e.target.value })}
                        className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  {/* Preview card */}
                  <div className="border border-border rounded-sm bg-background p-6 mt-2">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Aperçu du bloc</p>
                    <h1 className="font-serif text-xl text-foreground text-balance">{hero.headline}</h1>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{hero.subheadline}</p>
                    <button className="mt-4 bg-primary text-primary-foreground text-xs px-4 py-2 rounded-sm">{hero.ctaLabel}</button>
                  </div>
                </div>
              )}

              {activeSection === "metrics" && (
                <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-primary" />
                      <h2 className="font-serif text-base text-foreground">Métriques</h2>
                    </div>
                    <button
                      onClick={() => setMetrics([...metrics, { value: "", label: "" }])}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {metrics.map((m, i) => (
                      <div key={i} className="bg-secondary rounded-sm p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Métrique {i + 1}</span>
                          <button onClick={() => setMetrics(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          value={m.value}
                          onChange={e => updateMetric(i, "value", e.target.value)}
                          placeholder="20+"
                          className="bg-input border border-border rounded-sm px-2.5 py-2 text-sm text-primary font-semibold focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <input
                          value={m.label}
                          onChange={e => updateMetric(i, "label", e.target.value)}
                          placeholder="Années d'expérience"
                          className="bg-input border border-border rounded-sm px-2.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Preview */}
                  <div className="border border-border rounded-sm bg-background p-4 mt-2">
                    <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Aperçu</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {metrics.map((m, i) => (
                        <div key={i} className="text-center">
                          <p className="font-serif text-xl text-primary">{m.value}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "services" && (
                <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-primary" />
                      <h2 className="font-serif text-base text-foreground">Services</h2>
                    </div>
                    <button
                      onClick={() => setServices([...services, { title: "", desc: "" }])}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Ajouter
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    {services.map((s, i) => (
                      <div key={i} className="bg-secondary rounded-sm p-3 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Service {i + 1}</span>
                          <button onClick={() => setServices(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-red-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <input
                          value={s.title}
                          onChange={e => updateService(i, "title", e.target.value)}
                          placeholder="Titre du service"
                          className="bg-input border border-border rounded-sm px-2.5 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        />
                        <textarea
                          value={s.desc}
                          onChange={e => updateService(i, "desc", e.target.value)}
                          placeholder="Description..."
                          rows={2}
                          className="bg-input border border-border rounded-sm px-2.5 py-2 text-xs text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "founder" && (
                <div className="bg-card border border-border rounded-sm p-5 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-primary" />
                    <h2 className="font-serif text-base text-foreground">Page Fondateur</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Nom</label>
                      <input
                        value={founder.name}
                        onChange={e => setFounder({ ...founder, name: e.target.value })}
                        className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Titre</label>
                      <input
                        value={founder.title}
                        onChange={e => setFounder({ ...founder, title: e.target.value })}
                        className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Biographie</label>
                    <textarea
                      rows={4}
                      value={founder.bio}
                      onChange={e => setFounder({ ...founder, bio: e.target.value })}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none leading-relaxed"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">URL photo</label>
                    <input
                      value={founder.imageUrl}
                      onChange={e => setFounder({ ...founder, imageUrl: e.target.value })}
                      className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  {/* Preview */}
                  <div className="border border-border rounded-sm bg-background p-5 mt-2 flex flex-col sm:flex-row gap-4">
                    <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 bg-secondary">
                      <img src={founder.imageUrl} alt={founder.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-serif text-base text-foreground">{founder.name}</p>
                      <p className="text-xs text-primary mt-0.5">{founder.title}</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{founder.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Full preview */
            <div className="bg-background border border-border rounded-sm overflow-hidden">
              <div className="bg-secondary border-b border-border px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">amenagement-monzon.ca</span>
              </div>
              <div className="p-6 sm:p-10">
                {/* Hero */}
                <div className="text-center mb-12">
                  <p className="text-xs tracking-widest text-primary uppercase mb-4">Aménagement Monzon</p>
                  <h1 className="font-serif text-3xl sm:text-4xl text-foreground text-balance">{hero.headline}</h1>
                  <p className="text-muted-foreground mt-3 max-w-lg mx-auto text-sm leading-relaxed">{hero.subheadline}</p>
                  <button className="mt-6 bg-primary text-primary-foreground px-6 py-3 text-sm rounded-sm hover:bg-primary/90">{hero.ctaLabel}</button>
                </div>
                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 border-y border-border py-8">
                  {metrics.map((m, i) => (
                    <div key={i} className="text-center">
                      <p className="font-serif text-2xl text-primary">{m.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                    </div>
                  ))}
                </div>
                {/* Services */}
                <div className="mb-12">
                  <h2 className="font-serif text-xl text-foreground mb-5 text-center">Nos services</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s, i) => (
                      <div key={i} className="border border-border p-4 rounded-sm">
                        <p className="font-serif text-sm text-foreground">{s.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Founder */}
                <div className="border border-border rounded-sm p-5 flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-24 h-24 rounded-sm overflow-hidden bg-secondary shrink-0">
                    <img src={founder.imageUrl} alt={founder.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-serif text-base text-foreground">{founder.name}</p>
                    <p className="text-xs text-primary mt-0.5">{founder.title}</p>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{founder.bio}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
