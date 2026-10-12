# Laporan Arsitektur, Struktur Modul, dan Bukti Kebutuhan Non-Fungsional (Bahan BAB III Gambar 3.5, Gambar 3.6, dan Tabel 3.7)

Laporan ini menyajikan analisis struktur backend nyata, pohon direktori kedalaman 3, ketergantungan antarmodul, diagram arsitektur sistem, diagram penerapan kontainer, serta verifikasi bukti kebutuhan non-fungsional (NFR) berdasarkan kode sumber repositori CEAMIS.

---

## 1. Struktur Direktori Backend Nyata vs Enam Modul Naskah

### 1.1 Pohon Direktori Backend Aktual (Kedalaman 3)

Berikut adalah struktur pohon direktori sebenarnya dari folder `backend/` hingga kedalaman 3 (tidak menyertakan virtual environment `venv/` dan direktori cache `__pycache__/`):

```text
backend/
├── Dockerfile                                 (Kontainerisasi produksi)
├── requirements.txt                           (Daftar pustaka Python)
├── README.md                                  (Dokumentasi arsitektur layanan)
├── app/                                       (Paket kode aplikasi modular)
│   ├── main.py                                (Entry point FastAPI & registrasi router)
│   ├── api/                                   (Lapisan endpoint REST API)
│   │   ├── admin.py                           (Governance model & audit logs)
│   │   ├── chatbot.py                         (Asisten percakapan CAMI AI)
│   │   ├── dashboard_insight.py               (Ringkasan wawasan finansial)
│   │   ├── education.py                       (Modul konten literasi & kuis)
│   │   ├── health_score.py                    (Kalkulasi formula skor finansial)
│   │   ├── ocr.py                             (Ekstraksi struk via Gemini Flash)
│   │   ├── pre_purchase.py                    (★ Fitur inti pra-pembelian)
│   │   ├── recommendation.py                  (Rekomendasi pos anggaran)
│   │   └── risk_profile.py                    (Asesmen profil risiko)
│   ├── models/                                (Definisi ORM & berkas model biner)
│   │   ├── pre_purchase.py                    (SQLAlchemy ORM: PrePurchase, ModelVersion, dll)
│   │   ├── risk_profile_v1.keras              (Artefak model neural network legacy)
│   │   ├── cluster_model.pkl                  (Artefak model clustering legacy)
│   │   └── scaler_risk.pkl                    (Artefak scaler pra-pemrosesan)
│   ├── schemas/                               (Validasi data Pydantic v2)
│   │   ├── pre_purchase_schema.py             (DTO pra-pembelian & tata kelola model)
│   │   └── request_response.py                (DTO insight, edukasi, & rekomendasi)
│   ├── services/                              (Logika bisnis & orkestrasi inferensi)
│   │   ├── pre_purchase_risk.py               (★ Predictor 7 fitur ML & fallback)
│   │   ├── insight_generator.py               (Generator narasi wawasan anggaran)
│   │   ├── persona_predictor.py               (Inferensi persona belanja)
│   │   └── risk_predictor.py                  (Inferensi profil risiko)
│   └── utils/                                 (Komponen pembantu sistem)
│       ├── health_score_calculator.py         (Kalkulator formula 50/30/20)
│       ├── llm_client.py                      (Wrapper koneksi LLM Google Gemini)
│       ├── supabase_client.py                 (Klien akses database Supabase)
│       ├── curriculum.py                      (Struktur kurikulum literasi keuangan)
│       ├── prompt_builder.py                  (Penyusun prompt inferensi Gemini)
│       └── safety_filter.py                   (Filter kepatuhan respon AI)
├── artifacts_risk/                            (Penyimpanan artefak model pra-pembelian)
│   ├── model_registry.json                    (Registry metadata versi model aktif/arsip)
│   ├── confusion_matrix_risk.png              (Visualisasi evaluasi model)
│   └── training_history.png                   (Grafik kurva pembelajaran model)
├── artifacts_model2/                          (Artefak evaluasi clustering model legacy)
├── inference/                                 (Skrip pengujian inferensi mandiri)
│   └── risk_inference.py
└── training/                                  (Kode sumber pelatihan model offline)
    ├── train_risk_model.py                    (Skrip pelatihan model risiko)
    ├── notebooks/                             (Jupyter Notebook eksperimen ML)
    └── scripts/                               (Skrip pembantu pipeline data)
```

### 1.2 Perbandingan terhadap Enam Modul Rancangan Naskah

Naskah merancang enam modul backend monolit modular: `auth/`, `transactions/`, `budgets/`, `admin/` (fungsi dasar) serta `pre_purchase/`, `risk_model/` (fitur inti).

