# Product Requirements Document (PRD) — CEAMIS 2.0

**Nama Produk:** CEAMIS 2.0 (*Control Every Awful Money Impulse System 2.0*)  
**Status:** Active Development (Approved by Dosen Pembimbing)  
**Versi:** 2.0.0  
**Tanggal Efektif:** 20 September 2026  
**Tim Inti (Core Team):**  
* **Wira Fikri Ramadanu** — *Project Lead, Fullstack & Mobile Engineer*  
* **Hafiz Hafrienda** — *AI Engineer, Data Scientist & QA Specialist*  

---

## 1. Latar Belakang & Visi Produk

### 1.1 Latar Belakang Masalah
Generasi Z di Indonesia menghadapi tantangan finansial struktural yang diperparah oleh digitalisasi transaksi instan (QRIS, e-wallet, PayLater). Pola perilaku konsumtif seperti *doom spending*, *FOMO culture*, dan *latte factor* sering kali terjadi secara impulsif dalam hitungan detik sebelum transaksi diselesaikan.

Sebagian besar aplikasi pengatur keuangan yang ada saat ini memiliki kelemahan mendasar:
1. **Pencatatan Bersifat Pasif (Post-Mortem):** Uang sudah terlanjur keluar baru dicatat. Tidak ada intervensi *sebelum* transaksi terjadi.
2. **Beban Friksi Manual:** Mengetik rincian belanja satu per satu membuat pengguna cepat bosan dan berhenti mencatat setelah beberapa hari.
3. **Ketiadaan Konteks Risiko & Dampak:** Memberikan grafik pengeluaran tanpa kalkulasi dampak nyata terhadap target tabungan dan batas aman anggaran berjalan.
4. **Fitur AI yang Kurang Tepat Sasaran:** Penggunaan chatbot percakapan sering kali tidak menyelesaikan masalah inti dan rentan halusinasi, sementara clustering gaya hidup sering kali statis dan tidak dapat ditindaklanjuti secara instan.

### 1.2 Visi CEAMIS 2.0
CEAMIS 2.0 dirancang ulang secara radikal berdasarkan arahan dosen pembimbing menjadi **Sistem Intervensi Finansial Cerdas Berorientasi Pra-Pembelian (*Pre-Purchase Decision Support System*)**:
* **Intervensi Pra-Pembelian (Core AI Innovation):** Pengguna memeriksa rencana belanja *sebelum* bertransaksi. Sistem mengevaluasi risiko impulsif berdasarkan rasio pengeluaran, sisa anggaran, pola frekuensi belanja, dan dampak langsung terhadap target tabungan.
* **Pencatatan Cepat & Otomatis (Smart OCR Struk):** Pemindaian foto struk belanjaan menggunakan Google ML Kit on-device dan parsing terstruktur via Gemini Flash.
* **Evaluasi Transparan & Terukur (Rule-Based Health Score):** Skor kesehatan finansial dihitung dengan formula deterministik yang jelas (tanpa *black box* deep learning yang tidak dapat dijelaskan).
* **Feedback Loop Berkelanjutan:** Pengguna memberikan umpan balik pasca-keputusan (*post-decision label*) yang digunakan untuk melatih dan mengkalibrasi model prediksi risiko secara adaptif.

---

## 2. Batasan Ruang Lingkup (Scope & Non-Goals)

Sesuai arahan dosen pembimbing, arsitektur dan fungsionalitas CEAMIS 2.0 mengalami penajaman fokus yang ketat:

### 2.1 In-Scope (Fitur Resmi 2.0)
| Komponen | Spesifikasi 2.0 |
|---|---|
| **Client Pengguna** | **Flutter Mobile App** (Android & iOS) sebagai satu-satunya platform bagi end-user. |
| **Client Administrator** | **Next.js Web App** khusus untuk Admin/Operator (manajemen model ML, audit log, monitoring sistem). |
| **Backend** | **1 Aplikasi FastAPI Modular Tunggal (Python 3.11+)** menggantikan seluruh backend NestJS dan AI microservice terpisah. |
| **Fitur AI Utama** | **Model Prediksi Risiko Pra-Pembelian** (Logistic Regression & Random Forest) dengan temporal user-split. |
| **Fitur OCR** | Pemindaian struk foto via kamera mobile + parsing JSON melalui Gemini 2.0 Flash. |
| **Skor Kesehatan** | Formula deterministik transparan dengan 3 status: *Sehat*, *Waspada*, *Boros*. |
| **Intervensi Anggaran** | Simulasi dampak belanja pra-pembelian terhadap sisa anggaran kategori dan penundaan target tabungan (*in days*). |

