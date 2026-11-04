import React, { useState } from 'react';
import {
  Ticket,
  Warehouse,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  DollarSign,
  Users,
} from 'lucide-react';

interface AdminProductsInventoryProps {
  mode: 'products' | 'inventory';
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminProductsInventory: React.FC<AdminProductsInventoryProps> = ({
  mode,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const items = [
    {
      id: 'itm-1',
      name: 'BK Arena VIP Floor Access Pass',
      type: 'VIP Ticket',
      venue: 'BK Arena Kigali',
      capacity: 2500,
      sold: 2180,
      price: 50000,
      currency: 'RWF',
      status: 'Active',
    },
    {
      id: 'itm-2',
      name: 'BK Arena Standard Bowl Seating',
      type: 'Standard Ticket',
      venue: 'BK Arena Kigali',
      capacity: 7500,
      sold: 6940,
      price: 15000,
      currency: 'RWF',
      status: 'Active',
    },
    {
      id: 'itm-3',
      name: 'Kigali Convention Centre Delegate Pass',
      type: 'Conference Pass',
      venue: 'Kigali Convention Centre',
      capacity: 1200,
      sold: 1150,
      price: 150000,
      currency: 'RWF',
      status: 'Active',
    },
    {
      id: 'itm-4',
      name: 'Mundi Center Artisan Exhibition Booth #A',
      type: 'Vendor Booth',
      venue: 'Mundi Center Kigali',
      capacity: 45,
      sold: 40,
      price: 450000,
      currency: 'RWF',
      status: 'Active',
    },
    {
      id: 'itm-5',
      name: 'Norrsken House Hackathon Builder Pass',
      type: 'Tech Pass',
      venue: 'Norrsken House Kigali',
      capacity: 350,
      sold: 350,
      price: 25000,
      currency: 'RWF',
      status: 'Sold Out',
    },
    {
      id: 'itm-6',
      name: 'Inema Arts Sunset Jazz Terrace Admission',
      type: 'Cultural Admission',
      venue: 'Inema Arts Center',
      capacity: 400,
      sold: 310,
      price: 10000,
      currency: 'RWF',
      status: 'Active',
    },
  ];

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            {mode === 'products' ? (
              <Ticket className="w-6 h-6 text-emerald-400" />
            ) : (
              <Warehouse className="w-6 h-6 text-emerald-400" />
            )}
            <span>{mode === 'products' ? 'Products & Ticketing Tiers' : 'Venue Capacity & Inventory Management'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time physical capacity allocation, ticket tier limits, and vendor booth inventories.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onTriggerToast('info', 'Tier Created', 'New ticketing inventory created.')
          }
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-slate-950 transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{mode === 'products' ? 'Create Ticket Tier' : 'Add Capacity Block'}</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by product name, venue, or tier..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Tier / Product Name</th>
                <th className="py-4 pr-4 font-semibold">Classification</th>
                <th className="py-4 pr-4 font-semibold">Venue Host</th>
                <th className="py-4 pr-4 font-semibold text-right">Price</th>
                <th className="py-4 pr-4 font-semibold text-center">Allocated Capacity</th>
                <th className="py-4 pr-4 font-semibold">Capacity Fill Rate</th>
                <th className="py-4 pr-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => {
                const fillPct = Math.round((item.sold / item.capacity) * 100);
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-white">{item.name}</td>
                    <td className="py-4 pr-4 text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-emerald-400">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-300">{item.venue}</td>
                    <td className="py-4 pr-4 text-right font-extrabold text-white tabular-nums">
                      {item.price.toLocaleString()} {item.currency}
                    </td>
                    <td className="py-4 pr-4 text-center font-bold text-slate-200 tabular-nums">
                      {item.sold} / {item.capacity}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span>{fillPct}%</span>
                          <span>{item.capacity - item.sold} left</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fillPct >= 95 ? 'bg-rose-500' : fillPct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === 'Sold Out'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
