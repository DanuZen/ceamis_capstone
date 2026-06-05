"""
Reusable chart builders menggunakan Plotly.
Semua chart sudah di-style sesuai tema dashboard.
"""

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import numpy as np
from utils.helpers import PALETTE, HEALTH_COLORS, CLUSTER_COLORS, RISK_COLORS

# ── Layout default ───────────────────────────────────────────────────────

_LAYOUT_DEFAULTS = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Inter, sans-serif", color="#E2E8F0", size=12),
    margin=dict(l=40, r=20, t=50, b=40),
    legend=dict(
        bgcolor="rgba(0,0,0,0)",
        font=dict(size=11, color="#CBD5E1"),
    ),
    hoverlabel=dict(
        bgcolor="#1E293B",
        font_size=12,
        font_family="Inter, sans-serif",
        font_color="#E2E8F0",
    ),
    xaxis=dict(gridcolor="rgba(148,163,184,0.1)", zerolinecolor="rgba(148,163,184,0.15)"),
    yaxis=dict(gridcolor="rgba(148,163,184,0.1)", zerolinecolor="rgba(148,163,184,0.15)"),
)


def _apply_layout(fig, title: str = "", height: int = 400, **kwargs):
    """Apply default layout ke figure."""
    layout = {**_LAYOUT_DEFAULTS, "title": dict(text=title, font=dict(size=16, color="#F1F5F9")), "height": height}
    layout.update(kwargs)
    fig.update_layout(**layout)
    return fig


# ── Pie / Donut ──────────────────────────────────────────────────────────

def donut_chart(
    labels: list,
    values: list,
    title: str = "",
    color_map: dict | None = None,
    height: int = 350,
) -> go.Figure:
    """Donut chart dengan warna kustom."""
    colors = [color_map.get(str(l).strip().lower(), "#94A3B8") for l in labels] if color_map else PALETTE[: len(labels)]
    fig = go.Figure(
        go.Pie(
            labels=labels,
            values=values,
            hole=0.55,
            marker=dict(colors=colors, line=dict(color="#0F172A", width=2)),
            textinfo="percent+label",
            textfont=dict(size=11, color="#F1F5F9"),
            hovertemplate="<b>%{label}</b><br>Jumlah: %{value:,.0f}<br>Persentase: %{percent}<extra></extra>",
        )
    )
    return _apply_layout(fig, title, height)


# ── Bar chart ────────────────────────────────────────────────────────────

def bar_chart(
    df: pd.DataFrame,
    x: str,
    y: str,
    title: str = "",
    color: str | None = None,
    color_map: dict | None = None,
    orientation: str = "v",
    height: int = 400,
    text_auto: bool = True,
    barmode: str = "group",
) -> go.Figure:
    """Bar chart interaktif."""
    kwargs = dict(
        data_frame=df, x=x, y=y, title="", orientation=orientation,
        color_discrete_sequence=PALETTE, text_auto=text_auto,
    )
    if color:
        kwargs["color"] = color
    if color_map:
        kwargs["color_discrete_map"] = color_map
    kwargs["barmode"] = barmode
    fig = px.bar(**kwargs)
    fig.update_traces(
        marker_line_width=0,
        textfont_size=10,
        textposition="outside" if orientation == "v" else "auto",
    )
    return _apply_layout(fig, title, height)


# ── Line chart ───────────────────────────────────────────────────────────

def line_chart(
    df: pd.DataFrame,
    x: str,
    y: str,
    title: str = "",
    color: str | None = None,
    color_map: dict | None = None,
    height: int = 400,
    markers: bool = True,
) -> go.Figure:
    """Line chart dengan markers."""
    kwargs = dict(
        data_frame=df, x=x, y=y, title="",
        color_discrete_sequence=PALETTE, markers=markers,
    )
    if color:
        kwargs["color"] = color
    if color_map:
        kwargs["color_discrete_map"] = color_map
    fig = px.line(**kwargs)
    fig.update_traces(line=dict(width=2.5))
    return _apply_layout(fig, title, height)


# ── Scatter ──────────────────────────────────────────────────────────────

