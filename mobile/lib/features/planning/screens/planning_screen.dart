// lib/features/planning/screens/planning_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/ceamis_app_bar.dart';
import '../models/budget_plan_model.dart';
import '../providers/planning_provider.dart';

class PlanningScreen extends ConsumerWidget {
  const PlanningScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(planningProvider);
    final currencyFormatter = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── 1. Top Header ──────────────────────────────────────────
              _buildTopBar(context, state, currencyFormatter),
              const SizedBox(height: 18),

              // ── 2. Guardrail Strict Warning Banner ─────────────────────
              if (state.hasActiveGuardrailAlert && state.primaryGuardrailMessage != null)
                _buildGuardrailAlertBanner(context, state),

              const SizedBox(height: 16),

              // ── 3. Profil Anggaran Selector (50/30/20 Presets) ─────────
              _buildProfilePresetSelector(context, ref, state),
              const SizedBox(height: 20),

              // ── 4. Ringkasan Pagu Alokasi 3 Pilar Utama ────────────────
              _buildPillarSectionHeader(context),
              const SizedBox(height: 12),
              _buildPillarCard(
                context,
                pillar: state.needsPillar,
                color: const Color(0xFF10B981),
                currencyFormatter: currencyFormatter,
                icon: Icons.home_work_rounded,
                badgeLabel: '50% POKOK',
              ),
              const SizedBox(height: 12),
              _buildPillarCard(
                context,
                pillar: state.wantsPillar,
                color: const Color(0xFFFF8000),
                currencyFormatter: currencyFormatter,
                icon: Icons.shopping_bag_rounded,
                badgeLabel: '30% LIFESTYLE',
              ),
              const SizedBox(height: 12),
              _buildPillarCard(
                context,
                pillar: state.savingsPillar,
                color: const Color(0xFF0095FF),
                currencyFormatter: currencyFormatter,
                icon: Icons.savings_rounded,
                badgeLabel: '20% TABUNGAN',
              ),
              const SizedBox(height: 24),

