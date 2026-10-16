# Indeks Paket Penulis Tesis CEAMIS 2.0 (Tugas G10)

Dokumen ini merupakan indeks induk, ringkasan eksekutif, dan panduan verifikasi untuk seluruh berkas artefak yang dihimpun dalam folder `thesis_assets/paket_penulis/`. Paket ini dirancang khusus untuk memfasilitasi tim penulis naskah Bab 3, Bab 4, dan Bab 5 Tesis dengan menyajikan bukti-bukti empiris, status fungsional, analisis non-fungsional, hasil pelatihan model, dan 14 diagram teknis yang 100% selaras dengan kode sumber aktif cabang `thesis/perbaikan-pilot`.

---

## 1. Tabel Inventaris Berkas Paket Penulis

| Nama Berkas | Dari Tugas | Isi Singkat | Status |
|:---|:---:|:---|:---:|
| **00_INDEKS.md** | G10 | Indeks induk paket, ringkasan audit, status git, lingkungan, dan daftar periksa manual. | **LENGKAP** |
| **PROGRESS_PAKET.md** | G0–G10 | Lembar kendali pelacakan status pengerjaan seluruh tugas paket penulis (G0 s.d. G10). | **LENGKAP** |
| **01_verifikasi_lanjutan.md** | G1 | Hasil investigasi 7 isu lanjutan: skema kueri statistik, guard admin, route web, konsistensi metrik, isolasi ekspor, status persistensi DB, dan dependensi NestJS. | **LENGKAP** |
| **02_koreksi_kecil.md** | G3 | Dokumentasi perubahan kode: pembersihan data rekaan consent, isolasi manifes ekspor dari git, penambahan `.gitignore`, dan README data sintetis. | **LENGKAP** |
| **03_koreksi_F6.md** | G2 | Koreksi laporan akhir konsolidasi F6: revisi rangkuman F0, penggantian tabel Bagian 7, pemisahan metrik baseline vs Random Forest, dan formulasi kesiapan bersyarat. | **LENGKAP** |
| **04_kesiapan_pilot.md** | G4 | Panduan manual kesiapan lapangan: urutan 5 migrasi SQL Supabase, variabel lingkungan tanpa nilai, cara pemberian peran admin, teks consent, dan uji coba live DB. | **LENGKAP** |
| **05_status_fr_final.md** | G5 | Status implementasi faktual 13 Kebutuhan Fungsional (9 SELESAI, 4 SEBAGIAN) beserta bukti path:baris, layar UI, endpoint, modul backend, dan tabel DB. | **LENGKAP** |
| **06_bukti_nfr_final.md** | G6 | Pembuktian kebutuhan non-fungsional standar ISO/IEC 25010:2023, data latensi resmi F6, analisis RBAC, arsitektur TLS, ketergantungan Supabase, dan prinsip Zero Custody. | **LENGKAP** |
| **07_verifikasi_model_final.md** | G7 | Verifikasi mendalam machine learning: `class_weight='balanced'`, ketiadaan SMOTE, pembagian temporal bulan 1-3 vs 4, StandardScaler, 7 fitur kontekstual, sirkularitas label, dan 8 metrik evaluasi. | **LENGKAP** |
| **07b_keluaran_pelatihan_ulang.txt** | G7 | Log konsol hasil eksekusi ulang nyata pipeline pelatihan model risiko pada lingkungan aktif. | **LENGKAP** |
| **08_catatan_diagram.md** | G8 | Catatan verifikasi 14 sumber diagram: jumlah simpul, status sintaks, ketiadaan simpul rekaan, dan justifikasi pengecualian komponen. | **LENGKAP** |
| **09_panduan_tangkapan_layar.md** | G9 | Panduan operasional pengambilan tangkapan layar untuk naskah tesis (5 halaman wajib mobile, 4 halaman tambahan, 3 halaman admin web, dan daftar rute yang dilarang difoto). | **LENGKAP** |
| **D01_erd_ringkas.mmd** | G8 | ERD ringkas Mermaid: PK, FK, dan kolom esensial dari migrasi SQL `000_*` sampai `003_*`. | **LENGKAP** |
| **D02_erd_lengkap.mmd** | G8 | ERD komprehensif seluruh tabel dan atribut nyata dari migrasi SQL dan skema Prisma. | **LENGKAP** |
| **D03_use_case.puml** | G8 | Diagram Use Case PlantUML resmi untuk 13 Kebutuhan Fungsional (User & Admin). | **LENGKAP** |
| **D04_use_case_alt.mmd** | G8 | Diagram Use Case alternatif dalam format Mermaid flowchart. | **LENGKAP** |
| **D05_arsitektur.mmd** | G8 | Diagram arsitektur sistem: Flutter Mobile, Next.js Web, FastAPI Backend, Supabase PaaS, dan Google Gemini Cloud. | **LENGKAP** |
| **D06_deployment.mmd** | G8 | Diagram topologi deployment kontainer Docker Linux, Vercel/Node.js, dan cloud managed database. | **LENGKAP** |
| **D07_modul_struktur.mmd** | G8 | Diagram struktur arsitektur lapisan backend FastAPI (`api`, `schemas`, `services`, `utils`, `models`). | **LENGKAP** |
| **D08_sequence_pra_pembelian.mmd** | G8 | Sequence diagram interaksi 3 fase (Check, Decide, Feedback) antar-komponen sistem. | **LENGKAP** |
| **D09_alur_pra_pembelian.mmd** | G8 | Flowchart logika intervensi pra-pembelian, evaluasi risiko, respons 3 tindakan, dan banner 24-72 jam. | **LENGKAP** |
| **D10_status_transaksi.mmd** | G8 | State diagram siklus hidup pemeriksaan pra-pembelian dari draf hingga evaluasi atau kedaluwarsa. | **LENGKAP** |
| **D11_crispdm_increment3.mmd** | G8 | Siklus 6 fase metodologi CRISP-DM Inkrement 3 beserta artefak nyata tiap tahapan. | **LENGKAP** |
| **D12_split_data.mmd** | G8 | Diagram alur pembagian data temporal (Bulan 1-3 latih vs Bulan 4 uji) dan pipeline praproses. | **LENGKAP** |
| **D13_field_pilot.mmd** | G8 | Diagram alur pelaksanaan uji coba lapangan (pemisahan tahapan sistem dan luar sistem). | **LENGKAP** |
| **D14_riwayat_git.mmd** | G8 | Mermaid Gantt chart linimasa commit repositori dikelompokkan per milestone pengembangan. | **LENGKAP** |
| **paket_penulis.zip** | G10 | Arsip terkompresi ZIP seluruh berkas paket penulis untuk kemudahan distribusi. | **LENGKAP** |

