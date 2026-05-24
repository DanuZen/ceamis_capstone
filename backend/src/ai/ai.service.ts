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
      this.configService.get<string>('AI_SERVICE_URL') ||
      'http://localhost:8000';
  }

  /** Proxy ke FastAPI — Financial Health Score (Model 1) */
  async getHealthScore(payload: {
    user_id: string;
    monthly_income: number;
    monthly_expense: number;
    savings_ratio: number;
    risk_profile?: string;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/predict/health-score`,
          payload,
        ),
      );

      // Cache hasil ke Supabase
      if (data && !data.is_mock) {
        await this.supabase
          .from('user_profiles')
          .update({
            health_score: data.health_score,
            warning_triggered: data.health_score < 40,
            updated_at: new Date().toISOString(),
          })
          .eq('id', payload.user_id);
      }

      return data;
    } catch {
      // Fallback jika AI service tidak tersedia
      return {
        health_score: 75,
        risk_level: 'medium',
        triggered: false,
        is_mock: true,
        message: 'AI service unavailable, using fallback data',
      };
    }
  }

  /** Proxy ke FastAPI — Spending Pattern Cluster (Model 2) */
  async getSpendingCluster(payload: {
    user_id: string;
    category_breakdown: Record<string, number>;
    total_transactions: number;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.aiServiceUrl}/api/v1/predict/spending-cluster`,
          payload,
        ),
      );
      return data;
    } catch {
      return {
        cluster_label: 'Si Hemat',
        dominant_category: 'Makanan & Minuman',
        insight: 'Data AI tidak tersedia. Pertahankan pola keuangan yang baik!',
        needs_ratio: 60,
        wants_ratio: 30,
        savings_ratio: 10,
        trend: 'stable',
        is_mock: true,
      };
    }
  }

  /** Proxy ke FastAPI — Chatbot CAMI */
  async chat(payload: {
    user_id: string;
    message: string;
    context?: object;
  }) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.aiServiceUrl}/api/v1/chat`, payload),
      );
      return data;
    } catch {
      return {
        reply:
          'Maaf, layanan chatbot sedang tidak tersedia. Coba lagi nanti ya!',
        suggestions: ['Cek riwayat transaksi', 'Lihat laporan bulanan'],
        is_mock: true,
      };
    }
  }
}
