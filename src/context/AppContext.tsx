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

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user as User);
          await refreshData();
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user as User);
        await refreshData();
      } else {
        setCurrentUser(null);
        setWorkers([]);
        setBookings([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshData = async () => {
    try {
      // Always fetch workers (they should be visible to all authenticated users)
      const { data: workersData, error: workersError } = await supabase
        .from('workers')
        .select('*')
        .order('created_at', { ascending: false });

      if (workersError) {
        console.error('Error fetching workers:', workersError);
      } else {
        setWorkers(workersData || []);
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
    }
  };

  const login = async (email: string, password: string, role: 'customer' | 'company'): Promise<boolean> => {
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
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (userData: { name: string; email: string; phone: string; password: string }): Promise<{ success: boolean; message: string }> => {
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