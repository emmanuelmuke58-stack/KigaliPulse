import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { EnterpriseBusiness } from '../../types/admin';

interface AdminBusinessesProps {
  businesses: EnterpriseBusiness[];
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminBusinesses: React.FC<AdminBusinessesProps> = ({
  businesses,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = businesses.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" />
            <span>Registered Businesses &amp; Venues</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stadiums, conference centers, creative hubs, and hospitality enterprises operating in Kigali.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onTriggerToast('info', 'Onboard Business', 'Business onboarding workflow launched.')
          }
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-slate-950 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Business</span>
        </button>
      </div>

      {/* 2. Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search venue name, district, or category..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      {/* 3. Grid of Businesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((biz) => (
          <div
            key={biz.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all shadow-sm flex flex-col justify-between space-y-4 group"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {biz.category}
                </span>
                <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{biz.status}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                {biz.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{biz.ownerName}</p>

              <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{biz.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Total Revenue</span>
                <span className="font-extrabold text-white text-sm tabular-nums">
                  {(biz.totalRevenue / 1000000).toFixed(1)}M RWF
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Events Hosted</span>
                <span className="font-bold text-emerald-400 text-sm tabular-nums">{biz.totalEvents}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
