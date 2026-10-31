import React, { useState } from 'react';
import {
  User,
  X,
  Mail,
  Phone,
  Bookmark,
  Bell,
  Sliders,
  ShieldCheck,
  CheckCircle,
  Building,
  Heart,
  Save,
} from 'lucide-react';
import { UserProfile, EventCategory } from '../types';
import { CATEGORIES, KIGALI_NEIGHBORHOODS, ORGANIZERS } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onOpenSavedDrawer: () => void;
  onOpenOrganizerPortal: () => void;
  onOpenAdminPortal: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onOpenSavedDrawer,
  onOpenOrganizerPortal,
  onOpenAdminPortal,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [role, setRole] = useState(currentUser.role);
  const [selectedCats, setSelectedCats] = useState<EventCategory[]>(currentUser.preferredCategories);
  const [selectedHoods, setSelectedHoods] = useState<string[]>(currentUser.preferredNeighborhoods);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleToggleCat = (catId: EventCategory) => {
    setSelectedCats((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const handleToggleHood = (hoodName: string) => {
    setSelectedHoods((prev) =>
      prev.includes(hoodName) ? prev.filter((h) => h !== hoodName) : [...prev, hoodName]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...currentUser,
      name,
      email,
      phone,
      role,
      preferredCategories: selectedCats,
      preferredNeighborhoods: selectedHoods,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 md:p-6"
    >
      <div className="relative bg-white sm:rounded-3xl max-w-2xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto shadow-2xl border-t sm:border border-slate-200 text-slate-800 animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between pt-[calc(1rem+env(safe-area-inset-top))] sm:pt-6">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <h2 className="font-bold text-lg text-slate-900">{currentUser.name}</h2>
              <span className="text-xs text-slate-500 font-medium capitalize">
                Kigali Member · {role}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Switching Shortcuts */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold w-full mb-1">Quick Links</span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSavedDrawer();
            }}
            className="min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            Saved ({currentUser.savedEventIds.length})
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenOrganizerPortal();
            }}
            className="min-h-[44px] px-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            Organizer Hub
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAdminPortal();
            }}
            className="min-h-[44px] px-4 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            Admin Panel
          </button>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="p-6 space-y-8 text-xs pb-[calc(6rem+env(safe-area-inset-bottom))]">
          
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Phone (MTN/Airtel)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Active Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full min-h-[48px] px-4 rounded-xl border border-slate-200 bg-slate-50 font-semibold cursor-pointer focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                >
                  <option value="attendee">Attendee / Visitor</option>
                  <option value="organizer">Event Organizer</option>
                  <option value="admin">Platform Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferred Categories */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Event Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isChecked = selectedCats.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCat(cat.id)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preferred Neighborhoods */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Kigali Locations
            </h3>
            <div className="flex flex-wrap gap-2">
              {KIGALI_NEIGHBORHOODS.map((hood) => {
                const isChecked = selectedHoods.includes(hood.name);
                return (
                  <button
                    key={hood.name}
                    type="button"
                    onClick={() => handleToggleHood(hood.name)}
                    className={`min-h-[44px] px-4 py-2 rounded-xl border text-xs font-bold transition-all active:scale-[0.98] ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {hood.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Floating Save Button on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 sm:relative sm:p-0 sm:bg-transparent sm:border-0 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-0 z-30">
            <div className="max-w-2xl mx-auto flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                  <CheckCircle className="w-4 h-4" /> Profile Updated!
                </span>
              ) : (
                <span className="hidden sm:inline text-slate-400">Manage your Kigali experience</span>
              )}
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[48px] px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 mt-8">
            <button
              type="button"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.reload();
              }}
              className="w-full py-4 text-red-600 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all active:scale-[0.98] border border-red-100"
            >
              Sign Out from KigaliPulse
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export const NotificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  onMarkAllAsRead: () => void;
}> = ({ isOpen, onClose, notifications, onMarkAllAsRead }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Notifications</h3>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-800">
            ✕
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                notif.read ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-emerald-50/50 border-emerald-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold">{notif.title}</h4>
                <span className="text-[10px] text-slate-400">{notif.time}</span>
              </div>
              <p className="text-slate-600">{notif.message}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t flex justify-between items-center text-xs">
          <button type="button" onClick={onMarkAllAsRead} className="text-emerald-700 font-semibold hover:underline">
            Mark all as read
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
