'use server'

import { createClient } from '@/lib/supabase/server'
import { Project } from '@/lib/types'

export async function createProject(data: {
  name: string
  status: string
  client_id?: string | null
  start_date?: string | null
  end_date?: string | null
  budget?: number | null
}) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return project as Project
}

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()

  // Order by name - projects table does not have created_at column
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return (projects || []) as Project[]
}

export async function getProjectById(id: string): Promise<Project> {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return project as Project
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return project as Project
}

export async function deleteProject(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
