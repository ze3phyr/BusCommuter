'use client';

import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Clock, X } from 'lucide-react';
import { getRecentNotifications } from '@/lib/db';
import type { Route } from '@/lib/data';

interface NotificationsListProps {
  userId?: string;
  routes?: Route[];
}

interface Notification {
  id: string;
  routeId: string;
  type: 'delay' | 'eta_update' | 'status_change';
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export default function NotificationsList({ userId = 'anonymous-user', routes = [] }: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    async function loadNotifications() {
      try {
        const notifs = await getRecentNotifications(userId, 20);
        setNotifications(notifs as Notification[]);
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadNotifications();

    const interval = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const getRouteBusNumber = (routeId: string) => {
    const route = routes.find(r => r.id === routeId);
    return route?.busNumber || routeId;
  };

  const formatTime = (timestamp: number, now: number) => {
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
            <h3 className="font-bold text-slate-950 dark:text-white">Notifications</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`border-b border-slate-100 px-4 py-3 dark:border-slate-800 ${
                    !notif.read ? 'bg-emerald-50/50 dark:bg-emerald-950/20' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      notif.type === 'delay' 
                        ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                    }`}>
                      {notif.type === 'delay' ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-950 dark:text-white">
                        {getRouteBusNumber(notif.routeId)} - {notif.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {notif.message}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatTime(notif.createdAt, currentTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}