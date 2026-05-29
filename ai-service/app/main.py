"""
FastAPI Entry Point — CEAMIS AI Service v0.2.1
Catatan: health_score endpoint dinonaktifkan sementara jika
         TensorFlow artifacts (model .keras) tidak tersedia.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import (
    spending_cluster, risk_profile, recommendation, chatbot, education, dashboard_insight
)

# Lazy import health_score (butuh TF — skip jika tidak tersedia)
health_score = None
try:
    from app.api import health_score as hs_module
    health_score = hs_module
    print("[OK] health_score module loaded")
except Exception as e:
    print(f"[WARN] health_score module tidak bisa di-load: {e}")
    print("       Endpoint /predict/health-score akan return mock data")

# Risk Profile artifacts
try:
    from app.utils.preprocessor import load_risk_artifacts
    _load_risk = load_risk_artifacts
except Exception:
    _load_risk = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CEAMIS AI Service...")

    # Model 3 — Risk Profile (Memuat model riil langsung ke dalam cache RAM)
    try:
        from app.services.risk_predictor import risk_predictor
        risk_predictor.load_model_to_memory()
        print("✅ Model 3 (Risk Profile) ready — Cached in memory")
    except Exception as e:
        print(f"⚠️  Model 3 tidak bisa di-load: {e}")

    # Model 1 — Health Score
    print("✅ Model 1 (Health Score) ready — formula based")

    # Model 2 — Spending Cluster
    try:
        from app.services.persona_predictor import persona_predictor
        print(f"✅ Model 2 (Spending Cluster) ready — Loaded {len(persona_predictor.features)} features")
    except Exception as e:
        print(f"⚠️  Model 2 tidak bisa di-load: {e}")

    yield
    print("👋 Shutting down CEAMIS AI Service...")


app = FastAPI(
    title="CEAMIS AI Service",
    description=(
        "AI backend untuk CEAMIS — menyediakan prediksi Health Score finansial, "
        "Chatbot Gen-Z (CAMI), Edukasi Adaptif, Risk Profile Classifier, "
        "dan Spending Pattern Clustering."
    ),
    version="0.2.1",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "https://ceamis.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
if health_score:
    app.include_router(health_score.router, prefix="/api/v1", tags=["Model 1 - Health Score ✅ Formula Based"])

app.include_router(spending_cluster.router, prefix="/api/v1", tags=["Model 2 - Spending Cluster"])
app.include_router(risk_profile.router,    prefix="/api/v1", tags=["Model 3 - Risk Profile ✅"])
app.include_router(dashboard_insight.router, prefix="/api/v1", tags=["LLM-Powered XAI Insights 🌟"])
app.include_router(recommendation.router,  prefix="/api/v1", tags=["Recommendation"])
app.include_router(chatbot.router,         prefix="/api/v1", tags=["Chatbot CAMI ✅"])
app.include_router(education.router,       prefix="/api/v1", tags=["Education ✅"])


# ── Health Score Fallback (jika TF tidak tersedia) ──────────────────────────
if not health_score:
    from fastapi import APIRouter
    from pydantic import BaseModel
    from typing import Optional

    hs_fallback = APIRouter()

    class HsFallbackReq(BaseModel):
        saving_rate_raw: Optional[float] = 0.2
        wants_ratio_raw: Optional[float] = 0.3
        class Config:
            extra = "allow"

    @hs_fallback.post("/predict/health-score", tags=["Model 1 - Health Score (Fallback)"])
    async def health_score_fallback(req: HsFallbackReq):
        saving = req.saving_rate_raw or 0.2
        score = round(min(90, max(25, saving * 200 + 35)), 2)
        return {
            "health_score": score,
            "health_label": "Sehat" if score >= 65 else "Cukup" if score >= 50 else "Waspada" if score >= 40 else "Kritis",
            "warning_triggered": score < 40,
            "xai_factors": {},
            "message": "Model 1 tidak tersedia. Skor dihitung dari saving rate kamu.",
            "is_mock": True,
        }

    app.include_router(hs_fallback, prefix="/api/v1")


# Root endpoints
@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CEAMIS AI Service",
        "version": "0.2.1",
        "status": "running",
        "models": {
            "model_1_health_score":     "real ✅" if health_score else "fallback (TF not loaded)",
            "model_2_spending_cluster": "real ✅ (K-Means Clustering)",
            "model_3_risk_profile":     "real ✅ (97.91% acc)",
            "model_4_chatbot":          "real ✅ (Gemini + Groq)",
            "education":                "real ✅ (GenAI)",
        },
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}
