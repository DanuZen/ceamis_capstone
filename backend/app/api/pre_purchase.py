"""
Pre-Purchase Check API Router — CEAMIS 2.0
Fitur Inti Pra-Pembelian: Risk evaluation, decision recording, feedback collection.

Endpoints:
  POST /api/v1/pre-purchase/check    — Cek risiko rencana belanja
  POST /api/v1/pre-purchase/decide   — Catat keputusan pengguna
  POST /api/v1/pre-purchase/feedback — Rekam feedback pasca-keputusan
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException

from app.schemas.pre_purchase_schema import (
    PrePurchaseCheckRequest,
    PrePurchaseCheckResponse,
    BudgetImpact,
    SavingsImpact,
    DecisionRecordRequest,
    DecisionRecordResponse,
    FeedbackRecordRequest,
    RecommendedAction,
)
from app.services.pre_purchase_risk import risk_predictor


router = APIRouter()

# ── In-memory stores (production: replace with Supabase/PostgreSQL) ──────────
_checks_store: dict = {}    # check_id -> check data
_decisions_store: dict = {} # check_id -> decision data
_feedbacks_store: dict = {} # check_id -> feedback data


# ═══════════════════════════════════════════════════════════════
# Mock data helpers (simulated user context from Supabase)
# In production these would be database queries
# ═══════════════════════════════════════════════════════════════

def _get_user_category_stats(user_id: str, category_id: str) -> dict:
    """Simulate retrieving user's category transaction statistics."""
    # Default mock stats per category — in production: query transactions table
    return {
        "category_name": "Shopping",
        "median_amount": 115000.0,
        "mean_amount": 135000.0,
        "std_amount": 62000.0,
        "frequency_7d": 2,
    }


def _get_user_budget_info(user_id: str, category_id: str) -> dict:
    """Simulate retrieving user's budget for the category."""
    return {
        "budget_limit": 800000.0,
        "spent_so_far": 680000.0,
        "remaining": 120000.0,
    }


def _get_user_savings_info(user_id: str) -> dict:
    """Simulate retrieving user's active savings goal."""
    return {
        "goal_title": "Dana Darurat 2026",
        "target_amount": 5000000.0,
        "current_amount": 2800000.0,
        "monthly_income": 4500000.0,
        "monthly_savings_rate": 0.15,
    }


def _get_user_profile(user_id: str) -> dict:
    """Simulate retrieving user profile."""
    return {
        "budget_reset_day": 1,
    }


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 1: POST /pre-purchase/check
# ═══════════════════════════════════════════════════════════════

