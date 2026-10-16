# Panduan Pengambilan Tangkapan Layar Aplikasi (Tugas G9)
## Panduan Visualisasi Naskah Bab 3 & Bab 4 Tesis CEAMIS 2.0

Dokumen ini disusun sebagai panduan teknis langkah-demi-langkah bagi peneliti/pengguna untuk mengambil tangkapan layar (*screenshots*) resmi antarmuka aplikasi. Seluruh panduan mencakup rute berkas kode sumber, data demonstrasi yang harus dipersiapkan, langkah navigasi, serta standar estetika visual untuk menjamin keselarasan dengan naskah akademik.

> **Catatan:** Agen AI tidak melakukan penangkapan gambar secara langsung; pengguna/peneliti yang akan mengambil tangkapan layar pada emulator atau peramban fisik sesuai petunjuk di bawah ini.

---

## 1. Standar Format dan Ketentuan Visual

1. **Resolusi Tangkapan Layar Mobile:**
   - Gunakan emulator Android standar (misalnya **Google Pixel 5** atau **Pixel 7**) dengan rasio layar 19.5:9 (resolusi vertikal ~1080x2340 piksel).
   - Pastikan bar status emulator bersih: jam menunjukkan waktu konsisten (misal: 09:41), indikator baterai 100%, dan sinyal Wi-Fi penuh (dapat diatur via *Android Demo Mode*).
2. **Resolusi Tangkapan Layar Web Admin:**
   - Atur jendela peramban desktop pada resolusi standar **1440 x 900 piksel** (atau rasio 16:10).
   - Gunakan peramban Chromium (Google Chrome / Microsoft Edge) dengan tingkat *zoom* 100%, hilangkan baris markah (*bookmarks bar*), dan gunakan mode terang/gelap sesuai tema default aplikasi.
3. **Format Berkas:** Simpan dalam format **PNG** tanpa kompresi kehilangan mutu (*lossless*) dengan penamaan persis seperti yang direkomendasikan.

---

## 2. Cara Menjalankan Seluruh Komponen secara Lokal

Sebelum mengambil gambar, pastikan seluruh layanan berjalan secara lokal:

### A. Menjalankan Backend FastAPI (Port 8000)
1. Buka terminal di folder root repositori atau direktori `backend/`:
   ```bash
   cd backend
   ```
2. Jalankan server Uvicorn:
   ```bash
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
3. Verifikasi ketersediaan layanan pada peramban: `http://localhost:8000/health`.

### B. Menjalankan Frontend Web Admin Next.js (Port 3000)
1. Buka terminal baru di direktori `frontend/`:
   ```bash
   cd frontend
   npm run dev
   ```
2. Akses dasbor melalui peramban: `http://localhost:3000/admin/dashboard`.

### C. Menjalankan Aplikasi Mobile Flutter
1. Nyalakan emulator Android melalui terminal atau Android Studio:
   ```bash
   flutter emulators --launch Pixel_5
   ```
2. Buka terminal di direktori `mobile/` dan jalankan aplikasi:
   ```bash
   cd mobile
   flutter run
   ```

---

## 3. Data Demonstrasi yang Wajib Dipersiapkan

Agar hasil tangkapan layar terlihat kredibel dan tidak memicu status *cold-start* (fitur kontekstual aktif penuh), siapkan data tiruan berikut pada akun demonstrasi:

1. **Profil Pengguna Demonstrasi:**
   - Nama: `Danu Arfian (Partisipan Riset)`
   - Email: `partisipan.riset@example.com`
   - Level Gamifikasi: `Level 3 (Pengendali Belanja)` | XP: `450` | Streak: `5 Hari Berturut-turut`
2. **Pagu Anggaran & Alokasi 50/30/20:**
   - Total Pendapatan Bulanan: `Rp 4.500.000`
   - Pos Kebutuhan (Needs 50%): `Rp 2.250.000` (terpakai Rp 1.100.000, sisa Rp 1.150.000)
   - Pos Keinginan (Wants 30%): `Rp 1.350.000` (terpakai Rp 1.050.000, sisa Rp 300.000)
   - Pos Tabungan (Savings 20%): `Rp 900.000`
