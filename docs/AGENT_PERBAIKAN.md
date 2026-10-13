# PANDUAN AGEN: PERBAIKAN PROYEK UNTUK FIELD PILOT

File ini ditujukan untuk agen AI (Antigravity). Berbeda dengan panduan sebelumnya (`AGENT_BAB3.md`, mode baca saja), panduan ini **mengizinkan perubahan kode** secara terbatas dan terkontrol. Aturan mode baca saja pada panduan sebelumnya TIDAK berlaku di sini, kecuali pada hal yang disebut eksplisit.

## 0. Latar belakang

Pemilik proyek menyusun Tugas Akhir "Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal". Audit sebelumnya menemukan lima kekurangan yang menghalangi uji coba lapangan (*field pilot*) 6 sampai 8 minggu dengan 30 sampai 50 mahasiswa:

1. Pemeriksaan pra-pembelian memakai fungsi *mock* untuk statistik pengguna (`_get_user_category_stats`, `_get_user_budget_info` di `backend/app/api/pre_purchase.py`), bukan transaksi nyata.
2. Data pemeriksaan dan umpan balik disimpan *in-memory*, dan tabelnya belum dimigrasi ke PostgreSQL (Supabase).
3. Tabel dan alur persetujuan partisipan (`consent_records`) belum ada.
4. Router admin FastAPI belum memakai pengaman JWT, dan peran admin di Next.js ditentukan lewat metadata atau satu alamat surel.
5. Dialog konfirmasi pasca-keputusan belum terpicu otomatis di aplikasi mobile.

Selain itu ada pembersihan (chatbot dan arsip NestJS), tes otomatis, dan metrik pelatihan yang belum terbukti berasal dari hasil pelatihan.

## 1. Cara file ini dipakai

File ini boleh diletakkan di `docs/` (baca saja). Semua laporan ditulis ke `thesis_assets/`. Perubahan kode dilakukan HANYA pada cabang git khusus (lihat F0). Pengguna memulai dengan pesan:

> Baca `docs/AGENT_PERBAIKAN.md`, ikuti instruksinya, lalu kerjakan tugas F0. Berhenti setelah selesai dan tunggu konfirmasi saya.

## 2. Aturan wajib (berlaku untuk semua tugas)

1. **Cabang git terpisah.** Buat dan gunakan cabang `thesis/perbaikan-pilot` dari kondisi sekarang. Jangan pernah bekerja langsung di cabang utama. Jangan `push`, `force push`, `rebase`, atau menghapus cabang tanpa izin pengguna.
2. **Satu tugas, satu atau beberapa commit kecil** dengan pesan jelas berawalan kode tugas (misalnya `F4: pasang guard JWT pada router admin`).
3. **Jangan menyentuh basis data produksi atau layanan nyata.** Migrasi hanya ditulis sebagai file SQL. JANGAN dieksekusi ke instans Supabase milik pengguna. Berikan perintah penerapannya dalam laporan agar pengguna yang menjalankan.
4. **Jangan menampilkan atau meng-commit rahasia** (isi `.env`, API key, token, `SUPABASE_SERVICE_ROLE_KEY`, JWT secret). Sebut nama variabelnya saja, dan perbarui `.env.example` bila perlu.
5. **Ruang lingkup sempit.** Ubah hanya file yang diperlukan tugas. Jangan merapikan, memformat ulang, atau me-refaktor kode lain.
6. **Jaga kompatibilitas.** Fitur yang sudah berjalan tidak boleh rusak. Jika perubahan berisiko merusak, tambahkan sakelar konfigurasi (variabel lingkungan) dan simpan perilaku lama sebagai bawaan.
7. **Tes.** Setiap tugas menambahkan tes minimal untuk perilaku barunya dan menjalankan seluruh tes yang ada. Laporkan hasilnya apa adanya, termasuk yang gagal.
8. **Jangan mengarang.** Setiap klaim di laporan disertai bukti path file dan nomor baris. Jika tidak bisa dikerjakan atau diverifikasi, tulis "TIDAK DAPAT DIKERJAKAN" atau "BELUM TERVERIFIKASI" beserta alasannya.
9. **Tindakan yang menghapus file** (F8) dilakukan pada commit terpisah, setelah pengguna menyetujui daftar file yang akan dihapus.
10. **Minta izin** sebelum menginstal paket global atau menjalankan perintah di luar folder proyek.
11. **Bahasa:** laporan dan komentar kode berbahasa Indonesia formal, tanpa tanda pisah panjang. Nama kode (fungsi, tabel, kolom) mengikuti konvensi proyek.

