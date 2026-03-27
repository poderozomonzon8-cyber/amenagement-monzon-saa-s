'use client'

import { useState, useEffect } from 'react'
import { getEmployeePerformance, getPerformanceLeaderboard, getEmployeeDetails, getProductivityMetrics } from '@/app/actions/performance'
import { Card } from '@/components/ui/card'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Trophy, Zap, Target, TrendingUp, Clock, Users, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Employee {
  id: string
  name: string
  email: string
  totalHours: number
  avgHoursPerDay: number
  daysWorked: number
  projectsWorked: number
  salary: number
}

interface LeaderboardEntry {
  id: string
  name: string
  hours: number
}

export function EmployeeAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'leaderboard' | 'details'>('overview')
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [employeeDetails, setEmployeeDetails] = useState<any>(null)
  const [productivityMetrics, setProductivityMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [perfData, leaderboardData] = await Promise.all([
        getEmployeePerformance(),
        getPerformanceLeaderboard(),
      ])
      setEmployees(perfData)
      setLeaderboard(leaderboardData)
    } catch (err) {
      console.error('Error loading performance data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectEmployee = async (empId: string) => {
    setSelectedEmployee(empId)
    try {
      const [details, metrics] = await Promise.all([
        getEmployeeDetails(empId),
        getProductivityMetrics(empId),
      ])
      setEmployeeDetails(details)
      setProductivityMetrics(metrics)
    } catch (err) {
      console.error('Error loading employee details:', err)
    }
  }

  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#f87171', '#38bdf8']

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-foreground">Performance des Employés</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['overview', 'leaderboard', 'details'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'overview' ? 'Vue d\'ensemble' : tab === 'leaderboard' ? 'Classement' : 'Détails'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total heures</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {employees.reduce((sum, e) => sum + e.totalHours, 0).toFixed(1)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-primary/50" />
              </div>
            </Card>

            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Employés actifs</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-500/50" />
              </div>
            </Card>

            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Heures moyennes</p>
                  <p className="text-2xl font-semibold text-foreground mt-1">
                    {(employees.reduce((sum, e) => sum + e.totalHours, 0) / employees.length).toFixed(1)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500/50" />
              </div>
            </Card>

            <Card className="p-4 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Top performer</p>
                  <p className="text-lg font-semibold text-foreground mt-1">
                    {employees[0]?.name || 'N/A'}
                  </p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-500/50" />
              </div>
            </Card>
          </div>

          {/* Hours Worked Chart */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Heures travaillées par employé (30 jours)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employees}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <Bar dataKey="totalHours" fill="var(--color-primary)" name="Heures" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Employees Table */}
          <Card className="p-6 border border-border overflow-hidden">
            <h3 className="font-semibold text-foreground mb-4">Détails par employé</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">Nom</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">Total heures</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">Moy/jour</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">Jours travaillés</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider">Projets</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr
                      key={emp.id}
                      onClick={() => handleSelectEmployee(emp.id)}
                      className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-foreground font-medium">{emp.name}</td>
                      <td className="px-4 py-3 text-foreground">{emp.totalHours.toFixed(1)}h</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.avgHoursPerDay}h</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.daysWorked}</td>
                      <td className="px-4 py-3 text-muted-foreground">{emp.projectsWorked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top 10 Performers (30 jours)
            </h3>
            <div className="space-y-2">
              {leaderboard.map((emp, idx) => (
                <div key={emp.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-foreground">{emp.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{emp.hours.toFixed(1)}h</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {!selectedEmployee ? (
            <Card className="p-8 text-center border border-border">
              <p className="text-muted-foreground">Sélectionnez un employé dans l'onglet "Vue d'ensemble"</p>
            </Card>
          ) : employeeDetails && productivityMetrics ? (
            <>
              <Card className="p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">{employeeDetails.employee.name}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total heures</p>
                    <p className="font-semibold text-foreground">{employeeDetails.totalHours.toFixed(1)}h</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Moy/semaine</p>
                    <p className="font-semibold text-foreground">{employeeDetails.avgWeeklyHours}h</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Projets</p>
                    <p className="font-semibold text-foreground">{productivityMetrics.projectsWorked}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Revenue/h</p>
                    <p className="font-semibold text-foreground">${productivityMetrics.billablePerHour}</p>
                  </div>
                </div>
              </Card>

              {/* Weekly Hours Chart */}
              <Card className="p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Heures par semaine</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={employeeDetails.weeklySummary.reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="week" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                    <Line type="monotone" dataKey="hours" stroke="var(--color-primary)" name="Heures" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center border border-border">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
