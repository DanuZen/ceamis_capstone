# CEAMIS

**Control Every Awful Money Impulse System**

*Cerdas Finansial, Kontrol Impuls, Raih Masa Depan*

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

### 5. Modul Edukasi Adaptif
Kurikulum literasi finansial interaktif yang disesuaikan dengan level pemahaman (*Beginner*, *Intermediate*, *Advanced*). Kurikulum ini terdiri dari:
- Materi bacaan singkat, padat, dan langsung pada intinya.
- Kuis evaluasi berkala untuk menguji pemahaman pengguna.
Sistem edukasi ini terhubung erat dengan modul Gamifikasi, memberikan insentif penyelesaian berupa tambahan XP dan pencapaian lencana baru.

## Arsitektur Teknologi

Sistem CEAMIS didesain dari awal (*from scratch*) dengan memisahkan antarmuka pengguna, logika bisnis, dan komputasi kompeks model AI untuk menjamin skalabilitas maksimal, keamanan data, serta kemudahan dalam proses pemeliharaan.

| Layer | Teknologi Utama | Keterangan Tambahan |
| --- | --- | --- |
| **Frontend** | Next.js (App Router), React, CSS | Antarmuka bergaya *Neo-Brutalism Design* yang interaktif. |
| **Backend API** | NestJS (Node.js) | Melayani endpoint API utama (transaksi, profil) di port 3001. |
| **Backend & ORM** | Next.js Server Actions, Prisma | Logika khusus untuk modul fitur tertentu yang berjalan di server. |
| **Database Utama** | Supabase PostgreSQL | Relasional database dengan manajemen koneksi *Connection Pooler*. |
| **AI Microservice** | FastAPI (Python), TensorFlow, Scikit-Learn | Endpoint API terpisah di port 8000 untuk inferensi model *Machine Learning*. |

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

Proyek ini menggunakan arsitektur *microservices*. Anda perlu membuka 3 terminal (Command Prompt/PowerShell) terpisah untuk menjalankan masing-masing layanan secara bersamaan.

**1. Menjalankan Backend API (NestJS)**
Backend utama berjalan di port 3001 dan bertugas melayani data transaksi dan profil pengguna.
```bash
cd backend
npm install
npm run start:dev
# Akan berjalan di http://localhost:3001
```

**2. Menjalankan AI Service (FastAPI)**
Layanan kecerdasan buatan berjalan di port 8000.
```bash
cd ai-service
# Mengaktifkan virtual environment (wajib pada Windows)
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Akan berjalan di http://localhost:8000
```

**3. Menjalankan Frontend (Next.js)**
Antarmuka pengguna berjalan di port 3000.
```bash
cd frontend
npm install
npx prisma generate
npm run dev
# Buka http://localhost:3000 di browser
```

## Tim Pengembang

Proyek kolaboratif ini dibangun dan dirancang secara penuh oleh tim multidisiplin:

| Nama | Peran | Fokus Utama |
| --- | --- | --- |
| **Wira Fikri Ramadanu** | Fullstack Dev & Project Manager | Arsitektur Sistem Keseluruhan, Database Supabase, Manajemen Proyek, Integrasi AI |
| **Humaira Mutia** | Frontend Developer | Antarmuka Pengguna (UI), Neo-Brutalism Styling, Komponen React |
| **Vanesha Alexandria D.** | AI Lead | Arsitektur Model AI, Pipeline Pelatihan, Optimasi Akurasi Model |
| **Muhammad Taufiqulhakim**| AI Developer | Endpoint FastAPI, Generative AI (Chatbot CAMI), Logika Edukasi |
| **Muhammad Devin Rahadi** | Data Analyst | Eksplorasi Data (EDA), Wrangling Data, Analisis Klaster Pengeluaran |
| **Hafiz Hafrienda** | Data Modeler & QA | Rekayasa Fitur (*Feature Engineering*), Pengujian A/B, Jaminan Kualitas |

## Dokumentasi Proyek Terpusat

Bagi kontributor, pengembang masa depan, dan pengulas, seluruh detail teknis, rancangan arsitektur tingkat lanjut, metrik desain *Neo-Brutalism*, hingga logika spesifik metrik model *Machine Learning* tersedia secara komprehensif di dalam direktori `docs/`.

Untuk memastikan pemahaman yang komprehensif mengenai aplikasi ini, silakan meninjau dokumen dengan urutan prioritas berikut:

**Bagian 1: Produk, Visi, & Perencanaan**
1. `01-Vision-and-Executive-Summary.md` - Visi dan Misi Utama CEAMIS.
2. `02-Product-Requirements-Document.md` - Dokumen Spesifikasi Kebutuhan Produk.
3. `03a-Requirements.md` & `03b-Scope-and-Deliverables.md` - Ruang Lingkup Pengerjaan.
4. `04-User-Persona-and-Flow.md` - Analisis Target Audiens dan Alur Interaksi.

**Bagian 2: Arsitektur & Rekayasa Perangkat Lunak**
5. `10-System-Architecture.md` - Blueprint Arsitektur Sistem.
6. `12-Frontend-Architecture.md` - Struktur Komponen & Routing Next.js.
7. `14-Backend-Architecture.md` - Penjelasan Logika Server Actions.
8. `15-Database-and-Prisma.md` - Skema Lengkap Supabase PostgreSQL & Prisma.

**Bagian 3: Kecerdasan Buatan (AI Service)**
9. `16-AI-Integration.md` - Logika Komunikasi antara Frontend dan Microservice AI.
10. `17-AI-Model-Financial-Health.md` - Penjelasan Kalkulasi Skor Kesehatan.
11. `18-AI-Model-Spending-Cluster.md` - Algoritma dan Fitur Pengelompokan Gaya Hidup.
12. `19-AI-Model-Risk-Profile.md` - Penjelasan Probabilitas Kuesioner Profil Risiko.

**Untuk indeks lengkap dan akses langsung ke seluruh dokumen, silakan merujuk pada file utama: [docs/00-README-INDEX.md](docs/00-README-INDEX.md)**

---

## Tentang Proyek Ini

**CEAMIS** merupakan karya otentik yang dikembangkan sebagai pemenuhan tugas akhir (*Capstone Project*) pada program **Dicoding**. Proyek ini merepresentasikan gabungan kompetensi lintas disiplin ilmu dari seluruh anggota tim kami, mencakup integrasi sistem *Front-End*, arsitektur *Back-End*, hingga penerapan *Machine Learning* yang fungsional.

<br>

**Hak Cipta © 2026 Tim CEAMIS - Dicoding Capstone Project.**
Seluruh Hak Dilindungi.
