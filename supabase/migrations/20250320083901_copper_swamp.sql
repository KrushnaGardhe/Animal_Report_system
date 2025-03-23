/*
  # Animal Rescue System Schema

  1. New Tables
    - `reports`
      - `id` (uuid, primary key)
      - `description` (text)
      - `latitude` (float)
      - `longitude` (float)
      - `image_url` (text)
      - `status` (text) - can be 'pending', 'accepted', 'declined'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `ngo_id` (uuid, foreign key) - references profiles.id
    
    - `profiles` (for NGOs)
      - `id` (uuid, primary key)
      - `name` (text)
      - `organization` (text)
      - `phone` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public can create reports
    - Only authenticated NGOs can view and update reports
    - NGOs can only view their own profile
*/

-- Create profiles table for NGOs if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  organization text NOT NULL,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  image_url text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ngo_id uuid REFERENCES profiles(id)
);

-- Enable RLS
DO $$ 
BEGIN
  -- Enable RLS for profiles if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS for reports if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'reports' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Profiles policies
  DROP POLICY IF EXISTS "NGOs can view own profile" ON profiles;
  DROP POLICY IF EXISTS "NGOs can update own profile" ON profiles;
  
  -- Reports policies
  DROP POLICY IF EXISTS "Anyone can create reports" ON reports;
  DROP POLICY IF EXISTS "NGOs can view all reports" ON reports;
  DROP POLICY IF EXISTS "NGOs can update reports" ON reports;
END $$;

-- Create new policies
-- Policies for profiles
CREATE POLICY "NGOs can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "NGOs can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for reports
CREATE POLICY "Anyone can create reports"
  ON reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "NGOs can view all reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (true);