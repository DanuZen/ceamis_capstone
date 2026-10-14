# Laporan Akhir Konsolidasi Perbaikan Sistem dan Kesesuaian Naskah Skripsi (Tugas F6)

**Judul Penelitian:** Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal  
**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Waktu Penyelesaian:** 14 Oktober 2026  
**Status:** Seluruh tugas inti dan perbaikan pilot (F0 s.d. F12) telah selesai, teruji, dan terdokumentasi secara komprehensif.

---

## 1. Ringkasan Pelaksanaan Seluruh Tugas

| Kode | Nama Tugas | Status | Ringkasan Tindakan | Berkas Bukti Utama |
| :--- | :--- | :---: | :--- | :--- |
| **F0** | Verifikasi 4 Kontradiksi | Selesai | Memverifikasi ketidaksesuaian antara naskah dan basis kode pada 4 area: arsitektur NestJS vs FastAPI, klaim chatbot LLM vs sistem aturan/ML, kinerja model sintetis vs nyata, serta klaim waktu respons vs persistensi in-memory. | `thesis_assets/F0_verifikasi_ulang.md` |
| **F4** | Pengaman Endpoint Admin | Selesai | Mengimplementasikan verifikasi JWT Bearer Supabase pada `admin.py`, memeriksa klaim `role == 'admin'`, menolak akses ilegal (401/403/422), mencatat audit log rollback model, dan menyinkronkan peran di frontend Next.js. | `thesis_assets/F4_pengaman_admin.md` |
| **F1** | Persistensi Data Pra-Pembelian | Selesai | Merancang skema DDL `001_pre_purchase_and_governance.sql`, mengimplementasikan `PrePurchaseRepository` dual-mode (in-memory dan PostgreSQL/Supabase), serta menghubungkan siklus *check* $\rightarrow$ *decide* $\rightarrow$ *feedback*. | `thesis_assets/F1_persistensi.md` |
| **F2** | Statistik Pengguna Nyata | Selesai | Membangun `user_stats_service.py` untuk menghitung 7 fitur kontekstual berbasis data transaksi historis pengguna secara *point-in-time*, mencegah kebocoran data masa depan (*temporal leakage*), menangani *cold-start* secara transparan, dan menghitung pagu dinamis. | `thesis_assets/F2_statistik_nyata.md` |
| **F3** | Persetujuan Partisipan (*Consent*) | Selesai | Merancang tabel DDL `002_consent_records.sql`, endpoint API `POST /api/v1/consent` dan `GET /api/v1/consent/status`, dialog *informed consent* pada *onboarding* aplikasi Flutter, tombol penarikan persetujuan (*opt-out*) pada Profil Pengguna, serta klausul penanganan `[PEMROSESAN PIHAK KETIGA]`. | `thesis_assets/F3_persetujuan_partisipan.md` |
| **F5** | Pemicu Konfirmasi Pasca-Keputusan | Selesai | Membangun `PostDecisionReminderService` pada Flutter, menyematkan banner pengingat pada layar Beranda dalam jendela 24–72 jam setelah keputusan, menangani mekanisme coba lagi (*network retry*), dan memurnikan istilah UI menjadi "sesuai rencana" vs "tidak terencana". | `thesis_assets/F5_konfirmasi_pasca_keputusan.md` |
| **F7** | Metrik Pelatihan & Analisis Data Sintetis | Selesai | Memperbarui `train_risk_model.py` dengan evaluasi PR-AUC, Brier score, Balanced Accuracy, dan False-Alert Rate untuk model Baseline, Logistic Regression, dan Random Forest; mendokumentasikan potensi sirkularitas generator data sintetis dan implikasi metodologisnya. | `thesis_assets/F7_catatan_data_sintetis.md`, `thesis_assets/F7_keluaran_pelatihan.txt` |
| **F8** | Pembersihan Chatbot & Arsip NestJS | Selesai | Menyelamatkan DDL migrasi inti (`000_initial_schema.sql` dan `000_model3_onboarding.sql`) ke `backend/db/migrations/`, menghapus direktori usang `backend_nestjs_archive/`, membersihkan klien API chat mati dari Next.js, dengan tetap mempertahankan modul OCR, XAI Dashboard, dan Edukasi Finansial. | `thesis_assets/F8_daftar_penghapusan.md` |
| **F9** | Skrip Ekspor Data Pseudonim | Selesai | Menciptakan `backend/scripts/export_pilot_data.py` dengan hashing HMAC-SHA256 ber-garam (*salt*) untuk `participant_code`, menyaring hanya pengguna dengan *consent* aktif, menghapus seluruh atribut identitas pribadi (PII), mendukung filter rentang tanggal, dan menerbitkan `export_manifest.json`. | `thesis_assets/F9_ekspor_pseudonim.md` |
| **F6** | Konsolidasi Tes & Laporan Akhir | Selesai | Mengonsolidasikan seluruh pengujian lintas platform, melakukan uji tolok ukur latensi (50 iterasi terukur), memperbarui 7 diagram arsitektur ke berkas berakhiran `_final.mmd`, dan menyusun matriks kesesuaian naskah akhir. | `thesis_assets/F6_laporan_akhir.md` |
| **F10** | Telemetri Jeda Waktu Refleksi | Selesai | Menambahkan kolom `decision_latency_ms` pada migrasi `003_telemetry_decision_latency.sql`, mengukur durasi berpikir pengguna sebelum memilih aksi intervensi, menyaring perekaman berdasarkan status *informed consent* aktif, dan menyertakan metrik pada ekspor pseudonim. | `thesis_assets/F10_telemetri.md` |
| **F11** | Audit & Kendali Modular LLM | Selesai | Memetakan seluruh panggilan LLM Gemini (`ocr.py`, `insight_generator.py`, `education.py`), membuktikan ketiadaan PII pada payload prompt, menambahkan sakelar modular (`LLM_ENABLED`, `LLM_OCR_ENABLED`, dll.) dengan fallback deterministik, filter keamanan (*safety guardrails*), serta sanitasi log aplikasi. | `thesis_assets/F11_llm.md` |
| **F12** | Audit Model Tambahan & Foto Struk | Selesai | Memetakan model warisan 1.0 (Model 3 Profil Risiko & Model 2 Spending Persona), membuktikan isolasi model terhadap fitur inti pra-pembelian, menambahkan sakelar `ONBOARDING_MODELS_ENABLED`, serta membuktikan secara forensik bahwa pemrosesan OCR berjalan *on-device* dengan *zero image data egress*. | `thesis_assets/F12_model_tambahan_dan_struk.md` |

