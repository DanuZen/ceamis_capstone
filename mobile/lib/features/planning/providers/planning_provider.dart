// lib/features/planning/providers/planning_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/budget_plan_model.dart';

class PlanningState {
  final double totalIncome;
  final String activeProfileName;
  final List<RiskProfilePreset> presets;
  final List<SubCategoryBudget> subCategories;
  final List<SavingsGoalItem> savingsGoals;

  const PlanningState({
    required this.totalIncome,
    required this.activeProfileName,
    required this.presets,
    required this.subCategories,
    required this.savingsGoals,
  });

  RiskProfilePreset get currentPreset =>
      presets.firstWhere((p) => p.name == activeProfileName, orElse: () => presets[1]);

  BudgetPillar get needsPillar {
    final allocated = totalIncome * currentPreset.needsRatio;
    final spent = subCategories
        .where((c) => c.pillarType == BudgetPillarType.needs)
        .fold(0.0, (acc, c) => acc + c.spent);
    return BudgetPillar(
      type: BudgetPillarType.needs,
      title: 'Kebutuhan (Needs)',
      ratio: currentPreset.needsRatio,
      allocatedAmount: allocated,
      spentAmount: spent,
      iconKey: 'home',
    );
  }

  BudgetPillar get wantsPillar {
    final allocated = totalIncome * currentPreset.wantsRatio;
    final spent = subCategories
        .where((c) => c.pillarType == BudgetPillarType.wants)
        .fold(0.0, (acc, c) => acc + c.spent);
    return BudgetPillar(
      type: BudgetPillarType.wants,
      title: 'Keinginan (Wants)',
      ratio: currentPreset.wantsRatio,
      allocatedAmount: allocated,
      spentAmount: spent,
      iconKey: 'shopping',
    );
  }

  BudgetPillar get savingsPillar {
    final allocated = totalIncome * currentPreset.savingsRatio;
    final spent = subCategories
        .where((c) => c.pillarType == BudgetPillarType.savings)
        .fold(0.0, (acc, c) => acc + c.spent);
    return BudgetPillar(
      type: BudgetPillarType.savings,
      title: 'Tabungan & Investasi',
      ratio: currentPreset.savingsRatio,
      allocatedAmount: allocated,
      spentAmount: spent,
      iconKey: 'piggybank',
    );
  }

  double get totalSpent => needsPillar.spentAmount + wantsPillar.spentAmount + savingsPillar.spentAmount;
  double get totalRemaining => totalIncome - totalSpent;

  bool get hasActiveGuardrailAlert =>
      needsPillar.isNearLimit ||
      needsPillar.isOverbudget ||
      wantsPillar.isNearLimit ||
      wantsPillar.isOverbudget;

  String? get primaryGuardrailMessage {
    if (wantsPillar.isOverbudget) {
      return 'Pos Keinginan telah MELEBIHI ANGGARAN sebesar Rp ${(wantsPillar.spentAmount - wantsPillar.allocatedAmount).toStringAsFixed(0)}! Semua transaksi non-pokok diblokir oleh guardrail.';
    }
    if (wantsPillar.isNearLimit) {
      return 'Pagu Keinginan sudah terserap ${(wantsPillar.spentPercentage * 100).toStringAsFixed(1)}%! Sisa pagu hanya Rp ${wantsPillar.remainingAmount.toStringAsFixed(0)}. Evaluasi wishlist belanja kamu.';
    }
    if (needsPillar.isOverbudget) {
      return 'Pengeluaran Kebutuhan Pokok telah melewati batas rencana! Segera sesuaikan alokasi pos lain.';
    }
    return null;
  }

  PlanningState copyWith({
    double? totalIncome,
    String? activeProfileName,
    List<RiskProfilePreset>? presets,
    List<SubCategoryBudget>? subCategories,
    List<SavingsGoalItem>? savingsGoals,
  }) {
    return PlanningState(
      totalIncome: totalIncome ?? this.totalIncome,
      activeProfileName: activeProfileName ?? this.activeProfileName,
      presets: presets ?? this.presets,
      subCategories: subCategories ?? this.subCategories,
      savingsGoals: savingsGoals ?? this.savingsGoals,
    );
  }
}

