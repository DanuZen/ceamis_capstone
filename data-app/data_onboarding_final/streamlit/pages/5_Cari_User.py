"""
Halaman 5 – Cari User
Lookup user berdasarkan user_id, tampilkan ringkasan lengkap.
"""

import streamlit as st
import pandas as pd
import numpy as np
from utils.load_data import load_all
from utils.helpers import format_rupiah, format_persen, get_health_color, get_cluster_color, HEALTH_COLORS, PALETTE
from utils.charts import line_chart, radar_chart, bar_chart

st.markdown("# 🔎 Cari User")
st.markdown(
    '<p style="color:#94A3B8; margin-top:-8px;">Cari dan lihat detail profil keuangan pengguna.</p>',
    unsafe_allow_html=True,
)
st.divider()

# ── Load data ────────────────────────────────────────────────────────────
health_df, spending_df, onboarding_df = load_all()

# ── Cek ketersediaan data ────────────────────────────────────────────────
if health_df is None and spending_df is None:
    st.error("❌ Data health dan spending tidak tersedia. Tidak dapat mencari user.")
    st.stop()

# Kumpulkan semua user_id yang tersedia
all_users = set()
if health_df is not None and "user_id" in health_df.columns:
    all_users.update(health_df["user_id"].unique())
if spending_df is not None and "user_id" in spending_df.columns:
    all_users.update(spending_df["user_id"].unique())

all_users = sorted(all_users)

# ── Input ────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔍 Cari User")
    user_input = st.text_input("Masukkan User ID", placeholder="Contoh: USR0001", key="search_uid")
    st.markdown(f"<small style='color:#64748B;'>Total {len(all_users)} user tersedia</small>", unsafe_allow_html=True)

if not user_input:
    st.info("💡 Masukkan **User ID** di sidebar untuk memulai pencarian.")

    # Quick list
    with st.expander("📋 Daftar User ID (10 pertama)"):
        for uid in all_users[:10]:
            st.code(uid)
    st.stop()

# Normalisasi input
user_id = user_input.strip().upper()

# ── Cek keberadaan user ──────────────────────────────────────────────────
user_health = health_df[health_df["user_id"] == user_id] if health_df is not None and "user_id" in health_df.columns else pd.DataFrame()
user_spending = spending_df[spending_df["user_id"] == user_id] if spending_df is not None and "user_id" in spending_df.columns else pd.DataFrame()

if user_health.empty and user_spending.empty:
    st.warning(f"⚠️ User **{user_id}** tidak ditemukan dalam dataset.")
    st.stop()

# ── Header User ─────────────────────────────────────────────────────────
st.markdown(f"## 👤 Profil User: `{user_id}`")
st.divider()

# ── KPI Ringkasan ────────────────────────────────────────────────────────
k1, k2, k3, k4 = st.columns(4)

# Latest health
if not user_health.empty:
    latest = user_health.sort_values("year_month").iloc[-1]
    k1.metric("Health Label Terbaru", latest.get("health_label", "N/A"))
    k2.metric("Health Score", f"{latest.get('health_score_numeric', 0):.1f}")
    k3.metric("Income", format_rupiah(latest.get("income", 0)))
    k4.metric("Cashflow", str(latest.get("cashflow", "N/A")))
else:
    k1.metric("Health Label", "N/A")
    k2.metric("Health Score", "N/A")
    k3.metric("Income", "N/A")
    k4.metric("Cashflow", "N/A")

st.divider()

# ── Tabs ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📈 Tren Health Score", "💳 Spending Cluster", "📋 Data Lengkap"])

