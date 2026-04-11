"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CMSHeroManager } from "./cms-hero-manager"
import { CMSPortfolioManager } from "./cms-portfolio-manager"
import { CMSAboutManager } from "./cms-about-manager"
import { CMSReviewsManager } from "./cms-reviews-manager"
import { CMSSocialManager } from "./cms-social-manager"
import { VisualLiveEditor } from "./visual-live-editor"
import { TranslationEditor } from "./translation-editor"
import { ContentSectionsManager } from "./content-sections-manager"
import { 
  Layout, 
  Image, 
  User, 
  Star, 
  Share2, 
  Eye, 
  Languages, 
  FileText,
  Palette,
  Globe
} from "lucide-react"

export function CMSEditor() {
  const [activeTab, setActiveTab] = useState("visual")
  const [activeContentTab, setActiveContentTab] = useState("heroes")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-foreground">Website Editor</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Edit your website visually, manage content, and translate text in all languages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="/" 
            target="_blank" 
            className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-sm text-sm transition-colors"
          >
            <Globe className="w-4 h-4" />
            View Live Site
          </a>
        </div>
      </div>

      {/* Main Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
          <TabsTrigger 
            value="visual"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-600",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 whitespace-nowrap"
            )}
          >
            <Eye className="h-4 w-4" />
            Visual Editor
          </TabsTrigger>
          <TabsTrigger 
            value="content"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-600",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 whitespace-nowrap"
            )}
          >
            <FileText className="h-4 w-4" />
            Content Manager
          </TabsTrigger>
          <TabsTrigger 
            value="translations"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-yellow-600",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3 whitespace-nowrap"
            )}
          >
            <Languages className="h-4 w-4" />
            Translations
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          {/* Visual Live Editor */}
          <TabsContent value="visual" className="mt-0">
            <VisualLiveEditor />
          </TabsContent>

          {/* Content Manager */}
          <TabsContent value="content" className="mt-0">
            <Tabs value={activeContentTab} onValueChange={setActiveContentTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent flex-wrap">
                <TabsTrigger 
                  value="heroes"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <Layout className="h-4 w-4" />
                  Heroes
                </TabsTrigger>
                <TabsTrigger 
                  value="sections"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <Palette className="h-4 w-4" />
                  Sections
                </TabsTrigger>
                <TabsTrigger 
                  value="portfolio"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <Image className="h-4 w-4" />
                  Portfolio
                </TabsTrigger>
                <TabsTrigger 
                  value="about"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <User className="h-4 w-4" />
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <Star className="h-4 w-4" />
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="social"
                  className={cn(
                    "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
                    "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 py-2 text-sm"
                  )}
                >
                  <Share2 className="h-4 w-4" />
                  Social
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="heroes" className="mt-0">
                  <CMSHeroManager />
                </TabsContent>
                <TabsContent value="sections" className="mt-0">
                  <ContentSectionsManager />
                </TabsContent>
                <TabsContent value="portfolio" className="mt-0">
                  <CMSPortfolioManager />
                </TabsContent>
                <TabsContent value="about" className="mt-0">
                  <CMSAboutManager />
                </TabsContent>
                <TabsContent value="reviews" className="mt-0">
                  <CMSReviewsManager />
                </TabsContent>
                <TabsContent value="social" className="mt-0">
                  <CMSSocialManager />
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>

          {/* Translation Editor */}
          <TabsContent value="translations" className="mt-0">
            <TranslationEditor />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
