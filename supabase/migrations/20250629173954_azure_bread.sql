/*
  # Complete HomeCrew Database Schema Setup

  1. New Tables
    - `workers`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `phone` (text, required)
      - `photo` (text, optional with default)
      - `service` (text, required - carpenter/plumber/electrician)
      - `availability` (boolean, default true)
      - `rating` (numeric, default 0)
      - `total_ratings` (integer, default 0)
      - `city` (text, required)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)
    
    - `bookings`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key to users)
      - `customer_name` (text, required)
      - `customer_phone` (text, required)
      - `customer_email` (text, required)
      - `worker_id` (uuid, foreign key to workers)
      - `worker_name` (text, required)
      - `service` (text, required)
      - `problem` (text, required)
      - `description` (text, optional)
      - `date` (text, required)
      - `time_slot` (text, required)
      - `address` (text, required)
      - `city` (text, required)
      - `is_emergency` (boolean, default false)
      - `status` (text, default 'pending')
      - `rating` (integer, optional 1-5)
      - `review` (text, optional)
      - `created_at` (timestamptz, default now)
      - `confirmed_at` (timestamptz, optional)
      - `completed_at` (timestamptz, optional)

  2. Security
    - Enable RLS on both tables
    - Workers: Anyone can view available workers, admin can manage all
    - Bookings: Users can create/view own bookings, admin can view/update all

  3. Functions & Triggers
    - Worker rating update function and trigger
*/

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  photo text DEFAULT ''::text,
  service text NOT NULL,
  availability boolean DEFAULT true,
  rating numeric DEFAULT 0,
  total_ratings integer DEFAULT 0,
  city text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add service constraint for workers
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'workers_service_check' 
    AND table_name = 'workers'
  ) THEN
    ALTER TABLE workers ADD CONSTRAINT workers_service_check 
    CHECK (service = ANY (ARRAY['carpenter'::text, 'plumber'::text, 'electrician'::text]));
  END IF;
END $$;

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  worker_id uuid,
  worker_name text NOT NULL,
  service text NOT NULL,
  problem text NOT NULL,
  description text DEFAULT ''::text,
  date text NOT NULL,
  time_slot text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  is_emergency boolean DEFAULT false,
  status text DEFAULT 'pending'::text,
  rating integer,
  review text,
  created_at timestamptz DEFAULT now(),
  confirmed_at timestamptz,
  completed_at timestamptz
);

-- Add foreign key constraints for bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_customer_id_fkey' 
    AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES auth.users(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_worker_id_fkey' 
    AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_worker_id_fkey 
    FOREIGN KEY (worker_id) REFERENCES workers(id);
  END IF;
END $$;

-- Add rating constraint for bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_rating_check' 
    AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_rating_check 
    CHECK ((rating >= 1) AND (rating <= 5));
  END IF;
END $$;

-- Add status constraint for bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'bookings_status_check' 
    AND table_name = 'bookings'
  ) THEN
    ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'in-progress'::text, 'completed'::text, 'cancelled'::text]));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Workers policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Anyone can view available workers' 
    AND tablename = 'workers'
  ) THEN
    CREATE POLICY "Anyone can view available workers"
      ON workers
      FOR SELECT
      TO authenticated
      USING (availability = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Company admin can manage workers' 
    AND tablename = 'workers'
  ) THEN
    CREATE POLICY "Company admin can manage workers"
      ON workers
      FOR ALL
      TO authenticated
      USING ((auth.jwt() ->> 'email'::text) = 'admin@homecrew.com'::text);
  END IF;
END $$;

-- Bookings policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can create their own bookings' 
    AND tablename = 'bookings'
  ) THEN
    CREATE POLICY "Users can create their own bookings"
      ON bookings
      FOR INSERT
      TO authenticated
      WITH CHECK (customer_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Users can view their own bookings' 
    AND tablename = 'bookings'
  ) THEN
    CREATE POLICY "Users can view their own bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (customer_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Company admin can view all bookings' 
    AND tablename = 'bookings'
  ) THEN
    CREATE POLICY "Company admin can view all bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING ((auth.jwt() ->> 'email'::text) = 'admin@homecrew.com'::text);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE policyname = 'Company admin can update all bookings' 
    AND tablename = 'bookings'
  ) THEN
    CREATE POLICY "Company admin can update all bookings"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING ((auth.jwt() ->> 'email'::text) = 'admin@homecrew.com'::text);
  END IF;
END $$;

-- Create worker rating update function
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if rating was added/changed and booking is completed
  IF NEW.rating IS NOT NULL AND NEW.status = 'completed' AND 
     (OLD.rating IS NULL OR OLD.rating != NEW.rating) THEN
    
    -- Update worker's rating and total_ratings
    UPDATE workers 
    SET 
      rating = (
        SELECT COALESCE(AVG(rating::numeric), 0)
        FROM bookings 
        WHERE worker_id = NEW.worker_id 
        AND rating IS NOT NULL 
        AND status = 'completed'
      ),
      total_ratings = (
        SELECT COUNT(*)
        FROM bookings 
        WHERE worker_id = NEW.worker_id 
        AND rating IS NOT NULL 
        AND status = 'completed'
      ),
      updated_at = now()
    WHERE id = NEW.worker_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for worker rating updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_worker_rating_trigger'
    AND event_object_table = 'bookings'
  ) THEN
    CREATE TRIGGER update_worker_rating_trigger
      AFTER UPDATE ON bookings
      FOR EACH ROW
      EXECUTE FUNCTION update_worker_rating();
  END IF;
END $$;

-- Insert sample workers data
INSERT INTO workers (name, phone, photo, service, availability, rating, total_ratings, city) VALUES
  ('Rajesh Kumar', '+91-9876543210', '', 'carpenter', true, 4.5, 23, 'Mumbai'),
  ('Suresh Sharma', '+91-9876543211', '', 'plumber', true, 4.2, 18, 'Delhi'),
  ('Amit Patel', '+91-9876543212', '', 'electrician', true, 4.8, 31, 'Bangalore'),
  ('Vikram Singh', '+91-9876543213', '', 'carpenter', true, 4.0, 12, 'Chennai'),
  ('Ravi Gupta', '+91-9876543214', '', 'plumber', true, 4.6, 27, 'Mumbai'),
  ('Deepak Yadav', '+91-9876543215', '', 'electrician', true, 4.3, 15, 'Delhi'),
  ('Manoj Tiwari', '+91-9876543216', '', 'carpenter', true, 4.7, 19, 'Pune'),
  ('Santosh Kumar', '+91-9876543217', '', 'plumber', true, 4.4, 22, 'Bangalore')
ON CONFLICT (id) DO NOTHING;