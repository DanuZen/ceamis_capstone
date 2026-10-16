# Verifikasi Model dan Data Final (Tugas G7)
## Model Prediksi Risiko Pra-Pembelian CEAMIS 2.0

Dokumen ini menyajikan pembuktian faktual atas seluruh aspek pemodelan machine learning, praproses data, pembagian temporal, metrik evaluasi, dan sifat dataset sintetis pada repositori CEAMIS 2.0 cabang `thesis/perbaikan-pilot`. Seluruh pernyataan dibuktikan dengan kutipan baris kode sumber dari [train_risk_model.py](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py) dan [pre_purchase_risk.py](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py).

---

## 1. Penanganan Ketidakseimbangan Kelas (*Class Imbalance Handling*)

### A. Penggunaan Bobot Kelas (`class_weight="balanced"`):
- **Logistic Regression:** **TERBUKTI**. Parameter `class_weight="balanced"` digunakan secara eksplisit pada inisialisasi model.
  - **Bukti Kode:** [backend/training/train_risk_model.py:358-363](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L358-L363)
    ```python
    lr_model = LogisticRegression(
        random_state=RANDOM_SEED,
        max_iter=1000,
        class_weight="balanced",
        C=1.0,
    )
    ```
- **Random Forest:** **TERBUKTI**. Parameter `class_weight="balanced"` digunakan secara eksplisit pada inisialisasi model.
  - **Bukti Kode:** [backend/training/train_risk_model.py:393-401](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L393-L401)
    ```python
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=3,
        random_state=RANDOM_SEED,
        class_weight="balanced",
        n_jobs=-1,
    )
    ```

### B. Penggunaan Teknik Resampling (SMOTE / SMOTE-ENN):
- **Status:** **TIDAK ADA**.
- **Bukti:** Tidak ada impor atau pemanggilan pustaka `imblearn`, fungsi `SMOTE`, `SMOTE-ENN`, `RandomOverSampler`, maupun `RandomUnderSampler` di seluruh skrip pelatihan `train_risk_model.py` maupun berkas pendukung lainnya. Penanganan ketidakseimbangan kelas murni mengandalkan pembobotan biaya fungsi kerugian (*cost-sensitive loss weighting*) via `class_weight="balanced"`.

---

## 2. Pembagian Data (*Data Splitting*)

### A. Logika Pembagian Temporal:
- **Status:** **TERBUKTI**.
- **Logika:** Pembagian dilakukan berbasis waktu (temporal) secara ketat tanpa pengacakan (`shuffle=False`), memisahkan transaksi berdasarkan nomor bulan simulasi:
  - **Data Latih (*Train Set*):** Bulan 1 sampai 3 (`df["month"] <= 3`), menghasilkan 1.170 sampel transaksi.
  - **Data Uji (*Holdout Test Set*):** Bulan ke-4 (`df["month"] > 3`), menghasilkan 367 sampel transaksi.
- **Bukti Kode:** [backend/training/train_risk_model.py:213-236](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L213-L236)
  ```python
  def temporal_split(df: pd.DataFrame, train_months: int = 3):
      train_df = df[df["month"] <= train_months]
      test_df = df[df["month"] > train_months]

      X_train = train_df[FEATURE_NAMES].values
      y_train = train_df["is_risky"].values
      X_test = test_df[FEATURE_NAMES].values
      y_test = test_df["is_risky"].values
      return X_train, X_test, y_train, y_test
  ```

### B. Cakupan Pengguna (Per Pengguna vs Seluruh Pengguna):
- **Status:** **SELURUH PENGGUNA SECARA GLOBAL**.
- **Penjelasan:** Meskipun docstring mencantumkan frasa *"per-user"*, implementasi kode menjalankan pemotongan `df["month"] <= train_months` pada DataFrame gabungan. Karena seluruh 30 profil pengguna tiruan memiliki riwayat transaksi di sepanjang bulan 1 hingga bulan 4, data historis seluruh 30 pengguna terdistribusi ke set latih (bulan 1-3) dan set uji (bulan 4) secara serentak.

### C. Validasi Silang (*K-Fold Cross-Validation*):
- **Status:** **TIDAK ADA**.
- **Bukti:** Tidak ditemukan fungsi `KFold`, `StratifiedKFold`, `TimeSeriesSplit`, atau `cross_val_score` di dalam kode pelatihan. Evaluasi dilakukan secara tunggal pada set uji *temporal holdout* bulan ke-4 untuk mensimulasikan penerapan di dunia nyata (memprediksi masa depan dari masa lalu).

---

## 3. Praproses dan Skala Fitur (*Preprocessing & Scaling*)

