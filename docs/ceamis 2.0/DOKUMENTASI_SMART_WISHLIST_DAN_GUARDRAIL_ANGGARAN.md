# 💎 DOKUMENTASI LENGKAP: SMART WISHLIST & GUARDRAIL ALOKASI ANGGARAN (CEAMIS 2.0)

> **Dokumen Arsitektur Fitur & Panduan Konsep**  
> **Revisi Filosofi:** Transformasi dari *"Form Cek Impulsif Sekali Pakai"* menjadi **"Smart Wishlist Impian & Guardrail Alokasi Anggaran Ketat"**  
> **Platform Target:** CEAMIS Mobile (Flutter Neo-Brutalism) & Backend FastAPI Engine  
> **Status:** Selesai Diimplementasikan & Terverifikasi (Passed Flutter Analyze 100%)

---

## 🧭 1. Filosofi & Latar Belakang Perubahan Konsep

### 1.1 Masalah pada Pendekatan Lama
Pada rancangan awal, fitur Pra-Pembelian hanya berupa form input transaksi singkat yang berdiri sendiri:
* Pengguna hanya memasukkan nominal saat hendak membeli barang di kasir atau e-commerce.
* **Kelemahan:** Sifatnya dadakan (*impromptu*). Ketika pengguna sudah berada di depan kasir atau tombol *checkout*, dorongan emosional sudah terlalu kuat sehingga intervensi sering diabaikan. Tidak ada konteks riwayat impian jangka panjang.

### 1.2 Konsep Baru: Smart Wishlist & Guardian Finansial
Pra-pembelian di CEAMIS 2.0 diubah menjadi **Smart Wishlist (Daftar Impian Terkelola)**:
1. **Pusat Aspirasi Belanja (*Aspirational Hub*)**: Pengguna mencatat apa saja barang/hal yang dia inginkan (misal: *Sepatu Lari, Gadget Baru, Liburan Akhir Tahun, Jaket Idaman*) ke dalam wishlist.
2. **Analisis Kesiapan Finansial (*Financial Readiness Assessment*)**: Sistem secara berkala dan dinamis mengevaluasi: **"Apakah saat ini aman dan layak secara finansial bagi pengguna untuk mewujudkan barang impian tersebut?"**
3. **Keterikatan dengan Pembagian Uang (*Envelope / Budget Allocation*)**: Pembelian tidak dinilai di ruang hampa, melainkan diuji terhadap pos alokasi anggaran yang telah ditentukan sebelumnya (Pos Kebutuhan, Pos Keinginan/Wants, Pos Tabungan/Investasi).
4. **Peringatan Ketat (*Strict Guardrails*)**: Jika mewujudkan wishlist tersebut akan **menjebol alokasi pos anggaran (overbudget)**, sistem memberikan peringatan keras, mengkalkulasi efek domino terhadap target tabungan, dan mengaktifkan jeda psikologis (*cool-down speedbump*).

---

## 💰 2. Integrasi Perencanaan Alokasi Uang & Wishlist

### 2.1 Skema Alokasi Penggunaan Uang (The 3-Pillar Budget Rule)
Pengguna menetapkan target pembagian pendapatan bulanan (misal rasio standar 50/30/20 atau kustom per kategori):
* **Pilar 1: Kebutuhan Pokok (*Needs*)** — 50% (Sewa/Kos, Makan Pokok, Utilitas/Listrik, Transportasi harian). Pos ini **terkunci rapat** dan tidak boleh dikorbankan untuk wishlist.
* **Pilar 2: Keinginan & Gaya Hidup (*Wants / Lifestyle*)** — 30% (Jajan kopi, hiburan, fashion, gadget non-esensial). Ini adalah **pos sumber utama** untuk mendanai barang-barang di Wishlist.
* **Pilar 3: Tabungan & Dana Darurat (*Savings / Investments*)** — 20% (Dana darurat, tabungan masa depan, investasi). Pos ini menjadi **penahan benturan (*safety net*)** yang harus dilindungi dari pembelanjaan impulsif.

