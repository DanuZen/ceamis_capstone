"""
User Stats Service — CEAMIS 2.0 (Tugas F2)
Menghitung statistik kontekstual transaksi pengguna untuk pemeriksaan risiko pra-pembelian.

Prinsip Utama:
1. Bebas Kebocoran Temporal (Point-in-Time):
   Hanya transaksi sebelum waktu pemeriksaan (transaction_date < check_time)
   yang diikutsertakan dalam kalkulasi statistik (median, mean, std, frekuensi 7d, spent so far).
2. Penanganan Pengguna Baru (Cold Start):
   Jika jumlah transaksi historis pada kategori < MIN_TRANSACTIONS_THRESHOLD (bawaan: 5),
   sistem menandai cold_start = True dan menggunakan statistik fallback terdefinisi.
3. Penjagaan Nilai Ekstrem & Pembagian Nol:
   Melindungi kalkulasi deviasi standar dan pembagian rasio jika varians 0 atau data tunggal.
4. Dukungan Dual-Mode:
   Mendukung injeksi data pengujian (in-memory) dan query REST Supabase (PostgreSQL).
"""

import os
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
import numpy as np
import httpx


# ═══════════════════════════════════════════════════════════════
# KONSTANTA & ATURAN COLD START
# ═══════════════════════════════════════════════════════════════

MIN_TRANSACTIONS_THRESHOLD = 5

DEFAULT_CATEGORY_FALLBACKS: Dict[str, Dict[str, Any]] = {
    "default": {
        "category_name": "Belanja & Lainnya",
        "median_amount": 115000.0,
        "mean_amount": 135000.0,
        "std_amount": 62000.0,
        "frequency_7d": 1,
    },
    "Shopping": {
        "category_name": "Shopping",
        "median_amount": 115000.0,
        "mean_amount": 135000.0,
        "std_amount": 62000.0,
        "frequency_7d": 2,
    },
    "Makanan": {
        "category_name": "Makanan & Minuman",
        "median_amount": 35000.0,
        "mean_amount": 42000.0,
        "std_amount": 18000.0,
        "frequency_7d": 5,
    },
    "Transportasi": {
        "category_name": "Transportasi",
        "median_amount": 25000.0,
        "mean_amount": 30000.0,
        "std_amount": 15000.0,
        "frequency_7d": 4,
    },
    "Hiburan": {
        "category_name": "Hiburan",
        "median_amount": 100000.0,
        "mean_amount": 125000.0,
        "std_amount": 55000.0,
        "frequency_7d": 1,
    },
}

DEFAULT_BUDGET_FALLBACK = {
    "budget_limit": 800000.0,
    "spent_so_far": 0.0,
    "remaining": 800000.0,
}

DEFAULT_SAVINGS_FALLBACK = {
    "goal_title": "Dana Darurat 2026",
    "target_amount": 5000000.0,
    "current_amount": 2800000.0,
    "monthly_income": 4500000.0,
    "monthly_savings_rate": 0.15,
}

DEFAULT_PROFILE_FALLBACK = {
    "budget_reset_day": 1,
}


# ═══════════════════════════════════════════════════════════════
# HELPER PARSING WAKTU & KEAMANAN TEMPORAL
# ═══════════════════════════════════════════════════════════════

def parse_iso_datetime(dt_val: Any) -> Optional[datetime]:
    """Parse string ISO / datetime menjadi UTC datetime timezone-aware."""
    if dt_val is None:
        return None
    if isinstance(dt_val, datetime):
        if dt_val.tzinfo is None:
            return dt_val.replace(tzinfo=timezone.utc)
        return dt_val.astimezone(timezone.utc)
    if isinstance(dt_val, str):
        try:
            # Mengganti akhiran Z dengan +00:00 jika diperlukan
            cleaned = dt_val.replace("Z", "+00:00")
            parsed = datetime.fromisoformat(cleaned)
            if parsed.tzinfo is None:
                return parsed.replace(tzinfo=timezone.utc)
            return parsed.astimezone(timezone.utc)
        except Exception:
            return None
    return None


# ═══════════════════════════════════════════════════════════════
# KALKULASI MURNI FITUR (STATELESS & INDEPENDENT)
# ═══════════════════════════════════════════════════════════════