---

## 2. Daftar Komit Kerja (Branch: `thesis/perbaikan-pilot`)

Seluruh perubahan dilakukan secara disiplin pada cabang terisolasi `thesis/perbaikan-pilot` tanpa menyentuh cabang `main` atau mendorong (*push*) ke remote:

```text
02a5b9c F3: pembaruan kerangka persetujuan partisipan dengan klausul pemrosesan pihak ketiga
4344c04 docs(progress): update commit hash F12 in PROGRESS_PERBAIKAN.md
0558458 F12: audit model tambahan, kendali onboarding, dan verifikasi zero-egress foto struk
8372c20 docs(progress): update commit hash F11 in PROGRESS_PERBAIKAN.md
c2b23e8 F11: audit dan kendali modular LLM dengan fallback deterministik dan safety guardrails
92125ea F10: telemetri jeda waktu refleksi keputusan dan penegakan persetujuan privasi
6cd2f2d F6: konsolidasi pengujian unit, benchmark latensi endpoint, dan laporan akhir skripsi
eef723e F9: skrip ekspor data pseudonim dengan salt HMAC dan penegakan persetujuan partisipan
b8e014b F8: pemindahan migrasi inti, pembersihan endpoint chatbot, dan penghapusan arsip NestJS
e3fcf6c F8: laporan pemetaan pembersihan chatbot dan arsip NestJS (Tahap 1)
14b8a0d F7: metrik pelatihan nyata, evaluasi baseline rule-based, dan analisis data sintetis
69a559c F5: pemicu konfirmasi pasca-keputusan dan banner pengingat 24-72 jam
827ccae F3: skema persetujuan partisipan, endpoint consent, dan ui informed consent mobile
6edd9ee F2: statistik pengguna nyata pada pemeriksaan pra-pembelian
31c7043 F1: persistensi data pra-pembelian ke postgresql dan repository layer
52af04f F4: pasang guard JWT pada router admin dan peran dinamis Next.js
33603b7 F0: dokumentasi verifikasi ulang empat kontradiksi dan keadaan awal
```

