import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { BookingCase, CaseStage, CaseStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { SeatMapModal } from './SeatMapModal';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  User,
  Film,
  MapPin,
  Calendar,
  Layers,
  History,
  ShieldCheck,
  Tv,
  Send,
  XCircle,
  AlertCircle,
  Timer
} from 'lucide-react';

interface CaseWorkspaceProps {
  caseId: string;
  onBack: () => void;
}

export const CaseWorkspace: React.FC<CaseWorkspaceProps> = ({ caseId, onBack }) => {
  const {
    cases,
    movies,
    theatres,
    shows,
    updateCaseStage,
    reserveSeatsForCase,
    confirmBookingByCustomer,
    rejectBookingByCustomer
  } = useCineWave();

  const [showSeatModal, setShowSeatModal] = useState(false);

  const bookingCase = cases.find(c => c.id === caseId);

  if (!bookingCase) {
    return (
      <div className="p-8 text-center text-slate-400">
        Case not found. <button onClick={onBack} className="text-indigo-400 underline">Back to Queue</button>
      </div>
    );
  }

  const movie = movies.find(m => m.id === bookingCase.movieId) || movies[0];
  const theatre = theatres.find(t => t.id === bookingCase.theatreId) || theatres[0];
  const show = shows.find(s => s.id === bookingCase.showId) || shows[0];

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

  const currentStageIdx = getStageIndex(bookingCase.currentStage);

  const handleCheckAvailability = () => {
    updateCaseStage(
      bookingCase.id,
      'AVAILABILITY_CHECK',
      'IN_REVIEW',
      'Staff started availability verification',
      'Booking Staff — Team A',
      `Checked capacity for ${show.screen}. Available seats: ${show.availableSeats}/${show.capacity}.`
    );
  };

  const handleSeatReservation = (seatIds: string[]) => {
    reserveSeatsForCase(bookingCase.id, seatIds);
    setShowSeatModal(false);
  };

  const handleCancelCase = () => {
    rejectBookingByCustomer(bookingCase.id, 'Staff cancelled booking case');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Case Queue
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Pega Case Management Workspace</span>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-1 rounded-md border border-indigo-800">
            CASE {bookingCase.id}
          </span>
        </div>
      </div>

      {/* 3-COLUMN PEGA CASE WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CASE INFORMATION */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-indigo-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <User className="w-4 h-4" /> Case Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Case Reference</span>
                <span className="font-bold font-mono text-white text-sm">{bookingCase.id}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Customer Name</span>
                <span className="font-semibold text-slate-200 text-sm">{bookingCase.customerName}</span>
                <span className="text-slate-400 block text-[11px] truncate">{bookingCase.customerEmail}</span>
                <span className="text-slate-400 block text-[11px] font-mono">{bookingCase.customerPhone}</span>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Movie Request</span>
                <span className="font-bold text-indigo-300 text-sm leading-snug">{movie.title}</span>
                <span className="text-slate-400 block">{movie.genre}</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Theatre & Show</span>
                <span className="font-semibold text-slate-200">{theatre.name}</span>
                <span className="text-slate-400 block">{bookingCase.showDate} at {bookingCase.showTime}</span>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Tickets & Category</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {bookingCase.ticketCount} {bookingCase.seatType} Tickets
                </span>
                <span className="text-slate-400 block font-mono">Total: ₹{bookingCase.totalAmount}</span>
              </div>

              {bookingCase.selectedSeats.length > 0 && (
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-mono font-bold block uppercase">Held Seats</span>
                  <span className="font-mono font-bold text-white text-sm">{bookingCase.selectedSeats.join(', ')}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Created:</span>
                  <span className="font-mono text-slate-300">{bookingCase.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned To:</span>
                  <span className="font-semibold text-slate-200">{bookingCase.assignedStaff}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: LIFECYCLE TRACKER & TIMELINE STREAM */}
        <div className="lg:col-span-6 space-y-6">
          {/* Stage Progress Bar */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Case Lifecycle Stage View
              </h3>
              <StatusBadge status={bookingCase.status} size="md" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {stages.map((st, idx) => {
                const isCompleted = bookingCase.status !== 'CANCELLED' && currentStageIdx > idx;
                const isCurrent = bookingCase.status !== 'CANCELLED' && currentStageIdx === idx;

                return (
                  <div
                    key={st.key}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                        : isCurrent
                        ? 'bg-indigo-950 border-indigo-500 text-white font-bold ring-2 ring-indigo-500/40 shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="text-[10px] font-mono opacity-70">STEP {idx + 1}</div>
                    <div className="font-semibold truncate">{st.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Case Audit Timeline Stream */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Case Audit History
              </h3>
              <span className="text-xs text-slate-500 font-mono">{bookingCase.timeline.length} Events</span>
            </div>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
              {bookingCase.timeline.map(item => (
                <div key={item.id} className="relative pl-8 space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-2 border-[#131b2e]" />

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
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      {item.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PEGA CASE ACTION PANEL */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-white text-sm uppercase tracking-wider text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4" /> Case Actions
            </h3>

            <div className="space-y-2.5">
              {/* Action 1: Check Availability */}
              <button
                onClick={handleCheckAvailability}
                disabled={bookingCase.status !== 'SUBMITTED'}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  bookingCase.status === 'SUBMITTED'
                    ? 'bg-purple-950/80 hover:bg-purple-900 border-purple-700/60 text-purple-200 shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400" /> 1. Check Availability
                </span>
                {bookingCase.currentStage !== 'BOOKING_REQUEST' && <span className="text-[10px] text-emerald-400">✓ Done</span>}
              </button>

              {/* Action 2: Select & Reserve Seats */}
              <button
                onClick={() => setShowSeatModal(true)}
                disabled={bookingCase.status === 'CONFIRMED' || bookingCase.status === 'CANCELLED'}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  bookingCase.status === 'IN_REVIEW' || bookingCase.status === 'SUBMITTED' || bookingCase.status === 'SEATS_RESERVED'
                    ? 'bg-amber-950/90 hover:bg-amber-900 border-amber-500/60 text-amber-200 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tv className="w-4 h-4 text-amber-400" /> 2. Reserve Seats
                </span>
                {bookingCase.selectedSeats.length > 0 && (
                  <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-950 px-1.5 rounded">
                    {bookingCase.selectedSeats.join(',')}
                  </span>
                )}
              </button>

              {/* Action 3: Send for Customer Confirmation */}
              <button
                onClick={() => {
                  if (bookingCase.selectedSeats.length === 0) {
                    alert('Please reserve seats first using the seat map!');
                    return;
                  }
                  reserveSeatsForCase(bookingCase.id, bookingCase.selectedSeats);
                }}
                disabled={bookingCase.status === 'AWAITING_CONFIRMATION' || bookingCase.status === 'CONFIRMED' || bookingCase.status === 'CANCELLED'}
                className={`w-full p-3 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                  bookingCase.selectedSeats.length > 0 && bookingCase.status !== 'AWAITING_CONFIRMATION' && bookingCase.status !== 'CONFIRMED'
                    ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-300" /> 3. Send for Confirmation
                </span>
                {bookingCase.status === 'AWAITING_CONFIRMATION' && <Timer className="w-4 h-4 text-amber-400 animate-pulse" />}
              </button>

              {/* Action 4: Cancel Case */}
              <button
                onClick={handleCancelCase}
                disabled={bookingCase.status === 'CONFIRMED' || bookingCase.status === 'CANCELLED'}
                className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all mt-4 ${
                  bookingCase.status !== 'CONFIRMED' && bookingCase.status !== 'CANCELLED'
                    ? 'bg-rose-950/60 hover:bg-rose-900 border-rose-800/80 text-rose-300'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <XCircle className="w-4 h-4" /> Cancel Booking Case
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Map Modal */}
      {showSeatModal && (
        <SeatMapModal
          bookingCase={bookingCase}
          show={show}
          movie={movie}
          theatre={theatre}
          onClose={() => setShowSeatModal(false)}
          onConfirmReservation={handleSeatReservation}
        />
      )}
    </div>
  );
};
