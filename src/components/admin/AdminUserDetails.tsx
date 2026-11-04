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
  let statusBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  if (user.status === 'Pending') statusBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  if (user.status === 'Suspended') statusBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  if (user.status === 'Inactive') statusBadge = 'bg-slate-700/50 text-slate-400 border-slate-700';

  return (
    <div className="space-y-6">
      {/* 1. Back Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onEditUser(user)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit User</span>
          </button>

          {user.status === 'Suspended' ? (
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, 'Active')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Activate Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onToggleStatus(user.id, 'Suspended')}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold text-amber-400 transition-all flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Suspend Account</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onResetPassword(user)}
            className="px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-400 transition-all flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Reset Password</span>
          </button>

          <button
            type="button"
            onClick={() => onDeleteUser(user.id)}
            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete User</span>
          </button>
        </div>
      </div>

      {/* 2. User Hero Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
          />

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {user.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadge}`}>
                {user.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                {user.role}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              {user.bio || 'Platform contributor registered on KigaliPulse.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.organization}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joined {user.dateCreated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation: Overview | Activity | Transactions | Security */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-800 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Activity Logs ({userLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Transactions ({userTransactions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-emerald-600 text-slate-950 shadow-md shadow-emerald-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base text-white">Identity &amp; Organizational Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Full Name</span>
                  <span className="font-bold text-white text-sm">{user.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Official Role</span>
                  <span className="font-bold text-emerald-400 text-sm">{user.role}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Department / Division</span>
                  <span className="font-bold text-white text-sm">{user.department || 'Operations'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Assigned Organization</span>
                  <span className="font-bold text-white text-sm">{user.organization}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-base text-white">Permissions Summary</h3>
              <p className="text-xs text-slate-400">
                Granted based on enterprise role specification:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs pt-1">
                {['View Data', 'Create Records', 'Edit Content', 'Approve Submissions', 'Export Reports', 'Delete Records'].map((perm, idx) => (
                  <div key={perm} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-200">{perm}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-base text-white">Access Metadata</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Account ID</span>
                  <span className="font-mono text-slate-200">{user.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Registration Date</span>
                  <span className="text-slate-200">{user.dateCreated}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800/80">
                  <span className="text-slate-400">Last Active Session</span>
                  <span className="text-emerald-400 font-semibold">{user.lastLogin}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400">Two-Factor Authentication</span>
                  <span className={user.twoFactorEnabled ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base text-white">Administrative Activity Audit</h3>
          {userLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <History className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="font-bold text-white text-sm">No Activity Recorded Yet</p>
              <p className="text-xs text-slate-500 mt-1">This user has not performed administrative actions recently.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-semibold">
                        {log.module}
                      </span>
                    </div>
                    <p className="text-slate-400 leading-snug">{log.description}</p>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>IP: {log.ipAddress}</span>
                      <span>Device: {log.device}</span>
                    </div>
                  </div>
                  <span className="text-slate-400 tabular-nums shrink-0">{log.dateTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB C: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-base text-white">Associated Orders &amp; Financial Transactions</h3>
          {userTransactions.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Receipt className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="font-bold text-white text-sm">No Transactions Found</p>
              <p className="text-xs text-slate-500 mt-1">No ticket orders or financial payouts associated with this identity.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Payment</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {userTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-800/40">
                      <td className="py-3 text-slate-300 tabular-nums">{tx.date}</td>
                      <td className="py-3 font-mono font-bold text-emerald-400">{tx.transactionId}</td>
                      <td className="py-3 text-slate-300">{tx.transactionType}</td>
                      <td className="py-3 font-bold text-white tabular-nums">
                        {tx.amount.toLocaleString()} {tx.currency}
                      </td>
                      <td className="py-3 text-slate-400">{tx.paymentMethod}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-base text-white">Active Device Sessions</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>MacBook Pro 16" (Kigali, RW)</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        Current Session
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Chrome 129 · IP: 197.243.18.94</div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold">Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white">iPhone 15 Pro (Kigali, RW)</div>
                    <div className="text-[11px] text-slate-400">Safari Mobile · IP: 105.178.60.188</div>
                  </div>
                </div>
                <span className="text-slate-400">Yesterday</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-base text-white">Security Controls</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Force Password Reset</div>
                  <div className="text-[11px] text-slate-400">Requires user to set a new credential upon next login</div>
                </div>
                <button
                  type="button"
                  onClick={() => onResetPassword(user)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 font-bold text-white"
                >
                  Send Reset Link
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Revoke All Active Sessions</div>
                  <div className="text-[11px] text-slate-400">Immediately logs out user across all mobile &amp; web devices</div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-white"
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
