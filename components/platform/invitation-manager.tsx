'use client'

import { useState, useEffect, useTransition } from 'react'
import { getInvitations, createInvitation, deleteInvitation } from '@/app/actions/invitations'
import { getProjects } from '@/app/actions/projects'
import { Copy, Trash2, X, Plus, Loader2, Check } from 'lucide-react'

interface Invitation {
  id: string
  email: string
  role: 'employee' | 'client'
  project_id: string | null
  token: string
  expires_at: string
  used_at: string | null
  created_at: string
}

export function InvitationManager() {
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'employee' | 'client'>('employee')
  const [projectId, setProjectId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getInvitations(), getProjects()])
      .then(([invs, projs]) => {
        setInvitations(invs)
        setProjects(projs)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = () => {
    if (!email) return
    startTransition(async () => {
      try {
        await createInvitation({
          email,
          role,
          project_id: projectId || null,
        })
        setEmail('')
        setProjectId('')
        setRole('employee')
        const newInvs = await getInvitations()
        setInvitations(newInvs)
        setShowForm(false)
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de la création')
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('Supprimer cette invitation ?')) return
    startTransition(async () => {
      try {
        await deleteInvitation(id)
        setInvitations(prev => prev.filter(inv => inv.id !== id))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      }
    })
  }

  const copyToClipboard = (token: string) => {
    const url = `${window.location.origin}/auth/invite/${token}`
    navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date()
  const isUsed = (usedAt: string | null) => usedAt !== null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Invitations en attente</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> Nouvelle invitation
        </button>
      </div>

      {showForm && (
        <div className="bg-secondary/30 rounded-sm p-6 border border-border">
          <h4 className="font-medium text-foreground mb-4">Créer une nouvelle invitation</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Rôle</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as 'employee' | 'client')}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="employee">Employé</option>
                <option value="client">Client</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-1">Projet (optionnel)</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Aucun</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 text-sm bg-secondary text-foreground rounded-sm hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={!email || isPending}
                className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Aucune invitation en attente.</p>
      ) : (
        <div className="space-y-2">
          {invitations.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 p-4 bg-secondary/30 rounded-sm border border-border">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{inv.email}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className={`px-2 py-0.5 rounded-sm ${inv.role === 'client' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    {inv.role === 'client' ? 'Client' : 'Employé'}
                  </span>
                  {inv.used_at && (
                    <span className="text-green-400">✓ Acceptée</span>
                  )}
                  {!inv.used_at && isExpired(inv.expires_at) && (
                    <span className="text-red-400">Expirée</span>
                  )}
                  {!inv.used_at && !isExpired(inv.expires_at) && (
                    <span>
                      Expire le {new Date(inv.expires_at).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>

              {!inv.used_at && !isExpired(inv.expires_at) && (
                <button
                  onClick={() => copyToClipboard(inv.token)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Copier le lien"
                >
                  {copied === inv.token ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}

              <button
                onClick={() => handleDelete(inv.id)}
                disabled={isPending}
                className="p-2 text-muted-foreground hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
