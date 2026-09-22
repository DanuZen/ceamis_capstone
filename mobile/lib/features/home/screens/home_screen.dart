// lib/features/home/screens/home_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/ceamis_app_bar.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── 1. Top Header ──────────────────────────────────────────
              _buildTopBar(context),
              const SizedBox(height: 18),

              // ── 2. AI Insight Card (CAMI AI) ───────────────────────────
              _buildAiInsightCard(context),
              const SizedBox(height: 18),

              // ── 3. 2x2 Bento Metric Grid ───────────────────────────────
              _buildBentoMetrics(context),
              const SizedBox(height: 24),

              // ── 4. Aktivitas Terakhir Header ───────────────────────────
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: const [
                      Text(
                        'Aktivitas Terakhir',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                    ],
                  ),
                  GestureDetector(
                    onTap: () => context.go('/history-report'),
                    behavior: HitTestBehavior.opaque,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Text(
                          'Lihat Semua',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w800,
                            color: AppColors.navy,
                          ),
                        ),
                        SizedBox(width: 4),
                        Icon(Icons.arrow_forward_rounded, size: 14, color: AppColors.navy),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // ── 5. Activity Item 1 (Gaji Pokok) ────────────────────────
              _buildActivityItem(
                context,
                icon: Icons.payments_rounded,
                iconBg: AppColors.lime,
                iconColor: AppColors.navy,
                title: 'Gaji Pokok PT Te...',
                badgeText: 'Income',
                badgeBg: AppColors.surface,
                dateText: '• 01 Sep',
                amountText: '+Rp 5.200.000',
                amountColor: const Color(0xFF16A34A), // vibrant green
                statusText: 'Otomatis',
                statusColor: AppColors.textSecondary,
              ),

              // ── 6. Activity Item 2 (Apple Music & iCloud) ──────────────
              _buildActivityItem(
                context,
                icon: Icons.music_note_rounded,
                iconBg: const Color(0xFFDCEBFE), // soft blue
                iconColor: const Color(0xFF0095FF),
                title: 'Apple Music & iCloud',
                badgeText: 'Wants',
                badgeBg: AppColors.surface,
                dateText: '• 03 Sep',
                amountText: '-Rp 169.000',
                amountColor: AppColors.navy,
                statusText: 'Langganan',
                statusColor: const Color(0xFF0095FF),
              ),

              // ── 7. Activity Item 3 (Starbucks Reserve) ─────────────────
              _buildActivityItem(
                context,
                icon: Icons.local_cafe_rounded,
                iconBg: const Color(0xFFFEF08A), // soft yellow
                iconColor: const Color(0xFFB45309),
                title: 'Starbucks Reserve',
                badgeText: 'Impulsif',
                badgeBg: const Color(0xFFFFE100),
                dateText: '• Hari ini',
                amountText: '-Rp 72.000',
                amountColor: const Color(0xFFDC2626), // red
                statusText: 'Waspada',
                statusColor: const Color(0xFFDC2626),
              ),

              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  // ── Top Header with CEAMIS Brand, Notification Bell & Avatar ───────────
  Widget _buildTopBar(BuildContext context) {
    return const CeamisAppBar(title: 'Beranda');
  }

  // ── AI Insight Card (CAMI AI + Skor Finansial) ─────────────────────────
  Widget _buildAiInsightCard(BuildContext context) {
    return NeoBrutalCard(
      backgroundColor: AppColors.lime,
      borderRadius: 16,
      shadowOffset: 4,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
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
                    Icon(Icons.check_circle_outline_rounded, color: AppColors.navy, size: 15),
                    SizedBox(width: 6),
                    Text(
                      'SKOR FINANSIAL: 78.5 • SEHAT',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.circle, color: AppColors.navy, size: 7),
                  SizedBox(width: 5),
                  Text(
                    'CAMI AI',
                    style: TextStyle(
                      color: AppColors.navy,
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.smart_toy_outlined, color: AppColors.navy, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: RichText(
                  text: const TextSpan(
                    style: TextStyle(
                      color: AppColors.navy,
                      fontSize: 12,
                      height: 1.35,
                    ),
                    children: [
                      TextSpan(
                        text: 'AI Insight: ',
                        style: TextStyle(fontWeight: FontWeight.w900),
                      ),
                      TextSpan(
                        text: 'Pengeluaran impulsif <8%, ritme tabungan optimal bulan ini.',
                        style: TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── 2x2 Bento Metric Grid ──────────────────────────────────────────────
  Widget _buildBentoMetrics(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            // Pemasukan Tile
            Expanded(
              child: NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: BoxDecoration(
                            color: AppColors.lime,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppColors.navy, width: 1.5),
                          ),
                          child: const Icon(
                            Icons.south_west_rounded,
                            size: 14,
                            color: AppColors.navy,
                          ),
                        ),
                        const Text(
                          'PEMASUKAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF16A34A),
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Rp 5.200.000',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 3),
                    const Text(
                      'Bulan ini',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Pengeluaran Tile
            Expanded(
              child: NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFE100),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppColors.navy, width: 1.5),
                          ),
                          child: const Icon(
                            Icons.north_east_rounded,
                            size: 14,
                            color: AppColors.navy,
                          ),
                        ),
                        const Text(
                          'PENGELUARAN',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFFDC2626),
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Rp 1.450.000',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFFDC2626),
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 3),
                    const Text(
                      'Terkendali',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            // Sisa Pagu Tile (Navigates to /planning)
            Expanded(
              child: GestureDetector(
                onTap: () => context.go('/planning'),
                behavior: HitTestBehavior.opaque,
                child: NeoBrutalCard(
                  backgroundColor: AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: const [
                          Text(
                            'Sisa Pagu',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Text(
                            '72%',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF16A34A),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Rp 3.750.000',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                          letterSpacing: -0.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: Container(
                          height: 6,
                          decoration: BoxDecoration(
                            color: const Color(0xFFE2E8F0),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: 0.72,
                            child: Container(
                              color: const Color(0xFF16A34A),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Pagu belanja aman',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),

            // Saving Rate Tile
            Expanded(
              child: NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCEBFE),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppColors.navy, width: 1.5),
                          ),
                          child: const Icon(
                            Icons.savings_outlined,
                            size: 14,
                            color: Color(0xFF0095FF),
                          ),
                        ),
                        const Text(
                          'HEMAT',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: Color(0xFF0095FF),
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      '28.4 %',
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Saving rate optimal',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // ── Activity Item Card ─────────────────────────────────────────────────
  Widget _buildActivityItem(
    BuildContext context, {
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    required String title,
    required String badgeText,
    required Color badgeBg,
    required String dateText,
    required String amountText,
    required Color amountColor,
    required String statusText,
    required Color statusColor,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      borderRadius: 12,
      shadowOffset: 2.5,
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: iconBg,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.navy, width: 2.0),
            ),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    color: AppColors.navy,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: badgeBg,
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: AppColors.navy, width: 1.2),
                      ),
                      child: Text(
                        badgeText,
                        style: const TextStyle(
                          color: AppColors.navy,
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      dateText,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amountText,
                style: TextStyle(
                  color: amountColor,
                  fontSize: 15,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                statusText,
                style: TextStyle(
                  color: statusColor,
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
