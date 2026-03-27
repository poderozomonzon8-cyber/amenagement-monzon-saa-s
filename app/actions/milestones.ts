'use server'

import { createClient } from '@/lib/supabase/server'

export async function getMilestones(projectId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', projectId)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching milestones:', error)
    return []
  }

  return data || []
}

export async function createMilestone(data: {
  project_id: string
  name: string
  description?: string
  date: string
}) {
  const supabase = await createClient()

  const { data: milestone, error } = await supabase
    .from('milestones')
    .insert({
      project_id: data.project_id,
      name: data.name,
      description: data.description || null,
      date: data.date,
      completed: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return milestone
}

export async function updateMilestone(
  milestoneId: string,
  data: { name?: string; description?: string; date?: string; completed?: boolean }
) {
  const supabase = await createClient()

  const { data: milestone, error } = await supabase
    .from('milestones')
    .update(data)
    .eq('id', milestoneId)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return milestone
}

export async function deleteMilestone(milestoneId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('milestones')
    .delete()
    .eq('id', milestoneId)

  if (error) throw new Error(error.message)
  return true
}
