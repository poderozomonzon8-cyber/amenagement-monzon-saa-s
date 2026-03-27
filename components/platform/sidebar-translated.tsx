'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { UserProfile } from "./auth-ui"
import { useTranslation } from "@/lib/use-translation"
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
  BarChart3,
  ExternalLink,
  Inbox,
} from "lucide-react"

interface SidebarProps {
  activeSection: string
  setActiveSection: (id: string) => void
  userRole?: string
}

export function SidebarTranslated({ activeSection, setActiveSection, userRole = "admin" }: SidebarProps) {
  const t = useTranslation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navSections = [
    {
      label: t('dashboard.administration'),
      items: [
        { icon: LayoutDashboard, label: t('dashboard.dashboard'), href: "#dashboard", id: "dashboard" },
        { icon: Inbox, label: t('dashboard.leads'), href: "#leads", id: "leads" },
        { icon: FolderKanban, label: t('dashboard.projects'), href: "#projects", id: "projects" },
        { icon: FileText, label: t('dashboard.billing'), href: "#billing", id: "billing" },
        { icon: Users, label: t('dashboard.employees'), href: "#admin-employees", id: "admin-employees" },
        { icon: UserCog, label: t('dashboard.users'), href: "#users", id: "users" },
        { icon: BarChart3, label: t('dashboard.reports'), href: "#reporting", id: "reporting" },
      ],
    },
    {
      label: t('dashboard.settings'),
      items: [
        { icon: Settings, label: t('dashboard.invoice_design'), href: "#invoice-design", id: "invoice-design" },
        { icon: Globe, label: t('dashboard.cms_editor'), href: "#cms", id: "cms" },
      ],
    },
    {
      label: t('dashboard.portals'),
      items: [
        { icon: Briefcase, label: t('dashboard.client_portal'), href: "#client", id: "client" },
        { icon: HardHat, label: t('dashboard.employee_app'), href: "#employee", id: "employee" },
      ],
    },
  ]

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
      <div className={cn("flex items-center border-b border-border h-16 px-4 shrink-0", collapsed ? "justify-center" : "gap-2")}>
        {!collapsed && (
          <div>
            <h2 className="text-lg font-bold">Monzon</h2>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {visibleSections.map((section, idx) => (
          <div key={idx} className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id)
                    setMobileOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors",
                    activeSection === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile / Logout */}
      <div className="border-t border-border p-4">
        <UserProfile />
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 h-screen sticky top-0",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />

        {/* Collapse Button */}
        <div className="border-t border-sidebar-border p-3 flex justify-end">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden bg-sidebar border-b border-sidebar-border px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h2 className="font-bold">Monzon</h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-sidebar-accent rounded-lg"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-14 z-40 bg-sidebar border-b border-sidebar-border overflow-y-auto">
          <div className="p-4">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  )
}
