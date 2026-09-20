# 08 — Frontend Theme: Neo-Brutalism Game Style

## Ringkasan Tema

CEAMIS menggunakan gaya desain **Neo-Brutalism** — terinspirasi dari tampilan [Saweria.co](https://saweria.co) yang playful, colorful, dan bertema game. Gaya ini dipilih karena:

- **Relevan dengan target user Gen-Z** (18–25 tahun)
- **Fun & engaging** — membuat aktivitas keuangan terasa seperti bermain game
- **Mudah dikenali** — visual yang bold dan unik di antara aplikasi keuangan lain
- **Accessible** — kontras tinggi, teks besar, navigasi jelas

---

## Referensi Visual

Desain CEAMIS mengambil inspirasi dari elemen kunci Saweria:

| Elemen | Saweria | CEAMIS |
|--------|---------|--------|
| Color palette | Pastel per-section | ✅ Sama (teal, biru, hijau, ungu, pink, oranye) |
| Border | Hitam tebal (~2-3px) | ✅ 2.5px solid black |
| Shadow | Hard shadow (offset, no blur) | ✅ `4px 4px 0px #1A1A1A` |
| Card style | Rounded corners, warna-warni | ✅ 12px radius, warna per-fitur |
| Typography | Rounded, friendly | ✅ Quicksand (heading) + Inter (body) |
| Nuansa | Playful, karakter kartun | ✅ Emoji sebagai icon, bahasa casual |

---

## Color Palette

### Brand Colors
| Token | Warna | Hex | Kegunaan |
|-------|-------|-----|----------|
| `--color-primary` | Kuning-Oranye | `#EFA32D` | CTA utama, brand identity |
| `--color-primary-hover` | Oranye Gelap | `#D9901E` | Hover state primary |
| `--color-primary-light` | Kuning Pucat | `#FFF3DC` | Background active sidebar |

### Pastel Palette (Fitur-Specific)
| Token | Hex | Fitur |
|-------|-----|-------|
| `--color-teal` | `#9FD0D1` | AI Insight / Overview |
| `--color-blue` | `#92BCEB` | Chatbot / Notifikasi |
| `--color-green` | `#C6E2B9` | Transaksi / Pemasukan |
| `--color-purple` | `#B9A9D9` | Gamifikasi |
| `--color-pink` | `#F9A7A7` | Warning / Pengeluaran |
| `--color-orange` | `#F5C882` | Edukasi |
| `--color-yellow` | `#F9E07F` | Streak / Highlight |
| `--color-mint` | `#A8E6CF` | Success accent |

### Neutral Colors
| Token | Hex | Kegunaan |
|-------|-----|----------|
| `--color-bg` | `#F5F3EE` | Background utama |
| `--color-surface` | `#FFFFFF` | Card / component surface |
| `--color-border` | `#1A1A1A` | Border utama (hitam tebal) |
| `--color-text` | `#1A1A1A` | Teks utama |
| `--color-text-muted` | `#6B7280` | Teks sekunder |
| `--color-text-light` | `#9CA3AF` | Placeholder / disabled |

---

## Typography

| Level | Font | Weight | Size | Penggunaan |
|-------|------|--------|------|------------|
| H1 | Quicksand | 700 | 1.75rem | Judul halaman |
| H2 | Quicksand | 700 | 1.25rem | Sub-judul section |
| H3 | Quicksand | 700 | 1.125rem | Card title |
| Body | Inter | 400 | 0.9375rem | Teks konten |
| Small | Inter | 400 | 0.8125rem | Caption, timestamp |
| Button | Quicksand | 700 | 1rem | Button text |
| Badge | Quicksand | 600 | 0.75rem | Badge/tag text |

---

## Komponen Utama

### 1. Brutal Card
Kartu utama dengan border hitam tebal dan hard shadow.

```css
.card-brutal {
  border: 2.5px solid #1A1A1A;
  border-radius: 12px;
  box-shadow: 4px 4px 0px #1A1A1A;
  padding: 1.5rem;
}
```

**Variasi warna:**
- `.card-brutal--teal` — AI Insight
- `.card-brutal--blue` — Chatbot
- `.card-brutal--green` — Transaksi
- `.card-brutal--purple` — Gamifikasi
- `.card-brutal--pink` — Warning
- `.card-brutal--orange` — Edukasi
- `.card-brutal--yellow` — Streak / Highlight

**Interaksi:**
- Hover: translate(-2px, -2px), shadow membesar
- Active/Click: translate(2px, 2px), shadow mengecil → efek "pressed"

### 2. Brutal Button
Tombol dengan efek pressed game-like.

```css
.btn-brutal {
  border: 2.5px solid #1A1A1A;
  border-radius: 8px;
  box-shadow: 4px 4px 0px #1A1A1A;
  font-family: Quicksand, sans-serif;
  font-weight: 700;
}
```

**Variasi:**
- `--primary` (kuning), `--secondary` (putih), `--danger` (pink), `--success` (hijau), `--ghost` (transparan)
- `--sm`, `--lg` untuk ukuran

### 3. Brutal Input
Input field dengan border tebal.

```css
.input-brutal {
  border: 2.5px solid #1A1A1A;
  border-radius: 8px;
  box-shadow: 2px 2px 0px #1A1A1A;
}
```

### 4. Progress Bar (HP Bar Style)
Bar progress bergaya HP bar game dengan efek shine.

### 5. Chat Bubble
Bubble chat dengan style Neo-Brutalism untuk chatbot.

### 6. Leaderboard Item
Item leaderboard dengan warna emas/perak/perunggu.

### 7. Badge
Tag/badge kecil untuk status dan label.

---

## Animasi

| Nama | Durasi | Kegunaan |
|------|--------|----------|
| `bounce-in` | 0.4s | Card muncul pertama kali |
| `slide-up` | 0.4s | Item list masuk (stagger) |
| `shake` | 0.5s | Error / warning feedback |
| `pulse-glow` | 2s (loop) | CTA highlight |
| `float` | 3s (loop) | Dekorasi emoji |

**Stagger children:** Setiap child element dalam `.stagger-children` diberi delay 80ms sehingga muncul satu per satu.

---

## Layout System

### Landing Page
- Full-width, no sidebar
- Section-based vertical scroll
- Navbar sederhana (logo + CTA)

### Dashboard
- Sidebar kiri (260px) — navigasi fitur
- Top navbar (64px) — judul + user info
- Main content area — scrollable
- Responsive: sidebar tersembunyi di mobile (< 768px)

---

## Mapping Warna per Fitur

| Fitur | Warna Utama | Alasan |
|-------|-------------|--------|
| Dashboard/Overview | Putih + campuran | Netral, menampilkan semua |
| Pencatatan Transaksi | 🟢 Hijau | Hijau = uang, positif |
| AI Insight & XAI | 🔵 Teal | Teal = teknologi, kepercayaan |
| Gamifikasi | 🟣 Ungu | Ungu = achievement, gaming |
| Warning System | 🔴 Pink | Pink/merah = peringatan, urgensi |
| Chatbot AI | 🔵 Biru | Biru = komunikasi, AI |
| Edukasi | 🟠 Oranye | Oranye = belajar, semangat |

---

## Do's and Don'ts

### ✅ Do's
- Gunakan warna pastel dari palette yang sudah ditentukan
- Selalu pakai border hitam tebal pada card, button, dan input
- Pakai Quicksand untuk heading, Inter untuk body text
- Tambahkan emoji pada judul dan label untuk nuansa playful
- Gunakan bahasa casual Gen-Z pada copy/text
- Beri efek hover dan active pada semua elemen interaktif

### ❌ Don'ts
- Jangan pakai warna di luar palette tanpa persetujuan
- Jangan hapus border atau shadow dari komponen brutal
- Jangan pakai font lain selain Quicksand dan Inter
- Jangan buat desain terlalu formal/corporate
- Jangan pakai blur shadow (selalu hard shadow)
- Jangan buat animasi lebih dari 0.5s (kecuali loop dekoratif)

---

## File & Folder Terkait

```
frontend/src/
├── app/
│   ├── globals.css           ← Design system & tokens
│   ├── layout.tsx            ← Root layout + font
│   ├── page.tsx              ← Landing page
│   ├── auth/page.tsx         ← Login/register
│   └── dashboard/
│       ├── layout.tsx        ← Dashboard layout (sidebar + navbar)
│       ├── page.tsx          ← Dashboard home
│       ├── transactions/     ← Pencatatan transaksi
│       ├── gamification/     ← Streak, badge, leaderboard
│       ├── warnings/         ← Warning system
│       ├── chatbot/          ← AI Chatbot
│       └── education/        ← Edukasi adaptif
└── components/
    └── layout/
        ├── Sidebar.tsx       ← Sidebar navigasi
        └── Navbar.tsx        ← Top navbar
```

---

_Dokumen ini adalah panduan tema visual frontend CEAMIS. Semua developer frontend wajib mengikuti guideline ini untuk menjaga konsistensi desain._
