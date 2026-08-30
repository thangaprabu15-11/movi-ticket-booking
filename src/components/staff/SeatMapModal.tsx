import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { BookingCase, Show, Movie, Theatre, Seat } from '../../types';
import { X, Tv, CheckCircle, ShieldAlert, Timer, Ticket } from 'lucide-react';

interface SeatMapModalProps {
  bookingCase: BookingCase;
  show: Show;
  movie: Movie;
  theatre: Theatre;
  onClose: () => void;
  onConfirmReservation: (selectedSeatIds: string[]) => void;
}

export const SeatMapModal: React.FC<SeatMapModalProps> = ({
  bookingCase,
  show,
  movie,
  theatre,
  onClose,
  onConfirmReservation
}) => {
  const { getSeatsForShow } = useCineWave();

  // Get seat grid for this show
  const allSeats = getSeatsForShow(show.id, bookingCase.id);

  // Staff selected seat IDs (initialize with case selectedSeats if available, or pre-select B12, B13 for demo case CW-2026-00125!)
  const initialSelected = bookingCase.selectedSeats.length > 0
    ? bookingCase.selectedSeats
    : (bookingCase.id === 'CW-2026-00125' ? ['B12', 'B13'] : []);

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>(initialSelected);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'BOOKED') return; // Cannot select booked seats

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds(prev => prev.filter(id => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= bookingCase.ticketCount + 2) {
        alert(`Note: Case requested ${bookingCase.ticketCount} seats.`);
      }
      setSelectedSeatIds(prev => [...prev, seat.id]);
    }
  };

  const calculateTotal = () => {
    let sum = 0;
    selectedSeatIds.forEach(id => {
      const s = allSeats.find(seat => seat.id === id);
      sum += s ? s.price : show.ticketPrice;
    });
    return sum;
  };

  const handleSave = () => {
    if (selectedSeatIds.length === 0) {
      alert('Please select at least one seat to temporarily reserve.');
      return;
    }
    onConfirmReservation(selectedSeatIds);
  };

  // Group seats by row
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#131b2e] border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0b0f19]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Interactive Cinema Seat Management Grid</h3>
              <p className="text-xs text-slate-400">
                Case <span className="font-mono text-indigo-300">{bookingCase.id}</span> • Customer requested {bookingCase.ticketCount} {bookingCase.seatType} seats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-slate-800 border border-slate-700 inline-block" />
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-600 border border-blue-400 inline-block" />
              <span className="text-white font-semibold">Staff Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-amber-500 border border-amber-300 inline-block animate-pulse" />
              <span className="text-amber-300 font-semibold">Temporarily Reserved (Hold)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-rose-950 border border-rose-800 inline-block opacity-75" />
              <span className="text-rose-400">Booked</span>
            </div>
          </div>

          {/* SCREEN Indicator */}
          <div className="space-y-2 text-center">
            <div className="w-3/4 mx-auto h-3 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent rounded-full blur-[2px]" />
            <div className="w-full bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 py-2 rounded-xl text-center text-xs font-mono font-bold text-indigo-300 tracking-widest shadow-inner">
              🎬 CINEMA SCREEN THIS WAY 🎬
            </div>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 overflow-x-auto py-2">
            {rows.map(row => {
              const rowSeats = allSeats.filter(s => s.row === row);
              return (
                <div key={row} className="flex items-center justify-center gap-2 min-w-[500px]">
                  <span className="w-6 text-center text-xs font-bold text-slate-400 font-mono">{row}</span>

                  <div className="flex items-center gap-1.5">
                    {rowSeats.map(seat => {
                      const isSelected = selectedSeatIds.includes(seat.id);

                      let seatClass = 'seat-available';
                      if (seat.status === 'BOOKED') {
                        seatClass = 'seat-booked';
                      } else if (seat.status === 'TEMPORARILY_RESERVED') {
                        seatClass = 'seat-reserved';
                      } else if (isSelected) {
                        seatClass = 'seat-selected';
                      }

                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === 'BOOKED'}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] font-mono font-bold transition-all flex items-center justify-center ${seatClass}`}
                          title={`${seat.id} (${seat.type} - ₹${seat.price}) - Status: ${seat.status}`}
                        >
                          {seat.id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Temporary Seat Hold Explanation */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="font-bold text-amber-300">Temporary Seat Hold Rule:</strong> Once reserved, these seats will be placed on a <span className="font-mono text-white">10-minute temporary hold</span> while awaiting customer confirmation. They will not be permanently booked until customer approves.
            </div>
          </div>

          {/* Selected Summary & Submit */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium block">Selected Reservation Seats:</span>
              <div className="flex items-center gap-2">
                <span className="text-base font-mono font-extrabold text-indigo-300">
                  {selectedSeatIds.length > 0 ? selectedSeatIds.join(', ') : 'None selected'}
                </span>
                <span className="text-xs text-slate-400">({selectedSeatIds.length} Seats)</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-bold block">
                Calculated Total: ₹{calculateTotal()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Timer className="w-4 h-4" /> Temporarily Reserve Seats
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