@router.post(
    "/pre-purchase/check",
    response_model=None,
    summary="Cek Risiko Pra-Pembelian",
    description="Evaluasi risiko rencana belanja berdasarkan 7 fitur kontekstual ML.",
)
async def check_pre_purchase(req: PrePurchaseCheckRequest):
    """
    Menerima rencana belanja pengguna, mengekstrak 7 fitur kontekstual,
    melakukan inferensi risiko via model ML (atau rule-based fallback),
    dan menghitung dampak anggaran serta tabungan.
    """
    user_id = req.user_id or "demo-user"

    # Fetch context data
    cat_stats = _get_user_category_stats(user_id, req.category_id)
    budget_info = _get_user_budget_info(user_id, req.category_id)
    savings_info = _get_user_savings_info(user_id)
    profile = _get_user_profile(user_id)

    # Extract 7 contextual features
    features = risk_predictor.extract_features(
        planned_amount=req.planned_amount,
        category_median=cat_stats["median_amount"],
        budget_remaining=budget_info["remaining"],
        category_freq_7d=cat_stats["frequency_7d"],
        budget_reset_day=profile["budget_reset_day"],
        savings_goal_target=savings_info["target_amount"],
        category_mean=cat_stats["mean_amount"],
        category_std=cat_stats["std_amount"],
    )

    # Run inference (ML or rule-based)
    prediction = risk_predictor.predict(features)

    # Calculate budget impact
    remaining_after = budget_info["remaining"] - req.planned_amount

    budget_impact = BudgetImpact(
        category_name=cat_stats["category_name"],
        budget_limit=budget_info["budget_limit"],
        remaining_before=budget_info["remaining"],
        remaining_after=remaining_after,
        is_overbudget=remaining_after < 0,
    )

    # Calculate savings impact
    delayed_days = risk_predictor.compute_savings_delay(
        planned_amount=req.planned_amount,
        monthly_savings_rate=savings_info["monthly_savings_rate"],
        monthly_income=savings_info["monthly_income"],
    )

    savings_message = (
        f"Jika transaksi ini dilanjutkan, proyeksi capaian tabungan "
        f"tertunda sekitar {delayed_days} hari."
        if delayed_days > 0
        else "Transaksi ini tidak berdampak signifikan pada target tabungan Anda."
    )

    savings_impact = SavingsImpact(
        delayed_days=delayed_days,
        goal_title=savings_info["goal_title"],
        message=savings_message,
    )

    # Generate trigger factor explanations (XAI)
    trigger_factors = risk_predictor.generate_trigger_factors(
        features=features,
        planned_amount=req.planned_amount,
        category_name=cat_stats["category_name"],
        category_median=cat_stats["median_amount"],
        budget_remaining=budget_info["remaining"],
        remaining_after=remaining_after,
    )

    # Determine recommended actions based on risk level
    risk_level = prediction["risk_level"]
    if risk_level == "HIGH":
        recommended_actions = [RecommendedAction.POSTPONE, RecommendedAction.ADJUST]
    elif risk_level == "MEDIUM":
        recommended_actions = [RecommendedAction.ADJUST, RecommendedAction.PROCEED]
    else:
        recommended_actions = [RecommendedAction.PROCEED]

    # Generate unique check ID
    check_id = str(uuid.uuid4())

    # Store check data for decide/feedback endpoints
    _checks_store[check_id] = {
        "user_id": user_id,
        "category_id": req.category_id,
        "planned_amount": req.planned_amount,
        "merchant_name": req.merchant_name,
        "notes": req.notes,
        "risk_score": prediction["risk_score"],
        "risk_level": risk_level,
        "features_snapshot": features,
        "method": prediction["method"],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    return {
        "success": True,
        "data": {
            "check_id": check_id,
            "risk_score": prediction["risk_score"],
            "risk_level": risk_level,
            "trigger_factors": trigger_factors,
            "budget_impact": budget_impact.model_dump(),
            "savings_impact": savings_impact.model_dump(),
            "recommended_actions": [a.value for a in recommended_actions],
            "features_snapshot": features,
            "prediction_method": prediction["method"],
            "model_version": prediction.get("model_version", "n/a"),
        },
        "message": "Evaluasi pra-pembelian selesai",
    }


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 2: POST /pre-purchase/decide
# ═══════════════════════════════════════════════════════════════

@router.post(
    "/pre-purchase/decide",
    response_model=None,
    summary="Catat Keputusan Pengguna",
    description="Merekam keputusan pengguna setelah melihat evaluasi risiko.",
)
async def record_decision(req: DecisionRecordRequest):
    """
    Merekam respon pengguna (PROCEED / ADJUST / POSTPONE) setelah
    melihat peringatan risiko dari /pre-purchase/check.
    """
    if req.check_id not in _checks_store:
        raise HTTPException(
            status_code=404,
            detail=f"Check ID '{req.check_id}' tidak ditemukan.",
        )

    decided_at = datetime.now(timezone.utc)

    _decisions_store[req.check_id] = {
        "decision": req.decision.value,
        "adjusted_amount": req.adjusted_amount,
        "decided_at": decided_at.isoformat(),
    }

    # Friendly response messages
    messages = {
        "PROCEED": "Keputusan dicatat. Semoga belanjanya bermanfaat! 🛍️",
        "ADJUST": f"Keputusan dicatat. Nominal disesuaikan menjadi Rp {req.adjusted_amount:,.0f}." if req.adjusted_amount else "Keputusan dicatat.",
        "POSTPONE": "Pilihan bijak untuk menunda belanja! 💪 Keputusan dicatat.",
    }

    return {
        "success": True,
        "data": {
            "check_id": req.check_id,
            "status": "RECORDED",
            "decided_at": decided_at.isoformat(),
        },
        "message": messages.get(req.decision.value, "Keputusan berhasil dicatat."),
    }


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 3: POST /pre-purchase/feedback
# ═══════════════════════════════════════════════════════════════

@router.post(
    "/pre-purchase/feedback",
    response_model=None,
    status_code=201,
    summary="Rekam Feedback Pasca-Keputusan",
    description="Mengumpulkan label ground truth dari pengguna untuk continuous learning.",
)
async def record_feedback(req: FeedbackRecordRequest):
    """
    Mengumpulkan label verifikasi dari pengguna 1–3 hari setelah transaksi
    untuk dataset evaluasi model berikutnya (continuous learning pipeline).
    """
    if req.check_id not in _checks_store:
        raise HTTPException(
            status_code=404,
            detail=f"Check ID '{req.check_id}' tidak ditemukan.",
        )

    _feedbacks_store[req.check_id] = {
        "was_impulsive": req.was_impulsive,
        "satisfaction_rating": req.satisfaction_rating,
        "feedback_notes": req.feedback_notes,
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    return {
        "success": True,
        "message": (
            "Terima kasih atas feedback Anda! "
            "Data ini membantu sistem semakin mengenali pola keuangan Anda."
        ),
    }
