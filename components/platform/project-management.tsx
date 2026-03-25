"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Plus, Search, ChevronRight, Camera, Clock, DollarSign,
  Calendar, MapPin, User, CheckSquare, X, Upload
} from "lucide-react"

const projects = [
  {
    id: 1, name: "Villa Beaumont", client: "M. Beaumont", location: "Outremont, Montréal",
    status: "En cours", budget: 185000, spent: 133200, progress: 72,
    start: "2025-03-15", end: "2025-09-30", team: ["Jean D.", "Marie L.", "Carlos R."],
    description: "Construction d'une villa résidentielle haut de gamme sur 3 étages avec piscine intérieure et garage souterrain.",
  },
  {
    id: 2, name: "Réno Commercial Plaza", client: "Plaza Inc.", location: "Laval, QC",
    status: "En cours", budget: 320000, spent: 144000, progress: 45,
    start: "2025-04-01", end: "2025-12-15", team: ["Jean D.", "Paulo M.", "Sarah K."],
    description: "Rénovation complète d'un centre commercial de 4 500 m² incluant hall d'entrée, boutiques et espaces communs.",
  },
  {
    id: 3, name: "Résidence Lafleur", client: "Famille Lafleur", location: "Brossard, QC",
    status: "Terminé", budget: 92500, spent: 89800, progress: 100,
    start: "2025-01-10", end: "2025-06-20", team: ["Marie L.", "Carlos R."],
    description: "Rénovation complète d'une résidence unifamiliale — cuisine, salles de bain, revêtements extérieurs.",
  },
  {
    id: 4, name: "Jardins St-Henri", client: "Coop St-Henri", location: "St-Henri, Montréal",
    status: "Planification", budget: 48000, spent: 0, progress: 10,
    start: "2025-08-01", end: "2025-11-01", team: ["Paulo M."],
    description: "Aménagement paysager de jardins communautaires avec système d'irrigation et éclairage LED.",
  },
  {
    id: 5, name: "Bureau Dupont & Ass.", client: "Dupont SA", location: "Vieux-Montréal",
    status: "En cours", budget: 215000, spent: 130150, progress: 61,
    start: "2025-02-20", end: "2025-10-10", team: ["Jean D.", "Sarah K.", "Marie L."],
    description: "Aménagement intérieur de bureaux modernes sur 3 étages : open spaces, salles de conférence, espaces détente.",
  },
]

const timelineItems = [
  { date: "2025-07-15", label: "Fondations coulées — Villa Beaumont", type: "milestone" },
  { date: "2025-07-18", label: "Livraison matériaux — Plaza", type: "delivery" },
  { date: "2025-07-22", label: "Inspection municipale — Beaumont", type: "inspection" },
  { date: "2025-07-28", label: "Début toiture — Villa Beaumont", type: "milestone" },
  { date: "2025-08-01", label: "Démarrage — Jardins St-Henri", type: "start" },
  { date: "2025-08-10", label: "Revêtement façade — Bureau Dupont", type: "milestone" },
]

