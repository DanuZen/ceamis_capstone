# app/api/risk_profile.py
import numpy as np
from fastapi import APIRouter, HTTPException
from app.schemas.request_response import RiskProfileRequest, RiskProfileResponse
from app.services.risk_predictor import risk_predictor

router = APIRouter()

# Label mapping
LABEL_NAMES = ['Konservatif', 'Moderat', 'Agresif']

# Deskripsi & saran per profil
PROFILE_INFO = {
    "Konservatif": {
        "description": "Kamu lebih nyaman dengan pendekatan keuangan yang aman dan stabil. Fokus utamamu saat ini adalah memastikan kebutuhan dasar terpenuhi dan mulai membangun kebiasaan menabung.",
        "suggestion": "Mulai dengan menetapkan target tabungan kecil yang realistis. Prioritaskan dana darurat minimal 1 bulan pengeluaran sebelum memikirkan hal lain.",
        "budget_allocation": {
            "needs": "50%",
            "wants": "20%",
            "savings_investment": "30%",
            "primary_instruments": "Dana Darurat, Deposito, Reksadana Pasar Uang"
        }
    },
    "Moderat": {
        "description": "Kamu sudah cukup sadar finansial dan mulai berani mengelola keuangan lebih aktif. Kamu punya keseimbangan antara keamanan dan keinginan berkembang.",
        "suggestion": "Tetapkan target tabungan yang lebih ambisius dan mulai pisahkan pos pengeluaran dengan lebih terstruktur. Dana darurat 3 bulan adalah target berikutnya.",
        "budget_allocation": {
            "needs": "50%",
            "wants": "30%",
            "savings_investment": "20%",
            "primary_instruments": "Reksadana Pendapatan Tetap, Emas, Saham Blue Chip"
        }
    },
    "Agresif": {
        "description": "Kamu sangat goal-oriented dan punya disiplin finansial yang tinggi. Kamu siap untuk mengoptimalkan keuangan secara penuh dan mengejar target tabungan yang ambisius.",
        "suggestion": "Maksimalkan saving rate kamu dan buat target tabungan yang spesifik dengan deadline jelas. Kamu sudah siap untuk strategi keuangan yang lebih advanced.",
        "budget_allocation": {
            "needs": "40%",
            "wants": "20%",
            "savings_investment": "40%",
            "primary_instruments": "Saham Growth, Reksa Dana Saham, Kripto"
        }
    }
}


@router.post("/predict/risk-profile", response_model=RiskProfileResponse)
async def predict_risk_profile(request: RiskProfileRequest):
    try:
        input_dict = request.model_dump()
        proba = risk_predictor.predict_risk(input_dict)

        pred_idx = int(np.argmax(proba))
        pred_label = LABEL_NAMES[pred_idx]
        info = PROFILE_INFO[pred_label]

        return RiskProfileResponse(
            risk_profile      = pred_label,
            confidence        = round(float(proba[pred_idx]), 4),
            probabilities     = {
                "Konservatif": round(float(proba[0]), 4),
                "Moderat"    : round(float(proba[1]), 4),
                "Agresif"    : round(float(proba[2]), 4),
            },
            description       = info["description"],
            suggestion        = info["suggestion"],
            budget_allocation = info["budget_allocation"], 
            is_mock           = False
        )
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Model belum tersedia. Pastikan artifacts sudah ada di app/models/")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediksi gagal: {str(e)}")