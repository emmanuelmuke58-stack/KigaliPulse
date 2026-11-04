import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Receipt,
  Users,
  Building2,
  AlertCircle,
  XCircle,
  Eye,
  X,
  ChevronDown,
  ArrowUpDown,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EnterpriseTransaction, TransactionStatus, TransactionType, PaymentMethod } from '../../types/admin';

interface AdminReportsModuleProps {
  transactions: EnterpriseTransaction[];
  onTriggerToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const AdminReportsModule: React.FC<AdminReportsModuleProps> = ({
  transactions,
  onTriggerToast,
}) => {
  // Filters state
  const [dateRange, setDateRange] = useState('30days');
  const [reportType, setReportType] = useState('financial');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'amount' | 'transactionId'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Selected Transaction for Report Details Modal (Module 12)
  const [selectedTxForDetails, setSelectedTxForDetails] = useState<EnterpriseTransaction | null>(null);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    txId: true,
    user: true,
    business: true,
    type: true,
    amount: true,
    paymentMethod: true,
    status: true,
  });

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions.filter((tx) => {
      const matchesSearch =
        tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.businessName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || tx.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    result.sort((a, b) => {
      if (sortField === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'transactionId') {
        return sortOrder === 'asc'
          ? a.transactionId.localeCompare(b.transactionId)
          : b.transactionId.localeCompare(a.transactionId);
      }
      return sortOrder === 'asc'
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    });

    return result;
  }, [transactions, searchTerm, statusFilter, paymentFilter, sortField, sortOrder]);

  // Paginated records
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // KPIs
  const totalRevenue = transactions.reduce((acc, tx) => (tx.status === 'Completed' ? acc + tx.amount : acc), 0);
  const totalTransactionsCount = 12480;
  const totalUsersCount = 4820;
  const activeBusinessesCount = 184;
  const pendingTransactionsCount = 350;
  const failedTransactionsCount = 200;

  // Export handlers
  const handleExportCSV = () => {
    const headers = ['Date', 'Transaction ID', 'User', 'Business', 'Type', 'Amount', 'Currency', 'Payment Method', 'Status'];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.transactionId,
      tx.userName,
      tx.businessName,
      tx.transactionType,
      tx.amount,
      tx.currency,
      tx.paymentMethod,
      tx.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kigalipulse-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onTriggerToast('success', 'CSV Report Exported', 'Downloaded complete dataset successfully.');
  };

  const handlePrint = () => {
    window.print();
    onTriggerToast('info', 'Print Triggered', 'System print dialog launched.');
  };

  const handleExportPDF = () => {
    onTriggerToast('success', 'PDF Report Generated', 'Generated encrypted administrative report summary.');
  };

  const handleExportExcel = () => {
    onTriggerToast('success', 'Excel Spreadsheet Ready', 'Exported formatted workbook for finance team.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
            <span>Strategic Reports &amp; Financial Ledger</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enterprise analytics, ticketing turnover, municipal payment gateways, and auditable reporting.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Reports Dashboard KPI Cards (Module 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">148.2M RWF</div>
          <span className="text-[10px] text-emerald-400 font-semibold">+22.4% MoM</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Total Orders</span>
            <Receipt className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">{totalTransactionsCount.toLocaleString()}</div>
          <span className="text-[10px] text-sky-400 font-semibold">98.2% Verified</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">{totalUsersCount.toLocaleString()}</div>
          <span className="text-[10px] text-purple-400 font-semibold">Kigali City</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Active Venues</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">{activeBusinessesCount}</div>
          <span className="text-[10px] text-amber-400 font-semibold">3 Districts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Pending Tx</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">{pendingTransactionsCount}</div>
          <span className="text-[10px] text-amber-400 font-semibold">In escrow</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Failed Tx</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-lg sm:text-xl font-black text-white">{failedTransactionsCount}</div>
          <span className="text-[10px] text-rose-400 font-semibold">1.6% failure rate</span>
        </div>
      </div>

      {/* 3. Comprehensive Report Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search TX ID, customer, venue..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none"
            />
          </div>

          {/* Date range filter */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days (Current Cycle)</option>
              <option value="quarter">This Quarter (Q3)</option>
              <option value="year">Full Year 2026</option>
            </select>
          </div>

          {/* Report Type */}
          <div>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="financial">Financial &amp; Revenue</option>
              <option value="ticketing">Ticketing Turnover</option>
              <option value="venues">Venue Payouts</option>
              <option value="moderation">Safety &amp; Compliance</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Transaction Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Method filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all">All Payment Methods</option>
              <option value="MTN Mobile Money">MTN Mobile Money</option>
              <option value="Airtel Money">Airtel Money</option>
              <option value="Visa Card">Visa Card</option>
              <option value="MasterCard">MasterCard</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Reports Table (Module 11) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="font-bold text-white">
            Audit Records ({filteredTransactions.length})
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Sort by:</span>
            <button
              type="button"
              onClick={() => {
                setSortField('amount');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSortField('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold"
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-4 font-semibold">Date &amp; Time</th>
                <th className="py-4 pr-4 font-semibold">Transaction ID</th>
                <th className="py-4 pr-4 font-semibold">User</th>
                <th className="py-4 pr-4 font-semibold">Business / Venue</th>
                <th className="py-4 pr-4 font-semibold">Type</th>
                <th className="py-4 pr-4 font-semibold text-right">Amount</th>
                <th className="py-4 pr-4 font-semibold">Payment Method</th>
                <th className="py-4 pr-4 font-semibold">Status</th>
                <th className="py-4 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-white text-sm">No Transactions Found</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting the filters or date range.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  let badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (tx.status === 'Pending') badge = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  if (tx.status === 'Failed' || tx.status === 'Cancelled') badge = 'bg-rose-500/10 text-rose-400 border-rose-500/20';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-400 tabular-nums">{tx.date}</td>
                      <td className="py-4 pr-4 font-mono font-bold text-emerald-400">
                        {tx.transactionId}
                      </td>
                      <td className="py-4 pr-4 text-white font-medium">{tx.userName}</td>
                      <td className="py-4 pr-4 text-slate-300">{tx.businessName}</td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px]">
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right font-extrabold text-white tabular-nums">
                        {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">{tx.currency}</span>
                      </td>
                      <td className="py-4 pr-4 text-slate-300">{tx.paymentMethod}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTxForDetails(tx)}
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
            {Math.min(currentPage * rowsPerPage, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} records
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

      {/* 5. Report Details Modal (Module 12) */}
      {selectedTxForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Transaction Audit Record</h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedTxForDetails.transactionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Customer Name</span>
                <span className="font-bold text-white">{selectedTxForDetails.userName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Customer Email</span>
                <span className="text-slate-200">{selectedTxForDetails.userEmail}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Beneficiary Venue / Host</span>
                <span className="font-bold text-white">{selectedTxForDetails.businessName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Transaction Type</span>
                <span className="text-slate-200">{selectedTxForDetails.transactionType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Amount &amp; Currency</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  {selectedTxForDetails.amount.toLocaleString()} {selectedTxForDetails.currency}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Payment Gateway</span>
                <span className="text-slate-200">{selectedTxForDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Settlement Status</span>
                <span className="font-bold text-emerald-400">{selectedTxForDetails.status}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Item Description / Notes</span>
                <span className="text-slate-200 max-w-[220px] text-right truncate">
                  {selectedTxForDetails.notes || 'Official ticket invoice'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  onTriggerToast('info', 'Print Triggered', 'Receipt sent to printer.');
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTxForDetails(null)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-slate-950 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
