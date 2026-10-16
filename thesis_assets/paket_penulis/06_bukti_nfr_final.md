# Bukti Pemenuhan Kebutuhan Non-Fungsional (NFR) Final CEAMIS 2.0
## Standar ISO/IEC 25010:2023

Dokumen ini menyajikan pembuktian komprehensif atas karakteristik kualitas perangkat lunak CEAMIS 2.0 berdasarkan standar internasional **ISO/IEC 25010:2023** (*Product Quality Model*). Setiap karakteristik mencakup bukti konkret yang ada di kode atau hasil pengukuran empiris, serta batasan aspek yang secara faktual **TIDAK ADA** dalam repositori cabang `thesis/perbaikan-pilot`.

---

## 1. Kesesuaian Fungsional (*Functional Suitability*)

Menilai sejauh mana fungsi sistem memenuhi kebutuhan yang dinyatakan dan tersirat saat digunakan dalam kondisi yang ditentukan.

### A. Bukti Nyata di Kode:
1. **Kelengkapan Fungsional (*Functional Completeness*):** Dari 13 Kebutuhan Fungsional final, sebanyak 9 FR telah beroperasi secara penuh (alur *informed consent*, inferensi evaluasi risiko pra-pembelian, respons 3 tindakan, refleksi pasca-keputusan, manajemen versi model, dan log audit admin), sedangkan 4 FR berstatus sebagian ([05_status_fr_final.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/paket_penulis/05_status_fr_final.md)).
2. **Kebenaran Fungsional (*Functional Correctness*):** Pipeline inferensi risiko mengevaluasi 7 fitur kontekstual temporal tanpa kebocoran data (*data leakage*), menghasilkan probabilitas risiko yang dikalibrasi, memetakan tingkat risiko (*LOW*, *MEDIUM*, *HIGH*), dan memberikan penjelasan faktor pemicu berbasis aturan XAI ([backend/app/services/pre_purchase_risk.py:120-245](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L120-L245)).
3. **Kepatutan Fungsional (*Functional Appropriateness*):** Fitur pemindaian struk cerdas (*Smart OCR*) memadukan ekstraksi teks lokal on-device dan parsing teks mentah via Gemini 2.0 Flash ([backend/app/api/ocr.py:24-185](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L24-L185)).

### B. Yang TIDAK ADA:
- **TIDAK ADA eksekusi pembayaran atau debit rekening otomatis:** Sistem tidak terhubung ke API payment gateway, Core Banking, atau perbankan terbuka (*Open Banking*). Sistem beroperasi murni sebagai penasihat pra-pembelian (*advisory decision-support system*).
- **TIDAK ADA sinkronisasi live transaksi mobile ke PostgreSQL:** Mutasi transaksi manual di aplikasi mobile saat ini masih dikelola pada state Riverpod lokal dan belum terhubung secara persisten ke REST API Supabase.

---

## 2. Efisiensi Performa (*Performance Efficiency*)

Menilai kinerja sistem relatif terhadap jumlah sumber daya yang digunakan pada kondisi yang ditentukan.

### A. Bukti Nyata Hasil Pengukuran:
1. **Waktu Respons API Inferensi Pra-Pembelian:**
   Berdasarkan pengujian latensi empiris resmi yang tercatat pada [thesis_assets/F6_hasil_pengukuran_latensi.json](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/F6_hasil_pengukuran_latensi.json) ($N = 50$ iterasi pengujian):
   
   | Skenario Pengujian | Min (ms) | Median / P50 (ms) | Mean (ms) | P90 (ms) | P95 (ms) | P99 (ms) | Max (ms) | Standar Deviasi |
   |:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
   | **Pengguna dengan Riwayat Aktif** | 16,80 | 17,53 | 18,81 | 19,35 | 20,02 | 68,44 | 68,44 | 7,22 ms |
   | **Pengguna Baru (*Cold-Start*)** | 16,82 | 17,32 | 17,63 | 18,44 | 20,45 | 22,64 | 22,64 | 1,07 ms |

   > **Kondisi Pengukuran Faktual:** Pengukuran dilakukan pada lingkungan sistem proses lokal yang sama (*in-process* Python 3.13 / win32), mode repositori memori (`repository_mode: "memory"`), tanpa latensi jaringan internet dan tanpa I/O basis data jaringan. Pada basis data Supabase nyata, latensi akan bertambah sesuai RTT jaringan (estimasi +50 sampai 150 ms).
