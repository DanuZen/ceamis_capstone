import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';

@Injectable()
export class WarningsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async getWarnings(userId: string) {
    const { data, error } = await this.supabase
      .from('warnings')
      .select('*')
      .eq('user_id', userId)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch warnings: ${error.message}`);
    return data || [];
  }

  async createWarning(payload: {
    user_id: string;
    type: string;
    message: string;
    tip: string;
    severity: 'high' | 'medium' | 'low';
  }) {
    const { data, error } = await this.supabase
      .from('warnings')
      .insert({
        ...payload,
        is_resolved: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create warning: ${error.message}`);
    return data;
  }

  async resolveWarning(userId: string, warningId: string) {
    const { data, error } = await this.supabase
      .from('warnings')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('id', warningId)
      .select()
      .single();

    if (error) throw new Error(`Failed to resolve warning: ${error.message}`);
    return data;
  }

  async generateWarnings(userId: string, healthScore: number, transactions: any[]) {
    const warnings = [];

    // Rule 1: Health Score kritis
    if (healthScore < 40) {
      warnings.push({
        user_id: userId,
        type: 'health_score',
        message: `Health Score kamu hanya ${healthScore}/100 — kondisi keuangan kamu perlu perhatian serius!`,
        tip: 'Kurangi pengeluaran wants (hiburan, belanja online) setidaknya 30% bulan ini.',
        severity: 'high' as const,
      });
    }

    // Rule 2: Spending impulsif (banyak transaksi wants dalam sehari)
    const today = new Date().toDateString();
    const todayWants = transactions.filter(
      (t) =>
        t.tag === 'wants' &&
        new Date(t.created_at).toDateString() === today,
    );
    if (todayWants.length >= 3) {
      warnings.push({
        user_id: userId,
        type: 'impulsif',
        message: `Kamu sudah ${todayWants.length}x transaksi impulsif hari ini. Dompetmu nangis tuh!`,
        tip: 'Coba tunggu 24 jam sebelum checkout lagi. Kalau masih pengen, baru beli!',
        severity: 'high' as const,
      });
    }

    // Save all generated warnings
    for (const w of warnings) {
      await this.createWarning(w);
    }

    return warnings;
  }
}
