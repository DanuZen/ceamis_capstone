# PAKET PROMPT DAN KEBUTUHAN BAB III

Dokumen ini berisi daftar bahan yang perlu dikumpulkan dari proyek sebelum BAB III dilanjutkan, beserta prompt siap tempel untuk Antigravity. Setiap prompt sudah memuat HEADER aturan, jadi cukup disalin utuh.

## 1. Cara pakai

1. Buka proyek di Antigravity, lalu jalankan satu prompt per sesi sesuai urutan di bagian 2. Prompt yang hanya membaca kode (P2 sampai P6) dikerjakan lebih dulu, prompt yang perlu menjalankan aplikasi (P1 dan P7) belakangan.
2. Jika Flutter, Next.js, dan FastAPI ada di repositori terpisah, jalankan prompt yang sama di masing-masing repositori. P2 sampai P6 paling banyak bergantung pada repositori backend.
3. Setujui hanya perintah yang berada di dalam folder proyek. Jangan menyetujui instalasi paket global tanpa tahu keperluannya.
4. Seluruh hasil berada di folder `thesis_assets/`. Periksa semua tangkapan layar sebelum dibagikan: tidak boleh ada data pribadi, alamat surel nyata, atau token.
5. Setelah semua selesai, kirim isi `thesis_assets/` (file `.md`, `.mmd`, `.puml`, dan PNG) untuk dipakai melanjutkan BAB III.

## 2. Daftar kebutuhan dan urutan pengerjaan

Centang kolom Status setelah hasilnya didapat.

| Urutan | Prompt | Isi | Hasil utama | Status |
|:---|:---|:---|:---|:---|
| 1 | P2 | ERD dan kamus data | `11_erd_dan_kamus_data.md`, `erd_ringkas.mmd`, `erd_lengkap.mmd` | [ ] |
| 2 | P3 | Use case dan peta kebutuhan fungsional | `12_use_case_dan_peta_fr.md`, `use_case.puml` | [ ] |
| 3 | P4 | Arsitektur, modul, dan bukti non-fungsional | `13_arsitektur_dan_nfr.md`, `arsitektur.mmd`, `modul_dependency.mmd`, `deployment.mmd` | [ ] |
| 4 | P5 | Alur pemeriksaan pra-pembelian | `14_alur_pra_pembelian.md`, `sequence_pra_pembelian.mmd`, `alur_pra_pembelian.mmd`, `status_transaksi.mmd` | [ ] |
| 5 | P6 | Model prediksi, fitur, dan data | `15_model_dan_data.md`, `crispdm_increment3.mmd`, `split_data.mmd` | [ ] |
| 6 | P1 | Halaman penting, tangkapan layar, kesesuaian naskah | `00_peta_proyek.md`, `01_laporan_halaman.md`, `02_kesesuaian_naskah.md`, `screenshots/*.png` | [ ] |
| 7 | P7 | Pengujian, field pilot, privasi, riwayat git | `16_pengujian_dan_field_pilot.md`, `field_pilot.mmd`, `riwayat_git.mmd` | [ ] |

## 3. Pemetaan gambar dan tabel BAB III ke sumber bahannya

| Slot di BAB III | Judul | Bahan berasal dari |
|:---|:---|:---|
| Gambar 3.1, 3.2 | Kerangka bertingkat; alur SDLC (sudah ada) | SVG Abang yang sudah dibuat |
| Gambar 3.3 | Jadwal pengembangan dan field pilot | P7 (riwayat git) dan konfirmasi jadwal |
| Gambar 3.4 | Use case diagram | P3 |
| Gambar 3.5 | Arsitektur sistem (sudah ada) | SVG Abang, diperiksa terhadap P4 |
| Gambar 3.6 | Struktur modul backend | P4 |
| Gambar 3.7 | ERD sistem (sudah ada) | SVG Abang, diperiksa terhadap P2 |
| Gambar 3.8 | Alur proses bisnis (sudah ada) | SVG Abang, diperiksa terhadap P5 |
| Gambar 3.9 | Sequence diagram pra-pembelian | P5 |
| Gambar 3.10 sampai 3.14 | Wireframe lima halaman | P1 (tangkapan layar) atau wireframe buatan Abang |
| Gambar 3.15 | Alur CRISP-DM pada Increment 3 | P6 |
| Gambar 3.16 | Skema pembagian data | P6 |
| Gambar 3.17 | Alur pelaksanaan field pilot | P7 |
| Tabel 3.5 dan 3.6 | Kebutuhan fungsional User dan Admin | P3 (status implementasi tiap FR) |
| Tabel 3.7 | Kebutuhan non-fungsional | P4 (bukti HTTPS, RBAC, audit log, kontainer) |
| Tabel 3.8 dan 3.9 | Fitur model; perbandingan pendekatan | P6 |
| Tabel 3.11 dan 3.12 | Tingkat pengujian; tahapan field pilot | P7 |