2. **Pemanfaatan Sumber Daya Komputasi (*Resource Utilization*):** Artefak model Random Forest berukuran sangat ringkas (~500 KB) dan dieksekusi secara instan di CPU tanpa memerlukan akselerasi kartu grafis (GPU).
3. **Kapasitas Konkurensi (*Capacity*):** Backend FastAPI mengimplementasikan loop kejadian asinkron (*asynchronous ASGI event loop*) via Uvicorn untuk melayani permintaan non-blocking.

### B. Yang TIDAK ADA:
- **TIDAK ADA caching terdistribusi:** Repositori tidak mengonfigurasi Redis atau Memcached untuk caching hasil evaluasi risiko atau session token.
- **TIDAK ADA mekanisme load balancing horizontal internal:** Bergantung sepenuhnya pada arsitektur penyedia hosting PaaS/Cloud.

---

## 3. Kompatibilitas (*Compatibility*)

Menilai kemampuan sistem bertukar informasi dan melakukan fungsinya saat berbagi lingkungan perangkat keras atau lunak.

### A. Bukti Nyata di Kode:
1. **Koeksistensi (*Co-existence*):** Backend FastAPI (port 8000) dan antarmuka web Next.js (port 3000) dapat beroperasi secara paralel pada satu mesin pengembangan tanpa konflik alokasi port.
2. **Interoperabilitas Antarmuka Data (*Interoperability*):** Seluruh komunikasi lintas komponen (Mobile Flutter ke FastAPI, Frontend Next.js ke FastAPI) menggunakan standar RESTful JSON (`application/json`) dengan validasi skema DTO Pydantic v2.
3. **Spesifikasi Platform Klien:**
   - **Android:** Dikonfigurasi menggunakan `minSdk = flutter.minSdkVersion` (Android API 21 / Android 5.0 Lollipop ke atas), target SDK Android 33/34 ([mobile/android/app/build.gradle.kts:27-28](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/android/app/build.gradle.kts#L27-L28)).
   - **iOS:** Dikonfigurasi dengan target minimum `IPHONEOS_DEPLOYMENT_TARGET = 13.0` (iOS 13.0 ke atas) ([mobile/ios/Runner.xcodeproj/project.pbxproj:353](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/ios/Runner.xcodeproj/project.pbxproj#L353)).
   - **Peramban Web Dasbor Admin:** Didukung pada seluruh peramban modern berbasis mesin Chromium (Google Chrome, Microsoft Edge, Brave versi 90+), Safari 14+, dan Mozilla Firefox 88+ dengan kapabilitas JavaScript ES2020+.

### B. Yang TIDAK ADA:
- **TIDAK ADA dukungan peramban lama:** Tidak mendukung Microsoft Internet Explorer atau peramban yang tidak mendukung spesifikasi CSS Flexbox/Grid dan ES2020.
- **TIDAK ADA build desktop native:** Tidak ada konfigurasi build khusus untuk Windows .exe atau macOS .app native pada aplikasi Flutter.

---

## 4. Kapabilitas Interaksi (*Interaction Capability / Usability*)

Menilai kemudahan sistem dipahami, dipelajari, digunakan, dan menarik bagi pengguna.

### A. Bukti Nyata di Kode:
1. **Kejelasan Penyajian Informasi (*Appropriateness Recognisability*):** Lembar intervensi pra-pembelian menyajikan status risiko visual dengan kode warna (Hijau untuk Rendah, Kuning untuk Sedang, Merah untuk Tinggi) dan faktor pemicu kontekstual XAI ([mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart)).
2. **Kemudahan Operasional (*Operability*):** Penyajian respons intervensi terstruktur dengan 3 tindakan tegas: *PROCEED* (Lanjut), *ADJUST* (Sesuaikan), dan *POSTPONE* (Tunda).
3. **Pengingat Refleksi Otomatis (*In-App Reminder*):** Pengingat konfirmasi pasca-keputusan muncul otomatis dalam bentuk banner beranda pada jendela waktu 24–72 jam setelah transaksi tanpa menuntut tindakan proaktif dari pengguna ([mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart)).
4. **Perlindungan Kesalahan Masukan Pengguna (*User Error Protection*):** Validasi form pada mobile dan validasi Pydantic di backend menolak nominal belanja bernilai negatif atau nol, serta memastikan format teks terstruktur.

### B. Yang TIDAK ADA:
- **TIDAK ADA panduan antarmuka suara (*Voice Guidance*):** Sistem tidak mendukung input atau panduan suara.
- **TIDAK ADA dukungan multi-bahasa dinamis (i18n):** Antarmuka saat ini sepenuhnya menggunakan Bahasa Indonesia baku.

---

## 5. Keandalan (*Reliability*)

Menilai kemampuan sistem mempertahankan tingkat performa yang ditentukan dalam kondisi tertentu.

### A. Bukti Nyata di Kode:
1. **Toleransi Kesalahan & Penurunan Fungsi Bertahap (*Fault Tolerance & Graceful Degradation*):**
   - **Fallback OCR:** Apabila pemanggilan Google Gemini API gagal, kehabisan kuota, atau kunci tidak tersedia, sistem beralih ke parser regex deterministik lokal ([backend/app/api/ocr.py:110-185](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/ocr.py#L110-L185)).
   - **Fallback Inferensi Model:** Jika pemuatan model Random Forest gagal atau terdeteksi kondisi cold-start (< 5 transaksi historis), sistem secara mulus beralih ke *RuleBasedBaseline* heuristik ([backend/app/services/pre_purchase_risk.py:80-115](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L80-L115)).
   - **Fallback Kurikulum Edukasi:** Jika sakelar LLM dinonaktifkan (`LLM_EDUCATION_ENABLED=false`), sistem menyajikan kurikulum statis lokal terstruktur tanpa kesalahan antarmuka ([backend/app/api/education.py:20-100](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/education.py#L20-L100)).
2. **Ketersediaan & Pemulihan Cepat (*Recoverability*):**
   - Panel admin web menyediakan mekanisme *One-Click Model Rollback* via endpoint `POST /api/v1/admin/models/rollback` untuk mengembalikan versi model operasional ke versi stabil sebelumnya bila terjadi anomali ([backend/app/api/admin.py:49-81](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L49-L81)).
   - Endpoint pemeriksaan kesehatan sistem `GET /health` ([backend/app/main.py:98-108](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/main.py#L98-L108)).
3. **Cakupan Pengujian (*Testing Suite*):**
   - **Backend:** 10 berkas uji unit dengan 53 kasus uji yang memvalidasi alur autentikasi JWT admin, perekaman persetujuan etik, kendali sakelar LLM, persistensi memori/db, telemetri jeda waktu, dan ekspor data pseudonim.
   - **Mobile:** 1 berkas pengujian Flutter komprehensif (`post_decision_reminder_test.dart`) dengan 10 kasus uji otomatis yang memvalidasi transisi logika jendela waktu 24 jam, 72 jam, kedaluwarsa, serta telemetri refleksi (10/10 lulus).

### B. Yang TIDAK ADA:
- **TIDAK ADA failover multi-wilayah basis data:** Tidak ada konfigurasi replikasi basis data multi-region otomatis pada kode.

---

## 6. Keamanan (*Security*)

Menilai sejauh mana sistem melindungi informasi dan data sehingga pihak yang tidak berwenang tidak dapat membaca atau memodifikasinya.

### A. Bukti Nyata di Kode:
1. **Kerahasiaan & Pseudonimisasi Penelitian (*Confidentiality*):**
   - Skrip ekspor penelitian [export_pilot_data.py](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/scripts/export_pilot_data.py) menerapkan hashing HMAC-SHA256 pada seluruh pengenal UUID pengguna menggunakan kunci rahasia garam (*salt*).
   - Seluruh identitas langsung (nama lengkap, surel, nomor telepon) dihapus sepenuhnya dari dataset ekspor.
   - Berkas manifes ekspor dan direktori `backend/exports/` diisolasi dari indeks pelacakan git via [.gitignore](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/.gitignore).
   - Arsitektur *Zero Image Egress* pada Smart OCR: Citra struk dipindai secara lokal di ponsel cerdas via Google ML Kit on-device; server hanya menerima teks mentah hasil ekstraksi tanpa transmisi berkas gambar.
2. **Kontrol Akses Berbasis Peran (*Role-Based Access Control / RBAC*):**
   - **FastAPI Backend:** Seluruh rute `/api/v1/admin/*` diproteksi oleh dependensi `verify_admin_role` pada [backend/app/utils/auth.py:78-102](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/utils/auth.py#L78-L102), yang memvalidasi tanda tangan JWT Supabase (`HS256`) menggunakan `SUPABASE_JWT_SECRET` dan memastikan nilai klaim `app_metadata.role == 'admin'`. Akses tanpa peran admin ditolak dengan status `403 Forbidden`.
   - **Row-Level Security (RLS) PostgreSQL:** 5 berkas migrasi SQL mengaktifkan kebijakan RLS ketat pada seluruh tabel publik. Pengguna biasa hanya diizinkan membaca/mengubah baris miliknya sendiri (`auth.uid() = user_id`), sedangkan tabel `audit_logs` dan `model_versions` dibatasi hanya untuk peran admin.
3. **Akuntabilitas & Jejak Audit (*Non-repudiation & Audit Trail*):**
   - Seluruh mutasi model (seperti tindakan rollback oleh admin) dan keputusan pra-pembelian dicatat ke tabel `public.audit_logs` ([001_pre_purchase_and_governance.sql:102-118](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/db/migrations/001_pre_purchase_and_governance.sql#L102-L118)).
4. **HTTPS / TLS:**
   - **Konfigurasi:** Di level kode sumber aplikasi (FastAPI / Uvicorn), server mendengarkan port HTTP biasa (port 8000). Penanganan enkripsi transport HTTPS/TLS didelegasikan secara penuh ke lapisan infrastruktur *reverse proxy* / *API Gateway* di lingkungan cloud produksi (misalnya Cloudflare, Vercel Edge Network, atau ingress Hugging Face Spaces HTTPS).
5. **Ketergantungan pada Supabase:**
   - **Analisis Portabilitas:** Backend FastAPI memiliki ketergantungan erat pada ekosistem Supabase Auth dan Postgres:
     - Verifikasi token JWT membaca klaim spesifik Supabase (`app_metadata`, `user_metadata`).
     - Kebijakan RLS pada skema SQL memanggil fungsi `auth.uid()` dan mereferensikan tabel privat `auth.users(id)`.
     - *Kesimpulan:* Backend **TIDAK DAPAT** dipindahkan ke penyedia basis data PostgreSQL vanilla lain (misalnya Amazon RDS atau Google Cloud SQL murni) tanpa menulis ulang lapisan autentikasi pengguna dan memodifikasi definisi Foreign Key serta fungsi RLS.

### B. Yang TIDAK ADA:
- **TIDAK ADA pelindung rute sisi server (*Server-Side Route Guard*) pada Web Admin:** Antarmuka Next.js pada `frontend/src/app/admin/layout.tsx` tidak memasang middleware redirect; proteksi hanya bergantung pada penolakan 401/403 dari API backend saat fetching data.
- **TIDAK ADA mekanisme Rate Limiting terpasang:** Belum ada pembatas laju permintaan (*rate limiter*) seperti `slowapi` pada rute publik backend.
- **TIDAK ADA enkripsi kolom (*Column-Level Encryption*):** Basis data tidak menerapkan pgcrypto untuk enkripsi nominal transaksi di tingkat kolom tabel (bergantung pada enkripsi *at-rest* bawaan cloud storage).

---

## 7. Kemudahan Pemeliharaan (*Maintainability*)

Menilai tingkat efektivitas dan efisiensi sistem dalam dimodifikasi, ditingkatkan, atau disesuaikan.

### A. Bukti Nyata di Kode:
1. **Modularitas Arsitektur (*Modularity*):** Pemisahan tegas tanggung jawab kode ke dalam lapisan API Router (`backend/app/api/`), Business Service (`backend/app/services/`), Pydantic Schema DTO (`backend/app/schemas/`), dan Utilitas Autentikasi (`backend/app/utils/`).
2. **Keterpakaian Ulang Kode (*Reusability*):** Repositori data terpusat (`pre_purchase_repository.py`) membungkus operasi basis data sehingga abstraksi logika pra-pembelian tidak terikat kaku pada implementasi SQL spesifik.
3. **Kemudahan Modifikasi Model (*Modifiability*):** Registri model machine learning berbasis metadata berkas JSON (`backend/artifacts_risk/model_registry.json`) memungkinkan pendaftaran versi model baru hasil pelatihan ulang tanpa perlu merombak logika routing inferensi.

### B. Yang TIDAK ADA:
- **TIDAK ADA dokumentasi Swagger/OpenAPI kustom:** Repositori mengandalkan dokumentasi otomatis bawaan FastAPI (`/docs`) tanpa halaman portal pengembang kustom.

---

## 8. Fleksibilitas & Portabilitas (*Flexibility*)

Menilai kemampuan sistem beradaptasi terhadap perubahan lingkungan operasional atau teknologi.

### A. Bukti Nyata di Kode:
1. **Konfigurasi Berbasis Lingkungan (*Adaptability*):** Perilaku sistem dapat dialihkan melalui variabel lingkungan tanpa mengubah kode:
   - Sakelar persistensi: `PERSISTENCE_BACKEND=memory` atau `PERSISTENCE_BACKEND=db`.
   - Sakelar kendali LLM: `LLM_ENABLED`, `LLM_OCR_ENABLED`, `LLM_INSIGHT_ENABLED`, `LLM_EDUCATION_ENABLED`.
   - Sakelar model onboarding: `ONBOARDING_MODELS_ENABLED`.
2. **Kontainerisasi Standar (*Containerisation*):**
   Tersedia berkas [backend/Dockerfile](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/Dockerfile) berbasis `python:3.11-slim` dengan konfigurasi direktori kerja `/code`, instalasi pip bersih, dan perintah eksekusi Uvicorn pada port 8000.
3. **Portabilitas Klien Seluler:**
   Aplikasi mobile dibangun di atas Flutter Framework, memungkinkan kompilasi ke Android (APK/AAB) dan iOS (IPA) dari satu basis kode Dart tunggal.

### B. Yang TIDAK ADA:
- **TIDAK ADA berkas Docker Compose orkestrasi lengkap:** Repositori tidak menyertakan `docker-compose.yml` terintegrasi yang menyatukan kontainer backend, frontend web, dan basis data lokal dalam satu orkestrasi perintah.

---

## 9. Keselamatan & Keamanan Finansial Partisipan (*Safety*)

Menilai sejauh mana sistem mencegah timbulnya kerugian finansial, risiko bahaya operasional, atau pelanggaran etika terhadap partisipan.

### A. Bukti Nyata di Kode:
1. **Prinsip *Zero Custody* & *Advisory Only*:**
   - Arsitektur sistem CEAMIS dirancang **tanpa akses terhadap saldo, rekening bank, kartu kredit/debit, atau akun dompet digital partisipan**.
   - Sistem tidak memiliki izin mengeksekusi transfer dana atau mutasi perbankan apa pun. Seluruh dialog intervensi pra-pembelian bersifat penasihat (*advisory*) semata.
   - Keputusan akhir belanja 100% berada pada kehendak bebas pengguna.
2. **Penegakan Etika Penelitian & Persetujuan Partisipan (*Informed Consent Protocol*):**
   - Sebelum intervensi pra-pembelian aktif mencatat telemetri penelitian, pengguna disajikan Lembar Informasi Penelitian terpusat pada [consent_text.dart](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/mobile/lib/core/constants/consent_text.dart).
   - Pengguna berhak menarik persetujuan partisipasi penelitian (*withdrawal*) kapan saja melalui menu Profil tanpa pembatasan fungsionalitas dasar aplikasi.
   - Telemetri jeda waktu refleksi (`decision_latency_ms`) hanya dicatat pada basis data jika status persetujuan terbukti aktif (`has_active_consent == True`).

### B. Yang TIDAK ADA:
- **TIDAK ADA pemblokiran transaksi sepihak:** Sistem tidak memiliki mekanisme memblokir transaksi pengguna secara paksa di merchant atau aplikasi pihak ketiga.
