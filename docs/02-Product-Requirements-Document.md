# Product Requirements Document (PRD) – CEAMIS

## Executive Summary

Literasi keuangan di kalangan Gen-Z masih menjadi tantangan besar, ditandai dengan perilaku impulsif dalam pengelolaan uang, minimnya pencatatan keuangan, dan kurangnya edukasi finansial yang relevan. CEAMIS (Control Every Awful Money Impulse System) hadir sebagai solusi ekosistem pencatatan keuangan berbasis AI dan gamifikasi, dirancang khusus untuk Gen-Z. Dengan pendekatan komunikatif khas Gen-Z, CEAMIS menggabungkan teknologi AI, fitur explainable AI (XAI), dan elemen gamifikasi untuk membangun kebiasaan finansial sehat secara fun, interaktif, dan adaptif.

## User Personas

| Persona        | Usia  | Status       | Karakteristik Utama                                      |
| -------------- | ----- | ------------ | -------------------------------------------------------- |
| Mahasiswa      | 18-23 | Aktif kuliah | Sering impulsif, suka challenge, ingin belajar finansial |
| Fresh Graduate | 22-25 | Baru kerja   | Mulai mandiri finansial, suka insight instan, tech-savvy |

## Functional Requirements

1. **Sistem Autentikasi**
   - Guest mode (tanpa login, fitur terbatas)
   - User mode (login/register, akses penuh)
2. **Modul Pencatatan Transaksi & Digital Ledger**
   - Input pemasukan, pengeluaran, kategori custom
   - Digital ledger utang-piutang (tracking, reminder)
3. **Dashboard Analitik Berbasis AI + XAI**
   - Insight keuangan otomatis
   - Penjelasan AI (XAI) yang mudah dipahami
4. **Fitur Gamifikasi**
   - Daily streaks (reward konsistensi)
   - Dynamic badge (achievement progresif)
   - Leaderboard (kompetisi antar pengguna)
5. **Gen-Z Warning System**
   - Notifikasi sarkas/roasting berbasis Generative AI
   - Pesan personal, lucu, dan relatable
6. **AI Financial Chatbot & Modul Edukasi Adaptif**
   - Chatbot konsultasi keuangan
   - Materi edukasi yang menyesuaikan kebutuhan pengguna

## Non-Functional Requirements

- **Keamanan Data**: Enkripsi data, autentikasi JWT, proteksi API
- **Responsivitas UI**: Vite + Tailwind CSS untuk performa dan mobile-first
- **Skalabilitas API**: Backend Express, modular, siap scale-out

## Tech Stack

| Layer    | Teknologi                               |
| -------- | --------------------------------------- |
| Frontend | Next.js, TypeScript, Vite, Tailwind CSS |
| Backend  | Express.js (API), FastAPI (AI Service)  |
| Database | PostgreSQL                              |
| AI/ML    | TensorFlow, Python                      |

## User Flow

1. Pengguna masuk (guest/user)
2. Mencatat transaksi harian
3. Mendapat insight AI & XAI di dashboard
4. Mendapat notifikasi Gen-Z Warning System
5. Berinteraksi dengan chatbot & edukasi
6. Mendapat reward gamifikasi (streak, badge, leaderboard)

## Success Metrics

- Akurasi model AI ≥ 85%
- Peningkatan retensi pengguna (streak ≥ 7 hari)
- Engagement fitur gamifikasi (≥ 60% user aktif mingguan)
- Feedback positif pada fitur XAI & chatbot

---

_Dokumen ini disusun dengan gaya profesional, namun tetap membawa semangat Gen-Z: fun, sarkas, dan adaptif!_
