import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Layers, Compass } from 'lucide-react';

interface KigaliMapProps {
  lat: number;
  lng: number;
  venueName: string;
  address: string;
  district?: string;
  neighborhood?: string;
}

export const InteractiveKigaliMap: React.FC<KigaliMapProps> = ({
  lat,
  lng,
  venueName,
  address,
  district = 'Gasabo',
  neighborhood = 'Kimihurura',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<'streets' | 'terrain'>('streets');

  // Google Maps directions URL
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  // Normalized relative coordinate on Kigali canvas
  // Kigali approximate bounds: lat -1.93 to -1.98, lng 30.04 to 30.12
  const minLat = -1.985;
  const maxLat = -1.925;
  const minLng = 30.04;
  const maxLng = 30.125;

  const pinX = Math.min(Math.max(((lng - minLng) / (maxLng - minLng)) * 100, 10), 90);
  const pinY = Math.min(Math.max(((maxLat - lat) / (maxLat - minLat)) * 100, 10), 90);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-inner">
      {/* Map Header Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-base font-medium flex items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
          <span>Kigali Interactive City Grid</span>
          <span className="text-slate-400">· {neighborhood}, {district}</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-white/10 text-base">
          <button
            type="button"
            onClick={() => setMapMode('streets')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${mapMode === 'streets' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            Streets
          </button>
          <button
            type="button"
            onClick={() => setMapMode('terrain')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${mapMode === 'terrain' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-300 hover:text-white'}`}
          >
            Hills (Topography)
          </button>
          <div className="h-4 w-px bg-white/15 mx-1" />
          <button
            type="button"
            onClick={() => setZoomLevel((z) => (z === 1 ? 1.3 : 1))}
            className="px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Toggle zoom"
          >
            {zoomLevel === 1 ? 'Zoom +' : 'Zoom -'}
          </button>
        </div>
      </div>

      {/* Styled Interactive Canvas Vector Background */}
      <div
        className="w-full h-64 sm:h-72 relative overflow-hidden transition-transform duration-300 origin-center cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 800 450"
          className="w-full h-full object-cover select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="hillShading" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background Field */}
          <rect width="800" height="450" fill="url(#hillShading)" />
          <rect width="800" height="450" fill="url(#cityGrid)" />

          {/* Kigali Rolling Hills Topographic Contours */}
          <path
            d="M 50,120 Q 200,40 400,100 T 750,70"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeOpacity={mapMode === 'terrain' ? '0.4' : '0.15'}
            strokeDasharray="4 4"
          />
          <path
            d="M 30,220 Q 250,150 480,240 T 780,200"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeOpacity={mapMode === 'terrain' ? '0.4' : '0.15'}
          />
          <path
            d="M 60,340 Q 300,280 520,380 T 760,330"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeOpacity={mapMode === 'terrain' ? '0.35' : '0.1'}
          />

          {/* Major Kigali Boulevards (KG / KN / KK Avenues) */}
          {/* Boulevard de l'Umuganda & Airport Road */}
          <path
            d="M 80,390 C 220,310 380,230 680,210"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeOpacity="0.8"
            strokeLinecap="round"
          />
          {/* KG 2 Ave Kimihurura & Convention Roundabout */}
          <circle cx="430" cy="225" r="28" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeOpacity="0.9" />
          <text x="430" y="229" fill="#94a3b8" fontSize="9" textAnchor="middle" fontWeight="bold">
            KCC ROUNDABOUT
          </text>

          {/* KG 17 Ave to BK Arena / Remera */}
          <path
            d="M 458,225 C 550,220 620,180 720,170"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3.5"
            strokeOpacity="0.75"
          />

          {/* Nyabugogo to Downtown / Kiyovu axis */}
          <path
            d="M 120,130 C 180,200 240,260 290,320"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3"
            strokeOpacity="0.7"
          />

          {/* Nyarutarama Lakeside Drive */}
          <path
            d="M 430,200 C 470,120 530,90 640,80"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeOpacity="0.6"
          />

          {/* Neighborhood Labels */}
          <text x="430" y="175" fill="#38bdf8" fontSize="12" fontWeight="bold" opacity="0.9">KIMIHURURA</text>
          <text x="630" y="145" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">REMERA</text>
          <text x="360" y="90" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">KACYIRU</text>
          <text x="210" y="270" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">KIYOVU</text>
          <text x="140" y="340" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">NYAMIRAMBO</text>
          <text x="490" y="330" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">GIKONDO</text>
          <text x="250" y="210" fill="#94a3b8" fontSize="11" fontWeight="bold" opacity="0.8">DOWNTOWN</text>
        </svg>

        {/* Dynamic Venue Pin Indicator */}
        <div
          className="absolute z-10 -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto"
          style={{ left: `${pinX}%`, top: `${pinY}%` }}
        >
          <div className="relative group cursor-pointer flex flex-col items-center">
            {/* Popover Card */}
            <div className="mb-1 px-3 py-1.5 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 text-base font-bold whitespace-nowrap animate-bounce flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{venueName}</span>
            </div>

            {/* Pin Graphic */}
            <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-emerald-500/30">
              <MapPin className="w-5 h-5 fill-white text-emerald-600" />
            </div>
            {/* Shadow ripple */}
            <div className="w-4 h-1.5 bg-black/60 rounded-full blur-[2px] mt-0.5" />
          </div>
        </div>
      </div>

      {/* Map Bottom Action Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-3 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-base">
        <div className="space-y-0.5">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{venueName}</span>
          </div>
          <p className="text-slate-400">{address}</p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors shadow-sm active:scale-95"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Get Directions</span>
          <ExternalLink className="w-3 h-3 text-emerald-200" />
        </a>
      </div>
    </div>
  );
};
