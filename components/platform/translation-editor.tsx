"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  Search, 
  Save, 
  Filter,
  ChevronDown,
  Check,
  AlertCircle,
  Globe,
  Languages
} from "lucide-react"
import { cn } from "@/lib/utils"

// Import translations
import en from "@/lib/translations/en.json"
import fr from "@/lib/translations/fr.json"
import es from "@/lib/translations/es.json"

type Language = 'en' | 'fr' | 'es'

interface TranslationEntry {
  key: string
  category: string
  en: string
  fr: string
  es: string
  modified?: boolean
}

const categories = [
  { id: 'all', label: 'All Translations' },
  { id: 'nav', label: 'Navigation' },
  { id: 'hero', label: 'Hero Sections' },
  { id: 'services', label: 'Services' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
  { id: 'common', label: 'Common' },
]

// Flatten nested translation object into key-value pairs
function flattenTranslations(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(result, flattenTranslations(obj[key], fullKey))
    } else {
      result[fullKey] = obj[key]
    }
  }
  
  return result
}

// Get category from translation key
function getCategory(key: string): string {
  const parts = key.split('.')
  if (parts[0] === 'nav') return 'nav'
  if (parts[0] === 'hero') return 'hero'
  if (parts[0] === 'services') return 'services'
  if (parts[0] === 'about') return 'about'
  if (parts[0] === 'contact') return 'contact'
  if (parts[0] === 'footer') return 'footer'
  return 'common'
}

export function TranslationEditor() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editedValues, setEditedValues] = useState<Record<string, Record<Language, string>>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Build translation entries from JSON files
  const translations = useMemo(() => {
    const enFlat = flattenTranslations(en)
    const frFlat = flattenTranslations(fr)
    const esFlat = flattenTranslations(es)
    
    const allKeys = new Set([
      ...Object.keys(enFlat),
      ...Object.keys(frFlat),
      ...Object.keys(esFlat)
    ])
    
    const entries: TranslationEntry[] = []
    
    allKeys.forEach(key => {
      entries.push({
        key,
        category: getCategory(key),
        en: enFlat[key] || '',
        fr: frFlat[key] || '',
        es: esFlat[key] || '',
        modified: !!editedValues[key]
      })
    })
    
    return entries.sort((a, b) => a.key.localeCompare(b.key))
  }, [editedValues])

  // Filter translations
  const filteredTranslations = useMemo(() => {
    return translations.filter(t => {
      const matchesSearch = searchQuery === '' || 
        t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.es.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [translations, searchQuery, selectedCategory])

  const handleEdit = (key: string, lang: Language, value: string) => {
    setEditedValues(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        en: prev[key]?.en ?? translations.find(t => t.key === key)?.en ?? '',
        fr: prev[key]?.fr ?? translations.find(t => t.key === key)?.fr ?? '',
        es: prev[key]?.es ?? translations.find(t => t.key === key)?.es ?? '',
        [lang]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    // In a real implementation, this would save to the database
    // For now, we'll simulate a save
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const hasChanges = Object.keys(editedValues).length > 0

  const selectedCategoryLabel = categories.find(c => c.id === selectedCategory)?.label || 'All Translations'

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Translation Manager</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Edit all website text in English, French, and Spanish side by side.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-sm text-yellow-600">
              {Object.keys(editedValues).length} unsaved change(s)
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-colors",
              hasChanges 
                ? "bg-yellow-600 hover:bg-yellow-500 text-black" 
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            )}
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/50"
          />
        </div>

        {/* Category filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-sm text-sm transition-colors min-w-[180px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span>{selectedCategoryLabel}</span>
            </div>
            <ChevronDown className={cn("w-4 h-4 transition-transform", showCategoryDropdown && "rotate-180")} />
          </button>
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-sm shadow-lg z-50 py-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setShowCategoryDropdown(false) }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors",
                    selectedCategory === cat.id && "bg-primary/10 text-primary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Language Headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-secondary rounded-t-sm border border-border border-b-0 sticky top-0 z-10">
        <div className="text-sm font-medium text-muted-foreground">Key</div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="w-6 h-4 bg-blue-600 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">EN</span>
          English
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="w-6 h-4 bg-blue-800 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">FR</span>
          French
        </div>
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="w-6 h-4 bg-red-600 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">ES</span>
          Spanish
        </div>
      </div>

      {/* Translation List */}
      <div className="border border-border rounded-b-sm overflow-hidden -mt-6">
        {filteredTranslations.length === 0 ? (
          <div className="p-8 text-center">
            <Languages className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No translations found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[60vh] overflow-y-auto">
            {filteredTranslations.map(translation => {
              const currentEn = editedValues[translation.key]?.en ?? translation.en
              const currentFr = editedValues[translation.key]?.fr ?? translation.fr
              const currentEs = editedValues[translation.key]?.es ?? translation.es
              const isModified = !!editedValues[translation.key]
              
              return (
                <div 
                  key={translation.key}
                  className={cn(
                    "grid grid-cols-[1fr_1fr_1fr_1fr] gap-4 p-4 hover:bg-secondary/50 transition-colors",
                    isModified && "bg-yellow-600/5"
                  )}
                >
                  {/* Key */}
                  <div className="flex flex-col gap-1">
                    <code className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-sm break-all">
                      {translation.key}
                    </code>
                    {isModified && (
                      <span className="text-[10px] text-yellow-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Modified
                      </span>
                    )}
                  </div>

                  {/* English */}
                  <div>
                    <textarea
                      value={currentEn}
                      onChange={(e) => handleEdit(translation.key, 'en', e.target.value)}
                      className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600/50 min-h-[60px]"
                      rows={2}
                    />
                  </div>

                  {/* French */}
                  <div>
                    <textarea
                      value={currentFr}
                      onChange={(e) => handleEdit(translation.key, 'fr', e.target.value)}
                      className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600/50 min-h-[60px]"
                      rows={2}
                    />
                  </div>

                  {/* Spanish */}
                  <div>
                    <textarea
                      value={currentEs}
                      onChange={(e) => handleEdit(translation.key, 'es', e.target.value)}
                      className="w-full bg-background border border-border rounded-sm p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600/50 min-h-[60px]"
                      rows={2}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {filteredTranslations.length} of {translations.length} translations
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Globe className="w-4 h-4" />
            3 languages
          </span>
        </div>
      </div>
    </div>
  )
}
