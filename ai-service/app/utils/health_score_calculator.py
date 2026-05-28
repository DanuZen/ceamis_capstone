# app/utils/health_score_calculator.py

def normalize_saving_rate(saving_rate: float, segmen: str) -> float:
    """
    Normalisasi saving_rate ke skala 0-1 berdasarkan threshold DS.
    Segmen A: excellent >= 25%, kritis < 5%
    Segmen B: excellent >= 20%, kritis < 1%
    """
    if segmen == "A":
        if saving_rate >= 0.25:   return 1.0
        elif saving_rate >= 0.15: return 0.75
        elif saving_rate >= 0.10: return 0.50
        elif saving_rate >= 0.05: return 0.25
        else:                     return 0.0
    else:  # B atau C
        if saving_rate >= 0.20:   return 1.0
        elif saving_rate >= 0.10: return 0.75
        elif saving_rate >= 0.05: return 0.50
        elif saving_rate >= 0.01: return 0.25
        else:                     return 0.0


def normalize_wants_ratio(wants_ratio: float, segmen: str) -> float:
    """
    Semakin kecil wants_ratio semakin baik → diinvers.
    Segmen A: excellent < 20%, kritis > 40%
    Segmen B: excellent < 20%, kritis > 45%
    """
    if segmen == "A":
        if wants_ratio < 0.20:    return 1.0
        elif wants_ratio < 0.25:  return 0.75
        elif wants_ratio < 0.30:  return 0.50
        elif wants_ratio < 0.40:  return 0.25
        else:                     return 0.0
    else:  # B atau C
        if wants_ratio < 0.20:    return 1.0
        elif wants_ratio < 0.30:  return 0.75
        elif wants_ratio < 0.35:  return 0.50
        elif wants_ratio < 0.45:  return 0.25
        else:                     return 0.0


def normalize_dti(dti_ratio: float) -> float:
    """
    Semakin kecil DTI semakin baik → diinvers.
    Standar OJK: kritis > 40%
    """
    if dti_ratio < 0.15:    return 1.0
    elif dti_ratio < 0.25:  return 0.75
    elif dti_ratio < 0.30:  return 0.50
    elif dti_ratio < 0.40:  return 0.25
    else:                   return 0.0


def normalize_impulsive(impulsive_ratio: float,
                         segmen: str) -> float:
    """
    Semakin kecil impulsive semakin baik → diinvers.
    """
    if segmen == "A":
        if impulsive_ratio < 0.05:    return 1.0
        elif impulsive_ratio < 0.10:  return 0.75
        elif impulsive_ratio < 0.15:  return 0.50
        elif impulsive_ratio < 0.25:  return 0.25
        else:                         return 0.0
    else:
        if impulsive_ratio < 0.05:    return 1.0
        elif impulsive_ratio < 0.10:  return 0.75
        elif impulsive_ratio < 0.15:  return 0.50
        elif impulsive_ratio < 0.20:  return 0.25
        else:                         return 0.0


def normalize_budget_adherence(budget_adherence: float,
                                segmen: str) -> float:
    """
    Semakin tinggi kepatuhan budget semakin baik.
    """
    if budget_adherence >= 0.90:   return 1.0
    elif budget_adherence >= 0.80: return 0.75
    elif budget_adherence >= 0.65: return 0.50
    elif budget_adherence >= 0.50: return 0.25
    else:                          return 0.0

def get_genz_message(label: str) -> str:
    """Generate pesan Gen-Z sarkas berdasarkan kondisi finansial."""
    messages = {
        "Excellent": "Bestie, kamu tuh kayak CFO-nya diri sendiri! Finansialmu literally goals banget. Keep it up! 🔥",
        "Sehat":     "Oke sip, finansialmu cukup sehat nih. Tapi jangan santai-santai dulu, tetap pantau pengeluaranmu ya!",
        "Cukup":     "Hmm, masih oke tapi ada ruang buat improve. Coba kurangin yang 'sekali-kali' itu — sekali-kali kamu tau sendiri berapa kali. 👀",
        "Waspada":   "Sis/bro, dompetmu mulai kirim sinyal SOS nih. Waktunya evaluasi dan cut pengeluaran yang nggak perlu! ⚠️",
        "Kritis":    "Bro/sis, ini darurat keuangan. Dompetmu udah nangis bombay. Warning System diaktifkan — tolong dengerin AI-nya kali ini! 🚨",
    }
    return messages.get(label, "Tetap pantau kondisi keuanganmu ya!")

