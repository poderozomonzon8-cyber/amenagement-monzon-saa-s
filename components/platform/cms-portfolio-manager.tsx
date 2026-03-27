'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getPortfolioItems, createPortfolioItem, updatePortfolioItem, deletePortfolioItem, type PortfolioItem } from '@/app/actions/cms'
import { createClient } from '@/lib/supabase/client'
import { Plus, Upload, Loader2, Pencil, Trash2, GripVertical, Star, Image as ImageIcon } from 'lucide-react'

const CATEGORIES = [
  { value: 'construction', label: 'Construction', color: '#C9A84C' },
  { value: 'hardscape', label: 'Hardscape', color: '#16A34A' },
  { value: 'maintenance', label: 'Maintenance', color: '#2563EB' },
] as const

export function CMSPortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'construction' as const,
    image_url: '',
    is_featured: false,
    display_order: 0,
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    const data = await getPortfolioItems()
    setItems(data)
    setLoading(false)
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      category: 'construction',
      image_url: '',
      is_featured: false,
      display_order: items.length,
    })
    setEditingItem(null)
  }

  const openEditDialog = (item: PortfolioItem) => {
    setEditingItem(item)
    setForm({
      title: item.title,
      description: item.description || '',
      category: item.category,
      image_url: item.image_url,
      is_featured: item.is_featured,
      display_order: item.display_order,
    })
    setDialogOpen(true)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `portfolio/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('cms-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      
      if (error) throw error
      
      const { data: urlData } = supabase.storage
        .from('cms-media')
        .getPublicUrl(data.path)
      
      setForm(prev => ({ ...prev, image_url: urlData.publicUrl }))
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.title || !form.image_url) return
    
    setSaving(true)
    try {
      if (editingItem) {
        await updatePortfolioItem(editingItem.id, form)
      } else {
        await createPortfolioItem(form)
      }
      await loadItems()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving portfolio item:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) return
    
    try {
      await deletePortfolioItem(id)
      await loadItems()
    } catch (error) {
      console.error('Error deleting portfolio item:', error)
    }
  }

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items.filter(item => item.category === filterCategory)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Manager</h2>
          <p className="text-muted-foreground">Manage your project gallery</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Project' : 'Add New Project'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Project Image *</Label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="portfolio-image-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('portfolio-image-upload')?.click()}
                    disabled={uploading}
                    className="w-full"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Image
                  </Button>
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Or paste image URL..."
                  />
                  {form.image_url && (
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <img src={form.image_url} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Project title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={form.category} 
                  onValueChange={(value: 'construction' | 'hardscape' | 'maintenance') => 
                    setForm(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-3">
                <Switch
                  id="featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="featured" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Featured Project
                </Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !form.title || !form.image_url}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingItem ? 'Save Changes' : 'Add Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Label className="text-sm">Filter:</Label>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground ml-2">
          {filteredItems.length} project{filteredItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Portfolio Grid */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No portfolio items yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const category = CATEGORIES.find(c => c.value === item.category)
            return (
              <Card key={item.id} className="overflow-hidden group">
                <div className="relative aspect-video">
                  <img 
                    src={item.image_url} 
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full shrink-0"
                      style={{ 
                        backgroundColor: `${category?.color}20`, 
                        color: category?.color 
                      }}
                    >
                      {category?.label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
