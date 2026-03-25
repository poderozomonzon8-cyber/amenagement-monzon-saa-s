'use client'

import { useState, useEffect, useTransition } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Client, Project, InvoiceItem, CompanySettings } from '@/lib/types'
import { getClients } from '@/app/actions/clients'
import { getProjects } from '@/app/actions/projects'
import { createInvoice, updateInvoice } from '@/app/actions/invoices'
import { getCompanySettings } from '@/app/actions/settings'

interface InvoiceFormProps {
  onClose: () => void
  onSuccess: () => void
  editInvoice?: {
    id: string
    invoice_type: 'estimate' | 'invoice' | 'credit_note'
    client_id: string | null
    project_id: string | null
    items: InvoiceItem[]
    tax_rate: number
    due_date: string | null
    notes: string | null
  }
}

export function InvoiceForm({ onClose, onSuccess, editInvoice }: InvoiceFormProps) {
  const [isPending, startTransition] = useTransition()
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  
  // Form state
  const [invoiceType, setInvoiceType] = useState<'estimate' | 'invoice' | 'credit_note'>(editInvoice?.invoice_type || 'invoice')
  const [clientId, setClientId] = useState(editInvoice?.client_id || '')
  const [projectId, setProjectId] = useState(editInvoice?.project_id || '')
  const [taxRate, setTaxRate] = useState(editInvoice?.tax_rate?.toString() || '14.975')
  const [dueDate, setDueDate] = useState(editInvoice?.due_date || '')
  const [notes, setNotes] = useState(editInvoice?.notes || '')
  const [items, setItems] = useState<InvoiceItem[]>(
    editInvoice?.items?.length ? editInvoice.items : [{ description: '', quantity: 1, unit_price: 0 }]
  )
  
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  useEffect(() => {
    Promise.all([getClients(), getProjects(), getCompanySettings()])
      .then(([c, p, s]) => {
        setClients(c)
        setProjects(p)
        setSettings(s)
      })
      .catch(() => setToast({ msg: 'Erreur chargement données', type: 'err' }))
  }, [])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(t)
    }
  }, [toast])

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const taxAmount = subtotal * (parseFloat(taxRate) / 100)
  const total = subtotal + taxAmount

  const addItem = () => setItems([...items, { description: '', quantity: 1, unit_price: 0 }])
  
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index][field] = parseFloat(value as string) || 0
    } else {
      newItems[index][field] = value as string
    }
    setItems(newItems)
  }

  const handleSubmit = () => {
    if (!clientId) {
      setToast({ msg: 'Sélectionnez un client', type: 'err' })
      return
    }
    if (items.every(i => !i.description)) {
      setToast({ msg: 'Ajoutez au moins un article', type: 'err' })
      return
    }

    startTransition(async () => {
      try {
        const data = {
          invoice_type: invoiceType,
          client_id: clientId,
          project_id: projectId || null,
          subtotal,
          tax_rate: parseFloat(taxRate),
          tax_amount: taxAmount,
          total,
          due_date: dueDate || null,
          notes: notes || null,
          items: items.filter(i => i.description),
        }

        if (editInvoice) {
          await updateInvoice(editInvoice.id, data)
          setToast({ msg: 'Facture mise à jour', type: 'ok' })
        } else {
          await createInvoice(data)
          setToast({ msg: 'Facture créée', type: 'ok' })
        }
        
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 500)
      } catch (err) {
        setToast({ msg: `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`, type: 'err' })
      }
    })
  }

  const selectedClient = clients.find(c => c.id === clientId)

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-card rounded-lg w-full max-w-5xl my-8 flex flex-col lg:flex-row">
        {/* Form Section */}
        <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-foreground">
              {editInvoice ? 'Modifier' : 'Nouvelle'} {invoiceType === 'estimate' ? 'Soumission' : invoiceType === 'credit_note' ? 'Note de crédit' : 'Facture'}
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
          </div>

          {/* Invoice Type */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Type de document</label>
            <div className="flex gap-2">
              {(['estimate', 'invoice', 'credit_note'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setInvoiceType(type)}
                  className={`px-4 py-2 rounded text-sm ${
                    invoiceType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {type === 'estimate' ? 'Soumission' : type === 'credit_note' ? 'Note de crédit' : 'Facture'}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Project */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Client *</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="">Sélectionner...</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.profile?.full_name || c.address || c.id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Projet</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-secondary border border-border rounded px-3 py-2 text-foreground"
              >
                <option value="">Aucun</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Tax Rate */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Date d'échéance</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Taux de taxe (%)</label>
              <Input
                type="number"
                step="0.001"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-4">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Articles / Services</label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    className="flex-1 bg-secondary border-border"
                  />
                  <Input
                    type="number"
                    placeholder="Qté"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    className="w-20 bg-secondary border-border"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Prix"
                    value={item.unit_price || ''}
                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                    className="w-28 bg-secondary border-border"
                  />
                  <span className="w-24 py-2 text-right text-foreground">
                    ${(item.quantity * item.unit_price).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-muted-foreground hover:text-destructive"
                    disabled={items.length === 1}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus size={14} /> Ajouter un article
            </button>
          </div>

          {/* Totals */}
          <div className="bg-secondary/50 rounded p-4 mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Taxes ({taxRate}%)</span>
              <span className="text-foreground">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-border pt-2 mt-2">
              <span className="text-foreground">Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-2">Notes / Conditions</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Conditions de paiement, notes..."
              className="bg-secondary border-border"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={isPending} className="flex-1 bg-primary text-primary-foreground">
              {isPending ? 'Enregistrement...' : editInvoice ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex-1 p-6 bg-white min-h-[600px]" id="invoice-preview">
          <div className="text-black">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: settings?.primary_color || '#C9A84C' }}>
                  {settings?.company_name || 'Aménagement Monzon'}
                </h1>
                <p className="text-sm text-gray-600">{settings?.address}</p>
                <p className="text-sm text-gray-600">{settings?.phone}</p>
                <p className="text-sm text-gray-600">{settings?.email}</p>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold uppercase">
                  {invoiceType === 'estimate' ? 'SOUMISSION' : invoiceType === 'credit_note' ? 'NOTE DE CRÉDIT' : 'FACTURE'}
                </h2>
                <p className="text-sm text-gray-500">Aperçu</p>
                {dueDate && <p className="text-sm text-gray-600 mt-2">Échéance: {dueDate}</p>}
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-6 p-4 bg-gray-50 rounded">
              <p className="text-xs text-gray-500 uppercase mb-1">Facturer à:</p>
              <p className="font-medium">{selectedClient?.profile?.full_name || 'Client non sélectionné'}</p>
              {selectedClient?.address && <p className="text-sm text-gray-600">{selectedClient.address}</p>}
            </div>

            {/* Items Table */}
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b-2" style={{ borderColor: settings?.primary_color || '#C9A84C' }}>
                  <th className="text-left py-2 text-sm font-semibold">Description</th>
                  <th className="text-center py-2 text-sm font-semibold w-20">Qté</th>
                  <th className="text-right py-2 text-sm font-semibold w-28">Prix unit.</th>
                  <th className="text-right py-2 text-sm font-semibold w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(i => i.description).map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 text-sm">{item.description}</td>
                    <td className="py-2 text-sm text-center">{item.quantity}</td>
                    <td className="py-2 text-sm text-right">${item.unit_price.toFixed(2)}</td>
                    <td className="py-2 text-sm text-right">${(item.quantity * item.unit_price).toFixed(2)}</td>
                  </tr>
                ))}
                {items.every(i => !i.description) && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-400 italic">
                      Aucun article ajouté
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 text-sm">
                  <span className="text-gray-600">Taxes ({taxRate}%)</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div 
                  className="flex justify-between py-2 text-lg font-bold border-t-2 mt-2"
                  style={{ borderColor: settings?.primary_color || '#C9A84C' }}
                >
                  <span>TOTAL</span>
                  <span style={{ color: settings?.primary_color || '#C9A84C' }}>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-1">Notes:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{notes}</p>
              </div>
            )}

            {/* Tax Numbers */}
            {(settings?.tax_number_1 || settings?.tax_number_2) && (
              <div className="mt-6 text-xs text-gray-500">
                {settings?.tax_number_1 && <p>TPS: {settings.tax_number_1}</p>}
                {settings?.tax_number_2 && <p>TVQ: {settings.tax_number_2}</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
          toast.type === 'ok' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
