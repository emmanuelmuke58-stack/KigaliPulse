import { EventItem, EventCategory } from '../types';
import { EVENTS as INITIAL_EVENTS } from '../data/mockData';

const STORAGE_KEY = 'kigalipulse_events_db_v2';
const SESSION_VIEWED_KEY = 'kigalipulse_session_viewed_events';
const VIEW_TIMESTAMPS_KEY = 'kigalipulse_event_view_timestamps';

// Minimal cooldown to prevent rapid multi-clicks or spam refresh within 15 minutes for the same browser
const VIEW_COOLDOWN_MS = 15 * 60 * 1000;

/**
 * Converts a visitor event submission directly into a public EventItem for display on all event pages.
 */
export function convertSubmissionToEventItem(submission: any): EventItem {
  const categoryMap: Record<string, EventCategory> = {
    'Technology & Startups': 'tech',
    'Tech & Innovation': 'tech',
    'Technology': 'tech',
    'Music & Concerts': 'music',
    'Music & Entertainment': 'music',
    'Food & Cultural': 'food',
    'Arts & Fashion': 'arts',
    'Sports & Athletics': 'sports',
    'Business & Finance': 'business',
    'Community & Health': 'community',
  };

  const catCode: EventCategory = categoryMap[submission.category] || 'tech';

  let formattedDate = submission.date;
  try {
    if (submission.date) {
      const parts = submission.date.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
    }
  } catch {
    // fallback to original date string
  }

  const numericPrice = submission.feeType === 'Free' ? 0 : Number(submission.entryFee) || 0;
  const currencyStr = submission.currency || 'RWF';

  return {
    id: `pub-${submission.id}`,
    title: submission.name,
    slug: (submission.name || 'event').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    category: submission.category,
    categoryCode: catCode,
    date: submission.date,
    displayDate: formattedDate,
    time: submission.startTime || '18:00',
    endTime: submission.endTime || '21:30',
    venue: submission.location || 'Kigali, Rwanda',
    venueId: 'venue-partner-kigali',
    district: 'Gasabo',
    neighborhood: 'Kigali Citywide',
    address: submission.location || 'Kigali, Rwanda',
    price: numericPrice,
    priceDisplay: submission.feeType === 'Free' ? 'Free Entry' : `${numericPrice.toLocaleString()} ${currencyStr}`,
    isFree: submission.feeType === 'Free',
    isFeatured: true,
    status: 'Published',
    image: submission.image,
    organizer: submission.organizerName || 'Community Organizer',
    organizerId: 'org-visitor',
    description: submission.description,
    whatToExpect: ['Keynote presentation & discussion', 'Networking & community exchange', 'Q&A session with organizers'],
    schedule: [
      { time: submission.startTime || '18:00', title: 'Registration & Welcome' },
      { time: '19:00', title: 'Main Program & Panel' },
      { time: submission.endTime || '21:30', title: 'Networking & Adjournment' },
    ],
    performers: [],
    contactPhone: submission.organizerPhone,
    contactEmail: submission.organizerEmail,
    externalTicketUrl: '#',
    ticketProviderName: 'Direct Registration',
    lat: -1.9536,
    lng: 30.0605,
    views: 68,
    saves: 14,
    clicks: 25,
    createdAt: submission.submittedAt || new Date().toISOString().split('T')[0],
  };
}

/**
 * Retrieves the current list of events from the database (localStorage),
 * falling back to the curated INITIAL_EVENTS with merged updates, and
 * directly merging in all Approved visitor event submissions onto events pages.
 */
export function getStoredEvents(): EventItem[] {
  try {
    let result: EventItem[] = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      result = INITIAL_EVENTS;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    } else {
      const parsed: EventItem[] = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        result = INITIAL_EVENTS;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      } else {
        result = parsed;
      }
    }

    // Merge any missing seed events if necessary
    const existingIds = new Set(result.map((e) => e.id));
    const missingSeedEvents = INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
    if (missingSeedEvents.length > 0) {
      result = [...result, ...missingSeedEvents];
    }

    // DIRECT ON EVENTS PAGES: Merge all Approved or Published visitor event submissions
    try {
      const subsRaw = localStorage.getItem('kigali_event_submissions');
      if (subsRaw) {
        const subs = JSON.parse(subsRaw);
        if (Array.isArray(subs)) {
          // Approved or Published submissions go direct on events pages
          const approvedSubs = subs.filter((s: any) => s.status === 'Approved' || s.status === 'Published');
          const approvedEventItems = approvedSubs.map(convertSubmissionToEventItem);

          // Submissions that are unapproved/rejected/draft should not appear
          const unapprovedIds = new Set(
            subs.filter((s: any) => s.status !== 'Approved' && s.status !== 'Published')
                .map((s: any) => `pub-${s.id}`)
          );

          result = result.filter((e) => !unapprovedIds.has(e.id));

          // Prepend newly approved items if not already present
          const currentIds = new Set(result.map((e) => e.id));
          const toAdd: EventItem[] = [];
          for (const item of approvedEventItems) {
            if (!currentIds.has(item.id)) {
              toAdd.push(item);
            }
          }

          if (toAdd.length > 0) {
            result = [...toAdd, ...result];
          }
        }
      }
    } catch (subErr) {
      console.warn('Error syncing approved submissions direct to events:', subErr);
    }

    // Ensure future events show the soonest date first across all site views
    result.sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      if (dateA !== dateB) {
        return dateA.localeCompare(dateB);
      }
      const timeA = a.time || '';
      const timeB = b.time || '';
      return timeA.localeCompare(timeB);
    });

    return result;
  } catch (err) {
    console.error('Failed to load events from storage:', err);
    return INITIAL_EVENTS;
  }
}

