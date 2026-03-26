'use server'

import { createClient } from '@/lib/supabase/server'

export interface RevenueMetrics {
  totalRevenue: number
  invoicesCount: number
  paidInvoices: number
  pendingRevenue: number
  averageInvoiceValue: number
  revenueTrend: Array<{ date: string; amount: number }>
}

export interface ProjectMetrics {
  total: number
  planning: number
  inProgress: number
  completed: number
  onHold: number
  averageBudget: number
  projectsByStatus: Array<{ status: string; count: number }>
}

export interface EmployeeMetrics {
  total: number
  totalHoursWorked: number
  averageHoursPerEmployee: number
  employeeHours: Array<{
    employeeId: string
    employeeName: string
    hoursWorked: number
    projectsAssigned: number
  }>
}

export interface PaymentMetrics {
  totalPayments: number
  byMethod: Array<{ method: string; count: number; total: number }>
  pending: number
  completed: number
}

/**
 * Get revenue analytics for a date range
 */
export async function getRevenueMetrics(startDate: string, endDate: string): Promise<RevenueMetrics> {
  const supabase = await createClient()

  // Get invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('id, total, status, created_at')
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  const totalInvoices = invoices?.length || 0
  const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0
  const totalRevenue = invoices?.filter(i => i.status === 'paid').reduce((sum, i) => sum + (i.total || 0), 0) || 0
  const pendingRevenue = invoices?.filter(i => i.status !== 'paid').reduce((sum, i) => sum + (i.total || 0), 0) || 0

  // Calculate trend (daily revenue)
  const revenueTrend: { [key: string]: number } = {}
  invoices?.forEach(inv => {
    if (inv.status === 'paid') {
      const date = new Date(inv.created_at).toISOString().split('T')[0]
      revenueTrend[date] = (revenueTrend[date] || 0) + (inv.total || 0)
    }
  })

  return {
    totalRevenue,
    invoicesCount: totalInvoices,
    paidInvoices,
    pendingRevenue,
    averageInvoiceValue: totalInvoices > 0 ? totalRevenue / paidInvoices : 0,
    revenueTrend: Object.entries(revenueTrend).map(([date, amount]) => ({ date, amount })),
  }
}

/**
 * Get project metrics
 */
export async function getProjectMetrics(): Promise<ProjectMetrics> {
  const supabase = await createClient()

  const { data: projects } = await supabase.from('projects').select('id, status, budget')

  const statusCounts: { [key: string]: number } = {}
  let totalBudget = 0
  let budgetCount = 0

  projects?.forEach(p => {
    statusCounts[p.status] = (statusCounts[p.status] || 0) + 1
    if (p.budget) {
      totalBudget += p.budget
      budgetCount++
    }
  })

  return {
    total: projects?.length || 0,
    planning: statusCounts['planning'] || 0,
    inProgress: statusCounts['in_progress'] || 0,
    completed: statusCounts['completed'] || 0,
    onHold: statusCounts['on_hold'] || 0,
    averageBudget: budgetCount > 0 ? totalBudget / budgetCount : 0,
    projectsByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
  }
}

/**
 * Get employee metrics
 */
export async function getEmployeeMetrics(): Promise<EmployeeMetrics> {
  const supabase = await createClient()

  const { data: employees } = await supabase.from('employees').select(`
    id,
    profile_id,
    profiles:profile_id (full_name)
  `)

  const { data: timeEntries } = await supabase.from('time_entries').select('employee_id, hours, project_id')

  const employeeHours: { [key: string]: { name: string; hours: number; projects: Set<string> } } = {}
  let totalHours = 0

  timeEntries?.forEach(entry => {
    if (!employeeHours[entry.employee_id]) {
      const employee = employees?.find(e => e.id === entry.employee_id)
      employeeHours[entry.employee_id] = {
        name: employee?.profiles?.full_name || 'Unknown',
        hours: 0,
        projects: new Set(),
      }
    }
    employeeHours[entry.employee_id].hours += entry.hours || 0
    employeeHours[entry.employee_id].projects.add(entry.project_id)
    totalHours += entry.hours || 0
  })

  return {
    total: employees?.length || 0,
    totalHoursWorked: totalHours,
    averageHoursPerEmployee: employees && employees.length > 0 ? totalHours / employees.length : 0,
    employeeHours: Object.entries(employeeHours).map(([id, data]) => ({
      employeeId: id,
      employeeName: data.name,
      hoursWorked: data.hours,
      projectsAssigned: data.projects.size,
    })),
  }
}

/**
 * Get payment metrics
 */
export async function getPaymentMetrics(): Promise<PaymentMetrics> {
  const supabase = await createClient()

  const { data: payments } = await supabase.from('payments').select('amount, method, status')

  const methodTotals: { [key: string]: { count: number; total: number } } = {}
  let totalPayments = 0
  let completed = 0
  let pending = 0

  payments?.forEach(p => {
    if (!methodTotals[p.method]) {
      methodTotals[p.method] = { count: 0, total: 0 }
    }
    methodTotals[p.method].count++
    methodTotals[p.method].total += p.amount || 0
    totalPayments++

    if (p.status === 'completed') completed++
    if (p.status === 'pending') pending++
  })

  return {
    totalPayments,
    byMethod: Object.entries(methodTotals).map(([method, data]) => ({
      method,
      count: data.count,
      total: data.total,
    })),
    pending,
    completed,
  }
}

/**
 * Get comprehensive dashboard KPIs
 */
export async function getDashboardKPIs(daysBack = 30) {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  const [revenue, projects, employees, payments] = await Promise.all([
    getRevenueMetrics(startDate, endDate),
    getProjectMetrics(),
    getEmployeeMetrics(),
    getPaymentMetrics(),
  ])

  return {
    period: { startDate, endDate, daysBack },
    revenue,
    projects,
    employees,
    payments,
    summaryCards: [
      { label: 'Revenu total', value: `$${revenue.totalRevenue.toFixed(2)}`, trend: '+12%' },
      { label: 'Projets actifs', value: projects.inProgress, trend: '+2' },
      { label: 'Heures travaillées', value: employees.totalHoursWorked, trend: '+45h' },
      { label: 'Paiements reçus', value: `$${payments.completed}`, trend: '+8%' },
    ],
  }
}