## 4. Kebutuhan di luar proyek (dikerjakan Abang sendiri)

| No | Kebutuhan | Dipakai untuk | Status |
|:---|:---|:---|:---|
| 1 | Kirim 10 file SVG yang sudah ada: 2.1, 2.2, 2.3, 2.4, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5 (nama berkas lama) | Memeriksa isi tulisan di dalam gambar terhadap bab terbaru | [ ] |
| 2 | Putuskan jumlah wireframe: lima halaman, tiga halaman inti, atau tanpa gambar | Menyesuaikan subbab 3.7.4 dan nomor Gambar 3.10 sampai 3.14 | [ ] |
| 3 | Putuskan sumber untuk instrumen SUS: beri pengecualian sumber lama (Brooke 1996) atau minta saya mencari sumber 2020 ke atas | Subbab 3.9.4 yang masih tanpa sitasi | [ ] |
| 4 | Konfirmasi fitur pendukung final (kesehatan finansial, streak dan lencana, OCR, edukasi adaptif) terhadap proyek dan dosen | Batasan Masalah BAB I dan subbab 3.6 | [ ] |
| 5 | Konfirmasi jadwal dan durasi field pilot ke dosen | Tabel 3.3 dan Gambar 3.3 | [ ] |
| 6 | Tulis risiko penelitian menurut Abang (data sedikit, dropout, kelas tidak seimbang, dan lainnya), jika ingin tabel risiko | Tabel risiko dan mitigasi (opsional) | [ ] |
| 7 | Kirim skema basis data jika sudah ada di luar kode (dokumen atau diagram lama) | Pembanding P2 | [ ] |

## 5. Yang perlu diperhatikan saat membaca hasil

- **P6 paling berisiko menemukan masalah**: kebocoran data, fitur yang berbeda dari naskah, atau kode model yang tidak ada di repositori. Hasilnya bisa mengubah klaim di subbab 3.8.
- **P7 butir 2** mengukur waktu respons di perangkat lokal. Hasilnya cukup sebagai observasi awal sesuai desain pengujian di naskah, bukan klaim performa umum.
- **Semua prompt hanya melaporkan perbedaan** antara proyek dan naskah, tidak memperbaikinya. Jika ada fitur di naskah yang belum ada di proyek, keputusannya ada di Abang: dibangun dulu atau naskah disesuaikan.
- Diagram hasil render Mermaid atau PlantUML umumnya tampil seadanya. Kirim sumbernya, dan gaya visualnya akan disamakan dengan gambar Abang yang sudah ada.

## 6. Daftar yang dikirim kembali

- [ ] `thesis_assets/` lengkap (file `.md`, `.mmd`, `.puml`, PNG)
- [ ] 10 file SVG lama (bagian 4 nomor 1)
- [ ] Keputusan bagian 4 nomor 2, 3, 4, dan 5


---

# 7. PROMPT SIAP TEMPEL

Setiap blok di bawah sudah memuat HEADER aturan. Salin dari baris pertama sampai baris terakhir blok.


---

## P2: ERD dan kamus data

