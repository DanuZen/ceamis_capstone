# Panduan Migrasi Backend ke Full Python (FastAPI) — CEAMIS 2.0

> **Status:** Resmi Diterapkan  
> **Tanggal:** 20 September 2026  
> **PIC Backend:** Wira Fikri Ramadanu  
> **PIC AI & ML:** Hafiz Hafrienda  

---

## 1. Latar Belakang & Rationale Migrasi

Pada arsitektur awal (CEAMIS 1.0), sistem menggunakan dua backend terpisah:
1. **NestJS (`backend/`)** — Menangani API Gateway, Auth, dan CRUD transaksi.
2. **FastAPI (`ai-service/`)** — Menangani inferensi model Machine Learning dan Gemini OCR.

### Mengapa Digabung Menjadi 1 Backend FastAPI Python Tunggal?
1. **Menghilangkan Latensi Antar-Layanan (*Zero Network Hop*):**  
   Pada arsitektur lama, saat aplikasi memanggil fitur cerdas, request harus transit: `Mobile -> NestJS -> (HTTP) -> FastAPI -> NestJS -> Mobile`. Ini menimbulkan delay 150–350 ms. Pada FastAPI modular tunggal, model ML dieksekusi langsung *in-memory*, sehingga waktu inferensi menjadi **< 50 ms**.
2. **Efisiensi Bahasa & Pemeliharaan:**  
   Seluruh backend kini menggunakan **Python 3.11+**. Tidak ada duplikasi pendefinisian skema (sebelumnya DTO di TypeScript dan Pydantic di Python).
3. **Penyelarasan dengan Arahan Dosen Pembimbing:**  
   Dosen pembimbing menekankan kesederhanaan arsitektur, kejelasan data pipeline, dan fokus pada intervensi pra-pembelian. Menggabungkan backend ke dalam Python memungkinkan tim mengintegrasikan data transaksi langsung dengan model prediktif tanpa gesekan serialisasi.

---

## 2. Restrukturisasi Direktori Monorepo

Struktur repositori utama telah ditata ulang sebagai berikut:

```
ceamis_capstone/
├── backend/                       ← [BARU] 1 Aplikasi FastAPI Modular (Python 3.11+)
│   ├── app/                       ← Kode sumber aplikasi modular
│   │   ├── main.py                ← Entry point FastAPI & registrasi router
│   │   ├── config.py              ← Pengaturan konfigurasi & env
│   │   ├── database.py            ← SQLAlchemy 2.0 Async / Supabase Client
│   │   ├── auth/                  ← Autentikasi Supabase JWT
│   │   ├── users/                 ← Profil & preferensi pengguna
│   │   ├── transactions/          ← CRUD transaksi pengeluaran/pemasukan
│   │   ├── budgets/               ← Pagu anggaran per kategori
│   │   ├── goals/                 ← Target tabungan
│   │   ├── pre_purchase/          ← ★ FITUR INTI: Evaluasi pra-pembelian
│   │   ├── risk_model/            ← ★ Engine inferensi & training ML (Scikit-Learn)
│   │   ├── health_score/          ← Formula kesehatan finansial (Rule-based)
│   │   ├── ocr/                   ← Integrasi Gemini Flash untuk parsing struk
│   │   └── admin/                 ← Governance model ML & audit log
│   ├── artifacts/                 ← File model tersimpan (.joblib, .json)
│   ├── requirements.txt           ← Dependensi Python
│   └── Dockerfile                 ← Deployment container tunggal
│
├── backend_nestjs_archive/        ← [ARSIP] Kode NestJS lama (1.0) disimpan untuk referensi
├── mobile/                        ← Flutter Mobile App (Satu-satunya client end-user)
├── frontend/                      ← Next.js Web (Khusus Admin Dashboard)
└── docs/
    ├── ceamis 1.0/                ← Arsip dokumentasi lama (00-19, PRD 1.0, dll)
    └── ceamis 2.0/                ← Dokumentasi resmi arsitektur aktif
```

---

## 3. Pemetaan Logika Bisnis: NestJS ➔ FastAPI

| Modul NestJS (Lama) | Lokasi di NestJS | Modul FastAPI (Baru) | Lokasi di `backend/app/` |
|---|---|---|---|
| **Autentikasi & Guard** | `backend/src/supabase/` | `auth/` | `backend/app/auth/` & `core/security.py` |
| **Profil Pengguna** | `backend/src/users/` | `users/` | `backend/app/users/` |
| **Transaksi CRUD** | `backend/src/transactions/` | `transactions/` | `backend/app/transactions/` |
| **Peringatan Impulsif** | `backend/src/warnings/` | `pre_purchase/` | `backend/app/pre_purchase/` *(Berevolusi menjadi fitur pra-beli)* |
| **AI Client (HTTP)** | `backend/src/ai/` | `risk_model/` | `backend/app/risk_model/` *(Kini in-memory Python)* |
| **OCR Gateway** | `backend/src/ai/ocr` | `ocr/` | `backend/app/ocr/` |

---

## 4. Panduan Menjalankan Backend FastAPI Lokal

### 4.1 Prasyarat
- Python 3.11 atau lebih baru
- Virtual Environment (`venv`)

### 4.2 Langkah Instalasi & Menjalankan Server

1. **Masuk ke folder backend:**
   ```bash
   cd backend
   ```

2. **Buat dan aktifkan virtual environment:**
   - Di Windows (PowerShell):
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   - Di Linux / macOS:
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. **Install dependensi:**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Konfigurasi Environment Variables (`.env`):**
   Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
   Pastikan variabel kunci terisi:
   ```env
   # Database & Auth Supabase
   SUPABASE_URL="https://your-project.supabase.co"
   SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   DATABASE_URL="postgresql+asyncpg://postgres:password@db.your-project.supabase.co:5432/postgres"

   # AI & External Services
   GEMINI_API_KEY="your-gemini-api-key"
   JWT_SECRET="your-supabase-jwt-secret"
   ENVIRONMENT="development"
   ```

5. **Jalankan Development Server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Buka Dokumentasi Interaktif (Swagger UI):**
   Buka browser di: [http://localhost:8000/docs](http://localhost:8000/docs)  
   Atau Redoc di: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 5. Rencana Deployment Produksi

Backend FastAPI tunggal ini akan dideploy menggunakan **Docker Container** di cloud:
* **Host Platform:** Hugging Face Spaces (Docker SDK) / Railway / Render / Supabase Edge Container.
* **Port Standar:** `8000` (atau `7860` untuk Hugging Face).
* **Command Produksi:** `uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4`.
