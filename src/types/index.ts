export type EventCategory =
  | 'music'
  | 'nightlife'
  | 'business'
  | 'tech'
  | 'sports'
  | 'arts'
  | 'food'
  | 'community'
  | 'weddings'
  | 'family'
  | 'faith'
  | 'health'
  | 'tourism'
  | 'conferences'
  | 'markets'
  | 'education';

export type EventStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Published'
  | 'Featured'
  | 'Sold Out'
  | 'Cancelled'
  | 'Postponed'
  | 'Completed'
  | 'Archived';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
}

export interface PerformerOrSpeaker {
  name: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryCode: EventCategory;
  date: string; // YYYY-MM-DD
  endDate?: string;
  displayDate: string;
  time: string;
  endTime?: string;
  venue: string;
  venueId: string;
  district: string; // e.g. Gasabo, Nyarugenge, Kicukiro
  neighborhood: string; // e.g. Kimihurura, Kiyovu, Kacyiru, Remera, Nyamirambo
  address: string;
  price: number; // in RWF (0 for Free)
  priceDisplay: string;
  isFree: boolean;
  isFeatured: boolean;
  status: EventStatus;
  image: string;
  organizer: string;
  organizerId: string;
  organizerLogo?: string;
  description: string;
  whatToExpect: string[];
  schedule: ScheduleItem[];
  performers: PerformerOrSpeaker[];
  dressCode?: string;
  ageRestriction?: string;
  parkingInfo?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactWebsite?: string;
  externalTicketUrl: string;
  ticketProviderName: string;
  lat: number;
  lng: number;
  views: number;
  saves: number;
  clicks: number;
  createdAt: string;
}

export interface CategoryItem {
  id: EventCategory;
  name: string;
  icon: string;
  description: string;
  color: string;
  eventCount: number;
}

export type VenueType =
  | 'Hotels'
  | 'Restaurants'
  | 'Cafés'
  | 'Bars & Clubs'
  | 'Conference Venues'
  | 'Cultural Spaces'
  | 'Sports Venues'
  | 'Co-working Spaces'
  | 'Outdoor & Gardens'
  | 'Wedding Venues';

export interface VenueItem {
  id: string;
  name: string;
  slug: string;
  type: VenueType;
  district: string;
  neighborhood: string;
  address: string;
  capacity: number;
  description: string;
  image: string;
  website: string;
  phone: string;
  email: string;
  amenities: string[];
  lat: number;
  lng: number;
  upcomingCount: number;
  rating: number;
}

export interface OrganizerItem {
  id: string;
  name: string;
  slug: string;
  verified: boolean;
  category: string;
  bio: string;
  image: string;
  website: string;
  phone: string;
  email: string;
  social: {
    instagram?: string;
    x?: string;
    linkedin?: string;
    facebook?: string;
  };
  eventsCount: number;
  followersCount: number;
  location: string;
}

export type AdFormat =
  | 'Homepage Banner'
  | 'Featured Event'
  | 'Event Listing Ad'
  | 'Sidebar Ad'
  | 'Venue Promotion'
  | 'Sponsored Category';

export interface AdvertisementItem {
  id: string;
  title: string;
  advertiser: string;
  format: AdFormat;
  placement: string;
  destinationUrl: string;
  image: string;
  status: 'Active' | 'Scheduled' | 'Ended' | 'Draft';
  budget: string;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  targetType: 'Event' | 'Organizer' | 'Advertisement' | 'Venue';
  targetTitle: string;
  targetId: string;
  user: string;
  role: string;
  timestamp: string;
  notes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'reminder' | 'update' | 'announcement';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: 'attendee' | 'organizer' | 'admin';
  preferredCategories: EventCategory[];
  preferredNeighborhoods: string[];
  savedEventIds: string[];
  followedOrganizerIds: string[];
  notifications: NotificationItem[];
}
