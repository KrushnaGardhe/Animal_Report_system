/*
  # Update profiles table structure

  1. Changes
    - Add missing columns to profiles table
    - Add registration_number column
    - Add description column
    - Add address column
    
  2. Security
    - Maintains existing RLS policies
*/

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS registration_number text,
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS address text;