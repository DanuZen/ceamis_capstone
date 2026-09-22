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

  IconData get _riskIcon {
    switch (widget.riskLevel) {
      case 'HIGH':
        return Icons.warning_rounded;
      case 'MEDIUM':
        return Icons.error_outline_rounded;
      case 'LOW':
        return Icons.check_circle_rounded;
      default:
        return Icons.info_outline_rounded;
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
      backgroundColor: AppColors.surface,
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
              child: Icon(_riskIcon, size: 36, color: _riskColor),
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
    final deficitAmount = widget.budgetRemainingAfter.abs();

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
                'Dampak Pembagian Anggaran',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Budget limit
          _buildInfoRow('Alokasi Pos ${widget.categoryName}', 'Rp ${_formatNumber(widget.budgetLimit)}'),
          const SizedBox(height: 6),
          _buildInfoRow('Sisa Kuota Saat Ini', 'Rp ${_formatNumber(widget.budgetRemainingBefore)}'),
          const SizedBox(height: 6),
          _buildInfoRow(
            'Sisa Kuota Setelah Pembelian',
            isOverbudget
                ? '-Rp ${_formatNumber(deficitAmount)} (DEFISIT)'
                : 'Rp ${_formatNumber(widget.budgetRemainingAfter)}',
            valueColor: isOverbudget ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
          ),
          const SizedBox(height: 14),

          // Progress bars
          Text('Kuota Terpakai Sebelum:', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
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
          Text('Proyeksi Penggunaan:', style: TextStyle(fontSize: 11, color: AppColors.textMuted, fontWeight: FontWeight.w600)),
          const SizedBox(height: 4),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: SizedBox(
              height: 8,
              child: LinearProgressIndicator(
                value: projectedRatio.clamp(0.0, 1.0),
                backgroundColor: AppColors.surfaceVariant,
                valueColor: AlwaysStoppedAnimation<Color>(
                  isOverbudget ? const Color(0xFFDC2626) : AppColors.warning,
                ),
              ),
            ),
          ),

          // ── Strict Guardrail Alert Box ─────────────────────────────
          if (isOverbudget) ...[
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2), // Soft Crimson
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFDC2626), width: 2.0),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: const [
                      Icon(Icons.gpp_bad_rounded, color: Color(0xFFDC2626), size: 20),
                      SizedBox(width: 8),
                      Text(
                        'PERINGATAN KETAT OVERBUDGET',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFFDC2626),
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '• Pembelian ini menjebol batas pos anggaran sebesar -Rp ${_formatNumber(deficitAmount)}.\n'
                    '• Pos Kebutuhan Pokok terancam terpotong untuk menutupi defisit ini.\n'
                    '• Target "${widget.savingsGoalTitle}" terpaksa mundur +${widget.savingsDelayedDays} hari!',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF991B1B),
                      height: 1.45,
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
      backgroundColor: AppColors.surface,
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.savings_rounded, color: AppColors.cyan, size: 22),
              const SizedBox(width: 8),
              Text(
                'Efek Domino ke Tabungan',
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
                  color: widget.budgetRemainingAfter < 0
                      ? const Color(0xFFFEE2E2)
                      : AppColors.cyan.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: widget.budgetRemainingAfter < 0 ? const Color(0xFFDC2626) : AppColors.cyan,
                    width: 2,
                  ),
                ),
                child: Text(
                  '+${widget.savingsDelayedDays} hari',
                  style: TextStyle(
                    fontWeight: FontWeight.w900,
                    fontSize: 18,
                    color: widget.budgetRemainingAfter < 0 ? const Color(0xFFDC2626) : AppColors.navy,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  widget.budgetRemainingAfter < 0
                      ? 'Target "${widget.savingsGoalTitle}" akan tertunda karena jatah tabungan terpakai.'
                      : 'Proyeksi target "${widget.savingsGoalTitle}" tetap berada dalam zona aman.',
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
    final isOverbudget = widget.budgetRemainingAfter < 0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Rekomendasi Keputusan Bijak',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.navy,
              ),
        ),
        const SizedBox(height: 14),

        if (isOverbudget) ...[
          // Option 1 (Recommended): Alihkan ke Tabungan Bertahap
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: NeoBrutalButton(
              onPressed: () => _handleDecision('INSTALLMENT'),
              backgroundColor: AppColors.lime,
              textColor: AppColors.navy,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.savings_rounded, color: AppColors.navy, size: 20),
                  SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      'Nabung Bertahap (Saran AI)',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Option 2: Tunda dengan jeda 72 jam
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: NeoBrutalButton(
              onPressed: () => _handleDecision('POSTPONE'),
              backgroundColor: const Color(0xFFFFE100),
              textColor: AppColors.navy,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.timer_outlined, color: AppColors.navy, size: 20),
                  SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      'Tunda Dulu (Jeda 72 Jam)',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Option 3: Tetap beli dengan kesadaran risiko
          NeoBrutalButton(
            onPressed: () => _handleDecision('PROCEED'),
            backgroundColor: AppColors.surface,
            textColor: const Color(0xFFDC2626),
            borderColor: const Color(0xFFDC2626),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.warning_amber_rounded, color: Color(0xFFDC2626), size: 20),
                SizedBox(width: 8),
                Flexible(
                  child: Text(
                    'Beli Sekarang (Sadar Risiko)',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ] else ...[
          // Safe to buy
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: NeoBrutalButton(
              onPressed: () => _handleDecision('PROCEED'),
              backgroundColor: AppColors.lime,
              textColor: AppColors.navy,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.check_circle_rounded, color: AppColors.navy, size: 20),
                  SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      'Wujudkan Impian (Aman)',
                      style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
          NeoBrutalButton(
            onPressed: () => _handleDecision('POSTPONE'),
            backgroundColor: AppColors.surface,
            textColor: AppColors.navy,
            borderColor: AppColors.border,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Icon(Icons.pause_circle_outline_rounded, color: AppColors.navy, size: 20),
                SizedBox(width: 8),
                Flexible(
                  child: Text(
                    'Tunda Pembelian',
                    style: TextStyle(fontWeight: FontWeight.w900, fontSize: 13.5),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
        ],
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
      'INSTALLMENT': 'Bagus sekali! Rencana tabungan bertahap dicatat agar impianmu terwujud tanpa mengganggu kebutuhan pokok.',
      'POSTPONE': 'Pilihan bijak! Pengingat jeda berpikir telah diaktifkan untuk menjaga kesehatan finansialmu.',
      'PROCEED': 'Keputusan dicatat. Tetap pantau pengeluaran pos keinginan agar tidak defisit lebih dalam.',
    };

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(messages[decision] ?? 'Keputusan dicatat.'),
        backgroundColor: AppColors.navy,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );

    Future.delayed(const Duration(milliseconds: 1000), () {
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
