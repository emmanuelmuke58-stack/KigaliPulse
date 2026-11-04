import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Receipt,
  ShieldAlert,
  Server,
  Filter,
  Check,
} from 'lucide-react';
import { EnterpriseNotification } from '../../types/admin';

interface AdminNotificationsProps {
  notifications: EnterpriseNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNavigateTab,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Unread' | 'System' | 'Transactions' | 'Security'>('All');

  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === 'Unread') return !notif.isRead;
    if (activeCategory === 'All') return true;
    return notif.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-400" />
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {unreadCount} unread
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time platform alerts, financial anomalies, system events, and security advisories.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
        {(['All', 'Unread', 'Transactions', 'System', 'Security'] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Notification Items List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h3 className="font-bold text-white text-sm">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up on system notices.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            let icon = <Server className="w-5 h-5 text-sky-400" />;
            let bgClass = 'bg-sky-500/10 border-sky-500/20';

            if (notif.category === 'Transactions') {
              icon = <Receipt className="w-5 h-5 text-emerald-400" />;
              bgClass = 'bg-emerald-500/10 border-emerald-500/20';
            } else if (notif.category === 'Security') {
              icon = <ShieldAlert className="w-5 h-5 text-rose-400" />;
              bgClass = 'bg-rose-500/10 border-rose-500/20';
            } else if (notif.category === 'Moderation') {
              icon = <AlertTriangle className="w-5 h-5 text-amber-400" />;
              bgClass = 'bg-amber-500/10 border-amber-500/20';
            }

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.isRead
                    ? 'bg-slate-900 border-slate-800 opacity-80'
                    : 'bg-slate-900/90 border-slate-700/80 shadow-md'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${bgClass}`}>{icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-white truncate">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums shrink-0">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-1 leading-snug">{notif.message}</p>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      {notif.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notif.id)}
                          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(notif.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
