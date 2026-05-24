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
| FE-01 | Menggunakan **networking calls** untuk berinteraksi dengan API pada proyek. | ✅ | Integrasi fetch/Axios ke backend REST API dan AI service sudah aktif. |
| FE-02 | Menggunakan **module bundler** (seperti webpack, Vite, dan sejenisnya) untuk membangun proyek aplikasi web. | ✅ | Menggunakan **Next.js 16** (built-in Turbopack/webpack). Lihat `frontend/package.json`. |
| FE-03 | Membangun **RESTful API** untuk mendukung aplikasi Front-End. | ✅ | Backend sudah diimplementasikan menggunakan NestJS di folder `backend/`. |
| FE-04 | **RESTful API** dapat menyimpan data dengan atau tanpa menggunakan database. | ✅ | Backend sudah terhubung dengan database Supabase (PostgreSQL). |
| FE-05 | Membuat RESTful API dengan **URL yang mengikuti standar konvensi RESTful**. | ✅ | Endpoint di backend NestJS dan AI Service FastAPI sudah mengikuti standar RESTful. |
| FE-06 | **Mengintegrasikan kemampuan AI/ML** sebagai fitur utama aplikasi, baik melalui back-end maupun langsung pada browser. | ✅ | AI chatbot dan prediksi model kesehatan finansial sudah diintegrasikan ke frontend. |
| FE-07 | Memastikan **fitur utama** yang dikembangkan dalam proyek berjalan dengan baik tanpa menyebabkan **aplikasi crash**. | ✅ | Aplikasi berjalan stabil, integrasi frontend dan backend sudah divalidasi. |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| FE-S01 | ⭐ Membuat **mockup aplikasi** sebagai representasi visual dan desain dari antarmuka pengguna (UI). | ✅ | UI sudah terimplementasi langsung dalam kode dengan desain minimalis yang konsisten. |
| FE-S02 | ⭐ Membangun **layout aplikasi web yang responsif** agar dapat berjalan dengan baik pada berbagai ukuran layar perangkat. | ✅ | Menggunakan `auto-fit`, `minmax()` pada grid, flex-wrap, dan responsive breakpoints di CSS. |
| FE-S03 | ⭐ RESTful API dapat **menyimpan data ke dalam database**. | ✅ | Supabase (PostgreSQL) sudah diimplementasikan di backend. |
| FE-S04 | ⭐ RESTful API dibangun menggunakan **framework Express**. | ✅ | Menggunakan framework NestJS yang berjalan di atas Express.js. |
| FE-S05 | ⭐ **Rekomendasi tools** untuk meningkatkan proses pengembangan: Bootstrap / Tailwind CSS, Axios. | ✅ | Menggunakan **Tailwind CSS v4** (`@tailwindcss/postcss`), **Lucide React** untuk ikon. |
| FE-S06 | ⭐ Melakukan **deployment** aplikasi web ke server. | ❌ | Belum dilakukan deployment. Rekomendasi: Vercel (untuk Next.js). |
| FE-S07 | ⭐ **Rekomendasi layanan hosting**: GitHub Pages, Netlify, atau Vercel. | ❌ | Belum ditentukan. Rekomendasi: **Vercel** (optimal untuk Next.js). |

---

## 🤖 Artificial Intelligence

**PIC**: Vanesha Alexandria Darmawan (AI Lead) · Muhammad Taufiqulhakim (AI Dev)

