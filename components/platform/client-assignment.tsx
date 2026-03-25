'use client'

import { useState, useEffect, useTransition } from 'react'
import { getAllClients, assignClientToProject, removeClientFromProject } from '@/app/actions/client-projects'
import { X, Users, Loader2 } from 'lucide-react'

interface ClientAssignmentProps {
  projectId: string
  currentClientId?: string
  currentClientName?: string
  onAssigned: () => void
}

export function ClientAssignment({ projectId, currentClientId, currentClientName, onAssigned }: ClientAssignmentProps) {
  const [clients, setClients] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [isPending, startTransition] = useTransition()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllClients()
      .then(setClients)
      .finally(() => setLoading(false))
  }, [])

  const handleAssign = () => {
    if (!selectedClientId) return
    startTransition(async () => {
      try {
        await assignClientToProject(projectId, selectedClientId)
        setShowModal(false)
        setSelectedClientId('')
        onAssigned()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de l\'assignation')
      }
    })
  }

  const handleRemove = () => {
    startTransition(async () => {
      try {
        await removeClientFromProject(projectId)
        onAssigned()
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      }
    })
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        {currentClientId ? (
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-sm">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">{currentClientName}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 bg-secondary/50 rounded-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">Aucun client assigné</span>
          </div>
        )}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors"
      >
        Assigner
      </button>

      {currentClientId && (
        <button
          onClick={handleRemove}
          disabled={isPending}
          className="px-3 py-2 text-sm bg-red-500/20 text-red-300 rounded-sm hover:bg-red-500/30 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Assigner un client</h3>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                {clients.map(client => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClientId(client.id)}
                    className={`w-full text-left px-4 py-2 rounded-sm transition-colors ${
                      selectedClientId === client.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80 text-foreground'
                    }`}
                  >
                    <p className="font-medium">{client.profiles?.full_name}</p>
                    <p className="text-xs opacity-75">{client.profiles?.email}</p>
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm bg-secondary text-foreground rounded-sm hover:bg-secondary/80 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedClientId || isPending}
                className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
                Assigner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
