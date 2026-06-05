# CEAMIS Capstone Dashboard data

## Dashboard Streamlit

Dashboard Streamlit telah berhasil dideploy dan dapat diakses secara publik melalui tautan berikut:

🔗 https://ceamisapp-ccwp9bqb37imrgjhgxjfhh.streamlit.app/

## Menjalankan Streamlit Secara Lokal

### 1. Clone Repository

```bash
git clone https://github.com/DanuZen/ceamis_capstone.git
cd ceamis_capstone
```

### 2. Masuk ke Folder Streamlit

```bash
cd data-app/data_onboarding_final/streamlit
```

### 3. Install Dependency

Pastikan Python telah terinstal pada perangkat Anda, kemudian jalankan:

```bash
pip install -r requirements.txt
```

### 4. Jalankan Aplikasi

```bash
streamlit run app.py
```

### 5. Akses Dashboard

Setelah aplikasi berhasil dijalankan, buka browser dan akses:

```text
http://localhost:8501
```

## Struktur Folder Streamlit

```text
streamlit/
├── app.py                # Entry point aplikasi Streamlit
├── pages/                # Halaman dashboard
├── utils/                # Fungsi dan utilitas pendukung
├── .streamlit/           # Konfigurasi Streamlit
├── assets/               # Logo dan aset visual
└── requirements.txt      # Daftar dependency Python
```

## Catatan

- Pastikan seluruh dependency berhasil terinstal sebelum menjalankan aplikasi.
- Pastikan file data yang digunakan oleh dashboard tersedia pada lokasi yang sesuai.
- Jika terdapat perubahan pada kode Streamlit, jalankan kembali aplikasi untuk melihat pembaruan secara lokal.
- Untuk penggunaan tanpa instalasi lokal, dashboard dapat langsung diakses melalui tautan deployment yang tersedia di atas.