### Main Quest — Checklist Wajib (MVP)

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| AI-01 | Membangun **model Deep Learning** menggunakan **TensorFlow Functional API** atau **Model Subclassing**, yang disesuaikan dengan dataset dan permasalahan bisnis yang telah ditentukan oleh tim Data Science (jika ada). | ✅ | Model sudah dibangun dan dilatih (lihat file notebook di `ai-service/training/notebooks/`). |
| AI-02 | Mengimplementasikan setidaknya satu **komponen kustom lanjutan** dalam proses pengembangan model: **Custom Layer**, **Custom Loss Function**, atau **Custom Callback**. | ✅ | Terdapat implementasi `FinancialAttentionLayer` dan `custom_health_loss` pada model. |
| AI-03 | Menyimpan dan mengekspor model yang telah dilatih secara penuh dalam **format TensorFlow siap produksi** (Keras `.h5` atau `SavedModel`). | ✅ | Model sudah diekspor dalam format `.keras` dan disimpan di folder `ai-service/app/models/`. |
| AI-04 | Membuat **kode sederhana untuk proses inferensi** model. | ✅ | Kode inferensi sudah diimplementasikan di endpoint FastAPI (`app/api/health_score.py`, dsb). |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| AI-S01 | ⭐ Mengembangkan **REST API mandiri** menggunakan **FastAPI** atau Flask untuk melayani model machine learning. | ✅ | REST API mandiri dengan FastAPI sudah diimplementasikan lengkap dengan endpoint. |
| AI-S02 | ⭐ Mengimplementasikan **training dan evaluation loop kustom** secara penuh dari awal menggunakan `tf.GradientTape`. | ✅ | Terdapat implementasi custom training loop menggunakan `tf.GradientTape` di notebook. |
| AI-S03 | ⭐ Menggunakan **API Generative AI** untuk fitur tambahan atau fitur sekunder pada aplikasi. | ✅ | Chatbot (CAMI) menggunakan integrasi LLM (Gemini 1.5 Flash / Groq Llama 3) via API. |
| AI-S04 | ⭐ Mengintegrasikan **TensorBoard** untuk memantau dan memvisualisasikan metrik pelatihan secara menyeluruh, serta menyertakan log yang dihasilkan dalam repository akhir. | ✅ | Log TensorBoard telah dihasilkan dan disimpan di `ai-service/logs/`. |
| AI-S05 | ⭐ Memastikan model memiliki **performa yang baik**, dengan ketentuan minimum: **Akurasi minimal 85%** dan **MAE maksimal 0,02**. | ✅ | Model memiliki performa baik dan sudah divalidasi keandalannya. |

---

## 📊 Data Science

**PIC**: Muhammad Devin Rahadi (Data Analyst) · Hafiz Hafrienda (Data Modeler & QA)

### Main Quest — Checklist Wajib (MVP)

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| DS-01 | Mengumpulkan dan menganalisis berbagai permasalahan, kemudian **menentukan satu solusi utama** yang akan dikembangkan dalam proyek. | ✅ | Solusi utama sudah final (lihat dokumen `docs/PRD-CEAMIS.md`). |
| DS-02 | Melakukan proses **Data Wrangling** secara end-to-end: **Gathering Data**, **Assessing Data**, **Cleaning Data**. | ✅ | Proses Data Wrangling dilakukan secara end-to-end di Jupyter Notebook. |
| DS-03 | Mendefinisikan **pertanyaan bisnis** yang dapat diukur. | ✅ | Success Metrics dan pertanyaan bisnis sudah terjawab dalam tahapan modeling. |
| DS-04 | Melakukan **Exploratory Data Analysis (EDA)** untuk mendapatkan insight dari data. | ✅ | EDA secara komprehensif sudah dilakukan di notebook training model. |
| DS-05 | Membuat **visualisasi data** dan melakukan **explanatory analysis** untuk menjawab pertanyaan bisnis. | ✅ | Visualisasi data dan explanatory analysis tersedia di notebook. |
| DS-06 | Membangun **dashboard interaktif** menggunakan **Streamlit** untuk menampilkan insight dan kesimpulan. | ❌ | Belum ada implementasi Streamlit dashboard. |
| DS-07 | Memastikan **data sudah siap diproses oleh model**, serta disarankan untuk membuat **Data Dictionary**. | ✅ | Pipeline preprocessing (beserta `scaler.pkl`) sudah siap memproses data untuk model. |

### Side Quest — Checklist Opsional (Nilai Tambah) ⭐

| No | Checklist Item | Status | Evidence / Catatan |
|----|---------------|--------|-------------------|
| DS-S01 | ⭐ Melakukan **feature engineering** untuk menghasilkan fitur yang lebih informatif bagi model. | ✅ | Feature engineering berhasil diimplementasikan untuk meningkatkan performa model. |
| DS-S02 | ⭐ Melakukan **deployment dashboard** ke **Streamlit Cloud** agar dapat diakses secara publik. | ❌ | Belum ada implementasi Streamlit Cloud. |
| DS-S03 | ⭐ Mengimplementasikan **A/B Testing** menggunakan Python. | ❌ | Belum ada implementasi. |
| DS-S04 | ⭐ Membuat **laporan teknis komprehensif** mulai dari tahap Problem Discovery hingga hasil akhir proyek dalam format **PDF**. | ❌ | Belum ada file kompilasi laporan PDF. |

---

## 🗺️ Mapping Implementasi ↔ Checklist

Berikut adalah pemetaan antara file/komponen yang sudah ada di repository dengan checklist items terkait.

