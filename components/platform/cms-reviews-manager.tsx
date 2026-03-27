'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getReviews, createReview, updateReview, deleteReview, type Review } from '@/app/actions/cms'
import { Plus, Loader2, Pencil, Trash2, Star, Check, X, MessageSquare } from 'lucide-react'

export function CMSReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [form, setForm] = useState({
    client_name: '',
    client_role: 'Homeowner',
    rating: 5,
    comment: '',
    is_featured: false,
    is_approved: true,
  })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    setLoading(true)
    const data = await getReviews()
    setReviews(data)
    setLoading(false)
  }

  const resetForm = () => {
    setForm({
      client_name: '',
      client_role: 'Homeowner',
      rating: 5,
      comment: '',
      is_featured: false,
      is_approved: true,
    })
    setEditingReview(null)
  }

  const openEditDialog = (review: Review) => {
    setEditingReview(review)
    setForm({
      client_name: review.client_name,
      client_role: review.client_role || 'Homeowner',
      rating: review.rating,
      comment: review.comment,
      is_featured: review.is_featured,
      is_approved: review.is_approved,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.client_name || !form.comment) return
    
    setSaving(true)
    try {
      if (editingReview) {
        await updateReview(editingReview.id, form)
      } else {
        await createReview(form)
      }
      await loadReviews()
      setDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving review:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return
    
    try {
      await deleteReview(id)
      await loadReviews()
    } catch (error) {
      console.error('Error deleting review:', error)
    }
  }

  const handleToggleApproval = async (review: Review) => {
    try {
      await updateReview(review.id, { is_approved: !review.is_approved })
      await loadReviews()
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const handleToggleFeatured = async (review: Review) => {
    try {
      await updateReview(review.id, { is_featured: !review.is_featured })
      await loadReviews()
    } catch (error) {
      console.error('Error updating review:', error)
    }
  }

  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (r: number) => void; readonly?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`h-5 w-5 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  )

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
          <h2 className="text-2xl font-bold">Reviews / Testimonials</h2>
          <p className="text-muted-foreground">Manage customer reviews displayed on your website</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-name">Client Name *</Label>
                  <Input
                    id="client-name"
                    value={form.client_name}
                    onChange={(e) => setForm(prev => ({ ...prev, client_name: e.target.value }))}
                    placeholder="Jean-Pierre Tremblay"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client-role">Role / Title</Label>
                  <Input
                    id="client-role"
                    value={form.client_role}
                    onChange={(e) => setForm(prev => ({ ...prev, client_role: e.target.value }))}
                    placeholder="Homeowner"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Rating *</Label>
                <StarRating rating={form.rating} onChange={(r) => setForm(prev => ({ ...prev, rating: r }))} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="comment">Review Text *</Label>
                <Textarea
                  id="comment"
                  value={form.comment}
                  onChange={(e) => setForm(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="What the client said about your service..."
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    id="featured"
                    checked={form.is_featured}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="approved"
                    checked={form.is_approved}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_approved: checked }))}
                  />
                  <Label htmlFor="approved">Approved</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving || !form.client_name || !form.comment}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingReview ? 'Save Changes' : 'Add Review'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{reviews.length}</p>
            <p className="text-sm text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{reviews.filter(r => r.is_approved).length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{reviews.filter(r => r.is_featured).length}</p>
            <p className="text-sm text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reviews yet</p>
            <Button variant="outline" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className={!review.is_approved ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <StarRating rating={review.rating} readonly />
                      {review.is_featured && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                      {!review.is_approved && (
                        <span className="text-xs bg-red-500/20 text-red-600 px-2 py-0.5 rounded">
                          Pending Approval
                        </span>
                      )}
                    </div>
                    <p className="text-foreground mb-2">{review.comment}</p>
                    <p className="text-sm">
                      <span className="font-medium">{review.client_name}</span>
                      {review.client_role && (
                        <span className="text-muted-foreground"> - {review.client_role}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleApproval(review)}
                      title={review.is_approved ? 'Unapprove' : 'Approve'}
                    >
                      {review.is_approved ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-red-600" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFeatured(review)}
                      title={review.is_featured ? 'Unfeature' : 'Feature'}
                    >
                      <Star className={`h-4 w-4 ${review.is_featured ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(review)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(review.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
