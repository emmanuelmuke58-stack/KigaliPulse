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
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end"
    >
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900">Saved Events</h2>
              <span className="text-xs text-slate-500 font-medium">
                {savedEvents.length} events bookmarked for Kigali
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close saved drawer"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {savedEvents.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800">Your bookmark collection is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark button on any event card to save upcoming concerts, summits, and workshops to your personal list.
              </p>
            </div>
          ) : (
            savedEvents.map((evt) => (
              <div
                key={evt.id}
                className="group p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-600 transition-all bg-white flex items-center gap-3.5 shadow-sm"
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
                  <span className="text-[10px] font-bold text-emerald-700 block truncate">
                    {evt.category}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {evt.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate flex-wrap">
                    <span>{evt.displayDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>{evt.views.toLocaleString()} Views</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-bold text-slate-900 tabular-nums">{evt.priceDisplay}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(evt.id)}
                  aria-label="Remove saved event"
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors shrink-0"
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
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Ready to explore?</span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
