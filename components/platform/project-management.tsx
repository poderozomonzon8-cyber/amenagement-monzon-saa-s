'use client'

import { useState, useEffect } from 'react'
import { getProjects, updateProject, deleteProject } from '@/app/actions/projects'
import { Project } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  Plus, Search, ChevronRight, Camera, Clock, DollarSign,
  Calendar, MapPin, User, CheckSquare, X, Upload
} from 'lucide-react'

const statusColor: Record<string, string> = {
  in_progress: 'bg-primary/20 text-primary',
  completed: 'bg-green-900/30 text-green-400',
  planning: 'bg-secondary text-muted-foreground',
  on_hold: 'bg-orange-900/30 text-orange-400',
}

const statusLabel: Record<string, string> = {
  in_progress: 'En cours',
  completed: 'Terminé',
  planning: 'Planification',
  on_hold: 'En attente',
}

export function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        const data = await getProjects(user.id)
        setProjects(data || [])
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [router, supabase])

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      setProjects(projects.filter((p) => p.id !== id))
      setSelectedProject(null)
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const filtered = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Projets</h1>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Projets</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} projets au total</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <Plus className="w-4 h-4" /> Nouveau projet
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un projet..."
          className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="col-span-full text-muted-foreground text-sm">Aucun projet trouvé</p>
        ) : (
          filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="bg-card border border-border rounded-sm p-4 text-left hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-serif text-sm text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-sm shrink-0 ml-2 ${statusColor[p.status]}`}>
                  {statusLabel[p.status]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-foreground">${p.budget.toLocaleString()}</span>
                <span className="text-muted-foreground">${p.spent ? p.spent.toLocaleString() : '0'} dépensé</span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${p.budget > 0 ? (p.spent / p.budget) * 100 : 0}%` }}
                />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Project Detail */}
      {selectedProject && (
        <div className="bg-card border border-border rounded-sm p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-xl text-foreground">{selectedProject.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedProject.description}</p>
            </div>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Budget</p>
              <p className="font-medium text-foreground text-lg">${selectedProject.budget.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Dépensé</p>
              <p className="font-medium text-foreground text-lg">${selectedProject.spent ? selectedProject.spent.toLocaleString() : '0'}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Début</p>
              <p className="font-medium text-foreground text-lg">
                {new Date(selectedProject.start_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Fin</p>
              <p className="font-medium text-foreground text-lg">
                {new Date(selectedProject.end_date).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleDeleteProject(selectedProject.id)}
              className="bg-red-500/20 text-red-300 px-4 py-2 rounded text-sm hover:bg-red-500/30 transition-colors"
            >
              Supprimer
            </button>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:opacity-90 transition-opacity">
              Modifier
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
