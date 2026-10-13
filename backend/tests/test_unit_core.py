"""
Unit Tests: Ekstraksi Fitur 7-D, Fallback Rule-Based, dan Kalkulasi Skor Kesehatan
CEAMIS 2.0 — Pra-Pembelian & Kesehatan Finansial
Memenuhi persyaratan TUGAS F6: unit (fitur, fallback, skor kesehatan).
"""

import unittest
from datetime import datetime, timezone
import numpy as np

from app.services.pre_purchase_risk import PrePurchaseRiskPredictor
from app.utils.health_score_calculator import (
    normalize_saving_rate,
    normalize_wants_ratio,
    normalize_dti,
    normalize_impulsive,
    normalize_budget_adherence,
    calculate_health_score,
    get_spending_category,
    get_genz_message,
)


class TestFeatureExtractionAndFallback(unittest.TestCase):
    """Pengujian unit logika ekstraksi fitur dan fallback scoring rule-based."""

    def setUp(self):
        self.predictor = PrePurchaseRiskPredictor()

    def test_extract_features_normal(self):
        """Pengujian ekstraksi 7 fitur kontekstual dengan input tipikal."""
        dt = datetime(2026, 10, 14, 12, 0, 0, tzinfo=timezone.utc)  # Rabu = day_of_week 2
        feats = self.predictor.extract_features(
            planned_amount=150_000.0,
            category_median=100_000.0,
            budget_remaining=500_000.0,
            category_freq_7d=2,
            budget_reset_day=25,
            savings_goal_target=1_000_000.0,
            category_mean=110_000.0,
            category_std=20_000.0,
            now=dt,
        )

        self.assertAlmostEqual(feats["amount_ratio_median"], 1.5, places=4)
        self.assertAlmostEqual(feats["budget_remaining_ratio"], 0.3, places=4)
        self.assertEqual(feats["category_frequency"], 2)
        self.assertEqual(feats["day_of_week"], 2)  # Wednesday
        self.assertEqual(feats["days_to_reset"], 11)  # 25 - 14
        self.assertAlmostEqual(feats["savings_impact"], 0.15, places=4)
        # deviation: (150_000 - 110_000) / 20_000 = 2.0
        self.assertAlmostEqual(feats["deviation_from_pattern"], 2.0, places=4)

    def test_extract_features_zero_division_guard(self):
        """Memastikan pembagian nol ditangani dengan aman menggunakan max(..., 1.0)."""
        feats = self.predictor.extract_features(
            planned_amount=100.0,
            category_median=0.0,          # median 0 -> safe_median = 1.0
            budget_remaining=0.0,          # budget 0 -> safe_remaining = 1.0
            category_freq_7d=0,
            budget_reset_day=14,
            savings_goal_target=0.0,       # tabungan 0 -> safe_savings = 1.0
            category_mean=0.0,
            category_std=0.0,              # std 0 -> safe_std = 1.0
        )

        # safe_median = max(0.0, 1.0) = 1.0 -> 100.0 / 1.0 = 100.0
        self.assertEqual(feats["amount_ratio_median"], 100.0)
        self.assertEqual(feats["budget_remaining_ratio"], 100.0)
        self.assertEqual(feats["savings_impact"], 100.0)
        self.assertEqual(feats["deviation_from_pattern"], 100.0)

    def test_fallback_rule_based_safe_transaction(self):
        """Transaksi dengan nominal kecil dan pagu aman diprediksi LOW risk pada baseline rule-based."""
        features = {
            "amount_ratio_median": 0.8,
            "budget_remaining_ratio": 0.1,
            "category_frequency": 1,
            "day_of_week": 1,
            "days_to_reset": 20,
            "savings_impact": 0.02,
            "deviation_from_pattern": 0.3,
        }
        res = self.predictor._predict_rule_based(features)
        self.assertEqual(res["method"], "rule_based_baseline")
        self.assertEqual(res["model_version"], "baseline-v1.0")
        self.assertLess(res["risk_score"], 0.35)
        self.assertEqual(res["risk_level"], "LOW")

    def test_fallback_rule_based_high_risk_transaction(self):
        """Transaksi dengan anomali nominal dan overbudget menghasilkan skor HIGH pada rule-based."""
        features = {
            "amount_ratio_median": 4.5,       # +0.35
            "budget_remaining_ratio": 1.5,    # +0.30
            "category_frequency": 6,          # +0.10
            "day_of_week": 5,
            "days_to_reset": 2,
            "savings_impact": 0.6,            # +0.15
            "deviation_from_pattern": 2.5,    # +0.10
        }
        res = self.predictor._predict_rule_based(features)
        self.assertEqual(res["method"], "rule_based_baseline")
        self.assertGreaterEqual(res["risk_score"], 0.70)
        self.assertEqual(res["risk_level"], "HIGH")

    def test_predict_graceful_fallback_when_model_unloaded(self):
        """Ketika model ML belum dimuat, predict() otomatis menggunakan rule-based fallback."""
        self.assertFalse(self.predictor.is_ml_available)
        features = {
            "amount_ratio_median": 1.0,
            "budget_remaining_ratio": 0.2,
            "category_frequency": 1,
            "day_of_week": 3,
            "days_to_reset": 15,
            "savings_impact": 0.05,
            "deviation_from_pattern": 0.5,
        }
        res = self.predictor.predict(features)
        self.assertEqual(res["method"], "rule_based_baseline")
        self.assertIn("risk_score", res)
        self.assertIn("risk_level", res)


