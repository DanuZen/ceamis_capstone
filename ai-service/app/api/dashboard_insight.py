# app/api/dashboard_insight.py
from fastapi import APIRouter, HTTPException
from app.schemas.request_response import DashboardInsightRequest, DashboardInsightResponse
from app.services.insight_generator import insight_generator

router = APIRouter()

@router.post("/dashboard/insight", response_model=DashboardInsightResponse)
async def get_llm_xai_insight(payload: DashboardInsightRequest):
    """
    Endpoint XAI Dashboard Insight dengan jaminan teks utuh 
    dan proteksi fallback antar-LLM (Gemini <-> Groq).
    """
    try:
        # PERBAIKAN: Menambahkan kata kunci 'await' karena fungsi generator sekarang bersifat async
        narrative_insight = await insight_generator.generate_dashboard_insight(payload)
        
        return DashboardInsightResponse(
            status="success",
            user_id=payload.user_id,
            ai_insight=narrative_insight
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Gagal menyusun AI Dashboard Insight: {str(e)}"
        )