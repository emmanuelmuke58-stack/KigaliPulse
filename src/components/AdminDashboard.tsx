import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  HelpCircle,
  Star,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Plus,
  TrendingUp,
  FileCheck,
  Megaphone,
  History,
  Layers,
  Users,
  Building,
  Sliders,
  DollarSign,
  BarChart,
  BarChart3,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { EventItem, EventStatus, AdvertisementItem, AuditLogItem } from '../types';
import { ADVERTISEMENTS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { AdminReportsSection } from './AdminReportsSection';

interface AdminDashboardProps {
  events: EventItem[];
  onUpdateEventStatus: (
    eventId: string,
    newStatus: EventStatus,
    actionName: string,
    notes?: string
  ) => void;
  onToggleFeatureEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  auditLogs: AuditLogItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  events,
  onUpdateEventStatus,
  onToggleFeatureEvent,
  onDeleteEvent,
  auditLogs,
  onSelectEvent,
}) => {
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [ads, setAds] = useState<AdvertisementItem[]>(ADVERTISEMENTS);
  const [moderationNote, setModerationNote] = useState<string>('');
  const [selectedEventForNote, setSelectedEventForNote] = useState<string | null>(null);

  // Statistics
  const totalUsers = 4820;
  const totalOrganizers = 84;
  const totalEvents = events.length;
  const pendingEvents = events.filter((e) => e.status === 'Pending Approval');
  const publishedEvents = events.filter((e) => e.status === 'Published');
  const featuredEvents = events.filter((e) => e.isFeatured);
  const eventsToday = events.filter((e) => e.date === '2026-09-24').length;
  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date('2026-09-24')).length;
  const totalAdRevenue = 'RF 1,620,000';

  const handleModerationAction = (
    eventId: string,
    status: EventStatus,
    actionLabel: string,
    note?: string
  ) => {
    onUpdateEventStatus(eventId, status, actionLabel, note || moderationNote);
    setModerationNote('');
    setSelectedEventForNote(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Super Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Super Admin Center
            </span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 mt-1">
            Platform Intelligence &amp; Governance Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit public listings, evaluate discovery analytics reports, verify organizers, and govern ad inventory.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-white text-emerald-800 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Reports</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'moderation' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Event Moderation ({pendingEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advertisements')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'advertisements' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ad System ({ads.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit-logs')}
            className={`px-3.5 py-2 rounded-lg transition-colors ${
              activeTab === 'audit-logs' ? 'bg-white text-slate-900 shadow-sm font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Logs ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Admin Statistics Row (8 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Users</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{totalUsers.toLocaleString()}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Organizers</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{totalOrganizers}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Events</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{totalEvents}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-amber-600 block">Pending</span>
          <span className="text-xl font-black text-amber-600 tabular-nums">{pendingEvents.length}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Published</span>
          <span className="text-xl font-black text-emerald-700 tabular-nums">{publishedEvents.length}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Events Today</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{eventsToday}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Upcoming</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{upcomingEvents}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Ad Revenue</span>
          <span className="text-xs font-black text-emerald-700 tabular-nums block mt-1">{totalAdRevenue}</span>
        </div>
      </div>

      {/* TAB 0: EXECUTIVE ADMIN REPORT & ANALYTICS */}
      {activeTab === 'reports' && (
        <AdminReportsSection events={events} />
      )}

      {/* TAB 1: EVENT MODERATION WORKFLOW */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Event Approval &amp; Lifecycle Queue</h2>
                <p className="text-xs text-slate-500">
                  Review submitted events, request organizer changes, feature on homepage, or mark status.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">{events.length} listings registered</span>
            </div>

            <div className="divide-y divide-slate-100">
              {events.map((evt) => (
                <div key={evt.id} className="p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 hover:bg-slate-50/50">
                  
                  {/* Left: Event Details */}
                  <div className="flex items-start gap-4 min-w-0">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 hover:text-emerald-700 cursor-pointer" onClick={() => onSelectEvent(evt)}>
                          {evt.title}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            evt.status === 'Published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : evt.status === 'Pending Approval'
                              ? 'bg-amber-100 text-amber-800'
                              : evt.status === 'Cancelled'
                              ? 'bg-red-100 text-red-800'
                              : evt.status === 'Postponed'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {evt.status}
                        </span>
                        {evt.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-slate-800">{evt.organizer}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.displayDate} ({evt.time})</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.venue}, {evt.neighborhood}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-bold text-slate-900 tabular-nums">{evt.priceDisplay}</span>
                        <span aria-hidden="true">·</span>
                        <span
                          className="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]"
                          title={`${evt.views.toLocaleString()} page visits`}
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>{evt.views.toLocaleString()} Views</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 truncate max-w-xl">
                        Ticketing Link: <a href={evt.externalTicketUrl} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">{evt.externalTicketUrl}</a>
                      </div>
                    </div>
                  </div>

                  {/* Right: Moderation Actions (Constitution & Prompt Section 15) */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end lg:self-center">
                    
                    {/* Approve */}
                    {evt.status !== 'Published' && (
                      <button
                        type="button"
                        onClick={() => handleModerationAction(evt.id, 'Published', 'Approved Event', 'All organizer criteria verified.')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Feature on Homepage Toggle */}
                    <button
                      type="button"
                      onClick={() => onToggleFeatureEvent(evt.id)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors flex items-center gap-1 ${
                        evt.isFeatured
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Toggle Featured status on Homepage"
                    >
                      <Star className={`w-3.5 h-3.5 ${evt.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{evt.isFeatured ? 'Featured' : 'Feature'}</span>
                    </button>

                    {/* Request Changes */}
                    <button
                      type="button"
                      onClick={() => {
                        const note = prompt('Enter change request note for organizer:');
                        if (note) {
                          handleModerationAction(evt.id, 'Draft', 'Requested Changes', note);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                      title="Request changes from organizer"
                    >
                      Req Changes
                    </button>

                    {/* Mark Postponed */}
                    {evt.status !== 'Postponed' && (
                      <button
                        type="button"
                        onClick={() => handleModerationAction(evt.id, 'Postponed', 'Marked Event as Postponed')}
                        className="px-2.5 py-1.5 rounded-lg border border-orange-200 text-orange-700 hover:bg-orange-50 text-xs font-medium"
                      >
                        Postpone
                      </button>
                    )}

                    {/* Mark Cancelled */}
                    {evt.status !== 'Cancelled' && (
                      <button
                        type="button"
                        onClick={() => handleModerationAction(evt.id, 'Cancelled', 'Marked Event as Cancelled')}
                        className="px-2.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium"
                      >
                        Cancel
                      </button>
                    )}

                    {/* Unpublish */}
                    {evt.status === 'Published' && (
                      <button
                        type="button"
                        onClick={() => handleModerationAction(evt.id, 'Draft', 'Unpublished Event')}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium"
                      >
                        Unpublish
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Are you sure you want to permanently delete "${evt.title}"?`)) {
                          onDeleteEvent(evt.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADVERTISEMENT SYSTEM */}
      {activeTab === 'advertisements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Commercial Advertisement Campaigns</h2>
                <p className="text-xs text-slate-500">
                  Manage sponsored banners, category placements, impressions, and click-through attribution.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const title = prompt('Enter campaign headline:');
                  if (title) {
                    const newAd: AdvertisementItem = {
                      id: `ad-${Date.now()}`,
                      title,
                      advertiser: 'Corporate Client',
                      format: 'Homepage Banner',
                      placement: 'Hero Secondary Scrim',
                      destinationUrl: 'https://visitrwanda.com',
                      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                      status: 'Active',
                      budget: 'RF 350,000',
                      impressions: 0,
                      clicks: 0,
                      startDate: '2026-09-24',
                      endDate: '2026-10-31',
                    };
                    setAds([newAd, ...ads]);
                    alert('New advertisement campaign launched!');
                  }
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Campaign</span>
              </button>
            </div>

            {/* Ads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad) => (
                <div key={ad.id} className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <div className="relative h-32 rounded-xl overflow-hidden bg-slate-900">
                    <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-900/90 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                      Sponsored
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{ad.title}</h4>
                      <span className="text-xs text-slate-500">{ad.advertiser} · {ad.format}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {ad.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white border border-slate-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Budget</span>
                      <span className="font-bold text-slate-900">{ad.budget}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Impressions</span>
                      <span className="font-bold text-slate-900 tabular-nums">{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Clicks</span>
                      <span className="font-bold text-emerald-700 tabular-nums">{ad.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === 'audit-logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Security &amp; Moderation Audit Logs</h2>
              <p className="text-xs text-slate-500">
                Immutable chronological log of all administrator and moderation actions on KigaliPulse.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{auditLogs.length} audit entries</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-slate-400">on</span>
                    <span className="font-semibold text-emerald-700">{log.targetTitle}</span>
                  </div>
                  {log.notes && (
                    <p className="text-slate-500 italic text-[11px]">{log.notes}</p>
                  )}
                </div>

                <div className="text-right text-slate-400 shrink-0 text-[11px]">
                  <span className="font-medium text-slate-600 block">{log.user} ({log.role})</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
