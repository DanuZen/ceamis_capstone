# 📋 AI Integration — CEAMIS Frontend
**Tanggal:** 24 Mei 2026  
**Sesi:** Resolusi Merge Conflict + Integrasi AI ke Frontend  
**Tim:** AI Service ↔ Fullstack

---

## Daftar Isi
1. [Status AI Service (Backend)](#1-status-ai-service-backend)
2. [Model 1 — Financial Health Score](#2-model-1--financial-health-score)
3. [Model 2 — Spending Pattern Clustering](#3-model-2--spending-pattern-clustering)
4. [Model 3 — Risk Profile Classifier](#4-model-3--risk-profile-classifier)
5. [Chatbot — CAMI](#5-chatbot--cami)
6. [Warning System — Gate Logic](#6-warning-system--gate-logic)
7. [Ringkasan Endpoint API](#7-ringkasan-endpoint-api)
8. [Checklist Integrasi Fullstack](#8-checklist-integrasi-fullstack)

---

## 1. Status AI Service (Backend)

> **Base URL:** `http://localhost:8000`  
> **Env var (frontend):** `NEXT_PUBLIC_AI_SERVICE_URL`

### Cara Jalankan

```bash
cd ai-service
uvicorn app.main:app --reload --port 8000
```

### Health Check

```bash
GET http://localhost:8000/health
# Response: { "status": "ok", ... }
```

### Kondisi Komponen

| Komponen | Status | Catatan |
|----------|--------|---------|
| `app/main.py` | ✅ Running | 6 router aktif, prefix `/api/v1` |
| `app/api/health_score.py` | ✅ Real model | Custom `FinancialAttentionLayer`, perlu optimasi akurasi |
| `app/api/risk_profile.py` | ✅ Production-ready | Akurasi 97.91% |
| `app/api/spending_cluster.py` | ⚠️ Mock | `is_mock: true`, model masih training |
| `app/api/chatbot.py` | ✅ Ready | Gemini 1.5 Flash + Groq fallback |
| `app/api/education.py` | ✅ Ready | Generate konten & quiz via LLM |
| `app/utils/preprocessor.py` | ✅ Fixed | Unified utilities Model 1 + Model 3 |
| `requirements.txt` | ✅ Fixed | Groq `v0.9.0` included, no duplicates |

### File Model Artifacts

Semua artifacts tersimpan di `ai-service/app/models/`:

```
ai-service/app/models/
├── health_score_model.keras      # Model 1
├── health_score_scaler.pkl       # Scaler Model 1
├── risk_profile_model.keras      # Model 3
├── risk_profile_scaler.pkl       # Scaler Model 3
└── risk_profile_features.pkl     # Feature list Model 3
```

---

## 2. Model 1 — Financial Health Score

### Deskripsi
Model deep learning dengan custom `FinancialAttentionLayer` untuk menghitung skor kesehatan finansial user (0–100).

### Endpoint

```
POST /api/v1/predict/health-score
```

### Request Body

```json
{
  "monthly_income":     4500000,
  "monthly_expense":    2100000,
  "savings":            2400000,
  "needs_ratio":        0.62,
  "wants_ratio":        0.28,
  "savings_ratio":      0.10,
  "streak":             1,
  "total_transactions": 12
}
```

### Response

```json
{
  "health_score": 78.4,
  "label":        "Sehat",
  "xai_factors": {
    "savings_ratio": 0.42,
    "needs_ratio":   0.31,
    "wants_ratio":   0.27
  },
  "is_mock": false
}
```

### Integrasi Frontend

**File:** `src/context/UserContext.tsx`

```typescript
// Update health score dari response API
const { setHealthScore } = useUser();
setHealthScore(data.health_score, data.health_score < 40);

// Fungsi setHealthScore di dalam UserContext:
const setHealthScore = (score: number, triggered: boolean) => {
  setUserData(prev => ({
    ...prev,
    healthScore:      Math.round(score * 10) / 10,
    warningTriggered: triggered,  // true jika score < 40
  }));
};
```

**Tampilan di Dashboard (`src/app/dashboard/page.tsx`):**

| `healthScore` | Warna Icon | Label |
|--------------|-----------|-------|
| ≥ 65 | 🟢 Lime | Aman ✓ |
| 40–64 | 🟠 Orange | Waspada |
| < 40 | 🔴 Pink | ⚠ Kritis |

> **Catatan:** `warningTriggered = healthScore < 40` → mengaktifkan Warning System.

---

## 3. Model 2 — Spending Pattern Clustering

### Deskripsi
Model unsupervised learning untuk mendeteksi pola pengeluaran user. Output berupa cluster label dan breakdown Needs/Wants/Savings.

### Endpoint

```
POST /api/v1/predict/spending-cluster
```

### Request Body

```json
{
  "user_id": "user_local",
  "category_breakdown": {
    "Makanan & Minuman": 850000,
    "Transportasi":      200000,
    "Hiburan":           300000,
    "Belanja":           150000
  },
  "total_transactions": 12
}
```

> **Catatan:** `category_breakdown` dibangun otomatis dari `TransactionContext` berdasarkan transaksi bulan berjalan.

### Response

```json
{
  "cluster_label":     "Si Hemat",
  "dominant_category": "Makanan & Minuman",
  "insight":           "Pengeluaranmu terdistribusi cukup merata...",
  "needs_ratio":       62,
  "wants_ratio":       28,
  "savings_ratio":     10,
  "trend":             "improving",
  "is_mock":           true
}
```

### Cluster Labels

| Label | Karakteristik | Warna UI |
|-------|--------------|----------|
| `Si Hemat` | Saving-oriented, kebutuhan terkontrol | 🟢 Lime |
| `Si Impulsif` | Wants tinggi, sering spontan belanja | 🟠 Orange |
| `Si Boros` | Pengeluaran tidak terkontrol | 🔴 Pink |

### Integrasi Frontend

**File:** `src/app/dashboard/transactions/page.tsx`

```typescript
// Auto-fetch setiap kali jumlah transaksi berubah
useEffect(() => {
  fetchCluster();
}, [transactions.length]);
```

**UI Features:**
- Badge **"DEMO DATA"** saat `is_mock: true`
- Tombol **"Refresh Analisis"** dengan loading spinner
- Progress bar Needs/Wants/Savings dinamis dari API response
- Trend badge: Membaik / Stabil / Menurun
- Tampilan `dominant_category` sebagai badge kecil

> ⚠️ **Status saat ini:** `is_mock: true` — Model masih dalam training. UI sudah siap menerima real data.

---

## 4. Model 3 — Risk Profile Classifier

### Deskripsi
Model deep learning untuk mengklasifikasikan profil risiko keuangan user ke 3 kelas.  
**Akurasi: 97.91%** — sudah production-ready.

### Endpoint

```
POST /api/v1/predict/risk-profile
```

### Request Body

```json
{
  "saving_rate":       0.22,
  "emergency_fund":    4.0,
  "investment_rate":   0.07,
  "financial_goals":   2,
  "budget_discipline": 0.75
}
```

### Field Description

| Field | Tipe | Rentang | Deskripsi |
|-------|------|---------|-----------|
| `saving_rate` | float | 0.0–1.0 | % income yang ditabung |
| `emergency_fund` | float | 0–12+ | Jumlah bulan dana darurat tersedia |
| `investment_rate` | float | 0.0–1.0 | % income untuk investasi rutin |
| `financial_goals` | int | 0–3 | Kejelasan target keuangan (0=belum ada, 3=sangat spesifik) |
| `budget_discipline` | float | 0.0–1.0 | Konsistensi mengikuti budget bulanan |

### Response

```json
{
  "risk_profile":  "Moderat",
  "confidence":    0.89,
  "probabilities": {
    "Konservatif": 0.08,
    "Moderat":     0.89,
    "Agresif":     0.03
  },
  "description": "Kamu sudah cukup sadar finansial...",
  "suggestion":  "Tetapkan target tabungan yang lebih ambisius...",
  "is_mock":     false
}
```

### Profil Kelas

| Profil | Warna UI | Description | Suggestion |
|--------|---------|-------------|-----------|
| `Konservatif` | 🟢 Lime | Lebih nyaman dengan pendekatan aman dan stabil. Fokus pada kebutuhan dasar dan membangun kebiasaan menabung. | Mulai target tabungan kecil yang realistis. Prioritaskan dana darurat minimal 1 bulan pengeluaran. |
| `Moderat` | 🟣 Purple | Sudah cukup sadar finansial dan mulai berani mengelola keuangan lebih aktif. | Tetapkan target tabungan lebih ambisius. Pisahkan pos pengeluaran. Dana darurat 3 bulan. |
| `Agresif` | 🟠 Orange | Sangat goal-oriented, disiplin finansial tinggi, siap mengoptimalkan keuangan secara penuh. | Maksimalkan saving rate. Buat target tabungan spesifik dengan deadline jelas. |

### Integrasi Frontend

**File:** `src/app/dashboard/planning/page.tsx`

**Flow penggunaan:**
```
1. Klik tombol "Mulai Analisis"
2. Jawab 5 pertanyaan quiz (pilihan berganda)
3. Klik "Analisis Profil Saya"
4. Fetch ke API → tampil hasil
```

**5 Pertanyaan Quiz (dipetakan ke request fields):**

| Pertanyaan | Field API | Contoh nilai |
|-----------|----------|-------------|
| Berapa % income yang kamu tabung? | `saving_rate` | < 5% → 0.03, > 30% → 0.40 |
| Punya dana darurat berapa bulan? | `emergency_fund` | Belum ada → 0, > 6 bulan → 7 |
| Apakah kamu rutin investasi? | `investment_rate` | Belum → 0, Rutin > 10% → 0.15 |
| Seberapa jelas target keuangan? | `financial_goals` | Belum punya → 0, Sangat spesifik → 3 |
| Seberapa disiplin ikuti budget? | `budget_discipline` | Jarang → 0.3, Selalu → 0.95 |

**Fallback lokal:** Jika API error, profil dikalkulasi dari total skor jawaban quiz tanpa network call.

**Persistensi:** `localStorage["ceamis_risk_profile"]` — hasil tidak hilang saat refresh.

---

## 5. Chatbot — CAMI

### Deskripsi
CAMI (CEAMIS AI) adalah financial assistant yang menggunakan **Gemini 1.5 Flash** sebagai model utama, dengan **Groq** sebagai fallback jika Gemini limit/error. CAMI menerima konteks finansial user agar jawaban bersifat personal.

### Endpoint

```
POST /api/v1/chat
```

### Request Body

```json
{
  "messages": [
    { "role": "user",      "content": "Gimana cara nabung yang efektif?" },
    { "role": "assistant", "content": "Coba mulai dengan metode 50/30/20..." }
  ],
  "financial_context": {
    "user_name":       "Danu Zen",
    "health_score":    78,
    "risk_profile":    "Moderat",
    "monthly_income":  4500000,
    "monthly_expense": 2100000,
    "saving_rate_pct": 53,
    "streak":          1,
    "level":           1
  }
}
```

> **Penting:** `messages` berisi **full conversation history**, bukan hanya pesan terakhir. Ini memungkinkan model memahami konteks percakapan sebelumnya.

### Response

```json
{
  "reply":     "Dengan health score 78 dan saving rate 53%, kamu udah di jalur yang bagus banget! Coba...",
  "triggered": "ok",
  "provider":  "gemini"
}
```

### `triggered` Values

| Value | Makna | Tampilan UI |
|-------|-------|-------------|
| `ok` | Respons normal | — |
| `sensitive` | Topik keuangan sensitif | Badge ⚠ SENSITIF kuning |
| `off_topic` | Di luar topik finansial | — |
| `crisis_filter` | Konten bermasalah, diblokir | — |

### Financial Context — Sumber Data

```typescript
// Dibangun otomatis dari UserContext + TransactionContext
const financial_context = {
  user_name:        userData.name,
  health_score:     userData.healthScore,
  risk_profile:     null,                  // diisi setelah Model 3 diintegrasikan
  monthly_income:   <hitung dari transactions bulan ini>,
  monthly_expense:  <hitung dari transactions bulan ini>,
  saving_rate_pct:  <((income - expense) / income) * 100>,
  streak:           userData.streak,
  level:            userData.level,
};
```

### Status Indicator UI

| Indikator | Kondisi |
|-----------|---------|
| 🟢 Gemini + Groq | API online, response normal |
| 🟠 Offline (fallback) | API tidak dapat dijangkau |
| ⚪ Connecting... | Sedang ping `/health` saat mount |

### Error Handling

- **Timeout:** 30 detik per request (`AbortSignal.timeout(30000)`)
- **API error:** Tampil error bubble oranye dashed dengan pesan petunjuk
- **Chat history:** Tetap tersimpan meski terjadi error

**Persistensi:** `localStorage["ceamis_chat_history_v2"]`

> ⚠️ Key lama `ceamis_chat_history` (tanpa `_v2`) dari versi dummy tidak lagi digunakan.

---

## 6. Warning System — Gate Logic

### Logika Utama

```
healthScore >= 40  →  TERKUNCI (sistem tidak aktif, user dalam kondisi aman)
healthScore <  40  →  AKTIF (warning system terbuka)
```

Flag `warningTriggered` di `UserContext` mengontrol akses ke seluruh fitur Warning System.

### 3 Titik Enforcement

#### A. Sidebar (`src/components/layout/Sidebar.tsx`)

```
Score ≥ 40:
  - Icon: 🔒 (Lock)
  - Opacity: 35%
  - Cursor: not-allowed
  - Tooltip: "Warning System aktif saat Health Score < 40% (sekarang XX%)"
  - Badge skor kecil di kanan

Score < 40:
  - Link aktif dan clickable
  - Dot merah pink pulsing di kanan item
```

#### B. Dashboard — Feature Card (`src/app/dashboard/page.tsx`)

```
Score ≥ 40 (isLocked):
  - Card grayscale, opacity 45%
  - Border: dashed
  - Icon: 🔒
  - Badge: "TERKUNCI"
  - Deskripsi: "Aktif otomatis saat Health Score < 40. Sekarang: XX/100 ✓"

Score < 40 (isTriggered):
  - Card background: pink
  - animate-shake
  - Dot pulsing di pojok kanan atas
  - Badge: "AKTIF!" (merah)
```

#### C. Warning System Page (`src/app/dashboard/warnings/page.tsx`)

```
Score ≥ 40:
  - Full-page guard (tidak ada konten warning)
  - Tampil: ✅ icon, "Finansialmu Aman! 🎉"
  - Info skor saat ini
  - Tombol "Kembali ke Dashboard"

Score < 40:
  - Halaman penuh dengan notifikasi sarkas AI
  - Kesehatan Dompet bar (danger zone)
  - Notifikasi AI (high/medium/low severity)
  - Ringkasan Status sidebar
```

### Stats Dinamis di Warnings Page

| Elemen | Sebelum (Hardcode) | Sesudah (Dinamis) |
|--------|-------------------|-------------------|
| Health Score card | `15%` | `userData.healthScore.toFixed(0)/100` |
| Total Warning | `3 Aktif` | `warnings.length Aktif` |
| Tips Tersedia | `1 Solusi` | `warnings.length Solusi` |
| Status Level | `LVL 12` | `LVL {userData.level}` |

---

## 7. Ringkasan Endpoint API

| Endpoint | Method | Halaman Frontend | Status |
|----------|--------|-----------------|--------|
| `/health` | GET | Chatbot (ping saat mount) | ✅ Real |
| `/api/v1/predict/health-score` | POST | Dashboard (via UserContext) | ✅ Real model |
| `/api/v1/predict/spending-cluster` | POST | Transaksi | ⚠️ Mock |
| `/api/v1/predict/risk-profile` | POST | Perencanaan | ✅ Production |
| `/api/v1/chat` | POST | Chatbot | ✅ Gemini + Groq |
| `/api/v1/education/content` | POST | Edukasi | ✅ Ready |
| `/api/v1/education/quiz` | POST | Edukasi | ✅ Ready |

---

## 8. Checklist Integrasi Fullstack

### ✅ Sudah Selesai

- [x] `UserContext` — `healthScore`, `warningTriggered`, `setHealthScore()`
- [x] Warning System gate logic — 3 titik enforcement
- [x] Model 2 UI di halaman Transaksi — fetch + fallback mock graceful
- [x] Model 3 UI di halaman Perencanaan — quiz 5 pertanyaan + fetch + cache
- [x] Chatbot connect ke real API dengan `financial_context` personal
- [x] Dashboard health score card — warna & label dinamis sesuai skor
- [x] Semua merge conflict di `ai-service/` terselesaikan

### ⏳ Tim AI — Perlu Dilakukan

- [ ] Optimasi akurasi **Model 1** (Health Score) agar `is_mock: false`
- [ ] Selesaikan training **Model 2** (Spending Cluster) — ganti mock dengan real prediction
- [ ] Konfirmasi final schema request/response **Model 2** jika ada perubahan
- [ ] Isi `ai-service/Dockerfile` yang masih 0 bytes untuk containerisasi

### ⏳ Tim Fullstack — Perlu Dilakukan

- [ ] Set env variable di `.env.local`:
  ```env
  NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000
  ```
- [ ] Hubungkan response **Model 1** ke `setHealthScore()`:
  ```typescript
  const { setHealthScore } = useUser();
  // Setelah fetch health score:
  setHealthScore(data.health_score, data.health_score < 40);
  ```
- [ ] Isi `risk_profile` dari hasil Model 3 ke `financial_context` chatbot
- [ ] End-to-end test: isi transaksi → cek cluster → cek health score → cek warning gate

---

## Appendix — Konfigurasi Teknis

### Env Variables Frontend

```env
# .env.local (development)
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000

# .env.production
NEXT_PUBLIC_AI_SERVICE_URL=https://ai.ceamis.id   # sesuaikan saat deploy
```

### localStorage Keys

| Key | Konten | Digunakan di |
|-----|--------|-------------|
| `ceamis_user` | UserData (healthScore, dll) | UserContext |
| `ceamis_budget` | Budget categories | Planning page |
| `ceamis_targets` | Savings targets | Planning page |
| `ceamis_risk_profile` | RiskResult dari Model 3 | Planning page |
| `ceamis_chat_history_v2` | Array ChatMessage | Chatbot page |

### CORS

AI service dikonfigurasi CORS terbuka (`allow_origins=["*"]`) di `app/main.py`. Aman untuk development — **harus di-restrict saat production** ke domain frontend CEAMIS saja.

### File yang Diubah Sesi Ini

| File | Perubahan |
|------|-----------|
| `ai-service/app/main.py` | Resolve merge conflict, 6 router aktif |
| `ai-service/app/api/health_score.py` | Resolve conflict, integrasi real model |
| `ai-service/app/utils/preprocessor.py` | Resolve conflict, unified Model 1 + Model 3 |
| `ai-service/requirements.txt` | Resolve conflict, tambah Groq v0.9.0 |
| `frontend/src/context/UserContext.tsx` | Tambah `healthScore`, `warningTriggered`, `setHealthScore` |
| `frontend/src/components/layout/Sidebar.tsx` | Lock logic Warning System |
| `frontend/src/app/dashboard/page.tsx` | Dynamic health score card, lock Warning card |
| `frontend/src/app/dashboard/transactions/page.tsx` | Integrasi Model 2 (hapus lingkaran skor) |
| `frontend/src/app/dashboard/planning/page.tsx` | Integrasi Model 3 (quiz + fetch) |
| `frontend/src/app/dashboard/warnings/page.tsx` | Dynamic stats, guard page |
| `frontend/src/app/dashboard/chatbot/page.tsx` | Connect real API + financial_context |
