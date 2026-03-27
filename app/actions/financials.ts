'use server'

import { createClient } from '@/lib/supabase/server'

export async function getFinancialDashboard() {
  const supabase = await createClient()

  // Get all invoices for revenue calculations
  const { data: invoices, error: invError } = await supabase
    .from('invoices')
    .select(`
      id,
      total,
      status,
      project_id,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (invError) throw new Error(invError.message)

  // Get all expenses
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('*')

  if (expError) throw new Error(expError.message)

  // Get all time entries for labor cost calculation
  const { data: timeEntries, error: teError } = await supabase
    .from('time_entries')
    .select(`
      *,
      employees(salary)
    `)

  if (teError) throw new Error(teError.message)

  // Calculate metrics
  const totalRevenue = invoices
    ?.filter(i => i.status === 'paid')
    ?.reduce((sum, i) => sum + (i.total || 0), 0) || 0

  const pendingRevenue = invoices
    ?.filter(i => i.status === 'sent' || i.status === 'draft')
    ?.reduce((sum, i) => sum + (i.total || 0), 0) || 0

  const totalExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

  // Calculate labor costs (assuming $50/hour average if no salary data)
  const laborCosts = timeEntries?.reduce((sum, entry: any) => {
    const hourlyRate = entry.employees?.salary ? entry.employees.salary / 2080 : 50 // 2080 hours/year
    return sum + (entry.hours || 0) * hourlyRate
  }, 0) || 0

  const totalCosts = totalExpenses + laborCosts
  const profit = totalRevenue - totalCosts
  const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0

  return {
    totalRevenue,
    pendingRevenue,
    totalExpenses,
    laborCosts,
    totalCosts,
    profit,
    profitMargin: Math.round(profitMargin * 100) / 100,
    invoiceCount: invoices?.length || 0,
    paidInvoices: invoices?.filter(i => i.status === 'paid').length || 0,
  }
}

export async function getProjectProfitability() {
  const supabase = await createClient()

  // Get projects with their financial data
  const { data: projects, error: projError } = await supabase
    .from('projects')
    .select('id, name, budget')
    .order('created_at', { ascending: false })
    .limit(50)

  if (projError) throw new Error(projError.message)

  // For each project, calculate profit
  const projectProfits = await Promise.all(
    (projects || []).map(async (project: any) => {
      // Get invoices for this project
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total, status')
        .eq('project_id', project.id)
        .eq('status', 'paid')

      const revenue = invoices?.reduce((sum, i) => sum + (i.total || 0), 0) || 0

      // Get expenses for this project
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount')
        .eq('project_id', project.id)

      const expensesCost = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

      // Get time entries for this project
      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select('hours, employees(salary)')
        .eq('project_id', project.id)

      const laborCost = timeEntries?.reduce((sum: number, entry: any) => {
        const hourlyRate = entry.employees?.salary ? entry.employees.salary / 2080 : 50
        return sum + (entry.hours || 0) * hourlyRate
      }, 0) || 0

      const totalCost = expensesCost + laborCost
      const profit = revenue - totalCost
      const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0

      return {
        id: project.id,
        name: project.name,
        budget: project.budget || 0,
        revenue,
        expenses: expensesCost,
        labor: laborCost,
        totalCost,
        profit,
        profitMargin: Math.round(profitMargin * 100) / 100,
      }
    })
  )

  return projectProfits.filter(p => p.revenue > 0).sort((a, b) => b.profit - a.profit)
}

export async function getCashFlowData() {
  const supabase = await createClient()

  // Get monthly revenue and expenses for last 12 months
  const lastYear = new Date()
  lastYear.setFullYear(lastYear.getFullYear() - 1)

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total, created_at, status')
    .gte('created_at', lastYear.toISOString())
    .eq('status', 'paid')

  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount, created_at')
    .gte('created_at', lastYear.toISOString())

  // Group by month
  const monthlyData: Record<string, { revenue: number; expenses: number }> = {}

  invoices?.forEach((inv: any) => {
    const date = new Date(inv.created_at)
    const month = date.toISOString().substring(0, 7) // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
    monthlyData[month].revenue += inv.total || 0
  })

  expenses?.forEach((exp: any) => {
    const date = new Date(exp.created_at)
    const month = date.toISOString().substring(0, 7)
    if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0 }
    monthlyData[month].expenses += exp.amount || 0
  })

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      month,
      revenue: data.revenue,
      expenses: data.expenses,
      net: data.revenue - data.expenses,
    }))
}

export async function getExpenseBreakdown() {
  const supabase = await createClient()

  const { data: expenses } = await supabase
    .from('expenses')
    .select('category, amount')

  if (!expenses) return []

  // Group by category
  const breakdown: Record<string, number> = {}
  expenses.forEach((exp: any) => {
    const category = exp.category || 'Autres'
    breakdown[category] = (breakdown[category] || 0) + (exp.amount || 0)
  })

  return Object.entries(breakdown).map(([category, amount]) => ({
    category,
    amount,
    percentage: Math.round((amount / Object.values(breakdown).reduce((a, b) => a + b, 0)) * 100),
  }))
}

export async function getMonthlyFinancials() {
  const supabase = await createClient()

  const currentMonth = new Date()
  currentMonth.setDate(1)

  const { data: invoices } = await supabase
    .from('invoices')
    .select('total, status')
    .gte('created_at', currentMonth.toISOString())

  const { data: expenses } = await supabase
    .from('expenses')
    .select('amount')
    .gte('created_at', currentMonth.toISOString())

  const monthRevenue = invoices
    ?.filter(i => i.status === 'paid')
    ?.reduce((sum, i) => sum + (i.total || 0), 0) || 0

  const monthExpenses = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0

  return {
    month: currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    revenue: monthRevenue,
    expenses: monthExpenses,
    net: monthRevenue - monthExpenses,
  }
}
