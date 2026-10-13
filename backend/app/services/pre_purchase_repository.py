"""
Pre-Purchase & Model Governance Repository Layer — CEAMIS 2.0
Mendukung penyimpanan ganda: in-memory (bawaan) dan PostgreSQL / Supabase DB.
Dikonfigurasi via variabel lingkungan PERSISTENCE_BACKEND=db|memory.
"""

import os
import json
import logging
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

ARTIFACTS_DIR = Path(__file__).resolve().parent.parent.parent / "artifacts_risk"
MODEL_REGISTRY_PATH = ARTIFACTS_DIR / "model_registry.json"

DEFAULT_MODEL_REGISTRY = [
    {
        "id": "a90184b2-29df-4573-a192-8812cbb41244",
        "version_tag": "v1.0.0-logreg",
        "algorithm": "LogisticRegression",
        "precision": 0.7630,
        "recall": 0.7100,
        "f1_score": 0.7355,
        "roc_auc": 0.7820,
        "is_active": False,
        "artifact_path": "artifacts_risk/logreg_v1.0.0.joblib",
        "deployed_at": "2026-09-10T08:00:00Z",
    },
    {
        "id": "c1f72a44-8839-4d91-bb27-729d4827d091",
        "version_tag": "v1.1.0-rf",
        "algorithm": "RandomForestClassifier",
        "precision": 0.8120,
        "recall": 0.7450,
        "f1_score": 0.7771,
        "roc_auc": 0.8350,
        "is_active": True,
        "artifact_path": "artifacts_risk/rf_v1.1.0.joblib",
        "deployed_at": "2026-09-18T10:00:00Z",
    },
]


