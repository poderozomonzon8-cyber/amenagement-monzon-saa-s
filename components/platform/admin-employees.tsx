"use client"

import { useState, useEffect, useTransition } from 'react'
import { getEmployees, createEmployee, deleteEmployee } from '@/app/actions/employees'
import { getTimeEntries, updateTimeEntry, deleteTimeEntry } from '@/app/actions/time-entries'
import { getProjects } from '@/app/actions/projects'
import { Employee, TimeEntry, Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { 
  Users, Clock, Plus, Trash2, X, Search, 
  Calendar, Briefcase, Edit3, Save
} from 'lucide-react'

interface EmployeeWithProfile extends Employee {
  profiles?: {
    full_name: string
    phone: string | null
    role: string
  }
}

export function AdminEmployees() {
  const [employees, setEmployees] = useState<EmployeeWithProfile[]>([])
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithProfile | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editHours, setEditHours] = useState('')
  
  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [emps, entries, projs] = await Promise.all([
          getEmployees(),
          getTimeEntries(),
          getProjects()
        ])
        setEmployees(emps)
        setTimeEntries(entries)
        setProjects(projs)
      } catch (e) {
        showToast('Erreur lors du chargement.', 'err')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter employees
  const filtered = employees.filter(e => 
    e.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  )

  // Calculate hours for an employee
  const getEmployeeHours = (employeeId: string) => {
    return timeEntries
      .filter(t => t.employee_id === employeeId)
      .reduce((sum, t) => sum + t.hours, 0)
  }

  // Get entries for selected employee
  const selectedEntries = selectedEmployee 
    ? timeEntries.filter(t => t.employee_id === selectedEmployee.id)
    : []

  // Delete employee handler
  const handleDeleteEmployee = (id: string) => {
    if (!confirm('Supprimer cet employé?')) return
    startTransition(async () => {
      try {
        await deleteEmployee(id)
        setEmployees(prev => prev.filter(e => e.id !== id))
        if (selectedEmployee?.id === id) setSelectedEmployee(null)
        showToast('Employé supprimé.', 'ok')
      } catch {
        showToast('Erreur lors de la suppression.', 'err')
      }
    })
  }

  // Edit time entry handler
  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry.id)
    setEditHours(entry.hours.toString())
  }

  // Save time entry handler
  const handleSaveEntry = (entryId: string) => {
    const newHours = parseFloat(editHours)
    if (isNaN(newHours) || newHours < 0) {
      showToast('Heures invalides.', 'err')
      return
    }
    startTransition(async () => {
      try {
        await updateTimeEntry(entryId, { hours: newHours })
        setTimeEntries(prev => prev.map(e => 
          e.id === entryId ? { ...e, hours: newHours } : e
        ))
        setEditingEntry(null)
        showToast('Heures modifiées.', 'ok')
      } catch {
        showToast('Erreur lors de la modification.', 'err')
      }
    })
  }

  // Delete time entry handler
  const handleDeleteEntry = (entryId: string) => {
    if (!confirm('Supprimer cette entrée?')) return
    startTransition(async () => {
      try {
        await deleteTimeEntry(entryId)
        setTimeEntries(prev => prev.filter(e => e.id !== entryId))
        showToast('Entrée supprimée.', 'ok')
      } catch {
        showToast('Erreur lors de la suppression.', 'err')
      }
    })
  }

  // Calculate weekly totals
  const thisWeekEntries = timeEntries.filter(t => {
    const entryDate = new Date(t.date)
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    return entryDate >= startOfWeek
  })
  const totalWeekHours = thisWeekEntries.reduce((sum, t) => sum + t.hours, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-4 right-4 px-4 py-2.5 rounded-sm text-sm z-50",
          toast.type === 'ok' ? "bg-green-900/20 text-green-400 border border-green-900/30" : "bg-red-900/20 text-red-400 border border-red-900/30"
        )}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Gestion des Employés</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {employees.length} employés | {totalWeekHours.toFixed(1)}h cette semaine
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un employé
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Employés</span>
          </div>
          <p className="font-serif text-2xl text-foreground">{employees.length}</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Heures (semaine)</span>
          </div>
          <p className="font-serif text-2xl text-primary">{totalWeekHours.toFixed(1)}h</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Projets actifs</span>
          </div>
          <p className="font-serif text-2xl text-foreground">{projects.filter(p => p.status === 'in_progress').length}</p>
        </div>
        <div className="bg-card border border-border rounded-sm p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Entrées (semaine)</span>
          </div>
          <p className="font-serif text-2xl text-foreground">{thisWeekEntries.length}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Employee List */}
        <div className="lg:w-1/2">
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="p-3 border-b border-border flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un employé..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Aucun employé trouvé.
                </div>
              ) : (
                filtered.map(emp => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className={cn(
                      "p-4 cursor-pointer transition-colors",
                      selectedEmployee?.id === emp.id ? "bg-primary/10 border-l-2 border-primary" : "hover:bg-secondary"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {emp.profiles?.full_name || 'Sans nom'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {emp.position || 'Non défini'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-primary font-medium">
                          {getEmployeeHours(emp.id).toFixed(1)}h
                        </p>
                        <p className="text-xs text-muted-foreground">total</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="lg:w-1/2">
          {selectedEmployee ? (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-foreground">
                    {selectedEmployee.profiles?.full_name || 'Employé'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedEmployee.position || 'Position non définie'}
                    {selectedEmployee.salary && ` | $${selectedEmployee.salary.toLocaleString()}/an`}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                  disabled={isPending}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Time Entries */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Entrées de temps récentes
                  </p>
                  <p className="text-xs text-primary">
                    {getEmployeeHours(selectedEmployee.id).toFixed(1)}h total
                  </p>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {selectedEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune entrée de temps.
                    </p>
                  ) : (
                    selectedEntries.slice(0, 10).map(entry => {
                      const project = projects.find(p => p.id === entry.project_id)
                      const isEditing = editingEntry === entry.id
                      return (
                        <div key={entry.id} className="bg-secondary rounded-sm p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm text-foreground">
                                {project?.name || 'Projet inconnu'}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {new Date(entry.date).toLocaleDateString('fr-FR')}
                                {entry.description && ` — ${entry.description}`}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {isEditing ? (
                                <>
                                  <input
                                    type="number"
                                    step="0.5"
                                    value={editHours}
                                    onChange={e => setEditHours(e.target.value)}
                                    className="w-16 bg-input border border-border rounded-sm px-2 py-1 text-sm text-foreground text-right"
                                  />
                                  <button
                                    onClick={() => handleSaveEntry(entry.id)}
                                    disabled={isPending}
                                    className="p-1.5 text-green-400 hover:bg-green-400/20 rounded-sm transition-colors"
                                  >
                                    <Save className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingEntry(null)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <p className="text-sm text-primary font-medium">
                                    {entry.hours}h
                                  </p>
                                  <button
                                    onClick={() => handleEditEntry(entry)}
                                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.id)}
                                    disabled={isPending}
                                    className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-sm p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Users className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">
                Sélectionnez un employé pour voir ses détails.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={(emp) => {
            setEmployees(prev => [...prev, emp])
            setShowAddModal(false)
            showToast('Employé ajouté.', 'ok')
          }}
        />
      )}
    </div>
  )
}

function AddEmployeeModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (emp: EmployeeWithProfile) => void }) {
  const [position, setPosition] = useState('')
  const [salary, setSalary] = useState('')
  const [profileId, setProfileId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileId) {
      setError('L\'ID du profil est requis.')
      return
    }
    startTransition(async () => {
      try {
        const emp = await createEmployee({
          profile_id: profileId,
          position: position || undefined,
          salary: salary ? parseFloat(salary) : undefined
        })
        onSuccess(emp as EmployeeWithProfile)
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la création.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-serif text-lg text-foreground">Ajouter un employé</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/20 text-red-400 border border-red-900/30 rounded-sm p-3 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              ID du Profil (UUID) *
            </label>
            <input
              value={profileId}
              onChange={e => setProfileId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-1">
              L'utilisateur doit d'abord s'inscrire pour obtenir un profil.
            </p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              Poste
            </label>
            <input
              value={position}
              onChange={e => setPosition(e.target.value)}
              placeholder="Ex: Chef de chantier"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              Salaire annuel ($)
            </label>
            <input
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              placeholder="50000"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isPending && <div className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />}
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
