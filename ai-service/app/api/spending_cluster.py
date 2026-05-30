from fastapi import APIRouter, HTTPException
from app.schemas.request_response import SpendingClusterRequest, SpendingClusterResponse
from app.services.persona_predictor import persona_predictor
import pandas as pd  # Pastikan Pandas sudah terinstall untuk kebutuhan kalkulasi

router = APIRouter()

def hitung_feature_engineering_dari_db(user_id: str) -> dict:
    """
    Fungsi internal untuk menarik data transaksi mentah dari Supabase
    dan menghitung fitur-fitur statistik yang dibutuhkan oleh model ML.
    """
    # 1. TODO: Hubungkan dengan Client Supabase Anda
    # contoh:
    # response = supabase.table("transactions").select("*").eq("user_id", user_id).execute()
    # df_tx = pd.DataFrame(response.data)
    
    # ── MOCK DATA SIMULASI (Ganti bagian ini dengan hasil hitung Pandas Anda) ──
    # Ini adalah tempat Anda menaruh logika hitung rata-rata jam, weekend, rasio, dll.
    calculated_features = {
        "is_late_night": 0.15,      # Hasil hitung % transaksi malam dari DB
        "is_weekend": 0.40,         # Hasil hitung % transaksi weekend dari DB
        "is_unbudgeted": 0.22,
        "is_risky_category": 0.12,
        "is_binge_spending": 0.08,
        "hourly_txn_count": 1.4,
        "transaction_count": 32.0,
        "saving_rate_raw": 0.25,
        "wants_ratio_raw": 0.35,
        "investment_rate_raw": 0.05,
        "dti_ratio_raw": 0.10,
        # Hitung proporsi kategori secara dinamis di sini
        "category_features": {
            "cat_hobi": 0.10,
            "cat_f&b": 0.50,
            "cat_hiburan": 0.15
        }
    }
    # ──────────────────────────────────────────────────────────────────────────
    
    return calculated_features


@router.post("/predict/spending-cluster", response_model=SpendingClusterResponse)
def analyze_persona(payload: SpendingClusterRequest):
    try:
        # 1. Ambil user_id dari payload masuk (bawaan dari frontend/Node.js)
        user_id = payload.user_id
        
        # 2. JALANKAN FEATURE ENGINEERING
        # Abaikan nilai default 0.0 dari payload, kita hitung nilai aslinya langsung dari database
        input_data = hitung_feature_engineering_dari_db(user_id)
        
        # 3. Ekstrak fitur kategori dinamis dan satukan ke level utama dictionary
        # (Mempertahankan logika aslimu agar cocok dengan input persona_predictor)
        cat_features = input_data.pop("category_features") or {}
        input_data.update(cat_features)
        
        # 4. Jalankan prediksi lewat service layer menggunakan data yang SUDAH MATANG
        result = persona_predictor.predict(input_data)
        
        # 5. Kembalikan response sesuai dengan format SpendingClusterResponse
        return {
            "status": "success",
            "message": "Persona successfully analyzed using real-time feature engineering",
            "data": result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Terjadi kesalahan pada AI service: {str(e)}")