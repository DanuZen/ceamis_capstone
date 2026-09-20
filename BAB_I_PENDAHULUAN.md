# BAB I
# PENDAHULUAN

## A. Latar Belakang

Perkembangan teknologi informasi dan komunikasi yang pesat telah mengubah berbagai aspek kehidupan manusia, termasuk dalam pengelolaan keuangan pribadi (*personal financial management*). Bagi Generasi Z (Gen-Z), khususnya mahasiswa Universitas Negeri Padang (UNP) yang berada pada rentang usia 18 hingga 25 tahun, masa perkuliahan merupakan fase krusial dalam membangun kemandirian finansial. Namun, berdasarkan Survei Nasional Literasi dan Inklusi Keuangan (SNLIK) yang dirilis oleh Otoritas Jasa Keuangan (OJK), tingkat literasi keuangan masyarakat Indonesia—khususnya kelompok usia muda—masih menunjukkan ketimpangan yang signifikan jika dibandingkan dengan tingkat inklusi keuangan [SITASI: SNLIK OJK]. Hal ini mengindikasikan bahwa akses masyarakat terhadap layanan keuangan sudah tinggi, namun tidak diimbangi dengan pemahaman mendalam mengenai manajemen risiko dan perencanaan keuangan yang bijak.

Permasalahan utama yang dihadapi oleh mahasiswa dan anak muda saat ini umumnya bukan semata-mata disebabkan oleh keterbatasan pendapatan, melainkan oleh perilaku konsumtif dan ketidakmampuan dalam mengontrol impuls pengeluaran harian. Fenomena pengeluaran mikro yang tidak terencana seperti *latte factor* (pembelian kopi/jajanan rutin), *doom spending* (belanja impulsif akibat stres), serta dorongan *Fear of Missing Out* (FOMO) terhadap tren gaya hidup menjadi penyebab utama kebocoran finansial [SITASI: Perilaku Konsumtif Gen-Z]. Penggunaan aplikasi pencatat keuangan konvensional seringkali gagal mempertahankan kebiasaan (*habit building*) pengguna dalam jangka panjang karena proses pencatatan yang kaku, pasif, serta kurang memberikan umpan balik balasan (*feedback*) yang instan dan menarik.

Untuk mengatasi permasalahan tersebut, diperlukan sebuah sistem informasi manajemen keuangan yang proaktif, adaptif, dan mampu menarik minat pengguna melalui pendekatan yang sesuai dengan karakteristik Generasi Z. Penelitian Tugas Akhir ini bertujuan untuk merancang dan membangun sistem informasi keuangan personal yang diberi nama **CEAMIS** (*Control Every Awful Money Impulse System*). CEAMIS mengintegrasikan tiga pilar utama: teknologi Kecerdasan Buatan (*Artificial Intelligence* / AI), gamifikasi (*gamification*), dan edukasi adaptif. 

Sistem ini dikembangkan menggunakan arsitektur berbasis *microservices* yang memisahkan antarmuka pengguna berbasis Next.js, backend utama berbasis NestJS, serta *microservice* AI terpisah berbasis FastAPI (Python). Penerapan model *Machine Learning* dan *Deep Learning* pada CEAMIS memungkinkan sistem untuk menghitung Skor Kesehatan Finansial (*Financial Health Score*), mengelompokkan pola pengeluaran (*Spending Pattern Cluster*), mengklasifikasikan profil risiko (*Risk Profile Classifier*), serta memberikan notifikasi peringatan interaktif melalui *Gen-Z Warning System* dan asisten AI personal (CAMI). Penggunaan elemen gamifikasi seperti *streak* harian, poin pengalaman (XP), level, dan lencana (*badge*) diharapkan dapat meningkatkan retensi pengguna dan membentuk kedisiplinan finansial secara berkelanjutan.

Melalui penelitian ini, diharapkan aplikasi web CEAMIS dapat menjadi solusi inovatif dalam meningkatkan literasi dan kesehatan finansial mahasiswa Universitas Negeri Padang serta Generasi Z secara umum, sekaligus menjadi kontribusi nyata dalam penerapan teknologi rekayasa perangkat lunak dan kecerdasan buatan di Departemen Teknik Elektronika, Fakultas Teknik, Universitas Negeri Padang.

---

## B. Rumusan Masalah

Berdasarkan latar belakang di atas, maka rumusan masalah dalam penelitian Tugas Akhir ini adalah:
1. Bagaimana menganalisis dan merancang arsitektur sistem informasi manajemen keuangan personal (CEAMIS) berbasis *microservices* yang dapat mengintegrasikan antarmuka web, backend API, dan layanan *Machine Learning* secara responsif?
2. Bagaimana mengimplementasikan model kecerdasan buatan (*Artificial Intelligence*) untuk menghitung Skor Kesehatan Finansial, mendeteksi klaster pola pengeluaran, mengklasifikasi profil risiko, serta menyediakan layanan *chatbot* keuangan personal?
3. Bagaimana menerapkan fitur *Gen-Z Warning System* dan elemen gamifikasi (XP, *streak*, *badge*) pada aplikasi web CEAMIS guna meningkatkan retensi dan kontrol impuls pengeluaran pengguna?

---

## C. Tujuan Penelitian

