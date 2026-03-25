"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Clock, Camera, Briefcase, Play, Square, Upload, CheckCircle, Plus } from "lucide-react"

const assignedProjects = [
  { id: 1, name: "Villa Beaumont", role: "Maçon", location: "Outremont", hoursThisWeek: 38, totalHours: 320, nextTask: "Coulage dalle 3e étage" },
  { id: 2, name: "Bureau Dupont", role: "Électricien", location: "Vieux-Montréal", hoursThisWeek: 0, totalHours: 142, nextTask: "Câblage tableau électrique" },
]

const weekLogs = [
  { day: "Lundi", hours: 8.5, project: "Villa Beaumont", status: "logged" },
  { day: "Mardi", hours: 8.0, project: "Villa Beaumont", status: "logged" },
  { day: "Mercredi", hours: 7.5, project: "Villa Beaumont", status: "logged" },
  { day: "Jeudi", hours: 8.0, project: "Villa Beaumont", status: "logged" },
  { day: "Vendredi", hours: 6.0, project: "Villa Beaumont", status: "logged" },
  { day: "Samedi", hours: 0, project: "—", status: "off" },
  { day: "Dimanche", hours: 0, project: "—", status: "off" },
]

const recentPhotos = [
  { url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80", label: "Dalle 2e étage", date: "18 juil." },
  { url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80", label: "Armature pilier", date: "17 juil." },
  { url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&q=80", label: "Façade nord", date: "15 juil." },
]

export function EmployeeApp() {
  const [tab, setTab] = useState<"hours" | "photos" | "projects">("hours")
  const [timerActive, setTimerActive] = useState(false)
  const [elapsed, setElapsed] = useState("00:00:00")
  const [selectedProject, setSelectedProject] = useState("Villa Beaumont")
  const [hoursInput, setHoursInput] = useState("")
  const [loggedToday, setLoggedToday] = useState(false)

  const totalWeek = weekLogs.reduce((s, l) => s + l.hours, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Employee header */}
      <div className="bg-card border border-border rounded-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-serif text-primary font-bold">J</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">App Employé</p>
            <h1 className="font-serif text-lg text-foreground">Jean Dupont</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Semaine actuelle</p>
          <p className="font-serif text-xl text-primary">{totalWeek}h</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {([
          { id: "hours", label: "Heures", icon: Clock },
          { id: "photos", label: "Photos", icon: Camera },
          { id: "projects", label: "Projets", icon: Briefcase },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors",
              tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {tab === "hours" && (
        <div className="flex flex-col gap-4">
          {/* Timer widget */}
          <div className="bg-card border border-border rounded-sm p-5">
            <h2 className="font-serif text-base text-foreground mb-4">Enregistrer des heures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Projet</label>
                <select
                  value={selectedProject}
                  onChange={e => setSelectedProject(e.target.value)}
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {assignedProjects.map(p => <option key={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Heures travaillées</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="24"
                  value={hoursInput}
                  onChange={e => setHoursInput(e.target.value)}
                  placeholder="ex: 8.5"
                  className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* Live timer */}
            <div className="bg-secondary rounded-sm p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Chronomètre</p>
                <p className="font-mono text-2xl text-foreground">{elapsed}</p>
              </div>
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors",
                  timerActive ? "bg-destructive/20 text-red-400 hover:bg-destructive/30" : "bg-primary/20 text-primary hover:bg-primary/30"
                )}
              >
                {timerActive ? <><Square className="w-4 h-4" /> Arrêter</> : <><Play className="w-4 h-4" /> Démarrer</>}
              </button>
            </div>

            <button
              onClick={() => setLoggedToday(true)}
              disabled={loggedToday}
              className={cn("w-full py-2.5 rounded-sm text-sm font-medium transition-colors",
                loggedToday ? "bg-green-900/20 text-green-400 border border-green-900/30" : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {loggedToday ? <span className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Heures enregistrées</span> : "Soumettre les heures"}
            </button>
          </div>

          {/* Weekly log */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="font-serif text-sm text-foreground">Journal de la semaine</h2>
            </div>
            <div className="divide-y divide-border/50">
              {weekLogs.map((log) => (
                <div key={log.day} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-20">{log.day}</span>
                    {log.status === "logged" ? (
                      <span className="text-xs text-muted-foreground">{log.project}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">Congé</span>
                    )}
                  </div>
                  <span className={cn("text-sm font-medium", log.hours > 0 ? "text-foreground" : "text-muted-foreground/50")}>
                    {log.hours > 0 ? `${log.hours}h` : "—"}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-border bg-secondary flex justify-between">
              <span className="text-sm text-muted-foreground">Total semaine</span>
              <span className="text-sm font-semibold text-primary">{totalWeek}h</span>
            </div>
          </div>
        </div>
      )}

      {tab === "photos" && (
        <div className="flex flex-col gap-4">
          {/* Upload zone */}
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
                {assignedProjects.map(p => <option key={p.id}>{p.name}</option>)}
              </select>
              <button className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center gap-1">
                <Plus className="w-3 h-3" /> Sélectionner
              </button>
            </div>
          </div>

          {/* Recent uploads */}
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

      {tab === "projects" && (
        <div className="flex flex-col gap-4">
          {assignedProjects.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-serif text-sm text-foreground">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.role} — {p.location}</p>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-sm">Actif</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                <div className="bg-secondary rounded-sm p-2.5">
                  <p className="text-muted-foreground">Heures cette semaine</p>
                  <p className="text-foreground font-semibold text-base mt-0.5">{p.hoursThisWeek}h</p>
                </div>
                <div className="bg-secondary rounded-sm p-2.5">
                  <p className="text-muted-foreground">Total projet</p>
                  <p className="text-foreground font-semibold text-base mt-0.5">{p.totalHours}h</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-primary">●</span>
                <span className="text-muted-foreground">Prochaine tâche :</span>
                <span className="text-foreground">{p.nextTask}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
