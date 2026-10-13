-- ═══════════════════════════════════════════════════════════════════
-- CEAMIS 2.0 — Migrasi 002: Persetujuan Partisipan (Informed Consent)
-- Tugas F3: Pencatatan Persetujuan Partisipan Penelitian & Penarikan Izin
-- ═══════════════════════════════════════════════════════════════════
-- CATATAN: File migrasi ini bersifat IDEMPOTEN.
-- DILARANG menjalankan file ini langsung ke database produksi tanpa izin pengguna.
-- Pengguna dapat menerapkan skrip ini melalui Supabase SQL Editor atau CLI:
--   supabase db push / psql < 002_consent_records.sql
-- ═══════════════════════════════════════════════════════════════════

-- 1. Tabel consent_records (Riwayat Persetujuan Partisipan)
CREATE TABLE IF NOT EXISTS public.consent_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    consent_version VARCHAR(20) NOT NULL DEFAULT 'v1.0',
    purpose TEXT NOT NULL DEFAULT 'Penelitian tesis evaluasi efektivitas intervensi pra-pembelian CEAMIS',
    given BOOLEAN NOT NULL DEFAULT TRUE,
    given_at TIMESTAMPTZ,
    withdrawn_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Indeks Performa & Pencarian Status
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id 
    ON public.consent_records(user_id);

CREATE INDEX IF NOT EXISTS idx_consent_records_given 
    ON public.consent_records(user_id, given);

CREATE INDEX IF NOT EXISTS idx_consent_records_created_at 
    ON public.consent_records(created_at DESC);

-- 3. Row-Level Security (RLS)
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;

-- Kebijakan 1: Partisipan hanya dapat melihat riwayat persetujuannya sendiri
DROP POLICY IF EXISTS "Users can read own consent records" ON public.consent_records;
CREATE POLICY "Users can read own consent records"
    ON public.consent_records
    FOR SELECT
    USING (auth.uid() = user_id);

-- Kebijakan 2: Partisipan dapat mencatat persetujuan baru atas namanya
DROP POLICY IF EXISTS "Users can insert own consent records" ON public.consent_records;
CREATE POLICY "Users can insert own consent records"
    ON public.consent_records
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Kebijakan 3: Partisipan dapat memperbarui status penarikan persetujuan miliknya
DROP POLICY IF EXISTS "Users can update own consent records" ON public.consent_records;
CREATE POLICY "Users can update own consent records"
    ON public.consent_records
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Kebijakan 4: Pengguna berperan admin dapat membaca seluruh rekapitulasi persetujuan untuk audit etika penelitian
DROP POLICY IF EXISTS "Admins can view all consent records" ON public.consent_records;
CREATE POLICY "Admins can view all consent records"
    ON public.consent_records
    FOR SELECT
    USING (
        (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
        OR (auth.jwt() ->> 'role') = 'admin'
    );
