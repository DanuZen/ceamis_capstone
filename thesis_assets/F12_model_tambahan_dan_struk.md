# Laporan Audit Model Tambahan & Penanganan Foto Struk — Tugas F12

**Cabang:** `thesis/perbaikan-pilot`  
**Tanggal:** 14 Oktober 2026  
**Status:** Selesai ✅

---

## 1. Ringkasan Eksekutif

Tugas F12 melakukan audit ketat terhadap dua komponen krusial untuk memastikan integritas metodologi penelitian skripsi (*field pilot*):
1. **Model di Luar Desain Penelitian:** Memetakan model *Machine Learning* warisan CEAMIS 1.0 (Model 3 Profil Risiko Onboarding dan Model 2 Spending Persona Clustering) yang berada di luar 3 pendekatan penelitian utama (Baseline Aturan, Logistic Regression, dan Random Forest).
2. **Penanganan Foto Struk Belanja:** Membuktikan secara forensik alur pemrosesan foto struk pada aplikasi seluler (*mobile*) dan backend, membuktikan ada/tidaknya transmisi atau penyimpanan berkas citra.

---

## 2. Pemetaan Model di Luar Desain Penelitian (Legacy Models)

| Nama Model / Artefak | Berkas Layanan & Endpoint | Fungsi Model | Pemakai Aktif (Frontend / Mobile / DB) | Memengaruhi Alokasi Anggaran? | Memengaruhi Peringatan Pra-Pembelian? | Memengaruhi Rekomendasi Lain? | Status & Potensi Perancu (*Confounder*) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Model 3 — Risk Profile Classifier**<br>(`risk_profile_v1.keras`, scaler & encoder) | `backend/app/services/risk_predictor.py`<br>`backend/app/api/risk_profile.py`<br>Endpoint: `POST /api/v1/predict/risk-profile` | Klasifikasi profil toleransi risiko pengguna menjadi 3 kelas (*Konservatif*, *Moderat*, *Agresif*) dengan arsitektur Neural Network (Attention layer). | **Frontend Web Dashboard:**<br>`frontend/src/app/dashboard/planning/page.tsx:434`<br><br>**Aplikasi Mobile:**<br>*TIDAK DIGUNAKAN* (Mobile onboarding murni menyimpan profil dasar via `/api/v1/users/onboarding`). | **YA (Hanya di Web)**<br>[planning/page.tsx:739](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/page.tsx#L739):<br>Rasio budget badge disesuaikan (Konservatif: 50/20/30, Moderat: 50/30/20, Agresif: 40/20/40). | **TIDAK**<br>Fitur inti pra-pembelian ([pre_purchase_risk.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py)) murni menggunakan 7 fitur finansial independen. | **YA (Hanya di Web)**<br>[planning/page.tsx:1545](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/page.tsx#L1545):<br>Menampilkan saran instrumen (emas, obligasi, saham, atau kripto). | **Potensi Perancu Parsial:**<br>Bila partisipan menggunakan Web Dashboard Perencanaan, persepsi anggaran dapat terpengaruh. Dikendalikan via sakelar `ONBOARDING_MODELS_ENABLED`. |
| **Model 2 — Spending Persona Cluster**<br>(`cluster_model.pkl`, `cluster_scaler.pkl`) | `backend/app/services/persona_predictor.py`<br>Endpoint: *TIDAK ADA* (dihapus pada rilis v2.0.0) | Klasterisasi K-Means segmentasi kebiasaan belanja pengguna. | **Tidak Ada (Orphaned File):**<br>Telah resmi digantikan oleh threshold deterministik `spending_category` di `backend/app/main.py:9` dan `backend/app/api/health_score.py`. | **TIDAK** | **TIDAK** | **TIDAK** | **Aman (Bukan Perancu):**<br>Model tidak aktif, tidak memiliki router di `main.py`, dan tidak dipanggil oleh antarmuka mana pun. |

---

## 3. Bukti Kode Keterikatan (*Traceability Proofs*)

### (a) Dampak terhadap Anggaran Pengguna
- **Bukti di Web:** Pada berkas [frontend/src/app/dashboard/planning/page.tsx:737-756](file:///c:/Users/wira1/project/ceamis_capstone/frontend/src/app/dashboard/planning/page.tsx#L737-L756):
  ```typescript
  const getRiskTargetRatios = () => {
    if (riskResult?.risk_profile) {
      const config = RISK_BUDGET_CONFIG[riskResult.risk_profile];
      if (config) return {
        needs: Math.round(config.ratios.needs * 100),
        wants: Math.round(config.ratios.wants * 100),
        savings: Math.round(config.ratios.savings * 100),
      };
    }
    return { needs: 50, wants: 30, savings: 20 }; // Moderat fallback
  };
  ```
  Keluaran profil risiko mengubah batas nominal `badgeNeedsRp`, `badgeWantsRp`, dan `badgeSavingsRp` pada kartu anggaran perencanaan web.
- **Bukti di Mobile:** Pada [mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart:145-182](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/onboarding/screens/mobile_onboarding_screen.dart#L145-L182), proses submit onboarding mobile hanya mengirim data agregat mentah ke `/api/v1/users/onboarding` dan `/api/v1/consent`, tanpa pernah memanggil endpoint profil risiko.

### (b) Ketiadaan Dampak terhadap Peringatan Pra-Pembelian
- Pada [backend/app/services/pre_purchase_risk.py:65-98](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L65-L98) dan [backend/app/api/pre_purchase.py:66-130](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L66-L130), fitur yang diekstraksi untuk penilaian risiko pra-pembelian terdiri dari:
  1. `amount` (nominal rencana belanja)
  2. `category_enc` (kategori transaksi)
  3. `urgency_enc` (tingkat urgensi)
  4. `monthly_income` (pendapatan bulanan)
  5. `current_savings` (tabungan saat ini)
  6. `monthly_expenses` (pengeluaran bulanan)
  7. `free_cash_flow` (arus kas bebas)
- Variabel `risk_profile` atau `persona` sama sekali tidak menjadi input dalam inferensi model pra-pembelian.

---

## 4. Implementasi Sakelar Kendali `ONBOARDING_MODELS_ENABLED`

Untuk mencegah pencemaran data evaluasi jika pengguna mengakses antarmuka perencanaan selama periode *field pilot*, ditambahkan sakelar isolasi:

1. **Modul Konfigurasi:** [backend/app/utils/model_config.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/utils/model_config.py)
   ```python
   def is_onboarding_models_enabled() -> bool:
       val = os.getenv("ONBOARDING_MODELS_ENABLED", "true").lower().strip()
       return val in ("true", "1", "yes", "t", "on")
   ```
2. **Perilaku Saat Nonaktif (`false`):**
   - Endpoint `/api/v1/predict/risk-profile` langsung mengembalikan profil *Moderat* (atau pemetaan sederhana dari toleransi rugi) dengan rasio standar 50/30/20, `confidence: 1.0`, dan tanda `is_mock: True`.
   - Mengeliminasi kebutuhan *runtime* TensorFlow / model `.keras` di lingkungan evaluasi tanpa menimbulkan galat HTTP 500/503.
3. **Dokumentasi Lingkungan:** Ditambahkan pada [backend/.env.example](file:///c:/Users/wira1/project/ceamis_capstone/backend/.env.example).

---

## 5. Audit Forensik Penanganan Foto Struk Belanja

### (a) Alur Pemrosesan Foto pada Klien Mobile
Pemeriksaan dilakukan pada berkas:
- [mobile/lib/features/ocr/screens/ocr_scan_screen.dart:40-98](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/ocr/screens/ocr_scan_screen.dart#L40-L98)
- [mobile/lib/features/transaction/screens/add_transaction_screen.dart:156-198](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/transaction/screens/add_transaction_screen.dart#L156-L198)

```
[Kamera / Galeri HP]
       │
       ▼ (Berkas lokal XFile sementara di cache OS)
[Google ML Kit Text Recognition] ◄── PEMROSESAN LOKAL (ON-DEVICE)
       │
       ▼ (Teks hasil ekstraksi UTF-8 / string murni)
[ApiClient POST /api/v1/ocr/parse-receipt]
       │  { "raw_text": "INDOMARET ... TOTAL Rp 45.000" }
       ▼
[Backend FastAPI OCR Endpoint] ◄── HANYA MENERIMA STRING TEKS
```

### (b) Temuan Bukti Privasi Foto Struk
1. **Zero Image Data Egress:** Berkas citra foto struk **TIDAK PERNAH DIUNGGAH** ke server backend, Supabase Storage bucket, maupun cloud Google Gemini.
2. **Kontrak Endpoint Backend:** Endpoint backend [backend/app/api/ocr.py:27](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/ocr.py#L27) menggunakan skema `ReceiptTextRequest` yang hanya menerima satu field bertipe string: `raw_text: str`. Tidak ada handler `UploadFile`, `File`, `multipart/form-data`, atau decoding base64 gambar.
3. **Penyimpanan Berkas Sementara:** Berkas foto hanya tersimpan sesaat di direktori cache sementara perangkat seluler pengguna yang dikelola oleh *Operating System* (Android/iOS) melalui plugin `image_picker`, dan tidak disalin ke penyimpanan permanen.
4. **Tabel Database:** Tidak ditemukan skema tabel `receipt_scans` pada database PostgreSQL/Supabase. Riwayat transaksi yang tersimpan hanya berupa data tabular hasil entri transaksi final (`amount`, `category`, `merchant`, `date`, `notes`).

---

## 6. Verifikasi Pengujian Otomatis

Rangkaian uji unit otomatis telah ditambahkan pada [backend/tests/test_onboarding_controls.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/tests/test_onboarding_controls.py):
1. `test_switch_helper_respects_env`: Verifikasi parser sakelar variabel lingkungan.
2. `test_switch_disabled_uses_deterministic_fallback`: Verifikasi bahwa saat `ONBOARDING_MODELS_ENABLED=false`, endpoint mengembalikan nilai bawaan terstruktur dengan `is_mock: True` tanpa memuat model ML.
3. `test_switch_enabled_returns_valid_structure`: Verifikasi integritas skema response saat sakelar aktif.
4. `test_onboarding_model_isolated_from_pre_purchase`: Membuktikan secara eksperimental bahwa sakelar model onboarding bernilai `true` atau `false` menghasilkan skor risiko pra-pembelian yang identik 100% pada endpoint `/api/v1/pre-purchase/check`.

**Hasil Uji:**
- `Ran 4 tests in 0.023s — OK`
- Seluruh 53 tes backend lulus (`53 passed`).
