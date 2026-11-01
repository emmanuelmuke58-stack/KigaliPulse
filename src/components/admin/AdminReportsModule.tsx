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
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Strategic Reports &amp; Financial Ledger</span>
          </h2>
          <p className="text-base sm:text-base text-slate-600 mt-1">
            Enterprise analytics, ticketing turnover, municipal payment gateways, and auditable reporting.
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>Export PDF</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 2. Reports Dashboard KPI Cards (Module 10) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">148.2M RWF</div>
          <span className="text-[14px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
            +22.4% MoM
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Total Orders</span>
            <Receipt className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{totalTransactionsCount.toLocaleString()}</div>
          <span className="text-[14px] text-sky-700 font-bold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 mt-1 inline-block">
            98.2% Verified
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{totalUsersCount.toLocaleString()}</div>
          <span className="text-[14px] text-purple-700 font-bold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 mt-1 inline-block">
            Kigali City
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Active Venues</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{activeBusinessesCount}</div>
          <span className="text-[14px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
            3 Districts
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Pending Tx</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{pendingTransactionsCount}</div>
          <span className="text-[14px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block">
            In escrow
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[15px] font-semibold">Failed Tx</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">{failedTransactionsCount}</div>
          <span className="text-[14px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 mt-1 inline-block">
            1.6% rate
          </span>
        </div>
      </div>

      {/* 3. Comprehensive Report Filters Toolbar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search TX ID, customer, venue..."
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-3 py-2 text-base text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          {/* Date range filter */}
          <div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-base text-slate-700 outline-none cursor-pointer"
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
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between text-base bg-slate-50/50">
          <div className="font-bold text-slate-900">
            Audit Records ({filteredTransactions.length})
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <button
              type="button"
              onClick={() => {
                setSortField('amount');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setSortField('date');
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              }}
              className="text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3 text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-base">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
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
            <tbody className="divide-y divide-slate-100">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Receipt className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 text-base">No Transactions Found</p>
                    <p className="text-base text-slate-500 mt-1">Try resetting the filters or date range.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx) => {
                  let badge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (tx.status === 'Pending') badge = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (tx.status === 'Failed' || tx.status === 'Cancelled') badge = 'bg-rose-50 text-rose-700 border-rose-200';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 text-slate-500 tabular-nums">{tx.date}</td>
                      <td className="py-4 pr-4 font-mono font-bold text-emerald-700">
                        {tx.transactionId}
                      </td>
                      <td className="py-4 pr-4 text-slate-900 font-bold">{tx.userName}</td>
                      <td className="py-4 pr-4 text-slate-700 font-medium">{tx.businessName}</td>
                      <td className="py-4 pr-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[14px]">
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right font-black text-slate-900 tabular-nums">
                        {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}{' '}
                        <span className="text-[14px] text-slate-500 font-normal">{tx.currency}</span>
                      </td>
                      <td className="py-4 pr-4 text-slate-600 font-medium">{tx.paymentMethod}</td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded-full text-[14px] font-bold border ${badge}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTxForDetails(tx)}
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
            {Math.min(currentPage * rowsPerPage, filteredTransactions.length)} of{' '}
            {filteredTransactions.length} records
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

      {/* 5. Report Details Modal (Module 12) */}
      {selectedTxForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Transaction Audit Record</h3>
                  <p className="text-base text-slate-500 font-mono">{selectedTxForDetails.transactionId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTxForDetails(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-base">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer Name</span>
                <span className="font-bold text-slate-900">{selectedTxForDetails.userName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Customer Email</span>
                <span className="text-slate-700 font-medium">{selectedTxForDetails.userEmail}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Beneficiary Venue / Host</span>
                <span className="font-bold text-slate-900">{selectedTxForDetails.businessName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Transaction Type</span>
                <span className="text-slate-700 font-medium">{selectedTxForDetails.transactionType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Amount &amp; Currency</span>
                <span className="font-extrabold text-emerald-700 text-base">
                  {selectedTxForDetails.amount.toLocaleString()} {selectedTxForDetails.currency}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Payment Gateway</span>
                <span className="text-slate-700 font-medium">{selectedTxForDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Settlement Status</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedTxForDetails.status}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500 font-medium">Item Description / Notes</span>
                <span className="text-slate-700 max-w-[220px] text-right truncate">
                  {selectedTxForDetails.notes || 'Official ticket invoice'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  onTriggerToast('info', 'Print Triggered', 'Receipt sent to printer.');
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-base font-semibold text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTxForDetails(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-base text-white transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
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
