import React, { useState } from 'react';
import { MapPin, Users, Star, ExternalLink, Phone, Mail, Globe, Search, Filter } from 'lucide-react';
import { VenueItem, VenueType } from '../types';
import { VENUES, KIGALI_NEIGHBORHOODS } from '../data/mockData';
import { InteractiveKigaliMap } from './InteractiveKigaliMap';

interface VenueDirectoryProps {
  onSelectVenueModal: (venue: VenueItem) => void;
}

export const VenueDirectory: React.FC<VenueDirectoryProps> = ({ onSelectVenueModal }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const venueTypes: (VenueType | 'All Types')[] = [
    'All Types',
    'Conference Venues',
    'Sports Venues',
    'Cultural Spaces',
    'Co-working Spaces',
    'Restaurants',
    'Hotels',
    'Outdoor & Gardens',
  ];

  const filteredVenues = VENUES.filter((venue) => {
    if (selectedType !== 'all' && selectedType !== 'All Types' && venue.type !== selectedType) {
      return false;
    }
    if (selectedNeighborhood !== 'all' && venue.neighborhood !== selectedNeighborhood) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = venue.name.toLowerCase().includes(q);
      const matchDesc = venue.description.toLowerCase().includes(q);
      const matchAddr = venue.address.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchAddr) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      
      {/* Directory Header */}
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Kigali Venues
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
          Discover world-class arenas, rooftop lounges, cultural galleries, convention centers, and gardens across Kigali.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search venue by name, amenity, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Venue Type */}
          <select
            aria-label="Filter by venue type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
          >
            {venueTypes.map((vt) => (
              <option key={vt} value={vt === 'All Types' ? 'all' : vt}>
                {vt}
              </option>
            ))}
          </select>

          {/* Neighborhood */}
          <select
            aria-label="Filter by neighborhood"
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 cursor-pointer"
          >
            <option value="all">All Neighborhoods</option>
            {KIGALI_NEIGHBORHOODS.map((h) => (
              <option key={h.name} value={h.name}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVenues.map((venue) => (
          <div
            key={venue.id}
            onClick={() => onSelectVenueModal(venue)}
            className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all duration-200 hover:shadow-lg cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Venue Cover Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={venue.image}
                  alt={venue.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-emerald-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                  {venue.type}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{venue.rating}</span>
                </div>
              </div>

              {/* Venue Details */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{venue.neighborhood}, {venue.district}</span>
                </div>

                <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                  {venue.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {venue.description}
                </p>

                {/* Amenities Badges (Unboxed metadata) */}
                <div className="pt-2 flex flex-wrap items-center gap-1 text-[11px] text-slate-500">
                  {venue.amenities.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                      {amenity}
                    </span>
                  ))}
                  {venue.amenities.length > 3 && (
                    <span className="text-slate-400">+{venue.amenities.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Venue Card Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Cap: {venue.capacity.toLocaleString()}</span>
              </span>

              <span className="font-semibold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>{venue.upcomingCount} Events</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const VenueDetailModal: React.FC<{
  venue: VenueItem | null;
  onClose: () => void;
}> = ({ venue, onClose }) => {
  if (!venue) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Close venue modal"
          className="absolute top-4 right-4 z-30 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
        >
          ✕
        </button>

        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900">
          <img
            src={venue.image}
            alt={venue.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white space-y-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{venue.type}</span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold">{venue.name}</h2>
            <p className="text-xs text-slate-300">{venue.address}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Capacity</span>
              <span className="font-bold text-slate-900 block text-sm">{venue.capacity.toLocaleString()} guests</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Rating</span>
              <span className="font-bold text-amber-600 block text-sm">★ {venue.rating} / 5.0</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Phone</span>
              <span className="font-bold text-slate-900 block text-sm">{venue.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Upcoming Events</span>
              <span className="font-bold text-emerald-700 block text-sm">{venue.upcomingCount} scheduled</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-base text-slate-900">About the Venue</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{venue.description}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Amenities &amp; Features</h3>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-800">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Location Map</h3>
            <InteractiveKigaliMap
              lat={venue.lat}
              lng={venue.lng}
              venueName={venue.name}
              address={venue.address}
              district={venue.district}
              neighborhood={venue.neighborhood}
            />
          </div>

          <div className="pt-4 border-t flex justify-between items-center text-xs">
            <a
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 hover:underline font-semibold flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Official Website</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
            >
              Close View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
