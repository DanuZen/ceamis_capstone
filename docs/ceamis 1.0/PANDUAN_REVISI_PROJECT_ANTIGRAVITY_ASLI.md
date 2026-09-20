# Panduan Revisi Project — Sebelum vs Sesudah Rancangan Dosen

> Dokumen ini murni untuk keperluan development/revisi kode. Fokus: apa yang berubah di project, bukan di laporan TA.

---

## 1. Ringkasan Perubahan Besar

| Aspek | SEBELUM | SESUDAH |
|---|---|---|
| Backend | NestJS (API utama) + FastAPI (AI terpisah) | **1 aplikasi FastAPI modular** — NestJS dihilangkan total |
| Web | Setara dengan Mobile untuk User | **Khusus Admin Dashboard**, User cuma di Mobile |
| Fitur inti | Financial Health Score + Risk Profile + Chatbot + OCR + Gamifikasi | **Pra-Pembelian (pre-purchase check)** jadi fitur inti baru |
| Model AI utama | Health Score (Deep Learning+Attention) + Risk Profile (Random Forest) | **Model prediksi risiko per-transaksi** (Logistic Regression vs Random Forest/GBM) |
| Chatbot | Fitur utama (Gemini+Groq) | **Dihapus total** |
| Gamifikasi | XP/streak/badge/level lengkap | **Disederhanakan** — streak pencatatan + badge sederhana saja (fitur Pendukung) |
| Financial Health Score | Deep Learning + Attention Layer | **Disederhanakan jadi formula/rule biasa** (bukan model AI dilatih), tetap ada sebagai fitur Pendukung |
| OCR | RM/fitur utama | **Fitur Pendukung** |
| Edukasi Adaptif | RM/fitur utama | **Fitur Pendukung** |

---

## 2. Fitur yang DIHAPUS TOTAL dari Project

- [ ] **Chatbot AI** — hapus integrasi Gemini/Groq untuk chatbot, hapus endpoint terkait, hapus UI halaman chatbot
- [ ] **Integrasi bank/e-wallet otomatis** — tidak pernah diimplementasikan, pastikan tidak ada rencana ke arah ini
- [ ] **Pemblokiran transaksi otomatis** — sistem tidak boleh mengunci/membatalkan transaksi pengguna secara otomatis
- [ ] **Rekomendasi investasi/kredit/pajak** — di luar lingkup
- [ ] **Komunitas sosial, ranking/leaderboard antarpengguna** — hapus kalau sempat direncanakan
- [ ] **Role orang tua/dosen/konsultan keuangan** — hapus dari sistem role kalau ada
- [ ] **Data lokasi, isi komunikasi, media sosial** sebagai input model — pastikan tidak dipakai sebagai fitur data

## 3. Fitur yang DISEDERHANAKAN

### Financial Health Score
- **Sebelum:** Model Deep Learning dengan Custom Attention Layer, dilatih dari data
- **Sesudah:** Formula/rule sederhana berbasis rasio (needs_ratio, wants_ratio, savings_ratio, dll), threshold kategori:
  ```
  Skor 80–100 → "Sehat"/"Hemat"
  Skor 40–79  → "Waspada"
  Skor 0–39   → "Boros"
  ```
- **Kenapa:** Health Score sekarang cuma fitur Pendukung (dashboard overview), tidak perlu kompleksitas model AI penuh
- **Aksi:** Hapus training pipeline Deep Learning untuk Health Score kalau sudah sempat dibuat; ganti dengan fungsi kalkulasi sederhana di backend

### Gamifikasi
- **Sebelum:** XP, level, streak, badge lengkap, leaderboard
- **Sesudah:** **Streak pencatatan + badge sederhana saja** (misal 3-5 badge dasar), tanpa leaderboard/ranking/kompetisi antarpengguna
- **Framing:** Di sistem baru, ini masuk kategori "Engagement" (ringkasan mingguan, reminder adaptif, *quiet hours*, *snooze*), **bukan** dilabeli "gamifikasi" secara eksplisit di UI/copy