**Menghasilkan bahan untuk:** Gambar 3.7 (ERD)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: ERD DAN KAMUS DATA
Naskah merancang 13 entitas: users, profiles, budgets, financial_goals, transaction_categories, transactions, pre_purchase_checks, risk_predictions, user_feedback, notification_preferences, consent_records, model_versions, audit_logs.
Relasi kunci menurut naskah:
- Setiap pre_purchase_check terhubung ke satu risk_prediction (skor dan penjelasan) dan, bila pengguna melanjutkan, ke transaction terkait; label konfirmasi pasca-keputusan disimpan lewat user_feedback.
- model_versions menyimpan versi model (baseline ambang statis, Logistic Regression, Random Forest atau GBM) beserta metrik.
- audit_logs memuat admin_id, accessed_resource, reason (wajib diisi), timestamp.
- consent_records menyimpan riwayat persetujuan partisipan.

KERJAKAN
1. Baca migrasi (Alembic atau lainnya) dan model ORM yang benar-benar ada. Tentukan sumber kebenaran skema (migrasi atau model) dan sebutkan.
2. Buat `thesis_assets/diagrams/erd_lengkap.mmd` (Mermaid erDiagram) berisi semua tabel yang ada, kolom, PK, FK, dan kardinalitas.
3. Buat `thesis_assets/diagrams/erd_ringkas.mmd`, versi untuk naskah: 13 entitas di atas (atau padanannya) dengan hanya PK, FK, dan 3 sampai 5 kolom penting per tabel.
4. Buat `thesis_assets/11_erd_dan_kamus_data.md` berisi: (a) tabel kesesuaian 13 entitas (ada atau tidak, nama tabel sebenarnya); (b) tabel tambahan di luar 13 entitas; (c) kamus data per tabel dengan kolom Nama kolom | Tipe | Null | Kunci | Keterangan; (d) verifikasi relasi kunci di atas dengan bukti path:baris; (e) daftar enum atau nilai tetap penting (misalnya nilai label terencana atau tidak terencana, jenis respons Lanjut, Sesuaikan, Tunda, peran User dan Admin).
````


---

## P3: Use case dan peta kebutuhan fungsional

**Menghasilkan bahan untuk:** Gambar 3.4 (use case), Tabel 3.5 dan 3.6 (status FR)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: USE CASE DAN PETA KEBUTUHAN FUNGSIONAL
Kebutuhan fungsional menurut naskah:
User: FR-U01 akun dan preferensi privasi; FR-U02 anggaran dan tujuan tabungan; FR-U03 catat dan kelola transaksi (manual atau OCR struk); FR-U04 pemeriksaan pra-pembelian (input rencana, skor risiko beserta alasan, dampak anggaran dan tabungan); FR-U05 respons Lanjut, Sesuaikan, Tunda beserta label konfirmasi pasca-keputusan; FR-U06 koreksi prediksi model; FR-U07 laporan pengeluaran; FR-U08 fitur Engagement dan Pendukung (ringkasan mingguan, reminder adaptif, quiet hours, snooze, indikator kesehatan finansial, streak dan lencana, edukasi finansial adaptif).
Admin: FR-A01 kelola akun pengguna; FR-A02 konfigurasi sistem (kategori transaksi, aturan cold start, ambang baseline); FR-A03 versi model dan rollback; FR-A04 monitoring layanan; FR-A05 panel evaluasi model; FR-A06 akses data transaksi individual dengan alasan tercatat dan audit log.

KERJAKAN
1. Untuk setiap FR, cari implementasinya: halaman atau layar (Flutter atau Next.js), endpoint API, modul backend, tabel yang dipakai. Status: SELESAI, SEBAGIAN, BELUM, atau TIDAK DITEMUKAN, dengan bukti path:baris.
2. Buat `thesis_assets/12_use_case_dan_peta_fr.md` berisi tabel: Kode FR | Status | Halaman | Endpoint (metode dan path) | Modul backend | Tabel basis data | Bukti.
3. Buat use case diagram dalam PlantUML (`thesis_assets/diagrams/use_case.puml`) dengan dua aktor (User dan Admin), boundary "Sistem Peringatan Dini", dan use case sesuai FR yang statusnya SELESAI atau SEBAGIAN. Gunakan hubungan include atau extend hanya jika benar-benar ada di kode. Buat juga padanannya dalam Mermaid flowchart (`use_case_alt.mmd`) sebagai cadangan.
4. Daftar fitur yang ada di proyek tetapi TIDAK ada di daftar FR di atas, dan sebaliknya.
````


