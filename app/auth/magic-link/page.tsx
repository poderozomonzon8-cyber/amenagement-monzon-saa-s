'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyMagicLink } from '@/app/actions/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function MagicLinkPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setStatus('error')
      setError('No token provided')
      return
    }

    const verify = async () => {
      const result = await verifyMagicLink(token)
      
      if (result.success) {
        setStatus('success')
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setStatus('error')
        setError(result.error || 'Failed to verify magic link')
      }
    }

    verify()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-yellow-600 animate-spin mx-auto mb-4" />
              <CardTitle className="text-white">Verifying Magic Link</CardTitle>
              <CardDescription className="text-gray-400">
                Please wait while we verify your login...
              </CardDescription>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-white">Success!</CardTitle>
              <CardDescription className="text-gray-400">
                You&apos;re signed in. Redirecting to dashboard...
              </CardDescription>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-white">Verification Failed</CardTitle>
              <CardDescription className="text-red-400">
                {error}
              </CardDescription>
            </>
          )}
        </CardHeader>
        {status === 'error' && (
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="bg-yellow-600 hover:bg-yellow-500 text-black">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
