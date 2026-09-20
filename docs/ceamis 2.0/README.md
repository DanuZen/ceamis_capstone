# CEAMIS 2.0 — Dokumentasi Arsitektur & Perubahan Terbaru

> **⚠️ Dokumen ini adalah sumber kebenaran tunggal (single source of truth) untuk CEAMIS 2.0.**
> Dokumen-dokumen di folder `docs/` atas (lama) seperti `10-System-Architecture.md`, `14-Backend-Architecture.md`, `16-AI-Integration.md` dll **sudah tidak berlaku** dan merujuk arsitektur lama (NestJS + FastAPI terpisah).

---

## Daftar Dokumen di Folder Ini

| # | Dokumen | Deskripsi |
|---|---|---|
| 1 | [README.md](./README.md) | **Dokumen ini** — Indeks & ringkasan arsitektur CEAMIS 2.0 |
| 2 | [PRD.md](./PRD.md) | **Product Requirements Document** — Visi, user stories, ruang lingkup & metrik |
| 3 | [ARSITEKTUR_SISTEM.md](./ARSITEKTUR_SISTEM.md) | **Arsitektur Teknis** — Blueprint 1 FastAPI modular, Flutter, Next.js Admin |
| 4 | [MODEL_PREDIKSI_RISIKO.md](./MODEL_PREDIKSI_RISIKO.md) | **Spesifikasi Model ML** — LogReg vs RF, 7 fitur kontekstual, temporal split |
| 5 | [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) | **Skema Database** — Relasi DDL PostgreSQL Supabase, RLS, & indeks query |
| 6 | [API_SPECIFICATION.md](./API_SPECIFICATION.md) | **Kontrak API** — Spesifikasi endpoint `/api/v1` FastAPI & skema Pydantic v2 |
| 7 | [STYLE_GUIDE.md](./STYLE_GUIDE.md) | **Design System** — Panduan visual Neo-Brutalism Gen-Z (Mobile & Admin) |
| 8 | [TASKS.md](./TASKS.md) | **Roadmap & Backlog** — Pembagian Sprint 1–5, alokasi PIC (Wira vs Hafiz), DoD |
| 9 | [PANDUAN_FITUR_PRA_PEMBELIAN.md](./PANDUAN_FITUR_PRA_PEMBELIAN.md) | **Spesifikasi Pra-Pembelian** — Alur intervensi belanja, rumus dampak, feedback |
| 10 | [PANDUAN_PENGEMBANGAN_BACKEND.md](./PANDUAN_PENGEMBANGAN_BACKEND.md) | **Standar Backend** — Pola arsitektur modular, Pydantic v2, auth guard, testing |
| 11 | [MIGRASI_BACKEND_FASTAPI.md](./MIGRASI_BACKEND_FASTAPI.md) | **Panduan Migrasi Backend** — Transisi NestJS ke 1 FastAPI Python modular |
| 12 | [PANDUAN_REVISI_PROJECT.md](./PANDUAN_REVISI_PROJECT.md) | Detail perbandingan sebelum vs sesudah arahan dosen pembimbing |
| 13 | [RINGKASAN_PERUBAHAN_LAMA.md](./RINGKASAN_PERUBAHAN_LAMA.md) | ⚠️ Arsip — dokumen ringkasan lama tahap transisi |

---

## Arsitektur CEAMIS 2.0 (Ringkasan)

### Topologi Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
├───────────────────────────┬─────────────────────────────────────┤
│   Flutter Mobile App      │   Next.js Web                       │
│   (Android & iOS)         │   (Admin Dashboard ONLY)            │
│   → Target: End User      │   → Target: Admin/Operator          │
└────────────┬──────────────┴──────────────┬──────────────────────┘
             │                             │
             ▼                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND — 1 APLIKASI FastAPI MODULAR               │