---

## P4: Arsitektur, struktur modul, dan bukti kebutuhan non-fungsional

**Menghasilkan bahan untuk:** Gambar 3.5 (arsitektur), Gambar 3.6 (modul), Tabel 3.7 (non-fungsional)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: ARSITEKTUR, STRUKTUR MODUL, DAN BUKTI KEBUTUHAN NON-FUNGSIONAL
Naskah merancang: dua klien (Flutter untuk User, Next.js untuk Admin) mengakses satu backend FastAPI monolit modular lewat HTTPS atau REST, dengan basis data PostgreSQL. Modul backend: auth/, transactions/, budgets/, admin/ (fungsi dasar) serta pre_purchase/, risk_model/ (fitur inti).

KERJAKAN
1. Struktur backend: tampilkan pohon direktori sebenarnya (kedalaman 3) dan bandingkan dengan enam modul di atas.
2. Ketergantungan antarmodul: analisis impor antarmodul backend dan buat `thesis_assets/diagrams/modul_dependency.mmd` (siapa memanggil siapa). Tandai pelanggaran batas modul (misalnya modul yang membaca tabel milik modul lain secara langsung) sebagai catatan, tanpa memperbaiki.
3. Diagram arsitektur: `thesis_assets/diagrams/arsitektur.mmd` yang memuat klien Flutter, klien Next.js, backend FastAPI (beserta modulnya), PostgreSQL, penyimpanan foto struk (jika ada), komponen model, dan layanan eksternal apa pun (OCR, notifikasi, autentikasi). Hanya komponen yang benar-benar ada di kode.
4. Diagram penerapan (deployment): `thesis_assets/diagrams/deployment.mmd` berdasarkan Dockerfile, docker-compose, dan file konfigurasi penerapan yang ada.
5. Bukti non-fungsional di `thesis_assets/13_arsitektur_dan_nfr.md`: (a) HTTPS atau TLS (di mana dikonfigurasi); (b) RBAC (peran, di mana ditegakkan); (c) audit log (kapan ditulis); (d) pembatasan retensi data sensitif atau foto struk; (e) kontainerisasi (Dockerfile) sebagai bukti portabilitas; (f) versi minimum Android dan iOS pada konfigurasi Flutter; (g) peramban yang didukung pada dasbor Next.js jika dinyatakan; (h) versi pustaka utama (Flutter, Dart, Next.js, FastAPI, Python, PostgreSQL).
````


---

## P5: Alur pemeriksaan pra-pembelian

**Menghasilkan bahan untuk:** Gambar 3.8 (alur bisnis), Gambar 3.9 (sequence diagram)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: ALUR PEMERIKSAAN PRA-PEMBELIAN
Naskah merancang enam langkah: (1) pengguna menginput rencana pembelian (nominal dan kategori); (2) sistem menghitung skor risiko dengan model prediksi; (3) sistem menampilkan peringatan beserta alasan atau faktor pemicu; (4) sistem menampilkan dampak terhadap sisa anggaran dan tujuan tabungan; (5) pengguna memilih Lanjut, Sesuaikan, atau Tunda; (6) setelah keputusan, sistem meminta konfirmasi pasca-keputusan (terencana atau tidak terencana) yang disimpan sebagai label. Sistem hanya memberi peringatan dan tidak memblokir transaksi.