def calculate_health_score(
    segmen           : str,    # "A" | "B" | "C"
    saving_rate      : float,  # 0-1
    wants_ratio      : float,  # 0-1
    dti_ratio        : float,  # 0-1
    impulsive_ratio  : float,  # 0-1
    budget_adherence : float,  # 0-1
) -> dict:
    """
    Hitung health score berdasarkan formula DS.
    Tidak pakai ML — pure formula deterministik.

    Returns:
        health_score  : float (0-100)
        health_label  : str
        explanation   : list[str]  ← XAI
        component_scores: dict    ← breakdown per komponen
    """

    # ── Normalisasi tiap komponen ─────────────────────────
    sr_score  = normalize_saving_rate(saving_rate, segmen)
    wr_score  = normalize_wants_ratio(wants_ratio, segmen)
    dti_score = normalize_dti(dti_ratio)
    imp_score = normalize_impulsive(impulsive_ratio, segmen)
    ba_score  = normalize_budget_adherence(budget_adherence, segmen)

    # ── Hitung health score per segmen ────────────────────
    if segmen == "A":
        raw_score = (
            sr_score  * 0.30 +
            wr_score  * 0.25 +
            imp_score * 0.25 +
            ba_score  * 0.20
        )
    elif segmen == "B":
        # Total bobot aktif adalah 0.85. Dibagi 0.85 agar skor maksimal kembali menjadi 1.0
        base_score = (
            sr_score  * 0.20 +
            wr_score  * 0.20 +
            dti_score * 0.25 +
            imp_score * 0.10 +
            ba_score  * 0.10
        )
        raw_score = base_score / 0.85 
    else:  # Segmen C
        score_a = (
            sr_score  * 0.30 +
            wr_score  * 0.25 +
            imp_score * 0.25 +
            ba_score  * 0.20
        )
        score_b = (
            sr_score  * 0.20 +
            wr_score  * 0.20 +
            dti_score * 0.25 +
            imp_score * 0.10 +
            ba_score  * 0.10
        ) / 0.85
        raw_score = (0.4 * score_a) + (0.6 * score_b)

    health_score = round(raw_score * 100, 2)

    # ── Label ─────────────────────────────────────────────
    if health_score >= 85:   label = "Excellent"
    elif health_score >= 70: label = "Sehat"
    elif health_score >= 55: label = "Cukup"
    elif health_score >= 40: label = "Waspada"
    else:                    label = "Kritis"

    # ── XAI: penjelasan per komponen ─────────────────────
    explanation = []

    if sr_score < 0.50:
        explanation.append(
            f"Saving rate kamu {saving_rate*100:.1f}% — "
            f"masih di bawah target "
            f"{'15%' if segmen == 'A' else '10%'}."
        )
    else:
        explanation.append(
            f"Saving rate kamu {saving_rate*100:.1f}% — bagus!"
        )

    if wr_score < 0.50:
        explanation.append(
            f"Pengeluaran wants kamu {wants_ratio*100:.1f}% — "
            f"terlalu tinggi, idealnya di bawah "
            f"{'25%' if segmen == 'A' else '30%'}."
        )

    if imp_score < 0.50:
        explanation.append(
            f"Transaksi impulsif kamu cukup tinggi di "
            f"{impulsive_ratio*100:.1f}%."
        )

    if ba_score < 0.50:
        explanation.append(
            f"Kepatuhan budget kamu {budget_adherence*100:.1f}% — "
            f"banyak transaksi di luar budget."
        )

    if segmen in ("B", "C") and dti_score < 0.50:
        explanation.append(
            f"Rasio hutang kamu {dti_ratio*100:.1f}% dari income — "
            f"perlu diwaspadai."
        )

    if not explanation:
        explanation.append("Kondisi keuangan kamu sangat baik!")

    # ── Breakdown per komponen (untuk dashboard XAI) ──────
    component_scores = {
        "saving_rate"     : {
            "raw"  : round(saving_rate, 4),
            "score": round(sr_score, 4),
            "label": f"{saving_rate*100:.1f}%"
        },
        "wants_ratio"     : {
            "raw"  : round(wants_ratio, 4),
            "score": round(wr_score, 4),
            "label": f"{wants_ratio*100:.1f}%"
        },
        "impulsive_ratio" : {
            "raw"  : round(impulsive_ratio, 4),
            "score": round(imp_score, 4),
            "label": f"{impulsive_ratio*100:.1f}%"
        },
        "budget_adherence": {
            "raw"  : round(budget_adherence, 4),
            "score": round(ba_score, 4),
            "label": f"{budget_adherence*100:.1f}%"
        },
        "dti_ratio"       : {
            "raw"  : round(dti_ratio, 4),
            "score": round(dti_score, 4),
            "label": f"{dti_ratio*100:.1f}%"
        },
    }



    return {
        "health_score"    : health_score,
        "health_label"    : label,
        "explanation"     : explanation,
        "message"         : get_genz_message(label),
        "component_scores": component_scores,
        "segmen"          : segmen,
    }