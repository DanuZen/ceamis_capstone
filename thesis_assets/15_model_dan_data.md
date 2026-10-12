# Laporan Spesifikasi Model Prediksi Risiko, Rekayasa Fitur, dan Tata Kelola Data (Tugas P6)

Dokumen ini menyajikan inventarisasi teknis implementasi kecerdasan buatan (*Machine Learning*) pada repositori CEAMIS. Dokumen ini menjadi rujukan faktual untuk penyusunan Gambar 3.15 (siklus CRISP-DM), Gambar 3.16 (skema pembagian data), Tabel 3.8 (fitur input kontekstual), dan Tabel 3.9 (perbandingan performa model prediksi risiko pra-pembelian) pada BAB III Tugas Akhir.

---

## 1. Inventarisasi Komponen Kode dan Notebook Model

Pada repositori proyek CEAMIS, modul kecerdasan buatan terbagi ke dalam dua kelompok pengembangan:

### A. Model Inti Pra-Pembelian (CEAMIS 2.0 / Fokus Utama BAB III)
Model ini berfungsi melakukan evaluasi risiko impulsif dan potensi *overbudget* sebelum transaksi dieksekusi:
1. **Dokumen Desain & Metodologi:** [docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/MODEL_PREDIKSI_RISIKO.md) (spesifikasi 7 fitur, protokol temporal split, dan target metrik).
2. **Pipeline Pelatihan Lengkap:** [backend/training/train_risk_model.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py) (sintesis data, ekstraksi fitur, temporal split, pelatihan Logistic Regression & Random Forest, ekspor joblib, dan registry).
3. **Layanan Ekstraksi Fitur & Inferensi Runtime:** [backend/app/services/pre_purchase_risk.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py) (fungsi `extract_features`, `predict`, `generate_trigger_factors`, dan `_predict_rule_based`).
4. **Endpoint API Inferensi:** [backend/app/api/pre_purchase.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py) (penanganan `POST /api/v1/pre-purchase/check`, `POST /api/v1/pre-purchase/decide`, dan `POST /api/v1/pre-purchase/feedback`).
5. **Skrip Inferensi Standalone:** [backend/inference/risk_inference.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/inference/risk_inference.py) (pemuatan artefak model dan eksekusi prediksi vektor fitur).
6. **Manajemen Versi Model & 1-Click Rollback:** [backend/app/api/admin.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py) (endpoint `GET /admin/models` dan `POST /admin/models/rollback`).
7. **Artefak Tersimpan:** Folder [backend/artifacts_risk/](file:///c:/Users/wira1/project/ceamis_capstone/backend/artifacts_risk/) memuat `confusion_matrix_risk.png` dan `training_history.png`.

### B. Model Pendukung Onboarding & Klastering (Warisan CEAMIS 1.0)
Model pendukung yang dibangun pada iterasi awal:
1. **Model Profil Risiko Finansial Onboarding:**
   - Notebook: [backend/training/notebooks/risk_profile_model.ipynb](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/notebooks/risk_profile_model.ipynb) dan [data-app/data_onboarding_final/notebook/model3_risk_profile_preprocessing_cleaned_v2.ipynb](file:///c:/Users/wira1/project/ceamis_capstone/data-app/data_onboarding_final/notebook/model3_risk_profile_preprocessing_cleaned_v2.ipynb).
   - Artefak: `backend/app/models/risk_profile_v1.keras`, `scaler_risk.pkl`, `feature_columns_risk.pkl`, `metadata_risk.pkl`.
   - Layanan: [backend/app/services/risk_predictor.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/risk_predictor.py).
2. **Model Klastering Gaya Belanja (*Spending Persona*):**
   - Notebook: [backend/training/notebooks/model_2_capstone_fintech.ipynb](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/notebooks/model_2_capstone_fintech.ipynb).
   - Artefak: `backend/app/models/cluster_model.pkl`, `cluster_scaler.pkl`, `cluster_profiles.json`, `cluster_features.json`.
   - Layanan: [backend/app/services/persona_predictor.py](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/persona_predictor.py).
3. **Analisis Eksploratif Data Keuangan:**
   - Notebook: [data-app/data_onboarding_final/notebook/Financial_Health_Analytics.ipynb](file:///c:/Users/wira1/project/ceamis_capstone/data-app/data_onboarding_final/notebook/Financial_Health_Analytics.ipynb), `CEAMIS_DTI_Health_Score_Dataset_Generation.ipynb`.

---

## 2. Pemetaan Siklus CRISP-DM pada Increment 3

Penerapan siklus *Cross-Industry Standard Process for Data Mining* (CRISP-DM) pada pengembangan model risiko pra-pembelian di Increment 3 dipetakan sebagai berikut:

| Fase CRISP-DM | Sasaran dan Aktivitas Nyata | Bukti Kode dan Artefak Proyek |
|:---|:---|:---|
| **1. Business Understanding** | Menentukan kebutuhan pencegahan keputusan belanja impulsif dan perlindungan sisa anggaran sebelum transaksi dieksekusi, beralih dari model klasifikasi pasif ke intervensi aktif | [docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md:9-15](file:///c:/Users/wira1/project/ceamis_capstone/docs/ceamis%202.0/MODEL_PREDIKSI_RISIKO.md#L9-L15) |
| **2. Data Understanding** | Menganalisis variabilitas transaksi, distribusi pengeluaran terhadap median kategori, dan pengaruh frekuensi serta hari dalam seminggu | [train_risk_model.py:73-100](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L73-L100), [Financial_Health_Analytics.ipynb](file:///c:/Users/wira1/project/ceamis_capstone/data-app/data_onboarding_final/notebook/Financial_Health_Analytics.ipynb) |
| **3. Data Preparation** | Rekayasa 7 fitur kontekstual, pemisahan temporal sekuensial per-pengguna (Bulan 1-3 untuk latih, Bulan 4 untuk uji), dan standardisasi fitur (`StandardScaler`) | [train_risk_model.py:134-147, 203-226, 239-241](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L134-L147), [pre_purchase_risk.py:95-139](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L95-L139) |
| **4. Modeling** | Pelatihan komparatif tiga pendekatan: Baseline *rule-based* deterministik, Logistic Regression (interpretable linear), dan Random Forest (non-linear ensemble dengan `class_weight='balanced'`) | [train_risk_model.py:246-320](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L246-L320), [pre_purchase_risk.py:185-239](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L185-L239) |
| **5. Evaluation** | Pengujian metrik Precision, Recall, F1-Score, dan ROC-AUC; analisis koefisien bobot fitur (XAI); pembentukan matriks konfusi uji | [train_risk_model.py:257-280, 297-320](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L257-L280), [backend/artifacts_risk/confusion_matrix_risk.png](file:///c:/Users/wira1/project/ceamis_capstone/backend/artifacts_risk/confusion_matrix_risk.png) |
| **6. Deployment & Monitoring** | Penerapan model terbaik ke runtime FastAPI, ekspos endpoint evaluasi pra-pembelian, pendaftaran versi ke *model registry*, serta penyediaan endpoint *one-click rollback* | [backend/app/api/pre_purchase.py:84-201](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L84-L201), [backend/app/api/admin.py:75-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L75-L146) |

Diagram alur CRISP-DM lengkap tersedia pada berkas sumber teks Mermaid: [thesis_assets/diagrams/crispdm_increment3.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/crispdm_increment3.mmd).

---

## 3. Tabel Rekayasa Fitur Input Model (Tabel 3.8 Naskah)

Model pra-pembelian mentransformasikan rencana transaksi pengguna menjadi 7 variabel input numerik:

| # | Konsep Fitur pada Naskah | Nama Fitur di Kode | Cara Perhitungan Matematis | Normalisasi per Pengguna | Bukti Kode (path:baris) |
|:---|:---|:---|:---|:---|:---|
| 1 | Nominal relatif terhadap median kategori pengguna | `amount_ratio_median` | $\frac{\text{planned\_amount}}{\max(\text{category\_median}, 1.0)}$ | Ya (median dihitung spesifik per akun pengguna dan per pos anggaran) | [pre_purchase_risk.py:101-104](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L101-L104), [train_risk_model.py:135](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L135) |
| 2 | Rasio terhadap sisa anggaran | `budget_remaining_ratio` | $\frac{\text{planned\_amount}}{\max(\text{budget\_remaining}, 1.0)}$ | Ya (berbasis sisa pagu anggaran bulan berjalan pengguna) | [pre_purchase_risk.py:105-108](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L105-L108), [train_risk_model.py:136](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L136) |
| 3 | Frekuensi transaksi kategori | `category_frequency` | Total frekuensi transaksi pengguna pada kategori yang sama dalam rentang 7 hari terakhir | Ya (riwayat transaksi akun pengguna sendiri) | [pre_purchase_risk.py:109-111](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L109-L111), [train_risk_model.py:137](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L137) |
| 4a | Waktu transaksi (hari dalam seminggu) | `day_of_week` | Indeks hari transaksi (0 = Senin, 6 = Minggu) | Tidak (variabel kalender temporal universal) | [pre_purchase_risk.py:112-114](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L112-L114), [train_risk_model.py:138](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L138) |
| 4b | Jarak ke tanggal reset anggaran | `days_to_reset` | Selisih hari transaksi terhadap hari siklus tutup buku / gajian pengguna | Ya (berbasis tanggal reset anggaran unik per profil pengguna) | [pre_purchase_risk.py:115-122](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L115-L122), [train_risk_model.py:140-144](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L140-L144) |
| 5 | Dampak terhadap target tabungan | `savings_impact` | $\frac{\text{planned\_amount}}{\max(\text{savings\_goal\_target}, 1.0)}$ | Ya (berbasis target tabungan aktif milik pengguna) | [pre_purchase_risk.py:123-126](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L123-L126), [train_risk_model.py:145](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L145) |
| 6 | Pola berulang dan deviasi dari kebiasaan ($z$-score) | `deviation_from_pattern` | $\frac{\|\text{planned\_amount} - \mu_{\text{kategori}}\|)}{\max(\sigma_{\text{kategori}}, 1.0)}$ | Ya (rata-rata dan standar deviasi dihitung dari riwayat pengguna) | [pre_purchase_risk.py:127-130](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L127-L130), [train_risk_model.py:146](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L146) |

### Analisis Keselarasan Fitur Naskah versus Kode:
- Pada narasi naskah BAB III, fitur dirangkum menjadi 6 konsep fungsional.
- Pada implementasi kode, fitur nomor 4 dipecah secara eksplisit menjadi 2 variabel numerik (`day_of_week` dan `days_to_reset`) sehingga total vektor input berjumlah 7 fitur. Tidak ada fitur liar tambahan di luar rancangan naskah.

---

## 4. Skema Pembagian Data dan Analisis Kebocoran Data (Data Leakage)

Diagram skema pembagian data tersedia pada [thesis_assets/diagrams/split_data.mmd](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/diagrams/split_data.mmd).

### A. Logika Pembagian Temporal per-Pengguna
Protokol pembagian data diatur secara ketat pada fungsi `temporal_split` di [train_risk_model.py:203-227](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L203-L227):
- **Data Latih (*Training Set*):** Transaksi dari Bulan 1 sampai Bulan 3 untuk seluruh 30 pengguna (`df["month"] <= 3`).
- **Data Uji (*Testing Set*):** Transaksi pada Bulan 4 (bulan terakhir yang belum pernah dilihat model) untuk seluruh pengguna (`df["month"] > 3`).
- **Larangan Pengacakan Acak (*No Shuffle*):** Pengacakan baris (`shuffle=True`) dilarang untuk memastikan tidak ada informasi transaksi masa depan yang bocor ke data latih masa lalu.

### B. Evaluasi Teknik Resampling (SMOTE / SMOTE-ENN)
- **Rancangan Naskah:** Naskah merancang SMOTE atau SMOTE-ENN hanya di dalam data latih.
- **Implementasi Nyata di Kode:** Pada [train_risk_model.py:250, 290](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L250), penyeimbangan distribusi kelas dilakukan menggunakan pembobotan rugi kelas bawaan scikit-learn (`class_weight="balanced"`) baik pada Logistic Regression maupun Random Forest. Modul SMOTE sintetis tidak dipanggil pada pipeline `train_risk_model.py` (SMOTE hanya ditemukan pada arsip pra-pemrosesan survei onboarding `data-app/.../model3_risk_profile...ipynb`). `[BERBEDA DARI NASKAH]`.

### C. Evaluasi Validasi Silang (K-Fold Cross Validation)
- **Rancangan Naskah:** Naskah merancang K-Fold Cross Validation di dalam data latih.
- **Implementasi Nyata di Kode:** Pipeline pelatihan menggunakan skema *Temporal Hold-out Validation* murni (Bulan 1-3 vs Bulan 4). Modul `KFold` atau `cross_val_score` tidak diimplementasikan pada skrip pelatihan inti `train_risk_model.py`. `[BERBEDA DARI NASKAH]`.

### D. Verifikasi Kebocoran Data (*Data Leakage Verification*)
Pemeriksaan ketat pada [train_risk_model.py:238-242](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L238-L242) membuktikan:
```python
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```
- Penskalaan fitur (`StandardScaler`) dilakukan **SETELAH** pemisahan data temporal.
- Parameter $\mu$ dan $\sigma$ penskalaan di-fit **HANYA** menggunakan `X_train`, lalu diterapkan secara pasif pada `X_test`.
- **Kesimpulan:** Tidak ditemukan adanya kebocoran data (*zero data leakage*) pada tahap rekayasa maupun penskalaan fitur.

---

## 5. Profil Dataset Pelatihan

Profil dataset sintetis yang dibangkitkan pada pipeline pelatihan model risiko pra-pembelian:

- **Sumber Data:** Data transaksi keuangan sintetis berbasis simulasi perilaku probabilistik realistis ([train_risk_model.py:73-196](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L73-L196)).
- **Jumlah Pengguna:** 30 akun pengguna simulasi (`N_USERS = 30`).
- **Rentang Transaksi per Pengguna:** 30 sampai 80 transaksi per akun (total sampel berkisar ~1.650 transaksi).
- **Cakupan Waktu:** 4 bulan (120 hari) sekuensial dimulai dari 1 Juni 2026.
- **Daftar Atribut / Kolom:**
  `user_id`, `month`, `transaction_date`, `category`, `amount`, `amount_ratio_median`, `budget_remaining_ratio`, `category_frequency`, `day_of_week`, `days_to_reset`, `savings_impact`, `deviation_from_pattern`, `is_risky`.
- **Target Kelas / Ground Truth:** Label biner `is_risky` (0 = Transaksi Aman / Terencana, 1 = Transaksi Berisiko / Impulsif).
- **Distribusi Kelas:** Proporsi transaksi berisiko (*risky rate*) terjaga pada rentang realistis 25% hingga 35%.
- **Mekanisme Pembangkitan Label:** Nilai risiko dihitung dari fungsi multi-faktor (lonjakan nominal, tekanan sisa pagu, frekuensi berulang, dampak tabungan, deviasi statistik) yang ditambahkan gangguan acak Gaussian (*noise* $\mu=0, \sigma=0.08$) untuk merefleksikan variabilitas perilaku manusia di dunia nyata.

---

## 6. Tabel Perbandingan Performa Model (Tabel 3.9 Naskah)

Berdasarkan hasil pengujian pada set uji temporal (Bulan ke-4) yang tersimpan pada sistem [backend/app/api/admin.py:36-61](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L36-L61) dan [train_risk_model.py:335-348](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py#L335-L348):

| Model / Pendekatan | Versi Tag | Precision | Recall (Hit Rate) | F1-Score | ROC-AUC | Status Deployment | Catatan Peran Akademik |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **1. Baseline Rule-Based** | `baseline-v1.0` | 0.6840 | 0.6210 | 0.6510 | n/a | Fallback | Ambang statis deterministik, patokan dasar nilai tambah ML |
| **2. Logistic Regression** | `v1.0.0-logreg` | 0.7630 | 0.7100 | 0.7355 | 0.7820 | Tersedia (Inactive) | Model linier terkalibrasi alami, koefisien $\beta$ mudah dijelaskan |
| **3. Random Forest Classifier** | `v1.1.0-rf` | **0.8120** | **0.7450** | **0.7771** | **0.8350** | **Aktif (Active Production)** | Menangkap interaksi non-linier multi-variabel, performa terbaik |

### Evaluasi terhadap Batas Kriteria Minimum Naskah:
- **Precision:** Target minimum $\ge 75\%$. Model Random Forest mencapai **81.20%** (LULUS).
- **Recall:** Target minimum $\ge 70\%$. Model Random Forest mencapai **74.50%** (LULUS).
- **F1-Score:** Target minimum $\ge 72\%$. Model Random Forest mencapai **77.71%** (LULUS).
- **ROC-AUC:** Model Random Forest mencatatkan kemampuan separasi area di bawah kurva sebesar **0.8350**.

---

## 7. Versi Model dan Prosedur Rollback Model

### A. Struktur Registri Model (*Model Registry*)
Seluruh versi model dicatat dalam berkas konfigurasi `backend/artifacts_risk/model_registry.json` dan dimuat oleh router admin [backend/app/api/admin.py:36-61](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L36-L61). Atribut tiap versi memuat:
- `id`: Pengenal unik UUID (misalnya `c1f72a44-8839-4d91-bb27-729d4827d091`).
- `version_tag`: Penanda versi semantik (contoh: `v1.0.0-logreg`, `v1.1.0-rf`).
- `algorithm`: Nama algoritma machine learning scikit-learn.
- `precision`, `recall`, `f1_score`, `roc_auc`: Metrik validasi uji independen.
- `is_active`: Penanda status operasional (hanya satu model bernilai `True`).
- `artifact_path`: Lokasi berkas serialisasi bobot model `.joblib`.
- `deployed_at`: Stempel waktu aktivasi versi.

### B. Prosedur One-Click Rollback
Rollback model dikelola oleh endpoint `POST /admin/models/rollback` di [backend/app/api/admin.py:98-146](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/admin.py#L98-L146):
1. Dasbor admin mengirim permintaan JSON berisi `target_model_version_id` dan `reason` (alasan rollback wajib diisi).
2. Backend memvalidasi keberadaan ID model di registry. Jika model yang diminta sudah aktif, backend menolak dengan kode status 400.
3. Backend menonaktifkan seluruh entri versi model (`is_active = False`), lalu mengaktifkan model target (`target["is_active"] = True`).
4. Stempel waktu `deployed_at` diperbarui ke waktu UTC saat ini dan registri disimpan kembali ke `model_registry.json`.
5. Service inferensi memuat ulang bobot model dari `artifact_path` model aktif secara dinamis tanpa memerlukan *restarting server*.
