"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Save, 
  Trash2, 
  Edit3, 
  ChevronDown,
  ChevronUp,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileText,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  Clock,
  Info,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentSection {
  id: string
  name: string
  type: 'text' | 'rich_text' | 'image' | 'link' | 'contact_info' | 'hours' | 'list'
  page: string
  content: Record<string, any>
  visible: boolean
  order: number
}

const sectionTypes = [
  { id: 'text', label: 'Simple Text', icon: Type, description: 'Single text field' },
  { id: 'rich_text', label: 'Rich Text', icon: FileText, description: 'Formatted paragraph' },
  { id: 'image', label: 'Image', icon: ImageIcon, description: 'Image with caption' },
  { id: 'link', label: 'Button/Link', icon: LinkIcon, description: 'CTA button or link' },
  { id: 'contact_info', label: 'Contact Info', icon: Phone, description: 'Phone, email, address' },
  { id: 'hours', label: 'Business Hours', icon: Clock, description: 'Operating hours' },
  { id: 'list', label: 'List', icon: Info, description: 'Bullet point list' },
]

const pages = [
  { id: 'global', label: 'Global (All Pages)' },
  { id: 'home', label: 'Home Page' },
  { id: 'construction', label: 'Construction Page' },
  { id: 'hardscape', label: 'Hardscape Page' },
  { id: 'maintenance', label: 'Maintenance Page' },
  { id: 'about', label: 'About Page' },
  { id: 'contact', label: 'Contact Page' },
  { id: 'footer', label: 'Footer' },
]

// Default sections
const defaultSections: ContentSection[] = [
  {
    id: '1',
    name: 'Company Phone',
    type: 'contact_info',
    page: 'global',
    content: { 
      phone: '438 526 2877',
      email: 'contact@amenagementmonzon.com',
      address: 'Montreal, QC'
    },
    visible: true,
    order: 1
  },
  {
    id: '2',
    name: 'Business Hours',
    type: 'hours',
    page: 'global',
    content: {
      monday: '8:00 AM - 6:00 PM',
      tuesday: '8:00 AM - 6:00 PM',
      wednesday: '8:00 AM - 6:00 PM',
      thursday: '8:00 AM - 6:00 PM',
      friday: '8:00 AM - 6:00 PM',
      saturday: '9:00 AM - 4:00 PM',
      sunday: 'Closed'
    },
    visible: true,
    order: 2
  },
  {
    id: '3',
    name: 'Footer Tagline',
    type: 'text',
    page: 'footer',
    content: {
      en: 'Your trusted partner for property excellence since 2014.',
      fr: 'Votre partenaire de confiance pour l\'excellence immobilière depuis 2014.',
      es: 'Su socio de confianza para la excelencia inmobiliaria desde 2014.'
    },
    visible: true,
    order: 3
  },
  {
    id: '4',
    name: 'CTA Button',
    type: 'link',
    page: 'home',
    content: {
      text_en: 'Get a Free Quote',
      text_fr: 'Obtenez un devis gratuit',
      text_es: 'Obtenga una cotización gratis',
      url: '/marketing/contact',
      style: 'primary'
    },
    visible: true,
    order: 4
  }
]

