'use client'

import { useState, useEffect, useTransition } from 'react'
import { getCompanySettings, updateCompanySettings, uploadLogo, uploadSignature, getTemplates } from '@/app/actions/invoice-templates'
import { CompanySettings, InvoiceTemplate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function InvoiceDesignEditor() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getCompanySettings(), getTemplates()])
        setSettings(s)
        setTemplates(t)
      } catch (err) {
        setToast({ msg: 'Erreur lors du chargement des paramètres.', type: 'error' })
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
        setToast({ msg: 'Paramètres sauvegardés avec succès.', type: 'success' })
      } catch (err) {
        setToast({ msg: 'Erreur lors de la sauvegarde.', type: 'error' })
      }
    })
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    
    startTransition(async () => {
      try {
        const url = await uploadLogo(file)
        setSettings({ ...settings, logo_url: url })
        setToast({ msg: 'Logo téléchargé.', type: 'success' })
      } catch (err) {
        setToast({ msg: 'Erreur lors du téléchargement du logo.', type: 'error' })
      }
    })
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !settings) return
    
    startTransition(async () => {
      try {
        const url = await uploadSignature(file)
        setSettings({ ...settings, signature_url: url })
        setToast({ msg: 'Signature téléchargée.', type: 'success' })
      } catch (err) {
        setToast({ msg: 'Erreur lors du téléchargement de la signature.', type: 'error' })
      }
    })
  }

  if (loading) return <div className="p-6 text-foreground">Chargement...</div>
  if (!settings) return <div className="p-6 text-foreground">Erreur : Paramètres non trouvés</div>

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-serif text-foreground mb-6">Design des Factures</h1>
      
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-secondary">
          <TabsTrigger value="branding">Marque</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom de l&apos;entreprise</label>
              <Input
                value={settings.company_name || ''}
                onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                placeholder="Aménagement Monzon"
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
              <Input
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                placeholder="Montréal, QC"
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <Input
                value={settings.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+1 (514) XXX-XXXX"
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input
                type="email"
                value={settings.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                placeholder="contact@amenagementmonzon.com"
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Numéro TPS</label>
              <Input
                value={settings.tax_number_1 || ''}
                onChange={(e) => setSettings({ ...settings, tax_number_1: e.target.value })}
                placeholder="TPS: 123456789"
                className="bg-input border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Numéro TVQ</label>
              <Input
                value={settings.tax_number_2 || ''}
                onChange={(e) => setSettings({ ...settings, tax_number_2: e.target.value })}
                placeholder="TVQ: 987654321"
                className="bg-input border-border"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Logo de l&apos;entreprise</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isPending}
              className="block w-full text-sm text-foreground border border-border rounded-sm p-2 bg-input"
            />
            {settings.logo_url && (
              <div className="mt-3 p-3 bg-secondary rounded-sm inline-block">
                <img src={settings.logo_url} alt="Logo" className="h-16 object-contain" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Couleur primaire</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.primary_color || '#C9A84C'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-14 h-10 border border-border rounded-sm cursor-pointer"
                />
                <Input
                  value={settings.primary_color || '#C9A84C'}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  placeholder="#C9A84C"
                  className="bg-input border-border flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Couleur secondaire</label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={settings.secondary_color || '#0A0A0A'}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  className="w-14 h-10 border border-border rounded-sm cursor-pointer"
                />
                <Input
                  value={settings.secondary_color || '#0A0A0A'}
                  onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                  placeholder="#0A0A0A"
                  className="bg-input border-border flex-1"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-3 gap-4">
            {templates.length === 0 ? (
              <p className="text-muted-foreground col-span-3">Aucun modèle disponible. Ajoutez des modèles dans Supabase.</p>
            ) : (
              templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSettings({ ...settings, template_id: t.id })}
                  className={`p-6 border-2 rounded-sm text-center cursor-pointer transition ${
                    settings.template_id === t.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted-foreground bg-secondary'
                  }`}
                >
                  <div className="font-medium text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground mt-1 capitalize">{t.layout_type}</div>
                </button>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="signature" className="mt-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Signature pour les factures</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              disabled={isPending}
              className="block w-full text-sm text-foreground border border-border rounded-sm p-2 bg-input"
            />
            {settings.signature_url && (
              <div className="mt-3 p-4 bg-secondary rounded-sm inline-block">
                <img src={settings.signature_url} alt="Signature" className="h-20 object-contain" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="border border-border rounded-sm p-8 bg-card">
            <div className="flex justify-between items-start mb-6">
              <div>
                {settings.logo_url && (
                  <img src={settings.logo_url} alt="Logo" className="h-16 mb-3 object-contain" />
                )}
                <h2 style={{ color: settings.primary_color }} className="text-2xl font-bold">
                  {settings.company_name || 'Nom de l\'entreprise'}
                </h2>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{settings.address || 'Adresse'}</p>
                <p>{settings.phone || 'Téléphone'}</p>
                <p>{settings.email || 'Email'}</p>
              </div>
            </div>
            <div style={{ borderTop: `3px solid ${settings.primary_color}` }} className="pt-6">
              <p className="text-muted-foreground mb-4">Aperçu de la facture avec vos paramètres</p>
              <div className="bg-secondary/50 p-4 rounded-sm">
                <p className="text-sm text-foreground">TPS: {settings.tax_number_1 || 'Non défini'}</p>
                <p className="text-sm text-foreground">TVQ: {settings.tax_number_2 || 'Non défini'}</p>
              </div>
            </div>
            {settings.signature_url && (
              <div className="mt-8 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Signature:</p>
                <img src={settings.signature_url} alt="Signature" className="h-16 object-contain" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-3">
        <Button onClick={handleSave} disabled={isPending} className="bg-primary text-primary-foreground">
          {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-sm text-white z-50 ${
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
