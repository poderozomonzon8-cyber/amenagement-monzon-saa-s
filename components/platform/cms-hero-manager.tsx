'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { getHeroes, updateHero, type WebsiteHero } from '@/app/actions/cms'
import { Save, Image as ImageIcon, Video, Loader2, Check, Home, Hammer, Leaf, Wrench } from 'lucide-react'

const PAGE_CONFIG = {
  home: { label: 'Homepage', icon: Home, color: '#C9A84C' },
  construction: { label: 'Construction', icon: Hammer, color: '#C9A84C' },
  hardscape: { label: 'Hardscape', icon: Leaf, color: '#16A34A' },
  maintenance: { label: 'Maintenance', icon: Wrench, color: '#2563EB' },
} as const

export function CMSHeroManager() {
  const [heroes, setHeroes] = useState<WebsiteHero[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('home')

  useEffect(() => {
    loadHeroes()
  }, [])

  const loadHeroes = async () => {
    setLoading(true)
    const data = await getHeroes()
    setHeroes(data)
    setLoading(false)
  }

  const handleUpdate = async (hero: WebsiteHero, field: keyof WebsiteHero, value: any) => {
    setHeroes(prev => prev.map(h => h.id === hero.id ? { ...h, [field]: value } : h))
  }

  const handleSave = async (hero: WebsiteHero) => {
    setSaving(hero.id)
    try {
      await updateHero(hero.id, {
        title: hero.title,
        subtitle: hero.subtitle,
        cta_text: hero.cta_text,
        cta_link: hero.cta_link,
        media_type: hero.media_type,
        media_url: hero.media_url,
        video_url: hero.video_url,
        overlay_color: hero.overlay_color,
        overlay_intensity: hero.overlay_intensity || 0.5,
        accent_color: hero.accent_color,
        is_active: hero.is_active,
      })
      setSaved(hero.id)
      setTimeout(() => setSaved(null), 2000)
    } catch (error) {
      console.error('Error saving hero:', error)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hero Manager</h2>
        <p className="text-muted-foreground">Manage hero sections for each page of your website</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-xl">
          {Object.entries(PAGE_CONFIG).map(([key, config]) => {
            const Icon = config.icon
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{config.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {heroes.map((hero) => {
          const config = PAGE_CONFIG[hero.page_key as keyof typeof PAGE_CONFIG]
          if (!config) return null

          return (
            <TabsContent key={hero.id} value={hero.page_key} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{config.label} Hero</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${hero.id}`} className="text-sm font-normal">Active</Label>
                      <Switch
                        id={`active-${hero.id}`}
                        checked={hero.is_active}
                        onCheckedChange={(checked) => handleUpdate(hero, 'is_active', checked)}
                      />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Text Content */}
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${hero.id}`}>Title</Label>
                      <Input
                        id={`title-${hero.id}`}
                        value={hero.title}
                        onChange={(e) => handleUpdate(hero, 'title', e.target.value)}
                        placeholder="Enter hero title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`subtitle-${hero.id}`}>Subtitle</Label>
                      <Textarea
                        id={`subtitle-${hero.id}`}
                        value={hero.subtitle}
                        onChange={(e) => handleUpdate(hero, 'subtitle', e.target.value)}
                        placeholder="Enter hero subtitle"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`cta-text-${hero.id}`}>CTA Button Text</Label>
                      <Input
                        id={`cta-text-${hero.id}`}
                        value={hero.cta_text}
                        onChange={(e) => handleUpdate(hero, 'cta_text', e.target.value)}
                        placeholder="Get a Quote"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cta-link-${hero.id}`}>CTA Link</Label>
                      <Input
                        id={`cta-link-${hero.id}`}
                        value={hero.cta_link}
                        onChange={(e) => handleUpdate(hero, 'cta_link', e.target.value)}
                        placeholder="/marketing/contact"
                      />
                    </div>
                  </div>

                  {/* Media Type Toggle */}
                  <div className="space-y-4">
                    <Label>Background Media</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={hero.media_type === 'image' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdate(hero, 'media_type', 'image')}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Image
                      </Button>
                      <Button
                        variant={hero.media_type === 'video' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleUpdate(hero, 'media_type', 'video')}
                      >
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </Button>
                    </div>
                  </div>

                  {/* Media Upload / URL */}
                  {hero.media_type === 'image' ? (
                    <div className="space-y-3">
                      <Label>Image URL</Label>
                      <Input
                        value={hero.media_url || ''}
                        onChange={(e) => handleUpdate(hero, 'media_url', e.target.value)}
                        placeholder="Paste image URL here (https://...)"
                      />
                      <p className="text-xs text-muted-foreground">
                        Paste any public image URL. You can use images from your Supabase storage, Unsplash, or any public URL.
                      </p>
                      {hero.media_url && (
                        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                          <img src={hero.media_url} alt="Preview" className="object-cover w-full h-full" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`video-url-${hero.id}`}>Video URL (YouTube, Vimeo, or direct link)</Label>
                        <Input
                          id={`video-url-${hero.id}`}
                          value={hero.video_url || ''}
                          onChange={(e) => handleUpdate(hero, 'video_url', e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                    </div>
                  )}

                  {/* Colors & Overlay */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`overlay-${hero.id}`}>Overlay Color</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`overlay-${hero.id}`}
                          value={hero.overlay_color}
                          onChange={(e) => handleUpdate(hero, 'overlay_color', e.target.value)}
                          placeholder="rgba(0,0,0,0.5)"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`accent-${hero.id}`}>Accent Color</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={hero.accent_color}
                          onChange={(e) => handleUpdate(hero, 'accent_color', e.target.value)}
                          className="h-10 w-10 rounded border cursor-pointer"
                        />
                        <Input
                          id={`accent-${hero.id}`}
                          value={hero.accent_color}
                          onChange={(e) => handleUpdate(hero, 'accent_color', e.target.value)}
                          placeholder="#C9A84C"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shadow Intensity Slider */}
                  <div className="space-y-3 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`shadow-intensity-${hero.id}`}>Overlay Shadow Intensity</Label>
                      <span className="text-sm font-semibold text-primary">{Math.round((hero.overlay_intensity || 0.5) * 100)}%</span>
                    </div>
                    <Slider
                      id={`shadow-intensity-${hero.id}`}
                      value={[(hero.overlay_intensity || 0.5) * 100]}
                      onValueChange={(value) => handleUpdate(hero, 'overlay_intensity', value[0] / 100)}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">Adjust the darkness of the overlay to make the hero image more or less visible. 0% = fully transparent, 100% = fully opaque.</p>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      onClick={() => handleSave(hero)} 
                      disabled={saving === hero.id}
                      className="min-w-32"
                    >
                      {saving === hero.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : saved === hero.id ? (
                        <Check className="h-4 w-4 mr-2" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saved === hero.id ? 'Saved!' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