export function ContentSectionsManager() {
  const [sections, setSections] = useState<ContentSection[]>(defaultSections)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPage, setSelectedPage] = useState('all')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const filteredSections = sections.filter(s => 
    selectedPage === 'all' || s.page === selectedPage
  ).sort((a, b) => a.order - b.order)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const toggleVisibility = (id: string) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ))
  }

  const deleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(prev => prev.filter(s => s.id !== id))
    }
  }

  const duplicateSection = (section: ContentSection) => {
    const newSection: ContentSection = {
      ...section,
      id: Date.now().toString(),
      name: `${section.name} (Copy)`,
      order: sections.length + 1
    }
    setSections(prev => [...prev, newSection])
  }

  const updateSectionContent = (id: string, content: Record<string, any>) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, content } : s
    ))
  }

  const getTypeIcon = (type: string) => {
    const sectionType = sectionTypes.find(t => t.id === type)
    return sectionType?.icon || FileText
  }

  const renderContentEditor = (section: ContentSection) => {
    switch (section.type) {
      case 'text':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">English</label>
              <textarea
                value={section.content.en || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, en: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">French</label>
              <textarea
                value={section.content.fr || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, fr: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Spanish</label>
              <textarea
                value={section.content.es || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, es: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none"
                rows={3}
              />
            </div>
          </div>
        )

      case 'contact_info':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone
              </label>
              <input
                type="text"
                value={section.content.phone || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, phone: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Mail className="w-3 h-3" /> Email
              </label>
              <input
                type="email"
                value={section.content.email || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, email: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Address
              </label>
              <input
                type="text"
                value={section.content.address || ''}
                onChange={(e) => updateSectionContent(section.id, { ...section.content, address: e.target.value })}
                className="w-full bg-background border border-border rounded-sm p-2 text-sm"
              />
            </div>
          </div>
        )

      case 'link':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Button Text (EN)</label>
                <input
                  type="text"
                  value={section.content.text_en || ''}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, text_en: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Button Text (FR)</label>
                <input
                  type="text"
                  value={section.content.text_fr || ''}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, text_fr: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Button Text (ES)</label>
                <input
                  type="text"
                  value={section.content.text_es || ''}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, text_es: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">URL</label>
                <input
                  type="text"
                  value={section.content.url || ''}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, url: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                  placeholder="/marketing/contact"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Style</label>
                <select
                  value={section.content.style || 'primary'}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, style: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                >
                  <option value="primary">Primary (Yellow)</option>
                  <option value="secondary">Secondary (Gray)</option>
                  <option value="outline">Outline</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'hours':
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {days.map(day => (
              <div key={day}>
                <label className="block text-xs text-muted-foreground mb-1 capitalize">{day}</label>
                <input
                  type="text"
                  value={section.content[day] || ''}
                  onChange={(e) => updateSectionContent(section.id, { ...section.content, [day]: e.target.value })}
                  className="w-full bg-background border border-border rounded-sm p-2 text-sm"
                  placeholder="9:00 AM - 5:00 PM"
                />
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="text-sm text-muted-foreground">
            Content editor for this type is coming soon.
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Content Sections</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage editable content blocks across your website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-sm text-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded-sm text-sm transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Page Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedPage('all')}
          className={cn(
            "px-3 py-1.5 rounded-sm text-sm transition-colors",
            selectedPage === 'all' 
              ? "bg-yellow-600 text-black" 
              : "bg-secondary hover:bg-secondary/80 text-foreground"
          )}
        >
          All Pages
        </button>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setSelectedPage(page.id)}
            className={cn(
              "px-3 py-1.5 rounded-sm text-sm transition-colors",
              selectedPage === page.id 
                ? "bg-yellow-600 text-black" 
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            )}
          >
            {page.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {filteredSections.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-sm">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No content sections found.</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 text-yellow-600 hover:text-yellow-500 text-sm"
            >
              Add your first section
            </button>
          </div>
        ) : (
          filteredSections.map(section => {
            const TypeIcon = getTypeIcon(section.type)
            const isExpanded = expandedSection === section.id
            
            return (
              <div 
                key={section.id}
                className={cn(
                  "border border-border rounded-sm overflow-hidden transition-colors",
                  !section.visible && "opacity-60"
                )}
              >
                {/* Section Header */}
                <div 
                  className="flex items-center justify-between p-4 bg-card cursor-pointer hover:bg-secondary/30"
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="w-8 h-8 bg-yellow-600/10 rounded-sm flex items-center justify-center">
                      <TypeIcon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{section.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {pages.find(p => p.id === section.page)?.label || section.page}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id) }}
                      className="p-2 hover:bg-secondary rounded-sm transition-colors"
                      title={section.visible ? 'Hide section' : 'Show section'}
                    >
                      {section.visible ? (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); duplicateSection(section) }}
                      className="p-2 hover:bg-secondary rounded-sm transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }}
                      className="p-2 hover:bg-red-500/10 rounded-sm transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Section Content Editor */}
                {isExpanded && (
                  <div className="p-4 border-t border-border bg-secondary/30">
                    {renderContentEditor(section)}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Add Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-sm max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Add Content Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-secondary rounded-sm transition-colors"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {sectionTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => {
                    const newSection: ContentSection = {
                      id: Date.now().toString(),
                      name: `New ${type.label}`,
                      type: type.id as ContentSection['type'],
                      page: 'global',
                      content: {},
                      visible: true,
                      order: sections.length + 1
                    }
                    setSections(prev => [...prev, newSection])
                    setShowAddModal(false)
                    setExpandedSection(newSection.id)
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 rounded-sm transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-yellow-600/10 rounded-sm flex items-center justify-center">
                    <type.icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{type.label}</h4>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
