'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Send email via a simple service
 * For production, use Resend, SendGrid, or AWS SES
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  emailType: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Log email attempt
    const supabase = await createClient()
    const { error: logError } = await supabase.from('email_logs').insert({
      recipient_email: to,
      subject,
      email_type: emailType,
      status: 'pending',
    })

    if (logError) {
      console.error('[Email] Failed to log email:', logError)
    }

    // In development, just log it
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Email] Would send to ${to}: ${subject}`)
      return { success: true }
    }

    // For production, integrate with Resend/SendGrid here
    // This is a placeholder
    console.log(`[Email] Sending to ${to}: ${subject}`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[Email] Error sending email:', message)
    return { success: false, error: message }
  }
}

/**
 * Send invoice email to client
 */
export async function sendInvoiceEmail(clientEmail: string, invoiceNumber: string, invoiceLink: string) {
  const html = `
    <h2>Votre facture est prête</h2>
    <p>Nous avons généré une nouvelle facture pour vous.</p>
    <p><strong>Numéro de facture:</strong> ${invoiceNumber}</p>
    <p><a href="${invoiceLink}">Voir la facture</a></p>
  `

  return sendEmail(clientEmail, `Facture ${invoiceNumber}`, html, 'invoice_sent')
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(clientEmail: string, amount: number, invoiceNumber: string) {
  const html = `
    <h2>Paiement reçu</h2>
    <p>Merci pour votre paiement!</p>
    <p><strong>Montant:</strong> $${amount}</p>
    <p><strong>Facture:</strong> ${invoiceNumber}</p>
  `

  return sendEmail(clientEmail, 'Confirmation de paiement', html, 'payment_received')
}

/**
 * Send project update email to client
 */
export async function sendProjectUpdateEmail(clientEmail: string, projectName: string, updateMessage: string) {
  const html = `
    <h2>Mise à jour du projet</h2>
    <p><strong>Projet:</strong> ${projectName}</p>
    <p>${updateMessage}</p>
  `

  return sendEmail(clientEmail, `Mise à jour: ${projectName}`, html, 'project_update')
}

/**
 * Send invitation email to new user
 */
export async function sendInvitationEmail(email: string, inviteName: string, inviteLink: string) {
  const html = `
    <h2>Invitation à rejoindre Aménagement Monzon</h2>
    <p>Bonjour,</p>
    <p>Vous avez été invité(e) à rejoindre Aménagement Monzon par ${inviteName}.</p>
    <p><a href="${inviteLink}">Accepter l'invitation et créer votre compte</a></p>
    <p>Le lien expire dans 7 jours.</p>
  `

  return sendEmail(email, 'Invitation - Aménagement Monzon', html, 'invitation_sent')
}

/**
 * Send reminder email for pending invoices
 */
export async function sendPendingInvoiceReminder(clientEmail: string, invoices: Array<{ number: string; dueDate: string; amount: number }>) {
  const invoiceList = invoices.map(inv => `<li>${inv.number} - $${inv.amount} (Échéance: ${inv.dueDate})</li>`).join('')

  const html = `
    <h2>Rappel de paiement</h2>
    <p>Vous avez les factures suivantes en attente de paiement:</p>
    <ul>${invoiceList}</ul>
    <p>Veuillez régulariser au plus tôt.</p>
  `

  return sendEmail(clientEmail, 'Rappel: Factures en attente', html, 'pending_invoice_reminder')
}
