# CEAMIS Documentation Index

Selamat datang di direktori dokumentasi pusat untuk proyek CEAMIS (*Capstone Project*). 

Semua file di dalam direktori `docs` ini telah disusun ulang dan diberikan nomor urut agar sangat mudah dipahami, mulai dari konsep produk, arsitektur *frontend* dan *backend*, hingga teknis integrasi layanan *Artificial Intelligence* (AI).

Silakan baca dokumen-dokumen ini secara berurutan:

## 📊 Bagian 1: Produk, Visi, & Perencanaan
Bagian ini fokus pada aspek bisnis, manajemen proyek, dan rancangan UI/UX. Cocok dibaca pertama kali untuk memahami **"Apa itu CEAMIS dan untuk siapa dibuat?"**
* **`01-Vision-and-Executive-Summary.md`** — Gambaran besar, tujuan utama, dan visi proyek CEAMIS.
* **`02-Product-Requirements-Document.md`** — Dokumen Persyaratan Produk (PRD) yang berisi detail fitur.
* **`03a-Requirements.md`** — Rincian persyaratan spesifik sistem.
* **`03b-Scope-and-Deliverables.md`** — Ruang lingkup pengerjaan dan hasil yang diharapkan.
* **`04-User-Persona-and-Flow.md`** — Analisis target pengguna dan alur perjalanan mereka (*user journey*).
* **`05-Milestone-and-Timeline.md`** — Target waktu penyelesaian tiap fase pengembangan.
* **`06-Team-Structure.md`** — Pembagian tugas tim (*Hustler, Hipster, Hacker*).
* **`07-Risk-Management-and-SWOT.md`** — Manajemen risiko dan analisis SWOT produk.
* **`08-Brainstorm-and-Planning.md`** — Catatan awal proses *brainstorming*.
* **`09-References.md`** — Tautan dan referensi eksternal.

## 🛠️ Bagian 2: Arsitektur Sistem & *Engineering*
Bagian ini dikhususkan bagi para pengembang (*Developer / Hacker*) yang ingin memahami fondasi kode dan teknologi di balik CEAMIS.
* **`10-System-Architecture.md`** — Diagram dan daftar *tech stack* (Next.js, FastAPI, Prisma, Supabase).
* **`11-Tech-Checklist.md`** — Daftar periksa progres teknis (fitur yang sudah/belum selesai).
* **`12-Frontend-Architecture.md`** — Struktur *routing*, *state management*, dan desain komponen (React).
* **`13-Frontend-Theme-Guidelines.md`** — Panduan gaya desain (Neo-Brutalism) dan warna antarmuka.
* **`14-Backend-Architecture.md`** — Dokumentasi spesifik mengenai alur data di *backend* (NestJS & Server Actions).
* **`15-Database-and-Prisma.md`** — Skema database PostgreSQL, manajemen Multi-Schema Supabase, dan Prisma ORM.

## 🧠 Bagian 3: Kecerdasan Buatan (AI Service)
Bagian terakhir ini mendokumentasikan *microservice* berbasis Python/FastAPI yang mengotaki fitur analisis pintar di CEAMIS.
* **`16-AI-Integration.md`** — Cara kerja komunikasi antara Frontend Next.js dan *endpoint* FastAPI.
* **`17-AI-Model-Financial-Health.md`** — Logika dan metrik perhitungan **Skor Kesehatan Finansial**.
* **`18-AI-Model-Spending-Cluster.md`** — Algoritma pengelompokan (*clustering*) untuk mendeteksi kebiasaan pengeluaran pengguna.
* **`19-AI-Model-Risk-Profile.md`** — Pemrosesan kuesioner profil risiko pengguna dengan model probabilitas (*Conservative, Moderate, Aggressive*).

---
*Dokumentasi ini otomatis diperbarui sejalan dengan perkembangan arsitektur sistem.*
