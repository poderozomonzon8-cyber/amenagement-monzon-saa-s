'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Download, Printer, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Invoice, CompanySettings } from '@/lib/types'
import { getInvoiceById, updateInvoiceStatus } from '@/app/actions/invoices'
import { getCompanySettings } from '@/app/actions/settings'

interface InvoicePreviewProps {
  invoiceId: string
  onClose: () => void
  onStatusChange?: () => void
}

export function InvoicePreview({ invoiceId, onClose, onStatusChange }: InvoicePreviewProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [loading, setLoading] = useState(true)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    Promise.all([getInvoiceById(invoiceId), getCompanySettings()])
      .then(([inv, set]) => {
        setInvoice(inv)
        setSettings(set)
      })
      .finally(() => setLoading(false))

    // Add keyboard support for ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [invoiceId, onClose])

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${invoice?.invoice_number || 'Facture'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #000; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; }
            th { border-bottom: 2px solid ${settings?.primary_color || '#C9A84C'}; }
            td { border-bottom: 1px solid #eee; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .totals { display: flex; justify-content: flex-end; }
            .totals-table { width: 250px; }
            .total-row { font-weight: bold; border-top: 2px solid ${settings?.primary_color || '#C9A84C'}; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleDownloadPDF = async () => {
    // For PDF generation, we use the print dialog as a simple solution
    // A more robust solution would use a library like jsPDF or html2pdf
    handlePrint()
  }

  const handleSend = async () => {
    if (!invoice) return
    try {
      await updateInvoiceStatus(invoice.id, 'sent')
      setInvoice({ ...invoice, status: 'sent' })
      onStatusChange?.()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-card rounded-lg p-8">
          <p className="text-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-card rounded-lg p-8">
          <p className="text-foreground">Facture non trouvée</p>
          <Button onClick={onClose} className="mt-4">Fermer</Button>
        </div>
      </div>
    )
  }

  const typeLabel = invoice.invoice_type === 'estimate' ? 'SOUMISSION' : invoice.invoice_type === 'credit_note' ? 'NOTE DE CRÉDIT' : 'FACTURE'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-card rounded-lg w-full max-w-4xl my-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
          <h2 className="font-serif text-lg text-foreground">
            {typeLabel} {invoice.invoice_number}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download size={16} className="mr-1" /> PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer size={16} className="mr-1" /> Imprimer
            </Button>
            {invoice.status === 'draft' && (
              <Button size="sm" onClick={handleSend} className="bg-primary text-primary-foreground">
                <Send size={16} className="mr-1" /> Envoyer
              </Button>
            )}
            <button 
              onClick={onClose} 
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-sm"
              title="Fermer (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 bg-white" ref={printRef}>
          <div className="text-black">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                {settings?.logo_url && (
                  <img src={settings.logo_url} alt="Logo" className="h-16 mb-2" />
                )}
                <h1 className="text-2xl font-bold" style={{ color: settings?.primary_color || '#C9A84C' }}>
                  {settings?.company_name || 'Aménagement Monzon'}
                </h1>
                <p className="text-sm text-gray-600">{settings?.address}</p>
                <p className="text-sm text-gray-600">{settings?.phone}</p>
                <p className="text-sm text-gray-600">{settings?.email}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold uppercase">{typeLabel}</h2>
                <p className="text-lg font-medium mt-1">{invoice.invoice_number}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(invoice.created_at).toLocaleDateString('fr-CA')}
                </p>
                {invoice.due_date && (
                  <p className="text-sm text-gray-600">
                    Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-CA')}
                  </p>
                )}
                <span className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status === 'paid' ? 'PAYÉ' :
                   invoice.status === 'sent' ? 'ENVOYÉ' :
                   invoice.status === 'overdue' ? 'EN RETARD' :
                   'BROUILLON'}
                </span>
              </div>
            </div>

            {/* Client Info */}
            <div className="mb-8 p-4 bg-gray-50 rounded">
              <p className="text-xs text-gray-500 uppercase mb-1">Facturer à:</p>
              <p className="font-medium text-lg">
                {invoice.client?.profile?.full_name || 'Client'}
              </p>
              {invoice.client?.address && (
                <p className="text-sm text-gray-600">{invoice.client.address}</p>
              )}
              {invoice.client?.profile?.phone && (
                <p className="text-sm text-gray-600">{invoice.client.profile.phone}</p>
              )}
            </div>

            {/* Project Reference */}
            {invoice.project && (
              <div className="mb-6">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Projet:</span> {invoice.project.name}
                </p>
              </div>
            )}

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead>
                <tr style={{ borderBottom: `2px solid ${settings?.primary_color || '#C9A84C'}` }}>
                  <th className="text-left py-3 text-sm font-semibold">Description</th>
                  <th className="text-center py-3 text-sm font-semibold w-20">Qté</th>
                  <th className="text-right py-3 text-sm font-semibold w-28">Prix unit.</th>
                  <th className="text-right py-3 text-sm font-semibold w-28">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items && invoice.items.length > 0 ? (
                  invoice.items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-sm">{item.description}</td>
                      <td className="py-3 text-sm text-center">{item.quantity}</td>
                      <td className="py-3 text-sm text-right">${item.unit_price.toFixed(2)}</td>
                      <td className="py-3 text-sm text-right">
                        ${(item.quantity * item.unit_price).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-3 text-sm">
                      Services rendus
                    </td>
                    <td className="py-3 text-sm text-right">${invoice.total.toFixed(2)}</td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-72">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span>${(invoice.subtotal || invoice.total).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">Taxes ({invoice.tax_rate || 0}%)</span>
                  <span>${(invoice.tax_amount || 0).toFixed(2)}</span>
                </div>
                <div 
                  className="flex justify-between py-3 text-xl font-bold border-t-2 mt-2"
                  style={{ borderColor: settings?.primary_color || '#C9A84C' }}
                >
                  <span>TOTAL</span>
                  <span style={{ color: settings?.primary_color || '#C9A84C' }}>
                    ${invoice.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase mb-2">Notes / Conditions:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-12 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              {settings?.tax_number_1 && <span className="mr-4">TPS: {settings.tax_number_1}</span>}
              {settings?.tax_number_2 && <span>TVQ: {settings.tax_number_2}</span>}
              <p className="mt-2">Merci de votre confiance!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