def scatter_chart(
    df: pd.DataFrame,
    x: str,
    y: str,
    title: str = "",
    color: str | None = None,
    color_map: dict | None = None,
    size: str | None = None,
    height: int = 400,
) -> go.Figure:
    """Scatter plot."""
    kwargs = dict(
        data_frame=df, x=x, y=y, title="",
        color_discrete_sequence=PALETTE, opacity=0.7,
    )
    if color:
        kwargs["color"] = color
    if color_map:
        kwargs["color_discrete_map"] = color_map
    if size:
        kwargs["size"] = size
    fig = px.scatter(**kwargs)
    return _apply_layout(fig, title, height)


# ── Box plot ─────────────────────────────────────────────────────────────

def box_chart(
    df: pd.DataFrame,
    x: str,
    y: str,
    title: str = "",
    color: str | None = None,
    color_map: dict | None = None,
    height: int = 400,
) -> go.Figure:
    """Box plot."""
    kwargs = dict(
        data_frame=df, x=x, y=y, title="",
        color_discrete_sequence=PALETTE,
    )
    if color:
        kwargs["color"] = color
    if color_map:
        kwargs["color_discrete_map"] = color_map
    fig = px.box(**kwargs)
    return _apply_layout(fig, title, height)


# ── Heatmap ──────────────────────────────────────────────────────────────

def heatmap_chart(
    z: list | pd.DataFrame,
    x: list,
    y: list,
    title: str = "",
    height: int = 400,
    colorscale: str = "Viridis",
) -> go.Figure:
    """Heatmap sederhana."""
    fig = go.Figure(
        go.Heatmap(
            z=z, x=x, y=y,
            colorscale=colorscale,
            hovertemplate="x: %{x}<br>y: %{y}<br>Nilai: %{z:.2f}<extra></extra>",
        )
    )
    return _apply_layout(fig, title, height)


# ── Radar chart ──────────────────────────────────────────────────────────

def radar_chart(
    categories: list[str],
    values: list[float],
    title: str = "",
    fill_color: str = "rgba(99,102,241,0.25)",
    line_color: str = "#6366F1",
    height: int = 400,
) -> go.Figure:
    """Radar (polar) chart."""
    cats = categories + [categories[0]]
    vals = values + [values[0]]
    fig = go.Figure(
        go.Scatterpolar(
            r=vals, theta=cats, fill="toself",
            fillcolor=fill_color,
            line=dict(color=line_color, width=2),
            marker=dict(size=5),
        )
    )
    fig.update_layout(
        polar=dict(
            bgcolor="rgba(0,0,0,0)",
            radialaxis=dict(gridcolor="rgba(148,163,184,0.15)", showticklabels=True, tickfont=dict(size=9, color="#94A3B8")),
            angularaxis=dict(gridcolor="rgba(148,163,184,0.15)", tickfont=dict(size=10, color="#CBD5E1")),
        ),
    )
    return _apply_layout(fig, title, height)


# ── Histogram ────────────────────────────────────────────────────────────

def histogram_chart(
    df: pd.DataFrame,
    x: str,
    title: str = "",
    color: str | None = None,
    color_map: dict | None = None,
    nbins: int = 30,
    height: int = 400,
) -> go.Figure:
    """Histogram chart."""
    kwargs = dict(
        data_frame=df, x=x, title="", nbins=nbins,
        color_discrete_sequence=PALETTE, opacity=0.8,
    )
    if color:
        kwargs["color"] = color
    if color_map:
        kwargs["color_discrete_map"] = color_map
    fig = px.histogram(**kwargs)
    return _apply_layout(fig, title, height)


# ── Grouped bar from aggregated data ────────────────────────────────────

def grouped_bar(
    df: pd.DataFrame,
    x: str,
    y: str,
    color: str,
    title: str = "",
    color_map: dict | None = None,
    height: int = 400,
    text_auto: bool = False,
) -> go.Figure:
    """Grouped bar chart dari data yang sudah di-aggregate."""
    return bar_chart(df, x, y, title, color=color, color_map=color_map, height=height, text_auto=text_auto, barmode="group")
