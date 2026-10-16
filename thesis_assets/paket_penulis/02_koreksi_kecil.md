# Laporan Koreksi Kecil Basis Kode (Tugas G3)

Dokumen ini mencatat seluruh perubahan kode dan konfigurasi yang dilakukan pada tugas G3 sesuai dengan instruksi `docs/AGENT_PAKET_PENULIS.md`. Tugas G3 merupakan satu-satunya tugas dalam paket penulis yang diizinkan untuk mengubah kode sumber.

---

## 1. Rangkuman Perubahan Kode

Terdapat tiga area perbaikan yang diimplementasikan:
1. **Pembaruan Teks Persetujuan (*Informed Consent*)**: Penghapusan data peneliti rekaan/karangan, penghapusan klaim enkripsi yang belum terbukti di kode, dan penyelarasan terminologi risiko pengeluaran.
2. **Isolasi Berkas Ekspor dan Pembersihan Skrip Ekspor**: Pelepasan berkas manifes ekspor dari pelacakan git, penambahan entri pengabaian (*ignore*), serta eliminasi penayangan fragmen kunci *salt* pada berkas manifes.
3. **Dokumentasi Sifat Data Sintetis**: Penambahan berkas penjelasan resmi mengenai asal-usul data pelatihan sintetis pada modul model risiko.

---

## 2. Rincian Perubahan per Berkas

### A. Teks Persetujuan Partisipan (`mobile/lib/core/constants/consent_text.dart`)

- **Tujuan Perbaikan:**
  1. Menghilangkan nama rekaan "Danu" dan surel "peneliti@ceamis.ac.id" yang sebelumnya dikarang, diganti dengan penanda resmi `[NAMA PENELITI]`, `[SURAT ELEKTRONIK PENELITI]`, dan `[NAMA DOSEN PEMBIMBING]`.
  2. Menghapus klaim "dienkripsi" pada data tersimpan yang tidak didukung bukti implementasi enkripsi kolom/berkas di kode lokal, digantikan dengan penanda `[ISI SESUAI LEMBAR INFORMASI PENELITIAN]`.
  3. Mengganti frasa "perilaku belanja impulsif" menjadi "pengeluaran tidak terencana" agar selaras dengan fokus penelitian dan rumusan tesis.
  4. Mempertahankan klausul `[PEMROSESAN PIHAK KETIGA]` terkait transparansi layanan Google Gemini API.

- **Baris Sebelum dan Sesudah:**
  - **Baris 14-15 (`researchPurpose`):**
    - *Sebelum:*
      ```dart
      static const String researchPurpose =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Penelitian ini bertujuan untuk menguji keefektifan sistem peringatan dini sebelum checkout dalam membantu pengguna mengendalikan perilaku belanja impulsif berdasarkan pola transaksi personal.';
      ```
    - *Sesudah:*
      ```dart
      static const String researchPurpose =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Penelitian ini bertujuan untuk menguji keefektifan sistem peringatan dini sebelum checkout dalam membantu pengguna mengendalikan pengeluaran tidak terencana berdasarkan pola transaksi personal.';
      ```
  - **Baris 17-18 (`dataCollected`):**
    - *Sebelum:*
      ```dart
      static const String dataCollected =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Data yang dikumpulkan meliputi nominal rencana belanja, kategori transaksi, status pagu anggaran, target tabungan, respons intervensi (lanjut/sesuaikan/tunda), dan evaluasi pasca-keputusan. Semua data dienkripsi dan diproses secara pseudonim.';
      ```
    - *Sesudah:*
      ```dart
      static const String dataCollected =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Data yang dikumpulkan meliputi nominal rencana belanja, kategori transaksi, status pagu anggaran, target tabungan, respons intervensi (lanjut/sesuaikan/tunda), dan evaluasi pasca-keputusan. Semua data [ISI SESUAI LEMBAR INFORMASI PENELITIAN] dan diproses secara pseudonim.';
      ```
  - **Baris 30-31 (`researcherContact`):**
    - *Sebelum:*
      ```dart
      static const String researcherContact =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Peneliti Utama: Danu (Kontak: peneliti@ceamis.ac.id / WhatsApp Lab Riset Komputasi).';
      ```
    - *Sesudah:*
      ```dart
      static const String researcherContact =
          '[ISI SESUAI LEMBAR INFORMASI PENELITIAN] Peneliti Utama: [NAMA PENELITI] (Surat Elektronik: [SURAT ELEKTRONIK PENELITI]), Dosen Pembimbing: [NAMA DOSEN PEMBIMBING].';
      ```

---

### B. Skrip Ekspor Data Pilot (`backend/scripts/export_pilot_data.py`)

- **Tujuan Perbaikan:**
  Mencegah kebocoran parsial kunci garam (*salt*) pseudonimisasi ke dalam berkas metadata manifes ekspor. Sebelumnya baris 222 menyisipkan potongan karakter salt (`salt_used_preview`), yang berisiko memperlemah keamanan pseudonim jika manifes dibagikan.

