"""
Halaman 4 – Profil Risiko (dari data onboarding)
Demografi, keuangan, investasi, behavioral score.
"""

import streamlit as st
import pandas as pd
import numpy as np
from utils.load_data import load_onboarding, check_columns
from utils.helpers import format_rupiah, format_persen, RISK_COLORS, PALETTE
from utils.charts import (
    donut_chart, bar_chart, box_chart, heatmap_chart,
    scatter_chart, histogram_chart, grouped_bar, radar_chart,
)

st.markdown("# 🎯 Profil Risiko")
st.markdown(
    '<p style="color:#94A3B8; margin-top:-8px;">Analisis profil demografi, keuangan, dan toleransi risiko pengguna.</p>',
    unsafe_allow_html=True,
)
st.divider()

# ── Load data ────────────────────────────────────────────────────────────
df = load_onboarding()
if df is None:
    st.error("❌ File **processed_onboarding.csv** tidak ditemukan.")
    st.stop()

required = ["risk_label"]
missing = check_columns(df, required, "Onboarding")
if missing:
    st.stop()

# ── Sidebar filters ─────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 🔍 Filter Profil Risiko")

    if "occupation" in df.columns:
        occ_options = sorted(df["occupation"].dropna().unique().tolist())
        sel_occ = st.multiselect("Occupation", occ_options, default=occ_options, key="rp_occ")
    else:
        sel_occ = None

    if "city_tier" in df.columns:
        ct_options = sorted(df["city_tier"].dropna().unique().tolist())
        sel_ct = st.multiselect("City Tier", ct_options, default=ct_options, key="rp_ct")
    else:
        sel_ct = None

    risk_options = sorted(df["risk_label"].dropna().unique().tolist())
    sel_risk = st.multiselect("Risk Label", risk_options, default=risk_options, key="rp_rl")

    if "tujuan_keuangan" in df.columns:
        tj_options = sorted(df["tujuan_keuangan"].dropna().unique().tolist())
        sel_tj = st.multiselect("Tujuan Keuangan", tj_options, default=tj_options, key="rp_tj")
    else:
        sel_tj = None

# ── Apply filters ────────────────────────────────────────────────────────
filtered = df[df["risk_label"].isin(sel_risk)]
if sel_occ is not None and "occupation" in filtered.columns:
    filtered = filtered[filtered["occupation"].isin(sel_occ)]
if sel_ct is not None and "city_tier" in filtered.columns:
    filtered = filtered[filtered["city_tier"].isin(sel_ct)]
if sel_tj is not None and "tujuan_keuangan" in filtered.columns:
    filtered = filtered[filtered["tujuan_keuangan"].isin(sel_tj)]

if filtered.empty:
    st.warning("⚠️ Tidak ada data untuk filter yang dipilih.")
    st.stop()

# ── KPI ──────────────────────────────────────────────────────────────────
k1, k2, k3, k4 = st.columns(4)
k1.metric("Total Respondents", f"{len(filtered):,}")

avg_income = filtered["penghasilan_bulanan"].mean() if "penghasilan_bulanan" in filtered.columns else 0
k2.metric("Avg Penghasilan", format_rupiah(avg_income))

avg_ceamis = filtered["ceamis_score"].mean() if "ceamis_score" in filtered.columns else 0
k3.metric("Avg CEAMIS Score", f"{avg_ceamis:.1f}")

avg_age = filtered["age"].mean() if "age" in filtered.columns else 0
k4.metric("Avg Usia", f"{avg_age:.0f} thn")

st.divider()

# ── Tabs ─────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4 = st.tabs(["👥 Demografi", "💰 Keuangan", "📈 Investasi & Risk", "🧠 Behavioral"])

