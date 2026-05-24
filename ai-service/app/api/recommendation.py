from fastapi import APIRouter
from app.schemas.request_response import RecommendationRequest, RecommendationResponse, RecommendationItem

router = APIRouter()

@router.post("/predict/recommendation", response_model=RecommendationResponse)
async def get_recommendation(request: RecommendationRequest):
    """
    [MOCK] Rekomendasi finansial berdasarkan kondisi keuangan user.
    """

    recommendations = []

    # Rule sederhana sementara
    if request.wants_ratio > 0.30:
        recommendations.append(RecommendationItem(
            priority=1,
            action=f"Kurangi pengeluaran {request.most_spent_category}",
            reason=f"Pengeluaran wants kamu {request.wants_ratio*100:.0f}%, idealnya maksimal 30%",
            potential_saving=request.wants_ratio * 500000
        ))

    if request.saving_rate < 0.10:
        recommendations.append(RecommendationItem(
            priority=2,
            action="Tingkatkan saving rate minimal 10%",
            reason=f"Saving rate kamu baru {request.saving_rate*100:.0f}%, target minimal 10%",
            potential_saving=0
        ))

    if not recommendations:
        recommendations.append(RecommendationItem(
            priority=1,
            action="Pertahankan kebiasaan finansial kamu!",
            reason="Kondisi keuangan kamu sudah dalam jalur yang baik.",
            potential_saving=0
        ))

    # Recovery plan jika health score kritis
    recovery = None
    warning = None
    if request.health_score < 40:
        recovery = "Stop semua pengeluaran wants sampai akhir bulan. Fokus ke needs saja."
        warning = "Bestie, dompet kamu lagi sekarat nih 💀 Saatnya mode hemat darurat!"

    return RecommendationResponse(
        user_id=request.user_id,
        recommendations=recommendations,
        recovery_plan=recovery,
        warning_message=warning,
        is_mock=True
    )