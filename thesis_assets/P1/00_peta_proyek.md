# Peta Struktur Proyek dan Panduan Eksekusi (Tugas P1)

Dokumen ini menyajikan pemetaan komprehensif struktur repositori CEAMIS, mencakup modul aplikasi mobile (Flutter), dasbor web administrator (Next.js), backend REST API (FastAPI), serta konfigurasi dan migrasi basis data (PostgreSQL / Supabase).

---

## 1. Ringkasan Topologi Repositori

Repositori CEAMIS diorganisasikan ke dalam arsitektur monorepo terarah dengan pembagian tanggung jawab sebagai berikut:

```text
ceamis_capstone/
├── mobile/             # Klien Mobile Aplikasi Pengguna (Flutter / Dart)
├── frontend/           # Dasbor Web Khusus Administrator (Next.js / TypeScript)
├── backend/            # Backend Monolit Modular Tunggal & ML Service (FastAPI / Python)
├── data-app/           # Dataset, Eksplorasi Analisis, dan Notebook Pelatihan Model
├── docs/               # Dokumentasi Rujukan & Rencana Pengembangan
└── thesis_assets/      # Artefak, Diagram, dan Laporan Bahan BAB III Skripsi
```

---

## 2. Pemetaan Komponen Sistem

### A. Klien Mobile Pengguna (`mobile/`)
- **Peran:** Antarmuka interaksi utama bagi peran *User* untuk pencatatan transaksi, pemindaian OCR struk, pemantauan indikator kesehatan finansial, simulasi anggaran/tabungan, dan evaluasi pra-pembelian (*pre-purchase check*).
- **Teknologi Utama:**
  - Framework: Flutter SDK 3.11+ / Dart
  - Desain Sistem: Neo-Brutalisme Kustom (`AppColors`, `NeoBrutalCard`, `NeoBrutalButton`)
  - State Management: `flutter_riverpod` (v2.5.1)
  - Routing: `go_router` (v14.6.2)
  - Networking & Gateway: `dio` (v5.7.0), `supabase_flutter` (v2.8.3)
  - Fitur Khusus: `google_mlkit_text_recognition` (OCR lokal di perangkat)
- **Cara Menjalankan:**
  ```powershell
  cd mobile
  flutter pub get
  flutter run -d chrome        # Untuk simulasi web / pengujian tampilan
  # atau: flutter run          # Untuk emulator Android / perangkat fisik
  ```
- **Port / Konfigurasi:** Berjalan pada port dinamis emulator atau localhost web (misalnya `http://localhost:5000`), mengarah ke backend API pada `http://localhost:8000`.

### B. Dasbor Web Administrator (`frontend/`)
- **Peran:** Antarmuka tata kelola khusus peran *Admin* untuk pemantauan layanan, manajemen akun pengguna, konfigurasi aturan sistem (*cold start* & ambang), evaluasi performa model, manajemen versi model (beserta *1-click rollback*), dan peninjauan log audit.
- **Teknologi Utama:**
  - Framework: Next.js 16.2.4 (App Router)
  - Bahasa: TypeScript & React 19
  - Styling: Tailwind CSS v4 & Lucide React
  - Database Client: Prisma ORM (`@prisma/client` v6.19.3) & `@supabase/supabase-js`
- **Cara Menjalankan:**
  ```powershell
  cd frontend
  npm install
  npx prisma generate
  npm run dev
  ```
- **Port / Konfigurasi:** `http://localhost:3000` (atau `http://localhost:3001` jika port 3000 terpakai).

### C. Backend Monolit Modular (`backend/`)
- **Peran:** Pusat logika bisnis tunggal yang menangani API RESTful, ekstraksi 7 fitur kontekstual, mesin inferensi model pra-pembelian (Random Forest & Logistic Regression), formula kesehatan finansial, pemrosesan OCR, dan registri model.
- **Teknologi Utama:**
  - Framework: FastAPI (v0.110+) dengan ASGI Server Uvicorn
  - Bahasa: Python 3.11+ (menggunakan Virtual Environment di `backend/venv`)
  - Machine Learning: Scikit-learn, Joblib, NumPy, Pandas
  - Validasi Skema: Pydantic v2
- **Cara Menjalankan:**
  ```powershell
  cd backend
  .\venv\Scripts\activate
  uvicorn app.main:app --reload --port 8000
  # Atau menggunakan skrip bawaan: .\run.ps1
  ```
- **Port & Dokumentasi Interaktif:**
  - Base URL: `http://localhost:8000`
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`

### D. Basis Data dan Penyimpanan (`backend/` & `supabase/`)
- **Sistem:** PostgreSQL 15+ yang di-host pada Supabase Cloud.
- **Integritas:** Menggunakan 13 entitas relasional inti (`user_profiles`, `categories`, `budgets`, `transactions`, `savings_goals`, `pre_purchase_checks`, `risk_predictions`, `post_decision_feedbacks`, `receipt_scans`, `audit_logs`, `model_versions`, `system_rules`, `user_streaks`).
- **Skema Definisi:** Didefinisikan secara deklaratif pada [frontend/prisma/schema.prisma](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma) dan skrip SQL migrasi di [docs/ceamis 2.0/DATABASE_SCHEMA.md](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/DATABASE_SCHEMA.md).

---

## 3. Matriks Lingkungan Eksekusi Mandiri

| Komponen | Direktori Kerja | Perintah Eksekusi Utama | Prasyarat Perangkat Lunak | URL Akses Lokal |
|:---|:---|:---|:---|:---|
| Backend API | `backend/` | `.\venv\Scripts\uvicorn.exe app.main:app --port 8000` | Python 3.11+, dependensi di `requirements.txt` | `http://127.0.0.1:8000` |
| Admin Web | `frontend/` | `npm run dev` | Node.js v18+, NPM | `http://localhost:3000` |
| Mobile App | `mobile/` | `flutter run -d chrome` / `flutter run` | Flutter SDK 3.11+, Chrome / Android SDK | Port lokal peramban / USB Debugging |
| Basis Data | Cloud Supabase | Terkelola daring via koneksi `DATABASE_URL` | Akses internet & koneksi SSL PostgreSQL | `aws-0-ap-southeast-1.pooler.supabase.com` |
