-- ═══════════════════════════════════════════════════════════════
-- CEAMIS — Supabase Database Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension (sudah aktif di Supabase by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ───────────────────────────────────────────────────────────────
-- TABLE 1: user_profiles
-- Extends Supabase auth.users dengan data profil aplikasi
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name                  TEXT,
  email                 TEXT,
  phone                 TEXT,
  avatar_url            TEXT,

  -- Gamifikasi
  level                 INTEGER NOT NULL DEFAULT 1,
  xp                    INTEGER NOT NULL DEFAULT 0,
  streak                INTEGER NOT NULL DEFAULT 0,
  last_active           TIMESTAMPTZ,
  label                 TEXT NOT NULL DEFAULT 'Pemula',
  unlocked_badges       TEXT[] DEFAULT '{}',

  -- AI Output
  health_score          NUMERIC(5, 2) NOT NULL DEFAULT 75.0,
  warning_triggered     BOOLEAN NOT NULL DEFAULT false,
  risk_profile          TEXT CHECK (risk_profile IN ('konservatif', 'moderat', 'agresif')),

  -- Onboarding
  onboarding_completed  BOOLEAN NOT NULL DEFAULT false,

  -- Timestamps
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: jalankan function saat user baru daftar
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ───────────────────────────────────────────────────────────────
-- TABLE 2: transactions
-- Riwayat transaksi keuangan user
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  description  TEXT NOT NULL,
  amount       NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  type         TEXT NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
  category     TEXT NOT NULL,
  tag          TEXT CHECK (tag IN ('needs', 'wants')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index untuk query cepat per user
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- Auto-update streak user setiap ada transaksi baru
CREATE OR REPLACE FUNCTION public.update_user_streak_on_transaction()
RETURNS TRIGGER AS $$
DECLARE
  today_str TEXT := TO_CHAR(NOW(), 'YYYY-MM-DD');
  last_active_str TEXT;
  yesterday_str TEXT := TO_CHAR(NOW() - INTERVAL '1 day', 'YYYY-MM-DD');
  current_streak INTEGER;
BEGIN
  SELECT streak, TO_CHAR(last_active, 'YYYY-MM-DD')
    INTO current_streak, last_active_str
    FROM public.user_profiles
    WHERE id = NEW.user_id;

  -- Hanya update jika belum ada transaksi hari ini
  IF last_active_str IS DISTINCT FROM today_str THEN
    IF last_active_str = yesterday_str THEN
      UPDATE public.user_profiles
        SET streak = current_streak + 1, last_active = NOW(), updated_at = NOW()
        WHERE id = NEW.user_id;
    ELSE
      UPDATE public.user_profiles
        SET streak = 1, last_active = NOW(), updated_at = NOW()
        WHERE id = NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_transaction_created
  AFTER INSERT ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_user_streak_on_transaction();


-- ───────────────────────────────────────────────────────────────
-- TABLE 3: onboarding_data
-- Data 5-step onboarding dari halaman /onboarding
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.onboarding_data (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,

  -- Step 1: Kenalan
  name              TEXT NOT NULL,
  age               INTEGER NOT NULL CHECK (age BETWEEN 10 AND 100),

  -- Step 2: Pendapatan
  income            NUMERIC(15, 2) NOT NULL CHECK (income > 0),
  income_source     TEXT NOT NULL CHECK (income_source IN ('gaji', 'freelance', 'bisnis', 'uang_saku')),

  -- Step 3: Pengeluaran
  top_expenses      TEXT[] NOT NULL DEFAULT '{}',
  monthly_expense   NUMERIC(15, 2) NOT NULL CHECK (monthly_expense >= 0),

  -- Step 4: Tujuan Finansial
  goals             TEXT[] NOT NULL DEFAULT '{}',

  -- Step 5: Profil Risiko
  risk_profile      TEXT NOT NULL CHECK (risk_profile IN ('konservatif', 'moderat', 'agresif')),

  -- Computed
  savings_ratio     INTEGER NOT NULL DEFAULT 0, -- persentase 0-100

  completed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON public.onboarding_data(user_id);


-- ───────────────────────────────────────────────────────────────
-- TABLE 4: warnings
-- Peringatan finansial yang dihasilkan oleh rule engine / AI
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.warnings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  message      TEXT NOT NULL,
  tip          TEXT,
  severity     TEXT NOT NULL CHECK (severity IN ('high', 'medium', 'low')),
  is_resolved  BOOLEAN NOT NULL DEFAULT false,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_warnings_user_id ON public.warnings(user_id);
CREATE INDEX IF NOT EXISTS idx_warnings_is_resolved ON public.warnings(is_resolved);


-- ───────────────────────────────────────────────────────────────
-- TABLE 5: debt_records
-- Catatan utang piutang user
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.debt_records (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('hutang', 'piutang')),
  person_name  TEXT NOT NULL,
  amount       NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  description  TEXT,
  due_date     DATE,
  is_paid      BOOLEAN NOT NULL DEFAULT false,
  paid_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_debt_records_user_id ON public.debt_records(user_id);

CREATE TRIGGER debt_records_updated_at
  BEFORE UPDATE ON public.debt_records
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ───────────────────────────────────────────────────────────────
-- TABLE 6: planning
-- Perencanaan keuangan / budget user
-- ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.planning (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  target_amount   NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deadline        DATE,
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_planning_user_id ON public.planning(user_id);

CREATE TRIGGER planning_updated_at
  BEFORE UPDATE ON public.planning
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ───────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — Setiap user hanya bisa akses datanya sendiri
-- ───────────────────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planning ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- transactions policies
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- onboarding_data policies
CREATE POLICY "Users can view own onboarding"
  ON public.onboarding_data FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own onboarding"
  ON public.onboarding_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding"
  ON public.onboarding_data FOR UPDATE
  USING (auth.uid() = user_id);

-- warnings policies
CREATE POLICY "Users can view own warnings"
  ON public.warnings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own warnings"
  ON public.warnings FOR UPDATE
  USING (auth.uid() = user_id);

-- debt_records policies
CREATE POLICY "Users can view own debt records"
  ON public.debt_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own debt records"
  ON public.debt_records FOR ALL
  USING (auth.uid() = user_id);

-- planning policies
CREATE POLICY "Users can manage own planning"
  ON public.planning FOR ALL
  USING (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────
-- SERVICE ROLE BYPASS (untuk NestJS backend pakai service_role_key)
-- Policies ini membolehkan backend melewati RLS
-- ───────────────────────────────────────────────────────────────
CREATE POLICY "Service role bypass user_profiles"
  ON public.user_profiles FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role bypass transactions"
  ON public.transactions FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role bypass onboarding"
  ON public.onboarding_data FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role bypass warnings"
  ON public.warnings FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role bypass debt"
  ON public.debt_records FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role bypass planning"
  ON public.planning FOR ALL
  TO service_role USING (true) WITH CHECK (true);