class TestHealthScoreCalculator(unittest.TestCase):
    """Pengujian unit kalkulator skor kesehatan deterministik per segmen pengguna."""

    def test_normalizations(self):
        """Pengujian fungsi normalisasi tiap rasio finansial."""
        # Saving rate segmen A: >=0.25 -> 1.0, <0.05 -> 0.0
        self.assertEqual(normalize_saving_rate(0.30, "A"), 1.0)
        self.assertEqual(normalize_saving_rate(0.02, "A"), 0.0)

        # Wants ratio segmen A: <0.20 -> 1.0, >=0.40 -> 0.0
        self.assertEqual(normalize_wants_ratio(0.15, "A"), 1.0)
        self.assertEqual(normalize_wants_ratio(0.50, "A"), 0.0)

        # DTI: <0.15 -> 1.0, >=0.40 -> 0.0
        self.assertEqual(normalize_dti(0.10), 1.0)
        self.assertEqual(normalize_dti(0.45), 0.0)

        # Impulsive ratio segmen A: <0.05 -> 1.0, >=0.25 -> 0.0
        self.assertEqual(normalize_impulsive(0.02, "A"), 1.0)
        self.assertEqual(normalize_impulsive(0.30, "A"), 0.0)

        # Budget adherence: >=0.90 -> 1.0, <0.50 -> 0.0
        self.assertEqual(normalize_budget_adherence(0.95, "A"), 1.0)
        self.assertEqual(normalize_budget_adherence(0.40, "A"), 0.0)

    def test_calculate_health_score_segment_a_perfect(self):
        """Pengguna Segmen A dengan kondisi ideal mendapatkan skor 100 (Excellent)."""
        res = calculate_health_score(
            segmen="A",
            saving_rate=0.30,
            wants_ratio=0.10,
            dti_ratio=0.05,
            impulsive_ratio=0.02,
            budget_adherence=0.95,
        )
        self.assertEqual(res["health_score"], 100.0)
        self.assertEqual(res["health_label"], "Excellent")
        self.assertIsInstance(res["explanation"], list)

    def test_calculate_health_score_segment_b_critical(self):
        """Pengguna Segmen B dengan kondisi defisit kritis mendapatkan skor Kritis."""
        res = calculate_health_score(
            segmen="B",
            saving_rate=0.0,
            wants_ratio=0.55,
            dti_ratio=0.50,
            impulsive_ratio=0.30,
            budget_adherence=0.30,
        )
        self.assertEqual(res["health_score"], 0.0)
        self.assertEqual(res["health_label"], "Kritis")

    def test_calculate_health_score_segment_c_blended(self):
        """Segmen C menggabungkan formula segmen A (40%) dan segmen B (60%)."""
        res = calculate_health_score(
            segmen="C",
            saving_rate=0.15,
            wants_ratio=0.25,
            dti_ratio=0.20,
            impulsive_ratio=0.08,
            budget_adherence=0.85,
        )
        self.assertGreater(res["health_score"], 50.0)
        self.assertIn(res["health_label"], ["Cukup", "Sehat", "Excellent"])

    def test_spending_category_and_messages(self):
        """Pengujian kategorisasi gaya belanja dan pesan interaktif Gen-Z."""
        self.assertEqual(get_spending_category(85.0), "Sehat")
        self.assertEqual(get_spending_category(60.0), "Waspada")
        self.assertEqual(get_spending_category(35.0), "Boros")

        msg = get_genz_message("Excellent")
        self.assertIn("goals", msg)


if __name__ == "__main__":
    unittest.main()
