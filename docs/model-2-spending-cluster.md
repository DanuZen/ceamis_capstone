# 🤖 Dokumentasi Model 2: Spending Pattern Clustering

**Nama Model:** Model 2 — Spending Pattern & Persona Clustering  
**Jenis Model:** Unsupervised Learning (K-Means Clustering)  
**Status Integrasi:** ✅ Selesai (Production Ready)  
**Lokasi Integrasi UI:** `frontend/src/app/dashboard/transactions/page.tsx`  
**Lokasi API Backend:** `ai-service/app/api/spending_cluster.py` & `ai-service/app/services/persona_predictor.py`

---

## 1. Konsep & Tujuan Utama

Model 2 bertugas membaca seluruh riwayat transaksi finansial pengguna dalam periode tertentu (umumnya bulanan), lalu mengelompokkan (clustering) kebiasaan belanja tersebut ke dalam sebuah **Persona Finansial**.

Berbeda dengan Model 1 (Health Score) yang bersifat prediktif biner/regresi kesehatan, Model 2 lebih berfokus pada **Deteksi Perilaku (Behavioral Detection)**. AI tidak hanya melihat *berapa* yang dihabiskan, tetapi *kapan*, *seberapa sering*, dan *ke kategori apa* uang tersebut lari.

---

## 2. Fitur Input (21 Indikator Rahasia)

Sistem membaca **21 fitur input** (`cluster_features.json`) sebelum di-scale dan dimasukkan ke dalam model ML. Fitur-fitur ini meliputi:

### A. Fitur Perilaku Temporal & Impulsif
* `is_late_night`: Proporsi transaksi yang terjadi di larut malam (indikasi *impulse buying* emosional).
* `is_weekend`: Proporsi transaksi yang dilakukan di akhir pekan.
* `hourly_txn_count`: Rata-rata transaksi per jam (mendeteksi *binge spending*).
* `is_binge_spending`: Rentetan transaksi konsekutif dalam durasi sangat singkat.
* `transaction_count`: Total frekuensi checkout/transaksi pengeluaran selama bulan berjalan.

### B. Fitur Rasio Finansial Utama
* `saving_rate_raw`: Persentase dana yang disisihkan ke instrumen tabungan.
* `wants_ratio_raw`: Persentase dana yang dihabiskan untuk kesenangan murni (Wants).
* `investment_rate_raw`: Persentase dana yang dimasukkan ke instrumen investasi rutin.
* `dti_ratio_raw`: *Debt-to-Income ratio* (Beban utang dibanding pemasukan).
* `is_unbudgeted`: Rasio pengeluaran yang menembus batas maksimal target anggaran.

### C. Fitur Distribusi Kategori (`cat_*`)
Proporsi pengeluaran per kategori spesifik:
* `cat_f&b`
* `cat_elektronik`
* `cat_fashion`
* `cat_hiburan`
* `cat_hobi`
* `cat_kebutuhan_pokok`
* `cat_kesehatan`
* `cat_pendidikan`
* `cat_tagihan`
* `cat_transportasi`
* `is_risky_category`: Gabungan bobot belanja di kategori yang sering jadi biang pemborosan.

---

## 3. Profil Persona (Hasil Clustering)

Model ini mendefinisikan **3 klaster persona** (`cluster_profiles.json`) beserta ringkasan rata-rata metrik pelatihannya:

### 🎭 Cluster 0: Si Minimalis
* **Karakter:** Pengguna sangat jarang melakukan transaksi bulanan dan cenderung pasif. Namun, mereka memiliki kontrol pengeluaran yang baik dengan tingkat tabungan yang sehat.
* **Metrik Kunci:** 
  * *Transaction Count:* Sangat rendah (~2.4 / bulan)
  * *Saving Rate:* Sedang-Tinggi (29%)
  * *Wants Ratio:* Sedang (25%)

### 🎭 Cluster 1: Si Impulsif
* **Karakter:** Rentan melakukan pembelian spontan di luar rencana anggaran. Uang keluar sedikit-sedikit tapi frekuensinya tinggi, membuat kebocoran halus pada dompet.
* **Metrik Kunci:** 
  * *Transaction Count:* Sangat tinggi (~33.8 / bulan)
  * *Saving Rate:* Sangat rendah (8%)
  * *Wants Ratio:* Sangat tinggi (44%)
  * *Unbudgeted:* Tinggi (76% melebihi batas)

