'use client'

import { signIn, sendMagicLink } from '@/app/actions/auth'
import { isGoogleConfigured, isAppleConfigured, getGoogleAuthUrl, getAppleAuthUrl } from '@/lib/oauth-config'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ArrowLeft, Hammer, Leaf, Wrench, Shield, Star, Award, Mail, Chrome } from 'lucide-react'
import Image from 'next/image'

const motivationalQuotes = [
  { text: "Building dreams, one project at a time", icon: Hammer },
  { text: "Quality craftsmanship in every detail", icon: Award },
  { text: "Your property, our passion", icon: Shield },
  { text: "Transforming spaces, creating memories", icon: Star },
  { text: "From maintenance to masterpiece", icon: Wrench },
  { text: "Growing together with nature", icon: Leaf },
]

type LoginMethod = 'email' | 'magic-link'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email')

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await sendMagicLink(email)
      if (result.success) {
        setSuccess('Check your email for a magic link to sign in!')
      } else {
        setError(result.error || 'Failed to send magic link')
      }
    } catch {
      setError('Failed to send magic link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const redirectUri = `${window.location.origin}/api/auth/callback/google`
    window.location.href = getGoogleAuthUrl(redirectUri)
  }

  const handleAppleLogin = () => {
    const redirectUri = `${window.location.origin}/api/auth/callback/apple`
    window.location.href = getAppleAuthUrl(redirectUri)
  }

  const QuoteIcon = motivationalQuotes[currentQuote].icon

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-600/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-600/5 rounded-full filter blur-3xl" />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding & Quotes */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-black/80 to-transparent">
          <div>
            <Image
              src="/logo-am.png"
              alt="Aménagement Monzon"
              width={180}
              height={60}
              style={{ height: '56px', width: 'auto' }}
              className="w-auto"
              priority
            />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="relative">
              <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-600 via-yellow-600/50 to-transparent" />
              
              <div className="transition-all duration-700 ease-in-out">
                <QuoteIcon className="w-12 h-12 text-yellow-600 mb-6 animate-bounce" style={{ animationDuration: '3s' }} />
                <p className="text-3xl font-serif text-white leading-relaxed mb-4 transition-opacity duration-500">
                  &ldquo;{motivationalQuotes[currentQuote].text}&rdquo;
                </p>
                <div className="flex gap-2 mt-8">
                  {motivationalQuotes.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === currentQuote ? 'w-8 bg-yellow-600' : 'w-2 bg-white/20'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-8 mt-16">
              <div className="text-center group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:border-yellow-600/50 group-hover:bg-yellow-600/10 transition-all duration-300">
                  <Hammer className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500">Construction</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:border-green-600/50 group-hover:bg-green-600/10 transition-all duration-300">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <p className="text-xs text-gray-500">Hardscape</p>
              </div>
              <div className="text-center group">
                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:border-blue-600/50 group-hover:bg-blue-600/10 transition-all duration-300">
                  <Wrench className="w-6 h-6 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500">Maintenance</p>
              </div>
            </div>
          </div>

          <div className="text-gray-500 text-sm">
            <p>Trusted by property owners across Montreal since 2014</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center mb-8">
              <Image
                src="/logo-am.png"
                alt="Aménagement Monzon"
                width={160}
                height={54}
                style={{ height: '48px', width: 'auto' }}
                className="w-auto"
                priority
              />
            </div>

            <div className="flex flex-col gap-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-600 transition-colors w-fit group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Website
              </Link>

              <Card className="bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-white font-serif">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-400">
                    Sign in to access your dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* OAuth Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGoogleLogin}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
                    >
                      <Chrome className="h-4 w-4" />
                      Google
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAppleLogin}
                      className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Apple
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/50 px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  {/* Login Method Tabs */}
                  <div className="flex gap-2 p-1 bg-white/5 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                        loginMethod === 'email'
                          ? 'bg-yellow-600 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('magic-link')}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        loginMethod === 'magic-link'
                          ? 'bg-yellow-600 text-black'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Mail className="h-4 w-4" />
                      Magic Link
                    </button>
                  </div>

                  {loginMethod === 'email' ? (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-600/50 focus:ring-yellow-600/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-300">Password</Label>
                          <Link href="/auth/forgot-password" className="text-xs text-yellow-600 hover:text-yellow-500">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-600/50 focus:ring-yellow-600/20"
                        />
                      </div>
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-5" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Signing in...
                          </span>
                        ) : (
                          'Sign In'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleMagicLink} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="magic-email" className="text-gray-300">Email</Label>
                        <Input
                          id="magic-email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-600/50 focus:ring-yellow-600/20"
                        />
                      </div>
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}
                      {success && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <p className="text-sm text-green-400">{success}</p>
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-5" 
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Magic Link
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      Don&apos;t have an account?{' '}
                      <Link href="/auth/sign-up" className="text-yellow-600 hover:text-yellow-500 font-medium">
                        Create account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Secure Login</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Star className="w-4 h-4" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
