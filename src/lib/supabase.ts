import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
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
  created_at: string;
  updated_at: string;
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
  email: string;
  user_metadata: {
    name: string;
    phone: string;
    role: 'customer' | 'company';
  };
}