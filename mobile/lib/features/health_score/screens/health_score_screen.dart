// lib/features/health_score/screens/health_score_screen.dart

import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class HealthScoreScreen extends StatelessWidget {
  const HealthScoreScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Health Score')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Score Ring
              _buildScoreRing(context),
              const SizedBox(height: 24),

              // Category Badge
              _buildCategoryBadge(context),
              const SizedBox(height: 24),

              // Component Breakdown
              Text(
                'Breakdown Komponen',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),

              _buildComponentCard(
                icon: Icons.savings_outlined,
                label: 'Saving Rate',
                value: '17.0%',
                score: 0.75,
                color: AppColors.sehat,
              ),
              _buildComponentCard(
                icon: Icons.shopping_bag_outlined,
                label: 'Wants Ratio',
                value: '28.0%',
                score: 0.50,
                color: AppColors.waspada,
              ),
              _buildComponentCard(
                icon: Icons.flash_on_outlined,
                label: 'Impulsive Ratio',
                value: '8.0%',
                score: 0.75,
                color: AppColors.sehat,
              ),
              _buildComponentCard(
                icon: Icons.checklist_outlined,
                label: 'Budget Adherence',
                value: '85.0%',
                score: 0.75,
                color: AppColors.sehat,
              ),
              _buildComponentCard(
                icon: Icons.account_balance_outlined,
                label: 'DTI Ratio',
                value: '0.0%',
                score: 1.0,
                color: AppColors.sehat,
              ),

              const SizedBox(height: 24),

              // XAI Explanation
              Text(
                'Penjelasan AI 🤖',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 12),
              _buildExplanationCard(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScoreRing(BuildContext context) {
    const score = 78.5;
    return Center(
      child: SizedBox(
        width: 180,
        height: 180,
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Background ring
            SizedBox(
              width: 180,
              height: 180,
              child: CircularProgressIndicator(
                value: 1.0,
                strokeWidth: 12,
                backgroundColor: AppColors.surfaceVariant,
                color: AppColors.surfaceVariant,
              ),
            ),
            // Score ring
            SizedBox(
              width: 180,
              height: 180,
              child: TweenAnimationBuilder<double>(
                tween: Tween(begin: 0, end: score / 100),
                duration: const Duration(milliseconds: 1500),
                curve: Curves.easeOutCubic,
                builder: (context, value, child) {
                  return CircularProgressIndicator(
                    value: value,
                    strokeWidth: 12,
                    strokeCap: StrokeCap.round,
                    backgroundColor: Colors.transparent,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getScoreColor(score),
                    ),
                  );
                },
              ),
            ),
            // Center text
            Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TweenAnimationBuilder<double>(
                  tween: Tween(begin: 0, end: score),
                  duration: const Duration(milliseconds: 1500),
                  curve: Curves.easeOutCubic,
                  builder: (context, value, child) {
                    return Text(
                      value.toStringAsFixed(1),
                      style: const TextStyle(
                        fontSize: 42,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textPrimary,
                        letterSpacing: -2,
                      ),
                    );
                  },
                ),
                const Text(
                  'dari 100',
                  style: TextStyle(
                    color: AppColors.textMuted,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryBadge(BuildContext context) {
    // Placeholder — this comes from health_score.category field
    const category = 'Waspada'; // "Sehat" | "Waspada" | "Boros"
    final color = _getCategoryColor(category);

    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withValues(alpha: 0.4)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(_getCategoryIcon(category), color: color, size: 20),
            const SizedBox(width: 8),
            Text(
              'Kategori: $category',
              style: TextStyle(
                color: color,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComponentCard({
    required IconData icon,
    required String label,
    required String value,
    required double score,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Text(
                value,
                style: TextStyle(
                  color: color,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: score,
              backgroundColor: AppColors.surfaceVariant,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 6,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExplanationCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppColors.primary.withValues(alpha: 0.1),
            AppColors.accent.withValues(alpha: 0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Saving rate kamu 17.0% — bagus!',
            style: TextStyle(color: AppColors.textPrimary, fontSize: 14),
          ),
          const SizedBox(height: 6),
          const Text(
            'Pengeluaran wants kamu 28.0% — terlalu tinggi, idealnya di bawah 25%.',
            style: TextStyle(color: AppColors.textPrimary, fontSize: 14),
          ),
          const SizedBox(height: 12),
          Text(
            '— CAMI, AI Financial Advisor 🤖',
            style: TextStyle(
              color: AppColors.textMuted,
              fontSize: 12,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Color _getScoreColor(double score) {
    if (score >= 80) return AppColors.sehat;
    if (score >= 40) return AppColors.waspada;
    return AppColors.boros;
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Sehat':
        return AppColors.sehat;
      case 'Waspada':
        return AppColors.waspada;
      case 'Boros':
        return AppColors.boros;
      default:
        return AppColors.textMuted;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Sehat':
        return Icons.check_circle_outline;
      case 'Waspada':
        return Icons.warning_amber_outlined;
      case 'Boros':
        return Icons.error_outline;
      default:
        return Icons.help_outline;
    }
  }
}
