from fastapi import APIRouter
from app.schemas.request_response import RiskProfileRequest, RiskProfileResponse

router = APIRouter()

@router.post("/predict/risk-profile", response_model=RiskProfileResponse)
async def predict_risk_profile(request: RiskProfileRequest):
    """
    [MOCK] Klasifikasi profil risiko finansial user dari data onboarding.
    Akan diganti dengan model TensorFlow Classifier setelah training selesai.
    """

    # Mock: rule-based scoring sementara
    score = 0.5   # default moderat

    if request.primary_goal == "investasi":
        score += 0.2
    if request.financial_literacy_level == "mahir":
        score += 0.15
    elif request.financial_literacy_level == "pemula":
        score -= 0.15
    if request.spending_habit == "hemat":
        score += 0.1
    elif request.spending_habit == "boros":
        score -= 0.1
    if request.income_source == "kerja tetap":
        score += 0.05

    score = round(min(max(score, 0.0), 1.0), 2)

    if score >= 0.65:
        profile = "agresif"
        description = "Kamu siap mengambil risiko lebih tinggi untuk return yang lebih besar."
        allocation = {"saham": "60%", "reksa_dana": "25%", "emas": "10%", "tabungan": "5%"}
    elif score >= 0.35:
        profile = "moderat"
        description = "Kamu nyaman dengan risiko seimbang antara keamanan dan pertumbuhan."
        allocation = {"reksa_dana": "40%", "saham": "30%", "emas": "15%", "tabungan": "15%"}
    else:
        profile = "konservatif"
        description = "Kamu lebih nyaman dengan instrumen yang aman dan stabil."
        allocation = {"tabungan": "50%", "deposito": "30%", "emas": "15%", "reksa_dana": "5%"}

    return RiskProfileResponse(
        user_id=request.user_id,
        risk_profile=profile,
        risk_score=score,
        description=description,
        suggested_allocation=allocation,
        is_mock=True
    )