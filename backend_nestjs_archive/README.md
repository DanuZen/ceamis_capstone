---
title: CEAMIS Backend
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# CEAMIS Backend — NestJS API

REST API untuk platform manajemen keuangan CEAMIS, dibangun dengan NestJS dan Supabase.

## Endpoints

- `GET /api/v1` — Health check
- `POST /api/v1/auth/login` — Autentikasi pengguna
- `GET /api/v1/transactions` — Data transaksi
- `GET /api/v1/users` — Data pengguna
- `POST /api/v1/onboarding` — Onboarding profil
- `GET /api/v1/warnings` — Warning system
- `GET /api/v1/ai` — Proxy ke AI Service

## Tech Stack

- **Framework:** NestJS (Node.js)
- **Database:** Supabase (PostgreSQL)
- **Port:** 7860
