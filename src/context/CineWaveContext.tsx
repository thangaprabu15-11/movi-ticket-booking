import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Movie,
  Theatre,
  Show,
  BookingCase,
  NotificationItem,
  CaseStage,
  CaseStatus,
  Seat,
  SeatStatus,
  DemoStep
} from '../types';
import {
  INITIAL_MOVIES,
  INITIAL_THEATRES,
  INITIAL_SHOWS,
  INITIAL_CASES,
  INITIAL_NOTIFICATIONS
} from '../data/initialData';

interface CineWaveContextType {
  role: Role;
  setRole: (role: Role) => void;
  movies: Movie[];
  theatres: Theatre[];
  shows: Show[];
  cases: BookingCase[];
  notifications: NotificationItem[];
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Case Actions
  createBookingCase: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    movieId: string;
    theatreId: string;
    showId: string;
    showDate: string;
    showTime: string;
    ticketCount: number;
    seatType: 'Standard' | 'Premium' | 'VIP';
  }) => string; // returns generated case ID
  
  updateCaseStage: (caseId: string, stage: CaseStage, status: CaseStatus, actionText: string, actor: string, details?: string) => void;
  reserveSeatsForCase: (caseId: string, seatIds: string[]) => void;
  confirmBookingByCustomer: (caseId: string) => void;
  rejectBookingByCustomer: (caseId: string, reason?: string) => void;
  
  // Seat management
  getSeatsForShow: (showId: string, caseId?: string) => Seat[];
  
  // Admin functions
  addMovie: (movie: Omit<Movie, 'id'>) => void;
  addShow: (show: Omit<Show, 'id'>) => void;
  
  // Guided Demo Flow
  demoStepIndex: number;
  setDemoStepIndex: (index: number) => void;
  nextDemoStep: () => void;
  resetDemoData: () => void;
  isDemoActive: boolean;
  setIsDemoActive: (active: boolean) => void;
  
  // Notifications
  addNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationsAsRead: () => void;
}

const CineWaveContext = createContext<CineWaveContextType | undefined>(undefined);

export const DEMO_STEPS: DemoStep[] = [
  { step: 1, role: 'CUSTOMER', title: '1. Select Movie & Show', instruction: 'Log in as Customer. Select Avengers: Endgame at CineWave Trichy (7:00 PM) and request 2 tickets to generate Case CW-2026-00125.' },
  { step: 2, role: 'STAFF', title: '2. Staff Reviews Request', instruction: 'Switch to Staff Role. Open Case CW-2026-00125 from the queue and inspect customer booking details.' },
  { step: 3, role: 'STAFF', title: '3. Availability Check & Seat Reservation', instruction: 'In Case Workspace, click "Check Availability", open Seat Map, select seats B12 & B13, and click "Temporarily Reserve Seats".' },
  { step: 4, role: 'STAFF', title: '4. Send for Customer Confirmation', instruction: 'Click "Send for Customer Confirmation". Notice the 10-minute Seat Hold countdown timer begins.' },
  { step: 5, role: 'CUSTOMER', title: '5. Customer Confirm & Issue Ticket', instruction: 'Switch to Customer Role. Go to My Bookings / Track Case CW-2026-00125, review reserved seats B12 & B13, and click "Confirm Booking".' },
  { step: 6, role: 'CUSTOMER', title: '6. Digital Ticket & Completed Audit Timeline', instruction: 'View the final confirmed Digital Ticket with QR code and check the updated Pega-style Case Audit Timeline!' }
];

