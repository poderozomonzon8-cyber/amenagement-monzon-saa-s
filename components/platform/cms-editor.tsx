"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CMSHeroManager } from "./cms-hero-manager"
import { CMSPortfolioManager } from "./cms-portfolio-manager"
import { CMSAboutManager } from "./cms-about-manager"
import { CMSReviewsManager } from "./cms-reviews-manager"
import { Layout, Image, User, Star } from "lucide-react"

export function CMSEditor() {
  const [activeTab, setActiveTab] = useState("heroes")

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Website CMS</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all content on your public website. Changes are reflected instantly.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="heroes"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            )}
          >
            <Layout className="h-4 w-4" />
            Hero Sections
          </TabsTrigger>
          <TabsTrigger 
            value="portfolio"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            )}
          >
            <Image className="h-4 w-4" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger 
            value="about"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            )}
          >
            <User className="h-4 w-4" />
            About / Founder
          </TabsTrigger>
          <TabsTrigger 
            value="reviews"
            className={cn(
              "flex items-center gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary",
              "data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            )}
          >
            <Star className="h-4 w-4" />
            Reviews
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="heroes" className="mt-0">
            <CMSHeroManager />
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
        </div>
      </Tabs>
    </div>
  )
}
