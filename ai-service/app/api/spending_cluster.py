"""
Spending Cluster Endpoint — Model 2
CEAMIS AI Service

Rule-based clustering pola pengeluaran user.
Akan diganti dengan K-Means trained model setelah training selesai.
"""

from fastapi import APIRouter
from app.schemas.request_response import SpendingClusterRequest, SpendingClusterResponse

router = APIRouter()

# Kategori yang diklasifikasikan sebagai "wants" (non-esensial)
WANTS_CATEGORIES = {
    "Hiburan & Streaming", "Belanja Online", "hiburan", "belanja",
    "streaming", "gaming", "ngopi", "nongkrong"
}

# Kategori yang diklasifikasikan sebagai "needs" (esensial)
NEEDS_CATEGORIES = {
    "Kos / Kontrakan", "Makan & Minum", "Transportasi", "Pulsa & Internet",
    "Kesehatan", "Pendidikan", "makan", "transportasi", "kesehatan"
}


@router.post(
    "/predict/spending-cluster",
    response_model=SpendingClusterResponse,
    summary="Clustering Pola Pengeluaran",
    description="Mengklasifikasikan pola pengeluaran user ke dalam cluster: Si Hemat, Si Impulsif, atau Si Boros."
)
async def predict_spending_cluster(request: SpendingClusterRequest) -> SpendingClusterResponse:
    breakdown = request.category_breakdown
    if not breakdown:
        return SpendingClusterResponse(
            user_id=request.user_id,
            cluster_id=1,
            cluster_label="Si Hemat",
            dominant_category="Belum ada data",
            insight="Tambahkan transaksi untuk mendapatkan analisis pola pengeluaran kamu!",
            needs_ratio=0.0,
            wants_ratio=0.0,
            savings_ratio=0.0,
            trend="stable",
            is_mock=True
        )

    total = sum(breakdown.values())
    if total == 0:
        total = 1

    # Hitung ratio needs vs wants
    needs_total = sum(v for k, v in breakdown.items() if k in NEEDS_CATEGORIES)
    wants_total = sum(v for k, v in breakdown.items() if k in WANTS_CATEGORIES)
    other_total = total - needs_total - wants_total

    needs_ratio = round(needs_total / total, 2)
    wants_ratio = round((wants_total + other_total * 0.5) / total, 2)

    # Dominant category
    dominant = max(breakdown, key=breakdown.get)
    dominant_ratio = breakdown[dominant] / total

    # Clustering logic
    if wants_ratio >= 0.45:
        cluster_id, label = 0, "Si Impulsif"
        insight = (
            f"Pengeluaran kamu {int(wants_ratio * 100)}% ke hal non-esensial! "
            f"Terbesar di '{dominant}'. Coba challenge diri sendiri: 30 hari no impulse buying! 🎯"
        )
        trend = "declining"
    elif wants_ratio >= 0.30 and dominant_ratio >= 0.40:
        cluster_id, label = 2, "Si Boros"
        insight = (
            f"Pengeluaran kamu lumayan, tapi {int(dominant_ratio * 100)}% habis di '{dominant}'. "
            f"Coba diversifikasi dan pangkas 20% dari kategori itu! 💸"
        )
        trend = "stable"
    else:
        cluster_id, label = 1, "Si Hemat"
        insight = (
            f"Mantap! Pengeluaran kamu terdistribusi dengan baik. "
            f"Pertahankan dan tingkatkan tabungan bulan depan! 🚀"
        )
        trend = "improving"

    return SpendingClusterResponse(
        user_id=request.user_id,
        cluster_id=cluster_id,
        cluster_label=label,
        dominant_category=dominant,
        insight=insight,
        needs_ratio=needs_ratio,
        wants_ratio=wants_ratio,
        savings_ratio=round(max(0.0, 1.0 - needs_ratio - wants_ratio), 2),
        trend=trend,
        is_mock=True
    )