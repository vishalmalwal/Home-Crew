/*
  # Create admin user and sample data

  1. Create admin user in auth.users
  2. Ensure sample workers exist
  3. Set up proper permissions
*/

-- Insert admin user if not exists
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@homecrew.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "HomeCrew Admin", "role": "company"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Ensure we have sample workers
INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
  ('Rajesh Kumar', '+91-9876543210', 'carpenter', 'Mumbai', 4.5, 23, true),
  ('Suresh Sharma', '+91-9876543211', 'plumber', 'Delhi', 4.2, 18, true),
  ('Amit Patel', '+91-9876543212', 'electrician', 'Bangalore', 4.8, 31, true),
  ('Vikram Singh', '+91-9876543213', 'carpenter', 'Chennai', 4.0, 12, true),
  ('Ravi Gupta', '+91-9876543214', 'plumber', 'Mumbai', 4.6, 27, true),
  ('Deepak Yadav', '+91-9876543215', 'electrician', 'Delhi', 4.3, 15, true),
  ('Manoj Tiwari', '+91-9876543216', 'carpenter', 'Pune', 4.7, 19, true),
  ('Santosh Kumar', '+91-9876543217', 'plumber', 'Bangalore', 4.4, 22, true),
  ('Ramesh Gupta', '+91-9876543218', 'electrician', 'Mumbai', 4.9, 35, true),
  ('Anil Sharma', '+91-9876543219', 'carpenter', 'Delhi', 4.1, 14, true)
ON CONFLICT (phone) DO NOTHING;