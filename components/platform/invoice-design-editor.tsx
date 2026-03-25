'use client'

import { useState, useEffect, useTransition } from 'react'
import { getCompanySettings, updateCompanySettings, getInvoiceTemplates } from '@/app/actions/invoice-templates'
import { CompanySettings, InvoiceTemplate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Save, Loader2, Palette, Image, FileSignature, Eye, Building } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export function InvoiceDesignEditor() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    const load = async () => {
      try {
        const [s, t] = await Promise.all([getCompanySettings(), getInvoiceTemplates()])
        setSettings(s)
        setTemplates(t)
      } catch (err) {
        console.error('Failed to load settings:', err)
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
        // Only update if there's an actual change
        if (settings.logo_url?.startsWith('http') || settings.signature_url?.startsWith('http')) {
          await updateCompanySettings(settings)
          showToast('Paramètres sauvegardés.', 'ok')
        } else {
          showToast('Aucun changement à sauvegarder.', 'ok')
        }
      } catch (err) {
        console.error('Save error:', err)
        showToast('Erreur lors de la sauvegarde. Les images sont chargées localement.', 'err')
      }
    })
  }

  // Direct browser upload to Supabase Storage
  const handleFileUpload = async (file: File, type: 'logo' | 'signature') => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zlynkkolnenjylzyhwvj.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpseW5ra29sbmVuanlsenlod3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4NDk2NTcsImV4cCI6MjA1ODQyNTY1N30.aIqPPLiJBbGGBEFkMsmB00LYmKGB1ry-9hKjN5sXSKo'
    )
    
    const folder = type === 'logo' ? 'logos' : 'signatures'
    const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`
    
    const { error } = await supabase.storage
      .from('company_assets')
      .upload(`${folder}/${fileName}`, file, { upsert: true })
    
    if (error) {
      showToast(`Erreur: ${error.message}`, 'err')
      return
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('company_assets')
      .getPublicUrl(`${folder}/${fileName}`)
    
    if (type === 'logo') {
      setSettings(prev => prev ? { ...prev, logo_url: publicUrl } : prev)
    } else {
      setSettings(prev => prev ? { ...prev, signature_url: publicUrl } : prev)
    }
    showToast(`${type === 'logo' ? 'Logo' : 'Signature'} téléchargé.`, 'ok')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-sm text-sm ${
          toast.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-foreground">Design des Factures</h1>
          <p className="text-muted-foreground text-sm mt-1">Personnalisez l&apos;apparence de vos factures</p>
        </div>
        <Button onClick={handleSave} disabled={isPending} className="bg-primary text-primary-foreground">
          {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Sauvegarder
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="branding" className="gap-2"><Building className="w-4 h-4" /> Entreprise</TabsTrigger>
          <TabsTrigger value="colors" className="gap-2"><Palette className="w-4 h-4" /> Couleurs</TabsTrigger>
          <TabsTrigger value="logo" className="gap-2"><Image className="w-4 h-4" /> Logo</TabsTrigger>
          <TabsTrigger value="signature" className="gap-2"><FileSignature className="w-4 h-4" /> Signature</TabsTrigger>
          <TabsTrigger value="preview" className="gap-2"><Eye className="w-4 h-4" /> Aperçu</TabsTrigger>
        </TabsList>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-4">
          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Nom de l&apos;entreprise</Label>
                <Input 
                  value={settings?.company_name || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, company_name: e.target.value } : prev)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Email</Label>
                <Input 
                  value={settings?.email || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, email: e.target.value } : prev)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Téléphone</Label>
                <Input 
                  value={settings?.phone || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Adresse</Label>
                <Input 
                  value={settings?.address || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, address: e.target.value } : prev)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Numéro TPS</Label>
                <Input 
                  value={settings?.tax_number_1 || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, tax_number_1: e.target.value } : prev)}
                  className="bg-input border-border"
                  placeholder="123456789RT0001"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Numéro TVQ</Label>
                <Input 
                  value={settings?.tax_number_2 || ''} 
                  onChange={e => setSettings(prev => prev ? { ...prev, tax_number_2: e.target.value } : prev)}
                  className="bg-input border-border"
                  placeholder="1234567890TQ0001"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-4">
          <div className="bg-card border border-border rounded-sm p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-foreground">Couleur Primaire</Label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings?.primary_color || '#C9A84C'} 
                    onChange={e => setSettings(prev => prev ? { ...prev, primary_color: e.target.value } : prev)}
                    className="w-12 h-12 rounded-sm border border-border cursor-pointer"
                  />
                  <Input 
                    value={settings?.primary_color || '#C9A84C'} 
                    onChange={e => setSettings(prev => prev ? { ...prev, primary_color: e.target.value } : prev)}
                    className="bg-input border-border flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Couleur Secondaire</Label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={settings?.secondary_color || '#0A0A0A'} 
                    onChange={e => setSettings(prev => prev ? { ...prev, secondary_color: e.target.value } : prev)}
                    className="w-12 h-12 rounded-sm border border-border cursor-pointer"
                  />
                  <Input 
                    value={settings?.secondary_color || '#0A0A0A'} 
                    onChange={e => setSettings(prev => prev ? { ...prev, secondary_color: e.target.value } : prev)}
                    className="bg-input border-border flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Logo Tab */}
        <TabsContent value="logo" className="space-y-4">
          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <Label className="text-foreground">Logo de l&apos;entreprise</Label>
            <p className="text-muted-foreground text-sm">Formats acceptés: PNG, JPG, WebP (max 10MB)</p>
            {settings?.logo_url && (
              <div className="w-40 h-40 border border-border rounded-sm overflow-hidden bg-white p-2">
                <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choisir un fichier</span>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/webp" 
                  className="hidden" 
                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                />
              </label>
            </div>
          </div>
        </TabsContent>

        {/* Signature Tab */}
        <TabsContent value="signature" className="space-y-4">
          <div className="bg-card border border-border rounded-sm p-6 space-y-4">
            <Label className="text-foreground">Signature</Label>
            <p className="text-muted-foreground text-sm">Ajoutez votre signature pour les factures. Formats: PNG, JPG, WebP (max 10MB)</p>
            {settings?.signature_url && (
              <div className="w-60 h-24 border border-border rounded-sm overflow-hidden bg-white p-2">
                <img src={settings.signature_url} alt="Signature" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-sm cursor-pointer hover:bg-secondary/80 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Choisir un fichier</span>
                <input 
                  type="file" 
                  accept="image/png,image/jpeg,image/webp" 
                  className="hidden" 
                  onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'signature')}
                />
              </label>
            </div>
          </div>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <div className="bg-white rounded-sm p-8 text-black shadow-lg max-w-2xl">
            {/* Invoice Header Preview */}
            <div className="flex justify-between items-start border-b pb-6 mb-6" style={{ borderColor: settings?.primary_color }}>
              <div className="flex items-center gap-4">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-16 h-16 object-contain" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center" style={{ backgroundColor: settings?.primary_color }}>
                    <span className="text-white font-bold text-2xl">M</span>
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-xl" style={{ color: settings?.secondary_color }}>{settings?.company_name || 'Aménagement Monzon'}</h2>
                  <p className="text-sm text-gray-600">{settings?.address}</p>
                  <p className="text-sm text-gray-600">{settings?.phone} | {settings?.email}</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold" style={{ color: settings?.primary_color }}>FACTURE</h1>
                <p className="text-gray-600">No. FAC-2024-001</p>
                <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-CA')}</p>
              </div>
            </div>
            
            {/* Sample content */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2" style={{ color: settings?.secondary_color }}>Facturer à:</h3>
              <p className="text-gray-700">Client Exemple</p>
              <p className="text-gray-600 text-sm">123 Rue Exemple, Montréal QC</p>
            </div>

            {/* Sample table */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr style={{ backgroundColor: settings?.primary_color }}>
                  <th className="text-left p-2 text-white">Description</th>
                  <th className="text-right p-2 text-white">Qté</th>
                  <th className="text-right p-2 text-white">Prix</th>
                  <th className="text-right p-2 text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2">Service exemple</td>
                  <td className="text-right p-2">1</td>
                  <td className="text-right p-2">500.00 $</td>
                  <td className="text-right p-2">500.00 $</td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-1"><span>Sous-total:</span><span>500.00 $</span></div>
                <div className="flex justify-between py-1"><span>TPS (5%):</span><span>25.00 $</span></div>
                <div className="flex justify-between py-1"><span>TVQ (9.975%):</span><span>49.88 $</span></div>
                <div className="flex justify-between py-2 font-bold border-t" style={{ borderColor: settings?.primary_color }}>
                  <span>Total:</span><span style={{ color: settings?.primary_color }}>574.88 $</span>
                </div>
              </div>
            </div>

            {/* Footer with signature */}
            <div className="mt-8 pt-6 border-t flex justify-between items-end">
              <div className="text-xs text-gray-500">
                <p>TPS: {settings?.tax_number_1 || 'N/A'}</p>
                <p>TVQ: {settings?.tax_number_2 || 'N/A'}</p>
              </div>
              {settings?.signature_url && (
                <div>
                  <img src={settings.signature_url} alt="Signature" className="h-12 object-contain" />
                  <p className="text-xs text-gray-500 text-center mt-1">Signature autorisée</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
