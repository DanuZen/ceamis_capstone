# Laporan Telemetri Keterlibatan Tambahan (Tugas F10)

**Fitur:** Pencatatan Jeda Waktu Refleksi Keputusan (*Decision Latency Telemetry*)  
**Cabang Kerja:** `thesis/perbaikan-pilot`  
**Waktu Penyelesaian:** 14 Oktober 2026  
**Status:** Selesai, Teruji, dan Terintegrasi dengan Tata Kelola Privasi (F3)

---

## 1. Latar Belakang Ilmiah dan Tujuan Telemetri

Dalam studi intervensi finansial berbasis teknologi (*just-in-time nudge*), efektivitas peringatan dini pra-pembelian tidak hanya diukur secara biner (apakah transaksi dibatalkan atau tetap dilanjutkan), melainkan juga melalui **efek jeda kognitif (*cognitive pause / reflection time*)** yang berhasil diciptakan oleh antarmuka sistem.

Metrik telemetri yang ditambahkan adalah:
$$\text{decision\_latency\_ms} = t_{\text{decision\_click}} - t_{\text{screen\_rendered}}$$

### Tujuan Analisis Data pada Naskah Skripsi:
1. **Mengukur Dampak Intervensi terhadap Refleksi Pengguna:** Membandingkan apakah peringatan dengan tingkat risiko tinggi (`HIGH`) menghasilkan durasi refleksi yang secara signifikan lebih lama sebelum pengguna memutuskan tindakan (`POSTPONE` atau `ADJUST`) dibandingkan transaksi risiko rendah (`LOW`).
2. **Mendeteksi Perilaku Habitual vs Deliberatif:** Membedakan antara pengguna yang mengabaikan peringatan secara impulsif (latensi sangat singkat $< 1000\text{ ms}$) dengan pengguna yang benar-benar membaca rekomendasi dan dampak anggaran (latensi $> 4000\text{ ms}$).

---

## 2. Prinsip Perlindungan Privasi & Penegakan Persetujuan (*Privacy Gate*)

Sesuai prinsip etika penelitian dan *privacy-by-design*:
- **Persetujuan Wajib (F3):** Data telemetri `decision_latency_ms` **HANYA dicatat dan disimpan** apabila pengguna telah memberikan persetujuan penelitian aktif (`given = True` dan `withdrawn_at IS NULL` pada `consent_records`).
- **Pembersihan Otomatis (*Privacy Strip*):** Jika pengguna belum memberikan persetujuan atau telah mencabut persetujuan (*withdrawn*), backend FastAPI secara otomatis mengabaikan nilai `decision_latency_ms` dari payload permintaan dan menyimpannya sebagai `NULL` / `None`.
- **Tanpa PII:** Nilai yang dicatat murni besaran integer waktu (milidetik), tanpa pelacakan posisi kursor, rekaman layar, atau data biometrik lainnya.

---

## 3. Rincian Perubahan Implementasi

### 3.1. Basis Data & DDL Migrasi
- Berkas DDL: `backend/db/migrations/003_telemetry_decision_latency.sql`
  ```sql
  ALTER TABLE public.pre_purchase_checks
  ADD COLUMN IF NOT EXISTS decision_latency_ms INTEGER;

  CREATE INDEX IF NOT EXISTS idx_pre_purchase_checks_decision_latency
      ON public.pre_purchase_checks(decision_latency_ms)
      WHERE decision_latency_ms IS NOT NULL;
  ```

### 3.2. Skema & Model Backend (FastAPI / Pydantic / SQLAlchemy)
1. **`backend/app/schemas/pre_purchase_schema.py`:**
   - Menambahkan field `decision_latency_ms: Optional[int] = Field(None, ge=0)` pada `DecisionRecordRequest` dan `DecisionRecordResponse`.
   - Validasi `ge=0` mencegah rekaman latensi bernilai negatif akibat desinkronisasi jam perangkat.
2. **`backend/app/models/pre_purchase.py`:**
   - Menambahkan kolom `decision_latency_ms = Column(Integer, nullable=True)` pada model ORM `PrePurchaseCheck`.