- **Baris Sebelum dan Sesudah:**
  - **Baris 219-225 (`summary` dictionary):**
    - *Sebelum:*
      ```python
      summary: Dict[str, Any] = {
          "total_active_consented_participants": len(consented_user_ids),
          "exported_tables": {},
          "salt_used_preview": f"{salt[:4]}***{salt[-4:]}" if len(salt) >= 8 else "***",
          "output_directory": str(output_dir),
          "exported_at": datetime.now(timezone.utc).isoformat(),
      }
      ```
    - *Sesudah:*
      ```python
      summary: Dict[str, Any] = {
          "total_active_consented_participants": len(consented_user_ids),
          "exported_tables": {},
          "output_directory": str(output_dir),
          "exported_at": datetime.now(timezone.utc).isoformat(),
      }
      ```

---

### C. Isolasi Berkas Ekspor dari Pelacakan Git

- **Tindakan Git:**
  Menghapus pelacakan berkas manifes lama dari index git tanpa menghapus berkas fisik di lingkungan kerja lokal:
  ```bash
  git rm --cached backend/exports/pilot_data/export_manifest.json
  ```
- **Pembaruan Berkas `.gitignore`:**
  - Berkas [root .gitignore](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/.gitignore): Ditambahkan aturan `backend/exports/` pada baris 80-81.
  - Berkas [backend/.gitignore](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/.gitignore): Ditambahkan aturan `exports/` pada baris 5.
- **Dampak:** Seluruh keluaran ekspor data masa depan tidak akan terunggah secara tidak sengaja ke repositori.

---

### D. Dokumentasi Data Sintetis (`backend/artifacts_risk/README_DATA_SINTETIS.md`)

- **Tujuan Penambahan:**
  Menjelaskan secara transparan dan definitif bahwa dataset pelatihan yang terdapat pada direktori artefak model risiko merupakan data tiruan buatan (*synthetic*), bukan data nasabah atau partisipan riil.
- **Lokasi Berkas Baru:** [README_DATA_SINTETIS.md](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/artifacts_risk/README_DATA_SINTETIS.md)
- **Ringkasan Konten:**
  1. Asal usul data: Dihasilkan oleh fungsi `generate_synthetic_data()` pada berkas `backend/training/train_risk_model.py` (baris 83-176).
  2. Parameter pembentukan: Menggunakan benih acak `RANDOM_SEED = 42`, 30 profil pengguna tiruan, 4 bulan simulasi transaksi, serta 5 kategori pengeluaran dengan distribusi variansi terdefinisi.
  3. Konteks penggunaan: Diperuntukkan bagi inisialisasi awal (*cold-start baseline*) sebelum pengumpulan data observasional pilot lapangan berizin etik dilakukan.

---

## 3. Hasil Pengujian Sistem (*Test Execution*)

Seluruh rangkaian pengujian unit dijalankan ulang untuk memastikan tidak ada degradasi regresi:

### 1. Pengujian Modul Backend (Ekspor Data Pilot)
- **Perintah:**
  ```bash
  & "ai-service/venv/Scripts/python.exe" -m unittest tests/test_export_pilot_data.py
  ```
- **Hasil:**
  ```text
  ......
  ----------------------------------------------------------------------
  Ran 6 tests in 0.203s

  OK
  ```
- **Status:** LULUS (6 dari 6 pengujian berhasil, termasuk validasi integritas struktur berkas manifes ekspor).

### 2. Pengujian Modul Aplikasi Bergerak (*Flutter Test*)
- **Perintah:**
  ```bash
  flutter test
  ```
- **Hasil:**
  ```text
  00:00 +0: loading .../post_decision_reminder_test.dart
  00:00 +1: PostDecisionReminderService - Window Logic Waktu < 24 jam belum memicu pengingat
  00:00 +2: PostDecisionReminderService - Window Logic Tepat 24 jam memicu pengingat
  00:00 +3: PostDecisionReminderService - Window Logic Di antara 24 jam dan 72 jam memicu pengingat
  00:00 +4: PostDecisionReminderService - Window Logic Tepat 72 jam memicu pengingat
  00:00 +5: PostDecisionReminderService - Window Logic Lebih dari 72 jam tidak lagi memicu pengingat (jendela kedaluwarsa)
  00:00 +6: PostDecisionReminderService - Workflow State Perekaman keputusan PROCEED dan retrieval reminder sesuai jendela
  00:00 +7: PostDecisionReminderService - Workflow State Pengguna mengabaikan banner (dismiss) menyembunyikan pengingat tanpa error
  00:00 +8: PostDecisionReminderService - Workflow State Pengguna menyelesaikan konfirmasi (submitted) menyembunyikan pengingat
  00:00 +9: PostDecisionReminderService - Workflow State Dua item: hanya item yang memenuhi kriteria jendela yang diambil
  00:00 +10: PostDecisionReminderService - Workflow State Telemetri jeda waktu refleksi (decisionLatencyMs) tersimpan pada pending item
  00:00 +10: All tests passed!
  ```
- **Status:** LULUS (10 dari 10 pengujian berhasil).

---

## 4. Audit Keamanan Perbedaan Git (*Diff Audit*)

Pemeriksaan keluaran `git diff` dilakukan secara menyeluruh terhadap seluruh berkas yang dimodifikasi dan ditambahkan:
- Tidak ditemukan kunci rahasia (*secret keys*), token API pihak ketiga, kata sandi, maupun fragmen *salt* yang tertinggal.
- Seluruh teks yang sebelumnya memuat nama atau surel rekaan telah disubstitusi dengan penanda penempatan standar.
- Berkas manifes ekspor berpotensi sensitif telah diisolasi dari indeks git.
