# 🚀 CEAMIS 2.0 — FastAPI Backend Documentation

Dokumentasi resmi dan panduan operasional backend **CEAMIS 2.0** berbasis Python (FastAPI).

---

## 📋 Daftar Isi
1. [Spesifikasi Teknologi](#-spesifikasi-teknologi)
2. [Prasyarat Sistem (Instalasi Python)](#-prasyarat-sistem)
3. [Panduan Menjalankan Cepat (1-Klik Helper Script)](#-panduan-menjalankan-cepat)
4. [Panduan Menjalankan Manual (Step-by-Step)](#-panduan-menjalankan-manual)
5. [Konfigurasi Environment (.env)](#-konfigurasi-environment)
6. [Daftar Endpoint Utama](#-daftar-endpoint-utama)
7. [Panduan Menghubungkan Frontend & Mobile](#-menghubungkan-frontend--mobile)
8. [Penyelesaian Masalah (Troubleshooting)](#-penyelesaian-masalah-troubleshooting)

---

## 🛠 Spesifikasi Teknologi

| Komponen | Teknologi | Keterangan |
| --- | --- | --- |
| **Framework** | FastAPI 0.110+ | Asynchronous REST API berperforma tinggi |
| **Bahasa** | Python 3.11 atau 3.12 | Direkomendasikan Python 3.11 |
| **Server ASGI** | Uvicorn | Production-ready ASGI web server |
| **Validasi Skema** | Pydantic v2 | Validasi tipe data & request/response model |
| **Machine Learning** | Scikit-Learn, Joblib, NumPy, Pandas | Model Prediksi Risiko Pra-Beli (7 Fitur) |
| **Generative AI** | Google Gemini 2.0 Flash (`google-generativeai` / REST) | Ekstraksi Smart OCR struk & Chatbot CAMI |
| **Database Gateway** | Supabase Cloud (PostgreSQL 15+) | Autentikasi JWT & Row-Level Security (RLS) |

---

## 💻 Prasyarat Sistem

Pastikan Python 3.11+ sudah terpasang pada komputer Anda.

### Cara Cek di Terminal:
```powershell
python --version
```
Jika muncul versi `Python 3.11.x` atau `Python 3.12.x`, lewati langkah instalasi berikut.

### Cara Install Python di Windows:
Buka **PowerShell** dan jalankan:
```powershell
winget install Python.Python.3.11 --override "/passive PrependPath=1"
```
*Atau download installer resmi dari [python.org](https://www.python.org/downloads/) dan **WAJIB CENTANG "Add python.exe to PATH"** sebelum menekan tombol Install.*

---

## ⚡ Panduan Menjalankan Cepat (Helper Script)

Untuk memudahkan, kami telah menyediakan skrip otomatis di dalam folder `backend/`:

### Opsi A: Menggunakan PowerShell
```powershell
cd backend
.\run.ps1
```

### Opsi B: Menggunakan File Batch (Double-Click)
Cukup buka folder `backend` di Windows File Explorer dan **klik 2x file `run.bat`**.

> Script ini akan otomatis membuat `venv`, menginstall semua library dari `requirements.txt`, membuat file `.env` jika belum ada, lalu langsung menyalakan server di port **8000**.

---

## 📖 Panduan Menjalankan Manual (Step-by-Step)

Jika ingin menjalankan secara manual langkah demi langkah:

### 1. Masuk ke Direktori Backend
```powershell
cd c:\Users\wira1\project\ceamis_capstone\backend
```

### 2. Buat & Aktifkan Virtual Environment (venv)
```powershell
# Buat environment lokal
python -m venv venv

# Aktifkan di PowerShell:
.\venv\Scripts\Activate.ps1

# (Jika menggunakan Command Prompt / CMD biasa):
# venv\Scripts\activate.bat
```

> **Catatan:** Jika muncul pesan error *"cannot be loaded because running scripts is disabled on this system"*, jalankan perintah ini sekali saja:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

### 3. Install Dependensi Python
Pastikan virtual environment aktif (terlihat tanda `(venv)` di sebelah kiri terminal):
```powershell
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Setup File `.env`
Salin template konfigurasi jika belum ada:
```powershell
copy .env.example .env
```
Buka file `.env` dan isi variabel penting (lihat bagian [Konfigurasi Environment](#-konfigurasi-environment)).

### 5. Jalankan Server FastAPI
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Server akan aktif di: **`http://localhost:8000`**.

---

## ⚙️ Konfigurasi Environment (`.env`)

File `.env` terletak di root folder `backend/.env`. Berikut rincian variabelnya:

```env
# Port Server
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development

# Google Gemini AI (Diperlukan untuk Smart OCR Struk & Chatbot CAMI)
GEMINI_API_KEY=AIzaSy...your_gemini_api_key_here

# Supabase Database & Auth (Sinkronisasi dengan Mobile & Web)
SUPABASE_URL=https://ekgzrqxygukenlmnhbhc.supabase.co
SUPABASE_KEY=your_supabase_anon_or_service_role_key

# CORS Allowed Origins
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000
```

---

## 🌐 Akses Dokumentasi Interaktif (Swagger UI)

Setelah server berjalan, Anda dapat menguji langsung seluruh endpoint melalui browser:

* **Swagger UI (Interactive API Tester)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **ReDoc (Alternative Spec Documentation)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
* **OpenAPI JSON**: [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json)

---

## 📡 Daftar Endpoint Utama

Semua endpoint diberi prefix `/api/v1`:

### 1. ★ Fitur Inti: Cek Risiko Pra-Pembelian (Pre-Purchase Risk)
* **Endpoint:** `POST /api/v1/predict/pre-purchase-risk`
* **Deskripsi:** Memprediksi tingkat risiko pengeluaran (LOW, MEDIUM, HIGH) berdasarkan 7 fitur finansial.
* **Payload Contoh:**
  ```json
  {
    "planned_amount": 150000,
    "category": "Food & Beverage",
    "payment_method": "QRIS",
    "user_monthly_income": 5000000,
    "current_budget_limit": 2000000,
    "current_budget_spent": 1450000,
    "saving_rate_raw": 0.284
  }
  ```

### 2. 🧾 Smart OCR Parse Receipt
* **Endpoint:** `POST /api/v1/ocr/parse-receipt`
* **Deskripsi:** Ekstraksi teks mentah struk belanja menjadi data transaksi terstruktur via Gemini 2.0 Flash dengan fallback heuristik.
* **Payload Contoh:**
  ```json
  {
    "raw_text": "INDOMARET UTAMA\n21/09/2026\nSusu UHT 20000\nRoti 25000\nTOTAL 45000\nQRIS"
  }
  ```

### 3. 📊 Financial Health Score
* **Endpoint:** `POST /api/v1/predict/health-score`
* **Deskripsi:** Menghitung skor kesehatan finansial (0–100) dan spending cluster (Sehat, Waspada, Boros).

### 4. 🤖 LLM-Powered XAI Insights & Recommendations
* **Endpoint:** `POST /api/v1/dashboard/insight`
* **Endpoint:** `POST /api/v1/recommendation`
* **Deskripsi:** Penjelasan keputusan finansial dan saran penghematan berbasis AI.

### 5. 🛡️ Admin Governance Dashboard
* **Endpoint:** `GET /api/v1/admin/models`
* **Endpoint:** `GET /api/v1/admin/audit-logs`
* **Deskripsi:** Monitoring performa model Machine Learning dan audit intervensi sistem.

---

## 🔗 Menghubungkan Frontend & Mobile

### Untuk Web Dashboard (`frontend`):
Buka file `frontend/.env.local`, ubah URL backend ke port lokal:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/api/v1
```

### Untuk Mobile App (`mobile`):
Buka file `mobile/lib/core/constants/api_endpoints.dart`:
* **Emulator Android:** gunakan `http://10.0.2.2:8000`
* **HP Fisik (USB Debugging):** gunakan IP LAN komputer Anda (misal `http://192.168.x.x:8000`)
* **Live Cloud:** gunakan URL Hugging Face `https://danuzen-ceamis-backend.hf.space`

---

## ❓ Penyelesaian Masalah (Troubleshooting)

### 1. `python: command not found` atau Mengarah ke Windows Store
* **Penyebab:** Python belum masuk ke Environment Variable `PATH` sistem Windows.
* **Solusi:** Buka menu *Settings > Apps > Advanced app settings > App execution aliases*, matikan opsi **"App Installer (python.exe)"** dan **"App Installer (python3.exe)"**. Pastikan Python 3.11 terinstall dan centang *Add to PATH*.

### 2. Error `Execution of scripts is disabled on this system` saat Aktivasi venv
* **Solusi:** Buka PowerShell sebagai Administrator (atau user saat ini) lalu jalankan:
  ```powershell
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
  ```

### 3. Error `Port 8000 is already in use`
* **Solusi:** Matikan proses yang memakai port 8000:
  ```powershell
  # Cek PID port 8000
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process -Force
  ```

### 4. Error saat Memuat Model Machine Learning (.joblib)
* Backend CEAMIS telah dirancang dengan **Safe Fallback System**:
  * Jika file `.joblib` belum selesai dilatih atau hilang di folder `artifacts_risk/`, server **TIDAK AKAN CRASH**, melainkan otomatis menggunakan aturan rule-based cerdas hingga model dilatih ulang.
  * Untuk melatih model ML dari awal, jalankan:
    ```powershell
    python training/train_risk_model.py
    ```

---

*Hak Cipta © 2026 Tim Pengembang CEAMIS 2.0.*
