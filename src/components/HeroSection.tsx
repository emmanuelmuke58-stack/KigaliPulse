import React, { useState } from 'react';
import { Search, MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import { CATEGORIES, KIGALI_NEIGHBORHOODS } from '../data/mockData';

interface HeroSectionProps {
  onSearch: (params: { keyword: string; category: string; location: string; date: string }) => void;
  onQuickFilter: (filterKey: string) => void;
  activeQuickFilter: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onQuickFilter,
  activeQuickFilter,
}) => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ keyword, category, location, date });
  };

  const quickFilters = [
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'this_weekend', label: 'This Weekend' },
    { id: 'this_week', label: 'This Week' },
    { id: 'free', label: 'Free Events' },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-14 sm:py-20 lg:py-24 w-full max-w-full">
      {/* Background Image with Layered Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=2000&q=80"
          alt="Kigali Night Life and Skyline"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Subtle Region Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kigali Event Discovery &amp; City Guide</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.12] max-w-4xl mx-auto text-balance">
          Discover What’s Happening in{' '}
          <span className="text-emerald-400 underline decoration-emerald-500/40 underline-offset-8">
            Kigali
          </span>
        </h1>

        <p className="text-slate-200 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-2 font-normal">
          Find concerts, nightlife, business events, workshops, sports, food experiences, and more — all in one place.
        </p>

        {/* Large Multi-Field Search Bar */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white text-slate-900 rounded-2xl p-3 sm:p-4 shadow-2xl border border-slate-200/80 max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Field 1: Event Name / Keyword */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="What are you looking for?"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold focus:outline-none placeholder:text-slate-400 text-slate-900 placeholder:font-normal"
              />
            </div>

            {/* Field 2: Category Dropdown */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
              <Tag className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                aria-label="Select category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold focus:outline-none text-slate-900 cursor-pointer"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Field 3: Location / District */}
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <select
                aria-label="Select location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base font-semibold focus:outline-none text-slate-900 cursor-pointer"
              >
                <option value="">All Kigali Areas</option>
                {KIGALI_NEIGHBORHOODS.map((hood) => (
                  <option key={hood.name} value={hood.name}>
                    {hood.name} ({hood.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Field 4: Date Picker & Search Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full">
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/70 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="date"
                  aria-label="Select date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm sm:text-base font-semibold focus:outline-none text-slate-900 min-w-0"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-sm sm:text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Filter Buttons Below Search */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5 text-sm">
          <span className="text-slate-300 font-bold">Quick Filters:</span>
          {quickFilters.map((qf) => {
            const isActive = activeQuickFilter === qf.id;
            return (
              <button
                key={qf.id}
                type="button"
                onClick={() => onQuickFilter(qf.id)}
                className={`px-3.5 py-2 rounded-xl border text-sm font-bold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 border-emerald-500 text-white font-extrabold shadow-sm'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-100'
                }`}
              >
                {qf.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
