'use server'

import { createClient } from '@/lib/supabase/server'

export async function createTimeEntry(data: {
  project_id: string
  employee_id: string
  hours: number
  date: string
  description: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: entry, error } = await supabase
    .from('time_entries')
    .insert({
      ...data,
      admin_id: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return entry
}

export async function getTimeEntries(userId: string, filters?: { projectId?: string; startDate?: string; endDate?: string }) {
  const supabase = await createClient()

  let query = supabase
    .from('time_entries')
    .select('*')
    .eq('admin_id', userId)

  if (filters?.projectId) {
    query = query.eq('project_id', filters.projectId)
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  const { data: entries, error } = await query.order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return entries
}

export async function getTimeEntriesByEmployee(employeeId: string) {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return entries
}

export async function getTimeEntriesByProject(projectId: string) {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return entries
}

export async function updateTimeEntry(id: string, data: Partial<{
  hours: number
  date: string
  description: string
}>) {
  const supabase = await createClient()

  const { data: entry, error } = await supabase
    .from('time_entries')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return entry
}

export async function deleteTimeEntry(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('time_entries')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
