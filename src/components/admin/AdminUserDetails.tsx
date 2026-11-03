import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Calendar,
  Clock,
  Shield,
  ShieldAlert,
  Key,
  Ban,
  CheckCircle2,
  Trash2,
  Edit2,
  Laptop,
  Smartphone,
  Globe,
  Receipt,
  History,
  Activity,
  UserCheck,
} from 'lucide-react';
import { EnterpriseUser, EnterpriseTransaction, EnterpriseActivityLog } from '../../types/admin';

interface AdminUserDetailsProps {
  user: EnterpriseUser;
  transactions: EnterpriseTransaction[];
  activityLogs: EnterpriseActivityLog[];
  onBack: () => void;
  onEditUser: (user: EnterpriseUser) => void;
  onToggleStatus: (userId: string, status: any) => void;
  onDeleteUser: (userId: string) => void;
  onResetPassword: (user: EnterpriseUser) => void;
}

export const AdminUserDetails: React.FC<AdminUserDetailsProps> = ({
  user,
  transactions,
  activityLogs,
  onBack,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onResetPassword,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'transactions' | 'security'>('overview');

  // Filter transactions and logs belonging to this user
  const userTransactions = transactions.filter(
    (tx) => tx.userEmail.toLowerCase() === user.email.toLowerCase() || tx.userName.toLowerCase() === user.name.toLowerCase()
  );

  const userLogs = activityLogs.filter(
    (log) => log.userEmail.toLowerCase() === user.email.toLowerCase() || log.userName.toLowerCase() === user.name.toLowerCase()
  );

  // Status badges
  let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (user.status === 'Pending') statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
  if (user.status === 'Suspended') statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
  if (user.status === 'Inactive') statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <div className="space-y-6">
      {/* 1. Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-base font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onEditUser(user)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit User</span>
          </button>

          {user.status === 'Suspended' ? (
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, 'Active')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-base font-bold text-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, 'Suspended')}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-base font-bold text-amber-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Suspend Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onResetPassword(user)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-base font-bold text-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteUser(user.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-base font-bold text-rose-700 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete User</span>
          </button>
        </div>
      </div>

      {/* 2. User Hero Profile Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-md"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-base font-bold border ${statusBadge}`}>
                {user.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-base font-bold border border-purple-200">
                {user.role}
              </span>
            </div>

            <p className="text-base sm:text-base text-slate-600 max-w-2xl leading-relaxed">
              {user.bio || 'Platform contributor registered on KigaliPulse.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-base text-slate-600 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.organization}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {user.dateCreated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-100 text-base overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Activity Logs ({userLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Transactions ({userTransactions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Security &amp; Sessions
          </button>
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      {/* TAB A: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">Identity &amp; Organizational Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-0.5">Full Name</span>
                  <span className="font-bold text-slate-900 text-base">{user.name}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-0.5">Official Role</span>
                  <span className="font-bold text-emerald-700 text-base">{user.role}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-0.5">Department / Division</span>
                  <span className="font-bold text-slate-900 text-base">{user.department || 'Operations'}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 font-semibold block mb-0.5">Assigned Organization</span>
                  <span className="font-bold text-slate-900 text-base">{user.organization}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">Permissions Summary</h3>
              <p className="text-base text-slate-600">
                Granted based on enterprise role specification:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-base pt-1">
                {['View Data', 'Create Records', 'Edit Content', 'Approve Submissions', 'Export Reports', 'Delete Records'].map((perm) => (
                  <div key={perm} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-800 font-medium">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-slate-900">Access Metadata</h3>
              <div className="space-y-3 text-base">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Account ID</span>
                  <span className="font-mono text-slate-800 font-bold">{user.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Registration Date</span>
                  <span className="text-slate-800 font-medium">{user.dateCreated}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Last Active Session</span>
                  <span className="text-emerald-700 font-bold">{user.lastLogin}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Two-Factor Authentication</span>
                  <span className={user.twoFactorEnabled ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: ACTIVITY HISTORY */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Administrative Activity Audit</h3>
          {userLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <History className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-slate-900 text-base">No Activity Recorded Yet</p>
              <p className="text-base text-slate-500 mt-1">This user has not performed administrative actions recently.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-base"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[14px] text-slate-700 font-semibold border border-slate-200">
                        {log.module}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug">{log.description}</p>
                    <div className="text-[15px] text-slate-500 flex items-center gap-3">
                      <span>IP: {log.ipAddress}</span>
                      <span>Device: {log.device}</span>
                    </div>
                  </div>
                  <span className="text-slate-500 tabular-nums shrink-0 font-medium">{log.dateTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-base text-slate-900">Associated Orders &amp; Financial Transactions</h3>
          {userTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <Receipt className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-slate-900 text-base">No Transactions Found</p>
              <p className="text-base text-slate-500 mt-1">No ticket orders or financial payouts associated with this identity.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-base">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                    <th className="pb-3 pr-4 font-semibold">Date</th>
                    <th className="pb-3 pr-4 font-semibold">ID</th>
                    <th className="pb-3 pr-4 font-semibold">Type</th>
                    <th className="pb-3 pr-4 font-semibold">Amount</th>
                    <th className="pb-3 pr-4 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80">
                      <td className="py-3 pr-4 text-slate-600 tabular-nums font-medium">{tx.date}</td>
                      <td className="py-3 pr-4 font-mono font-bold text-emerald-700">{tx.transactionId}</td>
                      <td className="py-3 pr-4 text-slate-700">{tx.transactionType}</td>
                      <td className="py-3 pr-4 font-bold text-slate-900 tabular-nums">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>
                      <td className="py-3 pr-4 text-slate-600">{tx.paymentMethod}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[14px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB D: SECURITY & SESSIONS */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-slate-900">Active Device Sessions</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-base">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>MacBook Pro 16" (Kigali, RW)</span>
                      <span className="text-[14px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                        Current Session
                      </span>
                    </div>
                    <div className="text-[15px] text-slate-500">Chrome 129 · IP: 197.243.18.94</div>
                  </div>
                </div>
                <span className="text-emerald-700 font-bold">Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-base">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">iPhone 15 Pro (Kigali, RW)</div>
                    <div className="text-[15px] text-slate-500">Safari Mobile · IP: 105.178.60.188</div>
                  </div>
                </div>
                <span className="text-slate-500 font-medium">Yesterday</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-slate-900">Security Controls</h3>
            <div className="space-y-3 text-base">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900">Force Password Reset</div>
                  <div className="text-[15px] text-slate-500">Requires user to set a new credential upon next login</div>
                </div>
                <button
                  type="button"
                  onClick={() => onResetPassword(user)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white shrink-0 cursor-pointer shadow-2xs"
                >
                  Send Reset Link
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900">Revoke All Active Sessions</div>
                  <div className="text-[15px] text-slate-500">Immediately logs out user across all mobile &amp; web devices</div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 font-bold text-white shrink-0 cursor-pointer shadow-2xs"
                >
                  Revoke Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
