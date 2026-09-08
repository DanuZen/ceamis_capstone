# CEAMIS 2.0

**Control Every Awful Money Impulse System 2.0**

*Cerdas Finansial, Kontrol Impuls, Pindai Struk Instan, Raih Masa Depan*

## Tentang CEAMIS

**CEAMIS** adalah platform manajemen keuangan komprehensif yang dirancang secara spesifik untuk memecahkan masalah literasi keuangan dan kontrol impuls pada Generasi Z di Indonesia. Permasalahan utama yang sering dihadapi oleh generasi muda saat ini bukanlah kurangnya informasi, melainkan kurangnya kesadaran dan disiplin dalam mengelola pengeluaran harian, terutama yang bersifat impulsif (*latte factor*, *doom spending*, dan *fear of missing out*).

Alih-alih sekadar menjadi aplikasi pencatat pengeluaran pasif yang membosankan, CEAMIS bertindak sebagai asisten finansial yang proaktif. Kami merancang arsitektur sistem ini dengan menggabungkan tiga pilar utama untuk menciptakan perubahan perilaku yang nyata:
1. **Kecerdasan Buatan (AI):** Memberikan analisis perilaku yang mendalam dan *hyper-personalized* berdasarkan data transaksi nyata.
2. **Gamifikasi:** Membangun kebiasaan pencatatan melalui mekanisme psikologi positif, memberikan penghargaan atas setiap langkah kecil menuju kesehatan finansial.
3. **Edukasi Adaptif:** Meningkatkan literasi keuangan secara berkelanjutan dengan memberikan materi yang sesuai dengan tingkat pemahaman pengguna saat ini.

## Latar Belakang Masalah

Menurut riset terbaru, mayoritas anak muda kesulitan menabung bukan karena pendapatan yang kurang, melainkan karena pengeluaran mikro yang tidak terkontrol. Pencatat keuangan konvensional seringkali gagal karena prosesnya kaku dan tidak memberikan umpan balik instan. CEAMIS hadir untuk mengisi celah tersebut dengan antarmuka bergaya *Neo-Brutalism* yang tegas, lugas, dan interaktif, menyingkirkan kebosanan dari proses perencanaan keuangan.

## Fitur Utama

### 1. Deteksi Gaya Hidup Berbasis AI (Spending Cluster)
Sistem secara otomatis mengklasifikasikan pola pengeluaran pengguna ke dalam kategori gaya hidup spesifik. Model Machine Learning kami memproses riwayat transaksi dan mengelompokkan profil pengguna (misalnya: *Impulsive Buyer*, *Frugal*, atau *Balanced*). Fitur ini membantu pengguna menyadari secara langsung kebocoran halus yang menguras kondisi finansial mereka tanpa disadari, memberikan *wake-up call* yang terukur berbasis data.

### 2. Skor Kesehatan Finansial (Financial Health Score)
Penilaian komprehensif dan *real-time* terhadap kondisi keuangan pengguna. Metrik ini dievaluasi secara dinamis berdasarkan perhitungan kompleks yang mempertimbangkan:
- Rasio utang terhadap pendapatan (*Debt-to-Income Ratio*).
- Tingkat tabungan (*Savings Rate*).
- Kepatuhan terhadap batas anggaran bulanan yang telah ditetapkan.
Skor ini divisualisasikan dengan indikator warna dan grafik yang tegas untuk memberikan kesadaran instan kepada pengguna mengenai posisi finansial mereka.

### 3. Asisten AI Personal (CAMI)
Chatbot pintar berbasis Generative AI yang terintegrasi secara dinamis dengan seluruh data transaksi riil pengguna. CAMI tidak sekadar memberikan jawaban umum, melainkan mampu memberikan saran spesifik dan dapat ditindaklanjuti. Pengguna dapat berkonsultasi mengenai strategi pemotongan anggaran bulan ini, meminta rekomendasi instrumen investasi yang cocok dengan Profil Risiko mereka, hingga berdiskusi tentang strategi pelunasan utang yang paling efisien (*snowball* atau *avalanche*).

