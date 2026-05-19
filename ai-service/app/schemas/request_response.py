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
# MODEL 3 — RISK PROFILE (UPDATED — Real Model)
# ═══════════════════════════════════════════════════

class RiskProfileRequest(BaseModel):
    # ── Rasio keuangan ────────────────────────────
    saving_rate      : float   # [0,1]
    dti_ratio        : float   # [0,1]
    disposable_ratio : float   # [0,1]
    expense_ratio    : float   # [0,2]
    ceamis_score     : float   # [0,1]

    # ── Aset & tabungan ───────────────────────────
    punya_tabungan        : int    # 0 atau 1
    jumlah_tabungan_bulan : float  # [0,36]
    punya_investasi       : int    # 0 atau 1

    # ── Perilaku finansial (NFWBS) ────────────────
    SAVEHABIT    : int   # [1,4]
    SELFCONTROL_1: int   # [1,5]
    SCFHORIZON   : int   # [1,6]
    FINGOALS     : int   # [1,4]

    # ── Profil & preferensi ───────────────────────
    toleransi_rugi_enc   : int   # rendah=0, sedang=1, tinggi=2
    tujuan_keuangan_enc  : int   # darurat=0,pensiun=1,aset=2,bebas=3
    tanggungan_keluarga  : int   # [0,10]
    Age                  : int   # [18,70]
    city_tier_enc        : int   # Tier_3=0, Tier_2=1, Tier_1=2

    # ── One-hot occupation ────────────────────────
    occ_Professional : int   # 0 atau 1
    occ_Retired      : int   # 0 atau 1
    occ_Self_Employed: int   # 0 atau 1
    occ_Student      : int   # 0 atau 1

    # ── One-hot investasi ─────────────────────────
    inv_deposito          : int   # 0 atau 1
    inv_deposito_obligasi : int   # 0 atau 1
    inv_saham_obligasi    : int   # 0 atau 1
    inv_saham_reksa_dana  : int   # 0 atau 1
    inv_tidak_ada         : int   # 0 atau 1

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
                "punya_investasi"      : 0,
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
                "inv_deposito"         : 0,
                "inv_deposito_obligasi": 0,
                "inv_saham_obligasi"   : 0,
                "inv_saham_reksa_dana" : 0,
                "inv_tidak_ada"        : 1,
            }
        }


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