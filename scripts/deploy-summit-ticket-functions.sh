#!/usr/bin/env bash
# Deploy Summit 2026 ticket edge functions to Supabase.
# Requires: supabase CLI logged in (`supabase login`) or SUPABASE_ACCESS_TOKEN set.
set -euo pipefail

PROJECT_REF="${SUPABASE_PROJECT_REF:-fhfqfxzwfxquertemdnc}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "Deploying Summit ticket functions to project ${PROJECT_REF}..."
npx supabase functions deploy check-ticket-availability --project-ref "$PROJECT_REF"
npx supabase functions deploy create-checkout --project-ref "$PROJECT_REF"

echo ""
echo "Verify (expect apiVersion 4 and regularRemaining in the response):"
echo "  curl -sS -X POST \"https://${PROJECT_REF}.supabase.co/functions/v1/check-ticket-availability\" \\"
echo "    -H \"Authorization: Bearer \$VITE_SUPABASE_PUBLISHABLE_KEY\" \\"
echo "    -H \"Content-Type: application/json\" | python3 -m json.tool"
