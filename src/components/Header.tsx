import React, { useState } from 'react';
import { Search, Bookmark, PlusCircle, Menu, X, Sparkles, Bell, BarChart3 } from 'lucide-react';
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
  currentUser: any | null;
  onOpenLogin: () => void;
  onOpenProfile: () => void;
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
  currentUser,
  onOpenLogin,
  onOpenProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'discover', label: 'Discover Events' },
    { id: 'home', label: 'Home' },
    { id: 'categories', label: 'Categories' },
    { id: 'venues', label: 'Venues' },
    { id: 'organizers', label: 'Organizers' },
    { id: 'advertise', label: 'Advertise' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 w-full max-w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 w-full max-w-full">
        
        {/* ZONE 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleNavClick('discover')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 font-display font-extrabold text-xl flex items-center justify-center shadow-sm group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              KP
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-tight text-slate-900 leading-none">
                KigaliPulse
              </span>
              <span className="text-xs tracking-widest text-slate-500 uppercase font-bold mt-0.5">
                Rwanda
              </span>
            </div>
          </button>
        </div>

        {/* ZONE 2: Clean Typography Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-base font-semibold text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className={`transition-colors whitespace-nowrap py-1 relative cursor-pointer ${
                currentView === link.id
                  ? 'text-slate-950 font-black border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* ZONE 3: Primary Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
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

          {/* Create Event CTA */}
          <button
            type="button"
            onClick={() => handleNavClick('create')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>

          {/* Admin Reports & Governance Button (SuperAdmin only) */}
          {currentUser?.role === 'SuperAdmin' && (
            <button
              type="button"
              onClick={() => handleNavClick('admin-dashboard')}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-colors whitespace-nowrap ${
                currentView === 'admin-dashboard'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
              }`}
              title="Open Admin Reports & Governance"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Admin Reports</span>
            </button>
          )}

          {/* User Profile / Login */}
          {currentUser ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-1.5 py-1.5 rounded-xl hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-xs"
              />
              <div className="hidden lg:flex flex-col items-start pr-2">
                <span className="text-[11px] font-bold text-slate-900 leading-none">{currentUser.name}</span>
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{currentUser.role}</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="hidden md:inline-flex px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
            >
              Sign In
            </button>
          )}

          {/* PWA Install Trigger */}
          <PWAInstallButton />

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
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-all active:scale-[0.97] ${
                  currentView === link.id
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {currentUser && (
            <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => handleNavClick('organizer-dashboard')}
                className="w-full py-3.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
              >
                Organizer Hub
              </button>
              {currentUser.role === 'SuperAdmin' && (
                <button
                  type="button"
                  onClick={() => handleNavClick('admin-dashboard')}
                  className="w-full py-3.5 text-center text-xs font-bold text-slate-700 bg-slate-100 rounded-2xl hover:bg-slate-200 active:scale-[0.98] transition-all"
                >
                  Admin Moderation
                </button>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => handleNavClick('create')}
            className="w-full mt-3 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New Event</span>
          </button>
        </div>
      )}
    </header>
  );
};