const photosMock = [
  { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80", label: "Fondations" },
  { url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80", label: "Charpente" },
  { url: "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=300&q=80", label: "Façade" },
  { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=300&q=80", label: "Intérieur" },
  { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&q=80", label: "Toiture" },
  { url: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=300&q=80", label: "Finition" },
]

const statusColor: Record<string, string> = {
  "En cours": "bg-primary/20 text-primary",
  "Terminé": "bg-green-900/30 text-green-400",
  "Planification": "bg-secondary text-muted-foreground",
}

const timelineColor: Record<string, string> = {
  milestone: "bg-primary",
  delivery: "bg-blue-500",
  inspection: "bg-amber-500",
  start: "bg-green-500",
}

export function ProjectManagement() {
  const [view, setView] = useState<"list" | "detail">("list")
  const [selected, setSelected] = useState(projects[0])
  const [detailTab, setDetailTab] = useState<"overview" | "timeline" | "photos" | "expenses" | "time">("overview")
  const [search, setSearch] = useState("")

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  )

  if (view === "detail") {
    return (
      <div className="flex flex-col gap-6">
        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")} className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-sm">
            <ChevronRight className="w-4 h-4 rotate-180" /> Projets
          </button>
          <ChevronRight className="w-3 h-3 text-border" />
          <span className="text-foreground text-sm">{selected.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl text-foreground">{selected.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{selected.client}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selected.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{selected.end}</span>
            </div>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-sm self-start ${statusColor[selected.status]}`}>{selected.status}</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {(["overview", "timeline", "photos", "expenses", "time"] as const).map((t) => {
            const labels: Record<string, string> = { overview: "Aperçu", timeline: "Calendrier", photos: "Photos", expenses: "Dépenses", time: "Heures" }
            return (
              <button
                key={t}
                onClick={() => setDetailTab(t)}
                className={cn("px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors",
                  detailTab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {labels[t]}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {detailTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <div className="bg-card border border-border p-4 rounded-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Progression du budget</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground">${selected.spent.toLocaleString()} dépensé</span>
                  <span className="text-muted-foreground">/ ${selected.budget.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(selected.spent / selected.budget) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">{((selected.spent / selected.budget) * 100).toFixed(0)}% du budget utilisé</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Progression du projet</h3>
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-secondary)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-primary)" strokeWidth="3"
                        strokeDasharray={`${selected.progress} ${100 - selected.progress}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">{selected.progress}%</span>
                  </div>
                  <div>
                    <p className="text-sm text-foreground">Complétion globale</p>
                    <p className="text-xs text-muted-foreground mt-1">Fin prévue : {selected.end}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-card border border-border p-4 rounded-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Équipe</h3>
                <div className="flex flex-col gap-2">
                  {selected.team.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">{m[0]}</div>
                      <span className="text-sm text-foreground">{m}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border p-4 rounded-sm">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Dates clés</h3>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Début</span>
                    <span className="text-foreground">{selected.start}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fin prévue</span>
                    <span className="text-foreground">{selected.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="text-foreground">${selected.budget.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {detailTab === "timeline" && (
          <div className="bg-card border border-border rounded-sm p-4">
            <h3 className="font-serif text-base text-foreground mb-4">Calendrier des jalons</h3>
            <div className="flex flex-col gap-0">
              {timelineItems.map((t, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${timelineColor[t.type]}`} />
                    {i < timelineItems.length - 1 && <div className="w-px flex-1 bg-border min-h-8" />}
                  </div>
                  <div className="pb-6">
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                    <p className="text-sm text-foreground mt-0.5">{t.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailTab === "photos" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base text-foreground">Photos du chantier</h3>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-sm hover:bg-primary/90 transition-colors">
                <Upload className="w-3 h-3" /> Ajouter
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {photosMock.map((p, i) => (
                <div key={i} className="group relative aspect-video overflow-hidden rounded-sm border border-border bg-secondary">
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute bottom-0 inset-x-0 bg-background/80 px-2 py-1">
                    <p className="text-xs text-foreground">{p.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {detailTab === "expenses" && (
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-serif text-base text-foreground">Dépenses du projet</h3>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground text-xs px-3 py-2 rounded-sm hover:bg-primary/90">
                <Plus className="w-3 h-3" /> Ajouter
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { desc: "Béton armé — fondations", cat: "Matériaux", amount: 28500, date: "2025-03-18" },
                  { desc: "Main-d'œuvre semaine 1-4", cat: "Main-d'œuvre", amount: 42000, date: "2025-04-15" },
                  { desc: "Bois de charpente", cat: "Matériaux", amount: 18700, date: "2025-05-02" },
                  { desc: "Location grue", cat: "Équipement", amount: 9800, date: "2025-05-10" },
                  { desc: "Fenêtres et portes", cat: "Matériaux", amount: 34200, date: "2025-06-01" },
                ].map((e, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-foreground">{e.desc}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{e.cat}</td>
                    <td className="px-4 py-3 text-primary font-medium">${e.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {detailTab === "time" && (
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-serif text-base text-foreground">Suivi des heures</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Employé</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Heures semaine</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Total projet</th>
                </tr>
              </thead>
              <tbody>
                {selected.team.map((m, i) => (
                  <tr key={m} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-foreground">{m}</td>
                    <td className="px-4 py-3 text-foreground">{[40, 38, 42][i % 3]}h</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{[320, 298, 354][i % 3]}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} projets au total</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => { setSelected(p); setView("detail") }}
            className="bg-card border border-border rounded-sm p-4 text-left hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-sm shrink-0 ml-2 ${statusColor[p.status]}`}>{p.status}</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.client}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.start} → {p.end}</span>
            </div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-foreground">{p.progress}%</span>
              <span className="text-muted-foreground">${p.budget.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
