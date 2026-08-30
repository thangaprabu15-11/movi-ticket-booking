import React, { useState } from 'react';
import { CineWaveProvider, useCineWave } from './context/CineWaveContext';
import { Navbar } from './components/common/Navbar';
import { GuidedDemoBar } from './components/common/GuidedDemoBar';
import { NotificationCenter } from './components/common/NotificationCenter';
import { CustomerHome } from './components/customer/CustomerHome';
import { CustomerCases } from './components/customer/CustomerCases';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AnalyticsDashboard } from './components/admin/AnalyticsDashboard';

const AppContent: React.FC = () => {
  const { role, activeTab } = useCineWave();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const renderContent = () => {
    if (role === 'CUSTOMER') {
      if (activeTab === 'my-bookings' || activeTab === 'cases') {
        return <CustomerCases />;
      }
      return <CustomerHome />;
    }

    if (role === 'STAFF') {
      if (activeTab === 'analytics') {
        return <AnalyticsDashboard />;
      }
      return <StaffDashboard />;
    }

    if (role === 'ADMIN') {
      if (activeTab === 'cases') {
        return <StaffDashboard />;
      }
      if (activeTab === 'analytics') {
        return <AnalyticsDashboard />;
      }
      return <AdminDashboard />;
    }

    return <CustomerHome />;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Top Guided Demo Banner */}
      <GuidedDemoBar />

      {/* Main Navbar */}
      <Navbar onOpenNotifications={() => setIsNotificationsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </main>

      {/* Automated Notification Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#0b0f19]/90 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">CineWave</span>
            <span>• Intelligent Movie Ticket Booking & Pega Case Management Prototype</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Stage Lifecycle Engine v2.4 • SLA Seat Hold Timer Active
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CineWaveProvider>
      <AppContent />
    </CineWaveProvider>
  );
};