### 2.2 Out-of-Scope / Non-Goals (Dihapus dari 1.0)
* ❌ **Tidak ada backend NestJS:** Seluruh logika bisnis dipusatkan ke FastAPI Python.
* ❌ **Tidak ada Chatbot Percakapan (CAMI Chat):** Dihilangkan untuk menjaga keandalan ilmiah dan menghindari halusinasi LLM.
* ❌ **Tidak ada K-Means Clustering Persona:** Dihapus karena klaster statis tidak relevan dengan mitigasi impulsivitas transaksi real-time.
* ❌ **Tidak ada Web Portal untuk End-User:** End-user hanya menggunakan aplikasi mobile Flutter; Web Next.js murni dashboard admin.
* ❌ **Tidak ada Deep Learning Black-Box untuk Health Score:** Menggunakan formula transparan yang dapat diaudit.

---

## 3. Struktur Tim & Pembagian Tanggung Jawab

| Anggota Tim | Peran | Tanggung Jawab Utama |
|---|---|---|
| **Wira Fikri Ramadanu** | Project Lead & Fullstack/Mobile Engineer | - Perancangan arsitektur sistem monorepo & database Supabase PostgreSQL.<br>- Pengembangan aplikasi mobile Flutter (Riverpod, GoRouter, Dio, Camera, OCR, UI Neo-Brutalism).<br>- Migrasi dan implementasi backend FastAPI modular (Auth, CRUD Transaksi, Budgets, Goals, Pre-Purchase API).<br>- Pengembangan Next.js Admin Dashboard untuk audit & monitoring model. |
| **Hafiz Hafrienda** | AI Engineer, Data Scientist & QA Specialist | - Rekayasa fitur (*Feature Engineering*) untuk dataset transaksi pra-pembelian.<br>- Pelatihan, komparasi (LogReg vs RF vs GBM), dan evaluasi model risiko dengan split temporal/per-user.<br>- Kalibrasi ambang batas (*cold-start* vs personalized threshold) dan integrasi pipeline feedback loop.<br>- Prompt engineering & skema JSON parsing Gemini Flash untuk OCR struk.<br>- Pengujian kualitas (Quality Assurance), validasi edge-cases, dan evaluasi performa model. |

---

## 4. Kebutuhan Pengguna (User Personas & User Stories)

### 4.1 Persona Utama: Ziva (21 tahun, Mahasiswi & Freelancer Gen-Z)
* **Karakter:** Aktif menggunakan smartphone, sering jajan kopi kekinian dan belanja barang diskon tengah malam via e-commerce.
* **Pain Point:** Sering merasa saldo tiba-tiba habis di akhir bulan tanpa menyadari pos pengeluaran mana yang bocor.
* **Kebutuhan:** Peringatan langsung di ponsel *sebelum* ia menekan tombol bayar atau check out barang belanjaan impulsif.

### 4.2 User Stories

#### Epik 1: Pengecekan Pra-Pembelian (Core Innovation)
* **US-1.1:** Sebagai pengguna, saya ingin memasukkan rencana nominal dan kategori barang sebelum membeli, agar saya mengetahui apakah transaksi ini berisiko membuat saya overbudget.
* **US-1.2:** Sebagai pengguna, saya ingin melihat rincian alasan mengapa rencana pembelian saya dinilai berisiko tinggi (misal: "Nominal ini 2.5x dari rata-rata jajan Anda").
* **US-1.3:** Sebagai pengguna, saya ingin melihat simulasi dampak pembelian terhadap sisa anggaran bulanan dan target tabungan saya (misal: "Jika beli sekarang, target tabungan laptop Anda mundur 7 hari").
* **US-1.4:** Sebagai pengguna, saya dapat memilih tindakan setelah peringatan: *Lanjut Membeli*, *Sesuaikan Nominal*, atau *Tunda Pembelian*.
* **US-1.5:** Sebagai pengguna, beberapa hari kemudian saya dapat menjawab konfirmasi apakah keputusan pembelian tersebut terasa tepat atau disesali, agar sistem semakin mengenali pola finansial saya.

