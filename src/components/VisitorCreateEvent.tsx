import React, { useState, useRef } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  X,
  RefreshCw,
  Sparkles,
  FileText,
  User,
  Phone,
  Mail,
  Send,
  Save,
  Eye,
  Info,
} from 'lucide-react';
import { EventSubmission, SubmissionStatus } from '../types/admin';

interface VisitorCreateEventProps {
  onSubmitEvent: (submission: EventSubmission) => void;
  onCancel: () => void;
}

export const VisitorCreateEvent: React.FC<VisitorCreateEventProps> = ({
  onSubmitEvent,
  onCancel,
}) => {
  // Submission success state
  const [submittedEvent, setSubmittedEvent] = useState<EventSubmission | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Technology & Startups',
    date: '2026-10-15',
    startTime: '18:00',
    endTime: '21:30',
    location: '',
    organizerName: '',
    organizerEmail: '',
    organizerPhone: '',
    feeType: 'Paid' as 'Free' | 'Paid',
    entryFee: 10000,
    currency: 'RWF',
    maxCapacity: 100,
  });

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [imageFileSize, setImageFileSize] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset Poster Inspirations (for testing/quick-fill)
  const POSTER_PRESETS = [
    { label: 'Startup Tech Gala', url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80', name: 'tech_gala.jpg' },
    { label: 'Live Concert & Festival', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80', name: 'live_concert.jpg' },
    { label: 'Basketball & Sports', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80', name: 'sports_showcase.jpg' },
    { label: 'Food & Wine Festival', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80', name: 'food_expo.jpg' },
  ];

  // Handle local file upload directly from user's device
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate format: JPG, PNG, WEBP
    const validFormats = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
      setImageError('Unsupported format. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image exceeds 5MB size limit. Please upload a smaller image.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setImageFileName(file.name);
    setImageFileSize(sizeFormatted);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName(null);
    setImageFileSize(null);
    setImageError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Quick preset picker
  const handleSelectPreset = (preset: typeof POSTER_PRESETS[0]) => {
    setImagePreview(preset.url);
    setImageFileName(preset.name);
    setImageFileSize('1.2 MB');
    setImageError(null);
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Please provide the event name.';
    if (!formData.description.trim()) newErrors.description = 'Please enter an event description.';
    if (!formData.date) newErrors.date = 'Event date is required.';
    if (!formData.startTime) newErrors.startTime = 'Start time is required.';
    if (!formData.location.trim()) newErrors.location = 'Please provide the venue or event location.';
    if (!formData.organizerName.trim()) newErrors.organizerName = 'Organizer name is required.';
    if (!formData.organizerEmail.trim()) {
      newErrors.organizerEmail = 'Organizer email is required for approval updates.';
    } else if (!formData.organizerEmail.includes('@')) {
      newErrors.organizerEmail = 'Please enter a valid email address.';
    }
    if (formData.feeType === 'Paid' && (!formData.entryFee || formData.entryFee <= 0)) {
      newErrors.entryFee = 'Please enter a valid entry fee amount.';
    }
    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      newErrors.maxCapacity = 'Please specify maximum capacity.';
    }
    if (!imagePreview) {
      newErrors.image = 'Please upload an event poster image.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Submit (Draft or Pending Approval)
  const handleSubmit = (targetStatus: 'Draft' | 'Pending Approval') => {
    if (targetStatus === 'Pending Approval') {
      if (!validateForm()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    } else {
      // Draft requires at least a title
      if (!formData.name.trim()) {
        setErrors({ name: 'Please provide at least an event title to save a draft.' });
        return;
      }
    }

    setIsSubmitting(true);

    const submission: EventSubmission = {
      id: `sub-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim() || 'Visitor event proposal draft.',
      category: formData.category,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime || '22:00',
      location: formData.location.trim() || 'Kigali, Rwanda',
      organizerName: formData.organizerName.trim() || 'Independent Organizer',
      organizerEmail: formData.organizerEmail.trim() || 'organizer@kigali.rw',
      organizerPhone: formData.organizerPhone.trim() || '+250 788 000 000',
      feeType: formData.feeType,
      entryFee: formData.feeType === 'Free' ? 0 : Number(formData.entryFee),
      currency: formData.currency,
      maxCapacity: Number(formData.maxCapacity) || 100,
      image: imagePreview || POSTER_PRESETS[0].url,
      imageFileName: imageFileName || 'event_poster.jpg',
      imageFileSize: imageFileSize || '1.2 MB',
      submittedAt: new Date().toISOString().split('T')[0],
      status: targetStatus,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitEvent(submission);
      setSubmittedEvent(submission);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  // SUCCESS SCREEN (Requirements check: After submission show "Event Submitted Successfully", "Your event has been submitted and is waiting for admin approval.", and Draft -> Pending Approval -> Approved -> Published)
  if (submittedEvent) {
    const isDraft = submittedEvent.status === 'Draft';

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 text-center">
          {/* Success Check Icon */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {isDraft ? 'Draft Saved' : 'Submission Received'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
              {isDraft ? 'Draft Saved Successfully' : 'Event Submitted Successfully'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
              {isDraft
                ? 'Your event draft has been saved. You can complete it and submit for approval at any time.'
                : 'Your event has been submitted and is waiting for admin approval.'}
            </p>
          </div>

          {/* Approval Workflow Stepper: Draft → Pending Approval → Approved → Published */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 text-left space-y-4">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              Event Approval Lifecycle
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {/* Step 1: Draft */}
              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 ${
                submittedEvent.status === 'Draft'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                  : 'bg-white text-slate-700 border-slate-200 font-semibold'
              }`}>
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">1</div>
                <span>Draft</span>
              </div>

              {/* Step 2: Pending Approval */}
              <div className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 ${
                submittedEvent.status === 'Pending Approval'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-black shadow-xs ring-2 ring-emerald-500/20'
                  : 'bg-white text-slate-500 border-slate-200 font-medium'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  submittedEvent.status === 'Pending Approval' ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-200'
                }`}>2</div>
                <span>Pending Approval</span>
              </div>

              {/* Step 3: Approved */}
              <div className="p-3 rounded-xl border bg-white text-slate-400 border-slate-200 flex flex-col items-center justify-center gap-1.5 font-medium opacity-60">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">3</div>
                <span>Approved</span>
              </div>

              {/* Step 4: Published */}
              <div className="p-3 rounded-xl border bg-white text-slate-400 border-slate-200 flex flex-col items-center justify-center gap-1.5 font-medium opacity-60">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">4</div>
                <span>Published</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center leading-snug">
              Status Progression: <span className="font-bold text-slate-800">Draft → Pending Approval → Approved → Published</span>
            </div>
          </div>

          {/* Submitted Event Card Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 text-left shadow-xs">
            <img
              src={submittedEvent.image}
              alt={submittedEvent.name}
              className="w-full sm:w-28 h-28 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {submittedEvent.category}
              </span>
              <h4 className="text-base font-extrabold text-slate-900 truncate mt-1">
                {submittedEvent.name}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{submittedEvent.date} · {submittedEvent.startTime} - {submittedEvent.endTime}</span>
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{submittedEvent.location}</span>
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs">
                <span className="font-bold text-emerald-700">
                  {submittedEvent.feeType === 'Free' ? 'Free Entry' : `Entry Fee: ${submittedEvent.entryFee.toLocaleString()} ${submittedEvent.currency}`}
                </span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-slate-700">Capacity: {submittedEvent.maxCapacity} people</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSubmittedEvent(null);
                setFormData({
                  name: '',
                  description: '',
                  category: 'Technology & Startups',
                  date: '2026-10-15',
                  startTime: '18:00',
                  endTime: '21:30',
                  location: '',
                  organizerName: '',
                  organizerEmail: '',
                  organizerPhone: '',
                  feeType: 'Paid',
                  entryFee: 10000,
                  currency: 'RWF',
                  maxCapacity: 100,
                });
                handleRemoveImage();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              Submit Another Event
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Return to Public Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Cancel button */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events Feed</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Visitor Portal · Event Submission
        </span>
      </div>

      {/* Main Card Container */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
        {/* Title Header */}
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Submit Your Event to KigaliPulse</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Create &amp; Submit Public Event
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
            Fill in the event details, entry fee, capacity, and upload a poster. Submitted events are promptly reviewed by KigaliPulse administrators before public publishing.
          </p>
        </div>

        {/* Global Error Notice if any */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Please correct the highlighted fields before submitting:</div>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-rose-600">
                {Object.values(errors).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit('Pending Approval'); }} className="space-y-8">
          {/* SECTION 1: EVENT INFORMATION */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                1. Event Information
              </h3>
            </div>

            {/* Event Name */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Event Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Startup Founders Talk"
                className={`w-full bg-white border ${
                  errors.name ? 'border-rose-500' : 'border-slate-300'
                } focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Event Category & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Event Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 outline-none cursor-pointer"
                >
                  <option value="Technology & Startups">Technology &amp; Startups</option>
                  <option value="Business & Finance">Business &amp; Leadership</option>
                  <option value="Music & Concerts">Music &amp; Concerts</option>
                  <option value="Arts & Fashion">Arts &amp; Fashion</option>
                  <option value="Food & Cultural">Food &amp; Cultural</option>
                  <option value="Sports & Athletics">Sports &amp; Athletics</option>
                  <option value="Community & Networking">Community &amp; Networking</option>
                  <option value="Education & Workshops">Education &amp; Workshops</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full bg-white border ${
                    errors.date ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none`}
                />
                {errors.date && <p className="text-[11px] text-rose-600 mt-1">{errors.date}</p>}
              </div>
            </div>

            {/* Start Time & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  End Time
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Location / Venue *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Norrsken House Kigali, Downtown / BK Arena VIP Room"
                  className={`w-full bg-white border ${
                    errors.location ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none`}
                />
              </div>
              {errors.location && <p className="text-[11px] text-rose-600 mt-1">{errors.location}</p>}
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Event Description *
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what attendees should expect, key speakers, agenda breakdown, and venue amenities..."
                className={`w-full bg-white border ${
                  errors.description ? 'border-rose-500' : 'border-slate-300'
                } focus:border-emerald-600 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none`}
              />
              {errors.description && <p className="text-[11px] text-rose-600 mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* SECTION 2: ORGANIZER INFORMATION */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                2. Organizer Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Organizer Name *
                </label>
                <input
                  type="text"
                  value={formData.organizerName}
                  onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className={`w-full bg-white border ${
                    errors.organizerName ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none`}
                />
                {errors.organizerName && <p className="text-[11px] text-rose-600 mt-1">{errors.organizerName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Organizer Email *
                </label>
                <input
                  type="email"
                  value={formData.organizerEmail}
                  onChange={(e) => setFormData({ ...formData, organizerEmail: e.target.value })}
                  placeholder="john.doe@example.rw"
                  className={`w-full bg-white border ${
                    errors.organizerEmail ? 'border-rose-500' : 'border-slate-300'
                  } focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none`}
                />
                {errors.organizerEmail && <p className="text-[11px] text-rose-600 mt-1">{errors.organizerEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Organizer Phone
                </label>
                <input
                  type="tel"
                  value={formData.organizerPhone}
                  onChange={(e) => setFormData({ ...formData, organizerPhone: e.target.value })}
                  placeholder="+250 788 512 345"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: ENTRY FEE & CAPACITY (Requirements check: Free, Paid, Custom amount, Currency selection - Example: Entry Fee: 10,000 RWF, Capacity: 100 people) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                3. Entry Fee &amp; Capacity
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Entry Fee Configuration */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    Entry Fee *
                  </label>

                  {/* Free vs Paid Toggle */}
                  <div className="flex items-center p-1 rounded-xl bg-white border border-slate-300 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, feeType: 'Free', entryFee: 0 })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        formData.feeType === 'Paid'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Paid
                    </button>
                  </div>
                </div>

                {formData.feeType === 'Paid' ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Custom Amount</label>
                      <input
                        type="number"
                        min={500}
                        step={500}
                        value={formData.entryFee}
                        onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                        placeholder="10000"
                        className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Currency</label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 font-bold outline-none cursor-pointer"
                      >
                        <option value="RWF">RWF</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    <div className="col-span-2 pt-1">
                      <span className="inline-block text-xs font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        Entry Fee: {formData.entryFee.toLocaleString()} {formData.currency}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-emerald-700 font-bold py-2">
                    ✓ This event is free admission for all participants.
                  </div>
                )}
              </div>

              {/* Maximum Capacity */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-900">
                  Maximum Capacity *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={50000}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold outline-none"
                  />
                  <span className="text-xs text-slate-500 font-bold shrink-0">People</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Example: <span className="font-semibold text-slate-700">Capacity: 100 people</span>
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 4: EVENT IMAGE UPLOAD (Requirements check: Upload Event Image button, Upload directly from user's device, Image preview, Replace/remove, Supported formats: JPG, PNG, WEBP, Recommended dimensions displayed) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                4. Event Image / Poster Upload
              </h3>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {/* Upload Area / Preview */}
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 sm:p-10 text-center bg-slate-50/50 hover:bg-emerald-50/20 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-400 group-hover:text-emerald-600 group-hover:border-emerald-300 flex items-center justify-center mx-auto shadow-xs transition-colors">
                  <Upload className="w-6 h-6" />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Event Image</span>
                  </button>
                  <p className="text-xs text-slate-600 mt-2 font-medium">
                    Upload directly from your device, or drag and drop your poster here
                  </p>
                </div>

                {/* Requirements info banner */}
                <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700">
                    Supported formats: <span className="font-bold text-slate-900">JPG, PNG, WEBP</span> (Max 5MB)
                  </div>
                  <div className="text-emerald-700 font-semibold bg-emerald-50/80 inline-block px-2.5 py-0.5 rounded border border-emerald-200">
                    Recommended dimensions: 1200 x 675 px (16:9 aspect ratio)
                  </div>
                </div>
              </div>
            ) : (
              /* Image Preview Card */
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-bold text-slate-900 truncate max-w-xs">{imageFileName || 'Uploaded Event Poster'}</span>
                    {imageFileSize && <span className="text-slate-400 font-medium">({imageFileSize})</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Replace Image Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>

                    {/* Remove Image Button */}
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 transition-colors cursor-pointer"
                      title="Remove Image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* High Quality Preview Box */}
                <div className="relative rounded-2xl overflow-hidden h-56 sm:h-72 bg-black border border-slate-200">
                  <img
                    src={imagePreview}
                    alt="Event Poster Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    Poster Preview (16:9)
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Image ready for review. Make sure all text and headline artists are legible on mobile and desktop.
                </p>
              </div>
            )}

            {imageError && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{imageError}</span>
              </p>
            )}

            {/* Poster Presets Option */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Or pick from sample event posters:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {POSTER_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: SUBMIT EVENT ACTIONS (Requirements check: Save as Draft | Submit for Approval) */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              Cancel
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3 flex-wrap">
              {/* Save as Draft */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('Draft')}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4 text-slate-500" />
                <span>Save as Draft</span>
              </button>

              {/* Submit for Approval */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit('Pending Approval')}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit for Approval'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
