"""
Authentication & Authorization Dependencies — CEAMIS 2.0
Verifikasi token JWT Supabase dan penegakan kontrol akses berbasis peran (RBAC).
"""

import os
from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from dotenv import load_dotenv

load_dotenv()

# Skema Bearer Token (auto_error=False agar kita bisa mereturn pesan 401 yang deskriptif)
security = HTTPBearer(auto_error=False)


def get_jwt_secret() -> str:
    """Mengambil secret key JWT dari variabel lingkungan."""
    return os.getenv("SUPABASE_JWT_SECRET", "").strip()


def decode_supabase_jwt(token: str) -> Dict[str, Any]:
    """
    Memvalidasi dan mendekode token JWT Supabase.
    Mendukung verifikasi tanda tangan HMAC (HS256) menggunakan SUPABASE_JWT_SECRET.
    """
    secret = get_jwt_secret()
    if not secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Konfigurasi SUPABASE_JWT_SECRET belum diatur pada backend.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Supabase token menggunakan algoritma HS256
        # Opsi verify_aud dinonaktifkan agar kompatibel dengan variasi format audience Supabase
        payload = jwt.decode(
            token,
            secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token telah kedaluwarsa.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token tidak valid: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Dict[str, Any]:
    """
    Dependensi untuk memverifikasi token Bearer pengguna.
    Mengembalikan payload token yang terdekode.
    """
    if credentials is None or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Header Authorization: Bearer <token> diperlukan.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return decode_supabase_jwt(credentials.credentials)


async def verify_admin_role(
    user_payload: Dict[str, Any] = Depends(get_current_user),
) -> Dict[str, Any]:
    """
    Dependensi untuk memastikan pengguna yang terautentikasi memiliki peran admin.
    Membaca klaim dari `app_metadata.role` (standar aman Supabase),
    dengan fallback ke `user_metadata.role` atau top-level `role`.
    """
    app_meta = user_payload.get("app_metadata") or {}
    user_meta = user_payload.get("user_metadata") or {}

    role = (
        app_meta.get("role")
        or user_meta.get("role")
        or user_payload.get("role")
    )

    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak: endpoint ini memerlukan peran administrator.",
        )

    return user_payload
