import React, { useState, useMemo } from 'react';
import {
  History,
  Download,
  Search,
  Filter,
  Eye,
  X,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { EnterpriseActivityLog } from '../../types/admin';

interface AdminActivityLogsProps {
  logs: EnterpriseActivityLog[];
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminActivityLogs: React.FC<AdminActivityLogsProps> = ({
  logs,
  onTriggerToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLogForDetails, setSelectedLogForDetails] = useState<EnterpriseActivityLog | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm);

      const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

      return matchesSearch && matchesModule && matchesStatus;
    });
  }, [logs, searchTerm, moduleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleExport = () => {
    const headers = ['Date & Time', 'User', 'Role', 'Action', 'Module', 'Description', 'IP Address', 'Device', 'Status'];
    const rows = filteredLogs.map((l) => [
      l.dateTime,
      l.userName,
      l.userRole,
      l.action,
      l.module,
      `"${l.description.replace(/"/g, '""')}"`,
      l.ipAddress,
      l.device,
      l.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kigalipulse-audit-logs-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast('success', 'Audit Logs Exported', 'Downloaded complete activity trail as CSV.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Activity Logs &amp; Audit Trail</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable administrative event trail for compliance, security audits, and permission verification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export Audit Logs</span>
        </button>
      </div>

      {/* 2. Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user, action, description, IP..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Modules</option>
              <option value="Users">Users</option>
              <option value="Events">Events</option>
              <option value="Finance">Finance</option>
              <option value="Settings">Settings</option>
              <option value="Security">Security</option>
              <option value="Moderation">Moderation</option>
              <option value="System">System</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Date &amp; Time</th>
                <th className="py-4 pr-4 font-semibold">User</th>
                <th className="py-4 pr-4 font-semibold">Action</th>
                <th className="py-4 pr-4 font-semibold">Module</th>
                <th className="py-4 pr-4 font-semibold">Description</th>
                <th className="py-4 pr-4 font-semibold">IP / Device</th>
                <th className="py-4 pr-4 font-semibold">Status</th>
                <th className="py-4 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No Activity Records Found</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing or adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  let badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (log.status === 'Active') badge = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                  if (log.status === 'Pending') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (log.status === 'Failed' || log.status === 'Cancelled') badge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400 tabular-nums whitespace-nowrap">{log.dateTime}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={log.userAvatar}
                            alt={log.userName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white">{log.userName}</div>
                            <div className="text-[10px] text-slate-400">{log.userRole}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-semibold text-white whitespace-nowrap">{log.action}</td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-300 max-w-xs truncate">{log.description}</td>
                      <td className="py-4 pr-4 text-slate-400 text-[11px] whitespace-nowrap">
                        <div>{log.ipAddress}</div>
                        <div className="text-slate-500 text-[10px]">{log.device}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLogForDetails(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              Previous
            </button>
            <span className="font-semibold text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Audit Event Details</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedLogForDetails.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Timestamp</span>
                <span className="text-white font-medium">{selectedLogForDetails.dateTime}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Operator</span>
                <span className="text-white font-bold">{selectedLogForDetails.userName} ({selectedLogForDetails.userRole})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Action Type</span>
                <span className="text-emerald-400 font-semibold">{selectedLogForDetails.action}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Target Module</span>
                <span className="text-slate-200">{selectedLogForDetails.module}</span>
              </div>
              <div className="py-1.5 border-b border-slate-800">
                <span className="text-slate-400 block mb-1">Full Description</span>
                <span className="text-slate-200 leading-relaxed block">{selectedLogForDetails.description}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Source IP &amp; Geolocation</span>
                <span className="text-slate-200 font-mono">{selectedLogForDetails.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Client Agent / Device</span>
                <span className="text-slate-200">{selectedLogForDetails.device}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-slate-950 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
