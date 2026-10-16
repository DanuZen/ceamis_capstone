# Status Kebutuhan Fungsional Final (13 FR) CEAMIS 2.0

Dokumen ini menyajikan audit status implementasi akhir untuk 13 Kebutuhan Fungsional (*Functional Requirements* / FR) pada cabang `thesis/perbaikan-pilot`. Setiap butir diverifikasi langsung terhadap kode sumber aktif, antarmuka pengguna, endpoint REST API, modul backend FastAPI, dan skema tabel basis data PostgreSQL Supabase.

---

## 1. Rangkuman Eksekutif Status 13 FR

Dari total 13 Kebutuhan Fungsional yang didefinisikan:
- **SELESAI (9 FR):** FR-U01, FR-U04, FR-U05, FR-U08, FR-A01, FR-A03, FR-A04, FR-A05, FR-A06.
- **SEBAGIAN (4 FR):** FR-U02, FR-U03, FR-U07, FR-A02.
  - *Catatan SEBAGIAN pada FR Pengguna (FR-U02, FR-U03, FR-U07):* Antarmuka mobile dan logika kalkulasi lokal telah selesai 100%, namun transmisi mutasi data riil ke tabel Supabase `transactions`, `budgets`, atau `goals` masih menggunakan penanganan state lokal Riverpod / mock.
  - *Catatan SEBAGIAN pada FR Admin (FR-A02):* Kendali ambang batas risiko dan sakelar model/LLM beroperasi via berkas konfigurasi lingkungan `.env` dan konstanta modul, belum tersedia antarmuka pengubahan dinamis runtime berbasis tabel database.
- **BELUM (0 FR):** Tidak ada FR yang sama sekali belum disentuh.
- **TIDAK DITEMUKAN (0 FR):** Seluruh rumusan FR memiliki representasi kode nyata dalam repositori.

---

## 2. Tabel Matriks Status 13 FR Final

