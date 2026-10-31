import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Radio,
} from 'lucide-react';
import { EventItem } from '../types';

interface CompactHeaderEventSliderProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  autoSlideInterval?: number; // 2000ms strictly required
}

/**
 * Validates if an event is published and in the future relative to the current reference time.
 */
function isUpcoming(event: EventItem, now: Date = new Date()): boolean {
  if (event.status !== 'Published') return false;

  // Extract start time, e.g. "18:30 – 23:00" -> 18:30
  const timePart = event.time ? event.time.split(/[-–—]/)[0].trim() : '00:00';
  const match = timePart.match(/(\d{1,2}):(\d{2})/);
  const hours = match ? parseInt(match[1], 10) : 0;
  const minutes = match ? parseInt(match[2], 10) : 0;

  const [year, month, day] = event.date.split('-').map(Number);
  if (!year || !month || !day) return false;

  const eventDateTime = new Date(year, month - 1, day, hours, minutes, 0);
  if (isNaN(eventDateTime.getTime())) {
    const todayStr = now.toISOString().split('T')[0];
    return event.date >= todayStr;
  }

  // Also account for events that might end later today
  const endDateTime = new Date(year, month - 1, day, 23, 59, 59);
  return endDateTime.getTime() >= now.getTime();
}

/**
 * Returns a human-friendly relative badge for the nearest events
 */
function getRelativeDateLabel(eventDateStr: string, now: Date = new Date()): string {
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const eventDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === 2) return 'In 2 Days';
  if (diffDays > 2 && diffDays <= 7) return `In ${diffDays}d`;
  return '';
}

export const CompactHeaderEventSlider: React.FC<CompactHeaderEventSliderProps> = ({
  events,
  onSelectEvent,
  autoSlideInterval = 2000, // Exactly 2 seconds per event
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // 1. Dynamic sorting: nearest upcoming event date and time first, hide past events
  const sortedUpcomingEvents = useMemo(() => {
    const now = new Date();
    const upcoming = events.filter((e) => isUpcoming(e, now));

    return upcoming.sort((a, b) => {
      const timeA = a.time ? a.time.split(/[-–—]/)[0].trim() : '00:00';
      const matchA = timeA.match(/(\d{1,2}):(\d{2})/);
      const hA = matchA ? String(matchA[1]).padStart(2, '0') : '00';
      const mA = matchA ? String(matchA[2]).padStart(2, '0') : '00';
      const dtA = `${a.date}T${hA}:${mA}:00`;

      const timeB = b.time ? b.time.split(/[-–—]/)[0].trim() : '00:00';
      const matchB = timeB.match(/(\d{1,2}):(\d{2})/);
      const hB = matchB ? String(matchB[1]).padStart(2, '0') : '00';
      const mB = matchB ? String(matchB[2]).padStart(2, '0') : '00';
      const dtB = `${b.date}T${hB}:${mB}:00`;

      return dtA.localeCompare(dtB);
    });
  }, [events]);

  const totalEvents = sortedUpcomingEvents.length;

  // Keep index within bounds if events change
  useEffect(() => {
    if (currentIndex >= totalEvents && totalEvents > 0) {
      setCurrentIndex(0);
    }
  }, [totalEvents, currentIndex]);

  // Slide navigation
  const handleNext = useCallback(() => {
    if (totalEvents <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalEvents);
  }, [totalEvents]);

  const handlePrev = useCallback(() => {
    if (totalEvents <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalEvents) % totalEvents);
  }, [totalEvents]);

  // 2. Automatic sliding every 2 seconds (2000ms), paused on hover
  useEffect(() => {
    if (isPaused || totalEvents <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => clearInterval(timer);
  }, [isPaused, totalEvents, autoSlideInterval, handleNext]);

  if (totalEvents === 0) {
    return null;
  }

  const currentEvent = sortedUpcomingEvents[currentIndex];
  const relativeBadge = getRelativeDateLabel(currentEvent.date);

  return (
    <div
      ref={sliderContainerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-slate-900 border-b border-slate-800 text-white select-none transition-colors duration-200"
      aria-label="Upcoming Events Auto-Sliding Header"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2.5 sm:gap-4 h-11 sm:h-12 overflow-hidden">
        
        {/* Left Indicator Pill: "UPCOMING" with live animated pulse */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="hidden xs:inline">Upcoming</span>
            <span className="xs:hidden">Live</span>
          </div>

          {/* Mini order indicator */}
          <span className="hidden sm:inline-block font-mono text-[10px] text-slate-400 tabular-nums">
            {currentIndex + 1}/{totalEvents}
          </span>
        </div>

        {/* Center: Compact Sliding Card Stage */}
        <div className="flex-1 min-w-0 overflow-hidden relative">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {sortedUpcomingEvents.map((evt, idx) => {
              const relLabel = getRelativeDateLabel(evt.date);
              const shortVenue = evt.venue.length > 22 ? `${evt.venue.slice(0, 20)}…` : evt.venue;

              return (
                <div
                  key={evt.id}
                  className="w-full shrink-0 flex items-center justify-between gap-2 sm:gap-3 cursor-pointer group"
                  onClick={() => onSelectEvent(evt)}
                >
                  {/* Event Thumbnail & Meta Details */}
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {/* Small Thumbnail */}
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-md sm:rounded-lg overflow-hidden shrink-0 border border-slate-700/80 bg-slate-800 shadow-sm">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {relLabel && (
                        <span className="absolute bottom-0 inset-x-0 bg-emerald-600/90 text-slate-950 font-black text-[7px] text-center uppercase tracking-tighter sm:hidden">
                          {relLabel}
                        </span>
                      )}
                    </div>

                    {/* Textual Information */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                      {/* Urgency Pill (Desktop) */}
                      {relLabel && (
                        <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-tight bg-emerald-400 text-slate-950 shrink-0">
                          {relLabel}
                        </span>
                      )}

                      {/* Event Title */}
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {evt.title}
                      </span>

                      {/* Date & Time */}
                      <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 shrink-0">
                        <span className="text-slate-500">·</span>
                        <div className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Calendar className="w-3 h-3 shrink-0" />
                          <span>{evt.displayDate.split(',')[1] || evt.displayDate}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3 shrink-0 text-slate-500" />
                          <span>{evt.time.split(/[-–—]/)[0].trim()}</span>
                        </div>
                      </div>

                      {/* Shortened Location */}
                      <div className="hidden xl:flex items-center gap-1 text-xs text-slate-400 shrink-0">
                        <span className="text-slate-500">·</span>
                        <MapPin className="w-3 h-3 shrink-0 text-emerald-500" />
                        <span className="truncate max-w-[140px]">{shortVenue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compact "View Event" Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className="px-2.5 sm:px-3 py-1 rounded-md sm:rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] sm:text-xs flex items-center gap-1 transition-all active:scale-95 shadow-sm group-hover:bg-emerald-400"
                    >
                      <span>View</span>
                      <span className="hidden sm:inline">Event</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Controls: Mini Arrows + Pause Status */}
        <div className="flex items-center gap-1 shrink-0 pl-1 border-l border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous upcoming event"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next upcoming event"
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