### 2.2 Hubungan Matriks Wishlist dengan Pos Anggaran
Setiap item dalam Wishlist ditautkan ke kategori dan pos alokasi tertentu:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               PERENCANAAN ANGGARAN BULAN INI (BUDGET)                  │
│  Total Pemasukan: Rp 5.200.000                                         │
│  ├── Pos Kebutuhan (50%): Rp 2.600.000 [Terpakai: Rp 1.800.000]        │
│  ├── Pos Keinginan (30%): Rp 1.560.000 [SISA KUOTA: Rp 450.000]        │
│  └── Pos Tabungan  (20%): Rp 1.040.000 [Target Dana Darurat]           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ Uji Kelayakan Real-time
┌────────────────────────────────────────────────────────────────────────┐
│                   SMART WISHLIST ITEM YANG INGIN DIBELI                │
│  Item: "Sepatu Lari Nike Pegasus"                                      │
│  Target Harga: Rp 1.200.000                                            │
│  Pos Pembebanan: Pos Keinginan (Sisa Kuota: Rp 450.000)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ Evaluasi Guardrail
┌────────────────────────────────────────────────────────────────────────┐
│                 HASIL: 🚨 PERINGATAN KETAT (OVERBUDGET!)               │
│  Defisit Pos Keinginan : Rp 450.000 - Rp 1.200.000 = -Rp 750.000       │
│  Efek Domino Tabungan  : Memangkas 72% dari Pos Tabungan bulan ini!    │
│  Penundaan Target      : Target Dana Darurat mundur +22 Hari!          │
│  Rekomendasi AI        : ⏸️ JANGAN BELI SEKARANG. Tabung Rp 250rb/bln │
│                          selama 3 bulan ke depan agar keuangan aman.  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ 3. Mekanisme Peringatan Ketat (Strict Guardrails & Penalty Matrix)

Jika pengguna berniat mewujudkan (*checkout*) suatu item dari wishlist, sistem menguji ke dalam **3 Zona Guardrail**:

| Zona Status | Kondisi Finansial | Indikator Visual | Intervensi & Peringatan Sistem |
|---|---|---|---|
| 🟢 **ZONA AMAN (*Safe to Realize*)** | Sisa kuota pos Keinginan $\ge$ harga barang. Tabungan bulan berjalan tidak tersentuh. | Badge Lime `AMAN DIBELI` + Ikon Centang Ganda | *"Keuanganmu prima! Kuota pos keinginan masih menyisakan saldo Rp XXX setelah pembelian ini. Silakan wujudkan impianmu!"* |
| 🟡 **ZONA WASPADA (*Caution / Tight Margin*)** | Sisa kuota pos Keinginan pas-pasan (tersisa $< 15\%$ setelah pembelian). | Badge Kuning `WASPADA` + Ikon Warning | *"Perhatian! Membeli item ini akan menghabiskan hampir seluruh jatah pos keinginan bulan ini. Kamu tidak bisa jajan/nongkrong hingga tanggal gajian berikutnya."* |
| 🔴 **ZONA BAHAYA / PERINGATAN KETAT (*Strict Overbudget Guardrail*)** | Harga barang $>$ sisa kuota pos Keinginan. Terjadi **defisit negatif**. | Badge Merah Crimson `OVERBUDGET EXTREME` + Border Berdenyut | 🚨 **PERINGATAN KETAT:**<br>1. **Jebol Anggaran**: Defisit sebesar **-Rp XXX.000**.<br>2. **Efek Domino Tabungan**: Pembelian ini memaksa mengambil dana tabungan darurat.<br>3. **Penundaan Target**: Menunda target tabungan aktif selama **+X hari**.<br>4. **Intervensi Cool-down**: Tombol beli diberi jeda berpikir, disarankan tombol *"Nabung Bertahap"*. |

---

## 📱 4. Arsitektur Layar & Interaksi Pengguna (Mobile UI Flow)

Sistem Pra-Pembelian, Perencanaan Anggaran, dan Health Score pada CEAMIS Mobile mencakup 5 tampilan utama:

### 4.1 Layar A: Smart Wishlist Hub (`PrePurchaseScreen` / Tab Wishlist di Bottom Dock)
* **Header**:
  * Judul: `"Wishlist & Rencana Belanja"`
  * Subtitle: *"Pantau impianmu dan cek kesiapan anggaran sebelum membeli"*
* **Status Bar Alokasi Anggaran Bulanan (Neo-Brutal Card)**:
  * Menampilkan ringkasan: **Sisa Jatah Belanja/Wants Bulan Ini: `Rp 450.000` / `Rp 1.560.000`**
  * Bar komparasi kuota vs wishlist yang siap dibeli.
* **Filter Tab Status Wishlist**:
  * `Semua (3)`, `Siap Dibeli 🟢 (1)`, `Overbudget 🔴 (2)`.
