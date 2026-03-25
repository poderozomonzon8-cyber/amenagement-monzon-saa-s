"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Search, Download, Eye, CheckCircle, Clock, XCircle, CreditCard, Banknote, Smartphone, Building } from "lucide-react"

const invoices = [
  { id: "INV-2025-041", client: "M. Beaumont", project: "Villa Beaumont", amount: 45000, paid: 45000, status: "Payée", date: "2025-07-01", due: "2025-07-15", method: "Virement" },
  { id: "INV-2025-042", client: "Plaza Inc.", project: "Réno Commercial", amount: 80000, paid: 0, status: "En attente", date: "2025-07-05", due: "2025-07-25", method: "" },
  { id: "INV-2025-039", client: "Famille Lafleur", project: "Résidence Lafleur", amount: 23500, paid: 23500, status: "Payée", date: "2025-06-15", due: "2025-06-30", method: "Interac" },
  { id: "INV-2025-040", client: "Dupont SA", project: "Bureau Dupont", amount: 55000, paid: 27500, status: "Partielle", date: "2025-06-20", due: "2025-07-20", method: "Carte" },
  { id: "INV-2025-043", client: "Coop St-Henri", project: "Jardins St-Henri", amount: 12000, paid: 0, status: "Brouillon", date: "2025-07-10", due: "2025-08-10", method: "" },
]

const statusIcon: Record<string, any> = {
  "Payée": CheckCircle,
  "En attente": Clock,
  "Partielle": Clock,
  "Brouillon": XCircle,
}

const statusStyle: Record<string, string> = {
  "Payée": "text-green-400 bg-green-900/20",
  "En attente": "text-amber-400 bg-amber-900/20",
  "Partielle": "text-blue-400 bg-blue-900/20",
  "Brouillon": "text-muted-foreground bg-secondary",
}

const paymentMethods = [
  { id: "cash", label: "Comptant", icon: Banknote },
  { id: "bank", label: "Virement", icon: Building },
  { id: "interac", label: "Interac", icon: Smartphone },
  { id: "card", label: "Carte", icon: CreditCard },
]

const CreateInvoiceForm = ({ onClose }: { onClose: () => void }) => {
  const [method, setMethod] = useState("bank")
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Créer une facture</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Client</label>
              <select className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>M. Beaumont</option>
                <option>Plaza Inc.</option>
                <option>Dupont SA</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Projet</label>
              <select className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option>Villa Beaumont</option>
                <option>Réno Commercial</option>
                <option>Bureau Dupont</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Montant ($)</label>
              <input type="number" placeholder="0.00" className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Date d'échéance</label>
              <input type="date" className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Mode de paiement</label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={cn("flex flex-col items-center gap-1.5 p-3 rounded-sm border transition-colors text-xs",
                    method === m.id ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Notes</label>
            <textarea rows={3} placeholder="Termes, conditions, notes..." className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 border border-border text-foreground text-sm py-2.5 rounded-sm hover:bg-secondary transition-colors">Annuler</button>
            <button className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:bg-primary/90 transition-colors">Créer la facture</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BillingSystem() {
  const [tab, setTab] = useState<"invoices" | "payments">("invoices")
  const [showCreate, setShowCreate] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = invoices.filter(i =>
    i.client.toLowerCase().includes(search.toLowerCase()) ||
    i.id.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0)
  const totalPending = invoices.reduce((s, i) => s + (i.amount - i.paid), 0)

  return (
    <div className="flex flex-col gap-6">
      {showCreate && <CreateInvoiceForm onClose={() => setShowCreate(false)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Facturation</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestion des factures et paiements</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start"
        >
          <Plus className="w-4 h-4" /> Nouvelle facture
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Revenus encaissés</p>
          <p className="font-serif text-2xl text-primary">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">En attente</p>
          <p className="font-serif text-2xl text-amber-400">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-4 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Factures émises</p>
          <p className="font-serif text-2xl text-foreground">{invoices.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["invoices", "payments"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn("px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors",
              tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t === "invoices" ? "Factures" : "Paiements"}
          </button>
        ))}
      </div>

      {tab === "invoices" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une facture..."
              className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">N° Facture</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Client</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Projet</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                    <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Échéance</th>
                    <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => {
                    const Icon = statusIcon[inv.status]
                    return (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 text-primary font-mono text-xs">{inv.id}</td>
                        <td className="px-4 py-3 text-foreground hidden md:table-cell">{inv.client}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{inv.project}</td>
                        <td className="px-4 py-3 text-foreground font-medium">${inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${statusStyle[inv.status]}`}>
                            <Icon className="w-3 h-3" />{inv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">{inv.due}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 text-muted-foreground hover:text-primary rounded-sm hover:bg-secondary transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-primary rounded-sm hover:bg-secondary transition-colors">
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "payments" && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Facture</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Client</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant payé</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Méthode</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody>
                {invoices.filter(i => i.paid > 0).map((inv) => {
                  const methodIcon = paymentMethods.find(m => m.label === inv.method)
                  return (
                    <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3 text-primary font-mono text-xs">{inv.id}</td>
                      <td className="px-4 py-3 text-foreground hidden md:table-cell">{inv.client}</td>
                      <td className="px-4 py-3 text-green-400 font-medium">${inv.paid.toLocaleString()}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {methodIcon && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <methodIcon.icon className="w-3.5 h-3.5" />{inv.method}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded-sm">Confirmé</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
