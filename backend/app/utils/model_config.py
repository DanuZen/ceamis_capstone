# backend/app/utils/model_config.py
import os

def is_onboarding_models_enabled() -> bool:
    """
    Sakelar kendali model onboarding / profil risiko legacy (Tugas F12).
    Bawaan: True (aktif).
    Jika False: Endpoint profil risiko mengembalikan nilai bawaan / aturan sederhana tanpa galat.
    """
    val = os.getenv("ONBOARDING_MODELS_ENABLED", "true").lower().strip()
    return val in ("true", "1", "yes", "t", "on")