3. **Target Tabungan Aktif:**
   - Judul: `Dana Darurat & Liburan 2026` | Target: `Rp 10.000.000` | Tercapai: `Rp 4.500.000`
4. **Riwayat Transaksi Historis (Minimal 10 Transaksi):**
   - Masukkan transaksi historis pada kategori `Shopping`, `F&B`, dan `Entertainment` dengan median pengeluaran belanja sekitar `Rp 120.000`. Hal ini memastikan bahwa rencana belanja sebesar `Rp 350.000` akan memicu rasio deviasi median > 2.0x secara nyata.

---

## 4. Katalog Halaman Wajib Aplikasi Mobile

### 1. Layar Beranda (*Home Dashboard*)
- **Nama Berkas:** `gambar_3_10_beranda.png`
- **Nama Halaman di Proyek:** `HomeScreen`
- **Rute / Path Berkas:** `/` di [mobile/lib/features/home/screens/home_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/home/screens/home_screen.dart)
- **Konten yang Harus Terlihat:**
  - Kartu skor kesehatan finansial (misal: 78/100).
  - Ringkasan sisa anggaran 50/30/20 (Needs, Wants, Savings).
  - Indikator streak harian (ikon api dengan angka 5).
  - Tombol cepat akses *"Cek Pra-Pembelian"* di bagian tengah bawah.
- **Langkah Navigasi:**
  1. Buka aplikasi CEAMIS Mobile.
  2. Masuk melalui login/onboarding demo.
  3. Aplikasi otomatis membuka tab pertama (Beranda).

---

### 2. Form Input Pemeriksaan Pra-Pembelian
- **Nama Berkas:** `gambar_3_11_input_pemeriksaan.png`
- **Nama Halaman di Proyek:** `PrePurchaseScreen`
- **Rute / Path Berkas:** `/pre-purchase` di [mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart)
- **Konten yang Harus Terlihat:**
  - Form terisi lengkap:
    - Kategori Belanja: `Shopping (Keinginan)`
    - Nominal Rencana: `Rp 350.000`
    - Nama Merchant / Toko: `Sepatu Olahraga Online Store`
    - Catatan Refleksi: `Membeli sepatu running diskon kilat tengah malam`
  - Tombol aksi: `Analisis Risiko Belanja`.
- **Langkah Navigasi:**
  1. Dari Beranda, tekan tombol navigasi tengah atau kartu *"Periksa Rencana Belanja"*.
  2. Isi form input sesuai data demonstrasi di atas. Ambil gambar sebelum tombol ditekan.

---

### 3. Lembar Hasil Peringatan Risiko & XAI
- **Nama Berkas:** `gambar_3_12_hasil_peringatan.png`
- **Nama Halaman di Proyek:** `PrePurchaseResultScreen`
- **Rute / Path Berkas:** `/pre-purchase/result` di [mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart)
- **Konten yang Harus Terlihat:**
  - Lencana risiko berwarna merah bertuliskan **RISIKO TINGGI (Skor 0.82)**.
  - Kartu Dampak Anggaran: *"Sisa anggaran kategori Shopping tersisa Rp 300.000. Pembelian ini akan melebihi pagu sebesar Rp 50.000."*
  - Kartu Dampak Tabungan: *"Target Dana Darurat 2026 berpotensi tertunda 12 hari."*
  - Faktor Pemicu (XAI): *"Nominal 2.9x lebih besar dari median belanja Anda"* dan *"Transaksi di luar pola hari biasa"*.
  - Tiga Tombol Respons: `Lanjut Belanja (PROCEED)`, `Sesuaikan Nominal (ADJUST)`, dan `Tunda Belanja (POSTPONE)`.
