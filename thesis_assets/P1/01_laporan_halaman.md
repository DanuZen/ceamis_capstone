# Laporan Inventarisasi Halaman Antarmuka dan Tangkapan Layar (Tugas P1 - Bagian A)

Dokumen ini memetakan seluruh halaman antarmuka pengguna pada sistem CEAMIS, mencakup lima halaman wajib aplikasi mobile (peran *User* untuk Gambar 3.10 sampai 3.14 naskah BAB III), halaman pendukung peran *User*, dan halaman tata kelola dasbor web (peran *Admin*).

---

## 1. Tabel Inventarisasi Halaman Wajib Aplikasi Mobile (Peran User)

Berikut adalah pemetaan lima halaman utama aplikasi mobile CEAMIS yang dirancang pada naskah BAB III:

| Nama Berkas Gambar | Nama Halaman di Proyek | Berkas dan Rute (path:baris) | Status Eksekusi | Elemen yang Tampil | Elemen Naskah yang Tidak Ada | Elemen Tambahan Proyek |
|:---|:---|:---|:---|:---|:---|:---|
| `gambar_3_10_beranda.png` | Halaman Beranda (*HomeScreen*) | [home_screen.dart:9-128](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/home/screens/home_screen.dart#L9-L128), rute `/` ([app_router.dart:82-86](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/router/app_router.dart#L82-L86)) | BERJALAN | Header CEAMIS, lonceng notifikasi, avatar profil, kartu indikator kesehatan finansial (Skor 78.5 • SEHAT), kartu sisa pagu belanja berjalan dan saving rate, tombol akses cepat evaluasi pra-pembelian, banner pengingat konfirmasi refleksi belanja, dan daftar transaksi terbaru | Tidak ada (seluruh elemen wajib terpenuhi) | Indikator *streak* pencatatan berturut-turut, badge kategori transaksi |
| `gambar_3_11_input_pemeriksaan.png` | Halaman Input Pemeriksaan Pra-Pembelian (*PrePurchaseScreen*) | [pre_purchase_screen.dart:105-195](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart#L105-L195), rute `/pre-purchase` ([app_router.dart:98-101](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/router/app_router.dart#L98-L101)) | BERJALAN | Form input nama barang belanja, input perkiraan nominal rupiah dengan validasi > 0, dropdown pilihan pos kategori penggunaan, input catatan/merchant opsional, tombol submit evaluasi risiko, dan tab daftar item Smart Wishlist | Tidak ada (seluruh elemen wajib terpenuhi) | Tab filter kesiapan wishlist (Semua, Siap Beli, Defisit Pagu) dan kartu guardrail batas pos keinginan |
| `gambar_3_12_hasil_peringatan.png` | Halaman Hasil Peringatan (*PrePurchaseResultScreen*) | [pre_purchase_result_screen.dart:217-230](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L217-L230), rute `/pre-purchase/result` ([app_router.dart:58-76](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/router/app_router.dart#L58-L76)) | BERJALAN | Skor risiko numerik, label tingkat risiko (LOW, MEDIUM, HIGH), daftar faktor pemicu kontekstual (XAI trigger factors), perbandingan dampak pagu anggaran (sisa sebelum, sesudah, dan defisit), proyeksi jumlah hari penundaan tabungan aktif, dan 3 pilihan respons (PROCEED, ADJUST, POSTPONE) | Tidak ada (seluruh elemen wajib terpenuhi) | Opsi tombol *Nabung Bertahap (INSTALLMENT)* dan rekomendasi batas nominal aman |
| `gambar_3_13_konfirmasi_pasca_keputusan.png` | Halaman Konfirmasi Pasca-Keputusan (*PostDecisionFeedbackScreen*) | [post_decision_feedback_screen.dart:15-300](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart#L15-L300), rute `/pre-purchase/feedback` ([app_router.dart:79-95](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/router/app_router.dart#L79-L95)) | BERJALAN | Rincian transaksi belanja yang dievaluasi (judul barang, nominal, kategori, waktu), pertanyaan inti refleksi apakah belanja sesuai rencana atau tidak terencana, dua kartu pilihan respons (`[Sesuai Rencana Anggaran]` vs `[Tidak Terencana / Terasa Impulsif]`), pemilih rating kepuasan 1-5 bintang, dan tombol kirim konfirmasi | Tidak ada (seluruh elemen wajib terpenuhi) | Keterangan privasi bahwa label dipakai khusus melatih model personal pengguna sendiri |
| `gambar_3_14_laporan_pengeluaran.png` | Halaman Laporan Pengeluaran (*HistoryReportScreen*) | [history_report_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/history_report/screens/history_report_screen.dart), rute `/history-report` ([app_router.dart:113-119](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/router/app_router.dart#L113-L119)) | BERJALAN | Tab riwayat transaksi versus tab analitik pengeluaran, ringkasan total pemasukan dan pengeluaran bulanan, diagram visual proporsi pengeluaran per kategori, dan daftar riwayat transaksi terinci per tanggal | Tidak ada (seluruh elemen wajib terpenuhi) | Filter pencarian transaksi, penanda tag transaksi impulsif, dan tombol ekspor data |

---

## 2. Tabel Inventarisasi Halaman Pendukung Peran User

| Kode FR | Nama Berkas Gambar | Nama Halaman di Proyek | Berkas dan Rute (path:baris) | Status | Elemen yang Tampil |
|:---|:---|:---|:---|:---|:---|
| FR-U01 | `user_FR_U01_akun_dan_privasi.png` | Layar Profil, Akun & Privasi | [profile_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart), rute `/profile` | BERJALAN | Informasi akun pengguna, status persetujuan (*consent*) penelitian, pengaturan privasi pseudonimisasi, preferensi notifikasi, dan tombol keluar |
| FR-U02 | `user_FR_U02_anggaran_dan_tabungan.png` | Layar Perencanaan Anggaran & Tabungan | [planning_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/planning/screens/planning_screen.dart), rute `/planning` | BERJALAN | Alokasi anggaran berbasis aturan 50/30/20 (kebutuhan, keinginan, tabungan), progress bar tujuan tabungan, proyeksi tanggal tercapai, dan pembuatan pos anggaran baru |
| FR-U03 | `user_FR_U03_input_transaksi_manual.png` | Layar Catat Transaksi Manual | [add_transaction_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart), rute `/add-transaction` | BERJALAN | Pemilihan jenis transaksi (Pemasukan/Pengeluaran), input nominal, dropdown kategori, tanggal transaksi, metode pembayaran, dan catatan |
| FR-U03 | `user_FR_U03_pemindaian_struk_ocr.png` | Layar Pemindaian Struk Belanja OCR | [ocr_scan_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/ocr/screens/ocr_scan_screen.dart), rute `/ocr-scan` | BERJALAN | Jendela bidik kamera dan impor foto struk, indikator pemrosesan ekstraksi teks OCR, form verifikasi hasil (merchant, nominal, tanggal), dan tombol simpan transaksi |
| FR-U06 | `user_FR_U06_koreksi_prediksi_model.png` | Layar Koreksi Label Prediksi Model | [post_decision_feedback_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart), rute `/pre-purchase/feedback` | BERJALAN | Formulir pemilihan label operasional terencana vs tidak terencana untuk mengoreksi hasil estimasi risiko model Machine Learning |
| FR-U08 | `user_FR_U08_kesehatan_finansial.png` | Layar Indikator Kesehatan Finansial & Engagement | [health_score_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/health_score/screens/health_score_screen.dart), rute `/health-score` | BERJALAN | Visualisasi meteran skor kesehatan finansial (0-100), kategori status (Sehat/Waspada/Boros), rincian rasio kebutuhan, keinginan, dan tabungan, serta status *streak* pencatatan |

---

## 3. Tabel Inventarisasi Halaman Peran Admin (Dasbor Next.js, Ukuran 1440x900)

| Kode FR | Nama Berkas Gambar | Nama Halaman di Proyek | Berkas dan Rute (path:baris) | Status | Elemen yang Tampil |
|:---|:---|:---|:---|:---|:---|
| FR-A01 & FR-A04 | `admin_FR_A01_A04_dashboard.png` | Dasbor Utama & Monitoring Status Layanan | [frontend/src/app/admin/dashboard/page.tsx:10-150](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx#L10-L150), rute `/admin/dashboard` | BERJALAN | Kartu ringkasan operasional sistem (total pengguna terdaftar, total modul edukasi, total kuis, total lencana pencapaian), status layanan aktif, dan daftar materi terbaru |
| FR-A03 & FR-A05 | `admin_FR_A03_A05_model_governance.png` | Panel Evaluasi & Tata Kelola Model ML | [frontend/src/app/admin/models/page.tsx:26-480](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L26-L480), rute `/admin/models` | BERJALAN | Tabel komparasi versi model ML (Logistic Regression & Random Forest), metrik validasi (Precision, Recall, F1-Score, ROC-AUC), penanda model aktif (`is_active`), dan modal *1-click rollback* dengan input alasan wajib |
| FR-A06 | `admin_FR_A06_audit_logs.png` | Log Audit Intervensi & Akses Transaksi | [frontend/src/app/admin/audit-logs/page.tsx:34-400](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx#L34-L400), rute `/admin/audit-logs` | BERJALAN | Kartu statistik efektivitas sistem (total check, total belanja terhindar, rasio pencegahan overbudget, total nominal terselamatkan), tabel log audit keputusan transaksi pengguna, status label `was_impulsive`, dan paginasi data |

---

## 4. Prosedur dan Strategi Pengambilan Tangkapan Layar

1. **Aplikasi Mobile (User):**
   - Mengingat emulator ponsel Android membutuhkan instalasi Android Studio Emulator yang berat, pengambilan tangkapan layar mobile dilakukan secara aman menggunakan target peramban web:
     ```powershell
     cd mobile
     flutter run -d chrome --web-renderer canvaskit
     ```
   - Jendela peramban diatur ke resolusi ponsel standar portrait (390 x 844 piksel / rasio iPhone 13-14 atau 1080 x 2400 piksel).
   - Setiap rute halaman diakses secara berurutan dan tangkapan layar disimpan ke format PNG di folder `thesis_assets/screenshots/`.
2. **Aplikasi Web (Admin):**
   - Dasbor Next.js dijalankan secara lokal:
     ```powershell
     cd frontend
     npm run dev -- -p 3001
     ```
   - Jendela peramban diatur ke resolusi desktop standar 1440 x 900 piksel, dan tangkapan layar disimpan ke format PNG di folder `thesis_assets/screenshots/`.
