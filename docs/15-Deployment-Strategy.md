# Strategi Deployment CEAMIS

Dokumen ini merangkum strategi *deployment* untuk arsitektur *microservices* CEAMIS agar siap rilis secara publik (produksi). Karena sistem kita terbagi menjadi tiga *service* utama, kita akan menggunakan kombinasi platform hosting yang paling optimal.

## 1. Database (Supabase)
**Status:** ✅ Selesai (Sudah di-deploy)
* Database PostgreSQL dari Supabase sudah berada di *cloud*.
* Konfigurasi URL dan kunci otentikasi sudah diamankan di *Environment Variables*.

## 2. Frontend (Next.js)
**Platform Rekomendasi:** Vercel (Optimal & Gratis)
**Langkah Deployment:**
1. Login ke [Vercel.com](https://vercel.com/) menggunakan akun GitHub.
2. *Import* repositori GitHub CEAMIS.
3. Di bagian **Root Directory**, edit dan arahkan ke folder `frontend`.
4. Di bagian **Environment Variables**, salin semua isi dari `frontend/.env`.
   *(Penting: Nanti `NEXT_PUBLIC_API_URL` dan `NEXT_PUBLIC_AI_SERVICE_URL` harus diubah setelah backend di-deploy).*
5. Klik **Deploy**. Vercel akan menangani *build* Turbopack secara otomatis.

## 3. Main Backend (NestJS) & AI Service (FastAPI)
**Platform Rekomendasi:** Render.com atau Railway.app
*Catatan: Vercel tidak direkomendasikan untuk service ini karena Vercel menggunakan arsitektur Serverless yang kurang cocok untuk backend berjalan terus-menerus (long-running process) atau model ML bawaan.*

**Langkah Deployment (Contoh via Render):**
1. Login ke [Render.com](https://render.com/).
2. Buat **Web Service** baru untuk NestJS:
   * **Root Directory:** `backend`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start:prod`
   * Masukkan *Environment Variables* (Database URL, dll).
3. Buat **Web Service** baru untuk FastAPI:
   * **Root Directory:** `ai-service`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * Masukkan *Environment Variables* (Kunci API Gemini/Groq).

## 4. Finalisasi Integrasi (Sinkronisasi Endpoint)
Setelah Backend dan AI Service memiliki URL publik (contoh: `https://ceamis-api.onrender.com` dan `https://ceamis-ai.onrender.com`), Anda **WAJIB** kembali ke *dashboard* Vercel (Frontend) dan memperbarui *Environment Variables*:
* `NEXT_PUBLIC_API_URL` = URL Backend NestJS
* `NEXT_PUBLIC_AI_SERVICE_URL` = URL FastAPI

Lakukan *Redeploy* pada Vercel agar *Frontend* menggunakan URL *cloud* terbaru (bukan lagi *localhost*).
