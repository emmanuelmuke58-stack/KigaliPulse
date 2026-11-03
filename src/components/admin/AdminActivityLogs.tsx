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
    link.setAttribute('download', `kigalipulse-activity-${new Date().toISOString().slice(0, 10)}.csv`);
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
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" />
            <span>Activity Logs &amp; Audit Trail</span>
          </h2>
          <p className="text-base sm:text-base text-slate-600 mt-1">
            Immutable administrative event trail for compliance, security audits, and permission verification.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Audit Logs</span>
        </button>
      </div>

      {/* 2. Filters */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user, action, description, IP..."
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          <div>
            <select
              value={moduleFilter}
              onChange={(e) => {
                setModuleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
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
            <tbody className="divide-y divide-slate-100">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 text-base">No Activity Records Found</p>
                    <p className="text-base text-slate-500 mt-1">Try clearing or adjusting your search filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  let badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (log.status === 'Active') badge = 'bg-sky-50 text-sky-700 border-sky-200';
                  if (log.status === 'Pending') badge = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (log.status === 'Failed' || log.status === 'Cancelled') badge = 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-500 tabular-nums whitespace-nowrap">{log.dateTime}</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={log.userAvatar}
                            alt={log.userName}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-lg object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{log.userName}</div>
                            <div className="text-[14px] text-slate-500 font-medium">{log.userRole}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 pr-4 font-bold text-slate-900 whitespace-nowrap">{log.action}</td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[14px]">
                          {log.module}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-slate-600 max-w-xs truncate font-medium">{log.description}</td>
                      <td className="py-4 pr-4 text-slate-500 text-[15px] whitespace-nowrap">
                        <div className="font-mono text-slate-700">{log.ipAddress}</div>
                        <div className="text-slate-400 text-[14px]">{log.device}</div>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[14px] font-bold border ${badge}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedLogForDetails(log)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-base font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-base text-slate-600 font-medium">
          <div>
            Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
            {Math.min(currentPage * rowsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer shadow-2xs font-semibold"
            >
              Previous
            </button>
            <span className="font-bold text-slate-900">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-700 cursor-pointer shadow-2xs font-semibold"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      {selectedLogForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Audit Event Details</h3>
                  <p className="text-base text-slate-500 font-mono">{selectedLogForDetails.id}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-base">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Timestamp</span>
                <span className="text-slate-900 font-bold">{selectedLogForDetails.dateTime}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Operator</span>
                <span className="text-slate-900 font-bold">{selectedLogForDetails.userName} ({selectedLogForDetails.userRole})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Action Type</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedLogForDetails.action}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Target Module</span>
                <span className="text-slate-800 font-semibold">{selectedLogForDetails.module}</span>
              </div>
              <div className="py-1.5 border-b border-slate-100">
                <span className="text-slate-500 block mb-1 font-medium">Full Description</span>
                <span className="text-slate-800 leading-relaxed block font-normal">{selectedLogForDetails.description}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Source IP &amp; Geolocation</span>
                <span className="text-slate-800 font-mono font-medium">{selectedLogForDetails.ipAddress}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Client Agent / Device</span>
                <span className="text-slate-800 font-medium">{selectedLogForDetails.device}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLogForDetails(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
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