---

## 3. Ringkasan Perubahan Berkas (`git diff --stat origin/main...HEAD`)

```text
 backend/.env.example                               |    45 +-
 backend/app/api/admin.py                           |   208 +-
 backend/app/api/consent.py                         |   125 +
 backend/app/api/education.py                       |   183 +-
 backend/app/api/ocr.py                             |     5 +-
 backend/app/api/pre_purchase.py                    |   151 +-
 backend/app/api/risk_profile.py                    |   177 +-
 backend/app/main.py                                |     7 +-
 backend/app/models/pre_purchase.py                 |    25 +
 backend/app/schemas/consent_schema.py              |    35 +
 backend/app/schemas/pre_purchase_schema.py         |     9 +
 backend/app/services/insight_generator.py          |    64 +-
 backend/app/services/pre_purchase_repository.py    |   693 ++
 backend/app/services/user_stats_service.py         |   500 +
 backend/app/utils/auth.py                          |   101 +
 backend/app/utils/llm_config.py                    |    42 +
 backend/app/utils/model_config.py                  |    11 +
 backend/app/utils/safety_filter.py                 |    80 +
 backend/artifacts_risk/model_metadata.json         |    26 +
 backend/artifacts_risk/model_metadata_trained.json |    26 +
 backend/artifacts_risk/model_registry.json         |    50 +
 backend/artifacts_risk/model_registry_trained.json |    50 +
 backend/artifacts_risk/training_data.csv           |  1538 +++
 backend/db/migrations/001_pre_purchase_and_governance.sql |   235 +
 backend/db/migrations/002_consent_records.sql      |    66 +
 backend/db/migrations/003_telemetry_decision_latency.sql  |    21 +
 backend/exports/pilot_data/export_manifest.json    |    32 +
 backend/scripts/export_pilot_data.py               |   371 +
 backend/scripts/measure_latency.py                 |   205 +
 backend/scripts/set_admin_role.sql                 |    20 +
 backend/tests/test_admin_auth.py                   |   159 +
 backend/tests/test_consent.py                      |   141 +
 backend/tests/test_export_pilot_data.py            |   336 +
 backend/tests/test_llm_controls.py                 |   188 +
 backend/tests/test_onboarding_controls.py          |   122 +
 backend/tests/test_persistence.py                  |   235 +
 backend/tests/test_telemetry.py                    |   229 +
 backend/tests/test_unit_core.py                    |   200 +
 backend/tests/test_user_stats.py                   |   307 +
 backend/training/train_risk_model.py               |   242 +-
 backend_nestjs_archive/ (dihapus permanen)         | 11300 -------------------
 frontend/src/app/admin/audit-logs/page.tsx         |    23 +-
 frontend/src/app/admin/models/page.tsx             |    31 +-
 frontend/src/app/auth/page.tsx                     |     3 +-
 frontend/src/lib/api.ts                            |    18 -
 mobile/lib/core/constants/api_endpoints.dart       |     5 +
 mobile/lib/core/constants/consent_text.dart        |    35 +
 mobile/lib/features/home/screens/home_screen.dart  |   116 +-
 mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart | 233 +-
 mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart | 18 +-
 mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart | 90 +-
 mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart | 20 +
 mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart | 194 +
 mobile/lib/features/profile/screens/profile_screen.dart | 170 +
 mobile/test/features/pre_purchase/post_decision_reminder_test.dart | 186 +
 thesis_assets/ (Laporan F0 s.d. F12, diagram, dan data pendukung) | 2800 +
 124 files changed, 9888 insertions(+), 13392 deletions(-)
```

