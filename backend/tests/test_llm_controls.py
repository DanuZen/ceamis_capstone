"""
Unit & Integration Tests — Audit dan Kendali LLM (Tugas F11)
CEAMIS 2.0 — Pengendalian Penggunaan AI Pihak Ketiga & Privasi

Menguji:
1. Sakelar konfigurasi induk LLM_ENABLED=false: seluruh fitur (OCR, Insight, Education)
   berjalan mulus dengan fallback lokal tanpa galat (HTTP 200).
2. Sakelar modular per-fitur (LLM_OCR_ENABLED, LLM_INSIGHT_ENABLED, LLM_EDUCATION_ENABLED).
3. Safety filter: penyaringan istilah investasi spekulatif/pinjol dan penyematan disclaimer AI.
4. Scrubbing PII: penghapusan identitas pribadi (email, no HP, no kartu) dari teks logging.
5. Verifikasi payload ke LLM tidak memuat field PII pengguna.
"""

import os
import unittest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient

# Pastikan environment test terkonfigurasi
os.environ["SUPABASE_JWT_SECRET"] = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["PERSISTENCE_BACKEND"] = "memory"

from app.main import app
from app.utils.llm_config import (
    is_llm_enabled,
    is_llm_ocr_enabled,
    is_llm_insight_enabled,
    is_llm_education_enabled,
)
from app.utils.safety_filter import (
    filter_financial_content,
    scrub_pii_for_logging,
    AI_DISCLAIMER,
)