Tujuan dari pelaksanaan penelitian Tugas Akhir ini adalah:
1. Merancang arsitektur sistem informasi manajemen keuangan personal CEAMIS berbasis *microservices* menggunakan *framework* Next.js, NestJS, FastAPI, dan basis data Supabase PostgreSQL.
2. Mengembangkan dan mengintegrasikan model *Machine Learning* dan *Deep Learning* untuk analisis kesehatan finansial, pengelompokan pola gaya hidup pengeluaran, serta asisten *chatbot* interaktif berbasis Generative AI.
3. Membangun aplikasi web CEAMIS lengkap dengan fitur *Gen-Z Warning System*, modul edukasi finansial adaptif, serta elemen gamifikasi untuk mendorong perubahan perilaku finansial pengguna yang positif.

---

## D. Manfaat Penelitian

Penelitian ini diharapkan dapat memberikan manfaat sebagai berikut:
1. **Bagi Mahasiswa dan Pengguna (Gen-Z):**
   * Membantu meningkatkan kesadaran dan kontrol diri terhadap pengeluaran impulsif melalui visualisasi data dan peringatan dini yang interaktif.
   * Memberikan wadah pembelajaran finansial yang menyenangkan melalui modul edukasi adaptif dan mekanik gamifikasi.
2. **Bagi Akademisi dan Institusi (Universitas Negeri Padang):**
   * Menjadi rujukan ilmiah dan referensi akademis dalam penerapan arsitektur *microservices*, integrasi *Machine Learning* pada aplikasi web, serta penerapan *gamification design* di Program Studi S1 Informatika, Departemen Teknik Elektronika.
3. **Bagi Pengembang Perangkat Lunak:**
   * Memberikan gambaran praktis mengenai integrasi *framework* Next.js (App Router), NestJS, Prisma ORM, dan FastAPI dalam membangun platform web modern berkinerja tinggi.

---

## E. Batasan Masalah

Agar penelitian ini dapat berjalan secara terfokus dan sesuai dengan sasaran yang ditetapkan, maka batasan masalah dalam Tugas Akhir ini adalah:
1. **Bentuk Sistem:** Aplikasi dikembangkan dalam bentuk aplikasi web (*web-based application*) yang responsif (*mobile-friendly*) menggunakan *framework* Next.js (Frontend), NestJS (Backend API), dan FastAPI (AI Microservice).
2. **Objek dan Target Pengguna:** Target pengujian dan analisis difokuskan pada mahasiswa Universitas Negeri Padang (UNP) dan kelompok umur Generasi Z (usia 18–25 tahun).
3. **Fitur Kecerdasan Buatan (AI):** Layanan AI dibatasi pada 4 fungsi utama: (a) Kalkulasi *Financial Health Score* berbasis Deep Learning, (b) Pengelompokan *Spending Pattern Cluster*, (c) Klasifikasi *Risk Profile*, dan (d) Asisten *Chatbot* CAMI (terintegrasi Google Gemini 1.5 Flash API dan Groq API).
4. **Pencatatan Keuangan:** Transaksi dilakukan melalui input pencatatan mandiri (*manual logging*) oleh pengguna serta *digital ledger* pencatatan utang-piutang. Sistem tidak terhubung langsung dengan *API core banking*, bank riil, maupun dompet digital (*e-wallet*).
5. **Keamanan & Basis Data:** Penyimpanan data menggunakan Supabase PostgreSQL dengan arsitektur *multi-schema* (`auth` dan `public`) serta *Row Level Security* (RLS).

---

## F. Sistematika Penulisan

Sistematika penulisan laporan Tugas Akhir ini disusun secara runtut dalam beberapa bab sebagai berikut:

* **BAB I PENDAHULUAN**  
  Berisi latar belakang masalah, rumusan masalah, tujuan penelitian, manfaat penelitian, batasan masalah, dan sistematika penulisan laporan.

* **BAB II LANDASAN TEORI**  
  Memuat kajian pustaka dan teori-teori pendukung yang melandasi penelitian, mencakup konsep Sistem Informasi, Manajemen Keuangan Personal, *Artificial Intelligence*, *Machine Learning*, Gamifikasi, serta *tech stack* yang digunakan (Next.js, NestJS, FastAPI, Supabase PostgreSQL, Prisma ORM, dan *Neo-Brutalisme UI Design*).

* **BAB III ANALISIS DAN PERANCANGAN SISTEM**  
  Menjelaskan tahapan analisis kebutuhan sistem (fungsional dan non-fungsional), analisis data sintetis, perancangan arsitektur sistem, perancangan alur proses (flowchart/activity diagram), perancangan basis data (ERD), serta perancangan antarmuka pengguna (UI).

* **BAB IV IMPLEMENTASI DAN PENGUJIAN SISTEM** *(Bagian Lanjutan)*  
  Menjelaskan tahap pengkodan (*coding*), konfigurasi lingkungan kerja, hasil antarmuka sistem yang dibangun, serta hasil pengujian sistem (pengujian fungsional *black-box* dan pengujian akurasi model AI).

* **BAB V PENUTUP** *(Bagian Lanjutan)*  
  Berisi kesimpulan akhir dari hasil penelitian yang telah dilaksanakan serta saran-saran untuk pengembangan sistem CEAMIS lebih lanjut di masa mendatang.
