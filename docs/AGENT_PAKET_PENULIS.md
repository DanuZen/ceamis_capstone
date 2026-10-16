# PANDUAN AGEN: PAKET PENYELESAIAN UNTUK PENULISAN BAB III

File ini ditujukan untuk agen AI (Antigravity). Tujuannya satu: menghasilkan SEMUA bahan yang masih kurang atau perlu direvisi untuk penulisan BAB III Tugas Akhir, dan mengumpulkannya dalam SATU folder: `thesis_assets/paket_penulis/`. Pengguna lalu mengirim isi folder itu (atau arsip ZIP-nya) kepada penulis naskah.

## 0. Latar belakang singkat

Pemilik proyek menyusun Tugas Akhir "Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal". Tugas P1 sampai P7 dan F0 sampai F12 sudah dikerjakan, tetapi:

- sebagian laporan saling bertentangan atau salah (misalnya laporan akhir F6 bagian 1 dan 7, daftar fitur pada F12, nama tabel pada ERD akhir);
- beberapa hal belum diverifikasi (kecocokan skema pada layanan statistik F2, pengaman halaman admin Next.js, rute web pengguna, jalur OCR dan model LLM);
- seluruh sumber diagram (`.mmd` dan `.puml`) perlu dibuat ulang agar mencerminkan kondisi akhir proyek;
- teks persetujuan masih memuat nama dan surel karangan, dan satu berkas ekspor ikut ter-commit.

## 1. Cara file ini dipakai

File ini boleh diletakkan di `docs/` (baca saja). SEMUA keluaran ditulis ke `thesis_assets/paket_penulis/` (folder tunggal, tanpa subfolder, kecuali disebut). Pengguna memulai dengan pesan:

> Baca `docs/AGENT_PAKET_PENULIS.md`, ikuti instruksinya, lalu kerjakan tugas G0. Berhenti setelah selesai dan tunggu konfirmasi saya.

## 2. Aturan wajib (berlaku untuk semua tugas)

