# Spesifikasi Model Prediksi Risiko Pra-Pembelian — CEAMIS 2.0

> **Status Dokumen:** Rujukan Teknis Inti AI / Machine Learning  
> **PIC Utama:** Hafiz Hafrienda (*AI Engineer & Data Scientist*)  
> **Reviewer:** Wira Fikri Ramadanu & Dosen Pembimbing  

---

## 1. Latar Belakang & Filosofi Model

Pada arsitektur lama (CEAMIS 1.0), modul AI mengandalkan K-Means clustering (tidak dapat ditindaklanjuti secara langsung) dan deep learning health score (black-box). Sesuai arahan dosen pembimbing, fokus kecerdasan buatan pada CEAMIS 2.0 dialihkan secara terarah ke **Intervensi Keputusan Pra-Pembelian (*Pre-Purchase Risk Prediction*)**.

Model ini bertugas memprediksi probabilitas bahwa sebuah rencana transaksi merupakan tindakan impulsif atau berisiko tinggi menyebabkan *overbudget* dan kegagalan target tabungan, **sebelum uang dibelanjakan**.

---

## 2. Metodologi & Komparasi Model

Untuk memenuhi standar akademik capstone yang kuat dan dapat dipertanggungjawabkan, sistem tidak langsung memilih satu model secara asal, melainkan membandingkan 3 pendekatan bertingkat:

```text
┌───────────────────────────┐      ┌───────────────────────────┐      ┌───────────────────────────┐
│   1. BASELINE RULE-BASED  │      │  2. LOGISTIC REGRESSION   │      │ 3. ENSEMBLE (RF / GBM)    │
├───────────────────────────┤      ├───────────────────────────┤      ├───────────────────────────┤
│ • Ambang statis anggaran  │ ───> │ • Model linear transparan │ ───> │ • Menangkap relasi        │
│ • Pembanding dasar        │      │ • Bobot bobot fitur jelas │      │   non-linear kompleks     │
│ • Fallback jika ML error  │      │ • Sangat terjelaskan(XAI) │      │ • Presisi tinggi          │
└───────────────────────────┘      └───────────────────────────┘      └───────────────────────────┘
```

### 2.1 Baseline (Rule-Based Threshold)
* Menggunakan aturan deterministik sederhana:
  $$\text{Risk}_{\text{rule}} = \begin{cases} 1 & \text{jika } \frac{\text{nominal}}{\text{sisa anggaran}} > 0.5 \text{ atau } \text{nominal} > 2.5 \times \text{median} \\ 0 & \text{lainnya} \end{cases}$$
* Berfungsi sebagai patokan dasar (*benchmark*) bahwa model Machine Learning yang dikembangkan benar-benar memberikan nilai tambah dibanding aturan statis biasa.

### 2.2 Model 1: Logistic Regression (Interpretable & Calibrated)
* **Kelebihan:** Output probabilitas terkalibrasi secara alami ($0.0 - 1.0$), koefisien bobot $\beta$ langsung menunjukkan pengaruh masing-masing fitur secara matematis tanpa keraguan.
* **Peran:** Kandidat utama untuk deployment jika akurasinya kompetitif, karena memenuhi prinsip *Explainable AI (XAI)* yang dituntut dosen.

### 2.3 Model 2: Random Forest / Gradient Boosting (Non-Linear Interaction)
* **Kelebihan:** Mampu menangkap interaksi multi-variabel non-linear (contoh: belanja hari Sabtu malam + nominal melebihi median + sisa anggaran < 20% memiliki efek pengganda risiko).
* **Peran:** Pembanding performa tingkat lanjut; dievaluasi menggunakan *Feature Importances* dan *TreeSHAP*.

---

## 3. Rekayasa Fitur (7 Contextual Input Features)

Setiap permintaan pengecekan pra-pembelian (`amount`, `category_id`, `timestamp`) diubah menjadi vektor 7 fitur kontekstual:

| # | Fitur | Formula / Definisi | Alasan Ilmiah / Relevansi Perilaku |
|---|---|---|---|
| 1 | `amount_ratio_median` | $\frac{\text{nominal}}{\text{median}(\text{nominal}_{\text{kategori\_user}})}$ | Mendeteksi lonjakan nominal di luar kebiasaan normal user pada kategori tersebut. |
| 2 | `budget_remaining_ratio` | $\frac{\text{nominal}}{\text{sisa pagu kategori}}$ | Mengukur beban transaksi terhadap kapasitas anggaran yang masih tersisa. |
| 3 | `category_frequency` | Frekuensi transaksi pada kategori yang sama dalam 7 hari terakhir | Mendeteksi perilaku *binge-spending* atau pembelian berulang dalam tempo singkat. |
| 4 | `day_of_week` | Hari transaksi (0 = Senin s.d. 6 = Minggu) + One-Hot / Sin-Cos Encoding | Hari libur / akhir pekan terbukti secara empiris memicu belanja impulsif lebih tinggi. |
| 5 | `days_to_reset` | Jumlah hari tersisa sebelum tanggal reset siklus bulanan anggaran | Transaksi besar di awal bulan vs akhir bulan memiliki profil risiko berbeda. |
| 6 | `savings_impact` | $\frac{\text{nominal}}{\text{target tabungan aktif}}$ | Mengukur seberapa besar transaksi menggerus kapasitas menabung. |
| 7 | `deviation_from_pattern` | $\| \text{nominal} - \mu_{\text{kategori}} \| / \sigma_{\text{kategori}}$ ($z\text{-score}$) | Anomali statistik belanja dibandingkan riwayat historis user. |

