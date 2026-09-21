// lib/features/health_score/screens/health_score_screen.dart

import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

import '../../../core/widgets/neo_brutal_card.dart';

class HealthScoreScreen extends StatelessWidget {
  const HealthScoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Health Score',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Score Hero Card
              _buildScoreHero(context),
              const SizedBox(height: 24),

              // Component Breakdown Header
              Text(
                'Breakdown Indikator',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const SizedBox(height: 12),

              _buildComponentCard(
                icon: Icons.savings_rounded,
                iconBg: AppColors.lime,
                label: 'Saving Rate',
                value: '17.0%',
                benchmark: 'Target: ≥ 20%',
                score: 0.85,
                statusColor: AppColors.lime,
                statusText: 'SEHAT',
              ),
              _buildComponentCard(
                icon: Icons.shopping_bag_rounded,
                iconBg: AppColors.surfaceVariant,
                label: 'Wants Ratio',
                value: '28.0%',
                benchmark: 'Target: ≤ 25%',
                score: 0.65,
                statusColor: AppColors.orange,
                statusText: 'WASPADA',
              ),
              _buildComponentCard(
                icon: Icons.flash_on_rounded,
                iconBg: AppColors.surfaceVariant,
                label: 'Impulsive Ratio',
                value: '8.0%',
                benchmark: 'Target: ≤ 10%',
                score: 0.90,
                statusColor: AppColors.lime,
                statusText: 'SEHAT',
              ),
              _buildComponentCard(
                icon: Icons.checklist_rounded,
                iconBg: AppColors.surfaceVariant,
                label: 'Budget Adherence',
                value: '85.0%',
                benchmark: 'Target: ≥ 80%',
                score: 0.85,
                statusColor: AppColors.lime,
                statusText: 'SEHAT',
              ),
              _buildComponentCard(
                icon: Icons.account_balance_rounded,
                iconBg: AppColors.surfaceVariant,
                label: 'DTI Ratio',
                value: '0.0%',
                benchmark: 'Target: ≤ 30%',
                score: 1.0,
                statusColor: AppColors.lime,
                statusText: 'SEHAT',
              ),

              const SizedBox(height: 24),

              // XAI Explanation Card
              Text(
                'Analisis XAI Finansial',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const SizedBox(height: 12),
              _buildExplanationCard(context),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoreHero(BuildContext context) {
    const score = 78.5;

    return NeoBrutalCard(
      backgroundColor: AppColors.lime,
      borderRadius: 16,
      shadowOffset: 5,
      padding: const EdgeInsets.all(22),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.navy,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  'FINANCIAL STATUS',
                  style: TextStyle(
                    color: AppColors.lime,
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1.0,
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: AppColors.border,
                    width: AppColors.borderWidth,
                  ),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.navy,
                      offset: Offset(2, 2),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DecoratedBox(
                      decoration: BoxDecoration(
                        color: AppColors.lime,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.navy, width: 1),
                      ),
                      child: const SizedBox(width: 8, height: 8),
                    ),
                    const SizedBox(width: 6),
                    const Text(
                      'SEHAT',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            score.toStringAsFixed(1),
            style: Theme.of(context).textTheme.displayLarge?.copyWith(
                  fontSize: 64,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                  letterSpacing: -2,
                  height: 1.0,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            'Skor Finansial Keseluruhan (dari 100)',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: AppColors.navy,
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: AppColors.border,
                width: 2.0,
              ),
            ),
            child: const Row(
              children: [
                Icon(Icons.thumb_up_rounded, color: AppColors.navy, size: 20),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Pilar saving & adherence kuat! Hanya pengeluaran wants yang perlu sedikit direm.',
                    style: TextStyle(
                      color: AppColors.navy,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComponentCard({
    required IconData icon,
    required Color iconBg,
    required String label,
    required String value,
    required String benchmark,
    required double score,
    required Color statusColor,
    required String statusText,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      borderRadius: 14,
      shadowOffset: 3,
      child: Column(
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border, width: 2.0),
                ),
                child: Icon(
                  icon,
                  color: (iconBg == AppColors.purple) ? AppColors.white : AppColors.navy,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      label,
                      style: const TextStyle(
                        color: AppColors.navy,
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    Text(
                      benchmark,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    value,
                    style: const TextStyle(
                      color: AppColors.navy,
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: statusColor,
                      borderRadius: BorderRadius.circular(4),
                      border: Border.all(color: AppColors.border, width: 1.2),
                    ),
                    child: Text(
                      statusText,
                      style: const TextStyle(
                        color: AppColors.navy,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Brutalist Progress Meter
          Container(
            height: 12,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: AppColors.border, width: 1.5),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: score.clamp(0.0, 1.0),
              child: Container(
                decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExplanationCard(BuildContext context) {
    return NeoBrutalCard(
      backgroundColor: AppColors.cyan,
      borderRadius: 16,
      shadowOffset: 4,
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: AppColors.navy,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.psychology_rounded,
                  color: AppColors.cyan,
                  size: 20,
                ),
              ),
              const SizedBox(width: 10),
              const Text(
                'Insight Keuangan Kamu',
                style: TextStyle(
                  color: AppColors.navy,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Text(
            '• Saving rate kamu 17.0% — mendekati target ideal 20%. Pertahankan!',
            style: TextStyle(
              color: AppColors.navy,
              fontSize: 13,
              fontWeight: FontWeight.w700,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            '• Rasio keinginan (wants) 28.0% sedikit melampaui batas aman 25%. Coba kurangi jajan kopi atau impulse buy.',
            style: TextStyle(
              color: AppColors.navy,
              fontSize: 13,
              fontWeight: FontWeight.w700,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 14),
          const Divider(color: AppColors.navy, thickness: 1.5),
          const SizedBox(height: 6),
          const Text(
            '— CAMI, Asisten AI Cerdas CEAMIS',
            style: TextStyle(
              color: AppColors.navy,
              fontSize: 12,
              fontWeight: FontWeight.w800,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}