# ── TAB 1: Tren ──────────────────────────────────────────────────────────
with tab1:
    if not user_health.empty and "health_score_numeric" in user_health.columns:
        trend = user_health[["year_month", "health_score_numeric", "health_label"]].sort_values("year_month")

        st.markdown("##### Tren Health Score")
        fig = line_chart(trend, "year_month", "health_score_numeric", "")
        fig.update_layout(xaxis_title="Bulan", yaxis_title="Health Score", xaxis_tickangle=-45)
        # Add color bands
        fig.add_hrect(y0=0, y1=30, fillcolor="rgba(239,68,68,0.08)", line_width=0)
        fig.add_hrect(y0=30, y1=50, fillcolor="rgba(249,115,22,0.08)", line_width=0)
        fig.add_hrect(y0=50, y1=65, fillcolor="rgba(251,191,36,0.08)", line_width=0)
        fig.add_hrect(y0=65, y1=80, fillcolor="rgba(52,211,153,0.08)", line_width=0)
        fig.add_hrect(y0=80, y1=100, fillcolor="rgba(16,185,129,0.08)", line_width=0)
        st.plotly_chart(fig, use_container_width=True)

        # Radar latest
        norm_cols = [c for c in ["saving_rate_norm", "wants_ratio_norm", "impulsive_ratio_norm", "budget_adherence_norm", "dti_score_norm", "investment_rate_norm"] if c in user_health.columns]
        if norm_cols:
            st.markdown("##### Radar Profil Keuangan (Data Terbaru)")
            latest_row = user_health.sort_values("year_month").iloc[-1]
            vals = [float(latest_row.get(c, 0)) for c in norm_cols]
            cats = [c.replace("_norm", "").replace("_", " ").title() for c in norm_cols]
            hl = str(latest_row.get("health_label", "")).lower()
            color = HEALTH_COLORS.get(hl, "#6366F1")
            fill_hex = color.replace("#", "")
            r, g, b = int(fill_hex[:2], 16), int(fill_hex[2:4], 16), int(fill_hex[4:6], 16)
            fig = radar_chart(cats, vals, "", fill_color=f"rgba({r},{g},{b},0.25)", line_color=color, height=380)
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Data health score tidak tersedia untuk user ini.")

# ── TAB 2: Spending Cluster ─────────────────────────────────────────────
with tab2:
    if not user_spending.empty and "cluster_label" in user_spending.columns:
        st.markdown("##### Cluster Pengeluaran per Bulan")
        sp_sorted = user_spending[["year_month", "cluster_label"]].sort_values("year_month")

        # Visual: show a table-like display
        for _, row in sp_sorted.iterrows():
            cl = row["cluster_label"]
            color = get_cluster_color(cl)
            st.markdown(
                f'<span style="background:{color}22; color:{color}; padding:4px 12px; border-radius:6px; '
                f'border:1px solid {color}44; margin-right:8px; font-size:0.85rem;">'
                f'<strong>{row["year_month"]}</strong> → {cl}</span>',
                unsafe_allow_html=True,
            )

        st.markdown("")  # spacer

        # Financial snapshot
        fin_cols = [c for c in ["income", "expense", "saving_amount", "monthly_balance", "saving_rate", "wants_ratio", "debt_ratio"] if c in user_spending.columns]
        if fin_cols:
            st.markdown("##### Snapshot Keuangan (Rata-rata)")
            avg = user_spending[fin_cols].mean()
            metric_cols = st.columns(min(len(fin_cols), 4))
            for i, col in enumerate(fin_cols[:4]):
                val = avg[col]
                label = col.replace("_", " ").title()
                display = format_rupiah(val) if col in ["income", "expense", "saving_amount", "monthly_balance"] else format_persen(val)
                metric_cols[i].metric(label, display)

            if len(fin_cols) > 4:
                metric_cols2 = st.columns(min(len(fin_cols) - 4, 4))
                for i, col in enumerate(fin_cols[4:8]):
                    val = avg[col]
                    label = col.replace("_", " ").title()
                    display = format_persen(val)
                    metric_cols2[i].metric(label, display)
    else:
        st.info("Data spending cluster tidak tersedia untuk user ini.")

# ── TAB 3: Data Lengkap ─────────────────────────────────────────────────
with tab3:
    if not user_health.empty:
        st.markdown("##### 🏥 Riwayat Health Score")
        display_cols_h = [c for c in ["year_month", "health_label", "health_score_numeric", "income", "expense", "saving_rate", "cashflow", "budget_adherence"] if c in user_health.columns]
        st.dataframe(
            user_health[display_cols_h].sort_values("year_month", ascending=False),
            use_container_width=True,
            hide_index=True,
        )

    if not user_spending.empty:
        st.markdown("##### 💳 Riwayat Spending Cluster")
        display_cols_s = [c for c in ["year_month", "cluster_label", "health_label", "expense", "saving_rate", "wants_ratio", "impulsive_ratio"] if c in user_spending.columns]
        st.dataframe(
            user_spending[display_cols_s].sort_values("year_month", ascending=False),
            use_container_width=True,
            hide_index=True,
        )
