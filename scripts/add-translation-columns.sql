-- Add translation columns to website_heroes table
ALTER TABLE website_heroes
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_es TEXT,
ADD COLUMN IF NOT EXISTS cta_text_en TEXT,
ADD COLUMN IF NOT EXISTS cta_text_es TEXT;

-- Add translation columns to testimonials table
ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS comment_en TEXT,
ADD COLUMN IF NOT EXISTS comment_es TEXT,
ADD COLUMN IF NOT EXISTS client_name_en TEXT,
ADD COLUMN IF NOT EXISTS client_name_es TEXT,
ADD COLUMN IF NOT EXISTS client_role_en TEXT,
ADD COLUMN IF NOT EXISTS client_role_es TEXT;

-- Add translation columns to website_about table
ALTER TABLE website_about
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS team_bio_en TEXT,
ADD COLUMN IF NOT EXISTS team_bio_es TEXT;

-- Add language preference to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'en';

-- Add language preference to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(5) DEFAULT 'en';
