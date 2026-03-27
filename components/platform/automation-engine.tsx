'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Edit2, Toggle2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const triggerOptions = [
  { value: 'invoice_created', label: 'Facture créée' },
  { value: 'invoice_paid', label: 'Facture payée' },
  { value: 'payment_reminder', label: 'Rappel de paiement' },
  { value: 'project_deadline', label: 'Date limite du projet' },
  { value: 'quote_converted', label: 'Devis converti en facture' },
]

const actionOptions = [
  { value: 'send_notification', label: 'Envoyer une notification' },
  { value: 'send_email', label: 'Envoyer un email' },
  { value: 'update_status', label: 'Mettre à jour le statut' },
  { value: 'create_follow_up', label: 'Créer un suivi' },
]

interface AutomationRule {
  id: string
  name: string
  trigger: string
  action: string
  action_data?: Record<string, any>
  enabled: boolean
  delay_days?: number
  created_at: string
}

export function AutomationEngine() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    trigger: 'invoice_created',
    action: 'send_notification',
    delayDays: 0,
  })

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    setLoading(true)
    try {
      // Fetch would happen here - for now using mock data
      setRules([
        {
          id: '1',
          name: 'Notifier client - Facture créée',
          trigger: 'invoice_created',
          action: 'send_notification',
          enabled: true,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Rappel de paiement 7j',
          trigger: 'payment_reminder',
          action: 'send_email',
          delayDays: 7,
          enabled: true,
          created_at: new Date().toISOString(),
        },
      ])
    } catch (err) {
      console.error('Error loading rules:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveRule = async () => {
    if (!formData.name || !formData.trigger || !formData.action) {
      alert('Veuillez remplir tous les champs requis')
      return
    }

    setLoading(true)
    try {
      // Would save to database here
      const newRule: AutomationRule = {
        id: editingId || String(Date.now()),
        name: formData.name,
        trigger: formData.trigger,
        action: formData.action,
        delay_days: formData.delayDays,
        enabled: true,
        created_at: new Date().toISOString(),
      }

      if (editingId) {
        setRules(rules.map(r => (r.id === editingId ? newRule : r)))
      } else {
        setRules([...rules, newRule])
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', trigger: 'invoice_created', action: 'send_notification', delayDays: 0 })
    } catch (err) {
      console.error('Error saving rule:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRule = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette règle?')) return
    try {
      setRules(rules.filter(r => r.id !== id))
    } catch (err) {
      console.error('Error deleting rule:', err)
    }
  }

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map(r =>
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    )
  }

  const handleEditRule = (rule: AutomationRule) => {
    setFormData({
      name: rule.name,
      trigger: rule.trigger,
      action: rule.action,
      delayDays: rule.delay_days || 0,
    })
    setEditingId(rule.id)
    setShowForm(true)
  }

  if (loading && !showForm) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Moteur d'Automatisation</h1>
          <p className="text-sm text-muted-foreground mt-1">Configurez des règles pour automatiser les tâches</p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', trigger: 'invoice_created', action: 'send_notification', delayDays: 0 })
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nouvelle règle
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? 'Modifier la règle' : 'Créer une nouvelle règle'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nom de la règle</label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Notifier client - Facture créée"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground">Déclencheur</label>
                <select
                  value={formData.trigger}
                  onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground"
                >
                  {triggerOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Action</label>
                <select
                  value={formData.action}
                  onChange={e => setFormData({ ...formData, action: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground"
                >
                  {actionOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Délai (jours)</label>
              <Input
                type="number"
                value={formData.delayDays}
                onChange={e => setFormData({ ...formData, delayDays: parseInt(e.target.value) || 0 })}
                placeholder="0 pour immédiat"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Laissez à 0 pour déclencher immédiatement
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveRule}
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.length === 0 ? (
          <Card className="p-8 text-center border border-border">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune règle d'automatisation configurée</p>
          </Card>
        ) : (
          rules.map(rule => {
            const trigger = triggerOptions.find(t => t.value === rule.trigger)
            const action = actionOptions.find(a => a.value === rule.action)

            return (
              <Card
                key={rule.id}
                className={cn(
                  'p-4 border cursor-pointer transition-all hover:border-primary/50',
                  !rule.enabled && 'opacity-60'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{rule.name}</h4>
                      {rule.enabled && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-900/20 text-green-400">
                          <CheckCircle className="w-3 h-3" />
                          Actif
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                      <span className="bg-secondary px-2 py-1 rounded">
                        {trigger?.label || rule.trigger}
                      </span>
                      <span className="text-muted-foreground flex items-center">→</span>
                      <span className="bg-secondary px-2 py-1 rounded">
                        {action?.label || rule.action}
                      </span>
                      {rule.delay_days && rule.delay_days > 0 && (
                        <>
                          <span className="text-muted-foreground flex items-center">+</span>
                          <span className="bg-secondary px-2 py-1 rounded">
                            {rule.delay_days} jour{rule.delay_days > 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleRule(rule.id)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      title={rule.enabled ? 'Désactiver' : 'Activer'}
                    >
                      <Toggle2 className={cn('w-5 h-5', rule.enabled && 'text-green-400')} />
                    </button>
                    <button
                      onClick={() => handleEditRule(rule)}
                      className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-2 text-muted-foreground hover:text-red-400 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Info */}
      <Card className="p-4 bg-blue-900/20 border border-blue-800">
        <p className="text-sm text-blue-300">
          <strong>Conseil:</strong> Les règles d'automatisation s'exécutent automatiquement selon leurs conditions de déclenchement. 
          Vous pouvez en activer ou en désactiver à tout moment.
        </p>
      </Card>
    </div>
  )
}
