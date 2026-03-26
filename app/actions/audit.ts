'use server'

import { createClient } from '@/lib/supabase/server'

export interface AuditLog {
  id?: string
  user_id: string
  action: string
  resource_type: string
  resource_id?: string
  status: 'success' | 'error'
  details: Record<string, any>
  error_message?: string
  created_at?: string
}

/**
 * Log an action for audit trail (all user actions for QA)
 */
export async function logAudit(log: Omit<AuditLog, 'id' | 'created_at'>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: log.action,
      resource_type: log.resource_type,
      resource_id: log.resource_id,
      status: log.status,
      details: log.details,
      error_message: log.error_message,
    })

    if (error) {
      console.error('[Audit] Failed to log action:', error)
    }
  } catch (err) {
    console.error('[Audit] Error logging action:', err)
  }
}

/**
 * Get audit logs for a specific resource (admin only)
 */
export async function getAuditLogs(
  resourceType: string,
  resourceId?: string,
  limit = 50
) {
  const supabase = await createClient()

  let query = supabase.from('audit_logs').select('*').eq('resource_type', resourceType)

  if (resourceId) {
    query = query.eq('resource_id', resourceId)
  }

  const { data, error } = await query.order('created_at', { ascending: false }).limit(limit)

  if (error) throw new Error(error.message)
  return data || []
}

/**
 * Get user activity log (for activity feed in dashboard)
 */
export async function getUserActivityLog(userId: string, limit = 20) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return data || []
}
