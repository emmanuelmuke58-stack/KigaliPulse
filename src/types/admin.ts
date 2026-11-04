export type AdminRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Event Organizer' | 'Venue Manager' | 'Standard User';

export type UserStatus = 'Active' | 'Pending' | 'Suspended' | 'Inactive';

export type TransactionStatus = 'Completed' | 'Pending' | 'Failed' | 'Cancelled';

export type TransactionType = 'Ticket Purchase' | 'Vendor Booth' | 'Sponsorship' | 'Refund' | 'Payout';

export type PaymentMethod = 'MTN Mobile Money' | 'Airtel Money' | 'Visa Card' | 'MasterCard' | 'Bank Transfer';

export interface EnterpriseUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  organization: string;
  status: UserStatus;
  avatar: string;
  lastLogin: string;
  dateCreated: string;
  bio?: string;
  department?: string;
  twoFactorEnabled?: boolean;
}

export interface EnterpriseTransaction {
  id: string;
  transactionId: string;
  date: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  businessName: string;
  transactionType: TransactionType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  notes?: string;
}

export interface EnterpriseBusiness {
  id: string;
  name: string;
  category: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  totalEvents: number;
  totalRevenue: number;
  status: 'Active' | 'Under Review' | 'Suspended';
  registeredDate: string;
}

export interface EnterpriseActivityLog {
  id: string;
  dateTime: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  userRole: AdminRole;
  action: string;
  module: 'Users' | 'Events' | 'Finance' | 'Settings' | 'Security' | 'Moderation' | 'System';
  description: string;
  ipAddress: string;
  device: string;
  status: 'Completed' | 'Active' | 'Pending' | 'Failed' | 'Cancelled';
  detailsPayload?: Record<string, any>;
}

export interface EnterpriseNotification {
  id: string;
  title: string;
  message: string;
  category: 'System' | 'Transactions' | 'Security' | 'Moderation';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export interface RolePermissionConfig {
  role: AdminRole;
  description: string;
  userCount: number;
  permissions: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    export: boolean;
    approve: boolean;
  };
}

export interface GeneralSettingsState {
  appName: string;
  companyName: string;
  supportEmail: string;
  timeZone: string;
  defaultCurrency: string;
  dateFormat: string;
  language: string;
}

export interface SecuritySettingsState {
  requireTwoFactor: boolean;
  sessionTimeoutMinutes: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  loginNotifications: boolean;
  allowIpWhitelist: boolean;
}

export interface NotificationSettingsState {
  emailAlerts: boolean;
  systemPush: boolean;
  transactionAlerts: boolean;
  securityBreachAlerts: boolean;
  weeklyExecutiveDigest: boolean;
  moderationEscalations: boolean;
}

export interface SystemSettingsState {
  maintenanceMode: boolean;
  automaticLogout: boolean;
  sessionTimeout: number; // minutes
  dailyBackup: boolean;
  lastBackupDate: string;
  apiRateLimit: number;
  systemAnnouncements: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp?: number;
}
