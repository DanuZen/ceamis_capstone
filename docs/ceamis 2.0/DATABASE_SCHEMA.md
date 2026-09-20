# Skema Database PostgreSQL — CEAMIS 2.0

> **Platform:** Supabase Cloud (PostgreSQL 15+)  
> **ORM Backend:** SQLAlchemy 2.0 (AsyncPG)  
> **Keamanan:** Row-Level Security (RLS) & Relasi Integritas Foreign Keys  

---

## 1. Diagram Relasi Entitas (ERD)

```text
┌────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│  auth.users    │ 1      1 │     public.users     │ 1      * │  public.transactions │
│ (Supabase Auth)│──────────│ (Profil & Preferensi)│──────────│ (Pencatatan Belanja) │
└────────────────┘          └──────────┬───────────┘          └──────────┬───────────┘
                                       │ 1                               │ *
                                       │                                 │
                                       │ 1    *                          │ 1
                        ┌──────────────┴─────────────┐        ┌──────────┴───────────┐
                        │      public.budgets        │        │  public.categories   │
                        │ (Pagu Anggaran Bulanan)    │────────│  (Kategori Transaksi)│
                        └────────────────────────────┘ *    1 └──────────┬───────────┘
                                       │ 1                               │ 1
                                       │                                 │
                                       │ 1    *                          │ *
                        ┌──────────────┴─────────────┐        ┌──────────┴───────────┐
                        │       public.goals         │        │ public.pre_purchase_ │
                        │  (Target Tabungan User)    │        │        checks        │
                        └────────────────────────────┘        │  (★ Log Pra-Beli)    │
                                                              └──────────┬───────────┘
                                                                         │ 1
                                                                         │
                                                                         │ 1
                                                              ┌──────────┴───────────┐
                                                              │ public.risk_         │
                                                              │      predictions     │
                                                              │ (Hasil Inferensi ML) │
                                                              └──────────┬───────────┘
                                                                         │ 1
                                                                         │
                                                                         │ 0..1
                                                              ┌──────────┴───────────┐
                                                              │ public.post_decision_│
                                                              │      feedbacks       │
                                                              │ (Label Ground Truth) │
                                                              └──────────────────────┘
```

---

## 2. Struktur Tabel Lengkap

### 2.1 Tabel `users` (Profil Pengguna)
Sinkronisasi otomatis dengan `auth.users` Supabase saat pendaftaran.

```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    monthly_income NUMERIC(15, 2) DEFAULT 0.00,
    budget_reset_day INT DEFAULT 1 CHECK (budget_reset_day BETWEEN 1 AND 28),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Tabel `categories` (Kategori Transaksi)
Menampung kategori pengeluaran dan pemasukan dengan tag klasifikasi *Need vs Want*.

```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- NULL jika kategori sistem default
    name VARCHAR(50) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    is_need BOOLEAN DEFAULT TRUE, -- TRUE = Kebutuhan (50%), FALSE = Keinginan (30%)
    icon VARCHAR(50) DEFAULT 'wallet',
    color_hex VARCHAR(10) DEFAULT '#A3E635',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Tabel `budgets` (Pagu Anggaran Kategori)

```sql
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    amount_limit NUMERIC(15, 2) NOT NULL CHECK (amount_limit > 0),
    period_month INT NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    period_year INT NOT NULL CHECK (period_year >= 2026),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_category_period UNIQUE (user_id, category_id, period_month, period_year)
);
```

### 2.4 Tabel `goals` (Target Tabungan Finansial)

```sql
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(15, 2) DEFAULT 0.00 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.5 Tabel `transactions` (Pencatatan Belanja & Pemasukan)

```sql
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    is_ocr_scanned BOOLEAN DEFAULT FALSE,
    receipt_image_url TEXT,
    pre_purchase_check_id UUID, -- Relasi opsional jika transaksi berakar dari cek pra-beli
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Skema Khusus Fitur Inti Pra-Pembelian & AI

### 3.1 Tabel `model_versions` (Registry Model ML)

