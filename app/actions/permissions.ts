'use server'

import { createClient } from '@/lib/supabase/server'
import { UserRole } from '@/lib/types'

/**
 * Check if user has permission to access a resource based on role
 */
export async function checkPermission(
  requiredRoles: UserRole[],
  resourceOwnerId?: string
): Promise<{ allowed: boolean; userId?: string; role?: UserRole }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return { allowed: false }
  
  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
  
  const userRole = profile?.[0]?.role as UserRole
  
  // Admin has access to everything
  if (userRole === 'admin') {
    return { allowed: true, userId: user.id, role: userRole }
  }
  
  // Check if user role is in required roles
  const hasRole = requiredRoles.includes(userRole)
  
  // If resourceOwnerId is provided, check ownership (for employee/client personal resources)
  if (resourceOwnerId && !hasRole) {
    return { allowed: user.id === resourceOwnerId, userId: user.id, role: userRole }
  }
  
  return { allowed: hasRole, userId: user.id, role: userRole }
}

/**
 * Get current user's role
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
  
  return (profile?.[0]?.role as UserRole) || null
}

/**
 * Verify admin access
 */
export async function requireAdmin(): Promise<{ success: boolean; userId?: string }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
  
  const role = profile?.[0]?.role
  
  if (role !== 'admin') {
    throw new Error('Admin access required')
  }
  
  return { success: true, userId: user.id }
}

/**
 * Verify employee access
 */
export async function requireEmployee(): Promise<{ success: boolean; userId?: string; employeeId?: string }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
  
  const role = profile?.[0]?.role
  
  if (role !== 'employee' && role !== 'admin') {
    throw new Error('Employee access required')
  }
  
  // Get employee record
  const { data: employee } = await supabase
    .from('employees')
    .select('id')
    .eq('profile_id', user.id)
    .limit(1)
  
  return { success: true, userId: user.id, employeeId: employee?.[0]?.id }
}

/**
 * Verify client access
 */
export async function requireClient(): Promise<{ success: boolean; userId?: string; clientId?: string }> {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  if (!user) throw new Error('Not authenticated')
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .limit(1)
  
  const role = profile?.[0]?.role
  
  if (role !== 'client' && role !== 'admin') {
    throw new Error('Client access required')
  }
  
  // Get client record
  const { data: client } = await supabase
    .from('clients')
    .select('id')
    .eq('profile_id', user.id)
    .limit(1)
  
  return { success: true, userId: user.id, clientId: client?.[0]?.id }
}
