import os
import json
import joblib
import pandas as pd
import numpy as np

# Definisikan path absolut ke folder models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) # Menuju ke folder 'app'
MODEL_DIR = os.path.join(BASE_DIR, "models")

class PersonaPredictor:
    def __init__(self):
        # 1. Load model biner dan scaler
        self.model = joblib.load(os.path.join(MODEL_DIR, "cluster_model.pkl"))
        self.scaler = joblib.load(os.path.join(MODEL_DIR, "cluster_scaler.pkl"))
        
        # 2. Load manifest urutan fitur dan profil persona hasil training
        with open(os.path.join(MODEL_DIR, "cluster_features.json"), "r") as f:
            self.features = json.load(f)
            
        with open(os.path.join(MODEL_DIR, "cluster_profiles.json"), "r") as f:
            self.profiles = json.load(f)

    def predict(self, user_data_dict: dict) -> dict:
        """
        Menerima input berupa dictionary fitur bulanan dari satu pengguna,
        melakukan scaling, prediksi cluster, dan mapping ke persona finansial.
        """
        # Konversi dictionary ke DataFrame pandas
        df_input = pd.DataFrame([user_data_dict])
        
        # Pastikan seluruh kolom yang digunakan saat training ada. 
        # Jika ada kolom kategori (cat_...) yang absen pada data user ini, isi dengan nilai 0.
        for col in self.features:
            if col not in df_input.columns:
                df_input[col] = 0.0
                
        # Reorder/urutkan kolom agar sama persis dengan urutan cluster_features.json
        X_matrix = df_input[self.features].values
        
        # Transformasi dengan Scaler dan lakukan prediksi cluster ID
        X_scaled = self.scaler.transform(X_matrix)
        cluster_id = self.model.predict(X_scaled)[0]
        
        # Ambil metadata persona berdasarkan ID cluster hasil prediksi
        persona_metadata = self.profiles.get(str(cluster_id))
        
        return {
            "cluster_id": int(cluster_id),
            "persona": persona_metadata["label"],
            "description": persona_metadata["description"],
            "metrics_summary": persona_metadata["metrics_summary"]
        }

# Inisialisasi object secara global agar load model hanya terjadi 1 kali saat server start (Hemat Memori)
persona_predictor = PersonaPredictor()