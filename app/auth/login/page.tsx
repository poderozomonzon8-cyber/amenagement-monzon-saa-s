'use client'

import { createClient } from '@/lib/supabase/client'
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
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Hammer, Leaf, Wrench, Shield, Star, Award } from 'lucide-react'
import Image from 'next/image'

const motivationalQuotes = [
  { text: "Building dreams, one project at a time", icon: Hammer },
  { text: "Quality craftsmanship in every detail", icon: Award },
  { text: "Your property, our passion", icon: Shield },
  { text: "Transforming spaces, creating memories", icon: Star },
  { text: "From maintenance to masterpiece", icon: Wrench },
  { text: "Growing together with nature", icon: Leaf },
]

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
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
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image
                src="/logo.png"
                alt="Aménagement Monzon"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-serif text-white tracking-wide">Aménagement</h1>
              <p className="text-yellow-600 font-semibold tracking-widest text-sm">MONZON</p>
            </div>
          </div>

          {/* Animated Quote Section */}
          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="relative">
              {/* Decorative Line */}
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

            {/* Service Icons */}
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

          {/* Footer */}
          <div className="text-gray-500 text-sm">
            <p>Trusted by property owners across Montreal since 2014</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.png"
                  alt="Aménagement Monzon"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-serif text-white">Aménagement</h1>
                <p className="text-yellow-600 font-semibold tracking-widest text-xs">MONZON</p>
              </div>
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
                    Sign in to access your dashboard and manage your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="flex flex-col gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="email" className="text-gray-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-600/50 focus:ring-yellow-600/20 transition-all"
                        />
                      </div>
                      <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-300">Password</Label>
                          <Link href="/auth/forgot-password" className="text-xs text-yellow-600 hover:text-yellow-500 transition-colors">
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-yellow-600/50 focus:ring-yellow-600/20 transition-all"
                        />
                      </div>
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                          <p className="text-sm text-red-400">{error}</p>
                        </div>
                      )}
                      <Button 
                        type="submit" 
                        className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-semibold py-5 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-600/20" 
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
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-sm text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link
                          href="/auth/sign-up"
                          className="text-yellow-600 hover:text-yellow-500 font-medium transition-colors"
                        >
                          Create account
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Trust Badges */}
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
