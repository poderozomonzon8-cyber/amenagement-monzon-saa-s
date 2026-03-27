'use server'

import { createClient } from '@/lib/supabase/server'
import { createProject } from './projects'
import { createNotification } from './notifications'

export interface EmployeeAvailability {
  id: string
  employee_id: string
  day_of_week: number // 0-6, Monday-Sunday
  start_time: string
  end_time: string
}

export interface Booking {
  id: string
  client_id: string
  employee_id?: string
  service_type: 'construction' | 'hardscape' | 'maintenance'
  date_time: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  project_id?: string
  notes?: string
  created_at: string
}

export async function getEmployeeAvailability(employeeId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('employee_availability')
    .select('*')
    .eq('employee_id', employeeId)
    .order('day_of_week', { ascending: true })

  if (error) throw new Error(error.message)
  return data || []
}

export async function setEmployeeAvailability(employeeId: string, availability: Omit<EmployeeAvailability, 'id'>[]) {
  const supabase = await createClient()

  // Delete existing availability
  await supabase
    .from('employee_availability')
    .delete()
    .eq('employee_id', employeeId)

  // Insert new availability
  if (availability.length > 0) {
    const { error } = await supabase
      .from('employee_availability')
      .insert(availability)

    if (error) throw new Error(error.message)
  }

  return true
}

export async function getAvailableSlots(serviceType: string, date: string) {
  const supabase = await createClient()

  const targetDate = new Date(date)
  const dayOfWeek = (targetDate.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

  // Get all employees with availability for this day
  const { data: availability, error: avError } = await supabase
    .from('employee_availability')
    .select('*, employee:employees(name, id)')
    .eq('day_of_week', dayOfWeek)

  if (avError) throw new Error(avError.message)

  // Get existing bookings for this date
  const { data: bookings, error: bError } = await supabase
    .from('bookings')
    .select('*')
    .gte('date_time', `${date}T00:00:00`)
    .lt('date_time', `${date}T23:59:59`)
    .in('status', ['confirmed', 'in_progress'])

  if (bError) throw new Error(bError.message)

  // Calculate available time slots
  const slots: Array<{
    time: string
    employeeId?: string
    employeeName?: string
    available: boolean
  }> = []

  availability?.forEach(avail => {
    const [startHour, startMin] = avail.start_time.split(':').map(Number)
    const [endHour, endMin] = avail.end_time.split(':').map(Number)

    let currentHour = startHour
    let currentMin = startMin

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`
      const dateTimeStr = `${date}T${timeStr}`

      // Check if slot is booked
      const isBooked = bookings?.some((booking: any) => {
        const bookingStart = new Date(booking.date_time)
        const bookingEnd = new Date(
          bookingStart.getTime() + (booking.duration_minutes || 60) * 60000
        )
        const slotTime = new Date(dateTimeStr)
        const slotEnd = new Date(slotTime.getTime() + 60 * 60000)

        return slotTime < bookingEnd && slotEnd > bookingStart
      })

      if (!isBooked) {
        slots.push({
          time: timeStr,
          employeeId: avail.employee_id,
          employeeName: avail.employee?.name,
          available: true,
        })
      }

      currentMin += 60
      if (currentMin >= 60) {
        currentMin = 0
        currentHour += 1
      }
    }
  })

  return slots
}

export async function createBooking(data: {
  client_id: string
  service_type: 'construction' | 'hardscape' | 'maintenance'
  date_time: string
  duration_minutes?: number
  employee_id?: string
  notes?: string
}) {
  const supabase = await createClient()

  // Create project automatically
  const projectDate = new Date(data.date_time)
  const projectName = `${data.service_type.toUpperCase()} - ${projectDate.toLocaleDateString('fr-FR')}`

  const newProject = await createProject({
    name: projectName,
    client_id: data.client_id,
    status: 'planning',
    start_date: projectDate.toISOString().split('T')[0],
    end_date: projectDate.toISOString().split('T')[0],
    budget: 2000,
  })

  // Create booking
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      client_id: data.client_id,
      service_type: data.service_type,
      date_time: data.date_time,
      duration_minutes: data.duration_minutes || 120,
      employee_id: data.employee_id || null,
      status: 'confirmed',
      project_id: newProject.id,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Get client profile for notification
  const { data: client } = await supabase
    .from('clients')
    .select('*, profile:profiles(id)')
    .eq('id', data.client_id)
    .single()

  // Notify client
  if (client?.profile?.id) {
    await createNotification({
      user_id: client.profile.id,
      type: 'project_update',
      title: 'Réservation confirmée',
      message: `Votre réservation pour ${data.service_type} le ${projectDate.toLocaleDateString('fr-FR')} est confirmée`,
      related_id: booking.id,
    })
  }

  // Notify assigned employee
  if (data.employee_id) {
    const { data: empProfile } = await supabase
      .from('employees')
      .select('profiles(id)')
      .eq('id', data.employee_id)
      .single()

    if (empProfile?.profiles?.id) {
      await createNotification({
        user_id: empProfile.profiles.id,
        type: 'project_update',
        title: 'Nouvelle réservation assignée',
        message: `Vous avez une réservation pour ${projectDate.toLocaleDateString('fr-FR')} à ${new Date(data.date_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        related_id: booking.id,
      })
    }
  }

  return booking
}

export async function getClientBookings(clientId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      employee:employees(name),
      project:projects(name)
    `)
    .eq('client_id', clientId)
    .order('date_time', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

export async function cancelBooking(bookingId: string, reason?: string) {
  const supabase = await createClient()

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .select()
    .single()

  if (bookingError) throw new Error(bookingError.message)

  // Get client for notification
  const { data: client } = await supabase
    .from('clients')
    .select('*, profile:profiles(id)')
    .eq('id', booking.client_id)
    .single()

  if (client?.profile?.id) {
    await createNotification({
      user_id: client.profile.id,
      type: 'reminder',
      title: 'Réservation annulée',
      message: `Votre réservation a été annulée. ${reason || ''}`,
      related_id: bookingId,
    })
  }

  return booking
}

export async function rescheduleBooking(bookingId: string, newDateTime: string) {
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ date_time: newDateTime })
    .eq('id', bookingId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  // Notify client of reschedule
  const { data: client } = await supabase
    .from('clients')
    .select('*, profile:profiles(id)')
    .eq('id', booking.client_id)
    .single()

  if (client?.profile?.id) {
    await createNotification({
      user_id: client.profile.id,
      type: 'project_update',
      title: 'Réservation reprogrammée',
      message: `Votre réservation a été déplacée au ${new Date(newDateTime).toLocaleDateString('fr-FR')}`,
      related_id: bookingId,
    })
  }

  return booking
}