KERJAKAN
1. Telusuri alur sebenarnya dari layar Flutter sampai basis data: fungsi atau widget yang dipanggil, endpoint, router, service, pemanggilan model di risk_model, penulisan ke pre_purchase_checks, risk_predictions, transactions, dan user_feedback. Sertakan path:baris tiap langkah.
2. Buat `thesis_assets/diagrams/sequence_pra_pembelian.mmd` (Mermaid sequenceDiagram) dengan partisipan Pengguna, Aplikasi Flutter, Backend FastAPI (modul pre_purchase dan risk_model), dan PostgreSQL, mengikuti urutan nyata di kode.
3. Buat `thesis_assets/diagrams/alur_pra_pembelian.mmd` (flowchart) yang memuat percabangan keputusan Lanjut, Sesuaikan, dan Tunda serta titik konfirmasi pasca-keputusan.
4. Buat `thesis_assets/diagrams/status_transaksi.mmd` (stateDiagram) berisi status siklus pemeriksaan atau transaksi sesuai kode (misalnya diperiksa, dilanjutkan, disesuaikan, ditunda, berlabel).
5. Laporan `thesis_assets/14_alur_pra_pembelian.md` berisi: tabel langkah nyata (nomor, aktor, komponen, fungsi, bukti); perbandingan dengan enam langkah naskah; penjelasan bagaimana alasan atau faktor pemicu dihasilkan (sumber penjelasan); perilaku saat pengguna tidak mengisi konfirmasi pasca-keputusan; dan perilaku saat data pengguna masih sedikit (aturan cold start).
````


---

## P6: Model prediksi, fitur, dan data

**Menghasilkan bahan untuk:** Gambar 3.15 (CRISP-DM), Gambar 3.16 (pembagian data), Tabel 3.8 (fitur), Tabel 3.9 (perbandingan model)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: MODEL PREDIKSI, FITUR, DAN DATA
Naskah merancang: tiga pendekatan (baseline ambang statis, Logistic Regression, Random Forest atau Gradient Boosting); enam fitur: (1) nominal relatif terhadap median kategori yang sama milik pengguna sendiri, (2) rasio terhadap sisa anggaran, (3) frekuensi kategori, (4) waktu transaksi dan jarak ke tanggal reset anggaran, (5) dampak terhadap tabungan, (6) pola berulang dan deviasi dari kebiasaan; normalisasi per pengguna; data dibagi per pengguna dan waktu; SMOTE atau SMOTE-ENN hanya pada data latih; K-Fold Cross Validation hanya di dalam data latih; metrik: precision, recall (hit rate), F1-score, PR-AUC, balanced accuracy, tingkat false-alert, kalibrasi; siklus CRISP-DM enam fase di Increment 3.

KERJAKAN
1. Temukan semua kode dan notebook terkait model (pelatihan, fitur, evaluasi, inferensi). Jika tidak ada di repositori ini, tulis "TIDAK DITEMUKAN" dan berhenti di bagian itu.
2. Pemetaan CRISP-DM: untuk tiap fase (business understanding, data understanding, data preparation, modeling, evaluation, deployment) tulis artefak nyata (file, notebook, skrip, keluaran) dan bukti. Buat `thesis_assets/diagrams/crispdm_increment3.mmd` dari pemetaan itu.
3. Tabel fitur: kolom Fitur di naskah | Nama di kode | Cara hitung (ringkas) | Normalisasi per pengguna (ya atau tidak) | Bukti. Laporkan fitur yang ada di kode tetapi tidak di naskah, dan sebaliknya.
4. Skema pembagian data: jelaskan logika pembagian sebenarnya (per pengguna, per waktu, atau keduanya), urutan penerapan SMOTE atau SMOTE-ENN, dan letak K-Fold (hanya di dalam data latih atau tidak). Pastikan tidak ada kebocoran data (resampling, normalisasi, atau pemilihan fitur dilakukan sebelum pembagian). Buat `thesis_assets/diagrams/split_data.mmd`. Jika ada indikasi kebocoran, laporkan dengan bukti baris.
5. Profil data (tanpa data pribadi): sumber data (sintetis, simulasi, atau data pilot), jumlah baris, jumlah pengguna, nama kolom, distribusi kelas (terencana banding tidak terencana), periode waktu, dan cara label dibuat.
6. Hasil evaluasi yang sudah ada (jika ada) untuk baseline, Logistic Regression, dan Random Forest atau GBM: nilai tiap metrik beserta file sumbernya. Jangan menghitung ulang kecuali diminta.
7. Laporan `thesis_assets/15_model_dan_data.md` memuat semua poin di atas, ditambah versi model yang tercatat di model_versions dan cara rollback dilakukan.
````


