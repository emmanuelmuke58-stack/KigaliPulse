import React from 'react';
import { Bookmark, MapPin, Calendar, Clock, Eye, ChevronRight } from 'lucide-react';
import { EventItem } from '../types';

interface EventCardProps {
  event: EventItem;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onBuyTicket?: (event: EventItem) => void;
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
  const isSoldOut = event.status === 'Sold Out';

  // Helper to format date for the badge
  const formatDateBadge = (dateStr: string) => {
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
  };

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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-emerald-700 truncate">
            {event.title}
          </h4>
          <div className="flex items-center justify-between text-[12px] text-slate-500 mt-1 font-medium">
            <span className="truncate">{event.venue}</span>
            <span className="font-bold text-emerald-700 tabular-nums">{event.priceDisplay}</span>
          </div>
        </div>
      </article>
    );
  }

  // Horizontal layout (used in list mode)
  if (layout === 'horizontal') {
    return (
      <article
        onClick={() => onSelectEvent(event)}
        className="group relative flex flex-col sm:flex-row bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-600 transition-all duration-200 hover:shadow-md cursor-pointer overflow-hidden"
      >
        <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 text-white">
            <span className="text-[10px] font-black uppercase tracking-widest drop-shadow-md">
              {event.category}
            </span>
            <span className="text-sm font-black tabular-nums drop-shadow-md">
              {event.priceDisplay}
            </span>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-100 text-[11px] font-black text-slate-900 flex items-center gap-1.5 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                {formatDateBadge(event.date)}
              </span>
              <button
                type="button"
                onClick={(e) => onToggleSave(e, event.id)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
                  isSaved ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-tight">
              {event.title}
            </h3>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[14px] text-slate-600 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="truncate">{event.venue}, {event.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{event.time}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-[14px] font-bold">
                <Eye className="w-4 h-4" />
                <span>{event.views?.toLocaleString() || 0}</span>
              </div>
            <button className="px-5 py-2 rounded-xl border-2 border-emerald-600 text-emerald-600 font-black text-[13px] flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-tight">
              <span>View Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Standard vertical card (Matching the screenshot 100%)
  return (
    <article
      onClick={() => onSelectEvent(event)}
      className="group relative flex flex-col bg-white rounded-[2.5rem] border border-slate-200/80 hover:border-emerald-600 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden h-full"
    >
      {/* Cover Image Area */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-100 p-2">
        <div className="w-full h-full overflow-hidden rounded-[2rem]">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Floating Date Badge - Clean Integrated Design */}
        <div className="absolute top-6 right-6">
          <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg border border-white/50 transition-transform group-hover:scale-105">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
              {formatDateBadge(event.date)}
            </span>
          </div>
        </div>

        {/* Clean Metadata Overlay (Replaces Pills) */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-0.5 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90 drop-shadow-sm">
            {event.category}
          </span>
          <span className="text-lg font-black tracking-tight drop-shadow-md">
            {event.priceDisplay}
          </span>
        </div>

        {/* Floating Save Button */}
        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => onToggleSave(e, event.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-2xl backdrop-blur-md transition-all shadow-lg ${
              isSaved ? 'bg-amber-500 text-white' : 'bg-white/80 text-slate-600 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-tight mb-4">
            {event.title}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-600 font-bold text-[14px]">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="truncate">{event.venue}, Kigali</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 font-bold text-[14px]">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{event.time}</span>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-500 font-bold text-[12px]">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{event.views?.toLocaleString() || 0} Views</span>
              <span className="mx-1 text-slate-200">·</span>
              <span className="text-emerald-700 font-black tracking-tight">{event.priceDisplay}</span>
            </div>
          </div>
          
          <button className="px-5 py-2 rounded-2xl border-2 border-emerald-600 text-emerald-600 font-black text-[13px] flex items-center gap-2 hover:bg-emerald-600 hover:text-white transition-all uppercase tracking-tight">
            <span>Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
