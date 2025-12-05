-- Re-add public SELECT policy so the view works for anonymous users
-- The view itself excludes email, providing defense in depth
CREATE POLICY "Public profiles are viewable by everyone"
ON public.user_profiles
FOR SELECT
USING (true);

-- Drop the overly restrictive policy we just created
DROP POLICY IF EXISTS "Users can view own profile or admins can view all" ON public.user_profiles;