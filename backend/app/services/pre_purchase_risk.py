"""
Risk Model Service — Feature Extraction & ML Inference
CEAMIS 2.0 — Fitur Inti Pra-Pembelian

Referensi:
  docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md
  docs/ceamis 2.0/API_SPECIFICATION.md §3.1

7 Fitur Kontekstual:
  1. amount_ratio_median      — nominal / median(kategori user)
  2. budget_remaining_ratio   — nominal / sisa pagu kategori
  3. category_frequency       — frekuensi 7 hari terakhir pada kategori
  4. day_of_week              — hari transaksi (0=Senin..6=Minggu)
  5. days_to_reset            — hari tersisa sebelum reset siklus anggaran
  6. savings_impact           — nominal / target tabungan aktif
  7. deviation_from_pattern   — z-score deviasi dari riwayat kategori
"""

import os
import json
import math
import joblib
import numpy as np
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional


# ── Paths ────────────────────────────────────────────────
ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "artifacts_risk"
MODEL_METADATA_PATH = ARTIFACTS_DIR / "model_metadata.json"


class PrePurchaseRiskPredictor:
    """
    Stateless feature extraction + ML inference for pre-purchase risk.
    Falls back to rule-based scoring if no trained model is available.
    """

    def __init__(self):
        self._model = None
        self._scaler = None
        self._metadata: dict = {}
        self._is_loaded = False

    # ── Model Loading ────────────────────────────────────

    def load_model(self):
        """Load trained joblib model and scaler from artifacts_risk/."""
        try:
            model_path = ARTIFACTS_DIR / "risk_model.joblib"
            scaler_path = ARTIFACTS_DIR / "risk_scaler.joblib"

            if model_path.exists():
                self._model = joblib.load(model_path)
                print(f"✅ Risk Model loaded: {model_path.name}")

            if scaler_path.exists():
                self._scaler = joblib.load(scaler_path)
                print(f"✅ Risk Scaler loaded: {scaler_path.name}")

            if MODEL_METADATA_PATH.exists():
                with open(MODEL_METADATA_PATH, "r") as f:
                    self._metadata = json.load(f)
                print(f"✅ Model metadata loaded: {self._metadata.get('version_tag', 'unknown')}")

            self._is_loaded = self._model is not None
        except Exception as e:
            print(f"⚠️  Risk model loading failed: {e}")
            self._is_loaded = False

    @property
    def is_ml_available(self) -> bool:
        return self._is_loaded and self._model is not None

    @property
    def metadata(self) -> dict:
        return self._metadata

    # ── Feature Extraction ───────────────────────────────

    def extract_features(
        self,
        planned_amount: float,
        category_median: float,
        budget_remaining: float,
        category_freq_7d: int,
        budget_reset_day: int,
        savings_goal_target: float,
        category_mean: float,
        category_std: float,
        now: Optional[datetime] = None,
    ) -> dict:
        """
        Extract 7 contextual features from the pre-purchase request context.
        Returns a dict keyed by feature name.
        """
        if now is None:
            now = datetime.now(timezone.utc)

        # 1. amount_ratio_median
        safe_median = max(category_median, 1.0)
        amount_ratio_median = planned_amount / safe_median

        # 2. budget_remaining_ratio
        safe_remaining = max(budget_remaining, 1.0)
        budget_remaining_ratio = planned_amount / safe_remaining

        # 3. category_frequency (7 hari terakhir)
        category_frequency = float(category_freq_7d)

        # 4. day_of_week (0=Senin, 6=Minggu)
        day_of_week = float(now.weekday())

        # 5. days_to_reset
        today = now.day
        if today <= budget_reset_day:
            days_to_reset = float(budget_reset_day - today)
        else:
            # Estimasi hari ke reset bulan depan
            days_to_reset = float(30 - today + budget_reset_day)

        # 6. savings_impact
        safe_savings = max(savings_goal_target, 1.0)
        savings_impact = planned_amount / safe_savings

        # 7. deviation_from_pattern (z-score)
        safe_std = max(category_std, 1.0)
        deviation_from_pattern = abs(planned_amount - category_mean) / safe_std

        return {
            "amount_ratio_median": round(amount_ratio_median, 4),
            "budget_remaining_ratio": round(budget_remaining_ratio, 4),
            "category_frequency": category_frequency,
            "day_of_week": day_of_week,
            "days_to_reset": days_to_reset,
            "savings_impact": round(savings_impact, 4),
            "deviation_from_pattern": round(deviation_from_pattern, 4),
        }

    # ── Inference ────────────────────────────────────────

    def predict(self, features: dict) -> dict:
        """
        Run ML inference or fallback to rule-based scoring.
        Returns: { risk_score, risk_level, method }
        """
        feature_vector = np.array([[
            features["amount_ratio_median"],
            features["budget_remaining_ratio"],
            features["category_frequency"],
            features["day_of_week"],
            features["days_to_reset"],
            features["savings_impact"],
            features["deviation_from_pattern"],
        ]])

        if self.is_ml_available:
            return self._predict_ml(feature_vector, features)
        else:
            return self._predict_rule_based(features)

    def _predict_ml(self, feature_vector: np.ndarray, features: dict) -> dict:
        """ML model inference with probability output."""
        try:
            if self._scaler is not None:
                feature_vector = self._scaler.transform(feature_vector)

            # predict_proba returns [[P(safe), P(risky)]]
            proba = self._model.predict_proba(feature_vector)[0]
            risk_score = float(proba[1])  # P(risky)

            risk_level = self._score_to_level(risk_score)

            return {
                "risk_score": round(risk_score, 4),
                "risk_level": risk_level,
                "method": f"ml_{self._metadata.get('algorithm', 'unknown')}",
                "model_version": self._metadata.get("version_tag", "unknown"),
            }
        except Exception as e:
            print(f"⚠️  ML inference failed, falling back to rule-based: {e}")
            return self._predict_rule_based(features)

    def _predict_rule_based(self, features: dict) -> dict:
        """
        Baseline rule-based risk scoring (fallback / benchmark).
        Formula from docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md §2.1
        """
        score = 0.0

        # Rasio nominal vs median (bobot tertinggi)
        ratio = features["amount_ratio_median"]
        if ratio > 3.0:
            score += 0.35
        elif ratio > 2.0:
            score += 0.25
        elif ratio > 1.5:
            score += 0.15

        # Rasio terhadap sisa anggaran
        budget_ratio = features["budget_remaining_ratio"]
        if budget_ratio > 1.0:
            score += 0.30  # Overbudget
        elif budget_ratio > 0.5:
            score += 0.20
        elif budget_ratio > 0.3:
            score += 0.10

        # Frekuensi belanja berulang 7 hari
        freq = features["category_frequency"]
        if freq >= 5:
            score += 0.10
        elif freq >= 3:
            score += 0.05

        # Dampak tabungan
        sav = features["savings_impact"]
        if sav > 0.5:
            score += 0.15
        elif sav > 0.2:
            score += 0.08

        # Deviasi dari pola
        dev = features["deviation_from_pattern"]
        if dev > 2.0:
            score += 0.10
        elif dev > 1.5:
            score += 0.05

        risk_score = min(score, 1.0)
        risk_level = self._score_to_level(risk_score)

        return {
            "risk_score": round(risk_score, 4),
            "risk_level": risk_level,
            "method": "rule_based_baseline",
            "model_version": "baseline-v1.0",
        }

    # ── Trigger Factors Generation ───────────────────────

    def generate_trigger_factors(
        self,
        features: dict,
        planned_amount: float,
        category_name: str,
        category_median: float,
        budget_remaining: float,
        remaining_after: float,
    ) -> list[str]:
        """
        Generate human-readable trigger factor explanations (XAI).
        """
        factors = []

        # Amount anomaly
        ratio = features["amount_ratio_median"]
        if ratio > 1.5:
            factors.append(
                f"Nominal belanja ini {ratio:.1f}x lebih besar dari rata-rata "
                f"pengeluaran {category_name} Anda (Rp {category_median:,.0f})."
            )

        # Budget pressure
        budget_ratio = features["budget_remaining_ratio"]
        if budget_ratio > 0.5:
            pct = max(0, (budget_remaining / max(budget_remaining + planned_amount, 1))) * 100
            factors.append(
                f"Sisa anggaran {category_name} bulan ini tinggal "
                f"Rp {budget_remaining:,.0f} ({pct:.0f}% dari total pagu)."
            )

        # Overbudget warning
        if remaining_after < 0:
            factors.append(
                f"Transaksi ini berpotensi memicu overbudget "
                f"sebesar Rp {abs(remaining_after):,.0f}."
            )

        # Binge-spending pattern
        freq = features["category_frequency"]
        if freq >= 3:
            factors.append(
                f"Anda sudah bertransaksi {int(freq)} kali pada kategori "
                f"{category_name} dalam 7 hari terakhir."
            )

        # Savings impact
        sav = features["savings_impact"]
        if sav > 0.1:
            factors.append(
                f"Transaksi ini berdampak {sav * 100:.1f}% terhadap target tabungan Anda."
            )

        # Statistical deviation
        dev = features["deviation_from_pattern"]
        if dev > 1.5:
            factors.append(
                f"Pola belanja ini menyimpang {dev:.1f} standar deviasi "
                f"dari kebiasaan Anda pada kategori {category_name}."
            )

        if not factors:
            factors.append("Rencana belanja ini terlihat sesuai dengan pola normal Anda.")

        return factors

    # ── Helpers ──────────────────────────────────────────

    @staticmethod
    def _score_to_level(score: float) -> str:
        """Convert 0-1 risk score to categorical level."""
        if score >= 0.65:
            return "HIGH"
        elif score >= 0.35:
            return "MEDIUM"
        else:
            return "LOW"

    @staticmethod
    def compute_savings_delay(
        planned_amount: float,
        monthly_savings_rate: float,
        monthly_income: float,
    ) -> int:
        """Estimate how many days the savings goal is delayed by this purchase."""
        daily_savings = (monthly_savings_rate * monthly_income) / 30.0
        if daily_savings <= 0:
            return 0
        return math.ceil(planned_amount / daily_savings)


# ── Singleton Instance ──────────────────────────────────
risk_predictor = PrePurchaseRiskPredictor()
