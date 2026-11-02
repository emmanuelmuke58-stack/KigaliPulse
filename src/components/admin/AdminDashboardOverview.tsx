import React, { useState } from 'react';
import {
  Users,
  Eye,
  Coins,
  Ticket,
  Building2,
  Calendar,
  ChevronDown,
  TrendingUp,
  Activity,
  ShieldCheck,
  Info,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Table as TableIcon,
  ArrowUpRight,
  Clock,
  Layers,
  Zap,
  Smartphone,
  Monitor,
  Tablet,
} from 'lucide-react';
import {
  EnterpriseUser,
  EnterpriseTransaction,
  EnterpriseActivityLog,
  EnterpriseBusiness,
} from '../../types/admin';

interface AdminDashboardOverviewProps {
  users: EnterpriseUser[];
  businesses?: EnterpriseBusiness[];
  transactions: EnterpriseTransaction[];
  activityLogs: EnterpriseActivityLog[];
  onNavigateTab: (tab: any) => void;
}

type PeriodFilter = 'today' | 'week' | 'month' | 'year' | 'custom';

interface PeriodDataset {
  periodLabel: string;
  totalUsers: number;
  newUsers: number;
  newUsersGrowth: string;
  totalVisits: number;
  uniqueVisits: number;
  uniqueVisitsRatio: string;
  platformRevenue: number; // in RWF
  platformRevenueDisplay: string;
  grossMerchantSales: string;
  ticketsSold: number;
  ticketDeliverySuccess: string;
  freePasses: number;
  trend: {
    period: string;
    visits: number;
    tickets: number;
  }[];
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  users,
  businesses = [],
  transactions,
  activityLogs,
  onNavigateTab,
}) => {
  // Executive Overview Period Filter
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('month');
  const [customStartDate, setCustomStartDate] = useState('2026-09-01');
  const [customEndDate, setCustomEndDate] = useState('2026-09-26');
  const [chartViewMode, setChartViewMode] = useState<'chart' | 'table'>('chart');
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  const [selectedBusinessFilter, setSelectedBusinessFilter] = useState<'all' | 'events' | 'tickets' | 'visits'>('all');

  // Multi-period datasets focused strictly on PLATFORM USAGE AND PLATFORM PERFORMANCE
  const periodDataMap: Record<PeriodFilter, PeriodDataset> = {
    today: {
      periodLabel: 'Today (Sep 26, 2026)',
      totalUsers: 12450,
      newUsers: 48,
      newUsersGrowth: '+3.8% vs yesterday',
      totalVisits: 3140,
      uniqueVisits: 2260,
      uniqueVisitsRatio: '72.0%',
      platformRevenue: 480000,
      platformRevenueDisplay: '480K RWF',
      grossMerchantSales: '7.8M RWF',
      ticketsSold: 365,
      ticketDeliverySuccess: '99.2%',
      freePasses: 42,
      trend: [
        { period: '06:00 – 09:00', visits: 420, tickets: 48 },
        { period: '09:00 – 12:00', visits: 780, tickets: 92 },
        { period: '12:00 – 15:00', visits: 910, tickets: 114 },
        { period: '15:00 – 18:00', visits: 1030, tickets: 111 },
      ],
    },
    week: {
      periodLabel: 'This Week',
      totalUsers: 12450,
      newUsers: 340,
      newUsersGrowth: '+12.4% vs last week',
      totalVisits: 13110,
      uniqueVisits: 8940,
      uniqueVisitsRatio: '68.2%',
      platformRevenue: 2450000,
      platformRevenueDisplay: '2.45M RWF',
      grossMerchantSales: '39.8M RWF',
      ticketsSold: 1910,
      ticketDeliverySuccess: '98.8%',
      freePasses: 115,
      trend: [
        { period: 'Day 1', visits: 1200, tickets: 180 },
        { period: 'Day 2', visits: 1450, tickets: 230 },
        { period: 'Day 3', visits: 1680, tickets: 290 },
        { period: 'Day 4', visits: 1920, tickets: 340 },
        { period: 'Day 5', visits: 2150, tickets: 385 },
        { period: 'Day 6', visits: 2480, tickets: 460 },
        { period: 'Day 7', visits: 2230, tickets: 395 },
      ],
    },
    month: {
      periodLabel: 'This Month',
      totalUsers: 12450,
      newUsers: 1180,
      newUsersGrowth: '+9.5% new registrations',
      totalVisits: 48920,
      uniqueVisits: 31450,
      uniqueVisitsRatio: '64.3%',
      platformRevenue: 8400000,
      platformRevenueDisplay: '8.4M RWF',
      grossMerchantSales: '148.2M RWF',
      ticketsSold: 3284,
      ticketDeliverySuccess: '98.4%',
      freePasses: 142,
      trend: [
        { period: 'Day 1', visits: 1200, tickets: 180 },
        { period: 'Day 2', visits: 1450, tickets: 230 },
        { period: 'Day 3', visits: 1680, tickets: 290 },
        { period: 'Day 4', visits: 1920, tickets: 340 },
        { period: 'Week 2', visits: 12450, tickets: 860 },
        { period: 'Week 3', visits: 13820, tickets: 910 },
        { period: 'Week 4', visits: 11850, tickets: 774 },
      ],
    },
    year: {
      periodLabel: 'This Year (2026)',
      totalUsers: 12450,
      newUsers: 4820,
      newUsersGrowth: '+63.2% YoY growth',
      totalVisits: 595000,
      uniqueVisits: 382000,
      uniqueVisitsRatio: '64.2%',
      platformRevenue: 94600000,
      platformRevenueDisplay: '94.6M RWF',
      grossMerchantSales: '1.68B RWF',
      ticketsSold: 40890,
      ticketDeliverySuccess: '98.6%',
      freePasses: 1840,
      trend: [
        { period: 'Q1 2026', visits: 112000, tickets: 7400 },
        { period: 'Q2 2026', visits: 138000, tickets: 9250 },
        { period: 'Q3 2026', visits: 165000, tickets: 11400 },
        { period: 'Q4 2026 (YTD)', visits: 180000, tickets: 12840 },
      ],
    },
    custom: {
      periodLabel: 'Custom Period',
      totalUsers: 12450,
      newUsers: 840,
      newUsersGrowth: '+8.1% in selected window',
      totalVisits: 36400,
      uniqueVisits: 24100,
      uniqueVisitsRatio: '66.2%',
      platformRevenue: 6200000,
      platformRevenueDisplay: '6.2M RWF',
      grossMerchantSales: '112.5M RWF',
      ticketsSold: 2540,
      ticketDeliverySuccess: '98.5%',
      freePasses: 98,
      trend: [
        { period: 'Period Block 1', visits: 7200, tickets: 480 },
        { period: 'Period Block 2', visits: 8900, tickets: 610 },
        { period: 'Period Block 3', visits: 10400, tickets: 740 },
        { period: 'Period Block 4', visits: 9900, tickets: 710 },
      ],
    },
  };

  const activeData = periodDataMap[selectedPeriod];

  // TOP BUSINESSES USING THE PLATFORM
  // STRICT RULE: Rank businesses based on PLATFORM USAGE/ACTIVITY signals, NOT sales or revenue.
  // Signals: Events created, Events published, Platform visits, Ticket activity, Platform engagement.
  const topPlatformBusinesses = [
    {
      rank: 1,
      id: 'biz-rg-consult',
      name: 'RG Consult Inc',
      category: 'Festivals & Live Music',
      totalActivities: 245,
      eventsCreated: 22,
      eventsPublished: 18,
      platformVisits: 8450,
      ticketActivityCount: 142,
      checkInsScanned: 85,
      engagementScore: 98,
      primarySignal: '18 published · 142 tickets processed · 85 check-ins',
      status: 'Active',
    },
    {
      rank: 2,
      id: 'biz-innovate-rw',
      name: 'Innovate Rwanda Hub',
      category: 'Technology & Startups',
      totalActivities: 198,
      eventsCreated: 15,
      eventsPublished: 12,
      platformVisits: 6200,
      ticketActivityCount: 114,
      checkInsScanned: 72,
      engagementScore: 94,
      primarySignal: '12 summits hosted · 114 delegate passes · 72 RSVPs',
      status: 'Active',
    },
    {
      rank: 3,
      id: 'biz-inema-arts',
      name: 'Inema Arts Collective',
      category: 'Arts, Culture & Heritage',
      totalActivities: 174,
      eventsCreated: 28,
      eventsPublished: 24,
      platformVisits: 5800,
      ticketActivityCount: 96,
      checkInsScanned: 54,
      engagementScore: 91,
      primarySignal: '24 galleries & showcases · 96 craft passes · 54 workshop signups',
      status: 'Active',
    },
    {
      rank: 4,
      id: 'biz-bk-arena',
      name: 'QA Venue Solutions (BK Arena)',
      category: 'Stadium & Arena',
      totalActivities: 162,
      eventsCreated: 11,
      eventsPublished: 8,
      platformVisits: 14200,
      ticketActivityCount: 110,
      checkInsScanned: 44,
      engagementScore: 89,
      primarySignal: '8 championship games · 110 gate validations · 44 scans',
      status: 'Active',
    },
    {
      rank: 5,
      id: 'biz-kigali-food',
      name: 'Kigali Food & Nightlife Society',
      category: 'Food, Dining & Nightlife',
      totalActivities: 138,
      eventsCreated: 19,
      eventsPublished: 16,
      platformVisits: 4900,
      ticketActivityCount: 82,
      checkInsScanned: 40,
      engagementScore: 86,
      primarySignal: '16 crawls & tastings · 82 reservations · 40 city guides',
      status: 'Active',
    },
    {
      rank: 6,
      id: 'biz-norrsken',
      name: 'Norrsken Foundation East Africa',
      category: 'Innovation Campus',
      totalActivities: 124,
      eventsCreated: 16,
      eventsPublished: 14,
      platformVisits: 4400,
      ticketActivityCount: 68,
      checkInsScanned: 42,
      engagementScore: 84,
      primarySignal: '14 founder sessions · 68 investor passes · 42 check-ins',
      status: 'Active',
    },
  ];

  // Chart max value calculations for proportional height
  const maxVisitsVal = Math.max(...activeData.trend.map((t) => t.visits));
  const maxTicketsVal = Math.max(...activeData.trend.map((t) => t.tickets));

  return (
    <div className="space-y-6">
      
      {/* ────────────────────────────────────────────────────────
          EXECUTIVE OVERVIEW HEADER & PERIOD SELECTOR
          ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb style badge as requested */}
          <div className="flex items-center gap-2 text-xs font-black tracking-wider text-emerald-700 uppercase mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 font-extrabold">
              ADMIN SUITE
            </span>
            <span className="text-slate-300 font-normal">/</span>
            <span className="text-slate-600 font-bold">Dashboard / Executive Overview</span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Executive Overview</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Platform Telemetry
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Strictly focused on <strong>platform usage and platform performance</strong> across all Kigali events, registered users, and marketplace activity.
          </p>
        </div>

        {/* Date Filter Dropdown [ Date: This Month ▼ ] */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-3.5 py-2 transition-colors cursor-pointer group shadow-2xs">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs text-slate-500 font-semibold">Date:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as PeriodFilter)}
                className="bg-transparent text-xs font-black text-slate-900 focus:outline-none cursor-pointer pr-1"
                aria-label="Filter Executive Overview by period"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Period</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-colors pointer-events-none" />
            </div>
          </div>

          {/* Quick period indicator pill */}
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline-block">
            {activeData.periodLabel}
          </span>
        </div>
      </div>

      {/* Custom Date Pickers (only shown when 'custom' is active) */}
      {selectedPeriod === 'custom' && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center gap-4 text-xs animate-in fade-in">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Custom Date Range:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-500">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-semibold"
            />
          </div>
          <span className="text-[11px] text-slate-500 ml-auto italic">
            Metrics re-indexed for custom window
          </span>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          ROW 1: 3 TOP KPI CARDS
          1. Total Platform Users
          2. Total Visits
          3. Total Revenue (distinguished from business sales)
          ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* CARD 1: Total Platform Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-600" />
                {activeData.newUsersGrowth}
              </span>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Platform Users
            </div>
            
            <div className="text-3xl font-black text-slate-900 tracking-tight mt-1 tabular-nums">
              {activeData.totalUsers.toLocaleString()}
            </div>

            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Total registered users across event attendees, verified organizers, and administrators.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
              New users indicator:
            </span>
            <strong className="text-slate-900 tabular-nums font-black">
              +{activeData.newUsers.toLocaleString()} new
            </strong>
          </div>
        </div>

        {/* CARD 2: Total Visits */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {activeData.uniqueVisitsRatio} unique ratio
              </span>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Visits
            </div>
            
            <div className="text-3xl font-black text-slate-900 tracking-tight mt-1 tabular-nums">
              {activeData.totalVisits.toLocaleString()}
            </div>

            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Total visits to the platform and event marketplace across web and mobile experiences.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Unique visits:
            </span>
            <strong className="text-slate-900 tabular-nums font-black">
              {activeData.uniqueVisits.toLocaleString()} unique
            </strong>
          </div>
        </div>

        {/* CARD 3: Total Revenue (Platform Revenue - Clearly Distinguished) */}
        <div
          onClick={() => onNavigateTab('reports')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                Platform Take Rate: ~5.6%
              </span>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Platform Revenue
            </div>
            
            <div className="text-3xl font-black text-slate-900 tracking-tight mt-1 tabular-nums">
              {activeData.platformRevenueDisplay}
            </div>

            {/* Clear distinction notice required by user brief */}
            <div className="mt-2 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 leading-snug flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Platform revenue only</strong> (commission &amp; service fees). Distinct from merchant gross sales ({activeData.grossMerchantSales}).
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Gross Event Volume (Reference):</span>
            <strong className="text-slate-700 tabular-nums font-bold">
              {activeData.grossMerchantSales}
            </strong>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          ROW 2:
          - Tickets Sold (Left, 1 Col)
          - Top Businesses Using the Platform (Right, 2 Cols)
          ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* CARD 4: Tickets Sold (Takes 1 Col) */}
        <div
          onClick={() => onNavigateTab('transactions')}
          className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {activeData.ticketDeliverySuccess} automated
              </span>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tickets Sold
            </div>
            
            <div className="text-3xl font-black text-slate-900 tracking-tight mt-1 tabular-nums">
              {activeData.ticketsSold.toLocaleString()}
            </div>

            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Total event tickets, admission passes, and registrations issued directly through the platform.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">Mobile Money / Card Checkout:</span>
                <span className="font-bold text-slate-900">92.4%</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
                <span className="text-slate-600">Free / Community RSVP Passes:</span>
                <span className="font-bold text-slate-900">{activeData.freePasses} passes</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold group-hover:text-emerald-800">
            <span>View All Ticket Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* CARD 5: Top Businesses Using the Platform (Takes 2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          
          {/* Card Header & Important Rule Notice */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Top Businesses Using the Platform
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ranked strictly by <strong>platform usage &amp; activity signals</strong> (events created, published, platform visits, ticket activity, engagement).
              </p>
            </div>

            {/* Non-sales badge clarification */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-bold self-start sm:self-auto shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ranked by Platform Activity (Not Sales)</span>
            </div>
          </div>

          {/* Explicit Filter Rule Callout */}
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Executive Ranking Principle:</strong> Ranks businesses using the platform based on system engagement, events managed, and visitor interactions. <strong>Sales volume and merchant revenue are excluded from ranking.</strong>
            </div>
          </div>

          {/* Businesses Usage List */}
          <div className="divide-y divide-slate-100">
            {topPlatformBusinesses.map((biz) => {
              const maxActivities = 245;
              const barPct = Math.round((biz.totalActivities / maxActivities) * 100);

              return (
                <div
                  key={biz.id}
                  onClick={() => onNavigateTab('businesses')}
                  className="py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    {/* Rank Circle */}
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center shrink-0 ${
                        biz.rank === 1
                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                          : biz.rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : biz.rank === 3
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {biz.rank}
                    </span>

                    {/* Business Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                          {biz.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/80 shrink-0 hidden sm:inline-block">
                          {biz.category}
                        </span>
                      </div>
                      
                      {/* Activity breakdown signals */}
                      <div className="text-[11px] text-slate-500 mt-0.5 font-medium flex items-center gap-2">
                        <span className="text-emerald-700 font-bold">{biz.primarySignal}</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Metric Count & Visual Bar */}
                  <div className="flex items-center gap-4 shrink-0 sm:text-right pl-10 sm:pl-0">
                    <div className="w-24 sm:w-32 hidden sm:block">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${barPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-slate-900 tabular-nums">
                        {biz.totalActivities} activities
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        Score {biz.engagementScore}/100
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Showing top 6 most active businesses across {activeData.periodLabel}</span>
            <button
              type="button"
              onClick={() => onNavigateTab('businesses')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Businesses</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          ROW 3: PLATFORM ACTIVITY OVER TIME (VISITS / TICKETS TREND CHART)
          Exact table data requested:
          period | visits | tickets
          Day 1  | 1,200  | 180
          Day 2  | 1,450  | 230
          Day 3  | 1,680  | 290
          Day 4  | 1,920  | 340
          ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Platform Activity Over Time
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Track overall platform visits and ticket activity across the selected period (answers <em>"How is the platform being used?"</em>).
            </p>
          </div>

          {/* Toggle between Dual Chart & Structured Data Table */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setChartViewMode('chart')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chartViewMode === 'chart'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Trend Chart</span>
              </button>
              <button
                type="button"
                onClick={() => setChartViewMode('table')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  chartViewMode === 'table'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Data Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legend Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
              <span>Platform Visits ({activeData.totalVisits.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <span className="w-3 h-3 rounded bg-sky-600 inline-block" />
              <span>Event Tickets ({activeData.ticketsSold.toLocaleString()})</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Active Cycle: <strong className="text-slate-800">{activeData.periodLabel}</strong>
          </div>
        </div>

        {/* VIEW 1: DUAL BAR / COLUMN TREND CHART */}
        {chartViewMode === 'chart' ? (
          <div className="pt-4">
            <div className="h-64 sm:h-72 w-full flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-slate-200 pb-2">
              {activeData.trend.map((point, idx) => {
                const visitsHeightPct = Math.round((point.visits / maxVisitsVal) * 85);
                const ticketsHeightPct = Math.round((point.tickets / maxTicketsVal) * 85);
                const isHovered = hoveredTrendIdx === idx;
                const conversionRatio = ((point.tickets / point.visits) * 100).toFixed(1);

                return (
                  <div
                    key={point.period}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredTrendIdx(idx)}
                    onMouseLeave={() => setHoveredTrendIdx(null)}
                  >
                    {/* Hover Floating Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-16 bg-slate-900 text-white border border-slate-800 rounded-xl px-3.5 py-2 shadow-2xl text-center pointer-events-none z-30 min-w-[130px] animate-in fade-in zoom-in-95">
                        <div className="text-[11px] font-black text-slate-200 border-b border-slate-800 pb-1 mb-1">
                          {point.period}
                        </div>
                        <div className="flex items-center justify-between text-xs gap-3">
                          <span className="text-emerald-400 font-bold">Visits:</span>
                          <span className="font-extrabold tabular-nums">{point.visits.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs gap-3">
                          <span className="text-sky-400 font-bold">Tickets:</span>
                          <span className="font-extrabold tabular-nums">{point.tickets.toLocaleString()}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 pt-1 mt-1 border-t border-slate-800 text-right">
                          Ratio: {conversionRatio}%
                        </div>
                      </div>
                    )}

                    {/* Dual Column Bars */}
                    <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 w-full max-w-[80px]">
                      {/* Visits Bar (Emerald) */}
                      <div
                        style={{ height: `${visitsHeightPct}%` }}
                        className={`w-1/2 rounded-t-lg transition-all duration-300 relative ${
                          isHovered ? 'bg-emerald-600 shadow-md shadow-emerald-600/30' : 'bg-emerald-500'
                        }`}
                        title={`${point.period} Visits: ${point.visits}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg" />
                      </div>

                      {/* Tickets Bar (Sky Blue) */}
                      <div
                        style={{ height: `${ticketsHeightPct}%` }}
                        className={`w-1/2 rounded-t-lg transition-all duration-300 relative ${
                          isHovered ? 'bg-sky-600 shadow-md shadow-sky-600/30' : 'bg-sky-500'
                        }`}
                        title={`${point.period} Tickets: ${point.tickets}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-lg" />
                      </div>
                    </div>

                    {/* X-Axis Label */}
                    <span className="text-[11px] font-bold text-slate-600 mt-3 truncate max-w-[70px] sm:max-w-none text-center">
                      {point.period}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 px-2">
              <span>Telemetry Source: In-app session telemetry &amp; live ticketing dispatcher</span>
              <span className="font-semibold text-slate-700">
                Peak Day Ratio: 23.9% ticket engagement per visit
              </span>
            </div>
          </div>
        ) : (
          /* VIEW 2: STRUCTURED DATA TABLE (Matching exact user sample table) */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3 px-4 rounded-l-xl">Period</th>
                  <th className="py-3 px-4">Visits</th>
                  <th className="py-3 px-4">Tickets</th>
                  <th className="py-3 px-4">Tickets / Visits Ratio</th>
                  <th className="py-3 px-4 rounded-r-xl text-right">Activity Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeData.trend.map((row) => {
                  const ratio = ((row.tickets / row.visits) * 100).toFixed(1);
                  return (
                    <tr key={row.period} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {row.period}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800 tabular-nums">
                        {row.visits.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-sky-800 tabular-nums">
                        {row.tickets.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 tabular-nums">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold">
                          {ratio}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          High platform traffic
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────
          ROW 4: PLATFORM PERFORMANCE & SYSTEM TELEMETRY
          Answering "How is the platform being used and performing?"
          ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Widget 1: System Health & Reliability */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Platform Health &amp; Latency</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Normal (99.98%)
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Core API Latency</span>
              <span className="font-black text-slate-900 tabular-nums">210 ms</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">MoMo Webhook Delivery</span>
              <span className="font-black text-slate-900 tabular-nums">99.4%</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-600 font-medium">Concurrent Active Sessions</span>
              <span className="font-black text-slate-900 tabular-nums">428 sessions</span>
            </div>
          </div>
        </div>

        {/* Widget 2: Platform Usage by Event Category */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Usage by Event Category</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              Browse Volume
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-slate-600 mb-1 font-semibold">
                <span>Music, Festivals &amp; Concerts</span>
                <span className="font-black text-slate-900">32%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1 font-semibold">
                <span>Technology, AI &amp; Summits</span>
                <span className="font-black text-slate-900">26%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1 font-semibold">
                <span>Sports, Basketball &amp; Fitness</span>
                <span className="font-black text-slate-900">18%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-600 mb-1 font-semibold">
                <span>Food, Nightlife &amp; Arts</span>
                <span className="font-black text-slate-900">24%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '24%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Platform Access Channels */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-sky-600" />
              <span>Platform Access Channels</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-500">
              Clients
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                Mobile Web (Smartphones)
              </span>
              <span className="font-black text-slate-900">68.4%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                Desktop Workstations
              </span>
              <span className="font-black text-slate-900">24.2%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="flex items-center gap-2 text-slate-700 font-semibold">
                <Tablet className="w-3.5 h-3.5 text-slate-500" />
                Tablets &amp; Kiosks
              </span>
              <span className="font-black text-slate-900">7.4%</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