              // ── 5. Breakdown Pos Rincian Belanja ───────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    'Rincian Pos Anggaran',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
                  ),
                  Text(
                    'Per Bulan',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...state.subCategories.map((cat) => _buildSubCategoryRow(context, cat, currencyFormatter)),

              const SizedBox(height: 24),

              // ── 6. Target Tabungan & Pos Celengan Impian ───────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text(
                      'Target Tabungan & Pos Impian',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const SizedBox(width: 8),
                  GestureDetector(
                    onTap: () => _showAddGoalDialog(context, ref),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.lime,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.navy, width: 1.8),
                        boxShadow: const [
                          BoxShadow(
                            color: AppColors.navy,
                            offset: Offset(1.5, 1.5),
                            blurRadius: 0,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Icon(Icons.add_rounded, size: 16, color: AppColors.navy),
                          SizedBox(width: 4),
                          Text(
                            'Tambah',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: AppColors.navy,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ...state.savingsGoals.map((goal) => _buildSavingsGoalCard(context, goal, currencyFormatter)),

              const SizedBox(height: 20),

              // ── 7. Link to Smart Wishlist ──────────────────────────────
              _buildWishlistIntegrationCta(context),

              const SizedBox(height: 90),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar(BuildContext context, PlanningState state, NumberFormat currencyFormatter) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const CeamisAppBar(title: 'Rencana'),
        const SizedBox(height: 14),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.navy, width: 2.0),
            boxShadow: const [
              BoxShadow(
                color: AppColors.navy,
                offset: Offset(2.5, 2.5),
                blurRadius: 0,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: const [
                  Icon(Icons.account_balance_wallet_rounded, size: 18, color: AppColors.navy),
                  SizedBox(width: 8),
                  Text(
                    'TOTAL PENDAPATAN BULANAN',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
              Text(
                currencyFormatter.format(state.totalIncome),
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF16A34A),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildGuardrailAlertBanner(BuildContext context, PlanningState state) {
    return NeoBrutalCard(
      backgroundColor: const Color(0xFFFEF2F2),
      borderRadius: 14,
      borderWidth: 2.5,
      shadowOffset: 3,
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: const Color(0xFFB91C1C),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.navy, width: 1.8),
            ),
            child: const Icon(
              Icons.warning_amber_rounded,
              color: Colors.white,
              size: 22,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'PERINGATAN KETAT GUARDRAIL',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFFB91C1C),
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  state.primaryGuardrailMessage ?? '',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfilePresetSelector(BuildContext context, WidgetRef ref, PlanningState state) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Profil Pembagian Uang',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w900,
            color: AppColors.navy,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.navy, width: 2.0),
          ),
          child: Row(
            children: state.presets.map((preset) {
              final isSelected = preset.name == state.activeProfileName;
              return Expanded(
                child: GestureDetector(
                  onTap: () {
                    ref.read(planningProvider.notifier).setRiskProfile(preset.name);
                  },
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 180),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.lime : Colors.transparent,
                      borderRadius: BorderRadius.circular(8),
                      border: isSelected ? Border.all(color: AppColors.navy, width: 1.8) : null,
                      boxShadow: isSelected
                          ? const [
                              BoxShadow(
                                color: AppColors.navy,
                                offset: Offset(1.5, 1.5),
                                blurRadius: 0,
                              ),
                            ]
                          : null,
                    ),
                    child: Center(
                      child: Column(
                        children: [
                          Text(
                            preset.name,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: isSelected ? AppColors.navy : AppColors.textSecondary,
                            ),
                          ),
                          Text(
                            '${(preset.needsRatio * 100).toInt()}/${(preset.wantsRatio * 100).toInt()}/${(preset.savingsRatio * 100).toInt()}',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              color: isSelected ? AppColors.navy : AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildPillarSectionHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: const [
        Text(
          'Tiga Pilar Anggaran',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w900,
            color: AppColors.navy,
          ),
        ),
        Text(
          'Realisasi vs Pagu',
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildPillarCard(
    BuildContext context, {
    required BudgetPillar pillar,
    required Color color,
    required NumberFormat currencyFormatter,
    required IconData icon,
    required String badgeLabel,
  }) {
    final progress = pillar.spentPercentage.clamp(0.0, 1.0);
    final isWarning = pillar.isNearLimit;
    final isOverbudget = pillar.isOverbudget;

    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 14,
      shadowOffset: 3,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.navy, width: 1.8),
                    ),
                    child: Icon(icon, color: AppColors.navy, size: 20),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        pillar.title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                      ),
                      Text(
                        'Pagu: ${currencyFormatter.format(pillar.allocatedAmount)}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isOverbudget
                      ? const Color(0xFFB91C1C)
                      : isWarning
                          ? const Color(0xFFFFE100)
                          : AppColors.lime,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.navy, width: 1.5),
                ),
                child: Text(
                  isOverbudget
                      ? 'OVERBUDGET'
                      : isWarning
                          ? 'WASPADA'
                          : badgeLabel,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    color: isOverbudget ? Colors.white : AppColors.navy,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Progress bar
          Container(
            height: 12,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: AppColors.navy, width: 1.5),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: progress,
              child: Container(
                decoration: BoxDecoration(
                  color: isOverbudget
                      ? const Color(0xFFB91C1C)
                      : isWarning
                          ? const Color(0xFFFF8000)
                          : color,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Terpakai: ${currencyFormatter.format(pillar.spentAmount)} (${(pillar.spentPercentage * 100).toStringAsFixed(0)}%)',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                ),
              ),
              Text(
                pillar.remainingAmount >= 0
                    ? 'Sisa: ${currencyFormatter.format(pillar.remainingAmount)}'
                    : 'Defisit: ${currencyFormatter.format(pillar.remainingAmount.abs())}',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: pillar.remainingAmount >= 0 ? const Color(0xFF10B981) : const Color(0xFFB91C1C),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSubCategoryRow(BuildContext context, SubCategoryBudget cat, NumberFormat currencyFormatter) {
    IconData iconData = Icons.category_rounded;
    if (cat.iconKey == 'restaurant') iconData = Icons.restaurant_rounded;
    if (cat.iconKey == 'commute') iconData = Icons.directions_car_rounded;
    if (cat.iconKey == 'bolt') iconData = Icons.bolt_rounded;
    if (cat.iconKey == 'shopping_bag') iconData = Icons.shopping_bag_rounded;
    if (cat.iconKey == 'coffee') iconData = Icons.local_cafe_rounded;
    if (cat.iconKey == 'tv') iconData = Icons.live_tv_rounded;
    if (cat.iconKey == 'shield') iconData = Icons.shield_rounded;
    if (cat.iconKey == 'trending_up') iconData = Icons.trending_up_rounded;

    final progress = (cat.spent / cat.allocated).clamp(0.0, 1.0);
    final isOver = cat.spent > cat.allocated;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: AppColors.navy, width: 1.5),
      ),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.navy, width: 1.2),
            ),
            child: Icon(iconData, size: 16, color: AppColors.navy),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  cat.name,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.navy,
                  ),
                ),
                const SizedBox(height: 4),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: AppColors.surfaceVariant,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      isOver ? const Color(0xFFB91C1C) : AppColors.navy,
                    ),
                    minHeight: 6,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                currencyFormatter.format(cat.spent),
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  color: isOver ? const Color(0xFFB91C1C) : AppColors.navy,
                ),
              ),
              Text(
                'dari ${currencyFormatter.format(cat.allocated)}',
                style: const TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSavingsGoalCard(BuildContext context, SavingsGoalItem goal, NumberFormat currencyFormatter) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 14,
      shadowOffset: 2.5,
      padding: const EdgeInsets.all(14),
      margin: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: AppColors.lime,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.navy, width: 1.5),
                    ),
                    child: const Icon(Icons.star_rounded, size: 18, color: AppColors.navy),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        goal.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                      ),
                      Text(
                        'Target: ${goal.targetMonth}',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.navy, width: 1.2),
                ),
                child: Text(
                  '${(goal.progress * 100).toStringAsFixed(0)}%',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: AppColors.navy,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: goal.progress,
              backgroundColor: AppColors.surfaceVariant,
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Terkumpul: ${currencyFormatter.format(goal.currentAmount)}',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                ),
              ),
              Text(
                'Sisa: ${currencyFormatter.format(goal.remaining)}',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWishlistIntegrationCta(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go('/pre-purchase'),
      child: NeoBrutalCard(
        backgroundColor: AppColors.cyan,
        borderRadius: 14,
        shadowOffset: 3,
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: AppColors.navy,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.stars_rounded, color: AppColors.lime, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Ingin Membeli Sesuatu?',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Cek di Smart Wishlist untuk analisis kelayakan belanja vs pagu anggaran ini.',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.navy,
                      height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(Icons.arrow_forward_rounded, color: AppColors.navy, size: 20),
          ],
        ),
      ),
    );
  }

  void _showAddGoalDialog(BuildContext context, WidgetRef ref) {
    final titleController = TextEditingController();
    final amountController = TextEditingController();
    final monthController = TextEditingController(text: 'Desember 2026');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(ctx).viewInsets.bottom,
          ),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
              border: Border.all(color: AppColors.navy, width: 2.5),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Tambah Pos Celengan',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: AppColors.navy),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: titleController,
                  decoration: InputDecoration(
                    labelText: 'Nama Pos Target',
                    hintText: 'Misal: Beli Smartphone Baru',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.navy, width: 2.0),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: amountController,
                  keyboardType: TextInputType.number,
                  decoration: InputDecoration(
                    labelText: 'Target Nominal (Rp)',
                    hintText: 'Misal: 5000000',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.navy, width: 2.0),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: monthController,
                  decoration: InputDecoration(
                    labelText: 'Target Waktu',
                    hintText: 'Bulan / Tahun',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(10),
                      borderSide: const BorderSide(color: AppColors.navy, width: 2.0),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      final title = titleController.text.trim();
                      final amount = double.tryParse(amountController.text.trim()) ?? 0.0;
                      if (title.isNotEmpty && amount > 0) {
                        ref.read(planningProvider.notifier).addSavingsGoal(
                              SavingsGoalItem(
                                id: 'goal-${DateTime.now().millisecondsSinceEpoch}',
                                title: title,
                                targetAmount: amount,
                                currentAmount: 0.0,
                                targetMonth: monthController.text.trim(),
                                iconKey: 'target',
                                colorHex: '0xFF10B981',
                              ),
                            );
                        Navigator.pop(ctx);
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.lime,
                      foregroundColor: AppColors.navy,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: const BorderSide(color: AppColors.navy, width: 2.0),
                      ),
                    ),
                    child: const Text(
                      'Simpan Target',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
