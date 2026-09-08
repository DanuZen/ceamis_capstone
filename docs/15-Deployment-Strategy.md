# Strategi Deployment CEAMIS
 
Dokumen ini merangkum strategi *deployment* untuk arsitektur *monorepo microservices* CEAMIS yang aktif di lingkungan produksi:
 
## 1. Database (Supabase Cloud)
**Status:** ✅ Selesai (Aktif)
* **Provider:** Supabase PostgreSQL di AWS Tokyo (`ap-northeast-1`).
* **Connection Pooling:** Menggunakan Supabase AWS Pooler pada **Port 6543** (`Transaction Mode`) dengan flag `?pgbouncer=true` untuk integrasi Prisma ORM Next.js yang optimal.
* **Autentikasi & Penyimpanan:** Supabase GoTrue Auth API dan Table Storage terpusat.
 
## 2. Frontend Web (Next.js)
**Status:** ✅ Selesai (Aktif)
* **Platform:** Vercel (`https://ceamis-capstone.vercel.app`)
* **Integrasi:** Terhubung langsung ke repositori GitHub Monorepo (`DanuZen/ceamis_capstone`) dengan *Root Directory* diarahkan ke folder `frontend`.
* **CI/CD:** Setiap commit yang di-push ke branch `main` pada folder `frontend/**` otomatis memicu pipeline build dan deploy di Vercel.
 
## 3. Main Backend (NestJS API)
**Status:** ✅ Selesai (Aktif)
* **Platform:** Hugging Face Spaces Docker SDK (`https://huggingface.co/spaces/DanuZen/ceamis-backend`)
* **Port Layanan:** `7860` (Standar Hugging Face Spaces)
* **CI/CD Otomatis (GitHub Actions):** 
  * File workflow: `.github/workflows/deploy-backend.yml`
  * Setiap push ke branch `main` di GitHub yang mengubah folder `backend/**`, GitHub Actions otomatis mengekstrak subtree folder `backend/` dan mem-push-nya ke branch `master` Space Hugging Face menggunakan Secret `HF_TOKEN`.
  * Pengembang tidak perlu lagi mengelola git repo terpisah di lokal.
 
## 4. AI Microservice (FastAPI & Machine Learning)
**Status:** ✅ Selesai (Aktif)
* **Platform:** Hugging Face Spaces Docker SDK (`https://huggingface.co/spaces/mtaufiqulhakim/ceamis-ai-service`)
* **Port Layanan:** `7860` (Standar Hugging Face Spaces)
* **Model yang Dilayani:**
  * Model 1: Financial Health Score (Formula-based + XAI)
  * Model 2: Spending Pattern Clustering (K-Means ML)
  * Model 3: Risk Profile Classifier (Scikit-Learn ML)
  * Model 4: Chatbot CAMI (Google Gemini 2.0 Flash + Groq Llama 3.1 fallback)
* **Catatan Environment Secrets:** `GEMINI_API_KEY` dan `GROQ_API_KEY` dikonfigurasi melalui menu *Settings > Variables and secrets* di Hugging Face Space.
 
## 5. Ringkasan Sinkronisasi Environment Variables
 
| Service | Environment Variable Kunci | Nilai Produksi |
| :--- | :--- | :--- |
| **Frontend** | `NEXT_PUBLIC_BACKEND_URL` | `https://danuzen-ceamis-backend.hf.space/api/v1` |
| **Frontend** | `NEXT_PUBLIC_AI_SERVICE_URL` | `https://mtaufiqulhakim-ceamis-ai-service.hf.space` |
| **Frontend** | `DATABASE_URL` | `postgresql://...@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| **Backend** | `AI_SERVICE_URL` | `https://mtaufiqulhakim-ceamis-ai-service.hf.space` |
| **Backend** | `SUPABASE_URL` | `https://ekgzrqxygukenlmnhbhc.supabase.co` |

