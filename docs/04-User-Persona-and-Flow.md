# Dokumentasi Hak Akses (Role) & Alur Pengguna (User Flow)

Dokumen ini menjelaskan pembagian hak akses (role) di dalam sistem CEAMIS (Finance Engine), beserta penjelasan penting dan alur aktivitas (user flow) untuk masing-masing peran.

---

## 1. Role: GUEST (Tamu / Pengunjung)
**Penjelasan Penting:** 
Guest adalah pengguna yang belum memiliki akun atau belum melakukan proses autentikasi (login). Fokus sistem untuk Guest adalah pemasaran (marketing), edukasi awal, dan *onboarding* untuk meyakinkan mereka mendaftar.
- **Akses Sistem:** Sangat terbatas. Hanya dapat mengakses halaman publik.
- **Daftar Halaman/Modul yang Dapat Diakses:**
  - `/` (Landing Page Utama)
  - `/auth/login` (Halaman Masuk)
  - `/auth/register` (Halaman Daftar)
  - Artikel/Blog Edukasi Publik (jika disediakan tanpa login)
- **Tujuan Utama:** Konversi dari pengunjung menjadi pengguna terdaftar (User).

**Alur Pengguna (User Flow):**
1. **Akses Web:** Mengunjungi halaman utama (Landing Page).
2. **Eksplorasi Fitur:** Membaca informasi tentang CEAMIS, melihat animasi *mockup* dashboard, testimoni, dan nilai jual (AI, Gamifikasi, Neo-Brutalism).
3. **Preview Edukasi:** Membaca artikel finansial publik dasar (jika ada).
4. **Call-to-Action (CTA):** Mengklik tombol "Mulai Sekarang" atau "Daftar".
5. **Autentikasi:** Diarahkan ke halaman Register / Login untuk membuat akun.

---

## 2. Role: USER (Pengguna Terdaftar)
**Penjelasan Penting:**
User adalah target pengguna utama CEAMIS (Gen-Z, Mahasiswa, Fresh Graduate). Mereka memiliki akses penuh ke fitur manajemen keuangan pribadi, analisis AI, dan gamifikasi. Data User bersifat privat dan terisolasi.
- **Akses Sistem:** Akses penuh ke ranah personal (Dashboard privat).
- **Daftar Halaman/Modul yang Dapat Diakses:**
  - `/dashboard` (Ringkasan/Overview Keuangan)
  - `/dashboard/transactions` (Catat Transaksi Pemasukan/Pengeluaran)
  - `/dashboard/history` (Riwayat Transaksi)
  - `/dashboard/planning` (Perencanaan Keuangan/Target)
  - `/dashboard/debt` (Catatan Utang & Piutang)
  - `/dashboard/reports` (Laporan & Ekspor Data)
  - `/dashboard/education` (Modul Edukasi Finansial Lengkap)
  - `/dashboard/chatbot` (Asisten AI)
  - `/dashboard/warnings` (Sistem Peringatan AI)
  - `/dashboard/profile` (Profil Pengguna & Avatar)
- **Tujuan Utama:** Mengelola keuangan secara konsisten, mendapatkan literasi finansial dari AI, dan menikmati gamifikasi.

**Alur Pengguna (User Flow):**
1. **Login:** Masuk menggunakan email/password atau SSO (Google).
2. **Dashboard Utama:** Melihat rangkuman saldo, pengeluaran bulan ini, *streak*, dan level saat ini.
3. **Pencatatan Keuangan:** Menambahkan data transaksi (Pemasukan / Pengeluaran) secara manual atau via fitur cerdas.
4. **Menerima AI Insights:** Membaca peringatan jika boros (Warning System), rekomendasi penghematan (XAI), atau ngobrol dengan Chatbot AI.
5. **Eksplorasi Edukasi:** Membaca modul Edukasi keuangan untuk meningkatkan XP.
6. **Gamifikasi & Laporan:** Mendapatkan *Badge*, melihat *Leaderboard*, dan mengekspor Laporan Keuangan.
7. **Pengaturan:** Mengganti foto profil, mengelola profil, atau Logout.

---

## 3. Role: ADMIN (Administrator Sistem)
**Penjelasan Penting:**
Admin adalah pengelola dan pengawas di balik layar platform CEAMIS. Admin tidak menggunakan aplikasi untuk mencatat keuangan pribadi, melainkan untuk menjaga sistem tetap berjalan baik, memoderasi konten, dan mengawasi analitik.
- **Akses Sistem:** Memiliki *Admin Panel* khusus yang benar-benar terpisah dari dashboard pengguna biasa. Akses penuh ke ranah manajerial dan *back-office*.
- **Daftar Halaman/Modul yang Dapat Diakses:**
  - `/admin/dashboard` (Statistik & Analitik Global Sistem)
  - `/admin/users` (Manajemen Daftar Akun User, Suspend/Banned)
  - `/admin/content` (Pengaturan Banner, Pengumuman, dan Tips Dinamis di Dashboard User)
  - `/admin/education` (CRUD: Menambah, Mengedit, Menghapus Artikel Edukasi)
  - `/admin/gamification` (Pengaturan XP, Logika Naik Level, dan Daftar Badge)
  - `/admin/ai-logs` (Pemantauan Log Chatbot & Penggunaan API AI)
  - `/admin/settings` (Konfigurasi Global Aplikasi)
- **Tujuan Utama:** Mengelola pengguna, mengatur isi konten yang tampil di dashboard User, menambah modul edukasi, mengawasi metrik sistem, dan mengatur konfigurasi chatbot AI.

**Alur Pengguna (User Flow):**
1. **Admin Login:** Masuk melalui portal login khusus admin dengan kredensial tingkat tinggi.
2. **Admin Dashboard:** Melihat analitik platform secara keseluruhan (jumlah user aktif, transaksi harian sistem, error log).
3. **Manajemen Pengguna (User Management):** Melihat daftar User terdaftar, mereset password, atau melakukan *banned/suspend* jika ada pelanggaran.
4. **Manajemen Konten (Dashboard & Edukasi):** Mengatur isi konten yang tampil di Dashboard User (seperti tips harian, banner pengumuman), serta menulis/menghapus modul Edukasi.
5. **Manajemen Gamifikasi:** Mengubah parameter XP, membuat *Badge* baru, atau melihat *Leaderboard* keseluruhan.
6. **Monitoring AI:** Memeriksa log *prompt* Chatbot AI untuk memastikan bot berjalan dengan parameter yang aman dan tidak disalahgunakan.
7. **Pengaturan Sistem & Logout:** Mengubah parameter global aplikasi dan keluar dari panel.

---

## Ringkasan Interaksi Antar Role
- **Guest** membaca konten yang dipublikasikan oleh **Admin**.
- **Guest** mendaftar untuk berubah menjadi **User**.
- **User** berinteraksi dengan fitur inti (Keuangan & AI).
- **Admin** memantau aktivitas **User** secara agregat (anonim) dan secara langsung mengatur isi konten (Pengumuman, Banner, Modul Edukasi) yang akan dikonsumsi oleh **User** di Dashboard mereka.
