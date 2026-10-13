"""
Unit & Integration Tests — Persetujuan Partisipan (Informed Consent - Tugas F3)
Menguji:
1. Penolakan 401 jika mencatat persetujuan tanpa identitas pengguna
2. Pencatatan persetujuan eksplisit (given = True, given_at terisi)
3. Pencabutan izin penelitian (given = False, withdrawn_at terisi)
4. Pembacaan status persetujuan terkini
5. Dukungan JWT Bearer Token terotentikasi
"""

import os
import unittest
from datetime import datetime, timezone
from fastapi.testclient import TestClient
import jwt

# Pastikan environment test terkonfigurasi
TEST_JWT_SECRET = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["SUPABASE_JWT_SECRET"] = TEST_JWT_SECRET
os.environ["PERSISTENCE_BACKEND"] = "memory"

from app.main import app
from app.services.pre_purchase_repository import repository


def create_test_token(user_id: str, role: str = "user") -> str:
    """Helper membuat JWT token valid untuk pengujian."""
    payload = {
        "sub": user_id,
        "email": f"{user_id}@test.com",
        "role": "authenticated",
        "app_metadata": {"role": role},
        "exp": int(datetime.now(timezone.utc).timestamp()) + 3600,
    }
    return jwt.encode(payload, TEST_JWT_SECRET, algorithm="HS256")


class TestParticipantConsent(unittest.TestCase):
    """Pengujian alur pencatatan dan penarikan persetujuan partisipan penelitian."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        repository.set_mode("memory")
        repository._consents.clear()

    def tearDown(self):
        repository._consents.clear()

    def test_record_consent_unauthorized_fails(self):
        """Panggilan tanpa token dan tanpa user_id ditolak 401 Unauthorized."""
        resp = self.client.post("/api/v1/consent", json={"consent_version": "v1.0"})
        self.assertEqual(resp.status_code, 401)
        self.assertIn("Autentikasi diperlukan", resp.json()["detail"])

    def test_record_consent_with_bearer_jwt(self):
        """Pencatatan persetujuan menggunakan token JWT yang valid berhasil."""
        user_id = "user-participant-001"
        token = create_test_token(user_id)
        headers = {"Authorization": f"Bearer {token}"}

        payload = {
            "consent_version": "v1.0",
            "purpose": "Penelitian tesis evaluasi efektivitas intervensi pra-pembelian CEAMIS",
        }

        resp = self.client.post("/api/v1/consent", json=payload, headers=headers)
        self.assertEqual(resp.status_code, 200)
        body = resp.json()
        self.assertTrue(body["success"])
        data = body["data"]

        self.assertEqual(data["user_id"], user_id)
        self.assertEqual(data["consent_version"], "v1.0")
        self.assertTrue(data["given"])
        self.assertIsNotNone(data["given_at"])
        self.assertIsNone(data["withdrawn_at"])

    def test_withdraw_consent_lifecycle(self):
        """
        Siklus penarikan persetujuan:
        Pengguna memberikan izin -> kemudian mencabut izin -> status become given=False & withdrawn_at terisi.
        """
        user_id = "user-participant-002"
        token = create_test_token(user_id)
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Berikan izin
        resp1 = self.client.post(
            "/api/v1/consent",
            json={"consent_version": "v1.0"},
            headers=headers,
        )
        self.assertEqual(resp1.status_code, 200)

        # 2. Cek status: harus given = True
        status_resp1 = self.client.get(
            "/api/v1/consent/status",
            headers=headers,
        )
        self.assertEqual(status_resp1.status_code, 200)
        self.assertTrue(status_resp1.json()["data"]["given"])

        # 3. Cabut izin
        withdraw_resp = self.client.post(
            "/api/v1/consent/withdraw",
            json={"reason": "Menarik diri dari pilot eksperimen"},
            headers=headers,
        )
        self.assertEqual(withdraw_resp.status_code, 200)
        withdrawn_data = withdraw_resp.json()["data"]
        self.assertFalse(withdrawn_data["given"])
        self.assertIsNotNone(withdrawn_data["withdrawn_at"])

        # 4. Cek status ulang: harus given = False
        status_resp2 = self.client.get(
            "/api/v1/consent/status",
            headers=headers,
        )
        self.assertEqual(status_resp2.status_code, 200)
        self.assertFalse(status_resp2.json()["data"]["given"])
        self.assertIsNotNone(status_resp2.json()["data"]["withdrawn_at"])

    def test_status_new_user_default_false(self):
        """Pengguna yang belum pernah mencatat persetujuan mendapatkan status given = False."""
        user_id = "user-brand-new-999"
        token = create_test_token(user_id)
        headers = {"Authorization": f"Bearer {token}"}

        resp = self.client.get("/api/v1/consent/status", headers=headers)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]
        self.assertEqual(data["user_id"], user_id)
        self.assertFalse(data["given"])
        self.assertIsNone(data["given_at"])


if __name__ == "__main__":
    unittest.main()
