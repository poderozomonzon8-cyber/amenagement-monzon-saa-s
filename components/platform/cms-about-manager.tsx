'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getAboutContent, updateAboutContent, type WebsiteAbout } from '@/app/actions/cms'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, Loader2, Check, User, Target, Award, Briefcase } from 'lucide-react'

export function CMSAboutManager() {
  const [content, setContent] = useState<WebsiteAbout | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    setLoading(true)
    const data = await getAboutContent()
    setContent(data)
    setLoading(false)
  }

  const handleUpdate = (field: keyof WebsiteAbout, value: any) => {
    if (!content) return
    setContent({ ...content, [field]: value })
  }

  const handleImageUpload = async (file: File) => {
    if (!content) return
    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `about/founder-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('cms-media')
        .upload(fileName, file, { cacheControl: '3600', upsert: true })
      
      if (error) throw error
      
      const { data: urlData } = supabase.storage
        .from('cms-media')
        .getPublicUrl(data.path)
      
      handleUpdate('founder_image_url', urlData.publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return
    setSaving(true)
    try {
      await updateAboutContent(content.id, {
        founder_name: content.founder_name,
        founder_image_url: content.founder_image_url,
        founder_story: content.founder_story,
        mission_statement: content.mission_statement,
        years_experience: content.years_experience,
        projects_completed: content.projects_completed,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (error) {
      console.error('Error saving about content:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No about content found. Please run the database migration.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">About / Founder</h2>
        <p className="text-muted-foreground">Manage the about section of your website</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Founder Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Founder Information
            </CardTitle>
            <CardDescription>Update founder name and profile image</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="founder-name">Founder Name</Label>
              <Input
                id="founder-name"
                value={content.founder_name}
                onChange={(e) => handleUpdate('founder_name', e.target.value)}
                placeholder="Carlos Monzon"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Founder Photo</Label>
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-muted flex items-center justify-center">
                  {content.founder_image_url ? (
                    <img 
                      src={content.founder_image_url} 
                      alt={content.founder_name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    id="founder-image-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('founder-image-upload')?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Photo
                  </Button>
                  <Input
                    value={content.founder_image_url || ''}
                    onChange={(e) => handleUpdate('founder_image_url', e.target.value)}
                    placeholder="Or paste URL..."
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="founder-story">Founder Story</Label>
              <Textarea
                id="founder-story"
                value={content.founder_story}
                onChange={(e) => handleUpdate('founder_story', e.target.value)}
                placeholder="Share the founder's background and journey..."
                rows={6}
              />
            </div>
          </CardContent>
        </Card>

        {/* Mission & Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Mission & Statistics
            </CardTitle>
            <CardDescription>Company mission and key statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mission">Mission Statement</Label>
              <Textarea
                id="mission"
                value={content.mission_statement}
                onChange={(e) => handleUpdate('mission_statement', e.target.value)}
                placeholder="Our mission is to..."
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Years of Experience
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={content.years_experience}
                  onChange={(e) => handleUpdate('years_experience', parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projects" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Projects Completed
                </Label>
                <Input
                  id="projects"
                  type="number"
                  value={content.projects_completed}
                  onChange={(e) => handleUpdate('projects_completed', parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
            
            {/* Preview */}
            <div className="border rounded-lg p-4 bg-muted/30 mt-4">
              <p className="text-xs text-muted-foreground mb-2">Preview on website:</p>
              <div className="flex items-center gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#C9A84C' }}>
                    {content.years_experience}+
                  </p>
                  <p className="text-xs text-muted-foreground">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#C9A84C' }}>
                    {content.projects_completed}+
                  </p>
                  <p className="text-xs text-muted-foreground">Projects Completed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="min-w-32"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : saved ? (
            <Check className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
