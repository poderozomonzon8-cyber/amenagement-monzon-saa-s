'use client'

import { useState, useEffect } from 'react'
import { getServiceRequests, createServiceRequest, getClientQuotesForApproval, approveQuote } from '@/app/actions/service-requests'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Send, Check, Clock, AlertCircle, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const serviceTypes = [
  { value: 'construction', label: 'Construction', description: 'Travaux de construction' },
  { value: 'hardscape', label: 'Aménagement paysager', description: 'Pavage et aménagement' },
  { value: 'maintenance', label: 'Entretien', description: 'Entretien et réparations' },
]

interface ServiceRequest {
  id: string
  service_type: string
  description: string
  preferred_date: string
  budget_estimate?: number
  status: string
  created_at: string
}

export function ClientSelfService({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<'request' | 'requests' | 'quotes'>('request')
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    service_type: 'construction',
    description: '',
    preferred_date: '',
    budget_estimate: '',
  })

  useEffect(() => {
    loadData()
  }, [clientId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [reqsData, quotesData] = await Promise.all([
        getServiceRequests(clientId),
        getClientQuotesForApproval(clientId),
      ])
      setRequests(reqsData)
      setQuotes(quotesData)
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.preferred_date) {
      alert('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)
    try {
      await createServiceRequest({
        client_id: clientId,
        service_type: formData.service_type as any,
        description: formData.description,
        preferred_date: formData.preferred_date,
        budget_estimate: formData.budget_estimate ? parseInt(formData.budget_estimate) : undefined,
      })

      setFormData({
        service_type: 'construction',
        description: '',
        preferred_date: '',
        budget_estimate: '',
      })
      setShowForm(false)
      await loadData()
    } catch (err) {
      console.error('Error submitting request:', err)
      alert('Erreur lors de la soumission')
    } finally {
      setLoading(false)
    }
  }

  const handleApproveQuote = async (quoteId: string) => {
    if (!confirm('Approuver ce devis?')) return

    setLoading(true)
    try {
      await approveQuote(quoteId)
      await loadData()
    } catch (err) {
      console.error('Error approving quote:', err)
      alert('Erreur lors de l\'approbation')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string; icon: typeof Clock }> = {
      pending: { color: 'bg-amber-900/20 text-amber-400', label: 'En attente', icon: Clock },
      approved: { color: 'bg-green-900/20 text-green-400', label: 'Approuvée', icon: Check },
      rejected: { color: 'bg-red-900/20 text-red-400', label: 'Rejetée', icon: AlertCircle },
      in_progress: { color: 'bg-blue-900/20 text-blue-400', label: 'En cours', icon: Clock },
      completed: { color: 'bg-green-900/20 text-green-400', label: 'Complétée', icon: Check },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <span className={cn('inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full', config.color)}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Portail Libre-Service Client</h1>
        <p className="text-sm text-muted-foreground mt-1">Demandez des services, consultez les devis et approuvez les projets</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {['request', 'requests', 'quotes'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'request' && 'Nouvelle demande'}
            {tab === 'requests' && 'Mes demandes'}
            {tab === 'quotes' && `Devis (${quotes.length})`}
          </button>
        ))}
      </div>

      {/* New Request Tab */}
      {activeTab === 'request' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {serviceTypes.map(service => (
              <Card
                key={service.value}
                onClick={() => {
                  setFormData({ ...formData, service_type: service.value })
                  setShowForm(true)
                }}
                className="p-4 border border-border cursor-pointer hover:border-primary transition-all hover:shadow-md"
              >
                <h3 className="font-semibold text-foreground">{service.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                <Button className="w-full mt-4" size="sm" variant="outline">
                  Demander
                </Button>
              </Card>
            ))}
          </div>

          {showForm && (
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Détails de la demande</h3>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Type de service</label>
                  <select
                    value={formData.service_type}
                    onChange={e => setFormData({ ...formData, service_type: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground"
                  >
                    {serviceTypes.map(s => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Description du projet</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Décrivez ce que vous souhaitez faire..."
                    className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Date préférée</label>
                    <Input
                      type="date"
                      value={formData.preferred_date}
                      onChange={e => setFormData({ ...formData, preferred_date: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Budget estimé ($)</label>
                    <Input
                      type="number"
                      value={formData.budget_estimate}
                      onChange={e => setFormData({ ...formData, budget_estimate: e.target.value })}
                      placeholder="Optionnel"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Envoi...' : 'Envoyer la demande'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : requests.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune demande pour l'instant</p>
            </Card>
          ) : (
            requests.map(request => (
              <Card key={request.id} className="p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground capitalize">
                      {request.service_type}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex gap-4 text-xs text-muted-foreground mt-3">
                  <span>Date: {new Date(request.preferred_date).toLocaleDateString('fr-FR')}</span>
                  {request.budget_estimate && <span>Budget: ${request.budget_estimate}</span>}
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === 'quotes' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : quotes.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun devis en attente</p>
            </Card>
          ) : (
            quotes.map(quote => (
              <Card key={quote.id} className="p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {quote.invoice_number || `Devis-${quote.id.slice(0, 8)}`}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-primary">
                    ${quote.total.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <Button
                  onClick={() => handleApproveQuote(quote.id)}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <Check className="w-4 h-4" />
                  Approuver ce devis
                </Button>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
