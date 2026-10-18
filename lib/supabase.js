import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let cachedClient = null;

/**
 * Creates and returns a server-only Supabase client with the service role key.
 *
 * ⚠️ WARNING:
 * - This client has full administrative access and bypasses Row Level Security (RLS).
 * - NEVER import or expose this module in React Client Components ('use client').
 * - The 'server-only' package guarantees a build-time error if imported in client code.
 */
export function getSupabaseServerClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing Supabase server credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.'
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }

  return cachedClient;
}

/**
 * Lazily-evaluated Supabase client proxy for convenient direct access (e.g. `supabaseServer.from(...)`).
 */
export const supabaseServer = new Proxy(
  {},
  {
    get(_target, prop) {
      const client = getSupabaseServerClient();
      const value = client[prop];
      return typeof value === 'function' ? value.bind(client) : value;
    },
  }
);

export default supabaseServer;
