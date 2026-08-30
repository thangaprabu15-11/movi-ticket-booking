import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { StatusBadge } from '../common/StatusBadge';
import { CaseWorkspace } from './CaseWorkspace';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  XCircle,
  Inbox,
  UserCheck,
  Timer
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { cases, movies, theatres, selectedCaseId, setSelectedCaseId } = useCineWave();

  const [activeWorkspaceCaseId, setActiveWorkspaceCaseId] = useState<string | null>(selectedCaseId || 'CW-2026-00125');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Operational metrics
  const newRequestsCount = cases.filter(c => c.status === 'SUBMITTED').length;
  const availabilityPendingCount = cases.filter(c => c.status === 'IN_REVIEW' || c.status === 'AVAILABILITY_CHECK').length;
  const awaitingConfirmCount = cases.filter(c => c.status === 'AWAITING_CONFIRMATION' || c.status === 'SEATS_RESERVED').length;
  const confirmedCount = cases.filter(c => c.status === 'CONFIRMED' || c.status === 'COMPLETED').length;
  const cancelledCount = cases.filter(c => c.status === 'CANCELLED').length;
  const totalCount = cases.length;

  // Filtered cases list
  const filteredCases = cases.filter(c => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && c.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.customerEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (activeWorkspaceCaseId) {
    return (
      <CaseWorkspace
        caseId={activeWorkspaceCaseId}
        onBack={() => setActiveWorkspaceCaseId(null)}
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950 px-2.5 py-0.5 rounded border border-indigo-800">
              Pega Case Ops
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Staff Booking Case Management Queue</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track, verify availability, hold seats, and process movie ticket booking cases across all cinemas.
          </p>
        </div>
      </div>

      {/* Operational Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>New Requests</span>
            <Inbox className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{newRequestsCount}</div>
          <span className="text-[10px] text-blue-400">Needs Verification</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>In Review</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-white">{availabilityPendingCount}</div>
          <span className="text-[10px] text-purple-400">Availability Check</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1 bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
            <span>Awaiting Confirm</span>
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-amber-300">{awaitingConfirmCount}</div>
          <span className="text-[10px] text-amber-400">10-Min Seat Hold Timer</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-emerald-400">{confirmedCount}</div>
          <span className="text-[10px] text-emerald-400">Tickets Issued</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Cancelled</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-rose-400">{cancelledCount}</div>
          <span className="text-[10px] text-rose-400">Released Seats</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-indigo-500/30 space-y-1 bg-indigo-950/20">
          <div className="flex items-center justify-between text-indigo-300 text-xs font-semibold">
            <span>Total Cases</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-indigo-200">{totalCount}</div>
          <span className="text-[10px] text-indigo-400">All Time</span>
        </div>
      </div>

      {/* Filtering & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by Case ID, Customer..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-2 shrink-0 text-xs text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filter Status:
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">SUBMITTED</option>
            <option value="IN_REVIEW">IN REVIEW</option>
            <option value="SEATS_RESERVED">SEATS RESERVED</option>
            <option value="AWAITING_CONFIRMATION">AWAITING CONFIRMATION</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer shrink-0"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">HIGH Priority</option>
            <option value="NORMAL">NORMAL Priority</option>
            <option value="LOW">LOW Priority</option>
          </select>
        </div>
      </div>

      {/* Case Management Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-[#0b0f19]/80 flex items-center justify-between">
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" /> Active Case Queue ({filteredCases.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time Pega Workflow Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <th className="p-4">Case ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Movie</th>
                <th className="p-4">Theatre / Show</th>
                <th className="p-4 text-center">Tickets</th>
                <th className="p-4">Current Stage</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Created Time</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No cases match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => {
                  const movie = movies.find(m => m.id === c.movieId);
                  const theatre = theatres.find(t => t.id === c.theatreId);

                  return (
                    <tr
                      key={c.id}
                      onClick={() => {
                        setSelectedCaseId(c.id);
                        setActiveWorkspaceCaseId(c.id);
                      }}
                      className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 font-mono font-bold text-indigo-300 group-hover:text-indigo-200">
                        {c.id}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{c.customerName}</div>
                        <div className="text-[10px] text-slate-400">{c.customerPhone}</div>
                      </td>
                      <td className="p-4 font-medium text-slate-200">
                        {movie ? movie.title : 'Movie'}
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{theatre ? theatre.name : 'Theatre'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{c.showTime}</div>
                      </td>
                      <td className="p-4 text-center font-bold font-mono">
                        {c.ticketCount} <span className="text-[10px] text-slate-400 font-normal">({c.seatType})</span>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={c.status} size="sm" />
                      </td>
                      <td className="p-4">
                        <StatusBadge priority={c.priority} size="sm" />
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-400">
                        {c.createdAt.split(' ')[1]} {c.createdAt.split(' ')[2]}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCaseId(c.id);
                            setActiveWorkspaceCaseId(c.id);
                          }}
                          className="bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-indigo-500/30 flex items-center gap-1 ml-auto"
                        >
                          Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