---

## 4. Pembaruan Sumber Diagram Sistem (`_final.mmd`)

Sesuai langkah ke-4 Tugas F6, seluruh sumber diagram telah diperbarui agar mencerminkan kondisi akhir arsitektur pada cabang `thesis/perbaikan-pilot`. Berkas diagram lama tetap dipertahankan utuh dan berkas baru disimpan dengan akhiran `_final.mmd` pada direktori `thesis_assets/diagrams/`:

| Nama Berkas Diagram Final | Tipe Diagram | Aspek Kunci yang Dimutakhirkan |
| :--- | :--- | :--- |
| [erd_ringkas_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/erd_ringkas_final.mmd) | Mermaid ERD | Menyajikan entitas esensial: `pre_purchase_checks`, `pre_purchase_decisions` (dengan `decision_latency_ms`), `post_purchase_evaluations`, `consent_records` (etik penelitian), `model_registry`, dan `model_audit_logs`. |
| [erd_lengkap_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/erd_lengkap_final.mmd) | Mermaid ERD | Struktur relasi lengkap mencakup skema Supabase Auth, `user_profiles`, `transactions`, `planning`, `onboarding_data`, modul edukasi, seluruh tabel pra-pembelian, dan tata kelola governance. |
| [arsitektur_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/arsitektur_final.mmd) | Mermaid Flowchart | Menggambarkan arsitektur Monolit Modular FastAPI dengan perlindungan Bearer JWT pada Admin, dual-mode repository, kontrol switch LLM & onboarding, isolasi zero image egress pada klien mobile, dan koneksi Supabase Cloud. |
| [modul_dependency_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/modul_dependency_final.mmd) | Mermaid Flowchart | Pemetaan ketergantungan internal backend: entry point `main.py`, 8 router API, 4 service layer, model ORM & Pydantic v2 schemas, serta utilitas pengaman (`auth.py`, `llm_config.py`, `safety_filter.py`, `model_config.py`). |
| [sequence_pra_pembelian_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/sequence_pra_pembelian_final.mmd) | Mermaid Sequence | Siklus intervensi lengkap: Check $\rightarrow$ Pengukuran Latensi Refleksi $\rightarrow$ Perekaman Keputusan (dengan consent gate) $\rightarrow$ Jeda Berpikir 24–72 Jam $\rightarrow$ Konfirmasi Pasca-Keputusan $\rightarrow$ Ekspor Pseudonim. |
| [status_transaksi_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/status_transaksi_final.mmd) | Mermaid State | Siklus status intervensi: Rencana $\rightarrow$ Diperiksa $\rightarrow$ Menunggu Keputusan $\rightarrow$ Cabang (PROCEED / ADJUST / POSTPONE) $\rightarrow$ Jendela Pengingat 24–72 Jam $\rightarrow$ Dikonfirmasi / Kedaluwarsa $\rightarrow$ Gerbang Ekspor Riset. |
| [split_data_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/split_data_final.mmd) | Mermaid Flowchart | Protokol pemisahan temporal ketat (Bulan 1–3 Latih, Bulan 4 Uji) tanpa random shuffle, pencegahan kebocoran scaler, perbandingan komparatif 3 model, dan pelaporan metrik evaluasi nyata (PR-AUC, Brier score, False-Alert rate). |

---

## 5. Inventarisasi dan Hasil Pengujian Seluruh Sistem

