'use server'

import { createClient } from '@/lib/supabase/server'

export async function getNotifications(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data || []
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) throw new Error(error.message)
  return true
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw new Error(error.message)
  return true
}

export async function createNotification(data: {
  user_id: string
  type: 'invoice' | 'quote' | 'payment' | 'project_update' | 'milestone' | 'reminder'
  title: string
  message: string
  related_id?: string
}) {
  const supabase = await createClient()

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      related_id: data.related_id || null,
      read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)
  return notification
}

export async function deleteNotification(notificationId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) throw new Error(error.message)
  return true
}
