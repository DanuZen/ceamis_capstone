# Laporan Analisis ERD dan Kamus Data (Bahan BAB III Gambar 3.7)

Laporan ini memuat hasil inventarisasi skema basis data riil pada repositori CEAMIS, membandingkannya terhadap 13 entitas yang dirancang pada naskah Tugas Akhir, memverifikasi relasi kunci dan kamus data, serta mencatat status implementasi diagram.

---

## 1. Sumber Kebenaran Skema (Source of Truth)

Di dalam repositori ini, tidak ditemukan folder migrasi Alembic (`alembic/` atau `versions/`) pada backend FastAPI. Pengelolaan skema basis data terbagi menjadi dua lapisan:

1. **Skema Basis Data Fisik (Live PostgreSQL di Supabase):**
   - **Sumber Kebenaran:** Introspeksi Prisma pada [frontend/prisma/schema.prisma](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L1-L813) dan skrip DDL SQL migrasi Supabase pada [backend_nestjs_archive/supabase/migrations/001_initial_schema.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L1-L340) serta [frontend/create_tables.sql](file:///c:/Users/wira1/project/ceamis_capstone/frontend/create_tables.sql).
   - Skema ini merupakan tabel fisik yang saat ini aktif digunakan oleh aplikasi web Next.js dan aplikasi mobile Flutter melalui koneksi Supabase Client.

2. **Skema Fitur Inti Pra-Pembelian dan Tata Kelola Model (FastAPI Modular CEAMIS 2.0):**
   - **Sumber Kebenaran:** Definisi model ORM SQLAlchemy pada [backend/app/models/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L1-L175), skema Pydantic v2 pada [backend/app/schemas/pre_purchase_schema.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L1-L197), serta dokumen spesifikasi DDL pada [docs/ceamis 2.0/DATABASE_SCHEMA.md](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L1-L265).
   - Pada implementasi backend saat ini, router API [backend/app/api/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L30-L34) dan [backend/app/api/admin.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L26-L61) mengelola data pra-pembelian melalui penyimpanan in-memory dan registry berkas JSON (`artifacts_risk/model_registry.json`) sebagai jembatan sebelum tabel SQLAlchemy tersebut dieksekusi migrasinya ke instans Supabase produksi.

Status Diagram:
- Sumber Mermaid ditulis pada `thesis_assets/diagrams/erd_lengkap.mmd` dan `thesis_assets/diagrams/erd_ringkas.mmd`.
- Status render: Tidak dirender ke PNG/SVG karena utilitas `mmdc` (mermaid-cli) tidak terpasang di sistem global atau PATH lingkungan lokal.

---

## 2. Tabel Kesesuaian 13 Entitas Naskah

| No | Entitas Naskah | Status di Proyek | Nama Sebenarnya di Kode | Bukti Implementasi | Catatan Kesesuaian |
|:---|:---|:---|:---|:---|:---|
| 1 | `users` | ADA | `users` (skema `auth`) dan `users` (skema `public`) | [frontend/prisma/schema.prisma:520](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L520), [docs/ceamis 2.0/DATABASE_SCHEMA.md:57](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L57) | Tabel autentikasi dikelola oleh Supabase Auth (`auth.users`). |
| 2 | `profiles` | ADA | `user_profiles` | [frontend/prisma/schema.prisma:698](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L698), [001_initial_schema.sql:13](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L13) | [BERBEDA DARI NASKAH] Bernama `user_profiles`. Berisi relasi 1:1 ke `auth.users`, memuat streak, skor kesehatan finansial, dan level gamifikasi. |
| 3 | `budgets` | SEBAGIAN | `FinancialBudget` (Prisma) / `planning` (SQL) / `budgets` (Dokumen DDL) | [frontend/prisma/schema.prisma:58](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L58), [docs/ceamis 2.0/DATABASE_SCHEMA.md:88](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L88) | [BERBEDA DARI NASKAH] Di Prisma bernama `FinancialBudget`. Pada skema live lama digabung ke tabel `planning`. Spesifikasi tabel `budgets` per kategori sudah dirancang di `DATABASE_SCHEMA.md` namun belum dieksekusi DDL-nya ke database live. |
| 4 | `financial_goals` | SEBAGIAN | `FinancialTarget` (Prisma) / `planning` (SQL) / `goals` (Dokumen DDL) | [frontend/prisma/schema.prisma:69](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L69), [docs/ceamis 2.0/DATABASE_SCHEMA.md:104](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L104) | [BERBEDA DARI NASKAH] Di Prisma bernama `FinancialTarget`, sedangkan pada spesifikasi CEAMIS 2.0 dinamai `goals`. |
| 5 | `transaction_categories` | SEBAGIAN | Kolom `category` pada `transactions` / `categories` (Dokumen DDL) | [frontend/prisma/schema.prisma:684](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L684), [docs/ceamis 2.0/DATABASE_SCHEMA.md:73](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L73) | [BERBEDA DARI NASKAH] Tabel fisik terpisah `transaction_categories` belum ada di database aktif; kategori masih disimpan sebagai kolom teks pada tabel `transactions`. Tabel `categories` baru ada di spesifikasi DDL. |
| 6 | `transactions` | ADA | `transactions` | [frontend/prisma/schema.prisma:678](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L678), [001_initial_schema.sql:82](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L82) | Sesuai naskah. Menyimpan riwayat nominal, tipe pemasukan/pengeluaran, kategori, dan tag kebutuhan/keinginan. |
| 7 | `pre_purchase_checks` | ADA | `pre_purchase_checks` | [backend/app/models/pre_purchase.py:64](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L64), [backend/app/schemas/pre_purchase_schema.py:42](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L42) | [BERBEDA DARI NASKAH] Terdefinisi lengkap di model ORM SQLAlchemy dan skema Pydantic, tetapi belum dieksekusi ke migrasi fisik Prisma live. |
| 8 | `risk_predictions` | ADA | `risk_predictions` | [backend/app/models/pre_purchase.py:102](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L102), [backend/app/schemas/pre_purchase_schema.py:79](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L79) | [BERBEDA DARI NASKAH] Terdefinisi lengkap di model ORM SQLAlchemy backend; berelasi 1:1 dengan `pre_purchase_checks`. Belum ada di migrasi fisik Prisma live. |
| 9 | `user_feedback` | ADA | `post_decision_feedbacks` | [backend/app/models/pre_purchase.py:135](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L135), [backend/app/schemas/pre_purchase_schema.py:121](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L121) | [BERBEDA DARI NASKAH] Di kode ORM dinamai `post_decision_feedbacks`. Berisi kolom `was_impulsive` (label terencana/tidak terencana) dan `satisfaction_rating`. |
| 10 | `notification_preferences` | TIDAK DITEMUKAN | - | [docs/ceamis 2.0/PANDUAN_REVISI_PROJECT.md:141](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/PANDUAN_REVISI_PROJECT.md#L141) | [BERBEDA DARI NASKAH] Disebutkan di dokumen rencana revisi, tetapi tidak ditemukan model ORM maupun tabel fisik di database. |
| 11 | `consent_records` | TIDAK DITEMUKAN | - | [docs/ceamis 2.0/PANDUAN_REVISI_PROJECT.md:141](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/PANDUAN_REVISI_PROJECT.md#L141) | [BERBEDA DARI NASKAH] Disebutkan di dokumen rencana revisi, tetapi belum diimplementasikan sebagai tabel di repositori ini. |
| 12 | `model_versions` | ADA | `model_versions` | [backend/app/models/pre_purchase.py:45](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L45), [backend/app/api/admin.py:26](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L26) | [BERBEDA DARI NASKAH] Terdefinisi di model ORM dan dikelola via file JSON registry `model_registry.json`. Belum dimigrasikan ke PostgreSQL fisik live. |
| 13 | `audit_logs` | ADA | `audit_logs` / `auth.audit_log_entries` | [backend/app/models/pre_purchase.py:158](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L158), [frontend/prisma/schema.prisma:128](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L128) | [BERBEDA DARI NASKAH] Model ORM mendefinisikan kolom `actor_id`, `action`, `entity_type`, `entity_id`, `details`, `ip_address`, `created_at`. Berbeda nama atribut dari rancangan naskah (`admin_id`, `accessed_resource`, `reason`). |

---

## 3. Tabel Tambahan di Luar 13 Entitas

Berikut adalah tabel riil yang ada pada basis data proyek namun tidak termasuk ke dalam 13 entitas utama naskah:

1. **`onboarding_data`** ([frontend/prisma/schema.prisma:632](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L632), [001_initial_schema.sql:138](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L138)):  
   Menyimpan data masukan profil awal pengguna dari form onboarding 5 langkah (usia, penghasilan bulanan, sumber penghasilan, pengeluaran rutin, tanggungan keluarga, dan preferensi menabung).
2. **`warnings`** ([frontend/prisma/schema.prisma:728](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L728), [001_initial_schema.sql:173](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L173)):  
   Menyimpan notifikasi peringatan anggaran statis/rule-based lama yang dipicu saat pengeluaran mendekati atau melebihi batas.
3. **`debt_records` / `FinancialDebt`** ([frontend/prisma/schema.prisma:612](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L612), [frontend/prisma/schema.prisma:84](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L84), [001_initial_schema.sql:193](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L193)):  
   Mencatat daftar hutang dan piutang pengguna beserta jatuh tempo dan status pelunasan.
4. **`RiskProfile`** ([frontend/prisma/schema.prisma:99](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L99)):  
   Menyimpan hasil asesmen profil risiko investasi/keuangan (konservatif, moderat, agresif) beserta jawaban mentah kuesioner.
5. **`GamificationBadge`** ([frontend/prisma/schema.prisma:111](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L111)):  
   Katalog lencana penghargaan gamifikasi, syarat pencapaian, dan poin pengalaman (XP).
6. **`EducationModule`, `EducationPage`, `EducationQuiz`** ([frontend/prisma/schema.prisma:12-56](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L12-L56)):  
   Tabel konten literasi finansial interaktif yang terdiri atas modul edukasi, halaman artikel/bacaan, dan butir kuis evaluasi pemahaman.
7. **Tabel Sub-Sistem Supabase Auth (`auth.*`)** ([frontend/prisma/schema.prisma:128-589](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L128-L589)):  
   Tabel infrastruktur autentikasi Supabase: `sessions`, `identities`, `refresh_tokens`, `mfa_factors`, `mfa_challenges`, `mfa_amr_claims`, `flow_state`, `sso_providers`, `oauth_clients`, `oauth_authorizations`, `oauth_consents`, `one_time_tokens`, `webauthn_credentials`.

---

## 4. Kamus Data Lengkap per Tabel

### 4.1 Tabel `users` (`auth.users`)
*Sumber: [frontend/prisma/schema.prisma:520-572](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L520-L572)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik pengguna dari Supabase Auth |
| `email` | VARCHAR(255) | Ya | UK | Alamat surel akun pengguna |
| `role` | VARCHAR(255) | Ya | - | Peran sistem bawaan autentikasi |
| `encrypted_password` | VARCHAR(255) | Ya | - | Hash kata sandi terenkripsi |
| `email_confirmed_at` | TIMESTAMPTZ | Ya | - | Waktu verifikasi surel |
| `last_sign_in_at` | TIMESTAMPTZ | Ya | - | Waktu terakhir kali masuk |
| `created_at` | TIMESTAMPTZ | Ya | - | Waktu pembuatan akun |
| `updated_at` | TIMESTAMPTZ | Ya | - | Waktu pembaruan akun |

---

### 4.2 Tabel `user_profiles` (Padanan `profiles`)
*Sumber: [frontend/prisma/schema.prisma:698-724](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L698-L724), [001_initial_schema.sql:13-39](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L13-L39)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK, FK | Terhubung ke `auth.users(id)` secara CASCADE |
| `name` | TEXT / VARCHAR | Ya | - | Nama lengkap tampilan pengguna |
| `email` | TEXT / VARCHAR | Ya | - | Salinan alamat surel pengguna |
| `phone` | TEXT / VARCHAR | Ya | - | Nomor telepon pengguna |
| `avatar_url` | TEXT | Ya | - | Tautan foto profil |
| `level` | INTEGER | Tidak | - | Tingkat gamifikasi pengguna (default 1) |
| `xp` | INTEGER | Tidak | - | Poin pengalaman gamifikasi (default 0) |
| `streak` | INTEGER | Tidak | - | Jumlah hari berturut-turut mencatat transaksi (default 0) |
| `last_active` | TIMESTAMPTZ | Ya | - | Waktu terakhir aktivitas pengguna |
| `label` | TEXT | Tidak | - | Predikat profil (default 'Pemula') |
| `unlocked_badges` | TEXT[] | Ya | - | Daftar ID lencana yang berhasil diraih |
| `health_score` | NUMERIC(5,2) | Tidak | - | Skor kesehatan finansial (default 75.0) |
| `warning_triggered` | BOOLEAN | Tidak | - | Status apakah ada peringatan aktif (default false) |
| `risk_profile` | TEXT | Ya | - | Profil risiko: 'konservatif', 'moderat', atau 'agresif' |
| `onboarding_completed` | BOOLEAN | Tidak | - | Status penyelesaian kuesioner awal (default false) |
| `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pembuatan data profil |
| `updated_at` | TIMESTAMPTZ | Tidak | - | Waktu pembaruan data profil |

---

### 4.3 Tabel `transactions`
*Sumber: [frontend/prisma/schema.prisma:678-694](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L678-L694), [001_initial_schema.sql:82-91](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L82-L91)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik transaksi |
| `user_id` | UUID | Tidak | FK | Terhubung ke `user_profiles(id)` |
| `description` | TEXT | Tidak | - | Deskripsi atau nama transaksi belanja |
| `amount` | NUMERIC(15,2) | Tidak | - | Nilai nominal transaksi (harus > 0) |
| `type` | TEXT | Tidak | - | Jenis transaksi: 'pemasukan' atau 'pengeluaran' |
| `category` | TEXT | Tidak | - | Nama kategori transaksi |
| `tag` | TEXT | Ya | - | Klasifikasi kebutuhan: 'needs' atau 'wants' |
| `transaction_date` | TIMESTAMPTZ | Tidak | - | Tanggal terjadinya transaksi |
| `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pencatatan data ke sistem |

---

### 4.4 Tabel `FinancialBudget` / `budgets`
*Sumber: [frontend/prisma/schema.prisma:58-67](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L58-L67), [docs/ceamis 2.0/DATABASE_SCHEMA.md:88-99](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L88-L99)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | SERIAL (Prisma) / UUID (DDL) | Tidak | PK | Pengenal unik alokasi pagu anggaran |
| `userId` / `user_id` | TEXT / UUID | Tidak | FK | Pengenal pemilik anggaran |
| `category_id` | UUID | Ya (Prisma) / Tidak (DDL) | FK | Kategori belanja terkait |
| `limit` / `amount_limit` | FLOAT / NUMERIC(15,2) | Tidak | - | Batas pagu anggaran (Rupiah) |
| `period` / `period_month` | TEXT / INT | Tidak | - | Periode anggaran (misal: 'monthly' atau bulan 1-12) |
| `period_year` | INT | Ya (Prisma) / Tidak (DDL) | - | Tahun periode anggaran |
| `createdAt` / `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pembuatan pagu anggaran |
| `updatedAt` / `updated_at` | TIMESTAMPTZ | Tidak | - | Waktu pembaruan pagu anggaran |

---

### 4.5 Tabel `FinancialTarget` / `goals` (Padanan `financial_goals`)
*Sumber: [frontend/prisma/schema.prisma:69-82](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L69-L82), [docs/ceamis 2.0/DATABASE_SCHEMA.md:104-114](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L104-L114)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | SERIAL (Prisma) / UUID (DDL) | Tidak | PK | Pengenal unik target tabungan |
| `userId` / `user_id` | TEXT / UUID | Tidak | FK | Pengenal pemilik target |
| `name` / `title` | TEXT / VARCHAR(100) | Tidak | - | Nama target tabungan (contoh: 'Dana Darurat') |
| `targetAmount` / `target_amount` | FLOAT / NUMERIC(15,2) | Tidak | - | Jumlah dana yang ingin dicapai |
| `currentAmount` / `current_amount`| FLOAT / NUMERIC(15,2) | Tidak | - | Tabungan yang telah terkumpul saat ini |
| `deadline` / `target_date` | TIMESTAMPTZ / DATE | Ya | - | Batas waktu pencapaian target |
| `icon` | TEXT | Ya | - | Ikon visual penanda target tabungan |
| `color` | TEXT | Ya | - | Kode tema warna visual |
| `is_completed` | BOOLEAN | Ya (Prisma) / Tidak (DDL) | - | Status target telah terpenuhi |
| `createdAt` / `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pencatatan target tabungan |
| `updatedAt` / `updated_at` | TIMESTAMPTZ | Tidak | - | Waktu pembaruan target tabungan |

---

### 4.6 Tabel `pre_purchase_checks`
*Sumber: [backend/app/models/pre_purchase.py:64-100](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L64-L100), [docs/ceamis 2.0/DATABASE_SCHEMA.md:160-171](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L160-L171)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik sesi evaluasi pra-pembelian |
| `user_id` | UUID | Tidak | FK | Pengenal pengguna pemohon evaluasi |
| `category_id` | UUID | Tidak | FK | Pengenal kategori rencana belanja |
| `planned_amount` | NUMERIC(15,2) | Tidak | - | Nominal rencana pengeluaran yang diuji |
| `merchant_name` | VARCHAR(100) | Ya | - | Nama toko atau penjual (opsional) |
| `notes` | TEXT | Ya | - | Catatan alasan rencana pembelian |
| `user_decision` | VARCHAR(20) | Tidak | - | Pilihan respons pengguna: 'PENDING', 'PROCEED', 'ADJUST', 'POSTPONE' |
| `decided_at` | TIMESTAMPTZ | Ya | - | Waktu pengguna menetapkan pilihan respons |
| `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pengajuan evaluasi |

---

### 4.7 Tabel `risk_predictions`
*Sumber: [backend/app/models/pre_purchase.py:102-134](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L102-L134), [docs/ceamis 2.0/DATABASE_SCHEMA.md:176-189](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L176-L189)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik hasil inferensi prediksi |
| `check_id` | UUID | Tidak | FK, UK | Terhubung 1:1 ke `pre_purchase_checks(id)` (CASCADE) |
| `model_version_id` | UUID | Ya | FK | Terhubung ke versi model pada `model_versions(id)` |
| `risk_score` | NUMERIC(5,4) | Tidak | - | Skor probabilitas risiko model (0.0000 s.d. 1.0000) |
| `risk_level` | VARCHAR(10) | Tidak | - | Klasifikasi tingkat risiko: 'LOW', 'MEDIUM', 'HIGH' |
| `features_snapshot` | JSON / JSONB | Tidak | - | Rekaman snapshot 7 nilai fitur kontekstual saat inferensi |
| `trigger_factors` | JSON / JSONB | Tidak | - | Daftar faktor pemicu/alasan peringatan risiko |
| `budget_remaining_before`| NUMERIC(15,2) | Tidak | - | Sisa anggaran kategori sebelum rencana pembelian |
| `budget_remaining_after` | NUMERIC(15,2) | Tidak | - | Proyeksi sisa anggaran setelah rencana pembelian |
| `savings_delayed_days` | INTEGER | Tidak | - | Estimasi keterlambatan target tabungan dalam hitungan hari |
| `created_at` | TIMESTAMPTZ | Tidak | - | Waktu kalkulasi inferensi |

---

### 4.8 Tabel `post_decision_feedbacks` (Padanan `user_feedback`)
*Sumber: [backend/app/models/pre_purchase.py:135-156](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L135-L156), [docs/ceamis 2.0/DATABASE_SCHEMA.md:194-202](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L194-L202)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik umpan balik konfirmasi |
| `check_id` | UUID | Tidak | FK, UK | Terhubung 1:1 ke `pre_purchase_checks(id)` (CASCADE) |
| `was_impulsive` | BOOLEAN | Tidak | - | Label ground truth: True (impulsif/menyesal), False (terencana) |
| `satisfaction_rating` | INTEGER | Ya | - | Skala kepuasan keputusan 1 sampai 5 |
| `feedback_notes` | TEXT | Ya | - | Catatan kualitatif dari pengguna |
| `submitted_at` | TIMESTAMPTZ | Tidak | - | Waktu pengiriman umpan balik |

---

### 4.9 Tabel `model_versions`
*Sumber: [backend/app/models/pre_purchase.py:45-62](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L45-L62), [docs/ceamis 2.0/DATABASE_SCHEMA.md:142-155](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L142-L155)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik versi model |
| `version_tag` | VARCHAR(50) | Tidak | UK | Label versi rilis model (contoh: 'v1.0.0-logreg', 'v1.1.0-rf') |
| `algorithm` | VARCHAR(50) | Tidak | - | Algoritma model ('LogisticRegression', 'RandomForestClassifier') |
| `precision_score` | NUMERIC(5,4) | Ya | - | Nilai metrik presisi model pada data uji |
| `recall_score` | NUMERIC(5,4) | Ya | - | Nilai metrik recall/daya tangkap model |
| `f1_score` | NUMERIC(5,4) | Ya | - | Nilai metrik F1-score keseimbangan evaluasi |
| `roc_auc_score` | NUMERIC(5,4) | Ya | - | Nilai area di bawah kurva ROC |
| `artifact_path` | VARCHAR(255) | Tidak | - | Jalur berkas biner artefak serialisasi model (`.joblib`) |
| `is_active` | BOOLEAN | Tidak | - | Status apakah model aktif dipakai untuk inferensi |
| `deployed_at` | TIMESTAMPTZ | Ya | - | Waktu penerapan model ke lingkungan operasional |
| `deployed_by` | UUID | Ya | FK | Pengenal admin yang melakukan penerapan |

---

### 4.10 Tabel `audit_logs`
*Sumber: [backend/app/models/pre_purchase.py:158-175](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L158-L175), [docs/ceamis 2.0/DATABASE_SCHEMA.md:207-217](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L207-L217)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik entri log audit |
| `actor_id` | UUID | Tidak | FK | Pengenal operator/admin pelaksana aksi |
| `action` | VARCHAR(50) | Tidak | - | Jenis tindakan sistem ('DEPLOY_MODEL', 'ROLLBACK_MODEL', dll) |
| `entity_type` | VARCHAR(50) | Tidak | - | Entitas target yang diintervensi ('MODEL', 'USER_DATA') |
| `entity_id` | VARCHAR(100) | Ya | - | Pengenal unik instans target intervensi |
| `details` | JSON / JSONB | Ya | - | Metadata detail aksi termasuk alasan intervensi |
| `ip_address` | VARCHAR(45) | Ya | - | Alamat IP asal permintaan intervensi |
| `created_at` | TIMESTAMPTZ | Tidak | - | Waktu pencatatan log audit |

---

### 4.11 Tabel Tambahan `onboarding_data`
*Sumber: [frontend/prisma/schema.prisma:632-654](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L632-L654), [001_initial_schema.sql:138-166](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L138-L166)*

| Nama Kolom | Tipe | Null | Kunci | Keterangan |
|:---|:---|:---|:---|:---|
| `id` | UUID | Tidak | PK | Pengenal unik data onboarding |
| `user_id` | UUID | Tidak | FK, UK | Terhubung 1:1 ke `user_profiles(id)` |
| `name` | TEXT | Tidak | - | Nama panggilan pengguna |
| `age` | INTEGER | Tidak | - | Usia pengguna (rentang validasi 10-100 tahun) |
| `income` | NUMERIC(15,2) | Tidak | - | Pendapatan rata-rata bulanan |
| `income_source` | TEXT | Tidak | - | Sumber penghasilan ('gaji', 'freelance', 'bisnis', 'uang_saku') |
| `top_expenses` | TEXT[] | Tidak | - | Daftar kategori pengeluaran terbesar |
| `monthly_expense` | NUMERIC(15,2) | Tidak | - | Estimasi total pengeluaran per bulan |
| `goals` | TEXT[] | Tidak | - | Daftar target tujuan finansial |
| `risk_profile` | TEXT | Tidak | - | Profil risiko hasil onboarding ('konservatif', 'moderat', 'agresif') |
| `savings_ratio` | INTEGER | Tidak | - | Rasio tabungan pengguna (persentase 0-100) |
| `completed_at` | TIMESTAMPTZ | Tidak | - | Waktu penyelesaian form onboarding |

---

## 5. Verifikasi Relasi Kunci Naskah

Berikut adalah verifikasi keterkaitan relasi kunci yang dirancang pada naskah terhadap kode sumber nyata:

1. **Relasi Pre-Purchase Check ke Risk Prediction, Post-Decision Feedback, dan Transaction:**
   - **Klaim Naskah:** Setiap `pre_purchase_check` terhubung ke satu `risk_prediction` (skor dan penjelasan) dan, bila pengguna melanjutkan, ke `transaction` terkait; label konfirmasi pasca-keputusan disimpan lewat `user_feedback`.
   - **Kondisi Kode:**
     - Relasi `pre_purchase_checks` ke `risk_predictions` adalah 1-to-1 relasi integritas referensial. Terbukti pada model SQLAlchemy [backend/app/models/pre_purchase.py:88-93](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L88-L93) (`PrePurchaseCheck.prediction = relationship("RiskPrediction", uselist=False, back_populates="check")`) dan [backend/app/models/pre_purchase.py:107-112](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L107-L112) (`RiskPrediction.check_id = Column(..., ForeignKey("pre_purchase_checks.id", ondelete="CASCADE"), unique=True)`).
     - Relasi `pre_purchase_checks` ke umpan balik pasca-keputusan (`post_decision_feedbacks`) adalah 1-to-1 relasi integritas referensial. Terbukti pada [backend/app/models/pre_purchase.py:94-99](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L94-L99) (`PrePurchaseCheck.feedback = relationship("PostDecisionFeedback", uselist=False, back_populates="check")`) dan [backend/app/models/pre_purchase.py:140-145](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L140-L145) (`PostDecisionFeedback.check_id = Column(..., ForeignKey("pre_purchase_checks.id", ondelete="CASCADE"), unique=True)`).
     - Relasi ke `transactions`: Pada rancangan DDL CEAMIS 2.0 [docs/ceamis 2.0/DATABASE_SCHEMA.md:130](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L130), tabel `transactions` memiliki foreign key opsional `pre_purchase_check_id UUID`. Namun pada skema basis data fisik Prisma [frontend/prisma/schema.prisma:678-694](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L678-L694), kolom foreign key tersebut belum ditambahkan. [BERBEDA DARI NASKAH].

2. **Penyimpanan Versi Model dan Metrik Evaluasi (`model_versions`):**
   - **Klaim Naskah:** `model_versions` menyimpan versi model (baseline ambang statis, Logistic Regression, Random Forest atau GBM) beserta metrik evaluasi.
   - **Kondisi Kode:**
     - Terbukti pada model SQLAlchemy [backend/app/models/pre_purchase.py:45-62](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L45-L62), kolom `version_tag`, `algorithm`, `precision_score`, `recall_score`, `f1_score`, `roc_auc_score`, `artifact_path`, `is_active`, dan `deployed_at`.
     - Model aktif terhubung ke setiap prediksi yang dihasilkan melalui foreign key `model_version_id` pada [backend/app/models/pre_purchase.py:113-116](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L113-L116).
     - Data versi bawaan pada implementasi registry [backend/app/api/admin.py:36-61](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L36-L61) mencatat dua versi model terdaftar: `v1.0.0-logreg` (LogisticRegression, Precision: 0.7630, Recall: 0.7100, F1: 0.7355) dan `v1.1.0-rf` (RandomForestClassifier, Precision: 0.8120, Recall: 0.7450, F1: 0.7771).

3. **Spesifikasi Kolom Log Audit (`audit_logs`):**
   - **Klaim Naskah:** `audit_logs` memuat `admin_id`, `accessed_resource`, `reason` (wajib diisi), `timestamp`.
   - **Kondisi Kode:**
     - Pada model ORM [backend/app/models/pre_purchase.py:158-175](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L158-L175), kolom yang terpasang adalah `actor_id` (padanan `admin_id`), `action` dan `entity_type` (padanan `accessed_resource`), `details` (JSON untuk menyimpan alasan dan konteks intervensi), serta `created_at` (padanan `timestamp`).
     - Pada schema request rollback model [backend/app/schemas/pre_purchase_schema.py:155-159](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L155-L159), kolom `reason` berstatus wajib diisi dengan batasan validasi `min_length=5`. [BERBEDA DARI NASKAH: nama kolom di model basis data adalah `actor_id` dan `details`, bukan `admin_id` dan `reason` terpisah].

4. **Pencatatan Persetujuan Partisipan (`consent_records`):**
   - **Klaim Naskah:** `consent_records` menyimpan riwayat persetujuan partisipan.
   - **Kondisi Kode:**
     - Tabel fisik `consent_records` TIDAK DITEMUKAN di database PostgreSQL Supabase live maupun di model SQLAlchemy backend. Rencana penambahan tabel tercatat di dokumen backlog [docs/ceamis 2.0/PANDUAN_REVISI_PROJECT.md:141, 190](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/PANDUAN_REVISI_PROJECT.md#L141) tetapi belum dibuat kodenya. [BERBEDA DARI NASKAH].

---

## 6. Daftar Enum dan Nilai Tetap Penting

1. **Respons Keputusan Pengguna (`user_decision` / `UserDecision`):**
   - Sumber: [backend/app/schemas/pre_purchase_schema.py:26-30](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L26-L30), [backend/app/models/pre_purchase.py:74-78](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L74-L78).
   - Nilai:
     - `PROCEED`: Pengguna memutuskan tetap melanjutkan transaksi belanja.
     - `ADJUST`: Pengguna memutuskan menyesuaikan nominal rencana belanja ke batas yang lebih aman.
     - `POSTPONE`: Pengguna memutuskan menunda pembelian untuk menghindari pengeluaran tidak terencana.
     - `PENDING`: Status inisial ketika hasil evaluasi risiko telah disajikan tetapi pengguna belum menekan tombol keputusan.

2. **Label Pasca-Keputusan / Ground Truth (`was_impulsive`):**
   - Sumber: [backend/app/models/pre_purchase.py:146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L146), [backend/app/schemas/pre_purchase_schema.py:124](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L124).
   - Tipe: Boolean.
   - Nilai:
     - `True`: Pengeluaran dinilai tidak terencana atau pembelian impulsif (disesali oleh pengguna).
     - `False`: Pengeluaran terencana atau pembelian bijak yang sesuai dengan prioritas kebutuhan.

3. **Tingkat Risiko Prediksi (`risk_level` / `RiskLevel`):**
   - Sumber: [backend/app/schemas/pre_purchase_schema.py:20-24](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L20-L24), [backend/app/models/pre_purchase.py:119](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L119).
   - Nilai:
     - `LOW`: Risiko rendah (skor risiko < ambang waspada).
     - `MEDIUM`: Risiko sedang (skor risiko mendekati batas pagu atau median).
     - `HIGH`: Risiko tinggi (skor risiko melebihi batas toleransi / overbudget).

4. **Peran Pengguna (`role`):**
   - Sumber: [docs/ceamis 2.0/DATABASE_SCHEMA.md:61](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md#L61), [frontend/prisma/schema.prisma:524](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L524).
   - Nilai:
     - `user`: Pengguna akhir aplikasi mobile yang melakukan pencatatan transaksi dan pemeriksaan pra-pembelian.
     - `admin`: Pengelola sistem yang memiliki hak akses terhadap dasbor web Next.js untuk tata kelola model dan audit intervensi.

5. **Jenis Transaksi Keuangan (`type`):**
   - Sumber: [frontend/prisma/schema.prisma:683](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L683), [001_initial_schema.sql:87](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L87).
   - Nilai:
     - `'pemasukan'` (atau `'income'` pada spesifikasi CEAMIS 2.0).
     - `'pengeluaran'` (atau `'expense'` pada spesifikasi CEAMIS 2.0).

6. **Tag Kebutuhan Transaksi (`tag`):**
   - Sumber: [frontend/prisma/schema.prisma:685](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L685), [001_initial_schema.sql:89](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L89).
   - Nilai:
     - `'needs'`: Pengeluaran untuk kebutuhan esensial.
     - `'wants'`: Pengeluaran untuk keinginan non-esensial.
