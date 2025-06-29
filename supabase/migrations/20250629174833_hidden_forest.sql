/*
# Complete HomeCrew Database Schema Setup

This script creates all necessary tables, functions, triggers, and policies for the HomeCrew application.

## Tables Created:
1. `workers` - Store worker information with ratings and availability
2. `bookings` - Store customer bookings with status tracking
3. `users` - Extended user profiles (references auth.users)

## Security:
- Row Level Security (RLS) enabled on all tables
- Policies for customer and company admin access
- Proper foreign key constraints

## Functions:
- `update_worker_rating()` - Automatically updates worker ratings when bookings are rated

## Instructions:
1. Copy this entire script
2. Go to your Supabase dashboard
3. Navigate to SQL Editor
4. Paste and run this script
5. Refresh your application
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'company')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create workers table
CREATE TABLE IF NOT EXISTS public.workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  photo text DEFAULT '',
  service text NOT NULL CHECK (service IN ('carpenter', 'plumber', 'electrician')),
  availability boolean DEFAULT true,
  rating numeric DEFAULT 0,
  total_ratings integer DEFAULT 0,
  city text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.users(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  worker_id uuid REFERENCES public.workers(id),
  worker_name text NOT NULL,
  service text NOT NULL,
  problem text NOT NULL,
  description text DEFAULT '',
  date text NOT NULL,
  time_slot text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  is_emergency boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in-progress', 'completed', 'cancelled')),
  rating integer CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Workers policies
CREATE POLICY "Anyone can view available workers" ON public.workers
  FOR SELECT TO authenticated
  USING (availability = true);

CREATE POLICY "Company admin can manage workers" ON public.workers
  FOR ALL TO authenticated
  USING ((auth.jwt() ->> 'email') = 'admin@homecrew.com');

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Company admin can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'admin@homecrew.com');

CREATE POLICY "Company admin can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'admin@homecrew.com');

-- Function to update worker ratings
CREATE OR REPLACE FUNCTION public.update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if rating was added/changed and booking is completed
  IF NEW.rating IS NOT NULL AND NEW.status = 'completed' AND 
     (OLD.rating IS NULL OR OLD.rating != NEW.rating) THEN
    
    -- Update worker's rating and total_ratings
    UPDATE public.workers 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM public.bookings 
        WHERE worker_id = NEW.worker_id 
        AND rating IS NOT NULL 
        AND status = 'completed'
      ),
      total_ratings = (
        SELECT COUNT(*)
        FROM public.bookings 
        WHERE worker_id = NEW.worker_id 
        AND rating IS NOT NULL 
        AND status = 'completed'
      ),
      updated_at = now()
    WHERE id = NEW.worker_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating worker ratings
DROP TRIGGER IF EXISTS update_worker_rating_trigger ON public.bookings;
CREATE TRIGGER update_worker_rating_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_worker_rating();

-- Insert sample workers data
INSERT INTO public.workers (name, phone, service, city, availability, rating, total_ratings) VALUES
  ('Rajesh Kumar', '+91-9876543210', 'carpenter', 'Mumbai', true, 4.5, 23),
  ('Suresh Sharma', '+91-9876543211', 'plumber', 'Delhi', true, 4.2, 18),
  ('Amit Patel', '+91-9876543212', 'electrician', 'Bangalore', true, 4.8, 31),
  ('Vikram Singh', '+91-9876543213', 'carpenter', 'Chennai', true, 4.0, 12),
  ('Ravi Gupta', '+91-9876543214', 'plumber', 'Mumbai', true, 4.6, 27),
  ('Deepak Yadav', '+91-9876543215', 'electrician', 'Delhi', true, 4.3, 15),
  ('Manoj Tiwari', '+91-9876543216', 'carpenter', 'Pune', true, 4.7, 19),
  ('Santosh Kumar', '+91-9876543217', 'plumber', 'Bangalore', true, 4.4, 22)
ON CONFLICT (id) DO NOTHING;

-- Create company admin user if it doesn't exist
-- Note: You'll need to create the auth user separately in Supabase Auth
-- This just ensures the profile exists when they sign up
INSERT INTO public.users (id, name, phone, role) 
SELECT 
  id,
  'HomeCrew Admin',
  '+91-1234567890',
  'company'
FROM auth.users 
WHERE email = 'admin@homecrew.com'
ON CONFLICT (id) DO NOTHING;