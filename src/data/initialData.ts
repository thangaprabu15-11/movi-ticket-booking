import { Movie, Theatre, Show, BookingCase, NotificationItem } from '../types';

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mov-1',
    title: 'Avengers: Endgame',
    genre: 'Action / Sci-Fi / Epic',
    language: 'English (Tamil/Hindi Dubbed)',
    duration: '3h 02m',
    rating: 'PG-13 • 9.4/10',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos’ actions.',
    releaseDate: 'Re-release Special',
    director: 'Anthony & Joe Russo',
    isFeatured: true,
  },
  {
    id: 'mov-2',
    title: 'Leo',
    genre: 'Action / Thriller / Crime',
    language: 'Tamil (Dolby Atmos)',
    duration: '2h 44m',
    rating: 'UA • 8.8/10',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
    description: 'A mild-mannered cafe owner in Himachal Pradesh becomes a local hero through a violent act, catching the attention of a ruthless drug cartel.',
    releaseDate: 'Blockbuster Hit',
    director: 'Lokesh Kanagaraj',
    isFeatured: true,
  },
  {
    id: 'mov-3',
    title: 'Interstellar',
    genre: 'Sci-Fi / Adventure / Drama',
    language: 'English (IMAX 70mm)',
    duration: '2h 49m',
    rating: 'PG-13 • 9.6/10',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft through a wormhole.',
    releaseDate: 'IMAX Re-Run',
    director: 'Christopher Nolan',
    isFeatured: true,
  },
  {
    id: 'mov-4',
    title: 'Inception',
    genre: 'Action / Sci-Fi / Mystery',
    language: 'English (4K Remastered)',
    duration: '2h 28m',
    rating: 'PG-13 • 9.2/10',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    releaseDate: 'Cinema Classic',
    director: 'Christopher Nolan',
    isFeatured: false,
  },
  {
    id: 'mov-5',
    title: 'Kantara: Legend',
    genre: 'Action / Folklore / Drama',
    language: 'Kannada / Tamil / Hindi',
    duration: '2h 30m',
    rating: 'UA • 9.0/10',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    description: 'When greed paves the way for betrayal, deceit and murder, a young tribal man reluctantly takes up the mantle of his ancestors to seek justice.',
    releaseDate: 'Critically Acclaimed',
    director: 'Rishab Shetty',
    isFeatured: false,
  }
];

export const INITIAL_THEATRES: Theatre[] = [
  {
    id: 'th-1',
    name: 'CineWave Trichy',
    location: 'Thillai Nagar, Trichy',
    screens: ['Screen 1 (Dolby Atmos)', 'Screen 2 (RGB Laser)'],
    capacity: 120,
  },
  {
    id: 'th-2',
    name: 'CineWave Chennai',
    location: 'Anna Nagar, Chennai',
    screens: ['IMAX Screen 1', 'Screen 2 (Dolby Vision)'],
    capacity: 180,
  },
  {
    id: 'th-3',
    name: 'CineWave Coimbatore',
    location: 'RS Puram, Coimbatore',
    screens: ['Screen 1 (4K Dual Laser)', 'Screen 2 (Dolby Atmos)'],
    capacity: 150,
  }
];

export const INITIAL_SHOWS: Show[] = [
  {
    id: 'sh-101',
    movieId: 'mov-1', // Avengers
    theatreId: 'th-1', // CineWave Trichy
    screen: 'Screen 2 (RGB Laser)',
    date: '2026-09-05',
    time: '07:00 PM',
    ticketPrice: 200,
    availableSeats: 78,
    capacity: 120,
  },
  {
    id: 'sh-102',
    movieId: 'mov-2', // Leo
    theatreId: 'th-1',
    screen: 'Screen 1 (Dolby Atmos)',
    date: '2026-09-05',
    time: '04:15 PM',
    ticketPrice: 180,
    availableSeats: 45,
    capacity: 120,
  },
  {
    id: 'sh-103',
    movieId: 'mov-3', // Interstellar
    theatreId: 'th-2', // Chennai
    screen: 'IMAX Screen 1',
    date: '2026-09-05',
    time: '08:30 PM',
    ticketPrice: 350,
    availableSeats: 22,
    capacity: 180,
  },
  {
    id: 'sh-104',
    movieId: 'mov-4', // Inception
    theatreId: 'th-3', // Coimbatore
    screen: 'Screen 1 (4K Dual Laser)',
    date: '2026-09-05',
    time: '06:00 PM',
    ticketPrice: 220,
    availableSeats: 90,
    capacity: 150,
  }
];