def compute_category_statistics(
    transactions: List[Dict[str, Any]],
    category_id: str,
    check_time: datetime,
    min_threshold: int = MIN_TRANSACTIONS_THRESHOLD,
    default_name: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Menghitung statistik kategori secara point-in-time bebas kebocoran temporal:
    - Hanya transaksi sebelum check_time (tx_date < check_time)
    - Hanya transaksi tipe pengeluaran (expense)
    - Menghitung median, rata-rata, deviasi standar, dan frekuensi 7 hari terakhir
    - Menetapkan cold_start = True jika jumlah transaksi < min_threshold
    """
    if check_time.tzinfo is None:
        check_time = check_time.replace(tzinfo=timezone.utc)

    seven_days_ago = check_time - timedelta(days=7)

    # 1. Filter transaksi valid: milik kategori, pengeluaran, dan STRICT tx_date < check_time
    valid_txs: List[Dict[str, Any]] = []
    category_name_found = default_name

    for tx in transactions:
        # Filter kategori (cocokkan UUID category_id atau nama category)
        tx_cat_id = str(tx.get("category_id") or "")
        tx_cat_name = str(tx.get("category") or tx.get("category_name") or "")

        is_match = False
        if category_id and (tx_cat_id == category_id or tx_cat_name.lower() == category_id.lower()):
            is_match = True
        elif not category_id:
            is_match = True

        if not is_match:
            continue

        if not category_name_found and tx_cat_name:
            category_name_found = tx_cat_name

        # Filter tipe pengeluaran
        tx_type = str(tx.get("transaction_type") or tx.get("type") or "pengeluaran").lower()
        if tx_type in ("income", "pemasukan"):
            continue

        # Filter temporal: strictly tx_time < check_time
        tx_date_raw = tx.get("transaction_date") or tx.get("created_at")
        tx_time = parse_iso_datetime(tx_date_raw)
        if tx_time is None:
            continue

        # CEGAH KEBOCORAN TEMPORAL: Transaksi tepat saat atau setelah check_time diabaikan!
        if tx_time >= check_time:
            continue

        amount = float(tx.get("amount", 0.0))
        if amount > 0:
            valid_txs.append({
                "amount": amount,
                "tx_time": tx_time,
                "category_name": tx_cat_name or category_name_found or "Shopping",
            })

    count = len(valid_txs)
    category_name = category_name_found or "Shopping"

    # Cari fallback profil kategori jika cocok
    fallback_key = "default"
    for k in DEFAULT_CATEGORY_FALLBACKS:
        if k.lower() in category_name.lower():
            fallback_key = k
            break
    fallback = DEFAULT_CATEGORY_FALLBACKS.get(fallback_key, DEFAULT_CATEGORY_FALLBACKS["default"])

    # 2. Aturan Cold Start (< min_threshold transaksi)
    if count < min_threshold:
        # Jika ada sebagian transaksi (1..4), hitung frekuensi 7d nyata tapi gunakan parameter fallback
        freq_7d_actual = sum(1 for t in valid_txs if t["tx_time"] >= seven_days_ago)
        return {
            "category_name": category_name or fallback["category_name"],
            "median_amount": fallback["median_amount"],
            "mean_amount": fallback["mean_amount"],
            "std_amount": fallback["std_amount"],
            "frequency_7d": freq_7d_actual if count > 0 else fallback["frequency_7d"],
            "transaction_count": count,
            "cold_start": True,
        }

    # 3. Pengguna dengan Riwayat Cukup (>= min_threshold transaksi)
    amounts = [t["amount"] for t in valid_txs]
    median_val = float(np.median(amounts))
    mean_val = float(np.mean(amounts))

    # Deviasi standar sampel (ddof=1 untuk sample std)
    if count > 1:
        std_val = float(np.std(amounts, ddof=1))
    else:
        std_val = 0.0

    # Frekuensi 7 hari terakhir sebelum waktu pemeriksaan
    freq_7d = sum(1 for t in valid_txs if t["tx_time"] >= seven_days_ago)

    return {
        "category_name": category_name,
        "median_amount": round(median_val, 2),
        "mean_amount": round(mean_val, 2),
        "std_amount": round(std_val, 2),
        "frequency_7d": freq_7d,
        "transaction_count": count,
        "cold_start": False,
    }


def compute_budget_status(
    budget_limit: Optional[float],
    transactions: List[Dict[str, Any]],
    category_id: str,
    check_time: datetime,
    budget_reset_day: int = 1,
) -> Dict[str, Any]:
    """
    Menghitung sisa anggaran berjalan dari batas pagu dan akumulasi pengeluaran
    sejak awal siklus anggaran hingga sebelum check_time.
    """
    if check_time.tzinfo is None:
        check_time = check_time.replace(tzinfo=timezone.utc)

    # Tentukan awal siklus anggaran saat ini
    day = check_time.day
    if day >= budget_reset_day:
        cycle_start = check_time.replace(day=budget_reset_day, hour=0, minute=0, second=0, microsecond=0)
    else:
        # Siklus dimulai pada bulan sebelumnya
        # Mundur ke hari terakhir bulan lalu
        first_of_month = check_time.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month_end = first_of_month - timedelta(days=1)
        safe_reset_day = min(budget_reset_day, last_month_end.day)
        cycle_start = last_month_end.replace(day=safe_reset_day, hour=0, minute=0, second=0, microsecond=0)

    # Akumulasi pengeluaran kategori dalam siklus berjalan sebelum check_time
    spent_so_far = 0.0
    for tx in transactions:
        tx_cat_id = str(tx.get("category_id") or "")
        tx_cat_name = str(tx.get("category") or tx.get("category_name") or "")

        is_match = False
        if category_id and (tx_cat_id == category_id or tx_cat_name.lower() == category_id.lower()):
            is_match = True
        elif not category_id:
            is_match = True

        if not is_match:
            continue

        tx_type = str(tx.get("transaction_type") or tx.get("type") or "pengeluaran").lower()
        if tx_type in ("income", "pemasukan"):
            continue

        tx_time = parse_iso_datetime(tx.get("transaction_date") or tx.get("created_at"))
        if tx_time is None:
            continue

        # Transaksi harus berada dalam rentang [cycle_start, check_time)
        if cycle_start <= tx_time < check_time:
            spent_so_far += float(tx.get("amount", 0.0))

    limit = float(budget_limit) if budget_limit is not None and budget_limit > 0 else DEFAULT_BUDGET_FALLBACK["budget_limit"]
    remaining = limit - spent_so_far

    return {
        "budget_limit": round(limit, 2),
        "spent_so_far": round(spent_so_far, 2),
        "remaining": round(remaining, 2),
    }


# ═══════════════════════════════════════════════════════════════
# LAYANAN UTAMA: UserStatsService
# ═══════════════════════════════════════════════════════════════

class UserStatsService:
    """
    Layanan penyedia fitur kontekstual keuangan nyata untuk CEAMIS 2.0.
    Mendukung pengujian in-memory murni serta integrasi Supabase REST.
    """

    def __init__(self):
        self.supabase_url = os.getenv("SUPABASE_URL", "").rstrip("/")
        self.service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
        # Mock in-memory store untuk fixtures/testing
        self._mock_transactions: Dict[str, List[Dict[str, Any]]] = {}
        self._mock_budgets: Dict[str, Dict[str, Any]] = {}
        self._mock_goals: Dict[str, Dict[str, Any]] = {}
        self._mock_profiles: Dict[str, Dict[str, Any]] = {}

    def set_mock_data(
        self,
        user_id: str,
        transactions: Optional[List[Dict[str, Any]]] = None,
        budget: Optional[Dict[str, Any]] = None,
        goal: Optional[Dict[str, Any]] = None,
        profile: Optional[Dict[str, Any]] = None,
    ):
        """Memasang mock data untuk keperluan pengujian unit."""
        if transactions is not None:
            self._mock_transactions[user_id] = transactions
        if budget is not None:
            self._mock_budgets[user_id] = budget
        if goal is not None:
            self._mock_goals[user_id] = goal
        if profile is not None:
            self._mock_profiles[user_id] = profile

    def clear_mock_data(self):
        """Membersihkan semua mock data."""
        self._mock_transactions.clear()
        self._mock_budgets.clear()
        self._mock_goals.clear()
        self._mock_profiles.clear()

    async def get_user_context(
        self,
        user_id: str,
        category_id: str,
        check_time: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Mengambil dan mengkalkulasi konteks pengguna lengkap untuk evaluasi pra-beli:
        - category_stats (median, mean, std, frequency_7d, cold_start)
        - budget_info (budget_limit, spent_so_far, remaining)
        - savings_info (goal_title, target_amount, current_amount, monthly_income, monthly_savings_rate)
        - profile (budget_reset_day)
        - cold_start (boolean)
        """
        if check_time is None:
            check_time = datetime.now(timezone.utc)
        elif check_time.tzinfo is None:
            check_time = check_time.replace(tzinfo=timezone.utc)

        # 1. Cek ketersediaan mock in-memory
        txs = self._mock_transactions.get(user_id)
        budget_mock = self._mock_budgets.get(user_id)
        goal_mock = self._mock_goals.get(user_id)
        profile_mock = self._mock_profiles.get(user_id)

        # 2. Jika tidak ada mock data dan DB mode aktif, ambil dari Supabase
        is_db_mode = os.getenv("PERSISTENCE_BACKEND", "memory").lower() == "db"
        if txs is None and is_db_mode and self.supabase_url and self.service_key:
            txs, budget_mock, goal_mock, profile_mock = await self._fetch_from_supabase(
                user_id, category_id, check_time
            )

        # 3. Default jika masih None
        if txs is None:
            txs = []

        budget_reset_day = (profile_mock or {}).get("budget_reset_day", DEFAULT_PROFILE_FALLBACK["budget_reset_day"])

        # 4. Hitung statistik kategori & anggaran
        cat_stats = compute_category_statistics(
            transactions=txs,
            category_id=category_id,
            check_time=check_time,
            min_threshold=MIN_TRANSACTIONS_THRESHOLD,
        )

        budget_limit = (budget_mock or {}).get("amount_limit") or (budget_mock or {}).get("budget_limit")
        budget_info = compute_budget_status(
            budget_limit=budget_limit,
            transactions=txs,
            category_id=category_id,
            check_time=check_time,
            budget_reset_day=budget_reset_day,
        )

        savings_info = {
            "goal_title": (goal_mock or {}).get("goal_name") or (goal_mock or {}).get("title") or DEFAULT_SAVINGS_FALLBACK["goal_title"],
            "target_amount": float((goal_mock or {}).get("target_amount") or DEFAULT_SAVINGS_FALLBACK["target_amount"]),
            "current_amount": float((goal_mock or {}).get("current_amount") or DEFAULT_SAVINGS_FALLBACK["current_amount"]),
            "monthly_income": float((profile_mock or {}).get("monthly_income") or DEFAULT_SAVINGS_FALLBACK["monthly_income"]),
            "monthly_savings_rate": float((profile_mock or {}).get("monthly_savings_rate") or DEFAULT_SAVINGS_FALLBACK["monthly_savings_rate"]),
        }

        profile = {
            "budget_reset_day": budget_reset_day,
        }

        return {
            "category_stats": cat_stats,
            "budget_info": budget_info,
            "savings_info": savings_info,
            "profile": profile,
            "cold_start": cat_stats["cold_start"],
        }

    async def _fetch_from_supabase(
        self,
        user_id: str,
        category_id: str,
        check_time: datetime,
    ):
        """Mengambil data riwayat transaksi dan profil dari Supabase PostgREST API."""
        headers = {
            "apikey": self.service_key,
            "Authorization": f"Bearer {self.service_key}",
            "Content-Type": "application/json",
        }
        txs = []
        budget = None
        goal = None
        profile = None

        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                # Transaksi sebelum check_time
                r_tx = await client.get(
                    f"{self.supabase_url}/rest/v1/transactions",
                    headers=headers,
                    params={
                        "user_id": f"eq.{user_id}",
                        "created_at": f"lt.{check_time.isoformat()}",
                        "select": "amount,transaction_type,type,category_id,category,created_at,transaction_date",
                        "order": "created_at.desc",
                        "limit": "200",
                    },
                )
                if r_tx.status_code == 200:
                    txs = r_tx.json()

                # Pagu Anggaran
                r_b = await client.get(
                    f"{self.supabase_url}/rest/v1/budgets",
                    headers=headers,
                    params={
                        "user_id": f"eq.{user_id}",
                        "category_id": f"eq.{category_id}",
                        "period_month": f"eq.{check_time.month}",
                        "period_year": f"eq.{check_time.year}",
                        "limit": "1",
                    },
                )
                if r_b.status_code == 200:
                    rows = r_b.json()
                    if rows:
                        budget = rows[0]

                # Target Tabungan Aktif
                r_g = await client.get(
                    f"{self.supabase_url}/rest/v1/goals",
                    headers=headers,
                    params={
                        "user_id": f"eq.{user_id}",
                        "is_completed": "eq.false",
                        "limit": "1",
                    },
                )
                if r_g.status_code == 200:
                    rows = r_g.json()
                    if rows:
                        goal = rows[0]

                # Profil pengguna
                r_p = await client.get(
                    f"{self.supabase_url}/rest/v1/users",
                    headers=headers,
                    params={
                        "id": f"eq.{user_id}",
                        "limit": "1",
                    },
                )
                if r_p.status_code == 200:
                    rows = r_p.json()
                    if rows:
                        profile = rows[0]

        except Exception as e:
            # Fallback gracefully
            pass

        return txs, budget, goal, profile


# Singleton global service
user_stats_service = UserStatsService()
