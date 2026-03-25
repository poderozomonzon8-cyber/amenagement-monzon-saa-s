'use client'

import { useState, useTransition } from 'react'
import { getCompanySettings, updateCompanySettings, uploadLogo, uploadSignature, getInvoiceTemplates } from '@/app/actions/invoice-templates'
import { CompanySettings, InvoiceTemplate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'

export function InvoiceDesignEditor() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getCompanySettings(), getInvoiceTemplates()])
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

  if (loading) return <div className="p-6">Chargement...</div>
  if (!settings) return <div className="p-6">Erreur : Paramètres non trouvés</div>

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-serif mb-6">Éditeur de Facturation</h1>
      
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="branding">Marque</TabsTrigger>
          <TabsTrigger value="colors">Couleurs</TabsTrigger>
          <TabsTrigger value="templates">Modèles</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
            <Input
              value={settings.company_name || ''}
              onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
              placeholder="Aménagement Monzon"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Adresse</label>
            <Input
              value={settings.address || ''}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="Montréal, QC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <Input
              value={settings.phone || ''}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              placeholder="+1 (514) XXX-XXXX"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={settings.email || ''}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="contact@amenagementmonzon.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Numéro de taxe 1</label>
            <Input
              value={settings.tax_number_1 || ''}
              onChange={(e) => setSettings({ ...settings, tax_number_1: e.target.value })}
              placeholder="TPS: 123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Numéro de taxe 2</label>
            <Input
              value={settings.tax_number_2 || ''}
              onChange={(e) => setSettings({ ...settings, tax_number_2: e.target.value })}
              placeholder="TVQ: 987654321"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={isPending}
              className="block w-full text-sm border border-gray-300 rounded p-2"
            />
            {settings.logo_url && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-gray-600">Logo actuel:</span>
                <img src={settings.logo_url} alt="Logo" className="h-12" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Couleur primaire</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.primary_color || '#C9A84C'}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <Input
                value={settings.primary_color || '#C9A84C'}
                onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                placeholder="#C9A84C"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Couleur secondaire</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.secondary_color || '#0A0A0A'}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                className="w-16 h-10 border rounded cursor-pointer"
              />
              <Input
                value={settings.secondary_color || '#0A0A0A'}
                onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                placeholder="#0A0A0A"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSettings({ ...settings, template_id: t.id })}
                className={`p-4 border-2 rounded-lg text-center cursor-pointer transition ${
                  settings.template_id === t.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-gray-600 mt-1">{t.layout_type}</div>
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signature" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Télécharger une signature</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureUpload}
              disabled={isPending}
              className="block w-full text-sm border border-gray-300 rounded p-2"
            />
            {settings.signature_url && (
              <div className="mt-2">
                <span className="text-sm text-gray-600">Signature actuelle:</span>
                <img src={settings.signature_url} alt="Signature" className="h-20 mt-2" />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="border rounded-lg p-8 bg-gray-50 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                {settings.logo_url && (
                  <img src={settings.logo_url} alt="Logo" className="h-16 mb-2" />
                )}
                <h2 style={{ color: settings.primary_color }} className="text-2xl font-bold">
                  {settings.company_name}
                </h2>
              </div>
              <div className="text-right text-sm">
                <p>{settings.address}</p>
                <p>{settings.phone}</p>
                <p>{settings.email}</p>
              </div>
            </div>
            <div style={{ borderTop: `2px solid ${settings.primary_color}` }} className="pt-4">
              <p className="text-gray-600">Exemple de facture avec ce modèle</p>
            </div>
            {settings.signature_url && (
              <div className="mt-8 pt-4 border-t">
                <img src={settings.signature_url} alt="Signature" className="h-16" />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-2">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
        </Button>
      </div>

      {toast && (
        <div
          className={`fixed bottom-4 right-4 p-4 rounded-lg text-white ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}
