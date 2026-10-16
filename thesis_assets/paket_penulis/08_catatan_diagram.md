# Catatan dan Verifikasi 14 Sumber Diagram Final (Tugas G8)

Dokumen ini mencatat inventaris, validasi sintaks, serta justifikasi pengecualian komponen untuk ke-14 berkas diagram resmi yang dihasilkan pada folder paket penulis (`thesis_assets/paket_penulis/`). Seluruh diagram dibangun murni berdasarkan kondisi akhir kode sumber dan migrasi SQL aktif di cabang `thesis/perbaikan-pilot`.

---

## 1. Tabel Inventaris dan Validasi 14 Diagram

| Nama Berkas | Tipe Diagram | Jumlah Simpul / Elemen | Status Sintaks | Bagian yang Sengaja Dikecualikan & Alasannya |
|:---|:---|:---:|:---:|:---|
| `D01_erd_ringkas.mmd` | Mermaid ERD | 11 Entitas | **Tervalidasi** | Mengecualikan tabel rekaan draf lama (`budgets`, `financial_goals`, `transaction_categories`, `pre_purchase_decisions`, `post_purchase_evaluations`) karena tidak ada dalam migrasi SQL Supabase. Menggunakan relasi nyata ke `auth.users`, `planning`, `pre_purchase_checks`, dan `risk_predictions`. |
| `D02_erd_lengkap.mmd` | Mermaid ERD | 13 Entitas | **Tervalidasi** | Mencakup seluruh tabel riil dari migrasi SQL `000_*` s.d. `003_*` (termasuk `warnings`, `debt_records`, dan 6 kolom Model 3 `onboarding_data`). Tidak memuat tabel fiktif di luar skema basis data PostgreSQL aktif. |
| `D03_use_case.puml` | PlantUML Use Case | 15 Elemen (2 Aktor, 13 Kasus) | **Tervalidasi** | Mengecualikan use case percakapan chatbot bebas (telah dihapus pada F8) dan transfer rekening perbankan otomatis (tidak didukung arsitektur zero custody). |
| `D04_use_case_alt.mmd` | Mermaid Flowchart | 15 Simpul | **Tervalidasi** | Padanan visual D03 dalam sintaks Mermaid flowchart; mengecualikan fitur chatbot percakapan bebas dan fungsi gateway perbankan. |
| `D05_arsitektur.mmd` | Mermaid Flowchart | 6 Blok Komponen | **Tervalidasi** | Mengecualikan backend NestJS (dihapus total pada commit F8 `b8e014b`) dan server push FCM eksternal. Menampilkan aliran data nyata REST API Dio mobile, Prisma server-side demo, dan integrasi Google Gemini zero-egress. |
| `D06_deployment.mmd` | Mermaid Flowchart | 6 Node Topologi | **Tervalidasi** | Menggambarkan topologi kontainer Docker Linux (`python:3.11-slim`), hosting Vercel/Node.js Next.js 14, Supabase PaaS (AWS ap-northeast-1), dan Google AI Cloud endpoint. Mengecualikan server terpisah untuk microservice AI lama. |
| `D07_modul_struktur.mmd` | Mermaid Flowchart | 17 Modul / Lapisan | **Tervalidasi** | Memetakan struktur modul backend FastAPI sebenarnya (`api`, `schemas`, `services`, `utils`, `models`) beserta arah impor dependensi nyata. Mengecualikan modul chatbot lama. |
| `D08_sequence_pra_pembelian.mmd` | Mermaid Sequence | 7 Partisipan | **Tervalidasi** | Menggambarkan urutan 3 fase (Check, Decide, Feedback) antara Pengguna, Flutter, FastAPI, dan PostgreSQL Supabase. Mengecualikan transmisi push notification server eksternal. |
| `D09_alur_pra_pembelian.mmd` | Mermaid Flowchart | 28 Simpul Alur | **Tervalidasi** | Menggambarkan percabangan logika tindakan Lanjut, Sesuaikan, Tunda, perhitungan jeda waktu refleksi, serta jendela pengingat in-app 24-72 jam. Mengecualikan pemblokiran transaksi perbankan sepihak. |
| `D10_status_transaksi.mmd` | Mermaid State | 8 Status Siklus | **Tervalidasi** | Memetakan transisi status dari DRAFT_RENCANA, DIPERIKSA, PENDING_KEPUTUSAN, DIPUTUSKAN, MENUNGGU_REFLEKSI, SIAP_DIKONFIRMASI, hingga DIKONFIRMASI atau KEDALUWARSA (> 72 jam). Mengecualikan status pembayaran bank. |
| `D11_crispdm_increment3.mmd` | Mermaid Flowchart | 12 Simpul Fase | **Tervalidasi** | Memetakan 6 fase CRISP-DM Inkrement 3 dengan artefak nyata repositori. Mengecualikan klaim data nasabah riil bank (fase 2 dan 3 secara jujur mencatat penggunaan data sintetis). |
| `D12_split_data.mmd` | Mermaid Flowchart | 11 Simpul Pipeline | **Tervalidasi** | Menggambarkan pembagian temporal tanpa pengacakan (Bulan 1-3 Latih vs Bulan 4 Uji), `StandardScaler` hanya pada train set, dan `class_weight='balanced'`. Mengecualikan teknik SMOTE/SMOTE-ENN dan K-Fold CV karena tidak ada di kode. |
| `D13_field_pilot.mmd` | Mermaid Flowchart | 19 Simpul Tahapan | **Tervalidasi** | Memisahkan dengan tegas tahapan di luar sistem (rekrutmen, komite etik, wawancara, SUS) dan tahapan di dalam sistem (informed consent, intervensi pra-pembelian, pengingat 24-72 jam, ekspor pseudonim ber-salt). |
| `D14_riwayat_git.mmd` | Mermaid Gantt | 19 Entri Riwayat | **Tervalidasi** | Menggambarkan rentang waktu riwayat commit nyata dari 21 September s.d. 16 Oktober 2026 yang terbagi dalam 4 seksi milestone (CEAMIS 1.0, F0-F4, F3-F12, G0-G8). |

---

## 2. Prinsip Integritas dan Sumber Kebenaran

Seluruh diagram di atas memenuhi pedoman mutu arsitektur tesis:
1. **Pemberian Header Sumber Komentar:** Setiap diagram mencantumkan baris komentar `%% sumber: <path berkas>` pada baris pertama untuk menjamin ketertelusuran ke kode sumber riil.
2. **Ketiadaan Simpul Rekaan:** Tidak ada entitas atau modul fiktif yang digambar. Hal-hal yang berada di luar sistem (seperti protokol komite etik atau instrumen SUS) secara eksplisit dikelompokkan dalam subgraf terpisah berlabel *"Di Luar Sistem"*.
3. **Kepatuhan terhadap Hasil Audit G1–G7:** Diagram selaras dengan temuan audit terkoreksi, seperti penyatuan backend ke FastAPI monolit, eliminasi total NestJS, dan pembuktian ketiadaan teknik oversampling SMOTE.
