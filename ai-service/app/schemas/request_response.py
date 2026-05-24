<<<<<<< HEAD
"""
Schemas — Request & Response Pydantic Models
CEAMIS AI Service
"""

from pydantic import BaseModel, Field
from typing import Optional, List


# ─────────────────────────────────────────────
# Health Score (Model 1)
# ─────────────────────────────────────────────

class HealthScoreRequest(BaseModel):
    """
    Input fitur agregat bulanan per user.
    Semua rasio dalam rentang 0.0 – 1.0 kecuali yang tercantum.
    """
    # Behavioral features
    pct_late_night: float = Field(..., ge=0, le=1, description="Rasio transaksi larut malam")
    pct_weekend: float = Field(..., ge=0, le=1, description="Rasio transaksi saat weekend")
    pct_unbudgeted: float = Field(..., ge=0, le=1, description="Rasio transaksi di luar budget")
    pct_risky_category: float = Field(..., ge=0, le=1, description="Rasio kategori berisiko (F&B, hobi, hiburan)")
    pct_binge_spending: float = Field(..., ge=0, le=1, description="Rasio binge spending")
    avg_hourly_txn_count: float = Field(..., ge=0, description="Rata-rata jumlah transaksi per jam")
    transaction_count: int = Field(..., ge=0, description="Total transaksi bulan ini")

    # Financial ratios
    saving_rate_raw: float = Field(..., ge=0, le=1, description="Rasio tabungan = (income - expense) / income")
    wants_ratio_raw: float = Field(..., ge=0, le=1, description="Rasio keinginan / income")
    investment_rate_raw: float = Field(..., ge=0, le=1, description="Rasio investasi / income")
    dti_ratio: float = Field(..., ge=0, le=1, description="Debt-to-income ratio (clipped 0-1)")
    segment_enc: int = Field(..., ge=0, le=1, description="Segmen DTI: 1 = B (aman), 0 = lainnya")
