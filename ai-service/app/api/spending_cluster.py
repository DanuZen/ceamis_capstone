"""
Spending Cluster Endpoint — Model 2 (Real KMeans Version)
CEAMIS AI Service

Financial persona clustering
menggunakan trained KMeans model.
"""

from fastapi import APIRouter
import pandas as pd

from app.schemas.request_response import (
    SpendingClusterRequest,
    SpendingClusterResponse
)

from app.services.persona_predictor import (
    predict_persona
)

# =========================================================
# ROUTER
# =========================================================

router = APIRouter()

# =========================================================
# ENDPOINT
# =========================================================

@router.post(
    "/predict/spending-cluster",
    response_model=SpendingClusterResponse,
    summary="Financial Persona Clustering",
    description="""
    Mengklasifikasikan pola finansial user
    menggunakan trained KMeans clustering model.
    """
)
async def predict_spending_cluster(
    request: SpendingClusterRequest
) -> SpendingClusterResponse:

    # =====================================================
    # CONVERT REQUEST TO DATAFRAME
    # =====================================================

    input_data = pd.DataFrame([{

        # USER
        "user_id":
            request.user_id,

        # TRANSACTION
        "transaction_datetime":
            request.transaction_datetime,

        "category":
            request.category,

        "amount":
            request.amount,

        # BEHAVIOR FEATURES
        "is_late_night":
            request.is_late_night,

        "is_weekend":
            request.is_weekend,

        "is_unbudgeted":
            request.is_unbudgeted,

        "is_risky_category":
            request.is_risky_category,

        "is_binge_spending":
            request.is_binge_spending,

        "hourly_txn_count":
            request.hourly_txn_count,

        # FINANCIAL FEATURES
        "income_monthly":
            request.income_monthly,

        "total_expense":
            request.total_expense,

        "wants_spending":
            request.wants_spending,

        "total_debt_payment":
            request.total_debt_payment,

        "investment_amount":
            request.investment_amount

    }])

    # =====================================================
    # RUN PREDICTION
    # =====================================================

    prediction_result = predict_persona(
        input_data
    )

    result = prediction_result[0]

    # =====================================================
    # RETURN RESPONSE
    # =====================================================

    return SpendingClusterResponse(

        cluster=
            result["cluster"],

        cluster_label=
            result["persona_label"],

        cluster_description=
            result["persona_description"],

        metrics_summary=
            result["metrics_summary"]
    )