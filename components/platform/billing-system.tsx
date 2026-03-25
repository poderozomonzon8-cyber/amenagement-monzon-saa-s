'use client'

import { useState, useEffect, useTransition } from 'react'
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/app/actions/invoices'
import { getPayments, createPayment } from '@/app/actions/payments'
import { getProjects } from '@/app/actions/projects'
import { Invoice, Payment, Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Plus, Search, Eye, Trash2, CheckCircle, Clock, XCircle,
  CreditCard, Banknote, Smartphone, Building, X, Loader2
} from 'lucide-react'

const statusIcon: Record<string, any> = {
  paid:      CheckCircle,
  sent:      Clock,
  draft:     XCircle,
  overdue:   XCircle,
  cancelled: XCircle,
}

const statusStyle: Record<string, string> = {
  paid:      'text-green-400 bg-green-900/20',
  sent:      'text-amber-400 bg-amber-900/20',
  draft:     'text-muted-foreground bg-secondary',
  overdue:   'text-red-400 bg-red-900/20',
  cancelled: 'text-muted-foreground bg-secondary',
}

const statusLabel: Record<string, string> = {
  paid:      'Payée',
  sent:      'Envoyée',
  draft:     'Brouillon',
  overdue:   'En retard',
  cancelled: 'Annulée',
}

const paymentMethods = [
  { id: 'cash',     label: 'Comptant',  icon: Banknote  },
  { id: 'virement', label: 'Virement',  icon: Building  },
  { id: 'interac',  label: 'Interac',   icon: Smartphone },
  { id: 'card',     label: 'Carte',     icon: CreditCard },
]