│              (Python 3.11+ / Uvicorn)                           │
├─────────────────────────────────────────────────────────────────┤
│  auth/          → Autentikasi (Supabase Auth / fastapi-users)   │
│  users/         → Profil & manajemen pengguna                   │
│  transactions/  → CRUD transaksi (pemasukan/pengeluaran)        │
│  budgets/       → Anggaran & kategori                           │
│  goals/         → Tujuan tabungan                               │
│  pre_purchase/  → ★ FITUR INTI: Cek pra-pembelian              │
│  risk_model/    → ★ Model prediksi risiko per-transaksi         │
│  health_score/  → Formula kesehatan finansial (rule-based)      │
│  ocr/           → OCR struk (proxy ke Gemini Flash)             │
│  engagement/    → Streak, badge, ringkasan mingguan, reminder   │
│  education/     → Modul edukasi adaptif                         │
│  admin/         → Manajemen admin (user, model, config, audit)  │
├─────────────────────────────────────────────────────────────────┤
│  ORM: SQLAlchemy / Tortoise ORM                                 │
│  Validasi: Pydantic v2 (built-in FastAPI)                       │
│  ML: scikit-learn (LogReg, RF, GBM)                             │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE & SERVICES                           │
├──────────────────────┬──────────────────────────────────────────┤
│  Supabase Cloud      │  External AI Services                    │
│  • PostgreSQL        │  • Gemini 2.0 Flash (OCR parsing)        │
│  • GoTrue Auth       │  • Gemini (Education content, jika ada)  │
│  • Storage (struk)   │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

### ❌ Yang DIHAPUS dari Arsitektur Lama

| Komponen | Status |
|---|---|
| NestJS Backend (`backend/`) | **DIHAPUS** — semua logic migrasi ke FastAPI |
| Chatbot AI (Gemini/Groq) | **DIHAPUS TOTAL** |
| Spending Cluster (K-Means) | **DIHAPUS** — diganti threshold sederhana |
| Risk Profile Classifier (Konservatif/Moderat/Agresif) | **DIGANTI TOTAL** → Model prediksi risiko per-transaksi |
| Deep Learning Health Score | **DISEDERHANAKAN** → Formula deterministik |
| Gamifikasi kompleks (XP/level/leaderboard) | **DISEDERHANAKAN** → Streak + badge dasar |
| Web untuk end-user | **DIUBAH** → Web hanya untuk Admin Dashboard |

---

## Hierarki Fitur CEAMIS 2.0

### ★ Fitur Inti (Prioritas Utama)
1. **Pencatatan Transaksi** — CRUD harian pemasukan/pengeluaran
2. **Pra-Pembelian (Pre-Purchase Check)** — Cek risiko sebelum belanja, tampilkan dampak ke anggaran
3. **Model Prediksi Risiko Per-Transaksi** — Logistic Regression vs RF/GBM, split per user & waktu

### ◆ Fitur Pendukung
4. **Financial Health Score** — Formula/rule sederhana, threshold Sehat/Waspada/Boros
5. **OCR Struk** — Google ML Kit (on-device) + Gemini Flash (parsing via FastAPI proxy)
6. **Edukasi Adaptif** — Konten edukasi keuangan
7. **Engagement** — Streak pencatatan, badge sederhana, ringkasan mingguan, reminder adaptif

### ▲ Admin
8. **Admin Dashboard** — Manajemen user, config, model versioning, audit log

---

## Database — Tabel Baru yang Perlu Dibuat

```
TABEL BARU (belum ada di skema lama):
├── pre_purchase_checks    → Log permintaan cek pra-pembelian
├── risk_predictions       → Hasil prediksi model per transaksi
├── user_feedback          → Feedback/koreksi user terhadap prediksi
├── consent_records        → Persetujuan pengumpulan data
├── model_versions         → Versioning model ML (rollback support)
├── audit_logs             → Log akses data sensitif oleh admin
└── notification_prefs     → Preferensi notifikasi (quiet hours, snooze)
```

---

## Prioritas Pengerjaan (Urutan Wajib)

```
1. ████████████ Migrasi backend NestJS → FastAPI modular (FONDASI)
2. ████████████ Auth + CRUD transaksi + anggaran (Increment 1)
3. ████████     Baseline warning — ambang statis (Increment 2)
4. ████████████ Model prediksi risiko (LogReg vs RF/GBM) (Increment 3 — TERSULIT)
5. ████████     Fitur Pra-Pembelian lengkap (integrasi model)
6. ██████       Financial Health Score formula
7. ██████       OCR struk (ML Kit + Gemini proxy)
8. ██████       Admin Dashboard (Increment 4)
9. ████         Engagement (streak, badge, reminder)
10.████         Edukasi adaptif
```

---

## Etika & Keamanan (Wajib Diterapkan)

- Consent flow sebelum pengumpulan data
- Pseudonymization untuk data partisipan riset
- Least privilege access untuk Admin
- Audit log untuk akses data sensitif
- Hak user: lihat/koreksi/ekspor/hapus data pribadi
- Retensi foto struk dibatasi (auto-hapus setelah X hari)
- HTTPS wajib untuk semua komunikasi

---

> **Terakhir diperbarui:** 20 September 2026
> **Acuan utama:** `PANDUAN_REVISI_PROJECT.md` (revisi berdasarkan rancangan dosen)
