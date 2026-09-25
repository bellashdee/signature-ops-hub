import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — full database + auth-admin access, bypassing RLS.
 * Only ever import this from Server Actions. Never expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser (it isn't NEXT_PUBLIC_-prefixed, so Next.js already keeps it server-only).
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set — add it to .env.local (server-only).");
  }
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
