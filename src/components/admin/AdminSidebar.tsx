import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Receipt,
  Ticket,
  Warehouse,
  BarChart3,
  Bell,
  History,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  X,
} from 'lucide-react';

export type AdminNavigationTab =
  | 'dashboard'
  | 'users'
  | 'businesses'
  | 'transactions'
  | 'products'
  | 'inventory'
  | 'reports'
  | 'notifications'
  | 'activity-logs'
  | 'settings'
  | 'profile';

interface AdminSidebarProps {
  activeTab: AdminNavigationTab;
  onSelectTab: (tab: AdminNavigationTab) => void;
  unreadNotificationsCount: number;
  totalUsersCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogoutClick: () => void;
  onExitToPublic: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadNotificationsCount,
  totalUsersCount,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onLogoutClick,
  onExitToPublic,
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminNavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'users' as AdminNavigationTab,
      label: 'Users',
      icon: Users,
      badge: totalUsersCount > 0 ? `${totalUsersCount}` : undefined,
    },
    {
      id: 'businesses' as AdminNavigationTab,
      label: 'Businesses',
      icon: Building2,
      badge: '6',
    },
    {
      id: 'transactions' as AdminNavigationTab,
      label: 'Orders / Transactions',
      icon: Receipt,
    },
    {
      id: 'products' as AdminNavigationTab,
      label: 'Products / Services',
      icon: Ticket,
    },
    {
      id: 'inventory' as AdminNavigationTab,
      label: 'Inventory',
      icon: Warehouse,
    },
    {
      id: 'reports' as AdminNavigationTab,
      label: 'Reports',
      icon: BarChart3,
    },
    {
      id: 'notifications' as AdminNavigationTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
      badgeType: 'alert',
    },
    {
      id: 'activity-logs' as AdminNavigationTab,
      label: 'Activity Logs',
      icon: History,
    },
    {
      id: 'settings' as AdminNavigationTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = (tab: AdminNavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden animate-in fade-in"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Branding & Logo */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/10">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5 truncate">
                    <span>KigaliPulse</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">
                      Enterprise
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">Core Admin Suite</div>
                </div>
              )}
            </div>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={onToggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close sidebar"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)] custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />

                  {!isCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-emerald-950/60 text-white'
                          : item.badgeType === 'alert'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Active Indicator bar */}
                  {isActive && !isCollapsed && (
                    <span className="w-1 h-4 rounded-full bg-emerald-300 shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: Public Portal Switcher & Logout */}
        <div className="p-3 border-t border-slate-800 space-y-1">
          {/* Public Portal shortcut */}
          <button
            type="button"
            onClick={onExitToPublic}
            title={isCollapsed ? 'Return to Public Site' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-emerald-300 hover:bg-slate-800/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-emerald-400" />
            {!isCollapsed && <span className="truncate">Public Live Portal</span>}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogoutClick}
            title={isCollapsed ? 'Sign Out' : undefined}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
