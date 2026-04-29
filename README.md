# CEAMIS

**Ekosistem Pencatatan Keuangan Gen-Z Berbasis AI, Gamifikasi, & Edukasi Adaptif**

"Cerdas Finansial, Kontrol Impuls, Raih Masa Depan"

---

## Tentang

CEAMIS adalah platform pencatatan keuangan untuk Gen-Z Indonesia, menggabungkan AI (insight, XAI, chatbot), gamifikasi (streak, badge, leaderboard), dan edukasi finansial adaptif. Dirancang untuk membangun kebiasaan finansial sehat secara fun, interaktif, dan relevan.

## Tech Stack

| Layer       | Teknologi                                                |
| ----------- | -------------------------------------------------------- |
| Frontend    | Next.js, Vite, TypeScript, TailwindCSS, D3.js, Mapbox GL |
| Backend API | Express.js, TypeScript, Zod, PostgreSQL, Redis           |
| Backend AI  | FastAPI, Python, TensorFlow, scikit-learn                |
| Database    | PostgreSQL + PostGIS + TimescaleDB, Redis                |
| DevOps      | Docker, GitHub Actions, Vercel, Railway                  |

## Struktur Project

```
ceamis/
├── frontend/              # Next.js/Vite — dashboard & UI
├── backend/               # Express.js — REST API & auth
├── ai-service/            # FastAPI — AI/ML services
├── docs/                  # Dokumentasi arsitektur & API
├── infrastructure/        # Docker, deployment scripts
└── .github/               # Copilot instructions, CI/CD workflows
```

## Getting Started

1. Clone repo & install dependencies di tiap service
2. Copy .env.example → .env di tiap service
3. Jalankan database: `docker compose -f infrastructure/docker/docker-compose.yml up -d`
4. Jalankan service di terminal terpisah:
   - frontend: `npm run dev`
   - backend: `npm run dev`
   - ai-service: `uvicorn src.main:app --reload`

## Konvensi

- Bahasa Indonesia untuk kode, komentar, dan dokumentasi
- Feature-based folder structure
- Semua dependencies wajib 0 vulnerabilities

## Dokumentasi

Lihat folder `docs/` untuk urutan dan penjelasan lengkap dokumentasi arsitektur, API, dan proses pengembangan.

## Lisensi

MIT# CEAMIS Project Documentation

Selamat datang di repositori CEAMIS (Control Every Awful Money Impulse System)!

## Deskripsi Singkat

CEAMIS adalah ekosistem pencatatan keuangan berbasis AI dan gamifikasi, dirancang khusus untuk Gen-Z Indonesia. Proyek ini bertujuan membangun kebiasaan finansial sehat melalui pendekatan fun, interaktif, dan adaptif.

---

## Urutan Dokumentasi Utama

| No  | Nama File                        | Deskripsi Singkat                                                 |
| --- | -------------------------------- | ----------------------------------------------------------------- |
| 00  | 00-master-requirements.md        | Daftar kebutuhan utama (master requirements) seluruh sistem       |
| 01  | 01-product-blueprint.md          | Blueprint produk: visi, value proposition, dan gambaran solusi    |
| 02  | 02-technical-architecture.md     | Arsitektur teknis: diagram sistem, integrasi, dan komponen utama  |
| 03  | 03-implementation-roadmap.md     | Roadmap implementasi: tahapan, milestone, dan timeline            |
| 04  | 04-approval-signoff-checklist.md | Checklist persetujuan dan sign-off sebelum go-live                |
| 05  | 05-backend-architecture.md       | Detail arsitektur backend: API, database, service, dan skema data |
| 06  | 06-api-endpoints.md              | Daftar endpoint API beserta penjelasan fungsinya                  |
| 07  | 07-frontend-architecture.md      | Detail arsitektur frontend, struktur folder, dan framework        |
| 08  | 08-testing-strategy.md           | Strategi pengujian (unit, integration, UAT) dan coverage          |
| 09  | 09-deployment-guide.md           | Panduan deployment ke staging/production                          |
| 10  | 10-maintenance-plan.md           | Rencana maintenance dan update sistem                             |

---

## Struktur Folder

- `/frontend` — Next.js, Vite, Tailwind (UI)
- `/backend` — Express.js, TypeScript (API)
- `/ai-service` — FastAPI, TensorFlow (AI)
- `/docs` — Dokumentasi proyek

---

## Cara Kontribusi

1. Fork & clone repo
2. Buat branch baru dari `dev`
3. Commit dengan format: `[type] deskripsi singkat`
4. Buat Pull Request ke `dev` (wajib review)

---

## Kontak & Tim

Lihat file `Team-Structure-Jobdesk.md` pada folder `docs` untuk detail struktur tim dan kontak.

---

## Lisensi

Proyek ini menggunakan lisensi MIT.
