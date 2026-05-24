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
