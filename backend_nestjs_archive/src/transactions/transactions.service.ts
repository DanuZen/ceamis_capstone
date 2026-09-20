import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../supabase/supabase.module';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(SUPABASE_CLIENT) private readonly supabase: SupabaseClient,
  ) {}

  async findAll(userId: string, limit = 50, offset = 0) {
    const { data, error, count } = await this.supabase
      .from('transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to fetch transactions: ${error.message}`);
    return { data, total: count, limit, offset };
  }

  async findOne(userId: string, id: string) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Transaction not found`);
    return data;
  }

  async create(dto: CreateTransactionDto) {
    const { data, error } = await this.supabase
      .from('transactions')
      .insert({
        user_id: dto.user_id,
        description: dto.description,
        amount: dto.amount,
        type: dto.type,
        category: dto.category,
        tag: dto.tag || null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create transaction: ${error.message}`);
    return data;
  }

  async remove(userId: string, id: string) {
    const { error } = await this.supabase
      .from('transactions')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw new Error(`Failed to delete transaction: ${error.message}`);
    return { message: 'Transaction deleted', id };
  }

  async getSummary(userId: string) {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('amount, type, category')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to fetch summary: ${error.message}`);

    const totalPemasukan = data
      .filter((t) => t.type === 'pemasukan')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalPengeluaran = data
      .filter((t) => t.type === 'pengeluaran')
      .reduce((sum, t) => sum + t.amount, 0);

    // Category breakdown for AI model
    const categoryBreakdown: Record<string, number> = {};
    data
      .filter((t) => t.type === 'pengeluaran')
      .forEach((t) => {
        categoryBreakdown[t.category] =
          (categoryBreakdown[t.category] || 0) + t.amount;
      });

    return {
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      sisa_saldo: totalPemasukan - totalPengeluaran,
      savings_ratio:
        totalPemasukan > 0
          ? Math.round(((totalPemasukan - totalPengeluaran) / totalPemasukan) * 100)
          : 0,
      category_breakdown: categoryBreakdown,
      total_transactions: data.length,
    };
  }
}
