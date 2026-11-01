import React, { useState, useMemo } from 'react';
import { Search, X, Calendar, MapPin, Building, User, Tag, ArrowRight, Eye } from 'lucide-react';
import { EventItem, VenueItem, OrganizerItem, CategoryItem } from '../types';
import { CATEGORIES, VENUES, ORGANIZERS, KIGALI_NEIGHBORHOODS } from '../data/mockData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onSelectVenue: (venue: VenueItem) => void;
  onSelectOrganizer: (organizer: OrganizerItem) => void;
  onSelectCategory: (categoryCode: string) => void;
  onSelectLocation: (neighborhood: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  events,
  onSelectEvent,
  onSelectVenue,
  onSelectOrganizer,
  onSelectCategory,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState('');

  // Suggestions computation
  const results = useMemo(() => {
    if (!query.trim()) {
      return {
        events: events.slice(0, 3),
        venues: VENUES.slice(0, 2),
        organizers: ORGANIZERS.slice(0, 2),
        categories: CATEGORIES.slice(0, 3),
        locations: KIGALI_NEIGHBORHOODS.slice(0, 3),
      };
    }

    const q = query.toLowerCase();

    return {
      events: events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      ),
      venues: VENUES.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.neighborhood.toLowerCase().includes(q) ||
          v.type.toLowerCase().includes(q)
      ),
      organizers: ORGANIZERS.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.bio.toLowerCase().includes(q)
      ),
      categories: CATEGORIES.filter((c) => c.name.toLowerCase().includes(q)),
      locations: KIGALI_NEIGHBORHOODS.filter((l) => l.name.toLowerCase().includes(q)),
    };
  }, [query, events]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-0 sm:p-6 md:p-12 flex justify-center items-start"
    >
      <div className="bg-white sm:rounded-3xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[85vh] shadow-2xl border-t sm:border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-4">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, venues, organizers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-base font-medium focus:outline-none placeholder:text-slate-400 text-slate-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="min-h-[44px] px-2 text-base text-slate-400 hover:text-slate-600 font-bold"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Suggestions Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-base pb-[calc(2rem+env(safe-area-inset-bottom))]">
          
          {/* Section: Events */}
          {results.events.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[14px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Events</span>
              </div>
              <div className="space-y-1">
                {results.events.slice(0, 5).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onClose();
                      onSelectEvent(evt);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {evt.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[15px] text-slate-500 flex-wrap">
                        <span>{evt.displayDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 tabular-nums shrink-0">{evt.priceDisplay}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Venues */}
          {results.venues.length > 0 && (
            <div className="space-y-3 border-t pt-5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[14px]">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Venues</span>
              </div>
              <div className="space-y-1">
                {results.venues.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onClose();
                      onSelectVenue(v);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">{v.name}</h4>
                      <span className="text-[15px] text-slate-500">{v.type} · {v.neighborhood}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold text-[15px]">{v.upcomingCount} events</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Organizers */}
          {results.organizers.length > 0 && (
            <div className="space-y-3 border-t pt-5">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[14px]">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Organizers</span>
              </div>
              <div className="space-y-1">
                {results.organizers.slice(0, 3).map((org) => (
                  <div
                    key={org.id}
                    onClick={() => {
                      onClose();
                      onSelectOrganizer(org);
                    }}
                    className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group active:scale-[0.99]"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">{org.name}</h4>
                      <span className="text-[15px] text-slate-500">{org.category}</span>
                    </div>
                    <span className="text-slate-500 text-[15px]">{org.eventsCount} events</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t pt-5 space-y-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[14px] block">
              Quick Filter
            </span>
            <div className="flex flex-wrap gap-2">
              {results.categories.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectCategory(c.id);
                  }}
                  className="min-h-[44px] px-4 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl text-slate-700 font-medium transition-colors"
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
