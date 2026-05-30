# Analisis Arsitektur Backend CEAMIS

Berdasarkan peninjauan terhadap kode sumber yang ada di repositori, backend aplikasi CEAMIS menggunakan arsitektur **Microservices** yang memisahkan antara logika bisnis utama dengan layanan kecerdasan buatan (AI). Backend terbagi menjadi dua service utama:

1. **Main API (NestJS)** - Berada di folder `backend/`
2. **AI Service (FastAPI)** - Berada di folder `ai-service/`

Berikut adalah analisis mendalam mengenai masing-masing service dan bagaimana keduanya saling berinteraksi.

---

## 1. Main API (NestJS)
Service ini bertindak sebagai tulang punggung utama aplikasi (core backend) yang menangani CRUD, manajemen pengguna, logika bisnis, dan bertindak sebagai *gateway* (penghubung) antara frontend dan AI Service.

### Teknologi yang Digunakan:
* **Framework:** NestJS (Node.js) dengan TypeScript. NestJS dipilih karena menawarkan struktur yang sangat terorganisir (modular, controller, service) yang cocok untuk aplikasi skala menengah hingga besar (Enterprise-ready).
* **Database:** Supabase (menggunakan `@supabase/supabase-js`). Supabase bertindak sebagai Backend-as-a-Service (BaaS) yang menyediakan PostgreSQL.
* **Integrasi Internal:** Menggunakan `@nestjs/axios` (HttpModule) untuk melakukan pemanggilan HTTP internal ke AI Service.
* **Keamanan & Performa:** Terdapat `@nestjs/throttler` untuk *Rate Limiting* guna mencegah spam/serangan DDoS pada endpoint.

### Modul Utama (berdasarkan `app.module.ts`):
* **SupabaseModule:** Modul inti untuk koneksi dan interaksi dengan database Supabase.
* **UsersModule & OnboardingModule:** Menangani data pengguna dan alur pendaftaran awal (onboarding) untuk menentukan profil dasar.
* **TransactionsModule:** Modul krusial untuk mencatat dan mengelola transaksi keuangan pengguna (pemasukan/pengeluaran).
* **AiModule:** Modul khusus (bertindak sebagai proxy) untuk menjembatani komunikasi antara Main API NestJS dengan FastAPI AI Service.
* **WarningsModule:** Kemungkinan menangani sistem notifikasi atau peringatan jika *Health Score* pengguna memburuk.

---

## 2. AI Service (FastAPI)
Service ini didedikasikan khusus untuk komputasi berat (Machine Learning) dan pemrosesan Generative AI. Pemisahan ini sangat tepat karena Python memiliki ekosistem AI/ML terbaik, dan FastAPI sangat cepat untuk melayani model AI.

### Teknologi yang Digunakan:
* **Framework:** FastAPI (Python) dengan server Uvicorn. FastAPI sangat cepat dan memiliki validasi data otomatis menggunakan Pydantic.
* **Machine Learning & Deep Learning:** TensorFlow/Keras, Scikit-learn, Numpy, Pandas, Joblib. Digunakan untuk model prediktif dan klasifikasi.
* **Generative AI (LLM):** Menggunakan `google-genai` (Gemini), `groq`, dan `openai`. Ini menunjukkan aplikasi ini sangat bergantung pada model bahasa besar terkini untuk fitur interaktif.

### Model & Endpoint Utama (berdasarkan `main.py`):
1. **Model 1 - Health Score (`/predict/health-score`):**
   * Menilai tingkat kesehatan finansial pengguna.
   * Saat ini menggunakan pendekatan kalkulasi berbasis formula matematik (DS Formula) yang lebih deterministik dan ringan melalui `health_score_calculator.py`, membuang pendekatan *mock* statis.
   * *Fallback Mechanism:* Aplikasi tetap handal memberikan respons meskipun terjadi kendala perhitungan atau *missing values*.
2. **Model 2 - Financial Persona/Spending Cluster (`/predict/spending-cluster`):**
   * Mengelompokkan pola perilaku finansial pengguna ke dalam persona tertentu (misal: "The Saver", "The Spender").
   * Telah sepenuhnya di- *upgrade* dari pendekatan *rule-based* menjadi model Machine Learning *Clustering* utuh menggunakan file *pickle* (`cluster_model.pkl` dan `cluster_scaler.pkl`), dan ditangani oleh *service layer* khusus `persona_predictor.py`.
3. **Model 3 - Risk Profile Classifier:**
   * Mengklasifikasikan profil risiko pengguna dengan akurasi yang sangat tinggi (tercatat 97.91%).
   * Menggunakan arsitektur *Singleton* di `risk_predictor.py` dimana *artifact* model `.keras` di-*cache* secara instan ke dalam RAM saat aplikasi *start* (via `lifespan`) untuk menghindari *bottleneck Disk I/O*.
   * Terintegrasi dengan fitur otomatisasi alokasi target anggaran (seperti *Needs 50 / Wants 30 / Savings 20*) dan rekomendasi instrumen investasi langsung ke dalam *output* API.