### Risk Profile Classifier
- **Sebelum:** Klasifikasi profil risiko investasi (Konservatif/Moderat/Agresif) dari kuesioner
- **Sesudah:** **Diganti total** — bukan lagi soal profil investasi, tapi **model prediksi risiko "pengeluaran tidak terencana" per transaksi** (lihat bagian 4)

---

## 4. Fitur BARU yang Perlu Dibangun

### 4.1 Pra-Pembelian (Fitur Inti Baru — Prioritas Utama)

**Alur:**
```
User input rencana pembelian (nominal, kategori)
   ↓
Sistem hitung skor risiko (model prediksi)
   ↓
Tampilkan peringatan + alasan (bukan cuma angka — jelaskan faktor pemicu)
   ↓
Tampilkan dampak ke anggaran/tujuan tabungan
   ↓
User pilih: Lanjut / Sesuaikan / Tunda
   ↓
Setelah keputusan: sistem tanya konfirmasi apakah ini sesuai rencana anggaran (untuk label data)
```

**Catatan penting:** Sistem **membantu refleksi, TIDAK memblokir** transaksi — keputusan akhir selalu di tangan user.

### 4.2 Model Prediksi Risiko (Ganti Total dari Risk Profile Classifier Lama)

- **Baseline wajib:** Ambang anggaran statis (aturan sederhana, jadi pembanding)
- **Model kandidat:** Logistic Regression (mudah dijelaskan) vs 1 model pohon (Random Forest atau Gradient Boosting)
- **Fitur input model:**
  - Nominal transaksi relatif ke median transaksi kategori sama
  - Rasio nominal ke sisa anggaran
  - Frekuensi transaksi kategori tersebut
  - Hari/waktu & jarak ke tanggal reset anggaran
  - Dampak ke tujuan tabungan
  - Pola transaksi berulang & deviasi dari kebiasaan
- **Label training:** Diberikan user **SETELAH** keputusan (bukan sebelum, supaya tidak bocor ke skor)
- **⚠️ PENTING — Split data:** Bagi data training/testing **per user & per waktu**, BUKAN random split biasa — ini krusial untuk mencegah *data leakage*
- **Kalibrasi:** Model global dulu (fitur dinormalisasi per user), baru personalisasi ambang per-user setelah data historis cukup (tentukan kecukupan data via *learning curve*, bukan angka arbitrer)

### 4.3 Respons Pengguna & Koreksi Model
- [ ] UI untuk 3 pilihan respons: Lanjut / Sesuaikan / Tunda
- [ ] Mekanisme label pasca-keputusan (konfirmasi apakah transaksi sesuai rencana)
- [ ] Fitur koreksi — user bisa memberi feedback kalau merasa prediksi model salah

### 4.4 Role Admin + Web Dashboard (Baru)
- [ ] Manajemen akun pengguna
- [ ] Konfigurasi: kategori transaksi, aturan *cold start*, ambang baseline
- [ ] Manajemen model: versi model, metrik performa, kemampuan *rollback*
- [ ] Monitoring sistem
- [ ] Panel evaluasi (lihat hasil precision/recall/dst)
- [ ] **Audit log** — Admin TIDAK bebas lihat transaksi individual user; setiap akses butuh alasan tercatat

### 4.5 Engagement (Pengganti Gamifikasi Kompleks)
- [ ] Ringkasan mingguan (laporan pengeluaran/pencapaian minggu ini)
- [ ] Reminder adaptif (notifikasi pintar, bukan spam)
- [ ] *Quiet hours* (user bisa atur jam tanpa notifikasi)
- [ ] *Snooze* (tunda notifikasi sementara)

---

## 5. Perubahan Arsitektur Teknis

### Backend: Konsolidasi ke FastAPI
```
SEBELUM:
Flutter/Next.js → NestJS (API) ──┐
                                   ├──> Database
                  FastAPI (AI) ────┘

SESUDAH:
Flutter (Mobile/User)   ──┐
                           ├──> FastAPI (1 aplikasi modular: auth+CRUD+AI) → Database
Next.js (Web/Admin)     ──┘
```

