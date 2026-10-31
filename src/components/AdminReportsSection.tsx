import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Share2,
  Printer,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  MousePointerClick,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Sparkles,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Activity,
  FileText,
  RefreshCw,
  Building2,
  Layers,
  ChevronRight,
  Check,
} from 'lucide-react';
import { EventItem } from '../types';

interface AdminReportsSectionProps {
  events: EventItem[];
}

type TimeframeOption = 'today' | '7d' | '30d' | '90d' | 'ytd';
type DistrictOption = 'all' | 'Gasabo' | 'Nyarugenge' | 'Kicukiro';

export const AdminReportsSection: React.FC<AdminReportsSectionProps> = ({ events }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictOption>('all');
  const [activeReportSubTab, setActiveReportSubTab] = useState<'overview' | 'geography' | 'categories' | 'organizers' | 'moderation-sla'>('overview');
  const [copiedToast, setCopiedToast] = useState(false);

  // Dynamic multipliers based on timeframe
  const timeframeMultiplier = useMemo(() => {
    switch (timeframe) {
      case 'today':
        return 0.05;
      case '7d':
        return 0.28;
      case '30d':
        return 1.0;
      case '90d':
        return 2.75;
      case 'ytd':
        return 6.4;
      default:
        return 1.0;
    }
  }, [timeframe]);

  const timeframeLabels: Record<TimeframeOption, string> = {
    today: 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Quarter 3 (Last 90 Days)',
    ytd: 'Year to Date (2026)',
  };

  // Base metrics
  const totalViews = Math.round(194820 * timeframeMultiplier);
  const totalTicketClicks = Math.round(34180 * timeframeMultiplier);
  const ctrRate = ((totalTicketClicks / totalViews) * 100).toFixed(1);
  const totalSaves = Math.round(18640 * timeframeMultiplier);
  const newExplorers = Math.round(1240 * timeframeMultiplier);
  const baseRevenueRF = Math.round(1620000 * timeframeMultiplier);
  const grossTicketValueRF = Math.round(86450000 * timeframeMultiplier);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (selectedDistrict === 'all') return events;
    return events.filter((e) => e.district === selectedDistrict);
  }, [events, selectedDistrict]);

  // District distribution data
  const districtData = [
    {
      name: 'Gasabo District',
      neighborhoods: 'Kimihurura, Kacyiru, Remera, Gisozi',
      eventsCount: Math.round(events.filter((e) => e.district === 'Gasabo').length || 7),
      sharePercent: 52,
      views: Math.round(101300 * timeframeMultiplier),
      avgPrice: 'RF 18,500',
      popularVenues: ['Kigali Convention Centre', 'BK Arena', 'Inema Arts Center'],
      vibe: 'Diplomatic, Large Arenas & Contemporary Arts',
      growth: '+31.4%',
    },
    {
      name: 'Nyarugenge District',
      neighborhoods: 'Downtown, Kiyovu, Nyamirambo, Muhima',
      eventsCount: Math.round(events.filter((e) => e.district === 'Nyarugenge').length || 4),
      sharePercent: 32,
      views: Math.round(62340 * timeframeMultiplier),
      avgPrice: 'RF 12,000',
      popularVenues: ['Hotel des Mille Collines', 'Camp Kigali Tent', 'Biryogo Car-Free Zone'],
      vibe: 'Heritage, Nightlife, Culinary & Civic Gatherings',
      growth: '+22.8%',
    },
    {
      name: 'Kicukiro District',
      neighborhoods: 'Gikondo, Kagarama, Niboye, Kanombe',
      eventsCount: Math.round(events.filter((e) => e.district === 'Kicukiro').length || 3),
      sharePercent: 16,
      views: Math.round(31180 * timeframeMultiplier),
      avgPrice: 'RF 7,500',
      popularVenues: ['Expo Ground Gikondo', 'IPRC Kigali Sports Complex'],
      vibe: 'Trade Expos, Sports Tournaments & Tech Communities',
      growth: '+14.2%',
    },
  ];

  // Category demand analytics
  const categoryStats = [
    {
      name: 'Music & Concerts',
      icon: '🎵',
      share: 34,
      views: Math.round(66240 * timeframeMultiplier),
      clicks: Math.round(14120 * timeframeMultiplier),
      ctr: '21.3%',
      topEvent: 'Kigali Summer Jazz Festival',
      color: 'bg-emerald-500',
    },
    {
      name: 'Nightlife & Parties',
      icon: '🎉',
      share: 22,
      views: Math.round(42860 * timeframeMultiplier),
      clicks: Math.round(8940 * timeframeMultiplier),
      ctr: '20.8%',
      topEvent: 'Afro-Beats Night at Cocobean',
      color: 'bg-indigo-500',
    },
    {
      name: 'Business & Networking',
      icon: '💼',
      share: 18,
      views: Math.round(35070 * timeframeMultiplier),
      clicks: Math.round(5210 * timeframeMultiplier),
      ctr: '14.8%',
      topEvent: 'East Africa Tech & Fintech Summit 2026',
      color: 'bg-blue-500',
    },
    {
      name: 'Food & Drinks',
      icon: '🍽',
      share: 12,
      views: Math.round(23380 * timeframeMultiplier),
      clicks: Math.round(3120 * timeframeMultiplier),
      ctr: '13.3%',
      topEvent: 'Kigali Culinary & Coffee Experience',
      color: 'bg-amber-500',
    },
    {
      name: 'Arts & Culture',
      icon: '🎭',
      share: 8,
      views: Math.round(15580 * timeframeMultiplier),
      clicks: Math.round(1840 * timeframeMultiplier),
      ctr: '11.8%',
      topEvent: 'Imigongo & Contemporary Art Expo',
      color: 'bg-rose-500',
    },
    {
      name: 'Sports & Wellness',
      icon: '⚽',
      share: 6,
      views: Math.round(11690 * timeframeMultiplier),
      clicks: Math.round(950 * timeframeMultiplier),
      ctr: '8.1%',
      topEvent: 'Kigali Night Run & Community 10K',
      color: 'bg-teal-500',
    },
  ];

  // Top Organizers Performance
  const topOrganizers = [
    {
      name: 'Kigali Jazz Junction',
      category: 'Music & Festivals',
      eventsHosted: 6,
      totalViews: Math.round(48500 * timeframeMultiplier),
      outboundClicks: Math.round(9800 * timeframeMultiplier),
      avgRating: 4.9,
      verified: true,
      slaScore: '99.2%',
    },
    {
      name: 'Intore Entertainment',
      category: 'Concerts & Mega Shows',
      eventsHosted: 4,
      totalViews: Math.round(62100 * timeframeMultiplier),
      outboundClicks: Math.round(12400 * timeframeMultiplier),
      avgRating: 4.8,
      verified: true,
      slaScore: '97.5%',
    },
    {
      name: 'Rwanda Convention Bureau (RCB)',
      category: 'Conferences & Summits',
      eventsHosted: 8,
      totalViews: Math.round(39400 * timeframeMultiplier),
      outboundClicks: Math.round(5900 * timeframeMultiplier),
      avgRating: 5.0,
      verified: true,
      slaScore: '100%',
    },
    {
      name: 'Impact Hub Kigali',
      category: 'Innovation & Workshops',
      eventsHosted: 11,
      totalViews: Math.round(21200 * timeframeMultiplier),
      outboundClicks: Math.round(3400 * timeframeMultiplier),
      avgRating: 4.9,
      verified: true,
      slaScore: '98.8%',
    },
    {
      name: 'Inema Arts Center',
      category: 'Visual Arts & Cultural Evenings',
      eventsHosted: 9,
      totalViews: Math.round(16800 * timeframeMultiplier),
      outboundClicks: Math.round(2150 * timeframeMultiplier),
      avgRating: 4.9,
      verified: true,
      slaScore: '96.0%',
    },
  ];

  // Moderation Quality & SLA Metrics
  const moderationStats = {
    totalSubmissions: Math.round(114 * timeframeMultiplier),
    approvedCount: Math.round(98 * timeframeMultiplier),
    approvalRate: 86.0,
    changesRequested: Math.round(11 * timeframeMultiplier),
    rejections: Math.round(5 * timeframeMultiplier),
    avgTurnaroundHours: 2.1,
    targetSLA: '< 4.0h',
    reportedSpamCount: 0,
    complianceAuditScore: '99.4%',
  };

  // Export handlers
  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        ['KigaliPulse Platform Analytics Report', timeframeLabels[timeframe]],
        ['Generated At', new Date().toISOString()],
        [''],
        ['Metric', 'Value'],
        ['Total Platform Views', totalViews],
        ['Ticket Outbound Clicks', totalTicketClicks],
        ['Conversion Rate (CTR)', `${ctrRate}%`],
        ['Total Event Bookmark Saves', totalSaves],
        ['New Explorer Accounts', newExplorers],
        ['Ad & Promotion Revenue (RWF)', `RF ${baseRevenueRF.toLocaleString()}`],
        ['Gross Ticket Value Influenced (RWF)', `RF ${grossTicketValueRF.toLocaleString()}`],
        ['Average Moderation SLA', `${moderationStats.avgTurnaroundHours} hours`],
        ['Moderation Approval Rate', `${moderationStats.approvalRate}%`],
        [''],
        ['District', 'Share (%)', 'Events Count', 'Period Views'],
        ...districtData.map((d) => [d.name, `${d.sharePercent}%`, d.eventsCount, d.views]),
        [''],
        ['Category', 'Share (%)', 'Views', 'Outbound Clicks', 'CTR'],
        ...categoryStats.map((c) => [c.name, `${c.share}%`, c.views, c.clicks, c.ctr]),
      ]
        .map((row) => row.join(','))
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kigalipulse_admin_report_${timeframe}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const summaryText = `*KigaliPulse Platform Executive Report (${timeframeLabels[timeframe]})*
• Total Discovery Views: ${totalViews.toLocaleString()}
• Outbound Ticket Clicks: ${totalTicketClicks.toLocaleString()} (${ctrRate}% CTR)
• Influenced Ticket Value: RF ${grossTicketValueRF.toLocaleString()}
• Promotion Revenue: RF ${baseRevenueRF.toLocaleString()}
• Top District: Gasabo (52% share, Kimihurura & Remera)
• Top Category: Music & Concerts (34% share)
• Review SLA: ${moderationStats.avgTurnaroundHours}h avg turnaround (${moderationStats.approvalRate}% approval rate)`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summaryText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <BarChart3 className="w-3 h-3" /> Comprehensive Analytics
              </span>
              <span className="text-xs text-slate-500 font-medium">Updated live for Kigali, Rwanda</span>
            </div>
            <h2 className="font-display text-2xl font-black text-slate-900 mt-1">
              Admin Discovery &amp; Platform Intelligence Report
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring of event engagement, attendee conversion, geographic density across Kigali, and organizer SLAs.
            </p>
          </div>

          {/* Action Buttons: Export & Share */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShareSummary}
              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Copy executive summary to clipboard"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedToast ? 'Copied!' : 'Share Summary'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:flex px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold items-center gap-1.5 transition-colors"
              title="Print executive report"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Download CSV dataset"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters Row: Timeframe, District */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {(['today', '7d', '30d', '90d', 'ytd'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === 'today'
                  ? 'Today'
                  : tf === '7d'
                  ? '7 Days'
                  : tf === '30d'
                  ? '30 Days'
                  : tf === '90d'
                  ? 'Quarter'
                  : 'YTD 2026'}
              </button>
            ))}
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> District:
            </span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as DistrictOption)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">All Kigali Districts</option>
              <option value="Gasabo">Gasabo (Convention, Arena, Arts)</option>
              <option value="Nyarugenge">Nyarugenge (Downtown, Kiyovu)</option>
              <option value="Kicukiro">Kicukiro (Expos &amp; Sports)</option>
            </select>
          </div>
        </div>

        {/* Sub-tab navigation inside reports */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-xs font-bold border-b border-slate-100 pb-2">
          <button
            type="button"
            onClick={() => setActiveReportSubTab('overview')}
            className={`pb-1 px-1 whitespace-nowrap transition-colors relative ${
              activeReportSubTab === 'overview'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Executive Summary
          </button>
          <button
            type="button"
            onClick={() => setActiveReportSubTab('geography')}
            className={`pb-1 px-1 whitespace-nowrap transition-colors relative ${
              activeReportSubTab === 'geography'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Kigali Neighborhood Breakdown
          </button>
          <button
            type="button"
            onClick={() => setActiveReportSubTab('categories')}
            className={`pb-1 px-1 whitespace-nowrap transition-colors relative ${
              activeReportSubTab === 'categories'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Category Demand &amp; CTR
          </button>
          <button
            type="button"
            onClick={() => setActiveReportSubTab('organizers')}
            className={`pb-1 px-1 whitespace-nowrap transition-colors relative ${
              activeReportSubTab === 'organizers'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Top Organizers &amp; Promoters
          </button>
          <button
            type="button"
            onClick={() => setActiveReportSubTab('moderation-sla')}
            className={`pb-1 px-1 whitespace-nowrap transition-colors relative ${
              activeReportSubTab === 'moderation-sla'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Quality &amp; Moderation SLAs
          </button>
        </div>
      </div>

      {/* KPI TILES (6 Core Pillars) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Discovery Views</span>
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +28.4% MoM
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Outbound Clicks</span>
            <MousePointerClick className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalTicketClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            CTR: <span className="text-blue-700 font-bold">{ctrRate}%</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Influenced GMV</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-slate-900 tabular-nums truncate" title={`RF ${grossTicketValueRF.toLocaleString()}`}>
            RF {(grossTicketValueRF / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Ticket sales value</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Ad &amp; Promo Yield</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 tabular-nums truncate">
            RF {(baseRevenueRF / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> +18.2% pacing
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Bookmark Saves</span>
            <Users className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {totalSaves.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Personal calendars</div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Avg Review SLA</span>
            <Clock className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">
            {moderationStats.avgTurnaroundHours}h
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3" /> Within {moderationStats.targetSLA} SLA
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: EXECUTIVE SUMMARY */}
      {activeReportSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Main 2-column Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Platform Funnel & Growth Dynamics */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Event Discovery-to-Attendance Conversion Funnel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Flow of Kigali residents and visitors from browsing to outbound ticket booking.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {timeframeLabels[timeframe]}
                </span>
              </div>

              {/* Conversion Stages */}
              <div className="space-y-4">
                {/* Stage 1: Page Impressions */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">1. Homepage &amp; Category Explorations</span>
                    <span className="text-slate-900 font-black tabular-nums">{totalViews.toLocaleString()} views (100%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-600 h-3 rounded-full w-full" />
                  </div>
                </div>

                {/* Stage 2: Event Detail Views */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">2. Event Details Modal Opened</span>
                    <span className="text-slate-900 font-black tabular-nums">{Math.round(totalViews * 0.44).toLocaleString()} opens (44.0%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-emerald-500 h-3 rounded-full w-[44%]" />
                  </div>
                </div>

                {/* Stage 3: Bookmark / Save */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">3. Saved to My Kigali Events</span>
                    <span className="text-slate-900 font-black tabular-nums">{totalSaves.toLocaleString()} saves (9.6%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-amber-500 h-3 rounded-full w-[24%]" />
                  </div>
                </div>

                {/* Stage 4: Outbound Ticket Click */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">4. Outbound Ticket Link Clicked</span>
                    <span className="text-slate-900 font-black tabular-nums">{totalTicketClicks.toLocaleString()} bookings initiated ({ctrRate}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-blue-600 h-3 rounded-full w-[17.5%]" />
                  </div>
                </div>
              </div>

              {/* Kigali Market Observations */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>KigaliPulse Strategic Observation</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ticket intent is highest for Friday night events in <strong>Kimihurura</strong> and Sunday daytime cultural exhibitions in <strong>Kacyiru</strong>. Outbound ticket referral conversion reached a record <strong>{ctrRate}%</strong>, with MoMo Pay and Airtel Money links experiencing lowest bounce rates.
                </p>
              </div>
            </div>

            {/* Right Column: Platform Health & Trust */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <h3 className="font-bold text-base text-slate-900">Platform Governance Scorecard</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">SLA Turnaround</span>
                    <span className="text-[11px] text-slate-400">Target &lt; 4 hours</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700 tabular-nums">
                    {moderationStats.avgTurnaroundHours} hrs
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Listing Approval Rate</span>
                    <span className="text-[11px] text-slate-400">Criteria compliance</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 tabular-nums">
                    {moderationStats.approvalRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Verified Organizers</span>
                    <span className="text-[11px] text-slate-400">KYC &amp; phone validated</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 tabular-nums">84 partners</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Spam / Scam Reports</span>
                    <span className="text-[11px] text-slate-400">Fraud prevention guard</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700 tabular-nums">0 active flags</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">System Availability</span>
                    <span className="text-[11px] text-slate-400">Cloud Run uptime</span>
                  </div>
                  <span className="text-sm font-black text-emerald-700 tabular-nums">99.98%</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                    All published events hold verified ticketing destination addresses and comply with Rwanda National Police public event permit regulations.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* District Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {districtData.map((dist) => (
              <div key={dist.name} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-black text-slate-900">{dist.name}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{dist.neighborhoods}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {dist.growth}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Share</span>
                    <span className="font-bold text-slate-900">{dist.sharePercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Views</span>
                    <span className="font-bold text-slate-900 tabular-nums">{dist.views.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg Ticket</span>
                    <span className="font-bold text-slate-900 text-[11px]">{dist.avgPrice}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Hubs: </span>
                  {dist.popularVenues.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: KIGALI NEIGHBORHOOD BREAKDOWN */}
      {activeReportSubTab === 'geography' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Geographic Event Distribution Across Kigali</h3>
              <p className="text-xs text-slate-500">
                Density, ticket velocity, and average admission price across Kigali’s three districts.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
              Total {events.length} active listings mapped
            </span>
          </div>

          <div className="space-y-6">
            {districtData.map((d) => (
              <div key={d.name} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                      <p className="text-xs text-slate-500">{d.neighborhoods} · {d.vibe}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {d.growth} YoY
                    </span>
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {d.sharePercent}% of Kigali Activity
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${d.sharePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Total Views</span>
                    <span className="font-black text-slate-900 tabular-nums">{d.views.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Active Events</span>
                    <span className="font-black text-slate-900">{d.eventsCount} listings</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Average Ticket Price</span>
                    <span className="font-black text-slate-900">{d.avgPrice}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Key Landmark Venues</span>
                    <span className="font-semibold text-slate-700 truncate block">{d.popularVenues.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CATEGORY DEMAND & CTR */}
      {activeReportSubTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Category Demand &amp; Attendee Conversion Matrix</h3>
            <p className="text-xs text-slate-500">
              Comparative analysis of discovery volume, engagement CTR, and ticket acquisition by interest vertical.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-center">Audience Share</th>
                  <th className="pb-3 text-right">Views</th>
                  <th className="pb-3 text-right">Outbound Clicks</th>
                  <th className="pb-3 text-right">Conversion CTR</th>
                  <th className="pb-3">Top Performing Event</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categoryStats.map((c) => (
                  <tr key={c.name} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 flex items-center gap-2 font-bold text-slate-900">
                      <span className="text-base">{c.icon}</span>
                      <span>{c.name}</span>
                    </td>
                    <td className="py-3.5 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`${c.color} h-2 rounded-full`} style={{ width: `${c.share * 2.5}%` }} />
                        </div>
                        <span className="font-bold text-slate-700">{c.share}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-black text-slate-800 tabular-nums">
                      {c.views.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right font-black text-slate-800 tabular-nums">
                      {c.clicks.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right font-black text-emerald-700 tabular-nums">
                      {c.ctr}
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium truncate max-w-xs">
                      {c.topEvent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TOP ORGANIZERS */}
      {activeReportSubTab === 'organizers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Top Performing Promoters &amp; Organizers</h3>
              <p className="text-xs text-slate-500">
                Ranked by cumulative discovery engagement, ticket referrals, and compliance score.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
              84 registered organizers
            </span>
          </div>

          <div className="space-y-3">
            {topOrganizers.map((org, idx) => (
              <div
                key={org.name}
                className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{org.name}</h4>
                      {org.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                    <span className="text-xs text-slate-500">{org.category} · {org.eventsHosted} events listed</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 text-xs text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Total Views</span>
                    <span className="font-black text-slate-900 tabular-nums">{org.totalViews.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Ticket Clicks</span>
                    <span className="font-black text-emerald-700 tabular-nums">{org.outboundClicks.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                    <span className="font-black text-slate-900">★ {org.avgRating}</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] text-slate-400 block font-semibold">SLA Score</span>
                    <span className="font-black text-emerald-700">{org.slaScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: MODERATION SLAS */}
      {activeReportSubTab === 'moderation-sla' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Content Moderation &amp; Quality SLAs</h3>
            <p className="text-xs text-slate-500">
              Operational metrics for event submission verification and regulatory compliance in Kigali.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Submissions Evaluated</span>
              <span className="text-2xl font-black text-slate-900 tabular-nums mt-1 block">
                {moderationStats.totalSubmissions}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">100% audited</span>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Approval Ratio</span>
              <span className="text-2xl font-black text-emerald-700 tabular-nums mt-1 block">
                {moderationStats.approvalRate}%
              </span>
              <span className="text-[11px] text-emerald-800 font-medium">{moderationStats.approvedCount} approved</span>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Changes Requested</span>
              <span className="text-2xl font-black text-amber-700 tabular-nums mt-1 block">
                {moderationStats.changesRequested}
              </span>
              <span className="text-[11px] text-amber-800 font-medium">Organizer revised</span>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Review Speed SLA</span>
              <span className="text-2xl font-black text-blue-700 tabular-nums mt-1 block">
                {moderationStats.avgTurnaroundHours}h
              </span>
              <span className="text-[11px] text-blue-800 font-medium">Target &lt; 4.0 hours</span>
            </div>
          </div>

          {/* Audit Verification Log Highlight */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Event Moderation Verification Standards</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Venue authorization confirmed for public gathering limits.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Legitimate ticketing URL validation (MTN MoMo, Airtel, or licensed box office).</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Accurate high-resolution banner and schedule timing.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Safety and noise curfew compliance with Kigali City directives.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
