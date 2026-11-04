import React from 'react';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Lock,
  LogOut,
  Edit2,
  Key,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EnterpriseUser } from '../../types/admin';

interface AdminProfileProps {
  currentUser: EnterpriseUser;
  onNavigateTab: (tab: any) => void;
  onLogoutClick: () => void;
}

export const AdminProfile: React.FC<AdminProfileProps> = ({
  currentUser,
  onNavigateTab,
  onLogoutClick,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-400" />
          <span>Administrator Profile</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your personal executive credentials, multi-factor tokens, and session audit trail.
        </p>
      </div>

      {/* 2. Profile Overview Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                {currentUser.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {currentUser.bio || 'Chief Executive Administrator & Platform Architect leading digital ecosystem expansion.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{currentUser.organization}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons: Edit Profile, Change Password, Manage Security, Logout */}
        <div className="pt-6 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-blue-400" />
              <span>Change Password</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>Manage Security &amp; 2FA</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onLogoutClick}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3. Account Metadata Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white">Platform Credentials &amp; Verification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Administrative Role</span>
            <span className="font-bold text-emerald-400 text-sm">{currentUser.role}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Last Authentication Timestamp</span>
            <span className="font-bold text-white text-sm">{currentUser.lastLogin}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Assigned Department</span>
            <span className="font-bold text-white text-sm">{currentUser.department || 'Executive Operations'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block mb-1">Two-Factor Authentication</span>
            <span className="font-bold text-emerald-400 text-sm">Hardware Token Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
