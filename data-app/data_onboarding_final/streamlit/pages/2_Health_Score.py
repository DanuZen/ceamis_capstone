"""
Halaman 2 – Health Score Analysis
Filter, tren, breakdown, perbandingan antar label, scatter, box, radar.
"""

import streamlit as st
import pandas as pd
import numpy as np
from utils.load_data import load_health, check_columns
from utils.helpers import format_rupiah, format_persen, HEALTH_COLORS, PALETTE
from utils.charts import (
    donut_chart, bar_chart, line_chart, scatter_chart,
    box_chart, radar_chart, histogram_chart,
)

st.markdown("# 🏥 Health Score Analysis")
st.markdown(
    '<p style="color:#94A3B8; margin-top:-8px;">Analisis mendalam klasifikasi kesehatan keuangan pengguna.</p>',
    unsafe_allow_html=True,
)
st.divider()

# ── Load data ────────────────────────────────────────────────────────────
df = load_health()
if df is None:
    st.error("❌ File **health_score_classification_dataset.csv** tidak ditemukan.")
    st.stop()

required = ["user_id", "health_label", "health_score_numeric", "year_month"]
missing = check_columns(df, required, "Health Score")
if missing:
    st.stop()

# ── Sidebar filters ─────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔍 Filter Health Score")

    # Health label
    health_options = sorted(df["health_label"].dropna().unique().tolist())
    sel_health = st.multiselect("Health Label", health_options, default=health_options, key="hs_label")

    # Cashflow
    if "cashflow" in df.columns:
        cf_options = sorted(df["cashflow"].dropna().unique().tolist())
        sel_cashflow = st.multiselect("Cashflow", cf_options, default=cf_options, key="hs_cf")
    else:
        sel_cashflow = None

    # Year Month
    ym_options = sorted(df["year_month"].dropna().unique().tolist())
    sel_ym = st.select_slider(
        "Rentang Bulan",
        options=ym_options,
        value=(ym_options[0], ym_options[-1]),
        key="hs_ym",
    )

# ── Apply filters ────────────────────────────────────────────────────────
filtered = df[df["health_label"].isin(sel_health)]
if sel_cashflow is not None and "cashflow" in filtered.columns:
    filtered = filtered[filtered["cashflow"].isin(sel_cashflow)]
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
k3.metric("Avg Score", f"{filtered['health_score_numeric'].mean():.1f}")
median_score = filtered["health_score_numeric"].median()
k4.metric("Median Score", f"{median_score:.1f}")

st.divider()

# ── Tabs ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs(["📈 Tren & Distribusi", "🔬 Breakdown Komponen", "📊 Perbandingan Label", "🕸️ Radar Profile"])

# ── TAB 1: Tren & Distribusi ─────────────────────────────────────────────
with tab1:
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("##### Tren Rata-rata Health Score")
        trend = (
            filtered.groupby("year_month")["health_score_numeric"]
            .mean()
            .reset_index()
            .sort_values("year_month")
        )
        fig = line_chart(trend, "year_month", "health_score_numeric", "")
        fig.update_layout(xaxis_title="Bulan", yaxis_title="Avg Score")
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        st.markdown("##### Distribusi Health Score")
        fig = histogram_chart(filtered, "health_score_numeric", "", color="health_label", color_map=HEALTH_COLORS)
        fig.update_layout(xaxis_title="Health Score", yaxis_title="Frekuensi")
        st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Distribusi Health Label per Bulan")
    cross = pd.crosstab(filtered["year_month"], filtered["health_label"]).reset_index()
    cross_melted = cross.melt(id_vars="year_month", var_name="health_label", value_name="count")
    fig = bar_chart(
        cross_melted, "year_month", "count", "",
        color="health_label", color_map=HEALTH_COLORS, barmode="stack", text_auto=False,
    )
    fig.update_layout(xaxis_title="Bulan", yaxis_title="Jumlah", xaxis_tickangle=-45)
    st.plotly_chart(fig, use_container_width=True)