1. **Satu folder keluaran.** Semua berkas hasil kerja ditulis ke `thesis_assets/paket_penulis/`, dengan nama berkas persis seperti yang disebut pada tiap tugas. Jangan menulis keluaran ke folder lain. Satu-satunya perubahan kode yang diizinkan ada pada TUGAS G3.
2. **Mode baca saja, kecuali G3.** Pada tugas lain jangan mengubah, memformat, atau menghapus file kode. Jika ragu apakah suatu tindakan mengubah kode, jangan lakukan.
3. **Cabang git.** Bekerja di cabang `thesis/perbaikan-pilot`. Jangan `push`, `force push`, `rebase`, atau menghapus cabang. Perubahan kode G3 dikerjakan dalam commit terpisah berawalan `G3:`.
4. **Basis data nyata.** Jangan menjalankan migrasi atau perintah apa pun pada basis data Supabase milik pengguna.
5. **Rahasia dan data pribadi.** Jangan menampilkan atau menyalin isi `.env`, kunci API, token, `SERVICE_ROLE_KEY`, JWT secret, `salt`. Sebut nama variabelnya saja. Jangan memuat data pribadi nyata pada laporan atau diagram. Jangan menyalin `node_modules`, `venv`, `build`, berkas ekspor data, atau `training_data.csv` ke folder paket.
6. **Jangan mengarang.** Setiap klaim di laporan disertai bukti path file dan nomor baris. Jika sesuatu tidak ada, tulis "TIDAK ADA". Jika tidak bisa diverifikasi, tulis "BELUM TERVERIFIKASI". Jangan mengisi bagian yang kosong dengan dugaan.
7. **Jangan menulis ulang klaim tentang naskah.** Kamu tidak memiliki naskah Tugas Akhir. Jangan menyebut apa yang "dikatakan naskah" kecuali kalimat itu ada di prompt tugas ini. Jika perlu membandingkan, bandingkan dengan teks prompt.
8. **Sumber kebenaran.** Untuk skema basis data, sumber kebenarannya berkas SQL migrasi (`backend/db/migrations/*.sql`) dan `frontend/prisma/schema.prisma`, bukan laporan sebelumnya. Untuk fitur dan perilaku, sumber kebenarannya kode.
9. **Diagram.** Tulis sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`). Maksimal sekitar 12 simpul per diagram; jika aslinya lebih besar, buat versi ringkas (nama berakhiran `_ringkas`) dan versi lengkap. Label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom persis seperti di kode. Validasi sintaks (render atau parse) bila alatnya tersedia, dan catat "belum divalidasi" bila tidak.
10. **Izin.** Minta izin sebelum menginstal paket global atau menjalankan perintah di luar folder proyek.
11. **Bahasa.** Laporan berbahasa Indonesia formal, tanpa tanda pisah panjang.

## 3. Alur kerja agen

1. Baca seluruh file ini sebelum mulai.
2. Kerjakan SATU tugas per giliran. Jangan mulai tugas berikutnya sebelum pengguna menyatakan lanjut.
3. Sebelum memulai, perbarui `thesis_assets/paket_penulis/PROGRESS_PAKET.md` ("SEDANG DIKERJAKAN"). Setelah selesai, ubah menjadi "SELESAI", "SEBAGIAN", atau "GAGAL" dan isi kolom file dan kendala.
4. Setelah tiap tugas, berhenti dan tulis di chat: (a) ringkasan lima baris, (b) daftar berkas yang dibuat, (c) hal yang tidak bisa dikerjakan beserta alasannya, (d) pertanyaan "Lanjut ke tugas berikutnya?".
5. Jika terblokir, jangan mengulang berkali-kali. Catat blokir, kerjakan bagian lain yang mungkin, lalu berhenti.

## 4. Urutan tugas

| Urutan | Kode | Tugas | Mengubah kode? |
|:---|:---|:---|:---|
| 1 | G0 | Persiapan folder paket dan berkas progres | Tidak |
| 2 | G1 | Verifikasi lanjutan (skema, admin web, rute web, OCR, fitur model, penghapusan) | Tidak |
| 3 | G2 | Koreksi laporan akhir F6 | Tidak |
| 4 | G3 | Koreksi kecil (teks persetujuan, berkas ekspor, penanda data sintetis) | **Ya, terbatas** |
| 5 | G4 | Daftar langkah manual kesiapan pilot | Tidak |
| 6 | G5 | Status kebutuhan fungsional final (13 FR) | Tidak |
| 7 | G6 | Bukti kebutuhan non-fungsional final | Tidak |
| 8 | G7 | Verifikasi model dan data final | Tidak |
| 9 | G8 | Seluruh sumber diagram final (14 berkas) | Tidak |
| 10 | G9 | Panduan pengambilan tangkapan layar | Tidak |
| 11 | G10 | Indeks paket, ringkasan, dan arsip | Tidak |

## 5. Format `thesis_assets/paket_penulis/PROGRESS_PAKET.md`

```
# Progres Paket Penulis

Cabang kerja: thesis/perbaikan-pilot

