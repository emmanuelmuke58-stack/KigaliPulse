import React, { useState } from 'react';
import {
  EventItem,
  VenueItem,
  OrganizerItem,
  EventStatus,
  EventCategory,
  UserProfile,
  AuditLogItem,
} from './types';
import {
  EVENTS as INITIAL_EVENTS,
  CATEGORIES,
  VENUES,
  ORGANIZERS,
  ADVERTISEMENTS,
  INITIAL_AUDIT_LOGS,
  CURRENT_USER,
} from './data/mockData';
import { getStoredEvents, saveStoredEvents, recordEventView } from './services/eventStore';

// Component Imports
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroSection } from './components/HeroSection';
import { FeaturedEventsSection } from './components/FeaturedEventsSection';
import { HappeningSoonSection } from './components/HappeningSoonSection';
import { CategoryBrowseSection } from './components/CategoryBrowseSection';
import { LocationsSection } from './components/LocationsSection';
import { DiscoverPage } from './components/DiscoverPage';
import { VenueDirectory, VenueDetailModal } from './components/VenueDirectory';
import { OrganizerDirectory, OrganizerProfileModal } from './components/OrganizerDirectory';
import { CreateEventWizard } from './components/CreateEventWizard';
import { VisitorCreateEvent } from './components/VisitorCreateEvent';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminSystem } from './components/admin/AdminSystem';
import { AdvertisePage } from './components/AdvertisePage';
import { EventDetailModal } from './components/EventDetailModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SavedEventsDrawer } from './components/SavedEventsDrawer';
import { UserProfileModal, NotificationModal } from './components/UserProfileModal';
import { InfoModals } from './components/InfoModals';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { EventSubmission } from './types/admin';
import { INITIAL_EVENT_SUBMISSIONS, INITIAL_ADMIN_NOTIFICATIONS } from './data/adminMockData';

