import React from 'react';
import { CaseStage, CaseStatus, PriorityLevel } from '../../types';

interface StatusBadgeProps {
  status?: CaseStatus | CaseStage;
  priority?: PriorityLevel;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, priority, size = 'md' }) => {
  if (priority) {
    const priorityClasses = {
      LOW: 'bg-slate-800 text-slate-400 border-slate-700',
      NORMAL: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
      HIGH: 'bg-rose-950/90 text-rose-300 border-rose-800/80 animate-pulse'
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1.5 text-sm font-medium'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${priorityClasses[priority]} ${sizeClasses[size]}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${priority === 'HIGH' ? 'bg-rose-400' : priority === 'NORMAL' ? 'bg-blue-400' : 'bg-slate-400'}`} />
        {priority} PRIORITY
      </span>
    );
  }

  if (!status) return null;

  const getStatusConfig = (st: string) => {
    switch (st) {
      case 'SUBMITTED':
      case 'BOOKING_REQUEST':
        return { label: 'Submitted', class: 'badge-submitted', dot: 'bg-blue-400' };
      case 'IN_REVIEW':
      case 'AVAILABILITY_CHECK':
        return { label: 'Availability Check', class: 'badge-review', dot: 'bg-purple-400' };
      case 'SEATS_RESERVED':
      case 'SEAT_RESERVATION':
        return { label: 'Seats Reserved', class: 'badge-reserved', dot: 'bg-amber-400' };
      case 'AWAITING_CONFIRMATION':
      case 'CUSTOMER_CONFIRMATION':
        return { label: 'Awaiting Customer Confirm', class: 'badge-awaiting', dot: 'bg-orange-400' };
      case 'CONFIRMED':
      case 'FINAL_BOOKING':
        return { label: 'Confirmed', class: 'badge-confirmed', dot: 'bg-emerald-400' };
      case 'COMPLETED':
        return { label: 'Completed', class: 'badge-completed', dot: 'bg-indigo-400' };
      case 'CANCELLED':
        return { label: 'Cancelled', class: 'badge-cancelled', dot: 'bg-rose-400' };
      default:
        return { label: st, class: 'bg-slate-800 text-slate-300 border-slate-700', dot: 'bg-slate-400' };
    }
  };

  const config = getStatusConfig(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${config.class} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
