"""
Halaman 1 – Overview
KPI ringkas, distribusi health/cluster/risk, insight otomatis.
"""

import streamlit as st
import pandas as pd
from utils.load_data import load_all, check_columns
from utils.helpers import (
    format_rupiah, format_number, format_persen,
    HEALTH_COLORS, CLUSTER_COLORS, RISK_COLORS,
)
from utils.charts import donut_chart, bar_chart

st.markdown("# 📊 Overview")
st.markdown(
    '<p style="color:#94A3B8; margin-top:-8px;">Ringkasan kondisi keuangan seluruh pengguna.</p>',
    unsafe_allow_html=True,
)
st.divider()

# ── Load data ────────────────────────────────────────────────────────────
health_df, spending_df, onboarding_df = load_all()

# ── KPI Cards ────────────────────────────────────────────────────────────
st.subheader("📌 Metrik Utama")

kpi_cols = st.columns(5)

# Total unique users (from health_df)
total_users = 0
if health_df is not None and "user_id" in health_df.columns:
    total_users = health_df["user_id"].nunique()
kpi_cols[0].metric("Total User", f"{total_users:,}")

# Rata-rata health score
avg_health = 0
if health_df is not None and "health_score_numeric" in health_df.columns:
    avg_health = health_df["health_score_numeric"].mean()
kpi_cols[1].metric("Avg Health Score", f"{avg_health:.1f}")

# Rata-rata income
avg_income = 0
if health_df is not None and "income" in health_df.columns:
    avg_income = health_df["income"].mean()
kpi_cols[2].metric("Avg Income", format_rupiah(avg_income))

# Rata-rata saving rate
avg_saving = 0
if health_df is not None and "saving_rate" in health_df.columns:
    avg_saving = health_df["saving_rate"].mean()
kpi_cols[3].metric("Avg Saving Rate", format_persen(avg_saving))

# Total respondents onboarding
total_onboarding = 0
if onboarding_df is not None:
    total_onboarding = len(onboarding_df)
kpi_cols[4].metric("Respondents", f"{total_onboarding:,}")

st.divider()

# ── Distribusi utama ─────────────────────────────────────────────────────
st.subheader("📈 Distribusi Utama")

dist_cols = st.columns(3)

# 1. Health Label
with dist_cols[0]:
    st.markdown("##### 🏥 Health Label")
    if health_df is not None and "health_label" in health_df.columns:
        vc = health_df["health_label"].value_counts()
        fig = donut_chart(
            labels=vc.index.tolist(),
            values=vc.values.tolist(),
            title="",
            color_map=HEALTH_COLORS,
            height=320,
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Data health label tidak tersedia.")

# 2. Cluster Pengeluaran
with dist_cols[1]:
    st.markdown("##### 💳 Cluster Pengeluaran")
    if spending_df is not None and "cluster_label" in spending_df.columns:
        vc = spending_df["cluster_label"].value_counts()
        fig = donut_chart(
            labels=vc.index.tolist(),
            values=vc.values.tolist(),
            title="",
            color_map=CLUSTER_COLORS,
            height=320,
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Data cluster pengeluaran tidak tersedia.")

# 3. Risk Profile
with dist_cols[2]:
    st.markdown("##### 🎯 Risk Profile")
    if onboarding_df is not None and "risk_label" in onboarding_df.columns:
        vc = onboarding_df["risk_label"].value_counts()
        fig = donut_chart(
            labels=vc.index.tolist(),
            values=vc.values.tolist(),
            title="",
            color_map=RISK_COLORS,
            height=320,
        )
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Data risk profile tidak tersedia.")

st.divider()

# ── Insight Otomatis ─────────────────────────────────────────────────────
st.subheader("💡 Insight Otomatis")

insights = []

if health_df is not None and "health_label" in health_df.columns:
    dominant = health_df["health_label"].value_counts().idxmax()
    pct = health_df["health_label"].value_counts(normalize=True).iloc[0] * 100
    insights.append(f"🏥 Label kesehatan paling dominan: **{dominant}** ({pct:.1f}% dari seluruh data).")

    if "health_score_numeric" in health_df.columns:
        kritis = health_df[health_df["health_label"].str.lower() == "kritis"]
        if len(kritis) > 0:
            pct_kritis = len(kritis) / len(health_df) * 100
            insights.append(f"⚠️ Sebanyak **{pct_kritis:.1f}%** observasi berada di status **Kritis**.")

if spending_df is not None and "cluster_label" in spending_df.columns:
    dominant_cl = spending_df["cluster_label"].value_counts().idxmax()
    pct_cl = spending_df["cluster_label"].value_counts(normalize=True).iloc[0] * 100
    insights.append(f"💳 Cluster pengeluaran terbesar: **{dominant_cl}** ({pct_cl:.1f}%).")

if onboarding_df is not None and "risk_label" in onboarding_df.columns:
    dominant_risk = onboarding_df["risk_label"].value_counts().idxmax()
    pct_risk = onboarding_df["risk_label"].value_counts(normalize=True).iloc[0] * 100
    insights.append(f"🎯 Profil risiko mayoritas: **{dominant_risk}** ({pct_risk:.1f}%).")

if health_df is not None and "cashflow" in health_df.columns:
    positif_pct = (health_df["cashflow"].str.lower() == "positif").mean() * 100
    insights.append(f"{'✅' if positif_pct > 50 else '❌'} Cashflow positif: **{positif_pct:.1f}%** dari seluruh data.")

if insights:
    for ins in insights:
        st.markdown(ins)
else:
    st.info("Tidak ada data yang tersedia untuk menghasilkan insight.")