export default function App() {
  // Navigation & View State
  const [currentView, setCurrentView] = useState<string>('home');
  // Sub-filter pass-throughs when navigating from Home to Discover
  const [discoverCategory, setDiscoverCategory] = useState<string>('');
  const [discoverLocation, setDiscoverLocation] = useState<string>('');
  const [discoverDateFilter, setDiscoverDateFilter] = useState<string>('all');
  const [discoverKeyword, setDiscoverKeyword] = useState<string>('');

  // Primary Data State (Initialized and synchronized dynamically with persistent storage)
  const [events, setEvents] = useState<EventItem[]>(() => getStoredEvents());
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CURRENT_USER);

  // Modals & Drawers State
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueItem | null>(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState<OrganizerItem | null>(null);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'contact' | 'terms' | 'privacy' | null>(null);

  // Active quick filter on homepage
  const [activeQuickFilter, setActiveQuickFilter] = useState<string>('');

  // Create Event mode: 'visitor' (public event submission for approval) | 'wizard' (pro organizer 6-step wizard)
  const [createViewMode, setCreateViewMode] = useState<'visitor' | 'wizard'>('visitor');

  // Automatic event view tracker: opens detail modal, increments dynamic views count with session deduplication, and persists
  const handleSelectEvent = (event: EventItem) => {
    const { updatedEvents, updatedEvent } = recordEventView(event.id, events);
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent || event);
  };

  // Toggle Save Event handler
  const handleToggleSave = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    setCurrentUser((prev) => {
      const exists = prev.savedEventIds.includes(eventId);
      const updatedSaves = exists
        ? prev.savedEventIds.filter((id) => id !== eventId)
        : [...prev.savedEventIds, eventId];

      return {
        ...prev,
        savedEventIds: updatedSaves,
      };
    });

    // Also increment saves counter on the event item and persist
    setEvents((prev) => {
      const updated = prev.map((evt) => {
        if (evt.id === eventId) {
          const isSaved = currentUser.savedEventIds.includes(eventId);
          return {
            ...evt,
            saves: isSaved ? Math.max(0, evt.saves - 1) : evt.saves + 1,
          };
        }
        return evt;
      });
      saveStoredEvents(updated);
      return updated;
    });
  };

  // Toggle Follow Organizer
  const handleToggleFollow = (organizerId: string) => {
    setCurrentUser((prev) => {
      const exists = prev.followedOrganizerIds.includes(organizerId);
      const updatedFollows = exists
        ? prev.followedOrganizerIds.filter((id) => id !== organizerId)
        : [...prev.followedOrganizerIds, organizerId];

      return {
        ...prev,
        followedOrganizerIds: updatedFollows,
      };
    });
  };

  // Search from Hero Section
  const handleHeroSearch = (params: {
    keyword: string;
    category: string;
    location: string;
    date: string;
  }) => {
    setDiscoverKeyword(params.keyword);
    setDiscoverCategory(params.category);
    setDiscoverLocation(params.location);
    setDiscoverDateFilter(params.date ? 'custom' : 'all');
    setCurrentView('discover');
  };

  // Quick Filter Pill on Hero
  const handleQuickFilter = (filterKey: string) => {
    setActiveQuickFilter(filterKey);
    setDiscoverDateFilter(filterKey);
    setDiscoverCategory(filterKey === 'free' ? '' : discoverCategory);
    setCurrentView('discover');
  };

  // Select Category from Home Browse section
  const handleSelectCategory = (catCode: EventCategory) => {
    setDiscoverCategory(catCode);
    setDiscoverLocation('');
    setDiscoverDateFilter('all');
    setCurrentView('discover');
  };

  // Select Location from Home Neighborhoods section
  const handleSelectLocation = (neighborhoodName: string) => {
    setDiscoverLocation(neighborhoodName);
    setDiscoverCategory('');
    setDiscoverDateFilter('all');
    setCurrentView('discover');
  };

  // Event Created from Wizard
  const handleEventCreated = (newEvent: EventItem) => {
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      saveStoredEvents(updated);
      return updated;
    });

    // Create Audit Log
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      action: 'Submitted New Event for Moderation',
      targetType: 'Event',
      targetTitle: newEvent.title,
      targetId: newEvent.id,
      user: currentUser.name,
      role: 'Event Organizer',
      timestamp: 'Just now',
      notes: `Submitted with price ${newEvent.priceDisplay} at ${newEvent.venue}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setCurrentView('organizer-dashboard');
  };

  // Visitor Event Submission Handler (Persists proposal & notifies Admin)
  const handleVisitorEventSubmit = (submission: EventSubmission) => {
    // 1. Save submission to persistent storage
    try {
      const existing = localStorage.getItem('kigali_event_submissions');
      const list: EventSubmission[] = existing ? JSON.parse(existing) : INITIAL_EVENT_SUBMISSIONS;
      const updated = [submission, ...list.filter((s) => s.id !== submission.id)];
      localStorage.setItem('kigali_event_submissions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // 2. Dispatch an Admin notification whenever a new event is submitted for approval
    try {
      const notifExisting = localStorage.getItem('kigali_admin_notifications');
      const notifs = notifExisting ? JSON.parse(notifExisting) : INITIAL_ADMIN_NOTIFICATIONS;
      const newAdminNotif = {
        id: `notif-sub-${Date.now()}`,
        title: 'New Event Submitted for Approval',
        message: `"${submission.name}" was submitted by ${submission.organizerName} (${submission.organizerEmail}). Review required before publication.`,
        category: 'Moderation' as const,
        timestamp: 'Just now',
        isRead: false,
        priority: 'high' as const,
        actionUrl: 'businesses',
      };
      localStorage.setItem('kigali_admin_notifications', JSON.stringify([newAdminNotif, ...notifs]));
    } catch (e) {
      console.error(e);
    }

    // 3. Add visitor audit log and user profile notification
    const newLog: AuditLogItem = {
      id: `log-sub-${Date.now()}`,
      action: 'Submitted Event for Admin Approval',
      targetType: 'Event',
      targetTitle: submission.name,
      targetId: submission.id,
      user: submission.organizerName,
      role: 'Visitor / Community Organizer',
      timestamp: 'Just now',
      notes: `Category: ${submission.category} · Entry Fee: ${submission.feeType === 'Free' ? 'Free' : `${submission.entryFee} ${submission.currency}`}`,
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setCurrentUser((prev) => ({
      ...prev,
      notifications: [
        {
          id: `unotif-${Date.now()}`,
          title: 'Event Proposal Submitted',
          message: `Your event "${submission.name}" has been submitted and is waiting for admin approval.`,
          time: 'Just now',
          read: false,
          type: 'update',
        },
        ...prev.notifications,
      ],
    }));
  };

  // Super Admin: Update Event Status & Log Action
  const handleUpdateEventStatus = (
    eventId: string,
    newStatus: EventStatus,
    actionName: string,
    notes?: string
  ) => {
    let targetTitle = 'Event';

    setEvents((prev) => {
      const updated = prev.map((evt) => {
        if (evt.id === eventId) {
          targetTitle = evt.title;
          return { ...evt, status: newStatus };
        }
        return evt;
      });
      saveStoredEvents(updated);
      return updated;
    });

    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      action: actionName,
      targetType: 'Event',
      targetTitle,
      targetId: eventId,
      user: 'SuperAdmin Jean-Paul',
      role: 'Platform Administrator',
      timestamp: 'Just now',
      notes,
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Super Admin: Toggle Feature Event
  const handleToggleFeatureEvent = (eventId: string) => {
    let targetTitle = 'Event';
    let isNowFeatured = false;

    setEvents((prev) => {
      const updated = prev.map((evt) => {
        if (evt.id === eventId) {
          targetTitle = evt.title;
          isNowFeatured = !evt.isFeatured;
          return { ...evt, isFeatured: isNowFeatured };
        }
        return evt;
      });
      saveStoredEvents(updated);
      return updated;
    });

    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      action: isNowFeatured ? 'Promoted Event to Featured Carousel' : 'Removed from Featured Carousel',
      targetType: 'Event',
      targetTitle,
      targetId: eventId,
      user: 'SuperAdmin Jean-Paul',
      role: 'Platform Administrator',
      timestamp: 'Just now',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Super Admin: Delete Event
  const handleDeleteEvent = (eventId: string) => {
    const evt = events.find((e) => e.id === eventId);
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== eventId);
      saveStoredEvents(updated);
      return updated;
    });

    const log: AuditLogItem = {
      id: `log-${Date.now()}`,
      action: 'Permanently Deleted Event',
      targetType: 'Event',
      targetTitle: evt ? evt.title : eventId,
      targetId: eventId,
      user: 'SuperAdmin Jean-Paul',
      role: 'Platform Administrator',
      timestamp: 'Just now',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Saved Events List
  const savedEventsList = events.filter((e) => currentUser.savedEventIds.includes(e.id));
  const unreadCount = currentUser.notifications.filter((n) => !n.read).length;

  // Dedicated Enterprise Admin System Suite (Complete UI Design)
  if (currentView === 'admin-dashboard') {
    return (
      <AdminSystem 
        onExitToPublicSite={() => setCurrentView('home')} 
        events={events}
        onUpdateEventStatus={handleUpdateEventStatus}
        onToggleFeatureEvent={handleToggleFeatureEvent}
        onDeleteEvent={handleDeleteEvent}
        auditLogs={auditLogs}
        onSelectEvent={handleSelectEvent}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      
      {/* 1. Header (Adhering to Top Bar Contract) */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={currentUser.savedEventIds.length}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        events={events}
        onSelectEvent={handleSelectEvent}
      />

      {/* 2. Main View Routing */}
      <main className="flex-1">
        
        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && (
          <div>
            {/* Hero Section with large search bar and quick filters */}
            <HeroSection
              onSearch={handleHeroSearch}
              onQuickFilter={handleQuickFilter}
              activeQuickFilter={activeQuickFilter}
            />

            {/* Sponsored Homepage Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 gap-4 shadow-sm">
                <span className="absolute top-2 right-2 bg-black/60 text-emerald-400 text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded">
                  Sponsored Partner
                </span>

                <div className="flex items-center gap-4">
                  <img
                    src={ADVERTISEMENTS[0].image}
                    alt={ADVERTISEMENTS[0].title}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-white">{ADVERTISEMENTS[0].title}</h3>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      Direct 4x weekly from Kigali (KGL). Book non-stop business &amp; leisure flights with Rwanda's national flag carrier.
                    </p>
                  </div>
                </div>

                <a
                  href={ADVERTISEMENTS[0].destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap transition-colors shrink-0 shadow"
                >
                  Book Official Tickets
                </a>
              </div>
            </section>

            {/* Featured Events Section */}
            <FeaturedEventsSection
              events={events}
              savedEventIds={currentUser.savedEventIds}
              onToggleSave={handleToggleSave}
              onSelectEvent={handleSelectEvent}
              onViewAll={() => setCurrentView('discover')}
            />

            {/* Events Happening Soon */}
            <HappeningSoonSection
              events={events}
              savedEventIds={currentUser.savedEventIds}
              onToggleSave={handleToggleSave}
              onSelectEvent={handleSelectEvent}
              onViewAll={() => setCurrentView('discover')}
            />
          </div>
        )}

        {/* DISCOVER EVENTS PAGE */}
        {currentView === 'discover' && (
          <DiscoverPage
            events={events}
            savedEventIds={currentUser.savedEventIds}
            onToggleSave={handleToggleSave}
            onSelectEvent={handleSelectEvent}
            initialCategory={discoverCategory}
            initialLocation={discoverLocation}
            initialDateFilter={discoverDateFilter}
            initialKeyword={discoverKeyword}
          />
        )}

        {/* CATEGORIES VIEW */}
        {currentView === 'categories' && (
          <div className="py-8">
            <CategoryBrowseSection onSelectCategory={handleSelectCategory} />
          </div>
        )}

        {/* LOCATIONS & NEIGHBORHOODS VIEW */}
        {currentView === 'locations' && (
          <div className="py-8">
            <LocationsSection onSelectLocation={handleSelectLocation} />
          </div>
        )}

        {/* VENUES DIRECTORY */}
        {currentView === 'venues' && (
          <VenueDirectory onSelectVenueModal={(venue) => setSelectedVenue(venue)} />
        )}

        {/* ORGANIZERS DIRECTORY */}
        {currentView === 'organizers' && (
          <OrganizerDirectory
            onSelectOrganizerModal={(org) => setSelectedOrganizer(org)}
            followedOrganizerIds={currentUser.followedOrganizerIds}
            onToggleFollow={handleToggleFollow}
          />
        )}

        {/* VISITOR EVENT SUBMISSION & ORGANIZER CREATION */}
        {currentView === 'create' && (
          <div className="space-y-4">
            {/* Top selector for Visitor Proposal vs Organizer Wizard */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCreateViewMode('visitor')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createViewMode === 'visitor'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Visitor Event Submission
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateViewMode('wizard')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createViewMode === 'wizard'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Organizer 6-Step Wizard
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline font-medium pr-3">
                  {createViewMode === 'visitor'
                    ? 'Submit event proposal for admin review & approval'
                    : 'Advanced ticketing, performer line-up & schedule setup'}
                </span>
              </div>
            </div>

            {createViewMode === 'visitor' ? (
              <VisitorCreateEvent
                onSubmitEvent={handleVisitorEventSubmit}
                onCancel={() => setCurrentView('home')}
              />
            ) : (
              <CreateEventWizard
                onEventCreated={handleEventCreated}
                onCancel={() => setCurrentView('home')}
              />
            )}
          </div>
        )}

        {/* ORGANIZER DASHBOARD */}
        {currentView === 'organizer-dashboard' && (
          <OrganizerDashboard
            events={events}
            currentUser={currentUser}
            onCreateEvent={() => setCurrentView('create')}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* SUPER ADMIN DASHBOARD & MODERATION */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            events={events}
            onUpdateEventStatus={handleUpdateEventStatus}
            onToggleFeatureEvent={handleToggleFeatureEvent}
            onDeleteEvent={handleDeleteEvent}
            auditLogs={auditLogs}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {/* ADVERTISE PAGE */}
        {currentView === 'advertise' && <AdvertisePage />}

        {/* ABOUT PAGE */}
        {currentView === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
            <h1 className="font-display text-4xl font-extrabold text-slate-900">
              About KigaliPulse
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              KigaliPulse is Kigali's dedicated event discovery, promotion, and organizer platform. From high-energy concerts at BK Arena and international diplomatic conferences at the Kigali Convention Centre to grassroots acoustic jazz at Inema Arts and neighborhood culinary walks in Nyamirambo, KigaliPulse is designed to connect event organizers with local and global audiences.
            </p>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-lg text-slate-900">Architected for Scalability</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Designed to answer "What is happening in Kigali?" within seconds, KigaliPulse is built on a responsive mobile-first architecture engineered to expand effortlessly from Kigali to other major Rwandan destinations (Musanze, Rubavu, Huye) and across the East African Community.
              </p>
            </div>
          </div>
        )}

      </main>

      {/* 3. Global Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenInfo={(type) => setInfoModalType(type)}
      />

      {/* 4. Mobile Fixed Bottom Tab Bar (15% height cap, >= 44px hitboxes) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'saved') {
            setIsSavedDrawerOpen(true);
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        savedCount={currentUser.savedEventIds.length}
      />

      {/* MODALS & DRAWERS */}
      
      {/* Event Detail Modal (Full Event Page with Map & WhatsApp Share) */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isSaved={selectedEvent ? currentUser.savedEventIds.includes(selectedEvent.id) : false}
        onToggleSave={handleToggleSave}
        onSelectOrganizer={(orgId) => {
          const org = ORGANIZERS.find((o) => o.id === orgId);
          if (org) {
            setSelectedEvent(null);
            setSelectedOrganizer(org);
          }
        }}
        onSelectVenue={(venueId) => {
          const v = VENUES.find((ven) => ven.id === venueId);
          if (v) {
            setSelectedEvent(null);
            setSelectedVenue(v);
          }
        }}
      />

      {/* Venue Detail Modal */}
      <VenueDetailModal
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
      />

      {/* Organizer Profile Modal */}
      <OrganizerProfileModal
        organizer={selectedOrganizer}
        events={events}
        onClose={() => setSelectedOrganizer(null)}
        isFollowing={selectedOrganizer ? currentUser.followedOrganizerIds.includes(selectedOrganizer.id) : false}
        onToggleFollow={handleToggleFollow}
        onSelectEvent={handleSelectEvent}
      />

      {/* Global Search Modal with Live Suggestions */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        events={events}
        onSelectEvent={handleSelectEvent}
        onSelectVenue={(v) => setSelectedVenue(v)}
        onSelectOrganizer={(o) => setSelectedOrganizer(o)}
        onSelectCategory={(c) => {
          setDiscoverCategory(c);
          setCurrentView('discover');
        }}
        onSelectLocation={(l) => {
          setDiscoverLocation(l);
          setCurrentView('discover');
        }}
      />

      {/* Saved Events Drawer */}
      <SavedEventsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedEvents={savedEventsList}
        onRemove={(id) => handleToggleSave({ stopPropagation: () => {} } as any, id)}
        onSelectEvent={handleSelectEvent}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateProfile={(updated) => setCurrentUser(updated)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenOrganizerPortal={() => setCurrentView('organizer-dashboard')}
        onOpenAdminPortal={() => setCurrentView('admin-dashboard')}
      />

      {/* Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={currentUser.notifications}
        onMarkAllAsRead={() => {
          setCurrentUser((prev) => ({
            ...prev,
            notifications: prev.notifications.map((n) => ({ ...n, read: true })),
          }));
        }}
      />

      {/* Information & Legal Modals */}
      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      <OfflineIndicator />
    </div>
  );
}
