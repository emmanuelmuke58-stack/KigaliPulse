import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { EventItem } from '../types';
import { EventCard } from './EventCard';

interface FeaturedEventsSectionProps {
  events: EventItem[];
  savedEventIds: string[];
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onViewAll: () => void;
}

export const FeaturedEventsSection: React.FC<FeaturedEventsSectionProps> = ({
  events,
  savedEventIds,
  onToggleSave,
  onSelectEvent,
  onViewAll,
}) => {
  const featured = events
    .filter((e) => e.isFeatured && e.status === 'Published')
    .sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      if (dateA !== dateB) return dateA.localeCompare(dateB);
      return (a.time || '').localeCompare(b.time || '');
    });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-base font-extrabold uppercase tracking-wider text-emerald-700 mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Curated Highlights</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Featured Events in Kigali
          </h2>
          <p className="text-slate-600 text-base sm:text-base mt-1.5 font-medium">
            Hand-picked headline concerts, flagship tech summits, and cultural gatherings.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-2 text-base sm:text-base font-bold text-emerald-700 hover:text-emerald-800 transition-colors group cursor-pointer"
        >
          <span>View All Events</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid of Featured Events */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featured.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isSaved={savedEventIds.includes(event.id)}
            onToggleSave={onToggleSave}
            onSelectEvent={onSelectEvent}
          />
        ))}
      </div>
    </section>
  );
};
