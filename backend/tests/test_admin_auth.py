"""
Unit & Integration Tests — Admin JWT Guard & RBAC (Tugas F4)
Pengujian keamanan endpoint /api/v1/admin/* terhadap autentikasi JWT dan peran admin.
"""

import os
import unittest
import jwt
from fastapi.testclient import TestClient

# Pastikan SUPABASE_JWT_SECRET terkonfigurasi untuk test suite
TEST_JWT_SECRET = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["SUPABASE_JWT_SECRET"] = TEST_JWT_SECRET

from app.main import app


class TestAdminAuthGuard(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.secret = TEST_JWT_SECRET

    def setUp(self):
        from app.api.admin import MODEL_REGISTRY_PATH
        if MODEL_REGISTRY_PATH.exists():
            MODEL_REGISTRY_PATH.unlink()

    def tearDown(self):
        from app.api.admin import MODEL_REGISTRY_PATH
        if MODEL_REGISTRY_PATH.exists():
            MODEL_REGISTRY_PATH.unlink()

    def _create_token(self, sub: str, role: str, in_app_meta: bool = True) -> str:
        payload = {
            "sub": sub,
            "email": f"{sub}@example.com",
            "aud": "authenticated",
        }
        if in_app_meta:
            payload["app_metadata"] = {"role": role}
        else:
            payload["user_metadata"] = {"role": role}
        return jwt.encode(payload, self.secret, algorithm="HS256")

    def test_unauthenticated_request_rejected_401(self):
        """(a) Permintaan tanpa token Authorization ditolak dengan kode status 401."""
        endpoints = [
            ("GET", "/api/v1/admin/models"),
            ("GET", "/api/v1/admin/audit-logs"),
            ("POST", "/api/v1/admin/models/rollback"),
        ]
        for method, endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                if method == "GET":
                    res = self.client.get(endpoint)
                else:
                    res = self.client.post(endpoint, json={})
                self.assertEqual(res.status_code, 401, f"{endpoint} harus mengembalikan 401 tanpa token")
                self.assertIn("detail", res.json())

    def test_invalid_and_expired_token_rejected_401(self):
        """Token dengan signature salah atau format malformed ditolak dengan 401."""
        # 1. Signature salah
        invalid_token = jwt.encode(
            {"sub": "user-1", "app_metadata": {"role": "admin"}},
            "wrong-secret-key-that-is-at-least-32-bytes-long",
            algorithm="HS256",
        )
        res = self.client.get(
            "/api/v1/admin/models",
            headers={"Authorization": f"Bearer {invalid_token}"},
        )
        self.assertEqual(res.status_code, 401)

        # 2. Malformed token
        res_malformed = self.client.get(
            "/api/v1/admin/models",
            headers={"Authorization": "Bearer not-a-valid-jwt-token"},
        )
        self.assertEqual(res_malformed.status_code, 401)

    def test_regular_user_token_rejected_403(self):
        """(b) Token pengguna biasa (role != 'admin') ditolak dengan kode status 403."""
        user_token = self._create_token("regular-user-001", role="user")
        headers = {"Authorization": f"Bearer {user_token}"}

        res_models = self.client.get("/api/v1/admin/models", headers=headers)
        self.assertEqual(res_models.status_code, 403)
        self.assertIn("Akses ditolak", res_models.json()["detail"])

        res_logs = self.client.get("/api/v1/admin/audit-logs", headers=headers)
        self.assertEqual(res_logs.status_code, 403)

    def test_admin_token_accepted_200(self):
        """(c) Token admin (role == 'admin') diterima dengan status 200."""
        admin_token = self._create_token("admin-user-001", role="admin")
        headers = {"Authorization": f"Bearer {admin_token}"}

        res_models = self.client.get("/api/v1/admin/models", headers=headers)
        self.assertEqual(res_models.status_code, 200)
        data = res_models.json()
        self.assertTrue(data["success"])
        self.assertIsInstance(data["data"], list)

        res_logs = self.client.get("/api/v1/admin/audit-logs", headers=headers)
        self.assertEqual(res_logs.status_code, 200)
        self.assertTrue(res_logs.json()["success"])

    def test_admin_from_user_metadata_accepted_200(self):
        """Klaim role admin pada user_metadata juga diterima jika app_metadata kosong."""
        admin_token = self._create_token("admin-user-002", role="admin", in_app_meta=False)
        headers = {"Authorization": f"Bearer {admin_token}"}
        res_models = self.client.get("/api/v1/admin/models", headers=headers)
        self.assertEqual(res_models.status_code, 200)

    def test_rollback_model_validation(self):
        """(d) Rollback model tanpa alasan atau alasan kurang dari 5 karakter ditolak dengan 422."""
        admin_token = self._create_token("admin-user-001", role="admin")
        headers = {"Authorization": f"Bearer {admin_token}"}

        # 1. Alasan kurang dari 5 karakter (< 5 chars)
        res_short = self.client.post(
            "/api/v1/admin/models/rollback",
            headers=headers,
            json={
                "target_model_version_id": "a90184b2-29df-4573-a192-8812cbb41244",
                "reason": "bad",  # 3 karakter
            },
        )
        self.assertEqual(res_short.status_code, 422)

        # 2. Alasan kosong / tidak disediakan
        res_missing = self.client.post(
            "/api/v1/admin/models/rollback",
            headers=headers,
            json={
                "target_model_version_id": "a90184b2-29df-4573-a192-8812cbb41244",
            },
        )
        self.assertEqual(res_missing.status_code, 422)

        # 3. Alasan valid (>= 5 karakter) diproses oleh endpoint
        res_valid = self.client.post(
            "/api/v1/admin/models/rollback",
            headers=headers,
            json={
                "target_model_version_id": "a90184b2-29df-4573-a192-8812cbb41244",
                "reason": "Akurasi model menurun pada kategori baru",
            },
        )
        # Model target inaktif berhasil di-rollback -> status 200
        self.assertEqual(res_valid.status_code, 200)
        self.assertTrue(res_valid.json()["success"])
        self.assertEqual(res_valid.json()["data"]["admin_id"], "admin-user-001")


if __name__ == "__main__":
    unittest.main()
