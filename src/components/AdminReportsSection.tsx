import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  Share2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  MousePointerClick,
  Filter,
  Ticket,
  ChevronRight,
} from 'lucide-react';
import { EventItem } from '../types';
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
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { format, parseISO, subDays, isAfter, startOfDay } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdminReportsSectionProps {
  events: EventItem[];
}

export const AdminReportsSection: React.FC<AdminReportsSectionProps> = ({ events }) => {
  const [timeframe, setTimeframe] = useState<string>('30d');

  // Filter events based on timeframe if needed (for simplicity, we use all events here)
  const reportEvents = events;

  // 1. Sales & Revenue Over Time
  const salesOverTime = useMemo(() => {
    const data: Record<string, { date: string, sales: number, revenue: number }> = {};
    reportEvents.forEach(e => {
      e.salesHistory?.forEach(s => {
        if (!data[s.date]) data[s.date] = { date: s.date, sales: 0, revenue: 0 };
        data[s.date].sales += s.ticketsSold;
        data[s.date].revenue += s.revenue;
      });
    });
    return Object.values(data).sort((a, b) => a.date.localeCompare(b.date));
  }, [reportEvents]);

  // 2. Best Performing Events (by Revenue)
  const topEvents = useMemo(() => {
    return [...reportEvents]
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 5);
  }, [reportEvents]);

  // 3. Free vs Paid Events
  const pricingData = useMemo(() => {
    const free = reportEvents.filter(e => e.isFree).length;
    const paid = reportEvents.filter(e => !e.isFree).length;
    return [
      { name: 'Free Events', value: free },
      { name: 'Paid Events', value: paid },
    ];
  }, [reportEvents]);

  // 4. Ticket Sales by Category
  const categorySales = useMemo(() => {
    const cats: Record<string, number> = {};
    reportEvents.forEach(e => {
      cats[e.category] = (cats[e.category] || 0) + (e.ticketsSold || 0);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [reportEvents]);

  // 5. Highest Attendance
  const topAttendance = useMemo(() => {
    return [...reportEvents]
      .sort((a, b) => (b.attendeeCount || 0) - (a.attendeeCount || 0))
      .slice(0, 5);
  }, [reportEvents]);

  const COLORS = ['#10b981', '#059669', '#34d399', '#047857', '#6ee7b7', '#065f46', '#06b6d4', '#84cc16'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Filters Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-black text-xl text-slate-900 tracking-tight text-center sm:text-left">Ecosystem Performance Reports</h3>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          {['7d', '30d', '90d', 'ytd'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                timeframe === tf ? "bg-white text-emerald-800 shadow-sm" : "text-slate-500 hover:text-slate-900"
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Revenue Over Time */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-black text-slate-900">Ecosystem Revenue Growth</h4>
              <p className="text-xs text-slate-500 font-medium">Aggregated ticket revenue over time</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesOverTime}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelFormatter={(val) => format(parseISO(val as string), 'MMMM d, yyyy')}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  name="Daily Revenue (RF)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Ticket Sales Over Time */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm group hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-black text-slate-900">Ticket Volume Trends</h4>
              <p className="text-xs text-slate-500 font-medium">Daily ticket acquisition volume</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesOverTime}>
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
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="sales" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  name="Tickets Sold"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Category Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Sales by Category</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categorySales}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categorySales.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  formatter={(val) => <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{val}</span>}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Pricing Model Distribution */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Pricing Mix (Free vs Paid)</h4>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pricingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f59e0b" />
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  iconType="circle"
                  formatter={(val) => <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{val}</span>}
                />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Events Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Top Performing Events (Revenue)</h4>
          <div className="space-y-4">
            {topEvents.map((evt, idx) => (
              <div key={evt.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[10px] font-black flex items-center justify-center shrink-0">#{idx + 1}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate">{evt.title}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{evt.organizer}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 block tabular-nums">RF {(evt.revenue || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{(evt.ticketsSold || 0)} tickets</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Attendance Events Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h4 className="font-black text-slate-900 mb-6 uppercase tracking-widest text-xs">Highest Attendance (Check-ins)</h4>
          <div className="space-y-4">
            {topAttendance.map((evt, idx) => (
              <div key={evt.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">#{idx + 1}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block truncate">{evt.title}</span>
                    <span className="text-[10px] text-slate-500 font-bold">{evt.venue}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-emerald-700 block tabular-nums">{(evt.attendeeCount || 0).toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Checked-in</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
