import React, { useState, useEffect } from 'react';
import {
  EnterpriseUser,
  EnterpriseTransaction,
  EnterpriseBusiness,
  EnterpriseActivityLog,
  EnterpriseNotification,
  UserStatus,
  ToastMessage,
} from '../../types/admin';
import {
  INITIAL_ADMIN_USERS,
  INITIAL_ADMIN_BUSINESSES,
  INITIAL_ADMIN_TRANSACTIONS,
  INITIAL_ADMIN_ACTIVITY_LOGS,
  INITIAL_ADMIN_NOTIFICATIONS,
} from '../../data/adminMockData';

import { AdminAuth } from './AdminAuth';
import { AdminSidebar, AdminNavigationTab } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { AdminDashboardOverview } from './AdminDashboardOverview';
import { AdminUsersManagement } from './AdminUsersManagement';
import { AdminUserDetails } from './AdminUserDetails';
import { AdminReportsModule } from './AdminReportsModule';
import { AdminBusinesses } from './AdminBusinesses';
import { AdminProductsInventory } from './AdminProductsInventory';
import { AdminSettings } from './AdminSettings';
import { AdminProfile } from './AdminProfile';
import { AdminNotifications } from './AdminNotifications';
import { AdminActivityLogs } from './AdminActivityLogs';
import { AdminConfirmModal } from './AdminConfirmModal';
import { AdminToast } from './AdminToast';
import { Search, X, Users, Receipt, Building2, History } from 'lucide-react';

interface AdminSystemProps {
  onExitToPublicSite: () => void;
}

