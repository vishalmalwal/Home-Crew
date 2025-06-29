import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  photo: string;
  service: 'carpenter' | 'plumber' | 'electrician';
  availability: boolean;
  rating: number;
  totalRatings: number;
  city: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  workerId: string;
  workerName: string;
  service: string;
  problem: string;
  description: string;
  date: string;
  timeSlot: string;
  address: string;
  city: string;
  isEmergency: boolean;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  rating?: number;
  review?: string;
  createdAt: string;
  confirmedAt?: string;
  completedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'company';
  isVerified: boolean;
  verificationCode?: string;
}

interface AppContextType {
  currentUser: User | null;
  workers: Worker[];
  bookings: Booking[];
  pendingUsers: User[];
  login: (email: string, password: string, role: 'customer' | 'company') => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'isVerified'>) => { success: boolean; message: string };
  verifyEmail: (email: string, code: string) => boolean;
  addWorker: (worker: Omit<Worker, 'id' | 'rating' | 'totalRatings'>) => void;
  removeWorker: (workerId: string) => void;
  updateWorkerAvailability: (workerId: string, availability: boolean) => void;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => string;
  confirmBooking: (bookingId: string) => void;
  completeBooking: (bookingId: string) => void;
  rateWorker: (bookingId: string, rating: number, review: string) => void;
  getWorkersByCity: (city: string, service?: string) => Worker[];
  getUserBookings: (userId: string) => Booking[];
  getPendingBookings: () => Booking[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 
  'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 
  'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad'
];

export const PROBLEMS = {
  carpenter: ['Furniture Repair', 'Door Installation', 'Window Repair', 'Cabinet Making', 'Flooring', 'Custom Woodwork', 'Shelf Installation', 'Wardrobe Repair'],
  plumber: ['Pipe Leakage', 'Toilet Repair', 'Tap Installation', 'Drainage Issue', 'Water Heater', 'Basin Repair', 'Bathroom Fitting', 'Kitchen Plumbing'],
  electrician: ['Wiring Issue', 'Fan Installation', 'Light Fitting', 'Switch Repair', 'Power Outage', 'Appliance Setup', 'Circuit Breaker', 'Socket Installation']
};

// Mock data with no photos
const initialWorkers: Worker[] = [
  {
    id: 'HC01',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.5,
    totalRatings: 23,
    city: 'Mumbai'
  },
  {
    id: 'HC02',
    name: 'Suresh Sharma',
    phone: '+91-9876543211',
    photo: '',
    service: 'plumber',
    availability: true,
    rating: 4.2,
    totalRatings: 18,
    city: 'Delhi'
  },
  {
    id: 'HC03',
    name: 'Amit Patel',
    phone: '+91-9876543212',
    photo: '',
    service: 'electrician',
    availability: false,
    rating: 4.8,
    totalRatings: 31,
    city: 'Bangalore'
  },
  {
    id: 'HC04',
    name: 'Vikram Singh',
    phone: '+91-9876543213',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.0,
    totalRatings: 12,
    city: 'Chennai'
  }
];

