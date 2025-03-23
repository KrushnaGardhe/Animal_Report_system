/*
  # Fix RLS policies for storage and reports

  1. Changes
    - Update storage bucket policies to allow anonymous uploads
    - Update reports table policies to allow anonymous inserts
    - Ensure proper public access to storage objects
    
  2. Security
    - Allow public access to view and upload images
    - Allow anonymous users to create reports
    - Maintain existing security for NGO operations
*/

-- Insert the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'animal-images',
  'animal-images',
  true,
  5242880, -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Update storage policies
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  DROP POLICY IF EXISTS "Public Upload Access" ON storage.objects;
  
  -- Create new policies
  CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'animal-images');

  CREATE POLICY "Public Upload Access"
    ON storage.objects FOR INSERT
    TO public
    WITH CHECK (bucket_id = 'animal-images');
END $$;

-- Update reports table policies
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Anyone can create reports" ON reports;
  DROP POLICY IF EXISTS "Public can view reports" ON reports;
  
  -- Create new policies
  CREATE POLICY "Anyone can create reports"
    ON reports FOR INSERT
    TO public
    WITH CHECK (true);

  CREATE POLICY "Public can view reports"
    ON reports FOR SELECT
    TO public
    USING (true);
END $$;