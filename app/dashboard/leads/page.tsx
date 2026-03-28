'use server'

import { getLeads, updateLeadStatus, convertLeadToClient, deleteLead } from '@/app/actions/leads'
import LeadsClientComponent from '@/components/platform/leads-manager'

export default async function LeadsPage() {
  const leads = await getLeads()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Leads Management</h1>
        <p className="text-gray-400 mt-2">Manage and track all incoming leads from contact forms</p>
      </div>

      <LeadsClientComponent initialLeads={leads} />
    </div>
  )
}
