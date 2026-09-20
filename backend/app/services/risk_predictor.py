import os
import numpy as np
from app.utils.preprocessor import load_risk_artifacts, preprocess_risk_input

class RiskPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.features = None
        self.is_ready = False

    def load_model_to_memory(self):
        """
        Memuat artefak model ke RAM. Dijalankan sekali saat startup via lifespan.
        """
        if not self.is_ready:
            try:
                self.model, self.scaler, self.features = load_risk_artifacts()
                self.is_ready = True
                print("🧠 [OK] Model 3 (Risk Profile Artifacts) berhasil dimuat ke memori.")
            except Exception as e:
                print(f"❌ [ERROR] Gagal memuat artefak Model 3: {e}")
                raise e

    def predict_risk(self, input_dict: dict) -> np.ndarray:
        """
        Melakukan inferensi instan langsung dari cache memori RAM.
        """
        if not self.is_ready:
            # Pengaman berlapis jika lifespan belum mengeksekusi load
            self.load_model_to_memory()
            
        # Transformasi data input sesuai dengan urutan fitur training
        X_raw = preprocess_risk_input(input_dict, self.features)
        X_scaled = self.scaler.transform(X_raw)
        
        # Eksekusi prediksi probabilitas
        proba = self.model.predict(X_scaled, verbose=0)[0]
        return proba

# Inisialisasi object secara global (Singleton Pattern)
risk_predictor = RiskPredictor()