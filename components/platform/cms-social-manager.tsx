"use client"

import { useState, useEffect, useTransition } from "react"
import { getCompanySettings, updateCompanySettings } from "@/app/actions/settings"
import { CompanySettings } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, CheckCircle, Facebook, Instagram } from "lucide-react"

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.52V6.77a4.85 4.85 0 01-1.02-.08z"/>
    </svg>
  )
}

export function CMSSocialManager() {
  const [settings, setSettings] = useState<Partial<CompanySettings>>({
    facebook_url: '',
    instagram_url: '',
    tiktok_url: '',
  })
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    getCompanySettings().then((data) => {
      setSettings({
        facebook_url: data.facebook_url || '',
        instagram_url: data.instagram_url || '',
        tiktok_url: data.tiktok_url || '',
      })
    })
  }, [])

  const handleSave = () => {
    startTransition(async () => {
      await updateCompanySettings({
        facebook_url: settings.facebook_url || null,
        instagram_url: settings.instagram_url || null,
        tiktok_url: settings.tiktok_url || null,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  const socials = [
    {
      key: 'facebook_url' as const,
      label: 'Facebook',
      placeholder: 'https://www.facebook.com/yourpage',
      icon: <Facebook className="w-5 h-5 text-blue-500" />,
      previewColor: '#1877F2',
    },
    {
      key: 'instagram_url' as const,
      label: 'Instagram',
      placeholder: 'https://www.instagram.com/yourhandle',
      icon: <Instagram className="w-5 h-5 text-pink-500" />,
      previewColor: '#E1306C',
    },
    {
      key: 'tiktok_url' as const,
      label: 'TikTok',
      placeholder: 'https://www.tiktok.com/@yourhandle',
      icon: <TikTokIcon className="w-5 h-5 text-foreground" />,
      previewColor: '#000000',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
        <p className="text-sm text-muted-foreground mt-1">
          These links appear in the website header and footer. Leave blank to hide an icon.
        </p>
      </div>

      <div className="space-y-5 max-w-xl">
        {socials.map(({ key, label, placeholder, icon }) => (
          <div key={key} className="space-y-2">
            <Label className="flex items-center gap-2">
              {icon}
              {label}
            </Label>
            <div className="flex gap-3 items-center">
              <Input
                value={settings[key] || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                placeholder={placeholder}
                className="flex-1"
              />
              {settings[key] && (
                <a
                  href={settings[key] as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline whitespace-nowrap"
                >
                  Test link
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Live preview */}
      <div className="border border-border rounded-sm p-4 max-w-xl">
        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Header Preview</p>
        <div className="flex items-center gap-3">
          {socials.map(({ key, label, icon }) =>
            settings[key] ? (
              <div key={key} title={label} className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                {icon}
              </div>
            ) : null
          )}
          {!socials.some(({ key }) => settings[key]) && (
            <p className="text-xs text-muted-foreground italic">No icons to display — add URLs above</p>
          )}
        </div>
      </div>

      <Button onClick={handleSave} disabled={isPending} className="flex items-center gap-2">
        {saved ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-500" />
            Saved!
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            {isPending ? 'Saving...' : 'Save Social Links'}
          </>
        )}
      </Button>
    </div>
  )
}
