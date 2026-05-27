# app/api/health_score.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.utils.health_score_calculator import calculate_health_score

router = APIRouter()


class HealthScoreRequest(BaseModel):
    # Segmen user
    segmen           : str    # "A" | "B" | "C"

    # Rasio keuangan (dihitung BE dari transaksi)
    saving_rate      : float  # 0-1
    wants_ratio      : float  # 0-1
    dti_ratio        : float  # 0-1
    impulsive_ratio  : float  # 0-1
    budget_adherence : float  # 0-1

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


@router.post("/predict/health-score",
             response_model=HealthScoreResponse)
async def calculate_health_score_endpoint(
    request: HealthScoreRequest
):
    """
    Hitung health score berdasarkan formula DS.
    Pure formula — tidak menggunakan ML model.
    Hasil selalu akurat dan explainable (XAI).
    """
    if request.segmen not in ("A", "B", "C"):
        raise HTTPException(
            status_code=400,
            detail="segmen harus 'A', 'B', atau 'C'"
        )

    result = calculate_health_score(
        segmen           = request.segmen,
        saving_rate      = request.saving_rate,
        wants_ratio      = request.wants_ratio,
        dti_ratio        = request.dti_ratio,
        impulsive_ratio  = request.impulsive_ratio,
        budget_adherence = request.budget_adherence,
    )

    return HealthScoreResponse(**result)