"""
Konfigurasi dan Sakelar Fitur LLM (Tugas F11)
CEAMIS 2.0 — Pengendalian Penggunaan AI Pihak Ketiga (Google Gemini / Groq)

Menyediakan sakelar modular agar setiap fitur berbasis LLM dapat diaktifkan atau
dinonaktifkan secara independen demi menjaga privasi data partisipan penelitian.
"""

import os


def _parse_bool(val: str, default: bool = True) -> bool:
    """Parse string environment variable ke boolean."""
    if val is None:
        return default
    return val.strip().lower() in ("true", "1", "yes", "on")


def is_llm_enabled() -> bool:
    """Sakelar Induk LLM: Jika False, seluruh pemanggilan LLM dinonaktifkan."""
    return _parse_bool(os.getenv("LLM_ENABLED", "true"), default=True)


def is_llm_ocr_enabled() -> bool:
    """Sakelar LLM untuk Ekstraksi Struk Belanja (OCR)."""
    return is_llm_enabled() and _parse_bool(
        os.getenv("LLM_OCR_ENABLED", "true"), default=True
    )


def is_llm_insight_enabled() -> bool:
    """Sakelar LLM untuk Narasi XAI Dashboard Insight."""
    return is_llm_enabled() and _parse_bool(
        os.getenv("LLM_INSIGHT_ENABLED", "true"), default=True
    )


def is_llm_education_enabled() -> bool:
    """Sakelar LLM untuk Pembuatan Konten dan Kuis Modul Edukasi."""
    return is_llm_enabled() and _parse_bool(
        os.getenv("LLM_EDUCATION_ENABLED", "true"), default=True
    )