* **Daftar Kartu Wishlist (Neo-Brutal Cards)**:
  * Tiap kartu memuat:
    * Ikon kategori / foto barang.
    * Judul barang (*"Sepatu Lari Nike Pegasus"*).
    * Estimasi harga (*"Rp 1.200.000"*).
    * Pos pembebanan (*"Pos Keinginan"*).
    * **Pill Status Kesiapan**:
      * Hijau: `Aman Dibeli`
      * Kuning: `Nabung 14 Hari Lagi`
      * Merah: `Melebihi Anggaran (-Rp 750rb)`
    * Tombol aksi cepat: `Cek Peringatan Ketat & Dampak ➔`
* **Floating Action Button (FAB)**:
  * Tombol Lime: `+ Tambah Wishlist Impian`.

### 4.2 Layar B: Form Tambah / Edit Wishlist
* Input:
  1. `Nama Barang / Impian` (cth: *"Sony WH-1000XM5"*).
  2. `Perkiraan Harga (Rp)` (cth: `4.500.000`).
  3. `Pos Anggaran / Kategori` (Dropdown: Pos Keinginan - Gadget/Lifestyle, Pos Kebutuhan, dll).
  4. `Tingkat Prioritas` (Pill selector: *Tinggi, Sedang, Hiburan*).
  5. `Target Tanggal Mewujudkan` (Opsional: *Bulan depan / Ulang tahun*).
  6. `Alasan Menginginkan` (Untuk melatih *mindful spending*).
* Tombol CTA: `Simpan ke Wishlist & Analisis Kelayakan ➔`.

### 4.3 Layar C: Layar Evaluasi Kelayakan & Peringatan Ketat (`PrePurchaseResultScreen`)
* **Status Hero Box**:
  * Tampilan status besar: 🟢 AMAN / 🟡 WASPADA / 🔴 PERINGATAN KETAT OVERBUDGET.
* **Simulasi Dampak Anggaran Dinamis**:
  * Bar Alokasi Pos Keinginan Sebelum: `Rp 450.000`
  * Nominal Pembelian: `Rp 1.200.000`
  * Status Pasca Pembelian: `-Rp 750.000 (DEFISIT ANGGARAN!)`
* **Kotak Efek Domino (Peringatan Ketat)**:
  * ⚠️ *"Membeli ini sekarang akan menyedot jatah tabunganmu bulan ini sebesar Rp 750.000."*
  * ⚠️ *"Pencapaian 'Dana Darurat 2026' tertunda selama +22 hari!"*
* **3 Tombol Aksi Keputusan**:
  1. **Tombol Rekomendasi Utama (Lime)**: `Jadikan Target Tabungan Bertahap (Rekomendasi)` ➔ Otomatis memasukkan item ke target tabungan terencana (misal nabung Rp 300rb/bulan).
  2. **Tombol Alternatif (Kuning)**: `Tunda Dulu (Beri Waktu Berpikir 72 Jam)` ➔ Mengaktifkan reminder jeda psikologis.
  3. **Tombol Sadar Risiko (Outline Merah/Navy)**: `Tetap Beli Sekarang (Sadar Risiko)` ➔ Mencatat pembelian dengan status peringatan overbudget.

### 4.4 Layar D: Halaman Perencanaan Anggaran (`PlanningScreen` / Tab Rencana di Bottom Dock)
* **Header & Total Pendapatan**:
  * Menampilkan badge: `PERENCANAAN ANGGARAN` & Total Pendapatan Bulanan `Rp 5.200.000`.
* **Preset Profil Risiko 50/30/20 (Segmented Selector)**:
  * Pilihan instan: `Konservatif (50/20/30)`, `Moderat (50/30/20)`, dan `Agresif (40/20/40)`.
* **Banner Peringatan Ketat Guardrail**:
  * Banner merah aktif saat pos belanja melebihi $\ge 80\%$ atau overbudget: *"Pagu Keinginan sudah terserap 71.2%! Sisa pagu hanya Rp 450.000. Evaluasi wishlist belanja kamu."*
* **3 Kartu Pilar Utama**:
  * Kebutuhan Pokok (Needs 50%): Rp 2.600.000.
  * Keinginan (Wants 30%): Rp 1.560.000 (Sisa Rp 450.000).
  * Tabungan & Investasi (Savings 20%): Rp 1.040.000.
