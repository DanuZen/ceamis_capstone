# Laporan Penerapan Pengaman JWT dan Kontrol Akses Admin (F4)

**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Tanggal Penyelesaian:** 13 Oktober 2026  
**Status:** SELESAI  

---

## 1. Ringkasan

Tugas F4 bertujuan untuk mengamankan seluruh rute tata kelola model dan log audit pada router `/api/v1/admin/*` FastAPI agar hanya dapat diakses oleh pengguna yang terautentikasi dan memiliki peran administrator (`role: "admin"`). Selain itu, sistem penentuan peran admin pada antarmuka Next.js yang sebelumnya memeriksa alamat surel hardcoded telah diubah menjadi evaluasi klaim peran terverifikasi dari sesi Supabase Auth.

---

## 2. Matriks Pengamanan Endpoint Admin: Sebelum vs Sesudah

| Metode & Endpoint | Fungsi | Pengamanan Sebelum F4 | Pengamanan Sesudah F4 | Respons Akses Ilegal |
|:---|:---|:---|:---|:---|
| `GET /api/v1/admin/models` | Menampilkan seluruh versi model ML dan metrik evaluasi | **Tanpa Pengaman** (publik, siapa saja dapat memanggil tanpa header autentikasi) | Dilindungi dependensi `verify_admin_role` via router FastAPI `APIRouter(dependencies=[Depends(...)])` | 401 (tanpa token / token cacat), 403 (bukan admin) |
| `POST /api/v1/admin/models/rollback` | Melakukan 1-click rollback versi model aktif | **Tanpa Pengaman** (hanya memvalidasi format request body Pydantic) | Dilindungi dependensi `verify_admin_role` pada router + injeksi `admin_user: dict = Depends(verify_admin_role)` untuk audit jejak pengguna | 401 (tanpa token), 403 (bukan admin), 422 (alasan < 5 karakter) |
| `GET /api/v1/admin/audit-logs` | Mengambil log riwayat intervensi pra-pembelian | **Tanpa Pengaman** (publik tanpa verifikasi pengguna) | Dilindungi dependensi `verify_admin_role` via router FastAPI `APIRouter(dependencies=[Depends(...)])` | 401 (tanpa token / token cacat), 403 (bukan admin) |

Bukti kode:
- [backend/app/utils/auth.py:53-100](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/auth.py#L53-L100)
- [backend/app/api/admin.py:14-20, 101-147](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L14-L20)

---

## 3. Perubahan pada Frontend (Next.js)

1. **Pembersihan Logika Hardcoded Email:**
   Pada [frontend/src/app/auth/page.tsx:51](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/auth/page.tsx#L51), pemeriksaan hardcoded email `admin@ceamis.com` dan `admin@ceamis.id` telah dihapus. Peran pengguna kini ditentukan murni berdasarkan klaim sesi Supabase:
   ```typescript
   const finalRole = data.user?.app_metadata?.role || data.user?.user_metadata?.role || "user";
   ```
2. **Penyertaan Token Bearer pada Dasbor Admin:**
   Dua halaman admin yang berkomunikasi langsung dengan FastAPI kini secara otomatis mengambil token akses sesi pengguna yang sedang masuk via Supabase client (`session.access_token`) dan menyertakannya pada header `Authorization: Bearer <token>`:
   - [frontend/src/app/admin/models/page.tsx:34-90](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/models/page.tsx#L34-L90) (`fetchModels` dan `handleRollback`)
   - [frontend/src/app/admin/audit-logs/page.tsx:41-75](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/admin/audit-logs/page.tsx#L41-L75) (`fetchLogs`)

---

## 4. Cara Memberikan Peran Admin pada Akun Partisipan/Penguji

Karena skema data Supabase produksi tidak boleh diubah langsung oleh agen, panduan dan skrip SQL telah disediakan pada [backend/scripts/set_admin_role.sql](file:///c:/Users/wira1/project/ceamis_capstone/backend/scripts/set_admin_role.sql).

### Langkah-langkah bagi Administrator Sistem:
1. Buka dashboard proyek Supabase di peramban web: **Project -> SQL Editor -> New Query**.
2. Jalankan perintah SQL berikut dengan mengganti `target_email@example.com` sesuai akun yang ditunjuk:
   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb,
       raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
   WHERE email = 'target_email@example.com';
   ```
3. Akun tersebut akan memperoleh token JWT dengan klaim `role: "admin"` pada sesi login berikutnya.

---

## 5. Konfigurasi Variabel Lingkungan Baru

Pada [backend/.env.example:14-17](file:///c:/Users/wira1/project/ceamis_capstone/backend/.env.example#L14-L17), telah ditambahkan variabel:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_JWT_SECRET=your_supabase_jwt_secret_here
```
Variabel `SUPABASE_JWT_SECRET` diperoleh dari dashboard Supabase: **Project Settings -> API -> JWT Settings -> JWT Secret**.

---

## 6. Hasil Pengujian Otomatis

Pengujian unit dan integrasi diimplementasikan pada berkas [backend/tests/test_admin_auth.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_admin_auth.py) menggunakan `unittest` dan `fastapi.testclient.TestClient`.

### Hasil Eksekusi:
```text
Ran 6 tests in 0.029s
OK
```

### Rincian Skenario Uji:
1. `test_unauthenticated_request_rejected_401`: Permintaan tanpa header Authorization pada seluruh endpoint admin `/api/v1/admin/*` mengembalikan status **401 Unauthorized** (LULUS).
2. `test_invalid_and_expired_token_rejected_401`: Permintaan dengan token bertanda tangan salah atau token malformed mengembalikan status **401 Unauthorized** (LULUS).
3. `test_regular_user_token_rejected_403`: Permintaan dengan token sah namun memiliki peran `user` mengembalikan status **403 Forbidden** dengan pesan detail akses ditolak (LULUS).
4. `test_admin_token_accepted_200`: Permintaan dengan token admin yang sah diterima dengan status **200 OK** pada `/admin/models` dan `/admin/audit-logs` (LULUS).
5. `test_admin_from_user_metadata_accepted_200`: Token yang membawa peran admin pada `user_metadata` tetap diterima dengan status **200 OK** (LULUS).
6. `test_rollback_model_validation`: Permintaan rollback tanpa alasan atau alasan kurang dari 5 karakter ditolak dengan status **422 Unprocessable Entity**; permintaan dengan alasan valid (>= 5 karakter) berhasil diproses dengan status **200 OK** dan merekam `admin_id` (LULUS).
