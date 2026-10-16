"""
Pilot Data Pseudonymization Exporter — CEAMIS 2.0 (Tugas F9)
Mengekspor data pilot penelitian untuk analisis skripsi secara pseudonim:
- Menghasilkan `participant_code` stabil via HMAC-SHA256 ber-salt (tanpa raw user_id)
- Menyaring HANYA partisipan dengan persetujuan aktif (consent given=True, withdrawn_at=None)
- Membersihkan seluruh PII (Personal Identifiable Information: nama, surel, kontak, teks bebas)
- Opsi filter rentang tanggal, filter tabel, dan keluaran CSV/JSON
- Ringkasan statistik ekspor (baris diekspor vs baris dilewati karena tanpa persetujuan)

Referensi:
- docs/AGENT_PERBAIKAN.md § TUGAS F9
- backend/db/migrations/002_consent_records.sql

Penggunaan CLI:
    python backend/scripts/export_pilot_data.py --output-dir backend/exports/pilot_data/
    python backend/scripts/export_pilot_data.py --start-date 2026-06-01 --end-date 2026-10-31
"""

import os
import sys
import csv
import json
import hmac
import hashlib
import argparse
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Dict, Any, Set, Optional, Tuple

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Pastikan root backend ada di sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Default environment salt key
DEFAULT_ENV_SALT_KEY = "RESEARCH_PSEUDONYMIZATION_SALT"
FALLBACK_SALT = "ceamis_thesis_pilot_salt_secure_2026"


def get_salt(salt_override: Optional[str] = None) -> str:
    """Mengambil kunci salt dari argumen, variabel lingkungan, atau fallback."""
    if salt_override:
        return salt_override
    env_salt = os.getenv(DEFAULT_ENV_SALT_KEY)
    if env_salt and env_salt.strip():
        return env_salt.strip()
    return FALLBACK_SALT


