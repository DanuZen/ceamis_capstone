# Implementation Guideline & Best Practices — CEAMIS 2.0

> **CEAMIS 2.0** — *Control Every Awful Money Impulse System*  
> Dokumen ini adalah panduan implementasi teknis, standar rekayasa perangkat lunak, dan peta referensi dokumentasi resmi repositori CEAMIS.

---

## 1. Peta Navigasi Dokumentasi (Documentation Map)

Repositori ini memelihara dokumentasi aktif **CEAMIS 2.0** sekaligus mengarsipkan dokumen fondasi **CEAMIS 1.0** tanpa menghapus catatan historis:

### A. Dokumen Utama CEAMIS 2.0 (Active Operational Docs)
| No | Dokumen | Fokus & Deskripsi |
| :--- | :--- | :--- |
| 1 | [`PRD.md`](PRD.md) | **Product Requirements Document 2.0**: Visi produk, spesifikasi Mobile App, Smart OCR Struk, MoSCoW matrix, & KPI. |
| 2 | [`StyleGuide.md`](StyleGuide.md) | **Design System**: Panduan visual gaya *Neo-Brutalism for Gen-Z* untuk Web (Tailwind/CSS) dan Mobile (Flutter). |
| 3 | [`Tasks.md`](Tasks.md) | **Sprint Backlog**: Rincian 5 Sprint implementasi, PIC (Wira vs Hafiz), checklist teknis, & Definition of Done. |
| 4 | [`PANDUAN_FITUR_BARU_MOBILE_OCR.md`](PANDUAN_FITUR_BARU_MOBILE_OCR.md) | **Spesifikasi OCR**: Arsitektur Hybrid OCR (Google ML Kit on-device + Gemini 2.0 Flash di NestJS). |
| 5 | [`00-README-INDEX.md`](00-README-INDEX.md) | **Dokumentasi Hub**: Indeks komprehensif seluruh file dokumentasi repositori. |

### B. Dokumen Teknis & Arsitektur Sistem (Technical Architecture)
| No | Dokumen | Cakupan Komponen |
| :--- | :--- | :--- |
| 6 | [`10-System-Architecture.md`](10-System-Architecture.md) | Blueprint arsitektur monorepo microservices (Web, Mobile, Gateway, AI, DB). |
| 7 | [`12-Frontend-Architecture.md`](12-Frontend-Architecture.md) | Arsitektur Next.js 16 (App Router, Server Actions, Responsive UI). |
| 8 | [`14-Backend-Architecture.md`](14-Backend-Architecture.md) | Backend Core NestJS (TypeScript, API Gateway, Supabase Integration). |
| 9 | [`15-Database-and-Prisma.md`](15-Database-and-Prisma.md) | Relasi skema Supabase PostgreSQL, Prisma ORM, & pola Server Actions. |
| 10 | [`15-Deployment-Strategy.md`](15-Deployment-Strategy.md) | Pipeline CI/CD GitHub Actions, Vercel, & Hugging Face Spaces. |
| 11 | [`16-AI-Integration.md`](16-AI-Integration.md) | Integrasi komunikasi HTTP microservices Backend ↔ FastAPI. |
| 12 | [`17-AI-Model-Financial-Health.md`](17-AI-Model-Financial-Health.md) | Model 1: Skor Kesehatan Finansial & Explainable AI (XAI). |
| 13 | [`18-AI-Model-Spending-Cluster.md`](18-AI-Model-Spending-Cluster.md) | Model 2: K-Means Clustering Persona Pengeluaran Pengguna. |
| 14 | [`19-AI-Model-Risk-Profile.md`](19-AI-Model-Risk-Profile.md) | Model 3: Scikit-Learn Classifier Profil Risiko Investasi. |

### C. Dokumen Fondasi & Riwayat Capstone (CEAMIS 1.0 Archive)
| No | Dokumen | Catatan Historis |
| :--- | :--- | :--- |
| 15 | [`01-Vision-and-Executive-Summary.md`](01-Vision-and-Executive-Summary.md) | Visi dan problem statement awal proyek CEAMIS. |
| 16 | [`02-Product-Requirements-Document.md`](02-Product-Requirements-Document.md) | PRD awal berbasis Web MVP (1.0). |
| 17 | [`03a-Requirements.md`](03a-Requirements.md) & [`03b-Scope-and-Deliverables.md`](03b-Scope-and-Deliverables.md) | Ruang lingkup dan deliverables fase 1.0. |
| 18 | [`04-User-Persona-and-Flow.md`](04-User-Persona-and-Flow.md) | Persona mahasiswa/fresh graduate & alur Guest/User/Admin. |
| 19 | [`05-Milestone-and-Timeline.md`](05-Milestone-and-Timeline.md) | Timeline dan milestone historis Capstone. |
| 20 | [`06-Team-Structure.md`](06-Team-Structure.md) | Struktur tim pengembang (Pembaruan tim inti CEAMIS 2.0: Wira & Hafiz). |
| 21 | [`07-Risk-Management-and-SWOT.md`](07-Risk-Management-and-SWOT.md) | Analisis risiko dan strategi TOWS. |
| 22 | [`08-Brainstorm-and-Planning.md`](08-Brainstorm-and-Planning.md) | Brainstorming alokasi budget berbasis profil risiko. |
| 23 | [`09-References.md`](09-References.md) | Referensi literatur dan benchmark fintech. |
| 24 | [`11-Tech-Checklist.md`](11-Tech-Checklist.md) | Matriks kelulusan kriteria Capstone learning paths. |

---

## 2. Struktur Repositori Monorepo

