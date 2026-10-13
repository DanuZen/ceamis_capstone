"""
Unit & Integration Tests — Persistensi Pra-Pembelian & Tata Kelola Model (Tugas F1)
Menguji satu siklus lengkap pra-pembelian (check, decide, feedback) pada mode memory dan mode db (mock).
"""

import os
import unittest
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient

# Pastikan environment test terkonfigurasi
os.environ["SUPABASE_JWT_SECRET"] = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["PERSISTENCE_BACKEND"] = "memory"

from app.main import app
from app.services.pre_purchase_repository import repository, MODEL_REGISTRY_PATH


class TestMemoryPersistenceLifecycle(unittest.TestCase):
    """Pengujian siklus pemeriksaan pra-pembelian pada mode bawaan in-memory."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        repository.set_mode("memory")
        if MODEL_REGISTRY_PATH.exists():
            MODEL_REGISTRY_PATH.unlink()

    def tearDown(self):
        repository.set_mode("memory")
        if MODEL_REGISTRY_PATH.exists():
            MODEL_REGISTRY_PATH.unlink()

    def test_full_check_decide_feedback_lifecycle_memory(self):
        """
        Satu siklus lengkap: check -> decide -> feedback pada mode memory.
        Memverifikasi data tersimpan, diperbarui, dan terbaca dengan konsisten.
        """
        # 1. Step 1: POST /api/v1/pre-purchase/check
        check_payload = {
            "category_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "planned_amount": 275000.0,
            "merchant_name": "Uniqlo Grand Indonesia",
            "notes": "Jaket musim hujan diskon 30%",
        }
        res_check = self.client.post("/api/v1/pre-purchase/check", json=check_payload)
        self.assertEqual(res_check.status_code, 200)
        check_data = res_check.json()
        self.assertTrue(check_data["success"])
        check_id = check_data["data"]["check_id"]
        self.assertIsNotNone(check_id)

        # Verifikasi data tersimpan di repository
        stored_check = repository._checks.get(check_id)
        self.assertIsNotNone(stored_check)
        self.assertEqual(stored_check["planned_amount"], 275000.0)
        self.assertEqual(stored_check["user_decision"], "PENDING")

        # 2. Step 2: POST /api/v1/pre-purchase/decide
        decide_payload = {
            "check_id": check_id,
            "decision": "POSTPONE",
            "adjusted_amount": None,
        }
        res_decide = self.client.post("/api/v1/pre-purchase/decide", json=decide_payload)
        self.assertEqual(res_decide.status_code, 200)
        decide_data = res_decide.json()
        self.assertTrue(decide_data["success"])
        self.assertEqual(decide_data["data"]["status"], "RECORDED")

        # Verifikasi status keputusan diperbarui di repository
        self.assertEqual(repository._checks[check_id]["user_decision"], "POSTPONE")
        self.assertIsNotNone(repository._checks[check_id]["decided_at"])

        # 3. Step 3: POST /api/v1/pre-purchase/feedback
        feedback_payload = {
            "check_id": check_id,
            "was_impulsive": False,
            "satisfaction_rating": 5,
            "feedback_notes": "Saran tunda sangat membantu menghemat anggaran.",
        }
        res_feedback = self.client.post("/api/v1/pre-purchase/feedback", json=feedback_payload)
        self.assertEqual(res_feedback.status_code, 201)
        feedback_data = res_feedback.json()
        self.assertTrue(feedback_data["success"])

        # Verifikasi feedback tersimpan di repository
        self.assertEqual(repository._checks[check_id]["was_impulsive"], False)
        stored_fb = repository._feedbacks.get(check_id)
        self.assertIsNotNone(stored_fb)
        self.assertEqual(stored_fb["satisfaction_rating"], 5)

    def test_decide_and_feedback_404_for_unknown_check_id(self):
        """Memastikan check_id yang tidak ada ditolak dengan status 404."""
        unknown_id = "00000000-0000-0000-0000-000000000000"

        # Decide pada unknown id
        res_decide = self.client.post("/api/v1/pre-purchase/decide", json={
            "check_id": unknown_id,
            "decision": "PROCEED",
        })
        self.assertEqual(res_decide.status_code, 404)

        # Feedback pada unknown id
        res_feedback = self.client.post("/api/v1/pre-purchase/feedback", json={
            "check_id": unknown_id,
            "was_impulsive": True,
            "satisfaction_rating": 4,
        })
        self.assertEqual(res_feedback.status_code, 404)

    def test_model_registry_and_audit_logs_memory(self):
        """Menguji pemuatan registry dan pencatatan audit log saat rollback pada mode memory."""
        # 1. Pemuatan registry default
        import asyncio
        registry = asyncio.run(repository.load_model_registry())
        self.assertGreaterEqual(len(registry), 2)

        # 2. Eksekusi rollback ke model yang saat ini inaktif
        target = next(m for m in registry if not m.get("is_active"))
        target_id = target["id"]
        res = asyncio.run(repository.execute_model_rollback(
            target_model_version_id=target_id,
            reason="Uji coba rollback memory",
            admin_id="admin-test-01",
        ))
        self.assertEqual(res["rolled_back_to"], target["version_tag"])

        # 3. Verifikasi audit log tercatat
        self.assertGreaterEqual(len(repository._audit_logs), 1)
        last_audit = repository._audit_logs[-1]
        self.assertEqual(last_audit["action"], "ROLLBACK_MODEL")
        self.assertEqual(last_audit["entity_id"], target_id)


class TestDbPersistenceMocked(unittest.TestCase):
    """
    Pengujian lapisan repositori mode DB (PERSISTENCE_BACKEND=db).
    [CATATAN: Belum diuji pada basis data nyata — diuji menggunakan tiruan (mock) HTTP Supabase].
    """

    def setUp(self):
        repository.set_mode("db")
        repository.supabase_url = "https://mock-project.supabase.co"
        repository.service_key = "mock-service-key"

    def tearDown(self):
        repository.set_mode("memory")

    def test_db_mode_flag(self):
        """Memastikan sakelar is_db_mode aktif ketika mode diatur ke 'db'."""
        self.assertTrue(repository.is_db_mode)

    @patch("httpx.AsyncClient.post")
    def test_save_check_db_calls_supabase(self, mock_post):
        """Memastikan save_check mengirim data ke tabel Supabase saat mode DB aktif."""
        import asyncio
        mock_response = MagicMock()
        mock_response.status_code = 201
        mock_response.json.return_value = [{"id": "chk-db-001"}]
        mock_post.return_value = mock_response

        prediction_data = {
            "risk_score": 0.65,
            "risk_level": "MEDIUM",
            "features_snapshot": {"amount_ratio": 1.5},
            "trigger_factors": ["nominal > median"],
            "method": "ml_inference",
            "model_version": "v1.1.0-rf",
        }

        res = asyncio.run(repository.save_check(
            check_id="chk-db-001",
            user_id="user-db-001",
            category_id="cat-001",
            planned_amount=150000.0,
            merchant_name="Toko ABC",
            notes="Catatan uji",
            prediction_data=prediction_data,
            budget_remaining_before=200000.0,
            budget_remaining_after=50000.0,
        ))

        self.assertEqual(res["id"], "chk-db-001")
        self.assertEqual(res["planned_amount"], 150000.0)
        # Mock post dipanggil untuk pre_purchase_checks dan risk_predictions
        self.assertGreaterEqual(mock_post.call_count, 1)

    @patch("httpx.AsyncClient.get")
    def test_load_model_registry_db_with_fallback(self, mock_get):
        """
        Memastikan load_model_registry membaca dari tabel model_versions di DB,
        dan kembali (fallback) ke berkas JSON jika tabel DB kosong.
        """
        import asyncio

        # Kasus A: DB mengembalikan baris
        mock_response_filled = MagicMock()
        mock_response_filled.status_code = 200
        mock_response_filled.json.return_value = [
            {
                "id": "db-model-uuid-1",
                "version_tag": "v2.0.0-rf-db",
                "algorithm": "RandomForestClassifier",
                "precision_score": 0.91,
                "recall_score": 0.89,
                "f1_score": 0.90,
                "roc_auc_score": 0.95,
                "is_active": True,
                "artifact_path": "artifacts_risk/db_model.joblib",
                "deployed_at": "2026-10-13T00:00:00Z",
            }
        ]
        mock_get.return_value = mock_response_filled

        models = asyncio.run(repository.load_model_registry())
        self.assertEqual(len(models), 1)
        self.assertEqual(models[0]["version_tag"], "v2.0.0-rf-db")

        # Kasus B: DB kosong -> fallback ke JSON/default
        mock_response_empty = MagicMock()
        mock_response_empty.status_code = 200
        mock_response_empty.json.return_value = []
        mock_get.return_value = mock_response_empty

        fallback_models = asyncio.run(repository.load_model_registry())
        self.assertGreaterEqual(len(fallback_models), 2)
        tags = [m["version_tag"] for m in fallback_models]
        self.assertIn("v1.1.0-rf", tags)


if __name__ == "__main__":
    unittest.main()