### 🎭 Cluster 2: Si Hemat
* **Karakter:** Bertipe terencana dan disiplin. Sangat konsisten dalam menyisihkan tabungan awal dan ketat dalam menjaga rasio pengeluaran non-esensial (*wants*).
* **Metrik Kunci:** 
  * *Transaction Count:* Normal aktif (~24 / bulan)
  * *Saving Rate:* Sangat tinggi (35%)
  * *Wants Ratio:* Terkontrol dengan baik (19%)

---

## 4. Alur Integrasi Frontend ↔ Backend (End-to-End)

1. **User Input:** User menambahkan transaksi baru melalui form di halaman `/dashboard/transactions`.
2. **Breakdown Kategori:** Fungsi `buildCategoryBreakdown()` di frontend merangkum total pengeluaran per kategori secara *real-time*.
3. **API Call:** Frontend memanggil `POST /api/v1/predict/spending-cluster` membawa data *category features* dan total frekuensi transaksi.
4. **Backend Mapping:** 
   * `persona_predictor.py` menangkap payload.
   * Kategori yang tidak dikirim oleh frontend akan otomatis diisi dengan `0.0`.
   * Matriks fitur diurutkan persis sesuai dengan struktur `.pkl` model.
5. **Scaling & Prediksi:** Matriks dikenakan proses `scaler.transform()`, lalu dimasukkan ke `model.predict()` untuk mendapatkan ID Klaster (0, 1, atau 2).
6. **Response Assembling:** Backend merakit ID klaster menjadi objek JSON lengkap berisi *Label Persona*, *Deskripsi Sarkas*, dan *Metrics Summary*.
7. **Frontend State Mapping:** UI Frontend menangkap *response* dan memasukannya ke dalam *state* React, otomatis mematikan flag `is_mock: true` menjadi `is_mock: false`, sehingga label "DEMO DATA" hilang dari UI.

---

## 5. Dokumentasi API (Endpoint)

**URL Endpoint:** `POST /api/v1/predict/spending-cluster`  
**Router:** `ai-service/app/api/spending_cluster.py`

### 📤 Request Payload
Format request yang diharapkan dari frontend (hanya yang relevan perlu diisi, sisanya di-fallback `0.0` di backend):

```json
{
  "user_id": "user-123",
  "category_features": {
    "Makanan & Minuman": 1200000,
    "Transportasi": 450000,
    "Hiburan": 800000
  },
  "transaction_count": 14
}
```

### 📥 Response Payload
Hasil analisis klaster yang dikembalikan oleh backend:

```json
{
  "status": "success",
  "message": "Persona successfully analyzed",
  "data": {
    "cluster_id": 1,
    "persona": "Si Impulsif",
    "description": "Pengguna rentan melakukan pembelian spontan di luar rencana...",
    "metrics_summary": {
      "saving_rate": 0.08,
      "wants_ratio": 0.44,
      "unbudgeted_ratio": 0.76,
      "avg_transactions": 33.8
    }
  }
}
```

---

## 6. Integrasi UI (Visualisasi)

Di halaman Transaksi (`frontend/src/app/dashboard/transactions/page.tsx`), output Model 2 ini ditampilkan dalam sebuah **"Spending Cluster Insight Card"**:

* **Header Card:** Menampilkan warna aksen berdasarkan persona (Hijau untuk Si Hemat, Oranye untuk Si Minimalis/Si Impulsif).
* **Top Category Badge:** Otomatis mendeteksi kunci terbanyak (misal: "Makanan & Minuman") dan menaruhnya di kanan atas card.
* **Deskripsi AI:** Kalimat penjelasan dari AI yang akan berubah begitu user menekan tombol "Refresh Analisis" atau saat transaksi baru masuk.
* **Statistik Visual:** Menampilkan *Progress Bar* animasi interaktif yang merepresentasikan *Needs*, *Wants*, dan *Savings* dihitung secara deduktif dari API response.
