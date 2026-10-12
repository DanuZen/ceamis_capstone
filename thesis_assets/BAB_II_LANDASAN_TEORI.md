# BAB II
# LANDASAN TEORI

## 2.1 Sistem Informasi dan Kecerdasan Buatan

Sistem informasi dapat dipahami sebagai sistem kerja (*work system*) yang proses dan aktivitasnya ditujukan untuk mengolah informasi, yaitu menangkap, mengirimkan, menyimpan, mengambil, memanipulasi, dan menampilkan informasi (Alter, 2008). Dalam pandangan ini, sistem tersebut melibatkan partisipan manusia dan/atau mesin yang menggunakan informasi dan teknologi untuk menghasilkan produk atau layanan informasional bagi pelanggannya (Alter, 2008). Dalam konteks aplikasi berbasis data seperti sistem yang dikembangkan pada penelitian ini, sistem informasi tidak hanya berfungsi sebagai pencatat transaksi, tetapi juga sebagai sarana penyampaian informasi yang telah diolah menjadi bentuk yang relevan dan tepat waktu bagi pengguna dalam mengambil keputusan finansial.

Seiring berkembangnya kompleksitas kebutuhan pengolahan data, sistem informasi modern semakin banyak diintegrasikan dengan kecerdasan buatan (*Artificial Intelligence*/AI). Kecerdasan buatan secara umum dipahami sebagai simulasi kecerdasan manusia oleh sistem atau mesin, dengan tujuan membangun mesin yang mampu meniru perilaku manusia seperti mempersepsi, bernalar, belajar, merencanakan, dan memprediksi (Xu dkk., 2021). *Machine learning* (pembelajaran mesin), sebagai salah satu cabang utama AI, memungkinkan sistem belajar dari contoh data tanpa harus diprogram secara manual untuk setiap kemungkinan masukan, sehingga dapat dipakai untuk mengategorikan dan memprediksi data baru (Xu dkk., 2021).

Kombinasi antara sistem informasi dan kecerdasan buatan inilah yang menjadi dasar konseptual sistem yang dikembangkan pada penelitian ini: sebuah sistem informasi keuangan personal yang tidak hanya mencatat transaksi secara pasif, tetapi memanfaatkan kemampuan *machine learning* untuk mempelajari pola transaksi personal pengguna dan memberikan prediksi risiko sebelum keputusan pembelian diambil.

---

## 2.2 Pengeluaran Tidak Terencana dan Intervensi Berbasis Konteks

Pengeluaran tidak terencana dapat dipahami sebagai transaksi yang dilakukan di luar rencana anggaran yang telah ditetapkan sebelumnya oleh individu. Berbeda dengan konsep "impulsif" yang merupakan konstruk psikologis dan memerlukan instrumen pengukuran tervalidasi untuk mengidentifikasinya, status "tidak terencana" pada penelitian ini bersifat operasional, ditentukan langsung oleh konfirmasi pengguna setelah keputusan pembelian diambil, bukan melalui asumsi maupun penilaian sepihak sistem. Perbedaan kedua konsep tersebut dirangkum pada Tabel 2.1.

**Tabel 2.1 Perbedaan Pengeluaran Tidak Terencana dan Pembelian Impulsif**

| Aspek | Pengeluaran tidak terencana (penelitian ini) | Pembelian impulsif |
|:---|:---|:---|
| Sifat konsep | Label operasional | Konstruk psikologis |
| Dasar penentuan | Konfirmasi pengguna sendiri setelah keputusan pembelian diambil | Instrumen pengukuran yang tervalidasi |
| Peran sistem | Tidak berasumsi atau menilai secara sepihak | Tidak dicakup dalam penelitian ini |
| Implikasi bagi pengguna | Tidak menilai kondisi psikologis individu | Berkaitan dengan penilaian aspek psikologis |

*Sumber: disusun penulis*

Salah satu pendekatan yang relevan untuk merancang intervensi yang bekerja pada momen pengambilan keputusan adalah *Just-in-Time Adaptive Intervention* (JITAI). Hsu dkk. (2025) menggambarkan JITAI sebagai pendekatan yang dirancang untuk memberikan dukungan yang tepat pada waktu yang tepat dengan menyesuaikan diri terhadap perubahan kondisi dan konteks individu, dan tinjauan mereka dibatasi pada JITAI yang memanfaatkan teknologi kesehatan bergerak (*mobile health*/mHealth). Berbeda dengan intervensi statis yang diberikan secara seragam kepada seluruh pengguna, JITAI menyesuaikan dukungan yang diberikan dengan perubahan kondisi dan konteks individu (Hsu dkk., 2025). Kajian tinjauan pustaka (*scoping review*) yang dilakukan Hsu dkk. (2025) terhadap berbagai penerapan JITAI pada domain kesehatan mencakup 62 JITAI, dengan sebagian besar studi (71%) bertujuan menilai kelayakan (*feasibility*), penerimaan, atau kebergunaan. Uji acak terkontrol pada tinjauan tersebut menunjukkan bahwa intervensi yang disesuaikan bersifat efikasius, meskipun hasilnya bervariasi menurut jenis perilaku yang menjadi target.

Prinsip JITAI inilah yang diadaptasi pada penelitian ini ke domain keuangan personal: alih-alih menunggu transaksi tercatat lalu memberi tahu pengguna secara reaktif, sistem melakukan pemeriksaan pada titik keputusan itu sendiri, yaitu sesaat sebelum transaksi benar-benar dilakukan (*pre-purchase check*), sehingga pengguna masih memiliki kesempatan untuk merefleksikan keputusannya sebelum dampaknya terjadi secara nyata pada anggaran. Alur konseptual penerapan prinsip tersebut pada penelitian ini ditunjukkan pada Gambar 2.1.

**Gambar 2.1 Alur Konseptual *Just-in-Time Adaptive Intervention* pada Pemeriksaan Pra-Pembelian**

> **[RUANG GAMBAR 2.1]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: alur dari konteks pengguna (pola transaksi, anggaran, waktu), penilaian risiko oleh sistem, intervensi berupa peringatan beserta penjelasan, hingga respons pengguna dan konfirmasi pasca-keputusan.

*Sumber: disusun penulis dengan merujuk pada Hsu dkk. (2025)*

---

## 2.3 Model Prediksi Risiko

### 2.3.1 Klasifikasi dalam Pembelajaran Mesin

Klasifikasi merupakan salah satu tugas utama dalam *supervised learning* (pembelajaran terarah), yaitu proses membangun model yang mampu memetakan sekumpulan fitur input ke dalam kategori atau label keluaran tertentu berdasarkan pola yang dipelajari dari data historis yang telah diberi label. Dalam konteks penelitian ini, tugas klasifikasi yang dimaksud adalah memprediksi apakah sebuah rencana pembelian berpotensi menjadi pengeluaran tidak terencana (kelas positif) atau sesuai dengan pola pengeluaran wajar pengguna (kelas negatif), berdasarkan fitur-fitur yang diekstraksi dari konteks transaksi saat itu.

