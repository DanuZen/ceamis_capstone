# Laporan Tugas F2: Statistik Pengguna Nyata pada Pemeriksaan Pra-Pembelian

> **Cabang Git:** `thesis/perbaikan-pilot`  
> **Modul Terkait:** [backend/app/services/user_stats_service.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/user_stats_service.py), [backend/app/api/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py), [backend/app/schemas/pre_purchase_schema.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/schemas/pre_purchase_schema.py), [backend/tests/test_user_stats.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_user_stats.py)  
> **Status:** SELESAI  

---

## 1. Ringkasan Eksekutif

Pada implementasi awal sebelum perbaikan, fungsi `_get_user_category_stats`, `_get_user_budget_info`, `_get_user_savings_info`, dan `_get_user_profile` di [pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py) mengembalikan nilai statis tiruan (*mock hardcoded*), sehingga seluruh fitur kontekstual ML (seperti rasio nominal terhadap median, deviasi standar z-score, dan sisa anggaran) tidak mencerminkan transaksi nyata pengguna.

Melalui Tugas F2:
1. Telah dibangun modul layanan khusus [backend/app/services/user_stats_service.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/user_stats_service.py) yang mengkalkulasi parameter statistik pengguna secara *point-in-time*.
2. Ditegakkan aturan pencegahan kebocoran temporal (*temporal leakage prevention*): transaksi saat atau setelah waktu pemeriksaan dilarang keras diikutsertakan (`tx_time < check_time`).
3. Ditetapkan aturan *cold start* eksplisit dengan ambang batas `MIN_TRANSACTIONS_THRESHOLD = 5`. Pengguna baru atau yang memiliki riwayat kurang dari 5 transaksi otomatis ditandai `cold_start = True` pada respons API dan `features_snapshot`.
4. Seluruh perlindungan pembagian nol (*zero-division guard*) pada ekstraksi fitur dipertahankan dengan aman (`max(..., 1.0)`).
5. Tersedia 7 skenario pengujian unit dan integrasi komprehensif pada [backend/tests/test_user_stats.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_user_stats.py) yang seluruhnya lulus 100%.

---

## 2. Pemetaan Sumber 7 Fitur Kontekstual

Setiap fitur inferensi risiko pra-pembelian kini dipetakan ke sumber data operasional aktual:

| No | Nama Fitur | Formula / Ekstraksi | Sumber Data Operasional | Aturan Pencegahan Kebocoran Temporal |
|---|---|---|---|---|
| 1 | `amount_ratio_median` | `planned_amount / max(median, 1.0)` | Tabel `transactions` (`amount` kategori terkait) | Hanya transaksi dengan `transaction_date < check_time` |
| 2 | `budget_remaining_ratio` | `planned_amount / max(remaining, 1.0)` | Tabel `budgets` (`amount_limit`) dikurangi akumulasi pengeluaran siklus berjalan | Pengeluaran diakumulasikan hanya dari `cycle_start` s.d. `< check_time` |
| 3 | `category_frequency` | Frekuensi pengeluaran kategori dalam 7 hari | Tabel `transactions` | Window: `check_time - 7d <= tx_date < check_time` |
| 4 | `day_of_week` | `0` (Senin) s.d. `6` (Minggu) | `check_time.weekday()` | Ditentukan tepat dari stempel waktu permintaan |
| 5 | `days_to_reset` | Hari tersisa menuju siklus anggaran berikutnya | Tabel `users` (`budget_reset_day`) vs hari tanggal `check_time` | Dihitung dari tanggal `check_time` saat ini |
| 6 | `savings_impact` | `planned_amount / max(target_amount, 1.0)` | Tabel `goals` / `planning` (`target_amount`) | Target tabungan aktif pengguna saat ini |
| 7 | `deviation_from_pattern` | `abs(planned - mean) / max(std, 1.0)` | Tabel `transactions` (z-score nominal historis) | Mean dan sample standard deviation (`ddof=1`) hanya dari data masa lalu |

---

## 3. Bukti Bebas Kebocoran Temporal (*Temporal Leakage Proof*)

Kebocoran temporal terjadi jika transaksi yang terjadi pada masa depan atau tepat pada saat pemeriksaan dimasukkan ke dalam perhitungan statistik riwayat pengguna, yang secara fatal dapat mendistorsi median, mean, frekuensi, dan sisa anggaran.

