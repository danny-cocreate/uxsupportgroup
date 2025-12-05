-- Create a public view that excludes email addresses
CREATE OR REPLACE VIEW public.user_profiles_public AS
SELECT 
  id,
  name,
  job_title,
  company_name,
  bio,
  profile_photo_url,
  linkedin_url,
  slug,
  wall_position_x,
  wall_position_y,
  card_screenshot_url,
  screenshot_generated_at,
  screenshot_version,
  created_at,
  updated_at
FROM public.user_profiles;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.user_profiles_public TO anon, authenticated;

-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;

-- Create new SELECT policy: users can only see their own email (via full table)
-- Admins can see all emails
CREATE POLICY "Users can view own profile or admins can view all"
ON public.user_profiles
FOR SELECT
USING (
  email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)
  OR has_role(auth.uid(), 'admin')
);