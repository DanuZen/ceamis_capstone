-- ==============================================================================
-- CEAMIS 2.0 — Skrip SQL Pemberian Peran Admin (Supabase Auth)
-- ==============================================================================
-- Petunjuk Penggunaan:
-- 1. Buka dashboard Supabase project Anda -> SQL Editor -> New Query.
-- 2. Ganti 'admin@example.com' di bawah ini dengan alamat email akun target.
-- 3. Jalankan kueri ini.
-- 4. Pengguna target saat login berikutnya akan memiliki klaim `role: "admin"`.
-- ==============================================================================

-- 1. Berikan peran 'admin' pada app_metadata (klaim server terproteksi)
UPDATE auth.users
SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';

-- 2. Verifikasi status peran akun
SELECT id, email, raw_app_meta_data->>'role' AS app_role, raw_user_meta_data->>'role' AS user_role, updated_at
FROM auth.users
WHERE email = 'admin@example.com';
