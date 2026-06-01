# 🏥 Dokumentasi Model 1: Financial Health Score

**Nama Model:** Model 1 — Financial Health Score Calculator  
**Jenis Model:** Deterministik / Rule-Based Expert System (Tanpa Machine Learning)  
**Status Integrasi:** ✅ Selesai (API Tersedia)  
**Lokasi API Backend:** `ai-service/app/api/health_score.py` & `ai-service/app/utils/health_score_calculator.py`

---

## 1. Konsep & Tujuan Utama

Model 1 adalah fondasi utama untuk mengukur kesehatan finansial pengguna dalam skala **0 hingga 100**. Berbeda dengan Model 2 (Clustering) dan Model 3 (Klasifikasi), Model 1 murni menggunakan formula perhitungan baku dari riset pakar finansial (*Data Science Expert System*).

Tujuan utamanya adalah:
* Memberikan nilai agregat kesehatan dompet (*Health Score*).
* Menyediakan **XAI (Explainable AI)** — sistem yang bisa menjelaskan secara rinci ke pengguna *mengapa* skor mereka turun (misalnya karena rasio utang yang terlalu tinggi).
* Membangkitkan **Warning System** jika skor menyentuh batas Kritis (di bawah 40).

---

## 2. Segmentasi Pengguna (Variabel Pembobot)

Karena kondisi keuangan Pelajar dan Pekerja Profesional tidak bisa disamaratakan, sistem membagi pengguna ke dalam 3 Segmen (A, B, C):

* **Segmen A (Basic):** Biasanya pelajar atau *fresh graduate* yang belum punya utang KPR/Cicilan berat. (Fokus penilaian pada kebiasaan menabung dan mengontrol keinginan belanja).
* **Segmen B (Advanced):** Pekerja yang sudah memiliki cicilan/tanggungan. (Fokus penilaian bergeser dengan memberikan bobot 25% pada DTI - *Debt to Income Ratio*).
* **Segmen C (Hybrid):** Segmen campuran yang menggunakan gabungan kalkulasi dari Segmen A (40%) dan Segmen B (60%).

---

## 3. Fitur Input & Indikator (Rasio Finansial)

Backend menerima 6 input utama melalui endpoint `/predict/health-score`:

1. `segmen` (String: A, B, C): Penentu rumus bobot yang dipakai.
2. `saving_rate` (Float: 0-1): Persentase uang yang ditabung. (Bagus jika > 25%).
3. `wants_ratio` (Float: 0-1): Persentase uang untuk foya-foya. (Makin kecil makin bagus).
4. `dti_ratio` (Float: 0-1): Rasio total utang terhadap pemasukan bulanan.
5. `impulsive_ratio` (Float: 0-1): Rasio transaksi di larut malam / spontan.
6. `budget_adherence` (Float: 0-1): Kepatuhan pengguna terhadap target batas atas budget.

---

## 4. Mekanisme Kalkulasi & Normalisasi

Setiap metrik mentah (misalnya `wants_ratio = 35%`) tidak langsung dikalikan bobot, melainkan di-**normalisasi** terlebih dahulu ke dalam skala nilai mutu (1.0, 0.75, 0.50, 0.25, 0.0) berdasarkan batas wajar Otoritas Jasa Keuangan (OJK) & Perencana Keuangan.

**Contoh Normalisasi DTI (Debt to Income):**
* DTI < 15% ➔ Nilai 1.0 (Sangat Sehat)
* DTI 15%-25% ➔ Nilai 0.75 (Aman)
* DTI 25%-30% ➔ Nilai 0.50 (Waspada)
* DTI 30%-40% ➔ Nilai 0.25 (Bahaya)
* DTI > 40% ➔ Nilai 0.0 (Kritis)

Setelah semuanya diubah ke nilai mutu, barulah dikalikan dengan persentase bobot *Segmen* masing-masing dan dijumlahkan untuk mendapat skor total (skala 100).

---

## 5. Output Model (Response API)

API Model 1 mengembalikan JSON yang sangat kaya fitur:

1. **`health_score` (Skor 0-100):** Angka mentah yang akan masuk ke database `users`.
2. **`health_label` (Status):** Label `Excellent`, `Sehat`, `Cukup`, `Waspada`, atau `Kritis`.
3. **`message` (Pesan Gen-Z):** Pesan notifikasi gaya santai (*"Bestie, dompetmu nangis bombay"* dll) untuk dimunculkan di UI (seperti chatbot/modal).
4. **`explanation` (List String):** Kumpulan peringatan logis (*"Saving rate kamu 5% — di bawah target"*), bagian dari XAI untuk modul edukasi pengguna.
5. **`component_scores` (Breakdown JSON):** Rincian nilai mutu dari setiap komponen jika pengguna ingin melihat rapor detail mereka di Dashboard.
