"""
Unit & Integration Tests — Statistik Pengguna Nyata & Pencegahan Kebocoran Temporal (Tugas F2)
Menguji:
1. Pengguna dengan riwayat cukup (>= MIN_TRANSACTIONS_THRESHOLD)
2. Pengguna baru (cold start, 0 transaksi)
3. Pengguna dengan satu transaksi (1 transaksi < threshold)
4. Pencegahan kebocoran temporal (transaksi masa depan atau setelah check_time diabaikan)
5. Akumulasi sisa anggaran siklus berjalan point-in-time
6. Integrasi end-to-end API POST /api/v1/pre-purchase/check
"""

import os
import unittest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient

# Pastikan environment test terkonfigurasi
os.environ["SUPABASE_JWT_SECRET"] = "test-supabase-secret-key-for-unit-tests-12345678"
os.environ["PERSISTENCE_BACKEND"] = "memory"

from app.main import app
from app.services.user_stats_service import (
    user_stats_service,
    compute_category_statistics,
    compute_budget_status,
    MIN_TRANSACTIONS_THRESHOLD,
)
from app.services.pre_purchase_repository import repository


class TestUserStatsPointInTime(unittest.TestCase):
    """Pengujian unit kalkulasi fitur kontekstual dan pencegahan kebocoran temporal."""

    def setUp(self):
        user_stats_service.clear_mock_data()
        self.ref_time = datetime(2026, 10, 15, 12, 0, 0, tzinfo=timezone.utc)

    def tearDown(self):
        user_stats_service.clear_mock_data()

    def test_sufficient_history_user(self):
        """
        Skenario 1: Pengguna dengan riwayat transaksi cukup (>= 5 transaksi).
        Memverifikasi nilai median, mean, std, dan frekuensi 7 hari terhitung akurat.
        """
        category_id = "cat-shopping-101"
        amounts = [100000.0, 120000.0, 150000.0, 180000.0, 200000.0, 250000.0]
        # Buat transaksi dari 6 hari lalu sampai 1 hari lalu
        txs = []
        for i, amt in enumerate(amounts):
            tx_time = self.ref_time - timedelta(days=6 - i)
            txs.append({
                "category_id": category_id,
                "amount": amt,
                "transaction_type": "expense",
                "transaction_date": tx_time.isoformat(),
            })

        stats = compute_category_statistics(
            transactions=txs,
            category_id=category_id,
            check_time=self.ref_time,
            min_threshold=MIN_TRANSACTIONS_THRESHOLD,
        )

        self.assertFalse(stats["cold_start"])
        self.assertEqual(stats["transaction_count"], 6)
        # Median dari [100k, 120k, 150k, 180k, 200k, 250k] adalah (150k + 180k)/2 = 165000.0
        self.assertEqual(stats["median_amount"], 165000.0)
        # Mean = 1000000 / 6 = 166666.67
        self.assertAlmostEqual(stats["mean_amount"], 166666.67, places=2)
        # Std deviasi sampel > 0
        self.assertGreater(stats["std_amount"], 50000.0)
        # Semua 6 transaksi berada dalam jendela 7 hari sebelum self.ref_time
        self.assertEqual(stats["frequency_7d"], 6)

    def test_cold_start_new_user(self):
        """
        Skenario 2: Pengguna baru (cold start, 0 transaksi).
        Memverifikasi cold_start = True dan nilai fallback terdefinisi digunakan.
        """
        category_id = "cat-newbie-000"
        txs = []

        stats = compute_category_statistics(
            transactions=txs,
            category_id=category_id,
            check_time=self.ref_time,
            min_threshold=MIN_TRANSACTIONS_THRESHOLD,
        )

        self.assertTrue(stats["cold_start"])
        self.assertEqual(stats["transaction_count"], 0)
        self.assertEqual(stats["median_amount"], 115000.0)
        self.assertEqual(stats["mean_amount"], 135000.0)
        self.assertEqual(stats["std_amount"], 62000.0)

    def test_single_transaction_user(self):
        """
        Skenario 3: Pengguna dengan 1 transaksi (1 < MIN_TRANSACTIONS_THRESHOLD).
        Harus tetap ditandai cold_start = True, frekuensi 7d terdeteksi,
        dan tidak memicu zero division error ataupun std crash.
        """
        category_id = "cat-food-001"
        txs = [
            {
                "category_id": category_id,
                "amount": 45000.0,
                "transaction_type": "expense",
                "transaction_date": (self.ref_time - timedelta(days=2)).isoformat(),
            }
        ]

        stats = compute_category_statistics(
            transactions=txs,
            category_id=category_id,
            check_time=self.ref_time,
            min_threshold=MIN_TRANSACTIONS_THRESHOLD,
        )

        self.assertTrue(stats["cold_start"])
        self.assertEqual(stats["transaction_count"], 1)
        # Menggunakan fallback yang aman
        self.assertGreater(stats["median_amount"], 0)
        self.assertEqual(stats["frequency_7d"], 1)

    def test_strict_temporal_leakage_prevention(self):
        """
        Skenario 4: Pencegahan kebocoran temporal (temporal leakage).
        Transaksi yang terjadi pada atau setelah check_time STRICTLY diabaikan!
        Hanya transaksi di masa lalu yang diikutsertakan.
        """
        category_id = "cat-gadget-99"
        # 5 transaksi sah di masa lalu (< check_time)
        past_amounts = [100000.0, 100000.0, 100000.0, 100000.0, 100000.0]
        txs = []
        for i, amt in enumerate(past_amounts):
            txs.append({
                "category_id": category_id,
                "amount": amt,
                "transaction_type": "expense",
                "transaction_date": (self.ref_time - timedelta(hours=5 - i)).isoformat(),
            })

        # Tambahkan transaksi tepat pada check_time dan transaksi masa depan dengan nominal ekstrem
        txs.append({
            "category_id": category_id,
            "amount": 99999999.0,  # Nilai ekstrem yang akan merusak mean jika bocor
            "transaction_type": "expense",
            "transaction_date": self.ref_time.isoformat(),  # Tepat check_time -> DILARANG
        })
        txs.append({
            "category_id": category_id,
            "amount": 88888888.0,
            "transaction_type": "expense",
            "transaction_date": (self.ref_time + timedelta(days=2)).isoformat(),  # Masa depan -> DILARANG
        })

        stats = compute_category_statistics(
            transactions=txs,
            category_id=category_id,
            check_time=self.ref_time,
            min_threshold=MIN_TRANSACTIONS_THRESHOLD,
        )

        # Hanya 5 transaksi masa lalu yang boleh dihitung
        self.assertEqual(stats["transaction_count"], 5)
        self.assertFalse(stats["cold_start"])
        # Mean harus tepat 100,000.0 (bukan jutaan karena kebocoran)
        self.assertEqual(stats["mean_amount"], 100000.0)
        self.assertEqual(stats["median_amount"], 100000.0)

    def test_budget_cycle_spent_so_far(self):
        """
        Skenario 5: Kalkulasi sisa anggaran point-in-time berdasarkan siklus reset day.
        Pengeluaran bulan lalu sebelum reset_day tidak boleh mengurangi anggaran siklus sekarang.
        """
        category_id = "cat-food"
        # Reset day = 10, check_time = 15 Okt 2026. Awal siklus = 10 Okt 2026.
        check_time = datetime(2026, 10, 15, 10, 0, 0, tzinfo=timezone.utc)
        txs = [
            # Sebelum awal siklus (8 Okt 2026) -> Tidak dihitung pada pagu siklus ini
            {
                "category_id": category_id,
                "amount": 200000.0,
                "transaction_type": "expense",
                "transaction_date": datetime(2026, 10, 8, 12, 0, tzinfo=timezone.utc).isoformat(),
            },
            # Dalam siklus (11 Okt 2026) -> Dihitung
            {
                "category_id": category_id,
                "amount": 150000.0,
                "transaction_type": "expense",
                "transaction_date": datetime(2026, 10, 11, 14, 0, tzinfo=timezone.utc).isoformat(),
            },
            # Dalam siklus (14 Okt 2026) -> Dihitung
            {
                "category_id": category_id,
                "amount": 100000.0,
                "transaction_type": "expense",
                "transaction_date": datetime(2026, 10, 14, 9, 0, tzinfo=timezone.utc).isoformat(),
            },
            # Masa depan (16 Okt 2026) -> Tidak boleh dihitung
            {
                "category_id": category_id,
                "amount": 500000.0,
                "transaction_type": "expense",
                "transaction_date": datetime(2026, 10, 16, 9, 0, tzinfo=timezone.utc).isoformat(),
            },
        ]

        b_stat = compute_budget_status(
            budget_limit=1000000.0,
            transactions=txs,
            category_id=category_id,
            check_time=check_time,
            budget_reset_day=10,
        )

        # spent_so_far = 150k + 100k = 250k
        self.assertEqual(b_stat["spent_so_far"], 250000.0)
        # remaining = 1jt - 250k = 750k
        self.assertEqual(b_stat["remaining"], 750000.0)


