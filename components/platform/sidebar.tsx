"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { UserProfile } from "./auth-ui"
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Users,
  HardHat,
  Settings,
  ChevronLeft,
  ChevronRight,
  Globe,
  LogOut,
  Menu,
  X,
  UserCog,
  Briefcase,
} from "lucide-react"

const navSections = [
  {
    label: "Administration",
    items: [
      { icon: LayoutDashboard, label: "Tableau de bord", href: "#dashboard", id: "dashboard" },
      { icon: FolderKanban, label: "Projets", href: "#projects", id: "projects" },
      { icon: FileText, label: "Facturation", href: "#billing", id: "billing" },
      { icon: Users, label: "Employés", href: "#admin-employees", id: "admin-employees" },
      { icon: UserCog, label: "Utilisateurs", href: "#users", id: "users" },
    ],
  },
  {
    label: "Paramètres",
    items: [
      { icon: Settings, label: "Design Factures", href: "#invoice-design", id: "invoice-design" },
      { icon: Globe, label: "Éditeur CMS", href: "#cms", id: "cms" },
    ],
  },
  {
    label: "Portails",
    items: [
      { icon: Briefcase, label: "Portail Client", href: "#client", id: "client" },
      { icon: HardHat, label: "App Employés", href: "#employee", id: "employee" },
    ],
  },
]

interface SidebarProps {
  activeSection: string
  setActiveSection: (id: string) => void
  userRole?: string
}

export function Sidebar({ activeSection, setActiveSection, userRole = "admin" }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Filter sections based on user role
  const visibleSections = navSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (userRole === 'employee') return ['projects', 'employee'].includes(item.id)
      if (userRole === 'client') return ['client'].includes(item.id)
      return true
    })
  })).filter(section => section.items.length > 0)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center border-b border-border h-16 px-4 shrink-0", collapsed ? "justify-center" : "gap-3")}>
        <div className="w-8 h-8 bg-primary shrink-0 flex items-center justify-center">
          <span className="text-primary-foreground font-serif font-bold text-sm">M</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-serif text-foreground font-semibold text-sm leading-tight">Aménagement</p>
            <p className="text-primary text-xs tracking-widest uppercase">Monzon</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {visibleSections.map((section) => (
          <div key={section.label} className="mb-6">
            {!collapsed && (
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest px-3 mb-2">{section.label}</p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); setMobileOpen(false) }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-colors w-full text-left",
                    activeSection === item.id
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      {!collapsed && <UserProfile />}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border items-center justify-center text-muted-foreground hover:text-primary transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-card border border-border rounded-sm flex items-center justify-center text-muted-foreground hover:text-primary"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-sidebar border-r border-border h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col relative bg-sidebar border-r border-border h-full transition-all duration-300 shrink-0",
          collapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
