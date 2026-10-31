import React from 'react';
import { Home, Compass, Bookmark, Plus, LayoutDashboard, User } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedCount: number;
  isLoggedIn?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  savedCount,
  isLoggedIn = false,
}) => {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: Plus, isPrimary: true },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
    isLoggedIn
      ? { id: 'organizer-dashboard', label: 'Portal', icon: LayoutDashboard }
      : { id: 'login', label: 'Sign In', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)] max-w-full w-full overflow-hidden shadow-lg">
      <nav aria-label="Mobile navigation" className="grid grid-cols-5 items-center h-18 px-2 w-full max-w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center -mt-5 group focus:outline-none cursor-pointer"
                aria-label="Create an event"
              >
                <div className="w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center justify-center group-active:scale-95 transition-transform">
                  <Icon className="w-6 h-6 stroke-[2.2px]" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-1">Create</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`min-h-[52px] flex flex-col items-center justify-center relative transition-colors focus:outline-none cursor-pointer ${
                isActive ? 'text-emerald-700 font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5.5 h-5.5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.9px]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs tracking-tight mt-1 font-semibold">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
