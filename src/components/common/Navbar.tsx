import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { Role } from '../../types';
import {
  Film,
  UserCheck,
  ShieldCheck,
  User,
  Bell,
  Search,
  LayoutDashboard,
  Ticket,
  Sliders,
  Tv,
  Calendar,
  Layers,
  BarChart3
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    role,
    setRole,
    activeTab,
    setActiveTab,
    notifications,
    setSelectedCaseId,
    cases
  } = useCineWave();

  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toUpperCase();
    const found = cases.find(c => c.id.toUpperCase().includes(query) || c.customerName.toUpperCase().includes(query));
    if (found) {
      setSelectedCaseId(found.id);
      setActiveTab('cases');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => setActiveTab('movies')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                    Cine<span className="text-indigo-400">Wave</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold">
                    Pega Core
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase hidden sm:block">
                  Case Lifecycle Platform
                </p>
              </div>
            </div>

            {/* Navigation Tabs based on Role */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {role === 'CUSTOMER' && (
                <>
                  <button
                    onClick={() => setActiveTab('movies')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'movies'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" /> Movies & Shows
                  </button>
                  <button
                    onClick={() => setActiveTab('my-bookings')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'my-bookings' || activeTab === 'cases'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" /> My Bookings / Track Case
                  </button>
                </>
              )}

              {role === 'STAFF' && (
                <>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'cases'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Booking Case Queue & Workspace
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Operational Command Center
                  </button>
                </>
              )}

              {role === 'ADMIN' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-movies')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'admin-movies'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" /> Movies & Shows Config
                  </button>
                  <button
                    onClick={() => setActiveTab('cases')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'cases'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> All Cases
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      activeTab === 'analytics'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> System Analytics
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right Section: Case Quick Search, Notifications, Role Switcher */}
          <div className="flex items-center gap-3">
            {/* Quick Case Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block w-48">
              <input
                type="text"
                placeholder="Track Case ID (CW-)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </form>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Selector Pill */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 font-bold px-2 hidden xl:inline">Role:</span>

              <button
                onClick={() => {
                  setRole('CUSTOMER');
                  setActiveTab('movies');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  role === 'CUSTOMER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Customer Role"
              >
                <User className="w-3.5 h-3.5" /> Customer
              </button>

              <button
                onClick={() => {
                  setRole('STAFF');
                  setActiveTab('cases');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  role === 'STAFF'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Staff Role"
              >
                <UserCheck className="w-3.5 h-3.5" /> Staff
              </button>

              <button
                onClick={() => {
                  setRole('ADMIN');
                  setActiveTab('admin-movies');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  role === 'ADMIN'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Admin Role"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
