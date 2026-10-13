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
from fastapi import APIRouter, HTTPException, Query, Depends

from app.schemas.pre_purchase_schema import ModelRollbackRequest
from app.utils.auth import verify_admin_role
from app.services.pre_purchase_repository import repository, MODEL_REGISTRY_PATH


router = APIRouter(dependencies=[Depends(verify_admin_role)])


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
    Mendukung database PostgreSQL dengan fallback ke registry JSON.
    """
    registry = await repository.load_model_registry()

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
async def rollback_model(
    req: ModelRollbackRequest,
    admin_user: dict = Depends(verify_admin_role),
):
    """
    Mengubah model aktif menjadi versi yang dipilih dan menonaktifkan versi lainnya.
    Mewajibkan alasan rollback dan mencatat jejak aksi ke audit_logs.
    """
    try:
        rollback_data = await repository.execute_model_rollback(
            target_model_version_id=req.target_model_version_id,
            reason=req.reason,
            admin_id=admin_user.get("sub"),
        )
    except ValueError as e:
        msg = str(e)
        status_code = 404 if "tidak ditemukan" in msg else 400
        raise HTTPException(status_code=status_code, detail=msg)

    return {
        "success": True,
        "data": rollback_data,
        "message": f"Model berhasil di-rollback ke {rollback_data['rolled_back_to']}.",
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
    Mendukung paginasi data dari repository.
    """
    audit_data = await repository.get_audit_logs(page=page, per_page=per_page)

    return {
        "success": True,
        "data": audit_data,
        "message": f"Menampilkan {len(audit_data['logs'])} dari {audit_data['pagination']['total']} log audit.",
    }
