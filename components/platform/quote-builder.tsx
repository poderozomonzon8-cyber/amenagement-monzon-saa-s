'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { X, Plus, TrendingUp } from 'lucide-react'
import { getPricingSuggestions, getQuoteTemplates, saveQuoteTemplate, convertQuoteToInvoice } from '@/app/actions/quotes'
import { createInvoice } from '@/app/actions/invoices'
import { getClients } from '@/app/actions/clients'
import { getProjects } from '@/app/actions/projects'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
}

interface PricingSuggestion {
  minPrice: number
  avgPrice: number
  maxPrice: number
}

export function QuoteBuilder() {
  const [step, setStep] = useState<'type' | 'items' | 'review'>('type')
  const [serviceType, setServiceType] = useState<'construction' | 'hardscape' | 'maintenance'>('construction')
  const [clients, setClients] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProject, setSelectedProject] = useState('')
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, unitPrice: 0 }])
  const [pricing, setPricing] = useState<PricingSuggestion | null>(null)
  const [templates, setTemplates] = useState<any[]>([])
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [templateName, setTemplateName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (step === 'items') {
      fetchPricingSuggestions()
    }
  }, [step, serviceType])

  const fetchInitialData = async () => {
    try {
      const [clientsData, templatesData] = await Promise.all([
        getClients(),
        getQuoteTemplates(),
      ])
      setClients(clientsData)
      setTemplates(templatesData)
    } catch (err) {
      console.error('Error fetching initial data:', err)
    }
  }

  const fetchPricingSuggestions = async () => {
    try {
      const suggestions = await getPricingSuggestions(serviceType)
      setPricing(suggestions)
    } catch (err) {
      console.error('Error fetching pricing:', err)
    }
  }

  const fetchProjectsByClient = async (clientId: string) => {
    if (!clientId) return
    try {
      const projectsData = await getProjects()
      const filtered = projectsData.filter((p: any) => p.client_id === clientId)
      setProjects(filtered)
    } catch (err) {
      console.error('Error fetching projects:', err)
    }
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof QuoteItem, value: any) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    setItems(updated)
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxRate = 0.14975 // Quebec tax rate
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  const handleCreateQuote = async () => {
    if (!selectedClient || items.length === 0) {
      alert('Please select a client and add items')
      return
    }

    setLoading(true)
    try {
      const quote = await createInvoice({
        invoice_type: 'estimate',
        project_id: selectedProject || null,
        client_id: selectedClient,
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        status: 'draft',
        items: items.map(item => ({
          id: '',
          invoice_id: '',
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          created_at: new Date().toISOString(),
        })),
      })

      alert('Quote created successfully!')
      resetForm()
    } catch (err) {
      console.error('Error creating quote:', err)
      alert('Error creating quote')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTemplate = async () => {
    if (!templateName) {
      alert('Please enter a template name')
      return
    }

    setSavingTemplate(true)
    try {
      await saveQuoteTemplate({
        name: templateName,
        serviceType,
        description: `Template for ${serviceType} service`,
        items,
      })
      alert('Template saved!')
      setTemplateName('')
    } catch (err) {
      console.error('Error saving template:', err)
      alert('Error saving template')
    } finally {
      setSavingTemplate(false)
    }
  }

  const resetForm = () => {
    setItems([{ description: '', quantity: 1, unitPrice: 0 }])
    setSelectedClient('')
    setSelectedProject('')
    setStep('type')
  }

  return (
    <div className="space-y-6">
      <div className="text-lg font-semibold">Smart Quote Builder</div>

      {/* Service Type Selection */}
      {step === 'type' && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Service Type</label>
              <div className="grid grid-cols-3 gap-4 mt-3">
                {[
                  { value: 'construction', label: 'Construction', color: 'bg-yellow-600' },
                  { value: 'hardscape', label: 'Hardscape & Landscape', color: 'bg-green-600' },
                  { value: 'maintenance', label: 'Maintenance', color: 'bg-blue-600' },
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setServiceType(type.value as any)}
                    className={`p-4 rounded-lg border-2 text-center font-semibold transition ${
                      serviceType === type.value
                        ? `${type.color} text-white border-current`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Select Client</label>
              <select
                value={selectedClient}
                onChange={e => {
                  setSelectedClient(e.target.value)
                  fetchProjectsByClient(e.target.value)
                  setSelectedProject('')
                }}
                className="w-full mt-2 px-3 py-2 border rounded-lg bg-white"
              >
                <option value="">Choose a client...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name || 'Unnamed Client'}
                  </option>
                ))}
              </select>
            </div>

            {projects.length > 0 && (
              <div>
                <label className="text-sm font-medium">Select Project (Optional)</label>
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full mt-2 px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="">No project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {pricing && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-900">Pricing Intelligence</p>
                    <p className="text-sm text-blue-800 mt-1">
                      Based on {serviceType} projects: Min ${pricing.minPrice} | Avg ${pricing.avgPrice} | Max ${pricing.maxPrice}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={() => setStep('items')} className="w-full bg-yellow-600 hover:bg-yellow-700">
              Continue
            </Button>
          </div>
        </Card>
      )}

      {/* Items Configuration */}
      {step === 'items' && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Quote Items</h3>
              <Button onClick={addItem} size="sm" variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start border rounded-lg p-3">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Description (e.g., Paver Installation)"
                      value={item.description}
                      onChange={e => updateItem(index, 'description', e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.unitPrice}
                        onChange={e => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (14.975%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setStep('review')} className="flex-1 bg-yellow-600 hover:bg-yellow-700">
                Review & Send
              </Button>
              <Button onClick={() => setStep('type')} variant="outline" className="flex-1">
                Back
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Review & Send */}
      {step === 'review' && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="font-semibold">Review Quote</h3>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Client:</span> {clients.find(c => c.id === selectedClient)?.name}
              </p>
              <p>
                <span className="font-medium">Service Type:</span> {serviceType}
              </p>
              <p>
                <span className="font-medium">Items:</span> {items.length}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 border">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax:</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Save Template Section */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">Save as Template (Optional)</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Template name..."
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                />
                <Button
                  onClick={handleSaveTemplate}
                  disabled={!templateName || savingTemplate}
                  variant="outline"
                >
                  {savingTemplate ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreateQuote}
                disabled={loading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700"
              >
                {loading ? 'Creating...' : 'Create Quote'}
              </Button>
              <Button onClick={() => setStep('items')} variant="outline" className="flex-1">
                Back
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