### 4. Ekosistem Gamifikasi
Untuk mempertahankan tingkat retensi (*retention rate*) dan membangun disiplin finansial jangka panjang, CEAMIS memanfaatkan berbagai elemen permainan:
- **Sistem Lencana (Badges):** Penghargaan visual atas pencapaian tertentu, seperti "Pencatat Setia" (menjaga batas anggaran selama beberapa minggu berturut-turut) atau menyelesaikan modul edukasi tertentu.
- **Streak Harian:** Membangun kebiasaan (*habit building*) melalui sistem *streak* untuk mendorong pengguna melakukan pencatatan atau minimal mengecek kondisi keuangan mereka secara konsisten setiap harinya.
- **Poin Pengalaman (XP):** XP dikumpulkan dari setiap tindakan positif (mencatat pengeluaran, membaca materi, lulus kuis) dan digunakan sebagai proksi tingkat kedisiplinan pengguna.

### 5. Modul Edukasi & Sistem Kuis Terkurasi (Admin CRUD)
Kurikulum literasi finansial interaktif yang terbagi ke dalam level pemahaman (*Beginner*, *Intermediate*, *Advanced*):
- **Materi Terstruktur:** Konten edukasi finansial praktis yang disusun rapi halaman per halaman (*step-by-step*).
- **Kuis Terkurasi (Sistem CRUD Database):** Kuis tidak lagi mengandalkan generator AI otomatis demi mencegah risiko halusinasi dan salah konsep. Seluruh soal, opsi jawaban (A/B/C/D), kunci jawaban, dan pembahasannya dikelola serta dikurasi secara manual oleh Admin melalui Panel Admin (`/admin/quizzes` dan `/admin/education`) dengan penyimpanan berbasis Prisma ORM & Supabase PostgreSQL.
- **Ekosistem Gamifikasi:** Terhubung langsung dengan pemberian XP, *streak*, dan pembukaan *badges* saat pengguna berhasil menyelesaikan modul atau lulus kuis.

## Arsitektur Teknologi & Deployment

Sistem CEAMIS didesain secara modular (*microservices monorepo*) dengan memisahkan antarmuka pengguna, logika bisnis, dan komputasi model AI untuk skalabilitas maksimal:

| Layer | Teknologi Utama | Hosting / Deployment | Keterangan |
| --- | --- | --- | --- |
| **Frontend Web** | Next.js (App Router), React, CSS | **Vercel** (`ceamis-capstone.vercel.app`) | Antarmuka bergaya *Neo-Brutalism Design* yang interaktif. |
| **Backend API** | NestJS (Node.js, Express) | **Hugging Face Spaces** (Docker SDK) | Melayani endpoint API utama (transaksi, users, onboarding, warnings). Otomatis di-deploy via GitHub Actions. |
| **Database Utama** | Supabase PostgreSQL, Prisma ORM | **Supabase Cloud** (AWS AP-Northeast-1) | Database relasional dengan manajemen *Transaction Pooler* (Port 6543). |
| **AI Microservice** | FastAPI (Python), Scikit-Learn, GenAI | **Hugging Face Spaces** (Docker SDK) | Endpoint inferensi Machine Learning (Health Score, K-Means Cluster, Risk Profile, CAMI Chatbot). |

## Struktur Folder

Berikut adalah topologi arsitektur sistem pada tingkat repositori (*monorepo*):

