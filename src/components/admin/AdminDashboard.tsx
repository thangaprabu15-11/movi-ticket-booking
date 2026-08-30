import React, { useState } from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { Movie, Theatre, Show } from '../../types';
import { Film, MapPin, Calendar, Plus, Trash2, Edit, CheckCircle, ShieldCheck, Tv } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { movies, theatres, shows, addMovie, addShow } = useCineWave();

  const [activeAdminTab, setActiveAdminTab] = useState<'movies' | 'theatres' | 'shows'>('movies');

  // Add Movie Form State
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Action / Sci-Fi');
  const [newLang, setNewLang] = useState('English / Tamil');
  const [newDuration, setNewDuration] = useState('2h 30m');
  const [newRating, setNewRating] = useState('UA • 9.0/10');
  const [newPoster, setNewPoster] = useState('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80');
  const [newDesc, setNewDesc] = useState('');

  // Add Show Form State
  const [showAddShowModal, setShowAddShowModal] = useState(false);
  const [showMovieId, setShowMovieId] = useState(movies[0]?.id || '');
  const [showTheatreId, setShowTheatreId] = useState(theatres[0]?.id || '');
  const [showScreen, setShowScreen] = useState('Screen 2 (RGB Laser)');
  const [showDate, setShowDate] = useState('2026-09-05');
  const [showTime, setShowTime] = useState('07:00 PM');
  const [showPrice, setShowPrice] = useState(200);

  const handleAddMovieSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addMovie({
      title: newTitle,
      genre: newGenre,
      language: newLang,
      duration: newDuration,
      rating: newRating,
      posterUrl: newPoster,
      description: newDesc || 'High-octane cinema experience.',
      releaseDate: 'New Release',
      isFeatured: false
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddMovieModal(false);
  };

  const handleAddShowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addShow({
      movieId: showMovieId,
      theatreId: showTheatreId,
      screen: showScreen,
      date: showDate,
      time: showTime,
      ticketPrice: showPrice,
      availableSeats: 120,
      capacity: 120
    });
    setShowAddShowModal(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">
              Admin Command
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">System & Show Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure movies catalog, theatre screens, and show schedule parameters.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveAdminTab('movies')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'movies'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" /> Movies ({movies.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('theatres')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'theatres'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Theatres ({theatres.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('shows')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeAdminTab === 'shows'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Shows Schedule ({shows.length})
          </button>
        </div>
      </div>

      {/* MOVIES TAB */}
      {activeAdminTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Active Movie Catalog</h3>
            <button
              onClick={() => setShowAddMovieModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Add New Movie
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {movies.map(m => (
              <div key={m.id} className="glass-panel p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <img
                  src={m.posterUrl}
                  alt={m.title}
                  className="w-full aspect-[2/3] object-cover rounded-xl border border-slate-700"
                />
                <h4 className="font-bold text-white text-sm truncate">{m.title}</h4>
                <p className="text-[11px] text-slate-400 truncate">{m.genre}</p>
                <div className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800 inline-block">
                  {m.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* THEATRES TAB */}
      {activeAdminTab === 'theatres' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {theatres.map(t => (
            <div key={t.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{t.name}</h4>
                  <p className="text-xs text-slate-400">{t.location}</p>
                </div>
              </div>
              <div className="border-t border-slate-800 pt-3 text-xs space-y-1">
                <span className="text-slate-400 text-[10px] block uppercase font-mono">Screens</span>
                {t.screens.map((sc, i) => (
                  <span key={i} className="block text-indigo-300 font-medium">• {sc}</span>
                ))}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Total Capacity: <span className="text-white font-bold">{t.capacity} Seats</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHOWS TAB */}
      {activeAdminTab === 'shows' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">Cinema Shows Schedule</h3>
            <button
              onClick={() => setShowAddShowModal(true)}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Sample Show
            </button>
          </div>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-3.5">Show ID</th>
                  <th className="p-3.5">Movie</th>
                  <th className="p-3.5">Theatre / Screen</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Available / Total Seats</th>
                  <th className="p-3.5">Ticket Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {shows.map(s => {
                  const m = movies.find(mov => mov.id === s.movieId);
                  const th = theatres.find(t => t.id === s.theatreId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/50">
                      <td className="p-3.5 font-mono font-bold text-indigo-300">{s.id}</td>
                      <td className="p-3.5 font-bold text-white">{m?.title || s.movieId}</td>
                      <td className="p-3.5">
                        <div>{th?.name || s.theatreId}</div>
                        <div className="text-[10px] text-slate-400">{s.screen}</div>
                      </td>
                      <td className="p-3.5 font-mono">
                        {s.date} at <span className="font-bold text-amber-300">{s.time}</span>
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="text-emerald-400 font-bold">{s.availableSeats}</span> / {s.capacity}
                      </td>
                      <td className="p-3.5 font-mono font-bold text-white">₹{s.ticketPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Movie Modal */}
      {showAddMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#131b2e] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Add New Movie to Catalog</h3>
            <form onSubmit={handleAddMovieSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Movie Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Genre</label>
                  <input
                    type="text"
                    value={newGenre}
                    onChange={e => setNewGenre(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Language</label>
                  <input
                    type="text"
                    value={newLang}
                    onChange={e => setNewLang(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-slate-950 font-bold"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Show Modal */}
      {showAddShowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#131b2e] border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base">Schedule New Cinema Show</h3>
            <form onSubmit={handleAddShowSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Select Movie</label>
                <select
                  value={showMovieId}
                  onChange={e => setShowMovieId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {movies.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Select Theatre</label>
                <select
                  value={showTheatreId}
                  onChange={e => setShowTheatreId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {theatres.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Show Time</label>
                  <input
                    type="text"
                    value={showTime}
                    onChange={e => setShowTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={showPrice}
                    onChange={e => setShowPrice(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 text-slate-950 font-bold"
                >
                  Create Show
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
