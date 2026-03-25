"use client"

import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Clock, AlertCircle } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 42000, expenses: 28000 },
  { month: "Fév", revenue: 58000, expenses: 31000 },
  { month: "Mar", revenue: 51000, expenses: 29000 },
  { month: "Avr", revenue: 67000, expenses: 35000 },
  { month: "Mai", revenue: 73000, expenses: 38000 },
  { month: "Jun", revenue: 89000, expenses: 42000 },
  { month: "Jul", revenue: 94000, expenses: 44000 },
  { month: "Aoû", revenue: 88000, expenses: 41000 },
]

const projectsStatus = [
  { name: "Résidentiel", value: 4, fill: "var(--color-chart-1)" },
  { name: "Commercial", value: 3, fill: "var(--color-chart-2)" },
  { name: "Rénovation", value: 2, fill: "var(--color-chart-3)" },
  { name: "Paysager", value: 1, fill: "var(--color-chart-4)" },
]

const stats = [
  { label: "Revenus du mois", value: "$94,200", change: "+12.4%", up: true, icon: DollarSign, color: "text-primary" },
  { label: "Projets actifs", value: "10", change: "+2", up: true, icon: Briefcase, color: "text-primary" },
  { label: "Dépenses totales", value: "$44,100", change: "+6.1%", up: false, icon: AlertCircle, color: "text-destructive" },
  { label: "Heures employés", value: "1,284h", change: "+8.3%", up: true, icon: Clock, color: "text-primary" },
]

const recentProjects = [
  { name: "Villa Beaumont", client: "M. Beaumont", status: "En cours", budget: "$185,000", progress: 72 },
  { name: "Réno Commercial Plaza", client: "Plaza Inc.", status: "En cours", budget: "$320,000", progress: 45 },
  { name: "Résidence Lafleur", client: "Famille Lafleur", status: "Terminé", budget: "$92,500", progress: 100 },
  { name: "Aménagement Jardins St-Henri", client: "Coop St-Henri", status: "Planification", budget: "$48,000", progress: 10 },
  { name: "Bureau Dupont & Associés", client: "Dupont SA", status: "En cours", budget: "$215,000", progress: 61 },
]

const statusColor: Record<string, string> = {
  "En cours": "bg-primary/20 text-primary",
  "Terminé": "bg-green-900/30 text-green-400",
  "Planification": "bg-secondary text-muted-foreground",
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card border border-border p-3 text-xs rounded-sm">
        <p className="text-muted-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: ${p.value.toLocaleString()}</p>
        ))}
      </div>
    )
  }
  return null
}

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground text-sm mt-1">Juillet 2025 — Vue d'ensemble</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary border border-border px-3 py-2 rounded-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>Système actif</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border p-4 rounded-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-muted-foreground text-xs uppercase tracking-wider">{s.label}</p>
              <div className={`w-8 h-8 rounded-sm flex items-center justify-center bg-secondary`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <p className="font-serif text-2xl text-foreground">{s.value}</p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${s.up ? "text-green-400" : "text-red-400"}`}>
              {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{s.change} vs mois dernier</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-card border border-border p-4 rounded-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-base text-foreground">Revenus vs Dépenses</h2>
            <span className="text-xs text-muted-foreground">Jan — Aoû 2025</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-muted-foreground)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-muted-foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" name="Revenus" stroke="var(--color-primary)" strokeWidth={2} fill="url(#revGrad)" />
              <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="var(--color-muted-foreground)" strokeWidth={1.5} fill="url(#expGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Projects by type */}
        <div className="bg-card border border-border p-4 rounded-sm">
          <h2 className="font-serif text-base text-foreground mb-4">Projets par type</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={projectsStatus} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--color-muted-foreground)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name="Projets" fill="var(--color-primary)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-col gap-2">
            {projectsStatus.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{p.name}</span>
                <span className="text-foreground font-medium">{p.value} projets</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent projects table */}
      <div className="bg-card border border-border rounded-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="font-serif text-base text-foreground">Projets récents</h2>
          <button className="text-xs text-primary hover:underline">Voir tout</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Projet</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Statut</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium hidden sm:table-cell">Budget</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium hidden lg:table-cell">Progression</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((p) => (
                <tr key={p.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.client}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-sm ${statusColor[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground hidden sm:table-cell">{p.budget}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