### Frontend — Sudah Terimplementasi

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| Landing Page | `frontend/src/app/page.tsx` | FE-S01 (Mockup/UI) |
| Landing Components | `frontend/src/components/landing/*.tsx` | FE-S01, FE-S02 |
| Dashboard Main | `frontend/src/app/dashboard/page.tsx` | FE-01, FE-06, FE-07 |
| Dashboard Layout | `frontend/src/app/dashboard/layout.tsx` | FE-S02 |
| Chatbot Page | `frontend/src/app/dashboard/chatbot/page.tsx` | FE-06 (Integrasi Gen AI) |
| Education Page | `frontend/src/app/dashboard/education/page.tsx` | FE-06, FE-07 |
| Transactions Page | `frontend/src/app/dashboard/transactions/page.tsx` | FE-01, FE-07 |
| Gamification Page | `frontend/src/app/dashboard/gamification/page.tsx` | FE-07 |
| Warnings Page | `frontend/src/app/dashboard/warnings/page.tsx` | FE-06, FE-07 |
| History Page | `frontend/src/app/dashboard/history/page.tsx` | FE-01, FE-07 |
| Auth Page | `frontend/src/app/auth/page.tsx` | FE-07 |
| Design System CSS | `frontend/src/styles/` | FE-S01, FE-S02, FE-S05 |

### AI Service — Sudah Terimplementasi

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| FastAPI Entry | `ai-service/app/main.py` | AI-S01 |
| API Endpoints | `ai-service/app/api/` | AI-04, AI-S01, AI-S03 |
| Model Export | `ai-service/app/models/*.keras` | AI-03 |
| Request/Response | `ai-service/app/schemas/` | AI-S01 |
| Preprocessor | `ai-service/app/utils/` | AI-04 |
| Training Notebooks | `ai-service/training/notebooks/` | AI-01, AI-02, AI-S02, DS-02, DS-04, DS-05, DS-07 |
| TensorBoard Logs | `ai-service/logs/` | AI-S04 |

### Backend — Sudah Terimplementasi

| Komponen | Path | Relevansi Checklist |
|----------|------|---------------------|
| NestJS Backend | `backend/src/` | FE-03, FE-04, FE-05, FE-S04 |
| Supabase Connect | `backend/src/supabase/` | FE-04, FE-S03 |
| Modul Transaksi | `backend/src/transactions/` | FE-01, FE-03, FE-05 |
| Modul Auth & Users | `backend/src/users/` | FE-03, FE-04 |

---

## 📈 Ringkasan Progress

### Berdasarkan Learning Path

| Learning Path | Main Quest | Side Quest | Total |
|--------------|------------|------------|-------|
| **Front End & Back End** | 7/7 ✅ · 0/7 🔧 · 0/7 ❌ | 5/7 ✅ · 0/7 🔧 · 2/7 ❌ | **12/14 done** |
| **Artificial Intelligence** | 4/4 ✅ · 0/4 🔧 · 0/4 ❌ | 5/5 ✅ · 0/5 🔧 · 0/5 ❌ | **9/9 done** |
| **Data Science** | 6/7 ✅ · 0/7 🔧 · 1/7 ❌ | 1/4 ✅ · 0/4 🔧 · 3/4 ❌ | **7/11 done** |

### Overall Progress

```
Main Quest (MVP Wajib):     17/18 ✅ (94.4%)
Side Quest (Nilai Tambah):  11/16 ✅ (68.8%)
Total Checklist:            28/34 ✅ (82.4%)
In Progress:                0/34 🔧  (0.0%)
Belum Dimulai:              6/34 ❌  (17.6%)
```

---

## 🚨 Prioritas Segera (Rekomendasi)

> [!IMPORTANT]
> Saat ini mayoritas Main Quest sudah terpenuhi. Fokus berikutnya adalah pada deployment dan minor features (Data Science).

### 🔴 Prioritas Kritis (Blocking)

*(Tidak ada prioritas blocking untuk tahap saat ini)*

### 🟡 Prioritas Tinggi (Essential)

1. **DS-06**: Membangun Dashboard interaktif dengan Streamlit (Main Quest DS tersisa)
2. **FE-S06**: Melakukan deployment aplikasi web (misal ke Vercel untuk Frontend & Render/Railway untuk Backend & AI)

### 🟢 Prioritas Menengah (Nice to Have)

3. **DS-S04**: Membuat laporan teknis komprehensif dalam format PDF
4. **DS-S02**: Deployment Streamlit Dashboard
5. **FE-S07**: Penentuan layanan hosting tetap

---

*Dokumen ini dibuat pada: **3 Mei 2026** — akan di-update seiring perkembangan proyek.*
*Terakhir diupdate: 24 Mei 2026*
