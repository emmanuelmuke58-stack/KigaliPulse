import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Info,
  Car,
  UserCheck,
  Sparkles,
  Code,
  Eye,
} from 'lucide-react';
import { EventItem } from '../types';
import { InteractiveKigaliMap } from './InteractiveKigaliMap';

interface EventDetailModalProps {
  event: EventItem | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, eventId: string) => void;
  onSelectOrganizer?: (organizerId: string) => void;
  onSelectVenue?: (venueId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  isSaved,
  onToggleSave,
  onSelectOrganizer,
  onSelectVenue,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showJsonLd, setShowJsonLd] = useState(false);

  if (!event) return null;

  // SEO-friendly canonical URL simulation
  const canonicalUrl = `${window.location.origin}/events/${event.slug}`;

  // WhatsApp share
  const shareWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out "${event.title}" happening on ${event.displayDate} at ${event.venue}, Kigali, Rwanda!\nFind details & tickets on KigaliPulse: ${canonicalUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // X (Twitter) share
  const shareX = () => {
    const text = encodeURIComponent(
      `Discovering "${event.title}" happening in #Kigali #Rwanda on ${event.displayDate} via @KigaliPulse:`
    );
    window.open(`https://x.com/intent/tweet?text=${text}&url=${encodeURIComponent(canonicalUrl)}`, '_blank');
  };

  // LinkedIn share
  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`,
      '_blank'
    );
  };

  // Copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Structured Data (JSON-LD) for SEO compliance
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: `${event.date}T${event.time.split('–')[0]?.trim() || '18:00'}`,
    endDate: event.endDate ? `${event.endDate}T23:00` : `${event.date}T23:30`,
    eventStatus:
      event.status === 'Cancelled'
        ? 'https://schema.org/EventCancelled'
        : event.status === 'Postponed'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        streetAddress: event.address,
        addressLocality: event.neighborhood,
        addressRegion: event.district,
        addressCountry: 'RW',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: event.lat,
        longitude: event.lng,
      },
    },
    image: [event.image],
    organizer: {
      '@type': 'Organization',
      name: event.organizer,
      url: event.contactWebsite || canonicalUrl,
    },
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'RWF',
      url: event.externalTicketUrl,
      availability: event.status === 'Sold Out' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      validFrom: event.createdAt,
    },
    performer: event.performers?.map((p) => ({
      '@type': 'Person',
      name: p.name,
      jobTitle: p.role,
    })),
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200/90 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Close Trigger */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event modal"
          className="absolute top-4 right-4 z-30 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Cover Hero Image */}
        <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-900">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {/* Measured Dark Scrim for 4.5:1 Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          {/* Headline Content Over Scrim */}
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 space-y-2 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 flex-wrap">
              <span className="uppercase tracking-wider font-bold">{event.category}</span>
              <span aria-hidden="true" className="text-white/40">·</span>
              <span className="text-slate-300 font-medium">{event.neighborhood}, Kigali</span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Key Metrics / Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5 sm:p-6 bg-slate-50 border-b border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Date</span>
            <div className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{event.displayDate}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Time</span>
            <div className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{event.time}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Venue &amp; Location</span>
            <div className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Admission Price</span>
            <div className="font-bold text-base text-emerald-700 mt-0.5 tabular-nums">
              {event.priceDisplay}
            </div>
          </div>

          <div>
            <span className="text-slate-500 font-medium block">Page Visits</span>
            <div className="font-bold text-sm text-slate-900 mt-0.5 flex items-center gap-1.5 tabular-nums">
              <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{event.views.toLocaleString()} Views</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Listing visitors
            </span>
          </div>
        </div>

        {/* Primary Action Buttons & Ticketing Notice */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary External Ticketing Button */}
            <a
              href={event.externalTicketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 text-center"
            >
              <span>Get Tickets / Register</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Save Button */}
            <button
              type="button"
              onClick={(e) => onToggleSave(e, event.id)}
              className={`min-h-[44px] px-5 py-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                isSaved
                  ? 'bg-amber-500 border-amber-500 text-white'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              <span>{isSaved ? 'Saved to Profile' : 'Save Event'}</span>
            </button>

            {/* Direct WhatsApp Share */}
            <button
              type="button"
              onClick={shareWhatsApp}
              className="min-h-[44px] px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              title="Share on WhatsApp (Rwanda's favorite messenger)"
            >
              <Share2 className="w-4 h-4" />
              <span>Share WhatsApp</span>
            </button>
          </div>

          {/* Transparency Callout: External Ticketing Provider Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Buy Tickets — External Ticketing Platform</span>
              <p className="text-amber-800 leading-relaxed">
                Tickets for this event are officially issued via{' '}
                <strong>{event.ticketProviderName}</strong>. KigaliPulse does not process payments internally. You will be redirected to the verified partner portal.
              </p>
            </div>
          </div>

          {/* Multi-Channel Share Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-semibold text-slate-500 mr-2">Share this event:</span>
            <button
              type="button"
              onClick={shareWhatsApp}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={shareX}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
            >
              X / Twitter
            </button>
            <button
              type="button"
              onClick={shareLinkedIn}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium"
            >
              LinkedIn
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? 'Copied URL!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Description & Details Body */}
          <div className="space-y-6 pt-4 border-t border-slate-100">
            
            {/* About Section */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">About the Event</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* What to Expect */}
            {event.whatToExpect && event.whatToExpect.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">What to Expect</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.whatToExpect.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Schedule Timeline */}
            {event.schedule && event.schedule.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Schedule &amp; Program</h3>
                <div className="space-y-2.5 border-l-2 border-emerald-500/30 pl-4 ml-1">
                  {event.schedule.map((slot, idx) => (
                    <div key={idx} className="relative space-y-0.5">
                      <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-4 ring-white" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-700 tabular-nums">
                          {slot.time}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{slot.title}</h4>
                      </div>
                      {slot.description && (
                        <p className="text-xs text-slate-500">{slot.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performers or Speakers */}
            {event.performers && event.performers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Performers &amp; Speakers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {event.performers.map((performer, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200/70 bg-white flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                        {performer.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{performer.name}</h4>
                        <span className="text-[11px] text-slate-500 truncate block">{performer.role}</span>
                        {performer.company && (
                          <span className="text-[10px] text-slate-400 truncate block">{performer.company}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practical Guidelines: Dress Code, Age, Parking */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Dress Code</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {event.dressCode || 'Smart Casual'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Age Restriction</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {event.ageRestriction || 'All ages welcome'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Parking &amp; Transit</span>
                <span className="font-bold text-slate-800 mt-0.5 block">
                  {event.parkingInfo || 'Street and venue parking'}
                </span>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="p-4 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {event.organizerLogo ? (
                  <img
                    src={event.organizerLogo}
                    alt={event.organizer}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-sm">
                    {event.organizer.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900">{event.organizer}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold">
                      Verified Host
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">Contact: {event.contactPhone || '+250 788 000 000'}</span>
                </div>
              </div>

              {onSelectOrganizer && (
                <button
                  type="button"
                  onClick={() => onSelectOrganizer(event.organizerId)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  View Host Profile
                </button>
              )}
            </div>

            {/* Interactive Venue Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Venue &amp; Location Map</h3>
                <span className="text-xs text-slate-500">{event.address}</span>
              </div>

              <InteractiveKigaliMap
                lat={event.lat}
                lng={event.lng}
                venueName={event.venue}
                address={event.address}
                district={event.district}
                neighborhood={event.neighborhood}
              />
            </div>

            {/* SEO Structured Data Schema.org Toggle */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-400" />
                <span>SEO Schema.org / JSON-LD Data available</span>
              </div>
              <button
                type="button"
                onClick={() => setShowJsonLd(!showJsonLd)}
                className="text-emerald-700 hover:underline font-semibold"
              >
                {showJsonLd ? 'Hide Structured Data' : 'Inspect JSON-LD'}
              </button>
            </div>

            {showJsonLd && (
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[11px] overflow-x-auto font-mono max-h-48">
                {JSON.stringify(jsonLdData, null, 2)}
              </pre>
            )}

          </div>
        </div>

        {/* Sticky Mobile Bottom Bar: Get Tickets / Register (15% cap) */}
        <div className="md:hidden sticky bottom-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Admission</span>
            <span className="text-sm font-extrabold text-slate-900 tabular-nums">
              {event.priceDisplay}
            </span>
          </div>

          <a
            href={event.externalTicketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <span>Get Tickets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </div>
  );
};