* **Rincian Sub-Pos Belanja**:
  * Makan, Transportasi, Listrik & Wifi, Belanja Lifestyle, Kopi & Nongkrong, Streaming, Dana Darurat, Reksa Dana.
* **Target Celengan & Tabungan Impian**:
  * Dana Darurat 2026, Laptop Kerja Baru, Liburan Akhir Tahun beserta formulir modal tambah target.

### 4.5 Layar E: Halaman Health Score Multi-Tab Audit (`HealthScoreScreen`)
* **Aksesibel dari Beranda & Profil**:
  * Diketuk langsung dari kartu CAMI AI di Beranda (*"SKOR FINANSIAL: 78.5 • SEHAT"*) atau dari Profil.
* **Struktur 3 Sub-Tab Terpisah**:
  1. **Tab 1 (`Ringkasan`)**: Hero Score 78.5, status SEHAT, rangkuman evaluasi CAMI AI, dan aksi cepat koreksi pos pagu.
  2. **Tab 2 (`5 Indikator`)**: Rincian metrik kuantitatif (*Saving Rate 17%, Wants Ratio 28%, Impulsive Ratio 8%, Budget Adherence 85%, DTI 0%*) dengan formula, benchmark OJK/CEAMIS, dan gauge meter.
  3. **Tab 3 (`Tren & Rekomendasi`)**: Histori skor 5 bulan terakhir dan 3 saran strategi perbaikan dari CAMI AI.
* **Navigasi AppBar**:
  * Tombol kembali (*back*) untuk kembali ke Beranda atau layar pemanggil.

---

## 🛠️ 5. Skema Data & Model Teknis (Technical Architecture)

### 5.1 Model Wishlist (`WishlistItem`)
```dart
class WishlistItem {
  final String id;
  final String userId;
  final String title;
  final double estimatedPrice;
  final String categoryId;
  final String categoryName;
  final String budgetPillar; // 'wants', 'needs', 'savings'
  final int priority; // 1 (High), 2 (Medium), 3 (Low)
  final DateTime? targetDate;
  final String? notes;
  final double currentSaved; // Dana yang sudah disisihkan untuk barang ini
  final String status; // 'active', 'ready', 'postponed', 'purchased'
  final DateTime createdAt;
}
```

### 5.2 Model Evaluasi Kelayakan (`WishlistReadinessEvaluation`)
```dart
class WishlistReadinessEvaluation {
  final String wishlistItemId;
  final double itemPrice;
  final double pillarBudgetLimit;
  final double pillarRemainingBefore;
  final double pillarRemainingAfter;
  final bool isOverbudget;
  final double deficitAmount;
  final int savingsDelayedDays;
  final String riskZone; // 'SAFE', 'CAUTION', 'STRICT_OVERBUDGET'
  final List<String> warningMessages;
  final String recommendedAction; // 'PURCHASE_NOW', 'SAVE_INSTALLMENTS', 'POSTPONE'
```

---

## 🎯 6. Siklus Alur Interaksi: Perencanaan ➔ Wishlist ➔ Guardrail

Siklus menyeluruh bagaimana fitur saling berinteraksi:

1. **Tahap 1: Pengaturan Anggaran di Halaman Perencanaan (`/planning`)**
   * Pengguna mengatur alokasi dana bulanan (contoh: Pemasukan Rp 5.200.000 dengan rasio Moderat 50/30/20).
   * Menghasilkan batas pagu: Kebutuhan Rp 2.600.000, Keinginan Rp 1.560.000, Tabungan Rp 1.040.000.
2. **Tahap 2: Pengumpulan Aspirasi di Smart Wishlist (`/pre-purchase`)**
   * Pengguna memasukkan barang-barang yang diinginkan ke wishlist.
   * Sistem membaca sisa pagu pos keinginan bulan berjalan (Rp 450.000) dan memberi label kesiapan otomatis:
     * Barang $\le$ Rp 450.000 ➔ `🟢 AMAN DIBELI`.
     * Barang $>$ Rp 450.000 ➔ `🚨 OVERBUDGET`.
3. **Tahap 3: Eksekusi Uji Kelayakan & Intervensi Guardrail (`/pre-purchase/result`)**
   * Jika pengguna ingin membeli barang overbudget, muncul **Peringatan Ketat Guardrail**:
     * Menampilkan nominal defisit.
     * Menghitung hari tertundanya target tabungan aktif.
     * Mengarahkan ke tombol rekomendasi: *"Alihkan ke Tabungan Bertahap"*.