## 3. Alur kerja agen

1. Baca seluruh file ini sebelum mulai.
2. Kerjakan SATU tugas per giliran sesuai urutan bagian 4. Jangan mulai tugas berikutnya sebelum pengguna menyatakan lanjut.
3. Sebelum memulai, perbarui `thesis_assets/PROGRESS_PERBAIKAN.md` (status "SEDANG DIKERJAKAN"). Setelah selesai, ubah menjadi "SELESAI", "SEBAGIAN", atau "GAGAL", lalu isi commit, file yang berubah, dan kendala.
4. Setelah tiap tugas, berhenti dan tulis di chat: (a) ringkasan lima baris, (b) daftar commit, (c) hasil tes, (d) hal yang butuh keputusan pengguna, (e) pertanyaan "Lanjut ke tugas berikutnya?".
5. Jika terblokir, jangan mencoba berulang dan jangan mengarang. Catat blokirnya, kerjakan bagian lain yang masih mungkin, lalu berhenti.
6. Jika proyek terdiri atas beberapa folder (`mobile/`, `frontend/`, `backend/`), bekerja hanya di folder yang relevan dengan tugas.

## 4. Urutan tugas

| Urutan | Kode | Tugas | Folder utama | Prioritas |
|:---|:---|:---|:---|:---|
| 1 | F0 | Persiapan cabang dan verifikasi ulang empat kontradiksi | seluruh repositori (baca) | Wajib |
| 2 | F4 | Pengaman JWT dan peran admin | `backend/`, `frontend/` | Wajib |
| 3 | F1 | Persistensi data pra-pembelian ke PostgreSQL | `backend/` | Wajib |
| 4 | F2 | Statistik pengguna nyata pada pemeriksaan pra-pembelian | `backend/` | Wajib |
| 5 | F3 | Persetujuan partisipan (`consent_records`) | `backend/`, `mobile/` | Wajib |
| 6 | F5 | Pemicu konfirmasi pasca-keputusan | `mobile/` | Wajib |
| 7 | F7 | Metrik pelatihan nyata dan catatan data sintetis | `backend/training/` | Penting |
| 8 | F8 | Pembersihan chatbot dan arsip NestJS | `backend/`, `mobile/`, repositori | Penting |
| 9 | F9 | Skrip ekspor data pseudonim | `backend/scripts/` | Penting |
| 10 | F6 | Konsolidasi tes dan laporan akhir | seluruh repositori | Penting |
| 11 | F10 | Telemetri keterlibatan tambahan | `backend/`, `mobile/` | Opsional |

## 5. Format `thesis_assets/PROGRESS_PERBAIKAN.md`

```
# Progres Perbaikan Proyek

Cabang kerja: thesis/perbaikan-pilot

| Kode | Tugas | Status | Commit | File berubah | Hasil tes | Kendala |
|:---|:---|:---|:---|:---|:---|:---|
| F0 | Persiapan dan verifikasi ulang | BELUM | - | - | - | - |
| F4 | Pengaman JWT admin | BELUM | - | - | - | - |
| F1 | Persistensi pra-pembelian | BELUM | - | - | - | - |
| F2 | Statistik pengguna nyata | BELUM | - | - | - | - |
| F3 | Persetujuan partisipan | BELUM | - | - | - | - |
| F5 | Pemicu konfirmasi pasca-keputusan | BELUM | - | - | - | - |
| F7 | Metrik pelatihan nyata | BELUM | - | - | - | - |
| F8 | Pembersihan chatbot dan NestJS | BELUM | - | - | - | - |
| F9 | Ekspor data pseudonim | BELUM | - | - | - | - |
| F6 | Konsolidasi tes | BELUM | - | - | - | - |
| F10 | Telemetri tambahan | BELUM | - | - | - | - |
```

## 6. Kriteria selesai untuk setiap tugas

- Perubahan hanya pada file yang diperlukan, di cabang `thesis/perbaikan-pilot`.
- Tes baru ada dan lulus, tes lama tidak rusak (atau kegagalan lama dicatat sebagai sudah ada sebelumnya).
- Tidak ada rahasia di diff. `git diff` sudah diperiksa.
- Laporan tugas ditulis di `thesis_assets/` dengan bukti path:baris.
- `PROGRESS_PERBAIKAN.md` sudah diperbarui.