### 2.3.2 *Logistic Regression*

*Logistic regression* adalah salah satu algoritma klasifikasi biner paling mendasar dan banyak digunakan dalam masalah prediksi risiko finansial. Algoritma ini memodelkan probabilitas suatu peristiwa (misalnya, probabilitas sebuah transaksi tergolong tidak terencana) sebagai fungsi logistik dari kombinasi linear variabel-variabel prediktor, menghasilkan keluaran probabilitas antara 0 dan 1 yang kemudian dapat diklasifikasikan berdasarkan ambang batas tertentu. Keunggulan utama *logistic regression* terletak pada interpretabilitasnya: koefisien setiap variabel prediktor dapat langsung diartikan sebagai besarnya kontribusi variabel tersebut terhadap peningkatan atau penurunan risiko, sehingga memudahkan penjelasan hasil prediksi kepada pengguna akhir.

Efektivitas *logistic regression* dalam konteks prediksi risiko finansial didukung oleh studi Seitshiro dan Govender (2024), yang membandingkan performa *logistic regression* dengan beberapa model *machine learning* lain untuk penilaian risiko kredit menggunakan data registri kredit perbankan komersial. Hasil penelitian tersebut menunjukkan bahwa model *logistic regression* justru mengungguli lima model *machine learning* yang dibandingkan pada nilai F1-score, akurasi, *Jaccard Index*, dan AUC, sekaligus mengonsumsi daya komputasi yang lebih rendah, menegaskan bahwa kesederhanaan model tidak selalu berarti performa yang lebih rendah, pada data registri kredit yang diteliti.

### 2.3.3 Model Berbasis Pohon Keputusan (*Random Forest*)

Berbeda dengan *logistic regression* yang mengasumsikan hubungan linear antara prediktor dan target, model berbasis pohon keputusan seperti *Random Forest* bekerja dengan membangun sejumlah besar pohon keputusan secara acak dari subset data dan fitur yang berbeda-beda, kemudian menggabungkan hasil prediksi seluruh pohon tersebut (melalui voting mayoritas untuk klasifikasi) untuk menghasilkan prediksi akhir yang lebih stabil dan tahan terhadap *overfitting*. Pendekatan ini memungkinkan model menangkap hubungan non-linear dan interaksi kompleks antarfitur yang mungkin tidak dapat ditangkap oleh model linear sederhana. Perbedaan cara kerja *logistic regression* dan *Random Forest* diilustrasikan pada Gambar 2.2.

**Gambar 2.2 Ilustrasi Cara Kerja *Logistic Regression* dan *Random Forest***

> **[RUANG GAMBAR 2.2]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: kurva sigmoid yang memetakan kombinasi linear fitur menjadi probabilitas 0 sampai 1 dengan ambang keputusan, berdampingan dengan ensambel beberapa pohon keputusan yang hasilnya digabung melalui voting mayoritas.

*Sumber: ilustrasi konseptual disusun penulis*

Penerapan *Random Forest* pada data finansial di konteks Indonesia ditunjukkan oleh Surya dkk. (2025) dalam memprediksi kapabilitas calon debitur pada perusahaan pembiayaan kendaraan bermotor. Penelitian tersebut menggunakan 28 parameter data debitur (termasuk *credit scoring*, gaji, jumlah kredit aktif, dan usia) dengan teknik SMOTE untuk menangani ketidakseimbangan kelas, dan menunjukkan bahwa *Random Forest* mampu mencapai akurasi 69%, lebih tinggi dibandingkan LightGBM (59%) dan XGBoost (39%) pada kasus tersebut, meskipun akurasi absolut tersebut tergolong moderat. Sementara itu, Siswara dkk. (2024) membandingkan arsitektur berbasis *Recurrent Neural Network* (RNN) dengan *Random Forest* dan XGBoost pada deteksi dini *crash* pasar saham ASEAN-5. Data yang secara alamiah tidak seimbang (*imbalanced*) ditangani dengan SMOTE-ENN, dan kinerja dievaluasi menggunakan *false alarm rate*, *hit rate*, *balanced accuracy*, serta skor *precision-recall curve* (PRC). Studi tersebut menemukan bahwa arsitektur berbasis RNN mengungguli *Random Forest* dan XGBoost, sedangkan penerapan SMOTE-ENN meningkatkan kinerja secara substansial dibandingkan model tanpa *resampling*. Strategi penanganan ketidakseimbangan kelas dan rangkaian metrik tersebut relevan dan diadaptasi pada penelitian ini mengingat karakteristik data pengeluaran tidak terencana yang secara alamiah juga tidak seimbang (kejadian tidak terencana jauh lebih jarang dibandingkan transaksi wajar). Hasil studi itu juga menunjukkan bahwa model berbasis pohon tidak selalu unggul antardomain, sehingga pemilihan model pada penelitian ini dilakukan secara empiris melalui perbandingan terhadap *baseline*.

### 2.3.4 Perbandingan Karakteristik Model

Tabel 2.2 merangkum perbandingan karakteristik ketiga pendekatan yang menjadi kandidat model pada penelitian ini, sebagai dasar pertimbangan pemilihan model yang akan dievaluasi lebih lanjut pada BAB III dan BAB IV.

**Tabel 2.2 Perbandingan Karakteristik Model Prediksi Risiko**

| Aspek | Ambang Anggaran Statis (*Baseline*) | *Logistic Regression* | *Random Forest*/*Gradient Boosting* |
|:---|:---|:---|:---|
| Prinsip kerja | Aturan tetap (misal: peringatan jika >X% sisa anggaran) | Fungsi logistik dari kombinasi linear fitur | Voting/agregasi banyak pohon keputusan |
| Personalisasi | Tidak ada (sama untuk semua pengguna) | Dapat dipersonalisasi lewat fitur ternormalisasi per pengguna | Dapat dipersonalisasi, menangkap pola individual lebih kompleks |
| Interpretabilitas | Tinggi (aturan eksplisit) | Tinggi (koefisien dapat dijelaskan langsung) | Sedang (perlu teknik tambahan seperti *feature importance*) |
| Kemampuan menangkap non-linearitas | Tidak ada | Terbatas | Tinggi |
| Risiko *overfitting* pada data terbatas | Tidak relevan (bukan model yang dilatih) | Rendah | Lebih tinggi jika data pelatihan sedikit |
| Kebutuhan data pelatihan | Tidak perlu | Relatif sedikit | Relatif lebih banyak |
| Peran dalam penelitian ini | Pembanding wajib (mengukur nilai tambah model AI) | Kandidat utama (keseimbangan interpretabilitas & performa) | Kandidat pembanding (menguji apakah kompleksitas tambahan sepadan dengan peningkatan performa) |

Pemilihan ketiga pendekatan ini sebagai objek perbandingan sejalan dengan RM2 penelitian, yaitu mengukur seberapa baik model personal dapat mengidentifikasi pengeluaran tidak terencana dibandingkan pendekatan ambang anggaran statis konvensional, menggunakan metrik *precision*, *recall*, F1-score, PR-AUC, kalibrasi, dan tingkat *false-alert*.

### 2.3.5 Metrik Evaluasi Model

Kinerja model dievaluasi sebagai klasifikasi biner dengan pengeluaran tidak terencana sebagai kelas positif. Metrik dihitung dari empat komponen hasil klasifikasi, yaitu *true positive* (TP), *false positive* (FP), *true negative* (TN), dan *false negative* (FN). Studi deteksi dini pada data tidak seimbang yang dilakukan Siswara dkk. (2024) memakai rangkaian metrik serupa, yaitu *false alarm rate*, *hit rate*, *balanced accuracy*, dan skor *precision-recall curve*. Tabel 2.3 merangkum metrik yang digunakan pada penelitian ini.

**Tabel 2.3 Metrik Evaluasi Model Prediksi Risiko**

| Metrik | Definisi atau rumus | Makna pada penelitian ini |
|:---|:---|:---|
| *Precision* | TP / (TP + FP) | Proporsi peringatan yang benar-benar merupakan pengeluaran tidak terencana |
| *Recall* (*hit rate*) | TP / (TP + FN) | Proporsi pengeluaran tidak terencana yang berhasil terdeteksi |
| *F1-score* | 2 × *Precision* × *Recall* / (*Precision* + *Recall*) | Rata-rata harmonik *precision* dan *recall* |
| PR-AUC | Luas area di bawah kurva *precision-recall* | Ringkasan kinerja pada seluruh ambang keputusan |
| *Balanced accuracy* | (*Recall* + *Specificity*) / 2, dengan *Specificity* = TN / (TN + FP) | Kemampuan mendeteksi kedua kelas tanpa didominasi kelas mayoritas |
| Tingkat *false-alert* | FP / (FP + TN) | Proporsi transaksi wajar yang diberi peringatan |
| Kalibrasi | Kesesuaian antara probabilitas prediksi dan frekuensi kejadian sebenarnya | Menentukan apakah skor risiko dapat ditafsirkan sebagai probabilitas |

*Sumber: disusun penulis*

Akurasi dan *F1-score* dapat memberikan hasil yang terlalu optimistis pada data tidak seimbang (Chicco & Jurman, 2020), sehingga *F1-score* tidak dipakai sendirian dan selalu dilaporkan bersama metrik lain pada Tabel 2.3.

---

## 2.4 Indikator Kesehatan Finansial (*Financial Health Score*)

Selain fitur inti pemeriksaan pra-pembelian, sistem ini juga menyediakan indikator kesehatan finansial sederhana sebagai fitur Pendukung yang memberikan gambaran ringkas kondisi keuangan pengguna secara keseluruhan. Konsep ini terinspirasi dari kerangka *FinHealth Score®* yang dikembangkan oleh Financial Health Network (2015), sebuah metodologi pengukuran kesehatan finansial yang menilai kondisi keuangan individu berdasarkan empat pilar utama sebagaimana ditunjukkan pada Gambar 2.3: *Spend* (pola pengeluaran relatif terhadap pendapatan), *Save* (kemampuan menabung dan mencapai tujuan tabungan jangka panjang), *Borrow* (kemampuan mengelola utang), dan *Plan* (kesiapan menghadapi risiko finansial di masa depan). Skor yang dihasilkan berkisar antara 0 hingga 100, dengan kategorisasi: skor 0–39 tergolong "*Financially Vulnerable*" (rentan), skor 40–79 tergolong "*Financially Coping*" (bertahan), dan skor 80–100 tergolong "*Financially Healthy*" (sehat).

**Gambar 2.3 Empat Pilar FinHealth Score®**

![Empat Pilar FinHealth Score](figures/gambar_2_1_finhealth.svg)

*Sumber: diadaptasi dari Financial Health Network (2015) dan UNSGSA (2021)*

Sebagai pembanding konseptual, *UNSGSA Financial Health Working Group* (2021) mendefinisikan kesehatan finansial melalui empat elemen utama: kelancaran pengelolaan keuangan sehari-hari, ketahanan (*resilience*) terhadap guncangan finansial, kemajuan menuju pencapaian tujuan jangka panjang, serta rasa aman dan kendali atas kondisi keuangan pribadi. Rumusan ini selaras secara konseptual dengan empat pilar FinHealth Score®, terutama pada aspek pengelolaan pengeluaran sehari-hari dan kesiapan menghadapi risiko.

Pada penelitian ini, indikator kesehatan finansial merupakan formula rancangan penulis yang terinspirasi dari struktur pilar dan kategori tersebut, bukan implementasi *FinHealth Score®*. Indikator ini tidak diimplementasikan sebagai model kecerdasan buatan yang dilatih dari data, melainkan disederhanakan menjadi formula berbasis rasio finansial (seperti rasio kebutuhan terhadap pendapatan, rasio keinginan terhadap pendapatan, dan rasio tabungan terhadap pendapatan) yang dihitung secara langsung dari data transaksi dan anggaran pengguna. Penyederhanaan ini mengikuti struktur ambang kategori pada kerangka rujukan di atas: skor 80–100 dikategorikan "Sehat"/"Hemat", skor 40–79 dikategorikan "Waspada", dan skor 0–39 dikategorikan "Boros", sehingga tetap memberikan interpretasi yang mudah dipahami pengguna tanpa menambah kompleksitas pengembangan model pembelajaran mesin tambahan di luar fitur inti pra-pembelian yang menjadi fokus utama penelitian ini. Skema perhitungan dan kategori indikator tersebut diringkas pada Gambar 2.4.

**Gambar 2.4 Skema Indikator Kesehatan Finansial Berbasis Rasio**

> **[RUANG GAMBAR 2.4]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: tiga rasio finansial (kebutuhan terhadap pendapatan, keinginan terhadap pendapatan, dan tabungan terhadap pendapatan) yang diolah menjadi skor 0 sampai 100 beserta kategori Sehat/Hemat (80-100), Waspada (40-79), dan Boros (0-39).

*Sumber: disusun penulis, dengan struktur kategori yang mengacu pada Financial Health Network (2015)*

---

## 2.5 Fitur Pendukung Lain

### 2.5.1 *Optical Character Recognition* (OCR) untuk Pemindaian Struk

*Optical Character Recognition* (OCR) adalah teknologi yang memungkinkan konversi teks dari gambar atau dokumen hasil pindai menjadi data digital yang dapat diolah komputer. Dalam konteks aplikasi keuangan personal, OCR dimanfaatkan untuk mengekstraksi informasi transaksi (nominal, tanggal, nama merchant) dari foto struk belanja, sehingga mengurangi kebutuhan pencatatan manual oleh pengguna.

Widiantara dkk. (2024) menerapkan *Bidirectional Long Short-Term Memory* (Bi-LSTM) untuk mengekstraksi informasi dari struk belanja setelah tahap OCR. Data yang dipakai berasal dari dataset CORD (*Consolidated Receipt Dataset for Post-OCR Parsing*) dan foto struk yang diambil dengan ponsel, dengan tahapan pra-pemrosesan citra, ekstraksi teks menggunakan OCR, pra-pemrosesan teks, pelabelan, serta pelatihan dan evaluasi model memakai *confusion matrix*. Mereka melaporkan akurasi, *precision*, dan *recall* masing-masing sebesar 95%, dengan latar bahwa pengambilan informasi struk secara manual rentan kesalahan dan memakan waktu, padahal struk berguna untuk pelacakan pengeluaran dan pelaporan keuangan. Fokus studi tersebut adalah akurasi ekstraksi informasi, bukan pemanfaatannya untuk memprediksi risiko pengeluaran.

Pada penelitian ini, OCR diposisikan sebagai fitur Pendukung yang mempercepat proses pencatatan transaksi, bukan sebagai mekanisme inti yang menjadi fokus evaluasi ilmiah. Alur pemindaian struk pada penelitian ini ditunjukkan pada Gambar 2.5.

**Gambar 2.5 Alur Pemindaian Struk Belanja dengan OCR**

> **[RUANG GAMBAR 2.5]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: alur dari foto struk, ekstraksi teks dengan OCR, ekstraksi informasi transaksi (nominal, tanggal, nama merchant), pencatatan transaksi, hingga penghapusan foto setelah masa retensi.

*Sumber: disusun penulis*

### 2.5.2 Gamifikasi

Gamifikasi didefinisikan sebagai penerapan elemen desain permainan (seperti poin, lencana/*badge*, dan progres/*streak*) ke dalam konteks non-permainan, dengan tujuan mendorong motivasi dan keterlibatan pengguna. Khaldi dkk. (2023), dalam tinjauan pustaka sistematis mereka terhadap penerapan gamifikasi pada *e-learning* di pendidikan tinggi, menyatakan bahwa gamifikasi pada sistem pembelajaran secara umum dikenal berdampak positif terhadap motivasi, tetapi bukti efektivitasnya pada *e-learning* pendidikan tinggi masih beragam dan belum pasti. Mereka juga menegaskan bahwa memilih kombinasi elemen permainan yang tepat tetap menjadi tantangan karena belum ada pendekatan perancangan yang terbukti, dan tidak ada satu pendekatan yang berlaku untuk semua konteks (*no one-size-fits-all approach*). Temuan ini mendasari pemilihan elemen gamifikasi secara hati-hati dan terbatas pada penelitian ini.

Penerapan gamifikasi pada domain keuangan turut dibahas oleh Raza dkk. (2024), yang melalui survei terhadap 340 pelanggan dan eksperimen terhadap 161 pelanggan layanan perbankan seluler (*m-banking*) di Pakistan menemukan bahwa elemen gamifikasi berhubungan positif dengan pengalaman dan keterlibatan pelanggan, bahwa keterlibatan memediasi hubungan gamifikasi dengan niat beli, serta bahwa hadiah yang diberikan segera berpengaruh lebih kuat daripada hadiah yang tertunda. Selain itu, Bitrián dkk. (2021), yang dengan data 208 pengguna aplikasi Mint menemukan bahwa gamifikasi pada aplikasi manajemen keuangan personal meningkatkan motivasi otonom dan niat pengguna untuk memakai aplikasi tersebut. Konteks kedua studi berbeda dari penelitian ini: studi pertama berlangsung pada layanan perbankan seluler dengan niat beli sebagai luaran, sedangkan studi kedua berfokus pada adopsi aplikasi, sehingga keduanya digunakan sebagai gambaran dan bukan sebagai bukti efektivitas pada konteks penelitian ini. Temuan-temuan tersebut menjadi dasar bagi keputusan untuk tetap menyertakan elemen gamifikasi ringan pada sistem ini, berupa *streak* pencatatan transaksi dan lencana pencapaian sederhana, meskipun elemen kompetitif seperti papan peringkat (*leaderboard*) antarpengguna secara eksplisit tidak diikutsertakan, sejalan dengan kekhawatiran atas potensi tekanan sosial yang dapat ditimbulkannya pada konteks pengelolaan keuangan personal. Elemen yang digunakan dan tidak digunakan dirangkum pada Tabel 2.4.

**Tabel 2.4 Elemen Gamifikasi yang Digunakan dan Tidak Digunakan**

| Elemen | Status pada sistem | Pertimbangan |
|:---|:---|:---|
| Pencatatan berurutan (*streak*) | Digunakan | Bentuk keterlibatan ringan melalui konsistensi pencatatan transaksi |
| Lencana pencapaian sederhana | Digunakan | Umpan balik ringan atas pencapaian pengguna |
| Papan peringkat (*leaderboard*) | Tidak digunakan | Menghindari potensi tekanan sosial pada pengelolaan keuangan personal |

*Sumber: disusun penulis dengan merujuk pada Khaldi dkk. (2023)*

---

## 2.6 Arsitektur Perangkat Lunak

Arsitektur perangkat lunak merujuk pada struktur fundamental suatu sistem, mencakup bagaimana komponen-komponennya diorganisasikan, bagaimana mereka berinteraksi satu sama lain, serta prinsip-prinsip yang menjadi dasar rancangan dan evolusi sistem tersebut. Pemilihan arsitektur yang tepat berdampak langsung pada kemudahan pengembangan, pemeliharaan, dan skalabilitas sistem di masa depan.

Arsitektur **monolitik** merupakan pendekatan tradisional di mana seluruh fungsionalitas aplikasi (mulai dari autentikasi, logika bisnis, hingga akses data) digabungkan ke dalam satu basis kode dan di-*deploy* sebagai satu unit tunggal. Pendekatan ini sederhana untuk dikembangkan pada tahap awal, tetapi dapat menyulitkan penskalaan ketika kompleksitas sistem bertambah. Sebagai respons atas keterbatasan tersebut, arsitektur **microservices** memecah aplikasi menjadi sekumpulan layanan kecil yang independen, masing-masing bertanggung jawab atas satu domain fungsional tertentu dan dapat di-*deploy* serta diskalakan secara terpisah.

Abgaz dkk. (2023), dalam tinjauan pustaka sistematis mereka terhadap 35 studi tentang dekomposisi aplikasi monolitik menjadi *microservices*, menyatakan bahwa arsitektur *microservices* berpotensi menghasilkan perangkat lunak yang skalabel, tangguh, dan gesit, tetapi dekomposisi monolit menjadi *microservices* merupakan proses yang rumit dan mahal, dan metode dekomposisi yang ada masih berada pada tahap awal. Berdasarkan gambaran tersebut, penelitian ini menalar bahwa pemisahan menjadi banyak layanan sejak awal belum tentu sesuai bagi pengembang tunggal dengan keterbatasan waktu, sehingga pendekatan *modular monolith*, yaitu satu kesatuan *deployment* dengan batas modul yang jelas, dipilih sebagai titik tengah. Penalaran mengenai kesesuaian *modular monolith* bagi pengembang tunggal merupakan argumen penulis; literatur hanya mendukung bahwa pola ini merupakan alternatif dan tahap awal sebelum *microservices* (Su & Li, 2024).

Di antara kedua pendekatan tersebut terdapat pola **modular monolith** (monolit modular), sebuah pendekatan yang tetap di-*deploy* sebagai satu unit tunggal seperti arsitektur monolitik, tetapi disusun secara internal ke dalam modul-modul yang terorganisir berdasarkan domain fungsional, masing-masing dengan batasan tanggung jawab yang jelas. Su dan Li (2024), melalui tinjauan literatur abu-abu sistematis terhadap 64 sumber, menyimpulkan bahwa *modular monolith* merupakan pola arsitektur yang menggabungkan keunggulan monolit dan *microservices*, dapat menjadi alternatif dari *microservices*, sekaligus dapat menjadi tahap sebelum sistem bermigrasi ke *microservices*. Al-Qora'n dan Al-Said Ahmad (2025) kemudian menyusun tinjauan pustaka sistematis pertama tentang *modular monolith* pada lingkungan *cloud* sebagai landasan konseptual bagi keputusan arsitektur *cloud-native*. Gambar 2.6 mengilustrasikan perbandingan ketiga pendekatan tersebut.

**Gambar 2.6 Perbandingan Arsitektur Monolitik, Modular Monolith, dan Microservices**

![Perbandingan Arsitektur Monolitik, Modular Monolith, dan Microservices](figures/gambar_2_2_arsitektur.svg)

*Sumber: disusun penulis dengan merujuk pada Abgaz dkk. (2023) dan Su dan Li (2024)*

Pada penelitian ini, arsitektur *modular monolith* dipilih sebagai dasar rancangan backend sistem, diimplementasikan sebagai satu aplikasi FastAPI dengan struktur folder modular (`auth/`, `transactions/`, `budgets/`, `pre_purchase/`, `risk_model/`, `admin/`). Keputusan ini didasarkan pada pertimbangan bahwa pemisahan backend menjadi beberapa aplikasi akan menggandakan beban pengembangan dan pemeliharaan tanpa manfaat skalabilitas yang sepadan, mengingat penelitian ini dikerjakan oleh pengembang tunggal dengan jumlah pengguna terbatas pada tahap uji coba lapangan. Perbandingan ketiga pendekatan arsitektur dirangkum pada Tabel 2.5.

**Tabel 2.5 Perbandingan Tiga Pendekatan Arsitektur Perangkat Lunak**

| Aspek | Monolitik | *Modular monolith* | *Microservices* |
|:---|:---|:---|:---|
| Unit *deployment* | Satu unit tunggal | Satu unit tunggal | Banyak layanan yang di-*deploy* dan diskalakan terpisah |
| Organisasi internal | Seluruh fungsi digabung dalam satu basis kode | Modul berbasis domain fungsional dengan batas tanggung jawab jelas | Setiap layanan bertanggung jawab atas satu domain fungsional |
| Dukungan literatur | Sederhana pada tahap awal, tetapi penskalaan dapat sulit saat kompleksitas bertambah | Menggabungkan keunggulan monolit dan *microservices*; alternatif sekaligus tahap sebelum migrasi (Su & Li, 2024) | Berpotensi skalabel, tangguh, dan gesit, tetapi dekomposisinya rumit dan mahal (Abgaz dkk., 2023) |
| Keputusan penelitian | Tidak dipilih | Dipilih sebagai dasar rancangan backend | Tidak dipilih |

*Sumber: disusun penulis dengan merujuk pada Abgaz dkk. (2023) dan Su dan Li (2024)*

---

## 2.7 Keamanan dan Privasi Data

Sistem yang menangani data transaksi finansial personal menghadapi risiko keamanan dan privasi yang lebih tinggi dibandingkan aplikasi pada umumnya, mengingat sensitifnya informasi yang dikelola, mulai dari pola pengeluaran, nominal transaksi, hingga potensi kebiasaan finansial pengguna. Kegagalan dalam mengamankan data semacam ini tidak hanya berisiko pada kebocoran privasi, tetapi juga dapat merusak kepercayaan pengguna terhadap sistem secara keseluruhan.

Zaki dkk. (2025) mengevaluasi praktik keamanan pada aplikasi pencatatan keuangan pribadi lokal Catatmak melalui wawancara semi-terstruktur dengan pengembang utama aplikasi. Hasilnya menunjukkan bahwa aplikasi tersebut menerapkan enkripsi transmisi (HTTPS/TLS), *login* berbasis *One-Time Password* (OTP), penyimpanan *cloud* terenkripsi, kontrol akses berbasis peran (*Role-Based Access Control*/RBAC), dan prinsip minimalisasi data (*data minimization*), yaitu hanya mengumpulkan data yang benar-benar diperlukan. Kerentanan terbesar justru berasal dari perilaku pengguna, seperti kata sandi lemah dan berbagi kode OTP, sehingga studi tersebut merekomendasikan autentikasi dua faktor (2FA), edukasi keamanan bagi pengguna, dan penerapan prinsip *Secure Software Development Lifecycle* (SDLC). Karena bersumber dari satu informan pengembang, temuan ini dipakai sebagai gambaran praktik pada aplikasi sejenis, bukan sebagai standar yang teruji.