Kondisi nyata pada kode repositori menunjukkan perbedaan struktur:

1. **`auth/` [BERBEDA DARI NASKAH]:**  
   Tidak terdapat folder paket `backend/app/auth/`. Otentikasi pengguna ditangani langsung oleh klien (Flutter dan Next.js) melalui SDK Supabase Auth ([mobile/lib/features/auth/screens/login_screen.dart:43](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/auth/screens/login_screen.dart#L43), [frontend/src/app/auth/page.tsx:51](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/auth/page.tsx#L51)), sedangkan backend FastAPI menggunakan token service role atau verifikasi JWT di level gateway ([backend/app/utils/supabase_client.py:14](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/supabase_client.py#L14)).
2. **`transactions/` [BERBEDA DARI NASKAH]:**  
   Tidak terdapat folder paket `backend/app/transactions/`. Operasi CRUD transaksi dilayani langsung oleh Supabase REST API atau Prisma Server Actions, sementara backend FastAPI hanya menyediakan endpoint pembacaan struk pada [backend/app/api/ocr.py:19](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L19).
3. **`budgets/` [BERBEDA DARI NASKAH]:**  
   Tidak terdapat folder paket `backend/app/budgets/`. Pagu anggaran dikelola oleh Server Actions Next.js Prisma pada [frontend/src/app/dashboard/planning/actions.ts:6](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/actions.ts#L6) dan kalkulator formula guardrail di Flutter. Porting modul `budgets/` dan `goals/` ke FastAPI tercatat masih berstatus pending pada backlog [docs/ceamis 2.0/TASKS.md:32](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/TASKS.md#L32).
4. **`admin/` [SESUAI DENGAN PERBEDAAN STRUKTUR]:**  
   Diimplementasikan sebagai router API [backend/app/api/admin.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L1-L263) yang menangani daftar versi model, rollback, dan log audit intervensi.
5. **`pre_purchase/` [SESUAI DENGAN PERBEDAAN STRUKTUR]:**  
   Diimplementasikan sebagai router API [backend/app/api/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L1-L287), model data [backend/app/models/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L64-L100), dan skema DTO [backend/app/schemas/pre_purchase_schema.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py#L42-L89).
6. **`risk_model/` [SESUAI DENGAN PERBEDAAN STRUKTUR]:**  
   Diimplementasikan sebagai service layer [backend/app/services/pre_purchase_risk.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L1-L336) yang mengekstrak 7 fitur kontekstual dan mengeksekusi inferensi model Scikit-Learn in-memory.

**Kesimpulan Struktur:** Backend menerapkan pemisahan berbasis lapisan fungsional teknis (`api/`, `services/`, `models/`, `schemas/`, `utils/`) alih-alih pemisahan berbasis domain vertikal mandiri (`auth/`, `budgets/`, `transactions/`).

---

## 2. Analisis Ketergantungan Antarmodul dan Catatan Batas Modul

Diagram ketergantungan antarmodul didokumentasikan pada berkas sumber Mermaid: [thesis_assets/diagrams/modul_dependency.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/modul_dependency.mmd).

### Alur Ketergantungan:
1. Entry point [backend/app/main.py:16-20](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L16-L20) mengimpor dan mendaftarkan router dari `app.api` (`pre_purchase`, `admin`, `ocr`, `health_score`, `dashboard_insight`, `education`).
2. Router `pre_purchase.py` memanggil layanan inferensi `risk_predictor` pada [app/services/pre_purchase_risk.py:25](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L25) dan bergantung pada kontrak data di `app.schemas.pre_purchase_schema`.
3. Router `admin.py` mengelola metadata versi model pada `artifacts_risk/model_registry.json` dan memvalidasi permintaan rollback via `ModelRollbackRequest` di `app.schemas.pre_purchase_schema`.
4. Router `health_score.py` memanggil fungsi kalkulasi murni formula pada [app/utils/health_score_calculator.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/health_score.py#L8).
5. Router `dashboard_insight.py` dan `education.py` bergantung pada utilitas panggilan LLM eksternal [app/utils/llm_client.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/dashboard_insight.py#L8).

### Catatan Pelanggaran Batas Modul (Boundary Concerns):
- Pada berkas [backend/app/utils/supabase_client.py:43-154](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/supabase_client.py#L43-L154), sebuah modul utilitas tunggal melakukan pembacaan langsung secara lintas-tabel ke `user_profiles`, `transactions`, `planning`, dan `debt_records` menggunakan `SUPABASE_SERVICE_ROLE_KEY` tanpa melalui lapisan abstraksi service domain masing-masing. Hal ini membypass batas enkapsulasi data antarmodul yang dirancang di naskah.
- Pada router `pre_purchase.py`, konteks transaksi dan anggaran pengguna saat ini disimulasikan melalui fungsi mock internal (`_get_user_category_stats`, `_get_user_budget_info`) pada [backend/app/api/pre_purchase.py:41-78](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L41-L78), alih-alih mengonsumsi service resmi modul `budgets` atau `transactions`.

---

## 3. Diagram Arsitektur Sistem

Diagram arsitektur sistem tersedia pada berkas sumber Mermaid: [thesis_assets/diagrams/arsitektur.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/arsitektur.mmd).

Diagram ini memetakan komponen nyata yang benar-benar ada di kode repositori:
1. **Dua Klien:**
   - Aplikasi Mobile Flutter (User): Mengakses FastAPI untuk pemeriksaan risiko pra-beli dan OCR, serta Supabase untuk data profil dan transaksi.
   - Dasbor Web Next.js (Admin): Mengakses FastAPI untuk manajemen model dan audit log, serta terhubung ke PostgreSQL Supabase via Prisma Client.
2. **Backend FastAPI Monolit Modular:**
   - Menyediakan API Gateway terpadu berbasis Uvicorn ASGI Server.
   - Memuat empat sub-modul inti aktif: Pra-Pembelian, Tata Kelola Admin, Smart OCR, dan Health Score.
3. **Komponen Machine Learning In-Memory:**
   - Engine inferensi 7-fitur prediktif yang memuat artefak serialisasi Scikit-Learn (`.joblib`) langsung ke memori proses tanpa jeda jaringan (zero network hop).
   - Mesin fallback rule-based berbasis guardrail pagu anggaran saat artefak model belum tersedia.
4. **Basis Data PostgreSQL 15+ (Supabase Cloud):**
   - Menampung tabel skema `auth` dan skema `public` dengan pengamanan Row-Level Security (RLS).
5. **Layanan Eksternal:**
   - Supabase Auth Service untuk verifikasi token JWT.
   - Google Gemini 2.0 Flash API untuk pemrosesan teks hasil OCR struk belanja.

---

## 4. Diagram Penerapan (Deployment)

Diagram penerapan berbasis berkas konfigurasi nyata tersedia pada berkas sumber Mermaid: [thesis_assets/diagrams/deployment.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/deployment.mmd).

Topologi penerapan terdiri atas empat simpul lingkungan terdistribusi:
1. **Perangkat Pengguna Akhir:** Perangkat Android (minSdk 21) dan iOS (iOS 13.0+) menjalankan aplikasi biner native Flutter; peramban desktop menjalankan web Next.js.
2. **Vercel Cloud Platform:** Menjalankan aplikasi web Next.js 16 (`https://ceamis.vercel.app`) dengan Node.js Runtime dan integrasi edge routing.
3. **Cloud Container (Hugging Face Spaces):** Menjalankan kontainer Docker FastAPI berbasis image `python:3.11-slim` ([backend/Dockerfile:1-26](file:///c:/Users/wira1/project/ceamis_capstone/backend/Dockerfile#L1-L26)) pada port 8000.
4. **Supabase Managed Cloud:** Menyediakan instans PostgreSQL 15+ terkelola pada port 5432 (wajib SSL/TLS) beserta layanan gateway GoTrue Auth.
5. **Google AI Platform:** Menyediakan endpoint API Gemini 2.0 Flash via HTTPS.

---

## 5. Bukti Pemenuhan Kebutuhan Non-Fungsional (Tabel 3.7)

| Parameter NFR | Rancangan Naskah | Bukti Implementasi di Kode | Status Kesesuaian | Keterangan & Catatan |
|:---|:---|:---|:---|:---|
| **(a) HTTPS / TLS** | Seluruh komunikasi klien dan backend wajib terenkripsi HTTPS/TLS | [backend/app/main.py:86](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/main.py#L86), [frontend/.env.example:2,6](file:///c:/Users/wira1/project/ceamis_capstone/frontend/.env.example#L2), [mobile/README.md:52](file:///c:/Users/wira1/project/ceamis_capstone/mobile/README.md#L52) | SESUAI | CORS mengizinkan origin HTTPS produksi (`https://ceamis.vercel.app`). Endpoint backend terhubung ke domain HTTPS (`https://danuzen-ceamis-backend.hf.space` dan `https://<ref>.supabase.co`). Terminasi TLS dilakukan di edge ingress gateway cloud. |
| **(b) RBAC (Role-Based Access Control)** | Pemisahan peran Pengguna (User) dan Administrator (Admin) secara ketat | [frontend/src/app/auth/page.tsx:51-56](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/auth/page.tsx#L51-L56), [backend_nestjs_archive/supabase/migrations/001_initial_schema.sql:243-340](file:///c:/Users/wira1/project/ceamis_capstone/backend_nestjs_archive/supabase/migrations/001_initial_schema.sql#L243-L340) | SEBAGIAN [BERBEDA DARI NASKAH] | Pada Next.js, peran admin ditegakkan berdasarkan metadata pengguna atau email admin (`admin@ceamis.com`). Pada PostgreSQL Supabase, RLS membatasi baris per `auth.uid() = user_id`. Namun pada backend FastAPI, router `/api/v1/admin` belum memasang dependency guard JWT secara ketat di kodenya. |
| **(c) Audit Log** | Pencatatan setiap aksi intervensi dan tata kelola model | [backend/app/api/admin.py:98-146, 157-263](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L98-L146), [backend/app/models/pre_purchase.py:158-175](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/models/pre_purchase.py#L158-L175) | SESUAI | Audit log dicatat saat admin melakukan rollback model (menyimpan target model, alasan wajib *reason*, dan timestamp) serta saat meninjau log intervensi pra-pembelian pengguna. |
| **(d) Retensi Data Sensitif / Foto Struk** | Pembatasan penyimpanan gambar struk dan perlindungan privasi | [mobile/lib/features/transaction/screens/add_transaction_screen.dart:180-210](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L180-L210), [backend/app/api/ocr.py:21-23](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L21-L23) | SESUAI | Pemrosesan citra struk dilakukan on-device di memori ponsel via Google ML Kit Text Recognition. Hanya teks mentah (`raw_text`) yang dikirim ke backend. Berkas foto fisik tidak diunggah atau disimpan permanen di server backend. |
| **(e) Kontainerisasi (Portabilitas)** | Backend dapat dijalankan secara konsisten via Docker container | [backend/Dockerfile:1-26](file:///c:/Users/wira1/project/ceamis_capstone/backend/Dockerfile#L1-L26) | SESUAI | Menggunakan base image resmi `python:3.11-slim`, konfigurasi variabel lingkungan produksi, instalasi dependensi tanpa cache, dan perintah eksekusi Uvicorn pada port 8000. |
| **(f) Versi Minimum Seluler** | Kompatibilitas perangkat mobile Android dan iOS | [mobile/android/app/build.gradle.kts:27](file:///c:/Users/wira1/project/ceamis_capstone/mobile/android/app/build.gradle.kts#L27), [mobile/ios/Runner.xcodeproj/project.pbxproj:353](file:///c:/Users/wira1/project/ceamis_capstone/mobile/ios/Runner.xcodeproj/project.pbxproj#L353), [mobile/pubspec.yaml:32](file:///c:/Users/wira1/project/ceamis_capstone/mobile/pubspec.yaml#L32) | SESUAI | Android: `minSdkVersion = 21` (Android 5.0 Lollipop, prasyarat ML Kit Text Recognition); iOS: `IPHONEOS_DEPLOYMENT_TARGET = 13.0` (iOS 13.0 ke atas). |
| **(g) Peramban Web yang Didukung** | Kompatibilitas dasbor web admin pada peramban modern | [frontend/package.json:19-21](file:///c:/Users/wira1/project/ceamis_capstone/frontend/package.json#L19-L21) | SESUAI | Menggunakan Next.js 16.2.4 dan React 19.2.4. Peramban yang didukung adalah peramban modern (*evergreen browsers*): Chrome 111+, Microsoft Edge 111+, Firefox 111+, dan Safari 16.4+. |
| **(h) Versi Pustaka Utama** | Versi lingkungan runtime dan framework inti proyek | [mobile/pubspec.yaml:7,20,28](file:///c:/Users/wira1/project/ceamis_capstone/mobile/pubspec.yaml#L7), [frontend/package.json:13,19](file:///c:/Users/wira1/project/ceamis_capstone/frontend/package.json#L13), [backend/requirements.txt:2-4,22-23](file:///c:/Users/wira1/project/ceamis_capstone/backend/requirements.txt#L2-L4), [backend/Dockerfile:2](file:///c:/Users/wira1/project/ceamis_capstone/backend/Dockerfile#L2) | SESUAI | - **Mobile:** Dart `^3.11.5`, Flutter 3.x, Riverpod `^2.5.1`, Supabase Flutter `^2.8.3`.<br/>- **Web Admin:** Next.js `16.2.4`, React `19.2.4`, Prisma Client `^6.19.3`.<br/>- **Backend:** Python `3.11`, FastAPI `0.136.1`, Uvicorn `0.46.0`, Pydantic `2.12.3`, SQLAlchemy `>=2.0.0`, Supabase `>=2.13.0`.<br/>- **Basis Data:** PostgreSQL 15+ (Supabase Managed Cloud). |
