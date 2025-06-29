import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, type Worker, type Booking, type User } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  workers: Worker[];
  bookings: Booking[];
  loading: boolean;
  login: (email: string, password: string, role: 'customer' | 'company') => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message: string }>;
  addWorker: (worker: Omit<Worker, 'id' | 'rating' | 'total_ratings' | 'created_at' | 'updated_at'>) => Promise<void>;
  removeWorker: (workerId: string) => Promise<void>;
  updateWorkerAvailability: (workerId: string, availability: boolean) => Promise<void>;
  createBooking: (booking: Omit<Booking, 'id' | 'created_at' | 'status'>) => Promise<string>;
  confirmBooking: (bookingId: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  rateWorker: (bookingId: string, rating: number, review: string) => Promise<void>;
  getWorkersByCity: (city: string, service?: string) => Worker[];
  getUserBookings: (userId: string) => Booking[];
  getPendingBookings: () => Booking[];
  refreshData: () => Promise<void>;
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

// Mock data for fallback when Supabase is not connected
const mockWorkers: Worker[] = [
  {
    id: 'w1',
    name: 'Rajesh Kumar',
    phone: '+91-9876543210',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.5,
    total_ratings: 23,
    city: 'Mumbai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'w2',
    name: 'Suresh Sharma',
    phone: '+91-9876543211',
    photo: '',
    service: 'plumber',
    availability: true,
    rating: 4.2,
    total_ratings: 18,
    city: 'Delhi',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'w3',
    name: 'Amit Patel',
    phone: '+91-9876543212',
    photo: '',
    service: 'electrician',
    availability: true,
    rating: 4.8,
    total_ratings: 31,
    city: 'Bangalore',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'w4',
    name: 'Vikram Singh',
    phone: '+91-9876543213',
    photo: '',
    service: 'carpenter',
    availability: true,
    rating: 4.0,
    total_ratings: 12,
    city: 'Chennai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'w5',
    name: 'Ravi Gupta',
    phone: '+91-9876543214',
    photo: '',
    service: 'plumber',
    availability: true,
    rating: 4.6,
    total_ratings: 27,
    city: 'Mumbai',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    // Check Supabase connection and initialize
    const initializeApp = async () => {
      try {
        // Test Supabase connection
        const { data, error } = await supabase.from('workers').select('count').limit(1);
        
        if (!error) {
          setIsSupabaseConnected(true);
          // Check for existing session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setCurrentUser(session.user as User);
            await refreshData();
          } else {
            // Load mock data for demo
            setWorkers(mockWorkers);
          }
        } else {
          console.warn('Supabase not connected, using mock data');
          setWorkers(mockWorkers);
        }
      } catch (error) {
        console.warn('Supabase connection failed, using mock data:', error);
        setWorkers(mockWorkers);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Listen for auth changes only if Supabase is connected
    let subscription: any;
    if (isSupabaseConnected) {
      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user as User);
          await refreshData();
        } else {
          setCurrentUser(null);
          setWorkers(mockWorkers);
          setBookings([]);
        }
        setLoading(false);
      });
      subscription = authSubscription;
    }

    return () => subscription?.unsubscribe();
  }, [isSupabaseConnected]);

  const refreshData = async () => {
    if (!isSupabaseConnected) {
      setWorkers(mockWorkers);
      return;
    }

    try {
      // Always fetch workers (they should be visible to all authenticated users)
      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        setWorkers(mockWorkers);
      } else {
        setWorkers(workersData || mockWorkers);
      }

      // Fetch bookings based on user role
      if (currentUser) {
        let bookingsQuery = supabase.from('bookings').select('*');
        
        // If not admin, only show user's own bookings
        if (currentUser.email !== 'admin@homecrew.com') {
          bookingsQuery = bookingsQuery.eq('customer_id', currentUser.id);
        }

        const { data: bookingsData, error: bookingsError } = await bookingsQuery
          .order('created_at', { ascending: false });

        if (bookingsError) {
          console.error('Error fetching bookings:', bookingsError);
        } else {
          setBookings(bookingsData || []);
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setWorkers(mockWorkers);
    }
  };

  const login = async (email: string, password: string, role: 'customer' | 'company'): Promise<boolean> => {
    if (!isSupabaseConnected) {
      // Mock login for demo
      if (role === 'company' && email === 'admin@homecrew.com' && password === 'admin123') {
        const mockUser: User = {
          id: 'admin-id',
          email: 'admin@homecrew.com',
          user_metadata: {
            name: 'HomeCrew Admin',
            phone: '+91-1234567890',
            role: 'company'
          }
        };
        setCurrentUser(mockUser);
        return true;
      } else if (role === 'customer' && email === 'customer@test.com' && password === 'test123') {
        const mockUser: User = {
          id: 'customer-id',
          email: 'customer@test.com',
          user_metadata: {
            name: 'Test Customer',
            phone: '+91-9876543210',
            role: 'customer'
          }
        };
        setCurrentUser(mockUser);
        return true;
      }
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      // Check role after successful login
      if (role === 'company' && email !== 'admin@homecrew.com') {
        await supabase.auth.signOut();
        return false;
      }

      if (role === 'customer' && email === 'admin@homecrew.com') {
        await supabase.auth.signOut();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (!isSupabaseConnected) {
      setCurrentUser(null);
      setBookings([]);
      return;
    }

    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConnected) {
      return { 
        success: true, 
        message: 'Demo mode: Registration successful! Use customer@test.com / test123 to login.' 
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            phone: userData.phone,
            role: 'customer'
          }
        }
      });

      if (error) throw error;

      return { 
        success: true, 
        message: 'Registration successful! Please check your email to verify your account.' 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const addWorker = async (workerData: Omit<Worker, 'id' | 'rating' | 'total_ratings' | 'created_at' | 'updated_at'>): Promise<void> => {
    if (!isSupabaseConnected) {
      const newWorker: Worker = {
        ...workerData,
        id: `w${Date.now()}`,
        rating: 0,
        total_ratings: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setWorkers([...workers, newWorker]);
      return;
    }

    try {
      const { error } = await supabase
        .from('workers')
        .insert([workerData]);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error adding worker:', error);
      throw error;
    }
  };

  const removeWorker = async (workerId: string): Promise<void> => {
    if (!isSupabaseConnected) {
      setWorkers(workers.filter(w => w.id !== workerId));
      return;
    }

    try {
      const { error } = await supabase
        .from('workers')
        .delete()
        .eq('id', workerId);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error removing worker:', error);
      throw error;
    }
  };

  const updateWorkerAvailability = async (workerId: string, availability: boolean): Promise<void> => {
    if (!isSupabaseConnected) {
      setWorkers(workers.map(w => 
        w.id === workerId ? { ...w, availability } : w
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('workers')
        .update({ availability, updated_at: new Date().toISOString() })
        .eq('id', workerId);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error updating worker availability:', error);
      throw error;
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<string> => {
    if (!isSupabaseConnected) {
      const newBooking: Booking = {
        ...bookingData,
        id: `b${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setBookings([...bookings, newBooking]);
      return newBooking.id;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...bookingData, status: 'pending' }])
        .select()
        .single();

      if (error) throw error;
      await refreshData();
      return data.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  };

  const confirmBooking = async (bookingId: string): Promise<void> => {
    if (!isSupabaseConnected) {
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'confirmed', confirmed_at: new Date().toISOString() }
          : b
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed', 
          confirmed_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error confirming booking:', error);
      throw error;
    }
  };

  const completeBooking = async (bookingId: string): Promise<void> => {
    if (!isSupabaseConnected) {
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'completed', completed_at: new Date().toISOString() }
          : b
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString() 
        })
        .eq('id', bookingId);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error completing booking:', error);
      throw error;
    }
  };

  const rateWorker = async (bookingId: string, rating: number, review: string): Promise<void> => {
    if (!isSupabaseConnected) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, rating, review } : b
      ));
      return;
    }

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ rating, review })
        .eq('id', bookingId);

      if (error) throw error;
      await refreshData();
    } catch (error) {
      console.error('Error rating worker:', error);
      throw error;
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
    return bookings.filter(b => b.customer_id === userId);
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
      getPendingBookings,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};