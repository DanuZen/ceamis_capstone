from fastapi import APIRouter
from app.schemas.request_response import HealthScoreRequest, HealthScoreResponse

router = APIRouter()

@router.post("/predict/health-score", response_model=HealthScoreResponse)
async def predict_health_score(request: HealthScoreRequest):
    """
    [MOCK] Prediksi skor kesehatan finansial user.
    Akan diganti dengan model TensorFlow setelah training selesai.
    """

    # Logic sementara: rule-based sederhana
    score = 0.0
    score += request.saving_rate * 40        # max 40 poin
    score += request.budget_adherence_score * 30  # max 30 poin
    score += (1 - request.wants_ratio) * 20  # max 20 poin
    score += (1 - request.impulsive_ratio) * 10  # max 10 poin
    score = round(min(score * 100, 100), 2)

    if score >= 85:
        label = "excellent"
        explanation = "Keuangan kamu sangat sehat! Saving rate tinggi dan pengeluaran terkontrol."
    elif score >= 70:
        label = "sehat"
        explanation = "Keuangan kamu cukup baik. Tetap pertahankan kebiasaan ini!"
    elif score >= 55:
        label = "cukup"
        explanation = "Keuangan kamu lumayan, tapi masih ada ruang untuk diperbaiki."
    elif score >= 40:
        label = "waspada"
        explanation = "Hati-hati! Pengeluaranmu mulai tidak terkontrol."
    else:
        label = "kritis"
        explanation = "Keuanganmu dalam kondisi kritis. Segera kurangi pengeluaran wants."

    return HealthScoreResponse(
        user_id=request.user_id,
        month=request.month,
        health_score=score,
        health_label=label,
        explanation=explanation,
        is_mock=True
    )