# ── TAB 1: Demografi ─────────────────────────────────────────────────────
with tab1:
    c1, c2 = st.columns(2)

    with c1:
        st.markdown("##### Distribusi Risk Label")
        vc = filtered["risk_label"].value_counts()
        fig = donut_chart(vc.index.tolist(), vc.values.tolist(), "", RISK_COLORS, height=320)
        st.plotly_chart(fig, use_container_width=True)

    with c2:
        st.markdown("##### Distribusi Usia")
        if "age" in filtered.columns:
            fig = histogram_chart(filtered, "age", "", color="risk_label", color_map=RISK_COLORS, nbins=20)
            fig.update_layout(xaxis_title="Usia", yaxis_title="Frekuensi")
            st.plotly_chart(fig, use_container_width=True)

    c3, c4 = st.columns(2)
    with c3:
        if "occupation" in filtered.columns:
            st.markdown("##### Occupation × Risk")
            ct = pd.crosstab(filtered["occupation"], filtered["risk_label"])
            ct_melted = ct.reset_index().melt(id_vars="occupation", var_name="risk_label", value_name="count")
            fig = grouped_bar(ct_melted, "occupation", "count", "risk_label", "", RISK_COLORS)
            fig.update_layout(xaxis_title="", yaxis_title="Jumlah")
            st.plotly_chart(fig, use_container_width=True)

    with c4:
        if "city_tier" in filtered.columns:
            st.markdown("##### City Tier × Risk")
            ct2 = pd.crosstab(filtered["city_tier"], filtered["risk_label"])
            ct2_melted = ct2.reset_index().melt(id_vars="city_tier", var_name="risk_label", value_name="count")
            fig = grouped_bar(ct2_melted, "city_tier", "count", "risk_label", "", RISK_COLORS)
            fig.update_layout(xaxis_title="", yaxis_title="Jumlah")
            st.plotly_chart(fig, use_container_width=True)