- **Langkah Navigasi:**
  1. Dari form input (`gambar_3_11`), tekan tombol `Analisis Risiko Belanja`.
  2. Tunggu respons API backend selama beberapa milidetik hingga lembar intervensi risiko muncul di layar.

---

### 4. Form Refleksi Pasca-Keputusan
- **Nama Berkas:** `gambar_3_13_konfirmasi_pasca_keputusan.png`
- **Nama Halaman di Proyek:** `PostDecisionFeedbackScreen`
- **Rute / Path Berkas:** `/pre-purchase/feedback` di [mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart)
- **Konten yang Harus Terlihat:**
  - Rincian transaksi yang dikonfirmasi: *"Sepatu Olahraga Online Store — Rp 350.000"*.
  - Pertanyaan Refleksi Evaluasi: *"Setelah merenungkan pembelian ini, apakah Anda merasa belanja ini bersifat impulsif?"* dengan toggle opsi `Ya, Impulsif` / `Tidak, Bermanfaat`.
  - Rating kepuasan bintang (1 s.d. 5) dan kotak masukan catatan refleksi.
  - Tombol aksi: `Kirim Evaluasi`.
- **Langkah Navigasi:**
  1. Dari Beranda, tekan banner pengingat *"Konfirmasi Pembelian Sepatu Olahraga"* (atau akses via route `/pre-purchase/feedback`).
  2. Buka layar refleksi dan isi rating evaluasi.

---

### 5. Layar Laporan Pengeluaran
- **Nama Berkas:** `gambar_3_14_laporan_pengeluaran.png`
- **Nama Halaman di Proyek:** `HistoryReportScreen`
- **Rute / Path Berkas:** `/history-report` di [mobile/lib/features/history_report/screens/history_report_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/history_report/screens/history_report_screen.dart)
- **Konten yang Harus Terlihat:**
  - Diagram lingkaran (*donut chart*) pembagian pengeluaran bulanan per kategori (Shopping, F&B, Transport).
  - Wawasan analitik keuangan: rasio pengeluaran impulsif vs terencana.
  - Daftar riwayat transaksi belanja terbaru beserta tag kategori.
- **Langkah Navigasi:**
  1. Dari Beranda, pilih tab navigasi bawah berikon grafik / laporan.

---

## 5. Katalog Halaman Tambahan Aplikasi Mobile

### A. Lembar Informasi Penelitian & Persetujuan (*Informed Consent*)
- **Nama Berkas:** `gambar_lampiran_consent_onboarding.png`
- **Nama Halaman:** `MobileOnboardingScreen` (Langkah Consent)
- **Rute / Path Berkas:** `/onboarding` di [mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart) (baris 830-980)
- **Konten yang Harus Terlihat:** Dialog lembar informasi riset, klausul pemrosesan AI pihak ketiga (Gemini), checkbox persetujuan partisipan, dan kontak peneliti resmi.

### B. Banner Pengingat Konfirmasi di Layar Beranda
- **Nama Berkas:** `gambar_lampiran_banner_pengingat.png`
- **Nama Halaman:** `HomeScreen` (Komponen PostDecisionReminderBanner)
- **Rute / Path Berkas:** `/` di [mobile/lib/features/home/screens/home_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/home/screens/home_screen.dart)
- **Konten yang Harus Terlihat:** Banner oranye/biru interaktif di bagian atas beranda yang mengingatkan evaluasi keputusan belanja dalam rentang waktu 24–72 jam.

### C. Pemindaian Struk Cerdas (*Smart OCR Camera View*)
- **Nama Berkas:** `gambar_lampiran_smart_ocr.png`
- **Nama Halaman:** `AddTransactionScreen` (Mode Kamera OCR)
- **Rute / Path Berkas:** `/add-transaction` di [mobile/lib/features/transaction/screens/add_transaction_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/transaction/screens/add_transaction_screen.dart)
- **Konten yang Harus Terlihat:** Tampilan bidik pemindaian struk dengan kotak pembatas (*bounding box*) ekstraksi teks lokal on-device.