| Kode | Tugas | Status | Berkas dihasilkan | Kendala |
|:---|:---|:---|:---|:---|
| G0 | Persiapan | BELUM | - | - |
| G1 | Verifikasi lanjutan | BELUM | - | - |
| G2 | Koreksi laporan F6 | BELUM | - | - |
| G3 | Koreksi kecil | BELUM | - | - |
| G4 | Kesiapan pilot | BELUM | - | - |
| G5 | Status FR final | BELUM | - | - |
| G6 | Bukti NFR final | BELUM | - | - |
| G7 | Model dan data final | BELUM | - | - |
| G8 | Diagram final | BELUM | - | - |
| G9 | Panduan tangkapan layar | BELUM | - | - |
| G10 | Indeks dan arsip | BELUM | - | - |
```

## 6. Kriteria selesai untuk setiap tugas

- Semua berkas yang disebut tugas ada di `thesis_assets/paket_penulis/` dengan nama persis, atau alasan ketiadaannya tercatat.
- Setiap klaim memiliki bukti path:baris.
- Tidak ada rahasia atau data pribadi.
- `PROGRESS_PAKET.md` diperbarui.

---

# 7. DAFTAR TUGAS

---

## TUGAS G0: Persiapan

1. Jalankan `git status`. Jika ada perubahan yang belum di-commit, laporkan dan berhenti.
2. Pastikan berada di cabang `thesis/perbaikan-pilot`. Catat hash commit terakhir.
3. Buat folder `thesis_assets/paket_penulis/` dan berkas `PROGRESS_PAKET.md` sesuai format bagian 5.
4. Catat di chat: hash commit, jumlah tes yang ada, dan apakah backend, frontend, dan mobile dapat dijalankan secara lokal.

---

## TUGAS G1: Verifikasi lanjutan (baca saja)

**Keluaran:** `01_verifikasi_lanjutan.md`, satu bagian per butir, dengan status TERBUKTI, TIDAK TERBUKTI, atau SEBAGIAN beserta bukti path:baris.

1. **Skema nyata versus layanan statistik.** Daftarkan semua tabel dan kolom yang dibaca `backend/app/services/user_stats_service.py` (misalnya `transactions`, `budgets`, `goals`, `planning`, `users.budget_reset_day`). Bandingkan dengan (a) migrasi SQL `backend/db/migrations/*.sql`, (b) `frontend/prisma/schema.prisma`, dan (c) tabel yang benar-benar ditulis aplikasi mobile saat pengguna mencatat transaksi dan mengatur anggaran (telusuri dari layar sampai panggilan basis data). Laporkan setiap ketidakcocokan nama tabel atau kolom, dan nyatakan apakah layanan akan membaca data yang sama dengan yang ditulis aplikasi. Jika basis data lokal tersedia, jalankan satu skenario nyata; jika tidak, tulis "belum diuji pada skema nyata".
2. **Proteksi admin pada Next.js.** Periksa `frontend/src/app/admin/layout.tsx`, middleware Next.js (jika ada), dan semua halaman `frontend/src/app/admin/*`. Untuk setiap halaman: sumber datanya (FastAPI, Supabase, atau Prisma langsung), apakah ada pemeriksaan peran admin sebelum data tampil, dan apa yang terlihat jika dibuka pengguna biasa atau tanpa login.
3. **Rute web untuk pengguna.** Daftarkan semua rute `frontend/src/app/dashboard/*` (di luar `/admin`): fungsinya, data yang dipakai, dan apakah ada rute yang menampilkan saran instrumen investasi (misalnya emas, obligasi, saham, kripto), rekomendasi kredit, atau rekomendasi lain di luar batasan penelitian. Kutip file dan baris. Laporkan apakah rute itu dapat diakses publik. Jangan mengubah apa pun.
4. **OCR dan model LLM.** Daftarkan semua route di `backend/app/api/ocr.py`, jenis masukan masing-masing (teks atau berkas gambar), model Gemini yang benar-benar dipakai (nilai bawaan di `backend/app/utils/llm_client.py` dan variabel lingkungan yang mengubahnya), dan apakah ada jalur yang menerima gambar atau memakai kemampuan visi. Laporan sebelumnya saling bertentangan (satu menyebut Gemini 2.0 multimodal memproses foto, yang lain menyebut hanya teks dan Gemini 1.5 Flash); tentukan mana yang benar dengan bukti.
5. **Fitur model pra-pembelian.** Kutip daftar fitur persis dari `extract_features` di `backend/app/services/pre_purchase_risk.py` dan dari `backend/training/train_risk_model.py`. Laporan F12 menyebut fitur yang berbeda (`amount`, `category_enc`, `urgency_enc`, `monthly_income`, `current_savings`, `monthly_expenses`, `free_cash_flow`) dari F2 dan F7 (`amount_ratio_median`, `budget_remaining_ratio`, `category_frequency`, `day_of_week`, `days_to_reset`, `savings_impact`, `deviation_from_pattern`); nyatakan mana yang benar dan di mana kekeliruannya. Konfirmasi dengan bukti bahwa `risk_profile` dan persona bukan masukan pemeriksaan pra-pembelian.
6. **Versi lingkungan.** Catat versi Python pada `backend/venv` dan yang dipakai skrip pengukuran latensi (F0 mencatat 3.11.9, hasil F6 mencatat 3.13.14), versi Flutter, Dart, Node, dan paket utama backend (FastAPI, scikit-learn, NumPy, Pydantic) dan frontend (Next.js, React, Prisma).
7. **Penghapusan pada F8 Tahap 2.** Tuliskan daftar file dan folder yang dihapus pada commit F8 (termasuk `backend_nestjs_archive/`) dari `git show --stat`, dan nyatakan apakah ada yang masih dirujuk dari kode aktif, dokumentasi, atau skrip.

---

## TUGAS G2: Koreksi laporan akhir F6

**Keluaran:** `03_koreksi_F6.md`.

Periksa `thesis_assets/F6_laporan_akhir.md`:
1. Bagian 1, baris F0, menyebut empat area yang berbeda dari empat klaim yang sebenarnya diverifikasi pada F0 (chatbot, persetujuan, pengaman admin, asal metrik). Tulis versi benar.
2. Bagian 7 memuat kolom "klaim lama pada naskah" yang menggambarkan klaim (NestJS sebagai API inti, chatbot LLM, akurasi sekitar 96%, notifikasi push FCM). Kamu tidak memiliki naskah, jadi tidak boleh membuat daftar klaim naskah. Periksa apakah klaim-klaim itu ada pada dokumen yang pernah diberikan kepadamu (laporan P1 sampai P7, F0 sampai F12). Untuk tiap klaim tulis "ADA di [dokumen]" atau "TIDAK ADA SUMBER". Ganti bagian 7 dengan tabel perbedaan yang benar antara dokumen-dokumen itu (misalnya persetujuan, chatbot, pengaman admin, daftar fitur, nama tabel) beserta kondisi akhir di kode.
3. Perbaiki butir metrik pada bagian 7 yang mencampur PR-AUC baseline (0,9704) dengan Brier Random Forest (0,0515); gunakan nilai dari `F7_keluaran_pelatihan.txt`.
4. Periksa pernyataan "kesiapan penuh untuk pilot" dan tulis ulang berdasarkan temuan G1 dan G4 (hal yang masih bersyarat atau belum diuji pada basis data nyata).

---

## TUGAS G3: Koreksi kecil (satu-satunya tugas yang mengubah kode)

**Keluaran:** `02_koreksi_kecil.md`, serta perubahan kode dalam commit terpisah berawalan `G3:`.

1. **Teks persetujuan.** Pada `mobile/lib/core/constants/consent_text.dart`: (a) ganti nama peneliti dan alamat surel yang dikarang (misalnya "Danu" dan `peneliti@ceamis.ac.id`) dengan penanda `[NAMA PENELITI]`, `[SURAT ELEKTRONIK PENELITI]`, `[NAMA DOSEN PEMBIMBING]`; (b) hapus frasa "dienkripsi" kecuali dapat dibuktikan di kode, dan ganti dengan penanda `[ISI SESUAI LEMBAR INFORMASI PENELITIAN]`; (c) ganti "perilaku belanja impulsif" dengan "pengeluaran tidak terencana"; (d) pertahankan butir `[PEMROSESAN PIHAK KETIGA]`.
2. **Berkas ekspor di git.** Keluarkan `backend/exports/pilot_data/export_manifest.json` dari pelacakan git (`git rm --cached`, tanpa menghapus riwayat), tambahkan `backend/exports/` ke `.gitignore`, dan ubah skrip ekspor agar manifest tidak memuat pratinjau kunci `salt`.
3. **Data sintetis.** Tambahkan berkas `backend/artifacts_risk/README_DATA_SINTETIS.md` yang menyatakan bahwa data pelatihan sintetis dan dibangkitkan oleh `generate_synthetic_data()`.
4. Jalankan seluruh tes dan pastikan lulus. Periksa `git diff` tidak memuat rahasia.
5. Dalam `02_koreksi_kecil.md` catat setiap perubahan (file, baris sebelum dan sesudah, hasil tes).

---

## TUGAS G4: Daftar langkah manual kesiapan pilot

**Keluaran:** `04_kesiapan_pilot.md`. Jangan menjalankan apa pun pada basis data nyata.

Susun daftar langkah berurutan yang harus dilakukan pengguna sebelum *field pilot*, dengan bukti dari kode:
1. Migrasi SQL yang perlu dijalankan di Supabase dan urutannya (`000_*` sampai `003_*`). Untuk tiap migrasi: isinya, apakah idempoten, dan apakah aman dijalankan pada basis data yang sudah berisi tabel lama.
2. Variabel lingkungan wajib per komponen (backend, frontend, mobile): nama saja, tanpa nilai. Sertakan `PERSISTENCE_BACKEND`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `RESEARCH_PSEUDONYMIZATION_SALT`, `LLM_ENABLED`, `LLM_OCR_ENABLED`, `LLM_INSIGHT_ENABLED`, `LLM_EDUCATION_ENABLED`, `ONBOARDING_MODELS_ENABLED`.
3. Cara memberi peran admin pada satu akun.
4. Teks persetujuan yang harus diisi dan di berkas mana.
5. Hal yang harus diuji pada basis data nyata karena sejauh ini hanya diuji dengan data tiruan: kebijakan RLS, mode `db`, alur persetujuan, ekspor pseudonim.
6. Risiko yang tersisa (misalnya default `memory`, pengaman rute web, dasbor web pengguna).

---

## TUGAS G5: Status kebutuhan fungsional final (13 FR)

**Keluaran:** `05_status_fr_final.md`.

Daftar 13 kebutuhan fungsional final (rumusan sudah dirampingkan):
User: FR-U01 akun, profil, dan persetujuan penelitian; FR-U02 anggaran (alokasi 50/30/20) dan tujuan tabungan; FR-U03 catat transaksi (manual atau OCR struk); FR-U04 pemeriksaan pra-pembelian (input rencana, skor risiko beserta alasan, dampak anggaran dan tabungan); FR-U05 respons Lanjut, Sesuaikan, Tunda beserta label konfirmasi pasca-keputusan (termasuk koreksi label); FR-U07 laporan pengeluaran; FR-U08 indikator kesehatan finansial, streak, lencana, dan modul edukasi finansial.
Admin: FR-A01 melihat ringkasan akun pengguna; FR-A02 konfigurasi sistem (aturan cold start dan ambang) sebagaimana tersedia; FR-A03 versi model dan rollback dengan alasan wajib; FR-A04 ringkasan operasional dan status layanan; FR-A05 panel evaluasi model; FR-A06 meninjau log audit.

Untuk setiap FR: status (SELESAI, SEBAGIAN, BELUM, TIDAK DITEMUKAN) pada kondisi akhir cabang, halaman atau layar, endpoint (metode dan path), modul backend, tabel basis data, dan bukti path:baris. Tabel: Kode FR | Status | Halaman | Endpoint | Modul | Tabel | Bukti. Tambahkan daftar fitur yang ada di proyek tetapi tidak ada pada daftar 13 FR di atas.

---

## TUGAS G6: Bukti kebutuhan non-fungsional final

**Keluaran:** `06_bukti_nfr_final.md`. Pakai sembilan karakteristik ISO/IEC 25010:2023: *functional suitability*, *performance efficiency*, *compatibility*, *interaction capability*, *reliability*, *security*, *maintainability*, *flexibility*, *safety*.

Untuk tiap karakteristik tulis bukti yang benar-benar ada di kode atau hasil pengukuran, dan yang TIDAK ada. Pastikan mencakup: waktu respons (data dari `thesis_assets/F6_hasil_pengukuran_latensi.json`, dengan kondisi pengukuran: mode `memory`, proses yang sama, tanpa jaringan dan basis data), HTTPS atau TLS (di mana dikonfigurasi), RBAC (FastAPI dan web), audit log, kontainerisasi (Dockerfile, bila ada), versi minimum Android dan iOS, peramban yang didukung dasbor, jumlah dan jenis tes, ketergantungan pada Supabase (apakah backend dapat dipindahkan ke penyedia lain tanpa mengubah kode), dan fakta bahwa sistem hanya memberi peringatan dan tidak melakukan transaksi atas nama pengguna.

---

## TUGAS G7: Verifikasi model dan data final

**Keluaran:** `07_verifikasi_model_final.md`. Buktikan dengan kutipan baris kode setiap butir berikut, dan tulis "TIDAK ADA" bila tidak terbukti:
1. Penanganan ketidakseimbangan kelas: apakah `class_weight="balanced"` dipakai pada Logistic Regression dan pada Random Forest, apakah ada SMOTE atau SMOTE-ENN di mana pun dalam kode pelatihan.
2. Pembagian data: logika pembagian temporal (bulan 1 sampai 3 latih, bulan 4 uji), apakah per pengguna atau seluruh pengguna, dan apakah ada *K-Fold* atau validasi silang di mana pun.
3. Praproses: apakah `StandardScaler` (atau padanannya) hanya dipasang pada data latih; apakah ada normalisasi per pengguna pada pelatihan dan pada inferensi; apakah ada langkah yang memakai data uji sebelum pembagian.
4. Fitur: tujuh fitur dan padanannya di pelatihan dan inferensi (nama persis).
5. Model dan baseline: kelas model yang dipakai, hiperparameter utama, `random_state`, dan cara baseline aturan menghitung skor (apakah ambang tunggal atau penjumlahan bobot).
6. Registri: bagaimana metrik masuk ke registri (dari skrip pelatihan, bukan ditulis tangan), dan di mana registri dibaca saat inferensi.
7. Data sintetis: ringkasan statistik (30 pengguna, jumlah transaksi, distribusi kelas) dan cara label `is_risky` dibangkitkan, serta kebocoran atau sirkularitas yang diketahui. Salin angka dari `thesis_assets/F7_keluaran_pelatihan.txt` dan nyatakan apakah angka itu cocok dengan keluaran terbaru bila pelatihan dijalankan ulang (jalankan ulang bila dependensi tersedia; simpan keluaran konsol di folder paket sebagai `07b_keluaran_pelatihan_ulang.txt`).
8. Metrik yang dihitung oleh skrip: daftar metrik (precision, recall, F1, ROC-AUC, PR-AUC, *balanced accuracy*, tingkat *false-alert*, Brier) dan definisi masing-masing seperti di kode.

---

## TUGAS G8: Seluruh sumber diagram final

**Keluaran:** 14 berkas diagram di folder paket (nama persis di bawah). Semuanya dibuat dari kondisi akhir kode dan migrasi SQL, bukan dari laporan sebelumnya. Tandai bagian yang tidak ada di proyek dengan catatan, bukan dengan simpul rekaan.

| Berkas | Isi | Sumber kebenaran |
|:---|:---|:---|
| `D01_erd_ringkas.mmd` | ERD ringkas: hanya PK, FK, dan 3 sampai 5 kolom penting per tabel | Migrasi SQL `000_*` sampai `003_*` |
| `D02_erd_lengkap.mmd` | ERD lengkap semua tabel yang ada | Migrasi SQL dan skema Prisma |
| `D03_use_case.puml` | Use case dua aktor (User dan Admin) untuk 13 FR pada G5 | Hasil G5 |
| `D04_use_case_alt.mmd` | Padanan use case dalam flowchart Mermaid | Hasil G5 |
| `D05_arsitektur.mmd` | Klien Flutter, klien Next.js, backend FastAPI, Supabase (Auth, PostgreSQL), layanan Gemini, serta aliran data nyata (termasuk akses langsung Prisma dari Next.js bila ada) | Kode dan hasil G1 |
| `D06_deployment.mmd` | Penempatan komponen sesuai berkas konfigurasi penerapan yang ada | Dockerfile, konfigurasi hosting |
| `D07_modul_struktur.mmd` | Struktur lapisan backend yang sebenarnya (`api`, `services`, `schemas`, `models`, `utils`) beserta arah pemanggilan | Direktori dan impor nyata |
| `D08_sequence_pra_pembelian.mmd` | Urutan interaksi Pengguna, Flutter, FastAPI (router, layanan statistik, mesin inferensi), dan penyimpanan untuk satu siklus check, decide, feedback | Kode |
| `D09_alur_pra_pembelian.mmd` | Flowchart alur dengan percabangan Lanjut, Sesuaikan, Tunda dan pemicu konfirmasi 24 sampai 72 jam | Kode |
| `D10_status_transaksi.mmd` | Diagram status siklus pemeriksaan (diperiksa, diputuskan, dikonfirmasi, kedaluwarsa tanpa label) | Kode |
| `D11_crispdm_increment3.mmd` | Enam fase CRISP-DM dengan artefak nyata tiap fase | Hasil G7 |
| `D12_split_data.mmd` | Pembagian data temporal, pembobotan kelas, dan praproses seperti yang benar-benar ada di kode | Hasil G7 |
| `D13_field_pilot.mmd` | Alur *field pilot* dengan tahap yang didukung sistem (persetujuan, orientasi, log, ekspor) dan yang di luar sistem (rekrutmen, wawancara, SUS) | Kode dan hasil G4 |
| `D14_riwayat_git.mmd` | Mermaid gantt dari riwayat commit dikelompokkan per area fitur dengan rentang tanggal | `git log`, tanpa mengubah repositori |

Untuk setiap diagram yang memuat penamaan tabel atau modul, tambahkan komentar Mermaid di baris pertama: `%% sumber: <path file>`. Di akhir tugas, buat `08_catatan_diagram.md` yang memuat satu baris per diagram: nama berkas, jumlah simpul, apakah sintaks tervalidasi, dan bagian yang sengaja dikecualikan karena tidak ada di proyek.

---

## TUGAS G9: Panduan pengambilan tangkapan layar

**Keluaran:** `09_panduan_tangkapan_layar.md`. Jangan mengambil tangkapan layar; pengguna yang akan mengambilnya. Untuk setiap halaman, tulis: nama berkas gambar yang disarankan, nama halaman di proyek, rute atau path berkas, data demonstrasi yang harus disiapkan (akun dummy, anggaran, riwayat transaksi minimal agar bukan mode cold start), dan langkah menuju halaman itu.

Halaman wajib (aplikasi mobile): `gambar_3_10_beranda.png` (Beranda), `gambar_3_11_input_pemeriksaan.png` (Input Pemeriksaan Pra-Pembelian), `gambar_3_12_hasil_peringatan.png` (Hasil Peringatan), `gambar_3_13_konfirmasi_pasca_keputusan.png` (Konfirmasi Pasca-Keputusan), `gambar_3_14_laporan_pengeluaran.png` (Laporan Pengeluaran). Tambahan: layar persetujuan pada *onboarding*, banner pengingat konfirmasi di Beranda, pemindaian struk, dan indikator kesehatan finansial. Halaman admin (web, 1440x900): ringkasan, evaluasi dan versi model, serta log audit. Sertakan cara menjalankan tiap komponen secara lokal. Tandai halaman yang sebaiknya TIDAK difoto (misalnya rute dasbor web pengguna yang di luar penelitian, bila ada pada hasil G1).

---

## TUGAS G10: Indeks paket, ringkasan, dan arsip

**Keluaran:** `00_INDEKS.md` dan, bila alatnya tersedia, `paket_penulis.zip`.

1. `00_INDEKS.md` berisi: (a) tabel semua berkas di folder paket dengan kolom Nama berkas | Dari tugas | Isi singkat | Status (LENGKAP, SEBAGIAN, ATAU TIDAK DAPAT DIKERJAKAN); (b) keluaran `git log --oneline` cabang kerja dan `git diff --stat` terhadap cabang asal; (c) versi lingkungan dari G1; (d) lima temuan terpenting yang masih terbuka; (e) daftar hal yang MASIH harus dilakukan pengguna secara manual (rujuk `04_kesiapan_pilot.md`).
2. Periksa seluruh berkas di folder paket: tidak ada rahasia, `salt`, token, alamat surel nyata, atau data pribadi. Laporkan hasil pemeriksaan di `00_INDEKS.md`.
3. Buat arsip ZIP folder paket hanya bila alatnya tersedia tanpa instalasi global. Jika tidak, tulis cara membuat arsip secara manual.
4. Tulis di chat daftar akhir berkas yang siap dikirim kepada penulis naskah.

---

# 8. DAFTAR BERKAS YANG HARUS ADA DI `thesis_assets/paket_penulis/`

```
00_INDEKS.md
PROGRESS_PAKET.md
01_verifikasi_lanjutan.md
02_koreksi_kecil.md
03_koreksi_F6.md
04_kesiapan_pilot.md
05_status_fr_final.md
06_bukti_nfr_final.md
07_verifikasi_model_final.md
07b_keluaran_pelatihan_ulang.txt   (jika pelatihan dijalankan ulang)
08_catatan_diagram.md
09_panduan_tangkapan_layar.md
D01_erd_ringkas.mmd
D02_erd_lengkap.mmd
D03_use_case.puml
D04_use_case_alt.mmd
D05_arsitektur.mmd
D06_deployment.mmd
D07_modul_struktur.mmd
D08_sequence_pra_pembelian.mmd
D09_alur_pra_pembelian.mmd
D10_status_transaksi.mmd
D11_crispdm_increment3.mmd
D12_split_data.mmd
D13_field_pilot.mmd
D14_riwayat_git.mmd
paket_penulis.zip                  (opsional)
```
