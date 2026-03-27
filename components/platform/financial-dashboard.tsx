'use client'

import { useState, useEffect } from 'react'
import { getFinancialDashboard, getProjectProfitability, getCashFlowData, getExpenseBreakdown, getMonthlyFinancials } from '@/app/actions/financials'
import { Card } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, TrendingDown, PieChart as PieChartIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProjectProfit {
  id: string
  name: string
  budget: number
  revenue: number
  expenses: number
  labor: number
  totalCost: number
  profit: number
  profitMargin: number
}

export function FinancialDashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
  const [projectProfits, setProjectProfits] = useState<ProjectProfit[]>([])
  const [cashFlow, setCashFlow] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [dash, projects, flow, expenseData, monthly] = await Promise.all([
        getFinancialDashboard(),
        getProjectProfitability(),
        getCashFlowData(),
        getExpenseBreakdown(),
        getMonthlyFinancials(),
      ])
      setDashboard(dash)
      setProjectProfits(projects)
      setCashFlow(flow)
      setExpenses(expenseData)
      setMonthlyData(monthly)
    } catch (err) {
      console.error('Error loading financial data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#a78bfa', '#f87171', '#38bdf8', '#fb923c', '#ec4899']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Intelligence Financière</h1>
        <p className="text-sm text-muted-foreground mt-1">Analyse détaillée de la rentabilité et des flux de trésorerie</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenu total</p>
          <p className="text-2xl font-semibold text-green-400 mt-2">
            ${dashboard?.totalRevenue?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{dashboard?.paidInvoices} factures payées</p>
        </Card>

        <Card className="p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Coûts totaux</p>
          <p className="text-2xl font-semibold text-red-400 mt-2">
            ${dashboard?.totalCosts?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Dépenses + Main-d'œuvre</p>
        </Card>

        <Card className="p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Profit net</p>
          <p className={cn('text-2xl font-semibold mt-2', dashboard?.profit >= 0 ? 'text-green-400' : 'text-red-400')}>
            ${dashboard?.profit?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{dashboard?.profitMargin}% marge</p>
        </Card>

        <Card className="p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenu en attente</p>
          <p className="text-2xl font-semibold text-amber-400 mt-2">
            ${dashboard?.pendingRevenue?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Non encore encaissé</p>
        </Card>

        <Card className="p-4 border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Coûts de main-d'œuvre</p>
          <p className="text-2xl font-semibold text-blue-400 mt-2">
            ${dashboard?.laborCosts?.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{dashboard?.totalExpenses ? `${Math.round((dashboard?.laborCosts / dashboard?.totalCosts) * 100)}% des coûts` : 'N/A'}</p>
        </Card>
      </div>

      {/* Monthly Overview */}
      {monthlyData && (
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Résumé du mois ({monthlyData.month})</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Revenus</p>
              <p className="text-xl font-bold text-green-400">${monthlyData.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Dépenses</p>
              <p className="text-xl font-bold text-red-400">${monthlyData.expenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
            <div className="p-4 bg-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Revenu net</p>
              <p className={cn('text-xl font-bold', monthlyData.net >= 0 ? 'text-green-400' : 'text-red-400')}>
                ${monthlyData.net.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Cash Flow Chart */}
      <Card className="p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Flux de trésorerie (12 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cashFlow}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#34d399" name="Revenus" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#f87171" name="Dépenses" strokeWidth={2} />
            <Line type="monotone" dataKey="net" stroke="#60a5fa" name="Net" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4" />
            Répartition des dépenses
          </h3>
          {expenses.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {expenses.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenses.map((exp, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-foreground">{exp.category}</span>
                    </div>
                    <span className="text-muted-foreground">${exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">Aucune donnée de dépenses</p>
          )}
        </Card>

        {/* Profitability by Project */}
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Top 5 Projets rentables</h3>
          <div className="space-y-3">
            {projectProfits.slice(0, 5).map((proj, idx) => (
              <div key={proj.id} className="p-3 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-foreground text-sm">{idx + 1}. {proj.name}</p>
                  <span className={cn('text-sm font-semibold', proj.profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                    ${proj.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>Revenu: ${proj.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  <span>•</span>
                  <span>Marge: {proj.profitMargin}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* All Projects Table */}
      <Card className="p-6 border border-border overflow-hidden">
        <h3 className="font-semibold text-foreground mb-4">Tous les projets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Projet</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Revenu</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Dépenses</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Main-d'œuvre</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Profit</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Marge</th>
              </tr>
            </thead>
            <tbody>
              {projectProfits.map(proj => (
                <tr key={proj.id} className="border-b border-border/50 hover:bg-secondary/30">
                  <td className="px-4 py-3 text-foreground">{proj.name}</td>
                  <td className="px-4 py-3 text-right text-green-400">${proj.revenue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-right text-red-400">${proj.expenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td className="px-4 py-3 text-right text-blue-400">${proj.labor.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                  <td className={cn('px-4 py-3 text-right font-semibold', proj.profit >= 0 ? 'text-green-400' : 'text-red-400')}>
                    ${proj.profit.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </td>
                  <td className={cn('px-4 py-3 text-right font-semibold', proj.profitMargin >= 20 ? 'text-green-400' : proj.profitMargin >= 0 ? 'text-amber-400' : 'text-red-400')}>
                    {proj.profitMargin}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
