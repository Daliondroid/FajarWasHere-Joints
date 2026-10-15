/**
 * Klien Supabase sisi server (service role, melewati RLS). JANGAN diimpor dari komponen klien.
 * RLS aktif tanpa policy (T-03), jadi semua akses DB hanya lewat route handler.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ApiGalat } from '@/lib/api/galat';

let klien: SupabaseClient | null = null;

export function supabaseServer(): SupabaseClient {
  if (typeof window !== 'undefined') throw new Error('supabaseServer hanya boleh dipakai di server.');
  if (klien) return klien;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !kunci) {
    throw new ApiGalat('SERVER', 'Konfigurasi Supabase belum lengkap (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).');
  }
  klien = createClient(url, kunci, { auth: { persistSession: false, autoRefreshToken: false } });
  return klien;
}
