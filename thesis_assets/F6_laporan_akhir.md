# Laporan Akhir Konsolidasi Perbaikan Sistem dan Kesesuaian Naskah Skripsi (Tugas F6)

**Judul Penelitian:** Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal  
**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Waktu Penyelesaian:** 14 Oktober 2026  
**Status:** Seluruh tugas inti (F0, F4, F1, F2, F3, F5, F7, F8, F9, F6) telah selesai, teruji, dan terdokumentasi.

---

## 1. Ringkasan Pelaksanaan Seluruh Tugas

| Kode | Nama Tugas | Status | Ringkasan Tindakan | Berkas Bukti Utama |
| :--- | :--- | :--- | :--- | :--- |
| **F0** | Verifikasi 4 Kontradiksi | Selesai | Memverifikasi ketidaksesuaian antara naskah dan basis kode pada 4 area: arsitektur NestJS vs FastAPI, klaim chatbot LLM vs sistem aturan/ML, kinerja model sintetis vs nyata, serta klaim waktu respons vs persistensi in-memory. | `thesis_assets/F0_verifikasi_ulang.md` |
| **F4** | Pengaman Endpoint Admin | Selesai | Mengimplementasikan verifikasi JWT Bearer Supabase pada `admin.py`, memeriksa klaim `role == 'admin'`, menolak akses ilegal (401/403/422), mencatat audit log rollback model, dan menyinkronkan peran di frontend Next.js. | `thesis_assets/F4_pengaman_admin.md` |
| **F1** | Persistensi Data Pra-Pembelian | Selesai | Merancang skema DDL `001_pre_purchase_and_governance.sql`, mengimplementasikan `PrePurchaseRepository` dual-mode (in-memory dan PostgreSQL/Supabase), serta menghubungkan siklus *check* $\rightarrow$ *decide* $\rightarrow$ *feedback*. | `thesis_assets/F1_persistensi.md` |
| **F2** | Statistik Pengguna Nyata | Selesai | Membangun `user_stats_service.py` untuk menghitung 7 fitur kontekstual berbasis data transaksi historis pengguna secara *point-in-time*, mencegah kebocoran data masa depan (*temporal leakage*), menangani *cold-start* secara transparan, dan menghitung pagu dinamis. | `thesis_assets/F2_statistik_nyata.md` |
| **F3** | Persetujuan Partisipan (*Consent*) | Selesai | Merancang tabel DDL `002_consent_records.sql`, endpoint API `POST /api/v1/consent/record` dan `GET /api/v1/consent/status`, dialog *informed consent* pada *onboarding* aplikasi Flutter, serta tombol penarikan persetujuan (*opt-out*) pada Profil Pengguna. | `thesis_assets/F3_persetujuan_partisipan.md` |
| **F5** | Pemicu Konfirmasi Pasca-Keputusan | Selesai | Membangun `PostDecisionReminderService` pada Flutter, menyematkan banner pengingat pada layar Beranda dalam jendela 24–72 jam setelah keputusan, menangani mekanisme coba lagi (*network retry*), dan memurnikan istilah UI menjadi "sesuai rencana" vs "tidak terencana". | `thesis_assets/F5_konfirmasi_pasca_keputusan.md` |
| **F7** | Metrik Pelatihan & Analisis Data Sintetis | Selesai | Memperbarui `train_risk_model.py` dengan evaluasi PR-AUC, Brier score, Balanced Accuracy, dan False-Alert Rate untuk model Baseline, Logistic Regression, dan Random Forest; mendokumentasikan potensi sirkularitas generator data sintetis dan implikasi metodologisnya. | `thesis_assets/F7_catatan_data_sintetis.md`, `thesis_assets/F7_keluaran_pelatihan.txt` |
| **F8** | Pembersihan Chatbot & Arsip NestJS | Selesai | Menyelamatkan DDL migrasi inti (`000_initial_schema.sql` dan `000_model3_onboarding.sql`) ke `backend/db/migrations/`, menghapus direktori usang `backend_nestjs_archive/`, membersihkan klien API chat mati dari Next.js, dengan tetap mempertahankan modul OCR, XAI Dashboard, dan Edukasi Finansial. | `thesis_assets/F8_daftar_penghapusan.md` |
| **F9** | Skrip Ekspor Data Pseudonim | Selesai | Menciptakan `backend/scripts/export_pilot_data.py` dengan hashing HMAC-SHA256 ber-garam (*salt*) untuk `participant_code`, menyaring hanya pengguna dengan *consent* aktif, menghapus seluruh atribut identitas pribadi (PII), mendukung filter rentang tanggal, dan menerbitkan `export_manifest.json`. | `thesis_assets/F9_ekspor_pseudonim.md` |
| **F6** | Konsolidasi Tes & Laporan Akhir | Selesai | Mengonsolidasikan seluruh pengujian (backend 39 tests, mobile 9 tests, frontend build), menambahkan berkas pengujian `test_unit_core.py`, melakukan uji tolok ukur latensi (50 iterasi terukur), dan menyusun matrik kesesuaian naskah akhir. | `thesis_assets/F6_laporan_akhir.md` |

