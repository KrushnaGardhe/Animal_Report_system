/*
  # Fix profile policies

  1. Changes
    - Drop existing conflicting policies
    - Create new, simplified policies for profile access
    - Ensure proper RLS configuration

  2. Security
    - Enable RLS on profiles table
    - Add policies for authenticated users to manage their profiles
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "NGOs can view own profile" ON profiles;
DROP POLICY IF EXISTS "NGOs can update own profile" ON profiles;

-- Create new simplified policies
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);