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


@app.get("/", tags=["Root"])
async def root():
    return {
        "service" : "CEAMIS AI Service",
        "version" : "0.2.0",
        "models"  : {
            "model_1_health_score"    : "mock",
            "model_2_spending_cluster": "mock",
            "model_3_risk_profile"    : "real ✅ (97.91% acc)",
            "model_4_chatbot"         : "real ✅",
            "education"               : "real ✅",
        }
    }


@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}