class PlanningNotifier extends StateNotifier<PlanningState> {
  PlanningNotifier()
      : super(PlanningState(
          totalIncome: 5200000.0,
          activeProfileName: 'Moderat',
          presets: const [
            RiskProfilePreset(
              name: 'Konservatif',
              description: 'Prioritas keamanan dana darurat & tabungan tinggi',
              needsRatio: 0.50,
              wantsRatio: 0.20,
              savingsRatio: 0.30,
            ),
            RiskProfilePreset(
              name: 'Moderat',
              description: 'Keseimbangan gaya hidup 50/30/20 yang ideal',
              needsRatio: 0.50,
              wantsRatio: 0.30,
              savingsRatio: 0.20,
            ),
            RiskProfilePreset(
              name: 'Agresif',
              description: 'Fokus akselerasi investasi dan pengetatan biaya',
              needsRatio: 0.40,
              wantsRatio: 0.20,
              savingsRatio: 0.40,
            ),
          ],
          subCategories: const [
            // Needs (Allocated: 50% = 2.600.000)
            SubCategoryBudget(
              id: 'cat-1',
              name: 'Makan & Kebutuhan Dapur',
              pillarType: BudgetPillarType.needs,
              allocated: 1400000.0,
              spent: 980000.0,
              iconKey: 'restaurant',
            ),
            SubCategoryBudget(
              id: 'cat-2',
              name: 'Transportasi & Bensin',
              pillarType: BudgetPillarType.needs,
              allocated: 600000.0,
              spent: 420000.0,
              iconKey: 'commute',
            ),
            SubCategoryBudget(
              id: 'cat-3',
              name: 'Listrik, Wifi & Tagihan',
              pillarType: BudgetPillarType.needs,
              allocated: 600000.0,
              spent: 400000.0,
              iconKey: 'bolt',
            ),

            // Wants (Allocated: 30% = 1.560.000, Spent = 1.110.000, Remaining = 450.000)
            SubCategoryBudget(
              id: 'cat-4',
              name: 'Belanja Fashion & Gadget',
              pillarType: BudgetPillarType.wants,
              allocated: 650000.0,
              spent: 580000.0,
              iconKey: 'shopping_bag',
            ),
            SubCategoryBudget(
              id: 'cat-5',
              name: 'Kopi & Nongkrong',
              pillarType: BudgetPillarType.wants,
              allocated: 510000.0,
              spent: 360000.0,
              iconKey: 'coffee',
            ),
            SubCategoryBudget(
              id: 'cat-6',
              name: 'Hiburan & Streaming',
              pillarType: BudgetPillarType.wants,
              allocated: 400000.0,
              spent: 170000.0,
              iconKey: 'tv',
            ),

            // Savings (Allocated: 20% = 1.040.000, Saved = 800.000)
            SubCategoryBudget(
              id: 'cat-7',
              name: 'Dana Darurat Bulanan',
              pillarType: BudgetPillarType.savings,
              allocated: 640000.0,
              spent: 540000.0,
              iconKey: 'shield',
            ),
            SubCategoryBudget(
              id: 'cat-8',
              name: 'Investasi Reksa Dana',
              pillarType: BudgetPillarType.savings,
              allocated: 400000.0,
              spent: 260000.0,
              iconKey: 'trending_up',
            ),
          ],
          savingsGoals: const [
            SavingsGoalItem(
              id: 'goal-1',
              title: 'Dana Darurat 2026',
              targetAmount: 20000000.0,
              currentAmount: 15000000.0,
              targetMonth: 'Desember 2026',
              iconKey: 'shield',
              colorHex: '0xFF10B981',
            ),
            SavingsGoalItem(
              id: 'goal-2',
              title: 'Laptop Kerja Baru',
              targetAmount: 12000000.0,
              currentAmount: 8500000.0,
              targetMonth: 'November 2026',
              iconKey: 'laptop',
              colorHex: '0xFF0095FF',
            ),
            SavingsGoalItem(
              id: 'goal-3',
              title: 'Liburan Akhir Tahun',
              targetAmount: 5000000.0,
              currentAmount: 2100000.0,
              targetMonth: 'Januari 2027',
              iconKey: 'flight',
              colorHex: '0xFFFF8000',
            ),
          ],
        ));

  void setRiskProfile(String profileName) {
    state = state.copyWith(activeProfileName: profileName);
  }

  void updateIncome(double income) {
    state = state.copyWith(totalIncome: income);
  }

  void addSavingsGoal(SavingsGoalItem goal) {
    state = state.copyWith(
      savingsGoals: [...state.savingsGoals, goal],
    );
  }
}

final planningProvider = StateNotifierProvider<PlanningNotifier, PlanningState>((ref) {
  return PlanningNotifier();
});
