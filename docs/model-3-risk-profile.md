# 🎯 Dokumentasi Model 3: Risk Profile Classifier

**Nama Model:** Model 3 — Investor Risk Profile Classifier  
**Jenis Model:** Supervised Learning (Multi-class Classification)  
**Status Integrasi:** ✅ Selesai (Production Ready)  
**Lokasi Integrasi UI:** `frontend/src/app/dashboard/planning/page.tsx`  
**Lokasi API Backend:** `ai-service/app/api/risk_profile.py` & `ai-service/app/services/risk_predictor.py`

---

## 1. Konsep & Tujuan Utama

Model 3 dirancang khusus untuk memahami **Toleransi Risiko (Risk Tolerance)** dan kesiapan berinvestasi dari pengguna. Berbeda dengan Model 2 yang melihat bagaimana uang "keluar", Model 3 melihat bagaimana pengguna **"merencanakan"** dan mengelola sisa uang mereka, serta faktor latar belakang yang membentuk pola pikir mereka.

Tujuan akhirnya adalah memberikan **Rekomendasi Proporsi Budgeting (Needs/Wants/Save)** yang diubahsuaikan (*tailored*) untuk pengguna beserta rekomendasi instrumen investasi (contoh: Reksadana vs Kripto).

---

## 2. Fitur Input (20 Indikator Utama)

Sistem membaca data kuis onboarding pengguna dipadukan dengan riwayat transaksi bulan berjalan untuk diolah menjadi matriks 20 fitur.

### A. Fitur Rasio Transaksi Finansial (Real-Time)
Data ini dikalkulasi langsung di frontend dari *transaction record* pengguna:
* `saving_rate`: Rasio uang yang ditabung terhadap total pendapatan.
* `dti_ratio`: *Debt-to-Income Ratio* (Beban rasio hutang dari `ceamis_debts`).
* `disposable_ratio`: Porsi uang yang tersisa setelah pengeluaran.
* `expense_ratio`: Rasio total pengeluaran terhadap pendapatan.
* `ceamis_score`: Hasil kalkulasi Kesehatan Finansial (Model 1) yang disederhanakan.

### B. Fitur Profil Kuis (Statik / Onboarding)
Data ini diambil dari *onboarding form* pengguna:
* `punya_tabungan`: Flag biner (1/0) kepemilikan tabungan.
* `jumlah_tabungan_bulan`: Berapa bulan dana darurat yang dimiliki.
* `toleransi_rugi_enc`: Skala seberapa berani menanggung rugi.
* `tujuan_keuangan_enc`: Apakah memiliki target tabungan yang spesifik.
* `tanggungan_keluarga`: Jumlah orang yang dibiayai.
* `Age`: Usia pengguna.
* `city_tier_enc`: Kategori kota tempat tinggal (Tier 1/2/3).

### C. Fitur Psikologis (Skala Likert)
Skor dari kuis perilaku:
* `SAVEHABIT`: Seberapa rutin kebiasaan menabung.
* `SELFCONTROL_1`: Tingkat kontrol diri terhadap dorongan membeli impulsif.
* `SCFHORIZON`: Jangka waktu (horizon) target finansial.
* `FINGOALS`: Tingkat kejelasan dalam menyusun resolusi keuangan.

### D. Fitur Latar Belakang Pekerjaan (One-Hot Encoded)
* `occ_Professional` (Karyawan/Gaji tetap)
* `occ_Retired` (Pensiunan)
* `occ_Self_Employed` (Bisnis/Freelance)
* `occ_Student` (Pelajar/Uang Saku)

---

## 3. Profil Risiko (Hasil Klasifikasi)

Sistem akan mengeluarkan satu dari **3 kelas Profil Risiko**, lengkap dengan parameter bawaannya.

### 🛡️ Kelas 1: Konservatif
* **Karakter:** Mengutamakan keamanan dana (*capital preservation*). Sangat berhati-hati dan menghindari fluktuasi/kerugian.
* **Proporsi Budget Ideal:** 
  * Needs: **50%**
  * Wants: **20%**
  * Savings/Investments: **30%**
* **Instrumen Disarankan:** Dana Darurat, Deposito, Reksadana Pasar Uang.

### ⚖️ Kelas 2: Moderat
* **Karakter:** Sudah cukup sadar finansial. Berani mengambil sedikit risiko untuk mendapatkan *return* yang mengimbangi inflasi, namun tetap menginginkan sebagian dananya aman.
* **Proporsi Budget Ideal:** 
  * Needs: **50%**
  * Wants: **30%**
  * Savings/Investments: **20%**
* **Instrumen Disarankan:** Reksadana Pendapatan Tetap, Emas, Saham Blue Chip.

### ⚔️ Kelas 3: Agresif
* **Karakter:** Memiliki horizon investasi jangka panjang dan *goal-oriented*. Sangat disiplin dan siap menanggung fluktuasi tajam (volatilitas) demi *return* maksimal.
* **Proporsi Budget Ideal:** 
  * Needs: **40%**
  * Wants: **20%**
  * Savings/Investments: **40%**
* **Instrumen Disarankan:** Saham Growth, Reksa Dana Saham, Kripto.

---

## 4. Cara Kerja & Payload Data (Alur Integrasi)

1. **Trigger (Frontend):** 
   Setiap kali pengguna masuk ke halaman **Planning** (`/dashboard/planning`), sistem (`fetchRiskProfile`) akan menyedot data `transactions` dan menggabungkannya dengan localStorage `ceamis_risk_answers` & data *onboarding*.
2. **Kompilasi (Frontend):** 
   Data-data tersebut dirangkai ke dalam 1 objek JSON utuh (berisi 20 *key* wajib) dan dikirim ke server AI melalui POST `/api/v1/predict/risk-profile`.
3. **Analisis (Backend API):**
   `ai-service` memvalidasi input dengan Pydantic `RiskProfileRequest`. Model `risk_model.pkl` kemudian membaca pola angka tersebut dan mengeluarkan probabilitas.
4. **Hasil (Frontend):**
   Frontend mengambil hasil label (misal: "Moderat"), kemudian otomatis **menyesuaikan proporsi alokasi budget** bulanan (batasan *slider/bar* pengeluaran) dan mendisplai saran instrumen investasi di sisi UI.
5. **Caching:**
   Hasil disimpan di `localStorage("ceamis_risk_profile")` agar bisa di-load instan saat pengguna berpindah tab, sehingga sistem tidak harus menebak ulang setiap detik.
