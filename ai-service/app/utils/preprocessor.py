<<<<<<< HEAD
"""
Preprocessor Utility — CEAMIS AI Service
Menangani transformasi data mentah transaksi frontend → fitur agregat model.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Any


# Kategori yang dianggap berisiko (pengeluaran impulsif)
RISKY_CATEGORIES = {"F&B", "hobi", "hiburan", "belanja", "fashion", "gaming"}

# Jam larut malam (>= 21:00 atau < 06:00)
LATE_NIGHT_HOURS = set(range(21, 24)) | set(range(0, 6))

# Urutan fitur yang harus sama persis dengan saat training
SAFE_FEATURES = [
    "pct_late_night",
    "pct_weekend",
    "pct_unbudgeted",
    "pct_risky_category",
    "pct_binge_spending",
    "avg_hourly_txn_count",
    "transaction_count",
    "saving_rate_raw",
    "wants_ratio_raw",
    "investment_rate_raw",
    "dti_ratio",
    "segment_enc",
]


def get_health_label(score: float) -> str:
    """Konversi skor numerik ke label kategori."""
    if score >= 80:
        return "Excellent"
    elif score >= 65:
        return "Sehat"
    elif score >= 50:
        return "Cukup"
    elif score >= 40:
        return "Waspada"
    else:
        return "Kritis"


def get_genz_message(score: float, label: str) -> str:
    """Generate pesan Gen-Z sarkas berdasarkan kondisi finansial."""
    messages = {
        "Excellent": "Bestie, kamu tuh kayak CFO-nya diri sendiri! Finansialmu literally goals banget. Keep it up! 🔥",
        "Sehat": "Oke sip, finansialmu cukup sehat nih. Tapi jangan santai-santai dulu, tetap pantau pengeluaranmu ya!",
        "Cukup": "Hmm, masih oke tapi ada ruang buat improve. Coba kurangin yang 'sekali-kali' itu — sekali-kali kamu tau sendiri berapa kali. 👀",
        "Waspada": "Sis/bro, dompetmu mulai kirim sinyal SOS nih. Waktunya evaluasi dan cut pengeluaran yang nggak perlu! ⚠️",
        "Kritis": "Bro/sis, ini darurat keuangan. Dompetmu udah nangis bombay. Warning System diaktifkan — tolong dengerin AI-nya kali ini! 🚨",
    }
    return messages.get(label, f"Skor finansialmu: {score:.1f}/100")


def compute_xai_factors(features: Dict[str, float]) -> Dict[str, Any]:
    """
    Hitung kontribusi relatif tiap fitur (rule-based XAI sederhana).
    Ini adalah approximasi — untuk XAI berbasis SHAP, integrate library shap setelah model dioptimasi.
    """
    # Bobot berdasarkan korelasi dengan health_score dari notebook
    weights = {
        "saving_rate_raw": 0.177,
        "pct_unbudgeted": 0.145,
        "dti_ratio": 0.140,
        "wants_ratio_raw": 0.120,
        "pct_late_night": 0.098,
        "segment_enc": 0.063,
        "investment_rate_raw": 0.044,
        "transaction_count": 0.021,
        "pct_weekend": 0.018,
        "pct_risky_category": 0.012,
        "avg_hourly_txn_count": 0.004,
        "pct_binge_spending": 0.001,
    }

    # Identifikasi faktor positif dan negatif
    positives = []
    negatives = []

    if features.get("saving_rate_raw", 0) > 0.20:
        positives.append({"faktor": "Tabungan sehat", "dampak": "positif", "nilai": f"{features['saving_rate_raw']*100:.0f}% income ditabung"})
    else:
        negatives.append({"faktor": "Tabungan rendah", "dampak": "negatif", "nilai": f"Hanya {features['saving_rate_raw']*100:.0f}% income ditabung"})

    if features.get("pct_unbudgeted", 0) > 0.40:
        negatives.append({"faktor": "Banyak pengeluaran tak terencana", "dampak": "negatif", "nilai": f"{features['pct_unbudgeted']*100:.0f}% transaksi di luar budget"})

    if features.get("dti_ratio", 0) > 0.30:
        negatives.append({"faktor": "Beban utang tinggi", "dampak": "negatif", "nilai": f"DTI ratio {features['dti_ratio']*100:.0f}%"})

    if features.get("wants_ratio_raw", 0) > 0.40:
        negatives.append({"faktor": "Pengeluaran keinginan berlebih", "dampak": "negatif", "nilai": f"{features['wants_ratio_raw']*100:.0f}% income untuk 'wants'"})

    if features.get("investment_rate_raw", 0) > 0.05:
        positives.append({"faktor": "Ada investasi", "dampak": "positif", "nilai": f"{features['investment_rate_raw']*100:.0f}% income diinvestasikan"})

    if features.get("pct_late_night", 0) > 0.20:
        negatives.append({"faktor": "Sering belanja larut malam", "dampak": "negatif", "nilai": f"{features['pct_late_night']*100:.0f}% transaksi di jam larut"})

    return {
        "positif": positives,
        "negatif": negatives,
        "faktor_terbesar": max(weights, key=weights.get),
        "penjelasan": "Skor dipengaruhi oleh pola tabungan, rasio utang, dan kebiasaan pengeluaran."
    }


def features_to_numpy(features: Dict[str, float]) -> np.ndarray:
    """Konversi dict fitur ke numpy array dengan urutan yang benar."""
    return np.array([[features[f] for f in SAFE_FEATURES]], dtype=np.float32)
=======
# app/utils/preprocessor.py
import pickle
import numpy as np
import tensorflow as tf
import joblib
import os

# ── Path artefak ──────────────────────────────────────────
BASE = "app/models"

# ── Custom components untuk load model ───────────────────
class RiskProfileAttentionLayer(tf.keras.layers.Layer):
    def __init__(self, units=32, **kwargs):
        super(RiskProfileAttentionLayer, self).__init__(**kwargs)
        self.units = units
        self.dense = tf.keras.layers.Dense(units, activation='relu')

    def call(self, inputs):
        attention_weights = tf.nn.softmax(inputs, axis=-1)
        attended          = inputs * attention_weights
        return self.dense(attended)

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config


class WeightedCrossEntropyLoss(tf.keras.losses.Loss):
    def __init__(self, class_weights=None, **kwargs):
        super().__init__(**kwargs)
        if class_weights is None:
            class_weights = [1.0, 1.0, 2.0]
        self.class_weights = tf.constant(
            class_weights, dtype=tf.float32
        )

    def call(self, y_true, y_pred):
        y_true    = tf.cast(y_true, tf.int32)
        y_true_oh = tf.one_hot(y_true, depth=3)
        y_pred    = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
        ce        = -tf.reduce_sum(
            y_true_oh * tf.math.log(y_pred), axis=-1
        )
        weights   = tf.reduce_sum(
            y_true_oh * self.class_weights, axis=-1
        )
        return tf.reduce_mean(weights * ce)

    def get_config(self):
        config = super().get_config()
        config.update({
            "class_weights": self.class_weights.numpy().tolist()
        })
        return config


# ── Singleton loader — load model sekali saat startup ─────
_risk_model   = None
_risk_scaler  = None
_risk_features= None

def load_risk_artifacts():
    """
    Load semua artefak Model 3.
    Pakai singleton supaya tidak load ulang tiap request.
    """
    global _risk_model, _risk_scaler, _risk_features

    if _risk_model is None:
        print("Loading risk profile model...")
        try:
            _risk_model = tf.keras.models.load_model(
                f"{BASE}/risk_profile_v1.keras",
                custom_objects={
                    'RiskProfileAttentionLayer': RiskProfileAttentionLayer,
                    'WeightedCrossEntropyLoss' : WeightedCrossEntropyLoss
                }
            )
        except Exception:
            _risk_model = tf.keras.models.load_model(
                f"{BASE}/risk_profile_v1.keras",
                custom_objects={
                    'RiskProfileAttentionLayer': RiskProfileAttentionLayer
                },
                compile=False
            )
            _risk_model.compile(
                optimizer = 'adam',
                loss      = WeightedCrossEntropyLoss([1.0, 1.0, 2.0]),
                metrics   = ['accuracy']
            )
        print("✅ Risk profile model loaded")

    if _risk_scaler is None:
        _risk_scaler = joblib.load(f"{BASE}/scaler_risk.pkl")
        print("✅ Risk scaler loaded")

    if _risk_features is None:
        _risk_features = joblib.load(
            f"{BASE}/feature_columns_risk.pkl"
        )
        print(f"✅ Risk features loaded: {len(_risk_features)} features")

    return _risk_model, _risk_scaler, _risk_features


def preprocess_risk_input(data: dict,
                           features: list) -> np.ndarray:
    """
    Susun feature vector dari request data.
    Urutan kolom harus SAMA dengan saat training.
    """
    vector = []
    for f in features:
        val = data.get(f, 0.0)
        # Konversi bool ke float
        if isinstance(val, bool):
            val = float(val)
        vector.append(float(val))

    return np.array([vector], dtype=np.float32)
>>>>>>> d52a41bd1303a70a9e533ff032112149fa6dfdee
