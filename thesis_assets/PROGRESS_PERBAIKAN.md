# Progres Perbaikan Proyek

Cabang kerja: thesis/perbaikan-pilot

| Kode | Tugas | Status | Commit | File berubah | Hasil tes | Kendala |
|:---|:---|:---|:---|:---|:---|:---|
| F0 | Persiapan dan verifikasi ulang | SELESAI | 33603b7 (dokumen) | docs/AGENT_PERBAIKAN.md, thesis_assets/F0_verifikasi_ulang.md, thesis_assets/F0_keluaran_pelatihan.txt | flutter analyze (Lulus 0 isu), backend import (Lulus), train_risk_model (Lulus), frontend lint (295 isu warisan) | Tidak ada tes otomatis formal bawaan; metrik lama di kode berstatus hardcoded |
| F4 | Pengaman JWT admin | SELESAI | 52af04f | backend/app/utils/auth.py, backend/app/api/admin.py, backend/.env.example, backend/scripts/set_admin_role.sql, backend/tests/test_admin_auth.py, frontend/src/app/auth/page.tsx, frontend/src/app/admin/models/page.tsx, frontend/src/app/admin/audit-logs/page.tsx, thesis_assets/F4_pengaman_admin.md | 6/6 test_admin_auth.py LULUS, tsc --noEmit LULUS, flutter analyze LULUS | SUPABASE_JWT_SECRET perlu diisi pengguna di .env lokal backend |
| F1 | Persistensi pra-pembelian | SELESAI | 31c7043 | backend/db/migrations/001_pre_purchase_and_governance.sql, backend/app/services/pre_purchase_repository.py, backend/app/api/pre_purchase.py, backend/app/api/admin.py, backend/.env.example, backend/tests/test_persistence.py, thesis_assets/F1_persistensi.md | 12/12 backend tests LULUS (6 persistensi + 6 auth guard), tsc LULUS, flutter analyze LULUS | Basis data lokal tidak tersedia; pengujian mode DB diuji via mock HTTP |
| F2 | Statistik pengguna nyata | SELESAI | e145501 | backend/app/services/user_stats_service.py, backend/app/api/pre_purchase.py, backend/app/schemas/pre_purchase_schema.py, backend/tests/test_user_stats.py, thesis_assets/F2_statistik_nyata.md | 19/19 backend tests LULUS (7/7 test_user_stats.py) | - |
| F3 | Persetujuan partisipan | BELUM | - | - | - | - |
| F5 | Pemicu konfirmasi pasca-keputusan | BELUM | - | - | - | - |
| F7 | Metrik pelatihan nyata | BELUM | - | - | - | - |
| F8 | Pembersihan chatbot dan NestJS | BELUM | - | - | - | - |
| F9 | Ekspor data pseudonim | BELUM | - | - | - | - |
| F6 | Konsolidasi tes | BELUM | - | - | - | - |
| F10 | Telemetri tambahan | BELUM | - | - | - | - |
