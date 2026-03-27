'use client'

import { useState, useEffect } from 'react'
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '@/app/actions/notifications'
import { Bell, X, CheckCircle, AlertCircle, MessageSquare, FileText, DollarSign, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Notification {
  id: string
  user_id: string
  type: 'invoice' | 'quote' | 'payment' | 'project_update' | 'milestone' | 'reminder'
  title: string
  message: string
  related_id?: string
  read: boolean
  created_at: string
}

const notificationIcons: Record<string, typeof Bell> = {
  invoice: FileText,
  quote: MessageSquare,
  payment: DollarSign,
  project_update: TrendingUp,
  milestone: CheckCircle,
  reminder: AlertCircle,
}

const notificationColors: Record<string, string> = {
  invoice: 'bg-blue-900/20 text-blue-400 border-blue-800',
  quote: 'bg-purple-900/20 text-purple-400 border-purple-800',
  payment: 'bg-green-900/20 text-green-400 border-green-800',
  project_update: 'bg-yellow-900/20 text-yellow-400 border-yellow-800',
  milestone: 'bg-cyan-900/20 text-cyan-400 border-cyan-800',
  reminder: 'bg-red-900/20 text-red-400 border-red-800',
}

export function NotificationCenter({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [userId])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(userId)
      setNotifications(data)
    } catch (err) {
      console.error('Error loading notifications:', err)
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id)
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleMarkAllRead = async () => {
    setLoading(true)
    try {
      await markAllNotificationsRead(userId)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch (err) {
      console.error('Error marking all as read:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTime = (date: string) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins}m`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return notifDate.toLocaleDateString('fr-FR')
  }

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-1rem)] bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={loading}
                className="text-xs text-primary hover:underline disabled:opacity-50"
              >
                Marquer tout comme lu
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Aucune notification</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(notif => {
                  const Icon = notificationIcons[notif.type] || Bell
                  const colorClass = notificationColors[notif.type] || 'bg-secondary text-foreground border-border'

                  return (
                    <div
                      key={notif.id}
                      onClick={() => !notif.read && handleMarkRead(notif.id)}
                      className={cn(
                        'px-4 py-3 cursor-pointer hover:bg-secondary/50 transition-colors',
                        !notif.read && 'bg-secondary/20'
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn('p-2 rounded', colorClass)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-sm text-foreground line-clamp-1">
                              {notif.title}
                            </p>
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                handleDelete(notif.id)
                              }}
                              className="text-muted-foreground hover:text-foreground flex-shrink-0"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {formatTime(notif.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
