from fastapi import APIRouter, HTTPException
from app.schemas.request_response import SpendingClusterRequest, SpendingClusterResponse
from app.services.persona_predictor import persona_predictor

router = APIRouter()

@router.post("/predict/spending-cluster", response_model=SpendingClusterResponse)
def analyze_persona(payload: SpendingClusterRequest):
    try:
        # 1. Konversi payload masuk ke bentuk python dictionary
        input_data = payload.dict()
        user_id = input_data.pop("user_id")
        # 2. Ekstrak fitur kategori dinamis (jika ada) dan satukan ke level utama dictionary
        cat_features = input_data.pop("category_features") or {}
        input_data.update(cat_features)
        
        # 3. Jalankan prediksi lewat service layer Anda
        result = persona_predictor.predict(input_data)
        
        # 4. Kembalikan response sesuai dengan format SpendingClusterResponse
        return {
            "status": "success",
            "message": "Persona successfully analyzed",
            "data": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada AI service: {str(e)}")