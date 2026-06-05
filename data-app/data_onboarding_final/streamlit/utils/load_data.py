"""
Modul loading data terpusat dengan st.cache_data.
Semua fungsi loading data ada di sini agar konsisten dan efisien.
"""

import os
import streamlit as st
import pandas as pd

# ── Path relatif dari folder streamlit/ ke folder data/ ──────────────────
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "data", "data_bersih")

HEALTH_FILE = "health_score_classification_dataset.csv"
SPENDING_FILE = "spending_Cluster_dataset.csv"
ONBOARDING_FILE = "processed_onboarding.csv"


def _resolve(filename: str) -> str:
    """Kembalikan absolute path ke file data."""
    return os.path.abspath(os.path.join(DATA_DIR, filename))


@st.cache_data(show_spinner=False)
def load_health() -> pd.DataFrame | None:
    """Load health score classification dataset."""
    path = _resolve(HEALTH_FILE)
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    # Normalisasi kolom ke lowercase
    df.columns = [c.strip().lower() for c in df.columns]
    return df


@st.cache_data(show_spinner=False)
def load_spending() -> pd.DataFrame | None:
    """Load spending cluster dataset."""
    path = _resolve(SPENDING_FILE)
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    df.columns = [c.strip().lower() for c in df.columns]
    return df


@st.cache_data(show_spinner=False)
def load_onboarding() -> pd.DataFrame | None:
    """Load processed onboarding dataset."""
    path = _resolve(ONBOARDING_FILE)
    if not os.path.exists(path):
        return None
    df = pd.read_csv(path)
    df.columns = [c.strip().lower() for c in df.columns]
    return df


def load_all() -> tuple[pd.DataFrame | None, pd.DataFrame | None, pd.DataFrame | None]:
    """Load semua dataset sekaligus. Return (health, spending, onboarding)."""
    return load_health(), load_spending(), load_onboarding()


def check_columns(df: pd.DataFrame, required: list[str], dataset_name: str) -> list[str]:
    """
    Cek apakah kolom yang dibutuhkan tersedia.
    Return list kolom yang hilang (kosong jika semua ada).
    """
    missing = [c for c in required if c not in df.columns]
    if missing:
        st.warning(f"⚠️ Dataset **{dataset_name}** tidak memiliki kolom: {', '.join(missing)}")
    return missing
