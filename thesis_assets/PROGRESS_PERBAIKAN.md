# Progres Perbaikan Proyek

Cabang kerja: thesis/perbaikan-pilot

| Kode | Tugas | Status | Commit | File berubah | Hasil tes | Kendala |
|:---|:---|:---|:---|:---|:---|:---|
| F0 | Persiapan dan verifikasi ulang | SELESAI | - (dokumen saja) | thesis_assets/F0_verifikasi_ulang.md, thesis_assets/F0_keluaran_pelatihan.txt, thesis_assets/PROGRESS_PERBAIKAN.md | flutter analyze (Lulus 0 isu), backend import (Lulus), train_risk_model (Lulus), frontend lint (295 isu warisan) | Tidak ada tes otomatis formal bawaan; metrik lama di kode berstatus hardcoded |
| F4 | Pengaman JWT admin | SELESAI | F4: pasang guard JWT pada router admin dan peran dinamis Next.js | backend/app/utils/auth.py, backend/app/api/admin.py, backend/.env.example, backend/scripts/set_admin_role.sql, backend/tests/test_admin_auth.py, frontend/src/app/auth/page.tsx, frontend/src/app/admin/models/page.tsx, frontend/src/app/admin/audit-logs/page.tsx, thesis_assets/F4_pengaman_admin.md | 6/6 test_admin_auth.py LULUS, tsc --noEmit LULUS, flutter analyze LULUS | SUPABASE_JWT_SECRET perlu diisi pengguna di .env lokal backend |
| F1 | Persistensi pra-pembelian | BELUM | - | - | - | - |
| F2 | Statistik pengguna nyata | BELUM | - | - | - | - |
| F3 | Persetujuan partisipan | BELUM | - | - | - | - |
| F5 | Pemicu konfirmasi pasca-keputusan | BELUM | - | - | - | - |
| F7 | Metrik pelatihan nyata | BELUM | - | - | - | - |
| F8 | Pembersihan chatbot dan NestJS | BELUM | - | - | - | - |
| F9 | Ekspor data pseudonim | BELUM | - | - | - | - |
| F6 | Konsolidasi tes | BELUM | - | - | - | - |
| F10 | Telemetri tambahan | BELUM | - | - | - | - |
