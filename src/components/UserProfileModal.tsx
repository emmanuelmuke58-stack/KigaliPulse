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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
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
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portal Switching Shortcuts */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs font-semibold gap-2 flex-wrap">
          <span className="text-slate-500">Quick Navigation:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSavedDrawer();
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-600 text-slate-700"
            >
              Saved Events ({currentUser.savedEventIds.length})
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenOrganizerPortal();
              }}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-emerald-600 text-slate-700"
            >
              Organizer Hub
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAdminPortal();
              }}
              className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
            >
              Admin Moderation
            </button>
          </div>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6 text-xs">
          
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone (MTN/Airtel)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Active Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold cursor-pointer"
                >
                  <option value="attendee">Attendee / Visitor</option>
                  <option value="organizer">Event Organizer</option>
                  <option value="admin">Platform Super Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preferred Categories */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Preferred Event Categories (Personalized recommendations)
            </h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isChecked = selectedCats.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleToggleCat(cat.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
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
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Frequent Kigali Neighborhoods
            </h3>
            <div className="flex flex-wrap gap-2">
              {KIGALI_NEIGHBORHOODS.map((hood) => {
                const isChecked = selectedHoods.includes(hood.name);
                return (
                  <button
                    key={hood.name}
                    type="button"
                    onClick={() => handleToggleHood(hood.name)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {hood.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Followed Hosts */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">
              Followed Organizers ({currentUser.followedOrganizerIds.length})
            </h3>
            <div className="flex items-center gap-3">
              {ORGANIZERS.filter((o) => currentUser.followedOrganizerIds.includes(o.id)).map((org) => (
                <div key={org.id} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border">
                  <img src={org.image} alt={org.name} className="w-6 h-6 rounded-lg object-cover" />
                  <span className="font-bold text-slate-800">{org.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t flex items-center justify-between">
            {savedSuccess && (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Preferences saved!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Updates</span>
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
