"""
FastAPI Entry Point — CEAMIS AI Service v2.0.0
CEAMIS 2.0 — Unified FastAPI Backend

CHANGELOG v2.0.0:
  - [NEW] Pre-Purchase Risk Check Engine (fitur inti baru)
  - [NEW] Admin Governance Dashboard API
  - [NEW] PrePurchaseRiskPredictor (7-feature ML + rule-based fallback)
  - Spending Cluster (Model 2) DIHAPUS — diganti threshold deterministik
  - DashboardInsight menggunakan `spending_category` bukan `persona`
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.api import (
    recommendation, dashboard_insight
)
from app.api import pre_purchase, admin, ocr

# Lazy import health_score (butuh TF — skip jika tidak tersedia)
health_score = None
try:
    from app.api import health_score as hs_module
    health_score = hs_module
    print("[OK] health_score module loaded")
except Exception as e:
    print(f"[WARN] health_score module tidak bisa di-load: {e}")
    print("       Endpoint /predict/health-score akan return mock data")

# Risk Profile artifacts (legacy)
try:
    from app.utils.preprocessor import load_risk_artifacts
    _load_risk = load_risk_artifacts
except Exception:
    _load_risk = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Starting CEAMIS AI Service v2.0.0...")

    # ★ NEW: Pre-Purchase Risk Predictor (7-feature ML engine)
    try:
        from app.services.pre_purchase_risk import risk_predictor
        risk_predictor.load_model()
        if risk_predictor.is_ml_available:
            print("✅ Pre-Purchase Risk Model ready — ML inference active")
        else:
            print("⚠️  Pre-Purchase Risk Model — using rule-based fallback (no .joblib found)")
    except Exception as e:
        print(f"⚠️  Pre-Purchase Risk Model loading failed: {e}")

    # Model 3 — Risk Profile (legacy, tetap dipertahankan)
    try:
        from app.services.risk_predictor import risk_predictor as legacy_risk
        legacy_risk.load_model_to_memory()
        print("✅ Model 3 (Risk Profile legacy) ready — Cached in memory")
    except Exception as e:
        print(f"⚠️  Model 3 tidak bisa di-load: {e}")

    # Model 1 — Health Score
    print("✅ Model 1 (Health Score) ready — formula based")
    print("✅ Spending Category — threshold dari health_score (Sehat/Waspada/Boros)")

    yield
    print("👋 Shutting down CEAMIS AI Service v2.0.0...")


app = FastAPI(
    title="CEAMIS AI Service",
    description=(
        "Unified backend CEAMIS 2.0 — menyediakan Pre-Purchase Risk Check Engine "
        "(fitur inti), Health Score finansial, Admin Governance Dashboard, "
        "OCR Receipt Parsing, dan fitur pendukung lainnya."
    ),
    version="2.0.0",
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

# ★ Core Feature: Pre-Purchase Risk Check
app.include_router(pre_purchase.router, prefix="/api/v1", tags=["★ Pre-Purchase Risk Check (Core)"])

# ★ Admin Governance Dashboard
app.include_router(admin.router, prefix="/api/v1", tags=["★ Admin Governance"])

# Supporting modules
if health_score:
    app.include_router(health_score.router, prefix="/api/v1", tags=["Model 1 - Health Score ✅ Formula Based"])

app.include_router(dashboard_insight.router, prefix="/api/v1", tags=["LLM-Powered XAI Insights 🌟"])
app.include_router(recommendation.router,  prefix="/api/v1", tags=["Recommendation"])
app.include_router(ocr.router, prefix="/api/v1", tags=["OCR Receipt Parsing"])


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

        # Spending category threshold (sama dengan logic utama)
        if score >= 80:
            category = "Sehat"
        elif score >= 40:
            category = "Waspada"
        else:
            category = "Boros"

        return {
            "health_score": score,
            "health_label": "Sehat" if score >= 65 else "Cukup" if score >= 50 else "Waspada" if score >= 40 else "Kritis",
            "category": category,
            "warning_triggered": score < 40,
            "xai_factors": {},
            "message": "Model 1 tidak tersedia. Skor dihitung dari saving rate kamu.",
            "is_mock": True,
        }

    app.include_router(hs_fallback, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CEAMIS AI Service",
        "version": "2.0.0",
        "status": "running",
        "core_features": {
            "pre_purchase_risk_check":   "★ Core Feature — ML + Rule-Based Fallback",
            "admin_governance":          "★ Model Registry & Audit Logs",
        },
        "supporting_features": {
            "model_1_health_score":      "real ✅" if health_score else "fallback (formula based)",
            "spending_category":         "threshold dari health_score (Sehat/Waspada/Boros)",
            "xai_dashboard_insight":     "real ✅ (Explainable AI Financial Insights)",
            "recommendation":            "real ✅ (Prioritized Action Items)",
        },
        "docs": "/docs",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}
