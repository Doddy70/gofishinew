"use client";

import { useState, useEffect } from "react";
import { LuBell } from "react-icons/lu";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: { bookingId?: string; [key: string]: any };
  read: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Notifications fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markRead' })
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all read error:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full hover:bg-surface-soft transition text-ink"
      >
        <LuBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-canvas border border-default rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <h3 className="font-bold text-ink">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-muted">Memuat...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <LuBell size={32} className="mx-auto text-muted mb-2" />
                <p className="text-sm text-muted">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (notif.data?.bookingId) {
                      router.push(`/reservations/${notif.data.bookingId}`);
                    }
                    setIsOpen(false);
                  }}
                  className={`p-4 border-b border-hairline/50 hover:bg-surface-soft cursor-pointer transition ${
                    !notif.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notif.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{notif.title}</p>
                      <p className="text-xs text-muted mt-1 line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-muted/70 mt-2">
                        {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 5 && (
            <div className="p-3 border-t border-hairline text-center">
              <button className="text-sm text-primary font-semibold hover:underline">
                Lihat semua notifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