export const CineWaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [theatres, setTheatres] = useState<Theatre[]>(INITIAL_THEATRES);
  const [shows, setShows] = useState<Show[]>(INITIAL_SHOWS);
  const [cases, setCases] = useState<BookingCase[]>(INITIAL_CASES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>('CW-2026-00125');
  const [activeTab, setActiveTab] = useState<string>('movies');
  
  // Guided Demo State
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  // Seat hold timer ticker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCases(prevCases =>
        prevCases.map(c => {
          if (c.holdExpiresAt && c.status === 'AWAITING_CONFIRMATION' && now > c.holdExpiresAt) {
            // Expired! Release seats
            const updatedTimeline = [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                actor: 'System Timer',
                action: 'Seat Hold Expired — Temporary reservation released',
                status: 'CANCELLED' as CaseStatus,
                stage: 'CANCELLED' as CaseStage,
                details: '10-minute hold window elapsed without customer confirmation.'
              }
            ];
            return {
              ...c,
              currentStage: 'CANCELLED',
              status: 'CANCELLED',
              rejectionReason: 'Seat hold expired after 10 minutes',
              holdExpiresAt: undefined,
              timeline: updatedTimeline
            };
          }
          return c;
        })
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createBookingCase = (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    movieId: string;
    theatreId: string;
    showId: string;
    showDate: string;
    showTime: string;
    ticketCount: number;
    seatType: 'Standard' | 'Premium' | 'VIP';
  }) => {
    const show = shows.find(s => s.id === data.showId);
    const unitPrice = show ? show.ticketPrice : 200;
    const totalAmount = unitPrice * data.ticketCount;

    const caseCount = cases.length + 126;
    const newCaseId = `CW-2026-00${caseCount}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newCase: BookingCase = {
      id: newCaseId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      movieId: data.movieId,
      theatreId: data.theatreId,
      showId: data.showId,
      showDate: data.showDate,
      showTime: data.showTime,
      ticketCount: data.ticketCount,
      seatType: data.seatType,
      selectedSeats: [],
      totalAmount,
      currentStage: 'BOOKING_REQUEST',
      status: 'SUBMITTED',
      priority: 'NORMAL',
      createdAt: `${new Date().toISOString().split('T')[0]} ${timestamp}`,
      assignedStaff: 'Booking Staff — Team A',
      timeline: [
        {
          id: `t-${Date.now()}`,
          timestamp,
          actor: 'Customer',
          action: 'Booking request submitted via CineWave web portal',
          status: 'SUBMITTED',
          stage: 'BOOKING_REQUEST',
          details: `Requested ${data.ticketCount} ${data.seatType} tickets.`
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCaseId);

    addNotification({
      caseId: newCaseId,
      title: 'New Booking Request Created',
      message: `Case ${newCaseId} created for ${data.customerName} (${data.ticketCount} tickets).`,
      type: 'info',
      roleTarget: 'ALL'
    });

    return newCaseId;
  };

  const updateCaseStage = (
    caseId: string,
    stage: CaseStage,
    status: CaseStatus,
    actionText: string,
    actor: string,
    details?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          const newTimelineItem = {
            id: `t-${Date.now()}`,
            timestamp,
            actor,
            action: actionText,
            status,
            stage,
            details
          };
          return {
            ...c,
            currentStage: stage,
            status,
            timeline: [...c.timeline, newTimelineItem]
          };
        }
        return c;
      })
    );
  };

  const reserveSeatsForCase = (caseId: string, seatIds: string[]) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const holdExpiresAt = Date.now() + 600000; // 10 minutes

    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            selectedSeats: seatIds,
            currentStage: 'CUSTOMER_CONFIRMATION',
            status: 'AWAITING_CONFIRMATION',
            priority: 'HIGH',
            holdExpiresAt,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}-1`,
                timestamp,
                actor: 'Booking Staff — Team A',
                action: `Seats ${seatIds.join(', ')} temporarily reserved`,
                status: 'SEATS_RESERVED',
                stage: 'SEAT_RESERVATION',
                details: 'Seats held with 10-min SLA timer.'
              },
              {
                id: `t-${Date.now()}-2`,
                timestamp,
                actor: 'Booking Staff — Team A',
                action: 'Sent booking for Customer Confirmation',
                status: 'AWAITING_CONFIRMATION',
                stage: 'CUSTOMER_CONFIRMATION',
                details: 'Customer notified to review & confirm booking.'
              }
            ]
          };
        }
        return c;
      })
    );

    addNotification({
      caseId,
      title: 'Seats Temporarily Reserved',
      message: `Case ${caseId}: Seats ${seatIds.join(', ')} held for 10 minutes awaiting customer confirmation.`,
      type: 'warning',
      roleTarget: 'ALL'
    });
  };

  const confirmBookingByCustomer = (caseId: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            currentStage: 'COMPLETED',
            status: 'CONFIRMED',
            holdExpiresAt: undefined,
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}-1`,
                timestamp,
                actor: 'Customer',
                action: 'Customer approved booking request',
                status: 'CONFIRMED',
                stage: 'FINAL_BOOKING',
                details: 'Payment & ticket details confirmed by customer.'
              },
              {
                id: `t-${Date.now()}-2`,
                timestamp,
                actor: 'System Auto-Check',
                action: 'Booking finalized & Digital QR Ticket generated',
                status: 'COMPLETED',
                stage: 'COMPLETED',
                details: 'Seat status locked to BOOKED permanently.'
              }
            ]
          };
        }
        return c;
      })
    );

    addNotification({
      caseId,
      title: '🎉 Booking Confirmed!',
      message: `Case ${caseId} is fully confirmed. Digital ticket has been generated.`,
      type: 'success',
      roleTarget: 'ALL'
    });
  };

  const rejectBookingByCustomer = (caseId: string, reason = 'Cancelled by customer') => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setCases(prev =>
      prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            currentStage: 'CANCELLED',
            status: 'CANCELLED',
            rejectionReason: reason,
            holdExpiresAt: undefined,
            selectedSeats: [],
            timeline: [
              ...c.timeline,
              {
                id: `t-${Date.now()}`,
                timestamp,
                actor: 'Customer',
                action: 'Customer rejected booking confirmation',
                status: 'CANCELLED',
                stage: 'CANCELLED',
                details: reason
              }
            ]
          };
        }
        return c;
      })
    );

    addNotification({
      caseId,
      title: 'Booking Cancelled',
      message: `Case ${caseId} was cancelled and temporary seats released.`,
      type: 'info',
      roleTarget: 'ALL'
    });
  };

  const getSeatsForShow = (showId: string, activeCaseId?: string): Seat[] => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    const seatsPerRow = 12;
    const result: Seat[] = [];

    // Find all cases for this show that have seats
    const showCases = cases.filter(c => c.showId === showId && c.status !== 'CANCELLED');

    rows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const numStr = i < 10 ? `0${i}` : `${i}`;
        const seatId = `${row}${numStr}`;

        // Determine price & type
        let type: 'Standard' | 'Premium' | 'VIP' = 'Standard';
        let price = 200;
        if (row === 'A' || row === 'B') {
          type = 'VIP';
          price = 250;
        } else if (row === 'C' || row === 'D') {
          type = 'Premium';
          price = 200;
        } else {
          type = 'Standard';
          price = 150;
        }

        // Check if booked or temporarily reserved in cases
        let status: SeatStatus = 'AVAILABLE';
        let reservedByCaseId: string | undefined = undefined;

        for (const c of showCases) {
          if (c.selectedSeats.includes(seatId)) {
            reservedByCaseId = c.id;
            if (c.status === 'CONFIRMED' || c.status === 'COMPLETED') {
              status = 'BOOKED';
            } else if (c.status === 'AWAITING_CONFIRMATION' || c.status === 'SEATS_RESERVED') {
              status = 'TEMPORARILY_RESERVED';
            }
          }
        }

        // Default static booked seats for realistic cinema feel
        if (status === 'AVAILABLE') {
          if (
            (row === 'C' && (i === 1 || i === 2 || i === 11)) ||
            (row === 'E' && (i === 5 || i === 6 || i === 7)) ||
            (row === 'F' && (i === 3 || i === 4))
          ) {
            status = 'BOOKED';
          }
        }

        result.push({
          id: seatId,
          row,
          number: i,
          status,
          type,
          price,
          reservedByCaseId
        });
      }
    });

    return result;
  };

  const addMovie = (movie: Omit<Movie, 'id'>) => {
    const newMovie: Movie = {
      ...movie,
      id: `mov-${Date.now()}`
    };
    setMovies(prev => [newMovie, ...prev]);
  };

  const addShow = (show: Omit<Show, 'id'>) => {
    const newShow: Show = {
      ...show,
      id: `sh-${Date.now()}`
    };
    setShows(prev => [newShow, ...prev]);
  };

  const nextDemoStep = () => {
    if (demoStepIndex < DEMO_STEPS.length - 1) {
      const nextIndex = demoStepIndex + 1;
      setDemoStepIndex(nextIndex);
      setRole(DEMO_STEPS[nextIndex].role);
    }
  };

  const resetDemoData = () => {
    setCases(INITIAL_CASES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setDemoStepIndex(0);
    setRole('CUSTOMER');
    setSelectedCaseId('CW-2026-00125');
  };

  return (
    <CineWaveContext.Provider
      value={{
        role,
        setRole,
        movies,
        theatres,
        shows,
        cases,
        notifications,
        selectedCaseId,
        setSelectedCaseId,
        activeTab,
        setActiveTab,
        createBookingCase,
        updateCaseStage,
        reserveSeatsForCase,
        confirmBookingByCustomer,
        rejectBookingByCustomer,
        getSeatsForShow,
        addMovie,
        addShow,
        demoStepIndex,
        setDemoStepIndex,
        nextDemoStep,
        resetDemoData,
        isDemoActive,
        setIsDemoActive,
        addNotification,
        markNotificationsAsRead
      }}
    >
      {children}
    </CineWaveContext.Provider>
  );
};

export const useCineWave = () => {
  const context = useContext(CineWaveContext);
  if (!context) {
    throw new Error('useCineWave must be used within a CineWaveProvider');
  }
  return context;
};
