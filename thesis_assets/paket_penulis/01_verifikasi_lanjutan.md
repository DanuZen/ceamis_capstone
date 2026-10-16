# Laporan Verifikasi Lanjutan (Tugas G1)

Dokumen ini menyajikan hasil verifikasi kode aktual terhadap 7 butir penyelidikan teknis dan arsitektural proyek CEAMIS pada cabang `thesis/perbaikan-pilot`.

---

## 1. Skema Nyata versus Layanan Statistik

**Status:** TIDAK TERBUKTI (Skema nyata tidak cocok dengan panggilan layanan statistik; belum diuji pada skema nyata)

### Analisis Pemanggilan Layanan Statistik:
Pada berkas [backend/app/services/user_stats_service.py:432-491](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L432-L491), metode `_fetch_from_supabase` melakukan kueri HTTP PostgREST ke endpoint berikut:
1. `GET /rest/v1/transactions`:
   - Parameter dan kolom: `user_id`, `created_at`, `select=amount,transaction_type,type,category_id,category,created_at,transaction_date` ([user_stats_service.py:438](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L438)).
2. `GET /rest/v1/budgets`:
   - Parameter: `user_id`, `category_id`, `period_month`, `period_year` ([user_stats_service.py:451-455](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L451-L455)).
   - Kolom yang dibaca: `amount_limit` atau `budget_limit` ([user_stats_service.py:383](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L383)).
3. `GET /rest/v1/goals`:
   - Parameter: `user_id`, `is_completed=eq.false` ([user_stats_service.py:468-470](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L468-L470)).
   - Kolom yang dibaca: `goal_name`, `title`, `target_amount`, `current_amount` ([user_stats_service.py:393-395](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L393-L395)).
