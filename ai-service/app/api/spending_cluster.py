from fastapi import APIRouter
from app.schemas.request_response import SpendingClusterRequest, SpendingClusterResponse

router = APIRouter()

@router.post("/predict/spending-cluster", response_model=SpendingClusterResponse)
async def predict_spending_cluster(request: SpendingClusterRequest):
    """
    [MOCK] Clustering pola pengeluaran user.
    Akan diganti dengan K-Means model setelah training selesai.
    """

    # Mock: cek kategori terbesar
    dominant = max(request.category_breakdown, 
                   key=request.category_breakdown.get)
    total = sum(request.category_breakdown.values())
    dominant_ratio = request.category_breakdown[dominant] / total if total > 0 else 0

    if dominant == "hiburan" or dominant == "belanja":
        cluster_id, label = 0, "Si Impulsif"
        insight = "Pengeluaran kamu didominasi hal-hal non-esensial. Coba evaluasi ulang prioritasmu!"
    elif dominant_ratio < 0.4:
        cluster_id, label = 1, "Si Hemat"
        insight = "Pengeluaran kamu terdistribusi merata. Kamu cukup terkontrol!"
    else:
        cluster_id, label = 2, "Si Boros"
        insight = f"Pengeluaran kamu 40%+ habis di kategori {dominant}. Perlu diwaspadai!"

    return SpendingClusterResponse(
        user_id=request.user_id,
        cluster_id=cluster_id,
        cluster_label=label,
        dominant_category=dominant,
        insight=insight,
        is_mock=True
    )