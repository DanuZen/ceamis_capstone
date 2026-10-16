# Laporan Koreksi Laporan Akhir F6 (Tugas G2)

Dokumen ini memuat koreksi faktual dan metodologis terhadap laporan akhir konsolidasi [thesis_assets/F6_laporan_akhir.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md), mencakup perbaikan ringkasan tugas F0, evaluasi klaim sumber naskah pada Bagian 7, pemisahan metrik evaluasi model, serta peninjauan ulang klaim kesiapan pilot.

---

## 1. Koreksi Bagian 1 Baris F0 (Ringkasan Tugas F0)

### Kondisi Keliru pada Laporan F6:
Pada berkas [thesis_assets/F6_laporan_akhir.md:14](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md#L14), baris F0 tertulis:
> *"Memverifikasi ketidaksesuaian antara naskah dan basis kode pada 4 area: arsitektur NestJS vs FastAPI, klaim chatbot LLM vs sistem aturan/ML, kinerja model sintetis vs nyata, serta klaim waktu respons vs persistensi in-memory."*

### Fakta Sumber Verifikasi F0:
Berdasarkan dokumen primer verifikasi awal [thesis_assets/F0_verifikasi_ulang.md:10-20](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F0_verifikasi_ulang.md#L10-L20), empat isu kontradiksi yang sebenarnya diverifikasi pada F0 adalah:
1. **Keberadaan dan Aktivitas Fitur Chatbot:** Memverifikasi ketiadaan `backend/app/api/chatbot.py`, status nonaktif router chatbot di FastAPI, dan ketiadaan pemanggilan chatbot di klien mobile.
2. **Perekaman Persetujuan Partisipan (*Consent*):** Memverifikasi ketiadaan kolom `consent_given` dan `consent_date` pada skema basis data, model ORM, dan layar profil mobile.
3. **Pengaman JWT dan RBAC pada Endpoint Admin:** Memverifikasi ketiadaan dependensi autentikasi JWT pada endpoint `/api/v1/admin/*` di FastAPI, serta pemeriksaan peran admin berbasis email hardcoded di Next.js.
4. **Asal Metrik Model ML pada Registri dan Admin API:** Memverifikasi bahwa metrik evaluasi model pada `admin.py` ditulis secara manual (*hardcoded*) dan bukan berasal dari registri pipeline pelatihan.

### Versi Koreksi yang Benar untuk Tabel Bagian 1:
| Kode | Nama Tugas | Status | Ringkasan Tindakan yang Benar | Berkas Bukti Utama |
| :--- | :--- | :---: | :--- | :--- |
| **F0** | Verifikasi 4 Kontradiksi Awal | Selesai | Memverifikasi kondisi aktual kode terhadap 4 kontradiksi laporan sebelumnya: membuktikan chatbot nonaktif di backend, membuktikan belum adanya kolom persetujuan (*consent*), membuktikan ketiadaan guard JWT pada API admin, serta membuktikan bahwa metrik evaluasi model di `admin.py` berstatus ditulis manual (*hardcoded*). | [thesis_assets/F0_verifikasi_ulang.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F0_verifikasi_ulang.md) |

---

## 2. Pemeriksaan Klaim Naskah dan Penggantian Bagian 7

### Evaluasi Klaim Sumber Naskah:
Bagian 7 [thesis_assets/F6_laporan_akhir.md:187-200](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md#L187-L200) memuat kolom *"Klaim/Narasi Lama pada Naskah"*. Karena naskah Tugas Akhir fisik tidak tersedia di dalam repositori, seluruh klaim diperiksa silang terhadap dokumen laporan proyek yang ada (P1 s.d. P7, F0 s.d. F12):

1. **Klaim NestJS sebagai API inti:**
   - Status: **ADA di dokumen proyek.**
   - Sumber: Laporan P3 [12_use_case_dan_peta_fr.md:45](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P3/12_use_case_dan_peta_fr.md#L45) dan P4 [13_arsitektur_dan_nfr.md:143](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P4/13_arsitektur_dan_nfr.md#L143) secara eksplisit mencatat modul anggaran dan skema migrasi masih merujuk pada direktori arsip `backend_nestjs_archive/`.
2. **Klaim Chatbot Asisten Finansial Interaktif:**
   - Status: **ADA di dokumen proyek.**
   - Sumber: Laporan P3 [12_use_case_dan_peta_fr.md:110-112](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P3/12_use_case_dan_peta_fr.md#L110-L112) dan P4 [13_arsitektur_dan_nfr.md:22](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P4/13_arsitektur_dan_nfr.md#L22) secara keliru mengklaim endpoint `POST /api/v1/chatbot/chat` aktif melayani interaksi pengguna.
3. **Klaim Akurasi Model Sekitar 96%:**
   - Status: **TIDAK ADA SUMBER pada dokumen P1 s.d. P7.**
   - Sumber Nyata: Dokumen P6 [15_model_dan_data.md:122-141](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P6/15_model_dan_data.md#L122-L141) dan P7 [16_pengujian_dan_field_pilot.md:16](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P7/16_pengujian_dan_field_pilot.md#L16) mencatat angka Random Forest Precision 81.20%, Recall 74.50%, F1 77.71%, ROC-AUC 83.50%. Angka 0.96 (96%) murni merupakan nilai precision kelas "Safe" pada laporan klasifikasi RF di `F0_keluaran_pelatihan.txt:61` dan `F7_keluaran_pelatihan.txt:89`, bukan akurasi keseluruhan sistem.
4. **Klaim Notifikasi Push Server / FCM:**
   - Status: **TIDAK ADA SUMBER pada dokumen P1 s.d. P7.**
   - Sumber Nyata: Istilah FCM tidak ditemukan di dokumen P1–P7. Dokumen F5 [F5_konfirmasi_pasca_keputusan.md:6](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F5_konfirmasi_pasca_keputusan.md#L6) hanya menyatakan bahwa implementasi pengingat sengaja tidak memakai push notification lokal eksternal dan memilih *in-app banner*.
5. **Klaim Pengukuran Waktu Respons API:**
   - Status: **ADA di dokumen proyek.**
   - Sumber: Laporan P7 [16_pengujian_dan_field_pilot.md:23-42](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P7/16_pengujian_dan_field_pilot.md#L23-L42) melaporkan pengujian 35 iterasi dengan rata-rata 4.38 ms.
6. **Klaim Persetujuan Partisipan (*Consent*) Sudah Ada:**
   - Status: **ADA di dokumen proyek.**
   - Sumber: Laporan P1 [02_kesesuaian_naskah.md:66](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P1/02_kesesuaian_naskah.md#L66) dan P7 [16_pengujian_dan_field_pilot.md:69](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P7/16_pengujian_dan_field_pilot.md#L69) keliru mengklaim bahwa kolom `consent_given` sudah tersedia di Supabase dan toggle profil sudah aktif.
7. **Klaim Penyatuan Seluruh Model ML (Model 1, 2, 3):**
   - Status: **ADA di dokumen proyek.**
   - Sumber: Laporan P6 [15_model_dan_data.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P6/15_model_dan_data.md) dan F12 [F12_model_tambahan_dan_struk.md:19-22](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F12_model_tambahan_dan_struk.md#L19-L22).

---

### Penggantian Tabel Bagian 7: Matriks Perbedaan Laporan Lama vs Kondisi Akhir Kode

Tabel berikut menggantikan matriks Bagian 7 lama dengan menyajikan perbandingan faktual antardokumen laporan terdahulu terhadap kondisi final kode di cabang `thesis/perbaikan-pilot`:

| No | Komponen / Isu | Klaim pada Dokumen Terdahulu (P1–P7 / Draf Awal) | Status Sumber Dokumen | Kondisi Faktual Akhir di Kode | Bukti Path:Baris Kode |
| :-: | :--- | :--- | :---: | :--- | :--- |
| **1** | **Kerangka Kerja Backend Utama** | NestJS sebagai backend utama dan FastAPI sebagai microservice AI ([12_use_case:45](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P3/12_use_case_dan_peta_fr.md#L45)). | ADA di P3, P4 | Seluruh API operasional disatukan di **FastAPI (Python)** monolit modular. Direktori `backend_nestjs_archive/` telah dihapus total pada commit `b8e014b` (F8). | [backend/app/main.py:1-110](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/main.py#L1-L110) |
| **2** | **Fitur Chatbot Percakapan Bebas** | Chatbot asisten finansial interaktif aktif di `POST /api/v1/chatbot/chat` ([12_use_case:110](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P3/12_use_case_dan_peta_fr.md#L110)). | ADA di P3, P4 | **TIDAK ADA.** Fitur chatbot percakapan bebas tidak pernah diimplementasikan pada FastAPI dan telah dibersihkan dari frontend (F8). Intervensi berfokus pada dialog peringatan pra-pembelian terstruktur. | [backend/app/api/](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/) (tidak ada `chatbot.py`), [frontend/src/lib/api.ts:1-20](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/lib/api.ts#L1-L20) |
| **3** | **Persetujuan Partisipan (*Consent*)** | Kolom `consent_given` dan toggle profil sudah aktif di database dan UI ([02_kesesuaian:66](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P1/02_kesesuaian_naskah.md#L66)). | ADA di P1, P7 | Awalnya tidak ada di skema SQL (F0). Telah ditambahkan melalui migrasi `002_consent_records.sql`, endpoint `POST /api/v1/consent`, dan dialog persetujuan mobile (F3). | [backend/db/migrations/002_consent_records.sql:1-40](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/002_consent_records.sql#L1-L40), [backend/app/api/consent.py:1-125](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/consent.py#L1-L125) |
| **4** | **Pengamanan Endpoint Admin** | Guard JWT admin dan inspeksi token lulus evaluasi keamanan ([16_pengujian:18](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/P7/16_pengujian_dan_field_pilot.md#L18)). | ADA di P7 | Awalnya endpoint FastAPI terbuka tanpa token (F0). Kini diproteksi dependensi `verify_admin_role` (F4). Namun antarmuka Next.js `/admin/*` belum memasang route guard di sisi frontend. | [backend/app/utils/auth.py:1-100](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/utils/auth.py#L1-L100), [backend/app/api/admin.py:75-150](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L75-L150) |
| **5** | **Fitur Model Pra-Pembelian** | Fitur terdiri dari `amount`, `category_enc`, `urgency_enc`, `monthly_income`, `current_savings`, `monthly_expenses`, `free_cash_flow` ([F12:48-54](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F12_model_tambahan_dan_struk.md#L48-L54)). | ADA di F12 (Keliru) | Fitur aktual yang benar adalah **7 fitur rasio kontekstual**: `amount_ratio_median`, `budget_remaining_ratio`, `category_frequency`, `day_of_week`, `days_to_reset`, `savings_impact`, `deviation_from_pattern`. | [backend/app/services/pre_purchase_risk.py:131-139](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L131-L139), [backend/training/train_risk_model.py:65-73](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L65-L73) |
| **6** | **Nama Tabel Database Finansial** | Menyebut adanya tabel `budgets`, `goals`, dan `users` pada layanan statistik ([user_stats_service.py:448, 465, 480](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L448)). | ADA di F2 | Tabel `budgets` dan `goals` **TIDAK ADA** pada skema SQL Supabase maupun Prisma. Pagu dicatat di `public.planning`, profil di `public.user_profiles`. Transaksi mobile belum terhubung ke basis data. | [backend/db/migrations/000_initial_schema.sql:13-237](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L13-L237), [frontend/prisma/schema.prisma:655-725](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L655-L725) |
| **7** | **Pemicu Pengingat Pasca-Keputusan** | Menggunakan sistem push notification FCM eksternal ([F6:197](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md#L197)). | TIDAK ADA SUMBER di P1–P7 | Diimplementasikan menggunakan **In-App Reminder Banner** pada layar Beranda mobile yang aktif dalam jendela 24–72 jam setelah transaksi tanpa server push eksternal (F5). | [mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart:1-190](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart#L1-L190) |
| **8** | **Pemrosesan Citra Struk OCR** | Model Gemini multimodal memproses gambar foto struk di server cloud ([F12:12](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F12_model_tambahan_dan_struk.md#L12)). | ADA di F12 (Narasi) | Pemrosesan citra berjalan 100% lokal *on-device* via Google ML Kit. Backend hanya menerima string teks mentah (`raw_text: str`) yang diparse oleh Gemini 2.0 Flash (*zero image egress*). | [backend/app/api/ocr.py:24-25, 137-185](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L24-L25), [mobile/lib/features/transaction/screens/add_transaction_screen.dart:173-195](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L173-L195) |

---

## 3. Koreksi Pencampuran Metrik Evaluasi Model

### Kesalahan pada Laporan F6:
Pada berkas [thesis_assets/F6_laporan_akhir.md:195](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md#L195), narasi menyatakan:
> *"Model nyata menghasilkan PR-AUC 0.970 dan Brier score 0.052."*

Pernyataan ini mencampuradukkan metrik dari dua model yang berbeda tanpa spesifikasi:
- Nilai **PR-AUC 0.9704** berasal dari model **RuleBasedBaseline**.
- Nilai **Brier score 0.0515** berasal dari model **RandomForestClassifier**.

### Metrik yang Benar Berdasarkan `F7_keluaran_pelatihan.txt`:
Berdasarkan log hasil eksekusi pelatihan resmi pada [thesis_assets/F7_keluaran_pelatihan.txt:100-103](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F7_keluaran_pelatihan.txt#L100-L103), metrik evaluasi pada data uji temporal (Bulan ke-4, $N = 367$) disajikan secara terpisah untuk setiap model:

| Model | Versi Registri | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Balanced Accuracy | False Alert Rate | Brier Score |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Baseline** | `v1.0.0-baseline` | 0.9481 | 0.8312 | 0.8858 | 0.9783 | **0.9704** | 0.8992 | 0.0329 | **0.1200** |
| **Logistic Regression** | `v1.0.0-logreg` | 0.8993 | 0.8117 | 0.8532 | 0.9253 | **0.9132** | 0.8730 | 0.0657 | **0.0922** |
| **Random Forest (Model Terpilih)** | `v1.1.0-rf` | 0.9295 | 0.9416 | 0.9355 | 0.9790 | **0.9759** | 0.9450 | 0.0516 | **0.0515** |

### Narasi Koreksi:
Untuk model terpilih yang diterapkan pada sistem produksi (*Random Forest v1.1.0-rf*), nilai metrik yang benar adalah **PR-AUC sebesar 0,9759** dan **Brier Score sebesar 0,0515**. Nilai PR-AUC 0,9704 adalah performa Baseline Aturan, yang memiliki Brier Score sebesar 0,1200.

---

## 4. Peninjauan Ulang Pernyataan "Kesiapan Penuh untuk Pilot"

### Masalah pada Klaim Laporan F6:
Pada [thesis_assets/F6_laporan_akhir.md:6, 203-209](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_laporan_akhir.md#L6), laporan mengklaim bahwa sistem telah mencapai *"kesiapan penuh untuk pelaksanaan field pilot testing"*.

Klaim ini **TIDAK AKURAT** dan menyembunyikan risiko operasional nyata yang ditemukan pada verifikasi lanjutan G1:
1. **Ketidakcocokan Skema Layanan Statistik (G1.1):** Layanan `user_stats_service.py` kueri ke endpoint `/rest/v1/budgets`, `/rest/v1/goals`, dan `/rest/v1/users` yang tidak ada pada skema basis data PostgreSQL Supabase. Pada basis data nyata dengan `PERSISTENCE_BACKEND=db`, kueri tersebut akan gagal dan menyebabkan sistem terus-menerus jatuh ke nilai fallback cold-start.
2. **Ketiadaan Transmisi Data Transaksi Mobile (G1.1):** Aplikasi mobile saat ini tidak pernah menulis data transaksi riil maupun perencanaan anggaran ke Supabase (masih mengandalkan Riverpod state lokal dan penanganan *try-catch* tanpa transmisi ke basis data).
3. **Celah Keamanan Rute Web & Pengaman Admin (G1.2, G1.3):** Seluruh halaman web `/admin/*` dapat diakses dan dimanipulasi secara publik tanpa proteksi peran atau login. Sebanyak 10 rute dasbor pengguna di `/dashboard/*` dapat dibuka bebas tanpa kredensial via `GuestProvider`.
4. **Saran Investasi di Luar Batasan Riset (G1.3):** Halaman `/dashboard/planning` menampilkan saran instrumen investasi (emas, saham, obligasi, kripto) yang berisiko mencemari validitas intervensi pengeluaran tidak terencana.
5. **Ketergantungan Pengujian In-Memory:** Seluruh 53 pengujian backend sejauh ini dieksekusi di atas mode memori tiruan (*in-memory mock*), belum pernah diuji secara terintegrasi di atas basis data PostgreSQL Supabase nyata dengan aturan RLS aktif.

### Rumusan Ulang: Kesiapan Bersyarat (*Conditional Pilot Readiness*)
Pernyataan kesiapan sistem harus ditulis ulang menjadi **Kesiapan Bersyarat**, dengan prasyarat manual yang wajib diselesaikan sebelum uji coba lapangan dimulai:
1. Menjalankan penyesuaian skema SQL migrasi agar tabel dan kolom yang dibaca oleh layanan statistik cocok dengan skema PostgreSQL nyata.
2. Mengubah default lingkungan backend menjadi `PERSISTENCE_BACKEND=db` dan memverifikasi koneksi Supabase secara langsung.
3. Memasang guard autentikasi dan peran admin pada Next.js (`/admin/*`) agar data pengguna tidak terekspos ke publik.
4. Menonaktifkan atau mengisolasi rute web perencanaan investasi agar tidak menjadi variabel perancu (*confounder*) bagi partisipan penelitian.
5. Mengisi teks persetujuan penelitian dengan identitas formal peneliti dan dosen pembimbing sebelum aplikasi dipasang di perangkat partisipan.