4. **Chatbot CAMI:**
   * Fitur asisten virtual Gen-Z yang di-tenagai oleh integrasi LLM (Gemini/Groq) untuk memberikan saran keuangan interaktif.
5. **Education:**
   * Modul edukasi keuangan adaptif yang kemungkinan kontennya digenerasi atau disesuaikan menggunakan GenAI berdasarkan kondisi keuangan pengguna.

---

## 3. Analisis Arsitektur & Best Practices (Kelebihan)

1. **Separation of Concerns (Pemisahan Tugas):**
   Memisahkan Node.js (untuk I/O intensif, CRUD, routing) dan Python (untuk komputasi CPU intensif, ML/AI) adalah standar industri modern. Jika AI service butuh waktu lama untuk men-generate teks, ia tidak akan memblokir *thread* utama di NestJS yang melayani request pengguna lain.
2. **Scalability (Skalabilitas):**
   Karena terpisah, jika fitur Chatbot tiba-tiba mendapat banyak pengguna, Anda hanya perlu meningkatkan *resource* (scale-up/out) pada container AI Service tanpa harus mengganggu Main API NestJS.
3. **Resilience (Ketahanan):**
   Implementasi *Fallback* pada *Health Score* di FastAPI sangat bagus. Ini memastikan bahwa meskipun ada kendala di sisi *Machine Learning*, pengguna (Frontend) tetap mendapatkan respons (meskipun *mock data* atau hitungan kasar) tanpa mengalami *Error 500 Internal Server Error*.
4. **Modularitas:**
   Penggunaan NestJS membuat kode sangat mudah di-maintain dan di-test (terlihat dari konfigurasi Jest yang ada di `package.json`).

## 4. Daftar Perubahan (Changelog) Terbaru

**1. Model 1 — Financial Health Score (Rule-Based)**
* Mengubah pendekatan ke formula deterministik berbasis aturan bisnis (*highly explainable*).
* **Perbaikan Bug:** Menormalisasi pembobotan Segmen B dan C (dibagi 0.85) agar batas skor maksimal bisa mencapai nilai sempurna 100.00.
* Menghapus duplikasi skema pada rute API dan mengintegrasikannya dengan pesan sarkas Gen-Z secara terpusat.

**2. Model 2 — Spending Pattern Clustering (K-Means)**
* Mengimplementasikan *complete pipeline* K-Means ke dalam bentuk riil (*real ML model*) dengan 3 persona finansial dinamis: Si Hemat, Si Impulsif, dan Si Minimalis.
* Membuat folder baru `app/services/` dan memisahkan logika inferensi ke `persona_predictor.py` (Service Layer / Clean Architecture).
* Menambahkan kolom `user_id` pada skema request untuk memudahkan pelacakan database transaksi dari Supabase.

**3. Model 3 — Risk Profile Classifier (Deep Learning)**
* **Optimasi Performa:** Memindahkan proses pemuatan (*loading*) artefak model `.keras` ke dalam fungsi *lifespan* di `main.py` menggunakan Singleton Pattern di `risk_predictor.py`. Model sekarang di-cache di RAM untuk menghindari Disk I/O Bottleneck.
* Mengintegrasikan fitur otomatisasi alokasi target anggaran (Needs 50/40, Wants 20/30, Savings 30/20/40) dan rekomendasi instrumen investasi langsung ke dalam skema respons API.

**4. LLM-Powered Dashboard Insight (🌟 Fitur Baru XAI)**
* Membuat modul `insight_generator.py` untuk menyusun evaluasi finansial bulanan interaktif secara asinkronus (*async/await*).
* Memanfaatkan `llm_client.py` terpusat menggunakan model `gemini-2.5-flash` dengan konfigurasi `MAX_TOKENS=4096` untuk menjamin teks narasi tidak terpotong di tengah jalan.
* Dilengkapi sistem proteksi *automatic fallback* ke Groq (Llama 3.1) jika API utama mengalami kendala.

**5. Keamanan & Kebersihan Repositori**
* Membuang kode usang (*dead code*) pada berkas `app/utils/preprocessor.py`.
* **Keamanan Siber:** Menghapus berkas `.env` dari pelacakan riwayat Git (*Git History Purge*) menggunakan `filter-branch --force` demi mengamankan kredensial API Keys dan Supabase Service Role Key.

---

## Kesimpulan
Struktur backend CEAMIS sudah dirancang dengan **sangat baik dan profesional**. Arsitektur *Microservices* hibrida ini cocok untuk aplikasi modern yang menggabungkan transaksi konvensional dengan *Advanced AI*. Tugas Anda ke depannya hanyalah memastikan komunikasi jaringan antara NestJS dan FastAPI berjalan dengan aman (misalnya menggunakan secret key internal) dan memastikan *deployment* (seperti Docker) dikonfigurasi dengan benar untuk kedua service ini.