Mengacu pada praktik tersebut serta pertimbangan perancangan penulis, mekanisme keamanan dan privasi yang diterapkan pada penelitian ini meliputi:

1. **Enkripsi komunikasi**: seluruh komunikasi antara aplikasi klien (mobile dan web) dengan backend diwajibkan menggunakan protokol HTTPS.
2. **Kontrol akses berbasis prinsip *least privilege***: administrator sistem tidak memiliki akses bebas untuk melihat data transaksi individual pengguna; setiap akses terhadap data sensitif memerlukan alasan yang tercatat melalui mekanisme *audit log*.
3. ***Consent* eksplisit**: persetujuan pengguna dikumpulkan secara eksplisit sebelum data mereka digunakan untuk keperluan evaluasi penelitian, khususnya bagi partisipan uji coba lapangan.
4. **Pseudonimisasi data partisipan riset**: data partisipan pada tahap evaluasi diidentifikasi menggunakan kode partisipan (*participant code*), bukan nama asli, untuk mengurangi risiko identifikasi langsung.
5. **Retensi data terbatas**: data sensitif seperti foto struk belanja (untuk keperluan OCR) disimpan dengan batas waktu retensi tertentu, bukan disimpan secara permanen tanpa batas.
6. **Hak akses data pengguna**: pengguna memiliki hak untuk melihat, mengoreksi, mengekspor, dan menghapus data pribadi mereka sendiri.

