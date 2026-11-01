import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Tag,
  Link,
  Phone,
  Mail,
  Shield,
  Eye,
  Save,
  Send,
} from 'lucide-react';
import { EventItem, EventCategory, EventStatus } from '../types';
import { CATEGORIES, KIGALI_NEIGHBORHOODS, VENUES } from '../data/mockData';
import { EventCard } from './EventCard';

interface CreateEventWizardProps {
  onEventCreated: (event: EventItem) => void;
  onCancel: () => void;
}

export const CreateEventWizard: React.FC<CreateEventWizardProps> = ({
  onEventCreated,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    categoryCode: 'music' as EventCategory,
    category: 'Music & Concerts',
    description: '',
    image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1200&q=80',
    organizer: 'RG Consult Inc',
    // Step 2
    startDate: '2026-10-16',
    startTime: '18:00',
    endDate: '2026-10-16',
    endTime: '23:30',
    // Step 3
    venue: 'Inema Arts Center',
    venueId: 'venue-3',
    district: 'Gasabo',
    neighborhood: 'Kacyiru',
    address: 'KG 563 St, Kacyiru, Kigali',
    lat: -1.9360,
    lng: 30.0821,
    // Step 4
    isFree: false,
    price: 15000,
    externalTicketUrl: 'https://mookh.com/event/example-kigali-event',
    ticketProviderName: 'Mookh Rwanda Official',
    registrationLink: '',
    // Step 5
    contactPhone: '+250 788 355 555',
    contactEmail: 'events@kigali.rw',
    contactWebsite: 'https://kigalipulse.rw',
    socialHandle: '@kigalievents',
    ageRestriction: '18+ Recommended',
    eventRules: 'No outside beverages, official ID required at gate.',
    dressCode: 'Afro-Chic / Smart Casual',
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (catCode: EventCategory) => {
    const cat = CATEGORIES.find((c) => c.id === catCode);
    setFormData((prev) => ({
      ...prev,
      categoryCode: catCode,
      category: cat ? cat.name : 'Music & Concerts',
    }));
  };

  const handleVenueChange = (venueName: string) => {
    const v = VENUES.find((item) => item.name === venueName);
    if (v) {
      setFormData((prev) => ({
        ...prev,
        venue: v.name,
        venueId: v.id,
        district: v.district,
        neighborhood: v.neighborhood,
        address: v.address,
        lat: v.lat,
        lng: v.lng,
      }));
    } else {
      updateField('venue', venueName);
    }
  };

  // Build simulated EventItem object
  const buildEventObject = (status: EventStatus): EventItem => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const dateObj = new Date(formData.startDate);
    const displayDate = dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return {
      id: `evt-user-${Date.now()}`,
      title: formData.title || 'Untitled Kigali Event',
      slug: slug || `kigali-event-${Date.now()}`,
      category: formData.category,
      categoryCode: formData.categoryCode,
      date: formData.startDate,
      endDate: formData.endDate,
      displayDate,
      time: `${formData.startTime} – ${formData.endTime}`,
      venue: formData.venue,
      venueId: formData.venueId,
      district: formData.district,
      neighborhood: formData.neighborhood,
      address: formData.address,
      price: formData.isFree ? 0 : Number(formData.price),
      priceDisplay: formData.isFree ? 'Free' : `RF ${Number(formData.price).toLocaleString()}`,
      isFree: formData.isFree,
      isFeatured: false,
      status,
      image: formData.image,
      organizer: formData.organizer,
      organizerId: 'org-user',
      description: formData.description,
      whatToExpect: [
        'Live performance and stage ambiance',
        'Official security and designated parking marshals',
        'Refreshments & food stalls available on premises',
      ],
      schedule: [
        { time: formData.startTime, title: 'Gates Open & Welcome' },
        { time: '20:00', title: 'Main Event Segment' },
        { time: formData.endTime, title: 'Closing' },
      ],
      performers: [{ name: formData.organizer, role: 'Event Host' }],
      dressCode: formData.dressCode,
      ageRestriction: formData.ageRestriction,
      parkingInfo: 'Venue designated parking available on site.',
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      contactWebsite: formData.contactWebsite,
      externalTicketUrl: formData.externalTicketUrl || 'https://mookh.com',
      ticketProviderName: formData.ticketProviderName,
      lat: formData.lat,
      lng: formData.lng,
      views: 0,
      saves: 0,
      clicks: 0,
      createdAt: '2026-09-24',
    };
  };

  const handleSubmit = (status: EventStatus) => {
    const finalEvent = buildEventObject(status);
    onEventCreated(finalEvent);
  };

  const stepsList = [
    { num: 1, title: 'Basic Info' },
    { num: 2, title: 'Date & Time' },
    { num: 3, title: 'Location' },
    { num: 4, title: 'Tickets' },
    { num: 5, title: 'Additional' },
    { num: 6, title: 'Review & Submit' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Wizard Top Header */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold uppercase tracking-wider text-emerald-400">
                Organizer Submission Portal
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold mt-0.5">
                Publish Event in Kigali
              </h1>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="text-base text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10"
            >
              Cancel
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-6 gap-2 pt-2">
            {stepsList.map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    s.num <= step ? 'bg-emerald-400' : 'bg-slate-800'
                  }`}
                />
                <span className="text-[14px] hidden sm:block truncate text-slate-400 font-medium">
                  {s.num}. {s.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Wizard Step Forms */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* STEP 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 1: Basic Information
              </h2>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kigali Electronic Sunset Rooftop Session"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Event Category *
                  </label>
                  <select
                    value={formData.categoryCode}
                    onChange={(e) => handleCategoryChange(e.target.value as EventCategory)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base sm:text-base font-medium focus:outline-none focus:border-emerald-600 bg-slate-50 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Organizer / Host Brand Name *
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => updateField('organizer', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base sm:text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide an overview of the event, lineup, and special highlights..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base sm:text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Cover Photo URL (High resolution landscape)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => updateField('image', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base sm:text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 2: Date &amp; Timing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => updateField('startTime', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => updateField('endTime', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none focus:border-emerald-600 bg-slate-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 3: Venue &amp; Kigali Location
              </h2>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Choose Established Venue (or type custom)
                </label>
                <select
                  value={formData.venue}
                  onChange={(e) => handleVenueChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50 font-medium focus:outline-none cursor-pointer"
                >
                  {VENUES.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name} ({v.neighborhood}, {v.district})
                    </option>
                  ))}
                  <option value="Custom Venue">Other / Custom Venue</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Neighborhood *
                  </label>
                  <select
                    value={formData.neighborhood}
                    onChange={(e) => updateField('neighborhood', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50 focus:outline-none cursor-pointer"
                  >
                    {KIGALI_NEIGHBORHOODS.map((h) => (
                      <option key={h.name} value={h.name}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    District
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base bg-slate-50 focus:outline-none cursor-pointer"
                  >
                    <option value="Gasabo">Gasabo</option>
                    <option value="Nyarugenge">Nyarugenge</option>
                    <option value="Kicukiro">Kicukiro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Full Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KG 563 St, Kacyiru, Kigali, Rwanda"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Tickets & Pricing */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 4: Tickets &amp; Registration
              </h2>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer text-base font-bold">
                  <input
                    type="radio"
                    name="pricingType"
                    checked={!formData.isFree}
                    onChange={() => updateField('isFree', false)}
                    className="text-emerald-600"
                  />
                  <span>Paid Tickets</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-base font-bold">
                  <input
                    type="radio"
                    name="pricingType"
                    checked={formData.isFree}
                    onChange={() => updateField('isFree', true)}
                    className="text-emerald-600"
                  />
                  <span>Free Admission / RSVP</span>
                </label>
              </div>

              {!formData.isFree && (
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Standard Ticket Price (in Rwandan Francs - RWF) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50 tabular-nums font-bold"
                  />
                </div>
              )}

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  External Official Ticketing Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://mookh.com/event/... or https://eventbrite.com/..."
                  value={formData.externalTicketUrl}
                  onChange={(e) => updateField('externalTicketUrl', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                />
                <span className="text-[15px] text-slate-500 mt-1 block">
                  KigaliPulse directs attendees to official verified ticketing platforms (Mookh, Eventbrite, BK Arena Tickets, etc.).
                </span>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Ticketing Provider Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mookh Rwanda, TiCQ, BK Arena Portal"
                  value={formData.ticketProviderName}
                  onChange={(e) => updateField('ticketProviderName', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Additional Information */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-slate-900 border-b pb-2">
                Step 5: Additional Details &amp; Guidelines
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => updateField('contactPhone', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Contact Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => updateField('contactEmail', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Age Restriction
                  </label>
                  <input
                    type="text"
                    value={formData.ageRestriction}
                    onChange={(e) => updateField('ageRestriction', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">
                    Dress Code Recommendation
                  </label>
                  <input
                    type="text"
                    value={formData.dressCode}
                    onChange={(e) => updateField('dressCode', e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">
                  Event Rules &amp; Security Policy
                </label>
                <textarea
                  rows={2}
                  value={formData.eventRules}
                  onChange={(e) => updateField('eventRules', e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-base focus:outline-none bg-slate-50"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="text-center max-w-lg mx-auto space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Ready to Submit for Moderation
                </h2>
                <p className="text-base text-slate-500 leading-relaxed">
                  Your event will be audited by KigaliPulse admins to verify authentic venue bookings, safe ticketing links, and correct category tagging.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-base">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Event Title:</span>
                  <span className="font-bold text-slate-900">{formData.title || 'Untitled Event'}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Date &amp; Time:</span>
                  <span className="font-bold text-slate-900">{formData.startDate} ({formData.startTime} – {formData.endTime})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Venue:</span>
                  <span className="font-bold text-slate-900">{formData.venue} ({formData.neighborhood})</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Admission:</span>
                  <span className="font-bold text-emerald-700 tabular-nums">
                    {formData.isFree ? 'Free Admission' : `RF ${Number(formData.price).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ticketing Link:</span>
                  <span className="font-medium text-slate-700 truncate max-w-xs">{formData.externalTicketUrl}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview Card</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSubmit('Draft')}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-base font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSubmit('Pending Approval')}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Event</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Footer */}
          {step < 6 && (
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                type="button"
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
                className={`px-4 py-2 rounded-xl text-base font-bold flex items-center gap-1.5 ${
                  step === 1
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold flex items-center gap-1.5 shadow-sm"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Live Card Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-bold text-slate-900">Event Card Preview</h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-900"
              >
                ✕
              </button>
            </div>

            <EventCard
              event={buildEventObject('Pending Approval')}
              isSaved={false}
              onToggleSave={() => {}}
              onSelectEvent={() => {}}
            />

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="w-full py-2 bg-slate-900 text-white text-base font-bold rounded-xl"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
