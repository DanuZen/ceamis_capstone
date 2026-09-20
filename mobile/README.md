# 📱 CEAMIS Mobile — Panduan Instalasi & Penggunaan

Aplikasi klien seluler resmi **CEAMIS 2.0 (*Control Every Awful Money Impulse System*)** yang dibangun menggunakan **Flutter** untuk platform Android & iOS. Dirancang khusus bagi Generasi Z untuk mengontrol dorongan belanja impulsif melalui fitur intervensi pra-pembelian, pencatatan cepat via smart OCR struk, dan evaluasi kesehatan finansial.

---

## 📋 Daftar Isi
1. [Prasyarat Sistem](#1-prasyarat-sistem)
2. [Konfigurasi Environment (`.env`)](#2-konfigurasi-environment-env)
3. [Cara Menjalankan Aplikasi](#3-cara-menjalankan-aplikasi)
   - [Langkah 1: Menyiapkan Emulator Android / HP Fisik](#langkah-1-menyiapkan-emulator-android--hp-fisik)
   - [Langkah 2: Menjalankan Aplikasi Flutter](#langkah-2-menjalankan-aplikasi-flutter)
4. [Panduan Penggunaan Fitur](#4-panduan-penggunaan-fitur)
   - [A. Autentikasi (Masuk & Daftar)](#a-autentikasi-masuk--daftar)
   - [B. Dashboard Finansial](#b-dashboard-finansial)
   - [C. Pencatatan Transaksi Manual](#c-pencatatan-transaksi-manual)
   - [D. Pemindaian Struk Cerdas (Smart OCR)](#d-pemindaian-struk-cerdas-smart-ocr)
   - [E. Evaluasi Skor Kesehatan Finansial](#e-evaluasi-skor-kesehatan-finansial)
5. [Perintah Interaktif Saat Aplikasi Berjalan (CLI Commands)](#5-perintah-interaktif-saat-aplikasi-berjalan-cli-commands)
6. [Troubleshooting & Solusi Kendala](#6-troubleshooting--solusi-kendala)

---

## 1. Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terinstal:
* **Flutter SDK:** Versi 3.22.0 atau lebih baru (`flutter doctor`)
* **Dart SDK:** Versi 3.4.0 atau lebih baru (termasuk dalam Flutter)
* **Android Studio & SDK:**
  - Android SDK Platform 33 / 34
  - Android SDK Command-line Tools
  - Android Virtual Device (AVD) / Emulator (misal: Google Pixel 5)
* **Visual Studio Code / Android Studio** dengan ekstensi Flutter & Dart terpasang.

---

## 2. Konfigurasi Environment (`.env`)

Aplikasi membaca konfigurasi endpoint dan autentikasi melalui berkas `.env` di dalam folder `mobile/`.

1. Di dalam direktori `mobile/`, pastikan berkas `.env` telah ada. Jika belum, buat berkas `.env` baru:
   ```bash
   cp .env.example .env
   ```
2. Isi variabel kunci berikut:
   ```env
   # Backend FastAPI Modular Tunggal (Gunakan 10.0.2.2 untuk emulator Android lokal)
   API_BASE_URL=http://10.0.2.2:8000
   AI_SERVICE_URL=http://10.0.2.2:8000

   # Autentikasi Supabase Cloud
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
   > 💡 **Catatan untuk Emulator Android:**  
   > `10.0.2.2` adalah alias khusus emulator Android untuk mengakses `localhost` pada komputer host. Jika menggunakan perangkat HP fisik via USB Debugging, ganti dengan alamat IP lokal komputer Anda (contoh: `http://192.168.1.15:8000`).

---

## 3. Cara Menjalankan Aplikasi

### Langkah 1: Menyiapkan Emulator Android / HP Fisik

1. Buka terminal di folder root atau folder `mobile/`.
2. Periksa daftar emulator yang tersedia:
   ```bash
   flutter emulators
   ```
3. Nyalakan emulator (contoh: `Pixel_5`):
   ```bash
   flutter emulators --launch Pixel_5
   ```
   *Tunggu hingga jendela emulator Android terbuka dan sistem Android selesai melakukan booting.*

4. Verifikasi bahwa perangkat telah terdeteksi:
   ```bash
   flutter devices
   ```
   *Anda akan melihat `emulator-5554` (atau nama perangkat HP fisik) berstatus connected.*

### Langkah 2: Menjalankan Aplikasi Flutter

1. Masuk ke direktori `mobile/`:
   ```bash
   cd mobile
   ```

2. Unduh semua paket dependensi:
   ```bash
   flutter pub get
   ```

3. Jalankan aplikasi ke emulator:
   ```bash
   flutter run -d emulator-5554
   ```
   *(Atau cukup ketik `flutter run` jika hanya satu emulator yang aktif).*

4. Tunggu beberapa saat hingga kompilasi Gradle selesai (`Running Gradle task 'assembleDebug'`). Aplikasi akan otomatis terpasang dan langsung terbuka di layar ponsel!

---

## 4. Panduan Penggunaan Fitur

### A. Autentikasi (Masuk & Daftar)
* **Layar Masuk (*Login*):** Masukkan email dan kata sandi Anda, lalu tekan tombol **Masuk**. Token sesi akan otomatis disimpan ke dalam penyimpanan aman ponsel (`flutter_secure_storage`).
* **Layar Pendaftaran (*Register*):** Jika belum memiliki akun, klik tautan **Daftar** di bagian bawah, masukkan nama lengkap, email, dan kata sandi baru.

### B. Dashboard Finansial
* Setelah login, Anda akan diarahkan ke layar beranda (**Home**).
* Menampilkan ringkasan saldo, pemasukan, pengeluaran bulan berjalan, serta widget akses cepat ke pencatatan transaksi dan pemindaian struk.

### C. Pencatatan Transaksi Manual
1. Tekan tombol **(+)** atau pilih menu **Tambah Transaksi**.
2. Masukkan nominal pengeluaran/pemasukan.
3. Pilih kategori belanja (*Food & Beverage*, *Transportation*, *Shopping*, dll).
4. Pilih metode pembayaran (*Cash*, *QRIS*, *Debit*, dll) dan tanggal transaksi.
5. Tekan tombol **Simpan Transaksi**. Data otomatis tersinkronisasi ke backend.

### D. Pemindaian Struk Cerdas (Smart OCR)
1. Pilih menu **Scan Struk** (ikon kamera di navigasi bawah).
2. Anda dapat memilih:
   - 📸 **Buka Kamera:** Untuk memotret struk belanja fisik secara langsung.
   - 🖼️ **Pilih dari Galeri:** Untuk mengunggah foto struk yang sudah ada di galeri ponsel.
3. Mesin **Google ML Kit Text Recognition** di ponsel akan memindai teks secara instan.
4. Teks mentah kemudian diproses oleh backend FastAPI via **Gemini 2.0 Flash** untuk menata:
   - Nama Merchant/Toko
   - Tanggal Transaksi
   - Kategori & Tag (*Needs* vs *Wants*)
   - Total Nominal & Rincian Item Belanja
5. Periksa pratinjau hasil pembacaan, lakukan koreksi jika diperlukan, lalu tekan **Simpan** untuk mencatatnya sebagai transaksi.

### E. Evaluasi Skor Kesehatan Finansial
* Buka tab **Health Score**.
* Menampilkan skor kesehatan Anda (0–100) berbasis formula deterministik 3 pilar:
  - *Savings Ratio* (Porsi tabungan)
  - *Needs Compliance* (Kepatuhan kebutuhan pokok 50%)
  - *Budget Adherence* (Kepatuhan terhadap pagu anggaran)
* Memberikan status transparan: **Sehat** 🟢, **Waspada** 🟡, atau **Boros** 🔴 beserta tips perbaikan.

---

## 5. Perintah Interaktif Saat Aplikasi Berjalan (CLI Commands)

Saat aplikasi berjalan melalui perintah `flutter run`, terminal berada dalam mode interaktif:

| Tombol Keyboard | Fungsi |
|:---:|---|
| **`r`** | **Hot Reload** — Memperbarui perubahan kode UI dalam hitungan detik tanpa mereset state. |
| **`R`** | **Hot Restart** — Mereset state aplikasi dan memuat ulang kode dari awal. |
| **`h`** | Menampilkan daftar lengkap bantuan perintah interaktif. |
| **`d`** | Melepaskan (*detach*) terminal debugger dari emulator (aplikasi tetap berjalan di HP). |
| **`q`** | Menutup dan menghentikan aplikasi di emulator. |

---

## 6. Troubleshooting & Solusi Kendala

* **Kendala 1: `API Connection Refused` (Gagal Menghubungi Backend)**
  - *Penyebab:* Backend FastAPI di komputer belum dinyalakan atau alamat host salah.
  - *Solusi:* Pastikan backend berjalan di komputer pada port 8000 (`uvicorn app.main:app --reload --port 8000`). Gunakan `http://10.0.2.2:8000` pada berkas `.env` mobile.

* **Kendala 2: Emulator Tidak Terdeteksi (`No connected devices found`)**
  - *Solusi:* Jalankan perintah `adb devices` di terminal untuk memastikan emulator terhubung. Jika emulator belum menyala, jalankan `flutter emulators --launch Pixel_5`.

* **Kendala 3: Izin Kamera Tidak Aktif saat Scan Struk**
  - *Solusi:* Saat pertama kali membuka fitur kamera pada emulator/HP, pilih opsi **"While using the app"** pada dialog izin kamera Android.