```sql
CREATE TABLE public.model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_tag VARCHAR(50) NOT NULL UNIQUE, -- Contoh: 'v1.0.0-logreg', 'v1.1.0-rf'
    algorithm VARCHAR(50) NOT NULL,          -- 'LogisticRegression', 'RandomForestClassifier'
    precision_score NUMERIC(5, 4),
    recall_score NUMERIC(5, 4),
    f1_score NUMERIC(5, 4),
    roc_auc_score NUMERIC(5, 4),
    artifact_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMPTZ DEFAULT NOW(),
    deployed_by UUID REFERENCES public.users(id)
);
```

### 3.2 Tabel `pre_purchase_checks` (Log Permintaan Pra-Pembelian)

```sql
CREATE TABLE public.pre_purchase_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    planned_amount NUMERIC(15, 2) NOT NULL CHECK (planned_amount > 0),
    merchant_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_decision VARCHAR(20) CHECK (user_decision IN ('PROCEED', 'ADJUST', 'POSTPONE', 'PENDING')) DEFAULT 'PENDING',
    decided_at TIMESTAMPTZ
);
```

### 3.3 Tabel `risk_predictions` (Hasil Inferensi Model)

```sql
CREATE TABLE public.risk_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL UNIQUE REFERENCES public.pre_purchase_checks(id) ON DELETE CASCADE,
    model_version_id UUID REFERENCES public.model_versions(id),
    risk_score NUMERIC(5, 4) NOT NULL, -- 0.0000 s.d. 1.0000
    risk_level VARCHAR(10) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    features_snapshot JSONB NOT NULL,   -- Menyimpan 7 nilai fitur saat inferensi dilakukan
    trigger_factors JSONB NOT NULL,     -- Array alasan: ["nominal > 2x median", "sisa anggaran 15%"]
    budget_remaining_before NUMERIC(15, 2) NOT NULL,
    budget_remaining_after NUMERIC(15, 2) NOT NULL,
    savings_delayed_days INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.4 Tabel `post_decision_feedbacks` (Feedback Pasca-Keputusan / Ground Truth)

```sql
CREATE TABLE public.post_decision_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_id UUID NOT NULL UNIQUE REFERENCES public.pre_purchase_checks(id) ON DELETE CASCADE,
    was_impulsive BOOLEAN NOT NULL,       -- TRUE jika user menyesal / merasa belanja impulsif
    satisfaction_rating INT CHECK (satisfaction_rating BETWEEN 1 AND 5),
    feedback_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.5 Tabel `audit_logs` (Audit Log Operator/Admin)

```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES public.users(id),
    action VARCHAR(50) NOT NULL, -- 'DEPLOY_MODEL', 'ROLLBACK_MODEL', 'UPDATE_CONFIG'
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Indeks Kinerja Query (Performance Indexes)

Untuk menjamin latensi API pra-pembelian dan kalkulasi analitik tetap di bawah **400 ms**:

```sql
-- Indeks pencarian transaksi historis per user dan kategori
CREATE INDEX idx_transactions_user_category ON public.transactions(user_id, category_id, transaction_date);

-- Indeks pengecekan pagu anggaran aktif
CREATE INDEX idx_budgets_user_period ON public.budgets(user_id, period_year, period_month);

-- Indeks log pra-pembelian per user
CREATE INDEX idx_pre_purchase_user_created ON public.pre_purchase_checks(user_id, created_at DESC);

-- Indeks pencarian model aktif
CREATE INDEX idx_model_active ON public.model_versions(is_active) WHERE is_active = TRUE;
```

---

## 5. Kebijakan Row-Level Security (RLS)

Seluruh tabel publik diproteksi sehingga pengguna hanya dapat membaca dan memodifikasi data milik sendiri:

```sql
-- Aktifkan RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_purchase_checks ENABLE ROW LEVEL SECURITY;

-- Contoh Policy Transaksi: User hanya bisa CRUD transaksi miliknya
CREATE POLICY "Users can manage own transactions" ON public.transactions
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Contoh Policy Pra-Pembelian
CREATE POLICY "Users can manage own pre-purchase checks" ON public.pre_purchase_checks
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
```
