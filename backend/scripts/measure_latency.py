"""
Skrip Pengukuran Latensi Endpoint POST /api/v1/pre-purchase/check
CEAMIS 2.0 — Memenuhi Persyaratan TUGAS F6 (minimal 30 panggilan)
Kondisi: Setelah F1 (persistensi repository layer) dan F2 (user stats point-in-time)
"""

import sys
import os
import time
import json
import statistics
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Fix Windows console encoding
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Setup import path
BACKEND_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient
from app.main import app
from app.services.user_stats_service import user_stats_service
from app.services.pre_purchase_repository import repository
from app.services.pre_purchase_risk import risk_predictor


def seed_benchmark_user_data(user_id: str):
    """Seed data transaksi riwayat untuk menguji kondisi F2 (pengguna dengan riwayat nyata)."""
    now = datetime.now(timezone.utc)
    txs = []
    # 20 transaksi 30 hari terakhir
    for i in range(20):
        txs.append({
            "category_id": "cat-food" if i % 2 == 0 else "cat-transport",
            "category_name": "Makanan & Minuman" if i % 2 == 0 else "Transportasi",
            "amount": 35_000.0 + (i * 2_500.0),
            "transaction_type": "expense",
            "transaction_date": (now - timedelta(days=25 - i)).isoformat(),
        })
    user_stats_service.set_mock_data(
        user_id=user_id,
        transactions=txs,
        budget={"budget_limit": 2_000_000.0},
    )


