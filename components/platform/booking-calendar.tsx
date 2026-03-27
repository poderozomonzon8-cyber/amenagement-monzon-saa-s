'use client'

import { useState, useEffect } from 'react'
import { getAvailableSlots, createBooking, getClientBookings, cancelBooking } from '@/app/actions/bookings'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, MapPin, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const serviceTypes = [
  { value: 'construction', label: 'Construction' },
  { value: 'hardscape', label: 'Aménagement paysager' },
  { value: 'maintenance', label: 'Entretien' },
]

interface TimeSlot {
  time: string
  employeeId?: string
  employeeName?: string
  available: boolean
}

interface Booking {
  id: string
  date_time: string
  service_type: string
  status: string
  duration_minutes: number
  employee?: { name: string }
  project?: { name: string }
}

export function BookingCalendar({ clientId }: { clientId: string }) {
  const [activeTab, setActiveTab] = useState<'book' | 'bookings'>('book')
  const [serviceType, setServiceType] = useState('construction')
  const [selectedDate, setSelectedDate] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadBookings()
    }
  }, [activeTab])

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots()
    }
  }, [selectedDate, serviceType])

  const loadTimeSlots = async () => {
    setLoading(true)
    try {
      const slots = await getAvailableSlots(serviceType, selectedDate)
      setTimeSlots(slots)
      setSelectedTime(null)
    } catch (err) {
      console.error('Error loading slots:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadBookings = async () => {
    setLoading(true)
    try {
      const data = await getClientBookings(clientId)
      setBookings(data)
    } catch (err) {
      console.error('Error loading bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Veuillez sélectionner une date et une heure')
      return
    }

    setLoading(true)
    try {
      const slot = timeSlots.find(s => s.time === selectedTime)
      await createBooking({
        client_id: clientId,
        service_type: serviceType as any,
        date_time: `${selectedDate}T${selectedTime}`,
        employee_id: slot?.employeeId,
        notes: notes || undefined,
        duration_minutes: 120,
      })

      setSelectedDate('')
      setSelectedTime(null)
      setServiceType('construction')
      setNotes('')
      alert('Réservation confirmée!')
      await loadBookings()
      setActiveTab('bookings')
    } catch (err) {
      console.error('Error creating booking:', err)
      alert('Erreur lors de la création de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation?')) return

    setLoading(true)
    try {
      await cancelBooking(bookingId, 'Annulé par le client')
      await loadBookings()
    } catch (err) {
      console.error('Error cancelling booking:', err)
      alert('Erreur lors de l\'annulation')
    } finally {
      setLoading(false)
    }
  }

  const getMinDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return date.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 90)
    return date.toISOString().split('T')[0]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-400'
      case 'in_progress':
        return 'text-blue-400'
      case 'completed':
        return 'text-cyan-400'
      case 'cancelled':
        return 'text-red-400'
      default:
        return 'text-amber-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-foreground">Système de Réservation</h1>
        <p className="text-sm text-muted-foreground mt-1">Réservez vos services en quelques clics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {['book', 'bookings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              'px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab === 'book' ? 'Nouvelle réservation' : 'Mes réservations'}
          </button>
        ))}
      </div>

      {/* Booking Form Tab */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Détails de la réservation</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Type de service</label>
                <select
                  value={serviceType}
                  onChange={e => setServiceType(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground"
                >
                  {serviceTypes.map(s => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Notes (optionnel)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Détails supplémentaires..."
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-card text-foreground placeholder:text-muted-foreground min-h-[80px]"
                />
              </div>
            </div>
          </Card>

          {/* Time Slots */}
          {selectedDate && (
            <Card className="p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Créneaux disponibles</h3>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : timeSlots.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">Aucun créneau disponible pour cette date</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      className={cn(
                        'p-2 rounded-lg text-sm font-medium transition-all text-center',
                        selectedTime === slot.time
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      )}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Booking Summary */}
          {selectedDate && selectedTime && (
            <Card className="p-6 border border-primary/50 bg-primary/5">
              <h3 className="font-semibold text-foreground mb-3">Résumé de la réservation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Type: {serviceTypes.find(s => s.value === serviceType)?.label}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Date: {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Heure: {selectedTime}
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={loading}
                className="w-full mt-4"
              >
                {loading ? 'Réservation en cours...' : 'Confirmer la réservation'}
              </Button>
            </Card>
          )}
        </div>
      )}

      {/* Bookings List Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <Card className="p-8 text-center border border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune réservation</p>
            </Card>
          ) : (
            bookings.map(booking => {
              const bookingDate = new Date(booking.date_time)
              return (
                <Card key={booking.id} className="p-4 border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {serviceTypes.find(s => s.value === booking.service_type)?.label}
                      </h4>
                      <p className={cn('text-sm font-medium mt-1', getStatusColor(booking.status))}>
                        {booking.status === 'confirmed' && '✓ Confirmée'}
                        {booking.status === 'in_progress' && '→ En cours'}
                        {booking.status === 'completed' && '✓ Complétée'}
                        {booking.status === 'cancelled' && '✗ Annulée'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {bookingDate.toLocaleDateString('fr-FR')}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {bookingDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} 
                      ({booking.duration_minutes} min)
                    </div>
                    {booking.employee && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">Technicien:</span>
                        <span>{booking.employee.name}</span>
                      </div>
                    )}
                  </div>

                  {booking.status === 'confirmed' && (
                    <Button
                      onClick={() => handleCancel(booking.id)}
                      disabled={loading}
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Annuler
                    </Button>
                  )}
                </Card>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