export const INITIAL_CASES: BookingCase[] = [
  {
    id: 'CW-2026-00121',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.s@example.com',
    customerPhone: '+91 98765 43210',
    movieId: 'mov-1', // Avengers
    theatreId: 'th-2', // Chennai
    showId: 'sh-103',
    showDate: '2026-09-05',
    showTime: '08:30 PM',
    ticketCount: 2,
    seatType: 'Premium',
    selectedSeats: ['C05', 'C06'],
    totalAmount: 700,
    currentStage: 'COMPLETED',
    status: 'CONFIRMED',
    priority: 'NORMAL',
    createdAt: '2026-08-30 09:15 AM',
    assignedStaff: 'Booking Staff — Team A',
    timeline: [
      {
        id: 't-101',
        timestamp: '09:15 AM',
        actor: 'Customer',
        action: 'Booking request submitted',
        status: 'SUBMITTED',
        stage: 'BOOKING_REQUEST',
        details: 'Requested 2 Premium seats for Avengers.'
      },
      {
        id: 't-102',
        timestamp: '09:18 AM',
        actor: 'Booking Staff — Team A',
        action: 'Staff started availability verification',
        status: 'AVAILABILITY_CHECK',
        stage: 'AVAILABILITY_CHECK',
        details: 'Verified screen capacity and show timing.'
      },
      {
        id: 't-103',
        timestamp: '09:20 AM',
        actor: 'Booking Staff — Team A',
        action: 'Seats C05 and C06 temporarily reserved',
        status: 'SEATS_RESERVED',
        stage: 'SEAT_RESERVATION',
        details: 'Locked seats on grid with 10 min hold timer.'
      },
      {
        id: 't-104',
        timestamp: '09:22 AM',
        actor: 'Customer',
        action: 'Customer approved booking & completed payment',
        status: 'CONFIRMED',
        stage: 'CUSTOMER_CONFIRMATION',
        details: 'Payment via UPI confirmed.'
      },
      {
        id: 't-105',
        timestamp: '09:23 AM',
        actor: 'System Auto-Check',
        action: 'Final booking processed & digital ticket issued',
        status: 'COMPLETED',
        stage: 'COMPLETED',
        details: 'Ticket QR generated.'
      }
    ]
  },
  {
    id: 'CW-2026-00122',
    customerName: 'Karthik Raja',
    customerEmail: 'karthik.r@example.com',
    customerPhone: '+91 91234 56789',
    movieId: 'mov-2', // Leo
    theatreId: 'th-1', // Trichy
    showId: 'sh-102',
    showDate: '2026-09-05',
    showTime: '04:15 PM',
    ticketCount: 3,
    seatType: 'Standard',
    selectedSeats: [],
    totalAmount: 540,
    currentStage: 'AVAILABILITY_CHECK',
    status: 'IN_REVIEW',
    priority: 'NORMAL',
    createdAt: '2026-08-30 10:05 AM',
    assignedStaff: 'Booking Staff — Team B',
    timeline: [
      {
        id: 't-201',
        timestamp: '10:05 AM',
        actor: 'Customer',
        action: 'Booking request submitted',
        status: 'SUBMITTED',
        stage: 'BOOKING_REQUEST',
        details: 'Requested 3 Standard seats for Leo.'
      },
      {
        id: 't-202',
        timestamp: '10:12 AM',
        actor: 'Booking Staff — Team B',
        action: 'Verification initiated',
        status: 'IN_REVIEW',
        stage: 'AVAILABILITY_CHECK',
        details: 'Checking seat matrix.'
      }
    ]
  },
  {
    id: 'CW-2026-00123',
    customerName: 'Siddharth V',
    customerEmail: 'sid.v@example.com',
    customerPhone: '+91 99887 76655',
    movieId: 'mov-4', // Inception
    theatreId: 'th-3',
    showId: 'sh-104',
    showDate: '2026-09-05',
    showTime: '06:00 PM',
    ticketCount: 1,
    seatType: 'VIP',
    selectedSeats: ['A01'],
    totalAmount: 220,
    currentStage: 'CANCELLED',
    status: 'CANCELLED',
    priority: 'LOW',
    createdAt: '2026-08-30 08:30 AM',
    assignedStaff: 'Booking Staff — Team A',
    rejectionReason: 'Customer cancelled confirmation before 10-min timeout',
    timeline: [
      {
        id: 't-301',
        timestamp: '08:30 AM',
        actor: 'Customer',
        action: 'Booking request submitted',
        status: 'SUBMITTED',
        stage: 'BOOKING_REQUEST'
      },
      {
        id: 't-302',
        timestamp: '08:35 AM',
        actor: 'Booking Staff — Team A',
        action: 'Seats A01 reserved',
        status: 'SEATS_RESERVED',
        stage: 'SEAT_RESERVATION'
      },
      {
        id: 't-303',
        timestamp: '08:42 AM',
        actor: 'Customer',
        action: 'Customer declined booking confirmation',
        status: 'CANCELLED',
        stage: 'CANCELLED',
        details: 'Reason: Change of plans.'
      }
    ]
  },
  {
    id: 'CW-2026-00124',
    customerName: 'Ananya Nair',
    customerEmail: 'ananya.n@example.com',
    customerPhone: '+91 94444 33221',
    movieId: 'mov-3', // Interstellar
    theatreId: 'th-1',
    showId: 'sh-101',
    showDate: '2026-09-05',
    showTime: '07:00 PM',
    ticketCount: 2,
    seatType: 'Premium',
    selectedSeats: ['D08', 'D09'],
    totalAmount: 400,
    currentStage: 'CUSTOMER_CONFIRMATION',
    status: 'AWAITING_CONFIRMATION',
    priority: 'HIGH',
    createdAt: '2026-08-30 10:20 AM',
    holdExpiresAt: Date.now() + 600000, // 10 minutes from now
    assignedStaff: 'Booking Staff — Team A',
    timeline: [
      {
        id: 't-401',
        timestamp: '10:20 AM',
        actor: 'Customer',
        action: 'Booking request submitted',
        status: 'SUBMITTED',
        stage: 'BOOKING_REQUEST'
      },
      {
        id: 't-402',
        timestamp: '10:25 AM',
        actor: 'Booking Staff — Team A',
        action: 'Seats D08 and D09 temporarily reserved',
        status: 'SEATS_RESERVED',
        stage: 'SEAT_RESERVATION'
      },
      {
        id: 't-403',
        timestamp: '10:26 AM',
        actor: 'Booking Staff — Team A',
        action: 'Sent to customer for final confirmation',
        status: 'AWAITING_CONFIRMATION',
        stage: 'CUSTOMER_CONFIRMATION',
        details: 'SLA timer running: 10 minutes hold.'
      }
    ]
  },
  {
    id: 'CW-2026-00125',
    customerName: 'Arun Kumar',
    customerEmail: 'arun.k@example.com',
    customerPhone: '+91 98401 12345',
    movieId: 'mov-1', // Avengers
    theatreId: 'th-1', // CineWave Trichy
    showId: 'sh-101',
    showDate: '2026-09-05',
    showTime: '07:00 PM',
    ticketCount: 2,
    seatType: 'Premium',
    selectedSeats: [], // Staff will pick B12, B13 during demo!
    totalAmount: 400,
    currentStage: 'BOOKING_REQUEST',
    status: 'SUBMITTED',
    priority: 'HIGH',
    createdAt: '2026-08-30 10:32 AM',
    assignedStaff: 'Booking Staff — Team A',
    timeline: [
      {
        id: 't-501',
        timestamp: '10:32 AM',
        actor: 'Customer',
        action: 'Booking request submitted via CineWave web portal',
        status: 'SUBMITTED',
        stage: 'BOOKING_REQUEST',
        details: 'Requested 2 tickets for Avengers at CineWave Trichy 7:00 PM.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    caseId: 'CW-2026-00125',
    title: 'New Booking Case Created',
    message: 'Booking request CW-2026-00125 received from Arun Kumar (2 Tickets for Avengers).',
    timestamp: '10:32 AM',
    type: 'info',
    read: false,
    roleTarget: 'STAFF'
  },
  {
    id: 'notif-2',
    caseId: 'CW-2026-00124',
    title: 'Hold Timer Warning (SLA)',
    message: 'Case CW-2026-00124 (Seats D08, D09) hold expires in 5 minutes.',
    timestamp: '10:25 AM',
    type: 'urgent',
    read: false,
    roleTarget: 'ALL'
  },
  {
    id: 'notif-3',
    caseId: 'CW-2026-00121',
    title: 'Booking Confirmed',
    message: 'Case CW-2026-00121 successfully processed & QR ticket issued.',
    timestamp: '09:23 AM',
    type: 'success',
    read: true,
    roleTarget: 'ALL'
  }
];
