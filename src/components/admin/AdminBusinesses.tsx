import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Radio,
  Users,
  Ticket,
  Tag,
  Share2,
  Download,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  Check,
  Globe,
  Sparkles,
  UserCheck,
  UserPlus,
  TrendingUp,
  FileSpreadsheet,
  FileText,
} from 'lucide-react';
import {
  EnterpriseBusiness,
  BusinessEvent,
  BusinessEventStatus,
  BusinessEventAttendee,
} from '../../types/admin';
import { INITIAL_BUSINESS_EVENTS, INITIAL_EVENT_SUBMISSIONS } from '../../data/adminMockData';
import { AdminEventSubmissions } from './AdminEventSubmissions';

interface AdminBusinessesProps {
  businesses: EnterpriseBusiness[];
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminBusinesses: React.FC<AdminBusinessesProps> = ({
  businesses,
  onTriggerToast,
}) => {
  // Business events state (with local storage persistence)
  const [events, setEvents] = useState<BusinessEvent[]>(() => {
    try {
      const saved = localStorage.getItem('kigali_business_events');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_BUSINESS_EVENTS;
  });

  // Save events to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('kigali_business_events', JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events]);

  // Selected Business for Events Management (defaults to first business for quick access)
  const [selectedBusiness, setSelectedBusiness] = useState<EnterpriseBusiness | null>(() => businesses[0] || null);

  // Active view: 'events-management' (Business events) | 'submissions' (Visitor submissions approval) | 'business-directory'
  const [currentSubView, setCurrentSubView] = useState<'events-management' | 'submissions' | 'business-directory'>('events-management');

  // Pending submissions count tracker
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(2);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kigali_event_submissions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setPendingSubmissionsCount(parsed.filter((s: any) => s.status === 'Pending Approval').length);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentSubView]);

  // Directory search
  const [businessSearchTerm, setBusinessSearchTerm] = useState('');

  // Event search & status filter
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState<'All' | BusinessEventStatus>('All');
  const [eventViewLayout, setEventViewLayout] = useState<'cards' | 'table'>('cards');

