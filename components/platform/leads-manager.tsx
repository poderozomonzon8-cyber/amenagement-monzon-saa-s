'use client'

import { useState, useEffect } from 'react'
import { getLeads, updateLeadStatus, convertLeadToClient, deleteLead, type Lead } from '@/app/actions/leads'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Mail, Phone, Calendar, DollarSign, FileText, Trash2, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react'

const statusConfig = {
  new: { badge: 'bg-blue-500/20 text-blue-300', label: 'New' },
  contacted: { badge: 'bg-purple-500/20 text-purple-300', label: 'Contacted' },
  converted: { badge: 'bg-green-500/20 text-green-300', label: 'Converted' },
  closed: { badge: 'bg-gray-500/20 text-gray-300', label: 'Closed' }
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [converting, setConverting] = useState(false)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = async () => {
    setLoading(true)
    const data = await getLeads()
    setLeads(data)
    setLoading(false)
  }

  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status']) => {
    const result = await updateLeadStatus(leadId, newStatus)
    if (result.success) {
      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    }
  }

  const handleConvertToClient = async (lead: Lead) => {
    setConverting(true)
    const result = await convertLeadToClient(lead.id)
    if (result.success) {
      setLeads(leads.map(l => l.id === lead.id ? { ...l, status: 'converted' } : l))
      setSelectedLead(null)
    }
    setConverting(false)
  }

  const handleDelete = async (leadId: string) => {
    const result = await deleteLead(leadId)
    if (result.success) {
      setLeads(leads.filter(l => l.id !== leadId))
    }
  }

  const newLeadsCount = leads.filter(l => l.status === 'new').length
  const contactedCount = leads.filter(l => l.status === 'contacted').length
  const convertedCount = leads.filter(l => l.status === 'converted').length

  if (loading) {
    return <div className="text-center text-muted-foreground py-8">Loading leads...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Leads Inbox</h1>
          <p className="text-muted-foreground text-sm mt-1">{leads.length} total leads</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">New Leads</p>
              <p className="font-serif text-3xl text-foreground mt-2">{newLeadsCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Contacted</p>
              <p className="font-serif text-3xl text-foreground mt-2">{contactedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs uppercase tracking-wider">Converted</p>
              <p className="font-serif text-3xl text-foreground mt-2">{convertedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <Card className="p-8 border-border text-center">
          <p className="text-muted-foreground">No leads yet. Check back soon!</p>
        </Card>
      ) : (
        <div className="bg-card border border-border rounded-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Name</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Contact</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium hidden md:table-cell">Service</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium hidden sm:table-cell">Budget</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <Dialog open={selectedLead?.id === lead.id} onOpenChange={(open) => !open && setSelectedLead(null)}>
                        <DialogTrigger asChild>
                          <button onClick={() => setSelectedLead(lead)} className="font-medium text-primary hover:underline cursor-pointer">
                            {lead.name}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>{lead.name}</DialogTitle>
                          </DialogHeader>
                          {selectedLead && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Email</p>
                                  <a href={`mailto:${lead.email}`} className="text-sm text-primary hover:underline">{lead.email}</a>
                                </div>
                              </div>
                              {lead.phone && (
                                <div className="flex items-center gap-3">
                                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                    <a href={`tel:${lead.phone}`} className="text-sm text-primary hover:underline">{lead.phone}</a>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-3">
                                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs text-muted-foreground mb-1">Project Description</p>
                                  <p className="text-sm text-foreground bg-secondary/50 p-3 rounded">{lead.description}</p>
                                </div>
                              </div>
                              {lead.budget && (
                                <div className="flex items-center gap-3">
                                  <DollarSign className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                    <p className="text-sm text-foreground font-medium">{lead.budget}</p>
                                  </div>
                                </div>
                              )}
                              {lead.preferred_date && (
                                <div className="flex items-center gap-3">
                                  <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Preferred Start Date</p>
                                    <p className="text-sm text-foreground">{new Date(lead.preferred_date).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              )}
                              <div className="border-t border-border pt-4 space-y-2">
                                <Button
                                  onClick={() => handleConvertToClient(lead)}
                                  disabled={converting}
                                  className="w-full"
                                >
                                  {converting ? 'Converting...' : 'Convert to Client'}
                                </Button>
                                {lead.status !== 'contacted' && (
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      handleStatusUpdate(lead.id, 'contacted')
                                      setSelectedLead(null)
                                    }}
                                    className="w-full"
                                  >
                                    Mark as Contacted
                                  </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogTitle>Delete Lead</AlertDialogTitle>
                                    <AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription>
                                    <div className="flex gap-3 justify-end">
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          handleDelete(lead.id)
                                          setSelectedLead(null)
                                        }}
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </div>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                    <td className="px-4 py-3">
                      <a href={`mailto:${lead.email}`} className="text-sm text-muted-foreground hover:text-primary">{lead.email}</a>
                    </td>
                    <td className="px-4 py-3 text-foreground hidden md:table-cell capitalize">{lead.service_type}</td>
                    <td className="px-4 py-3 text-foreground hidden sm:table-cell">{lead.budget || '—'}</td>
                    <td className="px-4 py-3">
                      <Badge className={statusConfig[lead.status].badge}>{statusConfig[lead.status].label}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