=======
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
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee

    class Config:
        json_schema_extra = {
            "example": {
<<<<<<< HEAD
                "pct_late_night": 0.15,
                "pct_weekend": 0.30,
                "pct_unbudgeted": 0.45,
                "pct_risky_category": 0.40,
                "pct_binge_spending": 0.05,
                "avg_hourly_txn_count": 2.3,
                "transaction_count": 42,
                "saving_rate_raw": 0.20,
                "wants_ratio_raw": 0.35,
                "investment_rate_raw": 0.10,
                "dti_ratio": 0.25,
                "segment_enc": 1
=======
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
# MODEL 3 — RISK PROFILE (UPDATED — Real Model)
# ═══════════════════════════════════════════════════

class RiskProfileRequest(BaseModel):
    # ── Rasio keuangan ────────────────────────────
    saving_rate      : float
    dti_ratio        : float
    disposable_ratio : float
    expense_ratio    : float
    ceamis_score     : float

    # ── Aset & tabungan ───────────────────────────
    punya_tabungan        : int
    jumlah_tabungan_bulan : float

    # ── Perilaku finansial (dari onboarding) ──────
    SAVEHABIT    : int
    SELFCONTROL_1: int
    SCFHORIZON   : int
    FINGOALS     : int

    # ── Profil user (dari onboarding) ─────────────
    toleransi_rugi_enc  : int
    tujuan_keuangan_enc : int
    tanggungan_keluarga : int
    Age                 : int
    city_tier_enc       : int

    # ── Occupation (dari onboarding) ──────────────
    occ_Professional : int
    occ_Retired      : int
    occ_Self_Employed: int
    occ_Student      : int

    class Config:
        json_schema_extra = {
            "example": {
                "saving_rate"          : 0.138,
                "dti_ratio"            : 0.0,
                "disposable_ratio"     : 0.382,
                "expense_ratio"        : 0.618,
                "ceamis_score"         : 0.544,
                "punya_tabungan"       : 1,
                "jumlah_tabungan_bulan": 1.34,
                "SAVEHABIT"            : 4,
                "SELFCONTROL_1"        : 5,
                "SCFHORIZON"           : 5,
                "FINGOALS"             : 4,
                "toleransi_rugi_enc"   : 1,
                "tujuan_keuangan_enc"  : 1,
                "tanggungan_keluarga"  : 0,
                "Age"                  : 54,
                "city_tier_enc"        : 1,
                "occ_Professional"     : 1,
                "occ_Retired"          : 0,
                "occ_Self_Employed"    : 0,
                "occ_Student"          : 0,
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee
            }
        }


<<<<<<< HEAD
class HealthScoreResponse(BaseModel):
    health_score: float = Field(..., description="Skor kesehatan finansial (0-100)")
    health_label: str = Field(..., description="Label kategori: Excellent | Sehat | Cukup | Waspada | Kritis")
    warning_triggered: bool = Field(..., description="True jika health_score < 40 → Warning System aktif")
    xai_factors: dict = Field(..., description="Kontribusi tiap fitur terhadap skor (explainable AI)")
    message: str = Field(..., description="Pesan Gen-Z berdasarkan kondisi finansial")


# ─────────────────────────────────────────────
# Chatbot
# ─────────────────────────────────────────────

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' atau 'assistant'")
    content: str


class ChatbotRequest(BaseModel):
    message: str = Field(..., description="Pesan user ke chatbot")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Riwayat percakapan sebelumnya")
    user_context: Optional[dict] = Field(default=None, description="Konteks finansial user (opsional)")


class ChatbotResponse(BaseModel):
    reply: str
    provider: str = Field(..., description="'gemini' atau 'groq'")


# ─────────────────────────────────────────────
# Education & Quiz
# ─────────────────────────────────────────────

class EducationRequest(BaseModel):
    topic: str = Field(..., description="Topik edukasi yang diminta")
    level: Optional[str] = Field(default="beginner", description="Level user: beginner | intermediate | advanced")


class EducationResponse(BaseModel):
    title: str
    content: str
    key_points: List[str]
    provider: str


class QuizRequest(BaseModel):
    topic: str
    num_questions: Optional[int] = Field(default=5, ge=1, le=10)


class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int
    explanation: str


class QuizResponse(BaseModel):
    topic: str
    questions: List[QuizQuestion]
    provider: str


# ─────────────────────────────────────────────
# General
# ─────────────────────────────────────────────

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
=======
class RiskProfileResponse(BaseModel):
    risk_profile  : str    # "Konservatif" | "Moderat" | "Agresif"
    confidence    : float  # probabilitas prediksi (0-1)
    probabilities : dict   # prob tiap kelas
    description   : str
    suggestion    : str
    is_mock       : bool = True


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
    role: str       # "user" | "assistant"
    content: str

class ChatRequest(BaseModel):
    user_id: str
    messages: List[ChatMessage]
    financial_context: Optional[dict] = None

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "messages": [
                    {
                        "role"   : "user",
                        "content": "Gimana kondisi keuangan aku bulan ini?"
                    }
                ],
                "financial_context": {
                    "username"      : "Raka",
                    "segmen"        : "A",
                    "health_score"  : 58.5,
                    "health_label"  : "cukup",
                    "cluster_label" : "Si Impulsif",
                    "risk_profile"  : "Optimizer",
                    "saving_rate"   : 0.12,
                    "wants_ratio"   : 0.38,
                    "impulsive_ratio": 0.18,
                    "budget_adherence": 0.70,
                    "income_avg"    : 1500000,
                    "streak_count"  : 5,
                    "active_goals"  : [
                        {
                            "goal_name"    : "Beli Laptop",
                            "target_amount": 8000000,
                            "months_left"  : 8
                        }
                    ],
                    "top_cut_categories": ["hiburan", "ngopi"],
                    "months_to_goal": 11.2,
                    "gap_rate"      : 0.09
                }
            }
        }

class ChatResponse(BaseModel):
    reply    : str
    is_mock  : bool = True
    triggered: Optional[str] = None   # "ok"|"crisis"|"off_topic"|"sensitive"


# ═══════════════════════════════════════════════════
# ADAPTIVE EDUCATION
# ═══════════════════════════════════════════════════

class ModuleContentRequest(BaseModel):
    user_id: str

class ModuleSection(BaseModel):
    section_title: str
    content      : str
    key_point    : str

class ModuleContentResponse(BaseModel):
    module_id   : str
    title       : str
    level       : int
    level_label : str
    duration    : str
    xp_reward   : int
    sections    : List[dict]
    summary     : str
    action_items: List[str]
    fun_fact    : str
    quiz_count  : int
    pass_score  : int
    is_mock     : bool = True

class ModuleListResponse(BaseModel):
    total_modules: int
    levels       : List[dict]

class QuizRequest(BaseModel):
    user_id: str

class QuizQuestion(BaseModel):
    question_id : int
    question    : str
    options     : List[str]
    correct_idx : int
    explanation : str

class QuizResponse(BaseModel):
    module_id : str
    title     : str
    pass_score: int
    xp_reward : int
    questions : List[QuizQuestion]
    is_mock   : bool = True

class InsightRequest(BaseModel):
    user_id: str
    financial_context: Optional[dict] = None

class InsightResponse(BaseModel):
    user_id       : str
    weekly_insight: str
    highlight     : str
    challenge     : str
    motivation    : str
    is_mock       : bool = True
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee
