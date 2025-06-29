/*
  # Add sample data for HomeCrew application

  1. Sample Workers
    - Add 10 workers across different cities and services
    - Each worker has proper contact info and ratings
  
  2. Data Safety
    - Uses conditional inserts to avoid duplicates
    - Checks for existing data before inserting
*/

-- Insert sample workers only if the table is empty or specific workers don't exist
DO $$
BEGIN
  -- Check if we already have workers, if not add sample data
  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543210') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Rajesh Kumar', '+91-9876543210', 'carpenter', 'Mumbai', 4.5, 23, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543211') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Suresh Sharma', '+91-9876543211', 'plumber', 'Delhi', 4.2, 18, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543212') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Amit Patel', '+91-9876543212', 'electrician', 'Bangalore', 4.8, 31, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543213') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Vikram Singh', '+91-9876543213', 'carpenter', 'Chennai', 4.0, 12, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543214') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Ravi Gupta', '+91-9876543214', 'plumber', 'Mumbai', 4.6, 27, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543215') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Deepak Yadav', '+91-9876543215', 'electrician', 'Delhi', 4.3, 15, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543216') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Manoj Tiwari', '+91-9876543216', 'carpenter', 'Pune', 4.7, 19, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543217') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Santosh Kumar', '+91-9876543217', 'plumber', 'Bangalore', 4.4, 22, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543218') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Ramesh Gupta', '+91-9876543218', 'electrician', 'Mumbai', 4.9, 35, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543219') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Anil Sharma', '+91-9876543219', 'carpenter', 'Delhi', 4.1, 14, true);
  END IF;

  -- Add more workers for better coverage
  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543220') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Kiran Patel', '+91-9876543220', 'plumber', 'Chennai', 4.5, 20, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543221') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Rohit Verma', '+91-9876543221', 'electrician', 'Pune', 4.6, 25, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543222') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Sanjay Kumar', '+91-9876543222', 'carpenter', 'Kolkata', 4.3, 17, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543223') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Prakash Singh', '+91-9876543223', 'plumber', 'Hyderabad', 4.7, 29, true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM workers WHERE phone = '+91-9876543224') THEN
    INSERT INTO workers (name, phone, service, city, rating, total_ratings, availability) VALUES
      ('Ajay Gupta', '+91-9876543224', 'electrician', 'Kolkata', 4.4, 21, true);
  END IF;

END $$;