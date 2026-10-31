import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Eye } from 'lucide-react';
import { EventItem } from '../types';

interface CalendarViewProps {
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
  // Current calendar view: default October 2026 as per prompt dates
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-02');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Days calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Selected date events
  const selectedDayEvents = events.filter((e) => e.date === selectedDate && e.status === 'Published');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-6">
      
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600" />
          <h3 className="font-display text-xl font-bold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentYear(2026);
              setCurrentMonth(9);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Today (Oct 2026)
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Month Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Leading empty days */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] rounded-xl bg-slate-50/50 p-1 opacity-40" />
        ))}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events.filter((e) => e.date === dateString && e.status === 'Published');
          const isSelected = selectedDate === dateString;

          return (
            <button
              key={dateString}
              type="button"
              onClick={() => setSelectedDate(dateString)}
              className={`min-h-[70px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all focus:outline-none cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                  : dayEvents.length > 0
                  ? 'border-slate-200 bg-white hover:border-emerald-500'
                  : 'border-slate-100 bg-slate-50/30 hover:bg-white text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-xs font-bold ${
                    isSelected
                      ? 'text-emerald-800'
                      : dayEvents.length > 0
                      ? 'text-slate-900 font-extrabold'
                      : 'text-slate-400'
                  }`}
                >
                  {day}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                    {dayEvents.length}
                  </span>
                )}
              </div>

              {/* Event preview snippet */}
              <div className="space-y-1 w-full overflow-hidden">
                {dayEvents.slice(0, 2).map((evt) => (
                  <div
                    key={evt.id}
                    className="text-[10px] font-semibold truncate px-1 py-0.5 rounded bg-emerald-600/10 text-emerald-900 leading-tight"
                    title={evt.title}
                  >
                    {evt.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[9px] font-medium text-slate-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Agenda Drawer */}
      <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-900">
            Agenda for {selectedDate} ({selectedDayEvents.length} Events)
          </h4>
          <span className="text-xs text-slate-500">Click any event to view full details</span>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-xl text-xs text-slate-500">
            No events scheduled for this specific date yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="p-3 rounded-xl border border-slate-200/90 hover:border-emerald-600 bg-white transition-all cursor-pointer flex items-center gap-3 group"
              >
                <img
                  src={evt.image}
                  alt={evt.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-semibold text-emerald-700 block">
                    {evt.category} · {evt.time}
                  </span>
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {evt.title}
                  </h5>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{evt.venue}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-900 tabular-nums block">
                    {evt.priceDisplay}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-0.5">
                    <Eye className="w-2.5 h-2.5 text-slate-400" />
                    <span>{evt.views.toLocaleString()} Views</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
