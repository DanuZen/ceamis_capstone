# Ringkasan Perubahan Terbaru untuk Antigravity
### Konsolidasi seluruh perubahan arsitektur & fitur sejak rencana awal

---

## 1. Platform: Mobile (Flutter) + Web (Next.js) — Dual Platform Setara

**Perubahan:** Dari rencana awal web-only, sekarang ada 2 platform:
- **Mobile (Flutter)** — fokus utama pengembangan
- **Web (Next.js)** — platform pendukung, setara secara fungsional

**Yang perlu dikerjakan:**
- [ ] Setup project Flutter baru (tentukan target: Android saja / Android+iOS)
- [ ] State management: pilih satu (Provider/Riverpod/Bloc/GetX), konsisten di seluruh app
- [ ] Autentikasi Flutter pakai `supabase_flutter` (SDK resmi)
- [ ] Flutter berkomunikasi ke NestJS (REST API) untuk data transaksi/ledger/profil/gamifikasi
- [ ] Flutter berkomunikasi ke FastAPI (AI Microservice) untuk Health Score/Risk Profile/Chatbot
- [ ] Simpan token/session pakai `flutter_secure_storage`, bukan SharedPreferences biasa

---

## 2. Fitur Baru: Pemindaian Struk Otomatis (OCR)

**Alur kerja:**
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

**Dependency Flutter:**
```yaml
dependencies:
  google_mlkit_text_recognition: ^0.13.0
  image_picker: ^1.1.2
  http: ^1.2.0
```

**Struktur data output (kontrak API — jangan diubah setelah frontend jalan):**
```json
{
  "merchant_name": "string",
  "transaction_date": "YYYY-MM-DD",
  "category": "Groceries | Food & Beverage | Utilities | Health | Transportation | Shopping | Entertainment | Other",
  "total_amount": 0,
  "payment_method": "Cash | QRIS | Debit | Credit | E-Wallet",
  "items": [{ "name": "string", "qty": 0, "price": 0, "total": 0 }],
  "confidence_score": 0.0
}
```

**⚠️ Keamanan wajib:** Gemini API key **tidak boleh** ada di client Flutter. Alur: Flutter (ML Kit) → kirim teks mentah ke NestJS → NestJS panggil Gemini API → hasil JSON dikirim balik ke Flutter.

**Edge case yang wajib ditangani:**
- [ ] Foto blur/gelap → minta foto ulang
- [ ] Kertas termal salah baca `O`↔`0`, titik↔koma → instruksikan ke prompt Gemini, tetap sediakan koreksi manual
- [ ] Tidak ada internet → fallback ke form manual dengan foto struk tetap terlampir
- [ ] Total hasil ekstraksi tidak masuk akal (0/negatif) → validasi sebelum simpan

---

## 3. Model AI: Spending Pattern Cluster DIHAPUS, Diganti Kategorisasi Threshold

**Perubahan:** Model *unsupervised clustering* terpisah **dihapus total**. Fungsinya (kategori gaya belanja) sekarang **diturunkan langsung dari `health_score`** — bukan model AI, cukup logic sederhana.

**Yang perlu dihapus/dinonaktifkan:**
- [ ] Endpoint `/api/v1/predict/spending-cluster`
- [ ] Proses training model clustering (kalau sudah sempat dibuat)
- [ ] Dependency clustering (misal `scikit-learn` KMeans import) kalau tidak dipakai di tempat lain

**Yang perlu ditambahkan — threshold FINAL (sudah dikunci, berdasarkan riset FinHealth Score):**

```
Skor 80–100  → "Sehat" / "Hemat"
Skor 40–79   → "Waspada"
Skor 0–39    → "Boros"
```

Sisipkan sebagai field tambahan di response endpoint `/api/v1/predict/health-score` yang sudah ada (tidak perlu endpoint baru):
```json
{
  "health_score": 65.5,
  "category": "Waspada",
  "savings_ratio": 0.15,
  "needs_ratio": 0.55,
  "wants_ratio": 0.30
}
```

**Fungsi sederhana untuk implementasi (contoh, sesuaikan dengan layer backend/AI service yang dipakai):**
```python
def get_spending_category(health_score: float) -> str:
    if health_score >= 80:
        return "Sehat"  # atau "Hemat"
    elif health_score >= 40:
        return "Waspada"
    else:
        return "Boros"
```

**Update di Frontend (Flutter & Next.js):**
- [ ] Cari semua pemanggilan endpoint `spending-cluster` — ganti jadi ambil field `category` dari response `health-score`
- [ ] Update komponen UI "Spending Cluster Badge" — sumber data sekarang dari endpoint yang sama dengan Health Score

**Database:** Kalau ada tabel/kolom khusus hasil clustering terpisah, ganti jadi 1 kolom `spending_category` di tabel yang sama dengan `health_score` (tidak perlu tabel terpisah).

---

## 4. Model AI: Risk Profile Classifier — Algoritma Dikunci: Random Forest

**Perubahan:** Algoritma untuk model klasifikasi profil risiko sudah dikunci ke **Random Forest** (library: `scikit-learn`).

**Yang perlu dikerjakan:**
- [ ] Implementasi model Random Forest di FastAPI (AI Microservice) menggunakan `sklearn.ensemble.RandomForestClassifier`
- [ ] Input variabel: `saving_rate`, `emergency_fund`, `investment_rate`, `financial_goals`, `budget_discipline`
- [ ] Output: `risk_profile` (Konservatif/Moderat/Agresif) + `confidence_score`
- [ ] Siapkan/generate dataset training (sintetis atau riil) dengan label yang sesuai 3 kategori tersebut
- [ ] Endpoint: `/api/v1/predict/risk-profile` (kalau belum ada, buat; kalau sudah ada, pastikan implementasinya pakai Random Forest, bukan algoritma lain)

---

## 5. Ringkasan Arsitektur AI Final (4 Komponen)

| # | Komponen | Jenis | Status Implementasi |
|---|---|---|---|
| 1 | Financial Health Score | Deep Learning + Attention (regresi) | Dilatih sendiri |
| 2 | Kategorisasi Spending (turunan skor) | Threshold sederhana (bukan model AI) | Logic if-else, lihat bagian 3 |
| 3 | Risk Profile Classifier | Random Forest (Supervised Classification) | Dilatih sendiri |
| 4 | Chatbot AI | LLM pihak ketiga | Gemini 1.5 Flash (primary) + Groq (fallback) |
| 5 | OCR Struk | OCR + LLM Extraction | Google ML Kit + Gemini 1.5 Flash |

---

## 6. Checklist Prioritas Pengerjaan (Urutan Disarankan)

1. Setup Flutter + autentikasi dasar
2. Modul transaksi manual (fondasi semua fitur lain)
3. Model Financial Health Score + kategorisasi threshold (bagian 3)
4. Model Risk Profile Classifier — Random Forest (bagian 4)
5. Fitur OCR struk (bagian 2) — butuh modul transaksi manual sudah ada dulu sebagai pembanding
6. Chatbot + integrasi Gen-Z Warning System
7. Modul edukasi adaptif & gamifikasi

---

**Dokumen ini menggantikan/menggabungkan 2 dokumen sebelumnya** (`PANDUAN_FITUR_BARU_MOBILE_OCR.md` dan `PERUBAHAN_HAPUS_SPENDING_CLUSTER.md`) menjadi satu referensi konsolidasi, ditambah keputusan terbaru (threshold final + algoritma Random Forest) yang belum pernah didokumentasikan ke Antigravity sebelumnya.
