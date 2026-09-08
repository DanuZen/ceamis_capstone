# Arsitektur Sistem & Tech Stack — CEAMIS 2.0

Dokumen ini mendokumentasikan arsitektur sistem *microservices monorepo* CEAMIS, mencakup fondasi versi 1.0 (Web) dan ekspansi versi 2.0 (Mobile App & Smart OCR).

---

## 1. Diagram Topologi Arsitektur

```text
                               ┌─────────────────────────────────────────┐
                               │           CLIENT LAYER (FRONTEND)       │
                               ├────────────────────┬────────────────────┤
                               │    Flutter Mobile  │    Next.js Web     │
                               │  (Android & iOS)   │  (App Router v16)  │
                               └─────────┬──────────┴─────────┬──────────┘
                                         │                    │
                                         ▼                    ▼
                               ┌─────────────────────────────────────────┐
                               │          API GATEWAY (NestJS)           │
                               │   Host: Hugging Face Spaces (Port 7860) │
                               │   CI/CD: GitHub Actions Subtree Push    │
                               └─────────┬──────────┬─────────┬──────────┘
                                         │          │         │
                        ┌────────────────┘          │         └────────────────┐
                        ▼                           ▼                          ▼
           ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
           │     DATABASE & BAAS     │ │     AI MICROSERVICE     │ │     GEN-AI SERVICES     │
           │     (Supabase Cloud)    │ │    (FastAPI Python)     │ │   (Google & Groq API)   │
           ├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
           │ • PostgreSQL Relational │ │ • Model 1: Health Score │ │ • Gemini 2.0 Flash (OCR)│
           │ • Supabase GoTrue Auth  │ │ • Model 2: K-Means      │ │ • Gemini 2.0 (Chatbot)  │
           │ • AWS Pooler (Port 6543)│ │ • Model 3: Risk Profile │ │ • Groq Llama 3 Fallback │
           │ • Supabase Storage      │ │ • Host: Hugging Face    │ │                         │
           └─────────────────────────┘ └─────────────────────────┘ └─────────────────────────┘
```

---

## 2. Rincian Komponen Layanan

### A. Client Layer (Antarmuka Pengguna)
1. **Web App (`frontend/`):**
   * **Framework:** Next.js 16 (App Router), React 19, TypeScript.
   * **Styling:** Neo-Brutalism Design System dengan CSS Variables terkurasi.
   * **ORM / Direct Query:** Prisma ORM terhubung ke Supabase Transaction Pooler (Port 6543).
   * **Hosting:** Vercel Production (`https://ceamis-capstone.vercel.app`).
2. **Mobile App (`mobile/` — CEAMIS 2.0):**
   * **Framework:** Flutter SDK (Dart) untuk Android dan iOS.
   * **State Management:** Riverpod / Bloc.
   * **On-device AI:** Google ML Kit Text Recognition untuk ekstraksi teks struk belanja.
   * **Storage Kredensial:** `flutter_secure_storage`.

### B. Core Backend API (`backend/`)
* **Framework:** NestJS (Node.js) dengan TypeScript.
* **Peran:** API Gateway utama melayani data transaksi, profil user, onboarding, warning rules, dan proxy komunikasi ke FastAPI/Gemini.
* **Deployment:** Hugging Face Spaces Docker SDK (`https://danuzen-ceamis-backend.hf.space/api/v1`).
* **Otomatisasi:** Terhubung dengan GitHub Actions (`.github/workflows/deploy-backend.yml`).

### C. Database & BaaS (`Supabase`)
* **Database Engine:** PostgreSQL (AWS Tokyo `ap-northeast-1`).
* **Connection Pooling:** Supabase AWS Pooler pada port `6543` (`?pgbouncer=true`).
* **Layanan:** Autentikasi JWT terpusat, migrasi database, dan *Storage Buckets* untuk foto struk.

### D. AI Microservice (`ai-service/`)
* **Framework:** FastAPI (Python 3.11) dengan Uvicorn server.
* **Pustaka ML:** Scikit-Learn, TensorFlow/Keras, NumPy, Pandas, Joblib.
* **Model yang Dilayani:**
  * *Model 1:* Financial Health Score (Formula-based deterministik + XAI).
  * *Model 2:* Spending Pattern Clustering (K-Means Clustering).
  * *Model 3:* Risk Profile Classifier (Scikit-Learn Classifier, akurasi 97.91%).
* **Deployment:** Hugging Face Spaces (`https://mtaufiqulhakim-ceamis-ai-service.hf.space`).

---

## 3. Protokol & Kontrak Komunikasi

* **Client $\rightarrow$ Backend NestJS:** RESTful API via HTTPS dengan Authorization Header `Bearer <JWT_TOKEN>`.
* **Backend NestJS $\rightarrow$ AI Service:** HTTP POST internal payload JSON via `@nestjs/axios`.
* **Backend NestJS $\rightarrow$ Google Gemini:** Google GenAI SDK untuk pemrosesan teks OCR struk dan Chatbot CAMI.
* **Next.js Web $\rightarrow$ Supabase Database:** Prisma Client via Connection Pooler Port 6543 untuk data modul & kuis edukasi.

