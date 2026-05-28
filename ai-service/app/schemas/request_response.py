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
# MODEL 2 — SPENDING CLUSTER SCHEMAS
# ═══════════════════════════════════════════════════

class SpendingClusterRequest(BaseModel):
    user_id: str = Field(..., description="ID unik pengguna dari Supabase Authentication")
    is_late_night: float = Field(..., description="Rata-rata transaksi malam hari (0-1)")
    is_weekend: float = Field(..., description="Rata-rata transaksi akhir pekan (0-1)")
    is_unbudgeted: float = Field(..., description="Rata-rata transaksi di luar anggaran (0-1)")
    is_risky_category: float = Field(..., description="Rata-rata transaksi kategori berisiko (0-1)")
    is_binge_spending: float = Field(..., description="Rata-rata pengeluaran berlebih spontan (0-1)")
    hourly_txn_count: float = Field(..., description="Rata-rata jumlah transaksi per jam")
    transaction_count: float = Field(..., description="Total frekuensi transaksi dalam sebulan")
    saving_rate_raw: float = Field(..., description="Rasio tabungan mentah terhadap pendapatan")
    wants_ratio_raw: float = Field(..., description="Rasio pengeluaran keinginan terhadap pendapatan")
    investment_rate_raw: float = Field(..., description="Rasio investasi terhadap pendapatan")
    dti_ratio_raw: float = Field(..., description="Debt to Income Ratio mentah")
    category_features: Optional[Dict[str, float]] = Field(None, description="Proporsi kategori transaksi, ex: {'cat_hobi': 0.1}")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "is_late_night": 0.29,
                "is_weekend": 0.43,
                "is_unbudgeted": 0.68,
                "is_risky_category": 0.43,
                "is_binge_spending": 0.15,
                "hourly_txn_count": 1.8,
                "transaction_count": 24.0,
                "saving_rate_raw": 0.35,
                "wants_ratio_raw": 0.19,
                "investment_rate_raw": 0.05,
                "dti_ratio_raw": 0.20,
                "category_features": {
                    "cat_hobi": 0.12,
                    "cat_hiburan": 0.08,
                    "cat_f&b": 0.35
                }
            }
        }

class ClusterMetricsSummary(BaseModel):
    saving_rate: float
    wants_ratio: float
    unbudgeted_ratio: float
    avg_transactions: float

class ClusterDataResult(BaseModel):
    cluster_id: int
    persona: str
    description: str
    metrics_summary: ClusterMetricsSummary

class SpendingClusterResponse(BaseModel):
    status: str
    message: str
    data: ClusterDataResult


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


class BudgetAllocation(BaseModel):
    needs: str                  # "50%"
    wants: str                  # "20%"
    savings_investment: str     # "30%"
    primary_instruments: str    # "Dana Darurat, Deposito, Reksadana Pasar Uang"

class RiskProfileResponse(BaseModel):
    risk_profile: str
    confidence: float
    probabilities: dict
    description: str
    suggestion: str
    budget_allocation: BudgetAllocation 
    is_mock: bool = False


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
# LLM-POWERED XAI DASHBOARD INSIGHT
# ═══════════════════════════════════════════════════

class DashboardInsightRequest(BaseModel):
    user_id: str
    # Data dari Model 1 (Health Score)
    health_score: float
    health_label: str
    saving_rate: float
    wants_ratio: float
    dti_ratio: float
    budget_adherence: float
    
    # Data dari Model 2 (Spending Cluster Persona)
    persona: str  # "Si Hemat" | "Si Impulsif" | "Si Minimalis"
    most_spent_category: str  # e.g., "F&B (Kopi)", "Hobi"
    
    # Data dari Model 3 (Risk Profile)
    risk_profile: str  # "Konservatif" | "Moderat" | "Agresif"

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user-123",
                "health_score": 52.5,
                "health_label": "Waspada",
                "saving_rate": 0.08,
                "wants_ratio": 0.44,
                "dti_ratio": 0.20,
                "budget_adherence": 0.65,
                "persona": "Si Impulsif",
                "most_spent_category": "F&B (Kopi Kekinian)",
                "risk_profile": "Agresif"
            }
        }

class DashboardInsightResponse(BaseModel):
    status: str
    user_id: str
    ai_insight: str  # Narasi XAI dinamis dari LLM


# ═══════════════════════════════════════════════════
# GENERAL
# ═══════════════════════════════════════════════════

class ErrorResponse(BaseModel):
    detail: str
    code:   Optional[str] = None
