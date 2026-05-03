# 📋 Tech Checklist — CEAMIS Capstone Project

> **CEAMIS** — *Control Every Awful Money Impulse System*
> Dokumen ini berisi checklist teknis yang harus dipenuhi oleh setiap learning path dalam proyek Capstone CEAMIS.

---

## 📌 Daftar Isi

- [Legend Status](#-legend-status)
- [Front End & Back End](#-front-end--back-end)
- [Artificial Intelligence](#-artificial-intelligence)
- [Data Science](#-data-science)
- [Mapping Implementasi ↔ Checklist](#-mapping-implementasi--checklist)
- [Ringkasan Progress](#-ringkasan-progress)
- [Prioritas Segera](#-prioritas-segera-rekomendasi)

---

## 🔖 Legend Status

| Simbol | Keterangan |
|--------|------------|
| ✅ | Sudah selesai / sudah terpenuhi |
| 🔧 | Sedang dikerjakan / in progress |
| ❌ | Belum dimulai |
| ⭐ | Item opsional (Side Quest / Nilai Tambah) |

---

## 🌐 Front End & Back End

**PIC**: Wira Fikri Ramadanu (Frontend Dev) · Humaira Mutia (Backend Dev)

### Main Quest — Checklist Wajib (MVP)

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| FE-01 | Menggunakan **networking calls** untuk berinteraksi dengan API pada proyek. | 🔧 | Frontend sudah memiliki struktur `/api` di AI service. Integrasi fetch/Axios ke backend REST API belum aktif karena backend masih kosong. |
| FE-02 | Menggunakan **module bundler** (seperti webpack, Vite, dan sejenisnya) untuk membangun proyek aplikasi web. | ✅ | Menggunakan **Next.js 16** (built-in Turbopack/webpack). Lihat `frontend/package.json`. |
| FE-03 | Membangun **RESTful API** untuk mendukung aplikasi Front-End. | ❌ | Folder `backend/` sudah ada tapi masih kosong. AI Service (FastAPI) sudah ada struktur endpoint di `ai-service/app/api/`. |
| FE-04 | **RESTful API** dapat menyimpan data dengan atau tanpa menggunakan database. | ❌ | Belum ada implementasi penyimpanan data. Database (PostgreSQL) belum di-setup. |
| FE-05 | Membuat RESTful API dengan **URL yang mengikuti standar konvensi RESTful**. | ❌ | Menunggu implementasi backend. Endpoint di AI Service sudah distrukturkan (`/api/chatbot`, `/api/health_score`, `/api/recommendation`). |
| FE-06 | **Mengintegrasikan kemampuan AI/ML** sebagai fitur utama aplikasi, baik melalui back-end maupun langsung pada browser. | 🔧 | Frontend chatbot UI sudah ada (`/dashboard/chatbot`), tetapi masih menggunakan respons simulasi. Integrasi ke AI service belum aktif. |
| FE-07 | Memastikan **fitur utama** yang dikembangkan dalam proyek berjalan dengan baik tanpa menyebabkan **aplikasi crash**. | 🔧 | Landing page dan dashboard sudah berjalan stabil. Perlu testing lebih lanjut setelah integrasi API. |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| FE-S01 | ⭐ Membuat **mockup aplikasi** sebagai representasi visual dan desain dari antarmuka pengguna (UI). | ✅ | UI sudah terimplementasi langsung dalam kode dengan desain Neo-Brutalism yang konsisten. |
| FE-S02 | ⭐ Membangun **layout aplikasi web yang responsif** agar dapat berjalan dengan baik pada berbagai ukuran layar perangkat. | ✅ | Menggunakan `auto-fit`, `minmax()` pada grid, flex-wrap, dan responsive breakpoints di CSS. Lihat `styles/landing.css` dan `styles/dashboard.css`. |
| FE-S03 | ⭐ RESTful API dapat **menyimpan data ke dalam database**. | ❌ | PostgreSQL sudah direncanakan di tech stack (lihat `docs/SystemArchitecture-TechStack.md`), belum diimplementasikan. |
| FE-S04 | ⭐ RESTful API dibangun menggunakan **framework Express**. | ❌ | Backend Express.js belum diimplementasikan. Folder `backend/` kosong. |
| FE-S05 | ⭐ **Rekomendasi tools** untuk meningkatkan proses pengembangan: Bootstrap / Tailwind CSS, Axios. | ✅ | Menggunakan **Tailwind CSS v4** (`@tailwindcss/postcss`), **Lucide React** untuk ikon, dan **PostCSS**. Axios belum ditambahkan. |
| FE-S06 | ⭐ Melakukan **deployment** aplikasi web ke server. | ❌ | Belum dilakukan deployment. Rekomendasi: Vercel (untuk Next.js). |
| FE-S07 | ⭐ **Rekomendasi layanan hosting**: GitHub Pages, Netlify, atau Vercel. | ❌ | Belum ditentukan. Rekomendasi: **Vercel** (optimal untuk Next.js). |

---

## 🤖 Artificial Intelligence

**PIC**: Vanesha Alexandria Darmawan (AI Lead) · Muhammad Taufiqulhakim (AI Dev)

### Main Quest — Checklist Wajib (MVP)

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| AI-01 | Membangun **model Deep Learning** menggunakan **TensorFlow Functional API** atau **Model Subclassing**, yang disesuaikan dengan dataset dan permasalahan bisnis yang telah ditentukan oleh tim Data Science (jika ada). | ❌ | Folder `ai-service/training/` sudah ada (notebooks & scripts), tetapi file-nya masih berisi `.gitkeep`. Belum ada implementasi model. |
| AI-02 | Mengimplementasikan setidaknya satu **komponen kustom lanjutan** dalam proses pengembangan model: **Custom Layer**, **Custom Loss Function**, atau **Custom Callback**. | ❌ | Belum ada implementasi. |
| AI-03 | Menyimpan dan mengekspor model yang telah dilatih secara penuh dalam **format TensorFlow siap produksi** (Keras `.h5` atau `SavedModel`). | ❌ | Folder `ai-service/app/models/` sudah ada tapi hanya berisi `.gitkeep`. Belum ada model yang diekspor. |
| AI-04 | Membuat **kode sederhana untuk proses inferensi** model. | ❌ | Endpoint inferensi sudah distrukturkan di `ai-service/app/api/` (`health_score.py`, `recommendation.py`), tetapi belum ada implementasi kode. |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| AI-S01 | ⭐ Mengembangkan **REST API mandiri** menggunakan **FastAPI** atau Flask untuk melayani model machine learning. | 🔧 | Struktur FastAPI sudah disiapkan (`ai-service/app/main.py`, `api/`, `schemas/`, `utils/`), termasuk Dockerfile. Namun file-file masih kosong. |
| AI-S02 | ⭐ Mengimplementasikan **training dan evaluation loop kustom** secara penuh dari awal menggunakan `tf.GradientTape`. | ❌ | Belum ada implementasi. |
| AI-S03 | ⭐ Menggunakan **API Generative AI** untuk fitur tambahan atau fitur sekunder pada aplikasi. | ❌ | Chatbot saat ini menggunakan respons hardcode. Belum ada integrasi Generative AI API (misal Gemini/OpenAI). |
| AI-S04 | ⭐ Mengintegrasikan **TensorBoard** untuk memantau dan memvisualisasikan metrik pelatihan secara menyeluruh, serta menyertakan log yang dihasilkan dalam repository akhir. | ❌ | Folder `ai-service/logs/` sudah ada. Belum ada log TensorBoard. |
| AI-S05 | ⭐ Memastikan model memiliki **performa yang baik**, dengan ketentuan minimum: **Akurasi minimal 85%** dan **MAE maksimal 0,02**. | ❌ | Belum ada model yang dilatih untuk diukur performanya. |

---

## 📊 Data Science

**PIC**: Muhammad Devin Rahadi (Data Analyst) · Hafiz Hafrienda (Data Modeler & QA)

### Main Quest — Checklist Wajib (MVP)

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| DS-01 | Mengumpulkan dan menganalisis berbagai permasalahan, kemudian **menentukan satu solusi utama** yang akan dikembangkan dalam proyek. | 🔧 | Solusi utama sudah ditentukan: **ekosistem pencatatan keuangan berbasis AI dan gamifikasi untuk Gen-Z** (lihat `docs/PRD-CEAMIS.md`). |
| DS-02 | Melakukan proses **Data Wrangling** secara end-to-end: **Gathering Data**, **Assessing Data**, **Cleaning Data**. | ❌ | Belum ada dataset atau script wrangling di repository. |
| DS-03 | Mendefinisikan **pertanyaan bisnis** yang dapat diukur. | 🔧 | Success Metrics sudah didefinisikan di PRD: akurasi model AI ≥ 85%, retensi pengguna (streak ≥ 7 hari), engagement gamifikasi ≥ 60%. |
| DS-04 | Melakukan **Exploratory Data Analysis (EDA)** untuk mendapatkan insight dari data. | ❌ | Belum ada notebook EDA di `ai-service/training/notebooks/`. |
| DS-05 | Membuat **visualisasi data** dan melakukan **explanatory analysis** untuk menjawab pertanyaan bisnis. | ❌ | Belum ada implementasi. |
| DS-06 | Membangun **dashboard interaktif** menggunakan **Streamlit** untuk menampilkan insight dan kesimpulan. | ❌ | Belum ada implementasi Streamlit dashboard. |
| DS-07 | Memastikan **data sudah siap diproses oleh model**, serta disarankan untuk membuat **Data Dictionary**. | ❌ | Belum ada data pipeline atau Data Dictionary. |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| DS-S01 | ⭐ Melakukan **feature engineering** untuk menghasilkan fitur yang lebih informatif bagi model. | ❌ | Belum ada implementasi. |
| DS-S02 | ⭐ Melakukan **deployment dashboard** ke **Streamlit Cloud** agar dapat diakses secara publik. | ❌ | Belum ada implementasi. |
| DS-S03 | ⭐ Mengimplementasikan **A/B Testing** menggunakan Python. | ❌ | Belum ada implementasi. |
| DS-S04 | ⭐ Membuat **laporan teknis komprehensif** mulai dari tahap Problem Discovery hingga hasil akhir proyek dalam format **PDF**. | ❌ | Dokumentasi proyek sudah ada di `docs/` (PRD, Scope, dll.) tapi belum dikompilasi menjadi laporan teknis PDF. |

---

## 🗺️ Mapping Implementasi ↔ Checklist

Berikut adalah pemetaan antara file/komponen yang sudah ada di repository dengan checklist items terkait.

### Frontend — Sudah Terimplementasi

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| Landing Page | `frontend/src/app/page.tsx` | FE-S01 (Mockup/UI) |
| Landing Components | `frontend/src/components/landing/*.tsx` (10 komponen: Hero, Features, Steps, FAQ, CTA, dll.) | FE-S01, FE-S02 |
| Dashboard Main | `frontend/src/app/dashboard/page.tsx` | FE-01, FE-06, FE-07 |
| Dashboard Layout | `frontend/src/app/dashboard/layout.tsx` + Sidebar + Navbar | FE-S02 |
| Chatbot Page | `frontend/src/app/dashboard/chatbot/page.tsx` | FE-06 (UI ready, belum integrasi AI) |
| Education Page | `frontend/src/app/dashboard/education/page.tsx` + `[id]/page.tsx` | FE-06, FE-07 |
| Transactions Page | `frontend/src/app/dashboard/transactions/page.tsx` | FE-01, FE-07 |
| Gamification Page | `frontend/src/app/dashboard/gamification/page.tsx` | FE-07 |
| Warnings Page | `frontend/src/app/dashboard/warnings/page.tsx` | FE-06, FE-07 |
| History Page | `frontend/src/app/dashboard/history/page.tsx` | FE-01, FE-07 |
| Auth Page | `frontend/src/app/auth/page.tsx` | FE-07 |
| Design System CSS | `frontend/src/styles/` (components, dashboard, landing) | FE-S01, FE-S02, FE-S05 |

### AI Service — Struktur Siap, Implementasi Pending

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| FastAPI Entry | `ai-service/app/main.py` | AI-S01 |
| API Endpoints | `ai-service/app/api/chatbot.py`, `health_score.py`, `recommendation.py` | AI-04, AI-S01 |
| Model Directory | `ai-service/app/models/` | AI-03 |
| Request/Response Schema | `ai-service/app/schemas/request_response.py` | AI-S01 |
| Preprocessor | `ai-service/app/utils/preprocessor.py` | AI-04 |
| Training Notebooks | `ai-service/training/notebooks/` | AI-01, AI-02 |
| Training Scripts | `ai-service/training/scripts/` | AI-01, AI-02 |
| Docker Config | `ai-service/Dockerfile` | AI-S01 |
| TensorBoard Logs | `ai-service/logs/` | AI-S04 |

### Backend — Belum Diimplementasi

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| Express.js Backend | `backend/` (kosong) | FE-03, FE-04, FE-05, FE-S03, FE-S04 |

---

## 📈 Ringkasan Progress

### Berdasarkan Learning Path

| Learning Path | Main Quest | Side Quest | Total |
|--------------|------------|------------|-------|
| **Front End & Back End** | 1/7 ✅ · 2/7 🔧 · 4/7 ❌ | 3/7 ✅ · 0/7 🔧 · 4/7 ❌ | **4/14 done** |
| **Artificial Intelligence** | 0/4 ✅ · 0/4 🔧 · 4/4 ❌ | 0/5 ✅ · 1/5 🔧 · 4/5 ❌ | **0/9 done** |
| **Data Science** | 0/7 ✅ · 2/7 🔧 · 5/7 ❌ | 0/4 ✅ · 0/4 🔧 · 4/4 ❌ | **0/11 done** |

### Overall Progress

```
Main Quest (MVP Wajib):     1/18 ✅  (5.6%)
Side Quest (Nilai Tambah):  3/16 ✅  (18.8%)
Total Checklist:            4/34 ✅  (11.8%)
In Progress:                5/34 🔧  (14.7%)
Belum Dimulai:              25/34 ❌ (73.5%)
```

---

## 🚨 Prioritas Segera (Rekomendasi)

> [!IMPORTANT]
> Berikut adalah checklist item yang harus diprioritaskan untuk memenuhi **Main Quest (MVP Wajib)**.

### 🔴 Prioritas Kritis (Blocking)

1. **FE-03 / FE-S04**: Implementasi backend Express.js — semua API bergantung pada ini
2. **AI-01**: Mulai training model Deep Learning — core dari fitur AI
3. **DS-02**: Data Wrangling — model AI membutuhkan data bersih
4. **DS-04**: EDA — diperlukan sebelum training model

### 🟡 Prioritas Tinggi (Essential)

5. **FE-01**: Integrasi networking calls (fetch/Axios) ke API
6. **AI-04**: Kode inferensi model — agar bisa disajikan via API
7. **AI-03**: Export model ke format produksi
8. **FE-04 / FE-05**: Setup database dan konvensi RESTful API

### 🟢 Prioritas Menengah (Nice to Have)

9. **AI-S01**: Implementasi FastAPI service (struktur sudah ada)
10. **AI-S03**: Integrasi Generative AI API untuk chatbot
11. **DS-06**: Dashboard Streamlit
12. **FE-S06**: Deployment ke Vercel

---

*Dokumen ini dibuat pada: **3 Mei 2026** — akan di-update seiring perkembangan proyek.*
*Terakhir diupdate: 3 Mei 2026*
