# Panduan Pengambilan Tangkapan Layar (Screenshots) BAB III

Dokumen ini memuat daftar periksa (*checklist*) dan panduan teknis pengambilan tangkapan layar (*screenshot*) untuk seluruh Gambar antarmuka BAB III Tugas Akhir CEAMIS. Seluruh berkas gambar wajib disimpan dalam format **PNG** di dalam direktori:
📁 `thesis_assets/screenshots/`

---

## 1. Daftar Tangkapan Layar Wajib Aplikasi Mobile (Peran User)

> **Rekomendasi Format & Ukuran:**
> - Format: **PNG**
> - Orientasi: **Portrait** (Ukuran layar ponsel: misal 1080 x 2400 px, 1170 x 2532 px, atau 390 x 844 px)
> - Aplikasi: Dijalankan via emulator Android / ponsel fisik (`flutter run`)

| Status | Nama Berkas Gambar | Nama Halaman di Proyek | Rute / Navigasi Flutter | Elemen Wajib yang Harus Terlihat |
|:---:|:---|:---|:---|:---|
| [ ] | `gambar_3_10_beranda.png` | Beranda (*HomeScreen*) | Rute: `/` | Header CEAMIS, avatar & notifikasi, kartu Skor Kesehatan Finansial (Sehat/Waspada/Boros), ringkasan sisa anggaran belanja & saving rate, tombol aksi cepat Cek Risiko Pra-Pembelian, banner pengingat refleksi belanja, dan daftar transaksi terbaru. |
| [ ] | `gambar_3_11_input_pemeriksaan.png` | Input Pemeriksaan Pra-Pembelian (*PrePurchaseScreen*) | Rute: `/pre-purchase` | Form input nama barang / impian belanja, field nominal harga (Rp), dropdown kategori pos penggunaan, catatan/merchant, tombol evaluasi risiko, dan tab daftar item Smart Wishlist. |
| [ ] | `gambar_3_12_hasil_peringatan.png` | Hasil Peringatan Risiko (*PrePurchaseResultScreen*) | Rute: `/pre-purchase/result` | Kartu tingkat risiko (LOW / MEDIUM / HIGH), skor numerik probabilitas risiko, daftar faktor pemicu kontekstual (alasan XAI), perbandingan sisa pagu sebelum vs sesudah transaksi, penundaan hari tabungan, dan 3 tombol respons: Beli Sekarang Sadar Risiko (PROCEED), Nabung Bertahap (ADJUST), dan Tunda 72 Jam (POSTPONE). |
| [ ] | `gambar_3_13_konfirmasi_pasca_keputusan.png` | Konfirmasi Pasca-Keputusan (*PostDecisionFeedbackScreen*) | Rute: `/pre-purchase/feedback` (atau klik banner refleksi di Beranda) | Rincian transaksi masa lalu yang dievaluasi, pertanyaan inti apakah belanja sesuai rencana anggaran atau tidak terencana, dua kartu pilihan (`[Sesuai Rencana Anggaran]` vs `[Tidak Terencana / Impulsif]`), pemilih kepuasan bintang 1–5, dan tombol kirim konfirmasi. |
| [ ] | `gambar_3_14_laporan_pengeluaran.png` | Laporan Pengeluaran (*HistoryReportScreen*) | Rute: `/history-report` | Tab ringkasan analitik dan riwayat transaksi bulanan, diagram proporsi pengeluaran per kategori, total nominal pemasukan vs pengeluaran, dan daftar transaksi dengan tag indikator. |

---

## 2. Daftar Tangkapan Layar Pendukung Peran User (Mobile)

Tangkapan layar tambahan untuk melengkapi bukti pemenuhan Kebutuhan Fungsional (*Functional Requirements*):

