import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Download,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  Ban,
  CheckCircle2,
  Eye,
  X,
  Upload,
  Shield,
  Building,
  Mail,
  Phone,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { EnterpriseUser, AdminRole, UserStatus } from '../../types/admin';

interface AdminUsersManagementProps {
  users: EnterpriseUser[];
  onAddUser: (user: Partial<EnterpriseUser>) => void;
  onEditUser: (user: EnterpriseUser) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string, status: UserStatus) => void;
  onViewUserDetails: (user: EnterpriseUser) => void;
  onExportUsers: () => void;
}

export const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  users,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onViewUserDetails,
  onExportUsers,
}) => {
  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');

  // Selection state for bulk actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Action menu dropdown state
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<EnterpriseUser | null>(null);

  // Form states for Add/Edit User
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Event Organizer' as AdminRole,
    organization: 'Kigali Independent Organizers',
    status: 'Active' as UserStatus,
    password: '',
    confirmPassword: '',
    bio: '',
    department: 'Operations',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Filtered users calculation
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm) ||
        u.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesOrg = organizationFilter === 'all' || u.organization === organizationFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesOrg;
    });
  }, [users, searchTerm, statusFilter, roleFilter, organizationFilter]);

  // Paginated records
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [filteredUsers, currentPage, rowsPerPage]);

  // Unique organizations list
  const uniqueOrganizations = useMemo(() => {
    return Array.from(new Set(users.map((u) => u.organization)));
  }, [users]);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(paginatedUsers.map((u) => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Open Edit Modal
  const handleOpenEdit = (user: EnterpriseUser) => {
    setOpenActionMenuId(null);
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      organization: user.organization,
      status: user.status,
      password: '',
      confirmPassword: '',
      bio: user.bio || '',
      department: user.department || 'Operations',
      avatar: user.avatar,
    });
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setFormError(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'Event Organizer',
      organization: 'Kigali Independent Organizers',
      status: 'Active',
      password: '',
      confirmPassword: '',
      bio: '',
      department: 'Operations',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    });
    setIsAddModalOpen(true);
  };

  // Submit Add User
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('First Name and Last Name are required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('A valid corporate email address is required.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError('Password and Confirm Password do not match.');
      return;
    }

    onAddUser({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '+250 788 000 000',
      role: formData.role,
      organization: formData.organization,
      status: formData.status,
      avatar: formData.avatar,
      bio: formData.bio,
      department: formData.department,
      dateCreated: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
    });

    setIsAddModalOpen(false);
  };

  // Submit Edit User
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setFormError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('First Name and Last Name are required.');
      return;
    }

    onEditUser({
      ...editingUser,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      organization: formData.organization,
      status: formData.status,
      bio: formData.bio,
      department: formData.department,
    });

    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header (Title, description, Add User, Export) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-600" />
            <span>Users Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Maintain identity records, role permissions, organization affiliations, and security states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportUsers}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email, phone, or organization..."
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Moderator">Moderator</option>
              <option value="Venue Manager">Venue Manager</option>
              <option value="Event Organizer">Event Organizer</option>
              <option value="Standard User">Standard User</option>
            </select>
          </div>

          {/* Organization Filter */}
          <div>
            <select
              value={organizationFilter}
              onChange={(e) => {
                setOrganizationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-white border border-slate-300 focus:border-emerald-600 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none cursor-pointer truncate"
            >
              <option value="all">All Organizations</option>
              {uniqueOrganizations.map((org) => (
                <option key={org} value={org}>
                  {org}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters & Active Filter Count */}
        {(searchTerm || statusFilter !== 'all' || roleFilter !== 'all' || organizationFilter !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <span>
              Showing {filteredUsers.length} matching user{filteredUsers.length === 1 ? '' : 's'}
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setRoleFilter('all');
                setOrganizationFilter('all');
              }}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* 3. Bulk Actions Toolbar (when rows selected) */}
      {selectedUserIds.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 px-5 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-bold">{selectedUserIds.length} user(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                selectedUserIds.forEach((id) => onToggleStatus(id, 'Active'));
                setSelectedUserIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-bold text-white transition-colors"
            >
              Bulk Activate
            </button>
            <button
              type="button"
              onClick={() => {
                selectedUserIds.forEach((id) => onToggleStatus(id, 'Suspended'));
                setSelectedUserIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 font-bold text-white transition-colors"
            >
              Bulk Suspend
            </button>
            <button
              type="button"
              onClick={() => {
                selectedUserIds.forEach((id) => onDeleteUser(id));
                setSelectedUserIds([]);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 font-bold text-white transition-colors"
            >
              Bulk Delete
            </button>
          </div>
        </div>
      )}

      {/* 4. Users Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedUsers.length > 0 &&
                      paginatedUsers.every((u) => selectedUserIds.includes(u.id))
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="py-4 pr-4 font-semibold">User</th>
                <th className="py-4 pr-4 font-semibold">Email</th>
                <th className="py-4 pr-4 font-semibold">Phone</th>
                <th className="py-4 pr-4 font-semibold">Role</th>
                <th className="py-4 pr-4 font-semibold">Organization</th>
                <th className="py-4 pr-4 font-semibold">Status</th>
                <th className="py-4 pr-4 font-semibold">Last Login</th>
                <th className="py-4 pr-4 font-semibold">Created</th>
                <th className="py-4 pr-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-bold text-sm text-slate-900">No Users Found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      There are no users matching your current filters or search terms.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenAdd}
                      className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Add New User</span>
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                  if (user.status === 'Pending') statusBadge = 'bg-amber-50 text-amber-700 border-amber-200';
                  if (user.status === 'Suspended') statusBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                  if (user.status === 'Inactive') statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';

                  let roleBadge = 'bg-slate-100 text-slate-700 border border-slate-200';
                  if (user.role === 'Super Admin') roleBadge = 'bg-purple-50 text-purple-700 border border-purple-200';
                  if (user.role === 'Admin') roleBadge = 'bg-sky-50 text-sky-700 border border-sky-200';
                  if (user.role === 'Moderator') roleBadge = 'bg-blue-50 text-blue-700 border border-blue-200';

                  const isChecked = selectedUserIds.includes(user.id);

                  return (
                    <tr
                      key={user.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isChecked ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(user.id)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      <td className="py-4 pr-4">
                        <div
                          onClick={() => onViewUserDetails(user)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate max-w-[140px]">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600 font-medium truncate max-w-[160px]">
                        {user.email}
                      </td>

                      <td className="py-4 pr-4 text-slate-500 tabular-nums">
                        {user.phone}
                      </td>

                      <td className="py-4 pr-4">
                        <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${roleBadge}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-4 pr-4 text-slate-700 font-medium truncate max-w-[150px]">
                        {user.organization}
                      </td>

                      <td className="py-4 pr-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                          {user.status}
                        </span>
                      </td>

                      <td className="py-4 pr-4 text-slate-500 tabular-nums">
                        {user.lastLogin}
                      </td>

                      <td className="py-4 pr-4 text-slate-500 tabular-nums">
                        {user.dateCreated}
                      </td>

                      {/* Three-dot Action Menu */}
                      <td className="py-4 pr-4 text-right relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionMenuId(openActionMenuId === user.id ? null : user.id)
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {/* Dropdown popup */}
                        {openActionMenuId === user.id && (
                          <div className="absolute right-4 mt-1 w-44 bg-white border border-slate-200 rounded-xl p-1 shadow-xl z-30 text-left animate-in fade-in zoom-in-95">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                onViewUserDetails(user);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleOpenEdit(user)}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>Edit User</span>
                            </button>

                            {user.status === 'Suspended' ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  onToggleStatus(user.id, 'Active');
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Activate</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionMenuId(null);
                                  onToggleStatus(user.id, 'Suspended');
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                              >
                                <Ban className="w-3.5 h-3.5 text-amber-600" />
                                <span>Suspend</span>
                              </button>
                            )}

                            <div className="my-1 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionMenuId(null);
                                onDeleteUser(user.id);
                              }}
                              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete User</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-700 outline-none shadow-2xs"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{' '}
              {Math.min(currentPage * rowsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors text-slate-700 shadow-2xs cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-900">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors text-slate-700 shadow-2xs cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
                  <p className="text-xs text-slate-500">Create an authenticated enterprise account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Patrick"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Gasana"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="patrick.g@organization.rw"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+250 788 000 000"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Venue Manager">Venue Manager</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Standard User">Standard User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Organization *</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. BK Arena Operations"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-600"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white transition-all shadow-md shadow-emerald-600/20"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit User: {editingUser.name}</h3>
                  <p className="text-xs text-slate-500">Modify role permissions and identity details</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Venue Manager">Venue Manager</option>
                    <option value="Event Organizer">Event Organizer</option>
                    <option value="Standard User">Standard User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 outline-none focus:border-emerald-600"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white transition-all shadow-md shadow-emerald-600/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
