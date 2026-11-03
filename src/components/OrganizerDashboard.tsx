import React, { useState, useMemo } from 'react';
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
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  Target,
  Ticket,
  DollarSign,
  Users as UsersIcon,
  X,
  Info,
} from 'lucide-react';
import { EventItem, UserProfile, TicketCategory } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { format, isAfter, isBefore, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, isToday, parseISO } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30d');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Filter events belonging to or managed by organizer
  const myEvents = events.filter((e) => e.organizerId === 'org-1' || currentUser.role === 'admin');
  
  const selectedEvent = useMemo(() => 
    myEvents.find(e => e.id === selectedEventId), 
  [myEvents, selectedEventId]);

  // Aggregated Metrics
  const metrics = useMemo(() => {
    const total = myEvents.length;
    const published = myEvents.filter(e => e.status === 'Published').length;
    const upcoming = myEvents.filter(e => new Date(e.date) > new Date()).length;
    const ongoing = myEvents.filter(e => isToday(parseISO(e.date))).length;
    const completed = myEvents.filter(e => e.status === 'Completed').length;
    const draft = myEvents.filter(e => e.status === 'Draft').length;
    const cancelled = myEvents.filter(e => e.status === 'Cancelled').length;
    const totalTicketsSold = myEvents.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
    const totalRevenue = myEvents.reduce((acc, e) => acc + (e.revenue || 0), 0);
    
    return {
      total, published, upcoming, ongoing, completed, draft, cancelled,
      totalTicketsSold, totalRevenue
    };
  }, [myEvents]);

  // Alerts Logic
  const alerts = useMemo(() => {
    const list: { type: string, message: string, eventId: string }[] = [];
    myEvents.forEach(e => {
      const eventDate = parseISO(e.date);
      const today = new Date();
      const diffDays = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0 && diffDays <= 7) {
        list.push({ type: 'approaching', message: `"${e.title}" is in ${diffDays} days`, eventId: e.id });
      }
      
      const salesPct = (e.ticketsSold / e.capacity) * 100;
      if (e.status === 'Published' && salesPct < 20 && diffDays < 14 && diffDays > 0) {
        list.push({ type: 'low-sales', message: `Low ticket sales for "${e.title}" (${e.ticketsSold} sold)`, eventId: e.id });
      }
      
      if (salesPct >= 90 && salesPct < 100) {
        list.push({ type: 'near-capacity', message: `"${e.title}" is almost sold out!`, eventId: e.id });
      }

      if (e.ticketsSold >= e.capacity && e.capacity > 0) {
        list.push({ type: 'sold-out', message: `"${e.title}" is officially SOLD OUT`, eventId: e.id });
      }
    });
    return list;
  }, [myEvents]);

  // Chart Data
  const salesHistoryData = useMemo(() => {
    const history: Record<string, { date: string, sales: number, revenue: number }> = {};
    myEvents.forEach(e => {
      e.salesHistory?.forEach(s => {
        if (!history[s.date]) {
          history[s.date] = { date: s.date, sales: 0, revenue: 0 };
        }
        history[s.date].sales += s.ticketsSold;
        history[s.date].revenue += s.revenue;
      });
    });
    return Object.values(history).sort((a, b) => a.date.localeCompare(b.date));
  }, [myEvents]);

  const categoryData = useMemo(() => {
    const cats: Record<string, number> = {};
    myEvents.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + e.ticketsSold;
    });
    return Object.entries(cats).map(([name, value]) => ({ name, value }));
  }, [myEvents]);

  const COLORS = ['#10b981', '#059669', '#34d399', '#047857', '#6ee7b7', '#065f46'];

  // Table Filtering
  const filteredTableEvents = useMemo(() => {
    return myEvents.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           e.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [myEvents, searchQuery, statusFilter]);

  if (selectedEvent) {
    const salesPct = Math.round((selectedEvent.ticketsSold / selectedEvent.capacity) * 100) || 0;
    
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button 
          onClick={() => setSelectedEventId(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-bold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Event Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="relative h-64">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {selectedEvent.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                      selectedEvent.status === 'Published' ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                    )}>
                      {selectedEvent.status}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white leading-tight">
                    {selectedEvent.title}
                  </h1>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Date & Time</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      {selectedEvent.displayDate}
                    </p>
                    <p className="text-slate-500 text-xs ml-6">{selectedEvent.time}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Location</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-600" />
                      {selectedEvent.venue}
                    </p>
                    <p className="text-slate-500 text-xs ml-6">{selectedEvent.neighborhood}, {selectedEvent.district}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Organizer</span>
                    <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <User className="w-4 h-4 text-emerald-600" />
                      {selectedEvent.organizer}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-lg text-slate-900">Description</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket Categories */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-emerald-600" />
                Ticket Categories & Availability
              </h3>
              <div className="space-y-4">
                {selectedEvent.ticketCategories?.map(cat => (
                  <div key={cat.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-black text-slate-900">{cat.name}</h4>
                      <p className="text-xs text-slate-500">
                        {cat.price === 0 ? 'Free Entry' : `RF ${cat.price.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block">Sold</span>
                        <span className="font-bold text-slate-900 text-sm">{cat.sold} / {cat.capacity}</span>
                      </div>
                      <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full" 
                          style={{ width: `${(cat.sold / cat.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance History Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-lg text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                Sales Performance History
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedEvent.salesHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      tickFormatter={(val) => format(parseISO(val as string), 'MMM d')}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      labelFormatter={(val) => format(parseISO(val as string), 'MMMM d, yyyy')}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ticketsSold" 
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ r: 4, fill: '#10b981' }}
                      activeDot={{ r: 6 }}
                      name="Tickets Sold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics & Progress */}
          <div className="space-y-6">
            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-lg shadow-emerald-200">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-80">Event Performance</h3>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold">Ticket Sales Progress</span>
                    <span className="text-lg font-black">{salesPct}%</span>
                  </div>
                  <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${salesPct}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-[10px] uppercase font-black opacity-70 block">Tickets Sold</span>
                    <span className="text-2xl font-black">{selectedEvent.ticketsSold.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black opacity-70 block">Remaining</span>
                    <span className="text-2xl font-black">{(selectedEvent.capacity - selectedEvent.ticketsSold).toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 pt-4 border-t border-white/10">
                    <span className="text-[10px] uppercase font-black opacity-70 block">Total Revenue</span>
                    <span className="text-3xl font-black">RF {selectedEvent.revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="font-black text-sm text-slate-900 mb-6 uppercase tracking-widest">Attendance Status</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <UsersIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Total Checked-in</span>
                      <span className="text-xs text-slate-500">Actual attendance</span>
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-900">{selectedEvent.attendeeCount}</span>
                </div>
                
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
                    Attendance is calculated from successful QR code scans at the venue gate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* 1. Header & Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-100 pb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
              Organizer Hub
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-500">Africa/Kigali Timezone</span>
          </div>
          <h1 className="font-black text-4xl text-slate-900 leading-tight">
            Hello, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-xl">
            You're currently managing <span className="text-slate-900 font-bold">{myEvents.length} events</span>. Here's how your ticket sales are performing this week.
          </p>
        </div>

        <button
          onClick={onCreateEvent}
          className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-200 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* 2. Event Performance Overview (Top Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Events', value: metrics.total, color: 'slate' },
          { label: 'Published', value: metrics.published, color: 'emerald' },
          { label: 'Drafts', value: metrics.draft, color: 'amber' },
          { label: 'Tickets Sold', value: metrics.totalTicketsSold.toLocaleString(), color: 'emerald' },
          { label: 'Total Revenue', value: `RF ${metrics.totalRevenue.toLocaleString()}`, color: 'emerald', full: true },
        ].map((item, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2 group transition-all hover:border-emerald-200 hover:bg-emerald-50/20",
              item.full ? "col-span-2 lg:col-span-1" : ""
            )}
          >
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest block group-hover:text-emerald-600 transition-colors">
              {item.label}
            </span>
            <div className="text-2xl font-black text-slate-900 tabular-nums">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 3. Analytics & Notifications Left Rail */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Important Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
            <h3 className="font-black text-sm text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Critical Alerts
            </h3>
            <div className="space-y-4">
              {alerts.length > 0 ? (
                alerts.map((alert, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setSelectedEventId(alert.eventId)}
                    className="w-full text-left p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-bold text-slate-800 leading-snug">
                        {alert.message}
                      </p>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-emerald-200 mx-auto mb-3" />
                  <p className="text-xs font-bold text-slate-400">All events are on track!</p>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Sales by Category Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="font-black text-sm text-slate-900 mb-6 uppercase tracking-widest">
              Sales by Category
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    formatter={(val) => <span className="text-[10px] font-bold text-slate-600">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 4. Main Activity Area (Management Table & Trends) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Sales Trends Chart */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-black text-lg text-slate-900">Platform Revenue Trends</h3>
                <p className="text-xs text-slate-500 font-medium">Aggregated sales across all your active events</p>
              </div>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-slate-100 border-none rounded-xl text-xs font-bold px-4 py-2 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last Quarter</option>
              </select>
            </div>
            
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(val) => format(parseISO(val as string), 'MMM d')}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    tickFormatter={(val) => val >= 1000000 ? `${(val/1000000).toFixed(1)}M` : (val as number).toLocaleString()}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981" 
                    radius={[6, 6, 0, 0]} 
                    name="Daily Revenue (RF)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Management Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-black text-lg text-slate-900">Manage Events</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 w-full sm:w-48"
                  />
                </div>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold px-3 py-2"
                >
                  <option value="all">All Status</option>
                  <option value="Published">Published</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Event Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Tickets Sold</th>
                    <th className="px-6 py-4 text-right">Revenue</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTableEvents.length > 0 ? (
                    filteredTableEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={evt.image} className="w-10 h-10 rounded-xl object-cover shrink-0" alt="" />
                            <div className="min-w-0">
                              <span className="text-sm font-bold text-slate-900 block truncate group-hover:text-emerald-600 transition-colors">
                                {evt.title}
                              </span>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(parseISO(evt.date as string), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {evt.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-[10px] font-black px-2 py-1 rounded-full uppercase",
                            evt.status === 'Published' ? "bg-emerald-100 text-emerald-800" :
                            evt.status === 'Draft' ? "bg-slate-100 text-slate-700" :
                            evt.status === 'Completed' ? "bg-emerald-600 text-white" :
                            "bg-red-100 text-red-800"
                          )}>
                            {evt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="space-y-1">
                            <span className="text-sm font-black text-slate-900 tabular-nums">
                              {(evt.ticketsSold || 0).toLocaleString()}
                            </span>
                            <div className="w-16 bg-slate-200 h-1 rounded-full ml-auto overflow-hidden">
                              <div 
                                className="bg-emerald-500 h-full rounded-full" 
                                style={{ width: `${(evt.ticketsSold / evt.capacity) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-sm font-black text-slate-900 tabular-nums">
                            RF {(evt.revenue || 0).toLocaleString()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedEventId(evt.id)}
                            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="max-w-xs mx-auto space-y-3">
                          <div className="w-16 h-16 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto text-slate-300">
                            <FileText className="w-8 h-8" />
                          </div>
                          <p className="text-sm font-bold text-slate-400">No events found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