Penerapan prinsip-prinsip ini bertujuan memastikan bahwa manfaat prediksi personal yang ditawarkan sistem tidak mengorbankan hak privasi dan keamanan data pengguna, sejalan dengan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, yang antara lain memberikan hak kepada subjek data untuk memperoleh salinan data, mengakhiri pemrosesan dan menghapus data, serta menarik kembali persetujuan pemrosesan (Republik Indonesia, 2022).

---

## 2.8 Platform Pengembangan

Sistem dibangun menggunakan empat platform utama dengan peran yang berbeda, sebagaimana diringkas pada Gambar 2.7.

**Gambar 2.7 Peran Platform Pengembangan pada Sistem**

> **[RUANG GAMBAR 2.7]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: Flutter sebagai klien mobile untuk User, Next.js sebagai klien web untuk Admin, FastAPI sebagai backend monolit modular, dan PostgreSQL sebagai basis data, dengan komunikasi klien dan backend melalui HTTPS/REST.

*Sumber: disusun penulis*

Alasan pemilihan masing-masing platform dirangkum pada Tabel 2.6 dan diuraikan lebih lanjut pada subbab berikut.

**Tabel 2.6 Platform Pengembangan, Peran, dan Alasan Pemilihan**

| Platform | Peran pada sistem | Alasan pemilihan |
|:---|:---|:---|
| Flutter | Klien *mobile* untuk *User* | Satu basis kode untuk Android dan iOS serta pendekatan arsitektur yang fleksibel (Szczepanik & Kędziora, 2020) |
| FastAPI | Backend monolit modular | Satu ekosistem Python untuk API dan *pipeline* model, validasi data otomatis, dan dokumentasi API interaktif |
| Next.js | Klien web untuk *Admin* | Sesuai untuk dashboard administratif dengan tampilan data yang dinamis dan responsif |
| PostgreSQL | Basis data relasional | Integritas dan konsistensi data finansial melalui properti ACID |

