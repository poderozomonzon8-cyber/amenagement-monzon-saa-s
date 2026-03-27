'use client'

import { useState, useEffect, useTransition } from 'react'
import { getInvoices } from '@/app/actions/invoices'
import { getPayments } from '@/app/actions/payments'
import { getClients } from '@/app/actions/clients'
import { getTimeEntries } from '@/app/actions/time-entries'
import { getProjectWithClient } from '@/app/actions/client-projects'
import { ClientAssignment } from './client-assignment'
import { Project, Invoice, Payment, Client, TimeEntry } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  X, User, Calendar, DollarSign, Clock, FileText, CreditCard,
  MessageSquare, CheckCircle, AlertCircle, ChevronRight, Send, Loader2
} from 'lucide-react'

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

const statusColor: Record<string, string> = {
  in_progress: 'bg-primary/20 text-primary',
  completed:   'bg-green-900/30 text-green-400',
  planning:    'bg-secondary text-muted-foreground',
  on_hold:     'bg-orange-900/30 text-orange-400',
}

const statusLabel: Record<string, string> = {
  in_progress: 'En cours',
  completed:   'Terminé',
  planning:    'Planification',
  on_hold:     'En attente',
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'invoices' | 'messages'>('overview')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const [projectData, setProjectData] = useState(project)

  useEffect(() => {
    Promise.all([
      getInvoices().catch(() => []),
      getPayments().catch(() => []),
      getClients().catch(() => []),
      getTimeEntries().catch(() => []),
      getProjectWithClient(project.id).catch(() => null),
    ]).then(([inv, pay, cli, time, projData]) => {
      setInvoices((inv || []).filter((i: any) => i.project_id === project.id))
      setPayments(pay || [])
      setClients(cli || [])
      setTimeEntries((time || []).filter((t: any) => t.project_id === project.id))
      setProjectData(projData || project)
    }).catch(() => {
      setProjectData(project)
    }).finally(() => setLoading(false))
  }, [project.id, project])

  const client = clients.find(c => c.id === projectData.client_id)
  const clientInfo = projectData.clients?.profiles
  const projectInvoices = invoices
  const projectPayments = payments.filter(p => 
    projectInvoices.some(i => i.id === p.invoice_id)
  )
  
  const totalInvoiced = projectInvoices.reduce((sum, i) => sum + (i.total || 0), 0)
  const totalPaid = projectPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalHours = timeEntries.reduce((sum, t) => sum + (t.hours || 0), 0)

  // Calculate progress based on dates
  const getProgress = () => {
    if (!project.start_date || !project.end_date) return 0
    const start = new Date(project.start_date).getTime()
    const end = new Date(project.end_date).getTime()
    const now = Date.now()
    if (now < start) return 0
    if (now > end) return 100
    return Math.round(((now - start) / (end - start)) * 100)
  }

  const progress = getProgress()

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: CheckCircle },
    { id: 'timeline', label: 'Chronologie', icon: Calendar },
    { id: 'invoices', label: 'Factures', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ] as const

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-border shrink-0">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-serif text-xl text-foreground">{projectData.name}</h2>
              <span className={cn('text-xs px-2 py-0.5 rounded-sm', statusColor[projectData.status])}>
                {statusLabel[projectData.status]}
              </span>
            </div>
            <ClientAssignment
              projectId={projectData.id}
              currentClientId={projectData.client_id}
              currentClientName={clientInfo?.full_name}
              onAssigned={() => getProjectWithClient(projectData.id).then(setProjectData)}
            />
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 border-b border-border shrink-0">
          {tabs.map(tab => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn('flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              )}>
              <tab.icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress Card */}
              <div className="bg-secondary/30 rounded-sm p-4">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Progression</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-secondary)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-primary)" strokeWidth="3"
                        strokeDasharray={`${progress} ${100 - progress}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">{progress}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{progress}% complété</p>
                  </div>
                </div>
              </div>

              {/* Budget Card */}
              <div className="bg-secondary/30 rounded-sm p-4">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Budget</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Budget total</span>
                    <span className="text-foreground font-medium">${(project.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Facturé</span>
                    <span className="text-foreground">${totalInvoiced.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Payé</span>
                    <span className="text-green-400">${totalPaid.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dates Card */}
              <div className="bg-secondary/30 rounded-sm p-4">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Échéances</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Début:</span>
                    <span className="text-foreground">
                      {project.start_date ? new Date(project.start_date).toLocaleDateString('fr-FR') : '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Fin:</span>
                    <span className="text-foreground">
                      {project.end_date ? new Date(project.end_date).toLocaleDateString('fr-FR') : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="bg-secondary/30 rounded-sm p-4">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Heures travaillées</h3>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-serif text-foreground">{totalHours.toFixed(1)}h</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{timeEntries.length} entrées de temps</p>
              </div>
            </div>
          ) : activeTab === 'timeline' ? (
            <div className="space-y-4">
              {timeEntries.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Aucune entrée de temps.</p>
              ) : (
                timeEntries.slice(0, 20).map((entry, i) => (
                  <div key={entry.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {i < timeEntries.length - 1 && <div className="w-px flex-1 bg-border" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-foreground">{entry.description || 'Travail effectué'}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{new Date(entry.date).toLocaleDateString('fr-FR')}</span>
                        <span className="text-primary">{entry.hours}h</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : activeTab === 'invoices' ? (
            <div className="space-y-3">
              {projectInvoices.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">Aucune facture pour ce projet.</p>
              ) : (
                projectInvoices.map(inv => {
                  const invPayments = projectPayments.filter(p => p.invoice_id === inv.id)
                  const paid = invPayments.reduce((s, p) => s + (p.amount || 0), 0)
                  return (
                    <div key={inv.id} className="bg-secondary/30 rounded-sm p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">
                          {(inv as any).invoice_number || `INV-${inv.id.slice(0, 8)}`}
                        </span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-sm',
                          inv.status === 'paid' ? 'bg-green-900/30 text-green-400' :
                          inv.status === 'pending' ? 'bg-amber-900/30 text-amber-400' :
                          'bg-secondary text-muted-foreground'
                        )}>
                          {inv.status === 'paid' ? 'Payée' : inv.status === 'pending' ? 'En attente' : inv.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {new Date(inv.created_at || '').toLocaleDateString('fr-FR')}
                        </span>
                        <div className="text-right">
                          <span className="text-foreground">${(inv.total || 0).toLocaleString()}</span>
                          {paid > 0 && (
                            <span className="text-green-400 text-xs ml-2">(${paid.toLocaleString()} payé)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-3 mb-4">
                <p className="text-muted-foreground text-sm text-center py-8">
                  Les messages seront affichés ici. Fonctionnalité en développement.
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Écrire un message au client..."
                  className="flex-1 bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-sm hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