```text
ceamis/
├── frontend/              # Antarmuka web utama (Next.js App Router)
│   ├── src/app/           # Routing halaman & logika Server Actions
│   ├── src/components/    # Komponen React (Neo-Brutalist UI)
│   ├── src/context/       # Global State Management (User, Transactions)
│   └── prisma/            # Skema Database (schema.prisma) & Migrasi SQL
├── backend/               # Main API & Business Logic (NestJS)
│   ├── src/               # Controller, Modules, dan Services utama
│   └── supabase/          # Konfigurasi klien database
├── ai-service/            # Microservice AI & Machine Learning (FastAPI)
│   ├── app/               # Logika API Endpoint, Routing, & Inferensi Model
│   └── models/            # Model Machine Learning hasil pelatihan (.pkl, .h5)
└── docs/                  # Pusat Dokumentasi Lengkap Proyek
```
Catatan: Berkas model Machine Learning hasil pelatihan untuk direktori ai-service/models/ dapat diunduh melalui [Tautan Google Drive Model AI CEAMIS](https://drive.google.com/drive/folders/1w-o9hI_MvdU4Od1sKxT0G02hv9cRQL_E?usp=sharing).

## Panduan Menjalankan Proyek Lokal (Development)

Sistem menggunakan arsitektur *monorepo*. Layanan AI Microservice sudah aktif 24/7 di Hugging Face Space cloud, sehingga secara default Anda **hanya perlu menjalankan 2 terminal lokal**:

**1. Menjalankan Backend API (NestJS)**
Backend utama berjalan di port 3001 dan bertugas melayani data transaksi, profil, serta proxy inferensi AI.
```bash
cd backend
npm install
npm run start:dev
# Berjalan di http://localhost:3001
```

**2. Menjalankan Frontend (Next.js)**
Antarmuka pengguna berjalan di port 3000.
```bash
cd frontend
npm install
npx prisma generate
npm run dev
# Buka http://localhost:3000 di browser
```

*(Opsional)* **Menjalankan AI Service Lokal:**
Hanya jika Anda ingin melatih ulang (*re-train*) model Machine Learning atau mengembangkan modul Python secara offline:
```bash
cd ai-service
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Alur Deployment & CI/CD (Monorepo)

- **Frontend:** Terhubung langsung ke Vercel via GitHub repository integration. Setiap push ke `main` otomatis men-trigger build Next.js.
- **Backend (NestJS API):** Dikelola di dalam monorepo dan di-deploy otomatis ke **Hugging Face Docker Space** (`DanuZen/ceamis-backend`) menggunakan **GitHub Actions Workflow** ([`.github/workflows/deploy-backend.yml`](.github/workflows/deploy-backend.yml)).
- **AI Service:** Berjalan mandiri di **Hugging Face Docker Space** (`mtaufiqulhakim/ceamis-ai-service`).

## Tim Pengembang

Proyek kolaboratif ini dibangun dan dirancang secara penuh oleh tim multidisiplin:

## Tim Pengembang (CEAMIS 2.0 Core Team)

Pengembangan dan ekspansi ekosistem CEAMIS 2.0 (Web + Mobile App + Smart OCR) dipimpin secara kolaboratif oleh tim inti:

| Nama | Peran Utama | Fokus & Tanggung Jawab |
| --- | --- | --- |
| **Wira Fikri Ramadanu** | **Project Lead & Fullstack/Mobile Engineer** | Arsitektur Monorepo, Aplikasi Mobile (Flutter), Backend Gateway (NestJS), Web App (Next.js), Integrasi Supabase Cloud & CI/CD |
| **Hafiz Hafrienda** | **AI Engineer & Data/QA Specialist** | Evaluasi Model Machine Learning, Prompt Engineering Gemini 2.0 OCR & Chatbot CAMI, Quality Assurance, & Pengujian Struk Fisik |

## Dokumentasi Proyek Terpusat (CEAMIS 2.0)

Seluruh detail teknis, spesifikasi kebutuhan, sistem desain, hingga pembagian sprint pengerjaan didokumentasikan secara rapi di dalam direktori `docs/`:

### 🚀 Dokumen Utama CEAMIS 2.0 (Wajib Dibaca):
1. **[`docs/PRD.md`](docs/PRD.md)** — **Product Requirements Document (PRD) CEAMIS 2.0**: Spesifikasi lengkap fitur Mobile App, OCR Struk Belanja, integrasi model ML, metrik keberhasilan, dan prioritas MoSCoW.
2. **[`docs/StyleGuide.md`](docs/StyleGuide.md)** — **Design System & Style Guide**: Panduan visual *Neo-Brutalism for Gen-Z* untuk Web (CSS) dan Mobile (Flutter Theme).
3. **[`docs/Tasks.md`](docs/Tasks.md)** — **Task Backlog & Roadmap Eksekusi**: Pembagian Sprint 1–5, rincian task teknis, penanggung jawab (Wira & Hafiz), serta kriteria *Definition of Done*.
4. **[`docs/PANDUAN_FITUR_BARU_MOBILE_OCR.md`](docs/PANDUAN_FITUR_BARU_MOBILE_OCR.md)** — Arsitektur teknis Hybrid OCR (Google ML Kit on-device + Gemini 2.0 Flash di backend NestJS).

**Untuk indeks lengkap seluruh dokumen teknis & fondasi, silakan merujuk pada: [docs/00-README-INDEX.md](docs/00-README-INDEX.md)**

---

## Tentang Proyek Ini

**CEAMIS 2.0** merupakan kelanjutan dan pengembangan tingkat lanjut dari karya tugas akhir (*Capstone Project*) Dicoding. Proyek ini memadukan aplikasi Web, aplikasi Mobile, dan kecerdasan buatan (*Machine Learning*) menjadi satu kesatuan ekosistem finansial modern yang siap pakai.

<br>

**Hak Cipta © 2026 Tim CEAMIS 2.0.**
Seluruh Hak Dilindungi. Dibuat dengan ❤️ oleh Wira Fikri Ramadanu & Hafiz Hafrienda.
