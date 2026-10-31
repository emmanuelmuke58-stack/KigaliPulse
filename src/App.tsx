import React, { useState, useEffect } from 'react';
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
import { LoginView } from './components/LoginView';

export default function App() {
  // Navigation & View State (Discover Events page is the default site page)
  const [currentView, setCurrentView] = useState<string>('discover');
  const [intendedView, setIntendedView] = useState<string>('');

  // Sub-filter pass-throughs when navigating from Home to Discover
  const [discoverCategory, setDiscoverCategory] = useState<string>('');
  const [discoverLocation, setDiscoverLocation] = useState<string>('');
  const [discoverDateFilter, setDiscoverDateFilter] = useState<string>('all');
  const [discoverKeyword, setDiscoverKeyword] = useState<string>('');

  // Primary Data State (Initialized and synchronized dynamically with persistent storage)
  const [events, setEvents] = useState<EventItem[]>(() => getStoredEvents());
  const [userEvents, setUserEvents] = useState<EventItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

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
  const [createViewMode, setCreateViewMode] = useState<'visitor' | 'wizard'>('wizard');

  // 1. Initial Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setCurrentUser(data.user);
        }
      } catch (e) {
        console.error('Auth Check failed', e);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 2. Fetch Events from backend API and merge updates
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
            saveStoredEvents(data);
          }
        }
      } catch (e) {
        console.warn('Network fetch error, using stored events:', e);
      }
    };
    fetchEvents();
  }, [currentView]);

  // 3. Fetch User Events (when logged in and on a dashboard)
  useEffect(() => {
    if (!currentUser || !['organizer-dashboard', 'admin-dashboard'].includes(currentView)) return;

    const fetchUserEvents = async () => {
      try {
        const res = await fetch('/api/events/my');
        if (res.ok) {
          const data = await res.json();
          setUserEvents(data);
        }
      } catch (e) {
        console.error('Failed to fetch user events', e);
      }
    };
    fetchUserEvents();
  }, [currentView, currentUser]);

  // View Protection logic
  const PROTECTED_VIEWS = ['create', 'organizer-dashboard', 'admin-dashboard'];
  const isViewProtected = PROTECTED_VIEWS.includes(currentView);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    if (intendedView) {
      const target = intendedView;
      setIntendedView('');
      setCurrentView(target);
    } else if (currentView === 'login') {
      setCurrentView('discover');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Automatic event view tracker: opens detail modal, increments dynamic views count with session deduplication, and persists
  const handleSelectEvent = (event: EventItem) => {
    const { updatedEvents, updatedEvent } = recordEventView(event.id, events);
    setEvents(updatedEvents);
    setSelectedEvent(updatedEvent || event);
  };

  // Toggle Save Event handler
  const handleToggleSave = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    if (!currentUser) {
      setIntendedView('discover');
      setCurrentView('login');
      return;
    }
    const alreadySaved = currentUser.savedEventIds?.includes(eventId) || false;
    const updatedSaves = alreadySaved
      ? (currentUser.savedEventIds || []).filter((id) => id !== eventId)
      : [...(currentUser.savedEventIds || []), eventId];

    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        savedEventIds: updatedSaves,
      };
    });

    // Sync saved status to backend profile
    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedEventIds: updatedSaves }),
    }).catch(() => {});

    // Also increment saves counter on the event item and persist
    setEvents((prev) => {
      const updated = prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            saves: alreadySaved ? Math.max(0, (evt.saves || 0) - 1) : (evt.saves || 0) + 1,
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
    if (!currentUser) {
      setIntendedView('discover');
      setCurrentView('login');
      return;
    }
    const alreadyFollowed = currentUser.followedOrganizerIds?.includes(organizerId) || false;
    const updatedFollows = alreadyFollowed
      ? (currentUser.followedOrganizerIds || []).filter((id) => id !== organizerId)
      : [...(currentUser.followedOrganizerIds || []), organizerId];

    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        followedOrganizerIds: updatedFollows,
      };
    });

    fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followedOrganizerIds: updatedFollows }),
    }).catch(() => {});
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
  const handleEventCreated = async (newEvent: EventItem) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) throw new Error('Failed to save event');

      const savedEvent = await res.json();
      setEvents((prev) => [savedEvent, ...prev]);

      // Create Audit Log
      const newLog: AuditLogItem = {
        id: `log-${Date.now()}`,
        action: 'Submitted New Event for Moderation',
        targetType: 'Event',
        targetTitle: savedEvent.title,
        targetId: savedEvent.id,
        user: currentUser?.name || 'Unknown',
        role: 'Event Organizer',
        timestamp: 'Just now',
        notes: `Submitted with price ${savedEvent.priceDisplay} at ${savedEvent.venue}`,
      };
      setAuditLogs((prev) => [newLog, ...prev]);

      setCurrentView('organizer-dashboard');
    } catch (e) {
      console.error(e);
      alert('Error saving event to server.');
    }
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

    if (currentUser) {
      setCurrentUser((prev) => {
        if (!prev) return prev;
        const newNotifs = [
          {
            id: `unotif-${Date.now()}`,
            title: 'Event Proposal Submitted',
            message: `Your event "${submission.name}" has been submitted and is waiting for admin approval.`,
            time: 'Just now',
            read: false,
            type: 'update' as const,
          },
          ...(prev.notifications || []),
        ];
        fetch('/api/auth/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notifications: newNotifs }),
        }).catch(() => {});
        return {
          ...prev,
          notifications: newNotifs,
        };
      });
    }
  };

  // Super Admin: Update Event Status & Log Action
  const handleUpdateEventStatus = async (
    eventId: string,
    newStatus: EventStatus,
    actionName: string,
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update event status');

      const updatedEvent = await res.json();
      
      setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));
      setUserEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));

      const log: AuditLogItem = {
        id: `log-${Date.now()}`,
        action: actionName,
        targetType: 'Event',
        targetTitle: updatedEvent.title,
        targetId: eventId,
        user: currentUser?.name || 'SuperAdmin',
        role: 'Platform Administrator',
        timestamp: 'Just now',
        notes,
      };
      setAuditLogs((prev) => [log, ...prev]);
    } catch (e) {
      console.error(e);
      alert('Error updating event status.');
    }
  };

  // Super Admin: Toggle Feature Event
  const handleToggleFeatureEvent = async (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: !event.isFeatured }),
      });

      if (!res.ok) throw new Error('Failed to toggle feature');

      const updatedEvent = await res.json();
      setEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));
      setUserEvents((prev) => prev.map((e) => (e.id === eventId ? updatedEvent : e)));

      const log: AuditLogItem = {
        id: `log-${Date.now()}`,
        action: updatedEvent.isFeatured ? 'Promoted Event to Featured Carousel' : 'Removed from Featured Carousel',
        targetType: 'Event',
        targetTitle: updatedEvent.title,
        targetId: eventId,
        user: currentUser?.name || 'SuperAdmin',
        role: 'Platform Administrator',
        timestamp: 'Just now',
      };
      setAuditLogs((prev) => [log, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  // Super Admin: Delete Event
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to permanently delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete event');

      const evt = events.find((e) => e.id === eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setUserEvents((prev) => prev.filter((e) => e.id !== eventId));

      const log: AuditLogItem = {
        id: `log-${Date.now()}`,
        action: 'Permanently Deleted Event',
        targetType: 'Event',
        targetTitle: evt ? evt.title : eventId,
        targetId: eventId,
        user: currentUser?.name || 'SuperAdmin',
        role: 'Platform Administrator',
        timestamp: 'Just now',
      };
      setAuditLogs((prev) => [log, ...prev]);
    } catch (e) {
      console.error(e);
      alert('Error deleting event.');
    }
  };

  // Saved Events List
  const savedEventsList = currentUser?.savedEventIds
    ? events.filter((e) => currentUser.savedEventIds.includes(e.id))
    : [];
  const unreadCount = currentUser?.notifications
    ? currentUser.notifications.filter((n) => !n.read).length
    : 0;

  // Dedicated Enterprise Admin System Suite (Complete UI Design)
  if (currentView === 'admin-dashboard') {
    if (!currentUser) {
      return (
        <div className="min-h-screen">
          <Header
            currentView={currentView}
            onNavigate={setCurrentView}
            savedCount={0}
            onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
            onOpenSearchModal={() => setIsSearchModalOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            unreadNotificationsCount={0}
            currentUser={null}
            onOpenLogin={() => setCurrentView('login')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
          <LoginView onLoginSuccess={handleLoginSuccess} onCancel={() => setCurrentView('discover')} />
        </div>
      );
    }
    if (currentUser.role !== 'SuperAdmin') {
      setCurrentView('discover');
      return null;
    }
    return <AdminSystem onExitToPublicSite={() => setCurrentView('home')} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden max-w-full w-full">
      
      {/* 1. Header (Adhering to Top Bar Contract) */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (['create', 'organizer-dashboard', 'admin-dashboard'].includes(view) && !currentUser) {
            setIntendedView(view);
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={currentUser?.savedEventIds?.length || 0}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadCount}
        events={events}
        onSelectEvent={handleSelectEvent}
        currentUser={currentUser}
        onOpenLogin={() => {
          setIntendedView('discover');
          setCurrentView('login');
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 2. Main View Routing */}
      <main className="flex-1 pb-20 md:pb-0 overflow-x-hidden max-w-full w-full">
        
        {/* AUTH PROTECTION OVERLAY */}
        {isViewProtected && !currentUser && (
          <LoginView 
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setCurrentView('discover')}
          />
        )}

        {/* LOGIN VIEW */}
        {currentView === 'login' && (
          <LoginView 
            onLoginSuccess={() => setCurrentView('discover')}
            onCancel={() => setCurrentView('discover')}
          />
        )}

        {/* HOMEPAGE VIEW */}
        {currentView === 'home' && !isViewProtected && (
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
              savedEventIds={currentUser?.savedEventIds || []}
              onToggleSave={handleToggleSave}
              onSelectEvent={handleSelectEvent}
              onViewAll={() => setCurrentView('discover')}
            />

            {/* Events Happening Soon */}
            <HappeningSoonSection
              events={events}
              savedEventIds={currentUser?.savedEventIds || []}
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
            savedEventIds={currentUser?.savedEventIds || []}
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
            followedOrganizerIds={currentUser?.followedOrganizerIds || []}
            onToggleFollow={handleToggleFollow}
          />
        )}

        {/* VISITOR EVENT SUBMISSION & ORGANIZER CREATION */}
        {currentView === 'create' && currentUser && (
          <div className="space-y-4">
            {/* Top selector for Visitor Proposal vs Organizer Wizard */}
            <div className="max-w-4xl mx-auto px-4 pt-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-1.5 flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCreateViewMode('wizard')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createViewMode === 'wizard'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Event Creator Wizard
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreateViewMode('visitor')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      createViewMode === 'visitor'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    Community Submission
                  </button>
                </div>
                <span className="text-[11px] text-slate-500 hidden sm:inline font-medium pr-3">
                  {createViewMode === 'wizard'
                    ? 'Publish event details, schedule & ticket information'
                    : 'Submit event proposal for admin review & approval'}
                </span>
              </div>
            </div>

            {createViewMode === 'visitor' ? (
              <VisitorCreateEvent
                onSubmitEvent={handleVisitorEventSubmit}
                onCancel={() => setCurrentView('discover')}
              />
            ) : (
              <CreateEventWizard
                onEventCreated={handleEventCreated}
                onCancel={() => setCurrentView('discover')}
              />
            )}
          </div>
        )}

        {/* ORGANIZER DASHBOARD */}
        {currentView === 'organizer-dashboard' && currentUser && (
          <OrganizerDashboard
            events={userEvents}
            currentUser={currentUser}
            onCreateEvent={() => setCurrentView('create')}
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
          } else if (['create', 'organizer-dashboard'].includes(view) && !currentUser) {
            setIntendedView(view);
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        savedCount={currentUser?.savedEventIds?.length || 0}
        isLoggedIn={!!currentUser}
      />

      {/* MODALS & DRAWERS */}
      
      {/* Event Detail Modal (Full Event Page with Map & WhatsApp Share) */}
      <EventDetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        isSaved={selectedEvent && currentUser?.savedEventIds ? currentUser.savedEventIds.includes(selectedEvent.id) : false}
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
        isFollowing={selectedOrganizer && currentUser?.followedOrganizerIds ? currentUser.followedOrganizerIds.includes(selectedOrganizer.id) : false}
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
      {currentUser && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onUpdateProfile={(updated) => {
            setCurrentUser(updated);
            fetch('/api/auth/profile', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updated),
            }).catch(() => {});
          }}
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
          onOpenOrganizerPortal={() => setCurrentView('organizer-dashboard')}
          onOpenAdminPortal={() => setCurrentView('admin-dashboard')}
        />
      )}

      {/* Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={currentUser?.notifications || []}
        onMarkAllAsRead={() => {
          if (currentUser) {
            setCurrentUser((prev) => {
              if (!prev) return prev;
              const readNotifs = (prev.notifications || []).map((n) => ({ ...n, read: true }));
              fetch('/api/auth/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notifications: readNotifs }),
              }).catch(() => {});
              return { ...prev, notifications: readNotifs };
            });
          }
        }}
      />

      {/* Information & Legal Modals */}
      <InfoModals
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Global Connectivity Indicator */}
      <OfflineIndicator />

    </div>
  );
}