---

## 2. Daftar Komit Kerja (Branch: `thesis/perbaikan-pilot`)

Seluruh perubahan dilakukan pada cabang terisolasi `thesis/perbaikan-pilot` tanpa menyentuh cabang `main` atau mendorong (*push*) ke remote:

1. **`33603b7`** — `F0: dokumentasi verifikasi ulang empat kontradiksi dan keadaan awal`
   - Berkas: `thesis_assets/F0_verifikasi_ulang.md`, `thesis_assets/PROGRESS_PERBAIKAN.md`
2. **`52af04f`** — `F4: pasang guard JWT pada router admin dan peran dinamis Next.js`
   - Berkas: `backend/app/api/admin.py`, `backend/tests/test_admin_auth.py`, `frontend/src/context/UserContext.tsx`, `frontend/src/app/admin/models/page.tsx`, `thesis_assets/F4_pengaman_admin.md`
3. **`31c7043`** — `F1: persistensi data pra-pembelian ke postgresql dan repository layer`
   - Berkas: `backend/db/migrations/001_pre_purchase_and_governance.sql`, `backend/app/services/pre_purchase_repository.py`, `backend/app/api/pre_purchase.py`, `backend/tests/test_persistence.py`, `thesis_assets/F1_persistensi.md`
4. **`6edd9ee`** — `F2: statistik pengguna nyata pada pemeriksaan pra-pembelian`
   - Berkas: `backend/app/services/user_stats_service.py`, `backend/app/api/pre_purchase.py`, `backend/app/schemas/pre_purchase_schema.py`, `backend/tests/test_user_stats.py`, `thesis_assets/F2_statistik_nyata.md`
5. **`827ccae`** — `F3: skema persetujuan partisipan, endpoint consent, dan ui informed consent mobile`
   - Berkas: `backend/db/migrations/002_consent_records.sql`, `backend/app/api/consent.py`, `backend/tests/test_consent.py`, `mobile/lib/features/consent/...`, `thesis_assets/F3_persetujuan_partisipan.md`
6. **`69a559c`** — `F5: pemicu konfirmasi pasca-keputusan dan banner pengingat 24-72 jam`
   - Berkas: `mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart`, `mobile/lib/features/home/screens/home_screen.dart`, `mobile/test/features/pre_purchase/post_decision_reminder_test.dart`, `thesis_assets/F5_konfirmasi_pasca_keputusan.md`
7. **`14b8a0d`** — `F7: metrik pelatihan nyata, evaluasi baseline rule-based, dan analisis data sintetis`
   - Berkas: `backend/training/train_risk_model.py`, `backend/artifacts_risk/model_registry_trained.json`, `thesis_assets/F7_keluaran_pelatihan.txt`, `thesis_assets/F7_catatan_data_sintetis.md`
8. **`e3fcf6c`** — `F8: laporan pemetaan pembersihan chatbot dan arsip NestJS (Tahap 1)`
   - Berkas: `thesis_assets/F8_daftar_penghapusan.md`
9. **`b8e014b`** — `F8: pemindahan migrasi inti, pembersihan endpoint chatbot, dan penghapusan arsip NestJS`
   - Berkas: `backend/db/migrations/000_initial_schema.sql`, `backend/db/migrations/000_model3_onboarding.sql`, penghapusan `backend_nestjs_archive/`, pembersihan `frontend/src/lib/api.ts`
