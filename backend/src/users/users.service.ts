import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { UpdateUserProfileDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new NotFoundException(`User profile not found: ${error.message}`);
    return data;
  }

  async upsertProfile(userId: string, dto: UpdateUserProfileDto) {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .upsert(
        { id: userId, ...dto, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      )
      .select()
      .single();

    if (error) throw new Error(`Failed to upsert profile: ${error.message}`);
    return data;
  }

  async addXp(userId: string, amount: number) {
    // Fetch current stats
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('xp, level, streak')
      .eq('id', userId)
      .single();

    if (!profile) throw new NotFoundException('Profile not found');

    const newXp = (profile.xp || 0) + amount;
    const nextLevelXp = (profile.level || 1) * 1000;
    const levelUp = newXp >= nextLevelXp;
    const updatedLevel = levelUp ? (profile.level || 1) + 1 : (profile.level || 1);
    const updatedXp = levelUp ? newXp - nextLevelXp : newXp;

    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ xp: updatedXp, level: updatedLevel, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to add XP: ${error.message}`);
    return { ...data, leveled_up: levelUp };
  }

  async updateStreak(userId: string) {
    const { data: profile } = await this.supabase
      .from('user_profiles')
      .select('streak, last_active')
      .eq('id', userId)
      .single();

    if (!profile) throw new NotFoundException('Profile not found');

    const today = new Date().toDateString();
    const lastActive = profile.last_active
      ? new Date(profile.last_active).toDateString()
      : null;

    let newStreak = profile.streak || 0;
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      newStreak = lastActive === yesterday ? newStreak + 1 : 1;
    }

    const { data, error } = await this.supabase
      .from('user_profiles')
      .update({ streak: newStreak, last_active: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update streak: ${error.message}`);
    return data;
  }
}