---

# 7. DAFTAR TUGAS

---

## TUGAS F0: Persiapan cabang dan verifikasi ulang empat kontradiksi

**Mode:** baca, kecuali pembuatan cabang. Tidak ada perubahan kode.

1. Jalankan `git status`. Jika ada perubahan yang belum di-commit, jangan disentuh: laporkan ke pengguna dan berhenti.
2. Buat cabang `thesis/perbaikan-pilot` dari kondisi sekarang. Catat nama cabang asal dan hash commit awal.
3. Verifikasi ulang empat klaim yang bertentangan antarlaporan, dengan bukti path:baris:
   - **a. Chatbot:** apakah `backend/app/api/chatbot.py` ada, apakah routernya didaftarkan di `backend/app/main.py`, dan apakah `POST /api/v1/chatbot/chat` aktif? Apakah aplikasi mobile atau web memanggilnya?
   - **b. Persetujuan:** apakah kolom `consent_given` atau `consent_date` benar-benar ada di skema (`frontend/prisma/schema.prisma`, migrasi SQL, model ORM) dan di `profile_screen.dart`? Apa yang sebenarnya tersimpan?
   - **c. Pengaman admin:** untuk setiap endpoint `/api/v1/admin/*`, apakah ada dependensi verifikasi JWT atau peran? Bagaimana peran admin ditentukan di Next.js (`frontend/src/app/auth/page.tsx` dan lainnya)? Apakah ada alamat surel admin yang ditulis langsung di kode?
   - **d. Asal metrik model:** apakah nilai precision, recall, F1, dan ROC-AUC pada `backend/app/api/admin.py` (dan `artifacts_risk/model_registry.json`) ditulis langsung di kode, atau dihasilkan oleh `backend/training/train_risk_model.py`? Jalankan skrip pelatihan di lingkungan lokal (jika dependensi tersedia), simpan keluaran konsolnya, dan bandingkan angkanya dengan yang tercatat. Jangan menimpa file registry yang ada; tulis keluaran ke `thesis_assets/`.
4. Tulis `thesis_assets/F0_verifikasi_ulang.md` berisi tabel: Klaim | Laporan sebelumnya yang menyebut | Kondisi sebenarnya | Bukti path:baris | Status (TERBUKTI, TIDAK TERBUKTI, atau SEBAGIAN).
5. Tulis juga ringkasan keadaan awal: jumlah tes yang ada dan hasilnya, serta apakah proyek bisa dijalankan lokal (backend, frontend, mobile).

**Selesai bila:** cabang dibuat, `F0_verifikasi_ulang.md` ada, tidak ada file kode yang berubah.

---

## TUGAS F4: Pengaman JWT dan peran admin

**Tujuan:** endpoint admin hanya dapat diakses pengguna yang terautentikasi dan berperan admin.

1. Tambahkan dependensi FastAPI yang memverifikasi token JWT Supabase (dari header `Authorization: Bearer`) dan membaca peran dari klaim yang sah (misalnya `app_metadata.role`). Pasang pada semua route `/api/v1/admin/*` di `backend/app/api/admin.py`. Verifikasi tanda tangan memakai konfigurasi Supabase (JWT secret atau JWKS) yang dibaca dari variabel lingkungan. Tambahkan nama variabelnya ke `.env.example`.
2. Respons yang benar: 401 jika token tidak ada atau tidak valid, 403 jika peran bukan admin.
3. Pada Next.js, hapus penentuan admin berdasarkan alamat surel yang ditulis langsung. Gunakan klaim peran dari sesi Supabase. Jika diperlukan, sediakan skrip atau SQL untuk memberi peran admin pada satu akun (tulis sebagai file, jangan dijalankan).
4. Pastikan dasbor admin tetap memanggil endpoint dengan token pengguna yang sedang masuk.
5. Tes: (a) tanpa token ditolak 401, (b) token pengguna biasa ditolak 403, (c) token admin diterima, (d) rollback model tanpa alasan atau alasan kurang dari 5 karakter tetap ditolak.
6. Laporan `thesis_assets/F4_pengaman_admin.md`: daftar endpoint admin dan pengamannya sebelum dan sesudah, cara memberi peran admin, tes yang dijalankan.

**Larangan:** jangan mengubah isi atau skema data pengguna di basis data produksi.

---

## TUGAS F1: Persistensi data pra-pembelian ke PostgreSQL

