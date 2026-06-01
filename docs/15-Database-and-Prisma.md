# CEAMIS Database & Prisma Architecture

Dokumen ini menjelaskan arsitektur database CEAMIS, integrasinya dengan Prisma ORM, serta pengelolaan status data pengguna melalui Server Actions Next.js.

## 1. Arsitektur Supabase & Multi-Schema

CEAMIS menggunakan **Supabase PostgreSQL** sebagai sistem basis data relasional. Secara *default*, Supabase memisahkan data ke dalam berbagai *schema*:
- **`auth`**: Dikelola secara internal oleh Supabase. Menyimpan informasi autentikasi pengguna (`auth.users`, sesi, identitas).
- **`public`**: Schema utama tempat aplikasi CEAMIS menyimpan seluruh entitas bisnis (Edukasi, Gamifikasi, Perencanaan Keuangan).

### Permasalahan *Foreign Key* Lintas Schema
Secara teknis, Prisma ORM tidak mendukung pembuatan relasi (Foreign Key) yang ketat antara tabel di `public` dan `auth` tanpa menyebabkan kompleksitas pada skema prisma, khususnya saat menggunakan *Connection Pooler* bawaan Supabase (`Transaction Mode`). 

**Solusi CEAMIS:** 
Semua tabel di dalam `public` yang membutuhkan relasi kepemilikan oleh pengguna menggunakan tipe data `String` biasa pada kolom `userId`. Nilai `userId` ini adalah UUID valid yang diambil langsung dari `auth.users` via Supabase SDK. Dengan begini, *foreign key constraint* secara eksplisit dilewati demi menjaga keandalan *Connection Pooler*, namun integritas logika *frontend* tetap terjamin.

## 2. Prisma ORM & Model Data

Prisma ORM bertugas sebagai lapisan antarmuka yang menghubungkan aplikasi Next.js ke database Supabase. Model Prisma (`schema.prisma`) untuk CEAMIS terbagi ke dalam dua domain utama:

### Domain Edukasi (Education)
Domain ini mengelola konten materi bacaan dan kuis, dikendalikan sepenuhnya melalui *Admin Dashboard*:
1. **`EducationModule`**: Induk utama untuk setiap modul materi finansial. Memiliki `title`, `desc`, dan poin (`points`).
2. **`EducationPage`**: Halaman-halaman isi (materi bacaan) yang terhubung (berelasi) langsung ke `EducationModule`.
3. **`EducationQuiz`**: Pertanyaan kuis dengan pilihan jawaban (JSON array di PostgreSQL) beserta `correctAnswer`. Terhubung ke `EducationModule`.

### Domain Perencanaan Keuangan & Gamifikasi (Planning)
Domain ini bersifat dinamis per-*user* dan dikendalikan melalui *User Dashboard*:
1. **`FinancialBudget`**: Menentukan batas anggaran bulanan spesifik untuk setiap `userId`.
2. **`FinancialTarget`**: Daftar tujuan finansial/tabungan yang ingin dicapai pengguna.
3. **`FinancialDebt`**: Daftar utang piutang pengguna yang bisa diatur jatuh tempo dan status pelunasannya.
4. **`RiskProfile`**: Menyimpan hasil evaluasi Profil Risiko dari AI (FastAPI) dan melampirkan rekomendasi.
5. **`GamificationBadge`**: Daftar lencana/piala yang tersedia secara global, diciptakan via *Admin*.

## 3. Alur Kerja (Workflow) Server Actions

CEAMIS mengimplementasikan pola **Next.js Server Actions** untuk seluruh proses Create, Read, Update, dan Delete (CRUD). 

### Sebelum Migrasi (Client-Side Storage)
Sebelum terhubung dengan Prisma, frontend CEAMIS mengandalkan `localStorage` browser untuk menyimpan data kuis, materi, utang, dll. Hal ini menyebabkan dua isu besar:
1. **Volatilitas Data:** Jika pengguna berganti *browser* atau perangkat, data mereka hilang.
2. **Keterbatasan Admin:** Perubahan modul Edukasi dari panel admin tidak akan menyebar secara instan ke *user* karena terisolasi di *local storage*.

### Setelah Migrasi (Prisma Server Actions)
Semua fungsi interaksi dengan API Prisma dienkapsulasi di dalam file actions (contoh: `src/app/admin/education/actions.ts` atau `src/app/dashboard/planning/actions.ts`). 
- **`"use server"`**: Penanda bahwa fungsi di dalamnya hanya berjalan di sisi server (Node.js). 
- **Keamanan**: Kredensial koneksi *database* (`DATABASE_URL`) tidak pernah ter-ekspos ke klien (browser).

```typescript
// Contoh implementasi di actions.ts
export async function getDebts(userId: string) {
  return await prisma.financialDebt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}
```
Ketika Client Component (seperti *Dashboard Utang*) memanggil fungsi di atas, Next.js mengirim HTTP POST tersembunyi ke server, dan merespons dengan data JSON.

## 4. Eksekusi Skema Supabase (Migration Workaround)

Karena Supabase mengunci *schema* tertentu dan ada RLS (Row Level Security), perintah otomatis seperti `npx prisma db push` dapat seringkali mengalami kegagalan izin (Permission Denied). 

Oleh karena itu, cara utama memperbarui skema *database* CEAMIS adalah:
1. Mendefinisikan tabel baru di `schema.prisma`.
2. Menjalankan `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` untuk menghasilkan sintaks SQL mentah (Raw SQL).
3. Mengeksekusi secara manual Raw SQL tersebut di dalam **Supabase SQL Editor**.
4. Terakhir, menjalankan `npx prisma generate` di sisi aplikasi Next.js untuk memperbarui tipe data *client* (TypeScript) yang mengenali skema terbaru.
