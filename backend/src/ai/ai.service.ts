import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly aiServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {
    this.aiServiceUrl =
      this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8000';
  }

  /**
   * Proxy ke FastAPI — Financial Health Score (Model 1)
   * Membutuhkan fitur behavioral yang dihitung dari transaksi user.
   * Jika data transaksi belum cukup, gunakan data onboarding sebagai estimasi.
   */
  async getHealthScore(payload: {
    user_id: string;
    monthly_income: number;
    monthly_expense: number;
    savings_ratio: number;
    risk_profile?: string;
    // Optional behavioral features (diisi dari analisis transaksi)
    pct_late_night?: number;
    pct_weekend?: number;
    pct_unbudgeted?: number;
    pct_risky_category?: number;
    pct_binge_spending?: number;
    avg_hourly_txn_count?: number;
    transaction_count?: number;
    wants_ratio_raw?: number;
    investment_rate_raw?: number;
    dti_ratio?: number;
  }) {
    const saving_rate = payload.savings_ratio / 100;

    // Build FastAPI payload (Model 1 schema)
    const fastapiPayload = {
      pct_late_night:       payload.pct_late_night       ?? 0.10,
      pct_weekend:          payload.pct_weekend          ?? 0.30,
      pct_unbudgeted:       payload.pct_unbudgeted       ?? 0.25,
      pct_risky_category:   payload.pct_risky_category   ?? 0.20,
      pct_binge_spending:   payload.pct_binge_spending   ?? 0.05,
      avg_hourly_txn_count: payload.avg_hourly_txn_count ?? 1.5,
      transaction_count:    payload.transaction_count    ?? 10,
      saving_rate_raw:      Math.min(Math.max(saving_rate, 0), 1),
      wants_ratio_raw:      payload.wants_ratio_raw      ?? 0.30,
      investment_rate_raw:  payload.investment_rate_raw  ?? 0.05,
      dti_ratio:            payload.dti_ratio            ?? 0.10,
      segment_enc:          saving_rate > 0.2 ? 1 : 0,
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/predict/health-score`,
          fastapiPayload,
          { timeout: 10000 },
        ),
      );

      // Normalize response untuk frontend
      const result = {
        health_score:      data.health_score,
        health_label:      data.health_label,
        risk_level:        this.scoreToRiskLevel(data.health_score),
        triggered:         data.warning_triggered,
        warning_triggered: data.warning_triggered,
        xai_factors:       data.xai_factors ?? {},
        message:           data.message ?? '',
        is_mock:           false,
      };

      // Cache ke Supabase
      await this.supabase
        .from('user_profiles')
        .update({
          health_score:      data.health_score,
          warning_triggered: data.warning_triggered,
          updated_at:        new Date().toISOString(),
        })
        .eq('id', payload.user_id);

      return result;
    } catch (err) {
      console.warn('[AiService] Health Score API unavailable, using fallback:', err?.message);
      // Hitung fallback dari data finansial yang ada
      const fallbackScore = this.computeFallbackHealthScore(saving_rate);
      return {
        health_score:      fallbackScore,
        health_label:      this.scoreToLabel(fallbackScore),
        risk_level:        this.scoreToRiskLevel(fallbackScore),
        triggered:         fallbackScore < 40,
        warning_triggered: fallbackScore < 40,
        xai_factors:       {},
        message:           'Skor dihitung dengan estimasi karena AI service tidak tersedia.',
        is_mock:           true,
      };
    }
  }

  /**
   * Proxy ke FastAPI — Spending Pattern Cluster (Model 2)
   */
  async getSpendingCluster(payload: {
    user_id: string;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/analyze`,
          {
            user_id:            payload.user_id,
          },
          { timeout: 10000 },
        ),
      );
      return data;
    } catch (err) {
      console.warn('[AiService] Spending Cluster API unavailable, using fallback:', err?.message);
      return {
        cluster_label:     'Si Hemat',
        dominant_category: 'Makan & Minum',
        insight:           'Analisis AI tidak tersedia. Pertahankan pola keuangan yang baik!',
        needs_ratio:       0.6,
        wants_ratio:       0.3,
        savings_ratio:     0.1,
        trend:             'stable',
        is_mock:           true,
      };
    }
  }

  /**
   * Proxy ke FastAPI — Chatbot CAMI (Real ✅)
   */
  async chat(payload: {
    user_id: string;
    message: string;
    context?: object;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/chat`,
          {
            user_id:           payload.user_id,
            messages:          [{ role: 'user', content: payload.message }],
            financial_context: payload.context ?? null,
          },
          { timeout: 15000 },
        ),
      );
      return {
        reply:       data.reply,
        suggestions: [],
        is_mock:     data.is_mock ?? false,
      };
    } catch (err) {
      console.warn('[AiService] Chatbot API unavailable:', err?.message);
      return {
        reply:       'Maaf, CAMI lagi istirahat sebentar. Coba lagi nanti ya! 🙏',
        suggestions: ['Cek riwayat transaksi', 'Lihat laporan bulanan', 'Update profil risiko'],
        is_mock:     true,
      };
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private computeFallbackHealthScore(savingRate: number): number {
    // Simple heuristic: saving rate * 100, capped 20-90
    return Math.min(90, Math.max(20, Math.round(savingRate * 200 + 40)));
  }

  private scoreToRiskLevel(score: number): string {
    if (score >= 80) return 'low';
    if (score >= 65) return 'low';
    if (score >= 50) return 'medium';
    if (score >= 40) return 'medium';
    return 'high';
  }

  private scoreToLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Sehat';
    if (score >= 50) return 'Cukup';
    if (score >= 40) return 'Waspada';
    return 'Kritis';
  }
}
