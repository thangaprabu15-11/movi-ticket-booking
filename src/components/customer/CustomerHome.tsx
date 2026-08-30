import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { Movie } from '../../types';
import { Search, MapPin, Calendar, Film, Star, Clock, Ticket, Sparkles, ChevronRight, ShieldAlert } from 'lucide-react';
import { BookingModal } from './BookingModal';

export const CustomerHome: React.FC = () => {
  const { movies, theatres, shows, setSelectedCaseId, setActiveTab } = useCineWave();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<Movie | null>(null);

  const filteredMovies = movies.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredMovie = movies.find(m => m.isFeatured) || movies[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 shadow-2xl p-6 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Pega Case Management Powered Booking
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Your Movie. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400">Your Seats.</span> Your Time.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Book smarter with real-time seat verification and transparent booking tracking. Every booking request moves through a structured, trackable case lifecycle.
            </p>

            {/* Quick Search & Location Filters */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search movies, genres..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-inner"
                />
              </div>

              <div className="relative w-full sm:w-48">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  <option value="All">All Locations</option>
                  <option value="Trichy">Trichy</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-4 border border-indigo-500/30 shadow-2xl relative overflow-hidden group">
              <div className="aspect-video sm:aspect-[16/9] rounded-xl overflow-hidden relative mb-4">
                <img
                  src={featuredMovie.posterUrl}
                  alt={featuredMovie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase shadow">
                  Spotlight Premiere
                </span>
                <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {featuredMovie.rating}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white leading-snug">{featuredMovie.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{featuredMovie.description}</p>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-indigo-300 font-medium bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-900">
                    {featuredMovie.genre}
                  </span>
                  <button
                    onClick={() => setSelectedMovieForBooking(featuredMovie)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Ticket className="w-4 h-4" /> Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Management Highlight Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Case-Centric Double Booking Prevention</h4>
            <p className="text-xs text-slate-400">
              When you submit a request, staff verifies seat availability and holds seats temporarily with a 10-minute SLA timer before customer confirmation.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedCaseId('CW-2026-00125');
            setActiveTab('my-bookings');
          }}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl border border-slate-700 font-semibold flex items-center gap-1.5 shrink-0"
        >
          Track Demo Case CW-2026-00125 <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Movie Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-400" /> Now Showing in Cinemas
            </h2>
            <p className="text-xs text-slate-400">Select a movie to start a new ticket booking case</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">{filteredMovies.length} Movies Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMovies.map(movie => (
            <div
              key={movie.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[2/3] overflow-hidden relative">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 right-3 bg-slate-900/90 text-amber-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-slate-800 backdrop-blur">
                    <Star className="w-3 h-3 fill-amber-400" /> {movie.rating}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-900/80">
                      {movie.language}
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors line-clamp-1">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> {movie.duration}
                    </span>
                    <span>•</span>
                    <span className="truncate">{movie.genre}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {movie.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-800/60 mt-3 flex items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400 font-mono">
                  From <span className="text-white font-bold">₹200</span>/seat
                </div>
                <button
                  onClick={() => setSelectedMovieForBooking(movie)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Ticket className="w-3.5 h-3.5" /> Book Tickets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedMovieForBooking && (
        <BookingModal
          movie={selectedMovieForBooking}
          onClose={() => setSelectedMovieForBooking(null)}
        />
      )}
    </div>
  );
};
