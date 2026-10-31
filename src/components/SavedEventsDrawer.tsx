import React from 'react';
import { Bookmark, X, Trash2, Calendar, MapPin, ArrowRight, Eye } from 'lucide-react';
import { EventItem } from '../types';

interface SavedEventsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedEvents: EventItem[];
  onRemove: (eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
}

export const SavedEventsDrawer: React.FC<SavedEventsDrawerProps> = ({
  isOpen,
  onClose,
  savedEvents,
  onRemove,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-stretch sm:justify-end"
    >
      <div className="bg-white w-full sm:max-w-md h-[85vh] sm:h-full shadow-2xl flex flex-col justify-between rounded-t-3xl sm:rounded-none border-l border-slate-200 animate-in slide-in-from-bottom sm:slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Saved Events</h2>
              <span className="text-xs text-slate-500 font-medium">
                {savedEvents.length} events bookmarked
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved drawer"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedEvents.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-800">Your collection is empty</h4>
                <p className="text-xs text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                  Click the bookmark icon on any event to save it for later.
                </p>
              </div>
            </div>
          ) : (
            savedEvents.map((evt) => (
              <div
                key={evt.id}
                className="group p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all bg-white flex items-center gap-3.5 shadow-sm active:scale-[0.98]"
              >
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectEvent(evt);
                  }}
                />

                <div
                  className="flex-1 min-w-0 cursor-pointer space-y-0.5"
                  onClick={() => {
                    onClose();
                    onSelectEvent(evt);
                  }}
                >
                  <span className="text-[10px] font-bold text-emerald-700 block uppercase tracking-wider">
                    {evt.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                    <span>{evt.displayDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-slate-900 tabular-nums">{evt.priceDisplay}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(evt.id)}
                  aria-label="Remove saved event"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors shrink-0"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedEvents.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 pb-[calc(1.25rem+env(safe-area-inset-bottom))] flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <span className="text-slate-500 text-xs font-medium">Ready to explore?</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 shadow-md active:scale-[0.98] transition-all"
            >
              Continue Browsing
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
