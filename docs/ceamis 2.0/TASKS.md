# Task Backlog & Execution Roadmap — CEAMIS 2.0

**Metodologi:** Agile Scrum (Sprint 2 Mingguan)  
**Total Durasi:** 5 Sprint (10 Minggu)  
**Tim Inti:**  
* **Wira** (*Project Lead & Fullstack/Mobile Engineer*)  
* **Hafiz** (*AI Engineer & Data/QA Specialist*)  

---

## 📌 Sprint Overview & Timeline

| Sprint | Fokus Utama | Target Deliverable | PIC |
|---|---|---|---|
| **Sprint 1** | Pondasi Backend FastAPI Modular & Skema Database | API Modular aktif (Auth, Transaksi, Budget), Mobile setup selesai | Wira & Hafiz |
| **Sprint 2** | Fitur Inti Pra-Pembelian & Pipeline Data ML | Endpoint `/pre-purchase/check`, dataset transaksi & fitur pra-pembelian | Wira & Hafiz |
| **Sprint 3** | Pelatihan Model Prediksi Risiko & Integrasi Mobile | Model LogReg & RF terlatih (temporal split), UI Pra-Pembelian di Flutter | Hafiz (ML) & Wira (UI) |
| **Sprint 4** | Smart OCR Struk (ML Kit + Gemini) & Feedback Loop | Scan struk kamera + parsing, feedback loop pasca-keputusan | Wira & Hafiz |
| **Sprint 5** | Admin Dashboard (Next.js), UAT, & Finalisasi | Dashboard metrik model, audit log, UAT, dokumentasi final | Wira & Hafiz |

---

## 🏃 Detailed Task Breakdown per Sprint

### Sprint 1: Pondasi Backend FastAPI Modular & Mobile Setup

#### Backend (FastAPI Python)
- [x] **BE-1.1:** Setup struktur direktori modular di `ai-service/app/` (`auth`, `users`, `transactions`, `budgets`, `goals`, `pre_purchase`, `risk_model`, `health_score`, `ocr`, `admin`). *(PIC: Wira)*
- [ ] **BE-1.2:** Inisialisasi koneksi database PostgreSQL Supabase via SQLAlchemy 2.0 / AsyncPG di `database.py`. *(PIC: Wira)*
- [ ] **BE-1.3:** Porting dan implementasi modul `auth/` (verifikasi Supabase JWT, role-based guard `user` vs `admin`). *(PIC: Wira)*
- [ ] **BE-1.4:** Porting endpoint CRUD `transactions/` dari NestJS ke FastAPI dengan validasi Pydantic v2. *(PIC: Wira)*
- [ ] **BE-1.5:** Porting modul `budgets/` dan `goals/` ke FastAPI. *(PIC: Wira)*
- [x] **BE-1.6:** Pembersihan modul lama (hapus K-Means clustering, update health score schema). *(PIC: Hafiz & Wira)*

#### Mobile (Flutter)
- [x] **MOB-1.1:** Setup Flutter project di `mobile/` dengan arsitektur feature-first (`core/`, `features/`). *(PIC: Wira)*
- [x] **MOB-1.2:** Konfigurasi dependency `pubspec.yaml` (Riverpod, GoRouter, Dio, SecureStorage, ML Kit, FL Chart). *(PIC: Wira)*
- [x] **MOB-1.3:** Setup Dio API Client dan Secure Storage untuk persistensi JWT Token. *(PIC: Wira)*
- [x] **MOB-1.4:** Verifikasi build & linter (`flutter analyze` — 0 issues). *(PIC: Wira)*

---

### Sprint 2: Fitur Inti Pra-Pembelian & Feature Engineering

#### AI & Data Pipeline
- [ ] **AI-2.1:** Desain struktur dataset riwayat transaksi pra-pembelian (nominal, kategori, waktu, frekuensi, rasio pagu). *(PIC: Hafiz)*
- [ ] **AI-2.2:** Implementasi script feature extraction 7 fitur kontekstual di `risk_model/features.py`:
  1. `amount_ratio_median`
  2. `budget_remaining_ratio`
  3. `category_frequency`
  4. `day_of_week`
  5. `days_to_reset`
  6. `savings_impact`
  7. `deviation_from_pattern` *(PIC: Hafiz)*
- [ ] **AI-2.3:** Buat pipeline data splitting khusus: **Temporal Split per-user** (mencegah data leakage). *(PIC: Hafiz)*

#### Backend (FastAPI)
- [ ] **BE-2.1:** Implementasi database schema untuk tabel `pre_purchase_checks`, `risk_predictions`, dan `post_decision_feedbacks`. *(PIC: Wira)*
- [ ] **BE-2.2:** Bangun service orkestrasi pra-pembelian di `pre_purchase/service.py`:
  - Hitung median transaksi kategori user.
  - Cek sisa anggaran kategori berjalan.
  - Hitung deviasi dampak terhadap target tabungan terdekat. *(PIC: Wira)*
- [ ] **BE-2.3:** Buat endpoint `POST /api/v1/pre-purchase/check` (menerima nominal & kategori, menghasilkan risk score & dampak). *(PIC: Wira)*
- [ ] **BE-2.4:** Buat baseline rule-based evaluator sebagai pembanding dan fallback model. *(PIC: Hafiz)*

---

### Sprint 3: Pelatihan Model Prediksi Risiko & Integrasi Mobile Pra-Pembelian

