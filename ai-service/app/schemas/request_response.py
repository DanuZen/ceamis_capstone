# app/schemas/request_response.py
from pydantic import BaseModel
from typing import Optional, List

# ═══════════════════════════════════════════════════
# MODEL 1 — HEALTH SCORE
# ═══════════════════════════════════════════════════
class HealthScoreRequest(BaseModel):
    user_id: str
    month: str                        # format: "2025-06"
    total_income: float
    total_expense: float
    total_saving: float
    needs_ratio: float                # needs / income
    wants_ratio: float
    saving_rate: float
    budget_adherence_score: float     # 0.0 - 1.0
    impulsive_ratio: float
    transaction_count: int

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "month": "2025-06",
                "total_income": 3000000,
                "total_expense": 2100000,
                "total_saving": 500000,
                "needs_ratio": 0.50,
                "wants_ratio": 0.30,
                "saving_rate": 0.17,
                "budget_adherence_score": 0.80,
                "impulsive_ratio": 0.10,
                "transaction_count": 45
            }
        }

class HealthScoreResponse(BaseModel):
    user_id: str
    month: str
    health_score: float
    health_label: str                 # kritis | waspada | cukup | sehat | excellent
    explanation: str
    is_mock: bool = True


# ═══════════════════════════════════════════════════
# MODEL 2 — SPENDING CLUSTER
# ═══════════════════════════════════════════════════
class SpendingClusterRequest(BaseModel):
    user_id: str
    month: str
    category_breakdown: dict          # {"makan": 500000, "hiburan": 200000, ...}

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "month": "2025-06",
                "category_breakdown": {
                    "makan": 800000,
                    "hiburan": 500000,
                    "transportasi": 200000,
                    "belanja": 600000
                }
            }
        }

class SpendingClusterResponse(BaseModel):
    user_id: str
    month: str
    cluster_id: int
    cluster_label: str                # "Si Boros" | "Si Hemat" | "Si Impulsif" | dll
    dominant_category: str
    insight: str
    is_mock: bool = True


# ═══════════════════════════════════════════════════
# MODEL 3 — RISK PROFILE
# ═══════════════════════════════════════════════════
class RiskProfileRequest(BaseModel):
    user_id: str
    age_range: str                    # "17-22" | "23-27" | "28-35"
    income_source: str                # "beasiswa" | "freelance" | "kerja tetap" | dll
    monthly_income_range: str         # "< 500k" | "500k-1jt" | "1jt-3jt" | dll
    primary_goal: str                 # "hemat" | "investasi" | "lunasi_hutang" | dll
    financial_literacy_level: str     # "pemula" | "menengah" | "mahir"
    spending_habit: str               # "boros" | "cukup" | "hemat"

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "age_range": "23-27",
                "income_source": "kerja tetap",
                "monthly_income_range": "3jt-5jt",
                "primary_goal": "investasi",
                "financial_literacy_level": "menengah",
                "spending_habit": "cukup"
            }
        }

class RiskProfileResponse(BaseModel):
    user_id: str
    risk_profile: str                 # "konservatif" | "moderat" | "agresif"
    risk_score: float                 # 0.0 - 1.0
    description: str
    suggested_allocation: dict        # {"saham": "60%", "reksa_dana": "25%", ...}
    is_mock: bool = True


# ═══════════════════════════════════════════════════
# RECOMMENDATION LOGIC (bukan model, business logic)
# ═══════════════════════════════════════════════════
class RecommendationRequest(BaseModel):
    user_id: str
    month: str
    health_score: float
    most_spent_category: str
    wants_ratio: float
    saving_rate: float
    active_goals: List[str] = []

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "month": "2025-06",
                "health_score": 45.0,
                "most_spent_category": "hiburan",
                "wants_ratio": 0.45,
                "saving_rate": 0.05,
                "active_goals": ["Dana Darurat", "Beli Laptop"]
            }
        }

class RecommendationItem(BaseModel):
    priority: int
    action: str
    reason: str
    potential_saving: float

class RecommendationResponse(BaseModel):
    user_id: str
    month: str
    recommendations: List[RecommendationItem]
    recovery_plan: Optional[str] = None
    warning_message: Optional[str] = None  # Gen-Z style
    is_mock: bool = True


# ═══════════════════════════════════════════════════
# MODEL 4 — CHATBOT
# ═══════════════════════════════════════════════════
class ChatMessage(BaseModel):
    role: str                         # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    user_id: str
    messages: List[ChatMessage]
    financial_context: Optional[dict] = None   # inject kondisi keuangan ke prompt

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "messages": [
                    {"role": "user", "content": "Gimana cara mulai investasi?"}
                ],
                "financial_context": {
                    "health_score": 72.5,
                    "risk_profile": "moderat",
                    "current_saving_rate": 0.17
                }
            }
        }

class ChatResponse(BaseModel):
    reply: str
    is_mock: bool = True