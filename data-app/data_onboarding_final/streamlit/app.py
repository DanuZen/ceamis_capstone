"""
CEAMIS Capstone – Financial Health Dashboard
=============================================
Entry point aplikasi Streamlit multi-page.
"""

from pathlib import Path
from PIL import Image
import streamlit as st

# ── Path & Logo ───────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent


def find_logo(base_dir: Path) -> Path | None:
    """
    Cari logo di folder streamlit dengan nama umum.
    Prioritas:
    - ceamis_logo.png/jpg/jpeg/webp
    - file image pertama yang cocok
    """
    candidates = [
        base_dir / "ceamis_logo.png",
        base_dir / "ceamis_logo.jpg",
        base_dir / "ceamis_logo.jpeg",
        base_dir / "ceamis_logo.webp",
    ]

    for file in candidates:
        if file.exists():
            return file

    # fallback: cari file gambar pertama di folder
    for pattern in ("*.png", "*.jpg", "*.jpeg", "*.webp", "*.ico"):
        matches = sorted(base_dir.glob(pattern))
        if matches:
            return matches[0]

    return None


LOGO_PATH = find_logo(BASE_DIR)


def load_image(path: Path | None, max_size: tuple[int, int] = (256, 256)):
    """Load image dan resize agar proporsional."""
    if path is None or not path.exists():
        return None
    try:
        img = Image.open(path).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        return img
    except Exception:
        return None


# Logo untuk icon tab browser dibuat kecil
page_icon_img = load_image(LOGO_PATH, max_size=(64, 64))
# Logo untuk tampilan halaman dibuat lebih proporsional
hero_logo_img = load_image(LOGO_PATH, max_size=(110, 110))
sidebar_logo_img = load_image(LOGO_PATH, max_size=(150, 150))

# ── Page config ──────────────────────────────────────────────────────────
st.set_page_config(
    page_title="CEAMIS Financial Dashboard",
    page_icon=page_icon_img if page_icon_img is not None else "💰",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ───────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    section[data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0F172A 0%, #1E293B 100%);
        border-right: 1px solid rgba(99, 102, 241, 0.2);
    }

    /* Sidebar image spacing */
    section[data-testid="stSidebar"] .stImage {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
    }

    /* Main title styling */
    .hero-title {
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800 !important;
        line-height: 1.05;
        margin: 0;
        padding: 0;
    }

    .hero-subtitle {
        color: #94A3B8;
        font-size: 1.02rem;
        margin-top: 0.35rem;
        margin-bottom: 0;
    }

    div[data-testid="stMetric"] {
        background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    div[data-testid="stMetric"] label {
        color: #94A3B8 !important;
        font-size: 0.8rem !important;
        font-weight: 500 !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    div[data-testid="stMetric"] [data-testid="stMetricValue"] {
        color: #F1F5F9 !important;
        font-weight: 700 !important;
    }

    .feature-card {
        background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
        border: 1px solid rgba(99, 102, 241, 0.25);
        border-radius: 16px;
        padding: 24px;
        text-align: center;
        min-height: 210px;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
    }

    .feature-icon {
        font-size: 2.1rem;
        margin-bottom: 10px;
    }

    .feature-title {
        font-size: 1.08rem;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #F8FAFC;
    }

    .feature-desc {
        color: #94A3B8;
        font-size: 0.9rem;
        margin: 0;
        line-height: 1.5;
    }

    hr {
        border-color: rgba(99, 102, 241, 0.15) !important;
    }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #0F172A; }
    ::-webkit-scrollbar-thumb { background: #475569; border-radius: 3px; }
    </style>
    """,
    unsafe_allow_html=True,
)

# ── Sidebar branding ────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("<div style='height:10px'></div>", unsafe_allow_html=True)

    if sidebar_logo_img is not None:
        # posisi dibuat center, ukuran lebih kecil dan rapi
        left, center, right = st.columns([1, 2, 1])
        with center:
            st.image(sidebar_logo_img, use_container_width=True)
    else:
        st.markdown(
            """
            <div style="text-align:center; padding: 0.8rem 0 0.4rem 0;">
                <h2 style="
                    background: linear-gradient(135deg, #6366F1, #A78BFA);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 1.5rem;
                    margin-bottom: 0;
                ">💰 CEAMIS</h2>
            </div>
            """,
            unsafe_allow_html=True,
        )

    st.markdown(
        """
        <div style="text-align:center; padding: 0.1rem 0 0.3rem 0;">
            <p style="color:#94A3B8; font-size:0.78rem; margin:0;">
                Financial Health Dashboard
            </p>
        </div>
        <hr style="border-color: rgba(99,102,241,0.2); margin: 0.4rem 0 0.8rem 0;">
        """,
        unsafe_allow_html=True,
    )

# ── Hero section ─────────────────────────────────────────────────────────
hero_col1, hero_col2 = st.columns([0.12, 0.88], vertical_alignment="center")

with hero_col1:
    if hero_logo_img is not None:
        st.image(hero_logo_img, use_container_width=True)
    else:
        st.markdown("## 💰")

with hero_col2:
    st.markdown(
        '<h1 class="hero-title">CEAMIS Financial Health Dashboard</h1>',
        unsafe_allow_html=True,
    )
    st.markdown(
        """
        <div class="hero-subtitle">
            Analisis komprehensif kesehatan keuangan, pola pengeluaran, dan profil risiko pengguna.
        </div>
        """,
        unsafe_allow_html=True,
    )

st.divider()

# ── Feature cards ─────────────────────────────────────────────────────────
col1, col2, col3 = st.columns(3)

with col1:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">🏥</div>
            <div class="feature-title">Health Score</div>
            <p class="feature-desc">
                Klasifikasi kesehatan keuangan berdasarkan skor komposit.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col2:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">💳</div>
            <div class="feature-title">Pola Pengeluaran</div>
            <p class="feature-desc">
                Clustering perilaku spending pengguna berdasarkan pola finansial.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

with col3:
    st.markdown(
        """
        <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <div class="feature-title">Profil Risiko</div>
            <p class="feature-desc">
                Profil demografi, investasi, dan toleransi risiko pengguna.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

st.divider()

st.markdown(
    """
    <div style="color:#64748B; font-size:0.8rem; text-align:center; padding:1rem 0;">
        <strong>CEAMIS Capstone Project</strong> · Financial Health Analytics Dashboard<br>
        Gunakan sidebar untuk navigasi antar halaman analisis.
    </div>
    """,
    unsafe_allow_html=True,
)