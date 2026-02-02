-- Add certificate_image column to certifications table
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS certificate_image TEXT DEFAULT NULL;
