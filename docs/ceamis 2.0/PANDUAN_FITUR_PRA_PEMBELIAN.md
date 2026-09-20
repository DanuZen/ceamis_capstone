# Panduan & Spesifikasi Lengkap Fitur Pra-Pembelian (Pre-Purchase Intervention) — CEAMIS 2.0

> **Status:** Spesifikasi Fitur Inti (*Core Innovation*)  
> **Target Pengguna:** Generasi Z (Aplikasi Mobile Flutter)  
> **Backend Engine:** FastAPI Modular (`backend/app/pre_purchase/`)  
> **Model ML:** Logistic Regression & Random Forest (`backend/app/risk_model/`)  

---

## 1. Filosofi & Konsep Dasar

Aplikasi pencatat keuangan konvensional bersifat **reaktif** (*post-mortem*): transaksi terjadi lebih dulu, dicatat kemudian. Akibatnya, uang sudah terlanjur keluar dan penyesalan terjadi setelahnya.

**CEAMIS 2.0 membalik paradigma ini menjadi proaktif:**
Fitur **Pra-Pembelian (*Pre-Purchase Check*)** bertindak sebagai "rem darurat psikologis" (*cognitive speedbump*) sebelum transaksi diselesaikan. Pengguna memasukkan rencana belanja dalam 5 detik, dan sistem langsung memberikan evaluasi risiko berbasis data historis serta simulasi dampak nyata ke anggaran dan tabungan.

---

## 2. Alur Interaksi Pengguna (User Flow)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        ALUR FITUR PRA-PEMBELIAN                        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 1. USER MEMASUKKAN RENCANA (Mobile Flutter)                            │
│    • Nominal: Rp 275.000                                               │
│    • Kategori: "Shopping / Pakaian"                                    │
│    • Merchant (Opsional): "Uniqlo"                                     │
│    • Catatan (Opsional): "Diskon jaket parasut"                       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ POST /api/v1/pre-purchase/check
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. EVALUASI SERVER (FastAPI in-memory < 100ms)                         │
│    a. Ambil riwayat belanja user pada kategori yang sama.              │
│    b. Hitung 7 fitur kontekstual (median, z-score, sisa pagu, dll).    │
│    c. Inferensi model ML: output probabilitas risiko (0.0 - 1.0).      │
│    d. Hitung simulasi dampak ke sisa pagu bulan ini.                  │
│    e. Hitung simulasi dampak ke tanggal pencapaian target tabungan.   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Response JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. TAMPILAN PERINGATAN CERDAS (Neo-Brutalism Risk Card)                │
│    • Status Risiko: ⚠️ RISIKO TINGGI (78%)                             │
│    • Poin Pemicu Risiko (Explainable AI):                              │
│      - "Nominal ini 2.4x lebih tinggi dari rata-rata belanja pakaian"  │
│      - "Sisa anggaran kategori tinggal Rp 120.000 (15%)"               │
│    • Bar Dampak Anggaran: Rp 120.000 ➔ -Rp 155.000 (OVERBUDGET!)       │
│    • Dampak Tabungan: "Target Tabungan Laptop mundur +6 hari"         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 4. AKSI KEPUTUSAN PENGGUNA (3 Pilihan)                                 │
│    ├── [ ⏸️ TUNDA PEMBELIAN ]   ➔ Batalkan belanja, catat penghematan │
│    ├── [ ✏️ SESUAIKAN NOMINAL ] ➔ Turunkan nominal sesuai sisa pagu   │
│    └── [ ✅ TETAP LANJUT ]      ➔ Sadar risiko, lanjutkan transaksi   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ POST /api/v1/pre-purchase/decide
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 5. FEEDBACK LOOP PASCA-TRANSAKSI (1 - 3 Hari Kemudian)                │
│    • Notifikasi evaluasi: "Pembelian jaket Rp 275rb kemarin terasa    │
│      tepat atau disesali/impulsif?"                                    │
│    • Respon disimpan ke database sebagai label ground-truth ML!        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Rumus & Logika Kalkulasi Dampak

### 3.1 Kalkulasi Dampak ke Anggaran Kategori
* **Input:**
  - $L$: Limit pagu anggaran kategori bulan berjalan
  - $S_{\text{before}}$: Sisa anggaran kategori sebelum transaksi
  - $A$: Nominal rencana transaksi
* **Rumus:**
  $$S_{\text{after}} = S_{\text{before}} - A$$
  $$\text{Overbudget Amount} = \begin{cases} |S_{\text{after}}| & \text{jika } S_{\text{after}} < 0 \\ 0 & \text{jika } S_{\text{after}} \ge 0 \end{cases}$$
  $$\text{Budget Consumption Ratio} = \frac{A}{S_{\text{before}}} \times 100\%$$