#### Epik 2: Pencatatan Transaksi Cepat & Smart OCR
* **US-2.1:** Sebagai pengguna, saya ingin memotret struk belanjaan fisik, agar rincian item, total nominal, tanggal, dan kategori terisi secara otomatis tanpa input manual.
* **US-2.2:** Sebagai pengguna, saya ingin tetap bisa mengedit atau memvalidasi hasil pembacaan OCR sebelum menyimpannya ke database.
* **US-2.3:** Sebagai pengguna, saya ingin mencatat transaksi pengeluaran dan pemasukan manual secara cepat dengan UI yang simpel dan responsif.

#### Epik 3: Evaluasi Kesehatan Keuangan
* **US-3.1:** Sebagai pengguna, saya ingin melihat Skor Kesehatan Finansial saya (0–100) beserta kategori status (*Sehat*, *Waspada*, *Boros*).
* **US-3.2:** Sebagai pengguna, saya ingin membaca ringkasan deterministik mengenai faktor apa saja yang mempengaruhi skor saya (rasio tabungan, rasio kebutuhan pokok, frekuensi overbudget).

#### Epik 4: Administrasi & Model Governance (Next.js Web)
* **US-4.1:** Sebagai admin/operator, saya ingin memantau metrik performa model prediksi risiko (Precision, Recall, F1-Score, ROC-AUC).
* **US-4.2:** Sebagai admin/operator, saya ingin melihat versi model aktif dan dapat melakukan *rollback* ke model versi sebelumnya jika terjadi anomali performa.
* **US-4.3:** Sebagai admin/operator, saya ingin meninjau log audit intervensi pra-pembelian dan ringkasan feedback pengguna secara agregat.

---

## 5. Spesifikasi Fungsional & Modul Sistem

```text
                               ┌───────────────────────────┐
                               │   CEAMIS 2.0 ECOSYSTEM    │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
          ┌───────────────────────┐                     ┌───────────────────────┐
          │  FLUTTER MOBILE APP   │                     │ NEXT.JS ADMIN PORTAL  │
          │   (End-User Client)   │                     │ (Governance/Operator) │
          └───────────┬───────────┘                     └───────────┬───────────┘
                      │                                             │
                      └──────────────────────┬──────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │     FASTAPI MODULAR       │
                               │   (Single Backend Core)   │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
          ┌───────────────────────┐                     ┌───────────────────────┐
          │  SUPABASE POSTGRESQL  │                     │  GOOGLE GEMINI FLASH  │
          │ (Database, Auth, RLS) │                     │ (Structured OCR Only) │
          └───────────────────────┘                     └───────────────────────┘
```

### 5.1 Modul Backend FastAPI (`ai-service/app/`)
1. **`auth/`**: Registrasi, login, verifikasi JWT Supabase, manajemen sesi, role-based guard (`user` vs `admin`).
2. **`users/`**: Profil pengguna, pengaturan preferensi, statistik akumulasi pengeluaran.
3. **`transactions/`**: CRUD transaksi (pemasukan/pengeluaran), pencatatan metadata struk, filter kategori, agregasi bulanan.
4. **`budgets/`**: Manajemen limit anggaran per kategori, pelacakan sisa pagu real-time, tanggal reset bulanan.
5. **`goals/`**: Penetapan target tabungan (*emergency fund*, barang impian), kalkulasi proyeksi tanggal pencapaian.
6. **`pre_purchase/`** *(Modul Utama)*:
   - Evaluasi rencana belanja real-time.
   - Ekstraksi 7 fitur kontekstual.
   - Panggilan inferensi ke `risk_model`.
   - Perhitungan dampak terhadap sisa pagu kategori dan tabungan.
   - Penyimpanan log intervensi & pencatatan keputusan (*proceed*, *adjust*, *postpone*).
   - Pengumpulan feedback evaluatif pengguna (*post-decision label*).
7. **`risk_model/`**:
   - Inferensi model Machine Learning (Scikit-Learn).
   - Pipeline komparasi: Baseline Rule vs Logistic Regression vs Random Forest.
   - Mekanisme kalibrasi ambang batas (*cold-start global model* vs *user-adjusted threshold*).
