import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../types/admin';

interface AdminToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const AdminToast: React.FC<AdminToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        let borderClass = 'border-emerald-200 bg-white shadow-xl shadow-slate-200/80 text-slate-900';
        let barColor = 'bg-emerald-500';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
          borderClass = 'border-rose-200 bg-white shadow-xl shadow-slate-200/80 text-slate-900';
          barColor = 'bg-rose-500';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
          borderClass = 'border-amber-200 bg-white shadow-xl shadow-slate-200/80 text-slate-900';
          barColor = 'bg-amber-500';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-600 shrink-0" />;
          borderClass = 'border-sky-200 bg-white shadow-xl shadow-slate-200/80 text-slate-900';
          barColor = 'bg-sky-500';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex items-start gap-3 p-4 rounded-xl border ${borderClass} animate-in fade-in slide-in-from-bottom-5 duration-200 overflow-hidden`}
          >
            <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${barColor}`} />
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-base uppercase tracking-wider text-slate-900">{toast.title}</h4>
              <p className="text-base text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
