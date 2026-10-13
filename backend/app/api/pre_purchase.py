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
from app.services.pre_purchase_repository import repository
from app.services.user_stats_service import user_stats_service


router = APIRouter()


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

    # Ambil konteks nyata (point-in-time, bebas kebocoran temporal, dan cold-start aware)
    now_utc = datetime.now(timezone.utc)
    user_context = await user_stats_service.get_user_context(
        user_id=user_id,
        category_id=req.category_id,
        check_time=now_utc,
    )

    cat_stats = user_context["category_stats"]
    budget_info = user_context["budget_info"]
    savings_info = user_context["savings_info"]
    profile = user_context["profile"]
    is_cold_start = user_context["cold_start"]

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
        now=now_utc,
    )
    features["cold_start"] = is_cold_start

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

    # Prediction snapshot
    prediction_record = {
        **prediction,
        "features_snapshot": features,
        "trigger_factors": trigger_factors,
        "cold_start": is_cold_start,
    }

    # Store check data via repository (supports in-memory and PostgreSQL)
    await repository.save_check(
        check_id=check_id,
        user_id=user_id,
        category_id=req.category_id,
        planned_amount=req.planned_amount,
        merchant_name=req.merchant_name,
        notes=req.notes,
        prediction_data=prediction_record,
        budget_remaining_before=budget_info["remaining"],
        budget_remaining_after=remaining_after,
        savings_delayed_days=delayed_days,
    )

    return {
        "success": True,
        "data": {
            "check_id": check_id,
            "risk_score": prediction["risk_score"],
            "risk_level": risk_level,
            "cold_start": is_cold_start,
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
    check = await repository.get_check(req.check_id)
    if not check:
        raise HTTPException(
            status_code=404,
            detail=f"Check ID '{req.check_id}' tidak ditemukan.",
        )

    # Verifikasi informed consent partisipan (Tugas F10 & F3)
    # Telemetri jeda waktu refleksi HANYA disimpan jika pengguna memiliki izin aktif
    user_id = check.get("user_id")
    stored_latency_ms = None
    if req.decision_latency_ms is not None and user_id:
        consent_status = await repository.get_consent_status(user_id)
        has_active_consent = (
            consent_status.get("given") is True
            and consent_status.get("withdrawn_at") is None
        )
        if has_active_consent:
            stored_latency_ms = req.decision_latency_ms
        else:
            stored_latency_ms = None

    decision_res = await repository.record_decision(
        check_id=req.check_id,
        decision=req.decision.value,
        adjusted_amount=req.adjusted_amount,
        decision_latency_ms=stored_latency_ms,
    )

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
            "decided_at": decision_res["decided_at"],
            "decision_latency_ms": decision_res.get("decision_latency_ms"),
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
    check = await repository.get_check(req.check_id)
    if not check:
        raise HTTPException(
            status_code=404,
            detail=f"Check ID '{req.check_id}' tidak ditemukan.",
        )

    await repository.record_feedback(
        check_id=req.check_id,
        was_impulsive=req.was_impulsive,
        satisfaction_rating=req.satisfaction_rating,
        feedback_notes=req.feedback_notes,
    )

    return {
        "success": True,
        "message": (
            "Terima kasih atas feedback Anda! "
            "Data ini membantu sistem semakin mengenali pola keuangan Anda."
        ),
    }
