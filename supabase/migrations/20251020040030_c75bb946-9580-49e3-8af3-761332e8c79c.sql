-- Enable required extensions for automated event syncing
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule daily sync at 6 AM UTC
SELECT cron.schedule(
  'sync-events-daily',
  '0 6 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://hxsykzhergwulxsayckj.supabase.co/functions/v1/sync-events',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4c3lremhlcmd3dWx4c2F5Y2tqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDA2MTI4NiwiZXhwIjoyMDc1NjM3Mjg2fQ.pCELD3xCHdSuKOa9i01M0zCLEW2wY4Q_KChZGCQmqH4"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);