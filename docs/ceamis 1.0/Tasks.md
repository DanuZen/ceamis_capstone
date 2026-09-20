# Task Backlog & Execution Roadmap — CEAMIS 2.0

**Proyek:** CEAMIS 2.0 (*Control Every Awful Money Impulse System 2.0*)  
**Struktur Tim Kerja:**  
* 👤 **Wira Fikri Ramadanu (Wira):** *Fullstack, Mobile, Backend Gateway, DevOps*  
* 👤 **Hafiz Hafrienda (Hafiz):** *AI/ML Engineer, Data Pipeline, Prompt Engineering, QA*  

---

## Ringkasan Pembagian Sprint

| Sprint | Fokus Utama | Target Deliverable | PIC |
| :--- | :--- | :--- | :---: |
| **Sprint 1** | Setup Mobile Shell & Autentikasi | Inisialisasi Flutter, tema Neo-Brutalist, Supabase Auth Sync | Wira & Hafiz |
| **Sprint 2** | Backend OCR Gateway & Gemini Parser | Endpoint NestJS OCR, Prompt Engineering Gemini 2.0, Auto-tagging | Hafiz & Wira |
| **Sprint 3** | Kamera, ML Kit & Pratinjau Mobile | On-device scanner Flutter, Bottom Sheet Review, Save to DB | Wira |
| **Sprint 4** | Integrasi Model ML & CAMI Chatbot | Sinkronisasi Health Score, Clustering, Risk Profile, CAMI | Hafiz & Wira |
| **Sprint 5** | QA, Stress Testing & Production Release | Pengujian struk fisik, UAT, CI/CD verification | Hafiz & Wira |

---

## 🎯 Sprint 1: Setup Mobile Shell & Autentikasi

### [T-101] Inisialisasi Proyek Flutter Monorepo
* **PIC:** Wira
* **Prioritas:** P0 (Bloker)
* **Deskripsi:** Buat direktori `/mobile` di root monorepo CEAMIS dengan Flutter SDK (Target: Android & iOS).
* **Kriteria Selesai (DoD):**
  - [ ] Flutter app dapat di-run di emulator Android dan iOS.
  - [ ] Package dasar terpasang: `supabase_flutter`, `flutter_riverpod`, `google_fonts`, `image_picker`.

### [T-102] Implementasi Design System Neo-Brutalism di Flutter
* **PIC:** Wira
* **Prioritas:** P1
* **Deskripsi:** Terjemahkan [`docs/StyleGuide.md`](StyleGuide.md) menjadi `CeamisTheme` di Flutter.
* **Kriteria Selesai (DoD):**
  - [ ] Warna token (Lime, Yellow, Dark, Cream, Cyan, Danger) siap digunakan.
  - [ ] Widget reusable: `BrutalCard`, `BrutalButton`, `BrutalInput`, `FinancialTagBadge`.

### [T-103] Integrasi Supabase Auth & Secure Session Storage
* **PIC:** Wira & Hafiz
* **Prioritas:** P0
* **Deskripsi:** Sambungkan aplikasi Flutter ke Supabase Auth CEAMIS yang sudah aktif di cloud.
* **Kriteria Selesai (DoD):**
  - [ ] Login, Register, dan Logout berfungsi mulus dengan akun database yang ada.
  - [ ] Sesi token disimpan aman menggunakan `flutter_secure_storage`.
  - [ ] Pengguna yang login di web otomatis bisa login di mobile.

---

## 📸 Sprint 2: Backend OCR Gateway & Gemini Parser

### [T-201] Desain Prompt & Structured Output JSON Schema Gemini 2.0
* **PIC:** Hafiz
* **Prioritas:** P0
* **Deskripsi:** Rancang prompt engineering sistematis untuk Gemini 2.0 Flash agar mampu mengekstrak teks struk belanjaan Indonesia (Indomaret, Alfamart, restoran, SPBU) menjadi JSON murni.
* **Kriteria Selesai (DoD):**
  - [ ] JSON Schema mengekstrak: `merchant_name`, `date`, `total_amount`, `category`, `items`, dan `tag` (`needs` vs `wants`).
  - [ ] Evaluasi akurasi prompt minimal pada 15 variasi teks struk riil.
  - [ ] Parameter `responseMimeType: "application/json"` terkonfigurasi.

### [T-202] Modul Backend OCR di NestJS (`/ocr`)
* **PIC:** Wira
* **Prioritas:** P0
* **Deskripsi:** Buat modul baru di NestJS `backend/src/ocr/` yang bertindak sebagai API gateway ke Google Gemini 2.0.
* **Kriteria Selesai (DoD):**
  - [ ] Endpoint `POST /api/v1/ocr/parse-receipt` menerima payload `{ raw_text: string }`.
  - [ ] Backend memanggil Gemini dengan API Key yang aman di server.
  - [ ] Rate-limiting terpasang untuk mencegah penyalahgunaan kuota.

### [T-203] Setup Supabase Storage Bucket untuk Bukti Struk
* **PIC:** Hafiz & Wira
* **Prioritas:** P1
* **Deskripsi:** Konfigurasikan bucket penyimpanan baru di Supabase: `receipt-images`.
* **Kriteria Selesai (DoD):**
  - [ ] Bucket `receipt-images` aktif dengan policy upload khusus user terautentikasi.
  - [ ] URL gambar struk dapat ditautkan ke kolom `receipt_url` di tabel transaksi.

