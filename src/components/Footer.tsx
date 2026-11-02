import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenInfo: (type: 'about' | 'contact' | 'terms' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenInfo }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-20 md:pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-display font-extrabold text-sm flex items-center justify-center">
                KP
              </div>
              <span className="font-display font-black text-xl tracking-tight">KigaliPulse</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              The premier mobile-first event discovery and organizer platform for Kigali, Rwanda. Discover concerts, tech summits, nightlife, and cultural exhibitions across the capital.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={() => onNavigate('discover')} className="hover:text-white transition-colors">
                  Discover All Events
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Categories Directory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('venues')} className="hover:text-white transition-colors">
                  Venues Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('organizers')} className="hover:text-white transition-colors">
                  Verified Organizers
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('create')} className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  Publish Your Event
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('admin-dashboard')} className="hover:text-white transition-colors text-slate-300">
                  Admin Reports &amp; Analytics
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('organizer-dashboard')} className="hover:text-white transition-colors text-slate-300">
                  Organizer Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kigali Hubs</h4>
            <ul className="space-y-2">
              <li><span className="text-slate-300">Kimihurura</span> · Convention &amp; Dining</li>
              <li><span className="text-slate-300">Remera</span> · BK Arena &amp; Sports</li>
              <li><span className="text-slate-300">Kacyiru</span> · Arts &amp; Embassies</li>
              <li><span className="text-slate-300">Nyamirambo</span> · Heritage &amp; Flavors</li>
              <li><span className="text-slate-300">Kiyovu &amp; Downtown</span> · Innovation &amp; Tech</li>
              <li className="pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('locations')}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Explore All Neighborhoods</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Info */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Information</h4>
            <ul className="space-y-2">
              <li>
                <button type="button" onClick={() => onOpenInfo('about')} className="hover:text-white transition-colors">
                  About KigaliPulse
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('advertise')} className="hover:text-white transition-colors">
                  Advertise &amp; Promote
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenInfo('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenInfo('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onOpenInfo('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Baseline Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 KigaliPulse Rwanda. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Built for Kigali, Rwanda</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">East Africa Event Network</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
