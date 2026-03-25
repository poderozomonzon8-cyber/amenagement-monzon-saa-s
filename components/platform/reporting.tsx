'use client'

import { useState, useEffect } from 'react'
import { getProjects } from '@/app/actions/projects'
import { getInvoices } from '@/app/actions/invoices'
import { getTimeEntries } from '@/app/actions/time-entries'
import { getEmployees } from '@/app/actions/employees'
import { Project, Invoice, TimeEntry, Employee } from '@/lib/types'
import { 
  BarChart3, TrendingUp, DollarSign, Clock, Users, FileText,
  Download, Calendar, Filter, Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Period = 'week' | 'month' | 'quarter' | 'year'

export function Reporting() {
  const [projects, setProjects] = useState<Project[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<Period>('month')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [p, i, t, e] = await Promise.all([
          getProjects(),
          getInvoices(),
          getTimeEntries(),
          getEmployees()
        ])
        setProjects(p)
        setInvoices(i)
        setTimeEntries(t)
        setEmployees(e)
      } catch (err) {
        console.error('Failed to load reporting data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate metrics
  const totalRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.total || 0), 0)
  
  const pendingRevenue = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + (i.total || 0), 0)
  
  const totalHours = timeEntries.reduce((sum, t) => sum + (t.hours || 0), 0)
  
  const activeProjects = projects.filter(p => p.status === 'in_progress').length
  
  const paidInvoices = invoices.filter(i => i.status === 'paid').length
  const overdueInvoices = invoices.filter(i => i.status === 'overdue').length

  // Group invoices by month for chart
  const monthlyRevenue = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, inv) => {
      const month = new Date(inv.created_at || '').toLocaleString('fr-CA', { month: 'short' })
      acc[month] = (acc[month] || 0) + (inv.total || 0)
      return acc
    }, {} as Record<string, number>)

  // Group hours by employee
  const hoursByEmployee = timeEntries.reduce((acc, entry) => {
    const emp = employees.find(e => e.id === entry.employee_id)
    const name = (emp as any)?.profiles?.full_name || 'Inconnu'
    acc[name] = (acc[name] || 0) + (entry.hours || 0)
    return acc
  }, {} as Record<string, number>)

  // Group revenue by project
  const revenueByProject = invoices
    .filter(i => i.status === 'paid')
    .reduce((acc, inv) => {
      const proj = projects.find(p => p.id === inv.project_id)
      const name = proj?.name || 'Sans projet'
      acc[name] = (acc[name] || 0) + (inv.total || 0)
      return acc
    }, {} as Record<string, number>)

  const exportCSV = () => {
    const headers = ['Type', 'Nom', 'Montant', 'Date', 'Statut']
    const rows = invoices.map(inv => [
      'Facture',
      inv.invoice_number,
      inv.total?.toFixed(2) || '0',
      inv.created_at || '',
      inv.status
    ])
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Rapports et Analyses</h1>
          <p className="text-muted-foreground text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-secondary rounded-sm p-1">
            {(['week', 'month', 'quarter', 'year'] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${
                  period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {p === 'week' ? 'Semaine' : p === 'month' ? 'Mois' : p === 'quarter' ? 'Trimestre' : 'Année'}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" /> Exporter CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Revenus Totaux</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalRevenue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
              <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Factures payées
              </p>
            </div>
            <div className="w-12 h-12 rounded-sm bg-primary/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">En Attente</p>
              <p className="text-2xl font-bold text-foreground mt-1">{pendingRevenue.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</p>
              <p className="text-xs text-amber-500 mt-1">{overdueInvoices} factures en retard</p>
            </div>
            <div className="w-12 h-12 rounded-sm bg-amber-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Heures Totales</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalHours.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground mt-1">{employees.length} employés actifs</p>
            </div>
            <div className="w-12 h-12 rounded-sm bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Projets Actifs</p>
              <p className="text-2xl font-bold text-foreground mt-1">{activeProjects}</p>
              <p className="text-xs text-muted-foreground mt-1">{projects.length} projets au total</p>
            </div>
            <div className="w-12 h-12 rounded-sm bg-green-500/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Revenue Chart */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-medium text-foreground mb-4">Revenus par Mois</h3>
          <div className="space-y-3">
            {Object.entries(monthlyRevenue).length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
            ) : (
              Object.entries(monthlyRevenue).slice(0, 6).map(([month, amount]) => {
                const maxAmount = Math.max(...Object.values(monthlyRevenue))
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
                return (
                  <div key={month} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">{month}</span>
                      <span className="text-foreground font-medium">{amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Hours by Employee */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-medium text-foreground mb-4">Heures par Employé</h3>
          <div className="space-y-3">
            {Object.entries(hoursByEmployee).length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
            ) : (
              Object.entries(hoursByEmployee).slice(0, 6).map(([name, hours]) => {
                const maxHours = Math.max(...Object.values(hoursByEmployee))
                const percentage = maxHours > 0 ? (hours / maxHours) * 100 : 0
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="text-foreground font-medium">{hours.toFixed(1)}h</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Revenue by Project */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-medium text-foreground mb-4">Revenus par Projet</h3>
          <div className="space-y-3">
            {Object.entries(revenueByProject).length === 0 ? (
              <p className="text-muted-foreground text-sm">Aucune donnée disponible</p>
            ) : (
              Object.entries(revenueByProject).slice(0, 6).map(([name, amount]) => {
                const maxAmount = Math.max(...Object.values(revenueByProject))
                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
                return (
                  <div key={name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate max-w-[200px]">{name}</span>
                      <span className="text-foreground font-medium">{amount.toLocaleString('fr-CA', { style: 'currency', currency: 'CAD' })}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Invoice Status Summary */}
        <div className="bg-card border border-border rounded-sm p-6">
          <h3 className="font-medium text-foreground mb-4">Statut des Factures</h3>
          <div className="space-y-4">
            {[
              { label: 'Payées', count: paidInvoices, color: 'bg-green-500' },
              { label: 'Envoyées', count: invoices.filter(i => i.status === 'sent').length, color: 'bg-blue-500' },
              { label: 'En retard', count: overdueInvoices, color: 'bg-red-500' },
              { label: 'Brouillons', count: invoices.filter(i => i.status === 'draft').length, color: 'bg-gray-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
