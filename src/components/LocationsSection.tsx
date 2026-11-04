import React from 'react';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { KIGALI_NEIGHBORHOODS } from '../data/mockData';

interface LocationsSectionProps {
  onSelectLocation: (neighborhoodName: string) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  onSelectLocation,
}) => {
  return (
    <section className="bg-slate-900 text-white py-14 sm:py-18 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
              <Navigation className="w-3.5 h-3.5" />
              <span>Explore The Hills</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Kigali Districts &amp; Neighborhoods
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Select any vibrant area to see localized events and venue hotspots.
            </p>
          </div>
        </div>

        {/* Neighborhood Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {KIGALI_NEIGHBORHOODS.map((hood) => (
            <button
              key={hood.name}
              type="button"
              onClick={() => onSelectLocation(hood.name)}
              className="group p-4 bg-slate-800/80 hover:bg-slate-800 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all text-left flex items-start justify-between gap-3 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>{hood.district} District</span>
                </div>
                <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                  {hood.name}
                </h3>
                <p className="text-xs text-slate-400 leading-snug">
                  {hood.highlight}
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-end">
                <span className="text-xs font-extrabold text-white bg-slate-700/80 px-2.5 py-1 rounded-lg">
                  {hood.count}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">events</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