class TestPrePurchaseAPIWithRealStats(unittest.TestCase):
    """Pengujian integrasi endpoint API dengan layanan UserStatsService."""

    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def setUp(self):
        user_stats_service.clear_mock_data()
        repository.set_mode("memory")

    def tearDown(self):
        user_stats_service.clear_mock_data()

    def test_api_check_cold_start_flag_in_response_and_snapshot(self):
        """
        Memastikan panggilan endpoint POST /api/v1/pre-purchase/check untuk pengguna
        tanpa riwayat menghasilkan cold_start = True pada payload data dan features_snapshot.
        """
        user_id = "user-new-pilot-01"
        payload = {
            "category_id": "cat-random-new",
            "planned_amount": 250000.0,
            "merchant_name": "Gramedia",
            "user_id": user_id,
        }

        resp = self.client.post("/api/v1/pre-purchase/check", json=payload)
        self.assertEqual(resp.status_code, 200)
        body = resp.json()

        self.assertTrue(body["success"])
        data = body["data"]
        self.assertIn("cold_start", data)
        self.assertTrue(data["cold_start"])
        self.assertIn("cold_start", data["features_snapshot"])
        self.assertTrue(data["features_snapshot"]["cold_start"])

    def test_api_check_sufficient_user_history(self):
        """
        Memastikan pengguna dengan 6 transaksi riwayat mendapatkan cold_start = False
        dan fitur ML dihitung dari riwayat tersebut.
        """
        user_id = "user-experienced-02"
        cat_id = "cat-elektronik"
        now = datetime.now(timezone.utc)

        # Pasang mock transactions
        txs = [
            {
                "category_id": cat_id,
                "category_name": "Elektronik",
                "amount": float(100000 * (i + 1)),
                "transaction_type": "expense",
                "transaction_date": (now - timedelta(days=6 - i)).isoformat(),
            }
            for i in range(6)
        ]
        user_stats_service.set_mock_data(
            user_id=user_id,
            transactions=txs,
            budget={"budget_limit": 2000000.0},
        )

        payload = {
            "category_id": cat_id,
            "planned_amount": 350000.0,
            "merchant_name": "iBox Central Park",
            "user_id": user_id,
        }

        resp = self.client.post("/api/v1/pre-purchase/check", json=payload)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()["data"]

        self.assertFalse(data["cold_start"])
        self.assertFalse(data["features_snapshot"]["cold_start"])
        self.assertEqual(data["features_snapshot"]["category_frequency"], 6.0)


if __name__ == "__main__":
    unittest.main()