function CreateInvoiceModal({
  projects,
  onClose,
  onCreated,
}: {
  projects: Project[]
  onClose: () => void
  onCreated: (inv: Invoice) => void
}) {
  const [form, setForm] = useState({ project_id: '', client_id: '', total: '', status: 'draft' })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.total || isNaN(parseFloat(form.total))) { setError('Montant invalide.'); return }
    setError('')
    startTransition(async () => {
      try {
        const inv = await createInvoice({
          project_id: form.project_id || null,
          client_id:  form.client_id  || null,
          total:      parseFloat(form.total),
          status:     form.status,
        } as any)
        onCreated(inv)
        onClose()
      } catch (e: any) {
        setError(e.message || 'Erreur lors de la création.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Nouvelle facture</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Projet</label>
            <select value={form.project_id} onChange={(e) => set('project_id', e.target.value)}
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="">— Sélectionner un projet —</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Montant ($) *</label>
              <input type="number" value={form.total} onChange={(e) => set('total', e.target.value)}
                placeholder="0.00"
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="draft">Brouillon</option>
                <option value="sent">Envoyée</option>
                <option value="paid">Payée</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-border text-foreground text-sm py-2.5 rounded-sm hover:bg-secondary transition-colors">Annuler</button>
            <button onClick={handleSubmit} disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function AddPaymentModal({
  invoice,
  onClose,
  onAdded,
}: {
  invoice: Invoice
  onClose: () => void
  onAdded: (p: Payment) => void
}) {
  const [method, setMethod] = useState('virement')
  const [amount, setAmount] = useState(String(invoice.total))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!amount || isNaN(parseFloat(amount))) { setError('Montant invalide.'); return }
    setError('')
    startTransition(async () => {
      try {
        const payment = await createPayment({
          invoice_id: invoice.id,
          amount: parseFloat(amount),
          method,
          status: 'completed',
        })
        onAdded(payment)
        onClose()
      } catch (e: any) {
        setError(e.message || 'Erreur.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Enregistrer un paiement</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Montant ($)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Mode de paiement</label>
            <div className="grid grid-cols-4 gap-2">
              {paymentMethods.map((m) => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={cn('flex flex-col items-center gap-1.5 p-3 rounded-sm border transition-colors text-xs',
                    method === m.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
                  )}>
                  <m.icon className="w-4 h-4" />{m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-border text-foreground text-sm py-2.5 rounded-sm hover:bg-secondary transition-colors">Annuler</button>
            <button onClick={handleSubmit} disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Confirmer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function BillingSystem() {
  const [tab, setTab]                 = useState<'invoices' | 'payments'>('invoices')
  const [invoices, setInvoices]       = useState<Invoice[]>([])
  const [payments, setPayments]       = useState<Payment[]>([])
  const [projects, setProjects]       = useState<Project[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [showCreate, setShowCreate]   = useState(false)
  const [payTarget, setPayTarget]     = useState<Invoice | null>(null)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [toast, setToast]             = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    Promise.all([getInvoices(), getPayments(), getProjects()])
      .then(([invs, pays, projs]) => {
        setInvoices(invs)
        setPayments(pays)
        setProjects(projs)
      })
      .catch(() => showToast('Erreur lors du chargement.', 'err'))
      .finally(() => setLoading(false))
  }, [])

  const totalEncaisse = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0)
  const totalPending  = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + i.total, 0)

  const filtered = invoices.filter((i) =>
    i.id?.toLowerCase().includes(search.toLowerCase()) ||
    i.project_id?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette facture ?')) return
    setDeletingId(id)
    try {
      await deleteInvoice(id)
      setInvoices((prev) => prev.filter((i) => i.id !== id))
      showToast('Facture supprimée.')
    } catch {
      showToast('Erreur lors de la suppression.', 'err')
    } finally {
      setDeletingId(null)
    }
  }

  const handleMarkPaid = async (inv: Invoice) => {
    try {
      const updated = await updateInvoice(inv.id, { status: 'paid' })
      setInvoices((prev) => prev.map((i) => (i.id === inv.id ? updated : i)))
      showToast('Facture marquée comme payée.')
    } catch {
      showToast('Erreur.', 'err')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className={cn('fixed bottom-6 right-6 z-50 px-4 py-3 rounded-sm text-sm shadow-lg border',
          toast.type === 'ok' ? 'bg-card border-green-800 text-green-300' : 'bg-card border-red-800 text-red-300'
        )}>
          {toast.msg}
        </div>
      )}

      {showCreate && <CreateInvoiceModal projects={projects} onClose={() => setShowCreate(false)} onCreated={(inv) => { setInvoices((p) => [inv, ...p]); showToast('Facture créée.') }} />}
      {payTarget  && <AddPaymentModal invoice={payTarget} onClose={() => setPayTarget(null)} onAdded={(pay) => { setPayments((p) => [pay, ...p]); handleMarkPaid(payTarget); setPayTarget(null) }} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Facturation</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestion des factures et paiements</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <Plus className="w-4 h-4" /> Nouvelle facture
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-4 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Revenus encaissés</p>
          <p className="font-serif text-2xl text-primary">${totalEncaisse.toLocaleString()}</p>
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
        {(['invoices', 'payments'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
              tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}>
            {t === 'invoices' ? 'Factures' : 'Paiements'}
          </button>
        ))}
      </div>

      {tab === 'invoices' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
              className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</div>
          ) : (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Aucune facture. Créez-en une.</td></tr>
                    ) : filtered.map((inv) => {
                      const Icon = statusIcon[inv.status] || Clock
                      return (
                        <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 text-primary font-mono text-xs">{inv.id.slice(0, 8)}…</td>
                          <td className="px-4 py-3 text-foreground font-medium">${(inv.total || 0).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${statusStyle[inv.status] || 'bg-secondary text-muted-foreground'}`}>
                              <Icon className="w-3 h-3" />{statusLabel[inv.status] || inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                            {new Date(inv.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {inv.status !== 'paid' && (
                                <button onClick={() => setPayTarget(inv)}
                                  className="p-1.5 text-muted-foreground hover:text-primary rounded-sm hover:bg-secondary transition-colors" title="Enregistrer paiement">
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button onClick={() => handleDelete(inv.id)} disabled={deletingId === inv.id}
                                className="p-1.5 text-muted-foreground hover:text-red-400 rounded-sm hover:bg-secondary transition-colors">
                                {deletingId === inv.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
          )}
        </>
      )}

      {tab === 'payments' && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Facture</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Méthode</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-sm">Aucun paiement enregistré.</td></tr>
                ) : payments.map((pay) => {
                  const m = paymentMethods.find((x) => x.id === pay.method)
                  return (
                    <tr key={pay.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="px-4 py-3 text-primary font-mono text-xs">{pay.invoice_id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 text-green-400 font-medium">${(pay.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {m && <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><m.icon className="w-3.5 h-3.5" />{m.label}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded-sm">{pay.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                        {new Date(pay.created_at).toLocaleDateString('fr-FR')}
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
