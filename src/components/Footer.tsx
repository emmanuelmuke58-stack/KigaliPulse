import React from 'react';
import { 
  ArrowUpRight, 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Mail, 
  MapPin, 
  Phone,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenInfo: (type: 'about' | 'contact' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInfo }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 text-base border-t border-slate-900 pt-16 pb-24 md:pb-12 mt-auto w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-slate-900">
          
          {/* 1. Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white group cursor-pointer" onClick={() => onNavigate('discover')}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-display font-extrabold text-lg flex items-center justify-center shadow-lg shadow-emerald-900/20 group-hover:bg-emerald-500 transition-colors">
                KP
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-white leading-none">KigaliPulse</span>
                <span className="text-[10px] tracking-[0.2em] text-emerald-500 uppercase font-black mt-1">Official Events Hub</span>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-base max-w-xs">
              The premier event discovery and promotion ecosystem for Kigali. Connecting organizers with audiences across Rwanda's vibrant capital.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 2. Platform Navigation */}
          <div className="space-y-6">
            <h4 className="font-black text-white text-[13px] uppercase tracking-[0.15em] border-l-2 border-emerald-600 pl-3">Explore Platform</h4>
            <ul className="space-y-3.5">
              <li>
                <button type="button" onClick={() => onNavigate('discover')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
                  {t('nav.discover')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('categories')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
                  {t('nav.categories')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('venues')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
                  {t('nav.venues')}
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('organizers')} className="hover:text-white hover:translate-x-1 transition-all flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-emerald-500 transition-colors" />
                  {t('nav.organizers')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Community Hubs */}
          <div className="space-y-6">
            <h4 className="font-black text-white text-[13px] uppercase tracking-[0.15em] border-l-2 border-emerald-600 pl-3">Kigali Neighborhoods</h4>
            <div className="space-y-4">
              <div className="group cursor-default">
                <span className="text-slate-200 font-bold block group-hover:text-emerald-400 transition-colors">Kimihurura</span>
                <span className="text-[14px] text-slate-500">Convention Centre &amp; Fine Dining</span>
              </div>
              <div className="group cursor-default">
                <span className="text-slate-200 font-bold block group-hover:text-emerald-400 transition-colors">Remera &amp; Giporoso</span>
                <span className="text-[14px] text-slate-500">BK Arena, Amahoro &amp; Sports Hub</span>
              </div>
              <div className="group cursor-default">
                <span className="text-slate-200 font-bold block group-hover:text-emerald-400 transition-colors">Nyamirambo</span>
                <span className="text-[14px] text-slate-500">Culture, Heritage &amp; Flavors</span>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="text-white font-bold hover:text-emerald-400 transition-all flex items-center gap-1.5 group"
                >
                  <span>All Neighborhoods</span>
                  <ArrowUpRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* 4. Contact & Support */}
          <div className="space-y-6">
            <h4 className="font-black text-white text-[13px] uppercase tracking-[0.15em] border-l-2 border-emerald-600 pl-3">Contact &amp; Support</h4>
            <ul className="space-y-4 text-[15px]">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">Norrsken House Kigali,<br />KN 78 St, Kigali, Rwanda</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <a href="mailto:hello@kigali-pulse.rw" className="text-slate-400 hover:text-white transition-colors">hello@kigali-pulse.rw</a>
              </li>
              <li className="flex items-center gap-3 border-t border-slate-900 pt-4 mt-2">
                <button onClick={() => onOpenInfo('contact')} className="text-white font-bold hover:text-emerald-400 transition-colors flex items-center gap-2">
                  <span>Open Support Ticket</span>
                  <ExternalLink size={14} />
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[14px] font-bold">
            <button onClick={() => onOpenInfo('about')} className="text-slate-500 hover:text-white transition-colors">About</button>
            <button onClick={() => onNavigate('advertise')} className="text-slate-500 hover:text-white transition-colors">Advertise</button>
            <button onClick={() => onOpenInfo('terms')} className="text-slate-500 hover:text-white transition-colors">Terms</button>
            <button onClick={() => onOpenInfo('privacy')} className="text-slate-500 hover:text-white transition-colors">Privacy</button>
          </div>

          <div className="text-[14px] text-slate-500 font-medium text-center lg:text-right">
            <span className="block sm:inline">&copy; 2026 KigaliPulse.</span>
            <span className="hidden sm:inline mx-2">·</span>
            <span>Digitizing Rwanda's Event Economy</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
