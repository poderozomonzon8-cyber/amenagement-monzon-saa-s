-- Create leads table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  service_type VARCHAR(100) NOT NULL,
  description TEXT,
  budget VARCHAR(50),
  preferred_date DATE,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Add overlay_intensity column to website_heroes if it doesn't exist
ALTER TABLE IF EXISTS public.website_heroes ADD COLUMN IF NOT EXISTS overlay_intensity NUMERIC(3,2) DEFAULT 0.5;
