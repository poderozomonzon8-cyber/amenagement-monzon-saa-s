'use client'

import { useState, useEffect, useTransition } from 'react'
import { getProjectDocuments, uploadProjectDocument, deleteProjectDocument } from '@/app/actions/project-documents'
import { FileText, Image, FileUp, Trash2, Download, Loader2, Plus } from 'lucide-react'

interface ProjectDocument {
  id: string
  project_id: string
  file_name: string
  file_type: string
  file_size: number
  file_url: string
  category: 'document' | 'contract' | 'photo'
  uploaded_by: string
  uploaded_at: string
}

interface ProjectDocumentsProps {
  projectId: string
}

const categoryColors: Record<string, string> = {
  document: 'bg-blue-900/30 text-blue-400',
  contract: 'bg-purple-900/30 text-purple-400',
  photo: 'bg-green-900/30 text-green-400',
}

const categoryLabels: Record<string, string> = {
  document: 'Document',
  contract: 'Contrat',
  photo: 'Photo',
}

export function ProjectDocuments({ projectId }: ProjectDocumentsProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getProjectDocuments(projectId)
      .then(setDocuments)
      .finally(() => setLoading(false))
  }, [projectId])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (!file) return

    setUploading(true)
    startTransition(async () => {
      try {
        // Determine category based on file type
        let category: 'document' | 'contract' | 'photo' = 'document'
        if (file.type.startsWith('image/')) {
          category = 'photo'
        } else if (file.name.toLowerCase().includes('contract')) {
          category = 'contract'
        }

        const doc = await uploadProjectDocument(projectId, file, category)
        setDocuments(prev => [doc, ...prev])
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
      } finally {
        setUploading(false)
        e.currentTarget.value = ''
      }
    })
  }

  const handleDelete = (id: string, filePath: string) => {
    if (!confirm('Supprimer ce document?')) return
    startTransition(async () => {
      try {
        await deleteProjectDocument(id, filePath)
        setDocuments(prev => prev.filter(d => d.id !== id))
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      }
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Documents du projet</h3>
        <label className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-sm text-sm hover:bg-primary/90 transition-colors cursor-pointer">
          <Plus className="w-4 h-4" />
          Ajouter
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">
          Aucun document. Commencez par en ajouter un.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => (
            <div key={doc.id} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-sm border border-border hover:border-foreground/20 transition-colors">
              <div className="shrink-0">
                {doc.category === 'photo' ? (
                  <Image className="w-5 h-5 text-green-400" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-foreground truncate">
                    {doc.file_name}
                  </p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-sm shrink-0 ${categoryColors[doc.category]}`}>
                    {categoryLabels[doc.category]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(doc.file_size)} • {new Date(doc.uploaded_at).toLocaleDateString('fr-FR')}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={doc.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  title="Télécharger"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id, `${doc.category}/${projectId}/${doc.file_name}`)}
                  disabled={isPending}
                  className="p-2 text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Téléchargement en cours...
        </div>
      )}
    </div>
  )
}
