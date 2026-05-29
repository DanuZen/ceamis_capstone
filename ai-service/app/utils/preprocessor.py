# app/utils/preprocessor.py
"""
Preprocessor Utility — CEAMIS AI Service

Menangani: Load artifacts & preprocessing khusus untuk Model 3 (Risk Profile)
"""

import numpy as np
import joblib
try:
    import tensorflow as tf
    _TF_AVAILABLE = True
except Exception:
    tf = None
    _TF_AVAILABLE = False

BASE = "app/models"

# ════════════════════════════════════════════════════════════════════════
# MODEL 3 — Risk Profile Classifier Custom Layers
# ════════════════════════════════════════════════════════════════════════

if _TF_AVAILABLE:
    class RiskProfileAttentionLayer(tf.keras.layers.Layer):
        """Custom attention layer dari notebook training Model 3."""
        def __init__(self, units=32, **kwargs):
            super(RiskProfileAttentionLayer, self).__init__(**kwargs)
            self.units = units
            self.dense = tf.keras.layers.Dense(units, activation="relu")

        def call(self, inputs):
            attention_weights = tf.nn.softmax(inputs, axis=-1)
            attended          = inputs * attention_weights
            return self.dense(attended)

        def get_config(self):
            config = super().get_config()
            config.update({"units": self.units})
            return config
else:
    RiskProfileAttentionLayer = None


if _TF_AVAILABLE:
    class WeightedCrossEntropyLoss(tf.keras.losses.Loss):
        """Custom loss function dari notebook training Model 3."""
        def __init__(self, class_weights=None, **kwargs):
            super().__init__(**kwargs)
            if class_weights is None:
                class_weights = [1.0, 1.0, 2.0]
            self.class_weights = tf.constant(class_weights, dtype=tf.float32)

        def call(self, y_true, y_pred):
            y_true    = tf.cast(y_true, tf.int32)
            y_true_oh = tf.one_hot(y_true, depth=3)
            y_pred    = tf.clip_by_value(y_pred, 1e-7, 1.0 - 1e-7)
            ce        = -tf.reduce_sum(y_true_oh * tf.math.log(y_pred), axis=-1)
            weights   = tf.reduce_sum(y_true_oh * self.class_weights, axis=-1)
            return tf.reduce_mean(weights * ce)

        def get_config(self):
            config = super().get_config()
            config.update({"class_weights": self.class_weights.numpy().tolist()})
            return config
else:
    WeightedCrossEntropyLoss = None

# Singleton variables
_risk_model    = None
_risk_scaler   = None
_risk_features = None

def load_risk_artifacts():
    """Load semua artefak Model 3 (Risk Profile) ke memori."""
    global _risk_model, _risk_scaler, _risk_features

    if _risk_model is None:
        print("Loading risk profile model...")
        try:
            _risk_model = tf.keras.models.load_model(
                f"{BASE}/risk_profile_v1.keras",
                custom_objects={
                    "RiskProfileAttentionLayer": RiskProfileAttentionLayer,
                    "WeightedCrossEntropyLoss":  WeightedCrossEntropyLoss,
                },
            )
        except Exception:
            _risk_model = tf.keras.models.load_model(
                f"{BASE}/risk_profile_v1.keras",
                custom_objects={"RiskProfileAttentionLayer": RiskProfileAttentionLayer},
                compile=False,
            )
            _risk_model.compile(
                optimizer="adam",
                loss=WeightedCrossEntropyLoss([1.0, 1.0, 2.0]),
                metrics=["accuracy"],
            )
        print("✅ Risk profile model loaded")

    if _risk_scaler is None:
        _risk_scaler = joblib.load(f"{BASE}/scaler_risk.pkl")
        print("✅ Risk scaler loaded")

    if _risk_features is None:
        _risk_features = joblib.load(f"{BASE}/feature_columns_risk.pkl")
        print(f"✅ Risk features loaded: {len(_risk_features)} features")

    return _risk_model, _risk_scaler, _risk_features

def preprocess_risk_input(data: dict, features: list) -> np.ndarray:
    """Susun feature vector dari request data sesuai urutan training."""
    vector = []
    for f in features:
        val = data.get(f, 0.0)
        if isinstance(val, bool):
            val = float(val)
        vector.append(float(val))
    return np.array([vector], dtype=np.float32)