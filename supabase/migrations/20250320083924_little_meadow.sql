/*
  # Fix profiles table RLS policies

  1. Changes
    - Add policy to allow new users to create their own profile during registration
    
  2. Security
    - Only allows users to insert their own profile
    - Maintains existing RLS policies
*/

-- Drop the policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create the policy
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);