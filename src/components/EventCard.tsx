import React from 'react';
import { Bookmark, MapPin, Calendar, Clock, ArrowUpRight, Eye } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  layout?: 'standard' | 'compact' | 'horizontal';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSaved,
  onToggleSave,
  onSelectEvent,
  layout = 'standard',
}) => {
  const isCancelled = event.status === 'Cancelled';
  const isPostponed = event.status === 'Postponed';
  const isSoldOut = event.status === 'Sold Out';
  const isToday = event.date === '2026-09-26' || event.date === new Date().toISOString().split('T')[0];

  // Compact layout (used in tight listings or sidebars)
  if (layout === 'compact') {
    return (
      <article
        onClick={() => onSelectEvent(event)}
        className="group relative flex bg-white rounded-xl border border-slate-200/90 p-3 hover:border-emerald-600 transition-all hover:shadow-sm cursor-pointer gap-3 items-center"
      >
        <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 text-xs mb-1">
            <span className="text-emerald-700 font-bold truncate">{event.displayDate}</span>
            <span
              className="inline-flex items-center gap-1 font-semibold text-slate-600 shrink-0 bg-slate-100 px-2 py-0.5 rounded text-xs"
              title={`${event.views.toLocaleString()} page visits (views)`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{event.views.toLocaleString()} Views</span>
            </span>
          </div>
          <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 truncate">
            {event.title}
          </h4>
          <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
            <span className="truncate">{event.venue}</span>
            <span className="font-bold text-slate-900 tabular-nums">{event.priceDisplay}</span>
          </div>
        </div>
      </article>
    );
  }

  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onSelectEvent(event)}
        className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-600 transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden"
      >
        {/* Thumbnail Image */}
        <div className="relative w-full sm:w-48 sm:h-auto h-40 shrink-0 overflow-hidden bg-slate-100">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isToday && (
            <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Today
            </span>
          )}
          {event.isFeatured && (
            <span className={`absolute ${isToday ? 'top-9' : 'top-2.5'} left-2.5 bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[11px] font-semibold tracking-wider px-2.5 py-0.5 rounded-md`}>
              Featured
            </span>
          )}
          {event.organizerId === 'org-visitor' && (
            <span className="absolute top-2.5 right-2.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Approved
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            {/* Unboxed Metadata Header */}
            <div className="flex items-center justify-between gap-2 text-sm text-slate-600 font-medium mb-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-emerald-700 font-bold">{event.category}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-semibold text-slate-800">{event.displayDate}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span>{event.time}</span>
              </div>

              {/* Views Count Badge alongside Date & Category */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold shrink-0 border border-slate-200/60"
                title={`${event.views.toLocaleString()} page visits (Views represent event page visits, not confirmed ticket purchases)`}
              >
                <Eye className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="tabular-nums font-bold text-slate-800">{event.views.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-medium">Views</span>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {event.title}
            </h3>

            <p className="mt-1.5 text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 text-sm text-slate-600 font-medium">
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{event.venue}, {event.neighborhood}</span>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
                {event.priceDisplay}
              </span>
              {event.isFree && (
                <span className="text-xs sm:text-sm text-emerald-700 font-bold">(Free Entry)</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => onToggleSave(e, event.id)}
                aria-label={isSaved ? 'Remove from saved events' : 'Save event'}
                className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-amber-500 border-amber-500 text-white'
                    : 'border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>

              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Details <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={() => onSelectEvent(event)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-600 transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden"
    >
      {/* Visual Cover Asset */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.image}
          alt={event.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges / Scrim */}
        <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {isToday && (
              <span className="bg-emerald-600 text-white text-[11px] font-bold tracking-wide px-2.5 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Today
              </span>
            )}
            {event.isFeatured && (
              <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 text-[11px] font-semibold tracking-wide px-2.5 py-0.5 rounded-md shadow-sm">
                Featured
              </span>
            )}
            {event.organizerId === 'org-visitor' && (
              <span className="bg-emerald-600/95 backdrop-blur-md text-white text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md shadow-sm">
                Approved Event
              </span>
            )}
            {isCancelled && (
              <span className="bg-red-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                Cancelled
              </span>
            )}
            {isPostponed && (
              <span className="bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                Postponed
              </span>
            )}
            {isSoldOut && (
              <span className="bg-slate-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                Sold Out
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => onToggleSave(e, event.id)}
            aria-label={isSaved ? 'Remove from saved events' : 'Save event'}
            className={`min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full backdrop-blur-md transition-colors ${
              isSaved
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-900/60 text-white hover:bg-slate-900'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Gradient Scrim with Category and Location */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end justify-between p-3.5">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5 truncate">
            <span className="font-bold text-emerald-300">{event.category}</span>
            <span aria-hidden="true" className="text-white/60">·</span>
            <span className="text-slate-100">{event.neighborhood}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Timing Info & Views Count Row */}
          <div className="flex items-center justify-between gap-2 text-sm mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{event.displayDate}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">{event.time}</span>
            </div>

            {/* Total Views Count Clearly Displayed */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold shrink-0 border border-slate-200/60"
              title={`${event.views.toLocaleString()} page visits (Views represent event page visits, not confirmed ticket purchases)`}
            >
              <Eye className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="tabular-nums font-bold text-slate-800">{event.views.toLocaleString()}</span>
              <span className="text-xs text-slate-500 font-medium">Views</span>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <div className="mt-2.5 flex items-center gap-1.5 text-sm text-slate-600 font-medium">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Card Footer: Price & View CTA */}
        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Price</div>
            <div className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
              {event.priceDisplay}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
            <span>View Event</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </article>
  );
};