  // Modals & Drawers
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<BusinessEvent | null>(null);
  const [viewingEventDetails, setViewingEventDetails] = useState<BusinessEvent | null>(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState<BusinessEvent | null>(null);

  // Participant registration modal inside Event Details
  const [isAddAttendeeModalOpen, setIsAddAttendeeModalOpen] = useState(false);
  const [attendeeSearchTerm, setAttendeeSearchTerm] = useState('');
  const [newAttendee, setNewAttendee] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'Standard Admission',
    paymentStatus: 'Paid' as 'Paid' | 'Free' | 'Pending',
  });

  // Action Menu Dropdown state per event
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Event Form State
  const initialFormState = {
    name: '',
    description: '',
    category: 'Music & Entertainment',
    date: '2026-10-20',
    startTime: '18:00',
    endTime: '22:00',
    location: selectedBusiness ? `${selectedBusiness.name}, ${selectedBusiness.location}` : 'Remera, Kigali',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    feeType: 'Paid' as 'Free' | 'Paid',
    entryFee: 10000,
    currency: 'RWF',
    maxCapacity: 100,
    status: 'Published' as BusinessEventStatus,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Preset posters for 1-click attractive image selection
  const POSTER_PRESETS = [
    { label: 'Concert & Gala', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Sports & Arena', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Tech Summit', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Fashion & Runway', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Art Exhibition', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Community & Fitness', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Filtered Businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(
      (b) =>
        b.name.toLowerCase().includes(businessSearchTerm.toLowerCase()) ||
        b.location.toLowerCase().includes(businessSearchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(businessSearchTerm.toLowerCase())
    );
  }, [businesses, businessSearchTerm]);

  // Events filtered for currently selected business
  const currentBusinessEvents = useMemo(() => {
    if (!selectedBusiness) return [];
    return events.filter((e) => e.businessId === selectedBusiness.id);
  }, [events, selectedBusiness]);

  // Events filtered by search term and status filter
  const displayedEvents = useMemo(() => {
    return currentBusinessEvents.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        e.location.toLowerCase().includes(eventSearchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(eventSearchTerm.toLowerCase());
      const matchesStatus = eventStatusFilter === 'All' || e.status === eventStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [currentBusinessEvents, eventSearchTerm, eventStatusFilter]);

  // Business Events Summary Stats
  const businessStats = useMemo(() => {
    const total = currentBusinessEvents.length;
    const published = currentBusinessEvents.filter((e) => e.status === 'Published').length;
    const draft = currentBusinessEvents.filter((e) => e.status === 'Draft').length;
    const completed = currentBusinessEvents.filter((e) => e.status === 'Completed').length;
    const cancelled = currentBusinessEvents.filter((e) => e.status === 'Cancelled').length;
    const totalAttendees = currentBusinessEvents.reduce((acc, e) => acc + (e.attendees?.length || 0), 0);
    const totalCapacity = currentBusinessEvents.reduce((acc, e) => acc + (e.maxCapacity || 0), 0);
    const totalRevenueEst = currentBusinessEvents.reduce((acc, e) => {
      const attendeesCount = e.attendees?.length || 0;
      return acc + (e.feeType === 'Paid' ? e.entryFee * attendeesCount : 0);
    }, 0);

    return { total, published, draft, completed, cancelled, totalAttendees, totalCapacity, totalRevenueEst };
  }, [currentBusinessEvents]);

  // Open Create Event Modal
  const handleOpenCreateEvent = () => {
    setEditingEvent(null);
    setFormData({
      ...initialFormState,
      location: selectedBusiness ? `${selectedBusiness.name}, ${selectedBusiness.location}` : 'Remera, Kigali',
    });
    setFormErrors({});
    setIsEventFormOpen(true);
  };

  // Open Edit Event Modal
  const handleOpenEditEvent = (event: BusinessEvent) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      category: event.category,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      image: event.image,
      feeType: event.feeType,
      entryFee: event.entryFee,
      currency: event.currency || 'RWF',
      maxCapacity: event.maxCapacity,
      status: event.status,
    });
    setFormErrors({});
    setOpenActionMenuId(null);
    setIsEventFormOpen(true);
  };

  // Validate & Submit Form (Create / Update)
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) errors.name = 'Event name is required.';
    if (!formData.description.trim()) errors.description = 'Event description is required.';
    if (!formData.date) errors.date = 'Event date is required.';
    if (!formData.location.trim()) errors.location = 'Event location is required.';
    if (formData.feeType === 'Paid' && (!formData.entryFee || formData.entryFee < 0)) {
      errors.entryFee = 'Please enter a valid entry fee amount.';
    }
    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      errors.maxCapacity = 'Please set maximum number of attendees.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingEvent) {
      // Update Event
      const updatedEvents = events.map((ev) => {
        if (ev.id === editingEvent.id) {
          const updated = {
            ...ev,
            name: formData.name.trim(),
            description: formData.description.trim(),
            category: formData.category,
            date: formData.date,
            startTime: formData.startTime,
            endTime: formData.endTime,
            location: formData.location.trim(),
            image: formData.image || initialFormState.image,
            feeType: formData.feeType,
            entryFee: formData.feeType === 'Free' ? 0 : Number(formData.entryFee),
            currency: formData.currency,
            maxCapacity: Number(formData.maxCapacity),
            status: formData.status,
          };
          if (viewingEventDetails?.id === ev.id) {
            setViewingEventDetails(updated);
          }
          return updated;
        }
        return ev;
      });

      setEvents(updatedEvents);
      setIsEventFormOpen(false);
      onTriggerToast('success', 'Event Updated', `"${formData.name}" has been successfully updated.`);
    } else {
      // Create Event
      const newEventItem: BusinessEvent = {
        id: `b-evt-${Date.now()}`,
        businessId: selectedBusiness ? selectedBusiness.id : 'biz-1',
        businessName: selectedBusiness ? selectedBusiness.name : 'BK Arena Kigali',
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location.trim(),
        image: formData.image || initialFormState.image,
        feeType: formData.feeType,
        entryFee: formData.feeType === 'Free' ? 0 : Number(formData.entryFee),
        currency: formData.currency,
        maxCapacity: Number(formData.maxCapacity),
        status: formData.status,
        attendees: [],
        createdAt: new Date().toISOString().split('T')[0],
      };

      setEvents((prev) => [newEventItem, ...prev]);
      setIsEventFormOpen(false);
      onTriggerToast('success', 'Event Created', `"${newEventItem.name}" has been added under ${newEventItem.businessName}.`);
    }
  };

  // Publish / Unpublish Event Toggle
  const handleTogglePublish = (event: BusinessEvent) => {
    setOpenActionMenuId(null);
    const newStatus: BusinessEventStatus = event.status === 'Published' ? 'Draft' : 'Published';
    
    const updatedEvents = events.map((ev) => {
      if (ev.id === event.id) {
        const updated = { ...ev, status: newStatus };
        if (viewingEventDetails?.id === ev.id) {
          setViewingEventDetails(updated);
        }
        return updated;
      }
      return ev;
    });

    setEvents(updatedEvents);

    if (newStatus === 'Published') {
      onTriggerToast('success', 'Event Published', `"${event.name}" is now live and published.`);
    } else {
      onTriggerToast('info', 'Event Unpublished', `"${event.name}" has been unpublished and reverted to Draft.`);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = (eventId: string, newStatus: BusinessEventStatus) => {
    setOpenActionMenuId(null);
    const updatedEvents = events.map((ev) => {
      if (ev.id === eventId) {
        const updated = { ...ev, status: newStatus };
        if (viewingEventDetails?.id === ev.id) {
          setViewingEventDetails(updated);
        }
        return updated;
      }
      return ev;
    });
    setEvents(updatedEvents);
    onTriggerToast('success', 'Status Updated', `Event status set to ${newStatus}.`);
  };

  // Delete Event
  const handleConfirmDelete = () => {
    if (!deleteConfirmEvent) return;
    const deletedName = deleteConfirmEvent.name;
    setEvents((prev) => prev.filter((ev) => ev.id !== deleteConfirmEvent.id));
    if (viewingEventDetails?.id === deleteConfirmEvent.id) {
      setViewingEventDetails(null);
    }
    setDeleteConfirmEvent(null);
    setOpenActionMenuId(null);
    onTriggerToast('warning', 'Event Deleted', `"${deletedName}" was permanently removed.`);
  };

  // Add Participant / Attendee
  const handleAddAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingEventDetails) return;
    if (!newAttendee.name.trim() || !newAttendee.email.trim()) {
      onTriggerToast('error', 'Required Fields', 'Participant name and email are required.');
      return;
    }

    const attendeeRecord: BusinessEventAttendee = {
      id: `att-${Date.now()}`,
      name: newAttendee.name.trim(),
      email: newAttendee.email.trim(),
      phone: newAttendee.phone.trim() || '+250 788 000 000',
      ticketType: newAttendee.ticketType,
      registrationDate: `${new Date().toISOString().split('T')[0]} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      amountPaid: viewingEventDetails.feeType === 'Paid' ? viewingEventDetails.entryFee : 0,
      currency: viewingEventDetails.currency,
      paymentStatus: viewingEventDetails.feeType === 'Paid' ? newAttendee.paymentStatus : 'Free',
    };

    const updatedEvents = events.map((ev) => {
      if (ev.id === viewingEventDetails.id) {
        const updatedAttendees = [attendeeRecord, ...(ev.attendees || [])];
        const updated = { ...ev, attendees: updatedAttendees };
        setViewingEventDetails(updated);
        return updated;
      }
      return ev;
    });

    setEvents(updatedEvents);
    setIsAddAttendeeModalOpen(false);
    setNewAttendee({
      name: '',
      email: '',
      phone: '',
      ticketType: 'Standard Admission',
      paymentStatus: 'Paid',
    });
    onTriggerToast('success', 'Attendee Registered', `${attendeeRecord.name} added to ${viewingEventDetails.name}.`);
  };

  // Export Attendees CSV
  const handleExportAttendeesCSV = (event: BusinessEvent) => {
    const attendees = event.attendees || [];
    if (attendees.length === 0) {
      onTriggerToast('info', 'No Attendees', 'There are no registered participants to export yet.');
      return;
    }

    const headers = ['Attendee ID', 'Name', 'Email', 'Phone', 'Ticket Type', 'Registration Date', 'Amount Paid', 'Currency', 'Payment Status'];
    const rows = attendees.map((a) => [
      a.id,
      `"${a.name.replace(/"/g, '""')}"`,
      a.email,
      a.phone,
      a.ticketType,
      a.registrationDate,
      a.amountPaid,
      a.currency,
      a.paymentStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.name.replace(/[^a-zA-Z0-9]/g, '_')}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast('success', 'CSV Exported', `Downloaded ${attendees.length} attendee records.`);
  };

  // Status Badge Class Generator
  const getStatusBadge = (status: BusinessEventStatus) => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Completed':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-base font-semibold text-slate-500 mb-1">
            <button
              type="button"
              onClick={() => setCurrentSubView('business-directory')}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Business</span>
            </button>
            <span>/</span>
            {selectedBusiness && (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentSubView('events-management')}
                  className="hover:text-emerald-700 transition-colors font-bold text-slate-700 cursor-pointer"
                >
                  {selectedBusiness.name}
                </button>
                <span>/</span>
              </>
            )}
            <span className="font-extrabold text-emerald-700">
              {currentSubView === 'submissions'
                ? 'Event Submissions Approval'
                : currentSubView === 'business-directory'
                ? 'Venues Directory'
                : 'Events Management'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>
              {currentSubView === 'submissions'
                ? 'Business → Event Submissions Approval'
                : currentSubView === 'business-directory'
                ? 'Business → Venues & Partners Directory'
                : 'Business → Events Management'}
            </span>
          </h2>
          <p className="text-base sm:text-base text-slate-600 mt-0.5">
            {currentSubView === 'submissions'
              ? 'Review visitor-submitted events, examine uploaded posters, approve or publish live.'
              : 'Create, publish, edit, set entry fees, monitor participant capacity, and manage registrations.'}
          </p>
        </div>

        {/* View Toggle & Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Business Switcher Dropdown (when in events management) */}
          {currentSubView === 'events-management' && (
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-2xs">
              <span className="text-[15px] font-bold text-slate-500 uppercase">Venue:</span>
              <select
                value={selectedBusiness?.id || ''}
                onChange={(e) => {
                  const b = businesses.find((biz) => biz.id === e.target.value);
                  if (b) {
                    setSelectedBusiness(b);
                    setCurrentSubView('events-management');
                    setViewingEventDetails(null);
                  }
                }}
                className="text-base font-bold text-slate-900 bg-transparent outline-none cursor-pointer"
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({events.filter((ev) => ev.businessId === b.id).length} events)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Create Event Primary CTA */}
          <button
            type="button"
            onClick={handleOpenCreateEvent}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-base font-bold text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* 2. THREE CORE SUB-SECTIONS NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {/* Tab 1: Business Events */}
        <button
          type="button"
          onClick={() => setCurrentSubView('events-management')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition-all cursor-pointer whitespace-nowrap ${
            currentSubView === 'events-management'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Events Management</span>
          <span
            className={`text-[14px] px-1.5 py-0.5 rounded-full ${
              currentSubView === 'events-management' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {events.length}
          </span>
        </button>

        {/* Tab 2: Event Submissions (Approval Workflow requested by user) */}
        <button
          type="button"
          onClick={() => setCurrentSubView('submissions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition-all cursor-pointer whitespace-nowrap relative ${
            currentSubView === 'submissions'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Event Submissions</span>
          <span className="text-[14px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
            {pendingSubmissionsCount} Pending
          </span>
        </button>

        {/* Tab 3: Business Directory */}
        <button
          type="button"
          onClick={() => setCurrentSubView('business-directory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-base transition-all cursor-pointer whitespace-nowrap ${
            currentSubView === 'business-directory'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-slate-400" />
          <span>Business Directory</span>
          <span
            className={`text-[14px] px-1.5 py-0.5 rounded-full ${
              currentSubView === 'business-directory' ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
            }`}
          >
            {businesses.length}
          </span>
        </button>
      </div>

      {/* 3. SUB-VIEW: VISITOR EVENT SUBMISSIONS & ADMIN APPROVAL */}
      {currentSubView === 'submissions' && (
        <AdminEventSubmissions
          onTriggerToast={onTriggerToast}
          onSelectBusinessView={() => setCurrentSubView('events-management')}
        />
      )}

      {/* 4. SUB-VIEW: ALL BUSINESSES DIRECTORY */}
      {currentSubView === 'business-directory' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={businessSearchTerm}
                onChange={(e) => setBusinessSearchTerm(e.target.value)}
                placeholder="Search business venue, district, or category..."
                className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBusinesses.map((biz) => {
              const bEventsCount = events.filter((ev) => ev.businessId === biz.id).length;
              const isSelected = selectedBusiness?.id === biz.id;

              return (
                <div
                  key={biz.id}
                  className={`bg-white border rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between space-y-4 group ${
                    isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-base font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {biz.category}
                      </span>
                      <span className="text-[15px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{biz.status}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {biz.name}
                    </h3>
                    <p className="text-base text-slate-500 mt-0.5 font-medium">{biz.ownerName}</p>

                    <div className="mt-4 space-y-2 text-base text-slate-700">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{biz.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 block text-[14px] uppercase font-semibold">Active Events</span>
                      <span className="font-extrabold text-slate-900 text-base">{bEventsCount} Events</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBusiness(biz);
                        setCurrentSubView('events-management');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>Manage Events</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SUB-VIEW: BUSINESS EVENTS MANAGEMENT */}
      {currentSubView === 'events-management' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Active Business Banner */}
          {selectedBusiness && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      {selectedBusiness.name}
                    </h3>
                    <span className="text-[14px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedBusiness.category}
                    </span>
                    <span className="text-[14px] font-semibold text-slate-500">
                      Owner: {selectedBusiness.ownerName}
                    </span>
                  </div>
                  <p className="text-base text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedBusiness.location}</span>
                    <span className="text-slate-300">·</span>
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{selectedBusiness.email}</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions & Create Event */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpenCreateEvent}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-base font-bold text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>
            </div>
          )}

          {/* 4 Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Total Events</span>
              <span className="text-xl font-black text-slate-900 tabular-nums">{businessStats.total}</span>
              <span className="text-[14px] text-slate-500 font-medium block mt-0.5">under this venue</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Published</span>
              <span className="text-xl font-black text-emerald-700 tabular-nums">{businessStats.published}</span>
              <span className="text-[14px] text-emerald-700 font-semibold block mt-0.5">Live &amp; Bookable</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Drafts</span>
              <span className="text-xl font-black text-slate-700 tabular-nums">{businessStats.draft}</span>
              <span className="text-[14px] text-slate-500 font-medium block mt-0.5">Unpublished</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Completed</span>
              <span className="text-xl font-black text-sky-700 tabular-nums">{businessStats.completed}</span>
              <span className="text-[14px] text-sky-700 font-semibold block mt-0.5">Past events</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Registered Participants</span>
              <span className="text-xl font-black text-purple-700 tabular-nums">{businessStats.totalAttendees}</span>
              <span className="text-[14px] text-slate-500 font-medium block mt-0.5">Across all events</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <span className="text-[15px] font-semibold text-slate-500 block">Estimated Revenue</span>
              <span className="text-xl font-black text-emerald-700 tabular-nums">
                {(businessStats.totalRevenueEst / 1000).toFixed(0)}k RWF
              </span>
              <span className="text-[14px] text-slate-500 font-medium block mt-0.5">From entry fees</span>
            </div>
          </div>

          {/* 5. Search & Status Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={eventSearchTerm}
                  onChange={(e) => setEventSearchTerm(e.target.value)}
                  placeholder="Search event name, location, or description..."
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                />
              </div>

              {/* Status Filter Tabs (Draft, Published, Completed, Cancelled) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-base font-semibold">
                {(['All', 'Published', 'Draft', 'Completed', 'Cancelled'] as const).map((st) => {
                  const isActive = eventStatusFilter === st;
                  const count =
                    st === 'All'
                      ? currentBusinessEvents.length
                      : currentBusinessEvents.filter((ev) => ev.status === st).length;

                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEventStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{st}</span>
                      <span
                        className={`text-[14px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. EVENTS LIST (Cards View) */}
          {displayedEvents.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center text-slate-500 shadow-xs">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="font-bold text-slate-900 text-base">No Events Found</h3>
              <p className="text-base text-slate-500 mt-1 max-w-sm mx-auto">
                {eventSearchTerm || eventStatusFilter !== 'All'
                  ? 'No events match your current filter criteria.'
                  : `There are no events yet for ${selectedBusiness?.name || 'this business'}.`}
              </p>
              <button
                type="button"
                onClick={handleOpenCreateEvent}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base inline-flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Event</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {displayedEvents.map((event) => {
                const attendeeCount = event.attendees?.length || 0;
                const fillPercent = Math.min(100, Math.round((attendeeCount / event.maxCapacity) * 100));
                const isMenuOpen = openActionMenuId === event.id;

                return (
                  <div
                    key={event.id}
                    className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Event Poster / Image Header */}
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        <img
                          src={event.image}
                          alt={event.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="text-[14px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-xs text-slate-900 px-2.5 py-1 rounded-lg border border-white/40 shadow-xs">
                            {event.category}
                          </span>

                          <span
                            className={`text-[14px] font-bold px-2.5 py-1 rounded-lg border shadow-xs ${getStatusBadge(
                              event.status
                            )} bg-white/95`}
                          >
                            {event.status}
                          </span>
                        </div>

                        {/* Bottom Image Overlay: Date & Location */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="text-base font-bold flex items-center gap-1.5 drop-shadow-sm">
                            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              {event.date} · {event.startTime} - {event.endTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h4
                            onClick={() => setViewingEventDetails(event)}
                            className="font-extrabold text-base text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
                          >
                            {event.name}
                          </h4>
                          <p className="text-base text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-base text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>

                        {/* Entry Fee & Capacity Block (Requirements check: Entry Fee: 10,000 RWF | Capacity: 100 people) */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-base">
                            <span className="text-slate-500 font-medium">Entry Fee:</span>
                            <span
                              className={`font-black text-base px-2 py-0.5 rounded-lg border ${
                                event.feeType === 'Free'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-900 text-white border-slate-900'
                              }`}
                            >
                              {event.feeType === 'Free'
                                ? 'Free'
                                : `${event.entryFee.toLocaleString()} ${event.currency}`}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[15px] text-slate-600 font-semibold">
                              <span>Capacity: {event.maxCapacity} people</span>
                              <span className="text-slate-900 font-bold">
                                {attendeeCount} / {event.maxCapacity} registered ({fillPercent}%)
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  fillPercent >= 100
                                    ? 'bg-rose-500'
                                    : fillPercent >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${fillPercent}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Event Action Menu (View | Edit | Publish/Unpublish | Update | Delete) */}
                    <div className="p-4 px-5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <button
                        type="button"
                        onClick={() => setViewingEventDetails(event)}
                        className="text-base font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span>View Details</span>
                      </button>

                      {/* Action Menu (View | Edit | Publish/Unpublish | Update | Delete) */}
                      <div className="relative">
                        <div className="flex items-center gap-1.5">
                          {/* Quick Publish / Unpublish button */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(event)}
                            className={`px-2.5 py-1 rounded-lg text-base font-bold border transition-colors cursor-pointer ${
                              event.status === 'Published'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            }`}
                            title={event.status === 'Published' ? 'Unpublish Event' : 'Publish Event'}
                          >
                            {event.status === 'Published' ? 'Unpublish' : 'Publish'}
                          </button>

                          {/* Quick Edit button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditEvent(event)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                            title="Edit Event"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* More Actions Dropdown Toggle */}
                          <button
                            type="button"
                            onClick={() => setOpenActionMenuId(isMenuOpen ? null : event.id)}
                            className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Dropdown Menu (View | Edit | Publish/Unpublish | Update | Delete) */}
                        {isMenuOpen && (
                          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-20 animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-2 border-b border-slate-100 text-[14px] font-bold text-slate-400 uppercase tracking-wider">
                              Event Actions
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                setViewingEventDetails(event);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-slate-500" />
                              <span>View Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEditEvent(event)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4 text-slate-500" />
                              <span>Edit Event</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleTogglePublish(event)}
                              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors text-left cursor-pointer"
                            >
                              {event.status === 'Published' ? (
                                <>
                                  <EyeOff className="w-4 h-4 text-amber-600" />
                                  <span>Unpublish Event</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Publish Event</span>
                                </>
                              )}
                            </button>

                            {/* Update Status Submenu */}
                            <div className="px-3 py-1.5 border-t border-slate-100 text-[14px] font-bold text-slate-400 uppercase">
                              Update Status
                            </div>
                            <div className="grid grid-cols-2 gap-1 px-1">
                              {(['Draft', 'Published', 'Completed', 'Cancelled'] as const).map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleQuickStatusChange(event.id, st)}
                                  className={`text-[14px] font-bold px-2 py-1 rounded-md text-left transition-colors cursor-pointer ${
                                    event.status === st
                                      ? 'bg-slate-900 text-white'
                                      : 'text-slate-600 hover:bg-slate-100'
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>

                            <div className="mt-1 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  setDeleteConfirmEvent(event);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete Event</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. EVENT CREATION & EDIT MODAL / FORM */}
      {isEventFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-2xs">
                  {editingEvent ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                    {editingEvent ? 'Edit Event' : 'Create Event'}
                  </h3>
                  <p className="text-base text-slate-500 font-medium">
                    Under <span className="font-bold text-slate-700">{selectedBusiness?.name}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEventFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Event Name */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Event Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Kigali International Tech & Music Gala"
                  className={`w-full bg-white border ${
                    formErrors.name ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none`}
                />
                {formErrors.name && <p className="text-[15px] text-rose-600 mt-1">{formErrors.name}</p>}
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Event Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Music & Entertainment">Music &amp; Entertainment</option>
                    <option value="Sports & Athletics">Sports &amp; Athletics</option>
                    <option value="Technology">Technology &amp; Startups</option>
                    <option value="Business & Finance">Business &amp; Finance</option>
                    <option value="Arts & Fashion">Arts &amp; Fashion</option>
                    <option value="Food & Cultural">Food &amp; Cultural</option>
                    <option value="Health & Community">Health &amp; Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Event Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BusinessEventStatus })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Published">Published (Public &amp; Bookable)</option>
                    <option value="Draft">Draft (Private / Work in Progress)</option>
                    <option value="Completed">Completed (Past Event)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Event Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide an overview of the event highlights, schedule, performers, and attendee guidelines..."
                  className={`w-full bg-white border ${
                    formErrors.description ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2 text-base text-slate-900 outline-none`}
                />
                {formErrors.description && <p className="text-[15px] text-rose-600 mt-1">{formErrors.description}</p>}
              </div>

              {/* Event Date, Start Time, End Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Event Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-base text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">Start Time *</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-base text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2.5 text-base text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Location / Venue *</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. BK Arena Main Auditorium, Remera"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none"
                />
              </div>

              {/* Entry Fee (Requirements check: Allow Free, Paid, Custom amount, Currency selection - Example: Entry Fee: 10,000 RWF) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-base font-bold text-slate-900">Set Entry Fee *</label>
                    <p className="text-[15px] text-slate-500">Configure ticket pricing and currency</p>
                  </div>

                  {/* Free vs Paid Toggle */}
                  <div className="flex items-center p-1 rounded-xl bg-white border border-slate-300 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, feeType: 'Free', entryFee: 0 })}
                      className={`px-3 py-1 rounded-lg text-base font-bold transition-all cursor-pointer ${
                        formData.feeType === 'Free'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Free
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, feeType: 'Paid', entryFee: formData.entryFee || 10000 })}
                      className={`px-3 py-1 rounded-lg text-base font-bold transition-all cursor-pointer ${
                        formData.feeType === 'Paid'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paid
                    </button>
                  </div>
                </div>

                {formData.feeType === 'Paid' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-base font-bold text-slate-700 mb-1">Custom Amount</label>
                      <input
                        type="number"
                        min={100}
                        step={500}
                        value={formData.entryFee}
                        onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                        placeholder="e.g. 10000"
                        className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-base text-slate-900 font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-base font-bold text-slate-700 mb-1">Currency Selection</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 font-bold outline-none cursor-pointer"
                      >
                        <option value="RWF">RWF (Rwandan Franc)</option>
                        <option value="USD">USD (United States Dollar)</option>
                        <option value="EUR">EUR (Euro)</option>
                      </select>
                    </div>

                    {/* Preview Banner */}
                    <div className="sm:col-span-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-base text-emerald-900 font-semibold flex items-center justify-between">
                      <span>Price Preview:</span>
                      <span className="font-extrabold text-base text-emerald-800">
                        Entry Fee: {formData.entryFee.toLocaleString()} {formData.currency}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Maximum Capacity (Requirements check: Set maximum number of attendees - Example: Capacity: 100 people) */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Maximum Number of Attendees (Capacity) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    required
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    placeholder="e.g. 100"
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-900 font-bold outline-none"
                  />
                  <span className="text-base text-slate-500 font-bold shrink-0">People</span>
                </div>
                <p className="text-[15px] text-slate-500 mt-1">Example: Capacity: 100 people</p>
              </div>

              {/* Upload Event Image / Poster */}
              <div className="space-y-2">
                <label className="block text-base font-bold text-slate-700">Upload Event Image / Poster URL *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none"
                />

                {/* Quick Poster Presets */}
                <div>
                  <span className="text-[14px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Quick Preset Posters:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {POSTER_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: p.url })}
                        className={`text-[14px] font-semibold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                          formData.image === p.url
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {formData.image && (
                  <div className="mt-2 relative h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={formData.image}
                      alt="Poster Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[14px] px-2 py-0.5 rounded font-bold">
                      Poster Preview
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventFormOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-base font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-bold text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  {editingEvent ? 'Update Event' : 'Create & Save Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. EVENT DETAILS PAGE / MODAL (Requirements check: Event Details page showing event information, entry fee, number of registrations, event status, and registered/attending participants) */}
      {viewingEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            {/* Top Navigation & Back */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setViewingEventDetails(null)}
                className="inline-flex items-center gap-1.5 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Events Management</span>
              </button>

              <div className="flex items-center gap-2">
                {/* Publish / Unpublish Toggle */}
                <button
                  type="button"
                  onClick={() => handleTogglePublish(viewingEventDetails)}
                  className={`px-3 py-1.5 rounded-xl text-base font-bold border transition-colors cursor-pointer ${
                    viewingEventDetails.status === 'Published'
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {viewingEventDetails.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEditEvent(viewingEventDetails);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteConfirmEvent(viewingEventDetails)}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-base font-bold text-rose-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewingEventDetails(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Poster & Title Banner */}
            <div className="relative rounded-2xl overflow-hidden h-52 sm:h-64 bg-slate-900 shadow-sm">
              <img
                src={viewingEventDetails.image}
                alt={viewingEventDetails.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-black/10" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[14px] font-bold uppercase tracking-wider bg-white/90 text-slate-900 px-2 py-0.5 rounded">
                    {viewingEventDetails.category}
                  </span>
                  <span
                    className={`text-[14px] font-bold px-2 py-0.5 rounded ${getStatusBadge(
                      viewingEventDetails.status
                    )} bg-white`}
                  >
                    {viewingEventDetails.status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                  {viewingEventDetails.name}
                </h2>
                <p className="text-base text-slate-200 mt-1 flex items-center gap-2">
                  <span>Host: {viewingEventDetails.businessName}</span>
                  <span>·</span>
                  <span>Created: {viewingEventDetails.createdAt}</span>
                </p>
              </div>
            </div>

            {/* Key Information Grid (Requirements check: Event information, entry fee, number of registrations, event status) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[14px] uppercase font-bold text-slate-500 block mb-0.5">Entry Fee</span>
                <span className="text-base font-black text-emerald-700">
                  {viewingEventDetails.feeType === 'Free'
                    ? 'Free'
                    : `${viewingEventDetails.entryFee.toLocaleString()} ${viewingEventDetails.currency}`}
                </span>
                <span className="text-[14px] text-slate-500 block mt-0.5">Per participant</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[14px] uppercase font-bold text-slate-500 block mb-0.5">Capacity</span>
                <span className="text-base font-black text-slate-900">{viewingEventDetails.maxCapacity} people</span>
                <span className="text-[14px] text-slate-500 block mt-0.5">Venue limit</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[14px] uppercase font-bold text-slate-500 block mb-0.5">Registrations</span>
                <span className="text-base font-black text-purple-700">
                  {viewingEventDetails.attendees?.length || 0} registered
                </span>
                <span className="text-[14px] text-slate-500 block mt-0.5">
                  {Math.max(0, viewingEventDetails.maxCapacity - (viewingEventDetails.attendees?.length || 0))} slots remaining
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[14px] uppercase font-bold text-slate-500 block mb-0.5">Event Status</span>
                <span className={`text-base font-extrabold px-2 py-0.5 rounded-md border inline-block ${getStatusBadge(viewingEventDetails.status)}`}>
                  {viewingEventDetails.status}
                </span>
                <span className="text-[14px] text-slate-500 block mt-0.5">Current visibility</span>
              </div>
            </div>

            {/* Time & Location details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-base">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Date &amp; Time:</span>
                <span>
                  {viewingEventDetails.date} from {viewingEventDetails.startTime} to {viewingEventDetails.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-slate-900">Location:</span>
                <span>{viewingEventDetails.location}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-1.5">Event Description</h4>
              <p className="text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {viewingEventDetails.description}
              </p>
            </div>

            {/* REGISTERED / ATTENDING PARTICIPANTS SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Registered Participants ({viewingEventDetails.attendees?.length || 0})</span>
                  </h4>
                  <p className="text-base text-slate-500">Attendee roster, ticketing tiers, and payment statuses.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleExportAttendeesCSV(viewingEventDetails)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddAttendeeModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-bold text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Add Participant</span>
                  </button>
                </div>
              </div>

              {/* Attendee search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={attendeeSearchTerm}
                  onChange={(e) => setAttendeeSearchTerm(e.target.value)}
                  placeholder="Search attendee by name, email, or ticket..."
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl pl-9 pr-3 py-1.5 text-base text-slate-900 outline-none"
                />
              </div>

              {/* Attendees Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-base">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Participant</th>
                      <th className="py-2.5 px-3">Email &amp; Phone</th>
                      <th className="py-2.5 px-3">Ticket Type</th>
                      <th className="py-2.5 px-3">Registered At</th>
                      <th className="py-2.5 px-3 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(viewingEventDetails.attendees || []).length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          <Users className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                          <p className="font-bold text-base text-slate-800">No Participants Registered Yet</p>
                          <p className="text-[15px] text-slate-400 mt-0.5">
                            Click "+ Add Participant" to manually register an attendee.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      (viewingEventDetails.attendees || [])
                        .filter(
                          (a) =>
                            a.name.toLowerCase().includes(attendeeSearchTerm.toLowerCase()) ||
                            a.email.toLowerCase().includes(attendeeSearchTerm.toLowerCase()) ||
                            a.ticketType.toLowerCase().includes(attendeeSearchTerm.toLowerCase())
                        )
                        .map((att) => (
                          <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-900">{att.name}</td>
                            <td className="py-2.5 px-3 text-slate-600 font-medium">
                              <div>{att.email}</div>
                              <div className="text-[14px] text-slate-400">{att.phone}</div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[14px] border border-slate-200">
                                {att.ticketType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 tabular-nums">{att.registrationDate}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[14px] font-bold border ${
                                  att.paymentStatus === 'Paid'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : att.paymentStatus === 'Free'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}
                              >
                                {att.paymentStatus}
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADD ATTENDEE MODAL */}
      {isAddAttendeeModalOpen && viewingEventDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-slate-900">Register Participant</h3>
              <button
                type="button"
                onClick={() => setIsAddAttendeeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAttendee} className="space-y-3">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAttendee.name}
                  onChange={(e) => setNewAttendee({ ...newAttendee, name: e.target.value })}
                  placeholder="e.g. Diane Mugisha"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newAttendee.email}
                  onChange={(e) => setNewAttendee({ ...newAttendee, email: e.target.value })}
                  placeholder="diane@example.rw"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newAttendee.phone}
                  onChange={(e) => setNewAttendee({ ...newAttendee, phone: e.target.value })}
                  placeholder="+250 788 000 000"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Ticket Type</label>
                <select
                  value={newAttendee.ticketType}
                  onChange={(e) => setNewAttendee({ ...newAttendee, ticketType: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="Standard Admission">Standard Admission</option>
                  <option value="VIP Guest">VIP Guest</option>
                  <option value="Early Bird Pass">Early Bird Pass</option>
                  <option value="Speaker / Performer Pass">Speaker / Performer Pass</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Payment Status</label>
                <select
                  value={newAttendee.paymentStatus}
                  onChange={(e) =>
                    setNewAttendee({
                      ...newAttendee,
                      paymentStatus: e.target.value as 'Paid' | 'Free' | 'Pending',
                    })
                  }
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Free">Free</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddAttendeeModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 text-base font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-bold text-white shadow-2xs cursor-pointer"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. DELETE EVENT CONFIRMATION DIALOG */}
      {deleteConfirmEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-100">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Event</h3>
                <p className="text-base text-slate-600 mt-1">
                  Are you sure you want to permanently delete{' '}
                  <span className="font-bold text-slate-900">"{deleteConfirmEvent.name}"</span>? This action cannot be
                  undone and will remove all attendee registrations for this event.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmEvent(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-base font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-base font-bold text-white transition-colors shadow-2xs cursor-pointer"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