def generate_participant_code(user_id: str, salt: str) -> str:
    """
    Menghasilkan kode partisipan deterministik dan stabil menggunakan HMAC-SHA256.
    Format: PARTICIPANT-XXXXXXXXXXXX (12 karakter heksadesimal kapital).
    """
    if not user_id:
        return "PARTICIPANT-UNKNOWN"
    digest = hmac.new(
        salt.encode("utf-8"),
        user_id.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()[:12].upper()
    return f"PARTICIPANT-{digest}"


def extract_consented_user_ids(consent_records: List[Dict[str, Any]]) -> Set[str]:
    """
    Menyaring user_id yang memiliki persetujuan aktif (given = True dan withdrawn_at is None).
    Jika pengguna pernah memberikan consent lalu mencabutnya, mereka dikeluarkan dari set.
    """
    # Lacak status persetujuan terbaru per user_id berdasarkan urutan / timestamp
    latest_by_user: Dict[str, Dict[str, Any]] = {}
    for r in consent_records:
        uid = r.get("user_id")
        if not uid:
            continue
        # Ambil record terbaru jika ada lebih dari 1
        current = latest_by_user.get(uid)
        if not current:
            latest_by_user[uid] = r
        else:
            current_time = current.get("given_at") or current.get("created_at") or ""
            new_time = r.get("given_at") or r.get("created_at") or ""
            if str(new_time) >= str(current_time):
                latest_by_user[uid] = r

    active_consents: Set[str] = set()
    for uid, r in latest_by_user.items():
        is_given = bool(r.get("given", False))
        is_withdrawn = r.get("withdrawn_at") is not None and str(r.get("withdrawn_at")).strip() != ""
        if is_given and not is_withdrawn:
            active_consents.add(uid)

    return active_consents


def parse_iso_datetime(dt_str: Any) -> Optional[datetime]:
    """Parsing tanggal ISO ke objek datetime UTC."""
    if not dt_str:
        return None
    if isinstance(dt_str, datetime):
        return dt_str.replace(tzinfo=timezone.utc) if dt_str.tzinfo is None else dt_str
    try:
        cleaned = str(dt_str).replace("Z", "+00:00")
        dt = datetime.fromisoformat(cleaned)
        return dt.replace(tzinfo=timezone.utc) if dt.tzinfo is None else dt
    except Exception:
        return None


def is_within_range(dt: Optional[datetime], start_dt: Optional[datetime], end_dt: Optional[datetime]) -> bool:
    """Memeriksa apakah waktu berada di dalam rentang filter tanggal."""
    if dt is None:
        return True
    if start_dt and dt < start_dt:
        return False
    if end_dt and dt > end_dt:
        return False
    return True


# ═══════════════════════════════════════════════════════
# SANITIZERS (Pembersihan PII & Transformasi Pseudonim)
# ═══════════════════════════════════════════════════════

def sanitize_check_record(raw: Dict[str, Any], participant_code: str) -> Dict[str, Any]:
    """Membersihkan rekaman pemeriksaan pra-pembelian."""
    created_at = raw.get("created_at")
    return {
        "check_id": raw.get("id") or raw.get("check_id"),
        "participant_code": participant_code,
        "category_name": raw.get("category_name", "Belanja"),
        "planned_amount": float(raw.get("planned_amount", 0.0)),
        "risk_score": float(raw.get("risk_score", 0.0)),
        "risk_level": raw.get("risk_level", "LOW"),
        "cold_start": bool(raw.get("cold_start", False)),
        "decision_latency_ms": raw.get("decision_latency_ms"),
        "created_at": created_at,
    }


def sanitize_decision_record(raw: Dict[str, Any], participant_code: str) -> Dict[str, Any]:
    """Membersihkan rekaman keputusan pengguna."""
    return {
        "decision_id": raw.get("id"),
        "check_id": raw.get("check_id"),
        "participant_code": participant_code,
        "decision": raw.get("decision"),  # PROCEED, ADJUST, POSTPONE
        "adjusted_amount": float(raw.get("adjusted_amount")) if raw.get("adjusted_amount") is not None else None,
        "decision_latency_ms": raw.get("decision_latency_ms"),
        "decided_at": raw.get("decided_at") or raw.get("created_at"),
    }


def sanitize_feedback_record(raw: Dict[str, Any], participant_code: str) -> Dict[str, Any]:
    """Membersihkan rekaman umpan balik pasca-keputusan."""
    # Catatan teks bebas dihapus demi kepatuhan etika data privasi
    return {
        "feedback_id": raw.get("id"),
        "check_id": raw.get("check_id"),
        "participant_code": participant_code,
        "actually_purchased": raw.get("actually_purchased"),
        "was_unplanned": raw.get("was_impulsive"),  # Istilah skripsi: transaksi tidak terencana
        "satisfaction_rating": raw.get("satisfaction_rating"),
        "has_notes": bool(raw.get("feedback_notes") and str(raw.get("feedback_notes")).strip()),
        "submitted_at": raw.get("submitted_at") or raw.get("created_at"),
    }


def sanitize_transaction_record(raw: Dict[str, Any], participant_code: str) -> Dict[str, Any]:
    """Membersihkan transaksi keuangan pengguna."""
    return {
        "transaction_id": raw.get("id"),
        "participant_code": participant_code,
        "category_name": raw.get("category_name") or raw.get("category", "General"),
        "amount": float(raw.get("amount", 0.0)),
        "type": raw.get("type", "EXPENSE"),
        "is_unplanned": raw.get("is_unplanned") or raw.get("is_impulsive"),
        "transaction_date": raw.get("transaction_date") or raw.get("created_at"),
    }


# ═══════════════════════════════════════════════════════
# CORE EXPORT ENGINE
# ═══════════════════════════════════════════════════════

def export_pilot_data(
    raw_data: Dict[str, List[Dict[str, Any]]],
    output_dir: Path,
    salt: str,
    start_date_str: Optional[str] = None,
    end_date_str: Optional[str] = None,
    target_tables: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Ekspor dataset pilot secara pseudonim ke berkas CSV di output_dir.
    raw_data memuat kunci: 'consent_records', 'checks', 'decisions', 'feedback', 'transactions'.
    """
    output_dir.mkdir(parents=True, exist_ok=True)

    start_dt = parse_iso_datetime(start_date_str) if start_date_str else None
    end_dt = parse_iso_datetime(end_date_str) if end_date_str else None

    # 1. Saring partisipan ber-consent aktif
    consent_list = raw_data.get("consent_records", [])
    consented_user_ids = extract_consented_user_ids(consent_list)

    if target_tables is None or "all" in target_tables:
        active_tables = ["checks", "decisions", "feedback", "transactions"]
    else:
        active_tables = [t.strip().lower() for t in target_tables]

    summary: Dict[str, Any] = {
        "total_active_consented_participants": len(consented_user_ids),
        "exported_tables": {},
        "output_directory": str(output_dir),
        "exported_at": datetime.now(timezone.utc).isoformat(),
    }

    # Konfigurasi tabel
    table_configs = {
        "checks": {
            "source_key": "checks",
            "date_field": "created_at",
            "sanitizer": sanitize_check_record,
            "filename": "pilot_checks_pseudonymized.csv",
        },
        "decisions": {
            "source_key": "decisions",
            "date_field": "decided_at",
            "sanitizer": sanitize_decision_record,
            "filename": "pilot_decisions_pseudonymized.csv",
        },
        "feedback": {
            "source_key": "feedback",
            "date_field": "submitted_at",
            "sanitizer": sanitize_feedback_record,
            "filename": "pilot_feedback_pseudonymized.csv",
        },
        "transactions": {
            "source_key": "transactions",
            "date_field": "transaction_date",
            "sanitizer": sanitize_transaction_record,
            "filename": "pilot_transactions_pseudonymized.csv",
        },
    }

    for table_name in active_tables:
        if table_name not in table_configs:
            continue
        cfg = table_configs[table_name]
        raw_items = raw_data.get(cfg["source_key"], [])

        exported_rows: List[Dict[str, Any]] = []
        skipped_unconsented_count = 0
        skipped_date_range_count = 0

        for item in raw_items:
            uid = item.get("user_id")
            # Tolak pengguna tanpa consent aktif
            if not uid or uid not in consented_user_ids:
                skipped_unconsented_count += 1
                continue

            # Periksa filter tanggal
            item_dt = parse_iso_datetime(item.get(cfg["date_field"]) or item.get("created_at"))
            if not is_within_range(item_dt, start_dt, end_dt):
                skipped_date_range_count += 1
                continue

            # Buat kode pseudonim
            p_code = generate_participant_code(uid, salt)
            cleaned = cfg["sanitizer"](item, p_code)
            exported_rows.append(cleaned)

        # Tulis ke CSV
        out_file = output_dir / cfg["filename"]
        if exported_rows:
            fieldnames = list(exported_rows[0].keys())
            with open(out_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(exported_rows)
        else:
            # Tulis CSV kosong dengan header jika tidak ada baris
            dummy = cfg["sanitizer"]({}, "PARTICIPANT-DUMMY")
            with open(out_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.DictWriter(f, fieldnames=list(dummy.keys()))
                writer.writeheader()

        summary["exported_tables"][table_name] = {
            "exported_rows": len(exported_rows),
            "skipped_unconsented_rows": skipped_unconsented_count,
            "skipped_out_of_date_range": skipped_date_range_count,
            "output_file": str(out_file),
        }

    # Tulis berkas ringkasan manifest metadata JSON
    manifest_file = output_dir / "export_manifest.json"
    with open(manifest_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    return summary


# ═══════════════════════════════════════════════════════
# CLI INTERFACE
# ═══════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Ekspor Data Pilot CEAMIS 2.0 Secara Pseudonim")
    parser.add_argument("--output-dir", type=str, default="backend/exports/pilot_data", help="Direktori target keluaran CSV")
    parser.add_argument("--salt", type=str, default=None, help="Salt kunci HMAC untuk participant_code")
    parser.add_argument("--start-date", type=str, default=None, help="Tanggal awal (YYYY-MM-DD)")
    parser.add_argument("--end-date", type=str, default=None, help="Tanggal akhir (YYYY-MM-DD)")
    parser.add_argument("--tables", type=str, default="all", help="Daftar tabel (all atau checks,decisions,feedback,transactions)")

    args = parser.parse_args()

    salt = get_salt(args.salt)
    out_dir = Path(args.output_dir)

    print("=" * 70)
    print("🔒 CEAMIS 2.0 — Pilot Data Pseudonymization Exporter")
    print("=" * 70)
    print(f"Target Output Directory: {out_dir}")
    print(f"Salt Active:             {'CUSTOM' if args.salt else ('ENV' if os.getenv(DEFAULT_ENV_SALT_KEY) else 'FALLBACK')}")
    if args.start_date or args.end_date:
        print(f"Date Filter Range:       {args.start_date or '*'} s/d {args.end_date or '*'}")
    print(f"Tables to Export:        {args.tables}")
    print("=" * 70)

    # Sumber data: dari PrePurchaseRepository in-memory store atau Supabase
    from app.services.pre_purchase_repository import repository
    raw_data = {
        "consent_records": list(repository._consents.values()),
        "checks": list(repository._checks.values()),
        "decisions": list(repository._decisions.values()),
        "feedback": list(repository._feedbacks.values()),
        "transactions": [],
    }

    target_tables = [t.strip() for t in args.tables.split(",")]
    summary = export_pilot_data(
        raw_data=raw_data,
        output_dir=out_dir,
        salt=salt,
        start_date_str=args.start_date,
        end_date_str=args.end_date,
        target_tables=target_tables,
    )

    print("\n📊 HASIL EKSPOR DATA:")
    print(f"   Partisipan dengan Persetujuan Aktif: {summary['total_active_consented_participants']}")
    print("-" * 70)
    for tbl, info in summary["exported_tables"].items():
        print(f"   Tabel: {tbl:<15} | Baris Diekspor: {info['exported_rows']:<5} | Baris Tanpa Consent: {info['skipped_unconsented_rows']:<5}")
        print(f"   -> Berkas: {info['output_file']}")
    print("=" * 70)
    print("✅ Ekspor data pseudonim selesai dengan sukses!")


if __name__ == "__main__":
    main()