# ── TAB 2: Breakdown Komponen ────────────────────────────────────────────
with tab2:
    score_cols = [c for c in ["saving_rate", "wants_ratio", "impulsive_ratio", "budget_adherence", "dti_score", "investment_rate"] if c in filtered.columns]
    norm_cols = [c for c in ["saving_rate_norm", "wants_ratio_norm", "impulsive_ratio_norm", "budget_adherence_norm", "dti_score_norm", "investment_rate_norm"] if c in filtered.columns]

    if norm_cols:
        st.markdown("##### Rata-rata Komponen Score (Normalized) per Label")
        comp = filtered.groupby("health_label")[norm_cols].mean().reset_index()
        comp_melted = comp.melt(id_vars="health_label", var_name="komponen", value_name="nilai")
        comp_melted["komponen"] = comp_melted["komponen"].str.replace("_norm", "").str.replace("_", " ").str.title()
        fig = bar_chart(comp_melted, "komponen", "nilai", "", color="health_label", color_map=HEALTH_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="Komponen", yaxis_title="Nilai Rata-rata", xaxis_tickangle=-30)
        st.plotly_chart(fig, use_container_width=True)

    if score_cols:
        st.markdown("##### Scatter: Saving Rate vs Health Score")
        if "saving_rate" in filtered.columns:
            fig = scatter_chart(filtered, "saving_rate", "health_score_numeric", "", color="health_label", color_map=HEALTH_COLORS)
            fig.update_layout(xaxis_title="Saving Rate", yaxis_title="Health Score")
            st.plotly_chart(fig, use_container_width=True)

# ── TAB 3: Perbandingan Label ────────────────────────────────────────────
with tab3:
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("##### Box Plot: Score per Label")
        fig = box_chart(filtered, "health_label", "health_score_numeric", "", color="health_label", color_map=HEALTH_COLORS)
        fig.update_layout(xaxis_title="Health Label", yaxis_title="Health Score", showlegend=False)
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        st.markdown("##### Avg Income per Label")
        if "income" in filtered.columns:
            inc = filtered.groupby("health_label")["income"].mean().reset_index().sort_values("income", ascending=True)
            fig = bar_chart(inc, "income", "health_label", "", orientation="h", text_auto=False)
            fig.update_layout(xaxis_title="Avg Income (Rp)", yaxis_title="")
            st.plotly_chart(fig, use_container_width=True)

    st.markdown("##### Perbandingan Metrik Keuangan per Label")
    compare_cols = [c for c in ["saving_rate", "wants_ratio", "debt_ratio", "investment_rate", "budget_adherence"] if c in filtered.columns]
    if compare_cols:
        comp2 = filtered.groupby("health_label")[compare_cols].mean().reset_index()
        comp2_melted = comp2.melt(id_vars="health_label", var_name="metrik", value_name="nilai")
        comp2_melted["metrik"] = comp2_melted["metrik"].str.replace("_", " ").str.title()
        fig = bar_chart(comp2_melted, "metrik", "nilai", "", color="health_label", color_map=HEALTH_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata")
        st.plotly_chart(fig, use_container_width=True)

# ── TAB 4: Radar Profile ────────────────────────────────────────────────
with tab4:
    st.markdown("##### Radar Profil per Health Label")
    radar_cols = [c for c in ["saving_rate_norm", "wants_ratio_norm", "impulsive_ratio_norm", "budget_adherence_norm", "dti_score_norm", "investment_rate_norm"] if c in filtered.columns]

    if radar_cols:
        sel_label = st.selectbox("Pilih Health Label", health_options, key="radar_sel")
        label_data = filtered[filtered["health_label"] == sel_label]

        if not label_data.empty:
            means = label_data[radar_cols].mean().tolist()
            cats = [c.replace("_norm", "").replace("_", " ").title() for c in radar_cols]
            color_key = sel_label.strip().lower()
            line_color = HEALTH_COLORS.get(color_key, "#6366F1")
            fill_color = line_color.replace("#", "")
            r, g, b = int(fill_color[:2], 16), int(fill_color[2:4], 16), int(fill_color[4:6], 16)
            fig = radar_chart(cats, means, "", fill_color=f"rgba({r},{g},{b},0.25)", line_color=line_color)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("Tidak ada data untuk label ini.")
    else:
        st.info("Kolom normalized tidak tersedia untuk radar chart.")
