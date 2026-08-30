import React from 'react';
import { useCineWave } from '../../context/CineWaveContext';
import { Bell, CheckCheck, X, AlertTriangle, CheckCircle, Info, Flame } from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsAsRead, setSelectedCaseId, setActiveTab } = useCineWave();

  if (!isOpen) return null;

  const handleNotificationClick = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('cases');
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case 'warning':
      case 'urgent':
        return <Flame className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />;
      default:
        return <Info className="w-5 h-5 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#131b2e] border-l border-slate-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0b0f19]/80">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Automated Notifications</h3>
          <span className="bg-indigo-900/60 text-indigo-300 text-xs px-2 py-0.5 rounded-full font-medium border border-indigo-700/50">
            {notifications.length} Total
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markNotificationsAsRead}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2 py-1 rounded bg-slate-800/60"
            title="Mark all as read"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Read All
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotificationClick(n.caseId)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                n.read
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : 'bg-slate-800/80 border-indigo-500/40 shadow-lg shadow-indigo-950/20 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start gap-3">
                {getIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-white truncate">{n.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-900">
                      {n.caseId}
                    </span>
                    <span className="text-[10px] text-slate-400 hover:text-indigo-300 font-medium">
                      View Case Workspace →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 bg-[#0b0f19]/80 text-center text-xs text-slate-500">
        Simulated Pega Event Dispatcher • Real-time Notification Engine
      </div>
    </div>
  );
};
