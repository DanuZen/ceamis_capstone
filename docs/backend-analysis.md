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
   * Menggunakan model *Deep Learning* TensorFlow (`.keras`).
   * *Fallback Mechanism:* Terdapat mekanisme fallback yang cerdas. Jika modul TensorFlow gagal dimuat (misal karena resource server terbatas atau file model tidak ada), sistem akan menggunakan perhitungan rumus matematika manual berdasarkan *saving rate* agar aplikasi tidak *crash*.
2. **Model 2 - Spending Cluster:**
   * Mengelompokkan pola pengeluaran pengguna (saat ini menggunakan pendekatan *rule-based*).
3. **Model 3 - Risk Profile Classifier:**
   * Mengklasifikasikan profil risiko pengguna dengan akurasi yang sangat tinggi (tercatat 97.91%). Menggunakan *artifact* model yang diload saat aplikasi *start* (via `lifespan`).
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

## Kesimpulan
Struktur backend CEAMIS sudah dirancang dengan **sangat baik dan profesional**. Arsitektur *Microservices* hibrida ini cocok untuk aplikasi modern yang menggabungkan transaksi konvensional dengan *Advanced AI*. Tugas Anda ke depannya hanyalah memastikan komunikasi jaringan antara NestJS dan FastAPI berjalan dengan aman (misalnya menggunakan secret key internal) dan memastikan *deployment* (seperti Docker) dikonfigurasi dengan benar untuk kedua service ini.
