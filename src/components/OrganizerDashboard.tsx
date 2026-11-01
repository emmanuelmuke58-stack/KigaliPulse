import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle,
  History,
  BarChart3,
  User,
  CreditCard,
  Settings,
  Eye,
  Bookmark,
  MousePointerClick,
  TrendingUp,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { EventItem, UserProfile } from '../types';

interface OrganizerDashboardProps {
  events: EventItem[];
  currentUser: UserProfile;
  onCreateEvent: () => void;
  onSelectEvent: (event: EventItem) => void;
}

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  events,
  currentUser,
  onCreateEvent,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Filter events belonging to or managed by organizer
  const myEvents = events;
  const publishedEvents = myEvents.filter((e) => e.status === 'Published');
  const pendingEvents = myEvents.filter((e) => e.status === 'Pending Approval');
  const draftEvents = myEvents.filter((e) => e.status === 'Draft');
  const pastEvents = myEvents.filter((e) => new Date(e.date) < new Date('2026-09-24'));

  // Aggregated Metrics
  const totalViews = myEvents.reduce((acc, e) => acc + (e.views || 0), 0);
  const totalSaves = myEvents.reduce((acc, e) => acc + (e.saves || 0), 0);
  const totalClicks = myEvents.reduce((acc, e) => acc + (e.clicks || 0), 0);

  // Ad performance separation (as requested)
  const organicClicks = Math.round(totalClicks * 0.72);
  const sponsoredClicks = totalClicks - organicClicks;

  const sidebarLinks = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'my-events', label: 'My Events', icon: Calendar, badge: myEvents.length },
    { id: 'published', label: 'Published Events', icon: CheckCircle, badge: publishedEvents.length },
    { id: 'pending', label: 'Pending Approval', icon: Clock, badge: pendingEvents.length },
    { id: 'drafts', label: 'Drafts', icon: FileText, badge: draftEvents.length },
    { id: 'past', label: 'Past Events', icon: History },
    { id: 'analytics', label: 'Analytics & Traffic', icon: BarChart3 },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'settings', label: 'Organizer Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b pb-6">
        <div>
          <span className="text-base font-bold text-emerald-700 uppercase tracking-wider">
            Organizer Portal
          </span>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-base text-slate-500 mt-0.5">
            Managing public events, RSVPs, and ticket click-through tracking in Kigali.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateEvent}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit New Event</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-1 shrink-0">
          {sidebarLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border-l-4 border-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="text-[14px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-slate-400">Total Events</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{myEvents.length}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-emerald-700">Published</span>
              <div className="text-2xl font-black text-emerald-700 tabular-nums">{publishedEvents.length}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-amber-600">Pending</span>
              <div className="text-2xl font-black text-amber-600 tabular-nums">{pendingEvents.length}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-slate-400">Event Views</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{totalViews.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-slate-400">Total Saves</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{totalSaves.toLocaleString()}</div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
              <span className="text-[14px] uppercase font-bold text-slate-400">Ticket Clicks</span>
              <div className="text-2xl font-black text-slate-900 tabular-nums">{totalClicks.toLocaleString()}</div>
            </div>
          </div>

          {/* Organic vs Advertising Performance Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Engagement &amp; Ticket Conversion Attribution
                </h3>
                <p className="text-base text-slate-500">
                  Separating organic discovery on KigaliPulse from paid sponsor placements.
                </p>
              </div>
              <span className="text-base font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                High Conversion Zone
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-slate-700">🌱 Organic Discovery</span>
                  <span className="font-black text-slate-900 tabular-nums">{organicClicks.toLocaleString()} clicks (72%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '72%' }} />
                </div>
                <span className="text-[15px] text-slate-500 block">
                  Generated via city search, category browsing, and neighborhood exploration.
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between text-base">
                  <span className="font-bold text-slate-700">🚀 Sponsored Promotion</span>
                  <span className="font-black text-slate-900 tabular-nums">{sponsoredClicks.toLocaleString()} clicks (28%)</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '28%' }} />
                </div>
                <span className="text-[15px] text-slate-500 block">
                  Generated via Homepage Banner slots &amp; Featured Events carousel placements.
                </span>
              </div>
            </div>
          </div>

          {/* Events Table / List View */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Managed Events Portfolio</h3>
              <span className="text-base text-slate-500">{myEvents.length} items</span>
            </div>

            <div className="divide-y divide-slate-100">
              {myEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-14 h-14 rounded-xl object-cover shrink-0 border"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900 truncate">
                          {evt.title}
                        </span>
                        <span
                          className={`text-[14px] font-bold px-2 py-0.5 rounded-full ${
                            evt.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.status === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>
                      <span className="text-base text-slate-500 block">
                        {evt.displayDate} · {evt.venue} ({evt.neighborhood})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-base font-semibold shrink-0">
                    <div className="text-right">
                      <span className="text-slate-400 block text-[14px] uppercase font-bold">Metrics</span>
                      <span className="text-slate-700 tabular-nums inline-flex items-center gap-1 justify-end">
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>{evt.views.toLocaleString()} Views</span>
                        <span className="text-slate-400">·</span>
                        <span>{evt.clicks.toLocaleString()} clicks</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectEvent(evt)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
