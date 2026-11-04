import React, { useState, useMemo } from 'react';
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
  Search,
  Ticket,
  ChevronDown,
} from 'lucide-react';
import { EventItem, EventStatus, AdvertisementItem, AuditLogItem } from '../types';
import { ADVERTISEMENTS, INITIAL_AUDIT_LOGS } from '../data/mockData';
import { AdminReportsSection } from './AdminReportsSection';
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics Calculation
  const stats = useMemo(() => {
    const totalEvents = events.length;
    const pendingCount = events.filter((e) => e.status === 'Pending Approval').length;
    const totalTicketsSold = events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
    const totalRevenue = events.reduce((acc, e) => acc + (e.revenue || 0), 0);
    const totalAttendees = events.reduce((acc, e) => acc + (e.attendeeCount || 0), 0);
    const avgConversion = totalEvents > 0 ? (events.reduce((acc, e) => acc + (e.clicks > 0 ? (e.ticketsSold / e.clicks) : 0), 0) / totalEvents * 100).toFixed(1) : 0;

    return {
      totalEvents,
      pendingCount,
      totalTicketsSold,
      totalRevenue,
      totalAttendees,
      avgConversion,
    };
  }, [events]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

  const handleModerationAction = (
    eventId: string,
    status: EventStatus,
    actionLabel: string,
    note?: string
  ) => {
    onUpdateEventStatus(eventId, status, actionLabel, note || moderationNote);
    setModerationNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Super Admin Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" /> Super Admin Center
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-500">System-wide Governance</span>
          </div>
          <h1 className="font-black text-4xl text-slate-900 leading-tight">
            Platform Intelligence Center
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitor <span className="text-slate-900 font-bold">RF {stats.totalRevenue.toLocaleString()}</span> in total ticket revenue across the ecosystem.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center flex-wrap gap-2 bg-slate-100 p-2 rounded-2xl text-xs font-black">
          {[
            { id: 'reports', label: 'Analytics', icon: BarChart3 },
            { id: 'moderation', label: 'Moderation', icon: FileCheck, badge: stats.pendingCount },
            { id: 'advertisements', label: 'Ad System', icon: Megaphone },
            { id: 'audit-logs', label: 'Audit Logs', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-5 py-3 rounded-xl transition-all flex items-center gap-2",
                activeTab === tab.id 
                  ? "bg-white text-emerald-800 shadow-md scale-100" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-emerald-600" : "text-slate-400")} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Global KPIs (8 metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {[
          { label: 'Total Events', value: stats.totalEvents },
          { label: 'Pending Appr', value: stats.pendingCount, alert: stats.pendingCount > 0 },
          { label: 'Tickets Sold', value: stats.totalTicketsSold.toLocaleString() },
          { label: 'Total Revenue', value: `RF ${(stats.totalRevenue / 1000000).toFixed(1)}M` },
          { label: 'Conversion', value: `${stats.avgConversion}%` },
          { label: 'Ad Revenue', value: 'RF 1.6M' },
          { label: 'Organizers', value: '84' },
          { label: 'Active Ads', value: '12' },
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1 group hover:border-emerald-200 transition-colors">
            <span className={cn(
              "text-[9px] uppercase font-black tracking-widest block",
              item.alert ? "text-amber-600" : "text-slate-400"
            )}>
              {item.label}
            </span>
            <div className={cn(
              "text-xl font-black tabular-nums",
              item.alert ? "text-amber-600" : "text-slate-900"
            )}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Tab Views */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'reports' && (
          <div className="space-y-10">
            <AdminReportsSection events={events} />
          </div>
        )}

        {activeTab === 'moderation' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Event Approval Workflow</h2>
                <p className="text-sm text-slate-500 font-medium">Verify credentials and ticket provider settings before publication.</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Search events or organizers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredEvents.map((evt) => (
                <div key={evt.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <img src={evt.image} className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200" alt="" />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 
                          className="font-black text-slate-900 hover:text-emerald-700 cursor-pointer text-lg truncate" 
                          onClick={() => onSelectEvent(evt)}
                        >
                          {evt.title}
                        </h4>
                        <span className={cn(
                          "text-[10px] font-black px-2 py-1 rounded-full uppercase",
                          evt.status === 'Published' ? "bg-emerald-100 text-emerald-800" :
                          evt.status === 'Pending Approval' ? "bg-amber-100 text-amber-800" :
                          "bg-slate-100 text-slate-700"
                        )}>
                          {evt.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-bold flex items-center gap-3 flex-wrap">
                        <span className="text-slate-900">{evt.organizer}</span>
                        <span className="text-slate-300">•</span>
                        <span>{evt.displayDate}</span>
                        <span className="text-slate-300">•</span>
                        <span>{evt.venue}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700">RF {evt.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600 tabular-nums">{evt.views.toLocaleString()} Views</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ticket className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-600 tabular-nums">{evt.ticketsSold.toLocaleString()} Sold</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                    {evt.status !== 'Published' && (
                      <button
                        onClick={() => handleModerationAction(evt.id, 'Published', 'Approved Event')}
                        className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-black rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => onToggleFeatureEvent(evt.id)}
                      className={cn(
                        "px-4 py-2.5 rounded-xl border text-xs font-black flex items-center gap-2 transition-all",
                        evt.isFeatured ? "bg-amber-50 border-amber-200 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Star className={cn("w-4 h-4", evt.isFeatured ? "fill-amber-500 text-amber-500" : "")} />
                      {evt.isFeatured ? 'Featured' : 'Feature'}
                    </button>
                    <button
                      onClick={() => {
                        const note = prompt('Request changes:');
                        if (note) handleModerationAction(evt.id, 'Draft', 'Requested Changes', note);
                      }}
                      className="px-4 py-2.5 border border-slate-200 text-slate-600 text-xs font-black rounded-xl hover:bg-slate-50"
                    >
                      Req Changes
                    </button>
                    <div className="h-8 w-px bg-slate-200 mx-1" />
                    <button
                      onClick={() => {
                        if (confirm('Permanently delete?')) onDeleteEvent(evt.id);
                      }}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'advertisements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Ad & Promotion Ecosystem</h2>
                  <p className="text-sm text-slate-500 font-medium">Govern sponsored content and homepage banner inventory.</p>
                </div>
                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-emerald-600 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Launch New Campaign
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ads.map((ad) => (
                  <div key={ad.id} className="group p-6 rounded-3xl border border-slate-200 bg-slate-50/30 hover:border-emerald-200 transition-all">
                    <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                      <img src={ad.image} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt="" />
                      <div className="absolute top-4 right-4 bg-black/80 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {ad.status}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-black text-lg text-slate-900">{ad.title}</h4>
                          <span className="text-xs font-bold text-slate-500">{ad.advertiser} • {ad.format}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Budget</span>
                          <span className="font-black text-slate-900 text-sm">{ad.budget}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Impressions</span>
                          <span className="font-black text-slate-900 text-sm tabular-nums">{ad.impressions.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">CTR</span>
                          <span className="font-black text-emerald-600 text-sm tabular-nums">{((ad.clicks / ad.impressions) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit-logs' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900">Governance Audit Logs</h2>
              <p className="text-sm text-slate-500 font-medium">Immutable trace of all administrative and moderation actions.</p>
            </div>
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-900">{log.action}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-emerald-700">{log.targetTitle}</span>
                    </div>
                    {log.notes && (
                      <p className="text-xs text-slate-500 italic font-medium">"{log.notes}"</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-black text-slate-900 block uppercase tracking-widest">{log.user}</span>
                    <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