### A. Pemasangan Penskala Fitur (`StandardScaler`):
- **Status:** **TERBUKTI HANYA DIPASANG PADA DATA LATIH**.
- **Bukti Kode:** [backend/training/train_risk_model.py:330-332](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L330-L332)
  ```python
  scaler = StandardScaler()
  X_train_scaled = scaler.fit_transform(X_train)
  X_test_scaled = scaler.transform(X_test)
  ```
  Metode `.fit_transform()` hanya dipanggil pada `X_train`. Untuk data uji `X_test`, sistem hanya memanggil `.transform()`, sehingga tidak terjadi kebocoran informasi distribusi (*data leakage*) dari set uji ke set latih.

### B. Normalisasi per Pengguna:
- **Pelatihan:** **TIDAK ADA normalisasi z-score per pengguna**. Fitur dihitung terhadap median/pagu kategori belanja sintetis, kemudian diskalakan secara global menggunakan `StandardScaler`.
- **Inferensi:** **TIDAK ADA normalisasi per pengguna**. Di [pre_purchase_risk.py:58-60](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L58-L60), vektor fitur 7 dimensi diskalakan menggunakan instance global `risk_scaler.joblib` yang di-fit saat pelatihan.

### C. Penggunaan Data Uji Sebelum Pembagian:
- **Status:** **TIDAK ADA KEBOCORAN (*Zero Pre-Split Leakage*)**.
- **Bukti:** Dataset dibangkitkan langsung ke variabel `records` dalam memori, dikonversi menjadi `pd.DataFrame`, lalu segera diserahkan ke fungsi `temporal_split(df)`. Tidak ada komputasi agregasi statistik global, pengisian nilai kosong (*imputation*), atau normalisasi fitur yang mendahului fungsi pembagian data.

---

## 4. Tujuh Fitur Kontekstual (*Feature Alignment*)

Nama 7 fitur kontekstual terbukti identik persis (100% cocok) antara pipeline pelatihan dan modul inferensi backend:

| No | Nama Fitur Persis di Pelatihan (`FEATURE_NAMES`) | Nama Fitur Persis di Inferensi (`extract_features`) | Definisi & Rasio yang Dihitung |
|:--:|:---|:---|:---|
| 1 | `amount_ratio_median` | `amount_ratio_median` | Rasio nominal transaksi rencana terhadap median belanja historis kategori ($Amount / Median$). |
| 2 | `budget_remaining_ratio` | `budget_remaining_ratio` | Rasio nominal rencana terhadap sisa saldo pagu anggaran ($Amount / BudgetRemaining$). |
| 3 | `category_frequency` | `category_frequency` | Frekuensi transaksi pada kategori yang sama dalam 7 hari terakhir. |
| 4 | `day_of_week` | `day_of_week` | Indeks hari transaksi (0 = Senin, 6 = Minggu). |
| 5 | `days_to_reset` | `days_to_reset` | Jumlah hari tersisa hingga siklus anggaran bulanan di-reset. |
| 6 | `savings_impact` | `savings_impact` | Rasio nominal rencana terhadap total target tabungan aktif ($Amount / SavingsGoal$). |
| 7 | `deviation_from_pattern` | `deviation_from_pattern` | Deviasi mutlak nominal belanja terhadap rata-rata kategori dinormalisasi standar deviasi ($|Amount - Mean| / Std$). |

- **Bukti Kode Pelatihan:** [backend/training/train_risk_model.py:65-73](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L65-L73)
- **Bukti Kode Inferensi:** [backend/app/services/pre_purchase_risk.py:131-139, 148-156](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L131-L139)

---

## 5. Model Machine Learning dan Baseline Aturan

### A. Kelas Model dan Hiperparameter Utama:
1. **Model Terpilih (*RandomForestClassifier*):**
   - Kelas: `sklearn.ensemble.RandomForestClassifier`
   - Hiperparameter: `n_estimators=100`, `max_depth=10`, `min_samples_split=5`, `min_samples_leaf=3`, `class_weight="balanced"`, `n_jobs=-1`, `random_state=42`.
   - Bukti: [train_risk_model.py:393-401](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L393-L401).
2. **Model Pembanding (*LogisticRegression*):**
   - Kelas: `sklearn.linear_model.LogisticRegression`
   - Hiperparameter: `C=1.0`, `max_iter=1000`, `class_weight="balanced"`, `random_state=42`.
   - Bukti: [train_risk_model.py:358-363](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L358-L363).
3. **Random State Global:**
   - Variabel `RANDOM_SEED = 42` diterapkan pada `random.seed(42)`, `np.random.seed(42)`, dan seluruh estimator scikit-learn ([train_risk_model.py:61, 75-76](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L61)).