---

## 2. Status Repositori Git

### A. Riwayat Komit Terakhir (`git log --oneline -n 8`):
```text
0ab3d62 G3: koreksi teks persetujuan, isolasi berkas ekspor, dan dokumentasi data sintetis
abfaa99 F6: perbarui 7 sumber diagram final dan mutakhirkan laporan akhir konsolidasi
02a5b9c F3: pembaruan kerangka persetujuan partisipan dengan klausul pemrosesan pihak ketiga
4344c04 docs(progress): update commit hash F12 in PROGRESS_PERBAIKAN.md
0558458 F12: audit model tambahan, kendali onboarding, dan verifikasi zero-egress foto struk
8372c20 docs(progress): update commit hash F11 in PROGRESS_PERBAIKAN.md
c2b23e8 F11: audit dan kendali modular LLM dengan fallback deterministik dan safety guardrails
92125ea F10: telemetri jeda waktu refleksi keputusan dan penegakan persetujuan privasi
```

### B. Perubahan Kode terhadap Cabang Asal (`git diff --stat origin/thesis/perbaikan-pilot HEAD`):
```text
 .gitignore                                      |  3 ++
 backend/.gitignore                              |  3 +-
 backend/artifacts_risk/README_DATA_SINTETIS.md  | 37 +++++++++++++++++++++++++
 backend/exports/pilot_data/export_manifest.json | 32 ---------------------
 backend/scripts/export_pilot_data.py            |  1 -
 mobile/lib/core/constants/consent_text.dart     |  6 ++--
 6 files changed, 45 insertions(+), 37 deletions(-)
```

---

## 3. Spesifikasi Lingkungan Pengembangan (Dari Hasil Tugas G1)

- **Sistem Operasi Host:** Windows 11 Home / win32
- **Runtime Python:** Python 3.11.9 (System Host) / Python 3.13.14 (Virtual Environment)
- **Framework Aplikasi Bergerak:** Flutter SDK 3.22.0 / Dart SDK 3.4.0
- **Framework Web Dasbor:** Node.js v20.14.0 / Next.js 14.2.33 / React 18
- **Pustaka Machine Learning Backend:**
  - Scikit-Learn: 1.6.1
  - Pandas: 2.2.3
  - NumPy: 2.2.3
  - Joblib: 1.4.2
- **Basis Data Terkelola:** PostgreSQL 15 via Supabase Cloud (Region AWS ap-northeast-1)

---

## 4. Lima Temuan Kritis yang Masih Terbuka (*Open Findings*)

Berdasarkan audit komprehensif, penulis naskah harus memperhatikan 5 temuan keterbatasan sistem berikut agar tidak menimbulkan kerancuan metodologis:

