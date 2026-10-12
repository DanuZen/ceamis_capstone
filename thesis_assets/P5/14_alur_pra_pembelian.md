# Laporan Penelusuran Alur Pemeriksaan Pra-Pembelian (Tugas P5)

Dokumen ini menyajikan penelusuran implementasi nyata fitur pemeriksaan pra-pembelian (*pre-purchase check*) pada repositori CEAMIS, membandingkannya dengan rancangan enam langkah pada naskah BAB III (Gambar 3.8 dan Gambar 3.9), serta mendokumentasikan mekanisme *explainable AI* (XAI), penanganan *cold start*, dan siklus *feedback ground truth*.

---

## 1. Tabel Langkah Nyata Alur Pra-Pembelian

Berikut adalah penelusuran runut alur eksekusi dari komponen antarmuka pengguna Flutter hingga penulisan di basis data PostgreSQL backend:

| No | Aktor | Komponen / Lapisan | Fungsi / Operasi | Bukti Kode (path:baris) | Keterangan |
|:---|:---|:---|:---|:---|:---|
| 1 | Pengguna | Layar Flutter (`PrePurchaseScreen`) | Pengguna memasukkan nominal, judul barang, dan kategori rencana belanja | [pre_purchase_screen.dart:108-145](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart#L108-L145) | Input didukung validasi nilai nominal > 0 dan pemilihan kategori pos anggaran |
| 2 | Pengguna / Sistem | Layar Flutter (`PrePurchaseScreen`) | Pemanggilan evaluasi item wishlist atau tombol cek risiko langsung | [pre_purchase_screen.dart:204-232](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart#L204-L232) | Memanggil fungsi `_evaluateWishlistItem` atau submit form rencana belanja |
| 3 | Aplikasi Mobile | State Notifier (`PrePurchaseNotifier`) | Mengirim permintaan evaluasi risiko ke backend API | [pre_purchase_provider.dart:247-289](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart#L247-L289) | Mengirim payload JSON ke endpoint `ApiEndpoints.prePurchaseCheck` |
| 4 | Backend API | Router FastAPI (`pre_purchase.py`) | Penerimaan endpoint `POST /api/v1/pre-purchase/check` dan ekstraksi konteks | [pre_purchase.py:84-114](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L84-L114) | Mengambil statistik kategori, anggaran berjalan, dan target tabungan pengguna |
| 5 | Backend Engine | Service ML (`pre_purchase_risk.py`) | Ekstraksi 7 fitur kontekstual pra-pembelian (`extract_features`) | [pre_purchase_risk.py:95-139](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L95-L139) | Menghitung rasio median, sisa anggaran, frekuensi 7 hari, hari menuju reset, dampak tabungan, dan z-score |
| 6 | Backend Engine | Service ML (`pre_purchase_risk.py`) | Inferensi skor risiko via model ML atau baseline rule-based | [pre_purchase_risk.py:143-184](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L143-L184) | Menggunakan Random Forest / XGBoost jika tersedia, fallback ke rule-based baseline jika belum |
| 7 | Backend Engine | Service ML (`pre_purchase_risk.py`) | Pembangkitan alasan penjelasan risiko kontekstual (XAI) | [pre_purchase_risk.py:243-307](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L243-L307) | Menghasilkan daftar teks faktor pemicu berdasarkan deviasi statistik dan pagu |
| 8 | Backend API | Router FastAPI (`pre_purchase.py`) | Perhitungan dampak anggaran dan penundaan capaian tabungan | [pre_purchase.py:119-148](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L119-L148) | Menghitung sisa nominal dan estimasi jumlah hari penundaan target tabungan |
| 9 | Basis Data | PostgreSQL / In-Memory Store | Penyimpanan data pemeriksaan awal (`pre_purchase_checks`) | [pre_purchase.py:173-184](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L173-L184) | Menyimpan snapshot fitur, skor risiko, dan check_id berformat UUID |
| 10 | Layar Mobile | Layar Hasil Flutter (`PrePurchaseResultScreen`) | Menampilkan skor risiko, label tingkat risiko, faktor pemicu, dan dampak | [pre_purchase_result_screen.dart:217-230](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L217-L230) | Menampilkan rincian visual kartu peringatan dan perbandingan sisa pagu |
| 11 | Pengguna | Layar Hasil Flutter (`PrePurchaseResultScreen`) | Pengguna memilih salah satu dari respons: Lanjut, Sesuaikan, atau Tunda | [pre_purchase_result_screen.dart:557-675](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L557-L675) | Tombol aksi: 'Beli Sekarang (Sadar Risiko)', 'Nabung Bertahap / Sesuaikan', 'Tunda Dulu (Jeda 72 Jam)' |
| 12 | Aplikasi Mobile | State Notifier (`PrePurchaseNotifier`) | Mengirim perekaman keputusan pengguna ke endpoint backend | [pre_purchase_provider.dart:292-315](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/providers/pre_purchase_provider.dart#L292-L315) | Memanggil endpoint `POST /api/v1/pre-purchase/decide` |
| 13 | Backend API | Router FastAPI (`pre_purchase.py`) | Perekaman status keputusan pengguna ke penyimpanan data | [pre_purchase.py:208-248](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L208-L248) | Status keputusan diperbarui menjadi `RECORDED` |
| 14 | Pengguna / Sistem | Endpoint Feedback Backend | Pengumpulan label konfirmasi pasca-keputusan (feedback ground truth) | [pre_purchase.py:255-285](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L255-L285) | Menerima data `was_impulsive` (True/False) dan rating kepuasan setelah 1 sampai 3 hari transaksi |

---

## 2. Perbandingan dengan Enam Langkah Rancangan Naskah

| Langkah pada Naskah | Deskripsi Rancangan Naskah | Kondisi di Kode Proyek | Status Kesesuaian | Bukti dan Catatan |
|:---|:---|:---|:---|:---|
| Langkah 1 | Pengguna memasukkan rencana pembelian (nominal dan kategori) | Disediakan form input judul barang, estimasi harga, dan kategori pos anggaran pada Flutter | SESUAI | [pre_purchase_screen.dart:108-145](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_screen.dart#L108-L145) |
| Langkah 2 | Sistem menghitung skor risiko dengan model prediksi | Ekstraksi 7 fitur kontekstual dan inferensi probabilitas risiko melalui model ML (atau baseline rule-based) | SESUAI | [pre_purchase_risk.py:95-184](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L95-L184) |
| Langkah 3 | Sistem menampilkan peringatan beserta alasan atau faktor pemicu | Menampilkan kartu peringatan (LOW, MEDIUM, HIGH) disertai daftar faktor pemicu (XAI) | SESUAI | [pre_purchase_risk.py:243-307](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L243-L307), [pre_purchase_result_screen.dart:217-230](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L217-L230) |
| Langkah 4 | Sistem menampilkan dampak terhadap sisa anggaran dan tujuan tabungan | Menampilkan perbandingan sisa pagu anggaran sebelum versus sesudah belanja serta estimasi penundaan target tabungan dalam hari | SESUAI | [pre_purchase.py:119-148](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L119-L148), [pre_purchase_result_screen.dart:300-550](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L300-550) |
| Langkah 5 | Pengguna memilih Lanjut, Sesuaikan, atau Tunda | Disediakan tombol aksi: Beli Sekarang (PROCEED), Nabung Bertahap/Koreksi (ADJUST), dan Tunda 72 Jam (POSTPONE). Sistem tidak memblokir transaksi | SESUAI | [pre_purchase_result_screen.dart:557-675](file:///c:/Users/wira1/project/ceamis_capstone/mobile/lib/features/pre_purchase/screens/pre_purchase_result_screen.dart#L557-L675), [pre_purchase.py:208-248](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L208-L248) |
| Langkah 6 | Konfirmasi pasca-keputusan (terencana atau tidak terencana) disimpan sebagai label | Endpoint `POST /pre-purchase/feedback` tersedia di backend FastAPI untuk menyimpan status `was_impulsive` dan rating. Namun pada aplikasi Flutter, dialog pengingat periodik 1 sampai 3 hari pasca-keputusan belum terpicu otomatis pada alur UI | [BERBEDA DARI NASKAH] | Endpoint backend lengkap di [pre_purchase.py:255-285](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L255-L285), namun pemicu periodik di layar mobile belum diimplementasikan |

---

## 3. Penjelasan Mekanisme Pembangkitan Alasan / Faktor Pemicu (XAI)

Pembangkitan faktor pemicu (*trigger factors*) dilakukan secara deterministik pada fungsi `generate_trigger_factors` di [backend/app/services/pre_purchase_risk.py:243-307](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L243-L307) dengan menganalisis nilai dari 7 fitur kontekstual:

1. **Anomali Nominal Belanja (`amount_ratio_median`):**
   - Aturan: Jika rasio nominal rencana terhadap nilai median riwayat belanja kategori > 1.5.
   - Pesan: "Nominal belanja ini X.Xx lebih besar dari rata-rata pengeluaran [Kategori] Anda (Rp [Median])."
2. **Tekanan Anggaran Kategori (`budget_remaining_ratio`):**
   - Aturan: Jika rasio nominal rencana menghabiskan lebih dari 50% sisa pagu berjalan.
   - Pesan: "Sisa anggaran [Kategori] bulan ini tinggal Rp [Sisa] ([Persentase]% dari total pagu)."
3. **Peringatan Defisit Pagu (`is_overbudget`):**
   - Aturan: Jika sisa anggaran setelah transaksi bernilai negatif (`remaining_after < 0`).
   - Pesan: "Transaksi ini berpotensi memicu overbudget sebesar Rp [Nominal Defisit]."
4. **Pola Belanja Beruntun (*Binge-spending* / `category_frequency`):**
   - Aturan: Jika frekuensi belanja pada kategori yang sama dalam 7 hari terakhir >= 3 kali.
   - Pesan: "Anda sudah bertransaksi X kali pada kategori [Kategori] dalam 7 hari terakhir."
5. **Dampak Tabungan Masa Depan (`savings_impact`):**
   - Aturan: Jika rasio nominal transaksi terhadap target tabungan > 10% (0.1).
   - Pesan: "Transaksi ini berdampak X.X% terhadap target tabungan Anda."
6. **Deviasi Statistik Ekstrem (`deviation_from_pattern` / Z-Score):**
   - Aturan: Jika deviasi absolut nominal terhadap rata-rata kategori > 1.5 standar deviasi.
   - Pesan: "Pola belanja ini menyimpang X.X standar deviasi dari kebiasaan Anda pada kategori [Kategori]."
7. **Kondisi Normal (Bebas Risiko):**
   - Jika tidak ada aturan di atas yang terpicu, sistem memberikan keterangan: "Rencana belanja ini terlihat sesuai dengan pola normal Anda."

---

## 4. Perilaku Saat Data Pengguna Masih Sedikit (Aturan Cold Start)

Pada fase awal penggunaan, data riwayat transaksi pengguna belum memadai untuk membentuk distribusi statistik (rata-rata, median, standar deviasi). Sistem menangani kondisi ini melalui dua mekanisme pelindung (*guardrails*):

1. **Penjagaan Pembagian dengan Nol (*Safe Denominator Guard*):**
   Pada fungsi `extract_features` di [backend/app/services/pre_purchase_risk.py:101-130](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L101-L130), jika nilai statistik bernilai nol atau belum ada transaksi:
   - Median diamankan: `safe_median = max(category_median, 1.0)`
   - Sisa anggaran diamankan: `safe_remaining = max(budget_remaining, 1.0)`
   - Target tabungan diamankan: `safe_savings = max(savings_goal_target, 1.0)`
   - Standar deviasi diamankan: `safe_std = max(category_std, 1.0)`
   Hal ini menjamin tidak terjadi *ZeroDivisionError* pada kalkulasi matematis.

2. **Pengalihan ke Baseline Berbasis Aturan (*Rule-based Baseline Fallback*):**
   Pada fungsi `predict` dan `_predict_rule_based` di [backend/app/services/pre_purchase_risk.py:185-239](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/services/pre_purchase_risk.py#L185-L239), apabila model ML belum dimuat atau pengguna baru belum memiliki model personal, evaluasi risiko dialihkan secara otomatis ke formula ambang batas statis:
   - Bobot rasio terhadap median (kontribusi skor 0.15 sampai 0.35).
   - Bobot rasio terhadap sisa anggaran (kontribusi skor 0.10 sampai 0.30).
   - Bobot frekuensi 7 hari (kontribusi skor 0.05 sampai 0.10).
   - Bobot dampak tabungan (kontribusi skor 0.08 sampai 0.15).
   - Bobot deviasi pola (kontribusi skor 0.05 sampai 0.10).
   Skor risiko dibatasi maksimum 1.0, lalu dikategorisasikan ke tingkat risiko (LOW < 0.35, MEDIUM 0.35-0.64, HIGH >= 0.65). Dengan demikian sistem tetap berfungsi penuh melayani pengguna baru tanpa kegagalan layanan.

---

## 5. Perilaku Saat Konfirmasi Pasca-Keputusan Tidak Diisi (Feedback Null)

Pada siklus umpan balik (*continuous learning*), konfirmasi pasca-keputusan bersifat sukarela (*opt-in*):

1. **Integritas Transaksi Utama:**
   Pencatatan keputusan pengguna (PROCEED, ADJUST, atau POSTPONE) telah selesai dicatat pada tahap pemanggilan `POST /api/v1/pre-purchase/decide` ([backend/app/api/pre_purchase.py:227-248](file:///c:/Users/wira1/project/ceamis_capstone/backend/app/api/pre_purchase.py#L227-L248)). Jika pengguna mengabaikan atau tidak pernah mengisi konfirmasi pasca-keputusan, transaksi keuangan riil dan pencatatan riwayat tidak mengalami pembatalan maupun galat.
2. **Status Label Ground Truth:**
   Rekaman evaluasi pada `pre_purchase_checks` tetap tersimpan dengan kolom umpan balik bernilai kosong (`NULL` / *unlabeled*).
3. **Penyaringan pada Pipeline Pelatihan Ulang:**
   Pada modul pelatihan ulang model, data evaluasi yang memiliki status *unlabeled* (tanpa label `was_impulsive`) disaring keluar (*filtered out*) sehingga tidak mengotori dataset pelatihan terawasi (*supervised retraining dataset*).