| Status | Nama Berkas Gambar | Kode FR | Layar di Proyek | Rute / Navigasi | Elemen Penting yang Ditampilkan |
|:---:|:---|:---:|:---|:---|:---|
| [ ] | `user_FR_U01_akun_dan_privasi.png` | FR-U01 | Layar Profil & Privasi | `/profile` | Profil akun pengguna, status persetujuan (*consent*) riset, opsi privasi pseudonimisasi data, dan pengaturan notifikasi. |
| [ ] | `user_FR_U02_anggaran_dan_tabungan.png` | FR-U02 | Layar Perencanaan Anggaran & Tabungan | `/planning` | Alokasi anggaran berbasis metode 50/30/20, progress bar target tabungan aktif, estimasi waktu capaian, dan form pembuatan pos anggaran baru. |
| [ ] | `user_FR_U03_input_transaksi_manual.png` | FR-U03 | Layar Catat Transaksi Manual | `/add-transaction` | Form pencatatan transaksi manual (pemasukan/pengeluaran, nominal, kategori, tanggal, catatan). |
| [ ] | `user_FR_U03_pemindaian_struk_ocr.png` | FR-U03 | Layar Pemindaian Struk (OCR) | `/ocr-scan` | Jendela bidik kamera atau pemilih galeri, ekstraksi otomatis OCR (merchant, nominal, tanggal), dan konfirmasi penyimpanan transaksi. |
| [ ] | `user_FR_U08_kesehatan_finansial.png` | FR-U08 | Layar Indikator Kesehatan Finansial | `/health-score` | Meteran skor kesehatan finansial (0–100), kategori status (Sehat/Waspada/Boros), rincian rasio kebutuhan, keinginan, dan tabungan, serta status *streak* pencatatan aktif. |

---

## 3. Daftar Tangkapan Layar Dasbor Web Administrator (Peran Admin)

> **Rekomendasi Format & Ukuran:**
> - Format: **PNG**
> - Orientasi: **Desktop Landscape** (Ukuran layar: 1440 x 900 px)
> - Aplikasi: Dijalankan via web browser Next.js (`npm run dev`) pada `http://localhost:3000` atau `http://localhost:3001`

| Status | Nama Berkas Gambar | Kode FR | Halaman Web di Proyek | URL Dasbor Admin | Elemen Wajib yang Harus Terlihat |
|:---:|:---|:---:|:---|:---|:---|
| [ ] | `admin_FR_A01_A04_dashboard.png` | FR-A01 & FR-A04 | Dasbor Utama & Monitoring Status Layanan | `/admin/dashboard` | Kartu ringkasan sistem (total pengguna terdaftar, total materi edukasi, total kuis, total lencana), status layanan aktif, dan navigasi modul admin. |
| [ ] | `admin_FR_A03_A05_model_governance.png` | FR-A03 & FR-A05 | Panel Evaluasi & Tata Kelola Model ML | `/admin/models` | Tabel versi model ML (Logistic Regression & Random Forest), metrik validasi (Precision, Recall, F1-Score, ROC-AUC), penanda model aktif (`is_active`), dan modal *1-click rollback* dengan input alasan wajib. |
| [ ] | `admin_FR_A06_audit_logs.png` | FR-A06 | Log Audit Intervensi & Akses Transaksi | `/admin/audit-logs` | Ringkasan statistik pencegahan belanja impulsif, tabel log audit keputusan transaksi pengguna, status label `was_impulsive`, dan kontrol paginasi. |

---

## 4. Ringkasan Perintah Menjalankan Aplikasi untuk Screenshot

### Menjalankan Backend FastAPI:
```powershell
cd backend
$env:PYTHONUTF8=1
.\venv\Scripts\uvicorn.exe app.main:app --port 8000
```

### Menjalankan Dasbor Web Admin (Next.js):
```powershell
cd frontend
npm run dev -- -p 3001
# Buka di browser: http://localhost:3001/admin/dashboard
```

### Menjalankan Aplikasi Mobile (Flutter):
```powershell
cd mobile
flutter run
# Buka di emulator / ponsel fisik
```
