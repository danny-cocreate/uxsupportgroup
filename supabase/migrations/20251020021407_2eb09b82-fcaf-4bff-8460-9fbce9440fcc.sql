-- Add screenshot_version column for smart cache-busting
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS screenshot_version integer DEFAULT 1;

-- Update existing rows to have version 1
UPDATE public.user_profiles 
SET screenshot_version = 1 
WHERE screenshot_version IS NULL;