---

## P1: Halaman penting, tangkapan layar, dan kesesuaian dengan naskah

**Menghasilkan bahan untuk:** thesis_assets/00_peta_proyek.md, 01_laporan_halaman.md, 02_kesesuaian_naskah.md, screenshots/

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: HALAMAN PENTING, TANGKAPAN LAYAR, DAN KESESUAIAN DENGAN NASKAH

LANGKAH 0: PEMETAAN AWAL
Petakan struktur proyek (folder aplikasi Flutter, aplikasi Next.js, backend FastAPI, migrasi atau model basis data). Tulis ringkasannya di `thesis_assets/00_peta_proyek.md`, termasuk cara menjalankan tiap bagian (perintah, port, prasyarat) yang ditemukan di README atau file konfigurasi.

BAGIAN A: HALAMAN PENTING DAN TANGKAPAN LAYAR
A1. Halaman wajib aplikasi mobile (peran User). Cari padanannya di kode (nama file, kelas, route), jalankan, lalu ambil tangkapan layar dengan nama berkas persis seperti berikut:
- gambar_3_10_beranda.png: Halaman Beranda (Dashboard). Elemen yang diharapkan: ringkasan anggaran berjalan, indikator kesehatan finansial, akses cepat ke pemeriksaan pra-pembelian.
- gambar_3_11_input_pemeriksaan.png: Halaman Input Pemeriksaan Pra-Pembelian. Elemen: input nominal dan kategori rencana pembelian.
- gambar_3_12_hasil_peringatan.png: Halaman Hasil Peringatan. Elemen: skor risiko beserta alasan atau faktor pemicu, dampak terhadap anggaran dan tabungan, tiga pilihan respons (Lanjut, Sesuaikan, Tunda).
- gambar_3_13_konfirmasi_pasca_keputusan.png: Halaman Konfirmasi Pasca-Keputusan. Elemen: pertanyaan singkat apakah transaksi sesuai rencana anggaran (terencana atau tidak terencana).
- gambar_3_14_laporan_pengeluaran.png: Halaman Laporan Pengeluaran. Elemen: ringkasan dan riwayat transaksi per periode dan kategori.
Jika nama halaman di proyek berbeda, tetap pakai nama berkas di atas dan catat nama aslinya di laporan.

A2. Halaman pendukung peran User (tangkapan layar tambahan, nama berkas `user_<kode>_<nama>.png`): FR-U01 akun dan preferensi privasi atau persetujuan (consent); FR-U02 anggaran dan tujuan tabungan; FR-U03 input transaksi manual dan pemindaian struk (OCR); FR-U06 koreksi prediksi model; FR-U08 fitur Engagement dan Pendukung (indikator kesehatan finansial, streak, lencana, edukasi finansial adaptif, pengaturan reminder, quiet hours, snooze).

A3. Halaman peran Admin (dasbor Next.js, nama berkas `admin_<kode>_<nama>.png`, ukuran 1440x900): FR-A01 manajemen akun pengguna; FR-A02 konfigurasi sistem (kategori transaksi, aturan cold start, ambang baseline); FR-A03 manajemen versi model beserta rollback; FR-A04 monitoring status layanan; FR-A05 panel evaluasi model; FR-A06 akses data transaksi individual dengan alasan wajib dan audit log.

Cara mengambil tangkapan layar:
- Mobile: jalankan di emulator atau perangkat, ukuran portrait (misalnya 1080x2400). Jika emulator tidak tersedia, gunakan `flutter run -d chrome` dengan jendela ukuran ponsel, atau integration_test atau golden test untuk menghasilkan gambar. Pilih cara paling aman dan jelaskan caranya.
- Web: jalankan dev server dan ambil tangkapan layar dengan browser terkontrol, ukuran 1440x900.
- Simpan semua gambar sebagai PNG di `thesis_assets/screenshots/`.
- Jika halaman butuh login, gunakan akun dummy dari seed script yang disimpan di `thesis_assets/`, bukan di dalam kode proyek.

