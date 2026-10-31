import React from 'react';
import { AlertTriangle, Trash2, ShieldAlert, LogOut, Check } from 'lucide-react';

interface AdminConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  iconType?: 'trash' | 'alert' | 'logout' | 'check';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'danger',
  iconType = 'alert',
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  let icon = <AlertTriangle className="w-6 h-6 text-amber-600" />;
  let iconBg = 'bg-amber-100';

  if (iconType === 'trash' || variant === 'danger') {
    icon = <Trash2 className="w-6 h-6 text-rose-600" />;
    iconBg = 'bg-rose-100';
  } else if (iconType === 'logout') {
    icon = <LogOut className="w-6 h-6 text-slate-700" />;
    iconBg = 'bg-slate-100';
  } else if (iconType === 'check') {
    icon = <Check className="w-6 h-6 text-emerald-600" />;
    iconBg = 'bg-emerald-100';
  }

  let confirmBtnClass = 'bg-rose-600 hover:bg-rose-700 text-white';
  if (variant === 'warning') {
    confirmBtnClass = 'bg-amber-600 hover:bg-amber-700 text-white';
  } else if (variant === 'primary') {
    confirmBtnClass = 'bg-emerald-600 hover:bg-emerald-700 text-white';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150"
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>{icon}</div>
          <div className="flex-1">
            <h3 id="confirm-modal-title" className="text-lg font-bold text-slate-900 leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 ${confirmBtnClass}`}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
