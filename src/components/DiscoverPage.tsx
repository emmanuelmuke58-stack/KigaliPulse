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
  ChevronDown,
  ChevronUp,
  X,
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

// Timezone Helper: Returns YYYY-MM-DD in Africa/Kigali
const getKigaliDateString = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Kigali',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  events,
  savedEventIds,
  onToggleSave,
  onSelectEvent,
  initialCategory = '',
  initialLocation = '',
  initialDateFilter = 'today', // Changed default to 'today'
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
  
  // Track if the user has manually changed the date filter
  const [isDateManuallyChanged, setIsDateManuallyChanged] = useState(false);
  const [datePreset, setDatePreset] = useState<string>('today');
  const [customDate, setCustomDate] = useState<string>('');
  const [priceType, setPriceType] = useState<'all' | 'free' | 'paid' | 'custom'>('all');

  useEffect(() => {
    if (initialDateFilter) {
      if (initialDateFilter === 'free') {
        setPriceType('free');
        setDatePreset('today');
      } else if (initialDateFilter === 'paid') {
        setPriceType('paid');
        setDatePreset('today');
      } else if (initialDateFilter !== 'all' && initialDateFilter !== 'today') {
        setDatePreset(initialDateFilter);
        setIsDateManuallyChanged(true);
      } else {
        setDatePreset(initialDateFilter);
      }
    }
  }, [initialDateFilter]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [timeOfDay, setTimeOfDay] = useState<string>('all'); // all, morning, afternoon, evening, night
  const [organizerQuery, setOrganizerQuery] = useState<string>('');

  // Filter panel visibility (Desktop & Mobile)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // View & Sort State
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [sortBy, setSortBy] = useState<'soonest' | 'recommended' | 'newest' | 'popular'>('soonest');

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
    setDatePreset('today'); // Default back to today
    setCustomDate('');
    setIsDateManuallyChanged(false); // Reset manual change flag
    setPriceType('all');
    setMinPrice(0);
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
      if (priceType === 'custom') {
        if (evt.price < minPrice || evt.price > maxPrice) return false;
      } else if (priceType === 'all') {
         if (evt.price > maxPrice && !evt.isFree) return false;
      }

      // Organizer search
      if (organizerQuery.trim()) {
        if (!evt.organizer.toLowerCase().includes(organizerQuery.toLowerCase())) return false;
      }

      // Date presets (dynamic anchor based on current Kigali date)
      const todayStr = getKigaliDateString();
      const kigaliNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Kigali' }));
      
      const tomorrowDate = new Date(kigaliNow);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrowStr = getKigaliDateString(tomorrowDate);

      // Helper for range check (ongoing events)
      const isHappeningOnDate = (targetDateStr: string) => {
        const start = evt.date;
        const end = evt.endDate || evt.date;
        return targetDateStr >= start && targetDateStr <= end;
      };

      if (customDate) {
        if (!isHappeningOnDate(customDate)) return false;
      } else if (datePreset === 'today') {
        if (!isHappeningOnDate(todayStr)) return false;
      } else if (datePreset === 'tomorrow') {
        if (!isHappeningOnDate(tomorrowStr)) return false;
      } else if (datePreset === 'this_weekend') {
        // Find next Friday, Saturday, Sunday
        const day = kigaliNow.getDay(); // 0 is Sunday
        const diffToFriday = (5 - day + 7) % 7;
        const diffToSaturday = (6 - day + 7) % 7;
        const diffToSunday = (0 - day + 7) % 7;
        
        const fri = new Date(kigaliNow); fri.setDate(kigaliNow.getDate() + diffToFriday);
        const sat = new Date(kigaliNow); sat.setDate(kigaliNow.getDate() + diffToSaturday);
        const sun = new Date(kigaliNow); sun.setDate(kigaliNow.getDate() + diffToSunday);
        
        const weekendDates = [getKigaliDateString(fri), getKigaliDateString(sat), getKigaliDateString(sun)];
        if (!weekendDates.some(isHappeningOnDate)) return false;
      } else if (datePreset === 'this_week') {
        const weekEnd = new Date(kigaliNow);
        weekEnd.setDate(kigaliNow.getDate() + 7);
        const weekEndStr = getKigaliDateString(weekEnd);
        
        // If event starts after this week or ends before today
        if (evt.date > weekEndStr || (evt.endDate || evt.date) < todayStr) return false;
      } else if (datePreset === 'this_month') {
        const currentMonth = todayStr.substring(0, 7); // YYYY-MM
        const evtMonth = evt.date.substring(0, 7);
        const evtEndMonth = (evt.endDate || evt.date).substring(0, 7);
        if (evtMonth !== currentMonth && evtEndMonth !== currentMonth) return false;
      }

      // Time of day (only if it's today or specific date)
      if (timeOfDay !== 'all') {
        const hour = parseInt(evt.time.split(':')[0], 10);
        if (timeOfDay === 'morning' && hour >= 12) return false;
        if (timeOfDay === 'afternoon' && (hour < 12 || hour >= 17)) return false;
        if (timeOfDay === 'evening' && (hour < 17 || hour >= 21)) return false;
        if (timeOfDay === 'night' && hour < 21) return false;
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
    minPrice,
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

  // Check if any filters are active (excluding default today)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategories.length > 0) count++;
    if (selectedNeighborhoods.length > 0) count++;
    if (keyword.trim()) count++;
    if (isDateManuallyChanged || datePreset !== 'today' || customDate) count++;
    if (priceType !== 'all') count++;
    if (timeOfDay !== 'all') count++;
    if (organizerQuery.trim()) count++;
    return count;
  }, [selectedCategories, selectedNeighborhoods, keyword, isDateManuallyChanged, datePreset, customDate, priceType, timeOfDay, organizerQuery]);

  // Render Filter Sidebar Content
  const filterSidebarContent = (
    <div className="space-y-6 text-xs text-slate-700">
      
      {/* Header with Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-900 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={handleClearFilters}
          className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Date Filter Presets */}
      <div>
        <label className="block font-bold text-slate-900 mb-2">When</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'today', label: 'Today' },
            { id: 'tomorrow', label: 'Tomorrow' },
            { id: 'this_weekend', label: 'This Weekend' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' },
            { id: 'all', label: 'Any Date' },
          ].map((dp) => (
            <button
              key={dp.id}
              type="button"
              onClick={() => {
                setDatePreset(dp.id);
                setCustomDate('');
                setIsDateManuallyChanged(true);
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
              setIsDateManuallyChanged(true);
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
          Location & District {selectedNeighborhoods.length > 0 && `(${selectedNeighborhoods.length})`}
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
        <label className="block font-bold text-slate-900 mb-2">Ticket Fee</label>
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'free', label: 'Free Events' },
            { id: 'paid', label: 'Paid Events' },
            { id: 'custom', label: 'Custom Range' },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPriceType(p.id as any)}
              className={`px-2.5 py-1.5 rounded-lg border text-left font-medium transition-colors ${
                priceType === p.id
                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {(priceType === 'custom' || priceType === 'paid' || priceType === 'all') && (
          <div className="space-y-4 pt-1">
            {priceType === 'custom' ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Min (RWF)</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Max (RWF)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 0))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{priceType === 'paid' ? 'Paid Up To:' : 'Max Price:'}</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    RWF {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  aria-label="Filter by maximum price"
                  min="0"
                  max="100000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}
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
      <div className="flex flex-col gap-8">
        
        {/* Controls Bar: Filter Toggle, Search, View Toggles & Sorting */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          <div className="flex flex-1 items-stretch sm:items-center gap-3">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold whitespace-nowrap ${
                isFilterPanelOpen 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className={`w-4 h-4 ${isFilterPanelOpen ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>Filter Events</span>
              {isFilterPanelOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {activeFiltersCount > 0 && (
                <span className="ml-1 flex items-center justify-center w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] font-black leading-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events, venues, organizers..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-slate-800"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={() => setKeyword('')}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions Cluster */}
          <div className="flex items-center justify-between sm:justify-end gap-2.5">
            
            {/* Sorting Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                aria-label="Sort events"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-2 px-2.5 rounded-xl focus:outline-none cursor-pointer"
              >
                <option value="soonest">Soonest Date</option>
                <option value="recommended">Recommended</option>
                <option value="newest">Recently Added</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['grid', 'list', 'calendar'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  aria-label={`${mode} view`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors ${
                    viewMode === mode ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {mode === 'grid' && <LayoutGrid className="w-4 h-4" />}
                  {mode === 'list' && <List className="w-4 h-4" />}
                  {mode === 'calendar' && <CalendarIcon className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Collapsible Filter Panel */}
          {isFilterPanelOpen && (
            <aside className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm lg:sticky lg:top-24 animate-in fade-in slide-in-from-top-4 lg:slide-in-from-left-4 duration-300">
              {filterSidebarContent}
            </aside>
          )}

          {/* RIGHT MAIN EVENT RESULTS AREA */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Results Count & Active Filters Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-slate-600 font-medium">
                  Showing <strong className="text-slate-900 font-bold tabular-nums">{sortedEvents.length}</strong> {sortedEvents.length === 1 ? 'event' : 'events'}
                </span>

                {/* Only show date info if manually changed or not today */}
                {(isDateManuallyChanged || datePreset !== 'today' || customDate) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                    <span>
                      {customDate ? `Date: ${customDate}` : `When: ${datePreset.replace('_', ' ')}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDatePreset('today');
                        setCustomDate('');
                        setIsDateManuallyChanged(false);
                      }}
                      className="ml-1 text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {priceType !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                    <span>Price: {priceType === 'free' ? 'Free' : priceType === 'paid' ? 'Paid' : 'Custom'}</span>
                    <button
                      type="button"
                      onClick={() => setPriceType('all')}
                      className="ml-1 text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {selectedCategories.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                    <span>{selectedCategories.length} Categories</span>
                    <button
                      type="button"
                      onClick={() => setSelectedCategories([])}
                      className="ml-1 text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              {activeFiltersCount > 0 && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    {datePreset === 'today' && !isDateManuallyChanged 
                      ? "There are no events scheduled for today. Check back tomorrow or explore upcoming events by changing the date filter."
                      : "Try adjusting or clearing your filters to see more events happening in Kigali."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
                >
                  Explore All Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
