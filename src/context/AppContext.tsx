import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Worker {
  id: string;
  name: string;
  phone: string;
  photo: string;
  service: 'carpenter' | 'plumber' | 'electrician';
  availability: boolean;
  rating: number;
  total_ratings: number;
  city: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  worker_id: string;
  worker_name: string;
  service: string;
  problem: string;
  description: string;
  date: string;
  time_slot: string;
  address: string;
  city: string;
  is_emergency: boolean;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  rating?: number;
  review?: string;
  created_at: string;
  confirmed_at?: string;
  completed_at?: string;
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
  addWorker: (worker: Omit<Worker, 'id' | 'rating' | 'total_ratings'>) => Promise<void>;
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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if Supabase is properly configured
  const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key';
  };

  useEffect(() => {
    initializeApp();
    
    if (isSupabaseConfigured()) {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const userData = session.user.user_metadata;
          const user: User = {
            id: session.user.id,
            name: userData.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: userData.phone || '',
            role: userData.role || (session.user.email === 'admin@homecrew.com' ? 'company' : 'customer')
          };
          setCurrentUser(user);
          await refreshData();
        } else if (event === 'SIGNED_OUT') {
          setCurrentUser(null);
          setBookings([]);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const initializeApp = async () => {
    try {
      if (isSupabaseConfigured()) {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userData = session.user.user_metadata;
          const user: User = {
            id: session.user.id,
            name: userData.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            phone: userData.phone || '',
            role: userData.role || (session.user.email === 'admin@homecrew.com' ? 'company' : 'customer')
          };
          setCurrentUser(user);
        }
        await refreshData();
      } else {
        console.log('Supabase not configured, using demo mode');
        // Use mock data for demo
        setWorkers(mockWorkers);
      }
    } catch (error) {
      console.error('Error initializing app:', error);
      // Fallback to mock data
      setWorkers(mockWorkers);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!isSupabaseConfigured()) return;

    try {
      // Fetch workers
      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (workersError) {
        console.error('Error fetching workers:', workersError);
        // Use mock data as fallback
        setWorkers(mockWorkers);
      } else {
        setWorkers(workersData || []);
      }

      // Fetch bookings if user is logged in
      if (currentUser) {
        let bookingsQuery = supabase.from('bookings').select('*');
        
        if (currentUser.role === 'customer') {
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
      console.error('Error fetching data:', error);
      // Use mock data as fallback
      setWorkers(mockWorkers);
    }
  };

  const login = async (email: string, password: string, role: 'customer' | 'company'): Promise<boolean> => {
    setLoading(true);
    
    try {
      if (!isSupabaseConfigured()) {
        // Demo mode - allow any login
        console.log('Demo mode login');
        
        if (role === 'company' && email === 'admin@homecrew.com') {
          const user: User = {
            id: 'demo-admin',
            name: 'HomeCrew Admin',
            email: 'admin@homecrew.com',
            phone: '+91-1234567890',
            role: 'company'
          };
          setCurrentUser(user);
          setLoading(false);
          return true;
        } else if (role === 'customer') {
          // Allow any customer login in demo mode
          const user: User = {
            id: 'demo-customer',
            name: email.split('@')[0] || 'Demo User',
            email: email,
            phone: '+91-9999999999',
            role: 'customer'
          };
          setCurrentUser(user);
          setLoading(false);
          return true;
        }
        
        setLoading(false);
        return false;
      }

      // Real Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        setLoading(false);
        return false;
      }

      if (data.user) {
        // Check if user role matches expected role
        const userData = data.user.user_metadata;
        const userRole = userData.role || (data.user.email === 'admin@homecrew.com' ? 'company' : 'customer');
        
        if (userRole !== role) {
          await supabase.auth.signOut();
          setLoading(false);
          return false;
        }

        const user: User = {
          id: data.user.id,
          name: userData.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          phone: userData.phone || '',
          role: userRole
        };
        setCurrentUser(user);
        await refreshData();
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setBookings([]);
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; message: string }> => {
    if (!isSupabaseConfigured()) {
      return { 
        success: true, 
        message: 'Demo mode: Registration successful! You can now login with any email/password combination.' 
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

      if (error) {
        console.error('Registration error:', error);
        return { 
          success: false, 
          message: error.message || 'Registration failed. Please try again.' 
        };
      }

      if (data.user) {
        // Create user profile in public.users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            name: userData.name,
            phone: userData.phone,
            role: 'customer'
          }]);

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        if (!data.user.email_confirmed_at) {
          return { 
            success: true, 
            message: 'Registration successful! Please check your email and click the confirmation link, then login.' 
          };
        }

        return { 
          success: true, 
          message: 'Registration successful! You can now login.' 
        };
      }

      return { 
        success: false, 
        message: 'Registration failed. Please try again.' 
      };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again.' 
      };
    }
  };

  const addWorker = async (workerData: Omit<Worker, 'id' | 'rating' | 'total_ratings'>): Promise<void> => {
    if (!isSupabaseConfigured()) {
      // Demo mode - add to local state
      const newWorker: Worker = {
        ...workerData,
        id: `w${Date.now()}`,
        rating: 0,
        total_ratings: 0
      };
      setWorkers([...workers, newWorker]);
      return;
    }

    const { data, error } = await supabase
      .from('workers')
      .insert([{
        name: workerData.name,
        phone: workerData.phone,
        photo: workerData.photo,
        service: workerData.service,
        city: workerData.city,
        availability: workerData.availability
      }])
      .select()
      .single();

    if (error) throw error;
    
    await refreshData();
  };

  const removeWorker = async (workerId: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setWorkers(workers.filter(w => w.id !== workerId));
      return;
    }

    const { error } = await supabase
      .from('workers')
      .delete()
      .eq('id', workerId);

    if (error) throw error;
    
    await refreshData();
  };

  const updateWorkerAvailability = async (workerId: string, availability: boolean): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setWorkers(workers.map(w => 
        w.id === workerId ? { ...w, availability } : w
      ));
      return;
    }

    const { error } = await supabase
      .from('workers')
      .update({ availability })
      .eq('id', workerId);

    if (error) throw error;
    
    await refreshData();
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'status'>): Promise<string> => {
    if (!isSupabaseConfigured()) {
      const newBooking: Booking = {
        ...bookingData,
        id: `b${Date.now()}`,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      setBookings([...bookings, newBooking]);
      return newBooking.id;
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id: bookingData.customer_id,
        customer_name: bookingData.customer_name,
        customer_phone: bookingData.customer_phone,
        customer_email: bookingData.customer_email,
        worker_id: bookingData.worker_id,
        worker_name: bookingData.worker_name,
        service: bookingData.service,
        problem: bookingData.problem,
        description: bookingData.description,
        date: bookingData.date,
        time_slot: bookingData.time_slot,
        address: bookingData.address,
        city: bookingData.city,
        is_emergency: bookingData.is_emergency
      }])
      .select()
      .single();

    if (error) throw error;
    
    await refreshData();
    return data.id;
  };

  const confirmBooking = async (bookingId: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'confirmed', confirmed_at: new Date().toISOString() }
          : b
      ));
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        confirmed_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;
    
    await refreshData();
  };

  const completeBooking = async (bookingId: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setBookings(bookings.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'completed', completed_at: new Date().toISOString() }
          : b
      ));
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', bookingId);

    if (error) throw error;
    
    await refreshData();
  };

  const rateWorker = async (bookingId: string, rating: number, review: string): Promise<void> => {
    if (!isSupabaseConfigured()) {
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, rating, review } : b
      ));
      return;
    }

    const { error } = await supabase
      .from('bookings')
      .update({ rating, review })
      .eq('id', bookingId);

    if (error) throw error;
    
    await refreshData();
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

// Mock data for demo mode
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
    total_ratings: 18,
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
    total_ratings: 31,
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
    total_ratings: 12,
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
    total_ratings: 27,
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
    total_ratings: 15,
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
    total_ratings: 19,
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
    total_ratings: 22,
    city: 'Bangalore'
  }
];