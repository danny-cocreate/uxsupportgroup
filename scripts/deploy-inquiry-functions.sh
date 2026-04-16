#!/usr/bin/env bash
# Deploy public inquiry Edge Functions (must be run against the same Supabase project as VITE_SUPABASE_URL).
set -euo pipefail
cd "$(dirname "$0")/.."

echo "Deploying send-contact-inquiry..."
supabase functions deploy send-contact-inquiry

echo "Deploying send-sponsorship-inquiry..."
supabase functions deploy send-sponsorship-inquiry

echo "Done. Ensure secrets are set on the project: RESEND_API_KEY, EMAIL_FROM (optional), SUPABASE_* are injected by Supabase."
