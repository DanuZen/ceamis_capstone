# 07-Frontend Architecture

## Ringkasan Pembagian Fungsi Frontend CEAMIS

### 1. Landing Page: Etalase & Branding
Halaman publik untuk memperkenalkan CEAMIS kepada calon pengguna. Fokus utama:
- **Identitas Produk:** Menjelaskan tema "Revolusi Fintech" untuk Gen Z.
- **Unique Tone:** Gaya bahasa sarkas/roasting yang membedakan CEAMIS dari aplikasi keuangan lain.
- **Edukasi Adaptif:** Cuplikan konten edukasi finansial untuk menarik pengguna baru.
- **Keamanan & Privasi:** Penjelasan kebijakan privasi yang ringan dan transparan.

### 2. Dashboard: Pusat Operasional & AI
Setelah login, pengguna mengakses dashboard berisi seluruh alat kontrol finansial:
- **Pencatatan Keuangan:** Input transaksi harian, manajemen utang-piutang, Digital Ledger.
- **Analisis AI (XAI):** Skor kesehatan finansial + penjelasan logika (explainable AI).
- **Fitur Gamifikasi:** Daily Streaks, Badge, Leaderboard untuk menjaga konsistensi.
- **Interaksi Real-time:** Chatbot finansial & Recovery Plan jika keuangan kritis.
- **Warning System:** Notifikasi pengeluaran impulsif.

### 3. Implementasi Teknis
Frontend dikembangkan dengan Next.js (App Router) + Tailwind CSS. Transisi mulus antara Landing Page dan Dashboard. Dashboard memanggil data real-time via Axios/React Query ke backend.

---

# Role & Hak Akses

| Role        | Hak Akses                                                                                      |
|-------------|-----------------------------------------------------------------------------------------------|
| Guest       | Eksplorasi fitur dasar, onboarding, tidak bisa simpan data                                     |
| User        | Semua fitur utama: transaksi, dashboard AI, gamifikasi, notifikasi, chatbot, profil           |
| Admin       | Monitoring, manajemen user, validasi konten, laporan                                           |
| Super Admin | Semua akses admin + pengaturan sistem, audit, deployment                                       |

---

# Struktur Folder (Feature-Based)
```
frontend/
├── public/
├── src/
│   ├── features/
│   │   ├── auth/           # Login, register, guest mode
│   │   ├── transactions/   # Pencatatan pemasukan/pengeluaran
│   │   ├── dashboard/      # Dashboard AI, insight, XAI
│   │   ├── gamification/   # Streak, badge, leaderboard
│   │   ├── notifications/  # Gen-Z warning system, notifikasi sarkas
│   │   ├── chatbot/        # Chatbot edukasi finansial
│   │   ├── profile/        # Pengaturan user, preferensi
│   │   ├── admin/          # Fitur dashboard & tools admin
│   │   └── superadmin/     # Pengaturan sistem, audit, dsb
│   ├── components/         # UI reusable (Button, Card, Modal, dsb)
│   ├── layouts/            # Layout utama, dashboard, auth
│   ├── pages/              # Routing Next.js
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Helper & utilitas
│   └── styles/             # Global style/theme
├── .env.example
└── tailwind.config.js
```

---

# User Flow Singkat
1. Landing Page (publik)
2. Onboarding → Pilih guest/user
3. Login/Register (jika user)
4. Dashboard utama (AI insight, saldo, progress)
5. Catat transaksi
6. Dapat notifikasi/gen-z warning
7. Lihat leaderboard/gamifikasi
8. Interaksi dengan chatbot
9. Atur profil & preferensi

---

# Komponen Kunci
- Role-based Navbar/Sidebar
- ProtectedRoute
- AdminPanel, UserDashboard, GuestLanding
- Card Insight, Chart Keuangan, Modal Input Transaksi
- Badge, Progress Bar, Notification Toast
- Chatbot Widget