**Tujuan:** keputusan, hasil prediksi, umpan balik, versi model, dan log audit tersimpan permanen.

1. Tinjau model ORM `backend/app/models/pre_purchase.py` dan `docs/ceamis 2.0/DATABASE_SCHEMA.md`. Tulis migrasi SQL idempoten (`CREATE TABLE IF NOT EXISTS`) untuk `pre_purchase_checks`, `risk_predictions`, `post_decision_feedbacks`, `model_versions`, dan `audit_logs`, sesuai ORM, lengkap dengan kunci asing, indeks, dan kebijakan RLS: pengguna hanya boleh membaca baris miliknya (`auth.uid() = user_id`), sedangkan tabel tata kelola hanya untuk peran admin. Simpan di folder migrasi yang sudah dipakai proyek (jika tidak ada, buat `backend/db/migrations/`). JANGAN mengeksekusinya.
2. Tambahkan lapisan repositori yang menyimpan dan membaca data tersebut lewat klien yang sudah dipakai proyek (Supabase client atau SQLAlchemy, ikuti yang paling konsisten). Gantikan penyimpanan *in-memory* di `backend/app/api/pre_purchase.py`.
3. Sediakan sakelar `PERSISTENCE_BACKEND=db|memory` (bawaan: `memory` agar perilaku lama tidak berubah selama migrasi belum dijalankan pengguna). Dokumentasikan di `.env.example`.
4. Pindahkan sumber registri versi model dari berkas JSON ke tabel `model_versions` ketika `db` aktif, dengan jalur kembali ke JSON jika tabel kosong. Rollback tetap mewajibkan alasan dan menulis `audit_logs`.
5. Tes: simpan, baca, dan perbarui satu siklus pemeriksaan (check, decide, feedback) pada mode `memory` dan, jika basis data lokal tersedia (Docker Postgres atau Supabase lokal), pada mode `db`. Jika basis data lokal tidak tersedia, tulis tes mode `db` dengan tiruan (*mock*) dan tandai "belum diuji pada basis data nyata".
6. Laporan `thesis_assets/F1_persistensi.md`: berkas migrasi, perintah penerapan untuk pengguna, daftar perubahan, hasil tes, dan risiko.

**Larangan:** jangan menjalankan migrasi pada Supabase milik pengguna. Jangan menghapus data yang ada.

---

## TUGAS F2: Statistik pengguna nyata pada pemeriksaan pra-pembelian

**Tujuan:** fitur model dihitung dari riwayat transaksi dan anggaran pengguna yang sebenarnya.

1. Ganti fungsi *mock* `_get_user_category_stats` dan `_get_user_budget_info` di `backend/app/api/pre_purchase.py` dengan layanan yang membaca data nyata: median, rata-rata, dan simpangan baku nominal per kategori pengguna; frekuensi kategori 7 hari terakhir; sisa anggaran berjalan; target tabungan aktif; tanggal reset anggaran. Sumber data mengikuti yang dipakai proyek (tabel `transactions`, `FinancialBudget` atau `planning`, `FinancialTarget`). Letakkan di modul layanan tersendiri agar mudah diuji.
2. **Kebocoran temporal:** statistik harus dihitung hanya dari transaksi sebelum waktu pemeriksaan (*point-in-time*), tidak termasuk transaksi saat atau setelahnya.
3. **Cold start:** jika riwayat kategori kurang dari ambang minimum (usulkan 5 transaksi, buat sebagai konstanta yang bisa diubah), pakai aturan *fallback* yang sudah ada dan tandai hasilnya sebagai `cold_start=true` pada respons dan `features_snapshot`.
4. Pertahankan penjagaan pembagian nol yang sudah ada di `extract_features`.
5. Tes: pengguna dengan riwayat cukup, pengguna baru (cold start), pengguna dengan satu transaksi, dan kasus transaksi di masa depan yang tidak boleh ikut dihitung.
6. Laporan `thesis_assets/F2_statistik_nyata.md`: sumber setiap fitur, bukti bebas kebocoran temporal, aturan cold start, hasil tes.

---

## TUGAS F3: Persetujuan partisipan (`consent_records`)

**Tujuan:** persetujuan eksplisit dan riwayatnya tercatat sebelum data dipakai untuk penelitian.

