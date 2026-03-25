"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, FolderOpen, Calendar, MessageSquare,
  FileText, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle
} from "lucide-react"

const clientNav = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "projects", label: "Mes projets", icon: FolderOpen },
  { id: "calendar", label: "Calendrier", icon: Calendar },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "invoices", label: "Factures", icon: FileText },
]

const clientProject = {
  name: "Villa Beaumont",
  status: "En cours",
  progress: 72,
  nextMilestone: "Début toiture — 28 juillet",
  sitePhotos: [
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
    "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&q=80",
  ],
  updates: [
    { date: "18 juil.", text: "Fondations complétées avec succès. Inspection approuvée.", type: "success" },
    { date: "12 juil.", text: "Livraison du bois de charpente prévue le 28 juillet.", type: "info" },
    { date: "05 juil.", text: "Travaux d'excavation terminés.", type: "success" },
  ],
}

const messages = [
  { sender: "Jean Dupont", role: "Chef de chantier", time: "Auj. 10:32", text: "Bonjour M. Beaumont, les fondations ont été inspectées ce matin et tout est conforme. Les travaux de charpente débuteront le 28 juillet comme prévu.", unread: true },
  { sender: "Monzon Bureau", role: "Administration", time: "Hier 14:15", text: "Votre facture INV-2025-041 a été confirmée. Merci pour votre paiement.", unread: false },
  { sender: "Marie Lavoie", role: "Architecte", time: "Lun. 09:00", text: "Les plans révisés pour les fenêtres du 2e étage sont disponibles dans votre portail.", unread: false },
]

const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)
const events: Record<number, string[]> = {
  18: ["Inspection fondations"],
  22: ["Visite du chantier"],
  28: ["Début toiture"],
}

const clientInvoices = [
  { id: "INV-2025-041", amount: 45000, status: "Payée", date: "2025-07-01" },
  { id: "INV-2025-038", amount: 30000, status: "Payée", date: "2025-05-15" },
  { id: "INV-2025-044", amount: 50000, status: "En attente", date: "2025-08-01" },
]

export function ClientPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [message, setMessage] = useState("")

  return (
    <div className="flex flex-col gap-6">
      {/* Client header */}
      <div className="bg-card border border-border rounded-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="font-serif text-primary text-lg font-bold">B</span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Portail Client</p>
          <h1 className="font-serif text-xl text-foreground">Bienvenue, M. Beaumont</h1>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {clientNav.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveTab(n.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors",
              activeTab === n.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <n.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{n.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main project card */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-serif text-lg text-foreground">{clientProject.name}</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Prochain jalon : {clientProject.nextMilestone}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-sm bg-primary/20 text-primary">{clientProject.status}</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-secondary)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-primary)" strokeWidth="3"
                      strokeDasharray={`${clientProject.progress} ${100 - clientProject.progress}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">{clientProject.progress}%</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${clientProject.progress}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{clientProject.progress}% complété</p>
                </div>
              </div>
              {/* Updates */}
              <div className="flex flex-col gap-2 mt-3">
                {clientProject.updates.map((u, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    {u.type === "success" ? <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
                    <div>
                      <span className="text-xs text-muted-foreground mr-2">{u.date}</span>
                      <span className="text-foreground">{u.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Site photos */}
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="font-serif text-sm text-foreground mb-3">Photos récentes du chantier</h3>
              <div className="grid grid-cols-3 gap-2">
                {clientProject.sitePhotos.map((url, i) => (
                  <div key={i} className="aspect-video rounded-sm overflow-hidden bg-secondary">
                    <img src={url} alt={`Chantier ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Factures récentes</h3>
              {clientInvoices.slice(0, 2).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-xs text-primary font-mono">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">${inv.amount.toLocaleString()}</p>
                    <span className={`text-xs ${inv.status === "Payée" ? "text-green-400" : "text-amber-400"}`}>{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Contact direct</h3>
              <div className="flex flex-col gap-2.5">
                <div>
                  <p className="text-sm text-foreground">Jean Dupont</p>
                  <p className="text-xs text-muted-foreground">Chef de chantier</p>
                  <p className="text-xs text-primary mt-0.5">514-555-0192</p>
                </div>
                <div className="border-t border-border pt-2.5">
                  <p className="text-sm text-foreground">Bureau Monzon</p>
                  <p className="text-xs text-muted-foreground">Administration</p>
                  <p className="text-xs text-primary mt-0.5">514-555-0100</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base text-foreground">Juillet 2025</h2>
            <div className="flex gap-1">
              <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary"><ChevronLeft className="w-4 h-4" /></button>
              <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-sm hover:bg-secondary"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
              <div key={d} className="text-center text-xs text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 1 }).map((_, i) => <div key={`pad-${i}`} />)}
            {calendarDays.map(d => (
              <div key={d} className={cn(
                "aspect-square flex flex-col items-center justify-start rounded-sm p-1 relative cursor-pointer transition-colors",
                events[d] ? "bg-primary/10 border border-primary/30" : "hover:bg-secondary"
              )}>
                <span className={cn("text-xs", events[d] ? "text-primary font-semibold" : "text-foreground")}>{d}</span>
                {events[d] && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">Événements</h3>
            {Object.entries(events).map(([day, evts]) =>
              evts.map((evt, i) => (
                <div key={`${day}-${i}`} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground text-xs w-16">Juil. {day}</span>
                  <span className="text-primary text-xs">●</span>
                  <span className="text-foreground">{evt}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="divide-y divide-border">
            {messages.map((m, i) => (
              <div key={i} className={cn("p-4 hover:bg-secondary/30 transition-colors cursor-pointer", m.unread && "border-l-2 border-primary")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-foreground font-semibold shrink-0">
                      {m.sender[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-foreground font-medium">{m.sender}</p>
                        <span className="text-xs text-muted-foreground">{m.role}</span>
                        {m.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{m.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border p-4 flex gap-3">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-primary/90 transition-colors">
              Envoyer
            </button>
          </div>
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Facture</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {clientInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-primary font-mono text-xs">{inv.id}</td>
                  <td className="px-4 py-3 text-foreground font-medium">${inv.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-sm ${inv.status === "Payée" ? "bg-green-900/20 text-green-400" : "bg-amber-900/20 text-amber-400"}`}>{inv.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "projects" && (
        <div className="bg-card border border-border rounded-sm p-4">
          <h2 className="font-serif text-base text-foreground mb-4">Mes projets en cours</h2>
          <div className="flex flex-col gap-3">
            {[{ name: "Villa Beaumont", status: "En cours", progress: 72, end: "Sept 2025" }].map((p) => (
              <div key={p.name} className="border border-border rounded-sm p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-serif text-sm text-foreground">{p.name}</p>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-sm">{p.status}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.progress}% complété</span>
                  <span>Fin prévue : {p.end}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
