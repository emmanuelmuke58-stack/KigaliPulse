import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Lock,
  User,
  Sliders,
  CheckCircle2,
  Database,
  RefreshCw,
  Key,
  Globe,
  Clock,
  Sparkles,
  Save,
} from 'lucide-react';
import {
  GeneralSettingsState,
  SecuritySettingsState,
  NotificationSettingsState,
  SystemSettingsState,
  EnterpriseUser,
} from '../../types/admin';
import {
  DEFAULT_GENERAL_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_SYSTEM_SETTINGS,
  ROLE_PERMISSIONS_MATRIX,
} from '../../data/adminMockData';

import { useFontSize } from '../../contexts/FontSizeContext';

interface AdminSettingsProps {
  currentUser: EnterpriseUser;
  onUpdateCurrentUser: (user: EnterpriseUser) => void;
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onTriggerToast,
}) => {
  const { fontSize, preset, setFontSize, setPreset, resetToDefault, savePreferences } = useFontSize();

  // Active sub-section tab
  const [activeSection, setActiveSection] = useState<
    'general' | 'account' | 'security' | 'notifications' | 'roles' | 'system' | 'font'
  >('general');

  // Form states
  const [general, setGeneral] = useState<GeneralSettingsState>(DEFAULT_GENERAL_SETTINGS);
  const [security, setSecurity] = useState<SecuritySettingsState>(DEFAULT_SECURITY_SETTINGS);
  const [notifications, setNotifications] = useState<NotificationSettingsState>(
    DEFAULT_NOTIFICATION_SETTINGS
  );
  const [system, setSystem] = useState<SystemSettingsState>(DEFAULT_SYSTEM_SETTINGS);

  // Account form state
  const [accountForm, setAccountForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    avatar: currentUser.avatar,
    department: currentUser.department || 'Executive Operations',
  });

  // Password change state
  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Save handler
  const handleSave = (sectionName: string) => {
    if (sectionName === 'Account') {
      onUpdateCurrentUser({
        ...currentUser,
        name: accountForm.name,
        email: accountForm.email,
        phone: accountForm.phone,
        avatar: accountForm.avatar,
        department: accountForm.department,
      });
    }

    onTriggerToast('success', `${sectionName} Settings Saved`, 'Your configuration has been updated successfully.');
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      onTriggerToast('error', 'Password Required', 'Please enter your current and new password.');
      return;
    }
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      onTriggerToast('error', 'Mismatch', 'New password and confirmation do not match.');
      return;
    }
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    onTriggerToast('success', 'Password Updated', 'Your administrative password was changed.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-emerald-600" />
          <span>Enterprise System Settings</span>
        </h2>
        <p className="text-base sm:text-base text-slate-600 mt-1">
          Configure multi-tenant security policies, notifications, branding, and role-based permissions.
        </p>
      </div>

      {/* 2. Secondary Settings Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-base">
        {[
          { id: 'general', label: 'General', icon: Sliders },
          { id: 'account', label: 'Account Profile', icon: User },
          { id: 'security', label: 'Security & 2FA', icon: Lock },
          { id: 'notifications', label: 'Notification Rules', icon: Bell },
          { id: 'font', label: 'Font Size', icon: Sparkles },
          { id: 'roles', label: 'Roles & Permissions', icon: Shield },
          { id: 'system', label: 'System & Maintenance', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. SECTION CONTENT */}

      {/* SECTION 1: GENERAL */}
      {activeSection === 'general' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900">General Application Settings</h3>
            <p className="text-base text-slate-600">Configure core platform naming, branding, and regional localization.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Application Name</label>
                <input
                  type="text"
                  value={general.appName}
                  onChange={(e) => setGeneral({ ...general, appName: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Company / Operating Entity</label>
                <input
                  type="text"
                  value={general.companyName}
                  onChange={(e) => setGeneral({ ...general, companyName: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Support Email</label>
                <input
                  type="email"
                  value={general.supportEmail}
                  onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Time Zone</label>
                <select
                  value={general.timeZone}
                  onChange={(e) => setGeneral({ ...general, timeZone: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="Africa/Kigali (GMT+02:00)">Africa/Kigali (GMT+02:00) Central Africa Time</option>
                  <option value="Africa/Nairobi (GMT+03:00)">Africa/Nairobi (GMT+03:00) East Africa Time</option>
                  <option value="UTC (GMT+00:00)">UTC (GMT+00:00)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Default Currency</label>
                <select
                  value={general.defaultCurrency}
                  onChange={(e) => setGeneral({ ...general, defaultCurrency: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="RWF (Rwandan Franc)">RWF (Rwandan Franc)</option>
                  <option value="USD (United States Dollar)">USD (United States Dollar)</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Date Format</label>
                <select
                  value={general.dateFormat}
                  onChange={(e) => setGeneral({ ...general, dateFormat: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="DD/MM/YYYY (24h)">DD/MM/YYYY (24h)</option>
                  <option value="YYYY-MM-DD (ISO)">YYYY-MM-DD (ISO)</option>
                  <option value="MM/DD/YYYY (12h)">MM/DD/YYYY (12h)</option>
                </select>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Language</label>
                <select
                  value={general.language}
                  onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3.5 py-2.5 text-base text-slate-700 outline-none cursor-pointer"
                >
                  <option value="English (UK / Rwanda)">English (UK / Rwanda)</option>
                  <option value="Kinyarwanda">Kinyarwanda</option>
                  <option value="French">Français</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('General')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save General Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: ACCOUNT */}
      {activeSection === 'account' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Administrator Account Details</h3>
            <p className="text-base text-slate-600">Manage your active identity credentials, contact channels, and avatar.</p>
          </div>

          <div className="flex items-center gap-5">
            <img
              src={accountForm.avatar}
              alt={accountForm.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-sm"
            />
            <div>
              <div className="text-base font-bold text-slate-900">Administrator Profile Photo</div>
              <p className="text-[15px] text-slate-500 mt-0.5">JPG, PNG or GIF up to 5MB</p>
              <button
                type="button"
                onClick={() => onTriggerToast('info', 'Photo Upload', 'Photo updated with default avatar.')}
                className="mt-2 text-base font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                Change Photo
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={accountForm.phone}
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={accountForm.department}
                  onChange={(e) => setAccountForm({ ...accountForm, department: e.target.value })}
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl px-3.5 py-2.5 text-base text-slate-900 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('Account')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: SECURITY */}
      {activeSection === 'security' && (
        <div className="space-y-6 max-w-4xl">
          {/* Change Password */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              <span>Change Account Password</span>
            </h3>

            <form onSubmit={handlePasswordSave} className="space-y-3 max-w-md">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  placeholder="Repeat new password"
                  className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-base font-bold text-white shadow-sm cursor-pointer"
              >
                Update Password
              </button>
            </form>
          </div>

          {/* 2FA & Session Controls */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Multi-Factor Authentication &amp; Sessions</span>
            </h3>

            <div className="space-y-4 text-base">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Require Two-Factor Authentication (2FA)</div>
                  <div className="text-slate-500 text-[15px]">Enforce hardware token or authenticator app for staff</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.requireTwoFactor}
                    onChange={(e) => setSecurity({ ...security, requireTwoFactor: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Login Security Alerts</div>
                  <div className="text-slate-500 text-[15px]">Receive instant notification on new device / IP logins</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={security.loginNotifications}
                    onChange={(e) => setSecurity({ ...security, loginNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="font-bold text-slate-900">Administrative Session Timeout</div>
                  <div className="text-slate-500 text-[15px]">Automatic lock after inactivity</div>
                </div>
                <select
                  value={security.sessionTimeoutMinutes}
                  onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 outline-none cursor-pointer"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: NOTIFICATIONS */}
      {activeSection === 'notifications' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
            <p className="text-base text-slate-600">Toggle administrative alerts across platform communication channels.</p>
          </div>

          <div className="space-y-3 text-base">
            {[
              {
                id: 'emailAlerts',
                title: 'Email Notifications',
                desc: 'Dispatch emergency and critical operational alerts directly to admin inbox',
                val: notifications.emailAlerts,
              },
              {
                id: 'systemPush',
                title: 'Real-time System Notifications',
                desc: 'Browser push notifications for instant approvals and moderation flags',
                val: notifications.systemPush,
              },
              {
                id: 'transactionAlerts',
                title: 'Financial Transaction Alerts',
                desc: 'Alerts on high volume ticket spikes, refunds, or payment gateway delays',
                val: notifications.transactionAlerts,
              },
              {
                id: 'securityBreachAlerts',
                title: 'Security & Failed Login Alerts',
                desc: 'Immediate escalation on multiple failed authentication attempts or suspicious IPs',
                val: notifications.securityBreachAlerts,
              },
              {
                id: 'weeklyExecutiveDigest',
                title: 'Weekly Executive Digest',
                desc: 'Comprehensive weekly PDF intelligence summary delivered every Monday at 08:00 CAT',
                val: notifications.weeklyExecutiveDigest,
              },
            ].map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <div>
                  <div className="font-bold text-slate-900">{item.title}</div>
                  <div className="text-slate-500 text-[15px] mt-0.5">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.val}
                    onChange={(e) =>
                      setNotifications({ ...notifications, [item.id]: e.target.checked } as any)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('Notifications')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Notification Rules</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION: FONT SIZE MANAGEMENT */}
      {activeSection === 'font' && (
        <FontSizeSettings onTriggerToast={onTriggerToast} />
      )}

      {/* SECTION 5: ROLES & PERMISSIONS MATRIX */}
      {activeSection === 'roles' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Roles &amp; Permissions Matrix</h3>
              <p className="text-base text-slate-600">Configured access-control privileges across all enterprise modules.</p>
            </div>
            <button
              type="button"
              onClick={() => onTriggerToast('info', 'Roles Config', 'Role permission changes synchronized.')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all shadow-sm cursor-pointer"
            >
              Sync Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-base">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-4 font-semibold">Role Name</th>
                  <th className="py-4 pr-4 font-semibold">Assigned Users</th>
                  <th className="py-4 pr-4 font-semibold text-center">View</th>
                  <th className="py-4 pr-4 font-semibold text-center">Create</th>
                  <th className="py-4 pr-4 font-semibold text-center">Edit</th>
                  <th className="py-4 pr-4 font-semibold text-center">Delete</th>
                  <th className="py-4 pr-4 font-semibold text-center">Export</th>
                  <th className="py-4 pr-4 font-semibold text-center">Approve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ROLE_PERMISSIONS_MATRIX.map((item) => (
                  <tr key={item.role} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.role}</div>
                      <div className="text-[15px] text-slate-500 max-w-xs">{item.description}</div>
                    </td>
                    <td className="py-4 pr-4 font-bold text-emerald-700 tabular-nums">
                      {item.userCount} accounts
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.view ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.view ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.create ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.create ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.edit ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.edit ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.delete ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.delete ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.export ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.export ? '✓' : '—'}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-center">
                      <span className={item.permissions.approve ? 'text-emerald-700 font-bold' : 'text-slate-300'}>
                        {item.permissions.approve ? '✓' : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 6: SYSTEM & MAINTENANCE */}
      {activeSection === 'system' && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl shadow-xs">
          <div>
            <h3 className="text-lg font-bold text-slate-900">System Infrastructure &amp; Maintenance</h3>
            <p className="text-base text-slate-600">Emergency controls, database backups, and maintenance mode toggles.</p>
          </div>

          <div className="space-y-4 text-base">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div>
                <div className="font-bold text-slate-900">Platform Maintenance Mode</div>
                <div className="text-[15px] text-amber-800 mt-0.5">
                  Temporarily display maintenance screen to public users while keeping admin access live
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={system.maintenanceMode}
                  onChange={(e) => setSystem({ ...system, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">Relational Database Backup</div>
                <div className="text-[15px] text-slate-500 mt-0.5">
                  Last verified snapshot: {system.lastBackupDate}
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onTriggerToast('success', 'Backup Initiated', 'PostgreSQL cloud snapshot triggered successfully.')
                }
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                <span>Create Backup Now</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="button"
              onClick={() => handleSave('System')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
