# CEAMIS 2.0 Documentation Index

Selamat datang di direktori dokumentasi pusat untuk proyek **CEAMIS 2.0 (*Control Every Awful Money Impulse System 2.0*)**.

Dokumentasi ini telah diperbarui untuk mencerminkan evolusi sistem ke versi **2.0**, yang mencakup integrasi **Aplikasi Mobile (Flutter)**, **Smart OCR Scan Struk**, model **Machine Learning**, dan ekosistem **Monorepo** yang dikembangkan oleh tim inti: **Wira Fikri Ramadanu** & **Hafiz Hafrienda**.

---

## 🚀 Dokumen Utama CEAMIS 2.0 (Wajib Dibaca)

Dokumen-dokumen ini adalah rujukan operasional resmi untuk arsitektur, desain, dan pelaksanaan pengembangan versi 2.0:

* **[`PRD.md`](PRD.md)** — **Product Requirements Document (PRD) CEAMIS 2.0**: Visi produk, spesifikasi fitur Mobile App & OCR Struk, metrik kesuksesan, dan prioritas fitur (MoSCoW).
* **[`Implementation-Guideline.md`](Implementation-Guideline.md)** — **Implementation Guideline & Best Practices**: Peta navigasi dokumentasi, standar rekayasa software, dan alur kerja tim Wira & Hafiz.
* **[`StyleGuide.md`](StyleGuide.md)** — **Design System & Style Guide**: Panduan visual gaya *Neo-Brutalism for Gen-Z* untuk Web (Next.js CSS) dan Mobile (Flutter Theme).
* **[`Tasks.md`](Tasks.md)** — **Task Backlog & Roadmap Eksekusi**: Pembagian sprint 1–5, rincian *task*, PIC (Wira vs Hafiz), dan kriteria *Definition of Done* (DoD).
* **[`PANDUAN_FITUR_BARU_MOBILE_OCR.md`](PANDUAN_FITUR_BARU_MOBILE_OCR.md)** — Panduan teknis arsitektur Hybrid OCR (Google ML Kit on-device + Gemini 2.0 Flash di backend NestJS).

---

## 📚 Indeks Dokumentasi Fondasi & Riwayat

### 📊 Bagian 1: Produk, Visi, & Perencanaan
* **`01-Vision-and-Executive-Summary.md`** — Gambaran besar, tujuan utama, dan visi proyek CEAMIS.
* **`02-Product-Requirements-Document.md`** — PRD versi 1.0 (Arsip Fondasi Awal).
* **`03a-Requirements.md`** & **`03b-Scope-and-Deliverables.md`** — Rincian persyaratan dan ruang lingkup sistem.
* **`04-User-Persona-and-Flow.md`** — Analisis target pengguna dan alur perjalanan pengguna (*user journey*).
* **`05-Milestone-and-Timeline.md`** — Milestone dan timeline fase awal.
* **`06-Team-Structure.md`** — Struktur tim inti CEAMIS 2.0 (Wira & Hafiz) dan riwayat tim 1.0.
* **`07-Risk-Management-and-SWOT.md`** — Manajemen risiko dan analisis SWOT produk.
* **`08-Brainstorm-and-Planning.md`** — Brainstorming alokasi budget berbasis profil risiko.
* **`09-References.md`** — Daftar pustaka dan referensi benchmark fintech.

### 🛠️ Bagian 2: Arsitektur Sistem & Rekayasa
* **`10-System-Architecture.md`** — Blueprint arsitektur sistem *monorepo microservices*.
* **`11-Tech-Checklist.md`** — Checklist teknis pemenuhan rubrik Capstone 1.0 dan status deployment.
* **`12-Frontend-Architecture.md`** — Struktur *routing*, *state management*, dan komponen React/Next.js.
* **`14-Backend-Architecture.md`** — Penjelasan alur API Gateway NestJS, endpoint OCR, dan Supabase connection.
* **`15-Database-and-Prisma.md`** — Skema database PostgreSQL, Prisma ORM, dan modul Edukasi CRUD.
* **`15-Deployment-Strategy.md`** — Panduan deployment produksi (Vercel, Hugging Face, GitHub Actions CI/CD).

### 🧠 Bagian 3: Kecerdasan Buatan (AI Service)
* **`16-AI-Integration.md`** — Alur komunikasi Backend NestJS ↔ Microservice FastAPI.
* **`17-AI-Model-Financial-Health.md`** — Penjelasan Model 1 (Skor Kesehatan Finansial & XAI).
* **`18-AI-Model-Spending-Cluster.md`** — Penjelasan Model 2 (K-Means Clustering Persona Pengeluaran).
* **`19-AI-Model-Risk-Profile.md`** — Penjelasan Model 3 (Scikit-Learn Classifier Profil Risiko Investasi).

---
*Dokumentasi ini dikelola secara berkala oleh tim CEAMIS 2.0 (Wira & Hafiz).*