*Sumber: disusun penulis*

### 2.8.1 Flutter (Aplikasi Mobile)

Flutter adalah *framework* pengembangan aplikasi *cross-platform* bersifat *open-source* yang dikembangkan oleh Google, memungkinkan pengembang membangun aplikasi dengan satu basis kode (*single codebase*) yang dapat berjalan pada berbagai platform, termasuk Android dan iOS, dengan performa mendekati aplikasi native karena dikompilasi langsung ke kode native. Szczepanik dan Kędziora (2020), dalam kajian mereka mengenai pendekatan manajemen *state* dan arsitektur perangkat lunak pada aplikasi Flutter lintas platform, menjelaskan bahwa Flutter, yang dibangun menggunakan bahasa pemrograman Dart, menawarkan sejumlah pendekatan arsitektur dan manajemen *state* yang dapat disesuaikan dengan kebutuhan kompleksitas aplikasi, mulai dari pendekatan sederhana hingga pola yang lebih terstruktur untuk aplikasi berskala besar. Karakteristik fleksibilitas arsitektur ini menjadikan Flutter pilihan yang sesuai untuk pengembangan aplikasi mobile pada penelitian ini, mengingat keterbatasan waktu dan sumber daya pengembang tunggal.

### 2.8.2 FastAPI (Backend)

FastAPI adalah *framework* backend berbasis Python yang dirancang untuk membangun *Application Programming Interface* (API) dengan performa tinggi, memanfaatkan dukungan asinkron (*asynchronous*) bawaan Python serta validasi data otomatis melalui pustaka Pydantic. Dukungan bawaan untuk dokumentasi API interaktif (melalui OpenAPI/Swagger) mempermudah proses pengembangan dan pengujian API secara iteratif, karakteristik yang relevan dengan pendekatan pengembangan iteratif dan inkremental yang digunakan pada penelitian ini (lihat subbab 2.9). Pemilihan FastAPI juga didasari pertimbangan bahwa ekosistem Python memungkinkan integrasi langsung antara logika API/CRUD dan pipeline model *machine learning* dalam satu basis kode yang sama, tanpa memerlukan komunikasi antarbahasa pemrograman yang terpisah.

### 2.8.3 Next.js (Dashboard Admin)

Next.js adalah *framework* berbasis React untuk pengembangan aplikasi web, menyediakan kemampuan *server-side rendering* dan optimisasi performa yang menjadikannya sesuai untuk pengembangan dashboard administratif yang membutuhkan tampilan data secara dinamis dan responsif. Pada penelitian ini, Next.js digunakan khusus untuk dashboard administrator (bukan untuk pengguna akhir), yang mencakup fungsi manajemen akun, konfigurasi sistem, dan panel evaluasi model.

### 2.8.4 PostgreSQL (Basis Data)

PostgreSQL adalah sistem manajemen basis data relasional (*Relational Database Management System*/RDBMS) bersifat *open-source* yang dikenal dengan keandalan, dukungan terhadap integritas data melalui properti ACID (*Atomicity, Consistency, Isolation, Durability*), serta fleksibilitas dalam menangani struktur data kompleks. Basis data ini dipilih untuk menyimpan seluruh entitas data sistem, termasuk transaksi, anggaran, hasil prediksi risiko, dan log audit, yang memerlukan konsistensi data yang tinggi mengingat sifatnya sebagai data finansial.

---

## 2.9 Metodologi Penelitian

### 2.9.1 *Design Science Research Methodology* (DSRM)

*Design Science Research Methodology* (DSRM) adalah kerangka metodologi penelitian yang berfokus pada perancangan dan evaluasi artefak (sistem, model, atau metode) sebagai kontribusi utama penelitian, dengan tujuan memecahkan masalah nyata sekaligus menghasilkan pengetahuan ilmiah yang dapat digeneralisasi. Peffers dkk. (2007) merumuskan DSRM ke dalam enam tahap: (1) identifikasi masalah dan motivasi, (2) definisi tujuan solusi, (3) desain dan pengembangan, (4) demonstrasi, (5) evaluasi, dan (6) komunikasi hasil. Kerangka ini dipilih sebagai payung metodologi utama penelitian karena penelitian ini menghasilkan artefak nyata (sistem peringatan dini) yang perlu dievaluasi secara empiris terhadap efektivitasnya, bukan sekadar diusulkan secara konseptual.

