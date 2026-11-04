import React from 'react';
import { Clock, Calendar, MapPin, Bookmark, ArrowRight, Eye } from 'lucide-react';
import { EventItem } from '../types';

interface HappeningSoonSectionProps {
  events: EventItem[];
  savedEventIds: string[];
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onViewAll: () => void;
}

export const HappeningSoonSection: React.FC<HappeningSoonSectionProps> = ({
  events,
  savedEventIds,
  onToggleSave,
  onSelectEvent,
  onViewAll,
}) => {
  // Sort chronologically by date
  const sortedEvents = [...events]
    .filter((e) => e.status === 'Published')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <section className="bg-slate-100/70 border-y border-slate-200/80 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-emerald-700 mb-1.5">
              <Clock className="w-4 h-4" />
              <span>Next Up on the Calendar</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Happening Soon
            </h2>
            <p className="text-slate-600 text-base sm:text-base mt-1.5 font-medium">
              Events taking place across Kigali in the upcoming days.
            </p>
          </div>

          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-base sm:text-base font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
          >
            <span>Explore Full Schedule</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Responsive Grid/List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedEvents.map((event) => {
            const isSaved = savedEventIds.includes(event.id);

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-emerald-600 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                {/* Date Square Block */}
                <div className="w-full sm:w-24 sm:h-24 h-16 rounded-xl bg-slate-900 text-white shrink-0 flex sm:flex-col items-center justify-between sm:justify-center p-3 text-center">
                  <span className="text-[14px] uppercase font-bold tracking-wider text-emerald-400">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-display leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-[14px] text-slate-400 font-medium sm:mt-1">
                    {new Date(event.date).toLocaleString('default', { weekday: 'short' })}
                  </span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1.5 text-base text-slate-500 font-medium">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">{event.category}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">{event.time}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span className="tabular-nums font-bold">{event.views.toLocaleString()}</span>
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-base text-slate-500 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue} ({event.neighborhood})</span>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="text-base font-bold text-slate-900 tabular-nums">
                      {event.priceDisplay}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => onToggleSave(e, event.id)}
                      aria-label={isSaved ? 'Remove from saved' : 'Save event'}
                      className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