```
ceamis/
├── frontend/                     # Web Application (Next.js 16, TypeScript, Tailwind CSS v4)
│   ├── src/app/                  # App Router (Landing, Dashboard, Admin, Auth)
│   ├── prisma/schema.prisma      # Prisma ORM schema
│   └── src/styles/               # Neo-Brutalist design tokens & CSS
├── backend/                      # Core Business API (NestJS, TypeScript)
│   ├── src/                      # Modules (Auth, Transactions, AI Proxy, Users)
│   └── Dockerfile                # Kontainer untuk deployment Hugging Face
├── ai-service/                   # Machine Learning Microservice (FastAPI, Python 3.10+)
│   ├── app/api/                  # Endpoints (health-score, spending-cluster, risk-profile, chatbot)
│   ├── app/models/               # Model artifact (.keras, .pkl, .scaler)
│   └── app/utils/llm_client.py   # Multi-provider LLM (Gemini 2.0 Flash, Groq Llama 3)
├── mobile/                       # Mobile Application (Flutter, CEAMIS 2.0)
│   ├── lib/core/                 # Theme, Neo-Brutalism widgets, Network client
│   └── lib/features/ocr/         # Hybrid OCR scanner (ML Kit + NestJS API)
├── docs/                         # Dokumentasi lengkap sistem
└── .github/workflows/            # CI/CD otomatis (GitHub Actions)
```

---

## 3. Aturan Standar Rekayasa (Engineering Guidelines)

### A. Backend & Database
1. **Pemisahan Layanan (Microservices):**
   - **Backend NestJS** menangani autentikasi, transaksi, relasi database, otorisasi peran, dan bertindak sebagai secure proxy.
   - **AI Service FastAPI** khusus komputasi model AI/ML dan panggilan LLM.
2. **Supabase & Connection Pooler:**
   - Gunakan selalu Transaction Pooler pada port `6543` dengan flag `?pgbouncer=true` di lingkungan Node.js/Prisma.
   - Jangan gunakan relasi *Foreign Key* langsung antara schema `public` dan schema privat `auth`. Simpan `userId` sebagai UUID string.
3. **Modul Edukasi & Kuis (Anti-Hallucination Policy):**
   - Konten modul edukasi dan pertanyaan kuis dikelola secara deterministik melalui **Admin Database CRUD** (Prisma Model `EducationModule`, `EducationPage`, `EducationQuiz`).
   - Dynamic AI generator untuk kuis tidak digunakan untuk menjamin akurasi materi dan stabilitas data.

### B. Smart OCR Struk (CEAMIS 2.0)
1. **Pendekatan Hybrid:**
   - Tahap 1 (Client): Google ML Kit Text Recognition mengekstrak teks mentah secara instan dan offline di perangkat mobile.
   - Tahap 2 (Server): Teks mentah dikirim ke endpoint NestJS `POST /api/v1/ocr/parse-receipt` yang menggunakan Google Gemini 2.0 Flash untuk parsing JSON terstruktur (merchant, items, total, category).
   - Tahap 3 (Verifikasi Pengguna): Pengguna selalu diberikan kesempatan memverifikasi/mengedit form hasil scan sebelum disimpan ke database.

### C. Desain Antarmuka (Neo-Brutalism)
1. Border tegas: `3px solid #18181B` (Web) atau `3.0` width (Flutter).
2. Hard box shadow tanpa blur: `box-shadow: 4px 4px 0px #18181B`.
3. Sudut membulat modern: `border-radius: 12px` (Web) atau `BorderRadius.circular(12)` (Flutter).
4. Palet warna: Primary `#FFE600` (Cyber Yellow), Secondary `#A3E635` (Lime), Accent `#FB7185` (Coral Pink), Background `#FFFDF8` (Warm Canvas).

---

## 4. Alur Kerja Tim (Team Workflow)

Pengembangan CEAMIS 2.0 dijalankan oleh tim inti ramping:
* **Wira Fikri Ramadanu (Project Lead & Fullstack/Mobile Engineer):**
  - Bertanggung jawab atas Web Frontend (Next.js), Mobile App (Flutter), Backend Gateway (NestJS), dan integrasi end-to-end.
* **Hafiz Hafrienda (AI Engineer, Data Modeler & QA Lead):**
  - Bertanggung jawab atas Machine Learning models (FastAPI), prompt engineering LLM, validasi dataset, dan QA testing.

### Git & Branching Strategy
- **`main`**: Branch produksi yang stabil. Setiap push ke `main` otomatis memicu deployment subtree `backend/` ke Hugging Face Space via GitHub Actions.
- **`dev`**: Branch integrasi pengujian lokal.
- **`feature/*`**: Branch pengerjaan fitur spesifik (contoh: `feature/mobile-ocr-scanner`).
- **Commit Format**: Mengikuti konvensi Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`.

---

## 5. Checklist Validasi & Sign-Off Rilis 2.0

- [x] Backend NestJS berjalan live dan terhubung ke Supabase (`https://danuzen-ceamis-backend.hf.space/api/v1`).
- [x] AI Service FastAPI berjalan live (`https://mtaufiqulhakim-ceamis-ai-service.hf.space`).
- [x] Prisma ORM terhubung ke Supabase pooler port `6543` tanpa kendala koneksi.
- [x] Database CRUD modul Edukasi dan Kuis aktif di Admin Panel.
- [ ] Implementasi UI Mobile Flutter dengan tema Neo-Brutalism.
- [ ] Endpoint backend `POST /api/v1/ocr/parse-receipt` terintegrasi dengan Gemini 2.0 Flash.
- [ ] Pengujian kamera dan parsing struk belanja di perangkat Android/iOS.
- [ ] Deployment Frontend Next.js ke Vercel production.
