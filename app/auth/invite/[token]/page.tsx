'use client'

import { useState, useEffect, useTransition } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getInvitationByToken, markInvitationUsed, Invitation } from '@/app/actions/invitations'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'

export default function InviteSignupPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  useEffect(() => {
    getInvitationByToken(token)
      .then(inv => {
        if (!inv) {
          setError('Cette invitation est invalide ou expirée.')
        } else {
          setInvitation(inv)
        }
      })
      .catch(() => setError('Erreur lors de la vérification.'))
      .finally(() => setLoading(false))
  }, [token])

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = () => {
    if (!form.fullName.trim()) { setError('Nom complet requis.'); return }
    if (form.password.length < 6) { setError('Mot de passe: 6 caractères minimum.'); return }
    if (form.password !== form.confirmPassword) { setError('Les mots de passe ne correspondent pas.'); return }
    
    setError('')
    startTransition(async () => {
      try {
        const supabase = createClient()
        
        // Sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: invitation!.email,
          password: form.password,
          options: {
            data: {
              full_name: form.fullName,
              phone: form.phone,
              role: invitation!.role,
            }
          }
        })
        
        if (authError) throw authError
        if (!authData.user) throw new Error('Erreur lors de la création du compte.')
        
        // Create profile with correct role
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            role: invitation!.role,
            full_name: form.fullName,
            phone: form.phone || null,
          })
        
        if (profileError) {
          // Profile might already exist, try update
          await supabase
            .from('profiles')
            .update({
              role: invitation!.role,
              full_name: form.fullName,
              phone: form.phone || null,
            })
            .eq('id', authData.user.id)
        }
        
        // If client, create client record
        if (invitation!.role === 'client') {
          await supabase.from('clients').insert({
            profile_id: authData.user.id,
          })
        }
        
        // If employee, create employee record
        if (invitation!.role === 'employee') {
          await supabase.from('employees').insert({
            profile_id: authData.user.id,
            position: 'Employé',
          })
        }
        
        // Mark invitation as used
        await markInvitationUsed(token)
        
        setSuccess(true)
        setTimeout(() => router.push('/auth/login'), 2000)
      } catch (e: any) {
        setError(e.message || 'Une erreur est survenue.')
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!invitation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-sm p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-serif text-xl text-foreground mb-2">Invitation invalide</h1>
          <p className="text-muted-foreground text-sm mb-6">{error || 'Cette invitation n\'existe pas ou a expiré.'}</p>
          <a href="/auth/login" className="text-primary hover:underline text-sm">
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-sm p-8 max-w-md w-full text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h1 className="font-serif text-xl text-foreground mb-2">Compte créé!</h1>
          <p className="text-muted-foreground text-sm">Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-sm w-full max-w-md">
        <div className="px-6 py-5 border-b border-border">
          <h1 className="font-serif text-xl text-foreground">Créer votre compte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Invitation pour <span className="text-primary">{invitation.email}</span>
          </p>
          <div className="mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-sm ${
              invitation.role === 'employee' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'
            }`}>
              {invitation.role === 'employee' ? 'Employé' : 'Client'}
            </span>
          </div>
        </div>
        
        <div className="p-6 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}
          
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Nom complet *</label>
            <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)}
              placeholder="Jean Dupont"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Téléphone</label>
            <input value={form.phone} onChange={(e) => set('phone', e.target.value)}
              placeholder="514-555-0100"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Mot de passe *</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
              placeholder="Minimum 6 caractères"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Confirmer le mot de passe *</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)}
              placeholder="Répéter le mot de passe"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          
          <button onClick={handleSubmit} disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Créer mon compte
          </button>
          
          <p className="text-xs text-muted-foreground text-center">
            Déjà un compte? <a href="/auth/login" className="text-primary hover:underline">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  )
}
