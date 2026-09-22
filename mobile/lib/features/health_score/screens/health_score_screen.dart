// lib/features/health_score/screens/health_score_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';

class HealthScoreScreen extends StatefulWidget {
  const HealthScoreScreen({super.key});

  @override
  State<HealthScoreScreen> createState() => _HealthScoreScreenState();
}

class _HealthScoreScreenState extends State<HealthScoreScreen> {
  int _selectedTab = 0; // 0: Ringkasan, 1: 5 Pilar, 2: Tren & AI

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.background,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: AppColors.navy),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/');
            }
          },
        ),
        title: Text(
          'Health Score Finansial',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
              ),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // ── Multi-Tab Navigation Selector ─────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surfaceVariant,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.navy, width: 2.0),
                ),
                child: Row(
                  children: [
                    _buildTabButton(0, 'Ringkasan', Icons.speed_rounded),
                    _buildTabButton(1, '5 Indikator', Icons.bar_chart_rounded),
                    _buildTabButton(2, 'Tren & Rekomendasi', Icons.trending_up_rounded),
                  ],
                ),
              ),
            ),

            // ── Tab Content Views ─────────────────────────────────────
            Expanded(
              child: IndexedStack(
                index: _selectedTab,
                children: [
                  _buildSummaryTab(context),
                  _buildFivePillarsTab(context),
                  _buildTrendsAndAiTab(context),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabButton(int index, String label, IconData icon) {
    final isSelected = _selectedTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTab = index;
          });
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
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 16,
                color: isSelected ? AppColors.navy : AppColors.textSecondary,
              ),
              const SizedBox(width: 4),
              Flexible(
                child: Text(
                  label,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: isSelected ? AppColors.navy : AppColors.textSecondary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 1: RINGKASAN SKOR
  // ═════════════════════════════════════════════════════════════════════════
  Widget _buildSummaryTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Score Hero Card
          _buildScoreHero(context),
          const SizedBox(height: 18),

          // Status & Diagnosis
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 14,
            shadowOffset: 3,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.lime,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.navy, width: 1.8),
                      ),
                      child: const Icon(Icons.verified_user_rounded, color: AppColors.navy, size: 20),
                    ),
                    const SizedBox(width: 10),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text(
                          'Kategori Kesehatan: SEHAT',
                          style: TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                          ),
                        ),
                        Text(
                          'Evaluasi Siklus Finansial September 2026',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Kondisi keuangan kamu secara umum sangat stabil. Kamu memiliki disiplin tabungan yang solid dan rasio utang 0%. Titik perhatian utama ada pada pengeluaran gaya hidup (wants) yang mulai mendekati batas pagu.',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: AppColors.navy,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Quick Action Cards
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _selectedTab = 1),
                  child: NeoBrutalCard(
                    backgroundColor: AppColors.purple,
                    borderRadius: 12,
                    shadowOffset: 2.5,
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.pie_chart_outline_rounded, color: Colors.white, size: 22),
                        SizedBox(height: 8),
                        Text(
                          'Cek 5 Indikator',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        Text(
                          'Lihat metrik detail →',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: () => context.go('/planning'),
                  child: NeoBrutalCard(
                    backgroundColor: AppColors.orange,
                    borderRadius: 12,
                    shadowOffset: 2.5,
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Icon(Icons.tune_rounded, color: Colors.white, size: 22),
                        SizedBox(height: 8),
                        Text(
                          'Atur Perencanaan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        Text(
                          'Koreksi pos pagu →',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
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
                  'FINANCIAL HEALTH SCORE',
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
                        color: const Color(0xFF10B981),
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
          const Text(
            'Skor Keseluruhan (Skala 0 - 100)',
            style: TextStyle(
              color: AppColors.navy,
              fontSize: 12,
              fontWeight: FontWeight.w800,
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
                      fontSize: 12,
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

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 2: DETAIL 5 PILAR INDIKATOR
  // ═════════════════════════════════════════════════════════════════════════
  Widget _buildFivePillarsTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Breakdown 5 Pilar Finansial',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                ),
              ),
              Text(
                'Standar OJK / CEAMIS',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          _buildDetailedPillarCard(
            icon: Icons.savings_rounded,
            iconBg: AppColors.lime,
            label: '1. Saving Rate',
            value: '17.0%',
            benchmark: 'Target Ideal: ≥ 20%',
            score: 0.85,
            statusColor: AppColors.lime,
            statusText: 'SEHAT',
            description: 'Persentase pendapatan bersih yang disisihkan ke tabungan atau investasi setiap bulan.',
          ),
          _buildDetailedPillarCard(
            icon: Icons.shopping_bag_rounded,
            iconBg: const Color(0xFFFFE100),
            label: '2. Wants Ratio',
            value: '28.0%',
            benchmark: 'Batas Maksimal: ≤ 25%',
            score: 0.65,
            statusColor: AppColors.orange,
            statusText: 'WASPADA',
            description: 'Rasio pengeluaran sekunder & lifestyle. Sudah mendekati batas toleransi guardrail CEAMIS.',
          ),
          _buildDetailedPillarCard(
            icon: Icons.flash_on_rounded,
            iconBg: AppColors.surfaceVariant,
            label: '3. Impulsive Ratio',
            value: '8.0%',
            benchmark: 'Batas Aman: ≤ 10%',
            score: 0.90,
            statusColor: AppColors.lime,
            statusText: 'SEHAT',
            description: 'Frekuensi dan nilai belanja spontan tanpa rencana. Masih terkendali dengan baik.',
          ),
          _buildDetailedPillarCard(
            icon: Icons.checklist_rounded,
            iconBg: AppColors.surfaceVariant,
            label: '4. Budget Adherence',
            value: '85.0%',
            benchmark: 'Target Kepatuhan: ≥ 80%',
            score: 0.85,
            statusColor: AppColors.lime,
            statusText: 'SEHAT',
            description: 'Tingkat kepatuhan kamu terhadap pagu batas belanja bulanan yang telah ditetapkan.',
          ),
          _buildDetailedPillarCard(
            icon: Icons.account_balance_rounded,
            iconBg: AppColors.surfaceVariant,
            label: '5. DTI Ratio (Debt to Income)',
            value: '0.0%',
            benchmark: 'Batas Aman: ≤ 30%',
            score: 1.0,
            statusColor: AppColors.lime,
            statusText: 'SEMPURNA',
            description: 'Total beban cicilan utang bulanan dibagi pendapatan. Tidak ada utang berbunga saat ini.',
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildDetailedPillarCard({
    required IconData icon,
    required Color iconBg,
    required String label,
    required String value,
    required String benchmark,
    required double score,
    required Color statusColor,
    required String statusText,
    required String description,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      borderRadius: 14,
      shadowOffset: 3,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.border, width: 2.0),
                ),
                child: Icon(icon, color: AppColors.navy, size: 20),
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
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    Text(
                      benchmark,
                      style: const TextStyle(
                        color: AppColors.textSecondary,
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
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
          const SizedBox(height: 10),
          Text(
            description,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: AppColors.textSecondary,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 10),
          // Progress Meter
          Container(
            height: 10,
            decoration: BoxDecoration(
              color: AppColors.surfaceVariant,
              borderRadius: BorderRadius.circular(5),
              border: Border.all(color: AppColors.border, width: 1.5),
            ),
            child: FractionallySizedBox(
              alignment: Alignment.centerLeft,
              widthFactor: score.clamp(0.0, 1.0),
              child: Container(
                decoration: BoxDecoration(
                  color: statusColor,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ═════════════════════════════════════════════════════════════════════════
  // TAB 3: TREN & REKOMENDASI CAMI AI
  // ═════════════════════════════════════════════════════════════════════════
  Widget _buildTrendsAndAiTab(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Tren Skor 6 Bulan Terakhir
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 14,
            shadowOffset: 3,
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: const [
                    Text(
                      'Histori Tren Skor',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                      ),
                    ),
                    Text(
                      '+5.2 poin vs Juli',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF10B981),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildMonthBar('Mei', 68.0, false),
                    _buildMonthBar('Jun', 71.5, false),
                    _buildMonthBar('Jul', 73.3, false),
                    _buildMonthBar('Agu', 76.0, false),
                    _buildMonthBar('Sep', 78.5, true),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // CAMI AI Personalized Strategy
          NeoBrutalCard(
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
                        Icons.smart_toy_rounded,
                        color: AppColors.lime,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 10),
                    const Text(
                      'Rekomendasi Strategi CAMI AI',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                _buildActionTip(
                  '1. Kunci Pembelian Wishlist Non-Pokok',
                  'Pagu Keinginan sudah terserap 71.2%. Hindari check-out wishlist baru sebelum tanggal 28 agar skor tidak anjlok ke zona Waspada.',
                ),
                const SizedBox(height: 10),
                _buildActionTip(
                  '2. Tingkatkan Saving Rate ke 20%',
                  'Tambahkan Rp 150.000 ke pos tabungan akhir pekan ini untuk menaikkan skor finansial kamu menembus 82.0 (Kategori Prima).',
                ),
                const SizedBox(height: 10),
                _buildActionTip(
                  '3. Pertahankan DTI di 0%',
                  'Bebas dari cicilan paylater adalah pilar pertahanan terbaik dalam menjaga cashflow bulanan tetap aman.',
                ),
                const SizedBox(height: 14),
                const Divider(color: AppColors.navy, thickness: 1.5),
                const SizedBox(height: 6),
                const Text(
                  '— Analisis otomatis berbasis mesin CAMI XAI CEAMIS',
                  style: TextStyle(
                    color: AppColors.navy,
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildMonthBar(String month, double score, bool isCurrent) {
    final heightRatio = (score / 100.0).clamp(0.0, 1.0);
    return Column(
      children: [
        Text(
          score.toStringAsFixed(0),
          style: TextStyle(
            fontSize: 11,
            fontWeight: FontWeight.w900,
            color: isCurrent ? AppColors.navy : AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 6),
        Container(
          width: 24,
          height: 90,
          decoration: BoxDecoration(
            color: AppColors.surfaceVariant,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: AppColors.navy, width: 1.5),
          ),
          child: Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              width: double.infinity,
              height: 90 * heightRatio,
              decoration: BoxDecoration(
                color: isCurrent ? AppColors.lime : const Color(0xFF94A3B8),
                borderRadius: BorderRadius.circular(4),
              ),
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          month,
          style: TextStyle(
            fontSize: 11,
            fontWeight: isCurrent ? FontWeight.w900 : FontWeight.w700,
            color: isCurrent ? AppColors.navy : AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildActionTip(String title, String body) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: AppColors.navy,
            fontSize: 12,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          body,
          style: const TextStyle(
            color: AppColors.navy,
            fontSize: 11,
            fontWeight: FontWeight.w700,
            height: 1.35,
          ),
        ),
      ],
    );
  }
}
