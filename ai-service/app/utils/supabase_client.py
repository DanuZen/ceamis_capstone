# app/utils/supabase_client.py
"""
Supabase client untuk AI Service (Fase 2).
Menggunakan Service Role Key agar bisa read data user tanpa JWT Auth.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SERVICE_KEY  = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

_HEADERS = {
    "apikey":        SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type":  "application/json",
}


async def fetch_user_context(user_id: str) -> dict:
    """
    Ambil data keuangan user dari Supabase berdasarkan user_id.
    Menggabungkan data dari:
    - user_profiles  → nama, health_score, risk_profile, streak, level
    - transactions   → income & expense bulan ini → saving_rate real
    - planning       → active goals (nama + target)
    - warnings       → warning aktif
    - debt_records   → total hutang aktif
    
    Return dict yang siap dipakai oleh prompt_builder.build_system_prompt().
    Jika fetch gagal → return dict kosong (fallback ke financial_context dari frontend).
    """
    if not user_id or user_id in ("guest", "") or not SUPABASE_URL or not SERVICE_KEY:
        return {}

    ctx: dict = {}

    async with httpx.AsyncClient(timeout=5.0) as client:

        # ── 1. User Profile ───────────────────────────────────────────────────
        try:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/user_profiles",
                headers=_HEADERS,
                params={"id": f"eq.{user_id}", "select": "name,health_score,risk_profile,streak,level,label"},
            )
            if r.status_code == 200:
                rows = r.json()
                if rows:
                    p = rows[0]
                    ctx["username"]     = p.get("name", "Bestie")
                    ctx["health_score"] = p.get("health_score")
                    ctx["health_label"] = p.get("label", "")
                    ctx["risk_profile"] = p.get("risk_profile", "belum diketahui")
                    ctx["streak_count"] = p.get("streak", 0)
        except Exception as e:
            print(f"[WARN] Supabase user_profiles fetch gagal: {e}")

        # ── 2. Transactions bulan ini → saving rate ───────────────────────────
        try:
            from datetime import datetime, timezone
            now   = datetime.now(timezone.utc)
            start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0).isoformat()

            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/transactions",
                headers=_HEADERS,
                params={
                    "user_id":    f"eq.{user_id}",
                    "created_at": f"gte.{start}",
                    "select":     "amount,type,category,tag",
                    "limit":      "200",
                },
            )
            if r.status_code == 200:
                txs   = r.json()
                income  = sum(t["amount"] for t in txs if t.get("type") == "pemasukan")
                expense = sum(t["amount"] for t in txs if t.get("type") == "pengeluaran")
                wants   = sum(t["amount"] for t in txs if t.get("tag") == "wants")

                ctx["income_avg"]   = income
                ctx["saving_rate"]  = round((income - expense) / income, 4) if income > 0 else 0
                ctx["wants_ratio"]  = round(wants / income, 4) if income > 0 else 0

                # Category breakdown untuk top cuts
                breakdown: dict[str, float] = {}
                for t in txs:
                    if t.get("type") == "pengeluaran":
                        cat = t.get("category", "Lainnya")
                        breakdown[cat] = breakdown.get(cat, 0) + t["amount"]
                if breakdown:
                    top3 = sorted(breakdown, key=breakdown.get, reverse=True)[:3]  # type: ignore[arg-type]
                    ctx["top_cut_categories"] = top3
        except Exception as e:
            print(f"[WARN] Supabase transactions fetch gagal: {e}")

        # ── 3. Planning (active goals) ────────────────────────────────────────
        try:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/planning",
                headers=_HEADERS,
                params={
                    "user_id": f"eq.{user_id}",
                    "select":  "goal_name,target_amount,current_amount,deadline",
                    "limit":   "5",
                },
            )
            if r.status_code == 200:
                goals_raw = r.json()
                if goals_raw:
                    from datetime import date
                    today = date.today()
                    goals_out = []
                    for g in goals_raw:
                        try:
                            deadline = date.fromisoformat(g["deadline"][:10])
                            months_left = max(0, (deadline.year - today.year) * 12 + (deadline.month - today.month))
                        except Exception:
                            months_left = 0
                        goals_out.append({
                            "goal_name":     g.get("goal_name", "Goal"),
                            "target_amount": g.get("target_amount", 0),
                            "months_left":   months_left,
                        })
                    ctx["active_goals"] = goals_out
        except Exception as e:
            print(f"[WARN] Supabase planning fetch gagal: {e}")

        # ── 4. Debt records → DTI proxy ───────────────────────────────────────
        try:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/debt_records",
                headers=_HEADERS,
                params={
                    "user_id": f"eq.{user_id}",
                    "select":  "monthly_payment,status",
                },
            )
            if r.status_code == 200:
                debts = r.json()
                active_monthly = sum(
                    d.get("monthly_payment", 0)
                    for d in debts
                    if d.get("status", "active") == "active"
                )
                income = ctx.get("income_avg", 0)
                ctx["dti_ratio"] = round(active_monthly / income, 4) if income > 0 else 0
        except Exception as e:
            print(f"[WARN] Supabase debt_records fetch gagal: {e}")

    return ctx
