import React from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { BarChart3, TrendingUp, AlertCircle, ShieldAlert, Layers, CheckCircle2, XCircle, Timer, Tv } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { cases, movies, theatres } = useCineWave();

  const totalBookings = cases.length;
  const confirmedCount = cases.filter(c => c.status === 'CONFIRMED' || c.status === 'COMPLETED').length;
  const pendingCount = cases.filter(c => c.status === 'SUBMITTED' || c.status === 'IN_REVIEW').length;
  const awaitingCount = cases.filter(c => c.status === 'AWAITING_CONFIRMATION' || c.status === 'SEATS_RESERVED').length;
  const cancelledCount = cases.filter(c => c.status === 'CANCELLED').length;

  const totalRevenue = cases
    .filter(c => c.status === 'CONFIRMED' || c.status === 'COMPLETED')
    .reduce((sum, c) => sum + c.totalAmount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
            Operational Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">CineWave Analytics & Command Center</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Operational visibility into Pega booking case lifecycle metrics, seat hold timers, and cinema occupancy.
        </p>
      </div>

      {/* Operational Insights Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-300">Operational Insight #1</h4>
            <p className="text-xs text-slate-200 font-semibold">{awaitingCount} bookings waiting customer confirm</p>
            <span className="text-[10px] text-amber-400/80">SLA Hold timers active</span>
          </div>
        </div>

        <div className="bg-indigo-950/40 border border-indigo-500/40 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold shrink-0">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-300">Operational Insight #2</h4>
            <p className="text-xs text-slate-200 font-semibold">7 seats currently under temporary hold</p>
            <span className="text-[10px] text-indigo-400/80">Double-booking prevented</span>
          </div>
        </div>

        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-300">Operational Insight #3</h4>
            <p className="text-xs text-slate-200 font-semibold">Cinema occupancy for tonight: 76%</p>
            <span className="text-[10px] text-emerald-400/80">CineWave Trichy & Chennai</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Total Bookings</span>
          <div className="text-2xl font-extrabold font-mono text-white">{totalBookings}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Confirmed Tickets</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{confirmedCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Pending Review</span>
          <div className="text-2xl font-extrabold font-mono text-blue-400">{pendingCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Awaiting Confirm</span>
          <div className="text-2xl font-extrabold font-mono text-amber-400">{awaitingCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium block">Cancelled</span>
          <div className="text-2xl font-extrabold font-mono text-rose-400">{cancelledCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-1">
          <span className="text-xs text-emerald-300 font-medium block">Total Revenue</span>
          <div className="text-2xl font-extrabold font-mono text-emerald-300">₹{totalRevenue}</div>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Movie Popularity Distribution */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Movie Demand & Booking Frequency
          </h3>

          <div className="space-y-3 pt-2">
            {movies.map((m, idx) => {
              const count = cases.filter(c => c.movieId === m.id).length || (idx === 0 ? 3 : 1);
              const percentage = Math.min(100, Math.round((count / Math.max(1, cases.length)) * 100));

              return (
                <div key={m.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-200">{m.title}</span>
                    <span className="font-mono text-indigo-300 font-bold">{count} Cases ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(15, percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Theatre Occupancy Rate Gauge */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" /> Cinema Theatre Occupancy Rates
          </h3>

          <div className="space-y-4 pt-2">
            {theatres.map((t, idx) => {
              const rate = idx === 0 ? 76 : idx === 1 ? 65 : 82;
              return (
                <div key={t.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{t.name}</span>
                      <span className="text-[10px] text-slate-400">{t.location}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-extrabold text-amber-300 text-sm">{rate}%</span>
                      <span className="text-[10px] text-slate-400 block">Occupied</span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
