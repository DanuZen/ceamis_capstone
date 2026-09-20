# CEAMIS 2.0 — Arsitektur Teknis Detail

> Dokumen ini menjelaskan arsitektur teknis detail CEAMIS 2.0 setelah revisi dosen.
> Menggantikan: `10-System-Architecture.md`, `14-Backend-Architecture.md`, `16-AI-Integration.md`

---

## 1. Stack Teknologi Final

### Backend (1 Aplikasi FastAPI Modular)

| Komponen | Teknologi | Catatan |
|---|---|---|
| Framework | **FastAPI** (Python 3.11+) | Menggantikan NestJS — semua logic di sini |
| Server | Uvicorn / Gunicorn | ASGI server |
| ORM | **SQLAlchemy 2.0** atau **Tortoise ORM** | Menggantikan Prisma (TypeScript) |
| Validasi | **Pydantic v2** | Built-in FastAPI |
| Auth | Supabase Auth SDK (Python) / `fastapi-users` | JWT-based |
| ML/AI | scikit-learn, pandas, numpy, joblib | Untuk model prediksi risiko |
| LLM | google-genai (Gemini 2.0 Flash) | Hanya untuk OCR parsing, **bukan chatbot** |
| Database | Supabase PostgreSQL | Via SQLAlchemy connection |
| Storage | Supabase Storage | Foto struk (retensi terbatas) |

### Mobile (Flutter — End User)

| Komponen | Teknologi |
|---|---|
| Framework | Flutter SDK (Dart) |
| State Management | Riverpod |
| Routing | GoRouter |
| Auth | supabase_flutter |
| Token Storage | flutter_secure_storage |
| OCR | google_mlkit_text_recognition (on-device) |
| Camera | image_picker |
| HTTP Client | Dio |
| Charts | fl_chart |

### Web (Next.js — Admin Dashboard Only)

| Komponen | Teknologi |
|---|---|
| Framework | Next.js (App Router) |
| Target | **Admin/Operator saja** — bukan end user |
| Fitur | Manajemen user, config, model versioning, audit log |

---

## 2. Struktur Folder Backend FastAPI (Target)

```
backend/                           ← 1 Aplikasi FastAPI Modular Tunggal (Python 3.11+)
├── app/
│   ├── main.py                    ← Entry point FastAPI
│   ├── config.py                  ← Settings, env vars
│   ├── database.py                ← SQLAlchemy/Tortoise connection
│   │
│   ├── auth/                      ← Autentikasi & otorisasi
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   └── dependencies.py        ← JWT guard, role check
│   │
│   ├── users/                     ← Profil pengguna
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   └── models.py              ← SQLAlchemy model
│   │
│   ├── transactions/              ← CRUD transaksi
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   └── models.py
│   │
│   ├── budgets/                   ← Manajemen anggaran & kategori
│   │   ├── router.py
│   │   ├── service.py
│   │   ├── schemas.py
│   │   └── models.py
│   │
│   ├── goals/                     ← Tujuan tabungan
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   │
│   ├── pre_purchase/              ← ★ FITUR INTI: Cek pra-pembelian
│   │   ├── router.py              ← POST /api/v1/pre-purchase/check
│   │   ├── service.py             ← Orkestrasi: model + dampak anggaran
│   │   ├── schemas.py             ← Input: nominal, kategori; Output: risk + dampak
│   │   └── models.py              ← Tabel pre_purchase_checks
│   │
│   ├── risk_model/                ← ★ Model prediksi risiko per-transaksi
│   │   ├── predictor.py           ← Inference: LogReg / RF / GBM
│   │   ├── trainer.py             ← Training pipeline
│   │   ├── features.py            ← Feature engineering
│   │   ├── schemas.py
│   │   └── models.py              ← Tabel risk_predictions, model_versions
│   │
│   ├── health_score/              ← Formula kesehatan finansial
│   │   ├── router.py
│   │   ├── calculator.py          ← Rule-based, threshold Sehat/Waspada/Boros
│   │   └── schemas.py
│   │
│   ├── ocr/                       ← OCR struk (proxy ke Gemini)
│   │   ├── router.py              ← POST /api/v1/ocr/parse-receipt
│   │   ├── service.py             ← Panggil Gemini Flash, parse JSON
│   │   └── schemas.py
│   │
│   ├── engagement/                ← Streak, badge, reminder
│   │   ├── router.py
│   │   ├── service.py
│   │   └── schemas.py
│   │
│   ├── education/                 ← Modul edukasi
│   │   ├── router.py
│   │   └── service.py
│   │
│   ├── admin/                     ← Admin-only endpoints
│   │   ├── router.py              ← Manajemen user, config, model, audit
│   │   ├── service.py
│   │   └── schemas.py
│   │
│   └── utils/                     ← Shared utilities
│       ├── llm_client.py          ← Gemini SDK (OCR only, bukan chatbot)
│       ├── supabase_client.py     ← Supabase connection
│       └── security.py            ← Encryption, hashing, audit helpers
│
├── artifacts/                     ← Model ML artifacts (.pkl, .joblib)
├── training/                      ← Training scripts & notebooks
├── tests/                         ← Unit & integration tests
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

## 3. Alur Fitur Inti: Pra-Pembelian

```
┌──────────────────────────────────────────────────────────────────┐
│                    ALUR PRA-PEMBELIAN                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User input rencana:                                          │
│     { nominal: 250000, kategori: "Shopping" }                    │
│                          │                                       │
│                          ▼                                       │
│  2. Feature engineering:                                         │
│     • nominal vs median kategori sama                            │
│     • rasio nominal ke sisa anggaran                             │
│     • frekuensi transaksi kategori                               │
│     • hari/waktu & jarak ke tanggal reset                        │
│     • dampak ke tujuan tabungan                                  │
│     • deviasi dari pola kebiasaan                                │
│                          │                                       │
│                          ▼                                       │
│  3. Prediksi model (LogReg/RF/GBM):                              │
│     → risk_score: 0.73                                           │
│     → risk_level: "Tinggi"                                       │
│     → faktor_pemicu: ["melebihi median 2x", "sisa anggaran 12%"]│
│                          │                                       │
│                          ▼                                       │
│  4. Tampilkan ke user:                                           │
│     ⚠️ Risiko Tinggi                                             │
│     • Alasan: ...                                                │
│     • Dampak ke anggaran: sisa Rp 150.000 dari Rp 400.000       │
│     • Dampak ke tabungan: target mundur 5 hari                   │
│                          │                                       │
│                          ▼                                       │
│  5. User pilih:                                                  │
│     [✅ Lanjut] [✏️ Sesuaikan] [⏸️ Tunda]                        │
│                          │                                       │
│                          ▼                                       │
│  6. Post-decision label:                                         │
│     "Apakah pembelian ini sesuai rencana anggaran?"              │
│     → Jadi label training untuk model (feedback loop)            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Model Prediksi Risiko — Spesifikasi Teknis

