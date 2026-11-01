import React from 'react';
import { Home, Compass, Bookmark, Plus, LayoutDashboard, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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
  const { t } = useLanguage();
  const tabs = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'saved', label: t('header.saved'), icon: Bookmark, badge: savedCount },
    isLoggedIn
      ? { id: 'organizer-dashboard', label: 'Portal', icon: LayoutDashboard }
      : { id: 'discover', label: t('nav.discover'), icon: Compass },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-t border-slate-100 pb-[env(safe-area-inset-bottom)] max-w-full w-full overflow-hidden shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      <nav aria-label="Mobile navigation" className="flex items-center justify-around h-20 px-4 w-full max-w-full relative">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;


          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center relative transition-all duration-300 focus:outline-none cursor-pointer py-2 ${
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                {typeof tab.badge === 'number' && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[12px] mt-1.5 font-bold tracking-tight transition-all ${isActive ? 'opacity-100 scale-105' : 'opacity-90'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-in fade-in zoom-in duration-300" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