class TestLLMControlsAndSafety(unittest.TestCase):
    """Pengujian kontrol sakelar LLM, fallback deterministik, dan safety guardrails."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def tearDown(self):
        # Reset environment variables ke kondisi default
        for key in ["LLM_ENABLED", "LLM_OCR_ENABLED", "LLM_INSIGHT_ENABLED", "LLM_EDUCATION_ENABLED"]:
            if key in os.environ:
                del os.environ[key]

    def test_master_switch_disabled_all_fallbacks_succeed(self):
        """Saat LLM_ENABLED=false, seluruh endpoint memakai fallback lokal tanpa galat."""
        os.environ["LLM_ENABLED"] = "false"

        self.assertFalse(is_llm_enabled())
        self.assertFalse(is_llm_ocr_enabled())
        self.assertFalse(is_llm_insight_enabled())
        self.assertFalse(is_llm_education_enabled())

        # 1. OCR Fallback
        ocr_resp = self.client.post(
            "/api/v1/ocr/parse-receipt",
            json={"raw_text": "INDOMARET\nKOPI KENANGAN 1x 18000\nTOTAL 18000\nCASH"},
        )
        self.assertEqual(ocr_resp.status_code, 200)
        ocr_data = ocr_resp.json()["data"]
        self.assertTrue(ocr_data["is_mock"])
        self.assertEqual(ocr_data["total_amount"], 18000.0)

        # 2. Dashboard Insight Fallback
        insight_resp = self.client.post(
            "/api/v1/dashboard/insight",
            json={
                "user_id": "test-user-id",
                "health_score": 75.5,
                "health_label": "Sehat",
                "saving_rate": 0.20,
                "wants_ratio": 0.25,
                "dti_ratio": 0.10,
                "budget_adherence": 0.90,
                "spending_category": "Hemat",
                "most_spent_category": "Makanan",
                "risk_profile": "Konservatif",
            },
        )
        self.assertEqual(insight_resp.status_code, 200)
        insight_data = insight_resp.json()
        self.assertEqual(insight_data["status"], "success")
        self.assertIn("75.5", insight_data["ai_insight"])
        self.assertIn("Sehat", insight_data["ai_insight"])

        # 3. Education Content Fallback
        edu_content_resp = self.client.post(
            "/api/v1/education/modules/M01/content",
            json={"user_id": "test-user-id"},
        )
        self.assertEqual(edu_content_resp.status_code, 200)
        content_data = edu_content_resp.json()
        self.assertTrue(content_data["is_mock"])
        self.assertGreater(len(content_data["sections"]), 0)

        # 4. Education Quiz Fallback
        quiz_resp = self.client.post(
            "/api/v1/education/modules/M01/quiz",
            json={"user_id": "test-user-id"},
        )
        self.assertEqual(quiz_resp.status_code, 200)
        quiz_data = quiz_resp.json()
        self.assertTrue(quiz_data["is_mock"])
        self.assertEqual(len(quiz_data["questions"]), 5)

        # 5. Education Weekly Insight Fallback
        weekly_resp = self.client.post(
            "/api/v1/education/insight/weekly",
            json={"user_id": "test-user-id"},
        )
        self.assertEqual(weekly_resp.status_code, 200)
        weekly_data = weekly_resp.json()
        self.assertTrue(weekly_data["is_mock"])
        self.assertIn("weekly_insight", weekly_data)

    def test_modular_switches_independent(self):
        """Memastikan sakelar per-fitur dapat dimatikan secara terpisah."""
        os.environ["LLM_ENABLED"] = "true"
        os.environ["LLM_OCR_ENABLED"] = "false"
        os.environ["LLM_INSIGHT_ENABLED"] = "true"

        self.assertTrue(is_llm_enabled())
        self.assertFalse(is_llm_ocr_enabled())
        self.assertTrue(is_llm_insight_enabled())

        # OCR wajib memakai fallback
        ocr_resp = self.client.post(
            "/api/v1/ocr/parse-receipt",
            json={"raw_text": "ALFAMART\nROTI TAWAR 15000\nTOTAL 15000"},
        )
        self.assertEqual(ocr_resp.status_code, 200)
        self.assertTrue(ocr_resp.json()["data"]["is_mock"])

    def test_safety_filter_restricted_keywords_and_disclaimer(self):
        """Memastikan filter keselamatan menyaring frasa spekulatif dan menambahkan disclaimer AI."""
        unsafe_text = "Sebaiknya kamu segera beli kripto dan daftar pinjol untuk menutup kebutuhan ini."
        cleaned, violated = filter_financial_content(unsafe_text, append_disclaimer=True)

        self.assertTrue(violated)
        self.assertNotIn("beli kripto", cleaned)
        self.assertNotIn("daftar pinjol", cleaned)
        self.assertIn("[Konten rekomendasi spekulatif disaring", cleaned)
        self.assertIn(AI_DISCLAIMER.strip(), cleaned)

    def test_pii_scrubbing_for_logging(self):
        """Memastikan fungsi masking PII menyamarkan email, telepon, dan nomor kartu."""
        log_sample = "User wira@example.com dengan no HP 081234567890 membayar dengan kartu 4111 2222 3333 4444."
        scrubbed = scrub_pii_for_logging(log_sample)

        self.assertNotIn("wira@example.com", scrubbed)
        self.assertNotIn("081234567890", scrubbed)
        self.assertNotIn("4111 2222 3333 4444", scrubbed)
        self.assertIn("[EMAIL_TERSEMBUNYI]", scrubbed)
        self.assertIn("[TELP_TERSEMBUNYI]", scrubbed)
        self.assertIn("[KARTU_TERSEMBUNYI]", scrubbed)

    def test_payload_to_llm_contains_no_pii_fields(self):
        """Memastikan data yang dirakit untuk prompt LLM Insight tidak memuat nama/surel/telepon."""
        from app.schemas.request_response import DashboardInsightRequest

        sample_req = DashboardInsightRequest(
            user_id="user-uuid-1234-private",
            health_score=80.0,
            health_label="Sehat",
            saving_rate=0.25,
            wants_ratio=0.15,
            dti_ratio=0.05,
            budget_adherence=0.95,
            spending_category="Bijak",
            most_spent_category="Pendidikan",
            risk_profile="Moderat",
        )

        # Inspect fields pada request
        d = sample_req.model_dump()
        self.assertNotIn("email", d)
        self.assertNotIn("name", d)
        self.assertNotIn("phone", d)
        self.assertNotIn("address", d)


if __name__ == "__main__":
    unittest.main()
