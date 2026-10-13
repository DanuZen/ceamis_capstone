-- ==============================================================================
-- CEAMIS 2.0 — Migrasi SQL Telemetri Pra-Pembelian: Decision Latency (Tugas F10)
-- Berdasarkan: docs/AGENT_PERBAIKAN.md § TUGAS F10
-- ==============================================================================
-- PERHATIAN:
-- JANGAN MENGEKSEKUSI FILE INI SECARA OTOMATIS KE BASIS DATA PRODUKSI.
-- Pengguna dapat menerapkan migrasi ini melalui Supabase SQL Editor atau CLI.
-- ==============================================================================

-- 1. Tambah kolom decision_latency_ms ke tabel pre_purchase_checks
ALTER TABLE public.pre_purchase_checks
ADD COLUMN IF NOT EXISTS decision_latency_ms INTEGER;

-- 2. Dokumentasi kolom untuk audit data penelitian
COMMENT ON COLUMN public.pre_purchase_checks.decision_latency_ms IS 
'Waktu jeda refleksi (dalam milidetik) antara tampilan evaluasi risiko hingga keputusan pengguna dipilih. Hanya dicatat jika pengguna memiliki persetujuan penelitian aktif (F3).';

-- 3. Indeks parsial untuk analisis telemetri keputusan yang telah diberi izin
CREATE INDEX IF NOT EXISTS idx_pre_purchase_checks_decision_latency
    ON public.pre_purchase_checks(decision_latency_ms)
    WHERE decision_latency_ms IS NOT NULL;
