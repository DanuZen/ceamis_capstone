-- ==============================================================================
-- CEAMIS 2.0 — Migrasi SQL Skema Pra-Pembelian & Tata Kelola Model (F1)
-- Berdasarkan: backend/app/models/pre_purchase.py & docs/ceamis 2.0/DATABASE_SCHEMA.md
-- ==============================================================================
-- PERHATIAN:
-- JANGAN MENGEKSEKUSI FILE INI SECARA OTOMATIS KE BASIS DATA PRODUKSI.
-- Pengguna dapat menerapkan migrasi ini melalui Supabase SQL Editor atau CLI.
-- ==============================================================================

-- Pastikan ekstensi pgcrypto aktif untuk gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. Tabel model_versions (Model ML Registry & Governance)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag VARCHAR(50) NOT NULL UNIQUE,
    algorithm VARCHAR(50) NOT NULL,
    precision_score NUMERIC(5, 4),
    recall_score NUMERIC(5, 4),
    f1_score NUMERIC(5, 4),
    roc_auc_score NUMERIC(5, 4),
    artifact_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE NOT NULL,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    deployed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_model_versions_active 
    ON public.model_versions(is_active);

CREATE INDEX IF NOT EXISTS idx_model_versions_tag 
    ON public.model_versions(version_tag);

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. Tabel pre_purchase_checks (Permintaan Evaluasi Risiko Pra-Pembelian)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pre_purchase_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL,
    planned_amount NUMERIC(15, 2) NOT NULL CHECK (planned_amount > 0),
    merchant_name VARCHAR(100),
    notes TEXT,
    user_decision VARCHAR(20) DEFAULT 'PENDING' NOT NULL 
        CHECK (user_decision IN ('PROCEED', 'ADJUST', 'POSTPONE', 'PENDING')),
    decided_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pre_purchase_checks_user_created 
    ON public.pre_purchase_checks(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pre_purchase_checks_decision 
    ON public.pre_purchase_checks(user_decision);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. Tabel risk_predictions (Hasil Inferensi Model Risiko & Fitur Kontekstual)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.risk_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL UNIQUE REFERENCES public.pre_purchase_checks(id) ON DELETE CASCADE,
    model_version_id UUID REFERENCES public.model_versions(id) ON DELETE SET NULL,
    risk_score NUMERIC(5, 4) NOT NULL CHECK (risk_score >= 0 AND risk_score <= 1),
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    features_snapshot JSONB NOT NULL,
    trigger_factors JSONB NOT NULL,
    budget_remaining_before NUMERIC(15, 2) NOT NULL,
    budget_remaining_after NUMERIC(15, 2) NOT NULL,
    savings_delayed_days INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_check_id 
    ON public.risk_predictions(check_id);

CREATE INDEX IF NOT EXISTS idx_risk_predictions_level 
    ON public.risk_predictions(risk_level);

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. Tabel post_decision_feedbacks (Ground Truth Pasca-Keputusan)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.post_decision_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL UNIQUE REFERENCES public.pre_purchase_checks(id) ON DELETE CASCADE,
    was_impulsive BOOLEAN NOT NULL,
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
    feedback_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_post_decision_feedbacks_check_id 
    ON public.post_decision_feedbacks(check_id);

CREATE INDEX IF NOT EXISTS idx_post_decision_feedbacks_impulsive 
    ON public.post_decision_feedbacks(was_impulsive);

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. Tabel audit_logs (Log Tata Kelola Admin & Intervensi)
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_created 
    ON public.audit_logs(actor_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action 
    ON public.audit_logs(action);

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. Kebijakan Row-Level Security (RLS)
-- ──────────────────────────────────────────────────────────────────────────────

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.model_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_purchase_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_decision_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 6.1 RLS pre_purchase_checks: Pengguna hanya dapat mengakses dan mengelola datanya sendiri
DROP POLICY IF EXISTS "Users can read own pre_purchase_checks" ON public.pre_purchase_checks;
CREATE POLICY "Users can read own pre_purchase_checks"
    ON public.pre_purchase_checks
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pre_purchase_checks" ON public.pre_purchase_checks;
CREATE POLICY "Users can insert own pre_purchase_checks"
    ON public.pre_purchase_checks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pre_purchase_checks" ON public.pre_purchase_checks;
CREATE POLICY "Users can update own pre_purchase_checks"
    ON public.pre_purchase_checks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6.2 RLS risk_predictions: Pengguna hanya dapat membaca hasil prediksi cek miliknya
DROP POLICY IF EXISTS "Users can read own risk_predictions" ON public.risk_predictions;
CREATE POLICY "Users can read own risk_predictions"
    ON public.risk_predictions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pre_purchase_checks c
            WHERE c.id = risk_predictions.check_id
              AND c.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert risk_predictions for own check" ON public.risk_predictions;
CREATE POLICY "Users can insert risk_predictions for own check"
    ON public.risk_predictions
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pre_purchase_checks c
            WHERE c.id = risk_predictions.check_id
              AND c.user_id = auth.uid()
        )
    );

-- 6.3 RLS post_decision_feedbacks: Pengguna hanya dapat mengisi & membaca feedback cek miliknya
DROP POLICY IF EXISTS "Users can read own feedback" ON public.post_decision_feedbacks;
CREATE POLICY "Users can read own feedback"
    ON public.post_decision_feedbacks
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.pre_purchase_checks c
            WHERE c.id = post_decision_feedbacks.check_id
              AND c.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert own feedback" ON public.post_decision_feedbacks;
CREATE POLICY "Users can insert own feedback"
    ON public.post_decision_feedbacks
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pre_purchase_checks c
            WHERE c.id = post_decision_feedbacks.check_id
              AND c.user_id = auth.uid()
        )
    );

-- 6.4 RLS model_versions: Seluruh pengguna terautentikasi dapat melihat versi aktif, admin memiliki akses penuh
DROP POLICY IF EXISTS "Authenticated users can read model_versions" ON public.model_versions;
CREATE POLICY "Authenticated users can read model_versions"
    ON public.model_versions
    FOR SELECT
    TO authenticated
    USING (TRUE);

DROP POLICY IF EXISTS "Admins can manage model_versions" ON public.model_versions;
CREATE POLICY "Admins can manage model_versions"
    ON public.model_versions
    FOR ALL
    TO authenticated
    USING (
        auth.jwt()->'app_metadata'->>'role' = 'admin' 
        OR auth.jwt()->'user_metadata'->>'role' = 'admin'
    )
    WITH CHECK (
        auth.jwt()->'app_metadata'->>'role' = 'admin' 
        OR auth.jwt()->'user_metadata'->>'role' = 'admin'
    );

-- 6.5 RLS audit_logs: Hanya administrator yang dapat membaca dan menulis log audit
DROP POLICY IF EXISTS "Admins can manage audit_logs" ON public.audit_logs;
CREATE POLICY "Admins can manage audit_logs"
    ON public.audit_logs
    FOR ALL
    TO authenticated
    USING (
        auth.jwt()->'app_metadata'->>'role' = 'admin' 
        OR auth.jwt()->'user_metadata'->>'role' = 'admin'
    )
    WITH CHECK (
        auth.jwt()->'app_metadata'->>'role' = 'admin' 
        OR auth.jwt()->'user_metadata'->>'role' = 'admin'
    );