4. **Tahap 4: Dampak Balik ke Health Score (`/health-score`)**
   * Jika pengguna patuh pada guardrail, indikator *Budget Adherence* tetap tinggi (85%) dan *Health Score* tetap di zona `SEHAT` (78.5).

---

## 📊 7. Halaman Perencanaan Keuangan (50/30/20 & Guardrail Anggaran)

Untuk memastikan integrasi pra-pembelian tidak menggantung, CEAMIS Mobile kini dilengkapi dengan **Halaman Perencanaan Anggaran Mandiri (`/planning`)**:

1. **Preset Profil Risiko 50/30/20 Dinamis**:
   - **Konservatif**: 50% Kebutuhan Pokok, 20% Keinginan, 30% Tabungan/Investasi.
   - **Moderat (Standar CEAMIS)**: 50% Kebutuhan Pokok, 30% Keinginan, 20% Tabungan/Investasi.
   - **Agresif**: 40% Kebutuhan Pokok, 20% Keinginan, 40% Tabungan/Investasi.
2. **Kartu Tiga Pilar Anggaran**:
   - Menampilkan Pagu Alokasi, Realisasi Belanja, dan Sisa Saldo secara visual dengan *progress bar* neo-brutalis.
3. **Banner Peringatan Ketat (Strict Guardrail Alert)**:
   - Terpicu otomatis jika suatu pilar belanja mencapai $\ge 80\%$ (Waspada) atau $> 100\%$ (Bahaya Overbudget).
   - Memberi tahu dampak langsung terhadap *Smart Wishlist* bahwa sistem akan memblokir/menolak pembelian non-pokok.
4. **Rincian Pos Anggaran Bulanan**:
   - Makan & Dapur, Transportasi, Tagihan Utilitas, Belanja Lifestyle, Kopi & Nongkrong, Hiburan Streaming, dsb.
5. **Target Celengan & Pos Impian**:
   - Tabungan terarah (Dana Darurat, Gadget/Laptop Baru, Liburan) dengan persentase capaian dan formulir penambahan target.

---

## 🩺 8. Health Score Finansial: Multi-Tab Audit & Akses Terpadu

Sesuai arahan arsitektur terbaru, **Health Score tidak lagi dikurung dalam 1 halaman statis tunggal**:
1. **Pemisahan dari Tab Utama Bottom Dock**:
   - Slot tab ke-4 bottom dock dialihkan untuk **Halaman Perencanaan (`/planning`)** yang lebih sering diinteraksikan pengguna.
2. **Struktur Multi-Tab Detail di Halaman Health Score (`/health-score`)**:
   - **Tab 1: Ringkasan Skor**: Skor Hero (78.5), Status "SEHAT", ringkasan diagnosis CAMI AI, dan kartu aksi cepat.
   - **Tab 2: 5 Pilar Indikator**: Ulasan mendalam 5 pilar kuantitatif (Saving Rate, Wants Ratio, Impulsive Ratio, Budget Adherence, DTI Ratio) lengkap dengan standar OJK/CEAMIS dan *progress gauge*.
   - **Tab 3: Tren & Rekomendasi CAMI AI**: Histori progres skor 5 bulan terakhir, simulasi kenaikan skor, dan saran strategi praktis CAMI AI.
3. **Aksesibilitas Terpadu**:
   - Dapat diakses dari **Kartu Insight CAMI AI di Beranda** (cukup ketuk kartu/tulisan *"SKOR FINANSIAL: 78.5 • SEHAT"*), dari Profil Akun, maupun dari tombol pintas di halaman Perencanaan.

---

## 📱 9. Peta Navigasi Dock Bottom Bar CEAMIS Mobile (5 Tab)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CEAMIS BOTTOM DOCK (5 TAB)                      │
│                                                                        │
│   [ 0 ]           [ 1 ]         [ 2 ]        [ 3 ]          [ 4 ]      │
│  Beranda        Wishlist       [ + ]        Rencana        Laporan     │
│ (HomeScreen)  (Smart Wishlist) (Catat)   (Perencanaan)  (Riwayat & Lap)│
└────────────────────────────────────────────────────────────────────────┘
```

> Dokumen ini menjadi rujukan baku pengembangan fitur Pra-Pembelian, Perencanaan Keuangan, dan Health Score CEAMIS 2.0.