Laporan Bagian A: `thesis_assets/01_laporan_halaman.md` berisi tabel dengan kolom: Nama berkas | Nama halaman di proyek | File atau route (path:baris) | Status (BERJALAN atau TIDAK DAPAT DIJALANKAN) | Elemen yang tampil | Elemen dari daftar di atas yang TIDAK ada | Elemen tambahan yang ada tetapi tidak disebut di daftar.

BAGIAN B: KESESUAIAN PROYEK DENGAN NASKAH (HANYA LAPORAN)
Buat `thesis_assets/02_kesesuaian_naskah.md` dengan tabel: Item | Rancangan di naskah | Kondisi di proyek (bukti path:baris) | Status (SESUAI, BERBEDA, atau TIDAK ADA) | Catatan. Periksa:
B1. Teknologi: Flutter (Dart) untuk User; Next.js hanya untuk Admin; backend FastAPI monolit modular dengan satu aplikasi; PostgreSQL; komunikasi HTTPS atau REST. Pastikan TIDAK ada NestJS dan TIDAK ada fitur chatbot. Laporkan jika ada.
B2. Modul backend: auth/, transactions/, budgets/, admin/, pre_purchase/, risk_model/. Tampilkan struktur direktori backend yang sebenarnya (kedalaman 3) dan bandingkan.
B3. Fitur pendukung: indikator kesehatan finansial berbasis formula rasio (kebutuhan, keinginan, dan tabungan terhadap pendapatan; kategori 80-100, 40-79, 0-39), streak dan lencana sederhana TANPA papan peringkat (leaderboard), OCR struk, modul edukasi finansial adaptif, retensi foto struk, RBAC, audit log, persetujuan (consent).
B4. Alur inti: tiga respons Lanjut, Sesuaikan, Tunda; konfirmasi pasca-keputusan dengan label terencana atau tidak terencana; peringatan disertai alasan atau faktor pemicu; sistem hanya memberi peringatan dan tidak memblokir transaksi.
````


---

## P7: Pengujian, field pilot, privasi, dan riwayat pengembangan

**Menghasilkan bahan untuk:** Tabel 3.11 (tingkat pengujian), Tabel 3.12 dan Gambar 3.17 (field pilot), Gambar 3.3 (jadwal)

````
KONTEKS
Proyek di folder ini adalah sistem "Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal": aplikasi mobile Flutter (peran User), dasbor web Next.js (khusus Admin), backend FastAPI monolit modular, basis data PostgreSQL. Hasil kerjamu dipakai penulis untuk menyusun BAB III Tugas Akhir.

ATURAN WAJIB
1. MODE BACA SAJA. Jangan mengubah, memformat, atau menghapus file kode yang sudah ada. Satu-satunya yang boleh dibuat adalah isi folder `thesis_assets/` di root proyek.
2. Jangan menampilkan rahasia (isi .env, API key, token, password, string koneksi). Sebut nama variabelnya saja.
3. Jangan mengarang. Setiap klaim harus disertai bukti path file dan nomor baris. Jika tidak ditemukan atau tidak bisa dijalankan, tulis "TIDAK DITEMUKAN" atau "TIDAK DAPAT DIJALANKAN" beserta alasannya.
4. Jika kondisi proyek berbeda dari rancangan di prompt, tandai dengan [BERBEDA DARI NASKAH] dan jelaskan perbedaannya. Jangan memperbaiki apa pun.
5. Format diagram: tulis sumbernya sebagai Mermaid (`.mmd`) atau PlantUML (`.puml`) di `thesis_assets/diagrams/`. Jika `mmdc` (mermaid-cli) atau PlantUML tersedia, render juga ke SVG dan PNG. Jika tidak tersedia, cukup sumber teks dan catat "tidak dirender". Minta izin sebelum menginstal paket global atau menjalankan perintah yang mengubah sistem di luar folder proyek.
6. Keterbacaan: satu diagram maksimal sekitar 12 simpul. Jika aslinya lebih besar, buat versi ringkas untuk naskah dan versi lengkap terpisah. Beri label berbahasa Indonesia, tetapi nama modul, tabel, dan kolom tetap persis seperti di kode.
7. Gunakan data dummy dan jangan memuat data pribadi nyata pada laporan maupun tangkapan layar.
8. Tulis laporan dalam bahasa Indonesia formal tanpa tanda pisah panjang.
9. Di akhir sesi, tulis ringkasan di chat: apa yang berhasil, apa yang gagal beserta alasannya, dan daftar file yang dibuat.

