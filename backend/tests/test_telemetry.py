"""
Unit & Integration Tests — Telemetri Keterlibatan Tambahan (Tugas F10)
CEAMIS 2.0 — Pra-Pembelian & Tata Kelola Privasi Data Penelitian

Menguji:
1. Pencatatan decision_latency_ms saat pengguna memiliki consent aktif (F3).
2. Penghapusan/pengabaian decision_latency_ms jika pengguna BELUM memberi consent (privacy gate).
3. Penghapusan/pengabaian decision_latency_ms jika persetujuan telah DICABUT (withdrawn consent).
4. Validasi skema Pydantic: penolakan nilai negatif (ge=0).
5. Ekspor pseudonim (F9): verifikasi decision_latency_ms diekspor ke CSV untuk analisis jeda kognitif.
"""

import os
import unittest
from datetime import datetime, timezone
from fastapi.testclient import TestClient

# Pastikan environment test terisolasi
os.environ["SUPABASE_JWT_SECRET"] = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["PERSISTENCE_BACKEND"] = "memory"

from app.main import app
from app.services.pre_purchase_repository import repository
from scripts.export_pilot_data import export_pilot_data


class TestDecisionLatencyTelemetry(unittest.TestCase):
    """Pengujian pencatatan telemetri jeda waktu refleksi keputusan pra-pembelian."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        repository.set_mode("memory")
        repository._checks.clear()
        repository._decisions.clear()
        repository._feedbacks.clear()
        repository._consents.clear()

    def tearDown(self):
        repository._checks.clear()
        repository._decisions.clear()
        repository._feedbacks.clear()
        repository._consents.clear()

    def _create_sample_check(self, check_id: str, user_id: str) -> dict:
        """Helper membuat data pemeriksaan awal di repository."""
        check = {
            "id": check_id,
            "check_id": check_id,
            "user_id": user_id,
            "category_id": "cat-shopping",
            "category_name": "Belanja",
            "planned_amount": 250_000.0,
            "merchant_name": "Toko Buku",
            "risk_score": 0.65,
            "risk_level": "MEDIUM",
            "cold_start": False,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        repository._checks[check_id] = check
        return check

    def test_decision_latency_recorded_with_active_consent(self):
        """Pengguna dengan consent aktif berhasil menyimpan decision_latency_ms."""
        user_id = "user-consented-001"
        check_id = "chk-test-telemetry-01"
        self._create_sample_check(check_id, user_id)

        # Berikan consent aktif
        repository._consents[user_id] = {
            "user_id": user_id,
            "given": True,
            "given_at": datetime.now(timezone.utc).isoformat(),
            "withdrawn_at": None,
        }

        payload = {
            "check_id": check_id,
            "decision": "PROCEED",
            "decision_latency_ms": 4850,
        }
        resp = self.client.post("/api/v1/pre-purchase/decide", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]

        # Telemetri tersimpan dan dikembalikan
        self.assertEqual(data["decision_latency_ms"], 4850)

        # Verifikasi di repository
        stored_check = repository._checks.get(check_id)
        self.assertIsNotNone(stored_check)
        self.assertEqual(stored_check.get("decision_latency_ms"), 4850)

        stored_decision = repository._decisions.get(check_id)
        self.assertEqual(stored_decision.get("decision_latency_ms"), 4850)

    def test_decision_latency_stripped_without_consent(self):
        """Pengguna tanpa consent aktif (default baru) TIDAK boleh menyimpan decision_latency_ms."""
        user_id = "user-unconsented-002"
        check_id = "chk-test-telemetry-02"
        self._create_sample_check(check_id, user_id)

        # Pengguna belum pernah mencatat consent (given=False)
        payload = {
            "check_id": check_id,
            "decision": "POSTPONE",
            "decision_latency_ms": 3200,
        }
        resp = self.client.post("/api/v1/pre-purchase/decide", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]

        # Telemetri harus None karena privacy gate
        self.assertIsNone(data["decision_latency_ms"])

        # Verifikasi di repository tidak menyimpan nilai latency
        stored_check = repository._checks.get(check_id)
        self.assertIsNone(stored_check.get("decision_latency_ms"))

    def test_decision_latency_stripped_when_consent_withdrawn(self):
        """Pengguna yang telah mencabut persetujuan (withdrawn) TIDAK menyimpan telemetri."""
        user_id = "user-withdrawn-003"
        check_id = "chk-test-telemetry-03"
        self._create_sample_check(check_id, user_id)

        # Consent pernah diberikan lalu dicabut
        repository._consents[user_id] = {
            "user_id": user_id,
            "given": False,
            "given_at": "2026-10-01T10:00:00Z",
            "withdrawn_at": "2026-10-10T15:00:00Z",
        }

        payload = {
            "check_id": check_id,
            "decision": "ADJUST",
            "adjusted_amount": 150_000.0,
            "decision_latency_ms": 7100,
        }
        resp = self.client.post("/api/v1/pre-purchase/decide", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]

        self.assertIsNone(data["decision_latency_ms"])
        stored_check = repository._checks.get(check_id)
        self.assertIsNone(stored_check.get("decision_latency_ms"))

    def test_negative_decision_latency_rejected_422(self):
        """Nilai jeda waktu negatif ditolak oleh validasi skema Pydantic (HTTP 422)."""
        check_id = "chk-test-telemetry-04"
        self._create_sample_check(check_id, "user-any")

        payload = {
            "check_id": check_id,
            "decision": "PROCEED",
            "decision_latency_ms": -150,  # Tidak valid: ge=0
        }
        resp = self.client.post("/api/v1/pre-purchase/decide", json=payload)
        self.assertEqual(resp.status_code, 422)

    def test_export_includes_decision_latency_for_consented_users(self):
        """Skrip ekspor data pseudonim (F9) menyertakan decision_latency_ms pada CSV keputusan."""
        import tempfile
        from pathlib import Path
        import csv

        user_id = "user-pilot-export-01"
        raw_data = {
            "consent_records": [
                {
                    "user_id": user_id,
                    "given": True,
                    "given_at": "2026-10-14T00:00:00Z",
                    "withdrawn_at": None,
                }
            ],
            "checks": [
                {
                    "id": "chk-exp-01",
                    "user_id": user_id,
                    "category_name": "Fashion",
                    "planned_amount": 400000.0,
                    "risk_score": 0.8,
                    "risk_level": "HIGH",
                    "cold_start": False,
                    "decision_latency_ms": 6120,
                    "created_at": "2026-10-14T01:00:00Z",
                }
            ],
            "decisions": [
                {
                    "id": "dec-exp-01",
                    "check_id": "chk-exp-01",
                    "user_id": user_id,
                    "decision": "POSTPONE",
                    "adjusted_amount": None,
                    "decision_latency_ms": 6120,
                    "decided_at": "2026-10-14T01:00:06Z",
                }
            ],
            "feedback": [],
            "transactions": [],
        }

        with tempfile.TemporaryDirectory() as tmp_dir:
            out_dir = Path(tmp_dir)
            export_pilot_data(
                raw_data=raw_data,
                output_dir=out_dir,
                salt="secret-test-salt",
                target_tables=["decisions", "checks"],
            )

            # Baca file decisions CSV
            csv_file = out_dir / "pilot_decisions_pseudonymized.csv"
            self.assertTrue(csv_file.exists())
            with open(csv_file, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                rows = list(reader)
                self.assertEqual(len(rows), 1)
                self.assertIn("decision_latency_ms", rows[0])
                self.assertEqual(rows[0]["decision_latency_ms"], "6120")
                self.assertEqual(rows[0]["decision"], "POSTPONE")


if __name__ == "__main__":
    unittest.main()
