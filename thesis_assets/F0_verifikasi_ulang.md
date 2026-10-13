# Laporan Verifikasi Ulang Empat Kontradiksi dan Keadaan Awal (F0)

**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Cabang Asal:** `main`  
**Hash Commit Awal:** `d004402df3495429d2b63595ec375a88cf7f9f07`  
**Tanggal Verifikasi:** 13 Oktober 2026  

---

## 1. Verifikasi Ulang Empat Kontradiksi Antarlaporan

Berikut adalah hasil investigasi kode sumber aktual terhadap empat isu yang saling bertentangan pada laporan-laporan audit dan naskah sebelumnya:

| No | Klaim yang Diverifikasi | Laporan Sebelumnya yang Menyebut | Kondisi Sebenarnya di Repositori | Bukti Path:Baris | Status |
|:---|:---|:---|:---|:---|:---|
| **a** | **Keberadaan dan Aktivitas Fitur Chatbot**<br>Apakah `backend/app/api/chatbot.py` ada, router terdaftar di `backend/app/main.py`, endpoint `POST /api/v1/chatbot/chat` aktif, dan dipanggil mobile/web? | - `12_use_case_dan_peta_fr.md:110-112` dan `13_arsitektur_dan_nfr.md:22` menyatakan chatbot ada dan aktif di `POST /api/v1/chatbot/chat`.<br>- Bertentangan dengan `02_kesesuaian_naskah.md:17` yang menyatakan chatbot sudah dihapus dari kode aktif dan router. | 1. Berkas `backend/app/api/chatbot.py` **TIDAK ADA** di direktori backend.<br>2. Pada `backend/app/main.py`, modul chatbot tidak diimpor dan tidak didaftarkan ke FastAPI router.<br>3. Endpoint `POST /api/v1/chatbot/chat` **TIDAK AKTIF**.<br>4. Aplikasi mobile tidak memuat pemanggilan chatbot sama sekali (0 temuan).<br>5. Pada web (`frontend/src/lib/api.ts:120-124`), terdapat fungsi mati `aiApi.chat` (`/ai/chat`) yang tidak pernah dipanggil di antarmuka manapun. Teks chatbot pada frontend hanya sisa promosi statis landing page dan i18n. | - [backend/app/api/](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/) (tidak ada `chatbot.py`)<br>- [backend/app/main.py:16-20, 92-105](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L16-L20)<br>- [frontend/src/lib/api.ts:120-124](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/lib/api.ts#L120-L124)<br>- [mobile/lib/](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/) (0 temuan) | **TERBUKTI** bahwa klaim `02_kesesuaian_naskah.md` benar (chatbot nonaktif di backend), sedangkan klaim `12_use_case` dan `13_arsitektur` keliru |
| **b** | **Perekaman Persetujuan Partisipan (*Consent*)**<br>Apakah kolom `consent_given` atau `consent_date` benar-benar ada di skema database, model ORM, dan layar profil mobile? | - `02_kesesuaian_naskah.md:66` dan `01_laporan_halaman.md:25` mengklaim kolom `consent_given` dan `consent_date` sudah tersedia dan ada toggle di profil.<br>- Bertentangan dengan `11_erd_dan_kamus_data.md:39, 290-293` dan `12_use_case_dan_peta_fr.md:41, 120` yang menyatakan tabel `consent_records` dan form persetujuan belum diimplementasikan. | 1. Kolom `consent_given` dan `consent_date` **TIDAK DITEMUKAN** di `frontend/prisma/schema.prisma` (0 temuan).<br>2. Tidak ditemukan pada migrasi SQL manapun.<br>3. Tidak ada model ORM untuk consent di `backend/app/models/`.<br>4. Pada `profile_screen.dart`, tidak ada toggle persetujuan riset maupun pseudonimisasi. Yang ada hanyalah dua toggle state lokal Flutter di memori (`_budgetAlertEnabled` dan `_aiRiskCheckEnabled`) tanpa persistensi ke server/database. | - [frontend/prisma/schema.prisma:1-813](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma)<br>- [backend/app/models/pre_purchase.py:45-175](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L45-L175)<br>- [mobile/lib/features/profile/screens/profile_screen.dart:422-451](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L422-L451) | **TIDAK TERBUKTI** (Klaim `02_kesesuaian_naskah.md` dan `01_laporan_halaman.md` tidak sesuai fakta; laporan `11_erd` dan `12_use_case` yang menyatakan belum diimplementasikan terbukti akurat) |
| **c** | **Pengaman JWT dan RBAC pada Endpoint Admin**<br>Apakah endpoint `/api/v1/admin/*` memiliki dependensi verifikasi JWT/peran, dan bagaimana peran admin ditentukan di Next.js? | - `16_pengujian_dan_field_pilot.md:18` mengklaim proteksi admin guard dan inspeksi token JWT lulus.<br>- Bertentangan dengan `13_arsitektur_dan_nfr.md:143` yang mencatat guard JWT FastAPI belum dipasang dan peran di Next.js memakai hardcoded email. | 1. Seluruh endpoint di `backend/app/api/admin.py` (`/admin/models`, `/admin/models/rollback`, `/admin/audit-logs`) **TIDAK MEMILIKI dependensi keamanan** (`Depends()` tidak dipakai, tidak ada validasi Bearer JWT, dan tidak ada pemeriksaan peran). Siapapun dapat mengakses tanpa token.<br>2. Di Next.js, peran admin ditentukan melalui `user_metadata.role` atau fallback jika email pengguna cocok dengan surel yang ditulis langsung (`admin@ceamis.com` atau `admin@ceamis.id`), lalu disimpan ke `localStorage`.<br>3. Layout admin (`frontend/src/app/admin/layout.tsx`) tidak melakukan proteksi rute terhadap peran pengguna. | - [backend/app/api/admin.py:75-91, 98-146, 152-263](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L75-L91)<br>- [backend/app/main.py:96](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L96)<br>- [frontend/src/app/auth/page.tsx:51-54](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/auth/page.tsx#L51-L54)<br>- [frontend/src/app/admin/layout.tsx:1-27](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/layout.tsx#L1-L27) | **SEBAGIAN** (Klaim `16_pengujian` bahwa guard JWT aktif terbukti keliru; laporan `13_arsitektur` bahwa guard JWT belum ada dan surel di-hardcode terbukti akurat) |
| **d** | **Asal Metrik Model ML pada Registri dan Admin API**<br>Apakah nilai Precision, Recall, F1, dan ROC-AUC di `admin.py` dihasilkan oleh `train_risk_model.py` atau ditulis langsung? | - `15_model_dan_data.md:122-141` dan `16_pengujian_dan_field_pilot.md:16` mencatat RF Precision 81.20%, Recall 74.50%, F1 77.71%, ROC-AUC 83.50% dan menyebut angka berasal dari registri model. | 1. Berkas `backend/artifacts_risk/model_registry.json` **TIDAK DITEMUKAN** di repositori sebelum pengujian lokal dijalankan.<br>2. Seluruh metrik pada `backend/app/api/admin.py:36-61` ditulis secara langsung (*hardcoded*) di dalam kode fungsi fallback `_load_model_registry()`.<br>3. Eksekusi lokal skrip `backend/training/train_risk_model.py` menghasilkan data metrik riil: LogReg (F1: 0.8532, ROC-AUC: 0.9253) dan Random Forest (Precision: 0.9295, Recall: 0.9416, F1: 0.9355, ROC-AUC: 0.9790). Angka riil ini **berbeda signifikan** dari angka yang tercantum di `admin.py` dan naskah. | - [backend/app/api/admin.py:36-61](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L36-L61)<br>- [backend/training/train_risk_model.py:284-314, 384-403](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L284-L314)<br>- [thesis_assets/F0_keluaran_pelatihan.txt:1-76](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/F0_keluaran_pelatihan.txt) | **TIDAK TERBUKTI** bahwa angka di `admin.py` berasal dari pipeline pelatihan; **TERBUKTI** bahwa angka di `admin.py` ditulis langsung (*hardcoded*) |

---

## 2. Perbandingan Metrik Model: Nilai Kode vs Hasil Pelatihan Riil

Eksekusi skrip `backend/training/train_risk_model.py` dijalankan di lingkungan lokal Python 3.11 (`backend/venv`) dengan benih acak tetap (`RANDOM_SEED = 42`). Hasil lengkap disimpan pada [thesis_assets/F0_keluaran_pelatihan.txt](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/F0_keluaran_pelatihan.txt).

Perbandingan angka:

| Model | Sumber Data Metrik | Precision | Recall | F1-Score | ROC-AUC |
|:---|:---|:---:|:---:|:---:|:---:|
| **Logistic Regression (v1.0.0-logreg)** | Kode Hardcoded `admin.py:36-48` | 76.30% | 71.00% | 73.55% | 78.20% |
| | **Eksekusi Riil `train_risk_model.py`** | **89.93%** | **81.17%** | **85.32%** | **92.53%** |
| **Random Forest (v1.1.0-rf)** | Kode Hardcoded `admin.py:50-61` | 81.20% | 74.50% | 77.71% | 83.50% |
| | **Eksekusi Riil `train_risk_model.py`** | **92.95%** | **94.16%** | **93.55%** | **97.90%** |

*Catatan:* Pada tugas F7, seluruh metrik akan dikompilasi secara otomatis langsung dari keluaran pelatihan ke registri versi model permanen tanpa penulisan manual di kode.

---

## 3. Ringkasan Keadaan Awal Sistem (*Baseline State*)

### A. Pengujian Otomatis

1. **Backend (`backend/`):**
   - Jumlah tes: **0 tes**.
   - Kerangka kerja: Folder `backend/tests/` belum ada, paket `pytest` belum terpasang di virtual environment proyek.
2. **Web Frontend (`frontend/`):**
   - Jumlah tes: **0 tes unit / integrasi** (tidak ada script test di `package.json`).
   - Linter (`npm run lint`): Dijalankan dan menghasilkan 295 masalah (150 error, 145 warning) yang merupakan warisan lama (isu `any` pada TypeScript dan `set-state-in-effect`).
3. **Mobile Flutter (`mobile/`):**
   - Jumlah tes: **0 tes** (direktori `mobile/test/` belum didefinisikan).
   - Analisis statis (`flutter analyze`): **LULUS** dengan status *No issues found!* (0 error, 0 warning).

### B. Keterjalanan Sistem di Lingkungan Lokal (*Local Executability*)

1. **Backend FastAPI:**
   - Runtime: Python 3.11.9 (`backend/venv`).
   - Status: **BERJALAN NORMAL**. Modul `app.main` berhasil diinisialisasi, modul `health_score` formula-based termuat, dan rute FastAPI siap melayani permintaan.
2. **Web Next.js (Admin):**
   - Runtime: Node.js v26.4.0.
   - Status: **BERJALAN NORMAL**. Dependensi terpasang lengkap di `node_modules/`.
3. **Mobile Flutter (User):**
   - Runtime: Flutter 3.41.9, Dart 3.11.5.
   - Status: **BERJALAN NORMAL**. Kode lulus analisis statis tanpa galat kompilasi.