TUGAS: PENGUJIAN, FIELD PILOT, PRIVASI, DAN RIWAYAT PENGEMBANGAN
Naskah merancang: pengujian unit, integrasi, sistem (termasuk observasi waktu respons), UAT (termasuk kompatibilitas beberapa perangkat), akurasi model, usability (SUS), dan keamanan; field pilot 6 sampai 8 minggu dengan 30 sampai 50 mahasiswa, dengan tahapan rekrutmen, informasi dan persetujuan, penggunaan aktif, pengumpulan log otomatis, wawancara, dan kuesioner SUS; pengamanan: HTTPS, RBAC, audit log, persetujuan (consent), pseudonimisasi, pembatasan retensi foto struk. Empat increment: (1) fondasi: autentikasi, profil, anggaran, tabungan, transaksi; (2) baseline warning: peringatan ambang statis; (3) model personal: model prediksi risiko dan integrasi pra-pembelian; (4) admin dashboard.

KERJAKAN
1. Inventaris pengujian: temukan semua tes (backend, Flutter, Next.js), kerangka yang dipakai (misalnya pytest, flutter test, integration_test, jest), jumlah tes per tingkat (unit, integrasi, sistem atau e2e), dan cara menjalankannya. Jalankan tes yang aman dijalankan dan laporkan hasil lulus atau gagal beserta ringkasan cakupan jika tersedia. Jangan mengubah kode tes.
2. Pengukuran waktu respons: jika backend bisa dijalankan lokal, ukur waktu respons endpoint pemeriksaan pra-pembelian (minimal 30 kali pemanggilan dengan data dummy) dan laporkan rata-rata, median, dan persentil ke-95. Tulis jelas kondisi pengukuran (perangkat keras, data, jumlah pengguna).
3. Pencatatan log untuk analisis engagement: daftar semua peristiwa atau log yang dicatat sistem (nama peristiwa, kolom, tabel penyimpanan) yang relevan untuk analisis keterlibatan, dropout, dan interaksi dengan peringatan. Tandai data yang belum dicatat tetapi dibutuhkan untuk metrik: jumlah sesi, hari aktif, respons Lanjut, Sesuaikan, Tunda, dan label konfirmasi.
4. Alur persetujuan dan privasi: jelaskan alur consent di aplikasi (kapan muncul, apa yang disimpan di consent_records), pseudonimisasi (di mana dan bagaimana), kebijakan retensi foto struk (di mana ditegakkan, berapa lama), RBAC, dan audit log (apakah alasan akses wajib diisi dan divalidasi di backend). Sertakan bukti path:baris.
5. Buat `thesis_assets/diagrams/field_pilot.mmd` (flowchart) tahapan field pilot dengan titik yang benar-benar didukung sistem (consent, onboarding, pencatatan log, ekspor data), dan tandai tahap yang dilakukan di luar sistem (wawancara dan kuesioner SUS).
6. Riwayat pengembangan: dari git log (tanpa mengubah repositori), buat `thesis_assets/diagrams/riwayat_git.mmd` (Mermaid gantt) yang mengelompokkan commit menjadi tonggak per area fitur dengan rentang tanggalnya (autentikasi dan profil, anggaran dan tabungan, transaksi, baseline warning, model, admin, dan sebagainya). Pada laporan, usulkan pemetaan tonggak ke Increment 1 sampai 4 dan tandai bagian yang tidak jelas.
7. Laporan `thesis_assets/16_pengujian_dan_field_pilot.md` memuat semua hasil di atas.
````
