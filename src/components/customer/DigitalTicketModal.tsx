import React from 'react';
import { BookingCase, Movie, Theatre } from '../../types';
import { X, QrCode, Download, Printer, CheckCircle, Ticket, Calendar, Clock, MapPin, Film } from 'lucide-react';

interface DigitalTicketModalProps {
  bookingCase: BookingCase;
  movie: Movie;
  theatre: Theatre;
  onClose: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  bookingCase,
  movie,
  theatre,
  onClose
}) => {
  const handleDownload = () => {
    alert(`Downloading Digital Ticket PDF for ${bookingCase.id}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#131b2e] border border-slate-800 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-[#0b0f19]/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">CineWave Digital Cinema Ticket</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Container */}
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/80 border-2 border-dashed border-indigo-500/40 rounded-3xl p-6 relative shadow-2xl overflow-hidden">
            {/* Cutout decorative circles */}
            <div className="w-6 h-6 rounded-full bg-[#131b2e] absolute -left-3 top-1/2 -translate-y-1/2 border-r border-indigo-500/40" />
            <div className="w-6 h-6 rounded-full bg-[#131b2e] absolute -right-3 top-1/2 -translate-y-1/2 border-l border-indigo-500/40" />

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Movie Poster & QR Code */}
              <div className="text-center space-y-3 shrink-0">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-28 h-40 object-cover rounded-xl shadow-lg border border-slate-700 mx-auto"
                />
                <div className="bg-white p-2 rounded-xl inline-block shadow-lg">
                  {/* Simulated QR Code graphic */}
                  <div className="w-24 h-24 bg-slate-900 rounded flex flex-col items-center justify-center p-1 space-y-1">
                    <QrCode className="w-16 h-16 text-white" />
                    <span className="text-[8px] font-mono text-slate-300 tracking-tighter">VALIDATED</span>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="flex-1 space-y-3 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> CONFIRMED
                  </span>
                  <span className="text-xs font-mono text-indigo-300 font-bold">{bookingCase.id}</span>
                </div>

                <div>
                  <h2 className="text-xl font-black text-white leading-tight">{movie.title}</h2>
                  <p className="text-xs text-slate-400">{movie.language} • {movie.genre}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-white">{theatre.name}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{bookingCase.showDate}</span>
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-2" />
                    <span className="font-bold text-white">{bookingCase.showTime}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block uppercase">Seats</span>
                    <span className="font-mono font-bold text-indigo-300 text-sm">
                      {bookingCase.selectedSeats.length > 0 ? bookingCase.selectedSeats.join(', ') : 'Assigned at Gate'}
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-medium block uppercase">Total Amount</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      ₹{bookingCase.totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" /> Print Ticket
            </button>
            <button
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Download className="w-4 h-4" /> Download PDF Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