def run_benchmark(n_runs: int = 50):
    print("=" * 70)
    print("PENGUKURAN WAKTU RESPONS ENDPOINT POST /api/v1/pre-purchase/check")
    print("=" * 70)

    # Pastikan model ML terload jika tersedia
    risk_predictor.load_model()
    ml_status = f"Aktif ({risk_predictor.metadata.get('algorithm', 'ML')})" if risk_predictor.is_ml_available else "Rule-based Baseline"
    repo_mode = repository.mode

    print(f"Kondisi Lingkungan:")
    print(f"  • Platform OS        : {sys.platform} (Windows NT)")
    print(f"  • Versi Python       : {sys.version.split()[0]}")
    print(f"  • Mode Repository    : {repo_mode} (F1 Dual-mode)")
    print(f"  • Mode Mesin Risiko  : {ml_status}")
    print(f"  • Jumlah Panggilan   : {n_runs} request terukur (+ 10 warmup)")
    print("=" * 70)

    client = TestClient(app)

    # 1. Benchmark Skenario A: Pengguna dengan Riwayat Nyata (F2 Point-in-Time Active)
    user_with_history = "user-bench-active"
    seed_benchmark_user_data(user_with_history)

    # Warmup
    for w in range(10):
        client.post(
            "/api/v1/pre-purchase/check",
            json={
                "user_id": user_with_history,
                "category_id": "cat-food",
                "planned_amount": 50_000.0,
            },
        )

    latencies_active = []
    status_codes_active = []

    for i in range(n_runs):
        amt = 30_000.0 + ((i % 10) * 15_000.0)
        cat = "cat-food" if i % 2 == 0 else "cat-transport"
        payload = {
            "user_id": user_with_history,
            "category_id": cat,
            "planned_amount": amt,
            "notes": f"Benchmark run #{i+1}",
        }

        t_start = time.perf_counter()
        resp = client.post("/api/v1/pre-purchase/check", json=payload)
        t_end = time.perf_counter()

        elapsed_ms = (t_end - t_start) * 1000.0
        latencies_active.append(elapsed_ms)
        status_codes_active.append(resp.status_code)

    # 2. Benchmark Skenario B: Pengguna Baru (Cold-Start Aware)
    cold_user = "user-bench-cold-start"
    latencies_cold = []
    status_codes_cold = []

    for i in range(n_runs):
        amt = 40_000.0 + ((i % 8) * 12_000.0)
        payload = {
            "user_id": cold_user,
            "category_id": "cat-food",
            "planned_amount": amt,
        }

        t_start = time.perf_counter()
        resp = client.post("/api/v1/pre-purchase/check", json=payload)
        t_end = time.perf_counter()

        elapsed_ms = (t_end - t_start) * 1000.0
        latencies_cold.append(elapsed_ms)
        status_codes_cold.append(resp.status_code)

    def calc_stats(latencies):
        sorted_l = sorted(latencies)
        n = len(sorted_l)
        return {
            "min": round(min(sorted_l), 2),
            "median_p50": round(statistics.median(sorted_l), 2),
            "mean": round(statistics.mean(sorted_l), 2),
            "p90": round(sorted_l[int(n * 0.90)], 2),
            "p95": round(sorted_l[int(n * 0.95)], 2),
            "p99": round(sorted_l[min(int(n * 0.99), n - 1)], 2),
            "max": round(max(sorted_l), 2),
            "stdev": round(statistics.stdev(sorted_l), 2) if n > 1 else 0.0,
        }

    stats_active = calc_stats(latencies_active)
    stats_cold = calc_stats(latencies_cold)

    print("\nHASIL PENGUKURAN:")
    print("-" * 70)
    print("Skenario 1: Pengguna dengan Riwayat Transaksi Nyata (Point-in-Time F2)")
    print(f"  • Sukses (HTTP 200) : {status_codes_active.count(200)} / {len(status_codes_active)}")
    print(f"  • Min Latensi       : {stats_active['min']} ms")
    print(f"  • Rata-rata (Mean)  : {stats_active['mean']} ms")
    print(f"  • Median (p50)      : {stats_active['median_p50']} ms")
    print(f"  • Persentil 90 (p90): {stats_active['p90']} ms")
    print(f"  • Persentil 95 (p95): {stats_active['p95']} ms")
    print(f"  • Persentil 99 (p99): {stats_active['p99']} ms")
    print(f"  • Max Latensi       : {stats_active['max']} ms")
    print(f"  • Standar Deviasi   : {stats_active['stdev']} ms")

    print("\nSkenario 2: Pengguna Baru (Cold-Start F2)")
    print(f"  • Sukses (HTTP 200) : {status_codes_cold.count(200)} / {len(status_codes_cold)}")
    print(f"  • Min Latensi       : {stats_cold['min']} ms")
    print(f"  • Rata-rata (Mean)  : {stats_cold['mean']} ms")
    print(f"  • Median (p50)      : {stats_cold['median_p50']} ms")
    print(f"  • Persentil 90 (p90): {stats_cold['p90']} ms")
    print(f"  • Persentil 95 (p95): {stats_cold['p95']} ms")
    print(f"  • Persentil 99 (p99): {stats_cold['p99']} ms")
    print(f"  • Max Latensi       : {stats_cold['max']} ms")
    print(f"  • Standar Deviasi   : {stats_cold['stdev']} ms")
    print("=" * 70)

    # Simpan keluaran ke JSON artifacts agar bisa dirujuk laporan
    out_path = BACKEND_DIR.parent / "thesis_assets" / "F6_hasil_pengukuran_latensi.json"
    result_data = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "n_runs": n_runs,
        "environment": {
            "os": sys.platform,
            "python_version": sys.version.split()[0],
            "repository_mode": repo_mode,
            "risk_engine": ml_status,
        },
        "scenario_active_history": {
            "metrics": stats_active,
            "all_latencies_ms": [round(x, 2) for x in latencies_active],
        },
        "scenario_cold_start": {
            "metrics": stats_cold,
            "all_latencies_ms": [round(x, 2) for x in latencies_cold],
        },
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result_data, f, indent=2)
    print(f"Hasil pengukuran lengkap disimpan ke: {out_path.name}")


if __name__ == "__main__":
    n = 50
    if len(sys.argv) > 1:
        try:
            n = int(sys.argv[1])
        except ValueError:
            pass
    run_benchmark(n_runs=n)
