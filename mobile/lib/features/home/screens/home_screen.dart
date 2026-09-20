// lib/features/home/screens/home_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';

import '../../../core/widgets/neo_brutal_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

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
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Halo, Bestie! 👋',
                        style: Theme.of(context).textTheme.displayMedium?.copyWith(
                              fontWeight: FontWeight.w900,
                              color: AppColors.navy,
                            ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Yuk pantau keuanganmu hari ini',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              color: AppColors.textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ],
                  ),
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.lime,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.border,
                        width: AppColors.borderWidth,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.navy,
                          offset: Offset(3, 3),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      color: AppColors.navy,
                      size: 28,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Health Score Card (Neo-Brutalist Lime Card)
              _buildHealthScoreCard(context),
              const SizedBox(height: 20),

              // Quick Actions
              _buildQuickActions(context),
              const SizedBox(height: 28),

              // Recent Transactions Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Transaksi Terakhir',
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: AppColors.border,
                        width: 1.5,
                      ),
                    ),
                    child: Text(
                      '3 Terbaru',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w700,
                            color: AppColors.navy,
                          ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Transactions
              _buildTransactionItem(
                icon: Icons.restaurant_rounded,
                iconBg: AppColors.orange,
                title: 'Makan Siang',
                subtitle: 'Food & Beverage',
                amount: '-Rp 35.000',
                isExpense: true,
              ),
              _buildTransactionItem(
                icon: Icons.coffee_rounded,
                iconBg: AppColors.pink,
                title: 'Kopi Kekinian',
                subtitle: 'Food & Beverage',
                amount: '-Rp 28.000',
                isExpense: true,
              ),
              _buildTransactionItem(
                icon: Icons.account_balance_wallet_rounded,
                iconBg: AppColors.lime,
                title: 'Uang Jajan',
                subtitle: 'Income Transfer',
                amount: '+Rp 500.000',
                isExpense: false,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHealthScoreCard(BuildContext context) {
    return NeoBrutalCard(
      backgroundColor: AppColors.lime,
      borderRadius: 16,
      shadowOffset: 4,
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                      Icons.insights_rounded,
                      color: AppColors.lime,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'HEALTH SCORE',
                    style: Theme.of(context).textTheme.labelLarge?.copyWith(
                          color: AppColors.navy,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 1.2,
                        ),
                  ),
                ],
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
                child: const Text(
                  '🟢 SEHAT',
                  style: TextStyle(
                    color: AppColors.navy,
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                '78.5',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(
                      fontSize: 52,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                      letterSpacing: -1.5,
                      height: 1.0,
                    ),
              ),
              const SizedBox(width: 8),
              Text(
                '/ 100',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: AppColors.navy,
                      fontWeight: FontWeight.w800,
                    ),
              ),
            ],
          ),
          const SizedBox(height: 12),
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
            child: Row(
              children: [
                const Icon(Icons.check_circle_rounded,
                    color: AppColors.navy, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Kondisi keuanganmu prima! Pertahankan rasio saving di atas 15%.',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppColors.navy,
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

  Widget _buildQuickActions(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildActionCard(
            context,
            icon: Icons.add_rounded,
            label: 'Tambah\nTransaksi',
            badgeColor: AppColors.purple,
            iconColor: AppColors.white,
            onTap: () => context.go('/add-transaction'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionCard(
            context,
            icon: Icons.document_scanner_rounded,
            label: 'Scan\nStruk',
            badgeColor: AppColors.cyan,
            iconColor: AppColors.navy,
            onTap: () => context.go('/ocr-scan'),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: _buildActionCard(
            context,
            icon: Icons.insights_rounded,
            label: 'Lihat\nInsight',
            badgeColor: AppColors.pink,
            iconColor: AppColors.white,
            onTap: () => context.go('/health-score'),
          ),
        ),
      ],
    );
  }

  Widget _buildActionCard(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color badgeColor,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 14,
      shadowOffset: 3,
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: badgeColor,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: AppColors.border,
                width: 2.0,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.navy,
                  offset: Offset(2, 2),
                  blurRadius: 0,
                ),
              ],
            ),
            child: Icon(icon, color: iconColor, size: 24),
          ),
          const SizedBox(height: 10),
          Text(
            label,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                  height: 1.2,
                ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionItem({
    required IconData icon,
    required Color iconBg,
    required String title,
    required String subtitle,
    required String amount,
    required bool isExpense,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      borderRadius: 12,
      shadowOffset: 3,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: AppColors.border,
                width: 2.0,
              ),
            ),
            child: Icon(icon, color: AppColors.navy, size: 22),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.navy,
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: isExpense ? const Color(0xFFFFEAEA) : const Color(0xFFF2FFE5),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isExpense ? AppColors.orange : const Color(0xFF5BA300),
                width: 1.5,
              ),
            ),
            child: Text(
              amount,
              style: TextStyle(
                color: isExpense ? AppColors.orange : const Color(0xFF386B00),
                fontSize: 13,
                fontWeight: FontWeight.w900,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
