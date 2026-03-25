'use client'

import { useState, useEffect, useTransition } from 'react'
import { getInvoices, deleteInvoice, updateInvoiceStatus } from '@/app/actions/invoices'
import { getPayments, createPayment } from '@/app/actions/payments'
import { Invoice, Payment } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  Plus, Search, Eye, Trash2, CheckCircle, Clock, XCircle, FileText,
  CreditCard, Banknote, Smartphone, Building, X, Loader2, Download
} from 'lucide-react'
import { InvoiceForm } from './invoice-form'
import { InvoicePreview } from './invoice-preview'

const statusIcon: Record<string, typeof CheckCircle> = {
  paid:      CheckCircle,
  sent:      Clock,
  draft:     FileText,
  overdue:   XCircle,
  cancelled: XCircle,
}

const statusStyle: Record<string, string> = {
  paid:      'text-green-400 bg-green-900/20',
  sent:      'text-blue-400 bg-blue-900/20',
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

function AddPaymentModal({
  invoice,
  onClose,
  onAdded,
}: {
  invoice: Invoice
  onClose: () => void
  onAdded: () => void
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
        await createPayment({
          invoice_id: invoice.id,
          amount: parseFloat(amount),
          method,
          status: 'completed',
        })
        // Mark invoice as paid if full amount
        if (parseFloat(amount) >= invoice.total) {
          await updateInvoiceStatus(invoice.id, 'paid')
        }
        onAdded()
        onClose()
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Erreur.')
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
          
          <div className="bg-secondary/50 p-3 rounded">
            <p className="text-xs text-muted-foreground">Facture</p>
            <p className="text-foreground font-medium">{invoice.invoice_number || invoice.id.slice(0, 8)}</p>
            <p className="text-primary font-semibold">${invoice.total.toFixed(2)}</p>
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Montant ($)</label>
            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
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
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [showCreate, setShowCreate]   = useState(false)
  const [previewId, setPreviewId]     = useState<string | null>(null)
  const [payTarget, setPayTarget]     = useState<Invoice | null>(null)
  const [deletingId, setDeletingId]   = useState<string | null>(null)
  const [toast, setToast]             = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = async () => {
    try {
      const [invs, pays] = await Promise.all([getInvoices(), getPayments()])
      setInvoices(invs)
      setPayments(pays)
    } catch {
      showToast('Erreur lors du chargement.', 'err')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const totalEncaisse = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + (i.total || 0), 0)
  const totalPending  = invoices.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + (i.total || 0), 0)

  const filtered = invoices.filter((i) =>
    (i.invoice_number?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (i.id?.toLowerCase() || '').includes(search.toLowerCase())
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

      {/* Modals */}
      {showCreate && (
        <InvoiceForm 
          onClose={() => setShowCreate(false)} 
          onSuccess={() => { loadData(); showToast('Facture créée.') }} 
        />
      )}
      {previewId && (
        <InvoicePreview 
          invoiceId={previewId} 
          onClose={() => setPreviewId(null)}
          onStatusChange={loadData}
        />
      )}
      {payTarget && (
        <AddPaymentModal 
          invoice={payTarget} 
          onClose={() => setPayTarget(null)} 
          onAdded={() => { loadData(); showToast('Paiement enregistré.') }} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Facturation</h1>
          <p className="text-muted-foreground text-sm mt-1">Gestion complète des factures, soumissions et paiements</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <Plus className="w-4 h-4" /> Nouvelle facture
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border p-5 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Revenus encaissés</p>
          <p className="font-serif text-2xl text-green-400">${totalEncaisse.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-sm">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">En attente</p>
          <p className="font-serif text-2xl text-amber-400">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border p-5 rounded-sm">
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
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par numéro..."
              className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm py-8 justify-center">
              <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
            </div>
          ) : (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Numéro</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Type</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Statut</th>
                      <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                      <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground text-sm">Aucune facture. Créez-en une avec le bouton ci-dessus.</td></tr>
                    ) : filtered.map((inv) => {
                      const Icon = statusIcon[inv.status] || Clock
                      const typeLabel = inv.invoice_type === 'estimate' ? 'Soumission' : inv.invoice_type === 'credit_note' ? 'Note crédit' : 'Facture'
                      return (
                        <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 text-primary font-mono text-xs">
                            {inv.invoice_number || inv.id.slice(0, 8)}
                          </td>
                          <td className="px-4 py-3 text-foreground text-xs">{typeLabel}</td>
                          <td className="px-4 py-3 text-foreground font-medium">${(inv.total || 0).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-sm ${statusStyle[inv.status] || 'bg-secondary text-muted-foreground'}`}>
                              <Icon className="w-3 h-3" />{statusLabel[inv.status] || inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                            {new Date(inv.created_at).toLocaleDateString('fr-CA')}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => setPreviewId(inv.id)}
                                className="p-1.5 text-muted-foreground hover:text-primary rounded-sm hover:bg-secondary transition-colors" title="Voir">
                                <Eye className="w-4 h-4" />
                              </button>
                              {inv.status !== 'paid' && (
                                <button onClick={() => setPayTarget(inv)}
                                  className="p-1.5 text-muted-foreground hover:text-green-400 rounded-sm hover:bg-secondary transition-colors" title="Paiement">
                                  <Download className="w-4 h-4" />
                                </button>
                              )}
                              <button onClick={() => handleDelete(inv.id)} disabled={deletingId === inv.id}
                                className="p-1.5 text-muted-foreground hover:text-red-400 rounded-sm hover:bg-secondary transition-colors" title="Supprimer">
                                {deletingId === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Facture</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Montant</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Méthode</th>
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
                      <td className="px-4 py-3 text-primary font-mono text-xs">{pay.invoice_id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-green-400 font-medium">${(pay.amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-foreground">
                          {m && <m.icon className="w-3.5 h-3.5" />}
                          {m?.label || pay.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs px-2 py-0.5 rounded-sm',
                          pay.status === 'completed' ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                        )}>
                          {pay.status === 'completed' ? 'Complété' : pay.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                        {new Date(pay.created_at).toLocaleDateString('fr-CA')}
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
