# Laporan Use Case dan Peta Kebutuhan Fungsional (Bahan BAB III Gambar 3.4, Tabel 3.5, dan Tabel 3.6)

Laporan ini memuat pemetaan status kebutuhan fungsional (Functional Requirements/FR) peran Pengguna (User) dan Administrator (Admin) terhadap kode sumber nyata pada aplikasi mobile Flutter, dasbor web Next.js, dan backend FastAPI monolit modular, disertai use case diagram dan identifikasi perbedaan terhadap naskah.

---

## 1. Tabel Pemetaan Kebutuhan Fungsional Pengguna (Tabel 3.5)

| Kode FR | Nama Kebutuhan | Status | Halaman / Layar | Endpoint (Metode & Path) | Modul Backend | Tabel Basis Data | Bukti Implementasi (Path:Baris) |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **FR-U01** | Akun dan preferensi privasi | SEBAGIAN | [mobile/lib/features/auth/screens/login_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/login_screen.dart), [register_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/register_screen.dart), [profile_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart) | Supabase Auth API (`auth.signUp`, `auth.signInWithPassword`), `GET /api/v1/users/{user_id}` | Supabase Auth, `backend/app/api/` | `auth.users`, `public.user_profiles` | [login_screen.dart:43](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/login_screen.dart#L43), [register_screen.dart:47](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/register_screen.dart#L47), [profile_screen.dart:68](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L68) |
| **FR-U02** | Anggaran dan tujuan tabungan | SEBAGIAN | [mobile/lib/features/planning/screens/planning_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/planning/screens/planning_screen.dart), [frontend/src/app/dashboard/planning/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/page.tsx) | Server Actions Next.js: `getBudgets()`, `createBudget()`, `saveTargets()` | Next.js Prisma Server Actions, Riverpod State Planning | `FinancialBudget`, `FinancialTarget`, `planning` | [planning_provider.dart:24-67](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/planning/providers/planning_provider.dart#L24-L67), [planning/actions.ts:6-45](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/actions.ts#L6-L45) |
| **FR-U03** | Catat dan kelola transaksi (manual atau OCR struk) | SELESAI | [mobile/lib/features/transaction/screens/add_transaction_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart), [mobile/lib/features/ocr/screens/ocr_scan_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/ocr/screens/ocr_scan_screen.dart) | `POST /api/v1/transactions`, `POST /api/v1/ocr/parse-receipt` | `backend/app/api/ocr.py`, Supabase Transaction Service | `transactions` | [add_transaction_screen.dart:278-295](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L278-L295), [ocr.py:19-45](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L19-L45) |
| **FR-U04** | Pemeriksaan pra-pembelian (input rencana, skor risiko, dampak) | SELESAI | [mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart), [pre_purchase_result_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart) | `POST /api/v1/pre-purchase/check` | `backend/app/api/pre_purchase.py`, `backend/app/services/pre_purchase_risk.py` | `pre_purchase_checks`, `risk_predictions` | [pre_purchase.py:84-148](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L84-L148), [pre_purchase_provider.dart:257-277](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart#L257-L277) |
| **FR-U05** | Respons Lanjut, Sesuaikan, Tunda & konfirmasi pasca-keputusan | SEBAGIAN | [mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart) | `POST /api/v1/pre-purchase/decide`, `POST /api/v1/pre-purchase/feedback` | `backend/app/api/pre_purchase.py` | `pre_purchase_checks`, `post_decision_feedbacks` | [pre_purchase.py:165-207](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L165-L207), [pre_purchase.py:228-267](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L228-L267), [pre_purchase_provider.dart:292-315](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart#L292-L315) |
| **FR-U06** | Koreksi prediksi model | BELUM | Tidak ada layar dedicated di Flutter (hanya pratinjau form manual) | `POST /api/v1/pre-purchase/feedback` (endpoint siap di backend) | `backend/app/api/pre_purchase.py` | `post_decision_feedbacks` | [pre_purchase.py:228](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L228), [PANDUAN_REVISI_PROJECT.md:96](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/PANDUAN_REVISI_PROJECT.md#L96) |
| **FR-U07** | Laporan pengeluaran | SELESAI | [mobile/lib/features/history_report/screens/history_report_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/history_report/screens/history_report_screen.dart), [frontend/src/app/dashboard/history/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/history/page.tsx) | `GET /api/v1/transactions`, Supabase Client query `from('transactions')` | Supabase Transaction Service | `transactions` | [history_report_screen.dart:40-150](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/history_report/screens/history_report_screen.dart#L40-L150), [history/page.tsx:1-80](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/history/page.tsx#L1-L80) |
| **FR-U08** | Fitur Engagement dan Pendukung | SEBAGIAN | [mobile/lib/features/health_score/screens/health_score_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/health_score/screens/health_score_screen.dart), [frontend/src/app/dashboard/gamification/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/gamification/page.tsx) | `POST /api/v1/predict/health-score`, `GET /api/v1/dashboard/insight` | `backend/app/api/health_score.py`, `backend/app/api/dashboard_insight.py` | `user_profiles`, `GamificationBadge`, `EducationModule` | [health_score.py:9-35](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/health_score.py#L9-L35), [dashboard_insight.py:18-35](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/dashboard_insight.py#L18-L35), [profile_screen.dart:300-360](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L300-L360) |

---

## 2. Tabel Pemetaan Kebutuhan Fungsional Administrator (Tabel 3.6)

| Kode FR | Nama Kebutuhan | Status | Halaman / Layar | Endpoint (Metode & Path) | Modul Backend | Tabel Basis Data | Bukti Implementasi (Path:Baris) |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **FR-A01** | Kelola akun pengguna | SEBAGIAN | [frontend/src/app/admin/dashboard/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx) | Server Action `getTotalUsers()` | Next.js Server Action | `auth.users`, `public.user_profiles` | [dashboard/page.tsx:71](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx#L71), [dashboard/actions.ts:7-12](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/actions.ts#L7-L12) |
| **FR-A02** | Konfigurasi sistem (kategori, cold start, ambang baseline) | SEBAGIAN | Belum ada antarmuka dedicated konfigurasi di Next.js Admin | Logika fallback hardcoded di modul evaluasi | `backend/app/services/pre_purchase_risk.py` | Belum ada tabel konfigurasi dinamis | [pre_purchase_risk.py:165-215](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L165-L215), [PANDUAN_REVISI_PROJECT.md:100](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/PANDUAN_REVISI_PROJECT.md#L100) |
| **FR-A03** | Versi model dan rollback | SELESAI | [frontend/src/app/admin/models/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx) | `GET /api/v1/admin/models`, `POST /api/v1/admin/models/rollback` | `backend/app/api/admin.py` | `model_versions`, `audit_logs` | [admin/models/page.tsx:54-78](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L54-L78), [admin.py:75-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L75-L146) |
| **FR-A04** | Monitoring layanan | SEBAGIAN | [frontend/src/app/admin/dashboard/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx) | `GET /health` | `backend/app/main.py` | `auth.users`, `EducationModule` | [main.py:167-170](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L167-L170), [dashboard/page.tsx:21-80](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx#L21-L80) |
| **FR-A05** | Panel evaluasi model | SELESAI | [frontend/src/app/admin/models/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx) | `GET /api/v1/admin/models` | `backend/app/api/admin.py` | `model_versions` | [admin/models/page.tsx:39-52](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L39-L52), [admin.py:75-93](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L75-L93) |
| **FR-A06** | Akses data transaksi individual dengan alasan tercatat & audit log | SEBAGIAN | [frontend/src/app/admin/audit-logs/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx) | `GET /api/v1/admin/audit-logs` | `backend/app/api/admin.py` | `audit_logs` | [audit-logs/page.tsx:43-60](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx#L43-L60), [admin.py:152-263](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L152-L263) |

---

## 3. Rincian Implementasi per Kode Kebutuhan Fungsional

### 3.1 Peran Pengguna (User)

1. **FR-U01: Akun dan Preferensi Privasi (Status: SEBAGIAN)**
   - **Implementasi:** Pendaftaran akun dan otentikasi login telah berfungsi menggunakan Supabase Auth Client pada Flutter ([login_screen.dart:43](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/login_screen.dart#L43), [register_screen.dart:47](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/register_screen.dart#L47)). Halaman profil menampilkan nama, surel, streak, total transaksi, dan skor kesehatan finansial ([profile_screen.dart:68-88](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L68-L88)).
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Pengaturan privasi dan persetujuan partisipan (*consent records*) belum diimplementasikan baik pada antarmuka maupun tabel basis data; pengaturan akun di halaman profil saat ini baru memuat toggle lokal notifikasi peringatan anggaran dan reminder pra-beli ([profile_screen.dart:422-436](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L422-L436)).

2. **FR-U02: Anggaran dan Tujuan Tabungan (Status: SEBAGIAN)**
   - **Implementasi:** Di aplikasi mobile, alokasi anggaran pilar 50/30/20 (Kebutuhan, Keinginan, Tabungan) dan target tabungan dikelola oleh provider state [planning_provider.dart:24-67](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/planning/providers/planning_provider.dart#L24-L67) serta ditampilkan pada [planning_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/planning/screens/planning_screen.dart). Di dasbor web Next.js, anggaran dan target tabungan dilayani oleh Prisma Server Actions [planning/actions.ts:6-45](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/actions.ts#L6-L45) yang berinteraksi dengan tabel `FinancialBudget` dan `FinancialTarget`.
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Modul REST API mandiri di FastAPI (`budgets/` dan `goals/`) berstatus belum selesai di-porting dari arsip NestJS ([docs/ceamis 2.0/TASKS.md:32](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/TASKS.md#L32)), sehingga mobile masih mengandalkan simulasi guardrail berbasis state internal.

3. **FR-U03: Catat dan Kelola Transaksi Manual atau OCR Struk (Status: SELESAI)**
   - **Implementasi:** Pengguna dapat mencatat transaksi secara manual dengan input nominal, deskripsi, jenis pemasukan/pengeluaran, kategori, dan tag kebutuhan/keinginan pada [add_transaction_screen.dart:268-295](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L268-L295). Pemindaian struk didukung on-device menggunakan Google ML Kit Text Recognition lalu diurai secara terstruktur oleh endpoint `POST /api/v1/ocr/parse-receipt` ([ocr.py:19-45](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L19-L45)) menggunakan Gemini 2.0 Flash dengan fallback heuristik regex.

4. **FR-U04: Pemeriksaan Pra-Pembelian (Status: SELESAI)**
   - **Implementasi:** Pengguna menginput rencana nominal belanja, kategori, nama toko, dan catatan tambahan pada [pre_purchase_screen.dart:80-250](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart#L80-L250). Endpoint `POST /api/v1/pre-purchase/check` ([pre_purchase.py:84-148](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L84-L148)) mengekstrak 7 fitur kontekstual dan mengembalikan skor risiko (0.0 s.d. 1.0), tingkat risiko (LOW/MEDIUM/HIGH), daftar alasan/faktor pemicu, dampak terhadap sisa anggaran kategori, dan dampak penundaan hari pada target tabungan aktif yang disajikan di [pre_purchase_result_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart).

5. **FR-U05: Respons Lanjut, Sesuaikan, Tunda dan Konfirmasi Pasca-Keputusan (Status: SEBAGIAN)**
   - **Implementasi:** Pada layar hasil peringatan [pre_purchase_result_screen.dart:250-380](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L250-L380), pengguna disajikan tiga pilihan aksi tombol (*Tetap Lanjut Belanja*, *Sesuaikan Nominal*, atau *Tunda Pembelian*). Aksi ini memanggil endpoint `POST /api/v1/pre-purchase/decide` ([pre_purchase.py:165-207](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L165-L207)) untuk mencatat keputusan `PROCEED`, `ADJUST`, atau `POSTPONE`. Endpoint perekaman umpan balik pasca-keputusan (`POST /api/v1/pre-purchase/feedback`) dan tabel `post_decision_feedbacks` sudah siap di backend ([pre_purchase.py:228-267](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L228-L267)).
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Alur pemicu dialog konfirmasi pasca-keputusan berkala (misal: "Apakah pembelian minggu lalu disesali?") di antarmuka mobile Flutter belum dihubungkan secara aktif ke endpoint feedback (status task MOB-4.3 masih belum selesai di backlog [TASKS.md:100](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/TASKS.md#L100)).

6. **FR-U06: Koreksi Prediksi Model (Status: BELUM)**
   - **Implementasi:** Endpoint penerima feedback/koreksi `POST /api/v1/pre-purchase/feedback` ([pre_purchase.py:228](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L228)) menyediakan parameter `was_impulsive` dan `feedback_notes` untuk mencatat ketidaksesuaian penilaian risiko model.
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Tidak ditemukan layar antarmuka pengguna tersendiri di Flutter yang secara eksplisit memberi opsi kepada pengguna untuk mengajukan koreksi/sanggahan atas prediksi model yang dianggap keliru.

7. **FR-U07: Laporan Pengeluaran (Status: SELESAI)**
   - **Implementasi:** Terdapat layar riwayat dan laporan pengeluaran lengkap di aplikasi mobile [history_report_screen.dart:40-350](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/history_report/screens/history_report_screen.dart#L40-L350) serta dasbor web [dashboard/history/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/history/page.tsx) yang menampilkan ringkasan pengeluaran per periode, visualisasi grafik FL Chart, dan filter kategori.

8. **FR-U08: Fitur Engagement dan Pendukung (Status: SEBAGIAN)**
   - **Implementasi:** 
     - Indikator skor kesehatan finansial berbasis formula 50/30/20 telah selesai pada layar [health_score_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/health_score/screens/health_score_screen.dart) dan endpoint `POST /api/v1/predict/health-score` ([health_score.py:9-35](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/health_score.py#L9-L35)).
     - Fitur streak dan perolehan lencana gamifikasi telah selesai pada [profile_screen.dart:300-360](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart#L300-L360) dan dasbor [gamification/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/gamification/page.tsx).
     - Modul edukasi literasi finansial telah selesai didukung endpoint [education.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/education.py) dan tabel `EducationModule`, `EducationPage`, `EducationQuiz`.
     - Ringkasan wawasan finansial adaptif didukung endpoint `GET /api/v1/dashboard/insight` ([dashboard_insight.py:18-35](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/dashboard_insight.py#L18-L35)).
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Fitur pengaturan jam tenang (*quiet hours*) dan penundaan pengingat (*snooze*) belum diimplementasikan di antarmuka maupun backend.

---

### 3.2 Peran Administrator (Admin)

1. **FR-A01: Kelola Akun Pengguna (Status: SEBAGIAN)**
   - **Implementasi:** Dasbor admin menampilkan metrik total pengguna aktif ([dashboard/page.tsx:71](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx#L71)) melalui Server Action `getTotalUsers()` ([dashboard/actions.ts:7-12](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/actions.ts#L7-L12)).
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Halaman antarmuka CRUD untuk memanipulasi akun pengguna (blokir, hapus, ubah peran) belum dibuat di panel admin Next.js; pengelolaan akun masih mengandalkan dashboard bawaan Supabase Cloud.

2. **FR-A02: Konfigurasi Sistem (Status: SEBAGIAN)**
   - **Implementasi:** Logika aturan *cold start* (fallback berbasis rule guardrail saat model ML belum tersedia) telah tertanam di kode backend [pre_purchase_risk.py:165-215](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L165-L215).
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Tidak ada halaman konfigurasi di dasbor admin untuk memperbarui kategori transaksi, mengubah ambang baseline, atau menyesuaikan aturan cold start secara runtime.

3. **FR-A03: Versi Model dan Rollback (Status: SELESAI)**
   - **Implementasi:** Halaman [admin/models/page.tsx:54-78](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L54-L78) menyediakan tombol aksi rollback model ML yang memanggil endpoint `POST /api/v1/admin/models/rollback` ([admin.py:98-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L98-L146)) dengan input wajib alasan rollback (*reason*, minimal 5 karakter), mencatat riwayat ke log audit, serta mengaktifkan versi target di registry.

4. **FR-A04: Monitoring Layanan (Status: SEBAGIAN)**
   - **Implementasi:** Backend menyediakan endpoint pemeriksaan status dasar `GET /health` ([main.py:167-170](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L167-L170)). Dasbor admin [dashboard/page.tsx:21-80](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/dashboard/page.tsx#L21-L80) memantau agregat metrik modul edukasi, kuis, badge, dan pengguna.
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Panel pemantauan latensi server real-time (APM), error rate, atau telemetri sistem secara terperinci belum tersedia di dasbor admin.

5. **FR-A05: Panel Evaluasi Model (Status: SELESAI)**
   - **Implementasi:** Halaman [admin/models/page.tsx:26-150](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L26-L150) menampilkan tabel komparasi seluruh versi model ML yang terdaftar via endpoint `GET /api/v1/admin/models` ([admin.py:75-93](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L75-L93)), mencakup algoritma (LogisticRegression, RandomForest), skor Presisi, Recall, F1-Score, ROC-AUC, status aktif, dan waktu deployment.

6. **FR-A06: Akses Data Transaksi Individual dengan Alasan Tercatat dan Audit Log (Status: SEBAGIAN)**
   - **Implementasi:** Halaman [admin/audit-logs/page.tsx:34-210](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx#L34-L210) dan endpoint `GET /api/v1/admin/audit-logs` ([admin.py:152-263](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L152-L263)) menyajikan log riwayat intervensi pra-pembelian pengguna, mencakup nama pengguna, kategori, nominal yang dicegah, tingkat risiko, dan keputusan.
   - **Kesenjangan [BERBEDA DARI NASKAH]:** Pada tampilan log saat ini, admin dapat langsung meninjau data tanpa diwajibkan mengisi formulir alasan akses terlebih dahulu sebelum data transaksi individual dimuat.

---

## 4. Perbandingan Fitur di Proyek vs Daftar FR Naskah

### 4.1 Fitur yang Ada di Proyek tetapi TIDAK ADA di Daftar FR Naskah

1. **Smart Wishlist Belanja:**  
   Implementasi pada [wishlist_model.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/models/wishlist_model.dart) dan Tab 2 [pre_purchase_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart) yang memungkinkan pengguna menabung keinginan belanja dan menghitung kesiapan saldo pos keinginan (`WishlistReadiness.ready` vs `overbudget`).
2. **Kuesioner Onboarding Multitahap (5 Langkah):**  
   Implementasi pada [mobile_onboarding_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart), [onboarding/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/onboarding/page.tsx), dan tabel `onboarding_data` untuk asesmen profil risiko investasi/keuangan awal.
3. **Pencatatan Hutang dan Piutang (Debt Records):**  
   Implementasi pada [planning/actions.ts:56-78](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/actions.ts#L56-L78) dan tabel `debt_records` / `FinancialDebt`.
4. **Chatbot / Percakapan Asisten Finansial (CAMI AI):**  
   Endpoint `POST /api/v1/chatbot/chat` pada [backend/app/api/chatbot.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/chatbot.py).  
   *[PERHATIAN: Naskah Bab III aturan B1 secara eksplisit menyatakan bahwa proyek tidak boleh memuat fitur chatbot. Fitur ini ada di kode repositori namun berada di luar lingkup resmi naskah].*
5. **Manajemen Konten Edukasi dan Kuis oleh Admin:**  
   Halaman [admin/education/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/education/page.tsx) dan [admin/quizzes/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/quizzes/page.tsx) untuk menambah, mengubah, dan menghapus artikel edukasi dan butir soal kuis.
6. **Manajemen Katalog Badge Gamifikasi oleh Admin:**  
   Halaman [admin/gamification/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/gamification/page.tsx) untuk membuat dan mengelola katalog penghargaan gamifikasi.

### 4.2 Fitur yang Ada di Daftar FR Naskah tetapi BELUM ADA di Proyek

1. **FR-U01 (Form Persetujuan Privasi / Consent Records):** Formulir persetujuan partisipasi penelitian dan perekaman riwayat persetujuan belum diimplementasikan.
2. **FR-U06 (Antarmuka Koreksi Prediksi Model di Mobile):** Layar khusus untuk menyanggah hasil prediksi risiko model belum tersedia di Flutter.
3. **FR-U08 (Pengaturan Quiet Hours dan Snooze Notifikasi):** Pengaturan jam tenang malam dan penundaan pengingat belum tersedia.
4. **FR-A01 (Halaman CRUD Akun Pengguna di Panel Admin):** Antarmuka kelola pengguna belum ada di aplikasi web Next.js.
5. **FR-A02 (Halaman Konfigurasi Sistem Aturan Cold Start & Ambang Baseline):** Antarmuka web untuk mengubah parameter aturan cold start dan threshold model belum ada.
6. **FR-A06 (Form Alasan Wajib Sebelum Akses Transaksi Pengguna):** Otentikasi pengisian alasan akses data individual belum diwajibkan di antarmuka audit log.

---

## 5. Sumber Berkas Diagram Use Case

1. **PlantUML:** [thesis_assets/diagrams/use_case.puml](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/use_case.puml)  
   Memuat batas sistem *Sistem Peringatan Dini*, dua aktor (*User* dan *Admin*), use case yang berstatus SELESAI atau SEBAGIAN, serta relasi `<<include>>` dan `<<extend>>` yang nyata di kode.
2. **Mermaid Flowchart (Alternatif):** [thesis_assets/diagrams/use_case_alt.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/use_case_alt.mmd)  
   Cadangan diagram use case dalam sintaks Mermaid flowchart.
