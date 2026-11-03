import React, { useState } from 'react';
import { Megaphone, CheckCircle2, TrendingUp, Users, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdvertisePage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [tier, setTier] = useState('Featured Placement');

  const packages = [
    {
      name: 'Featured Placement',
      price: 'RF 150,000 / week',
      desc: 'Pin your event to the top of category pages and Featured Events home carousel.',
      features: [
        'Top placement in category feeds',
        'Featured golden badge display',
        'Highlighted in weekly WhatsApp Kigali newsletter',
        'Real-time impression & click analytics',
      ],
    },
    {
      name: 'Homepage Banner Takeover',
      price: 'RF 350,000 / week',
      desc: 'High-impact brand or festival banner directly beneath the Kigali hero search section.',
      features: [
        'Dominant homepage banner placement',
        'High-resolution desktop & mobile responsive banner',
        'Over 40,000 weekly verified Kigali views',
        'Dedicated click-through destination link',
      ],
    },
    {
      name: 'Venue & Corporate Showcase',
      price: 'RF 500,000 / month',
      desc: 'For hotels, arenas, lounges, and corporate conference centers in Rwanda.',
      features: [
        'Priority placement in Kigali Venue Directory',
        'Direct booking inquiries routed to your sales team',
        'Sponsorship badge across associated city categories',
        'Dedicated account manager in Kigali Heights',
      ],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-base font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Partner with KigaliPulse
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Advertise Your Events, Brand &amp; Venue to Kigali
        </h1>
        <p className="text-slate-600 text-base sm:text-base leading-relaxed">
          Connect directly with thousands of residents, expats, tech professionals, creative enthusiasts, and international travelers actively looking for what to do in Kigali.
        </p>
      </div>

      {/* Trust Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-slate-900 tabular-nums">48,000+</div>
          <span className="text-base text-slate-500 font-medium">Monthly Active Kigali Visitors</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-emerald-700 tabular-nums">78%</div>
          <span className="text-base text-slate-500 font-medium">Mobile Traffic from Kigali &amp; EAC</span>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
          <div className="text-3xl font-black text-slate-900 tabular-nums">12,500+</div>
          <span className="text-base text-slate-500 font-medium">Weekly Ticket Click-Throughs</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.name}
            className="p-6 bg-white rounded-3xl border border-slate-200 hover:border-emerald-600 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{pkg.name}</h3>
                <div className="text-xl font-extrabold text-emerald-700 mt-1 tabular-nums">
                  {pkg.price}
                </div>
                <p className="text-base text-slate-500 mt-2 leading-relaxed">{pkg.desc}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {pkg.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-base text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setTier(pkg.name);
                const el = document.getElementById('ad-inquiry-form');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-emerald-600 hover:text-white font-bold text-base transition-colors text-slate-800"
            >
              Select Package
            </button>
          </div>
        ))}
      </div>

      {/* Campaign Booking Form */}
      <div id="ad-inquiry-form" className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Request Campaign Placement</h2>
          <p className="text-base text-slate-500 mt-1">
            Selected Tier: <strong className="text-emerald-700">{tier}</strong>. Our partnership team will contact you within 4 hours.
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-50 text-emerald-900 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-base">Campaign Request Received!</h4>
            <p className="text-base text-emerald-800">
              Murakoze! An ad operations specialist from Kigali Heights will review your creative specifications and invoice details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-base">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Brand Name *</label>
                <input required type="text" placeholder="e.g. Visit Rwanda, RwandAir, BK Arena" className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person Name *</label>
                <input required type="text" placeholder="Full Name" className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Email *</label>
                <input required type="email" placeholder="name@company.rw" className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                <input required type="tel" placeholder="+250 788 000 000" className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Campaign Goal / Dates</label>
              <textarea rows={3} placeholder="Tell us about the event date, target audience in Kigali, or specific placement duration..." className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50" />
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-sm transition-colors">
              Submit Campaign Application
            </button>
          </form>
        )}
      </div>

    </div>
  );
};