| Kode FR | Status | Halaman / Layar | Endpoint (Metode & Path) | Modul Backend | Tabel Basis Data | Bukti (Path:Baris) |
|:---|:---:|:---|:---|:---|:---|:---|
| **FR-U01** | **SELESAI** | Layar Onboarding & Dialog Persetujuan (`mobile_onboarding_screen.dart`), Layar Profil & Pengaturan Privasi (`profile_screen.dart`) | `POST /api/v1/consent`<br>`GET /api/v1/consent/status`<br>`POST /api/v1/consent/withdraw` | `backend/app/api/consent.py`<br>`backend/app/services/pre_purchase_repository.py` | `public.consent_records`<br>`public.user_profiles`<br>`auth.users` | [consent.py:35-120](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/consent.py#L35-L120)<br>[002_consent_records.sql:11-66](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/002_consent_records.sql#L11-L66)<br>[profile_screen.dart:140-220](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/profile/screens/profile_screen.dart#L140-L220) |
| **FR-U02** | **SEBAGIAN** | Layar Anggaran & Rencana Bulanan (`planning_screen.dart`), Layar Beranda Ringkasan 50/30/20 (`home_screen.dart`) | `GET /api/v1/budgets`<br>`GET /api/v1/goals` | `backend/app/services/user_stats_service.py` | `public.planning`<br>*(Tabel `budgets` dan `goals` belum ada di DB)* | [planning_screen.dart:1-350](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/planning/screens/planning_screen.dart#L1-L350)<br>[user_stats_service.py:445-485](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L445-L485)<br>[000_initial_schema.sql:218-230](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L218-L230) |
| **FR-U03** | **SEBAGIAN** | Layar Tambah Transaksi Manual & Pemindaian Struk (`add_transaction_screen.dart`) | `POST /api/v1/ocr/parse-receipt`<br>`POST /api/v1/transactions` | `backend/app/api/ocr.py`<br>`backend/app/main.py` | `public.transactions` | [ocr.py:24-185](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L24-L185)<br>[add_transaction_screen.dart:170-225](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L170-L225)<br>[000_initial_schema.sql:82-91](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L82-L91) |
| **FR-U04** | **SELESAI** | Layar Cek Pra-Pembelian (`pre_purchase_screen.dart`), Lembar Evaluasi Hasil Risiko (`pre_purchase_result_screen.dart`) | `POST /api/v1/pre-purchase/check` | `backend/app/api/pre_purchase.py`<br>`backend/app/services/pre_purchase_risk.py` | `public.pre_purchase_checks`<br>`public.risk_predictions` | [pre_purchase.py:37-174](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/pre_purchase.py#L37-L174)<br>[pre_purchase_risk.py:120-245](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L120-L245)<br>[001_pre_purchase_and_governance.sql:39-73](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/001_pre_purchase_and_governance.sql#L39-L73) |
| **FR-U05** | **SELESAI** | Dialog Intervensi 3 Tombol (`pre_purchase_result_screen.dart`), Layar Refleksi Pasca-Keputusan (`post_decision_feedback_screen.dart`), Banner Pengingat Beranda (`home_screen.dart`) | `POST /api/v1/pre-purchase/decide`<br>`POST /api/v1/pre-purchase/feedback` | `backend/app/api/pre_purchase.py`<br>`mobile/.../post_decision_reminder_service.dart` | `public.pre_purchase_checks`<br>`public.post_decision_feedbacks` | [pre_purchase.py:180-265](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/pre_purchase.py#L180-L265)<br>[post_decision_reminder_service.dart:1-190](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart#L1-L190)<br>[001_pre_purchase_and_governance.sql:84-91](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/001_pre_purchase_and_governance.sql#L84-L91) |
| **FR-U07** | **SEBAGIAN** | Layar Laporan Riwayat Pengeluaran (`history_report_screen.dart`), Tab Ringkasan Bulanan Dasbor | `GET /api/v1/dashboard/insight`<br>`GET /api/v1/reports/monthly` | `backend/app/api/dashboard_insight.py`<br>`backend/app/services/user_stats_service.py` | `public.transactions`<br>`public.user_profiles` | [history_report_screen.dart:1-350](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/history_report/screens/history_report_screen.dart#L1-L350)<br>[dashboard_insight.py:1-45](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/dashboard_insight.py#L1-L45) |
| **FR-U08** | **SELESAI** | Indikator Skor Kesehatan Finansial (`health_score_screen.dart`), Streak & Lencana Beranda (`home_screen.dart`), Modul Pembelajaran Finansial (`education_screen.dart`) | `POST /api/v1/predict/health-score`<br>`GET /api/v1/education/modules` | `backend/app/api/health_score.py`<br>`backend/app/api/education.py` | `public.user_profiles` (kolom `level`, `xp`, `streak`, `health_score`, `unlocked_badges`) | [health_score.py:1-45](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/health_score.py#L1-L45)<br>[education.py:20-150](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/education.py#L20-L150)<br>[health_score_screen.dart:1-300](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/health_score/screens/health_score_screen.dart#L1-L300) |
| **FR-A01** | **SELESAI** | Dasbor Utama Web Admin (`frontend/src/app/admin/dashboard/page.tsx`) | `GET /api/v1/admin/dashboard/summary` | `backend/app/api/admin.py`<br>`frontend/.../AdminNavbar.tsx` | `public.user_profiles`<br>`auth.users` | [admin/dashboard/page.tsx:1-250](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/dashboard/page.tsx#L1-L250)<br>[000_initial_schema.sql:13-39](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L13-L39) |
| **FR-A02** | **SEBAGIAN** | Konfigurasi Aturan & Ambang Batas Risiko melalui Variabel Lingkungan (`.env`) | Konfigurasi Variabel Lingkungan (`LLM_ENABLED`, `ONBOARDING_MODELS_ENABLED`, ambang risiko di kode) | `backend/app/services/pre_purchase_risk.py`<br>`backend/app/main.py` | Konstanta Lingkungan Backend | [pre_purchase_risk.py:28-35](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L28-L35)<br>[backend/.env.example:20-32](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/.env.example#L20-L32) |
| **FR-A03** | **SELESAI** | Panel Manajemen Model & Rollback (`frontend/src/app/admin/models/page.tsx`) | `GET /api/v1/admin/models`<br>`POST /api/v1/admin/models/rollback` | `backend/app/api/admin.py`<br>`backend/app/services/pre_purchase_repository.py` | `public.model_versions`<br>`public.audit_logs` | [admin.py:49-81](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L49-L81)<br>[admin/models/page.tsx:1-320](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/models/page.tsx#L1-L320)<br>[001_pre_purchase_and_governance.sql:16-28](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/001_pre_purchase_and_governance.sql#L16-L28) |
| **FR-A04** | **SELESAI** | Kartu Metrik Operasional & Status API Dasbor Admin | `GET /health`<br>`GET /api/v1/admin/models` | `backend/app/main.py`<br>`backend/app/api/admin.py` | `public.model_versions`<br>`public.audit_logs` | [main.py:98-108](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/main.py#L98-L108)<br>[admin/dashboard/page.tsx:60-120](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/dashboard/page.tsx#L60-L120) |
| **FR-A05** | **SELESAI** | Tabel Perbandingan Metrik Evaluasi Model ML (`frontend/src/app/admin/models/page.tsx`) | `GET /api/v1/admin/models` | `backend/app/api/admin.py`<br>`backend/artifacts_risk/model_registry.json` | `public.model_versions` (kolom `precision_score`, `recall_score`, `f1_score`, `roc_auc_score`) | [admin.py:28-46](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L28-L46)<br>[model_registry.json:1-40](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/artifacts_risk/model_registry.json#L1-L40)<br>[admin/models/page.tsx:140-210](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/models/page.tsx#L140-L210) |
| **FR-A06** | **SELESAI** | Peninjau Log Audit Intervensi & Tata Kelola (`frontend/src/app/admin/audit-logs/page.tsx`) | `GET /api/v1/admin/audit-logs` | `backend/app/api/admin.py`<br>`backend/app/services/pre_purchase_repository.py` | `public.audit_logs` | [admin.py:84-106](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L84-L106)<br>[admin/audit-logs/page.tsx:1-240](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/audit-logs/page.tsx#L1-L240)<br>[001_pre_purchase_and_governance.sql:102-118](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/001_pre_purchase_and_governance.sql#L102-L118) |

---

## 3. Pembahasan Rinci per Kebutuhan Fungsional

### FR-U01: Akun, Profil, dan Persetujuan Penelitian
- **Status:** **SELESAI**
- **Deskripsi:** Registrasi dan login pengguna, pengaturan profil, pembacaan lembar informasi penelitian resmi (*informed consent*), pencatatan status persetujuan, serta hak penarikan persetujuan (*consent withdrawal*).
- **Implementasi:**
  - Registrasi/login terintegrasi dengan Supabase Auth pada aplikasi mobile.
  - Dialog *informed consent* muncul saat onboarding pertama (`mobile_onboarding_screen.dart` baris 830-980).
  - Teks persetujuan terpusat pada `mobile/lib/core/constants/consent_text.dart`.
  - Penarikan izin dilayani melalui menu profil (`profile_screen.dart` baris 140-220) yang memanggil `POST /api/v1/consent/withdraw`.
  - Backend merekam jejak persetujuan pada tabel `public.consent_records` (`002_consent_records.sql`).

### FR-U02: Anggaran (Alokasi 50/30/20) dan Tujuan Tabungan
- **Status:** **SEBAGIAN**
- **Deskripsi:** Penetapan alokasi anggaran bulanan dengan panduan kaidah 50/30/20 (Kebutuhan/Keinginan/Tabungan) serta target tujuan tabungan.
- **Implementasi:**
  - Aplikasi mobile memiliki layar `planning_screen.dart` dan `home_screen.dart` yang menghitung rasio alokasi dan progres tabungan secara reaktif.
  - Namun, pada basis data Supabase, tabel yang tersedia adalah `public.planning` (`000_initial_schema.sql`). Skrip `user_stats_service.py` kueri tabel `budgets` dan `goals` yang belum ada secara fisik di Supabase, dan mobile belum menyinkronkan mutasi anggaran ke REST API basis data secara langsung.

### FR-U03: Catat Transaksi (Manual atau OCR Struk)
- **Status:** **SEBAGIAN**
- **Deskripsi:** Pencatatan transaksi pemasukan dan pengeluaran baik melalui form manual maupun ekstraksi otomatis teks struk belanja fisik.
- **Implementasi:**
  - Pemindaian struk cerdas (*Smart OCR*) berjalan dengan arsitektur privasi *zero image egress*: Google ML Kit di perangkat mengekstrak teks lokal, lalu mengirim teks mentah ke `POST /api/v1/ocr/parse-receipt` yang diproses oleh model Gemini 2.0 Flash (`ocr.py` baris 24-185).
  - Form transaksi manual di mobile (`add_transaction_screen.dart`) berfungsi lancar pada state Riverpod lokal. Namun, pengiriman mutasi transaksi ke tabel `public.transactions` Supabase belum terhubung secara live.

### FR-U04: Pemeriksaan Pra-Pembelian (Input Rencana, Skor Risiko, Faktor Pemicu, Dampak Anggaran & Tabungan)
- **Status:** **SELESAI**
- **Deskripsi:** Pengguna memasukkan rencana pembelian sebelum checkout. Sistem mengevaluasi 7 fitur rasio kontekstual, menghasilkan skor risiko, mengidentifikasi faktor pemicu utama (*explainable AI*), serta mensimulasikan dampak sisa anggaran dan penundaan target tabungan.
- **Implementasi:**
  - Layar `pre_purchase_screen.dart` mengirimkan rencana transaksi ke `POST /api/v1/pre-purchase/check`.
  - Modul `pre_purchase_risk.py` menjalankan model Random Forest (`v1.1.0-rf`) atau baseline berbasis aturan jika cold start.
  - Menghitung deviasi median, sisa anggaran sebelum/sesudah, dan penundaan tabungan (dalam satuan hari).
  - Data evaluasi disimpan ke tabel `public.pre_purchase_checks` dan `public.risk_predictions` (`001_pre_purchase_and_governance.sql`).

### FR-U05: Respons Lanjut, Sesuaikan, Tunda dan Label Konfirmasi Pasca-Keputusan
- **Status:** **SELESAI**
- **Deskripsi:** Penyajian rekomendasi tindakan (Lanjut / Sesuaikan / Tunda), perekaman keputusan pengguna, pelacakan jeda waktu refleksi (*decision latency*), serta konfirmasi refleksi pasca-keputusan (1-3 hari setelahnya) termasuk koreksi label impulsif.
- **Implementasi:**
  - Pilihan 3 tombol respon pada `pre_purchase_result_screen.dart` memanggil `POST /api/v1/pre-purchase/decide`.
  - Waktu jeda refleksi pengguna dicatat via parameter `decision_latency_ms` (hanya disimpan bila *consent* aktif).
  - Pengingat refleksi pasca-keputusan dilayani oleh `post_decision_reminder_service.dart` yang memunculkan banner in-app beranda dalam jendela 24-72 jam.
  - Formulir refleksi pada `post_decision_feedback_screen.dart` mengirim label verifikasi `was_impulsive`, `satisfaction_rating`, dan `feedback_notes` ke `POST /api/v1/pre-purchase/feedback`, tersimpan di tabel `public.post_decision_feedbacks`.

### FR-U07: Laporan Pengeluaran
- **Status:** **SEBAGIAN**
- **Deskripsi:** Penyajian ringkasan pengeluaran historis, grafik per kategori belanja, dan wawasan analitik bulanan.
- **Implementasi:**
  - Layar `history_report_screen.dart` dan endpoint `GET /api/v1/dashboard/insight` siap merender data analitik.
  - Karena transmisi transaksi mobile ke tabel `public.transactions` Supabase belum terhubung secara konsisten, laporan saat ini masih menampilkan agregasi lokal atau data demo.

### FR-U08: Indikator Kesehatan Finansial, Streak, Lencana, dan Modul Edukasi Finansial
- **Status:** **SELESAI**
- **Deskripsi:** Pengukuran skor kesehatan finansial, mekanisme gamifikasi (streak harian dan lencana pencapaian), serta modul pembelajaran literasi finansial.
- **Implementasi:**
  - Skor kesehatan finansial dihitung oleh `POST /api/v1/predict/health-score` (`health_score.py`) dan ditampilkan pada `health_score_screen.dart`.
  - Pemicu basis data `update_user_streak_on_transaction` memperbarui streak secara otomatis pada tabel `public.user_profiles`.
  - Modul edukasi finansial dilayani oleh `GET /api/v1/education/modules` (`education.py`) dengan fallback deterministik lokal saat LLM nonaktif.

### FR-A01: Melihat Ringkasan Akun Pengguna
- **Status:** **SELESAI**
- **Deskripsi:** Dasbor admin untuk memantau ringkasan pengguna terdaftar, tingkat keaktifan, dan status profil.
- **Implementasi:**
  - Halaman `frontend/src/app/admin/dashboard/page.tsx` menampilkan ringkasan metrik pengguna berbasis kueri ke `public.user_profiles` dan `auth.users`.

### FR-A02: Konfigurasi Sistem (Aturan Cold Start dan Ambang)
- **Status:** **SEBAGIAN**
- **Deskripsi:** Konfigurasi ambang batas klasifikasi risiko pra-pembelian dan kendali perilaku sistem saat kondisi cold-start.
- **Implementasi:**
  - Tersedia pada level variabel lingkungan backend (`LLM_ENABLED`, `ONBOARDING_MODELS_ENABLED`, `PERSISTENCE_BACKEND`) serta konstanta ambang batas di `pre_purchase_risk.py` baris 28-35 (`THRESHOLD_LOW = 0.35`, `THRESHOLD_HIGH = 0.65`).
  - Belum tersedia antarmuka pengubahan dinamis pada dashboard web admin yang tersimpan ke tabel basis data khusus.

### FR-A03: Versi Model dan Rollback dengan Alasan Wajib
- **Status:** **SELESAI**
- **Deskripsi:** Katalog versi model machine learning yang terdaftar, kemampuan beralih/rollback ke versi stabil sebelumnya, kewajiban menyertakan alasan audit, dan pencatatan aksi administrator.
- **Implementasi:**
  - Layar `frontend/src/app/admin/models/page.tsx` menyediakan tombol "Rollback Model" yang memicu modal input alasan.
  - Endpoint `POST /api/v1/admin/models/rollback` (`admin.py` baris 49-81) memvalidasi skema `ModelRollbackRequest` yang mewajibkan `reason` minimal 5 karakter.
  - Eksekusi memperbarui kolom `is_active` pada `public.model_versions` dan mencatat jejak ke `public.audit_logs`.

### FR-A04: Ringkasan Operasional dan Status Layanan
- **Status:** **SELESAI**
- **Deskripsi:** Pemantauan status kesehatan server backend, versi model yang sedang aktif melayani inferensi, serta metrik operasional sistem.
- **Implementasi:**
  - Endpoint `GET /health` pada `main.py` baris 98-108 mengembalikan status sistem, model aktif, dan konfigurasi persistensi.
  - Kartu status operasional pada dasbor admin web menampilkan data secara real-time.

### FR-A05: Panel Evaluasi Model
- **Status:** **SELESAI**
- **Deskripsi:** Visualisasi dan perbandingan metrik evaluasi model machine learning (Precision, Recall, F1-Score, ROC-AUC) antarversi model.
- **Implementasi:**
  - Halaman `frontend/src/app/admin/models/page.tsx` merender tabel komparasi metrik dari endpoint `GET /api/v1/admin/models`.
  - Data bersumber dari `public.model_versions` di PostgreSQL dengan fallback ke `backend/artifacts_risk/model_registry.json`.

### FR-A06: Meninjau Log Audit
- **Status:** **SELESAI**
- **Deskripsi:** Panel penelusuran rekam jejak audit untuk keputusan pra-pembelian, aksi rollback model oleh admin, serta perubahan tata kelola sistem.
- **Implementasi:**
  - Halaman `frontend/src/app/admin/audit-logs/page.tsx` terhubung ke endpoint `GET /api/v1/admin/audit-logs` (`admin.py` baris 84-106).
  - Menyajikan paginasi data dari tabel `public.audit_logs` lengkap dengan rincian aktor, tipe aksi, entitas target, dan detail JSONB.

---

## 4. Daftar Fitur Tambahan di Luar 13 FR

Berikut adalah fitur dan modul operasional yang ada dan berfungsi dalam repositori, namun berada di luar lingkup 13 Kebutuhan Fungsional di atas:

1. **Skrip Ekspor Data Penelitian Pilot Terpseudonimisasi (*Research Data Export Pipeline*):**
   - Berkas: `backend/scripts/export_pilot_data.py`.
   - Mengambil data partisipan ber-*consent* aktif, melakukan hashing HMAC-SHA256 pada UUID pengguna dengan *salt*, menyaring partisipan yang menarik persetujuan, dan menghasilkan 4 berkas CSV terstruktur (`pilot_checks_pseudonymized.csv`, `pilot_decisions_pseudonymized.csv`, `pilot_feedback_pseudonymized.csv`, `pilot_transactions_pseudonymized.csv`).
2. **Layanan Pengingat *In-App* Berbasis Jendela Waktu (*Post-Decision In-App Reminder Service*):**
   - Berkas: `mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart`.
   - Menghitung selisih waktu keputusan pengguna secara lokal dan memunculkan banner pengingat pada jendela 24-72 jam tanpa memerlukan server notifikasi push eksternal.
3. **Telemetri Jeda Waktu Refleksi (*Decision Latency Telemetry*):**
   - Berkas: `backend/db/migrations/003_telemetry_decision_latency.sql` dan `backend/app/api/pre_purchase.py`.
   - Menghitung waktu jeda refleksi (dalam milidetik) sejak pengguna disajikan peringatan risiko hingga keputusan dipilih, dengan syarat *consent* aktif.
4. **Manajemen Kuis Literasi Finansial Admin:**
   - Halaman: `frontend/src/app/admin/quizzes/page.tsx`.
   - Panel web bagi administrator untuk menyusun pertanyaan dan jawaban kuis literasi keuangan.
5. **Kalkulator Simulasi Alokasi Investasi Dasbor Web:**
   - Halaman: `frontend/src/app/dashboard/planning/page.tsx`.
   - Kalkulator simulasi instrumen investasi (emas, saham, obligasi, kripto) di sisi antarmuka web.
6. **Pencatatan Utang-Piutang (*Debt Records*):**
   - Tabel: `public.debt_records` (`000_initial_schema.sql:193-205`).
   - Modul pencatatan utang dan piutang pribadi peninggalan skema awal CEAMIS.
