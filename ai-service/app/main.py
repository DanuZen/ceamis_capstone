<<<<<<< HEAD
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
=======
# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import (
    health_score, spending_cluster,
    risk_profile, recommendation,
    chatbot, education
)
from app.utils.preprocessor import load_risk_artifacts


# ── Startup: load model saat server mulai ─────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CEAMIS AI Service...")

    # Load Model 3 saat startup
    try:
        load_risk_artifacts()
        print("✅ Model 3 (Risk Profile) ready")
    except Exception as e:
        print(f"⚠️  Model 3 tidak bisa di-load: {e}")
        print("   Endpoint risk-profile akan return 503")

    # Nanti tambahkan model lain di sini setelah selesai:
    # load_health_artifacts()   ← Model 1
    # load_cluster_artifacts()  ← Model 2

    yield   # server berjalan

    print("👋 Shutting down CEAMIS AI Service...")


app = FastAPI(
    title      = "CEAMIS AI Service",
    description= "AI/ML service untuk CEAMIS Financial App",
    version    = "0.2.0",
    lifespan   = lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
)

# ── Register routers ──────────────────────────────────────
app.include_router(
    health_score.router,
    prefix="/api/v1",
    tags=["Model 1 - Health Score (Mock)"]
)
app.include_router(
    spending_cluster.router,
    prefix="/api/v1",
    tags=["Model 2 - Spending Cluster (Mock)"]
)
app.include_router(
    risk_profile.router,
    prefix="/api/v1",
    tags=["Model 3 - Risk Profile ✅ Real"]
)
app.include_router(
    recommendation.router,
    prefix="/api/v1",
    tags=["Recommendation Logic"]
)
app.include_router(
    chatbot.router,
    prefix="/api/v1",
    tags=["Model 4 - Chatbot ✅ Real"]
)
app.include_router(
    education.router,
    prefix="/api/v1",
    tags=["Adaptive Education ✅ Real"]
)
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee


@app.get("/", tags=["Root"])
async def root():
    return {
<<<<<<< HEAD
        "service": "CEAMIS AI Service",
        "version": "0.1.0",
        "status": "running",
        "endpoints": {
            "health_score": "/api/health-score",
            "health_score_info": "/api/health-score/info",
            "docs": "/docs",
        },
=======
        "service" : "CEAMIS AI Service",
        "version" : "0.2.0",
        "models"  : {
            "model_1_health_score"    : "mock",
            "model_2_spending_cluster": "mock",
            "model_3_risk_profile"    : "real ✅ (97.91% acc)",
            "model_4_chatbot"         : "real ✅",
            "education"               : "real ✅",
        }
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee
    }


@app.get("/health", tags=["Root"])
async def health_check():
<<<<<<< HEAD
    return {"status": "ok"}
=======
    return {"status": "ok"}
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee
