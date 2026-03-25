'use server'

import { createClient } from '@/lib/supabase/server'

export async function createProject(data: {
  name: string
  description: string
  status: string
  client_id: string
  start_date: string
  end_date: string
  budget: number
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      ...data,
      admin_id: user.id,
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return project
}

export async function getProjects(userId: string) {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('admin_id', userId)

  if (error) throw new Error(error.message)
  return projects
}

export async function getProjectById(id: string) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return project
}

export async function updateProject(id: string, data: Partial<{
  name: string
  description: string
  status: string
  budget: number
  start_date: string
  end_date: string
}>) {
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from('projects')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return project
}

export async function deleteProject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  return true
}
