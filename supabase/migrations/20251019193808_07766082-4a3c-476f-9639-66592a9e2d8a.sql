-- Drop restrictive policies on user_profiles
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

-- Create permissive policies for anonymous users on user_profiles
CREATE POLICY "Anyone can insert profiles"
ON public.user_profiles
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
ON public.user_profiles
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Drop restrictive policy on enrichments
DROP POLICY IF EXISTS "Users can manage own enrichments" ON public.enrichments;

-- Create permissive policy for anonymous users on enrichments
CREATE POLICY "Anyone can manage enrichments"
ON public.enrichments
FOR ALL
TO anon
USING (true)
WITH CHECK (true);