// Mock email service
const sendEmail = (to: string, subject: string, body: string) => {
  console.log(`📧 Email sent to: ${to}`);
  console.log(`📧 Subject: ${subject}`);
  console.log(`📧 Body: ${body}`);
  console.log('---');
  
  // Show browser alert to simulate email
  alert(`📧 Email sent to ${to}\n\nSubject: ${subject}\n\n${body}`);
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const savedUser = localStorage.getItem('homecrew_user');
    const savedWorkers = localStorage.getItem('homecrew_workers');
    const savedBookings = localStorage.getItem('homecrew_bookings');
    const savedPendingUsers = localStorage.getItem('homecrew_pending_users');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedPendingUsers) setPendingUsers(JSON.parse(savedPendingUsers));
  }, []);

  useEffect(() => {
    localStorage.setItem('homecrew_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('homecrew_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('homecrew_pending_users', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  const login = (email: string, password: string, role: 'customer' | 'company'): boolean => {
    if (role === 'company' && email === 'admin@homecrew.com' && password === 'admin123') {
      const user: User = {
        id: 'company-admin',
        name: 'HomeCrew Admin',
        email: 'admin@homecrew.com',
        phone: '+91-1234567890',
        role: 'company',
        isVerified: true
      };
      setCurrentUser(user);
      localStorage.setItem('homecrew_user', JSON.stringify(user));
      return true;
    } else if (role === 'customer') {
      // Check if user exists and is verified
      const existingUser = pendingUsers.find(u => u.email === email && u.isVerified);
      if (existingUser) {
        setCurrentUser(existingUser);
        localStorage.setItem('homecrew_user', JSON.stringify(existingUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('homecrew_user');
  };

  const register = (userData: Omit<User, 'id' | 'isVerified'>): { success: boolean; message: string } => {
    // Check if user already exists
    const existingUser = pendingUsers.find(u => u.email === userData.email);
    if (existingUser) {
      if (existingUser.isVerified) {
        return { success: false, message: 'User already exists and is verified. Please login.' };
      } else {
        return { success: false, message: 'User already registered. Please check your email for verification code.' };
      }
    }

    const verificationCode = generateVerificationCode();
    const user: User = {
      ...userData,
      id: `customer-${Date.now()}`,
      isVerified: false,
      verificationCode
    };

    setPendingUsers([...pendingUsers, user]);

    // Send verification email
    sendEmail(
      userData.email,
      'HomeCrew - Email Verification',
      `Welcome to HomeCrew!\n\nYour verification code is: ${verificationCode}\n\nPlease enter this code on the verification page to complete your registration.\n\nThank you for choosing HomeCrew!`
    );

    return { success: true, message: 'Registration successful! Please check your email for verification code.' };
  };

  const verifyEmail = (email: string, code: string): boolean => {
    const userIndex = pendingUsers.findIndex(u => u.email === email && u.verificationCode === code);
    if (userIndex !== -1) {
      const updatedUsers = [...pendingUsers];
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], isVerified: true, verificationCode: undefined };
      setPendingUsers(updatedUsers);
      return true;
    }
    return false;
  };

  const addWorker = (workerData: Omit<Worker, 'id' | 'rating' | 'totalRatings'>) => {
    const newId = `HC${String(workers.length + 1).padStart(2, '0')}`;
    const newWorker: Worker = {
      ...workerData,
      id: newId,
      rating: 0,
      totalRatings: 0
    };
    setWorkers([...workers, newWorker]);
  };

  const removeWorker = (workerId: string) => {
    setWorkers(workers.filter(w => w.id !== workerId));
  };

  const updateWorkerAvailability = (workerId: string, availability: boolean) => {
    setWorkers(workers.map(w => 
      w.id === workerId ? { ...w, availability } : w
    ));
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): string => {
    const bookingId = `BK${Date.now()}`;
    const newBooking: Booking = {
      ...bookingData,
      id: bookingId,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setBookings([...bookings, newBooking]);
    return bookingId;
  };

  const confirmBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(bookings.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'confirmed' as const, confirmedAt: new Date().toISOString() }
        : b
    ));

    // Get worker phone number
    const worker = workers.find(w => w.id === booking.workerId);
    const workerPhone = worker ? worker.phone : 'Contact company for details';

    // Send confirmation email to customer
    sendEmail(
      booking.customerEmail,
      'HomeCrew - Booking Confirmed ✅',
      `Your booking has been confirmed!\n\nBooking Details:\n• Booking ID: ${bookingId}\n• Service: ${booking.service} - ${booking.problem}\n• Worker: ${booking.workerName}\n• Worker Phone: ${workerPhone}\n• Date: ${booking.date}\n• Time: ${booking.timeSlot}\n• Address: ${booking.address}\n\nThe worker will arrive at your location on the scheduled time. Please ensure someone is available to receive the service.\n\nThank you for choosing HomeCrew!`
    );
  };

  const completeBooking = (bookingId: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'completed' as const, completedAt: new Date().toISOString() }
        : b
    ));
  };

  const rateWorker = (bookingId: string, rating: number, review: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Update booking with rating
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, rating, review } : b
    ));

    // Update worker rating
    const worker = workers.find(w => w.id === booking.workerId);
    if (worker) {
      const newTotalRatings = worker.totalRatings + 1;
      const newRating = ((worker.rating * worker.totalRatings) + rating) / newTotalRatings;
      
      setWorkers(workers.map(w => 
        w.id === worker.id 
          ? { ...w, rating: Number(newRating.toFixed(1)), totalRatings: newTotalRatings }
          : w
      ));
    }
  };

  const getWorkersByCity = (city: string, service?: string): Worker[] => {
    return workers.filter(w => 
      w.city === city && 
      w.availability && 
      (!service || w.service === service)
    );
  };

  const getUserBookings = (userId: string): Booking[] => {
    return bookings.filter(b => b.customerId === userId);
  };

  const getPendingBookings = (): Booking[] => {
    return bookings.filter(b => b.status === 'pending');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      workers,
      bookings,
      pendingUsers,
      login,
      logout,
      register,
      verifyEmail,
      addWorker,
      removeWorker,
      updateWorkerAvailability,
      createBooking,
      confirmBooking,
      completeBooking,
      rateWorker,
      getWorkersByCity,
      getUserBookings,
      getPendingBookings
    }}>
      {children}
    </AppContext.Provider>
  );
};