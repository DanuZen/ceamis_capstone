# Product Requirements Document (PRD) — CEAMIS 2.0

**Nama Produk:** CEAMIS 2.0 (*Control Every Awful Money Impulse System 2.0*)  
**Status:** In Progress / Planning  
**Versi:** 2.0.0  
**Tim Inti (Core Team):**  
* **Wira Fikri Ramadanu** — *Project Lead & Fullstack/Mobile Engineer*  
* **Hafiz Hafrienda** — *AI Engineer & Data/QA Specialist*  

---

## 1. Latar Belakang & Visi Produk

### 1.1 Latar Belakang
Generasi Z di Indonesia menghadapi tantangan finansial yang unik: tingginya godaan belanja impulsif (*doom spending*, *FOMO culture*, *latte factor*) di era pembayaran digital instan (QRIS, PayLater, e-wallet). Sebagian besar aplikasi pencatat keuangan gagal karena:
1. **Friksi Pencatatan Tinggi:** Pengguna malas mengetik rincian belanja manual satu per satu.
2. **Ketiadaan Konteks Cerdas:** Hanya mencatat angka tanpa memberikan rekomendasi personal dan analisis psikologi belanja.
3. **Materi Edukasi yang Kaku:** Teori literasi keuangan konvensional membosankan dan tidak aplikatif.

### 1.2 Visi CEAMIS 2.0
CEAMIS 2.0 berevolusi dari sekadar web app menjadi **ekosistem finansial lintas platform (Web + Mobile App)** yang proaktif, cerdas, dan menyenangkan dengan:
* **Pencatatan Instan via Foto Struk (Smart OCR):** Memotret struk belanja dan langsung terkonversi menjadi transaksi terstruktur.
* **AI Behavioral Analysis:** Skor kesehatan keuangan berbasis data riil, klaster gaya hidup, dan profil risiko investasi.
* **CAMI (AI Financial Companion):** Sahabat finansial pribadi berbasis GenAI untuk konsultasi seputar uang.
* **Edukasi Terkurasi & Gamifikasi:** Kuis dan modul berbasis kurikulum teruji yang dikelola secara penuh via Admin CRUD (menghilangkan halusinasi AI).

---

## 2. Struktur Tim & Pembagian Tanggung Jawab

| Anggota Tim | Peran Utama | Lingkup Tanggung Jawab |
| :--- | :--- | :--- |
| **Wira Fikri Ramadanu** | **Project Lead & Fullstack/Mobile Engineer** | - Arsitektur Monorepo & Supabase Cloud<br>- Pengembangan Mobile App (Flutter)<br>- Backend API Gateway (NestJS) & Endpoint OCR<br>- Frontend Web App (Next.js App Router)<br>- CI/CD Pipeline & Deployment (Vercel, Hugging Face) |
| **Hafiz Hafrienda** | **AI Engineer & Data/QA Specialist** | - Evaluasi & Fine-tuning Model ML (Health Score, K-Means, Risk Profile)<br>- Prompt Engineering & Validasi JSON Schema (Gemini 2.0 OCR & CAMI)<br>- Data Pipeline, Feature Engineering, & Dataset Struk Indonesia<br>- Quality Assurance, Edge Case Testing, & UAT |

---

## 3. Arsitektur Ekosistem CEAMIS 2.0

