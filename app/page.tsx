"use client"

import { useState } from "react"
import { Sidebar } from "@/components/platform/sidebar"
import { AdminDashboard } from "@/components/platform/admin-dashboard"
import { ProjectManagement } from "@/components/platform/project-management"
import { BillingSystem } from "@/components/platform/billing-system"
import { ClientPortal } from "@/components/platform/client-portal"
import { EmployeeApp } from "@/components/platform/employee-app"
import { CMSEditor } from "@/components/platform/cms-editor"
import { Bell, Search } from "lucide-react"

const sectionLabels: Record<string, string> = {
  dashboard: "Tableau de bord",
  projects: "Gestion des projets",
  billing: "Facturation",
  client: "Portail client",
  employee: "App employés",
  cms: "Éditeur CMS",
}

export default function PlatformPage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <AdminDashboard />
      case "projects": return <ProjectManagement />
      case "billing": return <BillingSystem />
      case "client": return <ClientPortal />
      case "employee": return <EmployeeApp />
      case "cms": return <CMSEditor />
      default: return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            {/* spacer for mobile hamburger */}
            <div className="w-10 h-10 lg:hidden" />
            <h2 className="font-serif text-base text-foreground hidden sm:block">{sectionLabels[activeSection]}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="relative w-8 h-8 rounded-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center ml-1">
              <span className="text-primary text-xs font-semibold font-serif">AM</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
