import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, Sparkles, Bell } from 'lucide-react';
import { EventItem } from '../types';
import { CompactHeaderEventSlider } from './CompactHeaderEventSlider';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedCount: number;
  onOpenSavedDrawer: () => void;
  onOpenSearchModal: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  events?: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  savedCount,
  onOpenSavedDrawer,
  onOpenSearchModal,
  onOpenNotifications,
  unreadNotificationsCount,
  events = [],
  onSelectEvent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'discover', label: 'Discover' },
    { id: 'categories', label: 'Categories' },
    { id: 'venues', label: 'Venues' },
    { id: 'organizers', label: 'Organizers' },
    { id: 'advertise', label: 'Advertise' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* ZONE 1: Brand Wordmark (Single Text Element) */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => handleNavClick('discover')}
            className="flex items-center gap-2 group focus:outline-none cursor-pointer"
          >
            <span className="font-display font-black text-2xl tracking-tighter text-slate-900 leading-none">
              Kigali<span className="text-emerald-600">Pulse</span>
            </span>
          </button>
        </div>

        {/* ZONE 2: Clean Typography Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-bold text-slate-500 uppercase tracking-widest">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors whitespace-nowrap py-1 border-b-2 ${
                currentView === link.id
                  ? 'text-slate-900 border-emerald-600'
                  : 'border-transparent hover:text-slate-900 hover:border-slate-200'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* ZONE 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* In-App PWA Install Prompt */}
          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            aria-label="Search events"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label="View notifications"
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
            )}
          </button>

          {/* Saved Events Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenSavedDrawer}
            aria-label="View saved events"
            className="relative min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-amber-500 text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>



          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Small, Elegant Upcoming Events Card Slider (2-second Auto-slide) */}
      {events && events.length > 0 && onSelectEvent && (
        <CompactHeaderEventSlider
          events={events}
          onSelectEvent={onSelectEvent}
          autoSlideInterval={2000}
        />
      )}

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => handleNavClick('organizer-dashboard')}
              className="w-full py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Organizer Hub
            </button>
          </div>


        </div>
      )}
    </header>
  );
};
