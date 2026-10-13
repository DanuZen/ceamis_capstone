"""
Schemas — Pydantic v2 Models untuk Persetujuan Partisipan (Informed Consent)
CEAMIS 2.0 — Tugas F3
"""

from pydantic import BaseModel, Field
from typing import Optional


class ConsentRecordRequest(BaseModel):
    """Payload pemberian persetujuan penelitian."""
    consent_version: str = Field("v1.0", description="Versi lembar informasi penelitian")
    purpose: str = Field(
        "Penelitian tesis evaluasi efektivitas intervensi pra-pembelian CEAMIS",
        description="Tujuan penggunaan data penelitian",
    )
    user_id: Optional[str] = Field(None, description="ID pengguna (opsional jika dikirim via JWT)")


class ConsentWithdrawRequest(BaseModel):
    """Payload penarikan persetujuan penelitian."""
    reason: Optional[str] = Field(None, description="Alasan penarikan izin (opsional)")
    user_id: Optional[str] = Field(None, description="ID pengguna (opsional jika dikirim via JWT)")


class ConsentStatusResponse(BaseModel):
    """Response status persetujuan penelitian pengguna."""
    id: Optional[str] = None
    user_id: str
    consent_version: str
    purpose: str
    given: bool
    given_at: Optional[str] = None
    withdrawn_at: Optional[str] = None
    created_at: Optional[str] = None
