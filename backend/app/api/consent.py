"""
Consent API Router — CEAMIS 2.0 (Tugas F3)
Pencatatan Persetujuan Eksplisit Partisipan (Informed Consent) & Penarikan Izin untuk Penelitian Tesis.

Endpoints:
  POST /api/v1/consent          — Catat pemberian persetujuan penelitian
  POST /api/v1/consent/withdraw — Catat pencabutan izin penelitian
  GET  /api/v1/consent/status   — Periksa status persetujuan penelitian pengguna saat ini
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query

from app.schemas.consent_schema import (
    ConsentRecordRequest,
    ConsentWithdrawRequest,
    ConsentStatusResponse,
)
from app.utils.auth import get_current_user, security
from app.services.pre_purchase_repository import repository
from fastapi.security import HTTPAuthorizationCredentials


router = APIRouter()


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[Dict[str, Any]]:
    """Mengekstrak user jika token tersedia, mengembalikan None jika tidak."""
    if credentials and credentials.credentials:
        try:
            from app.utils.auth import decode_supabase_jwt
            return decode_supabase_jwt(credentials.credentials)
        except Exception:
            return None
    return None


@router.post(
    "/consent",
    response_model=None,
    summary="Catat Persetujuan Partisipan",
    description="Mencatat persetujuan eksplisit partisipan untuk penggunaan data dalam penelitian tesis.",
)
async def record_participant_consent(
    req: ConsentRecordRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Mencatat pemberian izin penelitian."""
    user_id = (current_user or {}).get("sub") or req.user_id
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi diperlukan untuk mencatat persetujuan penelitian.",
        )

    record = await repository.record_consent(
        user_id=user_id,
        consent_version=req.consent_version or "v1.0",
        purpose=req.purpose,
    )

    return {
        "success": True,
        "data": record,
        "message": "Persetujuan partisipan berhasil dicatat.",
    }


@router.post(
    "/consent/withdraw",
    response_model=None,
    summary="Tarik Persetujuan Partisipan",
    description="Mencatat penarikan/pencabutan izin partisipasi penelitian oleh pengguna.",
)
async def withdraw_participant_consent(
    req: ConsentWithdrawRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Mencabut izin partisipasi penelitian."""
    user_id = (current_user or {}).get("sub") or req.user_id
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi diperlukan untuk menarik persetujuan penelitian.",
        )

    record = await repository.withdraw_consent(
        user_id=user_id,
        reason=req.reason,
    )

    return {
        "success": True,
        "data": record,
        "message": "Persetujuan penelitian berhasil dicabut.",
    }


@router.get(
    "/consent/status",
    response_model=None,
    summary="Status Persetujuan Partisipan",
    description="Membaca status persetujuan penelitian terkini untuk pengguna yang sedang aktif.",
)
async def get_participant_consent_status(
    user_id: Optional[str] = Query(None, description="User ID opsional jika tidak menggunakan JWT"),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
):
    """Membaca status persetujuan pengguna."""
    target_user_id = (current_user or {}).get("sub") or user_id
    if not target_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Autentikasi atau user_id diperlukan.",
        )

    record = await repository.get_consent_status(target_user_id)

    return {
        "success": True,
        "data": record,
        "message": "Status persetujuan penelitian berhasil diambil.",
    }
