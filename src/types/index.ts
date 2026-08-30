export type Role = 'CUSTOMER' | 'STAFF' | 'ADMIN';

export type CaseStage =
  | 'BOOKING_REQUEST'
  | 'AVAILABILITY_CHECK'
  | 'SEAT_RESERVATION'
  | 'CUSTOMER_CONFIRMATION'
  | 'FINAL_BOOKING'
  | 'COMPLETED'
  | 'CANCELLED';

export type CaseStatus =
  | 'SUBMITTED'
  | 'IN_REVIEW'
  | 'AVAILABILITY_CHECK'
  | 'SEATS_RESERVED'
  | 'AWAITING_CONFIRMATION'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export type PriorityLevel = 'LOW' | 'NORMAL' | 'HIGH';

export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'TEMPORARILY_RESERVED' | 'BOOKED';

export type SeatType = 'Standard' | 'Premium' | 'VIP';

export interface Seat {
  id: string; // e.g. "B12"
  row: string; // e.g. "B"
  number: number; // e.g. 12
  status: SeatStatus;
  type: SeatType;
  price: number;
  reservedByCaseId?: string;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  language: string;
  duration: string;
  rating: string;
  posterUrl: string;
  description: string;
  releaseDate: string;
  director?: string;
  isFeatured?: boolean;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
  screens: string[];
  capacity: number;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screen: string;
  date: string;
  time: string;
  ticketPrice: number;
  availableSeats: number;
  capacity: number;
}

export interface CaseTimelineItem {
  id: string;
  timestamp: string;
  actor: string; // e.g., "Customer", "Booking Staff — Team A", "System Auto-Check"
  action: string;
  status: CaseStatus;
  stage: CaseStage;
  details?: string;
}

export interface BookingCase {
  id: string; // e.g., "CW-2026-00125"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  movieId: string;
  theatreId: string;
  showId: string;
  showDate: string;
  showTime: string;
  ticketCount: number;
  seatType: SeatType;
  selectedSeats: string[];
  totalAmount: number;
  currentStage: CaseStage;
  status: CaseStatus;
  priority: PriorityLevel;
  createdAt: string;
  holdExpiresAt?: number; // Epoch timestamp for seat hold countdown
  assignedStaff: string;
  timeline: CaseTimelineItem[];
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  caseId: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  read: boolean;
  roleTarget: Role | 'ALL';
}

export interface DemoStep {
  step: number;
  title: string;
  role: Role;
  instruction: string;
  targetCaseId?: string;
  completed?: boolean;
}