export const AdminSystem: React.FC<AdminSystemProps> = ({ onExitToPublicSite }) => {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<EnterpriseUser | null>(null);

  // Initial session check on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setIsAuthChecking(false);
      }
    };
    checkSession();
  }, []);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<AdminNavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // 3. Drill-down details state
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<EnterpriseUser | null>(null);

  // 4. Data states
  const [users, setUsers] = useState<EnterpriseUser[]>(INITIAL_ADMIN_USERS);
  const [businesses, setBusinesses] = useState<EnterpriseBusiness[]>(INITIAL_ADMIN_BUSINESSES);
  const [transactions, setTransactions] = useState<EnterpriseTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [activityLogs, setActivityLogs] = useState<EnterpriseActivityLog[]>(INITIAL_ADMIN_ACTIVITY_LOGS);
  const [notifications, setNotifications] = useState<EnterpriseNotification[]>(() => {
    try {
      const saved = localStorage.getItem('kigali_admin_notifications');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADMIN_NOTIFICATIONS;
  });

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kigali_admin_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Listen for storage events (e.g. new visitor submission from another component/turn)
  useEffect(() => {
    const syncFromStorage = () => {
      try {
        const saved = localStorage.getItem('kigali_admin_notifications');
        if (saved) setNotifications(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', syncFromStorage);
    return () => window.removeEventListener('storage', syncFromStorage);
  }, []);

  // 5. Global Search Modal State
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 6. Confirmation Modals State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'primary';
    iconType: 'trash' | 'alert' | 'logout' | 'check';
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    variant: 'danger',
    iconType: 'alert',
    action: () => {},
  });

  // 7. Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message,
    };
    setToasts((prev) => [...prev, newToast]);

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Cmd+K / Ctrl+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Authentication handlers
  const handleLoginSuccess = (user: EnterpriseUser) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    addToast('success', 'Authenticated Successfully', `Welcome back, ${user.name}. Session token active.`);

    // Log the event
    const loginLog: EnterpriseActivityLog = {
      id: `log-${Date.now()}`,
      dateTime: 'Just now',
      userName: user.name,
      userEmail: user.email,
      userAvatar: user.avatar,
      userRole: user.role,
      action: 'Logged in',
      module: 'Security',
      description: 'Authenticated via enterprise credentials.',
      ipAddress: '197.243.18.94 (Kigali, Rwanda)',
      device: 'MacBook Pro · Chrome 129',
      status: 'Completed',
    };
    setActivityLogs((prev) => [loginLog, ...prev]);
  };

  const handleLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out of Admin Console?',
      message: 'Are you sure you want to end your administrative session? You will need to re-authenticate to access protected controls.',
      confirmLabel: 'Sign Out',
      variant: 'danger',
      iconType: 'logout',
      action: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (err) {
          console.error('Logout failed:', err);
        }
        setIsAuthenticated(false);
        setCurrentUser(null);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('info', 'Logged Out', 'You have been safely signed out.');
      },
    });
  };

  // User Management Actions
  const handleAddUser = (newUserData: Partial<EnterpriseUser>) => {
    const created: EnterpriseUser = {
      id: `usr-${users.length + 1}`,
      name: newUserData.name || 'New Staff User',
      firstName: newUserData.firstName || 'Staff',
      lastName: newUserData.lastName || 'User',
      email: newUserData.email || '',
      phone: newUserData.phone || '+250 788 000 000',
      role: newUserData.role || 'Event Organizer',
      organization: newUserData.organization || 'Kigali Partner Hub',
      status: newUserData.status || 'Active',
      avatar: newUserData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      lastLogin: 'Never',
      dateCreated: new Date().toISOString().split('T')[0],
      bio: newUserData.bio,
      department: newUserData.department,
    };

    setUsers((prev) => [created, ...prev]);

    if (!currentUser) return;

    // Log the audit event
    const newLog: EnterpriseActivityLog = {
      id: `log-${Date.now()}`,
      dateTime: 'Just now',
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      action: 'Created User',
      module: 'Users',
      description: `Created account for ${created.name} (${created.role}) at ${created.organization}.`,
      ipAddress: '197.243.18.94 (Kigali, Rwanda)',
      device: 'MacBook Pro · Chrome 129',
      status: 'Completed',
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    addToast('success', 'User Created Successfully', `${created.name} was added to the directory.`);
  };

  const handleEditUser = (updatedUser: EnterpriseUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (selectedUserForDetails && selectedUserForDetails.id === updatedUser.id) {
      setSelectedUserForDetails(updatedUser);
    }

    if (!currentUser) return;

    const editLog: EnterpriseActivityLog = {
      id: `log-${Date.now()}`,
      dateTime: 'Just now',
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      action: 'Updated User',
      module: 'Users',
      description: `Updated profile details and role for ${updatedUser.name}.`,
      ipAddress: '197.243.18.94 (Kigali, Rwanda)',
      device: 'MacBook Pro · Chrome 129',
      status: 'Completed',
    };
    setActivityLogs((prev) => [editLog, ...prev]);

    addToast('success', 'User Updated', `Changes to ${updatedUser.name} have been saved.`);
  };

  const handleDeleteUser = (userId: string) => {
    const targetUser = users.find((u) => u.id === userId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete User Account?',
      message: `Are you sure you want to permanently delete ${targetUser?.name || 'this user'}? This will revoke all permissions and cannot be undone.`,
      confirmLabel: 'Delete User',
      variant: 'danger',
      iconType: 'trash',
      action: () => {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        if (selectedUserForDetails && selectedUserForDetails.id === userId) {
          setSelectedUserForDetails(null);
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

        if (!currentUser) return;

        const delLog: EnterpriseActivityLog = {
          id: `log-${Date.now()}`,
          dateTime: 'Just now',
          userName: currentUser.name,
          userEmail: currentUser.email,
          userAvatar: currentUser.avatar,
          userRole: currentUser.role,
          action: 'Deleted User',
          module: 'Users',
          description: `Deleted account record for ${targetUser?.name || userId}.`,
          ipAddress: '197.243.18.94 (Kigali, Rwanda)',
          device: 'MacBook Pro · Chrome 129',
          status: 'Completed',
        };
        setActivityLogs((prev) => [delLog, ...prev]);

        addToast('success', 'User Deleted', 'Account has been removed.');
      },
    });
  };

  const handleToggleUserStatus = (userId: string, status: UserStatus) => {
    const targetUser = users.find((u) => u.id === userId);
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    if (selectedUserForDetails && selectedUserForDetails.id === userId) {
      setSelectedUserForDetails({ ...selectedUserForDetails, status });
    }

    if (!currentUser) return;

    const log: EnterpriseActivityLog = {
      id: `log-${Date.now()}`,
      dateTime: 'Just now',
      userName: currentUser.name,
      userEmail: currentUser.email,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      action: status === 'Suspended' ? 'Suspended Account' : 'Activated Account',
      module: 'Security',
      description: `Account status for ${targetUser?.name || userId} changed to ${status}.`,
      ipAddress: '197.243.18.94 (Kigali, Rwanda)',
      device: 'MacBook Pro · Chrome 129',
      status: 'Completed',
    };
    setActivityLogs((prev) => [log, ...prev]);

    addToast('success', `User ${status}`, `${targetUser?.name || 'Account'} is now ${status}.`);
  };

  const handleResetPassword = (user: EnterpriseUser) => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset User Password?',
      message: `Send an encrypted temporary password reset link to ${user.email}?`,
      confirmLabel: 'Send Reset Link',
      variant: 'primary',
      iconType: 'alert',
      action: () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('success', 'Reset Link Dispatched', `Recovery instructions sent to ${user.email}.`);
      },
    });
  };

  // Notification actions
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('info', 'All Caught Up', 'All notifications marked as read.');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // IF CHECKING AUTH -> RENDER LOADING SPINNER
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Verifying Security Session...</p>
        </div>
      </div>
    );
  }

  // IF NOT AUTHENTICATED -> RENDER AUTH SCREENS (Login, Forgot, Reset, etc.)
  if (!isAuthenticated || !currentUser) {
    return (
      <AdminAuth
        onLoginSuccess={handleLoginSuccess}
        onExitToPublic={onExitToPublicSite}
      />
    );
  }

  // Search Results inside Global Search Modal
  const searchResultsUsers = searchQuery.trim()
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const searchResultsTransactions = searchQuery.trim()
    ? transactions.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const searchResultsBusinesses = searchQuery.trim()
    ? businesses.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col lg:flex-row antialiased w-full max-w-full overflow-x-hidden">
      {/* 1. Desktop & Mobile Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setSelectedUserForDetails(null);
          setActiveTab(tab);
        }}
        unreadNotificationsCount={unreadCount}
        totalUsersCount={users.length}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogoutClick={handleLogoutClick}
        onExitToPublic={onExitToPublicSite}
      />

      {/* 2. Main Content Wrapper */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 w-full max-w-full overflow-x-hidden ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navigation */}
        <AdminTopNav
          currentUser={currentUser}
          activeTab={activeTab}
          unreadCount={unreadCount}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onSelectTab={(tab) => {
            setSelectedUserForDetails(null);
            setActiveTab(tab);
          }}
          onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
          onLogoutClick={handleLogoutClick}
        />

        {/* Main Body View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* USER DETAILS DRILLDOWN VIEW */}
          {selectedUserForDetails ? (
            <AdminUserDetails
              user={selectedUserForDetails}
              transactions={transactions}
              activityLogs={activityLogs}
              onBack={() => setSelectedUserForDetails(null)}
              onEditUser={(u) => handleEditUser(u)}
              onToggleStatus={handleToggleUserStatus}
              onDeleteUser={handleDeleteUser}
              onResetPassword={handleResetPassword}
            />
          ) : (
            <>
              {/* SCREEN 1: DASHBOARD OVERVIEW */}
              {activeTab === 'dashboard' && (
                <AdminDashboardOverview
                  users={users}
                  businesses={businesses}
                  transactions={transactions}
                  activityLogs={activityLogs}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* SCREEN 2: USERS MANAGEMENT */}
              {activeTab === 'users' && (
                <AdminUsersManagement
                  users={users}
                  onAddUser={handleAddUser}
                  onEditUser={handleEditUser}
                  onDeleteUser={handleDeleteUser}
                  onToggleStatus={handleToggleUserStatus}
                  onViewUserDetails={(u) => setSelectedUserForDetails(u)}
                  onExportUsers={() =>
                    addToast('success', 'Exporting Users', 'Downloaded user directory as CSV.')
                  }
                />
              )}

              {/* SCREEN 3: BUSINESSES / VENUES */}
              {activeTab === 'businesses' && (
                <AdminBusinesses
                  businesses={businesses}
                  onTriggerToast={addToast}
                />
              )}

              {/* SCREEN 4: TRANSACTIONS & ORDERS */}
              {activeTab === 'transactions' && (
                <AdminReportsModule
                  transactions={transactions}
                  onTriggerToast={addToast}
                />
              )}

              {/* SCREEN 5: PRODUCTS */}
              {activeTab === 'products' && (
                <AdminProductsInventory mode="products" onTriggerToast={addToast} />
              )}

              {/* SCREEN 6: INVENTORY */}
              {activeTab === 'inventory' && (
                <AdminProductsInventory mode="inventory" onTriggerToast={addToast} />
              )}

              {/* SCREEN 7: STRATEGIC REPORTS */}
              {activeTab === 'reports' && (
                <AdminReportsModule
                  transactions={transactions}
                  onTriggerToast={addToast}
                />
              )}

              {/* SCREEN 8: NOTIFICATION CENTER */}
              {activeTab === 'notifications' && (
                <AdminNotifications
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDeleteNotification={handleDeleteNotification}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                />
              )}

              {/* SCREEN 9: AUDIT LOGS */}
              {activeTab === 'activity-logs' && (
                <AdminActivityLogs
                  logs={activityLogs}
                  onTriggerToast={addToast}
                />
              )}

              {/* SCREEN 10: SETTINGS */}
              {activeTab === 'settings' && (
                <AdminSettings
                  currentUser={currentUser}
                  onUpdateCurrentUser={(u) => setCurrentUser(u)}
                  onTriggerToast={addToast}
                />
              )}

              {/* SCREEN 11: PROFILE */}
              {activeTab === 'profile' && (
                <AdminProfile
                  currentUser={currentUser}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onLogoutClick={handleLogoutClick}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* GLOBAL SEARCH DIALOG (⌘K) */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Search className="w-5 h-5 text-emerald-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search anything across the enterprise system (users, orders, venues, logs)..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search results */}
            <div className="max-h-96 overflow-y-auto space-y-4 text-xs">
              {searchQuery.trim() === '' ? (
                <div className="py-8 text-center text-slate-500">
                  Type a keyword to search across KigaliPulse Enterprise datasets.
                </div>
              ) : (
                <>
                  {/* Users results */}
                  {searchResultsUsers.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-600" />
                        <span>Users ({searchResultsUsers.length})</span>
                      </div>
                      {searchResultsUsers.map((u) => (
                        <div
                          key={u.id}
                          onClick={() => {
                            setSelectedUserForDetails(u);
                            setActiveTab('users');
                            setIsSearchModalOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover border border-slate-200" />
                            <span className="font-bold text-slate-900">{u.name}</span>
                            <span className="text-slate-500">{u.email}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Transactions results */}
                  {searchResultsTransactions.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Receipt className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Transactions ({searchResultsTransactions.length})</span>
                      </div>
                      {searchResultsTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={() => {
                            setActiveTab('transactions');
                            setIsSearchModalOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-emerald-700">{tx.transactionId}</span>
                            <span className="text-slate-900 font-semibold">{tx.userName}</span>
                            <span className="text-slate-500">{tx.businessName}</span>
                          </div>
                          <span className="font-bold text-slate-900 tabular-nums">
                            {tx.amount.toLocaleString()} {tx.currency}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Businesses results */}
                  {searchResultsBusinesses.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-purple-600" />
                        <span>Venues &amp; Businesses ({searchResultsBusinesses.length})</span>
                      </div>
                      {searchResultsBusinesses.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setActiveTab('businesses');
                            setIsSearchModalOpen(false);
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <span className="font-bold text-slate-900">{b.name}</span>
                            <span className="text-slate-500 ml-2">{b.location}</span>
                          </div>
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResultsUsers.length === 0 &&
                    searchResultsTransactions.length === 0 &&
                    searchResultsBusinesses.length === 0 && (
                      <div className="py-8 text-center text-slate-500">
                        No matches found for "{searchQuery}".
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL (Destructive Actions) */}
      <AdminConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        variant={confirmModal.variant}
        iconType={confirmModal.iconType}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* TOAST MESSAGES */}
      <AdminToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