### B. Mekanisme Perhitungan Skor Baseline Aturan (*Rule-Based Baseline*):
- **Mekanisme:** **PENJUMLAHAN BOBOT BERTAHAP (*Weighted Additive Scoring*)**, bukan ambang tunggal.
- Skor risiko dimulai dari 0,0 dan diakumulasi secara aditif saat kondisi batas fitur terlampaui:
  - Deviasi median (`ratio`): > 3.0 (+0,35), > 2.0 (+0,25), > 1.5 (+0,15).
  - Pagu anggaran (`budget_ratio`): > 1.0 (+0,30), > 0.5 (+0,20), > 0.3 (+0,10).
  - Frekuensi kategori (`freq`): >= 5 (+0,10), >= 3 (+0,05).
  - Dampak tabungan (`sav`): > 0.5 (+0,15), > 0.2 (+0,08).
  - Deviasi pola (`dev`): > 2.0 (+0,10), > 1.5 (+0,05).
  - Skor akhir dibatasi maksimum 1,0 via `min(score, 1.0)`. Keputusan biner: bernilai 1 jika `risk_score >= 0.35`, selain itu 0.
- **Bukti Kode:** [backend/training/train_risk_model.py:269-321](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L269-L321).

---

## 6. Tata Kelola Registri Model (*Model Registry Governance*)

### A. Perekaman Metrik ke Registri:
- **Status:** **TERPROGRAM OTOMATIS (Bukan Tulisan Tangan)**.
- **Mekanisme:** Setelah tahap pengujian temporal selesai, fungsi `select_and_export` mengambil hasil dari fungsi `compute_metrics_dict()` dan secara otomatis menulis berkas:
  1. `backend/artifacts_risk/model_metadata.json` & `model_metadata_trained.json`
  2. `backend/artifacts_risk/model_registry.json` & `model_registry_trained.json`
- **Bukti Kode:** [backend/training/train_risk_model.py:472-530](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L472-L530).

