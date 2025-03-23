/*
  # Fix NGO Dashboard Policies

  1. Changes
    - Update RLS policies for reports table
    - Add specific policies for NGO actions
    - Ensure proper authentication checks
    
  2. Security
    - Allow authenticated NGOs to update report status
    - Maintain data integrity and security
    - Keep existing public access policies
*/

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "NGOs can update reports" ON reports;
DROP POLICY IF EXISTS "NGOs can view all reports" ON reports;

-- Create new policies with proper authentication checks
CREATE POLICY "NGOs can view all reports"
  ON reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "NGOs can update reports"
  ON reports
  FOR UPDATE
  TO authenticated
  USING (
    (auth.role() = 'authenticated') AND 
    (
      status = 'pending' OR 
      (status IN ('accepted', 'declined') AND ngo_id = auth.uid())
    )
  )
  WITH CHECK (
    (auth.role() = 'authenticated') AND 
    (status IN ('accepted', 'declined'))
  );