# ── TAB 2: Keuangan ─────────────────────────────────────────────────────
with tab2:
    fin_cols = [c for c in ["penghasilan_bulanan", "pengeluaran_tetap", "pengeluaran_variabel", "total_pengeluaran", "jumlah_tabungan_bulan"] if c in filtered.columns]

    if fin_cols:
        st.markdown("##### Rata-rata Keuangan per Risk Label")
        fin = filtered.groupby("risk_label")[fin_cols].mean().reset_index()
        fin_melted = fin.melt(id_vars="risk_label", var_name="metrik", value_name="nilai")
        fin_melted["metrik"] = fin_melted["metrik"].str.replace("_", " ").str.title()
        fig = grouped_bar(fin_melted, "metrik", "nilai", "risk_label", "", RISK_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata (Rp)", xaxis_tickangle=-20)
        st.plotly_chart(fig, use_container_width=True)

    ratio_cols = [c for c in ["saving_rate", "dti_ratio", "expense_ratio", "disposable_ratio"] if c in filtered.columns]
    if ratio_cols:
        st.markdown("##### Rasio Keuangan per Risk Label")
        ratio = filtered.groupby("risk_label")[ratio_cols].mean().reset_index()
        ratio_melted = ratio.melt(id_vars="risk_label", var_name="metrik", value_name="nilai")
        ratio_melted["metrik"] = ratio_melted["metrik"].str.replace("_", " ").str.title()
        fig = grouped_bar(ratio_melted, "metrik", "nilai", "risk_label", "", RISK_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata")
        st.plotly_chart(fig, use_container_width=True)

    if "ceamis_score" in filtered.columns:
        c1, c2 = st.columns(2)
        with c1:
            st.markdown("##### Box Plot: CEAMIS Score per Risk")
            fig = box_chart(filtered, "risk_label", "ceamis_score", "", color="risk_label", color_map=RISK_COLORS)
            fig.update_layout(xaxis_title="Risk Label", yaxis_title="CEAMIS Score", showlegend=False)
            st.plotly_chart(fig, use_container_width=True)
        with c2:
            st.markdown("##### Distribusi CEAMIS Score")
            fig = histogram_chart(filtered, "ceamis_score", "", color="risk_label", color_map=RISK_COLORS)
            fig.update_layout(xaxis_title="CEAMIS Score", yaxis_title="Frekuensi")
            st.plotly_chart(fig, use_container_width=True)

# ── TAB 3: Investasi & Risk ─────────────────────────────────────────────
with tab3:
    c1, c2 = st.columns(2)

    with c1:
        if "tujuan_keuangan" in filtered.columns:
            st.markdown("##### Tujuan Keuangan × Risk")
            ct = pd.crosstab(filtered["tujuan_keuangan"], filtered["risk_label"])
            ct_melted = ct.reset_index().melt(id_vars="tujuan_keuangan", var_name="risk_label", value_name="count")
            fig = grouped_bar(ct_melted, "tujuan_keuangan", "count", "risk_label", "", RISK_COLORS)
            fig.update_layout(xaxis_title="", yaxis_title="Jumlah")
            st.plotly_chart(fig, use_container_width=True)

    with c2:
        if "toleransi_rugi" in filtered.columns:
            st.markdown("##### Toleransi Rugi × Risk")
            ct2 = pd.crosstab(filtered["toleransi_rugi"], filtered["risk_label"])
            ct2_melted = ct2.reset_index().melt(id_vars="toleransi_rugi", var_name="risk_label", value_name="count")
            fig = grouped_bar(ct2_melted, "toleransi_rugi", "count", "risk_label", "", RISK_COLORS)
            fig.update_layout(xaxis_title="", yaxis_title="Jumlah")
            st.plotly_chart(fig, use_container_width=True)

    if "jenis_investasi" in filtered.columns:
        st.markdown("##### Jenis Investasi × Risk")
        ct3 = pd.crosstab(filtered["jenis_investasi"], filtered["risk_label"])
        ct3_melted = ct3.reset_index().melt(id_vars="jenis_investasi", var_name="risk_label", value_name="count")
        fig = grouped_bar(ct3_melted, "jenis_investasi", "count", "risk_label", "", RISK_COLORS)
        fig.update_layout(xaxis_title="", yaxis_title="Jumlah")
        st.plotly_chart(fig, use_container_width=True)

    # Heatmap Risk × Tujuan
    if "tujuan_keuangan" in filtered.columns:
        st.markdown("##### Heatmap: Risk × Tujuan Keuangan")
        ht = pd.crosstab(filtered["risk_label"], filtered["tujuan_keuangan"])
        fig = heatmap_chart(ht.values.tolist(), ht.columns.tolist(), ht.index.tolist(), "", colorscale="Viridis")
        fig.update_layout(xaxis_title="Tujuan Keuangan", yaxis_title="Risk Label")
        st.plotly_chart(fig, use_container_width=True)

# ── TAB 4: Behavioral ───────────────────────────────────────────────────
with tab4:
    beh_cols = [c for c in ["savehabit", "selfcontrol_1", "scfhorizon", "fingoals"] if c in filtered.columns]

    if beh_cols:
        st.markdown("##### Rata-rata Skor Behavioral per Risk Label")
        beh = filtered.groupby("risk_label")[beh_cols].mean().reset_index()
        beh_melted = beh.melt(id_vars="risk_label", var_name="metrik", value_name="nilai")
        beh_melted["metrik"] = beh_melted["metrik"].str.upper()
        fig = grouped_bar(beh_melted, "metrik", "nilai", "risk_label", "", RISK_COLORS, text_auto=False)
        fig.update_layout(xaxis_title="", yaxis_title="Rata-rata Skor")
        st.plotly_chart(fig, use_container_width=True)

        # Radar per risk label
        st.markdown("##### Radar Profil Behavioral per Risk Label")
        sel_risk_radar = st.selectbox("Pilih Risk Label", risk_options, key="beh_radar")
        label_data = filtered[filtered["risk_label"] == sel_risk_radar]
        if not label_data.empty:
            means = label_data[beh_cols].mean().tolist()
            cats = [c.upper() for c in beh_cols]
            line_color = RISK_COLORS.get(sel_risk_radar.strip().lower(), "#6366F1")
            fill_hex = line_color.replace("#", "")
            r, g, b = int(fill_hex[:2], 16), int(fill_hex[2:4], 16), int(fill_hex[4:6], 16)
            fig = radar_chart(cats, means, "", fill_color=f"rgba({r},{g},{b},0.25)", line_color=line_color)
            st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("Kolom behavioral score tidak tersedia.")
