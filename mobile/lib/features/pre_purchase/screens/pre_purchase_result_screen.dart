// lib/features/pre_purchase/screens/pre_purchase_result_screen.dart

import 'package:flutter/material.dart';


import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';

/// Pre-Purchase Result Screen — Tampilan hasil cek risiko
/// Badge risiko dinamis (Hijau/Kuning/Merah), trigger factors, dampak anggaran.
class PrePurchaseResultScreen extends StatefulWidget {
  final double plannedAmount;
  final String categoryName;
  final String merchantName;
  final double riskScore;
  final String riskLevel;
  final List<String> triggerFactors;
  final double budgetLimit;
  final double budgetRemainingBefore;
  final double budgetRemainingAfter;
  final int savingsDelayedDays;
  final String savingsGoalTitle;

  const PrePurchaseResultScreen({
    super.key,
    required this.plannedAmount,
    required this.categoryName,
    required this.merchantName,
    required this.riskScore,
    required this.riskLevel,
    required this.triggerFactors,
    required this.budgetLimit,
    required this.budgetRemainingBefore,
    required this.budgetRemainingAfter,
    required this.savingsDelayedDays,
    required this.savingsGoalTitle,
  });

  @override
  State<PrePurchaseResultScreen> createState() => _PrePurchaseResultScreenState();
}

