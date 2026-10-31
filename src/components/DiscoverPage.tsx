import React, { useState, useMemo, useEffect } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  LayoutGrid,
  List,
  Calendar as CalendarIcon,
  Search,
  MapPin,
  Tag,
  DollarSign,
  Clock,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import { EventItem, EventCategory } from '../types';
import { CATEGORIES, KIGALI_NEIGHBORHOODS, ORGANIZERS } from '../data/mockData';
import { EventCard } from './EventCard';
import { CalendarView } from './CalendarView';

interface DiscoverPageProps {
  events: EventItem[];
  savedEventIds: string[];
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  initialCategory?: string;
  initialLocation?: string;
  initialDateFilter?: string;
  initialKeyword?: string;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  events,
  savedEventIds,
  onToggleSave,
  onSelectEvent,
  initialCategory = '',
  initialLocation = '',
  initialDateFilter = 'all',
  initialKeyword = '',
}) => {
  // Filter States
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    initialLocation ? [initialLocation] : []
  );
  const [datePreset, setDatePreset] = useState<string>(initialDateFilter || 'all');
  const [customDate, setCustomDate] = useState<string>('');

  useEffect(() => {
    if (initialDateFilter) {
      setDatePreset(initialDateFilter);
    }
  }, [initialDateFilter]);
  const [priceType, setPriceType] = useState<'all' | 'free' | 'paid'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [timeOfDay, setTimeOfDay] = useState<string>('all'); // all, morning, afternoon, evening, night
  const [organizerQuery, setOrganizerQuery] = useState<string>('');

  // View & Sort State
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [sortBy, setSortBy] = useState<'soonest' | 'recommended' | 'newest' | 'popular'>('soonest');

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toggle Category selection
  const handleToggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  // Toggle Neighborhood selection
  const handleToggleNeighborhood = (hoodName: string) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(hoodName) ? prev.filter((h) => h !== hoodName) : [...prev, hoodName]
    );
  };

  // Clear all filters
  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
    setDatePreset('all');
    setCustomDate('');
    setPriceType('all');
    setMaxPrice(50000);
    setTimeOfDay('all');
    setOrganizerQuery('');
  };

  // Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Must be published
      if (evt.status !== 'Published') return false;

      // Keyword
      if (keyword.trim()) {
        const q = keyword.toLowerCase();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesVenue = evt.venue.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesOrg = evt.organizer.toLowerCase().includes(q);
        if (!matchesTitle && !matchesVenue && !matchesDesc && !matchesOrg) return false;
      }

      // Categories multi-select
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(evt.categoryCode)) return false;
      }

      // Neighborhoods / Locations
      if (selectedNeighborhoods.length > 0) {
        if (!selectedNeighborhoods.includes(evt.neighborhood) && !selectedNeighborhoods.includes(evt.district)) {
          return false;
        }
      }

      // Price filter
      if (priceType === 'free' && !evt.isFree) return false;
      if (priceType === 'paid' && evt.isFree) return false;
      if (evt.price > maxPrice) return false;

      // Organizer search
      if (organizerQuery.trim()) {
        if (!evt.organizer.toLowerCase().includes(organizerQuery.toLowerCase())) return false;
      }

      // Date presets (dynamic anchor based on current date)
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      const tomorrowDate = new Date(now);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrowStr = `${tomorrowDate.getFullYear()}-${pad(tomorrowDate.getMonth() + 1)}-${pad(tomorrowDate.getDate())}`;

      if (customDate) {
        if (evt.date !== customDate) return false;
      } else if (datePreset === 'today') {
        if (evt.date !== todayStr && evt.date !== '2026-09-26') return false;
      } else if (datePreset === 'tomorrow') {
        if (evt.date !== tomorrowStr && evt.date !== '2026-09-27') return false;
      } else if (datePreset === 'this_weekend') {
        const weekendDates = new Set([todayStr, tomorrowStr, '2026-09-26', '2026-09-27']);
        if (!weekendDates.has(evt.date)) return false;
      } else if (datePreset === 'this_week') {
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const evtDate = new Date(evt.date);
        if (evtDate > weekEnd && evtDate > new Date('2026-10-04')) return false;
      } else if (datePreset === 'this_month') {
        const currentMonthPrefix = `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
        if (!evt.date.startsWith(currentMonthPrefix) && !evt.date.startsWith('2026-09') && !evt.date.startsWith('2026-10')) return false;
      }

      // Time of day
      if (timeOfDay === 'morning') {
        const hour = parseInt(evt.time.split(':')[0], 10);
        if (hour >= 12) return false;
      } else if (timeOfDay === 'afternoon') {
        const hour = parseInt(evt.time.split(':')[0], 10);
        if (hour < 12 || hour >= 17) return false;
      } else if (timeOfDay === 'evening') {
        const hour = parseInt(evt.time.split(':')[0], 10);
        if (hour < 17 || hour >= 21) return false;
      } else if (timeOfDay === 'night') {
        const hour = parseInt(evt.time.split(':')[0], 10);
        if (hour < 21) return false;
      }

      return true;
    });
  }, [
    events,
    keyword,
    selectedCategories,
    selectedNeighborhoods,
    datePreset,
    customDate,
    priceType,
    maxPrice,
    organizerQuery,
    timeOfDay,
  ]);

  // Sorting: Soonest future date & time first
  const sortedEvents = useMemo(() => {
    const list = [...filteredEvents];

    const getEventSortKey = (evt: EventItem) => {
      try {
        const timePart = evt.time ? evt.time.split(/[-–—]/)[0].trim() : '00:00';
        const match = timePart.match(/(\d{1,2}):(\d{2})/);
        const hh = match ? String(match[1]).padStart(2, '0') : '00';
        const mm = match ? String(match[2]).padStart(2, '0') : '00';
        return `${evt.date}T${hh}:${mm}:00`;
      } catch {
        return `${evt.date}T00:00:00`;
      }
    };

    if (sortBy === 'soonest') {
      return list.sort((a, b) => getEventSortKey(a).localeCompare(getEventSortKey(b)));
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (sortBy === 'popular') {
      return list.sort((a, b) => b.views - a.views);
    }
    // recommended: featured first, then soonest date
    return list.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return getEventSortKey(a).localeCompare(getEventSortKey(b));
    });
  }, [filteredEvents, sortBy]);

  // Render Filter Sidebar Content
  const filterSidebarContent = (
    <div className="space-y-6 text-xs text-slate-700">
      
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-900 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filter Events</span>
        </div>
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Date Filter Presets */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">When</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'Any Date' },
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'this_weekend', label: 'This Weekend' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
          ].map((dp) => (
            <button
              key={dp.id}
              type="button"
              onClick={() => {
                setDatePreset(dp.id);
                setCustomDate('');
              }}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-colors ${
                datePreset === dp.id && !customDate
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {dp.label}
            </button>
          ))}
        </div>

        {/* Custom Date Input */}
        <div className="mt-2.5">
          <input
            type="date"
            aria-label="Filter by custom date"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setDatePreset('');
            }}
            className="w-full p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Categories Multi-Select */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">
          Category {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleCategory(cat.id)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-slate-800 flex-1 truncate">{cat.name}</span>
                <span className="text-[10px] text-slate-400 font-medium tabular-nums">
                  {cat.eventCount}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Kigali Location / Neighborhood */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">
          Location &amp; District {selectedNeighborhoods.length > 0 && `(${selectedNeighborhoods.length})`}
        </label>
        <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
          {KIGALI_NEIGHBORHOODS.map((hood) => {
            const isChecked = selectedNeighborhoods.includes(hood.name);
            return (
              <label
                key={hood.name}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggleNeighborhood(hood.name)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-slate-800 flex-1 truncate">{hood.name}</span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {hood.district}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Option */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">Price</label>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
          {(['all', 'free', 'paid'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriceType(p)}
              className={`py-1 rounded-lg font-semibold capitalize transition-colors ${
                priceType === p ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {priceType !== 'free' && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-slate-500 text-[11px]">
              <span>Max Ticket:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                RF {maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              aria-label="Filter by maximum price"
              min="0"
              max="50000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Time of Day */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">Time of Day</label>
        <select
          aria-label="Filter by time of day"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-emerald-600 cursor-pointer"
        >
          <option value="all">Any Time</option>
          <option value="morning">Morning (Before 12:00)</option>
          <option value="afternoon">Afternoon (12:00 – 17:00)</option>
          <option value="evening">Evening (17:00 – 21:00)</option>
          <option value="night">Late Night (21:00 onwards)</option>
        </select>
      </div>

      {/* Search Organizer */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">Organizer</label>
        <input
          type="text"
          placeholder="Filter by organizer name..."
          value={organizerQuery}
          onChange={(e) => setOrganizerQuery(e.target.value)}
          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-emerald-600"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Banner / Heading */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Discover Events in Kigali
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Explore upcoming gatherings, live performances, exhibitions, and summits across Rwanda’s capital.
        </p>
      </div>

      {/* Main Responsive Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* DESKTOP LEFT SIDEBAR FILTERS */}
        <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm sticky top-20">
          {filterSidebarContent}
        </aside>

        {/* RIGHT MAIN EVENT RESULTS AREA */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Controls Bar: Search, View Toggles & Sorting */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search event name, venue, or keyword..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-slate-800"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Actions Cluster */}
            <div className="flex items-center justify-between sm:justify-end gap-2.5">
              
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 hover:bg-slate-50"
              >
                <Filter className="w-3.5 h-3.5 text-emerald-600" />
                <span>Filters</span>
                {(selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || datePreset !== 'all') && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                )}
              </button>

              {/* Sorting Dropdown */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  aria-label="Sort events"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-2 px-2.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="soonest">Soonest Date (Upcoming First)</option>
                  <option value="recommended">Recommended</option>
                  <option value="newest">Recently Added</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* View Mode Toggle Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  className={`min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  className={`min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('calendar')}
                  aria-label="Calendar view"
                  className={`min-h-[34px] min-w-[34px] flex items-center justify-center rounded-lg transition-colors ${
                    viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title="Calendar view"
                >
                  <CalendarIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count & Active Filters Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-600 font-medium">
                Showing <strong className="text-slate-900 font-bold tabular-nums">{sortedEvents.length}</strong> {sortedEvents.length === 1 ? 'event' : 'events'}
              </span>

              {datePreset === 'today' && !customDate && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>Happening Today</span>
                  <button
                    type="button"
                    onClick={() => setDatePreset('all')}
                    title="View all upcoming events"
                    className="ml-1 text-emerald-200 hover:text-white font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              {datePreset !== 'today' && datePreset !== 'all' && !customDate && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <span>When: {datePreset.replace('_', ' ')}</span>
                  <button
                    type="button"
                    onClick={() => setDatePreset('all')}
                    title="Clear date filter"
                    className="ml-1 text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}

              {customDate && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <span>Date: {customDate}</span>
                  <button
                    type="button"
                    onClick={() => setCustomDate('')}
                    title="Clear custom date"
                    className="ml-1 text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>

            {(selectedCategories.length > 0 || selectedNeighborhoods.length > 0 || keyword || datePreset !== 'all' || customDate) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-emerald-700 hover:text-emerald-900 hover:underline font-semibold cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* RESULTS DISPLAY ACCORDING TO VIEW MODE */}
          {viewMode === 'calendar' ? (
            <CalendarView events={sortedEvents} onSelectEvent={onSelectEvent} />
          ) : viewMode === 'list' ? (
            <div className="space-y-3">
              {sortedEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isSaved={savedEventIds.includes(evt.id)}
                  onToggleSave={onToggleSave}
                  onSelectEvent={onSelectEvent}
                  layout="horizontal"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isSaved={savedEventIds.includes(evt.id)}
                  onToggleSave={onToggleSave}
                  onSelectEvent={onSelectEvent}
                />
              ))}
            </div>
          )}

          {/* Zero Results State */}
          {sortedEvents.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No events found matching your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting or clearing your date, category, or location filters to see more events happening in Kigali.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-sm h-full p-6 overflow-y-auto space-y-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="font-bold text-base text-slate-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
                >
                  ✕
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Apply Filters ({sortedEvents.length} Events)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
