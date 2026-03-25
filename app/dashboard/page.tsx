'use client'
// Force rebuild - invoice-design-editor uses getTemplates (not getInvoiceTemplates)
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from '@/components/platform/sidebar'
import { AdminDashboard } from '@/components/platform/admin-dashboard'
import { ProjectManagement } from '@/components/platform/project-management'
import { BillingSystem } from '@/components/platform/billing-system'
import { ClientPortal } from '@/components/platform/client-portal'
import { EmployeeApp } from '@/components/platform/employee-app'
import { CMSEditor } from '@/components/platform/cms-editor'
import { AdminEmployees } from '@/components/platform/admin-employees'
import { InvoiceDesignEditor } from '@/components/platform/invoice-design-editor'
import { UserManagement } from '@/components/platform/user-management'
import { Reporting } from '@/components/platform/reporting'

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
        return
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const userRole = user.user_metadata?.role || 'employee'

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />
      case 'projects':
        return <ProjectManagement />
      case 'billing':
        return <BillingSystem onOpenDesignEditor={() => setActiveSection('invoice-design')} />
      case 'admin-employees':
        return <AdminEmployees />
      case 'users':
        return <UserManagement />
      case 'client':
        return <ClientPortal />
      case 'employee':
        return <EmployeeApp />
      case 'cms':
        return <CMSEditor />
      case 'invoice-design':
        return <InvoiceDesignEditor />
      case 'reporting':
        return <Reporting />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} userRole={userRole} />
      <main className="flex-1 overflow-auto bg-background p-6">
        {renderSection()}
      </main>
    </div>
  )
}