### Pendekatan
- **Baseline**: Ambang anggaran statis (rule sederhana, jadi pembanding)
- **Model kandidat**: Logistic Regression (interpretable) vs Random Forest / Gradient Boosting
- **Evaluasi**: Bandingkan keduanya, pilih yang lebih baik berdasarkan precision/recall

### Fitur Input Model

| # | Fitur | Deskripsi |
|---|---|---|
| 1 | `amount_ratio_median` | Nominal transaksi / median kategori sama |
| 2 | `budget_remaining_ratio` | Rasio nominal ke sisa anggaran |
| 3 | `category_frequency` | Frekuensi transaksi kategori dalam periode |
| 4 | `day_of_week` | Hari transaksi (encoded) |
| 5 | `days_to_reset` | Jarak hari ke tanggal reset anggaran |
| 6 | `savings_impact` | Dampak ke tujuan tabungan |
| 7 | `deviation_from_pattern` | Deviasi dari pola transaksi biasa |

### Split Data (KRUSIAL)
```
⚠️ BUKAN random split biasa!
Split HARUS per user & per waktu (temporal split) untuk mencegah data leakage.

Contoh:
  Training: data user A bulan 1-3, user B bulan 1-3
  Testing:  data user A bulan 4,   user B bulan 4
```

### Label Training
- Diberikan user **SETELAH** keputusan (post-decision)
- Pertanyaan: "Apakah pembelian ini sesuai rencana anggaran?"
- Respons: Ya/Tidak → menjadi label supervised learning

### Kalibrasi
1. **Cold start**: Model global (fitur dinormalisasi per user)
2. **Personalisasi**: Setelah data historis cukup → sesuaikan ambang per-user
3. **Kecukupan data**: Tentukan via learning curve, bukan angka arbitrer

---

## 5. API Endpoints (Target)

### Auth & User
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/v1/auth/login` | Login via Supabase |
| POST | `/api/v1/auth/register` | Register via Supabase |
| GET | `/api/v1/users/profile` | Get user profile |

### Transaksi & Anggaran
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET/POST | `/api/v1/transactions` | CRUD transaksi |
| GET/POST | `/api/v1/budgets` | CRUD anggaran |
| GET/POST | `/api/v1/goals` | CRUD tujuan tabungan |

### ★ Pra-Pembelian (Fitur Inti)
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/v1/pre-purchase/check` | Cek risiko sebelum beli |
| POST | `/api/v1/pre-purchase/decide` | Catat keputusan (lanjut/sesuaikan/tunda) |
| POST | `/api/v1/pre-purchase/feedback` | Label pasca-keputusan |

### AI & Analytics
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/v1/predict/health-score` | Health Score (formula) |
| POST | `/api/v1/ocr/parse-receipt` | OCR struk via Gemini |

### Engagement
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/engagement/summary` | Ringkasan mingguan |
| GET | `/api/v1/engagement/streaks` | Status streak |

### Admin (Khusus Admin Role)
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/v1/admin/users` | List users |
| GET | `/api/v1/admin/models` | Model versions & metrics |
| POST | `/api/v1/admin/models/rollback` | Rollback model |
| GET | `/api/v1/admin/audit-log` | Audit log |

---

> **Terakhir diperbarui:** 20 September 2026
