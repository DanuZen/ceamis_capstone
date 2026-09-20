# Panduan Pengembangan Fitur — Mobile App & OCR Struk

---

## 1. Aplikasi Mobile (Flutter)

### Setup Awal
- [ ] Inisialisasi project Flutter baru
- [ ] Tentukan target platform: Android saja, atau Android + iOS
- [ ] Pilih state management: Provider, Riverpod, Bloc, atau GetX — pilih satu, konsisten di seluruh app
- [ ] Setup struktur folder (feature-based atau layer-based, sesuaikan skala project)

### Integrasi Backend
- [ ] Autentikasi: pakai Supabase Auth SDK Flutter resmi (`supabase_flutter`)
- [ ] Komunikasi ke NestJS (REST API) untuk data transaksi, ledger, profil, gamifikasi
- [ ] Komunikasi ke FastAPI (AI Microservice) untuk fitur Health Score, Clustering, Risk Profile, Chatbot
- [ ] Simpan token/session secara aman (`flutter_secure_storage`, jangan simpan di SharedPreferences biasa untuk data sensitif)

### UI/UX
- [ ] Tentukan gaya visual mobile — ikut gaya web (kalau ada) atau disesuaikan untuk mobile
- [ ] Rancang navigasi utama (bottom nav bar umum dipakai: Dashboard, Transaksi, Chatbot, Edukasi, Profil)
- [ ] Pastikan komponen kunci (Financial Health Score card, gamification progress bar, warning banner) responsif di berbagai ukuran layar

### Fitur yang Perlu Ada di Mobile (minimal)
- Dashboard utama (skor kesehatan finansial, quick actions)
- Halaman transaksi (list + tambah manual + tambah via foto struk)
- Halaman chatbot
- Halaman edukasi/kuis
- Halaman profil & gamifikasi (level, XP, streak, badge)
- Halaman warning/notifikasi

---

## 2. Fitur OCR Struk Belanja

### Alur Kerja
```
Foto Struk
   ↓
Google ML Kit Text Recognition (on-device, ekstraksi teks mentah)
   ↓
Backend Proxy (NestJS) → Gemini 1.5 Flash API (strukturisasi ke JSON)
   ↓
Form Pratinjau (user cek & koreksi)
   ↓
Simpan ke Database
```

### Dependency Flutter
```yaml
dependencies:
  google_mlkit_text_recognition: ^0.13.0
  image_picker: ^1.1.2
  http: ^1.2.0
```

### Struktur Data Output (kontrak API — tetapkan di awal, hindari ubah-ubah setelah frontend jalan)
```json
{
  "merchant_name": "string",
  "transaction_date": "YYYY-MM-DD",
  "category": "Groceries | Food & Beverage | Utilities | Health | Transportation | Shopping | Entertainment | Other",
  "total_amount": 0,
  "payment_method": "Cash | QRIS | Debit | Credit | E-Wallet",
  "items": [
    { "name": "string", "qty": 0, "price": 0, "total": 0 }
  ],
  "confidence_score": 0.0
}
```

### Keamanan — Wajib Diperhatikan
- [ ] **Jangan taruh Gemini API key di client (Flutter)**. Alur yang benar:
  1. Flutter jalankan ML Kit → dapat teks mentah
  2. Flutter kirim teks mentah ke NestJS
  3. NestJS yang panggil Gemini API (API key aman di server)
  4. NestJS kirim balik JSON hasil ke Flutter
- [ ] Rate limit endpoint proxy di NestJS supaya tidak disalahgunakan

### Prompt Gemini (System Instruction)
```text
Kamu adalah mesin pengekstrak data dari teks mentah hasil OCR struk belanjaan Indonesia.
Kembalikan HANYA JSON valid tanpa markdown tambahan.

Ketentuan:
1. merchant_name: nama toko (string)
2. transaction_date: format YYYY-MM-DD, jika tahun tidak ada gunakan tahun berjalan
3. category: satu dari [Groceries, Food & Beverage, Utilities, Health, Transportation, Shopping, Entertainment, Other]
4. total_amount: angka bersih total (integer, abaikan simbol Rp/titik/koma)
5. payment_method: jika ada (Cash, QRIS, Debit, Credit, E-Wallet)
6. items: array [{name, qty, price, total}]
```

### Edge Case yang Wajib Ditangani
- [ ] Foto blur/gelap → minta foto ulang, jangan paksa proses
- [ ] Kertas termal sering salah baca `O`↔`0` atau titik↔koma → sudah diinstruksikan ke Gemini, tapi tetap sediakan koreksi manual di UI
- [ ] Tidak ada koneksi internet saat proses ke Gemini → fallback: buka form input manual dengan foto struk tetap terlampir
- [ ] Total hasil ekstraksi tidak masuk akal (0, negatif, atau jauh dari wajar) → validasi sebelum bisa disimpan
- [ ] Struk sangat panjang (banyak item) → cek batas token prompt tidak terlampaui

### Best Practice Tambahan
- Jangan auto-save hasil OCR langsung ke database — selalu tampilkan form pratinjau dulu
- Simpan foto struk asli (bukan cuma hasil ekstraksi) sebagai referensi visual, minimal untuk sesi debugging/testing
- Pertimbangkan cache/local storage sementara untuk hasil OCR sebelum user konfirmasi simpan, supaya tidak hilang kalau app force-close

---

## 3. Urutan Kerja yang Disarankan

1. Setup Flutter + koneksi dasar ke NestJS (autentikasi dulu)
2. Bangun modul transaksi manual dulu (fondasi untuk OCR nanti)
3. Implementasi ML Kit di Flutter (test ekstraksi teks mentah dulu, tanpa Gemini)
4. Bangun endpoint proxy di NestJS untuk terima teks mentah → panggil Gemini → return JSON
5. Sambungkan Flutter ke endpoint tersebut, bangun form pratinjau
6. Tangani edge case satu per satu (blur, offline, data tidak wajar)
7. Testing dengan berbagai jenis struk nyata
