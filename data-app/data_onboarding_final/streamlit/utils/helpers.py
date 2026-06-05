"""
Helper functions: formatting, color mapping, validasi, dll.
"""


def format_rupiah(value: float, prefix: str = "Rp ") -> str:
    """Format angka ke format Rupiah (titik sebagai pemisah ribuan)."""
    if value is None:
        return f"{prefix}0"
    try:
        value = float(value)
    except (ValueError, TypeError):
        return f"{prefix}0"
    if abs(value) >= 1_000_000_000:
        return f"{prefix}{value / 1_000_000_000:,.1f} M"
    if abs(value) >= 1_000_000:
        return f"{prefix}{value / 1_000_000:,.1f} Jt"
    if abs(value) >= 1_000:
        return f"{prefix}{value / 1_000:,.1f} Rb"
    return f"{prefix}{value:,.0f}"


def format_persen(value: float) -> str:
    """Format angka sebagai persentase."""
    try:
        return f"{float(value) * 100:.1f}%"
    except (ValueError, TypeError):
        return "0.0%"


def format_number(value: float) -> str:
    """Format angka biasa dengan separator ribuan."""
    try:
        value = float(value)
        if abs(value) >= 1_000_000:
            return f"{value / 1_000_000:,.1f}M"
        if abs(value) >= 1_000:
            return f"{value / 1_000:,.1f}K"
        return f"{value:,.0f}"
    except (ValueError, TypeError):
        return "0"


# ── Palet warna konsisten ────────────────────────────────────────────────

# Health label
HEALTH_COLORS = {
    "excellent": "#10B981",   # emerald
    "sehat": "#34D399",       # green
    "cukup": "#FBBF24",       # amber
    "waspada": "#F97316",     # orange
    "kritis": "#EF4444",      # red
}

# Spending cluster
CLUSTER_COLORS = {
    "si hemat": "#10B981",
    "si terencana": "#6366F1",
    "si boros": "#F97316",
    "si impulsif": "#EF4444",
}

# Risk profile
RISK_COLORS = {
    "konservatif": "#3B82F6",
    "moderat": "#FBBF24",
    "agresif": "#EF4444",
}

# Cashflow
CASHFLOW_COLORS = {
    "positif": "#10B981",
    "negatif": "#EF4444",
}

# Sequential palette untuk chart umum
PALETTE = [
    "#6366F1", "#8B5CF6", "#A78BFA", "#C4B5FD",
    "#818CF8", "#6EE7B7", "#34D399", "#10B981",
    "#FBBF24", "#F97316", "#EF4444", "#EC4899",
]


def get_health_color(label: str) -> str:
    """Return warna berdasarkan health label (case-insensitive)."""
    return HEALTH_COLORS.get(str(label).strip().lower(), "#94A3B8")


def get_cluster_color(label: str) -> str:
    """Return warna berdasarkan cluster label (case-insensitive)."""
    return CLUSTER_COLORS.get(str(label).strip().lower(), "#94A3B8")


def get_risk_color(label: str) -> str:
    """Return warna berdasarkan risk label (case-insensitive)."""
    return RISK_COLORS.get(str(label).strip().lower(), "#94A3B8")


def safe_get(df, col, default=None):
    """Safely retrieve a column from DataFrame."""
    if col in df.columns:
        return df[col]
    return default
