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

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Menu button & Title / Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            <span>Admin Suite</span>
            <span className="text-slate-300">/</span>
            <span className="capitalize text-slate-500 font-semibold">{activeTab.replace('-', ' ')}</span>
          </div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight">
            {getTabTitle(activeTab)}
          </h1>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 text-xs text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Search users, transactions, venues, logs...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white text-slate-600 rounded border border-slate-200 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Date context, Notification bell & User Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date context indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-medium">Kigali (GMT+2) · {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>

        {/* Global Search Mobile trigger */}
        <button
          type="button"
          onClick={onOpenGlobalSearch}
          aria-label="Open search"
          className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => onSelectTab('notifications')}
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover border border-slate-300 shadow-2xs"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-emerald-700 font-semibold">{currentUser.role}</div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {currentUser.role}
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onSelectTab('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>My Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onSelectTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Account Settings</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onSelectTab('settings');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                >
                  <Key className="w-4 h-4 text-slate-500" />
                  <span>Change Password</span>
                </button>
              </div>

              <div className="mt-1 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogoutClick();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