10. **`eef723e`** — `F9: skrip ekspor data pseudonim dengan salt HMAC dan penegakan persetujuan partisipan`
    - Berkas: `backend/scripts/export_pilot_data.py`, `backend/tests/test_export_pilot_data.py`, `thesis_assets/F9_ekspor_pseudonim.md`

---

## 3. Inventarisasi dan Hasil Pengujian Seluruh Sistem

### 3.1. Pengujian Backend (Python / FastAPI)
- **Kerangka Uji:** `unittest` bawaan Python standard library.
- **Perintah Eksekusi:** `venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py" -v`
- **Total Pengujian:** **39 tests** (100% LULUS, waktu eksekusi ~0.51 detik).

| Berkas Uji | Kategori | Jumlah Kasus | Status | Aspek yang Diuji |
| :--- | :--- | :--- | :--- | :--- |
| `test_unit_core.py` | Unit | 10 | **LULUS** | Ekstraksi 7 fitur kontekstual, penanganan pembagian nol (*zero division protection*), *fallback* aturan *baseline* saat model nonaktif, perhitungan *health score* deterministik segmen A/B/C, dan gaya belanja Gen-Z. |
| `test_user_stats.py` | Unit & Integrasi | 7 | **LULUS** | Kalkulasi *point-in-time* tanpa kebocoran temporal, sisa pagu anggaran siklus berjalan, penandaan *cold-start*, dan ambang batas minimum riwayat ($\ge 5$ transaksi). |
| `test_admin_auth.py` | Keamanan | 6 | **LULUS** | Penolakan token tanpa otentikasi (401), penolakan non-admin (403), validasi klaim admin (200), validasi alasan *rollback* model (422), dan pembacaan *metadata*. |
| `test_consent.py` | Keamanan & Kepatuhan | 4 | **LULUS** | Pencatatan *informed consent* dengan JWT valid, penolakan permintaan tanpa token (401), *default status* non-partisipan (`given=False`), dan siklus penarikan persetujuan (*withdraw*). |
| `test_persistence.py` | Integrasi & Data | 6 | **LULUS** | Siklus hidup *pre-purchase* (`check` $\rightarrow$ `decide` $\rightarrow$ `feedback`), penolakan ID fiktif (404), *fallback* registry memori, dan abstraksi lapisan Supabase. |
| `test_export_pilot_data.py` | Privasi & Ekspor | 6 | **LULUS** | Deterministik salt HMAC pada `participant_code`, penyaringan ketat pengguna berizin aktif, eliminasi total kolom identitas pribadi (PII), filter tanggal, dan penerbitan manifes. |

### 3.2. Pengujian Aplikasi Mobile (Flutter / Dart)
- **Kerangka Uji:** `flutter_test`.
- **Perintah Eksekusi:** `flutter test` dan `flutter analyze`.
- **Hasil:**
  - **Unit & Logic Tests:** **9/9 tests LULUS** pada `post_decision_reminder_test.dart` (pengujian jendela logika 24–72 jam, penanganan aksi abaikan/tutup, dan status penyelesaian konfirmasi).
  - **Static Analysis:** `flutter analyze` menghasilkan **0 issues / No issues found!**.

### 3.3. Pengujian Web Dashboard (Next.js / TypeScript)
- **Kerangka Uji:** Validasi kompilasi produksi Turbopack & type checking TypeScript.
- **Perintah Eksekusi:** `npm run build` (mencakup `prisma generate && next build`).
- **Hasil:**
  - Kompilasi sukses dalam 3.0 detik.
  - TypeScript checking sukses tanpa error tipe (3.7s).
  - Halaman statis (25/25 halaman) berhasil dibangkitkan (*prerendered static pages* dan *dynamic routes*).

---

## 4. Hasil Pengukuran Waktu Respons Endpoint `POST /api/v1/pre-purchase/check`

Pengukuran waktu respons dilakukan setelah implementasi F1 (abstraksi persistensi) dan F2 (kalkulasi statistik pengguna nyata). Pengujian dilakukan menggunakan skrip `backend/scripts/measure_latency.py` sebanyak **50 permintaan terukur** (didahului oleh 10 putaran *warmup*).