### 2.9.2 SDLC Iteratif dan Inkremental

Pada tahap ketiga DSRM (Desain dan Pengembangan), penelitian ini memilih model pengembangan perangkat lunak iteratif dan inkremental. Standar ISO/IEC/IEEE 12207:2026 tentang proses siklus hidup perangkat lunak (ISO/IEC/IEEE, 2026) menyediakan kerangka proses yang dapat diterapkan secara bersamaan, iteratif, dan rekursif pada sistem perangkat lunak serta secara inkremental pada elemen-elemennya, tetapi tidak mewajibkan model siklus hidup tertentu. Pemilihan model iteratif-inkremental dan pemetaannya ke proses pada standar tersebut merupakan keputusan penelitian ini. Pendekatan ini membagi pengembangan sistem ke dalam beberapa *increment* (penambahan bertahap), di mana setiap *increment* menghasilkan bagian fungsional sistem yang dapat diuji dan dievaluasi sebelum melanjutkan ke *increment* berikutnya. Pendekatan iteratif-inkremental dipilih alih-alih model *Waterfall* karena kebutuhan sistem berpotensi berubah seiring proses penelitian berlangsung, dan alih-alih *Scrum* formal karena penelitian ini dikerjakan oleh pengembang tunggal, bukan tim, sehingga elemen-elemen manajemen tim pada Scrum tidak sepenuhnya relevan.

### 2.9.3 CRISP-DM

Khusus pada *increment* yang berkaitan dengan pengembangan model prediksi risiko (Increment 3), penelitian ini mengadopsi *Cross-Industry Standard Process for Data Mining* (CRISP-DM) sebagai kerangka siklus pengembangan model. IBM (2026) mendeskripsikan CRISP-DM sebagai metodologi standar industri yang terdiri atas enam fase: *business understanding*, *data understanding*, *data preparation*, *modeling*, *evaluation*, dan *deployment*, dengan sifat siklikal yang memungkinkan iterasi kembali ke fase sebelumnya berdasarkan hasil evaluasi pada fase selanjutnya. CRISP-DM dipilih karena sifatnya yang teruji secara luas di industri untuk proyek data mining dan *machine learning*, serta strukturnya yang eksplisit memisahkan tahap pemahaman data dan evaluasi model, relevan dengan kebutuhan penelitian ini untuk memastikan model dievaluasi secara ketat terhadap *baseline* sebelum dianggap layak digunakan.

Ketiga kerangka metodologi di atas tidak berdiri sendiri-sendiri, melainkan bersifat bertingkat (*nested*): DSRM berfungsi sebagai payung metodologi penelitian secara keseluruhan, SDLC Iteratif-Inkremental mengatur siklus pengembangan sistem di dalam tahap Desain dan Pengembangan DSRM, dan CRISP-DM secara spesifik mengatur siklus pengembangan model AI di dalam *increment* yang relevan. Ringkasan ketiga kerangka tersebut disajikan pada Tabel 2.7.

**Tabel 2.7 Ringkasan Tiga Kerangka Metodologi Penelitian**

| Kerangka | Cakupan | Isi pokok | Rujukan |
|:---|:---|:---|:---|
| DSRM | Seluruh penelitian (payung metodologi) | Enam tahap: identifikasi masalah, definisi tujuan solusi, desain dan pengembangan, demonstrasi, evaluasi, dan komunikasi | Peffers dkk. (2007) |
| SDLC Iteratif dan Inkremental | Tahap desain dan pengembangan DSRM | Pengembangan bertahap dalam beberapa *increment* yang diuji dan dievaluasi sebelum *increment* berikutnya | Keputusan penelitian; kerangka proses (ISO/IEC/IEEE, 2026) |
| CRISP-DM | *Increment* 3 (model prediksi risiko) | Enam fase: *business understanding*, *data understanding*, *data preparation*, *modeling*, *evaluation*, dan *deployment* | IBM (2026) |

*Sumber: disusun penulis*

Gambar 2.8 mengilustrasikan proses DSRM secara lebih rinci, termasuk empat kemungkinan titik masuk penelitian (*entry points*) yang diidentifikasi Peffers dkk. (2007) serta mekanisme umpan balik (*feedback loop*) dari tahap evaluasi kembali ke tahap desain dan pengembangan.

**Gambar 2.8 Proses DSRM dengan Empat Titik Masuk Penelitian**

![Proses DSRM](figures/gambar_2_3_dsrm.svg)

*Sumber: diadaptasi dari Peffers dkk. (2007)*

Sementara itu, Gambar 2.9 menunjukkan representasi siklikal resmi CRISP-DM, di mana "Data" ditempatkan sebagai pusat yang dirujuk oleh keenam fase, dan sifat siklikalnya memungkinkan iterasi kembali ke fase sebelumnya berdasarkan hasil evaluasi, relevan dengan proses perbandingan model *Logistic Regression* vs *Random Forest*/GBM terhadap *baseline* pada Increment 3 penelitian ini.

**Gambar 2.9 Siklus CRISP-DM**

![Siklus CRISP-DM](figures/gambar_2_4_crispdm.svg)

*Sumber: diadaptasi dari IBM (2026)*

### 2.9.4 Standar Kualitas Sistem ISO/IEC 25010:2023

Sebagai bagian dari tahap Evaluasi DSRM, kualitas sistem yang dihasilkan diukur menggunakan standar ISO/IEC 25010:2023 tentang model kualitas produk dalam seri *Systems and software Quality Requirements and Evaluation* (SQuaRE) (ISO, 2023). Model kualitas produk pada edisi 2023 terdiri atas sembilan karakteristik sebagaimana ditunjukkan pada Gambar 2.10: *functional suitability*, *performance efficiency*, *compatibility*, *interaction capability* (sebelumnya *usability*), *reliability*, *security*, *maintainability*, *flexibility* (sebelumnya *portability*), dan *safety*, yang menjadi acuan objektif dalam menilai apakah sistem yang dikembangkan memenuhi kriteria kualitas perangkat lunak yang diakui secara internasional, melengkapi evaluasi fungsional dan performa model prediksi risiko yang menjadi fokus utama penelitian.

**Gambar 2.10 Sembilan Karakteristik Kualitas ISO/IEC 25010:2023**

![Sembilan Karakteristik Kualitas ISO/IEC 25010](figures/gambar_2_5_iso25010.svg)

*Sumber: diadaptasi dari ISO (2023)*

---

## 2.10 Penelitian Relevan

