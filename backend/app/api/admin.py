"""
Admin Governance API Router — CEAMIS 2.0
Model management, audit logs, and operational metrics for admin dashboard.

Endpoints:
  GET  /api/v1/admin/models          — List ML model versions & metrics
  POST /api/v1/admin/models/rollback — Rollback to previous model version
  GET  /api/v1/admin/audit-logs      — View pre-purchase intervention audit logs
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query

from app.schemas.pre_purchase_schema import ModelRollbackRequest


router = APIRouter()

# ── Paths ──────────────────────────────────────────────
ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "artifacts_risk"
MODEL_REGISTRY_PATH = ARTIFACTS_DIR / "model_registry.json"


def _load_model_registry() -> list:
    """Load model registry from JSON file, or return defaults."""
    if MODEL_REGISTRY_PATH.exists():
        try:
            with open(MODEL_REGISTRY_PATH, "r") as f:
                return json.load(f)
        except Exception:
            pass

    # Default registry with baseline entries
    return [
        {
            "id": "a90184b2-29df-4573-a192-8812cbb41244",
            "version_tag": "v1.0.0-logreg",
            "algorithm": "LogisticRegression",
            "precision": 0.7630,
            "recall": 0.7100,
            "f1_score": 0.7355,
            "roc_auc": 0.7820,
            "is_active": False,
            "artifact_path": "artifacts_risk/logreg_v1.0.0.joblib",
            "deployed_at": "2026-09-10T08:00:00Z",
        },
        {
            "id": "c1f72a44-8839-4d91-bb27-729d4827d091",
            "version_tag": "v1.1.0-rf",
            "algorithm": "RandomForestClassifier",
            "precision": 0.8120,
            "recall": 0.7450,
            "f1_score": 0.7771,
            "roc_auc": 0.8350,
            "is_active": True,
            "artifact_path": "artifacts_risk/rf_v1.1.0.joblib",
            "deployed_at": "2026-09-18T10:00:00Z",
        },
    ]


def _save_model_registry(registry: list):
    """Persist model registry to JSON file."""
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    with open(MODEL_REGISTRY_PATH, "w") as f:
        json.dump(registry, f, indent=2)


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 1: GET /admin/models
# ═══════════════════════════════════════════════════════════════

@router.get(
    "/admin/models",
    summary="List Model ML Versions & Metrics",
    description="Menampilkan seluruh versi model ML yang terdaftar beserta metrik performanya.",
)
async def list_model_versions():
    """
    Mengembalikan daftar lengkap versi model yang pernah dilatih,
    beserta metrik Precision, Recall, F1-Score, dan status deployment.
    """
    registry = _load_model_registry()

    return {
        "success": True,
        "data": registry,
        "message": f"{len(registry)} model version(s) terdaftar.",
    }


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 2: POST /admin/models/rollback
# ═══════════════════════════════════════════════════════════════

@router.post(
    "/admin/models/rollback",
    summary="Rollback Model ke Versi Sebelumnya",
    description="Melakukan one-click rollback ke model versi stabil sebelumnya.",
)
async def rollback_model(req: ModelRollbackRequest):
    """
    Mengubah model aktif menjadi versi yang dipilih dan menonaktifkan versi lainnya.
    """
    registry = _load_model_registry()

    # Find target model
    target = None
    for model in registry:
        if model["id"] == req.target_model_version_id:
            target = model
            break

    if target is None:
        raise HTTPException(
            status_code=404,
            detail=f"Model version ID '{req.target_model_version_id}' tidak ditemukan.",
        )

    if target.get("is_active"):
        raise HTTPException(
            status_code=400,
            detail="Model tersebut sudah aktif. Tidak perlu rollback.",
        )

    # Deactivate all, activate target
    for model in registry:
        model["is_active"] = False
    target["is_active"] = True
    target["deployed_at"] = datetime.now(timezone.utc).isoformat()

    _save_model_registry(registry)

    return {
        "success": True,
        "data": {
            "rolled_back_to": target["version_tag"],
            "algorithm": target["algorithm"],
            "reason": req.reason,
            "deployed_at": target["deployed_at"],
        },
        "message": f"Model berhasil di-rollback ke {target['version_tag']}.",
    }


# ═══════════════════════════════════════════════════════════════
# ENDPOINT 3: GET /admin/audit-logs
# ═══════════════════════════════════════════════════════════════

@router.get(
    "/admin/audit-logs",
    summary="Intervention Audit Logs",
    description="Tinjau log audit keputusan pra-pembelian untuk analisis efektivitas.",
)
async def get_audit_logs(
    page: int = Query(1, ge=1, description="Nomor halaman"),
    per_page: int = Query(20, ge=1, le=100, description="Jumlah data per halaman"),
):
    """
    Mengembalikan log riwayat intervensi pra-pembelian beserta statistik ringkasan.
    Data mock untuk development — production akan query dari Supabase.
    """
    # Mock audit log data
    mock_logs = [
        {
            "id": "log-001",
            "user_id": "user-abc",
            "user_name": "Raka S.",
            "category_name": "Shopping",
            "planned_amount": 275000,
            "risk_level": "HIGH",
            "risk_score": 0.7845,
            "decision": "POSTPONE",
            "was_impulsive": True,
            "created_at": "2026-09-18T14:30:00Z",
        },
        {
            "id": "log-002",
            "user_id": "user-def",
            "user_name": "Aina W.",
            "category_name": "F&B",
            "planned_amount": 85000,
            "risk_level": "MEDIUM",
            "risk_score": 0.4523,
            "decision": "PROCEED",
            "was_impulsive": False,
            "created_at": "2026-09-17T10:15:00Z",
        },
        {
            "id": "log-003",
            "user_id": "user-ghi",
            "user_name": "Budi K.",
            "category_name": "Entertainment",
            "planned_amount": 350000,
            "risk_level": "HIGH",
            "risk_score": 0.8210,
            "decision": "ADJUST",
            "was_impulsive": None,
            "created_at": "2026-09-16T19:45:00Z",
        },
        {
            "id": "log-004",
            "user_id": "user-jkl",
            "user_name": "Sari M.",
            "category_name": "Transport",
            "planned_amount": 45000,
            "risk_level": "LOW",
            "risk_score": 0.1823,
            "decision": "PROCEED",
            "was_impulsive": False,
            "created_at": "2026-09-15T08:20:00Z",
        },
        {
            "id": "log-005",
            "user_id": "user-mno",
            "user_name": "Dani P.",
            "category_name": "Shopping",
            "planned_amount": 1250000,
            "risk_level": "HIGH",
            "risk_score": 0.9134,
            "decision": "POSTPONE",
            "was_impulsive": True,
            "created_at": "2026-09-14T16:50:00Z",
        },
    ]

    # Pagination
    total = len(mock_logs)
    start = (page - 1) * per_page
    end = start + per_page
    paginated = mock_logs[start:end]

    # Summary statistics
    total_checks = total
    total_prevented = sum(1 for log in mock_logs if log["decision"] in ["POSTPONE", "ADJUST"])
    prevention_rate = (total_prevented / total_checks * 100) if total_checks > 0 else 0
    total_amount_prevented = sum(
        log["planned_amount"] for log in mock_logs
        if log["decision"] in ["POSTPONE", "ADJUST"]
    )

    return {
        "success": True,
        "data": {
            "logs": paginated,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
            "summary": {
                "total_checks": total_checks,
                "total_prevented": total_prevented,
                "prevention_rate": round(prevention_rate, 1),
                "total_amount_prevented": total_amount_prevented,
            },
        },
        "message": f"Menampilkan {len(paginated)} dari {total} log audit.",
    }
