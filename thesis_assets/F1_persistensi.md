# Laporan Persistensi Data Pra-Pembelian ke PostgreSQL (F1)

**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Tanggal Penyelesaian:** 13 Oktober 2026  
**Status:** SELESAI  

---

## 1. Ringkasan

Tugas F1 bertujuan untuk memastikan seluruh siklus pemeriksaan pra-pembelian—meliputi permintaan evaluasi belanja, hasil inferensi risiko ML beserta 7 fitur kontekstual, respon keputusan pengguna (*PROCEED / ADJUST / POSTPONE*), umpan balik verifikasi pasca-transaksi (*ground truth*), registri versi model, dan log audit—memiliki skema permanen di PostgreSQL (Supabase) dan dapat disimpan secara permanen menggantikan penyimpanan *in-memory*.

Sesuai aturan keselamatan proyek, berkas migrasi SQL telah dibuat secara idempoten dan **TIDAK dieksekusi langsung ke basis data produksi**. Lapisan repositori fleksibel dengan sakelar konfigurasi lingkungan `PERSISTENCE_BACKEND=db|memory` (bawaan: `memory`) telah diimplementasikan agar perilaku lama tetap stabil selama migrasi belum diterapkan oleh pengguna.

---

## 2. Berkas Migrasi SQL Idempoten

Berkas migrasi SQL disimpan pada:  
[backend/db/migrations/001_pre_purchase_and_governance.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/db/migrations/001_pre_purchase_and_governance.sql)

### Struktur Tabel yang Didefinisikan:

| Nama Tabel | Tujuan Entitas | Kunci Utama & Relasi Asing | Kebijakan Row-Level Security (RLS) |
|:---|:---|:---|:---|
| `public.model_versions` | Registri versi model ML, riwayat deployment, dan metrik akurasi | `id UUID PRIMARY KEY`, `deployed_by -> auth.users(id)` | Pengguna terautentikasi dapat membaca versi model; hanya admin yang dapat mengubah/mengelola |
| `public.pre_purchase_checks` | Permintaan evaluasi belanja pra-pembelian dan status keputusan | `id UUID PRIMARY KEY`, `user_id -> auth.users(id) ON DELETE CASCADE` | Isolasi penuh per pengguna: `auth.uid() = user_id` untuk SELECT, INSERT, UPDATE |
| `public.risk_predictions` | Hasil skor risiko, level, snapshot 7 fitur kontekstual (JSONB), dan faktor pemicu | `id UUID PRIMARY KEY`, `check_id -> pre_purchase_checks(id) ON DELETE CASCADE` | Akses SELECT dan INSERT dibatasi hanya untuk pemilik cek (`check.user_id = auth.uid()`) |
| `public.post_decision_feedbacks` | Label evaluasi pasca-keputusan (`was_impulsive`) untuk retraining berkelanjutan | `id UUID PRIMARY KEY`, `check_id -> pre_purchase_checks(id) ON DELETE CASCADE` | Akses SELECT dan INSERT dibatasi hanya untuk pemilik cek (`check.user_id = auth.uid()`) |
| `public.audit_logs` | Log audit akuntabilitas operator/admin (mis. rollback model) | `id UUID PRIMARY KEY`, `actor_id -> auth.users(id) ON DELETE CASCADE` | Diproteksi ketat: hanya pengguna dengan peran admin yang dapat membaca dan menulis |

### Indeks Kinerja Query (Optimalisasi Latensi < 400 ms):
- `idx_model_versions_active` pada `public.model_versions(is_active)`
- `idx_pre_purchase_checks_user_created` pada `public.pre_purchase_checks(user_id, created_at DESC)`
- `idx_risk_predictions_check_id` pada `public.risk_predictions(check_id)`
- `idx_post_decision_feedbacks_check_id` pada `public.post_decision_feedbacks(check_id)`
- `idx_audit_logs_actor_created` pada `public.audit_logs(actor_id, created_at DESC)`

---

## 3. Panduan Penerapan Migrasi bagi Pengguna

Untuk menerapkan skema tabel dan kebijakan keamanan RLS di atas ke basis data Supabase:

