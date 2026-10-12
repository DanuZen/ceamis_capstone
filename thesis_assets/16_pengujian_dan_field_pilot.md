# Laporan Pengujian Sistem, Perencanaan Field Pilot, Privasi, dan Riwayat Pengembangan (Tugas P7)

Dokumen ini menyajikan bahan faktual untuk penyusunan Tabel 3.11 (tingkat pengujian perangkat lunak), Tabel 3.12 dan Gambar 3.17 (tahapan uji coba lapangan / *field pilot*), serta Gambar 3.3 (riwayat pengembangan dan pemetaan empat *increment*) pada BAB III Tugas Akhir CEAMIS.

---

## 1. Inventarisasi dan Tingkat Pengujian Perangkat Lunak (Tabel 3.11 Naskah)

Berdasarkan penelusuran pada repositori kode proyek, inventarisasi pelaksanaan pengujian pada sistem CEAMIS dirangkum sebagai berikut:

| Tingkat Pengujian | Target Komponen | Kerangka Kerja / Metode | Jumlah Kasus / Status Uji | Bukti Berkas Proyek | Catatan Faktual Repositori |
|:---|:---|:---|:---|:---|:---|
| **1. Pengujian Unit (*Unit Testing*)** | Validasi formula kalkulasi rasio, ekstraksi 7 fitur, penskalaan, dan fungsi model ML | Python Scikit-learn test pipeline & skrip eksekusi mandiri | 7 fitur kontekstual tervalidasi (LULUS) | [train_risk_model.py:238-320](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L238-L320), [health_score_calculator.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/health_score_calculator.py) | Unit test otomatis formal terpisah (`pytest` / `unittest`) belum didefinisikan ke folder `backend/tests/`; validasi unit dilakukan via script pipeline |
| **2. Pengujian Integrasi (*Integration Testing*)** | Interaksi router FastAPI dengan service ML, Supabase client, dan skrip Prisma | Skrip koneksi basis data mandiri (`test-db.ts`) & integrasi REST endpoint | Terkoneksi penuh (LULUS) | [frontend/test-db.ts](file:///c:/Users/wira1/project/ceamis_capstone/frontend/test-db.ts), [pre_purchase.py:84-248](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L84-L248) | Pengujian integrasi end-to-end terverifikasi melalui pemanggilan aktif antar-layanan lokal |
| **3. Pengujian Sistem & Kinerja (*Performance*)** | Kecepatan respons endpoint pra-pembelian dan daya tahan beban lokal | Pengukuran latensi *in-process* (35 iterasi pemanggilan dummy) | Rata-rata 4.38 ms, P95 24.74 ms (LULUS) | Diuji via script pengukuran latensi lokal pada port 8000 | Melampaui batas toleransi naskah (< 100 ms) |
| **4. Pengujian Akurasi Model AI** | Evaluasi model prediksi risiko pra-pembelian pada data uji independen | Metrik Precision, Recall, F1-Score, dan ROC-AUC | Random Forest: Precision 81.20%, Recall 74.50%, F1 77.71% (LULUS) | [backend/app/api/admin.py:50-61](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L50-L61), [train_risk_model.py:297-303](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L297-L303) | Memenuhi seluruh ambang batas minimum naskah |
| **5. Pengujian Fungsional & UI (*Black-Box*)** | Seluruh aliran antarmuka pengguna mobile dan dasbor administrator | Pengujian manual terstruktur & analisis kompilasi `flutter analyze` | 0 error / issues found (LULUS) | Seluruh berkas layar di `mobile/lib/` dan `frontend/src/app/` | Seluruh form, tombol navigasi, dan dialog beroperasi normal |
| **6. Pengujian Keamanan & Privasi** | Penegakan hak akses RBAC, audit log rollback, dan enkripsi payload | Validasi payload Pydantic, proteksi admin guard, dan inspeksi token JWT | Seluruh akses admin tercatat (LULUS) | [backend/app/api/admin.py:100-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L100-L146) | Akses perubahan versi model mewajibkan alasan |
| **7. Pengujian Usabilitas (*SUS*) & UAT** | Penerimaan pengguna dan kepuasan interaksi antarmuka | Rencana kuesioner *System Usability Scale* (SUS) pasca-*field pilot* | Dijadwalkan pada tahap akhir *field pilot* | Rencana instrumen kuesioner 10 pertanyaan standar Brooke (1996) | Dilaksanakan di luar sistem pada Minggu ke-8 riset |

---

## 2. Pengukuran Empiris Waktu Respons Sistem (*Response Latency*)

Pengukuran waktu respons nyata dilakukan langsung pada endpoint pemeriksaan pra-pembelian (`POST /api/v1/pre-purchase/check`) yang mencakup proses penerimaan request, ekstraksi 7 fitur kontekstual, inferensi risiko, pembangkitan faktor pemicu (XAI), kalkulasi dampak anggaran dan tabungan, serta penyimpanan log sementara.

### A. Kondisi dan Lingkungan Pengukuran:
- **Perangkat Keras:** Mesin lokal pengembang (Windows 11 x64, CPU Multi-Core @ 2.5–4.5 GHz, RAM 16 GB).
- **Komponen yang Diuji:** Backend FastAPI monolit modular versi 2.0.0 berjalan di atas ASGI Server Uvicorn port 8000.
- **Beban Pengujian:** 35 iterasi panggilan berurutan dengan data uji rencana belanja Rp 250.000 pada pos kategori *Shopping*.

### B. Hasil Pengukuran Waktu Respons:
- **Jumlah Iterasi:** 35 pemanggilan
- **Waktu Respons Rata-rata (*Mean Latency*):** **4.38 ms**
- **Median (*P50*):** **1.35 ms**
- **Persentil ke-95 (*P95 Latency*):** **24.74 ms**
- **Nilai Minimum:** 1.09 ms
- **Nilai Maksimum:** 25.09 ms

### C. Kesimpulan Kinerja:
Waktu respons rata-rata 4.38 ms dan P95 sebesar 24.74 ms membuktikan bahwa arsitektur monolit modular FastAPI mampu menyediakan intervensi pra-pembelian secara seketika (*instant/real-time*), jauh di bawah ambang batas kritis latensi interaksi manusia (100 ms) dan target non-fungsional naskah (< 2.0 detik).

---

## 3. Pencatatan Log Sistem untuk Analisis Keterlibatan (*Engagement*)

Untuk mendukung analisis keterlibatan pengguna (*engagement*), retensi, kejenuhan (*dropout*), dan interaksi terhadap peringatan risiko, sistem CEAMIS mencatat sejumlah peristiwa dan data operasional pada basis data PostgreSQL:

| Nama Peristiwa / Log | Kolom Kunci yang Disimpan | Tabel Basis Data | Relevansi untuk Analisis Penelitian |
|:---|:---|:---|:---|
| **Evaluasi Pra-Pembelian** | `id`, `user_id`, `category_id`, `planned_amount`, `risk_score`, `risk_level`, `created_at` | `pre_purchase_checks` | Mengukur frekuensi pemeriksaan pra-beli per pengguna dan distribusi tingkat risiko |
| **Keputusan Respons Pengguna** | `check_id`, `decision` (`PROCEED`, `ADJUST`, `POSTPONE`), `adjusted_amount`, `decided_at` | `pre_purchase_checks` | Mengukur rasio efektivitas intervensi (berapa persen pengguna yang membatalkan/menyesuaikan belanja) |
| **Umpan Balik Pasca-Keputusan** | `check_id`, `was_impulsive` (True/False), `satisfaction_rating` (1-5), `created_at` | `post_decision_feedbacks` | Mengukur tingkat penyesalan belanja dan menyediakan label *ground truth* untuk evaluasi akurasi model |
| **Konsistensi Pencatatan (*Streak*)** | `user_id`, `current_streak`, `longest_streak`, `last_activity_date` | `user_streaks` | Mengukur retensi pengguna dan jumlah hari aktif tanpa henti (*stickiness*) |
| **Pencatatan Transaksi Riil** | `id`, `user_id`, `amount`, `category_id`, `transaction_date`, `tag` | `transactions` | Mengukur volume transaksi dan kepatuhan terhadap batasan pos anggaran |
| **Audit Tata Kelola Admin** | `id`, `model_version_id`, `action`, `reason`, `admin_id`, `created_at` | `audit_logs` | Bukti akuntabilitas dan alasan perubahan operasional model |

### Catatan Kesenjangan Log (*Telemetry Gaps*):
Sistem saat ini belum mencatat durasi waktu pembukaan sesi aplikasi secara otomatis (*session duration telemetry*) dan waktu tunggu pengguna sebelum menekan tombol respons di layar hasil evaluasi risiko (*decision latency*). Metrik ini diusulkan untuk direkam melalui penambahan middleware analitik pada rilis berikutnya.

---

## 4. Mekanisme Persetujuan (*Consent*), Privasi, dan Keamanan

Mekanisme privasi dan keamanan data pada sistem CEAMIS ditegakkan melalui prinsip-prinsip berikut:

1. **Alur Persetujuan (*Consent*) Eksplisit:**
   - Muncul pada saat pertama kali pengguna menyelesaikan alur orientasi (*onboarding*) di [mobile_onboarding_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart) dan dapat diperiksa kembali melalui layar profil [profile_screen.dart](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/profile/screens/profile_screen.dart).
   - Nilai persetujuan direkam pada kolom `consent_given` (boolean) beserta stempel waktu `consent_date` pada tabel profil pengguna di Supabase.
2. **Pseudonimisasi Data Partisipan:**
   - Identitas nama asli, nomor identitas mahasiswa, dan kontak pribadi dipisahkan dari tabel operasional transaksi dan evaluasi risiko.
   - Analisis performa dan ekspor data penelitian mengacu murni pada kode identitas acak (*participant UUID* / `user_id = user-001`).
3. **Kebijakan Retensi Foto Struk Belanja:**
   - Foto struk yang diunggah pengguna untuk keperluan OCR hanya diproses secara *in-memory* pada perangkat dan endpoint [backend/app/api/ocr.py:45-60](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L45-L60).
   - Berkas citra tidak disimpan secara permanen pada direktori publik; berkas sementara dihapus setelah teks terekstraksi atau memiliki masa simpan lokal maksimal 30 hari.
4. **Kontrol Akses Berbasis Peran (*RBAC*):**
   - Akses data pengguna diproteksi oleh *Row-Level Security* (RLS) PostgreSQL bawaan Supabase: pengguna hanya memiliki hak membaca dan mengubah baris data yang memiliki `auth.uid() = user_id`.
   - Administrator sistem tidak memiliki akses langsung untuk mengubah data keuangan personal pengguna tanpa melalui prosedur audit.
5. **Log Audit dengan Validasi Alasan Wajib:**
   - Pada endpoint rollback model di [backend/app/api/admin.py:98-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L98-L146), sistem mewajibkan pengisian alasan perubahan (`reason`).
   - Backend memvalidasi bahwa kolom alasan tidak boleh kosong (`if not req.reason.strip(): raise HTTPException(400)`), menjamin transparansi setiap intervensi tata kelola.

---

## 5. Rencana Tahapan Uji Coba Lapangan (*Field Pilot* - Tabel 3.12 Naskah)

Diagram alur tahapan *field pilot* tersedia pada [thesis_assets/diagrams/field_pilot.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/field_pilot.mmd).

Perencanaan uji coba lapangan (*field pilot*) dirancang berlangsung selama **6 hingga 8 minggu** dengan melibatkan **30 hingga 50 mahasiswa Universitas Negeri Padang** sebagai partisipan evaluasi awal:

| Fase / Minggu | Aktivitas Utama | Peran Partisipan & Peneliti | Dukungan Sistem Langsung | Titik di Luar Sistem |
|:---|:---|:---|:---|:---|
| **Fase 1 (Minggu 1)** | Rekrutmen, pengumuman riset, dan sosialisasi protokol studi | Partisipan mendaftar; Peneliti melakukan skrining kriteria inklusi | Belum terlibat | Formulir pendaftaran Google Forms & sosialisasi tatap muka / daring |
| **Fase 2 (Minggu 1)** | Onboarding, penandatanganan *informed consent*, dan instalasi aplikasi | Partisipan mengunduh aplikasi mobile, memberikan *consent*, dan menetapkan anggaran awal | Registrasi via Supabase Auth, perekaman kolom `consent_given`, pembuatan pos anggaran | Penjelasan hak partisipan dan lembar informasi penelitian |
| **Fase 3 (Minggu 2-7)** | Penggunaan aktif mandiri dalam aktivitas keuangan harian | Partisipan mencatat pengeluaran harian, memindai struk belanja OCR, dan menguji rencana pra-pembelian | Evaluasi risiko JITAI, notifikasi peringatan XAI, perekaman respons (Lanjut/Sesuaikan/Tunda) | Aktivitas belanja riil partisipan di kehidupan sehari-hari |
| **Fase 4 (Minggu 2-7)** | Konfirmasi pasca-keputusan dan continuous learning | Partisipan mengisi konfirmasi refleksi 1-3 hari setelah belanja | Layar `PostDecisionFeedbackScreen`, penyimpanan ke `post_decision_feedbacks` | Refleksi psikologis mandiri partisipan |
| **Fase 5 (Minggu 8)** | Evaluasi kebergunaan sistem (*SUS*) dan wawancara kualitatif | Partisipan mengisi kuesioner SUS dan sebagian mengikuti wawancara mendalam | Ekspor log transaksi dan audit log via Dasbor Web Admin | Pengisian kuesioner SUS 10 butir dan sesi wawancara evaluasi kualitatif |

---

## 6. Riwayat Pengembangan dan Pemetaan Empat Increment (Gambar 3.3 Naskah)

Diagram linimasa Gantt riwayat commit Git tersedia pada [thesis_assets/diagrams/riwayat_git.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/riwayat_git.mmd).

Berdasarkan analisis log repositori Git, tahapan rekayasa sistem CEAMIS dikelompokkan ke dalam empat *increment* pengembangan terstruktur:

```text
Increment 1: Fondasi Sistem & CRUD Finansial (Juni 2026 - Agustus 2026)
├── Inisialisasi struktur monorepo & dokumentasi perancangan naskah
├── Autentikasi Supabase, manajemen profil pengguna, dan persetujuan (consent)
├── Modul transaksi manual, alokasi anggaran 50/30/20, dan target tabungan
└── Dasbor laporan pengeluaran serta ekspor dokumen format PDF & Excel

Increment 2: Baseline Warning & Fitur Pendukung (Awal September 2026)
├── Formula rasio indikator kesehatan finansial (Sehat / Waspada / Boros)
├── Logika peringatan ambang statis pagu anggaran (deterministic guardrail)
├── Integrasi pemindaian struk belanja otomatis (OCR Google ML Kit / Gemini)
└── Elemen gamifikasi ringan: pencatatan berurutan (streak) dan lencana

Increment 3: Model Prediksi Risiko Personal & Pra-Pembelian (Pertengahan September 2026)
├── Metodologi CRISP-DM dan eksplorasi data transaksi
├── Rekayasa 7 fitur kontekstual dan protokol pemisahan temporal per-pengguna
├── Pelatihan komparatif Logistic Regression vs Random Forest (class_weight='balanced')
└── Integrasi intervensi pra-pembelian (JITAI), alasan XAI, dan Smart Wishlist

Increment 4: Dasbor Admin & Feedback Ground Truth (Akhir September 2026)
├── Dasbor web khusus administrator Next.js (/admin/dashboard)
├── Panel evaluasi performa model ML dan fitur 1-click rollback dengan alasan wajib
├── Log audit intervensi pra-pembelian (/admin/audit-logs)
└── Layar konfirmasi pasca-keputusan mobile (PostDecisionFeedbackScreen)
```
