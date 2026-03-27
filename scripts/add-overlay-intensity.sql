-- Add overlay_intensity column to website_heroes table
-- This allows adjusting the shadow/overlay darkness on hero images in the CMS

ALTER TABLE website_heroes 
ADD COLUMN IF NOT EXISTS overlay_intensity DECIMAL(3,2) DEFAULT 0.5;

-- Add comment for documentation
COMMENT ON COLUMN website_heroes.overlay_intensity IS 'Controls the darkness of the overlay on hero images. 0 = no overlay, 1 = fully dark. Default is 0.5.';