1. **Ketidakcocokan Skema Kueri Statistik (`user_stats_service.py`):**
   Layanan statistik memanggil tabel `/rest/v1/budgets`, `/rest/v1/goals`, dan `/rest/v1/users` yang tidak ada dalam skema SQL Supabase (`000_initial_schema.sql` hanya memiliki `public.planning` dan `public.user_profiles`). Saat beralih ke `PERSISTENCE_BACKEND=db`, kueri ini berpotensi gagal dan memicu nilai *fallback cold-start*.
2. **Ketiadaan Transmisi Mutasi Data Transaksi Mobile ke Database:**
   Fitur pencatatan transaksi manual dan anggaran pada aplikasi mobile Flutter saat ini masih beroperasi pada state lokal Riverpod dan belum memanggil mutasi REST API Supabase secara live.
3. **Ketiadaan *Server-Side Route Guard* pada Web Admin:**
   Halaman antarmuka web admin pada Next.js (`/admin/*`) tidak memiliki middleware server redirect; pengguna publik secara teknis dapat membuka halaman di peramban, meskipun pemanggilan data ke FastAPI akan ditolak (401/403).
4. **Nilai Bawaan Lingkungan `PERSISTENCE_BACKEND=memory`:**
   Backend FastAPI secara default berjalan pada mode RAM. Administrator wajib secara eksplisit mengatur `PERSISTENCE_BACKEND=db` di `.env` produksi agar data evaluasi risiko dan log audit tidak hilang saat server restart.
5. **Rute Dasbor Pengguna Web di Luar Cakupan Penelitian:**
   Halaman `/dashboard/planning` di web frontend memuat kalkulator instrumen investasi (saham, emas, kripto) yang berada di luar batasan riset pengendalian pengeluaran tidak terencana dan tidak boleh diuji pada partisipan pilot.

---

## 5. Daftar Periksa Prosedur Manual Sebelum Pilot Lapangan

Pengguna/peneliti **MASIH HARUS** menyelesaikan langkah-langkah manual berikut secara mandiri (mengacu pada [04_kesiapan_pilot.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/paket_penulis/04_kesiapan_pilot.md)):

- [ ] **1. Migrasi SQL Supabase:** Eksekusi 5 berkas SQL migrasi secara berurutan pada Supabase SQL Editor (`000_initial_schema.sql`, `000_model3_onboarding.sql`, `001_pre_purchase_and_governance.sql`, `002_consent_records.sql`, dan `003_telemetry_decision_latency.sql`).
- [ ] **2. Konfigurasi Lingkungan Server:** Isi berkas `backend/.env` produksi dengan nilai riil untuk `PERSISTENCE_BACKEND=db`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `RESEARCH_PSEUDONYMIZATION_SALT`, dan `GEMINI_API_KEY`.
- [ ] **3. Injeksi Peran Admin:** Berikan peran admin pada akun peneliti melalui kueri SQL dari `backend/scripts/set_admin_role.sql`.
- [ ] **4. Personalisasi Teks Persetujuan Resmi:** Buka berkas `mobile/lib/core/constants/consent_text.dart` dan ganti penanda `[NAMA PENELITI]`, `[SURAT ELEKTRONIK PENELITI]`, dan `[NAMA DOSEN PEMBIMBING]` dengan identitas formal yang disetujui komite etik.
- [ ] **5. Pengujian Live Basis Data Riil:** Lakukan uji coba langsung pada basis data PostgreSQL hidup untuk memverifikasi isolasi Row-Level Security (RLS), mode persistensi `db`, alur penarikan izin (*withdrawal*), dan ekspor CSV pseudonim.

---

## 6. Laporan Hasil Audit Keamanan Paket Penulis

Pemeriksaan keamanan otomatis telah dilakukan terhadap seluruh berkas dalam direktori `thesis_assets/paket_penulis/`:
- **Kunci Rahasia & Token API:** **NIHIL (Bebas 100%)**. Tidak ditemukan token JWT aktif, kunci API Gemini (`AIza...`), kunci Stripe/Midtrans, atau secret key Supabase.
- **Kunci Garam (*Salt*):** **NIHIL (Bebas 100%)**. Fragmen salt `ceam***2026` telah dieliminasi dari manifes dan skrip ekspor.
- **Data Pribadi & Surel Riil:** **NIHIL (Bebas 100%)**. Seluruh contoh surel menggunakan domain contoh standar RFC 2606 (`example.com`).
- **Integritas Penulisan:** Seluruh dokumen menggunakan Bahasa Indonesia formal tanpa penggunaan tanda pisah panjang em-dash (`—`).
