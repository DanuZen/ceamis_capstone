from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import health_score, spending_cluster, risk_profile, recommendation, chatbot

app = FastAPI(
    title="CEAMIS AI Service",
    description="AI/ML service untuk CEAMIS",
    version="0.1.0-mock"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_score.router,     prefix="/api/v1", tags=["Model 1 - Health Score"])
app.include_router(spending_cluster.router, prefix="/api/v1", tags=["Model 2 - Spending Cluster"])
app.include_router(risk_profile.router,     prefix="/api/v1", tags=["Model 3 - Risk Profile"])
app.include_router(recommendation.router,   prefix="/api/v1", tags=["Recommendation Logic"])
app.include_router(chatbot.router,          prefix="/api/v1", tags=["Model 4 - Chatbot"])

@app.get("/", tags=["Root"])
async def root():
    return {
        "service": "CEAMIS AI Service",
        "version": "0.1.0-mock",
        "status": "running",
        "models": {
            "model_1_health_score": "mock",
            "model_2_spending_cluster": "mock",
            "model_3_risk_profile": "mock",
            "model_4_chatbot": "mock"
        }
    }

@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "ok"}