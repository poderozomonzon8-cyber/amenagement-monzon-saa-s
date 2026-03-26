'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Redirect } from 'next/navigation'

export default function Home() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        router.replace('/dashboard')
      } else {
        router.replace('/marketing')
      }
      setChecking(false)
    }

    checkUser()
  }, [router, supabase])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement...</div>
      </div>
    )
  }

  return null
}
