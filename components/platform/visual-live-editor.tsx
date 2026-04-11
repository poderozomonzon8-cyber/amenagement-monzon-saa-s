"use client"

import { useState, useRef, useEffect } from "react"
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  RefreshCw, 
  MousePointer2,
  Edit3,
  Save,
  X,
  ExternalLink,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Palette
} from "lucide-react"
import { cn } from "@/lib/utils"

type DeviceMode = 'desktop' | 'tablet' | 'mobile'
type EditMode = 'browse' | 'edit'

interface EditableElement {
  id: string
  type: 'text' | 'image' | 'color'
  selector: string
  originalValue: string
  newValue: string
}

const pages = [
  { label: 'Home', path: '/' },
  { label: 'Construction', path: '/marketing/construction' },
  { label: 'Hardscape', path: '/marketing/hardscape' },
  { label: 'Maintenance', path: '/marketing/maintenance' },
  { label: 'Portfolio', path: '/marketing/portfolio' },
  { label: 'About', path: '/marketing/about' },
  { label: 'Contact', path: '/marketing/contact' },
]

export function VisualLiveEditor() {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop')
  const [editMode, setEditMode] = useState<EditMode>('browse')
  const [currentPage, setCurrentPage] = useState('/')
  const [isLoading, setIsLoading] = useState(true)
  const [showPageDropdown, setShowPageDropdown] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<EditableElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string>('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px'
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPageDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleIframeLoad = () => {
    setIsLoading(false)
    
    // Inject edit mode styles and listeners into iframe
    if (editMode === 'edit' && iframeRef.current?.contentWindow) {
      try {
        const doc = iframeRef.current.contentDocument
        if (doc) {
          // Add editable highlight styles
          const style = doc.createElement('style')
          style.id = 'visual-editor-styles'
          style.textContent = `
            [data-editable]:hover {
              outline: 2px dashed #ca8a04 !important;
              outline-offset: 2px;
              cursor: pointer;
            }
            [data-editable].editing {
              outline: 2px solid #ca8a04 !important;
              outline-offset: 2px;
            }
            .visual-editor-tooltip {
              position: absolute;
              background: #ca8a04;
              color: black;
              padding: 4px 8px;
              font-size: 11px;
              border-radius: 4px;
              z-index: 10000;
              pointer-events: none;
            }
          `
          doc.head.appendChild(style)
        }
      } catch (e) {
        console.error('Cannot inject styles into iframe:', e)
      }
    }
  }

  const refreshPreview = () => {
    setIsLoading(true)
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const toggleEditMode = () => {
    setEditMode(editMode === 'browse' ? 'edit' : 'browse')
    setSelectedElement(null)
  }

  const handlePageChange = (path: string) => {
    setCurrentPage(path)
    setShowPageDropdown(false)
    setIsLoading(true)
  }

  const currentPageLabel = pages.find(p => p.path === currentPage)?.label || 'Home'

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-card border border-border rounded-sm">
        {/* Left: Page selector */}
        <div className="flex items-center gap-4">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowPageDropdown(!showPageDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-sm text-sm transition-colors min-w-[160px] justify-between"
            >
              <span>{currentPageLabel}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showPageDropdown && "rotate-180")} />
            </button>
            {showPageDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-sm shadow-lg z-50 py-1">
                {pages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => handlePageChange(page.path)}
                    className={cn(
                      "w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors",
                      currentPage === page.path && "bg-primary/10 text-primary"
                    )}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href={currentPage}
            target="_blank"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>

        {/* Center: Device modes */}
        <div className="flex items-center gap-1 bg-secondary rounded-sm p-1">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={cn(
              "p-2 rounded-sm transition-colors",
              deviceMode === 'desktop' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('tablet')}
            className={cn(
              "p-2 rounded-sm transition-colors",
              deviceMode === 'tablet' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={cn(
              "p-2 rounded-sm transition-colors",
              deviceMode === 'mobile' ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleEditMode}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-sm text-sm transition-colors",
              editMode === 'edit' 
                ? "bg-yellow-600 text-black hover:bg-yellow-500" 
                : "bg-secondary hover:bg-secondary/80 text-foreground"
            )}
          >
            {editMode === 'edit' ? (
              <>
                <MousePointer2 className="w-4 h-4" />
                Click to Edit
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                Enable Editing
              </>
            )}
          </button>
          <button
            onClick={refreshPreview}
            className="p-2 bg-secondary hover:bg-secondary/80 rounded-sm transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Edit Mode Instructions */}
      {editMode === 'edit' && (
        <div className="p-4 bg-yellow-600/10 border border-yellow-600/20 rounded-sm">
          <div className="flex items-start gap-3">
            <Edit3 className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Edit Mode Active</p>
              <p className="text-sm text-muted-foreground mt-1">
                Hover over text elements in the preview to highlight them. Click to edit directly. 
                For complex changes, use the Content Manager or Translations tabs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preview Frame */}
      <div className="relative bg-muted/30 border border-border rounded-sm overflow-hidden" style={{ minHeight: '70vh' }}>
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="w-8 h-8 text-yellow-600 animate-spin" />
              <p className="text-sm text-muted-foreground">Loading preview...</p>
            </div>
          </div>
        )}

        {/* Iframe container with responsive sizing */}
        <div 
          className="flex justify-center py-4 transition-all duration-300"
          style={{ 
            backgroundColor: deviceMode !== 'desktop' ? 'rgba(0,0,0,0.1)' : 'transparent'
          }}
        >
          <div 
            className={cn(
              "bg-background transition-all duration-300 overflow-hidden",
              deviceMode !== 'desktop' && "shadow-2xl rounded-lg border border-border"
            )}
            style={{ 
              width: deviceWidths[deviceMode],
              maxWidth: '100%'
            }}
          >
            <iframe
              ref={iframeRef}
              src={currentPage}
              className="w-full border-0"
              style={{ height: '70vh' }}
              onLoad={handleIframeLoad}
              title="Website Preview"
            />
          </div>
        </div>
      </div>

      {/* Quick Edit Panel */}
      {selectedElement && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border rounded-sm shadow-xl p-4 z-50 min-w-[400px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Edit Text</span>
            </div>
            <button
              onClick={() => setSelectedElement(null)}
              className="p-1 hover:bg-secondary rounded-sm transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            className="w-full bg-secondary border border-border rounded-sm p-3 text-sm resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setSelectedElement(null)}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Save change
                setSelectedElement(null)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black rounded-sm text-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Change
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Use the <span className="text-foreground">Content Manager</span> tab for structured editing or{' '}
          <span className="text-foreground">Translations</span> for multilingual text management.
        </p>
      </div>
    </div>
  )
}
