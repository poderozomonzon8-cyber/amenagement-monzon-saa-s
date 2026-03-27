'use server'

import { createClient } from '@/lib/supabase/server'

export async function getEmployeePerformance() {
  const supabase = await createClient()

  // Get all employees with their time entries for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: employees, error: empError } = await supabase
    .from('employees')
    .select(`
      id,
      name,
      email,
      salary,
      profiles(*)
    `)
    .order('name')

  if (empError) throw new Error(empError.message)

  if (!employees) return []

  // For each employee, get their metrics
  const performanceData = await Promise.all(
    employees.map(async emp => {
      // Get time entries
      const { data: timeEntries } = await supabase
        .from('time_entries')
        .select('hours, project_id, date')
        .eq('employee_id', emp.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

      const totalHours = timeEntries?.reduce((sum: number, te: any) => sum + (te.hours || 0), 0) || 0
      const avgHoursPerDay = totalHours / 30
      const daysWorked = timeEntries?.length || 0

      // Get projects completed
      const { count: projectsCount } = await supabase
        .from('time_entries')
        .select('id', { count: 'exact' })
        .eq('employee_id', emp.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

      return {
        id: emp.id,
        name: emp.name,
        email: emp.email,
        totalHours,
        avgHoursPerDay: Math.round(avgHoursPerDay * 10) / 10,
        daysWorked,
        projectsWorked: new Set(timeEntries?.map((te: any) => te.project_id) || []).size,
        salary: emp.salary,
      }
    })
  )

  // Sort by total hours descending
  return performanceData.sort((a, b) => b.totalHours - a.totalHours)
}

export async function getEmployeeDetails(employeeId: string) {
  const supabase = await createClient()

  // Get employee info
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single()

  if (empError) throw new Error(empError.message)

  // Get time entries for past 60 days with project info
  const sixtyDaysAgo = new Date()
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select(`
      *,
      project:projects(name, id)
    `)
    .eq('employee_id', employeeId)
    .gte('date', sixtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false })

  // Calculate weekly totals
  const weeklyData: Record<string, number> = {}
  timeEntries?.forEach((entry: any) => {
    const date = new Date(entry.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + (entry.hours || 0)
  })

  const weeks = Object.entries(weeklyData)
    .map(([week, hours]) => ({ week, hours }))
    .sort((a, b) => b.week.localeCompare(a.week))
    .slice(0, 12)

  return {
    employee,
    timeEntries,
    weeklySummary: weeks,
    totalHours: Object.values(weeklyData).reduce((a, b) => a + b, 0),
    avgWeeklyHours: Math.round((Object.values(weeklyData).reduce((a, b) => a + b, 0) / weeks.length) * 10) / 10,
  }
}

export async function getPerformanceLeaderboard() {
  const supabase = await createClient()

  // Get top 10 performers by hours worked
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select(`
      employee_id,
      hours,
      employees(name, id)
    `)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  if (!timeEntries) return []

  // Aggregate by employee
  const leaderboard: Record<string, { name: string; id: string; hours: number }> = {}

  timeEntries.forEach((entry: any) => {
    const empId = entry.employee_id
    if (!leaderboard[empId]) {
      leaderboard[empId] = {
        id: entry.employees?.id,
        name: entry.employees?.name || 'Unknown',
        hours: 0,
      }
    }
    leaderboard[empId].hours += entry.hours || 0
  })

  return Object.values(leaderboard)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 10)
}

export async function getProductivityMetrics(employeeId: string) {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get unique projects worked on
  const { data: projects } = await supabase
    .from('time_entries')
    .select('project_id')
    .eq('employee_id', employeeId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  const uniqueProjects = new Set(projects?.map(p => p.project_id) || [])

  // Get billable hours (paid invoices linked to projects worked on)
  const { data: invoices } = await supabase
    .from('invoices')
    .select('total')
    .in('project_id', Array.from(uniqueProjects))
    .eq('status', 'paid')

  const billableRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

  // Get total hours
  const { data: timeEntries } = await supabase
    .from('time_entries')
    .select('hours')
    .eq('employee_id', employeeId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])

  const totalHours = timeEntries?.reduce((sum, entry) => sum + (entry.hours || 0), 0) || 0

  return {
    projectsWorked: uniqueProjects.size,
    totalHours,
    billableRevenue,
    billablePerHour: totalHours > 0 ? Math.round((billableRevenue / totalHours) * 100) / 100 : 0,
    efficiency: totalHours > 0 ? Math.round((billableRevenue / (totalHours * 50)) * 100) : 0, // Assuming $50/hr base
  }
}
