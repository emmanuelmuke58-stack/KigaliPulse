import React, { useState } from 'react';
import { ShieldCheck, Users, Calendar, Globe, MapPin, Phone, Mail, Check, ArrowRight, Eye } from 'lucide-react';
import { OrganizerItem, EventItem } from '../types';
import { ORGANIZERS } from '../data/mockData';

interface OrganizerDirectoryProps {
  onSelectOrganizerModal: (organizer: OrganizerItem) => void;
  followedOrganizerIds: string[];
  onToggleFollow: (organizerId: string) => void;
}

export const OrganizerDirectory: React.FC<OrganizerDirectoryProps> = ({
  onSelectOrganizerModal,
  followedOrganizerIds,
  onToggleFollow,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Verified Event Organizers in Kigali
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
          Follow premier production studios, cultural collectives, startup ecosystems, and festival hosts in Rwanda.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ORGANIZERS.map((org) => {
          const isFollowing = followedOrganizerIds.includes(org.id);

          return (
            <div
              key={org.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all p-6 flex flex-col justify-between space-y-4 hover:shadow-lg shadow-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={org.image}
                    alt={org.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-base text-slate-900 truncate">{org.name}</h3>
                      {org.verified && (
                        <span title="Verified Organizer">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block truncate">{org.category}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {org.bio}
                </p>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.eventsCount} Events</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{org.followersCount.toLocaleString()} Followers</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectOrganizerModal(org)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  View Profile
                </button>

                <button
                  type="button"
                  onClick={() => onToggleFollow(org.id)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  {isFollowing ? 'Following ✓' : 'Follow Host'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const OrganizerProfileModal: React.FC<{
  organizer: OrganizerItem | null;
  events: EventItem[];
  onClose: () => void;
  isFollowing: boolean;
  onToggleFollow: (id: string) => void;
  onSelectEvent: (event: EventItem) => void;
}> = ({ organizer, events, onClose, isFollowing, onToggleFollow, onSelectEvent }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  if (!organizer) return null;

  const orgEvents = events.filter((e) => e.organizerId === organizer.id);
  const upcomingEvents = orgEvents.filter((e) => new Date(e.date) >= new Date('2026-09-24'));
  const pastEvents = orgEvents.filter((e) => new Date(e.date) < new Date('2026-09-24'));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        <button
          type="button"
          onClick={onClose}
          aria-label="Close organizer modal"
          className="absolute top-4 right-4 z-30 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          ✕
        </button>

        {/* Top Header Card */}
        <div className="p-6 sm:p-8 bg-slate-50 border-b border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={organizer.image}
                alt={organizer.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-2xl text-slate-900">{organizer.name}</h2>
                  {organizer.verified && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{organizer.category}</span>
                <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{organizer.location}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onToggleFollow(organizer.id)}
              className={`min-h-[44px] px-6 py-2.5 rounded-xl font-bold text-xs transition-colors self-start sm:self-center shadow-sm ${
                isFollowing
                  ? 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isFollowing ? 'Following ✓' : 'Follow Organizer'}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            {organizer.bio}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 pt-3 border-t border-slate-200">
            <a href={organizer.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-emerald-700 hover:underline">
              <Globe className="w-3.5 h-3.5" />
              <span>Official Website</span>
            </a>
            <span className="flex items-center gap-1 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{organizer.phone}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{organizer.email}</span>
            </span>
          </div>
        </div>

        {/* Organizer Events Tabs */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('upcoming')}
              className={`pb-2 text-xs font-bold transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Upcoming Events ({upcomingEvents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('past')}
              className={`pb-2 text-xs font-bold transition-colors ${
                activeTab === 'past'
                  ? 'text-emerald-700 border-b-2 border-emerald-600'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Past Showcases ({pastEvents.length})
            </button>
          </div>

          {activeTab === 'upcoming' ? (
            <div className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No upcoming events announced right now. Follow this organizer to receive alerts when new dates drop.
                </div>
              ) : (
                upcomingEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onClose();
                      onSelectEvent(evt);
                    }}
                    className="p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-600 transition-all flex items-center justify-between gap-4 cursor-pointer hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <img src={evt.image} alt={evt.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-[10px] font-bold text-emerald-700">{evt.displayDate} · {evt.time}</span>
                          <span
                            className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]"
                            title={`${evt.views.toLocaleString()} page visits (views)`}
                          >
                            <Eye className="w-3 h-3 text-slate-500" />
                            <span>{evt.views.toLocaleString()} Views</span>
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{evt.title}</h4>
                        <span className="text-xs text-slate-500">{evt.venue}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900 tabular-nums shrink-0">{evt.priceDisplay}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              Past event archive is kept for portfolio verification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
