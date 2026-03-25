'use client'

import { useState, useEffect, useTransition } from 'react'
import { getProfiles, updateProfileRole, deleteProfile } from '@/app/actions/profiles'
import { getInvitations, createInvitation, deleteInvitation, Invitation } from '@/app/actions/invitations'
import { getProjects } from '@/app/actions/projects'
import { Profile, Project } from '@/lib/types'
import { cn } from '@/lib/utils'
import { 
  Users, UserPlus, Mail, Shield, Briefcase, User, Trash2, 
  X, Search, Copy, Check, Loader2, Clock, Link2
} from 'lucide-react'

const roleColors: Record<string, string> = {
  admin: 'bg-purple-900/30 text-purple-400',
  employee: 'bg-blue-900/30 text-blue-400',
  client: 'bg-green-900/30 text-green-400',
}

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  employee: 'Employé',
  client: 'Client',
}

const roleIcons: Record<string, any> = {
  admin: Shield,
  employee: Briefcase,
  client: User,
}

export function UserManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'invitations'>('users')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    Promise.all([getProfiles(), getInvitations(), getProjects()])
      .then(([p, i, pr]) => {
        setProfiles(p)
        setInvitations(i)
        setProjects(pr)
      })
      .catch(() => showToast('Erreur lors du chargement.', 'err'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = (profileId: string, newRole: 'admin' | 'employee' | 'client') => {
    startTransition(async () => {
      try {
        const updated = await updateProfileRole(profileId, newRole)
        setProfiles(prev => prev.map(p => p.id === profileId ? updated : p))
        showToast('Rôle mis à jour.')
      } catch {
        showToast('Erreur lors de la mise à jour.', 'err')
      }
    })
  }

  const handleDeleteProfile = (id: string) => {
    if (!confirm('Supprimer cet utilisateur? Cette action est irréversible.')) return
    startTransition(async () => {
      try {
        await deleteProfile(id)
        setProfiles(prev => prev.filter(p => p.id !== id))
        showToast('Utilisateur supprimé.')
      } catch {
        showToast('Erreur lors de la suppression.', 'err')
      }
    })
  }

  const handleDeleteInvitation = (id: string) => {
    startTransition(async () => {
      try {
        await deleteInvitation(id)
        setInvitations(prev => prev.filter(i => i.id !== id))
        showToast('Invitation supprimée.')
      } catch {
        showToast('Erreur lors de la suppression.', 'err')
      }
    })
  }

  const copyInviteLink = (token: string) => {
    const url = `${window.location.origin}/auth/invite/${token}`
    navigator.clipboard.writeText(url)
    setCopiedToken(token)
    setTimeout(() => setCopiedToken(null), 2000)
    showToast('Lien copié!')
  }

  const filteredProfiles = profiles.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.role?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredInvitations = invitations.filter(i =>
    i.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toast && (
        <div className={cn('fixed bottom-6 right-6 z-50 px-4 py-3 rounded-sm text-sm shadow-lg border',
          toast.type === 'ok' ? 'bg-card border-green-800 text-green-300' : 'bg-card border-red-800 text-red-300'
        )}>
          {toast.msg}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteModal
          projects={projects}
          onClose={() => setShowInviteModal(false)}
          onCreated={(inv) => {
            setInvitations(prev => [inv, ...prev])
            showToast('Invitation créée!')
            setShowInviteModal(false)
          }}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {profiles.length} utilisateurs, {invitations.filter(i => !i.used_at).length} invitations en attente
          </p>
        </div>
        <button onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-sm text-sm hover:bg-primary/90 transition-colors self-start">
          <UserPlus className="w-4 h-4" /> Inviter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        <button onClick={() => setActiveTab('users')}
          className={cn('flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
            activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          )}>
          <Users className="w-4 h-4" /> Utilisateurs
        </button>
        <button onClick={() => setActiveTab('invitations')}
          className={cn('flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
            activeTab === 'invitations' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          )}>
          <Mail className="w-4 h-4" /> Invitations
          {invitations.filter(i => !i.used_at).length > 0 && (
            <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-sm">
              {invitations.filter(i => !i.used_at).length}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher..."
          className="w-full bg-card border border-border rounded-sm pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
        </div>
      ) : activeTab === 'users' ? (
        <div className="bg-card border border-border rounded-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Rôle</th>
                <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">Téléphone</th>
                <th className="text-right px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Aucun utilisateur trouvé.</td></tr>
              ) : filteredProfiles.map((p) => {
                const Icon = roleIcons[p.role || 'client']
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs text-foreground font-semibold">
                          {p.full_name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-foreground font-medium">{p.full_name || 'Sans nom'}</p>
                          <p className="text-xs text-muted-foreground">{p.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select value={p.role || 'client'}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as any)}
                        disabled={isPending}
                        className={cn('text-xs px-2 py-1 rounded-sm border-0 cursor-pointer', roleColors[p.role || 'client'])}
                      >
                        <option value="admin">Admin</option>
                        <option value="employee">Employé</option>
                        <option value="client">Client</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDeleteProfile(p.id)}
                        disabled={isPending}
                        className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredInvitations.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucune invitation.</p>
          ) : filteredInvitations.map((inv) => {
            const isExpired = new Date(inv.expires_at) < new Date()
            const isUsed = !!inv.used_at
            return (
              <div key={inv.id} className={cn('bg-card border rounded-sm p-4', 
                isUsed ? 'border-green-800/50' : isExpired ? 'border-red-800/50' : 'border-border'
              )}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{inv.email}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-sm', roleColors[inv.role])}>
                        {roleLabels[inv.role]}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expire: {new Date(inv.expires_at).toLocaleDateString('fr-FR')}
                      </span>
                      {isUsed && <span className="text-green-400">Utilisée</span>}
                      {isExpired && !isUsed && <span className="text-red-400">Expirée</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isUsed && !isExpired && (
                      <button onClick={() => copyInviteLink(inv.token)}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 border border-border rounded-sm">
                        {copiedToken === inv.token ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                        Copier le lien
                      </button>
                    )}
                    <button onClick={() => handleDeleteInvitation(inv.id)}
                      disabled={isPending}
                      className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function InviteModal({
  projects,
  onClose,
  onCreated,
}: {
  projects: Project[]
  onClose: () => void
  onCreated: (inv: Invitation) => void
}) {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'employee' | 'client'>('client')
  const [projectId, setProjectId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Email invalide.')
      return
    }
    setError('')
    startTransition(async () => {
      try {
        const inv = await createInvitation({
          email: email.trim(),
          role,
          project_id: projectId || null,
        })
        onCreated(inv)
      } catch (e: any) {
        setError(e.message || 'Une erreur est survenue.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-serif text-lg text-foreground">Inviter un utilisateur</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {error && <p className="text-red-400 text-xs bg-red-900/20 px-3 py-2 rounded-sm">{error}</p>}

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Email *</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              type="email" placeholder="email@exemple.com"
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Rôle</label>
            <select value={role} onChange={(e) => setRole(e.target.value as any)}
              className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="client">Client</option>
              <option value="employee">Employé</option>
            </select>
          </div>

          {role === 'client' && (
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">Projet associé</label>
              <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-input border border-border rounded-sm px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="">Aucun projet</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <div className="bg-secondary/50 rounded-sm p-3 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <Link2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Un lien d&apos;invitation sera généré. Partagez-le avec l&apos;utilisateur pour qu&apos;il puisse créer son compte avec le rôle sélectionné.</p>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-border text-foreground text-sm py-2.5 rounded-sm hover:bg-secondary transition-colors">
              Annuler
            </button>
            <button onClick={handleSubmit} disabled={isPending}
              className="flex-1 bg-primary text-primary-foreground text-sm py-2.5 rounded-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer l&apos;invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