4. `GET /rest/v1/users`:
   - Parameter: `id=eq.{user_id}` ([user_stats_service.py:483](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L483)).
   - Kolom yang dibaca: `budget_reset_day`, `monthly_income`, `monthly_savings_rate` ([user_stats_service.py:373, 396-397](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/user_stats_service.py#L373)).

### Perbandingan dengan Sumber Kebenaran:
1. **Migrasi SQL ([backend/db/migrations/000_initial_schema.sql:13-237](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L13-L237)):**
   - Tabel `budgets` **TIDAK ADA**. Tabel perencanaan pagu yang ada adalah `public.planning` ([000_initial_schema.sql:218-229](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L218-L229)) dengan kolom `id`, `user_id`, `title`, `category`, `target_amount`, `current_amount`, `deadline`, `status`.
   - Tabel `goals` **TIDAK ADA**. Target tabungan dicatat dalam `planning` atau `onboarding_data.goals`.
   - Tabel `users` di schema public **TIDAK ADA**. Yang ada adalah `public.user_profiles` ([000_initial_schema.sql:13-39](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L13-L39)), dan tabel tersebut **TIDAK MEMILIKI** kolom `budget_reset_day`, `monthly_income`, maupun `monthly_savings_rate`.
   - Pada tabel `public.transactions` ([000_initial_schema.sql:82-91](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/000_initial_schema.sql#L82-L91)), kolom yang ada adalah `id`, `user_id`, `description`, `amount`, `type`, `category`, `tag`, `created_at`. Kolom `category_id`, `transaction_date`, dan `transaction_type` **TIDAK ADA**.
2. **Skema Prisma ([frontend/prisma/schema.prisma:520-724](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L520-L724)):**
   - Menegaskan ketiadaan model `budgets` dan `goals`. Model yang tersedia adalah `planning` ([schema.prisma:659-674](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L659-L674)), `transactions` ([schema.prisma:678-694](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L678-L694)), dan `user_profiles` ([schema.prisma:698-724](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L698-L724)).
   - Model `transactions` di Prisma memuat `transaction_date`, tetapi tetap tidak memuat `category_id` maupun `transaction_type`.
   - Model `users` ([schema.prisma:520-565](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/prisma/schema.prisma#L520-L565)) berada di schema `auth` dan tidak memuat kolom `budget_reset_day`.
3. **Penelusuran Alur Aplikasi Mobile:**
   - Pencatatan transaksi di [mobile/lib/features/transaction/screens/add_transaction_screen.dart:278-292](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L278-L292) memanggil endpoint `ApiClient().client.post(ApiEndpoints.transactions)` dalam blok `try-catch` yang mengabaikan galat (`debugPrint`). Endpoint `/api/v1/transactions` tidak terdaftar pada FastAPI router [backend/app/main.py:16-110](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/main.py#L16-L110), sehingga aplikasi mobile tidak pernah berhasil menulis data transaksi ke basis data via backend FastAPI.
   - Pengaturan anggaran pada mobile di [mobile/lib/features/planning/providers/planning_provider.dart:108-251](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/planning/providers/planning_provider.dart#L108-L251) berjalan murni secara *in-memory* state Riverpod dengan data bawaan (`totalIncome: 5200000.0`, subkategori hardcoded), tanpa melakukan kueri tulis ke tabel `planning`, `budgets`, maupun `goals`.

### Kesimpulan Ketidakcocokan:
Layanan `user_stats_service.py` **TIDAK AKAN MEMBACA DATA YANG SAMA** dengan yang ditulis aplikasi. Jika dijalankan pada basis data nyata Supabase dengan `PERSISTENCE_BACKEND=db`, seluruh kueri PostgREST ke `/rest/v1/budgets`, `/rest/v1/goals`, `/rest/v1/users`, dan seleksi kolom `category_id` pada `transactions` akan gagal (HTTP 404/400) dan secara otomatis jatuh ke nilai fallback (`cold_start = True`).
*Catatan:* Karena instans basis data lokal Supabase tidak dihubungkan saat pengujian ini, status empiris: **belum diuji pada skema nyata**.

---

## 2. Proteksi Admin pada Next.js

**Status:** SEBAGIAN (Proteksi peran ditegakkan di backend FastAPI F4, tetapi frontend Next.js tidak memiliki middleware/guard sehingga antarmuka admin terbuka publik)

### Temuan Middleware dan Layout:
1. **Middleware Next.js:** Root middleware `frontend/src/middleware.ts` atau `frontend/middleware.ts` **TIDAK ADA**. Berkas [frontend/src/lib/supabase/middleware.ts:1-48](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/lib/supabase/middleware.ts#L1-L48) hanyalah helper fungsi utilitas dan tidak pernah diekspor sebagai Next.js edge middleware.
2. **Layout Admin ([frontend/src/app/admin/layout.tsx:1-27](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/layout.tsx#L1-L27)):** Tidak memuat pemeriksaan peran admin, token sesi, maupun pengalihan rute (*redirect*). Hanya mengelola status buka-tutup sidebar.

### Rincian Per Halaman Admin:
| Halaman Admin | Sumber Data | Pemeriksaan Peran di Frontend | Perilaku Jika Dibuka Pengguna Biasa / Tanpa Login |
|:---|:---|:---|:---|
| `/admin/dashboard` ([dashboard/page.tsx:21-43](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/dashboard/page.tsx#L21-L43)) | Prisma langsung via Server Actions ([dashboard/actions.ts:5-19](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/dashboard/actions.ts#L5-L19)) | **TIDAK ADA** | **Data tampil penuh.** Menampilkan total modul, total kuis, total badge, dan total pengguna dari `auth.users` tanpa autentikasi. |
| `/admin/education` ([education/page.tsx:6-320](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/education/page.tsx#L6-L320)) | Prisma langsung via Server Actions (`educationModule`, `educationPage`) | **TIDAK ADA** | **Data dan formulir tampil penuh.** Pengguna publik dapat melihat, membuat, mengubah, dan menghapus modul edukasi. |
| `/admin/gamification` ([gamification/page.tsx:1-250](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/gamification/page.tsx#L1-L250)) | Prisma langsung via Server Actions (`gamificationBadge`) | **TIDAK ADA** | **Data dan formulir tampil penuh.** Pengguna publik dapat mengelola badge gamifikasi. |
| `/admin/quizzes` ([quizzes/page.tsx:1-280](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/quizzes/page.tsx#L1-L280)) | Prisma langsung via Server Actions (`educationQuiz`) | **TIDAK ADA** | **Data dan formulir tampil penuh.** Pengguna publik dapat mengelola soal kuis. |
| `/admin/models` ([models/page.tsx:53-73](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/models/page.tsx#L53-L73)) | FastAPI (`GET /api/v1/admin/models` & `POST /api/v1/admin/models/rollback`) | **TIDAK ADA** pada komponen React (hanya menyertakan header Bearer dari Supabase session jika ada) | Kerangka halaman tetap terbuka. Namun data tabel diblokir oleh backend FastAPI: tanpa login menghasilkan HTTP 401 ("Authorization header required"), token biasa menghasilkan HTTP 403 ("Forbidden: Requires admin role"). Frontend menampilkan pesan galat. |
| `/admin/audit-logs` ([audit-logs/page.tsx:60-82](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/admin/audit-logs/page.tsx#L60-L82)) | FastAPI (`GET /api/v1/admin/audit-logs`) | **TIDAK ADA** pada komponen React | Kerangka halaman tetap terbuka. Data log diblokir oleh backend FastAPI (HTTP 401/403) dan frontend menampilkan pesan galat. |

---

## 3. Rute Web untuk Pengguna

**Status:** TERBUKTI (Seluruh 10 rute pengguna dapat diakses publik, dan rute `/dashboard/planning` memuat saran instrumen investasi di luar batasan penelitian)

### Aksesibilitas Publik:
Pada [frontend/src/app/dashboard/layout.tsx:12-47, 64-75](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/layout.tsx#L12-L47), pembungkus `GuestProvider` mengizinkan akses tamu tanpa login. Seluruh rute berikut dapat diakses oleh publik tanpa kredensial:

1. `/dashboard` ([dashboard/page.tsx:1-650](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/page.tsx#L1-L650)): Dasbor utama finansial, kartu KPI arus kas bulanan, breakdown pos 50/30/20, dan widget transaksi cepat. Data: `useTransactions()` (localStorage) dan profil pengguna.
2. `/dashboard/debt` ([dashboard/debt/page.tsx:1-882](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/debt/page.tsx#L1-L882)): Pencatatan utang-piutang personal (bukan rekomendasi kredit). Data: state lokal dan sinkronisasi transaksi.
3. `/dashboard/gamification` ([dashboard/gamification/page.tsx:1-350](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/gamification/page.tsx#L1-L350)): Status lencana, level, dan streak. Data: Server action Prisma dan profil pengguna.
4. `/dashboard/history` ([dashboard/history/page.tsx:1-420](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/history/page.tsx#L1-L420)): Riwayat transaksi dan ekspor data CSV/PDF. Data: `useTransactions()`.
5. `/dashboard/planning` ([dashboard/planning/page.tsx:1-1560](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/planning/page.tsx#L1-L1560)): Alokasi anggaran 50/30/20 dan profil risiko.
   - **TEMUAN SARAN DI LUAR BATASAN PENELITIAN:**
     - Pada baris [planning/page.tsx:201-205](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/planning/page.tsx#L201-L205), profil Moderat menyarankan instrumen: `Reksadana Pendapatan Tetap`, `Emas`, dan `Saham Blue Chip`.
     - Pada baris [planning/page.tsx:218-223](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/planning/page.tsx#L218-L223), profil Agresif menyarankan instrumen: `Saham Growth`, `Reksa Dana Saham`, dan `Kripto`.
     - Pada baris [planning/page.tsx:242, 258](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/planning/page.tsx#L242), terdapat pos default `Investasi Saham` dengan target Rp 100.000.000.
     - *Batasan Penelitian:* Penelitian berfokus pada pencegahan pengeluaran tidak terencana (intervensi pra-pembelian), bukan penasihat investasi (*robo-advisor*) atau rekomendasi sekuritas/kripto.
6. `/dashboard/pre-purchase` ([dashboard/pre-purchase/page.tsx:1-380](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/pre-purchase/page.tsx#L1-L380)): Form simulasi pra-pembelian via web. Data: memanggil FastAPI `/api/v1/pre-purchase/check`.
7. `/dashboard/profile` ([dashboard/profile/page.tsx:1-320](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/profile/page.tsx#L1-L320)): Manajemen data profil pengguna. Data: Supabase client dan context.
8. `/dashboard/reports` ([dashboard/reports/page.tsx:1-550](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/reports/page.tsx#L1-L550)): Laporan grafis pengeluaran bulanan. Data: `useTransactions()`.
9. `/dashboard/transactions` ([dashboard/transactions/page.tsx:1-480](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/transactions/page.tsx#L1-L480)): Form pencatatan transaksi manual/upload struk di web. Data: `useTransactions()` dan FastAPI OCR.
10. `/dashboard/warnings` ([dashboard/warnings/page.tsx:1-260](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/warnings/page.tsx#L1-L260)): Daftar riwayat peringatan overbudget. Data: Supabase `warnings`.

---

## 4. OCR dan Model LLM

**Status:** TERBUKTI (Endpoint OCR hanya menerima teks, model aktif adalah Gemini 2.0 Flash, dan tidak ada kemampuan visi/unggah gambar ke cloud)

### Rincian Endpoint dan Masukan:
1. **Daftar Rute:** Tepat 1 rute di [backend/app/api/ocr.py:137](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L137): `POST /api/v1/ocr/parse-receipt`.
2. **Jenis Masukan:** Murni teks string dalam skema Pydantic `ParseReceiptRequest` ([ocr.py:24-25](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L24-L25)):
   ```python
   class ParseReceiptRequest(BaseModel):
       raw_text: str
   ```
   Tidak ada endpoint yang menerima `UploadFile`, multipart berkas citra, atau decoding gambar base64.
3. **Model Gemini yang Dipakai:**
   - Pada [backend/app/api/ocr.py:147](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L147), pemanggilan HTTP langsung ke endpoint Google: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`. Model yang dipakai adalah **`gemini-2.0-flash`**.
   - Pada utilitas umum [backend/app/utils/llm_client.py:52](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/utils/llm_client.py#L52), model bawaan adalah `os.getenv("GEMINI_MODEL", "gemini-2.0-flash")`.
   - Variabel lingkungan pengendali: `GEMINI_MODEL`, serta sakelar modular `LLM_ENABLED` dan `LLM_OCR_ENABLED` pada [backend/app/utils/llm_config.py:24-28](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/utils/llm_config.py#L24-L28).
4. **Verifikasi Multimodal & Visi Citra:**
   - **TIDAK ADA** jalur yang menerima gambar atau memakai kemampuan visi Gemini.
   - Pemrosesan gambar dilakukan secara lokal *on-device* di ponsel pengguna via `google_mlkit_text_recognition` ([mobile/lib/features/transaction/screens/add_transaction_screen.dart:173-175](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L173-L175)). Teks hasil pembacaan lokal itulah yang dikirimkan ke backend.
   - **Klarifikasi Kontradiksi Laporan:** Klaim bahwa Gemini 2.0 multimodal memproses foto struk adalah **KELIRU**. Yang benar: Gemini 2.0 Flash hanya memproses teks mentah string hasil pembacaan OCR lokal (zero image data egress). Klaim bahwa model yang dipakai adalah Gemini 1.5 Flash juga keliru karena URL endpoint merujuk langsung ke `gemini-2.0-flash`.

---

## 5. Fitur Model Pra-Pembelian

**Status:** TERBUKTI (Model pra-pembelian memakai 7 fitur rasio kontekstual; daftar fitur pada laporan F12 terbukti keliru; profil risiko dan persona bukan masukan model)

### Kutipan Fitur Persis dari Kode:
1. **Layanan Inferensi ([backend/app/services/pre_purchase_risk.py:131-139](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L131-L139)):**
   ```python
   return {
       "amount_ratio_median": round(amount_ratio_median, 4),
       "budget_remaining_ratio": round(budget_remaining_ratio, 4),
       "category_frequency": category_frequency,
       "day_of_week": day_of_week,
       "days_to_reset": days_to_reset,
       "savings_impact": round(savings_impact, 4),
       "deviation_from_pattern": round(deviation_from_pattern, 4),
   }
   ```
2. **Skrip Pelatihan Pipeline ([backend/training/train_risk_model.py:65-73](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L65-L73)):**
   ```python
   FEATURE_NAMES = [
       "amount_ratio_median",
       "budget_remaining_ratio",
       "category_frequency",
       "day_of_week",
       "days_to_reset",
       "savings_impact",
       "deviation_from_pattern",
   ]
   ```

### Evaluasi Kekeliruan Laporan F12:
- Pada laporan `thesis_assets/F12_model_tambahan_dan_struk.md:48-54`, tertulis 7 fitur berbeda: `amount`, `category_enc`, `urgency_enc`, `monthly_income`, `current_savings`, `monthly_expenses`, `free_cash_flow`.
- **Fakta Repositori:** Variabel `urgency_enc` dan `free_cash_flow` sama sekali **TIDAK PERNAH ADA** di kode inferensi maupun pelatihan model risiko pra-pembelian. Penulisan pada laporan F12 merupakan kekeliruan narasi (*copy-paste* draf lama). Daftar pada laporan F2 dan F7 adalah yang **BENAR** dan 100% konsisten dengan implementasi kode aktif.
- **Konfirmasi Independensi Masukan:** Terbukti pada [backend/app/services/pre_purchase_risk.py:82-93](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L82-L93) bahwa argumen fungsi `extract_features` hanya menerima `planned_amount`, `category_median`, `budget_remaining`, `category_freq_7d`, `budget_reset_day`, `savings_goal_target`, `category_mean`, `category_std`, dan `now`. Variabel `risk_profile` maupun `persona` **BUKAN MASUKAN** inferensi model risiko pra-pembelian.

---

## 6. Versi Lingkungan

**Status:** TERBUKTI

| Komponen / Paket | Versi Repositori / File | Versi Runtime Terdeteksi | Sumber Bukti |
|:---|:---|:---|:---|
| **Python Backend** | 3.11.x (Rekomendasi) | 3.11.9 (System CLI) | [backend/README.md:24, 39](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/README.md#L24) |
| **Python Pengukuran Latensi F6** | - | 3.13.14 (Recorded runtime F6) | [thesis_assets/F6_hasil_pengukuran_latensi.json:6](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_hasil_pengukuran_latensi.json#L6) |
| **Flutter** | 3.41.9 (channel stable) | 3.41.9 | Output `flutter --version` |
| **Dart** | 3.11.5 | 3.11.5 | Output `flutter --version` |
| **Node.js** | >= 20 | v22.11.0 | Output `node -v` |
| **npm** | - | 11.7.0 | Output `npm -v` |
| **FastAPI** | == 0.136.1 | 0.136.1 | [backend/requirements.txt:2](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/requirements.txt#L2) |
| **scikit-learn** | unpinned | 1.6.1 (pada venv) | [backend/requirements.txt:11](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/requirements.txt#L11) |
| **NumPy** | unpinned | 2.0.2 (pada venv) | [backend/requirements.txt:13](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/requirements.txt#L13) |
| **Pandas** | unpinned | 2.2.2 (pada venv) | [backend/requirements.txt:14](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/requirements.txt#L14) |
| **Pydantic** | == 2.12.3 | 2.12.3 | [backend/requirements.txt:4](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/requirements.txt#L4) |
| **Next.js** | 16.2.4 | 16.2.4 | [frontend/package.json:19](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/package.json#L19) |
| **React & React-DOM** | 19.2.4 | 19.2.4 | [frontend/package.json:20-21](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/package.json#L20) |
| **Prisma** | ^6.19.3 | 6.19.3 | [frontend/package.json:13, 34](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/package.json#L13) |

---

## 7. Penghapusan pada Commit F8 Tahap 2

**Status:** TERBUKTI (Folder `backend_nestjs_archive/` dihapus penuh; artefak kompilasi lama di `backend/dist/` masih tersisa)

### Ringkasan Eksekusi `git show --stat b8e014b`:
Commit `b8e014b` menghapus total **12.840 baris** pada 49 file:
1. **Penyelamatan Berkas Migrasi:**
   - Berkas `backend/db/migrations/000_initial_schema.sql` dan `000_model3_onboarding.sql` diselamatkan dan dipindahkan ke direktori backend sebelum penghapusan arsip.
2. **Penghapusan Folder `backend_nestjs_archive/`:**
   - Seluruh 43 berkas dalam folder `backend_nestjs_archive/` telah dihapus (konfigurasi NestJS, Dockerfile, controllers, services, DTOs, dan `package-lock.json` sebesar 10.288 baris).
3. **Pembersihan Tambahan:**
   - Penghapusan berkas cadangan [frontend/src/app/dashboard/reports/page.tsx.backup](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/app/dashboard/reports/page.tsx.backup) (679 baris).
   - Pembersihan fungsi mati chatbot `aiApi.chat` pada [frontend/src/lib/api.ts:18](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/frontend/src/lib/api.ts#L18).

### Analisis Sisa Rujukan:
- **Kode Aktif:** Tidak ada modul pada FastAPI, Next.js, maupun Flutter yang mengimpor atau memanggil NestJS maupun port 3001.
- **Sisa Artefak Kompilasi:** Direktori [backend/dist/](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/dist/) masih memuat artefak JavaScript hasil kompilasi NestJS masa lampau (`app.controller.js`, `app.module.js`, DTOs kompilasi). Artefak ini tidak dieksekusi oleh Python/FastAPI namun masih terlacak di disk.
- **Dokumentasi & Environment:** Berkas `frontend/.env` dan `frontend/.env.local` baris 5 masih memuat komentar usang `# NestJS Backend`.