```text
                    ┌─────────────────────────────────────────┐
                    │            KLIEN PENGGUNA               │
                    ├────────────────────┬────────────────────┤
                    │   Flutter Mobile   │    Next.js Web     │
                    │   (iOS & Android)  │  (Portal & Admin)  │
                    └─────────┬──────────┴─────────┬──────────┘
                              │                    │
                              ▼                    ▼
                    ┌─────────────────────────────────────────┐
                    │         API GATEWAY (NestJS)            │
                    │   Host: Hugging Face Spaces (Docker)    │
                    │   CI/CD: GitHub Actions (Automated)     │
                    └─────────┬──────────┬─────────┬──────────┘
                              │          │         │
             ┌────────────────┘          │         └────────────────┐
             ▼                           ▼                          ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│     SUPABASE CLOUD      │ │     AI MICROSERVICE     │ │     GOOGLE GEMINI       │
│  - PostgreSQL Database  │ │    (FastAPI Python)     │ │  - Gemini 2.0 Flash     │
│  - GoTrue Auth (JWT)    │ │  - Model 1: Health Score│ │  - Receipt OCR Parsing  │
│  - Storage (Foto Struk) │ │  - Model 2: K-Means     │ │  - CAMI GenAI Chatbot   │
│  - Pooler (Port 6543)   │ │  - Model 3: Risk Profile│ │  - Groq Llama 3 Backup  │
└─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

---

## 4. Fitur Utama & Kebutuhan Spesifikasi

### 4.1 Fitur 1: Mobile App (Flutter)
* **Platform:** Android & iOS.
* **Autentikasi:** Supabase Auth SDK (`supabase_flutter`) tersinkronisasi dengan Web.
* **Navigasi Utama (Bottom Bar):**
  1. *Dashboard:* Kartu Skor Kesehatan Finansial, Persona Belanja, Saldo & Budget Limit.
  2. *Transaksi:* Riwayat transaksi, tombol input manual, dan tombol kamera scan struk.
  3. *CAMI AI:* Percakapan interaktif dengan asisten finansial.
  4. *Edukasi:* Modul belajar dan kuis berhadiah XP.
  5. *Profil & Gamifikasi:* Level pengguna, *streak* harian, dan koleksi *badge*.

### 4.2 Fitur 2: Smart OCR Receipt Scanner (Pencatat Struk Cerdas)
* **Alur Eksekusi (Hybrid):**
  1. Pengguna memotret struk belanja di aplikasi Flutter.
  2. **Google ML Kit Text Recognition** (on-device) mengekstrak teks mentah secara instan dan tanpa kuota.
  3. Teks mentah dikirim ke backend NestJS (`POST /api/v1/ocr/parse-receipt`).
  4. NestJS meneruskan teks ke **Gemini 2.0 Flash** dengan format *Structured JSON Schema*.
  5. Gemini mengekstrak: Nama Toko, Tanggal, Total Pembayaran, Kategori, Daftar Item Belanja, serta **Auto-Tagging (`needs` / `wants`)**.
  6. **Human-in-the-Loop:** Tampil layar *Form Pratinjau* di mobile agar pengguna dapat mengoreksi data jika ada angka pudar.
  7. Pengguna klik **Simpan** $\rightarrow$ Transaksi masuk ke Supabase, foto struk disimpan ke Supabase Storage.

### 4.3 Fitur 3: Predictive Machine Learning Engine
* **Model 1 — Financial Health Score:**
  * Formula komprehensif mengukur rasio tabungan, rasio keinginan, DTI, dan kepatuhan anggaran dalam rentang 0–100.
* **Model 2 — Spending Pattern Cluster (K-Means Clustering):**
  * Mengelompokkan pola transaksi pengguna ke persona riil: *Si Hemat*, *Impulsive Buyer*, *Sultan Seimbang*.
* **Model 3 — Risk Profile Classifier (Scikit-Learn Classifier):**
  * Akurasi 97.91% dalam memetakan toleransi risiko investasi pengguna (*Konservatif*, *Moderat*, *Agresif*) berdasarkan data sosio-ekonomi dan kuesioner onboarding.

### 4.4 Fitur 4: Asisten AI Personal (CAMI)
* **Teknologi:** Google Gemini 2.0 Flash (Primary) + Groq Llama 3.1 (Fallback).
* **Integrasi Data:** Terhubung langsung ke context finansial Supabase pengguna.
* **Persona:** Sahabat finansial Gen-Z Indonesia — santai, jujur, solutif, dan anti-boros.

### 4.5 Fitur 5: Sistem Edukasi & Kuis Terkurasi (Admin CRUD)
* **Prinsip:** Tidak lagi memakai generator kuis otomatis demi mencegah salah materi / halusinasi AI.
* **Admin Portal (`/admin/education` & `/admin/quizzes`):**
  * Admin dapat membuat modul, menyusun materi halaman per halaman, menginput soal kuis pilihan ganda, dan mengatur kunci jawaban.
* **Gamifikasi Terintegrasi:** Setiap kuis yang diselesaikan memberikan reward XP, menaikkan level akun, dan menambah *streak*.

---

## 5. Matriks Prioritas Fitur (MoSCoW)

| Kategori | Fitur | Pelaksana |
| :--- | :--- | :--- |
| **Must Have** | - Flutter App Shell & Supabase Auth Sync<br>- Endpoint Proxy OCR & Gemini JSON Schema<br>- On-device ML Kit Scanner & Form Pratinjau<br>- Dashboard Skor Kesehatan & Spending Cluster | Wira & Hafiz |
| **Should Have** | - Auto-tagging transaksi (`needs` vs `wants`) di prompt OCR<br>- Chatbot CAMI dengan model `gemini-2.0-flash`<br>- Upload & simpan foto struk ke Supabase Storage Bucket | Wira & Hafiz |
| **Could Have** | - Notifikasi pengingat streak harian (*push notifications*)<br>- Ekspor laporan keuangan ke format PDF / CSV | Wira |
| **Won't Have (v2.0)** | - Integrasi Open Finance / Bank API langsung (fokus pada OCR struk dan manual) | - |

---

## 6. Kriteria Keberhasilan (Success Metrics)

1. **Akurasi Ekstraksi OCR:** $\ge 85\%$ data total belanja dan nama merchant berhasil terbaca akurat pada struk fisik standar Indonesia.
2. **Efisiensi Waktu Input:** Waktu mencatat transaksi terpangkas dari $\sim 45$ detik (ketik manual) menjadi $< 10$ detik (foto & konfirmasi).
3. **Stabilitas Layanan:** API Gateway dan Microservice mempertahankan uptime $\ge 99\%$ dengan CI/CD deployment otomatis.
