import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Receipt,
  DollarSign,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Filter,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { EnterpriseUser, EnterpriseTransaction, EnterpriseActivityLog } from '../../types/admin';
import { EventItem } from '../../types';

interface AdminDashboardOverviewProps {
  users: EnterpriseUser[];
  transactions: EnterpriseTransaction[];
  activityLogs: EnterpriseActivityLog[];
  onNavigateTab: (tab: any) => void;
  events: EventItem[];
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  users,
  transactions,
  activityLogs,
  onNavigateTab,
  events,
}) => {
  // Chart switchers & filters
  const [chartMetric, setChartMetric] = useState<'revenue' | 'transactions' | 'users'>('revenue');
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'year' | 'custom'>('month');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // Summary card calculations
  const totalUsersCount = 4820 + users.length - 10;
  const activeUsersCount = Math.round(totalUsersCount * 0.65);
  const totalBusinessesCount = 184;
  const totalTicketsSold = events.reduce((acc, e) => acc + (e.ticketsSold || 0), 0);
  const totalRevenueAmount = events.reduce((acc, e) => acc + (e.revenue || 0), 0);
  const pendingItemsCount = events.filter(e => e.status === 'Pending Approval').length;

  // Chart dataset based on selected metric
  const chartDatasets = {
    revenue: {
      label: 'Platform Gross Revenue (RWF)',
      unit: 'RWF',
      color: '#059669', // emerald
      gradientId: 'revGradient',
      data: [
        { label: 'Week 1', value: 28500000, display: '28.5M RWF', sub: '1,420 bookings' },
        { label: 'Week 2', value: 34200000, display: '34.2M RWF', sub: '1,890 bookings' },
        { label: 'Week 3', value: 41800000, display: '41.8M RWF', sub: '2,640 bookings' },
        { label: 'Week 4', value: 43750000, display: '43.7M RWF', sub: '2,810 bookings' },
      ],
      total: '148,250,000 RWF',
      growth: '+22.4%',
    },
    transactions: {
      label: 'Total Ticketing Transactions',
      unit: 'Transactions',
      color: '#2563eb', // blue
      gradientId: 'txGradient',
      data: [
        { label: 'Week 1', value: 2600, display: '2,600 orders', sub: '98.2% MoMo' },
        { label: 'Week 2', value: 3100, display: '3,100 orders', sub: '97.8% MoMo' },
        { label: 'Week 3', value: 3450, display: '3,450 orders', sub: '99.1% MoMo' },
        { label: 'Week 4', value: 3330, display: '3,330 orders', sub: '98.5% MoMo' },
      ],
      total: '12,480 Orders',
      growth: '+18.5%',
    },
    users: {
      label: 'Active Kigali App Users',
      unit: 'Users',
      color: '#7c3aed', // purple
      gradientId: 'usrGradient',
      data: [
        { label: 'Week 1', value: 3200, display: '3,200 active', sub: '420 new reg.' },
        { label: 'Week 2', value: 3800, display: '3,800 active', sub: '510 new reg.' },
        { label: 'Week 3', value: 4400, display: '4,400 active', sub: '680 new reg.' },
        { label: 'Week 4', value: 4820, display: '4,820 active', sub: '740 new reg.' },
      ],
      total: '4,820 Users',
      growth: '+14.2%',
    },
  };

  const currentChart = chartDatasets[chartMetric];
  const maxVal = Math.max(...currentChart.data.map((d) => d.value));

  // 6 Summary Cards definition
  const summaryCards = [
    {
      id: 'total-users',
      title: 'Total Users',
      value: totalUsersCount.toLocaleString(),
      change: '+12.5%',
      isPositive: true,
      comparison: 'vs. last month',
      icon: Users,
      iconColor: 'text-sky-700 bg-sky-50 border-sky-200',
      actionTab: 'users',
    },
    {
      id: 'active-users',
      title: 'Active Users',
      value: activeUsersCount.toLocaleString(),
      change: '+8.1%',
      isPositive: true,
      comparison: 'engaged this week',
      icon: UserCheck,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      actionTab: 'users',
    },
    {
      id: 'total-businesses',
      title: 'Total Businesses',
      value: totalBusinessesCount.toString(),
      change: '+14.2%',
      isPositive: true,
      comparison: 'registered venues',
      icon: Building2,
      iconColor: 'text-purple-700 bg-purple-50 border-purple-200',
      actionTab: 'businesses',
    },
    {
      id: 'total-transactions',
      title: 'Total Tickets Sold',
      value: totalTicketsSold.toLocaleString(),
      change: '+18.5%',
      isPositive: true,
      comparison: 'orders processed',
      icon: Receipt,
      iconColor: 'text-amber-700 bg-amber-50 border-amber-200',
      actionTab: 'transactions',
    },
    {
      id: 'revenue',
      title: 'Revenue Generated',
      value: `${(totalRevenueAmount / 1000000).toFixed(1)}M RWF`,
      change: '+22.4%',
      isPositive: true,
      comparison: 'vs. last 30 days',
      icon: DollarSign,
      iconColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      actionTab: 'reports',
    },
    {
      id: 'pending-items',
      title: 'Pending Items',
      value: pendingItemsCount.toString(),
      change: '-3.2%',
      isPositive: false,
      comparison: 'awaiting compliance',
      icon: AlertCircle,
      iconColor: 'text-rose-700 bg-rose-50 border-rose-200',
      actionTab: 'activity-logs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kigali Master Intelligence Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to the Executive Operations Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time telemetry, transaction flows, municipal security audits, and multi-tenant management.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('reports')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <span>Generate Executive Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (6 CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab(card.actionTab)}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-xl border ${card.iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span
                    className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                      card.isPositive
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {card.isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {card.change}
                  </span>
                </div>

                <div className="text-xs text-slate-500 font-semibold">{card.title}</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 tabular-nums">
                  {card.value}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate">{card.comparison}</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. INTERACTIVE MAIN ANALYTICS CHART & CONTROLS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xs">
        {/* Controls Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Telemetry &amp; Metrics
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <span>{currentChart.label}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {currentChart.growth}
              </span>
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Switcher (Revenue | Transactions | Users) */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setChartMetric('revenue')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'revenue'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Revenue
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('transactions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'transactions'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Transactions
              </button>
              <button
                type="button"
                onClick={() => setChartMetric('users')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMetric === 'users'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Users
              </button>
            </div>

            {/* Date Filters: Today | This Week | This Month | This Year | Custom Range */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              {(['today', 'week', 'month', 'year', 'custom'] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                    timeRange === range
                      ? 'bg-white text-emerald-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : range === 'year' ? 'This Year' : range === 'custom' ? 'Custom' : 'Today'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Large Visual Chart */}
        <div className="relative pt-6">
          <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-4 sm:gap-8 px-4 sm:px-8 border-b border-slate-200 pb-2">
            {currentChart.data.map((point, idx) => {
              const heightPct = Math.round((point.value / maxVal) * 85);
              const isHovered = hoveredDataPoint === idx;

              return (
                <div
                  key={point.label}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                  onMouseEnter={() => setHoveredDataPoint(idx)}
                  onMouseLeave={() => setHoveredDataPoint(null)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 bg-slate-900 text-white border border-slate-800 rounded-xl px-3 py-1.5 shadow-xl text-center pointer-events-none z-20 animate-in fade-in zoom-in-95">
                      <div className="text-xs font-bold text-white">{point.display}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{point.sub}</div>
                    </div>
                  )}

                  {/* Bar Visual with Glow */}
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full max-w-[56px] rounded-t-xl transition-all duration-300 relative ${
                      isHovered
                        ? 'bg-emerald-600 shadow-lg shadow-emerald-600/30'
                        : 'bg-emerald-500/80 hover:bg-emerald-600'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-xl" />
                  </div>

                  <span className="text-[11px] text-slate-600 font-semibold mt-3">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 px-2">
            <span>Baseline: Automated MoMo &amp; Card Gateway</span>
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
              <span className="text-slate-800 font-bold">Active Cycle: {currentChart.total}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 4. THREE SECONDARY CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: User Growth */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" />
              <span>User Growth</span>
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              +14.8% MoM
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Breakdown across registered accounts in Kigali.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                <span>Active Regular Users</span>
                <span className="font-bold text-slate-900">3,140 (65%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                <span>New Registrations (This Month)</span>
                <span className="font-bold text-slate-900">1,180 (25%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '25%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-medium">
                <span>Inactive Accounts</span>
                <span className="font-bold text-slate-900">500 (10%)</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Chart B: Business Activity */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-600" />
              <span>Business Activity</span>
            </h4>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
              184 Venues
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Active venues and event promoters by district.
          </p>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 font-medium">Gasabo (Remera &amp; Kimihurura)</span>
              <span className="font-bold text-slate-900">92 venues (50%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 font-medium">Nyarugenge (Downtown &amp; Nyamirambo)</span>
              <span className="font-bold text-slate-900">54 venues (29%)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 font-medium">Kicukiro (Gikondo &amp; Niboye)</span>
              <span className="font-bold text-slate-900">38 venues (21%)</span>
            </div>
          </div>
        </div>

        {/* Chart C: Transaction Breakdown */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              <span>Transaction Breakdown</span>
            </h4>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              98.2% Success
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Real-time status across 12,480 payment events.
          </p>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed</span>
              </div>
              <div className="text-lg font-black text-slate-900">94.8%</div>
              <div className="text-[10px] text-emerald-700 font-semibold">11,830 orders</div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending</span>
              </div>
              <div className="text-lg font-black text-slate-900">2.8%</div>
              <div className="text-[10px] text-amber-700 font-semibold">350 orders</div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Failed</span>
              </div>
              <div className="text-lg font-black text-slate-900">1.6%</div>
              <div className="text-[10px] text-rose-700 font-semibold">200 orders</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Cancelled</span>
              </div>
              <div className="text-lg font-black text-slate-900">0.8%</div>
              <div className="text-[10px] text-slate-600 font-semibold">100 orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY TABLE (Module 6 in prompt) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 tracking-tight">Recent Administrative Activity</h3>
            <p className="text-xs text-slate-600">Direct audit records from administrators, moderators, and automated tasks.</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('activity-logs')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Activity</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="pb-3 pr-4 font-semibold">User</th>
                <th className="pb-3 pr-4 font-semibold">Action</th>
                <th className="pb-3 pr-4 font-semibold">Module</th>
                <th className="pb-3 pr-4 font-semibold">Date &amp; Time</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activityLogs.slice(0, 5).map((log) => {
                let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                if (log.status === 'Active') badgeClass = 'bg-sky-50 text-sky-700 border-sky-200';
                if (log.status === 'Pending') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';
                if (log.status === 'Failed' || log.status === 'Cancelled') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={log.userAvatar}
                          alt={log.userName}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{log.userName}</div>
                          <div className="text-[10px] text-slate-500 font-medium">{log.userRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-slate-800">{log.action}</td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[10px]">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 text-slate-500 tabular-nums">{log.dateTime}</td>
                    <td className="py-3.5">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
