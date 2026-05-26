import { Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { SaveOnboardingDto } from './dto/save-onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async save(dto: SaveOnboardingDto) {
    const savingsRatio =
      dto.income > 0
        ? Math.round(((dto.income - dto.monthly_expense) / dto.income) * 100)
        : 0;

    // 1. Save onboarding data
    const { data: onboarding, error: onboardingError } = await this.supabase
      .from('onboarding_data')
      .upsert(
        {
          user_id: dto.user_id,
          name: dto.name,
          age: dto.age,
          income: dto.income,
          income_source: dto.income_source,
          top_expenses: dto.top_expenses,
          monthly_expense: dto.monthly_expense,
          goals: dto.goals,
          risk_profile: dto.risk_profile || 'moderat',
          savings_ratio: savingsRatio,
          completed_at: new Date().toISOString(),
          // Model 3 Features
          tanggungan_keluarga: dto.tanggungan_keluarga ?? 0,
          city_tier_enc: dto.city_tier_enc ?? 1,
          toleransi_rugi_enc: dto.toleransi_rugi_enc ?? 1,
          save_habit: dto.save_habit ?? 3,
          punya_tabungan: dto.punya_tabungan ?? false,
          jumlah_tabungan_bulan: dto.jumlah_tabungan_bulan ?? 0,
        },
        { onConflict: 'user_id' },
      )
      .select()
      .single();

    if (onboardingError)
      throw new Error(`Onboarding save failed: ${onboardingError.message}`);

    // 2. Upsert user profile with onboarding data
    await this.supabase.from('user_profiles').upsert(
      {
        id: dto.user_id,
        name: dto.name,
        risk_profile: dto.risk_profile || 'moderat',
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' },
    );

    return {
      message: 'Onboarding data saved successfully',
      data: onboarding,
      savings_ratio: savingsRatio,
    };
  }

  async getOnboarding(userId: string) {
    const { data, error } = await this.supabase
      .from('onboarding_data')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data;
  }

  async isCompleted(userId: string): Promise<boolean> {
    const { data } = await this.supabase
      .from('user_profiles')
      .select('onboarding_completed')
      .eq('id', userId)
      .single();

    return data?.onboarding_completed === true;
  }
}