---

## 4. Protokol Pembagian Data (Wajib Temporal & Per-User Split)

> ⚠️ **ATURAN KRUSIAL DARI DOSEN PEMBIMBING:**  
> Dilarang keras menggunakan `train_test_split(shuffle=True)` acak standar! Pembagian acak pada data transaksi keuangan menyebabkan **Data Leakage** parah (model "mencontek" masa depan untuk memprediksi masa lalu).

### 4.1 Mekanisme Split Temporal
Pembagian data dilakukan secara **sekuensial waktu per-pengguna**:
* **Training Set:** Data transaksi Bulan 1 s.d. Bulan $N-1$ dari semua pengguna.
* **Testing / Validation Set:** Data transaksi Bulan $N$ (bulan paling akhir) dari semua pengguna.

```text
User A: [ Bulan 1 | Bulan 2 | Bulan 3 ] ──(Train)──> [ Bulan 4 ] ──(Test)
User B: [ Bulan 1 | Bulan 2 | Bulan 3 ] ──(Train)──> [ Bulan 4 ] ──(Test)
User C: [ Bulan 1 | Bulan 2 | Bulan 3 ] ──(Train)──> [ Bulan 4 ] ──(Test)
```

Dengan cara ini, pengujian model mencerminkan kondisi riil di produksi: memprediksi masa depan berdasarkan data historis yang sudah lewat.

---

## 5. Kalibrasi Ambang Batas (Cold-Start & Personalisasi)

Sistem menghadapi tantangan pengguna baru yang belum memiliki riwayat transaksi mencukupi:

```text
┌──────────────────────────────────────┐
│       PENGGUNA BARU (0 - 15 Trx)     │  ──> Menggunakan Global Population Model
│              [ Cold-Start ]          │      (Fitur dinormalisasi berbasis rata-rata kategori umum)
└──────────────────────────────────────┘
                   │
                   ▼ (Setelah data mencukupi - Learning Curve)
┌──────────────────────────────────────┐
│     PENGGUNA AKTIF (> 15 Trx)        │  ──> Menggunakan Personalized Thresholds
│           [ Personalized ]           │      (Median dan deviasi dihitung murni dari riwayat akun sendiri)
└──────────────────────────────────────┘
```

Kecukupan data (*data sufficiency*) ditentukan melalui **Learning Curve**, bukan batas angka arbitrer: saat penambahan riwayat transaksi pengguna mencapai titik konvergensi akurasi lokal, personalisasi penuh diaktifkan.

---

## 6. Feedback Loop Pasca-Keputusan (*Post-Decision Labeling*)

Model memerlukan label supervisi (*ground truth*) untuk terus berkembang. Label tidak diasumsikan sepihak oleh sistem, melainkan diverifikasi langsung oleh pengguna:

1. **Intervensi Pra-Pembelian:** Sistem memberi skor risiko dan rekomendasi.
2. **Keputusan Pengguna:** Pengguna memilih *Lanjut*, *Sesuaikan*, atau *Tunda*.
3. **Konfirmasi Pasca-Transaksi (1–3 hari kemudian):**
   - Aplikasi mobile menampilkan notifikasi singkat:
     > *"Transaksi Rp 250.000 di Kopi Kenangan 2 hari lalu — apakah ini keputusan belanja yang tepat atau terasa impulsif/menyesal?"*
     > `[ ✅ Sesuai Rencana ]`  `[ ❌ Impulsif / Menyesal ]`
4. **Penyimpanan ke Dataset Supervisi:** Jawaban pengguna disimpan ke tabel `post_decision_feedbacks` dan digunakan untuk retraining berkala.

---

## 7. Metrik Evaluasi Model

| Metrik | Target Minimum | Justifikasi |
|---|---|---|
| **Precision** | **≥ 75%** | Sangat penting untuk meminimalkan *False Positive* (agar aplikasi tidak dicap "cerewet" memblokir belanja wajar). |
| **Recall** | **≥ 70%** | Memastikan sebagian besar potensi transaksi impulsif berhasil tertangkap dan diperingatkan. |
| **F1-Score** | **≥ 72%** | Keseimbangan harmonis antara ketepatan dan cakupan deteksi risiko. |
| **Inference Latency** | **< 100 ms** | Ekstraksi fitur dan inferensi model harus instan di server. |