### Mekanisme Pencegahan di Kode:
Pada [backend/app/services/user_stats_service.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/user_stats_service.py):
```python
# Filter temporal: strictly tx_time < check_time
tx_time = parse_iso_datetime(tx.get("transaction_date") or tx.get("created_at"))
if tx_time is None or tx_time >= check_time:
    continue  # DILARANG: Transaksi di masa depan atau tepat saat check_time diabaikan!
```

### Verifikasi Melalui Uji Unit:
Pada `TestUserStatsPointInTime.test_strict_temporal_leakage_prevention`, disimulasikan:
- 5 transaksi masa lalu dengan nominal masing-masing Rp100.000.
- 1 transaksi tepat saat `check_time` dengan nominal outlier Rp99.999.999.
- 1 transaksi masa depan (2 hari setelahnya) sebesar Rp88.888.888.
- **Hasil:** Hanya 5 transaksi masa lalu yang terhitung; `mean_amount` tetap tepat Rp100.000,00 dan `transaction_count == 5`. Terbukti 100% bebas kebocoran.

---

## 4. Aturan Pengguna Baru (*Cold Start Rule*)

Pengguna baru yang belum memiliki riwayat pengeluaran yang memadai dapat menghasilkan estimasi varians yang tidak stabil jika dipaksakan menghitung deviasi standar.

1. **Konstanta Ambang Batas:**
   ```python
   MIN_TRANSACTIONS_THRESHOLD = 5
   ```
2. **Kondisi Penanganan:**
   - Jika `transaction_count < MIN_TRANSACTIONS_THRESHOLD` (misalnya 0 s.d. 4 transaksi):
     - `cold_start = True`
     - Menggunakan nilai fallback kategori terkalibrasi (`DEFAULT_CATEGORY_FALLBACKS`).
     - Menghitung frekuensi 7 hari aktual jika ada transaksi parsial (1–4 transaksi).
   - Jika `transaction_count >= MIN_TRANSACTIONS_THRESHOLD`:
     - `cold_start = False`
     - Menggunakan parameter statistik riwayat pengguna secara langsung (`numpy.median`, `numpy.mean`, `numpy.std(ddof=1)`).
3. **Penyampaian Status:**
   - Diteruskan ke atribut root respons API: `data.cold_start = True/False`.
   - Disimpan di dalam snapshot fitur: `features_snapshot.cold_start = True/False`.
   - Dipersistensikan ke database/in-memory repository untuk kebutuhan audit eksperimental tesis.

---

## 5. Hasil Pengujian Unit & Integrasi

Pengujian dijalankan melalui runner unittest Python 3.11:

```powershell
.\venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py"
```

### Rincian Hasil:
```text
...................
----------------------------------------------------------------------
Ran 19 tests in 0.513s

OK
```

- **Uji Sebelumnya (F4 + F1):** 12 tes (Lulus).
- **Uji Baru Tugas F2:** 7 tes (Lulus):
  1. `test_sufficient_history_user`: Riwayat cukup (6 tx) menghitung median, mean, std, freq 7d secara tepat (`cold_start = False`).
  2. `test_cold_start_new_user`: Pengguna baru (0 tx) menghasilkan `cold_start = True` dan fallback valid.
  3. `test_single_transaction_user`: Pengguna 1 tx aman dari pembagian nol / std crash (`cold_start = True`).
  4. `test_strict_temporal_leakage_prevention`: Outlier masa depan dan waktu-sama diabaikan sepenuhnya.
  5. `test_budget_cycle_spent_so_far`: Akumulasi sisa pagu hanya menghitung pengeluaran dalam siklus berjalan.
  6. `test_api_check_cold_start_flag_in_response_and_snapshot`: Verifikasi flag cold_start pada payload API dan snapshot.
  7. `test_api_check_sufficient_user_history`: Integrasi end-to-end API pada pengguna berpengalaman.

---

## 6. Titik Keputusan & Rekomendasi untuk Peneliti Tesis

1. **Nilai Ambang Batas `MIN_TRANSACTIONS_THRESHOLD`:**  
   Nilai default diatur ke `5` transaksi per kategori. Jika pada saat pilot empiris partisipan merasa model terlalu lama berada pada mode cold start, ambang batas ini dapat diatur ke `3` melalui konfigurasi konstanta tanpa memutus logika alur sistem.
2. **Kategori Baru vs Kategori Bawaan:**  
   Jika pengguna membuat kategori kustom yang tidak ada dalam daftar bawaan, sistem secara cerdas menggunakan profil fallback `"default"` (Belanja & Lainnya) sehingga tidak akan terjadi kegagalan inferensi (*zero-failure guarantee*).
