import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  User,
  Settings,
  Key,
  LogOut,
  ChevronDown,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { EnterpriseUser } from '../../types/admin';
import { AdminNavigationTab } from './AdminSidebar';

interface AdminTopNavProps {
  currentUser: EnterpriseUser;
  activeTab: AdminNavigationTab;
  unreadCount: number;
  onOpenMobileMenu: () => void;
  onSelectTab: (tab: AdminNavigationTab) => void;
  onOpenGlobalSearch: () => void;
  onLogoutClick: () => void;
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  currentUser,
  activeTab,
  unreadCount,
  onOpenMobileMenu,
  onSelectTab,
  onOpenGlobalSearch,
  onLogoutClick,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Title formatting
  const getTabTitle = (tab: AdminNavigationTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Executive Overview';
      case 'users':
        return 'Users & Identity Management';
      case 'businesses':
        return 'Business → Events Management';
      case 'transactions':
        return 'Orders & Financial Transactions';
      case 'products':
        return 'Event Ticketing & Products';
      case 'inventory':
        return 'Venue Capacity & Inventory';
      case 'reports':
        return 'Intelligence & Strategic Reports';
      case 'notifications':
        return 'Notification Center';
      case 'activity-logs':
        return 'System Audit Trail & Activity Logs';
      case 'settings':
        return 'System & Enterprise Settings';
      case 'profile':
        return 'Administrator Profile';
      default:
        return 'Dashboard';
    }
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between shadow-sm">
      {/* Left: Mobile Menu button & Title / Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2.5 rounded-2xl text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-200 shadow-sm"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>KigaliPulse Ent</span>
            <span className="text-slate-200">|</span>
            <span className="text-slate-500">{activeTab.replace('-', ' ')}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-0.5">
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-10">
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-500/30 text-sm text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs group"
        >
          <div className="flex items-center gap-3">
            <Search className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            <span className="font-semibold opacity-70">Search governance records & datasets...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-xs text-[10px] font-black text-slate-400 uppercase tracking-tighter">
            <span className="text-slate-300">CTRL</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right: Date context, Notification bell & User Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Date context indicator */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-black text-slate-500 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/80">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span className="uppercase tracking-widest">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Global Search Mobile trigger */}
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          aria-label="Open search"
          className="md:hidden p-2.5 rounded-2xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-200 shadow-sm"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          aria-label="View notifications"
          className="relative p-2.5 rounded-2xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-200 shadow-sm"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-white text-[10px] font-black text-white flex items-center justify-center shadow-lg">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-slate-50 transition-all text-left cursor-pointer border border-transparent hover:border-slate-200 shadow-sm sm:shadow-none"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-black text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">{currentUser.role}</div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-[24px] p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
              <div className="p-4 bg-slate-50 rounded-2xl mb-2 border border-slate-100">
                <p className="text-sm font-black text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate font-semibold mt-0.5">{currentUser.email}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md shadow-emerald-600/20">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {[
                  { icon: User, label: 'My Profile', tab: 'profile' },
                  { icon: Settings, label: 'Account Settings', tab: 'settings' },
                  { icon: Key, label: 'Change Password', tab: 'settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onSelectTab(item.tab as any);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all text-left cursor-pointer group"
                  >
                    <item.icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all text-left cursor-pointer group"
                >
                  <LogOut className="w-4.5 h-4.5 group-hover:translate-x-1 transition-transform" />
                  <span className="uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
