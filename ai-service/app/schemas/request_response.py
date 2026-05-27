"""
Schemas — Request & Response Pydantic Models
CEAMIS AI Service v0.2.0
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict


# ═══════════════════════════════════════════════════
# MODEL 1 — HEALTH SCORE
# ═══════════════════════════════════════════════════

class HealthScoreRequest(BaseModel):
    segmen          : str    # "A" | "B" | "C"
    saving_rate     : float  # 0-1
    wants_ratio     : float  # 0-1
    dti_ratio       : float  # 0-1
    impulsive_ratio : float  # 0-1
    budget_adherence: float  # 0-1

    class Config:
        json_schema_extra = {
            "example": {
                "segmen"          : "A",
                "saving_rate"     : 0.17,
                "wants_ratio"     : 0.28,
                "dti_ratio"       : 0.0,
                "impulsive_ratio" : 0.08,
                "budget_adherence": 0.85
            }
        }

class HealthScoreResponse(BaseModel):
    health_score    : float
    health_label    : str
    explanation     : list
    component_scores: dict
    segmen          : str
    is_mock         : bool = False


# ═══════════════════════════════════════════════════
# MODEL 2 — SPENDING CLUSTER
# ═══════════════════════════════════════════════════

class SpendingClusterRequest(BaseModel):
    user_id:            str
    category_breakdown: Dict[str, float] = Field(..., description="{'makan': 500000, 'hiburan': 200000, ...}")
    total_transactions: Optional[int] = 0

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "category_breakdown": {
                    "Makan & Minum": 800000,
                    "Hiburan & Streaming": 500000,
                    "Transportasi": 200000,
                    "Belanja Online": 600000
                },
                "total_transactions": 35
            }
        }


class SpendingClusterResponse(BaseModel):
    user_id:            str
    cluster_id:         int
    cluster_label:      str     # "Si Boros" | "Si Hemat" | "Si Impulsif"
    dominant_category:  str
    insight:            str
    needs_ratio:        Optional[float] = None
    wants_ratio:        Optional[float] = None
    savings_ratio:      Optional[float] = None
    trend:              Optional[str] = "stable"
    is_mock:            bool = True


# ═══════════════════════════════════════════════════
# MODEL 3 — RISK PROFILE (Real Model ✅)
# ═══════════════════════════════════════════════════

class RiskProfileRequest(BaseModel):
    # Rasio keuangan
    saving_rate:       float
    dti_ratio:         float
    disposable_ratio:  float
    expense_ratio:     float
    ceamis_score:      float

    # Aset & tabungan
    punya_tabungan:        int
    jumlah_tabungan_bulan: float

    # Perilaku finansial (dari onboarding)
    SAVEHABIT:     int
    SELFCONTROL_1: int
    SCFHORIZON:    int
    FINGOALS:      int

    # Profil user (dari onboarding)
    toleransi_rugi_enc:  int
    tujuan_keuangan_enc: int
    tanggungan_keluarga: int
    Age:                 int
    city_tier_enc:       int

    # Occupation (dari onboarding)
    occ_Professional:  int
    occ_Retired:       int
    occ_Self_Employed: int
    occ_Student:       int

    class Config:
        json_schema_extra = {
            "example": {
                "saving_rate": 0.138,
                "dti_ratio": 0.0,
                "disposable_ratio": 0.382,
                "expense_ratio": 0.618,
                "ceamis_score": 0.544,
                "punya_tabungan": 1,
                "jumlah_tabungan_bulan": 1.34,
                "SAVEHABIT": 4,
                "SELFCONTROL_1": 5,
                "SCFHORIZON": 5,
                "FINGOALS": 4,
                "toleransi_rugi_enc": 1,
                "tujuan_keuangan_enc": 1,
                "tanggungan_keluarga": 0,
                "Age": 22,
                "city_tier_enc": 1,
                "occ_Professional": 0,
                "occ_Retired": 0,
                "occ_Self_Employed": 0,
                "occ_Student": 1,
            }
        }


class RiskProfileResponse(BaseModel):
    risk_profile:  str    # "Konservatif" | "Moderat" | "Agresif"
    confidence:    float
    probabilities: dict
    description:   str
    suggestion:    str
    is_mock:       bool = False


# ═══════════════════════════════════════════════════
# RECOMMENDATION LOGIC
# ═══════════════════════════════════════════════════

class RecommendationRequest(BaseModel):
    user_id:             str
    health_score:        float
    most_spent_category: str
    wants_ratio:         float
    saving_rate:         float
    active_goals:        List[str] = []


class RecommendationItem(BaseModel):
    priority:         int
    action:           str
    reason:           str
    potential_saving: float


class RecommendationResponse(BaseModel):
    user_id:         str
    recommendations: List[RecommendationItem]
    recovery_plan:   Optional[str] = None
    warning_message: Optional[str] = None
    is_mock:         bool = True


# ═══════════════════════════════════════════════════
# MODEL 4 — CHATBOT CAMI (Real ✅)
# ═══════════════════════════════════════════════════

class ChatMessage(BaseModel):
    role:    str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    user_id:            str
    messages:           List[ChatMessage]
    financial_context:  Optional[dict] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "messages": [
                    {"role": "user", "content": "Gimana kondisi keuangan aku bulan ini?"}
                ],
                "financial_context": {
                    "username": "Raka",
                    "health_score": 58.5,
                    "cluster_label": "Si Impulsif",
                    "risk_profile": "Moderat",
                    "saving_rate": 0.12,
                }
            }
        }


class ChatResponse(BaseModel):
    reply:     str
    is_mock:   bool = True
    triggered: Optional[str] = None   # "ok"|"crisis"|"off_topic"|"sensitive"


# ═══════════════════════════════════════════════════
# ADAPTIVE EDUCATION (Real ✅)
# ═══════════════════════════════════════════════════

class ModuleContentRequest(BaseModel):
    user_id: str


class ModuleSection(BaseModel):
    section_title: str
    content:       str
    key_point:     str


class ModuleContentResponse(BaseModel):
    module_id:    str
    title:        str
    level:        int
    level_label:  str
    duration:     str
    xp_reward:    int
    sections:     List[dict]
    summary:      str
    action_items: List[str]
    fun_fact:     str
    quiz_count:   int
    pass_score:   int
    is_mock:      bool = True


class ModuleListResponse(BaseModel):
    total_modules: int
    levels:        List[dict]


class QuizRequest(BaseModel):
    user_id: str


class QuizQuestion(BaseModel):
    question_id: int
    question:    str
    options:     List[str]
    correct_idx: int
    explanation: str


class QuizResponse(BaseModel):
    module_id:  str
    title:      str
    pass_score: int
    xp_reward:  int
    questions:  List[QuizQuestion]
    is_mock:    bool = True


class InsightRequest(BaseModel):
    user_id:           str
    financial_context: Optional[dict] = None


class InsightResponse(BaseModel):
    user_id:        str
    weekly_insight: str
    highlight:      str
    challenge:      str
    motivation:     str
    is_mock:        bool = True


# ═══════════════════════════════════════════════════
# GENERAL
# ═══════════════════════════════════════════════════

class ErrorResponse(BaseModel):
    detail: str
    code:   Optional[str] = None