Tabel 2.8 merangkum penelitian-penelitian terdahulu yang relevan dengan penelitian ini, mencakup domain intervensi finansial berbasis konteks, pengelolaan keuangan personal berbasis teknologi citra digital, dan gamifikasi pada aplikasi finansial.

**Tabel 2.8 Matriks Penelitian Relevan**

| Peneliti (tahun) | Judul | Metode atau fokus | Temuan | Celah terhadap penelitian ini |
|:---|:---|:---|:---|:---|
| Chan dkk. (2026) | *Nutworth: Designing a Context-Aware Spending Companion to Promote Value-Aligned Financial Decisions* | Perancangan aplikasi pendamping pengeluaran (*spending companion*) yang sadar konteks; karya dalam pengerjaan (*work in progress*) dengan tiga putaran prototipe dan 15 partisipan | Penelitian paling relevan secara konseptual, sama-sama berfokus pada intervensi pengeluaran yang sadar konteks dan selaras nilai personal pengguna | Belum diketahui sejauh mana pendekatan ini menerapkan mekanisme prediksi kuantitatif berbasis pola transaksi personal sebelum keputusan pembelian diambil (*pre-purchase*) |
| Widiantara dkk. (2024) | *Bidirectional Long Short-Term Memory untuk Ekstraksi Informasi pada Struk Belanja* | Bi-LSTM untuk ekstraksi informasi dari teks hasil OCR struk belanja | Akurasi, *precision*, dan *recall* 95% pada data yang diuji; menegaskan kebutuhan otomatisasi pencatatan berbasis citra | Berfokus pada akurasi ekstraksi, bukan pada pemanfaatan hasilnya untuk prediksi risiko atau peringatan sebelum keputusan pembelian |
| Raza dkk. (2024) | *Gamification in financial service apps to enhance customer experience and engagement* | Survei (340 pelanggan) dan eksperimen (161 pelanggan) pada pengguna *m-banking* di Pakistan | Gamifikasi berhubungan positif dengan pengalaman dan keterlibatan; keterlibatan memediasi niat beli; hadiah segera lebih kuat daripada hadiah tertunda | Berfokus pada pengalaman, keterlibatan, dan niat beli pada layanan perbankan, bukan pada pencegahan pengeluaran tidak terencana pada titik keputusan pembelian |

*Sumber: disusun penulis*

Secara keseluruhan, ketiga penelitian di atas menunjukkan bahwa upaya-upaya sebelumnya dalam domain pengelolaan keuangan personal berbasis teknologi cenderung terpisah satu sama lain: penelitian intervensi berbasis konteks (Chan dkk., 2026) belum tentu menyediakan mekanisme prediksi kuantitatif yang dapat dijelaskan; penelitian otomatisasi pencatatan (Widiantara dkk., 2024) berfokus pada akurasi ekstraksi dan bersifat pasca-transaksi; sementara penelitian gamifikasi (Raza dkk., 2024) berfokus pada pengalaman dan keterlibatan pengguna, bukan pencegahan pada titik keputusan.

Penelitian ini berupaya mengisi celah tersebut dengan mengintegrasikan empat komponen sekaligus dalam satu sistem: (1) **mekanisme pra-pembelian** yang bertindak sebelum transaksi terjadi, bukan setelahnya; (2) **personalisasi berbasis pola transaksi individual**, bukan ambang batas yang seragam untuk seluruh pengguna; (3) **penjelasan yang dapat dipahami** (*explainable*) atas dasar pertimbangan setiap peringatan yang ditampilkan, bukan sekadar notifikasi tanpa konteks; serta (4) **mekanisme koreksi dan adaptasi model** berdasarkan umpan balik pengguna pasca-keputusan, termasuk penanganan kondisi *cold start* bagi pengguna baru yang belum memiliki riwayat transaksi memadai. Kombinasi keempat komponen inilah yang menjadi kontribusi dan kebaruan (*novelty*) utama penelitian ini dibandingkan penelitian-penelitian terdahulu. Posisi penelitian ini terhadap penelitian-penelitian terdahulu diringkas pada Gambar 2.11.

**Gambar 2.11 Posisi Penelitian terhadap Penelitian Terdahulu**

> **[RUANG GAMBAR 2.11]** Sisakan ruang di sini untuk gambar. Isi yang disarankan: empat komponen yang diintegrasikan penelitian ini (mekanisme pra-pembelian, personalisasi, penjelasan, serta koreksi dan adaptasi) dan fokus masing-masing penelitian terdahulu pada Tabel 2.8; hindari tanda yang menyatakan suatu studi tidak memiliki komponen tertentu kecuali sudah terverifikasi.

*Sumber: disusun penulis berdasarkan Tabel 2.8*

---

## 2.11 Kerangka Berpikir

Berdasarkan kajian teori pada subbab 2.1 hingga 2.10, penelitian ini disusun atas kerangka berpikir sebagai berikut: rendahnya literasi keuangan pada kelompok pelajar/mahasiswa (BAB I) mendorong kebutuhan akan sistem informasi yang tidak hanya mencatat transaksi secara pasif, tetapi mampu melakukan intervensi personal pada titik keputusan pembelian melalui prinsip *Just-in-Time Adaptive Intervention* (subbab 2.2). Intervensi tersebut diwujudkan melalui model prediksi risiko yang dibangun dan dibandingkan menggunakan pendekatan *Logistic Regression* dan *Random Forest*/*Gradient Boosting* terhadap *baseline* ambang statis (subbab 2.3), didukung oleh fitur-fitur pelengkap berupa indikator kesehatan finansial (subbab 2.4), OCR, dan elemen keterlibatan ringan (subbab 2.5). Seluruh komponen tersebut diimplementasikan di atas arsitektur *modular monolith* yang mempertimbangkan keterbatasan sumber daya pengembang tunggal (subbab 2.6), dengan mekanisme keamanan dan privasi data yang ketat mengingat sensitifnya data finansial yang dikelola (subbab 2.7), dibangun menggunakan platform Flutter, FastAPI, Next.js, dan PostgreSQL (subbab 2.8), serta dikembangkan melalui kerangka metodologi bertingkat DSRM–Iteratif/Inkremental–CRISP-DM (subbab 2.9). Posisi penelitian ini di antara penelitian-penelitian terdahulu (subbab 2.10) menegaskan kebaruannya pada integrasi mekanisme pra-pembelian, personalisasi, keterjelasan (*explainability*), dan koreksi model dalam satu sistem yang utuh. Alur kerangka berpikir ini secara ringkas divisualisasikan pada Gambar 2.12.

**Gambar 2.12 Kerangka Berpikir Penelitian**

![Kerangka Berpikir Penelitian](figures/gambar_2_6_kerangka_berpikir.svg)

*Sumber: disusun penulis*

---
