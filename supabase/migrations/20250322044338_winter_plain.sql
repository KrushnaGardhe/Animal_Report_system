/*
  # Fix report update policies

  1. Changes
    - Add policy to allow authenticated users to update reports
    - Ensure proper RLS configuration for report updates
    
  2. Security
    - Maintain existing RLS policies
    - Add specific policy for report status updates
*/

-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "NGOs can update reports" ON reports;

-- Create new update policy
CREATE POLICY "NGOs can update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;