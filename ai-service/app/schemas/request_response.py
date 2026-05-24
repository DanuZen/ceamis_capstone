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

    class Config:
        json_schema_extra = {
            "example": {
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
            }
        }


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
