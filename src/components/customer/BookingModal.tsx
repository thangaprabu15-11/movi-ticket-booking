import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { Movie } from '../../types';
import { X, Ticket, Calendar, Clock, MapPin, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface BookingModalProps {
  movie: Movie;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ movie, onClose }) => {
  const { theatres, shows, createBookingCase, setActiveTab } = useCineWave();

  // Form State
  const [customerName, setCustomerName] = useState('Arun Kumar');
  const [customerEmail, setCustomerEmail] = useState('arun.k@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98401 12345');
  const [selectedTheatreId, setSelectedTheatreId] = useState(theatres[0].id);
  const [selectedDate, setSelectedDate] = useState('2026-09-05');
  const [selectedTime, setSelectedTime] = useState('07:00 PM');
  const [ticketCount, setTicketCount] = useState<number>(2);
  const [seatType, setSeatType] = useState<'Standard' | 'Premium' | 'VIP'>('Premium');

  const [generatedCaseId, setGeneratedCaseId] = useState<string | null>(null);

  // Selected theatre details
  const selectedTheatre = theatres.find(t => t.id === selectedTheatreId) || theatres[0];
  const matchingShow = shows.find(s => s.movieId === movie.id && s.theatreId === selectedTheatreId) || shows[0];

  const pricePerTicket = seatType === 'VIP' ? 250 : seatType === 'Premium' ? 200 : 150;
  const totalAmount = pricePerTicket * ticketCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check Rule 1: Requested tickets vs available seats
    if (ticketCount > matchingShow.availableSeats) {
      alert(`Requested seats (${ticketCount}) exceed available seats (${matchingShow.availableSeats}). Please select fewer tickets.`);
      return;
    }

    const caseId = createBookingCase({
      customerName,
      customerEmail,
      customerPhone,
      movieId: movie.id,
      theatreId: selectedTheatreId,
      showId: matchingShow.id,
      showDate: selectedDate,
      showTime: selectedTime,
      ticketCount,
      seatType
    });

    setGeneratedCaseId(caseId);
  };

  const handleGoToTracker = () => {
    setActiveTab('my-bookings');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#131b2e] border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0b0f19]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Create Booking Request Case</h3>
              <p className="text-xs text-slate-400">Initiates Pega case management lifecycle tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {!generatedCaseId ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Movie Preview Header */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-14 h-20 object-cover rounded-lg shadow"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900 uppercase">
                  {movie.genre}
                </span>
                <h4 className="font-bold text-white text-base truncate mt-1">{movie.title}</h4>
                <p className="text-xs text-slate-400">{movie.language} • {movie.duration}</p>
              </div>
            </div>

            {/* Customer Details Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Customer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Theatre & Timing Selection */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Cinema & Timing Selection</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Theatre</label>
                  <select
                    value={selectedTheatreId}
                    onChange={e => setSelectedTheatreId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    {theatres.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Show Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1">Show Time</label>
                  <select
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="04:15 PM">04:15 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM (Popular)</option>
                    <option value="08:30 PM">08:30 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tickets & Seat Type */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Ticket Specification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Number of Tickets</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTicketCount(num)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                          ticketCount === num
                            ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-105'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-medium block mb-1.5">Seat Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Standard', 'Premium', 'VIP'] as const).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSeatType(cat)}
                        className={`py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                          seatType === cat
                            ? 'bg-indigo-600 text-white border border-indigo-400 shadow'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div>{cat}</div>
                        <div className="text-[10px] opacity-80 font-mono">₹{cat === 'VIP' ? 250 : cat === 'Premium' ? 200 : 150}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Total & Submit */}
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Estimated Booking Total</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  ₹{totalAmount} <span className="text-xs font-normal text-slate-400">({ticketCount} × ₹{pricePerTicket})</span>
                </div>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95"
              >
                Submit Booking Request <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          /* Case Created Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-950/50 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950 px-3 py-1 rounded-full border border-indigo-800">
                Pega Case Created Successfully
              </span>
              <h3 className="text-2xl font-extrabold text-white">Booking Case: <span className="font-mono text-indigo-300">{generatedCaseId}</span></h3>
              <div className="inline-block mt-2">
                <StatusBadge status="SUBMITTED" size="lg" />
              </div>
            </div>

            {/* Lifecycle Progress Tracker */}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl text-left space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Case Lifecycle Stage Tracker:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px]">
                <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-600 text-indigo-200 font-bold">
                  1. Request ✓
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  2. Availability Check
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  3. Seat Hold
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  4. Customer Confirm
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  5. Finalize
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  6. Completed
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Your request has entered the CineWave staff verification queue. Staff will verify seat availability and temporarily reserve your seats.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={handleGoToTracker}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
              >
                Track Case Workspace <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
