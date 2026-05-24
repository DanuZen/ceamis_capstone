"""
Health Score Endpoint — Model 1 (Financial Health Score)
CEAMIS AI Service

Menggunakan model financial_health_model.keras + scaler.pkl untuk
memprediksi skor kesehatan finansial user (0–100).
Warning System diaktifkan jika skor < 40.
"""

import os
import numpy as np
import joblib
import tensorflow as tf
from fastapi import APIRouter, HTTPException
from pathlib import Path

from app.schemas.request_response import HealthScoreRequest, HealthScoreResponse
from app.utils.preprocessor import (
    get_health_label,
    get_genz_message,
    compute_xai_factors,
    features_to_numpy,
    SAFE_FEATURES,
)

router = APIRouter()

# ─── Path ke model artifacts ─────────────────────────────────────────────────
MODELS_DIR = Path(__file__).parent.parent / "models"
MODEL_PATH = MODELS_DIR / "financial_health_model.keras"
SCALER_PATH = MODELS_DIR / "scaler.pkl"
FEATURE_COLS_PATH = MODELS_DIR / "feature_columns.pkl"

# ─── Ambang batas Warning System ─────────────────────────────────────────────
WARNING_THRESHOLD = 40.0  # health_score < 40 → Warning System aktif


# ─── Custom components dari notebook (wajib didaftarkan agar model bisa di-load) ─
@tf.keras.utils.register_keras_serializable()
class FinancialAttentionLayer(tf.keras.layers.Layer):
    """Custom attention layer dari notebook training Model 1."""

    def __init__(self, units=13, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.score_dense = tf.keras.layers.Dense(units, activation="tanh")
        self.weight_dense = tf.keras.layers.Dense(units, activation="softmax")

    def call(self, inputs):
        scores = self.score_dense(inputs)
        weights = self.weight_dense(scores)
        return inputs * weights

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units})
        return config


@tf.keras.utils.register_keras_serializable()
def custom_health_loss(y_true, y_pred):
    """Custom loss: penalty 2x untuk prediksi di zona kritis (score < 40)."""
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred, tf.float32)
    error = tf.abs(y_true - y_pred)
    penalty = tf.where(y_true < 40, error * 2.0, error)
    return tf.reduce_mean(penalty)


# ─── Singleton: load model & scaler sekali saat startup ──────────────────────
_model = None
_scaler = None


def _load_artifacts():
    """Lazy-load model dan scaler. Thread-safe untuk single worker."""
    global _model, _scaler

    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model tidak ditemukan: {MODEL_PATH}")
        _model = tf.keras.models.load_model(
            str(MODEL_PATH),
            custom_objects={
                "FinancialAttentionLayer": FinancialAttentionLayer,
                "custom_health_loss": custom_health_loss,
            },
        )

    if _scaler is None:
        if not SCALER_PATH.exists():
            raise FileNotFoundError(f"Scaler tidak ditemukan: {SCALER_PATH}")
        _scaler = joblib.load(str(SCALER_PATH))

    return _model, _scaler


# ─── Endpoint ─────────────────────────────────────────────────────────────────

@router.post(
    "/health-score",
    response_model=HealthScoreResponse,
    summary="Prediksi Skor Kesehatan Finansial",
    description=(
        "Memprediksi health score (0-100) dari fitur perilaku dan finansial user. "
        "Jika skor < 40, `warning_triggered = True` dan Warning System di frontend diaktifkan."
    ),
    tags=["Health Score"],
)
async def predict_health_score(request: HealthScoreRequest) -> HealthScoreResponse:
    try:
        model, scaler = _load_artifacts()
    except FileNotFoundError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gagal memuat model: {e}")

    # Konversi request ke dict fitur dengan urutan SAFE_FEATURES
    features_dict = {
        "pct_late_night": request.pct_late_night,
        "pct_weekend": request.pct_weekend,
        "pct_unbudgeted": request.pct_unbudgeted,
        "pct_risky_category": request.pct_risky_category,
        "pct_binge_spending": request.pct_binge_spending,
        "avg_hourly_txn_count": request.avg_hourly_txn_count,
        "transaction_count": float(request.transaction_count),
        "saving_rate_raw": request.saving_rate_raw,
        "wants_ratio_raw": request.wants_ratio_raw,
        "investment_rate_raw": request.investment_rate_raw,
        "dti_ratio": request.dti_ratio,
        "segment_enc": float(request.segment_enc),
    }

    # Preprocessing
    X = features_to_numpy(features_dict)
    X_scaled = scaler.transform(X)

    # Inferensi
    raw_pred = model.predict(X_scaled, verbose=0)
    score = float(np.clip(raw_pred[0][0], 0.0, 100.0))

    # Labeling & messaging
    label = get_health_label(score)
    warning_triggered = score < WARNING_THRESHOLD
    message = get_genz_message(score, label)
    xai = compute_xai_factors(features_dict)

    return HealthScoreResponse(
        health_score=round(score, 2),
        health_label=label,
        warning_triggered=warning_triggered,
        xai_factors=xai,
        message=message,
    )


@router.get(
    "/health-score/info",
    summary="Info model Health Score",
    tags=["Health Score"],
)
async def health_score_info():
    """Informasi model dan threshold Warning System."""
    return {
        "model": "financial_health_model.keras",
        "features": SAFE_FEATURES,
        "output_range": "0 – 100",
        "labels": {
            "Excellent": "≥ 80",
            "Sehat": "65 – 79",
            "Cukup": "50 – 64",
            "Waspada": "40 – 49",
            "Kritis": "< 40",
        },
        "warning_threshold": WARNING_THRESHOLD,
        "warning_description": "Warning System otomatis aktif jika health_score < 40",
    }
