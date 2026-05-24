"""
FastAPI Entry Point — CEAMIS AI Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health_score

app = FastAPI(
    title="CEAMIS AI Service",
    description=(
        "AI backend untuk CEAMIS — menyediakan prediksi Health Score finansial, "
        "Chatbot Gen-Z, Edukasi Adaptif, dan Kuis via Generative AI."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS (izinkan frontend Next.js) ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ceamis.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(health_score.router, prefix="/api")

# Placeholder routers (akan diisi setelah Model 2, 3, dan Chatbot di-commit)
# app.include_router(chatbot.router, prefix="/api")
# app.include_router(recommendation.router, prefix="/api")
# app.include_router(risk_profile.router, prefix="/api")
# app.include_router(education.router, prefix="/api")


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CEAMIS AI Service",
        "version": "0.1.0",
        "status": "running",
        "endpoints": {
            "health_score": "/api/health-score",
            "health_score_info": "/api/health-score/info",
            "docs": "/docs",
        },
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}
