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

| Layer | Teknologi Utama | Target Pengguna | Keterangan |
| --- | --- | --- | --- |
| **Mobile App** | Flutter (Dart), Riverpod, GoRouter, Dio, ML Kit | **End-User (On-the-go)** | Penggunaan mobile harian: Cek risiko cepat pra-beli, pencatatan transaksi, Smart OCR struk instan, dan notifikasi impuls. |
| **Web Portal (Desktop)** | Next.js 16 (App Router), React 19, CSS Neo-Brutalism | **End-User & Admin** | **User Desktop:** Dashboard analitik mendalam, simulasi cek risiko pra-beli, perencanaan pagu, utang, dan edukasi.<br>**Admin:** Model Governance Dashboard, Audit Log Intervensi AI, dan manajemen kurikulum kuis. |
| **Backend Terpadu** | FastAPI (Python 3.11+), Pydantic v2, Uvicorn | Server / API | Backend tunggal terpadu: melayani Auth, transaksi, evaluasi 7 fitur risiko pra-pembelian, dan proxy Gemini OCR. |
| **Database & Auth** | Supabase Cloud (PostgreSQL 15+), GoTrue JWT | Cloud Services | Basis data relasional dengan Row-Level Security (RLS) dan autentikasi token multi-platform tersinkronisasi. |

---

## Struktur Folder Monorepo

```text
ceamis_capstone/
├── mobile/                        # 📱 Aplikasi Mobile Flutter (Klien Utama Pengguna)
│   ├── lib/                       # Kode sumber Dart (core, features, router, theme)
│   ├── android/ & ios/            # Runner platform native
│   └── README.md                  # Panduan lengkap penggunaan aplikasi mobile
├── backend/                       # 🚀 1 Backend FastAPI Modular (Python 3.11+)
│   ├── app/                       # Logika bisnis modular (auth, transactions, pre_purchase, ocr, dll)
│   ├── artifacts/                 # Model Machine Learning hasil pelatihan (.joblib)
│   └── requirements.txt           # Dependensi Python backend
├── frontend/                      # 💻 Next.js Web (Khusus Admin Dashboard)
│   └── src/                       # Halaman monitoring metrik model & audit log
├── backend_nestjs_archive/        # 📦 Arsip kode backend NestJS 1.0 (disimpan untuk referensi)
└── docs/
    ├── ceamis 1.0/                # Arsip dokumentasi spesifikasi 1.0
    ├── ceamis 2.0/                # 🌟 Sumber kebenaran dokumentasi arsitektur aktif (PRD, Arsitektur, API, ML, dll)
    └── README.md                  # Indeks navigasi pusat dokumentasi
```

---

## Panduan Menjalankan Proyek Lokal (Quick Start)

### 1. 📱 Menjalankan Aplikasi Mobile (Flutter)
Panduan lengkap dapat dibaca di **[`mobile/README.md`](mobile/README.md)**.

```bash
# 1. Buka emulator Android (atau hubungkan HP fisik)
flutter emulators --launch Pixel_5

# 2. Masuk ke folder mobile dan jalankan aplikasi
cd mobile
flutter pub get
flutter run
```
*Aplikasi akan otomatis terpasang dan berjalan di layar ponsel/emulator Anda.*

---

### 2. 🚀 Menjalankan Backend FastAPI (Python)
Panduan lengkap dapat dibaca di **[`backend/README.md`](backend/README.md)**.

**Cara Paling Cepat (1-Klik):**
* Di PowerShell: Masuk ke folder `backend` dan jalankan `.\run.ps1`
* Di Windows Explorer: Double-click file **`backend/run.bat`**
*(Script otomatis membuat venv, menginstall requirements, dan menyalakan server di port 8000).*

**Cara Manual:**
```bash
cd backend

# Buat & aktifkan virtual environment (Windows):
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependensi & jalankan server
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*Akses dokumentasi API interaktif di: **http://localhost:8000/docs***

---

### 3. 💻 Menjalankan Admin Dashboard (Next.js)
Portal admin untuk peninjauan metrik model ML dan audit log berjalan di port **3000**.

```bash
cd frontend
npm install
npm run dev
```
*Buka **http://localhost:3000** di browser Anda.*

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
