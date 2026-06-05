"""
Halaman 3 – Pola Pengeluaran (Spending Cluster)
Profil klaster, distribusi, hubungan dengan health, tren bulanan.
"""

import streamlit as st
import pandas as pd
import numpy as np
from utils.load_data import load_spending, check_columns
from utils.helpers import format_rupiah, format_persen, CLUSTER_COLORS, HEALTH_COLORS, PALETTE
from utils.charts import (
    donut_chart, bar_chart, line_chart, scatter_chart,
    box_chart, heatmap_chart, grouped_bar,
)

st.markdown("# 💳 Pola Pengeluaran")
st.markdown(
    '<p style="color:#94A3B8; margin-top:-8px;">Analisis clustering perilaku pengeluaran pengguna.</p>',
    unsafe_allow_html=True,
)
st.divider()

# ── Load data ────────────────────────────────────────────────────────────
df = load_spending()
if df is None:
    st.error("❌ File **spending_Cluster_dataset.csv** tidak ditemukan.")
    st.stop()

required = ["user_id", "cluster_label", "year_month"]
missing = check_columns(df, required, "Spending Cluster")
if missing:
    st.stop()

# ── Sidebar filters ─────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔍 Filter Pola Pengeluaran")

    cluster_options = sorted(df["cluster_label"].dropna().unique().tolist())
    sel_cluster = st.multiselect("Cluster Label", cluster_options, default=cluster_options, key="sp_cl")

    if "health_label" in df.columns:
        hl_options = sorted(df["health_label"].dropna().unique().tolist())
        sel_hl = st.multiselect("Health Label", hl_options, default=hl_options, key="sp_hl")
    else:
        sel_hl = None

    ym_options = sorted(df["year_month"].dropna().unique().tolist())
    sel_ym = st.select_slider(
        "Rentang Bulan", options=ym_options,
        value=(ym_options[0], ym_options[-1]), key="sp_ym",
    )

# ── Apply filters ────────────────────────────────────────────────────────
filtered = df[df["cluster_label"].isin(sel_cluster)]
if sel_hl is not None and "health_label" in filtered.columns:
    filtered = filtered[filtered["health_label"].isin(sel_hl)]
filtered = filtered[
    (filtered["year_month"] >= sel_ym[0]) & (filtered["year_month"] <= sel_ym[1])
]

if filtered.empty:
    st.warning("⚠️ Tidak ada data untuk filter yang dipilih.")
    st.stop()

# ── KPI ──────────────────────────────────────────────────────────────────
k1, k2, k3, k4 = st.columns(4)
k1.metric("Data Points", f"{len(filtered):,}")
k2.metric("Unique Users", f"{filtered['user_id'].nunique():,}")

avg_exp = filtered["expense"].mean() if "expense" in filtered.columns else 0
k3.metric("Avg Expense", format_rupiah(avg_exp))

avg_save = filtered["saving_rate"].mean() if "saving_rate" in filtered.columns else 0
k4.metric("Avg Saving Rate", format_persen(avg_save))

st.divider()

# ── Tabs ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📊 Profil Klaster", "🔗 Cluster × Health", "📈 Tren Bulanan"])

