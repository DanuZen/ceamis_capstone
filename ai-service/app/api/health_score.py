# app/api/health_score.py
from fastapi import APIRouter, HTTPException
# Import skema terpusat dari folder schemas/request_response Anda
from app.schemas.request_response import HealthScoreRequest, HealthScoreResponse
from app.utils.health_score_calculator import calculate_health_score

router = APIRouter()

@router.post("/predict/health-score", response_model=HealthScoreResponse)
async def calculate_health_score_endpoint(request: HealthScoreRequest):
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