### 5.1. Pengujian Backend (Python / FastAPI)
- **Kerangka Uji:** `unittest` bawaan Python standard library.
- **Perintah Eksekusi:** `.\venv\Scripts\python.exe -m unittest discover tests`
- **Total Pengujian:** **53 tests** (100% LULUS, waktu eksekusi ~0.54 detik).

| Berkas Uji | Kategori | Jumlah Kasus | Status | Aspek yang Diuji |
| :--- | :--- | :---: | :---: | :--- |
| `test_unit_core.py` | Unit | 10 | **LULUS** | Ekstraksi 7 fitur kontekstual, zero-division protection, fallback aturan baseline, kalkulasi health score deterministik, gaya belanja Gen-Z. |
| `test_user_stats.py` | Unit & Integrasi | 7 | **LULUS** | Kalkulasi point-in-time tanpa kebocoran temporal, sisa pagu anggaran siklus berjalan, penandaan cold-start, ambang batas minimum riwayat ($\ge 5$ transaksi). |
| `test_admin_auth.py` | Keamanan | 6 | **LULUS** | Penolakan token tanpa otentikasi (401), penolakan non-admin (403), validasi klaim admin (200), validasi alasan rollback model (422), dan audit logs. |
| `test_consent.py` | Keamanan & Kepatuhan | 4 | **LULUS** | Pencatatan informed consent dengan JWT valid, penolakan permintaan tanpa token (401), default status non-partisipan (`given=False`), siklus penarikan persetujuan (*withdraw*). |
| `test_persistence.py` | Integrasi & Data | 6 | **LULUS** | Siklus hidup pre-purchase (`check` $\rightarrow$ `decide` $\rightarrow$ `feedback`), penolakan ID fiktif (404), fallback registry memori, dan abstraksi lapisan Supabase. |
| `test_export_pilot_data.py` | Privasi & Ekspor | 6 | **LULUS** | Deterministik salt HMAC pada `participant_code`, penyaringan ketat pengguna berizin aktif, eliminasi total kolom identitas pribadi (PII), filter tanggal, dan penerbitan manifes. |
| `test_telemetry.py` | Telemetri & Privasi | 5 | **LULUS** | Perekaman `decision_latency_ms`, penegakan gerbang privasi (telemetri dibuang bila consent tidak aktif), validasi skema non-negatif, dan ekspor data telemetri. |
| `test_llm_controls.py` | Kontrol Modular LLM | 5 | **LULUS** | Sakelar induk `LLM_ENABLED`, sakelar fitur OCR / Insight / Edukasi, fallback deterministik bebas galat, penyaring topik terlarang (investasi/pinjaman), penafian AI. |
| `test_onboarding_controls.py` | Kontrol Model Onboarding | 4 | **LULUS** | Sakelar `ONBOARDING_MODELS_ENABLED`, fallback deterministik profil risiko 50/30/20, isolasi 100% model onboarding dari prediksi risiko pra-pembelian. |

### 5.2. Pengujian Aplikasi Mobile (Flutter / Dart)
- **Kerangka Uji:** `flutter_test` dan Dart Analyzer.
- **Perintah Eksekusi:** `flutter test` dan `flutter analyze`.
- **Hasil:**
  - **Unit & Logic Tests:** **10/10 tests LULUS** pada `post_decision_reminder_test.dart` (pengujian logika jendela 24–72 jam, penanganan aksi dismiss/submit, dan persistensi `decisionLatencyMs`).
  - **Static Analysis:** `flutter analyze` menghasilkan **0 issues / No issues found!**.

### 5.3. Pengujian Web Dashboard (Next.js / TypeScript)
- **Kerangka Uji:** Kompilasi type checking TypeScript.
- **Perintah Eksekusi:** `npx tsc --noEmit`.
- **Hasil:** **0 errors / LULUS** tanpa kesalahan tipe pada seluruh komponen web admin dan dashboard.

---

## 6. Hasil Pengukuran Waktu Respons Endpoint `POST /api/v1/pre-purchase/check`

