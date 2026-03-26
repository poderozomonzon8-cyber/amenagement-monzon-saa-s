'use client'

import { useState, useEffect, useTransition } from 'react'
import { getCompanySettings, updateCompanySettings, uploadLogo, uploadSignature } from '@/app/actions/invoice-templates'
import { CompanySettings } from '@/lib/types'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Eye, Save, Loader2 } from 'lucide-react'

interface PreviewSettings {
  logo_url?: string
  signature_url?: string
  primary_color: string
  secondary_color: string
  company_name: string
  address?: string
  phone?: string
  email?: string
}

export function InvoiceDesignEditor() {
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [preview, setPreview] = useState<PreviewSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'branding' | 'colors' | 'preview'>('branding')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getCompanySettings()
        setSettings(s)
        setPreview({
          logo_url: s.logo_url,
          signature_url: s.signature_url,
          primary_color: s.primary_color || '#C9A84C',
          secondary_color: s.secondary_color || '#0A0A0A',
          company_name: s.company_name || 'Aménagement Monzon',
          address: s.address,
          phone: s.phone,
          email: s.email,
        })
      } catch (err) {
        console.error('Failed to load settings:', err)
        showToast('Erreur lors du chargement des paramètres.', 'err')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image.', 'err')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Le fichier dépasse 10 MB.', 'err')
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const fileName = `logo-${Date.now()}.${file.name.split('.').pop()}`
        
        const { error: uploadError } = await supabase.storage
          .from('company_assets')
          .upload(`logos/${fileName}`, file, { upsert: true })
        
        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('company_assets')
          .getPublicUrl(`logos/${fileName}`)
        
        setPreview(prev => prev ? { ...prev, logo_url: publicUrl } : null)
        showToast('Logo chargé avec succès.', 'ok')
        setLogoFile(null)
      } catch (err) {
        console.error('Logo upload error:', err)
        showToast('Erreur lors du chargement du logo.', 'err')
      }
    })
  }

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image.', 'err')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('Le fichier dépasse 10 MB.', 'err')
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const fileName = `signature-${Date.now()}.${file.name.split('.').pop()}`
        
        const { error: uploadError } = await supabase.storage
          .from('company_assets')
          .upload(`signatures/${fileName}`, file, { upsert: true })
        
        if (uploadError) throw new Error(uploadError.message)

        const { data: { publicUrl } } = supabase.storage
          .from('company_assets')
          .getPublicUrl(`signatures/${fileName}`)
        
        setPreview(prev => prev ? { ...prev, signature_url: publicUrl } : null)
        showToast('Signature chargée avec succès.', 'ok')
        setSignatureFile(null)
      } catch (err) {
        console.error('Signature upload error:', err)
        showToast('Erreur lors du chargement de la signature.', 'err')
      }
    })
  }

  const handleSave = () => {
    if (!settings || !preview) return
    startTransition(async () => {
      try {
        const updatedSettings: Partial<CompanySettings> = {
          id: settings.id,
          company_name: preview.company_name,
          address: preview.address,
          phone: preview.phone,
          email: preview.email,
          logo_url: preview.logo_url,
          signature_url: preview.signature_url,
          primary_color: preview.primary_color,
          secondary_color: preview.secondary_color,
        }
        await updateCompanySettings(updatedSettings)
        setSettings(prev => prev ? { ...prev, ...updatedSettings } : null)
        showToast('Paramètres sauvegardés avec succès.', 'ok')
      } catch (err) {
        console.error('Save error:', err)
        showToast('Erreur lors de la sauvegarde.', 'err')
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-full bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">Design des Factures</h1>
        <p className="text-sm text-muted-foreground mt-1">Personnalisez le design de vos factures</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6 gap-0">
        {(['branding', 'colors', 'preview'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'branding' && 'Marque'}
            {tab === 'colors' && 'Couleurs'}
            {tab === 'preview' && 'Aperçu'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Branding Tab */}
        {activeTab === 'branding' && preview && (
          <div className="max-w-2xl space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                value={preview.company_name}
                onChange={e => setPreview({ ...preview, company_name: e.target.value })}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-foreground"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
              <textarea
                value={preview.address || ''}
                onChange={e => setPreview({ ...preview, address: e.target.value })}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-foreground"
                rows={3}
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
              <input
                type="tel"
                value={preview.phone || ''}
                onChange={e => setPreview({ ...preview, phone: e.target.value })}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-foreground"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={preview.email || ''}
                onChange={e => setPreview({ ...preview, email: e.target.value })}
                className="w-full bg-input border border-border rounded-sm px-3 py-2 text-foreground"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Logo</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="border-2 border-dashed border-border rounded-sm p-4 cursor-pointer hover:border-primary transition-colors block text-center">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour charger le logo</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isPending}
                      className="hidden"
                    />
                  </label>
                </div>
                {preview.logo_url && (
                  <div className="flex-1 bg-secondary rounded-sm p-4 flex items-center justify-center">
                    <img src={preview.logo_url} alt="Logo" className="max-h-20 max-w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Signature</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="border-2 border-dashed border-border rounded-sm p-4 cursor-pointer hover:border-primary transition-colors block text-center">
                    <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Cliquez pour charger la signature</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSignatureUpload}
                      disabled={isPending}
                      className="hidden"
                    />
                  </label>
                </div>
                {preview.signature_url && (
                  <div className="flex-1 bg-secondary rounded-sm p-4 flex items-center justify-center">
                    <img src={preview.signature_url} alt="Signature" className="max-h-20 max-w-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && preview && (
          <div className="max-w-2xl space-y-6">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Couleur primaire</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={preview.primary_color}
                  onChange={e => setPreview({ ...preview, primary_color: e.target.value })}
                  className="w-16 h-10 rounded-sm cursor-pointer"
                />
                <input
                  type="text"
                  value={preview.primary_color}
                  onChange={e => setPreview({ ...preview, primary_color: e.target.value })}
                  className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-foreground text-sm font-mono"
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Couleur secondaire</label>
              <div className="flex gap-4 items-center">
                <input
                  type="color"
                  value={preview.secondary_color}
                  onChange={e => setPreview({ ...preview, secondary_color: e.target.value })}
                  className="w-16 h-10 rounded-sm cursor-pointer"
                />
                <input
                  type="text"
                  value={preview.secondary_color}
                  onChange={e => setPreview({ ...preview, secondary_color: e.target.value })}
                  className="flex-1 bg-input border border-border rounded-sm px-3 py-2 text-foreground text-sm font-mono"
                />
              </div>
            </div>

            {/* Color Preview */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-secondary rounded-sm p-6 text-center">
                <div
                  className="w-full h-16 rounded-sm mb-2"
                  style={{ backgroundColor: preview.primary_color }}
                />
                <p className="text-xs text-muted-foreground">Couleur primaire</p>
              </div>
              <div className="bg-secondary rounded-sm p-6 text-center">
                <div
                  className="w-full h-16 rounded-sm mb-2"
                  style={{ backgroundColor: preview.secondary_color }}
                />
                <p className="text-xs text-muted-foreground">Couleur secondaire</p>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && preview && (
          <div className="max-w-4xl">
            {/* Invoice Preview */}
            <div
              className="bg-white text-black rounded-sm shadow-lg p-8 space-y-6"
              style={{ borderTop: `4px solid ${preview.primary_color}` }}
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  {preview.logo_url && (
                    <img src={preview.logo_url} alt="Logo" className="h-12 mb-4" />
                  )}
                  <h1 className="text-2xl font-bold" style={{ color: preview.primary_color }}>
                    {preview.company_name}
                  </h1>
                  {preview.address && <p className="text-sm text-gray-600 mt-2">{preview.address}</p>}
                  {preview.phone && <p className="text-sm text-gray-600">{preview.phone}</p>}
                  {preview.email && <p className="text-sm text-gray-600">{preview.email}</p>}
                </div>
                <div className="text-right">
                  <p className="text-gray-600 font-mono">FACTURE #2024-001</p>
                  <p className="text-sm text-gray-500 mt-2">Date: 25 mars 2024</p>
                </div>
              </div>

              {/* Invoice Content */}
              <div className="grid grid-cols-2 gap-8 py-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">De:</p>
                  <p className="font-semibold">{preview.company_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">À:</p>
                  <p className="font-semibold">Client</p>
                </div>
              </div>

              {/* Invoice Items */}
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottomColor: preview.primary_color }} className="border-b-2">
                    <th className="text-left py-2 text-gray-700">Description</th>
                    <th className="text-right py-2 text-gray-700">Quantité</th>
                    <th className="text-right py-2 text-gray-700">Prix unitaire</th>
                    <th className="text-right py-2 text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-3">Service professionnel</td>
                    <td className="text-right">1</td>
                    <td className="text-right">$1,500.00</td>
                    <td className="text-right">$1,500.00</td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end gap-32 py-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Sous-total</p>
                  <p className="text-sm text-gray-600">TPS (5%)</p>
                  <p className="text-sm text-gray-600">TVQ (9.975%)</p>
                  <p className="text-lg font-bold mt-2" style={{ color: preview.primary_color }}>Total</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">$1,500.00</p>
                  <p className="text-sm text-gray-600">$75.00</p>
                  <p className="text-sm text-gray-600">$149.63</p>
                  <p className="text-lg font-bold mt-2" style={{ color: preview.primary_color }}>$1,724.63</p>
                </div>
              </div>

              {/* Signature */}
              {preview.signature_url && (
                <div className="pt-6 border-t border-gray-200">
                  <img src={preview.signature_url} alt="Signature" className="h-12" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border px-6 py-4 flex justify-between items-center">
        <div>
          {toast && (
            <div className={cn(
              'text-sm px-3 py-1 rounded-sm',
              toast.type === 'ok'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            )}>
              {toast.msg}
            </div>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-sm text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Sauvegarder
        </button>
      </div>
    </div>
  )
}
