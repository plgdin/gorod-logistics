import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '')
  .trim()
  .replace(/\/+$/, '');
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key-here')
);

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export interface DbHealth {
  ok: boolean;
  message: string;
  detail?: string;
}

/**
 * Real connectivity check — not just "are the env vars set".
 * Requires a signed-in session because every table is behind RLS.
 */
export async function checkSupabaseHealth(): Promise<DbHealth> {
  if (!isSupabaseConfigured) {
    return { ok: false, message: 'Credentials missing' };
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    return { ok: false, message: 'Auth error', detail: sessionError.message };
  }
  if (!sessionData.session) {
    return { ok: false, message: 'Not signed in' };
  }

  const { error } = await supabase
    .from('dashboard_jobs')
    .select('id', { count: 'exact', head: true });

  if (error) {
    if (error.code === 'PGRST205' || error.message.includes('does not exist')) {
      return {
        ok: false,
        message: 'Schema not installed',
        detail: 'Run supabase_live_setup.sql in the Supabase SQL Editor.',
      };
    }
    if (error.code === '42501' || error.code === 'PGRST301') {
      return { ok: false, message: 'Blocked by RLS', detail: error.message };
    }
    return { ok: false, message: 'Database error', detail: error.message };
  }

  return { ok: true, message: 'PostgreSQL Live' };
}