#### AI & Model Development
- [ ] **AI-3.1:** Latih model baseline rule-based vs **Logistic Regression** (fokus pada explainability p-value & bobot). *(PIC: Hafiz)*
- [ ] **AI-3.2:** Latih model non-linear **Random Forest** / **Gradient Boosting** sebagai perbandingan performa. *(PIC: Hafiz)*
- [ ] **AI-3.3:** Evaluasi metrik komparasi (Precision, Recall, F1-Score, ROC-AUC) pada data test temporal. *(PIC: Hafiz)*
- [ ] **AI-3.4:** Simpan artefak model terbaik (`.joblib`) di `ai-service/artifacts/` beserta metadata versi. *(PIC: Hafiz)*
- [ ] **AI-3.5:** Implementasi inferensi real-time di `risk_model/predictor.py` dengan latensi < 100ms. *(PIC: Hafiz)*

#### Mobile (Flutter)
- [ ] **MOB-3.1:** Rancang layar UI **Pre-Purchase Check Screen** dengan gaya Neo-Brutalism:
  - Form input rencana nominal & kategori.
  - Kartu hasil peringatan risiko (badge warna dinamis: Hijau, Kuning, Merah).
  - List penjelasan alasan risiko (*explainable factors*).
  - Visualisasi progress bar sisa anggaran sebelum vs sesudah. *(PIC: Wira)*
- [ ] **MOB-3.2:** Hubungkan layar Pra-Pembelian ke endpoint backend menggunakan Riverpod & Dio. *(PIC: Wira)*
- [ ] **MOB-3.3:** Implementasi tombol aksi keputusan: *Lanjut Beli*, *Sesuaikan Nominal*, atau *Tunda Pembelian*. *(PIC: Wira)*

---

### Sprint 4: Smart OCR Struk & Feedback Loop Evaluasi

#### OCR & Parsing Struk
- [ ] **AI-4.1:** Setup prompt engineering terstruktur untuk Gemini 2.0 Flash di `ocr/service.py` untuk mengekstrak tanggal, merchant, total nominal, dan items. *(PIC: Hafiz)*
- [ ] **MOB-4.1:** Integrasi Google ML Kit Text Recognition on-device di Flutter untuk deteksi teks awal dan validasi kualitas foto struk. *(PIC: Wira)*
- [ ] **MOB-4.2:** Buat layar **OCR Review Screen**: Menampilkan hasil pembacaan foto struk dalam form yang dapat diedit oleh pengguna sebelum disimpan. *(PIC: Wira)*
- [ ] **BE-4.1:** Implementasi endpoint `POST /api/v1/ocr/parse-receipt` dengan error-handling dan validasi JSON response. *(PIC: Wira)*

#### Feedback Loop & Health Score
- [ ] **BE-4.2:** Buat endpoint pencatatan feedback pasca-keputusan `POST /api/v1/pre-purchase/feedback`:
  - Menyimpan jawaban user: *"Apakah pembelian ini tepat atau disesali?"*
  - Menyimpan data sebagai dataset latih masa depan (*continuous learning*). *(PIC: Wira)*
- [ ] **MOB-4.3:** Buat widget dialog / kartu notifikasi di dashboard mobile untuk konfirmasi keputusan transaksi kemarin/minggu lalu. *(PIC: Wira)*
- [ ] **BE-4.3:** Implementasi endpoint `POST /api/v1/predict/health-score` dengan formula rule-based 3 pilar deterministik. *(PIC: Hafiz)*

---

### Sprint 5: Admin Dashboard (Next.js), Governance, UAT & Submission

#### Next.js Web (Admin Portal Only)
- [ ] **WEB-5.1:** Bersihkan web frontend dari fitur end-user (fokuskan menjadi Admin Portal murni). *(PIC: Wira)*
- [ ] **WEB-5.2:** Buat halaman **Model Governance**:
  - Menampilkan versi model ML aktif, tanggal rilis, dan metrik performa (Precision/Recall).
  - Fitur tombol *Rollback Model* ke versi sebelumnya. *(PIC: Wira & Hafiz)*
- [ ] **WEB-5.3:** Buat halaman **Intervention Audit Log**:
  - Tabel log intervensi pra-pembelian: tanggal, kategori, nominal, risk level, keputusan user (lanjut/tunda). *(PIC: Wira)*
- [ ] **WEB-5.4:** Buat visualisasi ringkasan efektivitas intervensi (persentase belanja yang berhasil dicegah/ditunda). *(PIC: Wira)*

#### QA, Testing, & Finalisasi
- [ ] **QA-5.1:** Unit test backend FastAPI (pytest) untuk endpoint auth, pre-purchase, dan transaksi. *(PIC: Hafiz)*
- [ ] **QA-5.2:** Stress test latensi endpoint `/pre-purchase/check` (p95 < 400ms). *(PIC: Hafiz)*
- [ ] **QA-5.3:** User Acceptance Testing (UAT) skenario pra-pembelian di ponsel Android & iOS simulator. *(PIC: Wira & Hafiz)*
- [ ] **DOC-5.1:** Penyusunan laporan Capstone, slide presentasi, dan dokumentasi arsitektur final untuk dosen pembimbing. *(PIC: Wira & Hafiz)*

---

## 🎯 Definition of Done (DoD) per Task

Sebuah task dianggap **Done** apabila:
1. **Kode Bersih:** Lolos linter tanpa error/warning (`ruff` & `black` untuk Python, `flutter analyze` untuk Flutter).
2. **Tervalidasi Skema:** Menggunakan skema Pydantic v2 yang ketat untuk setiap input/output API.
3. **Dokumentasi API:** Otomatis terdaftar dan dapat diuji melalui Swagger UI (`/docs`).
4. **Bebas Kebocoran Data:** Pada task ML, dataset dipastikan menggunakan split temporal per-user.
5. **Git Commit Standar:** Menggunakan format conventional commit (e.g., `feat(pre-purchase): implement check endpoint`, `fix(ocr): handle low light receipts`).
