# backend/tests/test_onboarding_controls.py
"""
Unit tests for Onboarding & Legacy Model Controls (Tugas F12).
Memverifikasi kendali sakelar ONBOARDING_MODELS_ENABLED dan fallback deterministik.
"""

import os
import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient

from app.main import app
from app.utils.model_config import is_onboarding_models_enabled

client = TestClient(app)


class TestOnboardingModelControls(unittest.TestCase):

    def setUp(self):
        self.sample_payload = {
            "saving_rate": 0.138,
            "dti_ratio": 0.0,
            "disposable_ratio": 0.382,
            "expense_ratio": 0.618,
            "ceamis_score": 0.544,
            "punya_tabungan": 1,
            "jumlah_tabungan_bulan": 1.34,
            "SAVEHABIT": 4,
            "SELFCONTROL_1": 5,
            "SCFHORIZON": 5,
            "FINGOALS": 4,
            "toleransi_rugi_enc": 1,
            "tujuan_keuangan_enc": 1,
            "tanggungan_keluarga": 0,
            "Age": 22,
            "city_tier_enc": 1,
            "occ_Professional": 0,
            "occ_Retired": 0,
            "occ_Self_Employed": 0,
            "occ_Student": 1,
        }

    def test_switch_helper_respects_env(self):
        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "false"}):
            self.assertFalse(is_onboarding_models_enabled())

        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "true"}):
            self.assertTrue(is_onboarding_models_enabled())

    def test_switch_disabled_uses_deterministic_fallback(self):
        """Saat ONBOARDING_MODELS_ENABLED=false, endpoint memakai aturan deterministik."""
        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "false"}):
            # Test dengan toleransi rugi 0 (Konservatif)
            payload_konservatif = dict(self.sample_payload)
            payload_konservatif["toleransi_rugi_enc"] = 0
            res = client.post("/api/v1/predict/risk-profile", json=payload_konservatif)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertEqual(data["risk_profile"], "Konservatif")
            self.assertTrue(data["is_mock"])
            self.assertIn("budget_allocation", data)
            self.assertEqual(data["budget_allocation"]["needs"], "50%")

            # Test dengan toleransi rugi 2 (Agresif)
            payload_agresif = dict(self.sample_payload)
            payload_agresif["toleransi_rugi_enc"] = 2
            res2 = client.post("/api/v1/predict/risk-profile", json=payload_agresif)
            self.assertEqual(res2.status_code, 200)
            data2 = res2.json()
            self.assertEqual(data2["risk_profile"], "Agresif")
            self.assertTrue(data2["is_mock"])

            # Test dengan toleransi rugi 1 (Moderat)
            payload_moderat = dict(self.sample_payload)
            payload_moderat["toleransi_rugi_enc"] = 1
            res3 = client.post("/api/v1/predict/risk-profile", json=payload_moderat)
            self.assertEqual(res3.status_code, 200)
            data3 = res3.json()
            self.assertEqual(data3["risk_profile"], "Moderat")
            self.assertTrue(data3["is_mock"])

    def test_switch_enabled_returns_valid_structure(self):
        """Saat ONBOARDING_MODELS_ENABLED=true, endpoint berjalan tanpa galat."""
        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "true"}):
            res = client.post("/api/v1/predict/risk-profile", json=self.sample_payload)
            self.assertEqual(res.status_code, 200)
            data = res.json()
            self.assertIn(data["risk_profile"], ["Konservatif", "Moderat", "Agresif"])
            self.assertIn("probabilities", data)
            self.assertIn("budget_allocation", data)
            self.assertIn("description", data)
            self.assertIn("suggestion", data)

    def test_onboarding_model_isolated_from_pre_purchase(self):
        """Memastikan sakelar onboarding tidak mengubah perilaku fitur inti pra-pembelian."""
        check_payload = {
            "category_id": "test-cat-id",
            "planned_amount": 250000.0,
            "merchant_name": "Test Store",
            "notes": "Beli barang baru",
        }

        # Saat onboarding enabled
        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "true"}):
            res_on = client.post("/api/v1/pre-purchase/check", json=check_payload)
            self.assertEqual(res_on.status_code, 200)
            score_on = res_on.json()["data"]["risk_score"]

        # Saat onboarding disabled
        with patch.dict(os.environ, {"ONBOARDING_MODELS_ENABLED": "false"}):
            res_off = client.post("/api/v1/pre-purchase/check", json=check_payload)
            self.assertEqual(res_off.status_code, 200)
            score_off = res_off.json()["data"]["risk_score"]

        # Skor risiko pra-pembelian harus identik
        self.assertEqual(score_on, score_off)



if __name__ == "__main__":
    unittest.main()
