import React from 'react';
import { Home, Compass, Bookmark, Plus, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  savedCount,
}) => {
  const tabs = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'home', label: 'Home', icon: Home },
    { id: 'create', label: 'Create', icon: Plus, isPrimary: true },
    { id: 'saved', label: 'Saved', icon: Bookmark, badge: savedCount },
    { id: 'organizer-dashboard', label: 'Portal', icon: LayoutDashboard },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-[env(safe-area-inset-bottom)]">
      <nav aria-label="Mobile navigation" className="grid grid-cols-5 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className="flex flex-col items-center justify-center -mt-4 group focus:outline-none"
                aria-label="Create an event"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center group-active:scale-95 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold text-slate-700 mt-1">Create</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`min-h-[48px] flex flex-col items-center justify-center relative transition-colors focus:outline-none ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1">{tab.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
