'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { createTimeEntry, getTimeEntries } from '@/app/actions/time-entries'
import { getProjects } from '@/app/actions/projects'
import { getOrCreateEmployee } from '@/app/actions/employees'
import { TimeEntry, Project, Employee } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Clock, Camera, Briefcase, Play, Square, CheckCircle, Loader2, Upload, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const recentPhotos = [
  { url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80', label: 'Dalle 2e étage',   date: '18 juil.' },
  { url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80', label: 'Armature pilier',  date: '17 juil.' },
  { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&q=80', label: 'Façade nord',      date: '15 juil.' },
]

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':')
}

export function EmployeeApp() {
  const [tab, setTab]               = useState<'hours' | 'photos' | 'projects'>('hours')
  const [projects, setProjects]     = useState<Project[]>([])
  const [entries, setEntries]       = useState<TimeEntry[]>([])
  const [loading, setLoading]       = useState(true)
  const [employee, setEmployee]     = useState<Employee | null>(null)
  const [userName, setUserName]     = useState('Employé')

  // timer state
  const [timerActive, setTimerActive] = useState(false)
  const [elapsed, setElapsed]         = useState(0)
  const intervalRef                   = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef                  = useRef<number>(0)

  // form state
  const [selectedProject, setSelectedProject] = useState('')
  const [hoursInput, setHoursInput]           = useState('')
  const [description, setDescription]         = useState('')
  const [date, setDate]                       = useState(new Date().toISOString().split('T')[0])
  const [isPending, startTransition]          = useTransition()
  const [toast, setToast]                     = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load user + employee record + data
  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUserName(user.email?.split('@')[0] || 'Employé')
          // Get or create employee record for this profile (also creates profile if missing)
          const emp = await getOrCreateEmployee(user.id, user.email || undefined)
          setEmployee(emp)
        }
        
        const [projs, ents] = await Promise.all([getProjects(), getTimeEntries()])
        setProjects(projs)
        setEntries(ents)
        if (projs.length > 0) setSelectedProject(projs[0].id)
      } catch {
        showToast('Erreur lors du chargement.', 'err')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Timer logic
  useEffect(() => {
    if (timerActive) {
      startTimeRef.current = Date.now() - elapsed * 1000
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      // when stopping, fill hours field from elapsed
      if (elapsed > 0) {
        setHoursInput((elapsed / 3600).toFixed(2))
      }
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive])

  const handleSubmit = () => {
    if (!hoursInput || isNaN(parseFloat(hoursInput))) { showToast('Entrez un nombre d\'heures valide.', 'err'); return }
    if (!employee) { showToast('Profil employé non trouvé.', 'err'); return }
    startTransition(async () => {
      try {
        const entry = await createTimeEntry({
          employee_id: employee.id,
          project_id:  selectedProject || null,
          hours:       parseFloat(hoursInput),
          date,
          description: description || undefined,
        } as any)
        setEntries((prev) => [entry, ...prev])
        setHoursInput('')
        setDescription('')
        setElapsed(0)
        showToast('Heures enregistrées.')
      } catch (e: any) {
        showToast(e.message || 'Erreur.', 'err')
      }
    })
  }

  // Compute weekly total from entries this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1)
  weekStart.setHours(0, 0, 0, 0)
  const weekTotal = entries
    .filter((e) => new Date(e.date) >= weekStart)
    .reduce((s, e) => s + e.hours, 0)

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

      {/* Employee header */}
      <div className="bg-card border border-border rounded-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-serif text-primary font-bold">{userName[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">App Employé</p>
            <h1 className="font-serif text-lg text-foreground capitalize">{userName}</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Cette semaine</p>
          <p className="font-serif text-xl text-primary">{weekTotal.toFixed(1)}h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: 'hours',    label: 'Heures',  icon: Clock     },
          { id: 'photos',   label: 'Photos',  icon: Camera    },
          { id: 'projects', label: 'Projets', icon: Briefcase },
        ] as const).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn('flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            )}>
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Hours tab */}
      {tab === 'hours' && (
        <div className="flex flex-col gap-4">
          <div className="bg-card border border-border rounded-sm p-5">
            <h2 className="font-serif text-base text-foreground mb-4">Enregistrer des heures</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Projet</label>
                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">— Aucun projet —</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Heures travaillées</label>
                <input type="number" step="0.5" min="0" max="24" value={hoursInput} onChange={(e) => setHoursInput(e.target.value)}
                  placeholder="ex: 8.5"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Description</label>
                <input value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tâches effectuées..."
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            </div>

            {/* Stopwatch */}
            <div className="bg-secondary rounded-sm p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Chronomètre</p>
                <p className="font-mono text-2xl text-foreground">{formatElapsed(elapsed)}</p>
              </div>
              <button onClick={() => setTimerActive(!timerActive)}
                className={cn('flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors',
                  timerActive
                    ? 'bg-destructive/20 text-red-400 hover:bg-destructive/30'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                )}>
                {timerActive ? <><Square className="w-4 h-4" /> Arrêter</> : <><Play className="w-4 h-4" /> Démarrer</>}
              </button>
            </div>

            <button onClick={handleSubmit} disabled={isPending}
              className="w-full py-2.5 rounded-sm text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</> : <><CheckCircle className="w-4 h-4" /> Soumettre les heures</>}
            </button>
          </div>

          {/* Recent entries */}
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</div>
          ) : entries.length > 0 && (
            <div className="bg-card border border-border rounded-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h2 className="font-serif text-sm text-foreground">Entrées récentes</h2>
              </div>
              <div className="divide-y divide-border/50">
                {entries.slice(0, 10).map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-sm text-foreground">{e.description || 'Sans description'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">{e.hours}h</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-border bg-secondary flex justify-between">
                <span className="text-sm text-muted-foreground">Total (semaine)</span>
                <span className="text-sm font-semibold text-primary">{weekTotal.toFixed(1)}h</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Photos tab */}
      {tab === 'photos' && (
        <div className="flex flex-col gap-4">
          <div className="border-2 border-dashed border-border rounded-sm p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-colors cursor-pointer bg-card">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Upload className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm text-foreground">Glisser-déposer ou cliquer pour téléverser</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG, HEIC — max 20 Mo</p>
            </div>
            <div className="flex gap-2 mt-1">
              <select className="bg-input border border-border rounded-sm px-2 py-1.5 text-xs text-foreground focus:outline-none">
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" /> Sélectionner
              </button>
            </div>
          </div>
          <div>
            <h3 className="font-serif text-sm text-foreground mb-3">Photos récentes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {recentPhotos.map((p, i) => (
                <div key={i} className="bg-card border border-border rounded-sm overflow-hidden group">
                  <div className="aspect-video overflow-hidden">
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-foreground">{p.label}</p>
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects tab */}
      {tab === 'projects' && (
        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Chargement...</div>
          ) : projects.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun projet assigné.</p>
          ) : (
            projects.map((p) => {
              const projectHours = entries.filter((e) => e.project_id === p.id).reduce((s, e) => s + e.hours, 0)
              const weekHours = entries.filter((e) => e.project_id === p.id && new Date(e.date) >= weekStart).reduce((s, e) => s + e.hours, 0)
              return (
                <div key={p.id} className="bg-card border border-border rounded-sm p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-sm text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{p.status}</p>
                    </div>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-sm">Actif</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-secondary rounded-sm p-2.5">
                      <p className="text-muted-foreground">Heures cette semaine</p>
                      <p className="text-foreground font-semibold text-base mt-0.5">{weekHours.toFixed(1)}h</p>
                    </div>
                    <div className="bg-secondary rounded-sm p-2.5">
                      <p className="text-muted-foreground">Total projet</p>
                      <p className="text-foreground font-semibold text-base mt-0.5">{projectHours.toFixed(1)}h</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
