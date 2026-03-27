'use client'

import { useState, useEffect } from 'react'
import { getAllHeroContent, updateHeroContent, HeroContent } from '@/app/actions/cms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Save, X } from 'lucide-react'

export function CMSEditor() {
  const [content, setContent] = useState<HeroContent[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<HeroContent>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    const data = await getAllHeroContent()
    setContent(data)
    setLoading(false)
  }

  const startEdit = (item: HeroContent) => {
    setEditingId(item.id)
    setEditForm({ ...item })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const saveEdit = async () => {
    if (!editingId) return
    
    setSaving(true)
    const result = await updateHeroContent(editForm.page_key!, {
      title: editForm.title!,
      subtitle: editForm.subtitle!,
      cta_text: editForm.cta_text,
      cta_link: editForm.cta_link,
      accent_color: editForm.accent_color,
      media_type: editForm.media_type as 'image' | 'video',
      media_url: editForm.media_url,
      overlay_color: editForm.overlay_color,
    })
    
    setSaving(false)

    if (result.success) {
      toast({ title: 'Success', description: 'Hero content updated' })
      loadContent()
      cancelEdit()
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to update content',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">CMS Hero Content</h2>
        <Button onClick={loadContent} variant="outline">
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {content.map(item => (
            <TabsTrigger key={item.id} value={item.page_key}>
              {item.page_key}
            </TabsTrigger>
          ))}
        </TabsList>

        {content.map(item => (
          <TabsContent key={item.id} value={item.page_key}>
            <Card className="p-6">
              {editingId === item.id ? (
                // Edit Form
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input
                      value={editForm.title || ''}
                      onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Hero title"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <textarea
                      value={editForm.subtitle || ''}
                      onChange={e => setEditForm({ ...editForm, subtitle: e.target.value })}
                      placeholder="Hero subtitle"
                      className="w-full p-2 border rounded min-h-24"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">CTA Text</label>
                      <Input
                        value={editForm.cta_text || ''}
                        onChange={e => setEditForm({ ...editForm, cta_text: e.target.value })}
                        placeholder="Button text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">CTA Link</label>
                      <Input
                        value={editForm.cta_link || ''}
                        onChange={e => setEditForm({ ...editForm, cta_link: e.target.value })}
                        placeholder="/path"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Media Type</label>
                      <select
                        value={editForm.media_type || 'image'}
                        onChange={e => setEditForm({ ...editForm, media_type: e.target.value as 'image' | 'video' })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Media URL</label>
                      <Input
                        value={editForm.media_url || ''}
                        onChange={e => setEditForm({ ...editForm, media_url: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Accent Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={editForm.accent_color || '#C9A84C'}
                          onChange={e => setEditForm({ ...editForm, accent_color: e.target.value })}
                          className="w-12 h-10 border rounded"
                        />
                        <Input
                          value={editForm.accent_color || ''}
                          onChange={e => setEditForm({ ...editForm, accent_color: e.target.value })}
                          placeholder="#C9A84C"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Overlay Color</label>
                      <Input
                        value={editForm.overlay_color || ''}
                        onChange={e => setEditForm({ ...editForm, overlay_color: e.target.value })}
                        placeholder="rgba(0, 0, 0, 0.4)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                    >
                      <X className="mr-2 w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      onClick={saveEdit}
                      disabled={saving}
                    >
                      {saving && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                      <Save className="mr-2 w-4 h-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.subtitle}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">CTA:</span> {item.cta_text} → {item.cta_link}
                    </div>
                    <div>
                      <span className="font-medium">Media:</span> {item.media_type} {item.media_url ? '✓' : '(none)'}
                    </div>
                    <div>
                      <span className="font-medium">Accent Color:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-6 h-6 border rounded"
                          style={{ backgroundColor: item.accent_color }}
                        />
                        {item.accent_color}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Published:</span> {item.is_published ? '✓ Yes' : '✗ No'}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <Button
                      onClick={() => startEdit(item)}
                      variant="default"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
