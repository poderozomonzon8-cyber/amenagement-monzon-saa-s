'use client'

import { useState, useEffect, useTransition } from 'react'
import { getCompanySettings, updateCompanySettings, getTemplates } from '@/app/actions/invoice-templates'
import { CompanySettings, InvoiceTemplate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

export function InvoiceDesignEditor() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getCompanySettings(), getTemplates()])
        setSettings(s)
        setTemplates(t)
      } catch {
        showToast('Erreur lors du chargement des paramètres.', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSave = () => {
    if (!settings) return
    startTransition(async () => {
      try {
        const updated = await updateCompanySettings(settings)
        setSettings(updated)
        showToast('Paramètres sauvegardés.', 'success')
      } catch {
        showToast('Erreur lors de la sauvegarde.', 'error')
      }
    })
  }

  // Upload directly from browser to Supabase Storage (bypasses 1MB Server Action limit)
  const handleFileUpload = async (
    file: File,
    folder: 'logos' | 'signatures',
    onSuccess: (url: string) => void
  ) => {
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const fileName = `${folder.slice(0, -1)}-${Date.now()}.${file.name.split('.').pop()}`
      const path = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from('company_assets')
        .upload(path, file, { upsert: true })

      if (error) throw new Error(error.message)

      const { data: { publicUrl } } = supabase.storage
        .from('company_assets')
        .getPublicUrl(path)

      onSuccess(publicUrl)
      showToast('Fichier téléchargé avec succès.', 'success')
    } catch (err) {
      showToast(`Erreur: ${err instanceof Error ? err.message : 'Échec du téléchargement'}`, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    handleFileUpload(file, 'logos', (url) => setSettings({ ...settings, logo_url: url }))
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    handleFileUpload(file, 'signatures', (url) => setSettings({ ...settings, signature_url: url }))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  )

  if (!settings) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Erreur : Paramètres non trouvés</div>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif text-foreground">Design des Factures</h1>
        <Button onClick={handleSave} disabled={isPending || uploading} className="bg-primary text-primary-foreground">
          {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary">
          <TabsTrigger value="branding">Marque</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        {/* BRANDING TAB */}
        <TabsContent value="branding" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Nom de l&apos;entreprise</label>
              <Input value={settings.company_name || ''} onChange={(e) => setSettings({ ...settings, company_name: e.target.value })} placeholder="Aménagement Monzon" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Adresse</label>
              <Input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Montréal, QC" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Téléphone</label>
              <Input value={settings.phone || ''} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="+1 (514) XXX-XXXX" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" value={settings.email || ''} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="contact@amenagementmonzon.com" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Numéro TPS</label>
              <Input value={settings.tax_number_1 || ''} onChange={(e) => setSettings({ ...settings, tax_number_1: e.target.value })} placeholder="TPS: 123456789" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Numéro TVQ</label>
              <Input value={settings.tax_number_2 || ''} onChange={(e) => setSettings({ ...settings, tax_number_2: e.target.value })} placeholder="TVQ: 987654321" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Logo de l&apos;entreprise</label>
            <p className="text-xs text-muted-foreground">Formats acceptés: PNG, JPG, WebP. Recommandé: PNG avec fond transparent.</p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleLogoUpload}
              disabled={uploading || isPending}
              className="block w-full text-sm text-foreground border border-border rounded-sm p-2.5 bg-input cursor-pointer"
            />
            {uploading && <p className="text-xs text-muted-foreground">Téléchargement en cours...</p>}
            {settings.logo_url && (
              <div className="mt-2 p-4 bg-secondary rounded-sm inline-flex items-center gap-4">
                <img src={settings.logo_url} alt="Logo" className="h-14 object-contain" />
                <button onClick={() => setSettings({ ...settings, logo_url: null })} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* COLORS TAB */}
        <TabsContent value="colors" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Couleur primaire</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.primary_color || '#C9A84C'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-12 h-10 border border-border rounded-sm cursor-pointer bg-transparent"
                />
                <Input value={settings.primary_color || '#C9A84C'} onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })} placeholder="#C9A84C" className="flex-1" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Couleur secondaire</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.secondary_color || '#0A0A0A'}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="w-12 h-10 border border-border rounded-sm cursor-pointer bg-transparent"
                />
                <Input value={settings.secondary_color || '#0A0A0A'} onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })} placeholder="#0A0A0A" className="flex-1" />
              </div>
            </div>
          </div>
          <div className="p-4 bg-secondary rounded-sm">
            <p className="text-sm text-muted-foreground mb-3">Aperçu des couleurs:</p>
            <div className="flex gap-3">
              <div className="flex-1 h-12 rounded-sm" style={{ backgroundColor: settings.primary_color || '#C9A84C' }} />
              <div className="flex-1 h-12 rounded-sm border border-border" style={{ backgroundColor: settings.secondary_color || '#0A0A0A' }} />
            </div>
          </div>
        </TabsContent>

        {/* TEMPLATES TAB */}
        <TabsContent value="templates" className="mt-6">
          {templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucun modèle disponible.</p>
              <p className="text-sm mt-1">Assurez-vous d&apos;avoir exécuté le SQL pour créer la table invoice_templates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSettings({ ...settings, template_id: t.id })}
                  className={`p-6 border-2 rounded-sm text-center transition-colors ${
                    settings.template_id === t.id ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground bg-secondary'
                  }`}
                >
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{t.layout_type}</div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* SIGNATURE TAB */}
        <TabsContent value="signature" className="mt-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">Signature pour les factures</label>
            <p className="text-xs text-muted-foreground">Formats acceptés: PNG, JPG, WebP. Recommandé: PNG avec fond transparent.</p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleSignatureUpload}
              disabled={uploading || isPending}
              className="block w-full text-sm text-foreground border border-border rounded-sm p-2.5 bg-input cursor-pointer"
            />
            {uploading && <p className="text-xs text-muted-foreground">Téléchargement en cours...</p>}
            {settings.signature_url && (
              <div className="mt-2 p-4 bg-secondary rounded-sm inline-flex items-center gap-4">
                <img src={settings.signature_url} alt="Signature" className="h-20 object-contain" />
                <button onClick={() => setSettings({ ...settings, signature_url: null })} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* PREVIEW TAB */}
        <TabsContent value="preview" className="mt-6">
          <div className="border border-border rounded-sm p-8 bg-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                {settings.logo_url && (
                  <img src={settings.logo_url} alt="Logo" className="h-16 mb-3 object-contain" />
                )}
                <h2 className="text-2xl font-bold" style={{ color: settings.primary_color || '#C9A84C' }}>
                  {settings.company_name || 'Nom de l\'entreprise'}
                </h2>
                <p className="text-sm text-muted-foreground">{settings.address || 'Adresse'}</p>
                <p className="text-sm text-muted-foreground">{settings.phone || 'Téléphone'}</p>
                <p className="text-sm text-muted-foreground">{settings.email || 'Email'}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-serif text-foreground">FACTURE</div>
                <div className="text-muted-foreground text-sm mt-1">#2025-001</div>
              </div>
            </div>
            <div className="pt-6 mb-6" style={{ borderTop: `3px solid ${settings.primary_color || '#C9A84C'}` }} />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-secondary/50 p-3 rounded-sm">
                <p className="text-muted-foreground">TPS: {settings.tax_number_1 || 'Non défini'}</p>
                <p className="text-muted-foreground">TVQ: {settings.tax_number_2 || 'Non défini'}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-sm text-right">
                <p className="text-foreground font-medium">Total: 1 000,00 $</p>
                <p className="text-muted-foreground">TPS: 50,00 $</p>
              </div>
            </div>
            {settings.signature_url && (
              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Signature autorisée:</p>
                <img src={settings.signature_url} alt="Signature" className="h-16 object-contain" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-sm text-white z-50 shadow-lg cursor-pointer text-sm ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
          onClick={() => setToast(null)}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