/**
 * Persists an updated list of events to the database.
 */
export function saveStoredEvents(events: EventItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to storage:', err);
  }
}

/**
 * Checks whether an event has already been viewed in the current user session
 * or within the cooldown period to prevent duplicate or excessive view counting.
 */
export function hasEventBeenViewedRecently(eventId: string): boolean {
  try {
    // 1. Check Session Storage (immediate session deduplication)
    const sessionRaw = sessionStorage.getItem(SESSION_VIEWED_KEY);
    const sessionViewed: string[] = sessionRaw ? JSON.parse(sessionRaw) : [];
    if (sessionViewed.includes(eventId)) {
      return true;
    }

    // 2. Check Cooldown Timestamps (prevents refresh abuse even across tabs)
    const timestampsRaw = localStorage.getItem(VIEW_TIMESTAMPS_KEY);
    const timestamps: Record<string, number> = timestampsRaw ? JSON.parse(timestampsRaw) : {};
    const lastViewedAt = timestamps[eventId];
    if (lastViewedAt && Date.now() - lastViewedAt < VIEW_COOLDOWN_MS) {
      return true;
    }

    return false;
  } catch (err) {
    console.warn('Error checking event view session status:', err);
    return false;
  }
}

/**
 * Marks an event as viewed in the session and records the cooldown timestamp.
 */
function recordViewDeduplication(eventId: string): void {
  try {
    // Record in Session Storage
    const sessionRaw = sessionStorage.getItem(SESSION_VIEWED_KEY);
    const sessionViewed: string[] = sessionRaw ? JSON.parse(sessionRaw) : [];
    if (!sessionViewed.includes(eventId)) {
      sessionViewed.push(eventId);
      sessionStorage.setItem(SESSION_VIEWED_KEY, JSON.stringify(sessionViewed));
    }

    // Record in LocalStorage Timestamps
    const timestampsRaw = localStorage.getItem(VIEW_TIMESTAMPS_KEY);
    const timestamps: Record<string, number> = timestampsRaw ? JSON.parse(timestampsRaw) : {};
    timestamps[eventId] = Date.now();
    localStorage.setItem(VIEW_TIMESTAMPS_KEY, JSON.stringify(timestamps));
  } catch (err) {
    console.warn('Error recording view deduplication:', err);
  }
}

/**
 * Records an event page visit / view dynamically.
 * Automatically checks deduplication. If eligible, increments views by +1,
 * updates the persistent store, and returns the updated events array and event item.
 */
export function recordEventView(
  eventId: string,
  currentEvents: EventItem[]
): {
  updatedEvents: EventItem[];
  updatedEvent: EventItem | null;
  didIncrement: boolean;
} {
  const isDuplicate = hasEventBeenViewedRecently(eventId);

  if (isDuplicate) {
    // Find current event without incrementing
    const existing = currentEvents.find((e) => e.id === eventId) || null;
    return {
      updatedEvents: currentEvents,
      updatedEvent: existing,
      didIncrement: false,
    };
  }

  // Record deduplication lock
  recordViewDeduplication(eventId);

  // Increment views by 1
  let updatedEvent: EventItem | null = null;
  const updatedEvents = currentEvents.map((e) => {
    if (e.id === eventId) {
      updatedEvent = {
        ...e,
        views: (e.views || 0) + 1,
      };
      return updatedEvent;
    }
    return e;
  });

  // Save to persistent database
  saveStoredEvents(updatedEvents);

  return {
    updatedEvents,
    updatedEvent,
    didIncrement: true,
  };
}