class _PrePurchaseResultScreenState extends State<PrePurchaseResultScreen>
    with TickerProviderStateMixin {
  late AnimationController _scoreAnimController;
  late Animation<double> _scoreAnimation;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();

    _scoreAnimController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _scoreAnimation = Tween<double>(begin: 0.0, end: widget.riskScore).animate(
      CurvedAnimation(parent: _scoreAnimController, curve: Curves.easeOutCubic),
    );

    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _fadeController, curve: Curves.easeOut),
    );

    _scoreAnimController.forward();
    Future.delayed(const Duration(milliseconds: 400), () {
      if (mounted) _fadeController.forward();
    });
  }

  @override
  void dispose() {
    _scoreAnimController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  Color get _riskColor {
    switch (widget.riskLevel) {
      case 'HIGH':
        return AppColors.orange;
      case 'MEDIUM':
        return AppColors.warning;
      case 'LOW':
        return AppColors.lime;
      default:
        return AppColors.textSecondary;
    }
  }

  String get _riskEmoji {
    switch (widget.riskLevel) {
      case 'HIGH':
        return '🔴';
      case 'MEDIUM':
        return '🟡';
      case 'LOW':
        return '🟢';
      default:
        return '⚪';
    }
  }

  String get _riskLabel {
    switch (widget.riskLevel) {
      case 'HIGH':
        return 'Risiko Tinggi';
      case 'MEDIUM':
        return 'Risiko Sedang';
      case 'LOW':
        return 'Risiko Rendah';
      default:
        return 'Tidak Diketahui';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Back Header
              _buildBackHeader(context),
              const SizedBox(height: 20),

              // Risk Score Hero Card
              _buildRiskScoreCard(context),
              const SizedBox(height: 20),

              // Trigger Factors
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildTriggerFactors(context),
              ),
              const SizedBox(height: 20),

              // Budget Impact
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildBudgetImpact(context),
              ),
              const SizedBox(height: 20),

              // Savings Impact
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildSavingsImpact(context),
              ),
              const SizedBox(height: 28),

              // Action Buttons
              FadeTransition(
                opacity: _fadeAnimation,
                child: _buildActionButtons(context),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBackHeader(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: () => Navigator.of(context).pop(),
          child: Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.border, width: AppColors.borderWidth),
              boxShadow: const [
                BoxShadow(color: AppColors.navy, offset: Offset(2, 2), blurRadius: 0),
              ],
            ),
            child: const Icon(Icons.arrow_back_rounded, color: AppColors.navy, size: 22),
          ),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Hasil Evaluasi Risiko',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              Text(
                '${widget.categoryName} • Rp ${_formatNumber(widget.plannedAmount)}',
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRiskScoreCard(BuildContext context) {
    return NeoBrutalCard(
      backgroundColor: _riskColor.withValues(alpha: 0.08),
      shadowColor: _riskColor,
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          // Risk emoji badge
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: _riskColor.withValues(alpha: 0.15),
              shape: BoxShape.circle,
              border: Border.all(color: _riskColor, width: 3),
            ),
            child: Center(
              child: Text(_riskEmoji, style: const TextStyle(fontSize: 36)),
            ),
          ),
          const SizedBox(height: 16),

          // Risk Level Label
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: _riskColor.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _riskColor, width: 2),
            ),
            child: Text(
              _riskLabel,
              style: TextStyle(
                fontWeight: FontWeight.w800,
                fontSize: 14,
                color: widget.riskLevel == 'LOW' ? AppColors.navy : _riskColor,
              ),
            ),
          ),
          const SizedBox(height: 16),

          // Animated risk score
          AnimatedBuilder(
            animation: _scoreAnimation,
            builder: (context2, child2) => Column(
              children: [
                Text(
                  '${(_scoreAnimation.value * 100).toStringAsFixed(1)}%',
                  style: Theme.of(context).textTheme.displayLarge?.copyWith(
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                        fontSize: 48,
                      ),
                ),
                const SizedBox(height: 8),

                // Risk bar
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: SizedBox(
                    height: 12,
                    child: LinearProgressIndicator(
                      value: _scoreAnimation.value,
                      backgroundColor: AppColors.surfaceVariant,
                      valueColor: AlwaysStoppedAnimation<Color>(_riskColor),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Aman', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
              Text('Berisiko', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTriggerFactors(BuildContext context) {
    return NeoBrutalCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: AppColors.orange, size: 22),
              const SizedBox(width: 8),
              Text(
                'Alasan Risiko',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ...widget.triggerFactors.map((factor) => Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      margin: const EdgeInsets.only(top: 7),
                      decoration: BoxDecoration(
                        color: _riskColor,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        factor,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                              height: 1.5,
                            ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }

  Widget _buildBudgetImpact(BuildContext context) {
    final isOverbudget = widget.budgetRemainingAfter < 0;
    final usedRatio = 1 - (widget.budgetRemainingBefore / widget.budgetLimit);
    final projectedRatio = 1 - (widget.budgetRemainingAfter / widget.budgetLimit);

    return NeoBrutalCard(
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.account_balance_wallet_rounded, color: AppColors.purple, size: 22),
              const SizedBox(width: 8),
              Text(
                'Dampak Anggaran',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Budget limit
          _buildInfoRow('Pagu ${widget.categoryName}', 'Rp ${_formatNumber(widget.budgetLimit)}'),
          const SizedBox(height: 6),
          _buildInfoRow('Sisa Saat Ini', 'Rp ${_formatNumber(widget.budgetRemainingBefore)}'),
          const SizedBox(height: 6),
          _buildInfoRow(
            'Sisa Setelah Beli',
            isOverbudget
                ? '-Rp ${_formatNumber(widget.budgetRemainingAfter.abs())}'
                : 'Rp ${_formatNumber(widget.budgetRemainingAfter)}',
            valueColor: isOverbudget ? AppColors.orange : AppColors.lime,
          ),
          const SizedBox(height: 14),

          // Progress bars
          Text('Sebelum:', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: SizedBox(
              height: 8,
              child: LinearProgressIndicator(
                value: usedRatio.clamp(0.0, 1.0),
                backgroundColor: AppColors.surfaceVariant,
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.purple),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text('Proyeksi:', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: SizedBox(
              height: 8,
              child: LinearProgressIndicator(
                value: projectedRatio.clamp(0.0, 1.0),
                backgroundColor: AppColors.surfaceVariant,
                valueColor: AlwaysStoppedAnimation<Color>(
                  isOverbudget ? AppColors.orange : AppColors.warning,
                ),
              ),
            ),
          ),

          if (isOverbudget) ...[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.orange.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(color: AppColors.orange, width: 1.5),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline_rounded, color: AppColors.orange, size: 16),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'Overbudget! Melebihi pagu kategori.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.orange,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSavingsImpact(BuildContext context) {
    return NeoBrutalCard(
      backgroundColor: AppColors.cyan.withValues(alpha: 0.06),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.savings_rounded, color: AppColors.cyan, size: 22),
              const SizedBox(width: 8),
              Text(
                'Dampak Tabungan',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: AppColors.cyan.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.cyan, width: 2),
                ),
                child: Text(
                  '+${widget.savingsDelayedDays} hari',
                  style: const TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 18,
                    color: AppColors.navy,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  'Proyeksi capaian "${widget.savingsGoalTitle}" tertunda.',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: AppColors.textSecondary,
                        fontWeight: FontWeight.w600,
                        height: 1.4,
                      ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Apa keputusan kamu?',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.navy,
              ),
        ),
        const SizedBox(height: 14),

        // Postpone Button (recommended for HIGH risk)
        if (widget.riskLevel == 'HIGH' || widget.riskLevel == 'MEDIUM')
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: NeoBrutalButton(
              onPressed: () => _handleDecision('POSTPONE'),
              backgroundColor: AppColors.lime,
              textColor: AppColors.navy,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: const [
                  Icon(Icons.pause_circle_rounded, color: AppColors.navy, size: 20),
                  SizedBox(width: 8),
                  Text('Tunda Pembelian'),
                ],
              ),
            ),
          ),

        // Adjust Button
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: NeoBrutalButton(
            onPressed: () => _handleDecision('ADJUST'),
            backgroundColor: AppColors.warning,
            textColor: AppColors.navy,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.edit_rounded, color: AppColors.navy, size: 20),
                SizedBox(width: 8),
                Text('Sesuaikan Nominal'),
              ],
            ),
          ),
        ),

        // Proceed Button
        NeoBrutalButton(
          onPressed: () => _handleDecision('PROCEED'),
          backgroundColor: AppColors.surface,
          textColor: AppColors.navy,
          borderColor: AppColors.border,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              Icon(Icons.shopping_cart_checkout_rounded, color: AppColors.navy, size: 20),
              SizedBox(width: 8),
              Text('Tetap Lanjut Beli'),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, {Color? valueColor}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: AppColors.textSecondary,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: valueColor ?? AppColors.navy,
          ),
        ),
      ],
    );
  }

  void _handleDecision(String decision) {
    final messages = {
      'PROCEED': 'Keputusan dicatat. Semoga belanjanya bermanfaat! 🛍️',
      'ADJUST': 'Bagus! Kamu bisa menyesuaikan nominal belanja.',
      'POSTPONE': 'Pilihan bijak untuk menunda belanja! 💪',
    };

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(messages[decision] ?? 'Keputusan dicatat.'),
        backgroundColor: AppColors.navy,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );

    Future.delayed(const Duration(milliseconds: 800), () {
      if (mounted) {
        Navigator.of(context).pop();
      }
    });
  }

  String _formatNumber(double value) {
    final str = value.abs().toStringAsFixed(0);
    final result = StringBuffer();
    int count = 0;
    for (int i = str.length - 1; i >= 0; i--) {
      result.write(str[i]);
      count++;
      if (count % 3 == 0 && i > 0) result.write('.');
    }
    return result.toString().split('').reversed.join();
  }
}