# ── TAB 1: Profil Klaster ────────────────────────────────────────────────
with tab1:
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("##### Distribusi Cluster")
        vc = filtered["cluster_label"].value_counts()
        fig = donut_chart(vc.index.tolist(), vc.values.tolist(), "", CLUSTER_COLORS, height=340)
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        st.markdown("##### Jumlah per Cluster")
        vc_df = vc.reset_index()
        vc_df.columns = ["cluster_label", "jumlah"]
        fig = bar_chart(vc_df, "cluster_label", "jumlah", "", color="cluster_label", color_map=CLUSTER_COLORS)
        fig.update_layout(showlegend=False, xaxis_title="", yaxis_title="Jumlah")
        st.plotly_chart(fig, use_container_width=True)

    # Profil finansial per klaster
    st.markdown("##### Profil Finansial per Klaster")
    fin_cols = [c for c in ["income", "expense", "saving_amount", "monthly_balance"] if c in filtered.columns]
    if fin_cols:
        prof = filtered.groupby("cluster_label")[fin_cols].mean().reset_index()
        prof_melted = prof.melt(id_vars="cluster_label", var_name="metrik", value_name="nilai")
        prof_melted["metrik"] = prof_melted["metrik"].str.replace("_", " ").str.title()
        fig = grouped_bar(prof_melted, "metrik", "nilai", "cluster_label", "", CLUSTER_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata (Rp)")
        st.plotly_chart(fig, use_container_width=True)

    # Rasio per klaster
    st.markdown("##### Rasio Keuangan per Klaster")
    ratio_cols = [c for c in ["saving_rate", "needs_ratio", "wants_ratio", "debt_ratio", "impulsive_ratio", "investment_rate"] if c in filtered.columns]
    if ratio_cols:
        ratio = filtered.groupby("cluster_label")[ratio_cols].mean().reset_index()
        ratio_melted = ratio.melt(id_vars="cluster_label", var_name="metrik", value_name="nilai")
        ratio_melted["metrik"] = ratio_melted["metrik"].str.replace("_", " ").str.title()
        fig = grouped_bar(ratio_melted, "metrik", "nilai", "cluster_label", "", CLUSTER_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata")
        st.plotly_chart(fig, use_container_width=True)

# ── TAB 2: Cluster × Health ─────────────────────────────────────────────
with tab2:
    if "health_label" in filtered.columns:
        st.markdown("##### Heatmap: Cluster × Health Label")
        ct = pd.crosstab(filtered["cluster_label"], filtered["health_label"])
        fig = heatmap_chart(
            z=ct.values.tolist(),
            x=ct.columns.tolist(),
            y=ct.index.tolist(),
            title="",
            height=380,
            colorscale="Viridis",
        )
        fig.update_layout(xaxis_title="Health Label", yaxis_title="Cluster")
        st.plotly_chart(fig, use_container_width=True)

        st.markdown("##### Distribusi Health per Cluster (Stacked)")
        ct_norm = pd.crosstab(filtered["cluster_label"], filtered["health_label"], normalize="index")
        ct_melted = ct_norm.reset_index().melt(id_vars="cluster_label", var_name="health_label", value_name="proporsi")
        fig = bar_chart(
            ct_melted, "cluster_label", "proporsi", "",
            color="health_label", color_map=HEALTH_COLORS, barmode="stack", text_auto=False,
        )
        fig.update_layout(xaxis_title="Cluster", yaxis_title="Proporsi", yaxis_tickformat=".0%")
        st.plotly_chart(fig, use_container_width=True)

        st.markdown("##### Box Plot: Health Score per Cluster")
        if "health_score_numeric" in filtered.columns:
            fig = box_chart(filtered, "cluster_label", "health_score_numeric", "", color="cluster_label", color_map=CLUSTER_COLORS)
            fig.update_layout(xaxis_title="Cluster", yaxis_title="Health Score", showlegend=False)
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Kolom health_label tidak tersedia di dataset spending.")

# ── TAB 3: Tren Bulanan ─────────────────────────────────────────────────
with tab3:
    st.markdown("##### Tren Jumlah Observasi per Cluster")
    trend = filtered.groupby(["year_month", "cluster_label"]).size().reset_index(name="count")
    trend = trend.sort_values("year_month")
    fig = line_chart(trend, "year_month", "count", "", color="cluster_label", color_map=CLUSTER_COLORS)
    fig.update_layout(xaxis_title="Bulan", yaxis_title="Jumlah", xaxis_tickangle=-45)
    st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Tren Avg Expense per Cluster")
    if "expense" in filtered.columns:
        trend_exp = filtered.groupby(["year_month", "cluster_label"])["expense"].mean().reset_index()
        trend_exp = trend_exp.sort_values("year_month")
        fig = line_chart(trend_exp, "year_month", "expense", "", color="cluster_label", color_map=CLUSTER_COLORS)
        fig.update_layout(xaxis_title="Bulan", yaxis_title="Avg Expense (Rp)", xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Tren Avg Saving Rate per Cluster")
    if "saving_rate" in filtered.columns:
        trend_save = filtered.groupby(["year_month", "cluster_label"])["saving_rate"].mean().reset_index()
        trend_save = trend_save.sort_values("year_month")
        fig = line_chart(trend_save, "year_month", "saving_rate", "", color="cluster_label", color_map=CLUSTER_COLORS)
        fig.update_layout(xaxis_title="Bulan", yaxis_title="Avg Saving Rate", xaxis_tickangle=-45)
        st.plotly_chart(fig, use_container_width=True)