**Yang perlu dilakukan:**
- [ ] Port logic auth dari NestJS ke FastAPI — pakai integrasi langsung Supabase Auth dari Python, atau `fastapi-users`
- [ ] Port CRUD (transaksi, anggaran, dst) dari NestJS ke FastAPI
- [ ] Ganti ORM: dari Prisma (TypeScript) ke **SQLAlchemy** atau **Tortoise ORM** (Python)
- [ ] Validasi data pakai **Pydantic** (built-in FastAPI)
- [ ] Struktur folder modular di FastAPI: `auth/`, `transactions/`, `budgets/`, `pre_purchase/`, `risk_model/`, `admin/`, dst — supaya tetap terorganisir meski 1 aplikasi
- [ ] Hapus/nonaktifkan seluruh project NestJS setelah migrasi selesai

### Database — Entitas Baru yang Perlu Ditambahkan
```
users, profiles, budgets, financial_goals, transaction_categories,
transactions, pre_purchase_checks, risk_predictions, user_feedback,
notification_preferences, consent_records, model_versions, audit_logs
```

**Catatan:** `pre_purchase_checks`, `risk_predictions`, `user_feedback`, `consent_records`, `model_versions`, `audit_logs` adalah tabel **baru**, belum ada di skema lama.

### Penyimpanan
- [ ] Object storage untuk foto struk (OCR) dengan **retensi dibatasi** (jangan simpan permanen tanpa batas waktu)

---

## 6. Etika, Privasi, Keamanan — Perlu Ditambahkan

- [ ] Consent flow sebelum pengumpulan data (terutama untuk partisipan evaluasi)
- [ ] Pseudonymization untuk data partisipan riset (participant code, bukan nama asli)
- [ ] *Least privilege access* untuk Admin — tidak semua Admin bisa lihat semua data
- [ ] Audit log untuk setiap akses data sensitif oleh Admin
- [ ] Enkripsi komunikasi (HTTPS wajib, sudah standar tapi pastikan diterapkan konsisten)
- [ ] Hak user: lihat/koreksi/ekspor/hapus data pribadi mereka sendiri
- [ ] Retensi foto struk dibatasi (misal auto-hapus setelah X hari/bulan)

---

## 7. Prioritas Pengerjaan (Revisi dari Urutan Lama)

1. **Migrasi backend NestJS → FastAPI modular** (fondasi, harus selesai duluan)
2. Modul dasar: auth, anggaran, transaksi (Increment 1 versi dosen)
3. **Baseline warning** — ambang statis sederhana dulu (Increment 2)
4. **Model prediksi risiko** — Logistic Regression vs Random Forest/GBM (Increment 3, bagian tersulit & terpenting)
5. Fitur Pra-Pembelian lengkap (integrasi dengan model di atas)
6. Financial Health Score versi sederhana (formula, bukan AI)
7. OCR struk (tetap pakai ML Kit + Gemini seperti rencana lama, sekarang statusnya Pendukung)
8. Admin Dashboard (Increment 4)
9. Gamifikasi ringan + Engagement features
10. Edukasi adaptif (Pendukung, prioritas paling akhir)

---

## 8. Checklist Cepat untuk Antigravity

```
[ ] Hapus semua kode/endpoint chatbot (Gemini/Groq untuk chat)
[ ] Hapus project/folder NestJS setelah migrasi selesai
[ ] Buat 1 aplikasi FastAPI modular baru (kalau belum ada)
[ ] Port auth, CRUD transaksi/anggaran ke FastAPI
[ ] Ganti Prisma → SQLAlchemy/Tortoise ORM
[ ] Sederhanakan Financial Health Score jadi formula (bukan model Deep Learning)
[ ] Bangun fitur Pra-Pembelian (UI + backend + model)
[ ] Bangun model prediksi risiko (LogReg vs RF/GBM), split data per user+waktu
[ ] Bangun Web Admin Dashboard baru (Next.js, khusus Admin)
[ ] Tambah tabel baru: pre_purchase_checks, risk_predictions, user_feedback, consent_records, model_versions, audit_logs
[ ] Sederhanakan gamifikasi (hapus leaderboard/ranking, sisakan streak+badge dasar)
[ ] Reframe UI "gamifikasi" jadi "Engagement" (ringkasan mingguan, reminder, quiet hours, snooze)
[ ] Tambah consent flow, audit log, retensi data terbatas
```
