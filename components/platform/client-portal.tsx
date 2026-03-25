'use client'

import { useState, useEffect, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getProjects } from '@/app/actions/projects'
import { getInvoices } from '@/app/actions/invoices'
import { getPayments } from '@/app/actions/payments'
import { getClients } from '@/app/actions/clients'
import { Project, Invoice, Payment, Client } from '@/lib/types'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, FolderOpen, Calendar, MessageSquare,
  FileText, ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle,
  User, Loader2, Send
} from 'lucide-react'

const clientNav = [
  { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: 'projects', label: 'Mes projets', icon: FolderOpen },
  { id: 'calendar', label: 'Calendrier', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'invoices', label: 'Factures', icon: FileText },
]

export function ClientPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [message, setMessage] = useState('')
  const [user, setUser] = useState<any>(null)
  const [clientProfile, setClientProfile] = useState<Client | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (!user) {
          setLoading(false)
          return
        }

        // Load all data
        const [allClients, allProjects, allInvoices, allPayments] = await Promise.all([
          getClients(),
          getProjects(),
          getInvoices(),
          getPayments(),
        ])

        // Find client profile for this user
        const myClient = allClients.find(c => c.profile_id === user.id)
        setClientProfile(myClient || null)

        // Filter projects for this client
        const myProjects = myClient 
          ? allProjects.filter(p => p.client_id === myClient.id)
          : []
        setProjects(myProjects)

        // Filter invoices for this client
        const myInvoices = myClient
          ? allInvoices.filter(i => i.client_id === myClient.id)
          : []
        setInvoices(myInvoices)

        // Filter payments for client's invoices
        const invoiceIds = myInvoices.map(i => i.id)
        const myPayments = allPayments.filter(p => invoiceIds.includes(p.invoice_id || ''))
        setPayments(myPayments)

      } catch (error) {
        console.error('Error loading client data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase])

  // Calculate totals
  const totalInvoiced = invoices.reduce((sum, i) => sum + (i.total || 0), 0)
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingInvoices = invoices.filter(i => i.status === 'pending')

  // Get main project (first active one)
  const mainProject = projects.find(p => p.status === 'in_progress') || projects[0]

  // Calculate project progress
  const getProgress = (project: Project) => {
    if (!project?.start_date || !project?.end_date) return 0
    const start = new Date(project.start_date).getTime()
    const end = new Date(project.end_date).getTime()
    const now = Date.now()
    if (now < start) return 0
    if (now > end) return 100
    return Math.round(((now - start) / (end - start)) * 100)
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Client'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Client header */}
      <div className="bg-card border border-border rounded-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <span className="font-serif text-primary text-lg font-bold">
            {userName[0]?.toUpperCase() || 'C'}
          </span>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Portail Client</p>
          <h1 className="font-serif text-xl text-foreground">Bienvenue, {userName}</h1>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border-b border-border overflow-x-auto">
        {clientNav.map((n) => (
          <button
            key={n.id}
            onClick={() => setActiveTab(n.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors',
              activeTab === n.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <n.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{n.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main project card */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {mainProject ? (
              <div className="bg-card border border-border rounded-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="font-serif text-lg text-foreground">{mainProject.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {mainProject.end_date 
                        ? `Fin prévue: ${new Date(mainProject.end_date).toLocaleDateString('fr-FR')}`
                        : 'Date de fin non définie'}
                    </p>
                  </div>
                  <span className={cn('text-xs px-2 py-0.5 rounded-sm',
                    mainProject.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                    mainProject.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    'bg-secondary text-muted-foreground'
                  )}>
                    {mainProject.status === 'in_progress' ? 'En cours' :
                     mainProject.status === 'completed' ? 'Terminé' :
                     mainProject.status === 'planning' ? 'Planification' : mainProject.status}
                  </span>
                </div>
                
                {/* Progress */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-secondary)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-primary)" strokeWidth="3"
                        strokeDasharray={`${getProgress(mainProject)} ${100 - getProgress(mainProject)}`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                      {getProgress(mainProject)}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${getProgress(mainProject)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{getProgress(mainProject)}% complété</p>
                  </div>
                </div>

                {/* Budget info */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-foreground font-medium">${(mainProject.budget || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payé</p>
                    <p className="text-green-400 font-medium">${totalPaid.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-sm p-8 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun projet en cours.</p>
              </div>
            )}

            {/* Recent activity placeholder */}
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="font-serif text-sm text-foreground mb-3">Activité récente</h3>
              <div className="space-y-2">
                {invoices.slice(0, 3).map(inv => (
                  <div key={inv.id} className="flex items-start gap-2.5 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <span className="text-foreground">Facture {(inv as any).invoice_number || `#${inv.id.slice(0,6)}`}</span>
                      <span className="text-muted-foreground ml-2">
                        ${(inv.total || 0).toLocaleString()} - {inv.status === 'paid' ? 'Payée' : 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
                {invoices.length === 0 && (
                  <p className="text-muted-foreground text-sm">Aucune activité récente.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Factures récentes</h3>
              {invoices.slice(0, 3).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                  <div>
                    <p className="text-xs text-primary font-mono">{(inv as any).invoice_number || `INV-${inv.id.slice(0,6)}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(inv.created_at || '').toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground">${(inv.total || 0).toLocaleString()}</p>
                    <span className={cn('text-xs', inv.status === 'paid' ? 'text-green-400' : 'text-amber-400')}>
                      {inv.status === 'paid' ? 'Payée' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-muted-foreground text-sm">Aucune facture.</p>
              )}
            </div>

            <div className="bg-card border border-border rounded-sm p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Contact</h3>
              <div className="flex flex-col gap-2.5">
                <div>
                  <p className="text-sm text-foreground">Bureau Monzon</p>
                  <p className="text-xs text-muted-foreground">Administration</p>
                  <p className="text-xs text-primary mt-0.5">info@monzon.ca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="bg-card border border-border rounded-sm p-8 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun projet associé à votre compte.</p>
            </div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif text-sm text-foreground">{p.name}</h3>
                  <span className={cn('text-xs px-2 py-0.5 rounded-sm',
                    p.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                    p.status === 'completed' ? 'bg-green-900/30 text-green-400' :
                    'bg-secondary text-muted-foreground'
                  )}>
                    {p.status === 'in_progress' ? 'En cours' : p.status === 'completed' ? 'Terminé' : p.status}
                  </span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-1">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${getProgress(p)}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{getProgress(p)}% complété</span>
                  <span>Budget: ${(p.budget || 0).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          {invoices.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune facture.</p>
            </div>
          ) : (
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
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-primary font-mono text-xs">
                      {(inv as any).invoice_number || `INV-${inv.id.slice(0,6)}`}
                    </td>
                    <td className="px-4 py-3 text-foreground font-medium">${(inv.total || 0).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs px-2 py-0.5 rounded-sm',
                        inv.status === 'paid' ? 'bg-green-900/20 text-green-400' : 'bg-amber-900/20 text-amber-400'
                      )}>
                        {inv.status === 'paid' ? 'Payée' : 'En attente'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {new Date(inv.created_at || '').toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="bg-card border border-border rounded-sm p-4">
          <p className="text-muted-foreground text-sm text-center py-8">
            Calendrier des événements du projet. Fonctionnalité bientôt disponible.
          </p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="min-h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground text-sm text-center">
              Messagerie avec votre équipe de projet. Fonctionnalité bientôt disponible.
            </p>
          </div>
          <div className="border-t border-border pt-4 mt-4 flex gap-3">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