1. Buat migrasi SQL untuk `consent_records` (usulan kolom: `id`, `user_id`, `consent_version`, `purpose`, `given` boolean, `given_at`, `withdrawn_at`, `created_at`) dengan RLS pemilik data. Jangan dieksekusi.
2. Tambahkan endpoint backend untuk mencatat persetujuan, mencabutnya, dan membaca status terbaru, dengan autentikasi pengguna.
3. Pada aplikasi mobile: tampilkan layar persetujuan pada akhir orientasi (*onboarding*) dengan teks yang jelas (tujuan penelitian, jenis data, hak menarik diri, kontak peneliti sebagai teks pengganti yang mudah diedit di satu file). Sediakan juga sakelar pencabutan di `profile_screen.dart`. Jangan mengarang isi hukum: gunakan teks pengganti bertanda `[ISI SESUAI LEMBAR INFORMASI PENELITIAN]`.
4. Data transaksi dan evaluasi pengguna yang belum memberi persetujuan tidak boleh ikut dalam ekspor penelitian (diterapkan pada F9). Catat kebutuhan ini sebagai tugas lanjutan jika F9 belum dikerjakan.
5. Tes: catat, cabut, dan baca status persetujuan; pastikan satu pengguna tidak bisa membaca persetujuan pengguna lain.
6. Laporan `thesis_assets/F3_persetujuan.md`: skema, endpoint, layar yang ditambahkan, dan teks pengganti yang perlu diisi pengguna.

**Larangan:** jangan mengisi teks persetujuan dengan klaim hukum atau etik yang tidak diberikan pengguna.

---

## TUGAS F5: Pemicu konfirmasi pasca-keputusan

**Tujuan:** label "terencana atau tidak terencana" terkumpul secara andal setelah keputusan.

1. Pada aplikasi mobile, hubungkan pemicu konfirmasi: setelah keputusan `PROCEED` atau `ADJUST`, tampilkan pengingat di Beranda (dan notifikasi lokal jika paket notifikasi sudah ada di proyek) antara 24 jam dan 72 jam kemudian, mengarah ke `PostDecisionFeedbackScreen`. Jangan menambah paket baru tanpa izin; jika perlu, gunakan banner dalam aplikasi saja.
2. Pastikan layar mengirim ke `POST /api/v1/pre-purchase/feedback` dan menangani kegagalan jaringan (coba lagi, tidak menghilangkan jawaban).
3. Pastikan pengguna yang mengabaikan pengingat tidak mengalami galat, dan pemeriksaan tanpa label tetap tersimpan sebagai belum berlabel.
4. **Istilah:** teks pertanyaan dan pilihan di layar harus memakai "sesuai rencana" dan "tidak terencana". Jika di UI atau kode ada teks yang menyebut "impulsif" atau "disesali" sebagai definisi label, laporkan daftarnya dan usulkan penggantian, tetapi JANGAN mengganti nama kolom basis data (`was_impulsive`) pada tugas ini.
5. Tes: widget test atau tes logika untuk pemicu (kapan banner muncul dan hilang), dan tes pengiriman umpan balik pada mode sukses dan gagal.
6. Laporan `thesis_assets/F5_konfirmasi_pasca_keputusan.md`.

---

## TUGAS F7: Metrik pelatihan nyata dan catatan data sintetis

**Tujuan:** angka kinerja model berasal dari pelatihan nyata dan keterbatasannya terdokumentasi.

1. Pada `backend/training/train_risk_model.py`, tambahkan perhitungan metrik selain yang sudah ada: PR-AUC (*average precision*), *balanced accuracy*, tingkat *false-alert* (FP / (FP + TN)), dan skor kalibrasi (misalnya Brier score), untuk baseline *rule-based*, Logistic Regression, dan Random Forest, pada data uji temporal yang sama.
2. Pastikan seluruh nilai metrik ditulis ke registri **oleh skrip pelatihan** (bukan ditulis langsung di kode `admin.py`). Gunakan `random_state` tetap agar hasil dapat diulang. Jangan menimpa registri yang ada tanpa izin: tulis ke berkas baru lalu laporkan perbedaannya.
3. Jalankan pelatihan dan simpan keluaran konsol lengkap ke `thesis_assets/F7_keluaran_pelatihan.txt`.
4. Tulis `thesis_assets/F7_catatan_data_sintetis.md` yang menjawab dengan bukti kode: bagaimana label `is_risky` dibangkitkan, apakah fitur dan label dibangkitkan dari fungsi yang sama (risiko sirkularitas), proporsi kelas pada data latih dan uji, dan apakah statistik per pengguna pada data pelatihan dihitung hanya dari riwayat sebelum transaksi (*point-in-time*) atau dari seluruh riwayat (potensi kebocoran).
5. **Jangan** mengubah logika pembagian data, pembobotan kelas, atau fitur. Jangan menambahkan SMOTE atau K-Fold.

