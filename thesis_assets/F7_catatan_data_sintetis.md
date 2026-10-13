# Laporan Implementasi Tugas F7: Catatan Metrik Pelatihan Nyata & Analisis Data Sintetis

## 1. Ringkasan Eksekutif
Dalam rangka memenuhi prinsip integritas akademik dan transparansi metodologis pada penelitian *"Pengembangan Sistem Peringatan Dini Pengeluaran Tidak Terencana melalui Intervensi Pra-Pembelian Berbasis Pola Transaksi Personal"*, Tugas F7 mengeliminasi nilai metrik *hardcoded* pada sistem tata kelola model (*model governance*). 

Seluruh metrik performa model kini dihasilkan murni dari pipeline pelatihan aktual di [`backend/training/train_risk_model.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py) menggunakan protokol evaluasi temporal (*split* berbasis waktu tanpa pengacakan). Pipeline diperluas untuk menghitung metrik evaluasi komprehensif: **Precision, Recall, F1-Score, ROC-AUC, PR-AUC (*Average Precision*), Balanced Accuracy, False-Alert Rate ($FPR = \frac{FP}{FP + TN}$), dan Calibration Score (Brier Score)** untuk tiga pendekatan: **Rule-Based Baseline, Logistic Regression, dan Random Forest Classifier**.

---

## 2. Hasil Komparasi Metrik Pelatihan Nyata

Hasil evaluasi pada kumpulan data uji temporal bulan ke-4 ($N = 367$ transaksi) disajikan pada tabel di bawah ini (salinan dari [`thesis_assets/F7_keluaran_pelatihan.txt`](file:///c:/Users/wira1/project/ceamis_capstone/thesis_assets/F7_keluaran_pelatihan.txt)):

| Model | Versi | Precision | Recall | F1-Score | ROC-AUC | PR-AUC | Balanced Acc | False-Alert ($FPR$) | Brier Score |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Rule-Based Baseline** | `v1.0.0-baseline` | 0.9481 | 0.8312 | 0.8858 | 0.9783 | 0.9704 | 0.8992 | **0.0329** | 0.1200 |
| **Logistic Regression** | `v1.0.0-logreg` | 0.8993 | 0.8117 | 0.8532 | 0.9253 | 0.9132 | 0.8730 | 0.0657 | 0.0922 |
| **Random Forest** | `v1.1.0-rf` | 0.9295 | **0.9416** | **0.9355** | **0.9790** | **0.9759** | **0.9450** | 0.0516 | **0.0515** |

### Perbandingan dengan Metrik Lama (*Hardcoded Placeholder*):
- **Logistic Regression**:
  - *Sebelumnya (hardcoded di `pre_purchase_repository.py`)*: Precision 0.7630, Recall 0.7100, F1 0.7355, ROC-AUC 0.7820.
  - *Hasil Nyata Pipeline*: Precision **0.8993**, Recall **0.8117**, F1 **0.8532**, ROC-AUC **0.9253**, PR-AUC **0.9132**, Brier **0.0922**.
- **Random Forest**:
  - *Sebelumnya (hardcoded di `pre_purchase_repository.py`)*: Precision 0.8120, Recall 0.7450, F1 0.7771, ROC-AUC 0.8350.
  - *Hasil Nyata Pipeline*: Precision **0.9295**, Recall **0.9416**, F1 **0.9355**, ROC-AUC **0.9790**, PR-AUC **0.9759**, Brier **0.0515**.

Artefak registri model tersimpan di:
- [`backend/artifacts_risk/model_registry_trained.json`](file:///c:/Users/wira1/project/ceamis_capstone/backend/artifacts_risk/model_registry_trained.json)
- [`backend/artifacts_risk/model_registry.json`](file:///c:/Users/wira1/project/ceamis_capstone/backend/artifacts_risk/model_registry.json)
- [`backend/artifacts_risk/model_metadata_trained.json`](file:///c:/Users/wira1/project/ceamis_capstone/backend/artifacts_risk/model_metadata_trained.json)

---

## 3. Investigasi & Catatan Kritis Data Sintetis

Berdasarkan analisis langsung terhadap kode sumber [`backend/training/train_risk_model.py`](file:///c:/Users/wira1/project/ceamis_capstone/backend/training/train_risk_model.py), berikut adalah telaah metodologis mendalam:

### 3.1 Bagaimana Label `is_risky` Dibangkitkan?
Label biner `is_risky` dibangkitkan pada baris 150–173 fungsi `generate_synthetic_data()` menggunakan pendekatan skor heuristik berbasis aturan (*rule-inspired score*) yang ditambahkan komponen kebisingan acak (*Gaussian noise*):

```python
# train_risk_model.py (baris 150-173)
risk_score = 0.0
if amount_ratio_median > 2.0:
    risk_score += 0.3
if budget_remaining_ratio > 0.5:
    risk_score += 0.25
if budget_remaining_ratio > 1.0:
    risk_score += 0.15
if freq_7d >= 4:
    risk_score += 0.1
if day_of_week >= 5:  # Weekend
    risk_score += 0.05
if savings_impact > 0.05:
    risk_score += 0.1
if deviation_from_pattern > 1.5:
    risk_score += 0.1

# Add noise to prevent label from being perfectly separable
risk_score += np.random.normal(0, 0.08)
is_risky = 1 if risk_score >= 0.35 else 0

# Force some correlation with impulsive personality
if is_impulsive_buy and random.random() < 0.7:
    is_risky = 1
```

Secara operasional, transaksi diklasifikasikan sebagai `is_risky = 1` apabila total akumulasi bobot risiko melebihi ambang 0.35 atau apabila transaksi tersebut merupakan simulasi pembelian impulsif dengan probabilitas korelasi 70%.

### 3.2 Risiko Sirkularitas (*Synthetic Circularity*)
**Temuan**: **Terdapat risiko sirkularitas yang tinggi pada data pelatihan sintetis ini.**
- **Bukti Kode**: Fitur kontekstual (`amount_ratio_median`, `budget_remaining_ratio`, `freq_7d`, `day_of_week`, `savings_impact`, `deviation_from_pattern`) dan label target `is_risky` dibuat secara simultan di dalam **fungsi yang sama** (`generate_synthetic_data()`).
- Bobot heuristik yang menjumlahkan fitur-fitur tersebut (`+0.3`, `+0.25`, `+0.15`, dst.) merupakan bentuk persamaan linier terselubung.
- **Konsekuensi Akademik**: Nilai F1-score dan ROC-AUC model yang sangat tinggi (RF: F1 = 0.9355, ROC-AUC = 0.9790; Baseline: ROC-AUC = 0.9783) bukan merupakan bukti keunggulan model dalam memprediksi perilaku manusia riil, melainkan bukti bahwa model berhasil **merekonstruksi aturan matematis (*reverse-engineering*)** yang dipakai untuk membuat label sintetis tersebut.
- Hal ini wajib dinyatakan secara jujur dalam Bab Pembahasan/Keterbatasan Penelitian Skripsi bahwa data sintetis hanya berfungsi sebagai *proof-of-concept pipeline* dan uji kelayakan arsitektur perangkat lunak. Evaluasi sesungguhnya mengandalkan uji coba pilot (*pilot testing*) pada Tugas F5 & F9.

### 3.3 Proporsi Kelas pada Data Latih dan Uji
Distribusi transaksi pada pelatihan deterministik (`RANDOM_SEED = 42`):
- **Total Data**: 1.537 transaksi (dari 30 pengguna fiktif).
  - Aman (`0`): 894 transaksi (58.2%).
  - Berisiko (`1`): 643 transaksi (41.8%).
- **Data Latih (Bulan 1–3)**: 1.170 sampel.
  - Proporsi Berisiko: **41.8%** (489 positif, 681 negatif).
- **Data Uji Temporal (Bulan 4)**: 367 sampel.
  - Proporsi Berisiko: **42.0%** (154 positif, 213 negatif).

Pembagian kelas seimbang secara stabil antara data latih dan data uji tanpa pergeseran distribusi kelas (*prior shift*), karena fungsi pembangkit menggunakan parameter distribusi statis per bulan.

### 3.4 Kebocoran Temporal pada Tahap Pelatihan Sintetis
**Temuan**:
1. **Protokol Pembagian Waktu (*Temporal Split*)**:
   - Skrip mematuhi arahan akademik dosen pembimbing dengan membagi data secara sekuensial waktu per-pengguna:
     - Bulan 1–3: Data Latih ($N = 1.170$).
     - Bulan 4: Data Uji ($N = 367$).
   - Pembagian dilakukan tanpa `shuffle=True`, sehingga tidak ada kebocoran baris data langsung (*row-level leakage*).
2. **Karakteristik Agregasi Fitur Sintetis**:
   - Pada `generate_synthetic_data()`, nilai median per kategori (`cat["median"]`) dan deviasi (`cat["std"]`) diambil dari konstanta global profil kategori (misal: Shopping median Rp120.000), bukan dari agregasi riwayat dinamis.
   - Variabel `freq_7d` dibangkitkan dari sampel diskret acak independen (`random.choices`), bukan hasil *sliding window query*.
   - Oleh karena itu, pada data sintetis ini, **tidak ada kebocoran agregasi masa depan (*future leakage*)**, namun fitur tersebut masih bersifat aproksimasi statis.
3. **Penyelarasan dengan Mode Produksi**:
   - Pada aplikasi aktif (runtime), penghitungan fitur telah diperbaiki secara ketat pada Tugas F2 melalui `user_stats_service.py`, di mana seluruh statistik median, frekuensi 7 hari, dan sisa anggaran dihitung murni *point-in-time* ($T_{\text{transaksi}} < T_{\text{cek}}$).

---

## 4. Kesimpulan dan Implikasi Penulisan Naskah Skripsi
1. **Model Terpilih**: `RandomForestClassifier (v1.1.0-rf)` terpilih sebagai model ML aktif (`is_active = True`) dengan F1-Score 0.9355, PR-AUC 0.9759, dan Brier score 0.0515 (kalibrasi probabilitas superior dibanding baseline).
2. **Peran Baseline**: Rule-based baseline mencapai F1-score 0.8858 dengan False-Alert Rate sangat rendah (0.0329), menjadikannya *fallback* yang aman jika inferensi ML mengalami kendala di lingkungan produksi.
3. **Catatan Naskah**: Peneliti tidak boleh mengklaim performa >90% sebagai akurasi prediksi psikologi finansial pengguna di dunia nyata; angka tersebut harus dilaporkan sebagai hasil pengujian sintetis yang mengalami efek sirkularitas pembentukan label, dan kinerja lapangan akan dievaluasi melalui data umpan balik pasca-keputusan (Tugas F5).
