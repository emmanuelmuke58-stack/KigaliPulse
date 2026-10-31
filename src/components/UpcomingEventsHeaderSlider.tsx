import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Play,
  Pause,
  Ticket,
  Flame,
} from 'lucide-react';
import { EventItem } from '../types';

interface UpcomingEventsHeaderSliderProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  autoSlideInterval?: number; // in milliseconds, default 5000
}

/**
 * Checks if an event is in the future based on its date and start time.
 */
function isEventUpcoming(event: EventItem, now: Date = new Date()): boolean {
  if (event.status !== 'Published') return false;

  // Extract start time from format like '19:00 – 23:30' or '18:00'
  const timePart = event.time ? event.time.split(/[-–—]/)[0].trim() : '00:00';
  const timeMatch = timePart.match(/(\d{1,2}):(\d{2})/);
  const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
  const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;

  // Build event start DateTime
  const [year, month, day] = event.date.split('-').map(Number);
  if (!year || !month || !day) return false;

  const eventDateTime = new Date(year, month - 1, day, hours, minutes, 0);

  if (isNaN(eventDateTime.getTime())) {
    // Fallback: compare date string YYYY-MM-DD
    const todayStr = now.toISOString().split('T')[0];
    return event.date >= todayStr;
  }

  return eventDateTime.getTime() >= now.getTime();
}

/**
 * Calculates human-friendly relative label (e.g. 'Today', 'Tomorrow', 'In 2 days', or date)
 */
function getRelativeTimeLabel(eventDateStr: string, now: Date = new Date()): string {
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Happening Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === 2) return 'In 2 Days';
  if (diffDays > 2 && diffDays <= 7) return `In ${diffDays} Days`;
  return 'Coming Soon';
}