8. **`health_score/`**: Formula transparan berbasis 3 pilar: Savings Ratio (40%), Needs Ratio (30%), Budget Adherence (30%).
9. **`ocr/`**: Penerimaan teks hasil Google ML Kit / upload gambar struk, dikirim ke Gemini 2.0 Flash untuk konversi ke format JSON transaksi terstruktur.
10. **`admin/`**: Endpoint khusus role admin untuk monitoring performa model, manajemen versi model, dan peninjauan log audit.

---

## 6. Kebutuhan Non-Fungsional (NFR)

1. **Performa & Latensi:**
   - Evaluasi pra-pembelian (`POST /api/v1/pre-purchase/check`) harus memberikan respons dalam waktu **< 400 ms** agar tidak menghambat pengalaman pengguna saat berada di kasir atau toko.
   - Parsing OCR struk melalui Gemini Flash harus selesai dalam waktu **< 3.5 detik**.
2. **Keamanan & Privasi:**
   - Semua komunikasi API wajib melalui HTTPS dengan autentikasi Bearer JWT.
   - Akses data tabel diisolasi menggunakan Row-Level Security (RLS) PostgreSQL Supabase.
   - Foto struk yang diunggah memiliki masa retensi terbatas (dibersihkan setelah parsing tervalidasi).
3. **Integritas Metodologi AI:**
   - Split dataset untuk pelatihan dan evaluasi model risiko **wajib menggunakan split temporal per-user** guna mencegah kebocoran data (*data leakage*).
   - Seluruh model artifacts (`.joblib` / `.pkl`) diverifikasi metrik presisinya sebelum dideploy ke produksi.
4. **Ketersediaan & Keandalan:**
   - Uptime backend minimal 99.5%.
   - Jika model ML mengalami kendala teknis saat inferensi, sistem harus memiliki *graceful fallback* ke baseline rule-based deterministik.

---

## 7. Prioritas Fitur (MoSCoW Matrix)

| Kategori | Fitur |
|---|---|
| **Must Have (P0)** | 1. Backend FastAPI modular tunggal menggantikan NestJS.<br>2. Endpoint dan alur pengecekan Pra-Pembelian (*Pre-Purchase Check*).<br>3. Model Prediksi Risiko (LogReg / Random Forest) dengan 7 fitur kontekstual.<br>4. Perhitungan dampak sisa anggaran & proyeksi tabungan.<br>5. Input keputusan pra-pembelian (Lanjut/Ubah/Tunda) dan feedback loop.<br>6. CRUD Transaksi, Anggaran, dan Target Tabungan di Mobile.<br>7. Otentikasi Supabase Auth JWT di Mobile & Backend. |
| **Should Have (P1)** | 1. Pemindaian Struk Cerdas (Google ML Kit on-device + Gemini 2.0 Flash parsing).<br>2. Formula Health Score deterministik (Sehat/Waspada/Boros).<br>3. Admin Dashboard Next.js untuk monitoring metrik model & audit log.<br>4. UI Mobile bertema Neo-Brutalism Gen-Z yang responsif. |
| **Could Have (P2)** | 1. Notifikasi pengingat evaluasi transaksi pasca-pembelian (*push notification*).<br>2. Mode offline dengan sinkronisasi otomatis saat online di Flutter. |
| **Won't Have (v2.0)** | 1. Chatbot CAMI berbasis percakapan LLM bebas.<br>2. Model K-Means clustering persona gaya hidup.<br>3. Aplikasi web untuk end-user. |

---

## 8. Metrik Keberhasilan (Success Metrics / KPIs)

1. **Metrik Model AI:**
   - Precision model risiko belanja impulsif ≥ 75% pada data uji temporal.
   - Recall ≥ 70% untuk mendeteksi transaksi yang berpotensi overbudget.
2. **Metrik Intervensi Pengguna:**
   - Minimal 20% rencana pembelian dengan peringatan risiko tinggi berujung pada keputusan *Tunda* atau *Sesuaikan Nominal*.
   - Tingkat kepuasan terhadap akurasi peringatan pada feedback pasca-keputusan ≥ 80%.
3. **Metrik Rekayasa Software:**
   - Latensi p95 endpoint pra-pembelian < 400ms.
   - 100% kode backend terdokumentasi dalam OpenAPI/Swagger dan skema Pydantic v2.
