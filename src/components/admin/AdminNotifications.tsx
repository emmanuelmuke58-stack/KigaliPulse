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
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>Notification Center</span>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                {unreadCount} unread
              </span>
            )}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time platform alerts, financial anomalies, system events, and security advisories.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-2xs"
          >
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* 2. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs">
        {(['All', 'Unread', 'Transactions', 'System', 'Security'] as const).map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
            <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="font-bold text-slate-900 text-sm">No Notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up on system notices.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            let icon = <Server className="w-5 h-5 text-sky-600" />;
            let bgClass = 'bg-sky-50 border-sky-200';

            if (notif.category === 'Transactions') {
              icon = <Receipt className="w-5 h-5 text-emerald-600" />;
              bgClass = 'bg-emerald-50 border-emerald-200';
            } else if (notif.category === 'Security') {
              icon = <ShieldAlert className="w-5 h-5 text-rose-600" />;
              bgClass = 'bg-rose-50 border-rose-200';
            } else if (notif.category === 'Moderation') {
              icon = <AlertTriangle className="w-5 h-5 text-amber-600" />;
              bgClass = 'bg-amber-50 border-amber-200';
            }

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                  notif.isRead
                    ? 'bg-white border-slate-200/90 shadow-2xs'
                    : 'bg-emerald-50/30 border-emerald-200 shadow-xs'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${bgClass}`}>{icon}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 tabular-nums shrink-0 font-medium">
                      {notif.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-1 leading-snug font-normal">{notif.message}</p>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {notif.category}
                    </span>

                    <div className="flex items-center gap-2">
                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(notif.id)}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                        >
                          Mark Read
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteNotification(notif.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
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
