import { EventItem } from '../types';
import { EVENTS as INITIAL_EVENTS } from '../data/mockData';

const STORAGE_KEY = 'kigalipulse_events_db_v1';
const SESSION_VIEWED_KEY = 'kigalipulse_session_viewed_events';
const VIEW_TIMESTAMPS_KEY = 'kigalipulse_event_view_timestamps';

// Minimal cooldown to prevent rapid multi-clicks or spam refresh within 15 minutes for the same browser
const VIEW_COOLDOWN_MS = 15 * 60 * 1000;

/**
 * Retrieves the current list of events from the database (localStorage),
 * falling back to the curated INITIAL_EVENTS with merged updates.
 */
export function getStoredEvents(): EventItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    const parsed: EventItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }

    // Merge any missing fields or new seed events if necessary
    const existingIds = new Set(parsed.map((e) => e.id));
    const missingSeedEvents = INITIAL_EVENTS.filter((e) => !existingIds.has(e.id));
    if (missingSeedEvents.length > 0) {
      const merged = [...parsed, ...missingSeedEvents];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }

    return parsed;
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