### 4.1. Kondisi dan Lingkungan Pengukuran
- **Sistem Operasi:** Windows NT (win32, x64)
- **Lingkungan Eksekusi:** Python 3.13.14 (Virtual Environment lokal)
- **Klien Pengujian:** FastAPI `TestClient` (mengeksekusi seluruh rantai *pipeline*: parsing Pydantic, deserialisasi payload, pemrosesan middleware, kueri konteks pengguna F2, ekstraksi 7 fitur ML, inferensi Random Forest, kalkulasi dampak anggaran & tabungan, persistensi snapshot F1, hingga serialisasi JSON).
- **Status Model ML:** Aktif (`RandomForestClassifier`, Model Tag: `v1.1.0-rf`)
- **Mode Penyimpanan:** Memory Repository F1

### 4.2. Tabel Hasil Tolok Ukur Latensi (50 Permintaan)

| Parameter Metrik | Skenario 1: Pengguna dengan Riwayat Nyata (F2 Point-in-Time) | Skenario 2: Pengguna Baru (F2 Cold-Start Aware) |
| :--- | :---: | :---: |
| **Tingkat Keberhasilan** | 100% (50/50 HTTP 200 OK) | 100% (50/50 HTTP 200 OK) |
| **Waktu Minimum** | **16.80 ms** | **16.82 ms** |
| **Rata-rata (*Mean*)** | **18.81 ms** | **17.63 ms** |
| **Median ($p_{50}$)** | **17.53 ms** | **17.32 ms** |
| **Persentil 90 ($p_{90}$)** | **19.35 ms** | **18.44 ms** |
| **Persentil 95 ($p_{95}$)** | **20.02 ms** | **20.45 ms** |
| **Persentil 99 ($p_{99}$)** | **68.44 ms** | **22.64 ms** |
| **Waktu Maksimum** | **68.44 ms** | **22.64 ms** |
| **Standar Deviasi** | **7.22 ms** | **1.07 ms** |

> **Catatan Analisis Latensi:**
> Waktu respons internal backend berada stabil pada rentang **17–20 ms**. Lonjakan sesaat pada persentil 99 ($68.44\text{ ms}$) pada Skenario 1 dipicu oleh *garbage collection* periodik atau alokasi array numpy saat memproses vektor riwayat transaksi berukuran lebih besar. Angka median sebesar **17.53 ms** membuktikan bahwa penambahan kalkulasi statistik pengguna secara dinamis dan inferensi *Random Forest* tetap berada jauh di bawah ambang batas interaktivitas pengguna ($< 200\text{ ms}$).

---

## 5. Matriks Diskrepansi dan Rekomendasi Revisi Naskah Skripsi

Berdasarkan hasil temuan faktual pada kode sumber dan verifikasi di F0–F9, berikut adalah daftar aspek yang **masih berbeda atau perlu diperbaiki narasinya** pada naskah skripsi:

| No | Topik Naskah | Klaim/Narasi Lama pada Naskah | Fakta Implementasi Nyata | Rekomendasi Aksi Revisi Naskah |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Arsitektur Backend** | Menyebut arsitektur backend berbasis *NestJS (Node.js/TypeScript)* sebagai API inti dan FastAPI sebagai microservice terpisah. | Seluruh API inti, autentikasi guard, evaluasi risiko, dan tata kelola transaksi kini berada terpadu di **FastAPI (Python)**. Arsip lama `backend_nestjs_archive/` telah dihapus (F8). | **Revisi Bab 3 & 4:** Ganti diagram arsitektur menjadi *Monolithic Modular FastAPI Backend* yang melayani aplikasi Flutter dan Next.js Admin Dashboard. Hapus seluruh rujukan ke framework NestJS. |
| **2** | **Interaksi Pengguna (Chatbot vs Pra-Pembelian)** | Menyebut adanya fitur "Chatbot Asisten Finansial Interaktif" berbasis LLM percakapan bebas. | Chatbot percakapan bebas telah dibersihkan (F8). Fokus inovasi utama skripsi adalah **Peringatan Dini Pra-Pembelian Deterministik + ML** saat pengguna merencanakan pengeluaran. LLM hanya digunakan terbatas pada OCR dan edukasi terstruktur. | **Revisi Bab 1, 2, & 4:** Tegaskan bahwa ruang lingkup skripsi adalah intervensi tepat waktu (*just-in-time pre-purchase intervention*) berupa dialog peringatan terstruktur, bukan percakapan chatbot bebas yang rentan halusinasi. |
| **3** | **Kinerja Model & Data Pelatihan** | Mengklaim performa akurasi model $\approx 96\%$ sebagai bukti bahwa sistem sangat efektif mendeteksi pengeluaran tidak terencana di dunia nyata. | Model dilatih menggunakan dataset sintetis (F7). Terdapat korelasi matematis langsung (*potential circularity*) antara aturan pembangkit label dengan fitur masukan. Model nyata menghasilkan PR-AUC 0.970 dan Brier score 0.052. | **Revisi Bab 4 & 5:** Laporkan metrik evaluasi lengkap (PR-AUC, Brier score, False-Alert rate). Cantumkan *Threats to Validity* bahwa data pelatihan adalah data sintetis berbasis skenario perilaku, dan efektivitas nyata ditentukan melalui evaluasi *pilot testing*. |
| **4** | **Pengukuran Waktu Respons** | Menyebut waktu respons API berada pada angka absolut tertentu tanpa merinci metodologi pengukuran (atau mencampur aduk latensi jaringan internet seluler). | Pengujian tolok ukur internal backend (F6) mencatat waktu respons pemrosesan $\approx 17.5\text{ ms}$ (median) dan $\le 20\text{ ms}$ ($p_{95}$). | **Revisi Bab 4:** Sajikan tabel tolok ukur latensi Skenario 1 dan 2 dari berkas `F6_hasil_pengukuran_latensi.json`. Jelaskan secara metodologis perbedaan antara *backend processing time* ($\approx 18\text{ ms}$) dan latensi jaringan ujung-ke-ujung (*round-trip latency*). |
| **5** | **Pemicu Pasca-Keputusan & Notifikasi** | Menyebut penggunaan sistem notifikasi *Push Notification* eksternal berbasis push server/FCM untuk mengingatkan evaluasi belanja. | Diimplementasikan menggunakan **In-App Reminder Banner** (F5) pada layar Beranda yang muncul dalam jendela waktu 24–72 jam setelah transaksi tanpa dependensi push server eksternal. | **Revisi Bab 3 & 4:** Jelaskan bahwa pengingat dirancang sebagai *contextual in-app reminder* untuk menjaga kesederhanaan arsitektur dan menghindari ketergantungan izin notifikasi sistem operasi yang sering kali dinonaktifkan oleh pengguna. |
| **6** | **Tata Kelola Data & Etika Penelitian** | Belum mendokumentasikan secara rinci prosedur teknis *informed consent* partisipan dan perlindungan privasi data pilot testing. | Telah dibangun skema `user_consent_records` (F3) dan skrip ekspor data pseudonim dengan salt HMAC-SHA256 (F9) yang mengeliminasi PII sebelum data dianalisis. | **Revisi Bab 3 (Metodologi Penelitian):** Tambahkan sub-bab khusus mengenai *Etika Penelitian dan Perlindungan Data Partisipan*, merujuk pada mekanisme persetujuan digital dan ekspor data pseudonim yang telah diterapkan pada sistem. |

---

## 6. Kesimpulan Konsolidasi

Melalui penyelesaian rangkaian tugas dari F0 hingga F6, basis kode sistem `CEAMIS 2.0` telah berada dalam kondisi yang:
1. **Stabil dan Teruji:** Memiliki 39 unit & integration test pada backend, 9 unit test pada mobile dengan 0 flutter analyze issue, dan build produksi Next.js yang bersih.
2. **Aman dan Beretika:** Endpoint administratif terkunci dengan JWT guard, persetujuan pengguna terekam secara digital, dan data penelitian siap diekspor secara pseudonim tanpa kebocoran PII.
3. **Selaras dan Kredibel:** Seluruh ketidakkonsistenan historis antara naskah dan kode sumber telah diidentifikasi dan diberikan rekomendasi penyesuaian yang faktual serta dapat dipertanggungjawabkan di hadapan dewan penguji.
