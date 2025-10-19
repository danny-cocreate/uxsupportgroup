-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Create policies for profile photo uploads
CREATE POLICY "Anyone can view profile photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can upload profile photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can update their profile photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-photos');

CREATE POLICY "Anyone can delete their profile photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-photos');