export const UpcomingEventsHeaderSlider: React.FC<UpcomingEventsHeaderSliderProps> = ({
  events,
  onSelectEvent,
  autoSlideInterval = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 1. Live Chronological Sorting & Past Events Filter
  // Only published events that have not yet started, sorted with nearest event first
  const upcomingEvents = useMemo(() => {
    const now = new Date();

    const filtered = events.filter((e) => isEventUpcoming(e, now));

    return filtered.sort((a, b) => {
      // Parse a start time
      const timePartA = a.time ? a.time.split(/[-–—]/)[0].trim() : '00:00';
      const matchA = timePartA.match(/(\d{1,2}):(\d{2})/);
      const hoursA = matchA ? String(matchA[1]).padStart(2, '0') : '00';
      const minsA = matchA ? String(matchA[2]).padStart(2, '0') : '00';
      const dtA = `${a.date}T${hoursA}:${minsA}:00`;

      // Parse b start time
      const timePartB = b.time ? b.time.split(/[-–—]/)[0].trim() : '00:00';
      const matchB = timePartB.match(/(\d{1,2}):(\d{2})/);
      const hoursB = matchB ? String(matchB[1]).padStart(2, '0') : '00';
      const minsB = matchB ? String(matchB[2]).padStart(2, '0') : '00';
      const dtB = `${b.date}T${hoursB}:${minsB}:00`;

      return dtA.localeCompare(dtB);
    });
  }, [events]);

  const totalSlides = upcomingEvents.length;

  // Reset index if out of bounds after list update
  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setCurrentIndex(0);
    }
  }, [totalSlides, currentIndex]);

  // Next / Previous slide handlers
  const handleNext = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // 2. Auto-sliding timer with pause on hover
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [isPaused, totalSlides, autoSlideInterval, handleNext]);

  // Touch Swipe Handlers for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  // If no upcoming events found, return null (clean fallback)
  if (totalSlides === 0) {
    return null;
  }

  const currentEvent = upcomingEvents[currentIndex];
  const relativeBadge = getRelativeTimeLabel(currentEvent.date);

  return (
    <section
      aria-label="Upcoming Events Header Carousel"
      className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Subtle Top Header Meta Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2 flex items-center justify-between text-xs border-b border-slate-900">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold tracking-wider uppercase text-[11px] text-emerald-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Upcoming Kigali Events</span>
          </span>
          <span className="hidden sm:inline-block text-slate-500 text-[10px]">·</span>
          <span className="hidden sm:inline-block text-slate-400 text-[11px]">
            Sorted chronologically by nearest date
          </span>
        </div>

        {/* Counter & Play/Pause State */}
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <span className="font-mono text-[11px] tabular-nums text-slate-300">
            <span className="font-bold text-white">{currentIndex + 1}</span> / {totalSlides}
          </span>
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
            aria-label={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Main Hero Card Stage (Cols 1-8 or 1-12) */}
          <div className="lg:col-span-8 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800/80 group">
              {/* Event Cover Image with Dark Contrast Scrim */}
              <div className="relative h-72 sm:h-96 md:h-[420px] w-full overflow-hidden bg-slate-900">
                <img
                  key={currentEvent.id}
                  src={currentEvent.image}
                  alt={currentEvent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Layered Multi-stop Gradient Scrim for WCAG AAA Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-transparent hidden sm:block" />

                {/* Top Badges */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Relative Urgency Pill */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-500 text-slate-950 shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{relativeBadge}</span>
                    </span>

                    {/* Category Pill */}
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                      {currentEvent.category}
                    </span>

                    {/* Nearest Soonest Tag if index is 0 */}
                    {currentIndex === 0 && (
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Nearest Event
                      </span>
                    )}
                  </div>

                  {/* Price Badge */}
                  <div className="bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-black text-white tabular-nums shadow-sm">
                    {currentEvent.priceDisplay}
                  </div>
                </div>

                {/* Bottom Content Container */}
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 md:p-8 space-y-3 z-10">
                  {/* Date & Time Row */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-white">{currentEvent.displayDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{currentEvent.time}</span>
                    </div>
                  </div>

                  {/* Event Title */}
                  <h2
                    onClick={() => onSelectEvent(currentEvent)}
                    className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug line-clamp-2 hover:text-emerald-400 transition-colors cursor-pointer"
                  >
                    {currentEvent.title}
                  </h2>

                  {/* Venue & Location Row with Action CTA */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 truncate max-w-md">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        {currentEvent.venue}, {currentEvent.neighborhood} ({currentEvent.district})
                      </span>
                    </div>

                    {/* Clear "View Event" Button */}
                    <button
                      type="button"
                      onClick={() => onSelectEvent(currentEvent)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20 group/btn cursor-pointer shrink-0"
                    >
                      <span>View Event</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Previous & Next Navigation Arrows (Overlaid on Main Card) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous upcoming event"
                className="pointer-events-auto p-2.5 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/10 hover:border-emerald-500 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pl-3 pointer-events-none">
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next upcoming event"
                className="pointer-events-auto p-2.5 rounded-full bg-slate-950/70 hover:bg-emerald-600 text-white backdrop-blur-md border border-white/10 hover:border-emerald-500 transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Right Column: Upcoming Queue / Quick Timeline Preview (Cols 9-12) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-between h-[420px] bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 backdrop-blur-md">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Upcoming Order</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {upcomingEvents.length} upcoming
                </span>
              </div>

              {/* Scrollable list of upcoming events in sequence */}
              <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {upcomingEvents.slice(0, 5).map((evt, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <img
                        src={evt.image}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 text-[10px] text-emerald-400 font-semibold mb-0.5">
                          <span className="truncate">{evt.displayDate.split(',')[1] || evt.displayDate}</span>
                          <span className="text-slate-400 font-mono text-[9px]">#{idx + 1}</span>
                        </div>
                        <h4
                          className={`text-xs font-bold truncate ${
                            isCurrent ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {evt.title}
                        </h4>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {evt.venue}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quick Action for Active Slide */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Currently viewing #{currentIndex + 1}</span>
              <button
                type="button"
                onClick={() => onSelectEvent(currentEvent)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
              >
                <span>Full Details</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Indicators / Dots & Auto-slide Progress Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Slider Dots */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {upcomingEvents.map((evt, idx) => (
              <button
                key={evt.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}: ${evt.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 sm:w-8 h-2 bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          {/* Quick info note */}
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            Click any slide or use arrows to navigate · Press{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              ←
            </kbd>{' '}
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">
              →
            </kbd>
          </div>
        </div>
      </div>
    </section>
  );
};
