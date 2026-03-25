'use server'

import { createClient } from '@/lib/supabase/server'
import { TimeEntry } from '@/lib/types'

export async function createTimeEntry(data: {
  employee_id: string
  project_id: string | null
  hours: number
  date: string
  description?: string
}) {
  const supabase = await createClient()

  const { data: entry, error } = await supabase
    .from('time_entries')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return entry as TimeEntry
}

export async function getTimeEntries() {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return (entries || []) as TimeEntry[]
}

export async function getTimeEntriesByEmployee(employeeId: string) {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('employee_id', employeeId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return (entries || []) as TimeEntry[]
}

export async function getTimeEntriesByProject(projectId: string) {
  const supabase = await createClient()

  const { data: entries, error } = await supabase
    .from('time_entries')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: false })

  if (error) throw new Error(error.message)
  return (entries || []) as TimeEntry[]
}

export async function updateTimeEntry(id: string, data: Partial<TimeEntry>) {
  const supabase = await createClient()

  const { data: entry, error } = await supabase
    .from('time_entries')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return entry as TimeEntry
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