### 3.2 Kalkulasi Penundaan Target Tabungan (*Savings Delayed Days*)
Jika transaksi berpotensi overbudget atau mengambil jatah tabungan bulanan, sistem mengkalkulasi berapa hari target tabungan tertunda:
* **Input:**
  - $T_{\text{target}}$: Target nominal tabungan aktif (contoh: Rp 5.000.000)
  - $D_{\text{remaining}}$: Jumlah hari tersisa menuju target date
  - $R_{\text{daily}}$: Kapasitas menabung harian rata-rata user ($\text{Income} \times \text{Saving Rate} / 30$)
* **Rumus Penundaan:**
  $$\text{Delayed Days} = \left\lceil \frac{A}{R_{\text{daily}}} \right\rceil$$
  *Contoh:* Jika kapasitas tabungan user Rp 45.000/hari dan nominal belanja impulsif Rp 270.000:
  $$\text{Delayed Days} = \frac{270.000}{45.000} = 6 \text{ hari tertunda!}$$

---

## 4. Tiga Tingkat Risiko & Logika Rekomendasi

| Tingkat Risiko | Skor Model | Kondisi Pemicu | Rekomendasi Sistem |
|---|---|---|---|
| **Rendah (LOW)** | `< 0.35` | Nominal di bawah median, sisa anggaran > 50%, tidak mengganggu tabungan. | *"Aman! Transaksi ini sesuai dengan kapasitas anggaran Anda."* |
| **Sedang (MEDIUM)** | `0.35 - 0.69` | Nominal mendekati batas sisa anggaran (sisa < 30%), frekuensi belanja kategori meningkat. | *"Hati-hati! Transaksi ini menyisakan sedikit saldo pada kategori ini. Pertimbangkan apakah bisa ditunda."* |
| **Tinggi (HIGH)** | `≥ 0.70` | Melebihi median > 2x, menyebabkan defisit/overbudget, atau frekuensi *binge-spending*. | *"Peringatan Keras! Transaksi ini berpotensi merusak rencana keuangan bulan ini dan menunda target tabungan Anda."* |

---

## 5. Tiga Skenario Penggunaan Riil (Use Cases)

### Skenario A: Kopi Harian (Transaksi Normal & Rutin)
* **Rencana:** Rp 25.000 di Kopi Kenangan, Kategori: F&B.
* **Kondisi:** Median F&B = Rp 30.000, Sisa pagu F&B = Rp 650.000.
* **Hasil:**
  - Skor Risiko: `0.12` (**LOW**)
  - Alasan: Nominal dalam batas wajar kebiasaan harian.
  - Aksi User: Langsung melanjutkan transaksi tanpa hambatan.

### Skenario B: Belanja Impulsif Baju Diskon Malam Hari (High Risk)
* **Rencana:** Rp 450.000 di E-Commerce, Kategori: Fashion/Shopping.
* **Kondisi:** Transaksi jam 23:30 (akhir pekan), Median Shopping = Rp 120.000, Sisa pagu Shopping = Rp 150.000.
* **Hasil:**
  - Skor Risiko: `0.88` (**HIGH**)
  - Alasan: Nominal 3.7x lipat median; menyebabkan overbudget Rp 300.000; target tabungan tertunda 9 hari.
  - Aksi User: Pengguna merasa tersadarkan dan memilih **[ ⏸️ Tunda Pembelian ]**. Uang terselamatkan!

### Skenario C: Kebutuhan Mendesak Servis Kendaraan (Penyesuaian)
* **Rencana:** Rp 350.000 di Bengkel, Kategori: Transportasi.
* **Kondisi:** Sisa pagu Transportasi = Rp 250.000.
* **Hasil:**
  - Skor Risiko: `0.65` (**MEDIUM**)
  - Aksi User: Pengguna memilih **[ ✏️ Sesuaikan Nominal ]**, memangkas servis non-wajib menjadi Rp 220.000 agar tetap di dalam pagu.

---

## 6. Integrasi dengan Feedback Loop (Continuous Learning)

1. Data setiap pengecekan tersimpan di tabel `pre_purchase_checks` dengan status awal `PENDING`.
2. Saat user memilih aksi, status diupdate (`PROCEED`, `ADJUST`, atau `POSTPONE`).
3. Pada interval 24–72 jam kemudian, push notification / in-app card menanyakan:
   > *"Belanja Rp 450.000 kemarin: Apakah Anda puas atau menyesal?"*
4. Respon biner (*Puas / Menyesal*) disimpan di tabel `post_decision_feedbacks`.
5. Dataset ini secara otomatis memperkaya training set untuk model retraining berikutnya.
