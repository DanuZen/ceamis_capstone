# Laporan Implementasi Tugas F9: Skrip Ekspor Data Pseudonim Penelitian

## 1. Ringkasan Eksekutif
Dalam rangka menjamin kepatuhan terhadap standar etika penelitian data finansial pada skripsi *"Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal"*, Tugas F9 mengimplementasikan modul ekspor dataset pilot secara pseudonim di [`backend/scripts/export_pilot_data.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/scripts/export_pilot_data.py).

Skrip ini menjamin bahwa seluruh data hasil intervensi pra-pembelian, keputusan pengguna, umpan balik pasca-keputusan, dan transaksi dapat diekspor untuk analisis statistik naskah skripsi tanpa mengekspos identitas asli pengguna (*PII-free*), terikat secara ketat dengan persetujuan partisipan (*informed consent* dari Tugas F3), dan menggunakan algoritma hashing bertingkat HMAC-SHA256 ber-salt lingkungan.

---

## 2. Cara Kerja & Fitur Utama

### 2.1 Pemetaan Identitas Pseudonim (*HMAC Participant Code*)
- Setiap `user_id` dienkripsi satu arah menggunakan fungsi `generate_participant_code(user_id, salt)`.
- Menggunakan HMAC-SHA256 dengan kunci rahasia (*salt*) yang dibaca dari variabel lingkungan `RESEARCH_PSEUDONYMIZATION_SALT`. Kunci salt tidak pernah disimpan secara *hardcoded* di dalam repositori kode publik.
- **Format Keluaran**: `PARTICIPANT-XXXXXXXXXXXX` (12 karakter heksadesimal kapital).
- **Karakteristik**:
  - *Deterministik*: Pengguna yang sama akan selalu menghasilkan `participant_code` yang identik dalam satu sesi analisis, memungkinkan analisis tren longitudinal antar-tabel.
  - *Irreversible*: Pihak luar tidak dapat membalikkan `participant_code` menjadi `user_id` asli Supabase.

### 2.2 Penegakan Persetujuan Partisipan (*Consent Enforcement*)
- Terintegrasi langsung dengan skema persetujuan partisipan (Tugas F3).
- Fungsi `extract_consented_user_ids()` memeriksa status konsensus terbaru pengguna:
  - Hanya pengguna dengan `given = True` dan `withdrawn_at = None` yang diikutsertakan.
  - Pengguna yang menolak persetujuan (`given = False`), pengguna yang mencabut persetujuannya (`withdrawn_at != None`), atau pengguna tanpa catatan persetujuan **dikeluarkan secara mutlak** dari seluruh tabel ekspor.

### 2.3 Pembersihan PII (*PII Scrubbing*)
- Seluruh atribut identitas pribadi (`user_id`, nama lengkap, alamat surel, nomor telepon, IP address) disingkirkan dari dataset.
- Catatan teks bebas (`feedback_notes`, `notes`) ditiadakan dari CSV untuk menghindari potensi pembocoran informasi pribadi secara tidak sengaja (*accidental PII leak*); hanya bendera biner `has_notes: bool` yang dipertahankan.

---

## 3. Spesifikasi Berkas dan Kolom Keluaran

Ekspor menghasilkan 4 berkas CSV terstruktur dan 1 berkas manifest metadata JSON di direktori keluaran:

### 3.1 `pilot_checks_pseudonymized.csv`
Merekam evaluasi pra-pembelian yang dilakukan partisipan:
| Nama Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `check_id` | String (UUID) | ID unik sesi pengecekan pra-pembelian |
| `participant_code` | String | Kode pseudonim partisipan |
| `category_name` | String | Nama kategori belanja (Shopping, F&B, dsb.) |
| `planned_amount` | Float | Nominal rencana belanja (Rupiah) |
| `risk_score` | Float | Skor probabilitas risiko model ($0.0 - 1.0$) |
| `risk_level` | String | Klasifikasi risiko (`LOW`, `MEDIUM`, `HIGH`) |
| `cold_start` | Boolean | Apakah evaluasi menggunakan fallback cold start |
| `created_at` | Timestamp (ISO) | Waktu pemeriksaan dilakukan |

### 3.2 `pilot_decisions_pseudonymized.csv`
Merekam tindakan yang dipilih partisipan setelah intervensi peringatan dini:
| Nama Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `decision_id` | String (UUID) | ID unik rekaman keputusan |
| `check_id` | String (UUID) | Relasi ke sesi pemeriksaan pra-pembelian |
| `participant_code` | String | Kode pseudonim partisipan |
| `decision` | String | Tindakan: `PROCEED`, `ADJUST`, atau `POSTPONE` |
| `adjusted_amount` | Float / Null | Nominal baru jika keputusan adalah `ADJUST` |
| `decided_at` | Timestamp (ISO) | Waktu keputusan diambil |

### 3.3 `pilot_feedback_pseudonymized.csv`
Merekam konfirmasi realisasi belanja pasca-keputusan (24–72 jam kemudian):
| Nama Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `feedback_id` | String (UUID) | ID unik rekaman umpan balik |
| `check_id` | String (UUID) | Relasi ke sesi pemeriksaan pra-pembelian |
| `participant_code` | String | Kode pseudonim partisipan |
| `actually_purchased` | Boolean / Null | Apakah barang benar-benar dibeli |
| `was_unplanned` | Boolean / Null | Kesesuaian rencana (`False`: sesuai rencana, `True`: tidak terencana) |
| `satisfaction_rating` | Integer (1–5) | Tingkat kepuasan partisipan |
| `has_notes` | Boolean | Indikator apakah partisipan menyertakan catatan |
| `submitted_at` | Timestamp (ISO) | Waktu umpan balik dikirimkan |

### 3.4 `pilot_transactions_pseudonymized.csv`
Merekam riwayat transaksi agregat untuk pembanding baseline:
| Nama Kolom | Tipe Data | Deskripsi |
|---|---|---|
| `transaction_id` | String (UUID) | ID transaksi keuangan |
| `participant_code` | String | Kode pseudonim partisipan |
| `category_name` | String | Kategori pengeluaran |
| `amount` | Float | Nominal transaksi |
| `type` | String | Tipe: `EXPENSE` atau `INCOME` |
| `is_unplanned` | Boolean / Null | Status keterencaan transaksi |
| `transaction_date` | Timestamp (ISO) | Waktu transaksi terjadi |

### 3.5 `export_manifest.json`
Berkas manifest verifikasi audit penelitian:
- Menghitung jumlah partisipan aktif yang memenuhi syarat persetujuan.
- Merekam jumlah baris yang berhasil diekspor per tabel.
- Merekam jumlah rekaman yang diabaikan (*skipped*) karena tidak memiliki persetujuan.
- Menyimpan pratinjau kunci salt dan cap waktu ekspor UTC.

---

## 4. Panduan Penggunaan (*Usage Guide*)

### 4.1 Eksekusi Standar (CLI)
```bash
# Menjalankan ekspor seluruh tabel ke folder default
python backend/scripts/export_pilot_data.py --output-dir backend/exports/pilot_data/
```

### 4.2 Eksekusi dengan Filter Rentang Tanggal
```bash
# Ekspor data pilot untuk periode 1 Juni 2026 s/d 31 Agustus 2026
python backend/scripts/export_pilot_data.py \
  --output-dir backend/exports/pilot_data/ \
  --start-date 2026-06-01 \
  --end-date 2026-08-31
```

### 4.3 Eksekusi dengan Salt Khusus
```bash
python backend/scripts/export_pilot_data.py \
  --salt "kunci_rahasia_peneliti_skripsi_xyz" \
  --tables checks,decisions,feedback
```

---

## 5. Keterbatasan Metodologis Penelitian
1. **Catatan Kualitatif Bebas (*Free-text Notes*)**:
   Demi mencegah kebocoran identitas (misal pengguna menuliskan nama toko lokal spesifik atau nama rekannya pada catatan), teks bebas dieksklusi secara penuh dari ekspor kuantitatif dan hanya direpresentasikan sebagai bendera `has_notes`. Jika peneliti memerlukan analisis tematik kualitatif, diperlukan proses kurasi manual terpisah dengan peninjauan anonimisasi langsung.
2. **Ketergantungan terhadap Konsistensi Salt**:
   Untuk menggabungkan (*merge*) beberapa kumpulan ekspor di waktu yang berbeda, peneliti wajib menggunakan nilai salt yang sama persis (`RESEARCH_PSEUDONYMIZATION_SALT`). Jika salt berubah antar-eksekusi, `participant_code` untuk pengguna yang sama akan berbeda.

---

## 6. Hasil Verifikasi Pengujian

Pengujian unit otomatis diimplementasikan pada [`backend/tests/test_export_pilot_data.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_export_pilot_data.py) dengan 6 skenario pengujian komprehensif:
1. `test_participant_code_determinism`: **LULUS** (HMAC stabil dan deterministik).
2. `test_consented_user_ids_filtering`: **LULUS** (Hanya pengguna `given=True` dan `withdrawn=None` yang lolos).
3. `test_export_excludes_unconsented_data`: **LULUS** (Data pengguna tanpa consent/withdrawn 100% dilewati pada seluruh tabel CSV).
4. `test_no_pii_columns_in_exported_csv`: **LULUS** (Zero PII leak: tidak ada nama, surel, nomor HP, atau catatan bebas pada header dan baris data).
5. `test_date_range_filtering`: **LULUS** (Filter rentang tanggal menyaring baris di luar batas secara presisi).
6. `test_manifest_metadata_file_generated`: **LULUS** (Metadata ringkasan terbit secara valid).