---

## 📱 Sprint 3: Kamera, ML Kit & Pratinjau Mobile

### [T-301] Integrasi Kamera & Google ML Kit Text Recognition
* **PIC:** Wira
* **Prioritas:** P0
* **Deskripsi:** Pasang package `google_mlkit_text_recognition` di Flutter untuk membaca teks struk langsung secara on-device.
* **Kriteria Selesai (DoD):**
  - [ ] Pengguna dapat memotret struk via kamera atau memilih dari galeri.
  - [ ] Teks mentah berhasil diekstrak dalam hitungan milidetik tanpa koneksi internet.

### [T-302] Layar Form Pratinjau Struk (Human-in-the-Loop Review)
* **PIC:** Wira
* **Prioritas:** P0
* **Deskripsi:** Bangun tampilan *Bottom Sheet / Screen* konfirmasi hasil ekstraksi OCR sebelum disimpan ke database.
* **Kriteria Selesai (DoD):**
  - [ ] Menampilkan nama toko, tanggal, total nominal, dan badge kategori otomatis.
  - [ ] Seluruh field dapat diedit manual oleh pengguna jika ada salah baca angka.
  - [ ] Tombol **"Simpan Transaksi"** mengirim data ke `POST /api/v1/transactions`.

### [T-303] Penanganan Edge Cases Scan Struk
* **PIC:** Hafiz & Wira
* **Prioritas:** P1
* **Deskripsi:** Tambahkan validasi foto blur, foto terlalu gelap, struk terbalik, atau teks tidak terbaca.
* **Kriteria Selesai (DoD):**
  - [ ] Jika teks kurang dari 5 baris, muncul dialog saran: *"Struk kurang jelas, coba foto ulang dengan pencahayaan cukup"*.
  - [ ] Fallback: pengguna dapat langsung berpindah ke mode input manual dengan foto tetap terlampir.

---

## 🧠 Sprint 4: Integrasi Model ML & Chatbot CAMI

### [T-401] Sinkronisasi Dashboard Skor Kesehatan (Model 1) di Mobile
* **PIC:** Wira & Hafiz
* **Prioritas:** P0
* **Deskripsi:** Tampilkan kartu Financial Health Score di dashboard Flutter dengan mengambil data dari NestJS proxy.
* **Kriteria Selesai (DoD):**
  - [ ] Gauge visual Neo-Brutalist menampilkan skor 0–100 dan status (*Sehat*, *Cukup*, dll).
  - [ ] Breakdown rasio (*Saving Rate, Wants, Needs*) tampil jelas.

### [T-402] Sinkronisasi Spending Cluster Persona (Model 2) & Risk Profile (Model 3)
* **PIC:** Hafiz
* **Prioritas:** P1
* **Deskripsi:** Pastikan output K-Means (*Si Hemat*) dan Risk Profile (*Moderat*) terintegrasi rapi pada profil mobile.
* **Kriteria Selesai (DoD):**
  - [ ] Label persona pengguna tampil di header dashboard.
  - [ ] Rekomendasi alokasi bujet otomatis menyesuaikan profil risiko pengguna.

### [T-403] Antarmuka Chatbot CAMI di Flutter
* **PIC:** Wira & Hafiz
* **Prioritas:** P0
* **Deskripsi:** Bangun halaman percakapan interaktif CAMI di mobile (`/chatbot`).
* **Kriteria Selesai (DoD):**
  - [ ] Bubble chat Neo-Brutalist untuk pengguna dan CAMI.
  - [ ] Terhubung ke endpoint `/api/v1/ai/chat` (Gemini 2.0 Flash).
  - [ ] Indikator status koneksi (online/typing).

---

## 🎓 Sprint 5: Polishing Admin CRUD, QA & Deployment

### [T-501] Validasi Modul Edukasi & Kuis via Admin CRUD
* **PIC:** Hafiz
* **Prioritas:** P1
* **Deskripsi:** Verifikasi dan input kurikulum kuis terkurasi langsung melalui Admin Portal (`/admin/quizzes`).
* **Kriteria Selesai (DoD):**
  - [ ] Minimal 5 soal kuis terkurasi diinput ke database Supabase untuk modul pemula.
  - [ ] Kuis dapat dikerjakan di Web dan Mobile tanpa error.

### [T-502] Pengujian Struk Nyata (Physical Receipt Benchmark)
* **PIC:** Hafiz
* **Prioritas:** P0
* **Deskripsi:** Lakukan uji coba scan pada 20 sampel struk belanjaan fisik nyata di Indonesia.
* **Kriteria Selesai (DoD):**
  - [ ] Dokumentasikan tabel benchmarking tingkat keberhasilan ekstraksi total dan nama toko.
  - [ ] Akurasi rata-rata memenuhi target $\ge 85\%$.

### [T-503] Verifikasi CI/CD & Build Rilis APK Android
* **PIC:** Wira
* **Prioritas:** P0
* **Deskripsi:** Bangun release APK / App Bundle untuk pengujian langsung di perangkat Android.
* **Kriteria Selesai (DoD):**
  - [ ] File APK rilis berhasil di-generate tanpa crash.
  - [ ] GitHub Actions CI/CD backend ke Hugging Face tetap berjalan hijau (*pass*).
