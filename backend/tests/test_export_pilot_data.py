"""
Tests for Pilot Data Pseudonymization Exporter — CEAMIS 2.0 (Tugas F9)
Menguji:
1. Stabilitas dan determinisme HMAC participant_code
2. Pengecualian ketat pengguna tanpa persetujuan aktif (consent given=False atau withdrawn)
3. Pembersihan menyeluruh kolom PII (nama, surel, kontak, teks bebas)
4. Filter rentang tanggal (start_date & end_date)
5. Integritas keluaran file CSV dan manifest metadata JSON
"""

import os
import csv
import json
import shutil
import tempfile
import unittest
from pathlib import Path
from datetime import datetime, timezone

from scripts.export_pilot_data import (
    generate_participant_code,
    extract_consented_user_ids,
    export_pilot_data,
    get_salt,
)


class TestExportPilotData(unittest.TestCase):
    def setUp(self):
        self.test_dir = Path(tempfile.mkdtemp(prefix="ceamis_export_test_"))
        self.salt = "test_salt_secret_key_123"

        # Data tiruan partisipan:
        # - user-consented-1: Consent Aktif (given=True)
        # - user-consented-2: Consent Aktif (given=True)
        # - user-unconsented: Consent Ditolak (given=False)
        # - user-withdrawn:   Pernah consent tapi dicabut (withdrawn_at!=None)
        # - user-no-record:   Tidak ada catatan consent sama sekali
        self.mock_consents = [
            {
                "id": "c-001",
                "user_id": "user-consented-1",
                "consent_version": "v1.0",
                "purpose": "academic_research",
                "given": True,
                "given_at": "2026-06-01T08:00:00Z",
                "withdrawn_at": None,
            },
            {
                "id": "c-002",
                "user_id": "user-consented-2",
                "consent_version": "v1.0",
                "purpose": "academic_research",
                "given": True,
                "given_at": "2026-06-01T08:00:00Z",
                "withdrawn_at": None,
            },
            {
                "id": "c-003",
                "user_id": "user-unconsented",
                "consent_version": "v1.0",
                "purpose": "academic_research",
                "given": False,
                "given_at": "2026-06-01T08:00:00Z",
                "withdrawn_at": None,
            },
            {
                "id": "c-004",
                "user_id": "user-withdrawn",
                "consent_version": "v1.0",
                "purpose": "academic_research",
                "given": True,
                "given_at": "2026-06-01T08:00:00Z",
                "withdrawn_at": "2026-06-15T10:00:00Z",
            },
        ]

        self.mock_checks = [
            {
                "id": "chk-001",
                "user_id": "user-consented-1",
                "category_name": "Shopping",
                "planned_amount": 250000,
                "risk_score": 0.45,
                "risk_level": "MEDIUM",
                "cold_start": False,
                "created_at": "2026-07-01T10:00:00Z",
                "user_email": "private1@example.com",  # PII liar
                "user_name": "Partisipan Satu",         # PII liar
            },
            {
                "id": "chk-002",
                "user_id": "user-consented-2",
                "category_name": "F&B",
                "planned_amount": 75000,
                "risk_score": 0.20,
                "risk_level": "LOW",
                "cold_start": True,
                "created_at": "2026-07-05T12:00:00Z",
            },
            {
                "id": "chk-003",
                "user_id": "user-unconsented",
                "category_name": "Hobi",
                "planned_amount": 500000,
                "risk_score": 0.80,
                "risk_level": "HIGH",
                "created_at": "2026-07-02T10:00:00Z",
            },
            {
                "id": "chk-004",
                "user_id": "user-withdrawn",
                "category_name": "Elektronik",
                "planned_amount": 1500000,
                "risk_score": 0.90,
                "risk_level": "HIGH",
                "created_at": "2026-07-03T10:00:00Z",
            },
            {
                "id": "chk-005",
                "user_id": "user-no-record",
                "category_name": "Kebutuhan",
                "planned_amount": 100000,
                "risk_score": 0.15,
                "risk_level": "LOW",
                "created_at": "2026-07-04T10:00:00Z",
            },
        ]

        self.mock_decisions = [
            {
                "id": "dec-001",
                "check_id": "chk-001",
                "user_id": "user-consented-1",
                "decision": "PROCEED",
                "adjusted_amount": None,
                "decided_at": "2026-07-01T10:05:00Z",
            },
            {
                "id": "dec-002",
                "check_id": "chk-003",
                "user_id": "user-unconsented",
                "decision": "POSTPONE",
                "adjusted_amount": None,
                "decided_at": "2026-07-02T10:05:00Z",
            },
        ]

        self.mock_feedback = [
            {
                "id": "fb-001",
                "check_id": "chk-001",
                "user_id": "user-consented-1",
                "actually_purchased": True,
                "was_impulsive": False,
                "satisfaction_rating": 5,
                "feedback_notes": "Teks bebas rahasia yang tidak boleh bocor",
                "submitted_at": "2026-07-03T11:00:00Z",
            },
            {
                "id": "fb-002",
                "check_id": "chk-004",
                "user_id": "user-withdrawn",
                "actually_purchased": True,
                "was_impulsive": True,
                "satisfaction_rating": 2,
                "submitted_at": "2026-07-04T11:00:00Z",
            },
        ]

        self.mock_transactions = [
            {
                "id": "trx-001",
                "user_id": "user-consented-1",
                "category_name": "Shopping",
                "amount": 250000,
                "type": "EXPENSE",
                "is_unplanned": False,
                "transaction_date": "2026-07-01T10:10:00Z",
            },
            {
                "id": "trx-002",
                "user_id": "user-unconsented",
                "category_name": "Hobi",
                "amount": 500000,
                "type": "EXPENSE",
                "is_unplanned": True,
                "transaction_date": "2026-07-02T10:10:00Z",
            },
        ]

        self.raw_dataset = {
            "consent_records": self.mock_consents,
            "checks": self.mock_checks,
            "decisions": self.mock_decisions,
            "feedback": self.mock_feedback,
            "transactions": self.mock_transactions,
        }

    def tearDown(self):
        if self.test_dir.exists():
            shutil.rmtree(self.test_dir)

    def test_participant_code_determinism(self):
        """Memastikan participant_code deterministik dengan salt yang sama dan berubah dengan salt berbeda."""
        code1 = generate_participant_code("user-123", self.salt)
        code2 = generate_participant_code("user-123", self.salt)
        self.assertEqual(code1, code2)
        self.assertTrue(code1.startswith("PARTICIPANT-"))

        diff_salt_code = generate_participant_code("user-123", "different_salt_xyz")
        self.assertNotEqual(code1, diff_salt_code)

    def test_consented_user_ids_filtering(self):
        """Memastikan hanya user dengan consent aktif (given=True, withdrawn=None) yang lolos filter."""
        active_uids = extract_consented_user_ids(self.mock_consents)
        self.assertIn("user-consented-1", active_uids)
        self.assertIn("user-consented-2", active_uids)
        self.assertNotIn("user-unconsented", active_uids)
        self.assertNotIn("user-withdrawn", active_uids)
        self.assertNotIn("user-no-record", active_uids)
        self.assertEqual(len(active_uids), 2)

    def test_export_excludes_unconsented_data(self):
        """Memastikan data pengguna tanpa consent aktif dilewati pada seluruh tabel keluaran."""
        summary = export_pilot_data(
            raw_data=self.raw_dataset,
            output_dir=self.test_dir,
            salt=self.salt,
        )

        self.assertEqual(summary["total_active_consented_participants"], 2)

        # Cek checks: dari 5 check, hanya 2 milik user-consented-1 dan user-consented-2
        checks_file = self.test_dir / "pilot_checks_pseudonymized.csv"
        with open(checks_file, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            self.assertEqual(len(reader), 2)
            check_ids = [r["check_id"] for r in reader]
            self.assertIn("chk-001", check_ids)
            self.assertIn("chk-002", check_ids)
            self.assertNotIn("chk-003", check_ids)  # unconsented
            self.assertNotIn("chk-004", check_ids)  # withdrawn
            self.assertNotIn("chk-005", check_ids)  # no record

        # Cek decisions: dari 2 decision, hanya 1 milik user-consented-1
        decisions_file = self.test_dir / "pilot_decisions_pseudonymized.csv"
        with open(decisions_file, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            self.assertEqual(len(reader), 1)
            self.assertEqual(reader[0]["decision_id"], "dec-001")

        # Cek feedback: dari 2 feedback, hanya 1 milik user-consented-1
        fb_file = self.test_dir / "pilot_feedback_pseudonymized.csv"
        with open(fb_file, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            self.assertEqual(len(reader), 1)
            self.assertEqual(reader[0]["feedback_id"], "fb-001")

        # Cek transactions: dari 2 transaksi, hanya 1 milik user-consented-1
        trx_file = self.test_dir / "pilot_transactions_pseudonymized.csv"
        with open(trx_file, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            self.assertEqual(len(reader), 1)
            self.assertEqual(reader[0]["transaction_id"], "trx-001")

    def test_no_pii_columns_in_exported_csv(self):
        """Memastikan tidak ada kolom identitas pribadi (user_id, email, nama, catatan teks bebas) pada CSV."""
        export_pilot_data(
            raw_data=self.raw_dataset,
            output_dir=self.test_dir,
            salt=self.salt,
        )

        forbidden_keys = {"user_id", "email", "user_email", "name", "user_name", "phone", "feedback_notes"}

        for filename in [
            "pilot_checks_pseudonymized.csv",
            "pilot_decisions_pseudonymized.csv",
            "pilot_feedback_pseudonymized.csv",
            "pilot_transactions_pseudonymized.csv",
        ]:
            filepath = self.test_dir / filename
            with open(filepath, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                headers = set(reader.fieldnames or [])
                # Kolom harus memuat participant_code
                self.assertIn("participant_code", headers)
                # Tidak boleh ada kolom terlarang
                overlap = headers.intersection(forbidden_keys)
                self.assertEqual(overlap, set(), f"Kolom terlarang {overlap} ditemukan di {filename}")

                # Baris data tidak boleh memuat user_id asli
                for row in reader:
                    for val in row.values():
                        self.assertNotIn("user-consented", str(val))
                        self.assertNotIn("private1@example.com", str(val))
                        self.assertNotIn("Partisipan Satu", str(val))

    def test_date_range_filtering(self):
        """Memastikan filter rentang tanggal bekerja menyaring rekaman di luar batas."""
        # Filter hanya tanggal 2026-07-04 s/d 2026-07-10 (hanya chk-002 pada 2026-07-05 yang masuk)
        summary = export_pilot_data(
            raw_data=self.raw_dataset,
            output_dir=self.test_dir,
            salt=self.salt,
            start_date_str="2026-07-04",
            end_date_str="2026-07-10",
        )

        checks_file = self.test_dir / "pilot_checks_pseudonymized.csv"
        with open(checks_file, "r", encoding="utf-8") as f:
            reader = list(csv.DictReader(f))
            self.assertEqual(len(reader), 1)
            self.assertEqual(reader[0]["check_id"], "chk-002")

    def test_manifest_metadata_file_generated(self):
        """Memastikan berkas export_manifest.json terbit dengan statistik yang akurat."""
        export_pilot_data(
            raw_data=self.raw_dataset,
            output_dir=self.test_dir,
            salt=self.salt,
        )

        manifest_path = self.test_dir / "export_manifest.json"
        self.assertTrue(manifest_path.exists())
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
            self.assertEqual(manifest["total_active_consented_participants"], 2)
            self.assertIn("checks", manifest["exported_tables"])
            self.assertEqual(manifest["exported_tables"]["checks"]["exported_rows"], 2)
            self.assertEqual(manifest["exported_tables"]["checks"]["skipped_unconsented_rows"], 3)


if __name__ == "__main__":
    unittest.main()
