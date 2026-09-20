"""
Schemas — Pre-Purchase Check Pydantic v2 Models
CEAMIS 2.0 — Fitur Inti Pra-Pembelian

Referensi:
  docs/ceamis 2.0/API_SPECIFICATION.md §3
  docs/ceamis 2.0/DATABASE_SCHEMA.md §3
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ═══════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class UserDecision(str, Enum):
    PROCEED = "PROCEED"
    ADJUST = "ADJUST"
    POSTPONE = "POSTPONE"


class RecommendedAction(str, Enum):
    PROCEED = "PROCEED"
    ADJUST = "ADJUST"
    POSTPONE = "POSTPONE"


# ═══════════════════════════════════════════════════
# PRE-PURCHASE CHECK
# ═══════════════════════════════════════════════════

class PrePurchaseCheckRequest(BaseModel):
    """Request body for POST /pre-purchase/check."""
    category_id: str = Field(..., description="UUID kategori transaksi")
    planned_amount: float = Field(..., gt=0, description="Nominal rencana belanja (Rupiah)")
    merchant_name: Optional[str] = Field(None, max_length=100, description="Nama merchant (opsional)")
    notes: Optional[str] = Field(None, description="Catatan tambahan dari pengguna")

    # Identitas user — diisi dari JWT di backend, bukan dari request
    user_id: Optional[str] = Field(None, description="Diisi otomatis dari JWT token")

    class Config:
        json_schema_extra = {
            "example": {
                "category_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "planned_amount": 275000,
                "merchant_name": "Uniqlo Grand Indonesia",
                "notes": "Beli hoodie baru mumpung diskon",
            }
        }


class BudgetImpact(BaseModel):
    """Dampak rencana belanja terhadap anggaran kategori."""
    category_name: str
    budget_limit: float
    remaining_before: float
    remaining_after: float
    is_overbudget: bool


class SavingsImpact(BaseModel):
    """Dampak rencana belanja terhadap target tabungan aktif."""
    delayed_days: int
    goal_title: Optional[str] = None
    message: str


class PrePurchaseCheckResponse(BaseModel):
    """Response body for POST /pre-purchase/check."""
    check_id: str
    risk_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: RiskLevel
    trigger_factors: List[str]
    budget_impact: BudgetImpact
    savings_impact: SavingsImpact
    recommended_actions: List[RecommendedAction]


# ═══════════════════════════════════════════════════
# DECISION RECORDING
# ═══════════════════════════════════════════════════

class DecisionRecordRequest(BaseModel):
    """Request body for POST /pre-purchase/decide."""
    check_id: str = Field(..., description="ID dari hasil cek pra-pembelian")
    decision: UserDecision = Field(..., description="Keputusan user: PROCEED / ADJUST / POSTPONE")
    adjusted_amount: Optional[float] = Field(None, ge=0, description="Nominal baru jika decision = ADJUST")

    class Config:
        json_schema_extra = {
            "example": {
                "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
                "decision": "POSTPONE",
                "adjusted_amount": None,
            }
        }


class DecisionRecordResponse(BaseModel):
    """Response body for POST /pre-purchase/decide."""
    check_id: str
    status: str = "RECORDED"
    decided_at: datetime


# ═══════════════════════════════════════════════════
# POST-DECISION FEEDBACK (Ground Truth Label)
# ═══════════════════════════════════════════════════

class FeedbackRecordRequest(BaseModel):
    """Request body for POST /pre-purchase/feedback."""
    check_id: str = Field(..., description="ID dari hasil cek pra-pembelian")
    was_impulsive: bool = Field(..., description="Apakah user merasa ini pembelian impulsif?")
    satisfaction_rating: int = Field(..., ge=1, le=5, description="Rating kepuasan 1-5")
    feedback_notes: Optional[str] = Field(None, description="Catatan tambahan feedback")

    class Config:
        json_schema_extra = {
            "example": {
                "check_id": "b1a7d65e-26f5-46aa-9d57-897db6746f33",
                "was_impulsive": True,
                "satisfaction_rating": 4,
                "feedback_notes": "Peringatan aplikasi sangat akurat, saya senang menundanya.",
            }
        }


# ═══════════════════════════════════════════════════
# ADMIN — MODEL GOVERNANCE
# ═══════════════════════════════════════════════════

class ModelVersionInfo(BaseModel):
    """Info versi model ML untuk admin dashboard."""
    id: str
    version_tag: str
    algorithm: str
    precision: float
    recall: float
    f1_score: float
    is_active: bool
    deployed_at: datetime


class ModelRollbackRequest(BaseModel):
    """Request body for POST /admin/models/rollback."""
    target_model_version_id: str = Field(..., description="UUID versi model target rollback")
    reason: str = Field(..., min_length=5, description="Alasan rollback")

    class Config:
        json_schema_extra = {
            "example": {
                "target_model_version_id": "a90184b2-29df-4573-a192-8812cbb41244",
                "reason": "False positive rate meningkat tajam pada kategori hiburan",
            }
        }


class AuditLogEntry(BaseModel):
    """Audit log entry for admin dashboard."""
    id: str
    user_id: str
    category_name: str
    planned_amount: float
    risk_level: str
    risk_score: float
    decision: Optional[str] = None
    was_impulsive: Optional[bool] = None
    created_at: datetime


# ═══════════════════════════════════════════════════
# STANDARD API ENVELOPE
# ═══════════════════════════════════════════════════

class ApiResponse(BaseModel):
    """Standard API response envelope."""
    success: bool = True
    data: Optional[dict | list] = None
    message: str = "Operasi berhasil diselesaikan"


class ApiError(BaseModel):
    """Standard API error envelope."""
    success: bool = False
    error: dict
