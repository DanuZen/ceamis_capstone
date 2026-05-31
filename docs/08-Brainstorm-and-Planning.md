# 🧠 Brainstorming: Integrasi Onboarding & Perencanaan (Planning)

Dokumen ini adalah ruang untuk berdiskusi dan merancang bagaimana data dari **Onboarding** (seperti pendapatan bulanan, pekerjaan, dan profil risiko) akan digunakan untuk mengkustomisasi halaman **Perencanaan (Planning)** bagi pengguna.

---

## 1️⃣ Otomatisasi Alokasi Budget Berbasis Profil Risiko

Sistem akan mengambil *Total Pendapatan* dari data Onboarding dan langsung membaginya ke dalam kategori Needs, Wants, dan Savings sesuai dengan hasil prediksi modul AI **Risk Profile Classifier**.

Berikut adalah rancangan persentase dan instrumen yang akan digunakan berdasarkan hasil klasifikasi:

| Profil Risiko | Needs (Kebutuhan) | Wants (Keinginan) | Savings & Investment | Fokus Utama Instrumen |
| :--- | :---: | :---: | :---: | :--- |
| **Konservatif** | 50% | 20% | 30% | Dana Darurat, Deposito, Reksadana Pasar Uang |
| **Moderat** | 50% | 30% | 20% | Reksadana Pendapatan Tetap, Emas, Saham Blue Chip |
| **Agresif** | 40% | 20% | 40% | Saham Growth, Reksa Dana Saham, Kripto |

**Keputusan Logika:**
*   **Pembagian per Sub-Kategori:** Setelah persentase utama didapat (misal 50% Needs dari profil risiko), nominal uangnya akan **dibagi rata** ke dalam sub-kategori yang ada (Makan, Transport, Tagihan) sebagai default awal. Pengguna nantinya dapat menyesuaikan ulang angkanya secara manual sesuai kebutuhan.
*   **Kustomisasi Fleksibel & Batasan:** Jika pengguna mengubah nominal alokasi secara manual, sistem akan menampilkan **peringatan (Warning)** atau secara **otomatis membatasi input** apabila total alokasi melebihi batas (contoh: melebihi total pendapatan).
*   **Auto-Create Kategori Savings:** Sistem akan secara otomatis membuatkan slot kategori di bawah *Savings* berdasarkan saran instrumen dari masing-masing profil risiko di atas. (Contoh: Pengguna dengan profil Konservatif akan otomatis dibuatkan alokasi budget untuk "Dana Darurat", "Deposito", dan "Reksadana Pasar Uang").

## 2️⃣ Sinkronisasi dengan Pengeluaran Aktual

Di UI halaman *Planning*, setiap kategori memiliki indikator `Rp Terpakai / Rp Target` dan *progress bar*.

**Keputusan Logika:**
*   **Peringatan Overbudget:** Jika pengeluaran aktual melebihi alokasi budget yang ditentukan (contoh: Makan terpakai Rp 2.000.000 dari budget Rp 1.500.000), tampilan UI *progress bar* akan memerah dan akan ada **peringatan sistem (Warning)** bahwa limit telah terlampaui.
*   **Rollover Sisa Budget (Unspent Budget):** Di setiap penutupan bulan, semua sisa budget dari kategori pengeluaran (Needs & Wants) yang tidak terpakai akan **otomatis ditambahkan ke porsi *Savings*** di bulan berikutnya.

