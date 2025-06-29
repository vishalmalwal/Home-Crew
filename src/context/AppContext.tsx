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
}

interface AppContextType {
  currentUser: User | null;
  workers: Worker[];
  bookings: Booking[];
  loading: boolean;
  login: (email: string, password: string, role: 'customer' | 'company') => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string }>;
  addWorker: (worker: Omit<Worker, 'id' | 'rating' | 'totalRatings'>) => Promise<void>;
  removeWorker: (workerId: string) => Promise<void>;
  updateWorkerAvailability: (workerId: string, availability: boolean) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<string>;
  confirmBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  rateWorker: (bookingId: string, rating: number, review: string) => Promise<void>;
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

// Mock data for demo
const mockWorkers: Worker[] = [
  {
    id: 'w1',
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
    id: 'w2',
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
    id: 'w3',
    name: 'Amit Patel',
    phone: '+91-9876543212',
    photo: '',
    service: 'electrician',
    availability: true,
    rating: 4.8,
    totalRatings: 31,
    city: 'Bangalore'
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    phone: '+91-9876543213',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.0,
    totalRatings: 12,
    city: 'Chennai'
  },
  {
    id: 'w5',
    name: 'Ravi Gupta',
    phone: '+91-9876543214',
    photo: '',
    service: 'plumber',
    availability: true,
    rating: 4.6,
    totalRatings: 27,
    city: 'Mumbai'
  },
  {
    id: 'w6',
    name: 'Deepak Yadav',
    phone: '+91-9876543215',
    photo: '',
    service: 'electrician',
    availability: true,
    rating: 4.3,
    totalRatings: 15,
    city: 'Delhi'
  },
  {
    id: 'w7',
    name: 'Manoj Tiwari',
    phone: '+91-9876543216',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.7,
    totalRatings: 19,
    city: 'Pune'
  },
  {
    id: 'w8',
    name: 'Santosh Kumar',
    phone: '+91-9876543217',
    photo: '',
    service: 'plumber',
    availability: true,
    rating: 4.4,
    totalRatings: 22,
    city: 'Bangalore'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize app
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'customer' | 'company'): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Demo login logic
      if (role === 'company' && email === 'admin@homecrew.com' && password === 'admin123') {
        const user: User = {
          id: 'admin-id',
          name: 'HomeCrew Admin',
          email: 'admin@homecrew.com',
          phone: '+91-1234567890',
          role: 'company'
        };
        setCurrentUser(user);
        return true;
      } else if (role === 'customer' && email === 'customer@test.com' && password === 'test123') {
        const user: User = {
          id: 'customer-id',
          name: 'Test Customer',
          email: 'customer@test.com',
          phone: '+91-9876543210',
          role: 'customer'
        };
        setCurrentUser(user);
        return true;
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setCurrentUser(null);
    setBookings([]);
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; message: string }> => {
    return { 
      success: true, 
      message: 'Demo mode: Registration successful! Use customer@test.com / test123 to login.' 
    };
  };

  const addWorker = async (workerData: Omit<Worker, 'id' | 'rating' | 'totalRatings'>): Promise<void> => {
    const newWorker: Worker = {
      ...workerData,
      id: `w${Date.now()}`,
      rating: 0,
      totalRatings: 0
    };
    setWorkers([...workers, newWorker]);
  };

  const removeWorker = async (workerId: string): Promise<void> => {
    setWorkers(workers.filter(w => w.id !== workerId));
  };

  const updateWorkerAvailability = async (workerId: string, availability: boolean): Promise<void> => {
    setWorkers(workers.map(w => 
      w.id === workerId ? { ...w, availability } : w
    ));
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<string> => {
    const newBooking: Booking = {
      ...bookingData,
      id: `b${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
    return newBooking.id;
  };

  const confirmBooking = async (bookingId: string): Promise<void> => {
    setBookings(bookings.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'confirmed', confirmedAt: new Date().toISOString() }
        : b
    ));
  };

  const completeBooking = async (bookingId: string): Promise<void> => {
    setBookings(bookings.map(b => 
      b.id === bookingId 
        ? { ...b, status: 'completed', completedAt: new Date().toISOString() }
        : b
    ));
  };

  const rateWorker = async (bookingId: string, rating: number, review: string): Promise<void> => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, rating, review } : b
    ));
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
      loading,
      login,
      logout,
      register,
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