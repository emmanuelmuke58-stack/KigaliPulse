import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
  Check,
  X,
  Edit2,
  Trash2,
  Share2,
  Globe,
  Upload,
  Calendar,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Users,
  Tag,
  ArrowRight,
  MoreVertical,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { EventSubmission, SubmissionStatus } from '../../types/admin';
import { INITIAL_EVENT_SUBMISSIONS } from '../../data/adminMockData';
import { getStoredEvents, saveStoredEvents, convertSubmissionToEventItem } from '../../services/eventStore';
import { EventItem, EventCategory } from '../../types';

interface AdminEventSubmissionsProps {
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  onSelectBusinessView?: () => void;
}

export const AdminEventSubmissions: React.FC<AdminEventSubmissionsProps> = ({
  onTriggerToast,
  onSelectBusinessView,
}) => {
  // Persistent Event Submissions State
  const [submissions, setSubmissions] = useState<EventSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('kigali_event_submissions');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EVENT_SUBMISSIONS;
  });

  // Save submissions to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('kigali_event_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | SubmissionStatus>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modals State
  const [reviewingSubmission, setReviewingSubmission] = useState<EventSubmission | null>(null);
  const [requestChangesSubmission, setRequestChangesSubmission] = useState<EventSubmission | null>(null);
  const [changesNotes, setChangesNotes] = useState('');
  const [editingSubmission, setEditingSubmission] = useState<EventSubmission | null>(null);
  const [deleteConfirmSubmission, setDeleteConfirmSubmission] = useState<EventSubmission | null>(null);

  // Edit Submission Form State
  const [editFormData, setEditFormData] = useState({
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

  // Format date helper: converts "2026-09-30" -> "Sep 30"
  const formatShortDate = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Status Badge Class
  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'Pending Approval':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Approved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Published':
        return 'bg-sky-50 text-sky-800 border-sky-300 font-bold';
      case 'Changes Requested':
        return 'bg-purple-50 text-purple-800 border-purple-300 font-bold';
      case 'Rejected':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300 font-semibold';
    }
  };

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.organizerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || sub.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [submissions, searchTerm, statusFilter]);

  // Submissions Counts & Metrics
  const stats = useMemo(() => {
    const total = submissions.length;
    const pending = submissions.filter((s) => s.status === 'Pending Approval').length;
    const approved = submissions.filter((s) => s.status === 'Approved').length;
    const published = submissions.filter((s) => s.status === 'Published').length;
    const changesRequested = submissions.filter((s) => s.status === 'Changes Requested').length;
    const rejected = submissions.filter((s) => s.status === 'Rejected').length;
    const drafts = submissions.filter((s) => s.status === 'Draft').length;

    return { total, pending, approved, published, changesRequested, rejected, drafts };
  }, [submissions]);

  // Action: Open Review Modal
  const handleOpenReview = (submission: EventSubmission) => {
    setActiveMenuId(null);
    setReviewingSubmission(submission);
  };

  // Action: Approve (Direct on Events Pages)
  const handleApprove = (submission: EventSubmission) => {
    setActiveMenuId(null);
    const updated = submissions.map((s) => {
      if (s.id === submission.id) {
        return {
          ...s,
          status: 'Approved' as SubmissionStatus,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'SuperAdmin Jean-Paul',
        };
      }
      return s;
    });
    setSubmissions(updated);

    if (reviewingSubmission?.id === submission.id) {
      setReviewingSubmission({
        ...reviewingSubmission,
        status: 'Approved',
        reviewedAt: new Date().toISOString().split('T')[0],
        reviewedBy: 'SuperAdmin Jean-Paul',
      });
    }

    // DIRECT ON EVENTS PAGES: sync immediately to public events store
    try {
      const publicEvent = convertSubmissionToEventItem({
        ...submission,
        status: 'Approved',
      });
      const stored = getStoredEvents();
      const updatedPublicEvents = [publicEvent, ...stored.filter((e) => e.id !== publicEvent.id)];
      saveStoredEvents(updatedPublicEvents);
    } catch (err) {
      console.error('Failed to sync approved event direct to events page', err);
    }

    onTriggerToast(
      'success',
      'Event Approved & Direct on Events Pages!',
      `"${submission.name}" is approved and immediately live on all public events pages.`
    );
  };

  // Action: Reject
  const handleReject = (submission: EventSubmission) => {
    setActiveMenuId(null);
    const updated = submissions.map((s) => {
      if (s.id === submission.id) {
        return {
          ...s,
          status: 'Rejected' as SubmissionStatus,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'SuperAdmin Jean-Paul',
        };
      }
      return s;
    });
    setSubmissions(updated);

    if (reviewingSubmission?.id === submission.id) {
      setReviewingSubmission({
        ...reviewingSubmission,
        status: 'Rejected',
        reviewedAt: new Date().toISOString().split('T')[0],
        reviewedBy: 'SuperAdmin Jean-Paul',
      });
    }

    // Remove from public events pages if it was previously approved/published
    try {
      const pubId = `pub-${submission.id}`;
      const stored = getStoredEvents();
      if (stored.some((e) => e.id === pubId)) {
        saveStoredEvents(stored.filter((e) => e.id !== pubId));
      }
    } catch (err) {
      console.error('Failed to remove rejected event from events pages', err);
    }

    onTriggerToast('error', 'Event Rejected', `"${submission.name}" proposal has been rejected.`);
  };

  // Action: Open Request Changes Modal
  const handleOpenRequestChanges = (submission: EventSubmission) => {
    setActiveMenuId(null);
    setRequestChangesSubmission(submission);
    setChangesNotes(submission.adminReviewNotes || '');
  };

  // Action: Submit Request Changes
  const handleConfirmRequestChanges = () => {
    if (!requestChangesSubmission) return;
    const notes = changesNotes.trim() || 'Please revise event details or image and re-submit.';
    const updated = submissions.map((s) => {
      if (s.id === requestChangesSubmission.id) {
        return {
          ...s,
          status: 'Changes Requested' as SubmissionStatus,
          adminReviewNotes: notes,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'SuperAdmin Jean-Paul',
        };
      }
      return s;
    });
    setSubmissions(updated);

    if (reviewingSubmission?.id === requestChangesSubmission.id) {
      setReviewingSubmission({
        ...reviewingSubmission,
        status: 'Changes Requested',
        adminReviewNotes: notes,
        reviewedAt: new Date().toISOString().split('T')[0],
        reviewedBy: 'SuperAdmin Jean-Paul',
      });
    }

    setRequestChangesSubmission(null);
    setChangesNotes('');

    // Remove from public events pages if it was previously approved/published
    try {
      const pubId = `pub-${requestChangesSubmission.id}`;
      const stored = getStoredEvents();
      if (stored.some((e) => e.id === pubId)) {
        saveStoredEvents(stored.filter((e) => e.id !== pubId));
      }
    } catch (err) {
      console.error('Failed to remove event from events pages:', err);
    }

    onTriggerToast(
      'warning',
      'Changes Requested',
      `Revision feedback sent to ${requestChangesSubmission.organizerName}.`
    );
  };

  // Action: Open Edit Submission Modal
  const handleOpenEdit = (submission: EventSubmission) => {
    setActiveMenuId(null);
    setEditingSubmission(submission);
    setEditFormData({
      name: submission.name,
      description: submission.description,
      category: submission.category,
      date: submission.date,
      startTime: submission.startTime,
      endTime: submission.endTime,
      location: submission.location,
      organizerName: submission.organizerName,
      organizerEmail: submission.organizerEmail,
      organizerPhone: submission.organizerPhone,
      feeType: submission.feeType,
      entryFee: submission.entryFee,
      currency: submission.currency || 'RWF',
      maxCapacity: submission.maxCapacity,
    });
  };

  // Action: Save Edited Submission
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubmission) return;

    const updated = submissions.map((s) => {
      if (s.id === editingSubmission.id) {
        const updatedSub: EventSubmission = {
          ...s,
          name: editFormData.name.trim(),
          description: editFormData.description.trim(),
          category: editFormData.category,
          date: editFormData.date,
          startTime: editFormData.startTime,
          endTime: editFormData.endTime,
          location: editFormData.location.trim(),
          organizerName: editFormData.organizerName.trim(),
          organizerEmail: editFormData.organizerEmail.trim(),
          organizerPhone: editFormData.organizerPhone.trim(),
          feeType: editFormData.feeType,
          entryFee: editFormData.feeType === 'Free' ? 0 : Number(editFormData.entryFee),
          currency: editFormData.currency,
          maxCapacity: Number(editFormData.maxCapacity),
        };
        if (reviewingSubmission?.id === s.id) {
          setReviewingSubmission(updatedSub);
        }

        // If currently approved or published, keep public events page in sync
        if (s.status === 'Approved' || s.status === 'Published') {
          try {
            const publicEvent = convertSubmissionToEventItem(updatedSub);
            const stored = getStoredEvents();
            saveStoredEvents([publicEvent, ...stored.filter((ev) => ev.id !== publicEvent.id)]);
          } catch (err) {
            console.error('Failed to sync edited event to public events pages:', err);
          }
        }

        return updatedSub;
      }
      return s;
    });

    setSubmissions(updated);
    setEditingSubmission(null);
    onTriggerToast('success', 'Submission Updated', `Changes to "${editFormData.name}" saved successfully.`);
  };

  // Action: Delete Submission
  const handleConfirmDelete = () => {
    if (!deleteConfirmSubmission) return;
    const name = deleteConfirmSubmission.name;
    const subId = deleteConfirmSubmission.id;
    setSubmissions((prev) => prev.filter((s) => s.id !== subId));
    if (reviewingSubmission?.id === subId) {
      setReviewingSubmission(null);
    }
    setDeleteConfirmSubmission(null);

    // Remove from public events pages if present
    try {
      const pubId = `pub-${subId}`;
      const stored = getStoredEvents();
      if (stored.some((e) => e.id === pubId)) {
        saveStoredEvents(stored.filter((e) => e.id !== pubId));
      }
    } catch (err) {
      console.error('Failed to remove deleted event from events pages:', err);
    }

    onTriggerToast('info', 'Submission Deleted', `"${name}" proposal has been removed.`);
  };

  // Action: Publish Approved Event to Public Site
  const handlePublishToPublic = (submission: EventSubmission) => {
    setActiveMenuId(null);

    // 1. Mark as Published in submissions
    const updated = submissions.map((s) => {
      if (s.id === submission.id) {
        return {
          ...s,
          status: 'Published' as SubmissionStatus,
          reviewedAt: new Date().toISOString().split('T')[0],
          reviewedBy: 'SuperAdmin Jean-Paul',
        };
      }
      return s;
    });
    setSubmissions(updated);

    if (reviewingSubmission?.id === submission.id) {
      setReviewingSubmission({
        ...reviewingSubmission,
        status: 'Published',
        reviewedAt: new Date().toISOString().split('T')[0],
        reviewedBy: 'SuperAdmin Jean-Paul',
      });
    }

    // 2. Map category string to valid EventCategory
    const categoryMap: Record<string, EventCategory> = {
      'Technology & Startups': 'tech',
      'Tech & Innovation': 'tech',
      'Music & Concerts': 'music',
      'Music & Entertainment': 'music',
      'Food & Cultural': 'food',
      'Arts & Fashion': 'arts',
      'Sports & Athletics': 'sports',
      'Business & Finance': 'business',
      'Community & Health': 'community',
    };

    const catCode: EventCategory = categoryMap[submission.category] || 'tech';

    // 3. Add to Public Stored Events
    const publicEvent: EventItem = {
      id: `pub-${submission.id}`,
      title: submission.name,
      slug: submission.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: submission.category,
      categoryCode: catCode,
      date: submission.date,
      displayDate: formatShortDate(submission.date),
      time: submission.startTime,
      endTime: submission.endTime,
      venue: submission.location,
      venueId: 'venue-partner-kigali',
      district: 'Gasabo',
      neighborhood: 'Kigali Citywide',
      address: submission.location,
      price: submission.feeType === 'Free' ? 0 : submission.entryFee,
      priceDisplay: submission.feeType === 'Free' ? 'Free Entry' : `${submission.entryFee.toLocaleString()} ${submission.currency}`,
      isFree: submission.feeType === 'Free',
      isFeatured: true,
      status: 'Published',
      image: submission.image,
      organizer: submission.organizerName,
      organizerId: 'org-visitor',
      description: submission.description,
      whatToExpect: ['Keynote presentation & discussion', 'Networking & community exchange', 'Q&A session with hosts'],
      schedule: [
        { time: submission.startTime, title: 'Registration & Welcome' },
        { time: '19:00', title: 'Main Program & Panel' },
        { time: submission.endTime, title: 'Networking & Adjournment' },
      ],
      performers: [],
      contactPhone: submission.organizerPhone,
      contactEmail: submission.organizerEmail,
      externalTicketUrl: '#',
      ticketProviderName: 'Direct Registration',
      lat: -1.9536,
      lng: 30.0605,
      views: 64,
      saves: 12,
      clicks: 22,
      createdAt: submission.submittedAt,
    };

    try {
      const stored = getStoredEvents();
      const updatedPublicEvents = [publicEvent, ...stored.filter((e) => e.id !== publicEvent.id)];
      saveStoredEvents(updatedPublicEvents);
    } catch (err) {
      console.error('Failed to sync to public events', err);
    }

    onTriggerToast(
      'success',
      'Event Published Live!',
      `"${submission.name}" is now live and published on the visitor/public Events page.`
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Approval Workflow Stepper */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0 shadow-2xs">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Event Submissions Approval
                </h3>
                {stats.pending > 0 && (
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    {stats.pending} Pending Review
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Review visitor-submitted events, examine uploaded event posters, verify details, and approve or publish live.
              </p>
            </div>
          </div>

          {onSelectBusinessView && (
            <button
              type="button"
              onClick={onSelectBusinessView}
              className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Back to Business Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Visual Approval Workflow Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 sm:p-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Approval Workflow
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
              Visitor creates event
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
              Uploads event image
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
              Submits for approval
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 font-bold shadow-2xs">
              Admin reviews
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
              Approve / Reject / Request Changes
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold shadow-2xs">
              Eligible for publishing
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="px-2.5 py-1 rounded-lg bg-sky-100 border border-sky-300 text-sky-900 font-bold shadow-2xs">
              Published on public Events page
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Submissions</span>
          <span className="text-xl font-black text-slate-900 tabular-nums">{stats.total}</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">All visitor proposals</span>
        </div>

        <div className="bg-white border border-amber-300 rounded-2xl p-4 shadow-xs bg-amber-50/40">
          <span className="text-[11px] font-bold text-amber-800 block">Pending Approval</span>
          <span className="text-xl font-black text-amber-900 tabular-nums">{stats.pending}</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">Requires evaluation</span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Approved</span>
          <span className="text-xl font-black text-emerald-700 tabular-nums">{stats.approved}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Eligible to publish</span>
        </div>

        <div className="bg-white border border-sky-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Published Live</span>
          <span className="text-xl font-black text-sky-700 tabular-nums">{stats.published}</span>
          <span className="text-[10px] text-sky-700 font-semibold block mt-0.5">On public Events page</span>
        </div>

        <div className="bg-white border border-purple-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Changes Requested</span>
          <span className="text-xl font-black text-purple-700 tabular-nums">{stats.changesRequested}</span>
          <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">Awaiting revisions</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Rejected</span>
          <span className="text-xl font-black text-rose-700 tabular-nums">{stats.rejected}</span>
          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">Unapproved proposals</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event name, organizer, email, or venue..."
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
            {(['All', 'Pending Approval', 'Approved', 'Published', 'Changes Requested', 'Rejected', 'Draft'] as const).map(
              (st) => {
                const isActive = statusFilter === st;
                const count =
                  st === 'All'
                    ? submissions.length
                    : submissions.filter((s) => s.status === st).length;

                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>{st === 'Pending Approval' ? 'Pending' : st}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* 4. Admin Event Submissions Table (Exactly as requested) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Entry Fee</th>
                <th className="py-3.5 px-4">Submitted</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No event submissions found</p>
                    <p className="text-xs text-slate-500 mt-1">Try changing your search terms or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isMenuOpen = activeMenuId === sub.id;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-default"
                    >
                      {/* 1. EVENT */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs group-hover:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors truncate max-w-xs">
                              {sub.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {sub.category}
                              </span>
                              <span className="text-[11px] text-slate-500 truncate max-w-[160px]">
                                {sub.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. ORGANIZER */}
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.organizerName}</span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                            {sub.organizerEmail}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{sub.organizerPhone}</span>
                        </div>
                      </td>

                      {/* 3. DATE */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-extrabold text-slate-900 block">
                          {formatShortDate(sub.date)}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {sub.startTime} - {sub.endTime}
                        </span>
                      </td>

                      {/* 4. ENTRY FEE */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {sub.feeType === 'Free' ? (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Free
                          </span>
                        ) : (
                          <div>
                            <span className="font-extrabold text-slate-900 block">
                              {sub.entryFee.toLocaleString()} {sub.currency}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Cap: {sub.maxCapacity} ppl
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 5. SUBMITTED */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-medium">
                        {formatShortDate(sub.submittedAt)}
                      </td>

                      {/* 6. STATUS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] px-2.5 py-1 rounded-md border inline-flex items-center gap-1 ${getStatusBadge(
                            sub.status
                          )}`}
                        >
                          {sub.status === 'Pending Approval' && <Clock className="w-3 h-3" />}
                          {sub.status === 'Approved' && <Check className="w-3 h-3 text-emerald-600" />}
                          {sub.status === 'Published' && <Globe className="w-3 h-3 text-sky-600" />}
                          {sub.status === 'Changes Requested' && <AlertTriangle className="w-3 h-3 text-purple-600" />}
                          {sub.status === 'Rejected' && <X className="w-3 h-3 text-rose-600" />}
                          <span>{sub.status}</span>
                        </span>
                      </td>

                      {/* 7. ACTIONS (View, Approve, Reject, Request Changes, Edit, Delete, Publish) */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 relative">
                          {/* Primary Review Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenReview(sub)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>

                          {/* Direct Live indicator if status is Approved or Published */}
                          {(sub.status === 'Approved' || sub.status === 'Published') && (
                            <span
                              title="Live directly on visitor events pages"
                              className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                            >
                              <Globe className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live on Events Page</span>
                            </span>
                          )}

                          {/* Quick Approve button if Pending (Direct on Events Pages) */}
                          {sub.status === 'Pending Approval' && (
                            <button
                              type="button"
                              onClick={() => handleApprove(sub)}
                              title="Approve & Direct on Events Pages"
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve Direct</span>
                            </button>
                          )}

                          {/* More Options Menu */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(isMenuOpen ? null : sub.id)}
                              aria-label="Action menu"
                              className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 z-30 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 text-left text-xs animate-in fade-in zoom-in-95 duration-100">
                                {/* View / Review */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(sub)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>View Details</span>
                                </button>

                                {/* Approve */}
                                {sub.status !== 'Approved' && sub.status !== 'Published' && (
                                  <button
                                    type="button"
                                    onClick={() => handleApprove(sub)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer font-semibold"
                                  >
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {/* Publish (if Approved) */}
                                {sub.status === 'Approved' && (
                                  <button
                                    type="button"
                                    onClick={() => handlePublishToPublic(sub)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer font-bold"
                                  >
                                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                                    <span>Publish Live</span>
                                  </button>
                                )}

                                {/* Request Changes */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenRequestChanges(sub)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-purple-700 hover:bg-purple-50 transition-colors cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Request Changes</span>
                                </button>

                                {/* Reject */}
                                {sub.status !== 'Rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => handleReject(sub)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5 text-rose-600" />
                                    <span>Reject</span>
                                  </button>
                                )}

                                {/* Edit */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(sub)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Edit</span>
                                </button>

                                <div className="my-1 border-t border-slate-100" />

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setDeleteConfirmSubmission(sub);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer font-semibold"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. REVIEW MODAL (Requirement: show uploaded event image, complete event details, organizer info, entry fee, capacity) */}
      {reviewingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-2xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Review Event Submission
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded border ${getStatusBadge(reviewingSubmission.status)}`}>
                      {reviewingSubmission.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Submitted on {formatShortDate(reviewingSubmission.submittedAt)} · ID: {reviewingSubmission.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReviewingSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workflow Progress Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                Approval Lifecycle Progression
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  reviewingSubmission.status === 'Draft' ? 'bg-amber-50 border-amber-300 font-bold text-amber-900' : 'bg-white border-slate-200 font-medium text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold">1. Draft</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  reviewingSubmission.status === 'Pending Approval' ? 'bg-amber-100 border-amber-400 font-bold text-amber-900 ring-2 ring-amber-400/20' : 'bg-white border-slate-200 font-medium text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold">2. Pending Approval</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  reviewingSubmission.status === 'Approved' ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900 ring-2 ring-emerald-400/20' : 'bg-white border-slate-200 font-medium text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold">3. Approved</span>
                </div>
                <div className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 ${
                  reviewingSubmission.status === 'Published' ? 'bg-sky-100 border-sky-400 font-bold text-sky-900 ring-2 ring-sky-400/20' : 'bg-white border-slate-200 font-medium text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold">4. Published Live</span>
                </div>
              </div>
            </div>

            {/* Uploaded Event Image (Prominently shown as requested) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Uploaded Event Poster / Image
              </label>
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 max-h-72 flex items-center justify-center shadow-xs">
                <img
                  src={reviewingSubmission.image}
                  alt={reviewingSubmission.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-lg border border-white/20 flex items-center gap-2">
                  <Upload className="w-3 h-3 text-emerald-400" />
                  <span>{reviewingSubmission.imageFileName || 'Uploaded device image'}</span>
                  {reviewingSubmission.imageFileSize && <span>· {reviewingSubmission.imageFileSize}</span>}
                </div>
              </div>
            </div>

            {/* Complete Event Details */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {reviewingSubmission.category}
                </span>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-2">
                  {reviewingSubmission.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-2 whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {reviewingSubmission.description}
                </p>
              </div>

              {/* Date, Time, Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Event Date &amp; Time</span>
                    <span className="font-extrabold text-slate-900">
                      {reviewingSubmission.date} · {reviewingSubmission.startTime} - {reviewingSubmission.endTime}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Location / Venue</span>
                    <span className="font-extrabold text-slate-900 truncate block">
                      {reviewingSubmission.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Entry Fee & Capacity Details (Requirement) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Entry Fee</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {reviewingSubmission.feeType === 'Free'
                        ? 'Free Admission'
                        : `${reviewingSubmission.entryFee.toLocaleString()} ${reviewingSubmission.currency}`}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
                  <Users className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Maximum Capacity</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                      {reviewingSubmission.maxCapacity} Attendees
                    </span>
                  </div>
                </div>
              </div>

              {/* Organizer Information (Requirement) */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Organizer Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Organizer Name</span>
                    <span className="font-bold text-slate-900">{reviewingSubmission.organizerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Email Address</span>
                    <a
                      href={`mailto:${reviewingSubmission.organizerEmail}`}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{reviewingSubmission.organizerEmail}</span>
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Phone Number</span>
                    <a
                      href={`tel:${reviewingSubmission.organizerPhone}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{reviewingSubmission.organizerPhone}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Previous Admin Review Notes (if Changes Requested) */}
              {reviewingSubmission.adminReviewNotes && (
                <div className="p-4 rounded-2xl border border-purple-200 bg-purple-50 text-xs space-y-1">
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
                    <span>Admin Feedback Notes:</span>
                  </span>
                  <p className="text-purple-800">{reviewingSubmission.adminReviewNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions Bar (Approve, Reject, Request Changes, Publish, Edit, Delete) */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const sub = reviewingSubmission;
                    setReviewingSubmission(null);
                    handleOpenEdit(sub);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const sub = reviewingSubmission;
                    setReviewingSubmission(null);
                    setDeleteConfirmSubmission(sub);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 text-xs font-semibold text-rose-600 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Request Changes */}
                <button
                  type="button"
                  onClick={() => {
                    const sub = reviewingSubmission;
                    setReviewingSubmission(null);
                    handleOpenRequestChanges(sub);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-purple-800 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-purple-700" />
                  <span>Request Changes</span>
                </button>

                {/* Reject */}
                {reviewingSubmission.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => handleReject(reviewingSubmission)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reject</span>
                  </button>
                )}

                {/* Approve Event: Direct on Events Pages */}
                {reviewingSubmission.status !== 'Approved' && reviewingSubmission.status !== 'Published' && (
                  <button
                    type="button"
                    onClick={() => handleApprove(reviewingSubmission)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Approve &amp; Put Direct on Events Pages</span>
                  </button>
                )}

                {/* Direct on Events Pages Status Indicator */}
                {(reviewingSubmission.status === 'Approved' || reviewingSubmission.status === 'Published') && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Direct Live on Public Events Pages</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REQUEST CHANGES MODAL */}
      {requestChangesSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Request Changes from Organizer</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  For event: <span className="font-bold text-slate-800">"{requestChangesSubmission.name}"</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Feedback Notes for Organizer *
              </label>
              <textarea
                rows={4}
                value={changesNotes}
                onChange={(e) => setChangesNotes(e.target.value)}
                placeholder="e.g. Please upload a higher resolution poster (min 1200x630px) and provide exact start and end times for the sessions..."
                className="w-full bg-white border border-slate-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-500 rounded-xl p-3 text-xs text-slate-900 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                These notes will be recorded on the submission and status updated to "Changes Requested".
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRequestChangesSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRequestChanges}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
              >
                Dispatch Feedback &amp; Request Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. EDIT SUBMISSION MODAL */}
      {editingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center shadow-2xs">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Edit Event Submission</h3>
                  <p className="text-xs text-slate-500">Admin direct edit before approval</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl p-3 text-xs text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Technology & Startups">Technology &amp; Startups</option>
                    <option value="Music & Concerts">Music &amp; Concerts</option>
                    <option value="Food & Cultural">Food &amp; Cultural</option>
                    <option value="Arts & Fashion">Arts &amp; Fashion</option>
                    <option value="Sports & Athletics">Sports &amp; Athletics</option>
                    <option value="Business & Finance">Business &amp; Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={editFormData.startTime}
                    onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={editFormData.endTime}
                    onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organizer Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.organizerName}
                    onChange={(e) => setEditFormData({ ...editFormData, organizerName: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organizer Email</label>
                  <input
                    type="email"
                    required
                    value={editFormData.organizerEmail}
                    onChange={(e) => setEditFormData({ ...editFormData, organizerEmail: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organizer Phone</label>
                  <input
                    type="text"
                    required
                    value={editFormData.organizerPhone}
                    onChange={(e) => setEditFormData({ ...editFormData, organizerPhone: e.target.value })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entry Fee Type</label>
                  <select
                    value={editFormData.feeType}
                    onChange={(e) => setEditFormData({ ...editFormData, feeType: e.target.value as 'Free' | 'Paid' })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="Paid">Paid Event</option>
                    <option value="Free">Free Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Entry Fee ({editFormData.currency})</label>
                  <input
                    type="number"
                    disabled={editFormData.feeType === 'Free'}
                    value={editFormData.entryFee}
                    onChange={(e) => setEditFormData({ ...editFormData, entryFee: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    value={editFormData.maxCapacity}
                    onChange={(e) => setEditFormData({ ...editFormData, maxCapacity: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingSubmission(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  Save Submission Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deleteConfirmSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Delete Event Submission</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Are you sure you want to permanently delete the submission{' '}
                  <span className="font-bold text-slate-900">"{deleteConfirmSubmission.name}"</span> submitted by{' '}
                  <span className="font-semibold text-slate-800">{deleteConfirmSubmission.organizerName}</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirmSubmission(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors shadow-2xs cursor-pointer"
              >
                Delete Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