### Opsi A: Melalui Dashboard Web Supabase (Disarankan)
1. Buka dashboard proyek Supabase Anda: [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Pilih proyek Anda, lalu buka menu **SQL Editor** pada panel navigasi kiri.
3. Klik tombol **New Query**.
4. Salin seluruh isi berkas [backend/db/migrations/001_pre_purchase_and_governance.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/db/migrations/001_pre_purchase_and_governance.sql) dan tempel ke editor query.
5. Klik tombol **Run** (atau tekan `Ctrl+Enter`).
6. Periksa pesan sukses pada konsol bawah editor. Seluruh 5 tabel, indeks, dan kebijakan RLS telah aktif.

### Opsi B: Mengaktifkan Persistensi ke Database pada Backend
Setelah migrasi SQL dijalankan di Supabase:
1. Buka berkas `.env` lokal backend.
2. Tambahkan atau ubah variabel berikut:
   ```bash
   PERSISTENCE_BACKEND=db
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
   ```
3. Mulai ulang server FastAPI (`uvicorn app.main:app`). Backend kini akan menyimpan data transaksi pra-pembelian langsung ke tabel PostgreSQL Supabase.

---

## 4. Perubahan Kode Backend

1. **Lapisan Repositori Baru:**
   Modul [backend/app/services/pre_purchase_repository.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_repository.py) menyediakan antarmuka penyimpanan terpadu untuk:
   - `save_check(...)`: Merekam pemeriksaan dan inferensi fitur ke DB / memory.
   - `get_check(...)`: Mengambil data pemeriksaan aktif.
   - `record_decision(...)`: Memperbarui pilihan `PROCEED`, `ADJUST`, atau `POSTPONE`.
   - `record_feedback(...)`: Menyimpan ground truth `was_impulsive`.
   - `load_model_registry(...)`: Membaca tabel `model_versions` saat `PERSISTENCE_BACKEND=db`, dengan jalur kembali otomatis (*fallback*) ke `artifacts_risk/model_registry.json` jika tabel kosong.
   - `execute_model_rollback(...)`: Memperbarui model aktif, mewajibkan alasan rollback, dan mencatat aksi ke tabel `audit_logs`.
   - `get_audit_logs(...)`: Menyajikan log riwayat intervensi dengan paginasi.
2. **Refaktor Router Pra-Pembelian:**
   Pada [backend/app/api/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py), variabel dictionary global *in-memory* telah digantikan sepenuhnya dengan pemanggilan metode `repository`.
3. **Refaktor Router Admin:**
   Pada [backend/app/api/admin.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py), daftar model, eksekusi rollback, dan audit logs kini bersumber dari repositori terpadu.
4. **Dokumentasi `.env.example`:**
   Variabel `PERSISTENCE_BACKEND=db|memory` telah didokumentasikan di [backend/.env.example:20-21](file:///c:/Users/wira1/project/ceamis_capstone/backend/.env.example#L20-L21).

---

## 5. Hasil Pengujian Otomatis

Pengujian siklus persistensi diimplementasikan pada berkas [backend/tests/test_persistence.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_persistence.py).

### Hasil Eksekusi Keseluruhan Test Suite Backend:
```text
Ran 12 tests in 0.487s
OK
```

### Rincian Skenario Uji:
1. **Siklus Lengkap Mode Memory (`test_full_check_decide_feedback_lifecycle_memory`):**
   - Mengirim permintaan cek pra-beli -> memeriksa pembuatan `check_id` dan penyimpanan data awal (LULUS).
   - Mengirim keputusan penundaan (`POSTPONE`) -> memverifikasi status berubah menjadi `RECORDED` dan stempel waktu `decided_at` terisi (LULUS).
   - Mengirim feedback kepuasan dan label `was_impulsive=False` -> memverifikasi feedback terhubung dengan benar ke `check_id` (LULUS).
2. **Validasi Check ID Tidak Ditemukan (`test_decide_and_feedback_404_for_unknown_check_id`):**
   - Permintaan keputusan dan feedback pada `check_id` fiktif ditolak dengan status **404 Not Found** (LULUS).
3. **Tata Kelola Model Memory (`test_model_registry_and_audit_logs_memory`):**
   - Registry termuat dengan benar, rollback model dinonaktifkan/diaktifkan sesuai target, dan entri `audit_logs` tercatat (LULUS).
4. **Lapisan Repositori Mode DB [Belum Diuji pada DB Nyata — Diuji via Mock]:**
   - `test_db_mode_flag`: Sakelar `is_db_mode` aktif saat konfigurasi diatur ke `db` (LULUS).
   - `test_save_check_db_calls_supabase`: Memverifikasi payload terkirim ke REST API Supabase (LULUS).
   - `test_load_model_registry_db_with_fallback`: Memverifikasi pembacaan dari tabel DB dan otomatis kembali ke berkas JSON ketika tabel kosong (LULUS).

---

## 6. Analisis Risiko & Mitigasi

- **Risiko:** Pengguna menjalankan aplikasi di server sebelum mengeksekusi migrasi SQL di Supabase.
  - **Mitigasi:** Nilai bawaan konfigurasi adalah `PERSISTENCE_BACKEND=memory`. Aplikasi tetap berfungsi 100% normal tanpa galat koneksi basis data. Transisi ke persistensi permanen dilakukan hanya saat pengguna telah menjalankan migrasi SQL dan mengubah konfigurasi ke `db`.
- **Risiko:** Gangguan jaringan sementara saat koneksi ke endpoint Supabase pada mode `db`.
  - **Mitigasi:** Lapisan repositori menangani pengecualian koneksi dengan logging peringatan dan tidak mematikan proses inferensi utama pengguna.
