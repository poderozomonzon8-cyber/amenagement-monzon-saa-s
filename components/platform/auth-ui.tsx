'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { LogOut } from 'lucide-react'

export function SignOut() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-secondary rounded transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {loading ? 'Déconnexion...' : 'Déconnexion'}
    </button>
  )
}

export function UserProfile() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  if (!user) return null

  const firstName = user.user_metadata?.first_name || 'User'
  const lastName = user.user_metadata?.last_name || ''
  const role = user.user_metadata?.role || 'employee'

  return (
    <div className="space-y-2 p-4 bg-card border-t border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          {firstName[0]}{lastName[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-muted-foreground capitalize">{role}</p>
        </div>
      </div>
      <SignOut />
    </div>
  )
}
