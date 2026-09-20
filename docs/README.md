# Dokumentasi Proyek CEAMIS

Struktur dokumentasi proyek ini dipisahkan menjadi dua folder utama sesuai evolusi arsitektur:

---

## 📂 Struktur Direktori Dokumentasi

### 1. 🚀 [CEAMIS 2.0 (`docs/ceamis 2.0/`)](./ceamis%202.0/README.md) — **AKTIF & UTAMA**
Dokumentasi resmi untuk arsitektur terbaru yang disetujui dosen pembimbing:
- **[README.md](./ceamis%202.0/README.md)** — Indeks utama dan ringkasan arsitektur CEAMIS 2.0.
- **[PRD.md](./ceamis%202.0/PRD.md)** — Product Requirements Document (Visi, User Stories, MoSCoW, KPI).
- **[ARSITEKTUR_SISTEM.md](./ceamis%202.0/ARSITEKTUR_SISTEM.md)** — Arsitektur teknis 1 backend FastAPI modular, Flutter, Next.js Admin.
- **[PANDUAN_FITUR_PRA_PEMBELIAN.md](./ceamis%202.0/PANDUAN_FITUR_PRA_PEMBELIAN.md)** — Spesifikasi alur intervensi belanja, rumus dampak anggaran/tabungan, feedback loop.
- **[MODEL_PREDIKSI_RISIKO.md](./ceamis%202.0/MODEL_PREDIKSI_RISIKO.md)** — Spesifikasi model ML (LogReg vs RF, 7 fitur kontekstual, temporal split).
- **[DATABASE_SCHEMA.md](./ceamis%202.0/DATABASE_SCHEMA.md)** — DDL Skema Database PostgreSQL Supabase, relasi, RLS, dan indeks query.
- **[API_SPECIFICATION.md](./ceamis%202.0/API_SPECIFICATION.md)** — Kontrak REST API endpoint `/api/v1` & skema Pydantic v2.
- **[STYLE_GUIDE.md](./ceamis%202.0/STYLE_GUIDE.md)** — Design system Neo-Brutalism Gen-Z (Mobile Flutter & Admin Web).
- **[TASKS.md](./ceamis%202.0/TASKS.md)** — Roadmap Sprint 1–5, pembagian tugas PIC (Wira vs Hafiz), DoD.
- **[MIGRASI_BACKEND_FASTAPI.md](./ceamis%202.0/MIGRASI_BACKEND_FASTAPI.md)** — Panduan transisi backend NestJS ke 1 FastAPI Python modular.
- **[PANDUAN_PENGEMBANGAN_BACKEND.md](./ceamis%202.0/PANDUAN_PENGEMBANGAN_BACKEND.md)** — Standar coding modular, Pydantic v2, auth guard, testing.
- **[PANDUAN_REVISI_PROJECT.md](./ceamis%202.0/PANDUAN_REVISI_PROJECT.md)** — Catatan analisis revisi dosen pembimbing.

### 2. 📦 [CEAMIS 1.0 (`docs/ceamis 1.0/`)](./ceamis%201.0/) — **ARSIP (DEPRECATED)**
Dokumentasi arsitektur lama sebelum revisi (NestJS + FastAPI terpisah, Web untuk user, K-Means spending cluster):
- Dokumen perencanaan awal (`00-README-INDEX.md` s.d. `09-References.md`)
- Dokumen teknis 1.0 (`10-System-Architecture.md` s.d. `19-AI-Model-Risk-Profile.md`)
- `PRD.md`, `StyleGuide.md`, `Tasks.md`, dan panduan 1.0 lainnya.

---
*Gunakan folder **`ceamis 2.0/`** sebagai satu-satunya rujukan operasional pengembangan saat ini.*