---

## TUGAS F8: Pembersihan chatbot dan arsip NestJS

**Mode:** dua tahap. Tahap 1 hanya laporan, tahap 2 menghapus setelah persetujuan.

**Tahap 1 (laporan):**
1. Petakan semua yang terkait chatbot: router, file, utilitas yang dipakai khusus chatbot (misalnya `prompt_builder.py` dan `safety_filter.py`, bila hanya dipakai chatbot), pemanggil di mobile dan web, dependensi.
2. Petakan semua yang berada di `backend_nestjs_archive/`, dan tunjukkan file di dalamnya yang masih menjadi sumber kebenaran (misalnya `supabase/migrations/001_initial_schema.sql`).
3. Petakan penggunaan LLM (Gemini) yang BUKAN chatbot: OCR (`ocr.py`), `dashboard_insight.py`, `education.py`. Jangan dihapus.
4. Tulis `thesis_assets/F8_daftar_penghapusan.md` berisi tiga daftar: akan dihapus, akan dipindahkan, tidak boleh disentuh. Berhenti dan tunggu persetujuan pengguna.

**Tahap 2 (setelah persetujuan, commit terpisah):**
5. Hapus pendaftaran router dan file chatbot yang disetujui, serta pemanggilnya di mobile dan web.
6. Pindahkan berkas migrasi SQL yang masih diperlukan dari `backend_nestjs_archive/` ke folder migrasi aktif sebelum arsip dihapus.
7. Hapus `backend_nestjs_archive/` hanya jika pengguna menyetujui secara eksplisit.
8. Jalankan seluruh tes dan pastikan aplikasi tetap berjalan.

---

## TUGAS F9: Skrip ekspor data pseudonim

**Tujuan:** data penelitian dapat diekspor tanpa identitas.

1. Buat `backend/scripts/export_pilot_data.py` yang membaca data pemeriksaan, keputusan, umpan balik, dan transaksi, lalu mengekspor ke CSV dengan: (a) `participant_code` hasil pemetaan `user_id` yang stabil (misalnya HMAC dengan kunci dari variabel lingkungan, bukan disimpan di kode), (b) tanpa nama, surel, nomor telepon, dan teks bebas yang dapat mengidentifikasi, (c) hanya pengguna dengan persetujuan aktif (butuh F3).
2. Tambahkan opsi rentang tanggal dan tabel keluaran, serta ringkasan jumlah baris per tabel.
3. Tes dengan data tiruan: memastikan tidak ada kolom identitas pada keluaran dan pengguna tanpa persetujuan terlewat.
4. Laporan `thesis_assets/F9_ekspor_pseudonim.md`: cara pakai, kolom keluaran, dan keterbatasan (misalnya teks bebas pada catatan).

---

## TUGAS F6: Konsolidasi tes dan laporan akhir

1. Inventarisasi seluruh tes (backend, mobile, frontend) dengan kerangka dan cara menjalankannya. Jalankan semuanya dan laporkan lulus atau gagal.
2. Jika tes backend belum terkumpul di satu folder, kumpulkan di `backend/tests/` dengan struktur jelas (unit: fitur, fallback, skor kesehatan; integrasi: alur check, decide, feedback; keamanan: guard admin).
3. Ukur ulang waktu respons endpoint `POST /api/v1/pre-purchase/check` (minimal 30 panggilan) pada kondisi **setelah F1 dan F2** (data nyata dan penyimpanan basis data bila tersedia), dan catat kondisi pengukuran.
4. Tulis `thesis_assets/F6_laporan_akhir.md`: ringkasan semua tugas, daftar commit, hasil tes, hasil pengukuran, dan daftar hal yang masih berbeda dari naskah.

---

## TUGAS F10 (opsional): Telemetri keterlibatan tambahan

1. Tambahkan pencatatan `decision_latency_ms` (jeda antara hasil peringatan tampil dan keputusan dipilih) pada data pemeriksaan, dan peristiwa pembukaan sesi bila sederhana dilakukan.
2. Pastikan data ini hanya disimpan untuk pengguna yang memberi persetujuan (F3).
3. Laporan `thesis_assets/F10_telemetri.md`.
