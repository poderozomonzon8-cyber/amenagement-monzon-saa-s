'use client'

import { useState, useEffect, useTransition } from 'react'
import { getProjects, createProject, updateProject, deleteProject } from '@/app/actions/projects'
import { Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Plus, Search, X, Pencil, Trash2, Loader2, Eye } from 'lucide-react'
import { ProjectDetail } from './project-detail'

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

const EMPTY_FORM = { name: '', status: 'planning', client_id: '', start_date: '', end_date: '', budget: '' }

function ProjectModal({
  project,
  onClose,
  onSaved,
}: {
  project?: Project
  onClose: () => void
  onSaved: (p: Project) => void
}) {
  const [form, setForm] = useState(
    project
      ? { name: project.name, status: project.status, client_id: project.client_id || '', start_date: project.start_date || '', end_date: project.end_date || '', budget: String(project.budget || '') }
      : EMPTY_FORM
  )
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('Le nom du projet est requis.'); return }
    setError('')
    startTransition(async () => {
      try {
        const payload = {
          name:       form.name.trim(),
          status:     form.status,
          client_id:  form.client_id || null,
          start_date: form.start_date || null,
          end_date:   form.end_date   || null,
          budget:     form.budget ? parseFloat(form.budget) : null,
        }
        let saved: Project
        if (project) {
          saved = await updateProject(project.id, payload)
        } else {
          saved = await createProject(payload as any)
        }
        onSaved(saved)
        onClose()
      } catch (e: any) {
        setError(e.message || 'Une erreur est survenue.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">{project ? 'Modifier le projet' : 'Nouveau projet'}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Nom du projet *</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="Ex: Villa Beaumont"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Statut</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="planning">Planification</option>
                <option value="in_progress">En cours</option>
                <option value="on_hold">En attente</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Budget ($)</label>
              <input type="number" value={form.budget} onChange={(e) => set('budget', e.target.value)}
                placeholder="0"
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Date de début</label>
              <input type="date" value={form.start_date} onChange={(e) => set('start_date', e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Date de fin</label>
              <input type="date" value={form.end_date} onChange={(e) => set('end_date', e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-border text-foreground text-sm py-2.5 rounded-sm hover:bg-secondary transition-colors">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {project ? 'Enregistrer' : 'Créer le projet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProjectManagement() {
  const [projects, setProjects]               = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading]                 = useState(true)
  const [search, setSearch]                   = useState('')
  const [showModal, setShowModal]             = useState(false)
  const [editTarget, setEditTarget]           = useState<Project | undefined>(undefined)
  const [deletingId, setDeletingId]           = useState<string | null>(null)
  const [toast, setToast]                     = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [showDetail, setShowDetail]           = useState<Project | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => showToast('Erreur lors du chargement des projets.', 'err'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaved = (saved: Project) => {
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === saved.id)
      return exists ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
    })
    showToast(editTarget ? 'Projet mis à jour.' : 'Projet créé.')
  }

  const openCreate = () => { setEditTarget(undefined); setShowModal(true) }
  const openEdit   = (p: Project) => { setEditTarget(p); setShowModal(true) }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce projet ?')) return
    setDeletingId(id)
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
      if (selectedProject?.id === id) setSelectedProject(null)
      showToast('Projet supprimé.')
    } catch {
      showToast('Erreur lors de la suppression.', 'err')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

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

      {/* Modal */}
      {showModal && (
        <ProjectModal
          project={editTarget}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}

      {/* Project Detail */}
      {showDetail && (
        <ProjectDetail
          project={showDetail}
          onClose={() => setShowDetail(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} projets au total</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>

      {/* Project cards */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="col-span-full text-muted-foreground text-sm">Aucun projet trouvé. Créez votre premier projet.</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id}
                className={cn('bg-card border rounded-sm p-4 transition-colors cursor-pointer group',
                  selectedProject?.id === p.id ? 'border-primary' : 'border-border hover:border-primary/50'
                )}
                onClick={() => setSelectedProject(selectedProject?.id === p.id ? null : p)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-sm shrink-0 ml-2 ${statusColor[p.status] || 'bg-secondary text-muted-foreground'}`}>
                    {statusLabel[p.status] || p.status}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Budget: ${(p.budget || 0).toLocaleString()}</span>
                  {p.end_date && <span>Fin: {new Date(p.end_date).toLocaleDateString('fr-FR')}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Detail panel */}
      {selectedProject && (
        <div className="bg-card border border-border rounded-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-serif text-xl text-foreground">{selectedProject.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-sm mt-1 inline-block ${statusColor[selectedProject.status] || 'bg-secondary text-muted-foreground'}`}>
                {statusLabel[selectedProject.status] || selectedProject.status}
              </span>
            </div>
            <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 border-y border-border mb-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
              <p className="font-medium text-foreground text-lg">${(selectedProject.budget || 0).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Début</p>
              <p className="font-medium text-foreground">
                {selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString('fr-FR') : '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Fin</p>
              <p className="font-medium text-foreground">
                {selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString('fr-FR') : '—'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowDetail(selectedProject)}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-primary/90 transition-colors">
              <Eye className="w-3.5 h-3.5" /> Voir détails
            </button>
            <button onClick={() => openEdit(selectedProject)}
              className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-sm text-sm hover:bg-secondary/80 transition-colors">
              <Pencil className="w-3.5 h-3.5" /> Modifier
            </button>
            <button onClick={() => handleDelete(selectedProject.id)} disabled={deletingId === selectedProject.id}
              className="flex items-center gap-2 bg-red-500/20 text-red-300 px-4 py-2 rounded-sm text-sm hover:bg-red-500/30 transition-colors disabled:opacity-50">
              {deletingId === selectedProject.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