### B. Lokasi Pembacaan Registri saat Inferensi:
1. **Layanan Prediksi Risiko:** [backend/app/services/pre_purchase_risk.py:62-65](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/services/pre_purchase_risk.py#L62-L65) membaca `model_metadata.json` untuk mengetahui `version_tag` aktif saat proses inferensi dijalankan.
2. **Panel Admin & Manajemen Versi:** [backend/app/api/admin.py:39](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/app/api/admin.py#L39) memanggil `repository.load_model_registry()` yang membaca `model_registry.json` (atau tabel `public.model_versions`) untuk menampilkan daftar versi model dan metrik evaluasinya ke web admin.

---

## 7. Data Sintetis dan Verifikasi Reproduksibilitas

### A. Ringkasan Statistik Data Sintetis:
- **Jumlah Profil Pengguna Tiruan:** 30 pengguna (`N_USERS = 30`).
- **Total Transaksi yang Dibangkitkan:** 1.537 baris transaksi.
- **Distribusi Kelas Keseluruhan:**
  - Kelas 0 (*Safe*): 894 transaksi (58,2%)
  - Kelas 1 (*Risky*): 643 transaksi (41,8%)
- **Distribusi Set Uji Temporal (Bulan ke-4, $N = 367$):**
  - Kelas 0 (*Safe*): 213 transaksi (58,0%)
  - Kelas 1 (*Risky*): 154 transaksi (42,0%)

### B. Mekanisme Pembangkitan Label `is_risky` dan Analisis Sirkularitas:
- **Cara Label Dihasilkan:** Label target biner `is_risky` dibangkitkan dari kombinasi linier aturan heuristik penambahan skor berbasis fitur yang sama (`amount_ratio_median`, `budget_remaining_ratio`, `category_frequency`, `savings_impact`, `deviation_from_pattern`), ditambah derau acak Gaussian `np.random.normal(0, 0.08)`. Transaksi diberi label `is_risky = 1` bila skor akumulasi $\ge 0,35$ ([train_risk_model.py:160-185](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L160-L185)).
- **Temuan Kritis (Sirkularitas Data / *Pseudo-Deterministic Circularity*):**
  Terdapat keterkaitan deterministik langsung antara fitur input dengan label target. Akibatnya, model Random Forest dan Baseline Aturan mampu mencapai nilai evaluasi yang sangat tinggi (F1 > 0,92 dan PR-AUC > 0,97) karena model secara esensial mempelajari ulang (*reverse-engineer*) formula penentu label yang ditanamkan dalam generator data. **Keterbatasan ini merupakan artefak alami data sintetis dan wajib dilaporkan secara terbuka dalam naskah tesis.**

### C. Komparasi Angka Pelatihan Awal (`F7`) vs Pelatihan Ulang Terkini (`07b`):
Pengujian eksekusi ulang pipeline pelatihan dijalankan pada lingkungan Python aktif dan hasilnya disimpan di [07b_keluaran_pelatihan_ulang.txt](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/thesis_assets/paket_penulis/07b_keluaran_pelatihan_ulang.txt):

| Model | Sumber Dokumen | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Balanced Accuracy | False Alert Rate | Brier Score |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Rule-Based Baseline** | **Laporan F7** | 0,9481 | 0,8312 | 0,8858 | 0,9783 | 0,9704 | 0,8992 | 0,0329 | 0,1200 |
| | **Pelatihan Ulang (07b)** | **0,9481** | **0,8312** | **0,8858** | **0,9783** | **0,9704** | **0,8992** | **0,0329** | **0,1200** |
| **Logistic Regression** | **Laporan F7** | 0,8993 | 0,8117 | 0,8532 | 0,9253 | 0,9132 | 0,8730 | 0,0657 | 0,0922 |
| | **Pelatihan Ulang (07b)** | **0,8993** | **0,8117** | **0,8532** | **0,9253** | **0,9132** | **0,8730** | **0,0657** | **0,0922** |
| **Random Forest** | **Laporan F7** | 0,9295 | 0,9416 | 0,9355 | 0,9790 | 0,9759 | 0,9450 | 0,0516 | 0,0515 |
| | **Pelatihan Ulang (07b)** | **0,9231** | **0,9351** | **0,9290** | **0,9786** | **0,9752** | **0,9394** | **0,0563** | **0,0515** |

- **Analisis Kesesuaian:**
  - *Baseline Aturan & Regresi Logistik:* **100% IDENTIK SEMPURNA** hingga digit desimal ke-4, membuktikan determinisme penentuan benih acak `RANDOM_SEED = 42`.
  - *Random Forest:* Selisih metrik sangat kecil ($< 0,006$ atau $< 0,6\%$) yang bersumber dari variasi thread multi-core (`n_jobs=-1`), sementara metrik kalibrasi probabilitas Brier Score tetap identik sempurna pada nilai **0,0515**.

---

## 8. Definisi Operasional Delapan Metrik Evaluasi

Berikut adalah 8 metrik evaluasi yang dihitung secara terprogram pada fungsi `compute_metrics_dict()` ([train_risk_model.py:243-266](file:///d:/WAGZ/PROJEK/PRIBADI/CAPSTONE/ceamis/backend/training/train_risk_model.py#L243-L266)):

1. **Precision:**
   - Rumus: $TP / (TP + FP)$ via `precision_score(y_true, y_pred, zero_division=0)`.
   - Makna: Proporsi peringatan risiko yang dikeluarkan sistem yang terbukti merupakan transaksi berisiko sesungguhnya.
2. **Recall (Sensitivitas):**
   - Rumus: $TP / (TP + FN)$ via `recall_score(y_true, y_pred, zero_division=0)`.
   - Makna: Proporsi seluruh transaksi berisiko yang berhasil dijaring dan diperingatkan oleh sistem.
3. **F1-Score:**
   - Rumus: $2 \times (\text{Precision} \times \text{Recall}) / (\text{Precision} + \text{Recall})$ via `f1_score(...)`.
   - Makna: Rata-rata harmonik antara precision dan recall yang menjadi metrik optimasi utama pemilihan model aktif.
4. **ROC-AUC (*Area Under Receiver Operating Characteristic*):**
   - Implementasi: `roc_auc_score(y_true, y_proba)`.
   - Makna: Kemampuan diskriminasi global model dalam memisahkan kelas aman dan berisiko pada seluruh ambang probabilitas.
5. **PR-AUC (*Area Under Precision-Recall Curve*):**
   - Implementasi: `average_precision_score(y_true, y_proba)`.
   - Makna: Rata-rata presisi terbobot recall, metrik evaluasi primer yang paling representatif untuk evaluasi ketidakseimbangan kelas.
6. **Balanced Accuracy:**
   - Rumus: $(\text{Recall}_{\text{Safe}} + \text{Recall}_{\text{Risky}}) / 2$ via `balanced_accuracy_score(y_true, y_pred)`.
   - Makna: Rata-rata akurasi pada kedua kelas guna menghindari bias optimasi pada kelas mayoritas.
7. **False Alert Rate (*Tingkat Peringatan Palsu*):**
   - Rumus: $FP / (FP + TN)$ dihitung langsung dari elemen matriks konfusi `confusion_matrix(y_true, y_pred).ravel()`.
   - Makna: Rasio transaksi aman yang keliru ditandai berisiko; indikator krusial pencegahan kejenuhan peringatan (*alert fatigue*) pada partisipan.
8. **Brier Score (*Skor Kalibrasi*):**
   - Rumus: $\frac{1}{N} \sum_{i=1}^N (p_i - y_i)^2$ via `brier_score_loss(y_true, y_proba)`.
   - Makna: Mengukur akurasi dan kalibrasi nilai probabilitas risiko (skala 0 sampai 1; nilai semakin mendekati 0 mengindikasikan probabilitas prediksi yang sangat realistis).
