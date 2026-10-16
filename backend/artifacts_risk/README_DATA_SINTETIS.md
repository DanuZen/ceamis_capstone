# Dokumentasi Data Pelatihan Sintetis (Risk Model)

## 1. Asal Usul dan Sifat Data
Seluruh data pelatihan yang tersimpan dalam direktori ini (`training_data.csv`) serta model klasifikasi risiko awal yang dihasilkan (seperti Random Forest dan Regresi Logistik) **bersumber sepenuhnya dari data sintetis (tiruan)**. Data ini bukan merupakan data riil dari nasabah perbankan, pengguna riil aplikasi, maupun partisipan uji coba lapangan (*pilot*).

## 2. Generator Data Sintetis
Dataset sintetis dibangkitkan secara prosedural oleh fungsi:
- **Fungsi:** `generate_synthetic_data()`
- **Lokasi Sumber:** `backend/training/train_risk_model.py` (baris 83-176)
- **Benih Acak (*Random Seed*):** `42` (menggunakan pustaka `random` dan `numpy.random` untuk menjamin reproduksibilitas penuh)

## 3. Karakteristik dan Parameter Pembangkitan
Proses pembangkitan data sintetis mensimulasikan karakteristik transaksi pra-pembelian dengan parameter berikut:
1. **Jumlah Profil Pengguna Tiruan:** 30 profil pengguna (`N_USERS = 30`).
2. **Rentang Waktu Transaksi:** 4 bulan simulasi transaksi (`N_MONTHS = 4`), di mana bulan 1 sampai 3 dialokasikan untuk data latih (*training set*) dan bulan ke-4 dialokasikan untuk data uji temporal (*temporal holdout test set*).
3. **Volume Transaksi:** 30 hingga 80 transaksi per pengguna (`N_TRANSACTIONS_PER_USER = (30, 80)`).
4. **Kategori Belanja:** 5 kategori pengeluaran dengan distribusi median dan batas pagu anggaran sintetis:
   - *Shopping* (median Rp120.000, std Rp55.000, pagu Rp800.000)
   - *F&B* (median Rp35.000, std Rp18.000, pagu Rp500.000)
   - *Entertainment* (median Rp75.000, std Rp40.000, pagu Rp400.000)
   - *Transport* (median Rp25.000, std Rp12.000, pagu Rp300.000)
   - *Education* (median Rp150.000, std Rp60.000, pagu Rp600.000)
5. **Fitur Rekayasa Kontekstual (7 Fitur):**
   - `amount_ratio_median`
   - `budget_remaining_ratio`
   - `category_frequency`
   - `day_of_week`
   - `days_to_reset`
   - `savings_impact`
   - `deviation_from_pattern`
6. **Pelabelan Risiko:** Label biner `is_risky` (0 atau 1) ditentukan berbasis aturan heuristik kombinasi deviasi pengeluaran terhadap saldo anggaran dan target tabungan pengguna tiruan.

## 4. Tujuan Penggunaan
Dataset sintetis ini dirancang khusus untuk:
1. Memvalidasi alur pelatihan model machine learning (*pipeline*) end-to-end tanpa melibatkan data sensitif sebelum persetujuan etik penelitian aktif.
2. Menyediakan model awal (*cold-start model*) untuk melayani inferensi skor risiko saat pengguna awal baru mendaftar pada tahap *field pilot*.
3. Model ini direncanakan untuk dievaluasi ulang dan dilatih kembali (*retraining*) menggunakan data observasi riil partisipan pilot yang telah memberikan *informed consent* secara eksplisit.
