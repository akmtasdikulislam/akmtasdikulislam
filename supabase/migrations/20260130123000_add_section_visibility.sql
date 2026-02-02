CREATE TABLE IF NOT EXISTS section_visibility (
    section_key TEXT PRIMARY KEY,
    is_visible BOOLEAN DEFAULT TRUE
);

INSERT INTO section_visibility (section_key, is_visible)
VALUES 
    ('certifications', TRUE),
    ('testimonials', TRUE),
    ('work_history', TRUE)
ON CONFLICT (section_key) DO NOTHING;

-- Enable RLS (Optional but good practice)
ALTER TABLE section_visibility ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Public can view section visibility" 
ON section_visibility FOR SELECT 
USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Authenticated users can update section visibility" 
ON section_visibility FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert (for initial setup if needed)
CREATE POLICY "Authenticated users can insert section visibility" 
ON section_visibility FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');