### D. Indikator Skor Kesehatan Finansial
- **Nama Berkas:** `gambar_lampiran_skor_kesehatan.png`
- **Nama Halaman:** `HealthScoreScreen`
- **Rute / Path Berkas:** `/health-score` di [mobile/lib/features/health_score/screens/health_score_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/health_score/screens/health_score_screen.dart)
- **Konten yang Harus Terlihat:** Speedometer / gauge skor kesehatan keuangan (angka 0-100), rincian rasio tabungan, dan tips rekomendasi finansial.

---

## 6. Katalog Halaman Web Admin (Resolusi Desktop 1440x900)

### 1. Dasbor Operasional Admin
- **Nama Berkas:** `gambar_admin_01_dashboard.png`
- **Rute Web:** `http://localhost:3000/admin/dashboard`
- **Path Berkas:** [frontend/src/app/admin/dashboard/page.tsx](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/dashboard/page.tsx)
- **Konten yang Harus Terlihat:**
  - Kartu statistik total pengguna, total intervensi pra-pembelian, dan rasio keputusan (Lanjut/Sesuaikan/Tunda).
  - Status koneksi API backend dan versi model yang sedang aktif.

### 2. Panel Evaluasi Model & Rollback
- **Nama Berkas:** `gambar_admin_02_evaluasi_model.png`
- **Rute Web:** `http://localhost:3000/admin/models`
- **Path Berkas:** [frontend/src/app/admin/models/page.tsx](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/models/page.tsx)
- **Konten yang Harus Terlihat:**
  - Tabel perbandingan metrik evaluasi model (Precision, Recall, F1, ROC-AUC, Brier Score) untuk Baseline, Logistic Regression, dan Random Forest.
  - Tombol aksi `Rollback Versi Model` yang menampilkan modal input alasan rollback.

### 3. Tinjauan Log Audit Tata Kelola
- **Nama Berkas:** `gambar_admin_03_log_audit.png`
- **Rute Web:** `http://localhost:3000/admin/audit-logs`
- **Path Berkas:** [frontend/src/app/admin/audit-logs/page.tsx](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/audit-logs/page.tsx)
- **Konten yang Harus Terlihat:**
  - Tabel riwayat log audit: ID intervensi, waktu kejadian, aktor (User / Admin), aksi (*INTERVENTION_EVALUATED*, *MODEL_ROLLBACK*), dan rincian parameter.

---

## 7. Halaman yang Sebaiknya TIDAK Difoto untuk Naskah Tesis

Berdasarkan temuan audit verifikasi G1, hindari mengambil tangkapan layar untuk halaman-halaman berikut agar tidak menimbulkan kerancuan metodologis atau kelemahan argumen saat sidang tesis:

| Rute Halaman | Alasan Pengecualian dari Naskah Tesis |
|:---|:---|
| **`/dashboard/*` (Dasbor Web Pengguna)** | Seluruh antarmuka partisipan yang dievaluasi dalam penelitian adalah aplikasi seluler Flutter (`mobile/`). Dasbor web pengguna menggunakan mock data terpisah dan tidak mewakili alur intervensi pra-pembelian nyata. |
| **`/dashboard/planning` (Kalkulator Investasi Web)** | Menampilkan kalkulator instrumen investasi (emas, saham, kripto) yang berada di luar rumusan masalah tesis mengenai pengendalian pengeluaran tidak terencana dan dapat dinilai sebagai variabel perancu (*confounder*). |
| **`/admin/quizzes/*` (Manajemen Kuis)** | Modul kuis admin merupakan eksperimen gamifikasi tambahan yang tidak termasuk dalam 13 Kebutuhan Fungsional inti CEAMIS 2.0. |
| **Rute Bypass Login Tamu (*Guest Provider*)** | Jangan mendokumentasikan alur masuk tanpa kredensial (*guest mode*) karena bertentangan dengan protokol *informed consent* penelitian. |