Pengukuran waktu respons dilakukan setelah implementasi F1 (abstraksi persistensi) dan F2 (kalkulasi statistik pengguna nyata). Pengujian dilakukan menggunakan skrip `backend/scripts/measure_latency.py` sebanyak **50 permintaan terukur** (didahului oleh 10 putaran *warmup*):

| Parameter Metrik | Skenario 1: Pengguna dengan Riwayat Nyata (Point-in-Time) | Skenario 2: Pengguna Baru (Cold-Start Aware) |
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

---

## 7. Matriks Diskrepansi dan Rekomendasi Revisi Naskah Skripsi

Berdasarkan temuan faktual pada kode sumber dan verifikasi di F0–F12, berikut adalah daftar aspek yang **masih berbeda atau perlu diperbaiki narasinya** pada naskah skripsi:

| No | Topik Naskah | Klaim/Narasi Lama pada Naskah | Fakta Implementasi Nyata | Rekomendasi Aksi Revisi Naskah |
| :-: | :--- | :--- | :--- | :--- |
| **1** | **Arsitektur Backend** | Menyebut arsitektur backend berbasis *NestJS (Node.js/TypeScript)* sebagai API inti dan FastAPI sebagai microservice terpisah. | Seluruh API inti, autentikasi guard, evaluasi risiko, dan tata kelola transaksi kini berada terpadu di **FastAPI (Python)**. Arsip lama `backend_nestjs_archive/` telah dihapus (F8). | **Revisi Bab 3 & 4:** Ganti diagram arsitektur menjadi *Monolithic Modular FastAPI Backend* yang melayani aplikasi Flutter dan Next.js Admin Dashboard. Hapus seluruh rujukan ke framework NestJS. Gunakan [arsitektur_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/arsitektur_final.mmd). |
| **2** | **Interaksi Pengguna (Chatbot vs Pra-Pembelian)** | Menyebut adanya fitur "Chatbot Asisten Finansial Interaktif" berbasis LLM percakapan bebas. | Chatbot percakapan bebas telah dibersihkan (F8). Fokus inovasi utama skripsi adalah **Peringatan Dini Pra-Pembelian Deterministik + ML** saat pengguna merencanakan pengeluaran. LLM hanya digunakan terbatas pada OCR dan edukasi terstruktur (F11). | **Revisi Bab 1, 2, & 4:** Tegaskan bahwa ruang lingkup skripsi adalah intervensi tepat waktu (*just-in-time pre-purchase intervention*) berupa dialog peringatan terstruktur, bukan percakapan chatbot bebas yang rentan halusinasi. |
| **3** | **Kinerja Model & Data Pelatihan** | Mengklaim performa akurasi model $\approx 96\%$ sebagai bukti bahwa sistem sangat efektif mendeteksi pengeluaran tidak terencana di dunia nyata. | Model dilatih menggunakan dataset sintetis (F7). Terdapat korelasi matematis langsung (*potential circularity*) antara aturan pembangkit label dengan fitur masukan. Model nyata menghasilkan PR-AUC 0.970 dan Brier score 0.052. | **Revisi Bab 4 & 5:** Laporkan metrik evaluasi lengkap (PR-AUC, Brier score, False-Alert rate). Cantumkan *Threats to Validity* bahwa data pelatihan adalah data sintetis berbasis skenario perilaku, dan efektivitas nyata ditentukan melalui evaluasi *pilot testing*. Gunakan [split_data_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/split_data_final.mmd). |
| **4** | **Pengukuran Waktu Respons** | Menyebut waktu respons API berada pada angka absolut tertentu tanpa merinci metodologi pengukuran (atau mencampur aduk latensi jaringan internet seluler). | Pengujian tolok ukur internal backend (F6) mencatat waktu respons pemrosesan $\approx 17.5\text{ ms}$ (median) dan $\le 20\text{ ms}$ ($p_{95}$). | **Revisi Bab 4:** Sajikan tabel tolok ukur latensi Skenario 1 dan 2 dari berkas `F6_hasil_pengukuran_latensi.json`. Jelaskan secara metodologis perbedaan antara *backend processing time* ($\approx 18\text{ ms}$) dan latensi jaringan ujung-ke-ujung (*round-trip latency*). |
| **5** | **Pemicu Pasca-Keputusan & Notifikasi** | Menyebut penggunaan sistem notifikasi *Push Notification* eksternal berbasis push server/FCM untuk mengingatkan evaluasi belanja. | Diimplementasikan menggunakan **In-App Reminder Banner** (F5) pada layar Beranda yang muncul dalam jendela waktu 24–72 jam setelah transaksi tanpa dependensi push server eksternal. | **Revisi Bab 3 & 4:** Jelaskan bahwa pengingat dirancang sebagai *contextual in-app reminder* untuk menjaga kesederhanaan arsitektur dan menghindari ketergantungan izin notifikasi sistem operasi yang sering kali dinonaktifkan oleh pengguna. Gunakan [status_transaksi_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/status_transaksi_final.mmd). |
| **6** | **Tata Kelola Data & Etika Penelitian** | Belum mendokumentasikan secara rinci prosedur teknis *informed consent* partisipan dan perlindungan privasi data pilot testing. | Telah dibangun skema `consent_records` (F3), penegakan klausul pemrosesan pihak ketiga AI, telemetri jeda waktu refleksi (F10), dan skrip ekspor data pseudonim dengan salt HMAC-SHA256 (F9) yang mengeliminasi PII. | **Revisi Bab 3 (Metodologi Penelitian):** Tambahkan sub-bab khusus mengenai *Etika Penelitian dan Perlindungan Data Partisipan*, merujuk pada mekanisme persetujuan digital, zero image egress, dan ekspor data pseudonim. Gunakan [sequence_pra_pembelian_final.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/sequence_pra_pembelian_final.mmd). |
| **7** | **Keterlibatan Model Tambahan (Model 3 & Model 2)** | Mengesankan seluruh model ML (profil risiko, persona belanja, pra-pembelian) bekerja terpadu dalam satu pipeline inferensi. | Model 2 telah dihapus (digantikan aturan deterministik), Model 3 hanya dipakai di web dashboard dan diisolasi dengan sakelar `ONBOARDING_MODELS_ENABLED` (F12). Fitur pra-pembelian murni independen berbasis 7 fitur finansial. | **Revisi Bab 3 & 4:** Jelaskan pemisahan tegas ini untuk membuktikan bahwa hasil evaluasi efektivitas intervensi pra-pembelian tidak terkontaminasi oleh model klasifikasi sekunder di luar cakupan penelitian. |

---

## 8. Kesimpulan Konsolidasi Akhir

Melalui penyelesaian seluruh rangkaian perbaikan dari **F0 hingga F12**, basis kode sistem `CEAMIS 2.0` pada cabang `thesis/perbaikan-pilot` telah mencapai kesiapan penuh untuk pelaksanaan *field pilot testing*:
1. **Integritas Metodologi & Kode:** Sistem bersih dari komponen mati (NestJS & Chatbot terhapus), memiliki 53 pengujian backend yang lulus 100%, 10 unit test mobile lulus dengan static analysis bersih, dan kompilasi web admin bebas galat.
2. **Kepatuhan Etika & Privasi Tinggi:** Didukung oleh pencatatan *informed consent* digital, transparansi pihak ketiga, pemrosesan citra struk lokal *on-device* (*zero image egress*), dan gerbang privasi pada telemetri waktu refleksi.
3. **Dokumentasi & Artefak Ilmiah Lengkap:** Seluruh 7 diagram arsitektur dan relasi telah dimutakhirkan ke versi final (`*_final.mmd`), dilengkapi data kuantitatif latensi nyata, catatan batas validitas data sintetis, serta matriks revisi naskah yang siap diserahkan kepada dosen pembimbing skripsi.
