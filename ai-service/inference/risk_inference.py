import os
import joblib
import numpy as np
import tensorflow as tf

# ══════════════════════════════════════════════════════════
# 1. DEFINISI CUSTOM LAYER (Wajib untuk Load Model Keras)
# ══════════════════════════════════════════════════════════
class RiskProfileAttentionLayer(tf.keras.layers.Layer):
    def __init__(self, units=32, **kwargs):
        super(RiskProfileAttentionLayer, self).__init__(**kwargs)
        self.units = units
        self.dense = tf.keras.layers.Dense(units, activation='relu')

    def call(self, inputs):
        attention_weights = tf.nn.softmax(inputs, axis=-1)
        return self.dense(inputs * attention_weights)

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config


# ══════════════════════════════════════════════════════════
# 2. LOAD ARTIFACTS (MODEL & SCALER)
# ══════════════════════════════════════════════════════════
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("--- Memuat Artifacts Model ---")

# Path ke direktori models di app/models
ARTIFACTS_DIR = os.path.abspath(os.path.join(BASE_DIR, '..', 'app', 'models'))

SCALER_PATH = os.path.join(ARTIFACTS_DIR, 'scaler_risk.pkl')
MODEL_PATH = os.path.join(ARTIFACTS_DIR, 'risk_profile_v1.keras')
FEATURES_PATH = os.path.join(ARTIFACTS_DIR, 'feature_columns_risk.pkl')

# Load artifacts
scaler = joblib.load(SCALER_PATH)
features_list = joblib.load(FEATURES_PATH)

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={'RiskProfileAttentionLayer': RiskProfileAttentionLayer},
    compile=False
)
print("✅ Model & Scaler siap digunakan!\n")


# ══════════════════════════════════════════════════════════
# 3. DATA INPUT BARU (MOCK DATA USER)
# ══════════════════════════════════════════════════════════
# Menggunakan format dictionary (JSON-like) mirip input dari frontend
data_user_baru = {
    'saving_rate': 0.35, 'dti_ratio': 0.10, 'disposable_ratio': 0.50, 'expense_ratio': 0.25, 'ceamis_score': 82.5,
    'punya_tabungan': 1, 'jumlah_tabungan_bulan': 750000.0, 
    'SAVEHABIT': 4, 'SELFCONTROL_1': 4, 'SCFHORIZON': 5, 'FINGOALS': 4,
    'toleransi_rugi_enc': 2, 'tujuan_keuangan_enc': 1, 'tanggungan_keluarga': 0, 'Age': 21, 'city_tier_enc': 2,
    'occ_Professional': 0, 'occ_Retired': 0, 'occ_Self_Employed': 0, 'occ_Student': 1
}


# ══════════════════════════════════════════════════════════
# 4. PROSES INFERENCE (PREDIKSI)
# ══════════════════════════════════════════════════════════
print("--- Menjalankan Proses Inference ---")

# 1. Urutkan fitur sesuai urutan kolom saat training
ordered_features = [data_user_baru[feat] for feat in features_list]

# 2. Ubah menjadi matriks 2D (1, n_features)
data_matrix = np.array([ordered_features], dtype=np.float32)

# 3. Scaling data input
data_scaled = scaler.transform(data_matrix)

# 4. Prediksi probabilitas menggunakan model TensorFlow
probabilities = model.predict(data_scaled, verbose=0)[0]

# 5. Ambil index kelas dengan probabilitas tertinggi
label_names = ['Konservatif', 'Moderat', 'Agresif']
predicted_idx = np.argmax(probabilities)


# ══════════════════════════════════════════════════════════
# 5. OUTPUT HASIL PREDIKSI
# ══════════════════════════════════════════════════════════
print("\n================ HASIL INFERENCE ================")
print(f"Hasil Prediksi Profil Risiko : {label_names[predicted_idx]}")
print(f"Tingkat Keyakinan (Confidence) : {probabilities[predicted_idx] * 100:.2f}%")
print("-------------------------------------------------")
print("Detail Probabilitas:")
for i, label in enumerate(label_names):
    print(f" - {label:12s} : {probabilities[i] * 100:.2f}%")
print("=================================================")