class PrePurchaseRepository:
    def __init__(self):
        self.mode = os.getenv("PERSISTENCE_BACKEND", "memory").lower()
        self.supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

        # In-memory stores
        self._checks: Dict[str, Dict[str, Any]] = {}
        self._decisions: Dict[str, Dict[str, Any]] = {}
        self._feedbacks: Dict[str, Dict[str, Any]] = {}
        self._audit_logs: List[Dict[str, Any]] = []

    def set_mode(self, mode: str):
        """Ubah mode persistensi secara dinamis (berguna untuk testing)."""
        self.mode = mode.lower()

    @property
    def is_db_mode(self) -> bool:
        return self.mode == "db"

    def _get_headers(self) -> Dict[str, str]:
        return {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    # ═══════════════════════════════════════════════════════════════
    # 1. PRE-PURCHASE CHECK & RISK PREDICTION
    # ═══════════════════════════════════════════════════════════════

    async def save_check(
        self,
        check_id: str,
        user_id: str,
        category_id: str,
        planned_amount: float,
        merchant_name: Optional[str],
        notes: Optional[str],
        prediction_data: Dict[str, Any],
        budget_remaining_before: float,
        budget_remaining_after: float,
        savings_delayed_days: int = 0,
    ) -> Dict[str, Any]:
        """Menyimpan data pemeriksaan pra-beli dan hasil prediksi risiko."""
        now_iso = datetime.now(timezone.utc).isoformat()

        check_record = {
            "id": check_id,
            "user_id": user_id,
            "category_id": category_id,
            "planned_amount": planned_amount,
            "merchant_name": merchant_name,
            "notes": notes,
            "user_decision": "PENDING",
            "decided_at": None,
            "created_at": now_iso,
            # Data prediksi terkait
            "risk_score": prediction_data.get("risk_score", 0.0),
            "risk_level": prediction_data.get("risk_level", "LOW"),
            "features_snapshot": prediction_data.get("features_snapshot", {}),
            "trigger_factors": prediction_data.get("trigger_factors", []),
            "method": prediction_data.get("method", "rule_based"),
            "model_version": prediction_data.get("model_version", "n/a"),
            "budget_remaining_before": budget_remaining_before,
            "budget_remaining_after": budget_remaining_after,
            "savings_delayed_days": savings_delayed_days,
        }

        # Simpan selalu ke in-memory
        self._checks[check_id] = check_record

        # Jika mode DB aktif dan kredensial Supabase tersedia, simpan ke PostgreSQL
        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    # 1. Simpan ke pre_purchase_checks
                    check_payload = {
                        "id": check_id,
                        "user_id": user_id,
                        "category_id": category_id,
                        "planned_amount": planned_amount,
                        "merchant_name": merchant_name,
                        "notes": notes,
                        "user_decision": "PENDING",
                        "created_at": now_iso,
                    }
                    r_check = await client.post(
                        f"{self.supabase_url}/rest/v1/pre_purchase_checks",
                        headers=self._get_headers(),
                        json=check_payload,
                    )
                    if r_check.status_code not in (200, 201):
                        logger.warning("Gagal insert ke pre_purchase_checks: %s", r_check.text)

                    # 2. Simpan ke risk_predictions
                    pred_payload = {
                        "check_id": check_id,
                        "risk_score": round(prediction_data.get("risk_score", 0.0), 4),
                        "risk_level": prediction_data.get("risk_level", "LOW"),
                        "features_snapshot": prediction_data.get("features_snapshot", {}),
                        "trigger_factors": prediction_data.get("trigger_factors", []),
                        "budget_remaining_before": budget_remaining_before,
                        "budget_remaining_after": budget_remaining_after,
                        "savings_delayed_days": savings_delayed_days,
                        "created_at": now_iso,
                    }
                    r_pred = await client.post(
                        f"{self.supabase_url}/rest/v1/risk_predictions",
                        headers=self._get_headers(),
                        json=pred_payload,
                    )
                    if r_pred.status_code not in (200, 201):
                        logger.warning("Gagal insert ke risk_predictions: %s", r_pred.text)
            except Exception as e:
                logger.error("Koneksi DB gagal saat save_check: %s", e)

        return check_record

    async def get_check(self, check_id: str) -> Optional[Dict[str, Any]]:
        """Mengambil data pemeriksaan pra-beli berdasarkan check_id."""
        if check_id in self._checks:
            return self._checks[check_id]

        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    r = await client.get(
                        f"{self.supabase_url}/rest/v1/pre_purchase_checks",
                        headers=self._get_headers(),
                        params={"id": f"eq.{check_id}", "select": "*"},
                    )
                    if r.status_code == 200:
                        rows = r.json()
                        if rows:
                            return rows[0]
            except Exception as e:
                logger.error("Gagal query pre_purchase_checks: %s", e)

        return None

    # ═══════════════════════════════════════════════════════════════
    # 2. DECISION RECORDING
    # ═══════════════════════════════════════════════════════════════

    async def record_decision(
        self,
        check_id: str,
        decision: str,
        adjusted_amount: Optional[float] = None,
        decided_at: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Mencatat keputusan akhir pengguna (PROCEED/ADJUST/POSTPONE)."""
        dt = decided_at or datetime.now(timezone.utc)
        dt_iso = dt.isoformat()

        # Update in-memory
        if check_id in self._checks:
            self._checks[check_id]["user_decision"] = decision
            self._checks[check_id]["decided_at"] = dt_iso
            if adjusted_amount is not None:
                self._checks[check_id]["adjusted_amount"] = adjusted_amount

        decision_record = {
            "check_id": check_id,
            "decision": decision,
            "adjusted_amount": adjusted_amount,
            "decided_at": dt_iso,
        }
        self._decisions[check_id] = decision_record

        # Update DB jika aktif
        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    update_data = {
                        "user_decision": decision,
                        "decided_at": dt_iso,
                    }
                    r = await client.patch(
                        f"{self.supabase_url}/rest/v1/pre_purchase_checks?id=eq.{check_id}",
                        headers=self._get_headers(),
                        json=update_data,
                    )
                    if r.status_code not in (200, 204):
                        logger.warning("Gagal update user_decision di DB: %s", r.text)
            except Exception as e:
                logger.error("Koneksi DB gagal saat record_decision: %s", e)

        return decision_record

    # ═══════════════════════════════════════════════════════════════
    # 3. FEEDBACK RECORDING
    # ═══════════════════════════════════════════════════════════════

    async def record_feedback(
        self,
        check_id: str,
        was_impulsive: bool,
        satisfaction_rating: Optional[int] = None,
        feedback_notes: Optional[str] = None,
        submitted_at: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Merekam feedback pasca-keputusan (label ground truth)."""
        dt = submitted_at or datetime.now(timezone.utc)
        dt_iso = dt.isoformat()

        feedback_record = {
            "check_id": check_id,
            "was_impulsive": was_impulsive,
            "satisfaction_rating": satisfaction_rating,
            "feedback_notes": feedback_notes,
            "submitted_at": dt_iso,
        }

        # Simpan in-memory
        self._feedbacks[check_id] = feedback_record
        if check_id in self._checks:
            self._checks[check_id]["was_impulsive"] = was_impulsive

        # Simpan ke DB jika aktif
        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    fb_payload = {
                        "check_id": check_id,
                        "was_impulsive": was_impulsive,
                        "satisfaction_rating": satisfaction_rating,
                        "feedback_notes": feedback_notes,
                        "submitted_at": dt_iso,
                    }
                    r = await client.post(
                        f"{self.supabase_url}/rest/v1/post_decision_feedbacks",
                        headers=self._get_headers(),
                        json=fb_payload,
                    )
                    if r.status_code not in (200, 201):
                        logger.warning("Gagal insert ke post_decision_feedbacks: %s", r.text)
            except Exception as e:
                logger.error("Koneksi DB gagal saat record_feedback: %s", e)

        return feedback_record

    # ═══════════════════════════════════════════════════════════════
    # 4. MODEL GOVERNANCE & REGISTRY
    # ═══════════════════════════════════════════════════════════════

    async def load_model_registry(self) -> List[Dict[str, Any]]:
        """
        Mengambil registri versi model.
        Ketika PERSISTENCE_BACKEND=db, membaca dari tabel model_versions.
        Jika tabel kosong atau query gagal, kembali (fallback) ke berkas JSON atau default.
        """
        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    r = await client.get(
                        f"{self.supabase_url}/rest/v1/model_versions",
                        headers=self._get_headers(),
                        params={"select": "*", "order": "deployed_at.desc"},
                    )
                    if r.status_code == 200:
                        rows = r.json()
                        if rows:
                            # Map format DB ke format API
                            formatted = []
                            for row in rows:
                                formatted.append({
                                    "id": str(row.get("id")),
                                    "version_tag": row.get("version_tag"),
                                    "algorithm": row.get("algorithm"),
                                    "precision": float(row.get("precision_score") or 0.0),
                                    "recall": float(row.get("recall_score") or 0.0),
                                    "f1_score": float(row.get("f1_score") or 0.0),
                                    "roc_auc": float(row.get("roc_auc_score") or 0.0),
                                    "is_active": bool(row.get("is_active")),
                                    "artifact_path": row.get("artifact_path"),
                                    "deployed_at": row.get("deployed_at"),
                                })
                            return formatted
            except Exception as e:
                logger.warning("Gagal membaca tabel model_versions dari DB (%s). Menggunakan JSON fallback.", e)

        # Fallback ke JSON file
        if MODEL_REGISTRY_PATH.exists():
            try:
                with open(MODEL_REGISTRY_PATH, "r") as f:
                    return json.load(f)
            except Exception:
                pass

        import copy
        return copy.deepcopy(DEFAULT_MODEL_REGISTRY)

    async def save_model_registry(self, registry: List[Dict[str, Any]]) -> None:
        """Menyimpan registri model ke berkas JSON."""
        ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
        with open(MODEL_REGISTRY_PATH, "w") as f:
            json.dump(registry, f, indent=2)

    async def execute_model_rollback(
        self,
        target_model_version_id: str,
        reason: str,
        admin_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Melakukan rollback versi model aktif.
        Mewajibkan alasan rollback dan menulis catatan ke audit_logs.
        """
        registry = await self.load_model_registry()

        target = None
        for m in registry:
            if m["id"] == target_model_version_id:
                target = m
                break

        if target is None:
            raise ValueError(f"Model version ID '{target_model_version_id}' tidak ditemukan.")

        if target.get("is_active"):
            raise ValueError("Model tersebut sudah aktif. Tidak perlu rollback.")

        now_iso = datetime.now(timezone.utc).isoformat()

        # Update status model di registry
        for m in registry:
            m["is_active"] = False
        target["is_active"] = True
        target["deployed_at"] = now_iso

        # Simpan ke JSON
        await self.save_model_registry(registry)

        # Catat ke audit_logs
        actor_uuid = admin_id or "00000000-0000-0000-0000-000000000000"
        audit_entry = {
            "id": f"audit-{len(self._audit_logs) + 1:04d}",
            "actor_id": actor_uuid,
            "action": "ROLLBACK_MODEL",
            "entity_type": "model_version",
            "entity_id": target_model_version_id,
            "details": {
                "target_version_tag": target["version_tag"],
                "algorithm": target["algorithm"],
                "reason": reason,
            },
            "created_at": now_iso,
        }
        self._audit_logs.append(audit_entry)

        # Jika mode DB aktif, perbarui model_versions & tulis audit_logs di PostgreSQL
        if self.is_db_mode and self.supabase_url and self.service_key:
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    # 1. Nonaktifkan model lama
                    await client.patch(
                        f"{self.supabase_url}/rest/v1/model_versions?is_active=eq.true",
                        headers=self._get_headers(),
                        json={"is_active": False},
                    )
                    # 2. Aktifkan model target
                    await client.patch(
                        f"{self.supabase_url}/rest/v1/model_versions?id=eq.{target_model_version_id}",
                        headers=self._get_headers(),
                        json={"is_active": True, "deployed_at": now_iso},
                    )
                    # 3. Tulis audit log
                    audit_db_payload = {
                        "actor_id": actor_uuid,
                        "action": "ROLLBACK_MODEL",
                        "entity_type": "model_version",
                        "entity_id": target_model_version_id,
                        "details": audit_entry["details"],
                        "created_at": now_iso,
                    }
                    await client.post(
                        f"{self.supabase_url}/rest/v1/audit_logs",
                        headers=self._get_headers(),
                        json=audit_db_payload,
                    )
            except Exception as e:
                logger.error("Gagal sinkronisasi rollback ke DB: %s", e)

        return {
            "rolled_back_to": target["version_tag"],
            "algorithm": target["algorithm"],
            "reason": reason,
            "admin_id": admin_id,
            "deployed_at": now_iso,
        }

    # ═══════════════════════════════════════════════════════════════
    # 5. AUDIT LOGS
    # ═══════════════════════════════════════════════════════════════

    async def get_audit_logs(
        self,
        page: int = 1,
        per_page: int = 20,
    ) -> Dict[str, Any]:
        """Mengambil data log audit intervensi pra-pembelian."""
        # Baseline mock audit logs untuk development
        mock_logs = [
            {
                "id": "log-001",
                "user_id": "user-abc",
                "user_name": "Raka S.",
                "category_name": "Shopping",
                "planned_amount": 275000,
                "risk_level": "HIGH",
                "risk_score": 0.7845,
                "decision": "POSTPONE",
                "was_impulsive": True,
                "created_at": "2026-09-18T14:30:00Z",
            },
            {
                "id": "log-002",
                "user_id": "user-def",
                "user_name": "Aina W.",
                "category_name": "F&B",
                "planned_amount": 85000,
                "risk_level": "MEDIUM",
                "risk_score": 0.4523,
                "decision": "PROCEED",
                "was_impulsive": False,
                "created_at": "2026-09-17T10:15:00Z",
            },
            {
                "id": "log-003",
                "user_id": "user-ghi",
                "user_name": "Budi K.",
                "category_name": "Entertainment",
                "planned_amount": 350000,
                "risk_level": "HIGH",
                "risk_score": 0.8210,
                "decision": "ADJUST",
                "was_impulsive": None,
                "created_at": "2026-09-16T19:45:00Z",
            },
            {
                "id": "log-004",
                "user_id": "user-jkl",
                "user_name": "Sari M.",
                "category_name": "Transport",
                "planned_amount": 45000,
                "risk_level": "LOW",
                "risk_score": 0.1823,
                "decision": "PROCEED",
                "was_impulsive": False,
                "created_at": "2026-09-15T08:20:00Z",
            },
            {
                "id": "log-005",
                "user_id": "user-mno",
                "user_name": "Dani P.",
                "category_name": "Shopping",
                "planned_amount": 1250000,
                "risk_level": "HIGH",
                "risk_score": 0.9134,
                "decision": "POSTPONE",
                "was_impulsive": True,
                "created_at": "2026-09-14T16:50:00Z",
            },
        ]

        # Gabungkan entri dari _checks yang baru jika ada
        combined = list(mock_logs)
        for cid, chk in self._checks.items():
            combined.insert(0, {
                "id": cid,
                "user_id": chk.get("user_id", "user-active"),
                "user_name": "Active User",
                "category_name": "General",
                "planned_amount": chk.get("planned_amount", 0),
                "risk_level": chk.get("risk_level", "LOW"),
                "risk_score": chk.get("risk_score", 0.0),
                "decision": chk.get("user_decision", "PENDING"),
                "was_impulsive": chk.get("was_impulsive"),
                "created_at": chk.get("created_at", datetime.now(timezone.utc).isoformat()),
            })

        total = len(combined)
        start = (page - 1) * per_page
        end = start + per_page
        paginated = combined[start:end]

        total_checks = total
        total_prevented = sum(1 for log in combined if log.get("decision") in ["POSTPONE", "ADJUST"])
        prevention_rate = (total_prevented / total_checks * 100) if total_checks > 0 else 0
        total_amount_prevented = sum(
            log.get("planned_amount", 0) for log in combined
            if log.get("decision") in ["POSTPONE", "ADJUST"]
        )

        return {
            "logs": paginated,
            "pagination": {
                "page": page,
                "per_page": per_page,
                "total": total,
                "total_pages": max(1, (total + per_page - 1) // per_page),
            },
            "summary": {
                "total_checks": total_checks,
                "total_prevented": total_prevented,
                "prevention_rate": round(prevention_rate, 1),
                "total_amount_prevented": total_amount_prevented,
            },
        }


# Singleton instance repository
repository = PrePurchaseRepository()
