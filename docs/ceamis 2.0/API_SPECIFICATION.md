# Spesifikasi API Backend (FastAPI v1) — CEAMIS 2.0

> **Base URL:** `https://api.ceamis.app/api/v1` (atau `http://localhost:8000/api/v1` saat development)  
> **Autentikasi:** HTTP Bearer Token (`Authorization: Bearer <SUPABASE_JWT>`)  
> **Format Data:** `application/json` (kecuali upload struk `multipart/form-data`)  
> **Validasi:** Pydantic v2  

---

## 1. Standar Format Respons & Error

### 1.1 Respons Sukses (Standard Success Envelope)
```json
{
  "success": true,
  "data": {},
  "message": "Operasi berhasil diselesaikan"
}
```

### 1.2 Respons Error (Standard Error Envelope)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Detail pesan error yang terjadi",
    "details": []
  }
}
```

---

## 2. Ringkasan Endpoint

| Modul | Method | Endpoint | Deskripsi | Akses Role |
|---|---|---|---|---|
| **Auth** | `POST` | `/auth/login` | Login user/admin via Supabase | Publik |
| **Auth** | `POST` | `/auth/register` | Pendaftaran akun baru | Publik |
| **User** | `GET` | `/users/profile` | Ambil data profil & preferensi | User, Admin |
| **User** | `PUT` | `/users/profile` | Update profil (income, reset day) | User |
| **Transactions** | `GET` | `/transactions` | List transaksi dengan filter & paginasi | User |
| **Transactions** | `POST` | `/transactions` | Buat transaksi baru (manual/struk) | User |
| **Transactions** | `DELETE` | `/transactions/{id}` | Hapus transaksi | User |
| **Budgets** | `GET` | `/budgets` | Ambil pagu anggaran aktif bulan ini | User |
| **Budgets** | `POST` | `/budgets` | Buat atau perbarui limit anggaran | User |
| **Goals** | `GET` | `/goals` | List target tabungan aktif | User |
| **Goals** | `POST` | `/goals` | Buat target tabungan baru | User |
| **★ Pre-Purchase** | `POST` | `/pre-purchase/check` | **Fitur Inti:** Cek risiko rencana beli | User |
| **★ Pre-Purchase** | `POST` | `/pre-purchase/decide` | Catat aksi user (Lanjut/Ubah/Tunda) | User |
| **★ Pre-Purchase** | `POST` | `/pre-purchase/feedback` | Rekam feedback ground truth user | User |
| **AI / Health** | `POST` | `/predict/health-score` | Kalkulasi Skor Kesehatan (Rule-based) | User |
| **AI / OCR** | `POST` | `/ocr/parse-receipt` | Parsing teks foto struk via Gemini Flash | User |
| **Admin** | `GET` | `/admin/models` | List versi model ML & metrik | Admin |
| **Admin** | `POST` | `/admin/models/rollback` | Rollback ke model versi sebelumnya | Admin |
| **Admin** | `GET` | `/admin/audit-logs` | Tinjau log audit intervensi pra-beli | Admin |

---

## 3. Detail Endpoint Fitur Inti Pra-Pembelian (Pre-Purchase)

### 3.1 `POST /pre-purchase/check` (Cek Risiko Pra-Pembelian)
Menerima rencana belanja pengguna, mengekstrak 7 fitur kontekstual, melakukan inferensi risiko via model ML, dan menghitung dampak anggaran.

#### Request Body (`PrePurchaseCheckRequest`)
```json
{
  "category_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "planned_amount": 275000,
  "merchant_name": "Uniqlo Grand Indonesia",
  "notes": "Beli hoodie baru mumpung diskon"
}
```

#### Response Sukses (`200 OK`)
```json
{
  "success": true,
  "data": {
    "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
    "risk_score": 0.7845,
    "risk_level": "HIGH",
    "trigger_factors": [
      "Nominal belanja ini 2.4x lebih besar dari rata-rata pengeluaran Shopping Anda (Rp 115.000).",
      "Sisa anggaran Shopping bulan ini tinggal Rp 120.000 (15% dari total pagu).",
      "Transaksi ini berpotensi memicu overbudget sebesar Rp 155.000."
    ],
    "budget_impact": {
      "category_name": "Shopping",
      "budget_limit": 800000,
      "remaining_before": 120000,
      "remaining_after": -155000,
      "is_overbudget": true
    },
    "savings_impact": {
      "delayed_days": 6,
      "goal_title": "Dana Darurat 2026",
      "message": "Jika transaksi ini dilanjutkan, proyeksi capaian tabungan tertunda sekitar 6 hari."
    },
    "recommended_actions": [
      "POSTPONE",
      "ADJUST"
    ]
  },
  "message": "Evaluasi pra-pembelian selesai"
}
```

---

### 3.2 `POST /pre-purchase/decide` (Catat Keputusan Pengguna)
Merekam respon pengguna setelah melihat peringatan risiko.

#### Request Body
```json
{
  "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
  "decision": "POSTPONE",
  "adjusted_amount": null
}
```
*Pilihan `decision`:* `"PROCEED"` | `"ADJUST"` | `"POSTPONE"`

#### Response Sukses (`200 OK`)
```json
{
  "success": true,
  "data": {
    "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
    "status": "RECORDED",
    "decided_at": "2026-09-20T02:55:00Z"
  },
  "message": "Keputusan berhasil dicatat. Pilihan bijak untuk menunda belanja!"
}
```

---

### 3.3 `POST /pre-purchase/feedback` (Label Pasca-Keputusan)
Mengumpulkan label verifikasi dari pengguna 1–3 hari setelah transaksi untuk dataset evaluasi model berikutnya.

#### Request Body
```json
{
  "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
  "was_impulsive": true,
  "satisfaction_rating": 4,
  "feedback_notes": "Peringatan aplikasi sangat akurat, saya senang menundanya."
}
```

#### Response Sukses (`201 Created`)
```json
{
  "success": true,
  "message": "Terima kasih atas feedback Anda! Data ini membantu sistem semakin mengenali pola keuangan Anda."
}
```

---

## 4. Detail Endpoint OCR & Health Score

### 4.1 `POST /ocr/parse-receipt` (Smart Receipt Parsing)
Menerima teks hasil pengenalan Google ML Kit dari kamera mobile atau upload foto struk untuk diparsing ke JSON terstruktur oleh Gemini 2.0 Flash.

#### Request Body (`multipart/form-data` atau JSON)
```json
{
  "raw_text": "INDOMARET POINT\nJL SUDIRMAN NO 45\nROTI TAWAR 18.000\nSUSU ULTRA 1L 21.500\nTOTAL 39.500\nTGL: 19/09/2026",
  "image_url": null
}
```

#### Response Sukses (`200 OK`)
```json
{
  "success": true,
  "data": {
    "merchant_name": "Indomaret Point",
    "transaction_date": "2026-09-19T00:00:00Z",
    "total_amount": 39500,
    "suggested_category": "Groceries",
    "items": [
      { "name": "Roti Tawar", "price": 18000, "qty": 1 },
      { "name": "Susu Ultra 1L", "price": 21500, "qty": 1 }
    ],
    "confidence_score": 0.96
  }
}
```

---

### 4.2 `POST /predict/health-score` (Skor Kesehatan Finansial)
Kalkulasi deterministik 3 pilar:
$$\text{Score} = (0.40 \times \text{Savings Rate}) + (0.30 \times \text{Needs Compliance}) + (0.30 \times \text{Budget Adherence})$$

#### Response Sukses (`200 OK`)
```json
{
  "success": true,
  "data": {
    "health_score": 82,
    "status": "Sehat",
    "category": "Sehat",
    "breakdown": {
      "savings_ratio_score": 34.5,
      "needs_ratio_score": 25.0,
      "budget_adherence_score": 22.5
    },
    "feedback": "Kondisi finansial Anda prima! Porsi tabungan Anda mencapai 28% dari pendapatan bulan ini."
  }
}
```

---

## 5. Detail Endpoint Admin & Model Governance

### 5.1 `GET /admin/models`
Menampilkan daftar versi model yang pernah dilatih beserta metrik performanya.

```json
{
  "success": true,
  "data": [
    {
      "id": "c1f72a44-8839-4d91-bb27-729d4827d091",
      "version_tag": "v1.1.0-rf",
      "algorithm": "RandomForestClassifier",
      "precision": 0.8120,
      "recall": 0.7450,
      "f1_score": 0.7771,
      "is_active": true,
      "deployed_at": "2026-09-18T10:00:00Z"
    },
    {
      "id": "a90184b2-29df-4573-a192-8812cbb41244",
      "version_tag": "v1.0.0-logreg",
      "algorithm": "LogisticRegression",
      "precision": 0.7630,
      "recall": 0.7100,
      "f1_score": 0.7355,
      "is_active": false,
      "deployed_at": "2026-09-10T08:00:00Z"
    }
  ]
}
```

### 5.2 `POST /admin/models/rollback`
Melakukan *one-click rollback* ke model versi stabil sebelumnya jika terjadi regresi performa.

#### Request Body
```json
{
  "target_model_version_id": "a90184b2-29df-4573-a192-8812cbb41244",
  "reason": "False positive rate meningkat tajam pada kategori hiburan"
}
```
