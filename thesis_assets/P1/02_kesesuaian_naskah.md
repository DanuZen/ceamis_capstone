# Laporan Kesesuaian Sistem terhadap Naskah BAB III (Tugas P1 - Bagian B)

Dokumen ini menyajikan audit kesesuaian menyeluruh antara rancangan spesifikasi pada Naskah Tugas Akhir (BAB I, BAB II, dan kerangka BAB III) dengan implementasi faktual pada repositori kode CEAMIS, mencakup teknologi, struktur arsitektur modul backend, fitur pendukung, dan alur intervensi pra-pembelian.

---

## 1. Audit Kategori B1: Fondasi Teknologi dan Komunikasi

| Item Evaluasi | Rancangan pada Naskah | Kondisi Faktual di Repositori Proyek | Status Kesesuaian | Bukti Kode (path:baris) | Catatan Analisis |
|:---|:---|:---|:---|:---|:---|
| **Aplikasi Klien Pengguna (*User*)** | Klien mobile berbasis Flutter (Dart) untuk sistem operasi Android dan iOS | Menggunakan Flutter SDK versi 3.11+ dengan bahasa pemrograman Dart, manajemen state Riverpod, dan routing GoRouter | **SESUAI** | [mobile/pubspec.yaml:1-22](file:///c:/Users/wira1/project/ceamis_capstone/mobile/pubspec.yaml#L1-L22) | Selaras dengan Subbab 2.8.1 BAB II |
| **Aplikasi Klien Pengelola (*Admin*)** | Dasbor web khusus peran administrator menggunakan Next.js (bukan untuk pengguna umum) | Menggunakan Next.js versi 16 (App Router) berbasis TypeScript dan Tailwind CSS khusus untuk halaman dasbor `/admin` | **SESUAI** | [frontend/package.json:19](file:///c:/Users/wira1/project/ceamis_capstone/frontend/package.json#L19), [frontend/src/app/admin/](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/) | Selaras dengan Subbab 2.8.3 BAB II |
| **Arsitektur Backend** | Satu aplikasi tunggal berarsitektur monolit modular menggunakan FastAPI (Python) | Satu aplikasi FastAPI tunggal dengan server ASGI Uvicorn tanpa pembagian multi-aplikasi | **SESUAI** | [backend/app/main.py:1-85](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L1-L85) | Selaras dengan Subbab 2.6 dan 2.8.2 BAB II |
| **Sistem Basis Data** | Basis data relasional PostgreSQL dengan dukungan integritas transaksi ACID | Menggunakan PostgreSQL 15+ yang di-host pada infrastruktur Supabase Cloud, diakses via Prisma ORM dan REST client | **SESUAI** | [frontend/prisma/schema.prisma:1-25](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma#L1-L25), [supabase_client.py:13-20](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/supabase_client.py#L13-L20) | Selaras dengan Subbab 2.8.4 BAB II |
| **Protokol Komunikasi** | Komunikasi berbasis HTTPS / REST API aman antara klien mobile, web, dan backend | Menggunakan REST API standar dengan autentikasi header Bearer token Supabase dan protokol HTTPS | **SESUAI** | [api_endpoints.dart:1-27](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/core/constants/api_endpoints.dart#L1-L27) | Selaras dengan Subbab 2.7 BAB II |
| **Larangan NestJS** | Tidak boleh menggunakan framework NestJS | Seluruh modul backend menggunakan Python FastAPI murni, tidak ditemukan framework NestJS di repositori | **SESUAI** | Repositori backend bersih dari dependensi NestJS / Node backend | Terkonfirmasi nihil |
| **Pengecualian Fitur Chatbot** | Fitur chatbot percakapan secara tegas dinyatakan di luar lingkup penelitian (BAB I Batasan Masalah Butir 5) | Modul warisan chatbot (`chatbot.py` dan utilitas percakapan) telah dihapus dari kode aktif dan tidak terdaftar di router API | **SESUAI** | [backend/app/main.py:92-106](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L92-L106) | Menghilangkan celah ketidaksesuaian naskah |

---

## 2. Audit Kategori B2: Struktur Modul Backend

### A. Perbandingan Struktur Konseptual Naskah versus Struktur Faktual Proyek
- **Rancangan pada Naskah:** Enam domain fungsional terpisah: `auth/`, `transactions/`, `budgets/`, `admin/`, `pre_purchase/`, dan `risk_model/`.
- **Kondisi Faktual di Repositori Backend (Pohon Direktori Kedalaman 3):**
  ```text
  backend/app/
  ├── api/
  │   ├── admin.py                  # Modul Domain: admin/ (FR-A01 s.d. FR-A06)
  │   ├── pre_purchase.py           # Modul Domain: pre_purchase/ (FR-U04, FR-U05, FR-U06)
  │   ├── dashboard_insight.py      # Modul Domain: transactions/ & insights
  │   ├── education.py              # Modul Domain: education/ (FR-U08)
  │   ├── health_score.py           # Modul Domain: health_score/ (FR-U08)
  │   ├── ocr.py                    # Modul Domain: ocr/ (FR-U03)
  │   └── recommendation.py         # Modul Domain: budgets/ & planning
  ├── models/
  │   ├── pre_purchase.py           # Skema Data: pre_purchase/ & risk_predictions
  │   └── *.joblib / *.pkl          # Serialisasi Bobot Model: risk_model/
  ├── schemas/
  │   ├── pre_purchase_schema.py    # Kontrak Pydantic: pre_purchase/
  │   └── request_response.py       # Kontrak Pydantic: budgets/ & health_score
  ├── services/
  │   ├── pre_purchase_risk.py      # Modul Domain: risk_model/ (Mesin Inferensi ML 7 Fitur)
  │   ├── persona_predictor.py      # Modul Domain: belanja persona
  │   └── risk_predictor.py         # Modul Domain: profil risiko onboarding
  └── utils/
      ├── health_score_calculator.py# Formula Rasio Kesehatan Finansial
      └── supabase_client.py        # Gateway Akses Data PostgreSQL
  ```
- **Analisis Kesesuaian:**
  Pengorganisasian di proyek memisahkan lapisan router (`app/api/`), lapisan logika/service (`app/services/`), dan lapisan kontrak data (`app/schemas/`). Seluruh keenam fungsi domain pada naskah terwadahi secara fungsional tanpa ada modul yang hilang, di mana domain `auth/`, `transactions/`, dan `budgets/` didelegasikan langsung ke Supabase Gateway RLS dan Pydantic schemas.

---

## 3. Audit Kategori B3: Fitur Pendukung Sistem

| Fitur Pendukung | Spesifikasi pada Naskah | Realisasi di Kode Proyek | Status Kesesuaian | Bukti Kode (path:baris) | Catatan |
|:---|:---|:---|:---|:---|:---|
| **Indikator Kesehatan Finansial** | Formula rasio finansial sederhana (kebutuhan, keinginan, dan tabungan terhadap pendapatan; kategori 80-100 Sehat, 40-79 Waspada, 0-39 Boros), bukan model AI | Diimplementasikan murni berbasis formula matematika rasio pengeluaran dan tabungan di Python, menghasilkan skor 0-100 dan status Sehat/Waspada/Boros | **SESUAI** | [health_score_calculator.py:15-80](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/health_score_calculator.py#L15-L80), [health_score_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/health_score/screens/health_score_screen.dart) | 100% selaras dengan Subbab 2.4 BAB II |
| **Gamifikasi Ringan** | Pencatatan berurutan (*streak*) dan lencana pencapaian sederhana TANPA papan peringkat (*leaderboard*) | Tersedia tabel `user_streaks` dan komponen lencana visual di mobile dan admin. Tidak ada fitur atau tabel *leaderboard* | **SESUAI** | [home_screen.dart:160-220](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/home/screens/home_screen.dart#L160-L220), [schema.prisma](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma) | Selaras dengan Tabel 2.4 BAB II |
| **Pemindaian Struk (OCR)** | Ekstraksi informasi struk (merchant, tanggal, total nominal) untuk mempercepat pencatatan transaksi | Menggunakan `google_mlkit_text_recognition` pada perangkat mobile dan endpoint fallback backend FastAPI `POST /api/v1/ocr/parse-receipt` | **SESUAI** | [ocr_scan_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/ocr/screens/ocr_scan_screen.dart), [ocr.py:1-75](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L1-L75) | Selaras dengan Subbab 2.5.1 BAB II |
| **Edukasi Adaptif** | Modul edukasi finansial terstruktur yang menyesuaikan dengan kondisi pengguna | Modul edukasi finansial dikelola melalui tabel `education_modules`, router backend `/api/v1/education`, dan dasbor admin | **SESUAI** | [education.py:1-60](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/education.py#L1-L60), [admin/education/](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/education/) | Tersedia lengkap |
| **Retensi Foto Struk** | Pembatasan masa simpan foto struk belanja untuk melindungi privasi pengguna | Citra struk diproses secara langsung di memori perangkat atau penyimpanan sementara dengan masa retensi terbatas (30 hari) sebelum dihapus | **SESUAI** | [ocr.py:45-55](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L45-L55) | Selaras dengan Subbab 2.7 Butir 5 |
| **Kontrol Akses (RBAC)** | Pemisahan hak akses peran *User* dan peran *Admin* dengan prinsip *least privilege* | Penegakan izin akses dilakukan via Supabase JWT Auth Roles dan middleware verifikasi peran admin | **SESUAI** | [admin.py:25-50](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L25-L50), [schema.prisma](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma) | Selaras dengan Subbab 2.7 Butir 2 |
| **Pencatatan Audit (*Audit Log*)** | Setiap akses atau intervensi data sensitif oleh admin wajib mencatat alasan ke audit log | Disediakan endpoint `POST /admin/models/rollback` dengan field alasan wajib (`reason`) dan endpoint peninjauan log `GET /admin/audit-logs` | **SESUAI** | [admin.py:98-146, 150-200](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L98-L146), [audit-logs/page.tsx](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx) | Selaras dengan Subbab 2.7 Butir 2 |
| **Persetujuan (*Consent*) Riset** | Pengumpulan persetujuan eksplisit dari partisipan sebelum data dipakai untuk riset | Tersedia kolom `consent_given` dan `consent_date` pada tabel profil pengguna dan toggle persetujuan pada layar profil | **SESUAI** | [profile_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart), [schema.prisma](file:///c:/Users/wira1/project/ceamis_capstone/frontend/prisma/schema.prisma) | Selaras dengan Subbab 2.7 Butir 3 |

---

## 4. Audit Kategori B4: Alur Inti Pemeriksaan Pra-Pembelian

| Alur Inti | Rancangan pada Naskah | Kondisi Faktual di Repositori Proyek | Status Kesesuaian | Bukti Kode (path:baris) | Catatan Analisis |
|:---|:---|:---|:---|:---|:---|
| **Tiga Respons Intervensi** | Pengguna diberikan 3 pilihan respons: Lanjut (PROCEED), Sesuaikan (ADJUST), atau Tunda (POSTPONE) | Antarmuka mobile dan backend menyediakan tombol dan enum aksi: PROCEED, ADJUST, dan POSTPONE | **SESUAI** | [pre_purchase_result_screen.dart:557-675](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L557-L675), [pre_purchase.py:208-248](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L208-L248) | Sesuai dengan Langkah 5 alur pra-pembelian |
| **Sistem Tidak Memblokir Transaksi** | Sistem hanya memberikan peringatan dan refleksi, dilarang memblokir transaksi pengguna secara paksa | Jika pengguna memilih opsi PROCEED (*Beli Sekarang Sadar Risiko*), sistem merekam keputusan dan mengizinkan pencatatan pengeluaran | **SESUAI** | [pre_purchase_result_screen.dart:608-629](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L608-L629), [pre_purchase.py:235](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L235) | Selaras dengan Batasan Masalah Butir 6 BAB I |
| **Faktor Pemicu Risiko (XAI)** | Setiap peringatan risiko wajib disertai alasan atau faktor pemicu kontekstual | Mesin inferensi membangkitkan daftar teks penjelasan deterministik berbasis 7 fitur kontekstual (`generate_trigger_factors`) | **SESUAI** | [pre_purchase_risk.py:243-307](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L243-L307), [pre_purchase_result_screen.dart:223](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L223) | Selaras dengan Langkah 3 alur pra-pembelian |
| **Konfirmasi Pasca-Keputusan** | Sistem mengumpulkan label operasional terencana vs tidak terencana untuk dataset continuous learning | Disediakan layar `PostDecisionFeedbackScreen` dan endpoint `POST /api/v1/pre-purchase/feedback` yang merekam status `was_impulsive` dan kepuasan | **SESUAI** | [post_decision_feedback_screen.dart:15-300](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/post_decision_feedback_screen.dart#L15-L300), [pre_purchase.py:255-285](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L255-L285) | Selaras dengan Langkah 6 alur pra-pembelian |
