/*
  # HomeCrew Database Schema

  1. New Tables
    - `workers`
      - `id` (uuid, primary key)
      - `name` (text)
      - `phone` (text)
      - `photo` (text, optional)
      - `service` (text, enum: carpenter, plumber, electrician)
      - `availability` (boolean)
      - `rating` (numeric)
      - `total_ratings` (integer)
      - `city` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bookings`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, references auth.users)
      - `customer_name` (text)
      - `customer_phone` (text)
      - `customer_email` (text)
      - `worker_id` (uuid, references workers)
      - `worker_name` (text)
      - `service` (text)
      - `problem` (text)
      - `description` (text)
      - `date` (text)
      - `time_slot` (text)
      - `address` (text)
      - `city` (text)
      - `is_emergency` (boolean)
      - `status` (text, enum: pending, confirmed, in-progress, completed, cancelled)
      - `rating` (integer, optional)
      - `review` (text, optional)
      - `created_at` (timestamp)
      - `confirmed_at` (timestamp, optional)
      - `completed_at` (timestamp, optional)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
    - Company admin can manage workers and all bookings
    - Customers can only see their own bookings
*/

-- Create workers table
CREATE TABLE IF NOT EXISTS workers (
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
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES auth.users(id),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text NOT NULL,
  worker_id uuid REFERENCES workers(id),
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
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Workers policies
CREATE POLICY "Anyone can view available workers"
  ON workers
  FOR SELECT
  TO authenticated
  USING (availability = true);

CREATE POLICY "Company admin can manage workers"
  ON workers
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@homecrew.com');

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Users can create their own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Company admin can view all bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@homecrew.com');

CREATE POLICY "Company admin can update all bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@homecrew.com');

-- Insert sample workers
INSERT INTO workers (name, phone, service, city, rating, total_ratings) VALUES
  ('Rajesh Kumar', '+91-9876543210', 'carpenter', 'Mumbai', 4.5, 23),
  ('Suresh Sharma', '+91-9876543211', 'plumber', 'Delhi', 4.2, 18),
  ('Amit Patel', '+91-9876543212', 'electrician', 'Bangalore', 4.8, 31),
  ('Vikram Singh', '+91-9876543213', 'carpenter', 'Chennai', 4.0, 12),
  ('Ravi Gupta', '+91-9876543214', 'plumber', 'Mumbai', 4.6, 27),
  ('Deepak Yadav', '+91-9876543215', 'electrician', 'Delhi', 4.3, 15);

-- Create function to update worker ratings
CREATE OR REPLACE FUNCTION update_worker_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.rating IS NOT NULL AND OLD.rating IS NULL THEN
    UPDATE workers 
    SET 
      total_ratings = total_ratings + 1,
      rating = (rating * total_ratings + NEW.rating) / (total_ratings + 1)
    WHERE id = NEW.worker_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rating updates
CREATE TRIGGER update_worker_rating_trigger
  AFTER UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_worker_rating();