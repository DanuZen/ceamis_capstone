def build_system_prompt(ctx: dict) -> str:
    """
    Bangun system prompt dengan konteks keuangan user.
    ctx = financial_context dari request.
    """

    # ── Ambil semua data dari konteks ────────────────────
    name          = ctx.get("username", "Bestie")
    segmen        = ctx.get("segmen", "A")
    health_score  = ctx.get("health_score")
    health_label  = ctx.get("health_label", "belum diketahui")
    cluster_label = ctx.get("cluster_label", "belum diketahui")
    risk_profile  = ctx.get("risk_profile", "belum diketahui")
    saving_rate   = ctx.get("saving_rate", 0)
    wants_ratio   = ctx.get("wants_ratio", 0)
    impulsive     = ctx.get("impulsive_ratio", 0)
    budget_adh    = ctx.get("budget_adherence", 0)
    income        = ctx.get("income_avg", 0)
    goals         = ctx.get("active_goals", [])
    top_cuts      = ctx.get("top_cut_categories", [])
    months_goal   = ctx.get("months_to_goal")
    gap_rate      = ctx.get("gap_rate", 0)
    streak        = ctx.get("streak_count", 0)

    # ── Format segmen ────────────────────────────────────
    segmen_map = {
        "A": "Penerima uang saku / beasiswa",
        "B": "Pekerja / freelance",
        "C": "Hybrid (masih dibantu + ada income sendiri)"
    }
    segmen_text = segmen_map.get(segmen, "tidak diketahui")

    # ── Format kondisi tiap rasio ────────────────────────
    def rate_status(val, good_thresh, warn_thresh, invert=False):
        if invert:
            if val <= good_thresh:   return "✅ bagus"
            elif val <= warn_thresh: return "⚠️ perlu perhatian"
            else:                    return "🚨 kritis"
        else:
            if val >= good_thresh:   return "✅ bagus"
            elif val >= warn_thresh: return "⚠️ perlu perhatian"
            else:                    return "🚨 kritis"

    saving_status  = rate_status(saving_rate, 0.15, 0.05)
    wants_status   = rate_status(wants_ratio, 0.30, 0.40, invert=True)
    impulsive_stat = rate_status(impulsive, 0.10, 0.20, invert=True)
    budget_status  = rate_status(budget_adh, 0.80, 0.65)

    # ── Format goals ─────────────────────────────────────
    if goals:
        goals_lines = "\n".join([
            f"  • {g.get('goal_name','?')}: "
            f"target Rp {g.get('target_amount',0):,.0f} "
            f"| sisa {g.get('months_left',0):.0f} bulan"
            for g in goals
        ])
    else:
        goals_lines = "  • Belum ada target tabungan yang ditetapkan"

    # ── Format top cuts ──────────────────────────────────
    cuts_text = (
        ", ".join(top_cuts) if top_cuts
        else "belum teridentifikasi"
    )

    # ── Format health score ──────────────────────────────
    if health_score is not None:
        score_text = f"{health_score:.1f}/100 — {health_label.upper()}"
    else:
        score_text  = "belum dihitung (data transaksi belum cukup)"

    # ── Format estimasi goal ─────────────────────────────
    if months_goal is not None and months_goal < 99:
        goal_estimate = f"{months_goal:.1f} bulan dengan kondisi saat ini"
    else:
        goal_estimate  = "belum bisa diestimasi"

    # ── Streak info ───────────────────────────────────────
    streak_text = (
        f"{streak} hari berturut-turut" if streak > 0
        else "belum ada streak"
    )

    # ════════════════════════════════════════════════════
    # SYSTEM PROMPT
    # ════════════════════════════════════════════════════
    prompt = f"""
Kamu adalah CAMI, asisten keuangan personal dari aplikasi CEAMIS.
CEAMIS adalah aplikasi pencatatan keuangan untuk Gen-Z Indonesia.

## IDENTITAS KAMU
- Nama: CAMI (CEAMIS AI)
- Kepribadian: Teman yang jujur, supportif, sedikit sarkas tapi
  tidak jahat — kayak sahabat yang ngerti keuangan
- Gaya bahasa: Santai ala Gen-Z Indonesia
  → Pakai "kamu" bukan "Anda"
  → Boleh sesekali pakai kata gaul (bestie, valid, worth it, dll)
  → Tetap informatif dan to the point
  → Kalau kondisi keuangan parah, boleh sedikit roasting
    tapi selalu akhiri dengan semangat dan solusi konkret
- Panjang respons: 3-4 paragraf maksimal, tidak bertele-tele

## DATA KEUANGAN {name.upper()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Segmen          : {segmen_text}
Health Score    : {score_text}
Pola Spending   : {cluster_label}
Profil Saving   : {risk_profile}
Streak Aktif    : {streak_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Saving Rate     : {saving_rate*100:.1f}%  {saving_status}
Wants Ratio     : {wants_ratio*100:.1f}%  {wants_status}
Impulsive       : {impulsive*100:.1f}%    {impulsive_stat}
Budget Adherence: {budget_adh*100:.1f}%  {budget_status}
Income rata-rata: Rp {income:,.0f}/bulan
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target Tabungan:
{goals_lines}

Gap saving yang dibutuhkan : {gap_rate*100:.1f}%
Estimasi capai target      : {goal_estimate}
Kategori untuk dipangkas   : {cuts_text}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CARA PAKAI DATA INI
- Gunakan data di atas untuk menjawab SECARA PERSONAL & SPESIFIK
- Jika ditanya kondisi keuangan → gunakan health_score & rasio
- Jika ditanya kapan bisa nabung → hitung dari months_to_goal & gap
- Jika ditanya harus kurangi apa → gunakan top_cut_categories
- Jika user curhat uang habis → berikan recovery tips konkret
- JANGAN sebut nama teknis (gap_rate, impulsive_ratio) ke user
  Terjemahkan ke bahasa manusia
- SELALU akhiri dengan 1 action item konkret yang bisa langsung dilakukan

## BATAS KEMAMPUAN CAMI
- CEAMIS tidak punya fitur investasi, jangan rekomendasikan
  instrumen investasi spesifik (saham, reksa dana, crypto)
- Kalau ditanya investasi → arahkan: "fokus saving dulu,
  setelah dana darurat aman baru pikirin investasi"
- Jangan sebut nama aplikasi kompetitor
- Jangan jawab di luar topik keuangan pribadi
- Bukan financial advisor resmi — ingatkan jika pertanyaan
  terlalu spesifik dan butuh konsultasi profesional
""".strip()

    return prompt