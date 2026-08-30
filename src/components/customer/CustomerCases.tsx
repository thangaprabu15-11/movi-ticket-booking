import React, { useState, useEffect } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { StatusBadge } from '../common/StatusBadge';
import { DigitalTicketModal } from './DigitalTicketModal';
import {
  Ticket,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
  History,
  Info,
  Timer
} from 'lucide-react';

export const CustomerCases: React.FC = () => {
  const {
    cases,
    selectedCaseId,
    setSelectedCaseId,
    movies,
    theatres,
    confirmBookingByCustomer,
    rejectBookingByCustomer
  } = useCineWave();

  const [showTicketModal, setShowTicketModal] = useState(false);

  // Active selected case
  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];
  const movie = movies.find(m => m.id === activeCase.movieId) || movies[0];
  const theatre = theatres.find(t => t.id === activeCase.theatreId) || theatres[0];

  // Countdown timer for seat hold SLA
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!activeCase || !activeCase.holdExpiresAt || activeCase.status !== 'AWAITING_CONFIRMATION') {
      setTimeLeft('');
      return;
    }

    const interval = setInterval(() => {
      const diff = activeCase.holdExpiresAt! - Date.now();
      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCase]);

  // Stage sequence map
  const stages = [
    { key: 'BOOKING_REQUEST', label: 'Booking Request' },
    { key: 'AVAILABILITY_CHECK', label: 'Availability Check' },
    { key: 'SEAT_RESERVATION', label: 'Seat Reservation' },
    { key: 'CUSTOMER_CONFIRMATION', label: 'Customer Confirmation' },
    { key: 'FINAL_BOOKING', label: 'Booking Finalization' },
    { key: 'COMPLETED', label: 'Ticket Issued' }
  ];

  const getStageIndex = (stage: string) => {
    if (stage === 'CANCELLED') return -1;
    switch (stage) {
      case 'BOOKING_REQUEST': return 0;
      case 'AVAILABILITY_CHECK': return 1;
      case 'SEAT_RESERVATION': return 2;
      case 'CUSTOMER_CONFIRMATION': return 3;
      case 'FINAL_BOOKING': return 4;
      case 'COMPLETED': return 5;
      default: return 0;
    }
  };

  const currentStageIdx = getStageIndex(activeCase.currentStage);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Case Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Track Booking Case Lifecycle</h2>
            <p className="text-xs text-slate-400">Pega-style real-time audit trail and confirmation portal</p>
          </div>
        </div>

        {/* Case selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-mono text-slate-400 shrink-0">Select Case:</span>
          {cases.slice(0, 6).map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold shrink-0 transition-all ${
                activeCase.id === c.id
                  ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                  : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Smart Booking Status Component */}
      <div className="glass-panel border border-indigo-500/30 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-mono font-extrabold text-white">{activeCase.id}</span>
              <StatusBadge status={activeCase.status} size="lg" />
              <StatusBadge priority={activeCase.priority} size="sm" />
            </div>
            <p className="text-xs text-slate-400">
              Customer: <span className="text-white font-medium">{activeCase.customerName}</span> ({activeCase.customerEmail})
            </p>
          </div>

          {(activeCase.status === 'CONFIRMED' || activeCase.status === 'COMPLETED') && (
            <button
              onClick={() => setShowTicketModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> View Digital Ticket
            </button>
          )}
        </div>

        {/* 6-Stage Progress Tracker */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Case Lifecycle Progress:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {stages.map((st, idx) => {
              const isCompleted = activeCase.status !== 'CANCELLED' && currentStageIdx > idx;
              const isCurrent = activeCase.status !== 'CANCELLED' && currentStageIdx === idx;
              const isCancelled = activeCase.status === 'CANCELLED' && idx === currentStageIdx;

              return (
                <div
                  key={st.key}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                      : isCurrent
                      ? 'bg-indigo-950/90 border-indigo-500 text-white shadow-lg shadow-indigo-950/50 ring-2 ring-indigo-500/40'
                      : isCancelled
                      ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold mb-1 opacity-80">
                    STAGE {idx + 1}
                  </div>
                  <div className="text-xs font-bold truncate">{st.label}</div>
                  <div className="mt-1.5 flex justify-center">
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                    ) : isCancelled ? (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Action Required Box (Awaiting Confirmation) */}
        {(activeCase.status === 'AWAITING_CONFIRMATION' || activeCase.status === 'SEATS_RESERVED') && (
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border-2 border-amber-500/60 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Timer className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/90 px-2.5 py-0.5 rounded border border-amber-800">
                    Action Required — Customer Confirmation Needed
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">
                    Seats {activeCase.selectedSeats.join(', ')} Temporarily Reserved
                  </h3>
                  <p className="text-xs text-slate-300">
                    CineWave staff has verified show availability and locked your requested seats.
                  </p>
                </div>
              </div>

              {/* SLA Countdown Timer */}
              {timeLeft && (
                <div className="bg-slate-950/90 border border-amber-500/40 px-4 py-2 rounded-xl text-center shrink-0">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block uppercase">Seat Hold SLA Timer</span>
                  <span className="text-2xl font-mono font-extrabold text-amber-300">{timeLeft}</span>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Movie & Show:</span>
                <span className="font-bold text-white">{movie.title} • {activeCase.showTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Reserved Seats:</span>
                <span className="font-bold font-mono text-indigo-300">{activeCase.selectedSeats.join(', ')} ({activeCase.ticketCount} Tickets)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Booking Amount:</span>
                <span className="font-extrabold font-mono text-emerald-400 text-base">₹{activeCase.totalAmount}</span>
              </div>
            </div>

            {/* Confirm / Reject Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => rejectBookingByCustomer(activeCase.id, 'Customer declined confirmation')}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-rose-300 px-5 py-2.5 rounded-xl font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject / Modify Request
              </button>

              <button
                onClick={() => confirmBookingByCustomer(activeCase.id)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle className="w-4 h-4" /> CONFIRM BOOKING NOW
              </button>
            </div>
          </div>
        )}

        {/* Cancellation Box */}
        {activeCase.status === 'CANCELLED' && (
          <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl text-xs text-rose-300 space-y-1">
            <div className="font-bold flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" /> Booking Case Cancelled
            </div>
            <p>Reason: {activeCase.rejectionReason || 'Booking was cancelled or expired.'}</p>
          </div>
        )}
      </div>

      {/* Details & Case Audit Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Summary */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Info className="w-4 h-4 text-indigo-400" /> Booking Metadata Details
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl border border-slate-700 shadow"
              />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-white text-base leading-snug">{movie.title}</h4>
                <p className="text-slate-400">{movie.genre}</p>
                <p className="text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {theatre.name}
                </p>
                <p className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {activeCase.showDate} at {activeCase.showTime}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-medium">Assigned Staff</span>
                <span className="font-semibold text-slate-200">{activeCase.assignedStaff}</span>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block font-medium">Seat Category</span>
                <span className="font-semibold text-indigo-300">{activeCase.seatType} ({activeCase.ticketCount} Tickets)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Case Timeline */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Case Audit Timeline
              </h3>
              <span className="text-xs text-slate-500 font-mono">{activeCase.timeline.length} Events Logged</span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
              {activeCase.timeline.map((item, idx) => (
                <div key={item.id} className="relative pl-8 space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#131b2e] ring-4 ring-slate-900" />

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">{item.action}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>Actor: <strong className="text-indigo-300">{item.actor}</strong></span>
                    <span>•</span>
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  {item.details && (
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60 mt-1">
                      {item.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Digital Ticket Modal */}
      {showTicketModal && (
        <DigitalTicketModal
          bookingCase={activeCase}
          movie={movie}
          theatre={theatre}
          onClose={() => setShowTicketModal(false)}
        />
      )}
    </div>
  );
};
