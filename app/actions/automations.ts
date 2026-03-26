'use server'

import { createClient } from '@/lib/supabase/server'
import { sendInvoiceEmail, sendPaymentConfirmationEmail, sendProjectUpdateEmail, sendPendingInvoiceReminder } from './email'
import { logAudit } from './audit'

/**
 * Trigger email when invoice is created
 */
export async function triggerInvoiceSentNotification(invoiceId: string, clientEmail: string, invoiceNumber: string) {
  try {
    const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoiceId}`
    await sendInvoiceEmail(clientEmail, invoiceNumber, invoiceLink)

    await logAudit({
      action: 'invoice_sent_notification',
      resource_type: 'invoice',
      resource_id: invoiceId,
      status: 'success',
      details: { clientEmail, invoiceNumber },
    })
  } catch (error) {
    console.error('[Automation] Failed to send invoice notification:', error)
    await logAudit({
      action: 'invoice_sent_notification',
      resource_type: 'invoice',
      resource_id: invoiceId,
      status: 'error',
      details: { clientEmail, invoiceNumber },
      error_message: error instanceof Error ? error.message : String(error),
    })
  }
}

/**
 * Trigger email when payment is received
 */
export async function triggerPaymentConfirmationNotification(invoiceId: string, clientEmail: string, amount: number, invoiceNumber: string) {
  try {
    await sendPaymentConfirmationEmail(clientEmail, amount, invoiceNumber)

    // Also create a notification in the database
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Paiement reçu',
        message: `Paiement de $${amount} reçu pour la facture ${invoiceNumber}`,
        type: 'success',
      })
    }

    await logAudit({
      action: 'payment_confirmation_sent',
      resource_type: 'payment',
      resource_id: invoiceId,
      status: 'success',
      details: { clientEmail, amount, invoiceNumber },
    })
  } catch (error) {
    console.error('[Automation] Failed to send payment confirmation:', error)
  }
}

/**
 * Trigger project update notification
 */
export async function triggerProjectUpdateNotification(projectId: string, clientEmail: string, projectName: string, updateMessage: string) {
  try {
    await sendProjectUpdateEmail(clientEmail, projectName, updateMessage)

    await logAudit({
      action: 'project_update_notification',
      resource_type: 'project',
      resource_id: projectId,
      status: 'success',
      details: { clientEmail, projectName, updateMessage },
    })
  } catch (error) {
    console.error('[Automation] Failed to send project update notification:', error)
  }
}

/**
 * Send pending invoice reminders (call daily via cron job)
 */
export async function sendPendingInvoiceReminders() {
  try {
    const supabase = await createClient()

    // Get all pending invoices grouped by client
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select(
        `
        id,
        invoice_number,
        total,
        due_date,
        clients:client_id (
          id,
          profile_id,
          profiles:profile_id (email)
        )
      `
      )
      .eq('status', 'sent')

    if (error) throw error

    // Group by client and send reminders
    const clientInvoices: { [key: string]: any[] } = {}
    invoices?.forEach((inv: any) => {
      const clientId = inv.clients?.id
      const email = inv.clients?.profiles?.email

      if (email) {
        if (!clientInvoices[email]) {
          clientInvoices[email] = []
        }
        clientInvoices[email].push({
          number: inv.invoice_number,
          dueDate: inv.due_date,
          amount: inv.total,
        })
      }
    })

    // Send reminders
    for (const [email, invoices] of Object.entries(clientInvoices)) {
      if (invoices.length > 0) {
        await sendPendingInvoiceReminder(email, invoices)
      }
    }

    await logAudit({
      action: 'pending_reminders_sent',
      resource_type: 'automation',
      status: 'success',
      details: { clientCount: Object.keys(clientInvoices).length },
    })

    return { success: true, clientsNotified: Object.keys(clientInvoices).length }
  } catch (error) {
    console.error('[Automation] Failed to send pending reminders:', error)
    await logAudit({
      action: 'pending_reminders_sent',
      resource_type: 'automation',
      status: 'error',
      error_message: error instanceof Error ? error.message : String(error),
      details: {},
    })
    throw error
  }
}

/**
 * Check for overdue projects and send alerts to admin
 */
export async function checkOverdueProjects() {
  try {
    const supabase = await createClient()

    const today = new Date().toISOString().split('T')[0]

    const { data: overdueProjects, error } = await supabase
      .from('projects')
      .select('id, name, end_date')
      .lt('end_date', today)
      .in('status', ['planning', 'in_progress'])

    if (error) throw error

    if (overdueProjects && overdueProjects.length > 0) {
      // Create notifications for admins
      const { data: admins } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')

      for (const admin of admins || []) {
        for (const project of overdueProjects) {
          await supabase.from('notifications').insert({
            user_id: admin.id,
            title: 'Projet en retard',
            message: `Le projet "${project.name}" a dépassé sa date d'échéance (${project.end_date})`,
            type: 'warning',
          })
        }
      }
    }

    await logAudit({
      action: 'overdue_check',
      resource_type: 'automation',
      status: 'success',
      details: { overdueProjectCount: overdueProjects?.length || 0 },
    })

    return { success: true, overdueCount: overdueProjects?.length || 0 }
  } catch (error) {
    console.error('[Automation] Failed to check overdue projects:', error)
    throw error
  }
}