3. **`backend/app/services/pre_purchase_repository.py`:**
   - Memperbarui fungsi `record_decision(...)` untuk menerima dan menyimpan `decision_latency_ms` ke dalam struktur memori dan payload patch PostgreSQL.
4. **`backend/app/api/pre_purchase.py`:**
   - Menerapkan *privacy consent gate*: memeriksa status persetujuan `repository.get_consent_status(user_id)`. Bila izin aktif, nilai dicatat; bila tidak, nilai di-set menjadi `None`.

### 3.3. Skrip Ekspor Data Pseudonim (F9 Integration)
- Berkas: `backend/scripts/export_pilot_data.py`
  - Menyertakan kolom `decision_latency_ms` pada sanitasi berkas `pilot_decisions_pseudonymized.csv` dan `pilot_checks_pseudonymized.csv`.
  - Hal ini memungkinkan peneliti langsung melakukan analisis statistik ANOVA atau korelasi antara skor risiko ML dengan durasi pertimbangan pengguna tanpa melanggar privasi.

### 3.4. Aplikasi Mobile (Flutter / Dart)
1. **`mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart`:**
   - Menangkap cap waktu awal rendering: `final DateTime _screenOpenedAt = DateTime.now();`.
   - Menghitung durasi milidetik saat tombol keputusan ditekan:
     `final int decisionLatencyMs = DateTime.now().difference(_screenOpenedAt).inMilliseconds;`.
2. **`mobile/lib/features/pre_purchase/services/post_decision_reminder_service.dart`:**
   - Memperbarui model `PendingFeedbackCheck` dan metode `recordDecision(...)` dengan atribut `decisionLatencyMs`.
3. **`mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart`:**
   - Mengirimkan `decision_latency_ms` pada payload HTTP POST ke `/api/v1/pre-purchase/decide`.

---

## 4. Hasil Pengujian dan Verifikasi

### 4.1. Backend Python Unit & Integration Tests (`test_telemetry.py`)
- Perintah: `venv\Scripts\python.exe -m unittest discover -s tests -p "test_*.py" -v`
- Hasil: **44/44 tests LULUS** (100% Lulus)
  - `test_decision_latency_recorded_with_active_consent`: **LULUS** (tersimpan saat consent aktif).
  - `test_decision_latency_stripped_without_consent`: **LULUS** (terhapus saat belum consent).
  - `test_decision_latency_stripped_when_consent_withdrawn`: **LULUS** (terhapus saat consent dicabut).
  - `test_negative_decision_latency_rejected_422`: **LULUS** (validasi nilai negatif ditolak HTTP 422).
  - `test_export_includes_decision_latency_for_consented_users`: **LULUS** (masuk ke CSV pseudonim).

### 4.2. Mobile Flutter Unit Tests (`post_decision_reminder_test.dart`)
- Perintah: `flutter test`
- Hasil: **10/10 tests LULUS** (mencakup verifikasi persistensi dan serialisasi `decisionLatencyMs`).
- Analisis Kode: `flutter analyze` $\rightarrow$ **No issues found!** (0 isu).

---

## 5. Rekomendasi Penulisan pada Naskah Skripsi

Data telemetri `decision_latency_ms` memberikan nilai tambah yang kuat pada naskah skripsi:
- **Pada Bab 3 (Metodologi Penelitian):** Tambahkan variabel `decision_latency_ms` sebagai variabel perantara (*mediating variable*) untuk mengevaluasi apakah sistem peringatan dini efektif memicu proses berpikir reflektif (*System 2 thinking*) menurut teori psikologi kognitif Kahneman.
- **Pada Bab 4 (Hasil dan Pembahasan):** Sajikan grafik sebaran boxplot durasi jeda keputusan berdasarkan level risiko (`LOW` vs `MEDIUM` vs `HIGH`) untuk membuktikan secara empiris bahwa peringatan risiko tinggi memicu pertimbangan lebih mendalam dari pengguna.
