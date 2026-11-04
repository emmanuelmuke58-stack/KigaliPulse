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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm p-4 sm:p-6 md:p-12 flex justify-center items-start"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, venues, organizers, categories (e.g. Jazz, Arena, Tech)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm sm:text-base font-medium focus:outline-none placeholder:text-slate-400 text-slate-900"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-1.5"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Suggestions Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6 space-y-6 text-xs">
          
          {/* Section: Events */}
          {results.events.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Events</span>
              </div>
              <div className="space-y-1">
                {results.events.slice(0, 4).map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onClose();
                      onSelectEvent(evt);
                    }}
                    className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                        {evt.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                        <span>{evt.displayDate}</span>
                        <span aria-hidden="true">·</span>
                        <span>{evt.venue}</span>
                        <span aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                          <Eye className="w-3 h-3 text-slate-500" />
                          <span>{evt.views.toLocaleString()} Views</span>
                        </span>
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
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Venues in Kigali</span>
              </div>
              <div className="space-y-1">
                {results.venues.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    onClick={() => {
                      onClose();
                      onSelectVenue(v);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">{v.name}</h4>
                      <span className="text-[11px] text-slate-500">{v.type} · {v.neighborhood}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold text-[11px]">{v.upcomingCount} events</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Organizers */}
          {results.organizers.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>Organizers &amp; Brands</span>
              </div>
              <div className="space-y-1">
                {results.organizers.slice(0, 3).map((org) => (
                  <div
                    key={org.id}
                    onClick={() => {
                      onClose();
                      onSelectOrganizer(org);
                    }}
                    className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700">{org.name}</h4>
                      <span className="text-[11px] text-slate-500">{org.category}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{org.eventsCount} events</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Categories & Locations Quick Pills */}
          <div className="border-t pt-4 space-y-3">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Popular Categories &amp; Areas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {results.categories.slice(0, 4).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectCategory(c.id);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-700 font-medium transition-colors"
                >
                  {c.icon} {c.name}
                </button>
              ))}
              {results.locations.slice(0, 4).map((l) => (
                <button
                  key={l.name}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectLocation(l.name);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg text-slate-700 font-medium transition-colors flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
