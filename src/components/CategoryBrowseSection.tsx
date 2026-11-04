import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { EventCategory } from '../types';

interface CategoryBrowseSectionProps {
  onSelectCategory: (categoryCode: EventCategory) => void;
}

export const CategoryBrowseSection: React.FC<CategoryBrowseSectionProps> = ({
  onSelectCategory,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-base font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <Tag className="w-3.5 h-3.5" />
          <span>Curated Disciplines</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse Kigali by Category
        </h2>
        <p className="text-slate-500 text-base sm:text-lg mt-2 font-medium max-w-xl mx-auto">
          From sunset afro-fusion to tech hackathons, find your exact scene in the capital.
        </p>
      </div>

      {/* 16 Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className="group p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-600 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between space-y-3 cursor-pointer focus:outline-none"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl select-none group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="text-[14px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors tabular-nums">
                {cat.eventCount} Events
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {cat.name}
              </h3>
              <p className="text-[15px] text-slate-500 mt-1 line-clamp-1">
                {cat.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
