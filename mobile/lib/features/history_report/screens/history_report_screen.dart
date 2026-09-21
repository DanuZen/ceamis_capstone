// lib/features/history_report/screens/history_report_screen.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';

class HistoryReportScreen extends StatefulWidget {
  final int initialTab;
  const HistoryReportScreen({super.key, this.initialTab = 0});

  @override
  State<HistoryReportScreen> createState() => _HistoryReportScreenState();
}

class _HistoryReportScreenState extends State<HistoryReportScreen> {
  late int _selectedTab; // 0: Riwayat, 1: Laporan
  String _historyFilter = 'semua'; // 'semua', 'pengeluaran', 'pemasukan'

  final currencyFormatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  // Mock list of transactions
  final List<Map<String, dynamic>> _mockTransactions = [
    {
      'id': 'tx-1',
      'title': 'Makan Siang Bebek Peking',
      'category': 'Food & Beverage',
      'merchant': 'Resto Bebek Enak',
      'amount': 45000.0,
      'isExpense': true,
      'date': '21 Sep 2026, 12:30',
      'method': 'QRIS',
      'icon': Icons.restaurant_rounded,
    },
    {
      'id': 'tx-2',
      'title': 'Kopi Kekinian & Croissant',
      'category': 'Food & Beverage',
      'merchant': 'Kopi Janji Manis',
      'amount': 28000.0,
      'isExpense': true,
      'date': '21 Sep 2026, 09:15',
      'method': 'Cash',
      'icon': Icons.local_cafe_rounded,
    },
    {
      'id': 'tx-3',
      'title': 'Belanja Kebutuhan Bulanan',
      'category': 'Groceries',
      'merchant': 'Superindo Mall',
      'amount': 420000.0,
      'isExpense': true,
      'date': '20 Sep 2026, 19:40',
      'method': 'Debit BCA',
      'icon': Icons.shopping_bag_rounded,
    },
    {
      'id': 'tx-4',
      'title': 'Gaji Pokok Bulanan',
      'category': 'Income Transfer',
      'merchant': 'PT Tech Inovasi',
      'amount': 5200000.0,
      'isExpense': false,
      'date': '20 Sep 2026, 08:00',
      'method': 'Transfer Bank',
      'icon': Icons.account_balance_wallet_rounded,
    },
    {
      'id': 'tx-5',
      'title': 'Bensin Pertamax Motor',
      'category': 'Transportasi',
      'merchant': 'SPBU Pertamina',
      'amount': 50000.0,
      'isExpense': true,
      'date': '19 Sep 2026, 16:20',
      'method': 'GoPay',
      'icon': Icons.directions_car_rounded,
    },
    {
      'id': 'tx-6',
      'title': 'Langganan Spotify Family',
      'category': 'Hiburan',
      'merchant': 'Spotify Ltd',
      'amount': 75000.0,
      'isExpense': true,
      'date': '18 Sep 2026, 10:00',
      'method': 'Credit Card',
      'icon': Icons.subscriptions_rounded,
    },
    {
      'id': 'tx-7',
      'title': 'Project Freelance Mobile App',
      'category': 'Side Hustle',
      'merchant': 'Klien Mandiri',
      'amount': 750000.0,
      'isExpense': false,
      'date': '17 Sep 2026, 14:00',
      'method': 'Bank Transfer',
      'icon': Icons.laptop_chromebook_rounded,
    },
    {
      'id': 'tx-8',
      'title': 'Token Listrik PLN',
      'category': 'Tagihan',
      'merchant': 'PLN Mobile',
      'amount': 100000.0,
      'isExpense': true,
      'date': '15 Sep 2026, 11:20',
      'method': 'BCA Virtual Account',
      'icon': Icons.bolt_rounded,
    },
  ];

  @override
  void initState() {
    super.initState();
    _selectedTab = widget.initialTab;
  }

  @override
  void dispose() {
    super.dispose();
  }

  List<Map<String, dynamic>> get _filteredTransactions {
    return _mockTransactions.where((tx) {
      if (_historyFilter == 'pengeluaran' && !tx['isExpense']) return false;
      if (_historyFilter == 'pemasukan' && tx['isExpense']) return false;
      return true;
    }).toList();
  }

  double get _totalPemasukan {
    return _mockTransactions
        .where((t) => !t['isExpense'])
        .fold(0.0, (sum, t) => sum + (t['amount'] as double));
  }

  double get _totalPengeluaran {
    return _mockTransactions
        .where((t) => t['isExpense'])
        .fold(0.0, (sum, t) => sum + (t['amount'] as double));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            Padding(
              padding: const EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 12),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.lime,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: AppColors.navy,
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
                      Icons.analytics_rounded,
                      color: AppColors.navy,
                      size: 26,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Riwayat & Laporan',
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Analisis mutasi & keuangan kamu',
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                color: AppColors.textSecondary,
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Segmented Tabs Pill: [ Riwayat Transaksi ] | [ Laporan Finansial ]
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppColors.navy,
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
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTab = 0),
                        behavior: HitTestBehavior.opaque,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _selectedTab == 0 ? AppColors.lime : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                            border: _selectedTab == 0
                                ? Border.all(color: AppColors.navy, width: 2.0)
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.receipt_long_rounded,
                                size: 18,
                                color: AppColors.navy,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Riwayat',
                                style: TextStyle(
                                  color: AppColors.navy,
                                  fontWeight: _selectedTab == 0 ? FontWeight.w900 : FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTab = 1),
                        behavior: HitTestBehavior.opaque,
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: _selectedTab == 1 ? AppColors.lime : Colors.transparent,
                            borderRadius: BorderRadius.circular(12),
                            border: _selectedTab == 1
                                ? Border.all(color: AppColors.navy, width: 2.0)
                                : null,
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.pie_chart_rounded,
                                size: 18,
                                color: AppColors.navy,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                'Laporan',
                                style: TextStyle(
                                  color: AppColors.navy,
                                  fontWeight: _selectedTab == 1 ? FontWeight.w900 : FontWeight.w700,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Tab View Body
            Expanded(
              child: _selectedTab == 0
                  ? _buildHistoryView(context)
                  : _buildReportView(context),
            ),
          ],
        ),
      ),
    );
  }

  // ── VIEW 1: RIWAYAT TRANSAKSI ──────────────────────────────────────────
  Widget _buildHistoryView(BuildContext context) {
    final list = _filteredTransactions;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Mini Stat Cards (Income vs Expense)
          Row(
            children: [
              Expanded(
                child: NeoBrutalCard(
                  backgroundColor: AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Pemasukan',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppColors.blue.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Icon(Icons.arrow_downward_rounded, size: 14, color: AppColors.blue),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        currencyFormatter.format(_totalPemasukan),
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: AppColors.blue,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: NeoBrutalCard(
                  backgroundColor: AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Pengeluaran',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textSecondary,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppColors.orange.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: const Icon(Icons.arrow_upward_rounded, size: 14, color: AppColors.orange),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        currencyFormatter.format(_totalPengeluaran),
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w900,
                          color: AppColors.orange,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Filter Chips
          Row(
            children: [
              _buildFilterChip('Semua', 'semua', _mockTransactions.length),
              const SizedBox(width: 8),
              _buildFilterChip(
                'Pengeluaran',
                'pengeluaran',
                _mockTransactions.where((t) => t['isExpense']).length,
              ),
              const SizedBox(width: 8),
              _buildFilterChip(
                'Pemasukan',
                'pemasukan',
                _mockTransactions.where((t) => !t['isExpense']).length,
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Transaction Items List
          if (list.isEmpty)
            Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 40),
                child: Column(
                  children: [
                    const Icon(Icons.search_off_rounded, size: 48, color: AppColors.textSecondary),
                    const SizedBox(height: 8),
                    Text(
                      'Tidak ada transaksi ditemukan',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: AppColors.textSecondary,
                            fontWeight: FontWeight.w700,
                          ),
                    ),
                  ],
                ),
              ),
            )
          else
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: list.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final tx = list[index];
                final isExpense = tx['isExpense'] as bool;
                final amount = tx['amount'] as double;

                return NeoBrutalCard(
                  backgroundColor: AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.all(12),
                  onTap: () => _showTransactionDetail(context, tx),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: isExpense
                              ? AppColors.orange.withValues(alpha: 0.15)
                              : AppColors.lime,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppColors.navy, width: 2.0),
                        ),
                        child: Icon(
                          tx['icon'] as IconData,
                          color: AppColors.navy,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              tx['title'] as String,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: AppColors.navy,
                                fontWeight: FontWeight.w800,
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              '${tx['category']} • ${tx['method']}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: AppColors.textSecondary,
                                fontSize: 11,
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
                            '${isExpense ? '-' : '+'}${currencyFormatter.format(amount)}',
                            style: TextStyle(
                              color: isExpense ? AppColors.orange : AppColors.blue,
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            (tx['date'] as String).split(',')[0],
                            style: const TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value, int count) {
    final isSelected = _historyFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _historyFilter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navy : AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.navy, width: 2.0),
          boxShadow: isSelected
              ? const [
                  BoxShadow(color: AppColors.navy, offset: Offset(2, 2)),
                ]
              : null,
        ),
        child: Text(
          '$label ($count)',
          style: TextStyle(
            color: isSelected ? AppColors.lime : AppColors.navy,
            fontWeight: FontWeight.w800,
            fontSize: 12,
          ),
        ),
      ),
    );
  }

  // ── VIEW 2: LAPORAN KEUANGAN ───────────────────────────────────────────
  Widget _buildReportView(BuildContext context) {
    final netCashFlow = _totalPemasukan - _totalPengeluaran;
    final savingRatio = _totalPemasukan > 0
        ? ((netCashFlow / _totalPemasukan) * 100).clamp(0, 100).toDouble()
        : 0.0;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Period Picker Header
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 14,
            shadowOffset: 3,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: const [
                    Icon(Icons.calendar_month_rounded, color: AppColors.navy, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'September 2026',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontWeight: FontWeight.w900,
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.lime,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.navy, width: 1.5),
                  ),
                  child: const Text(
                    'Bulan Ini',
                    style: TextStyle(
                      color: AppColors.navy,
                      fontWeight: FontWeight.w900,
                      fontSize: 11,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),

          // Big Cash Flow / Net Savings Hero Card
          NeoBrutalCard(
            backgroundColor: AppColors.lime,
            borderRadius: 16,
            shadowOffset: 4,
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'ARUS KAS BERSIH',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontWeight: FontWeight.w900,
                        fontSize: 12,
                        letterSpacing: 1.1,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.navy,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '${savingRatio.toStringAsFixed(1)}% Saving Rate',
                        style: const TextStyle(
                          color: AppColors.lime,
                          fontWeight: FontWeight.w900,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  currencyFormatter.format(netCashFlow),
                  style: const TextStyle(
                    color: AppColors.navy,
                    fontWeight: FontWeight.w900,
                    fontSize: 28,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Surplus keuangan yang dapat dialokasikan ke tabungan & investasi.',
                  style: TextStyle(
                    color: AppColors.navy,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
                const SizedBox(height: 16),

                // Cashflow Progress Comparison
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Pemasukan: ${currencyFormatter.format(_totalPemasukan)}',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.navy),
                        ),
                        Text(
                          'Keluar: ${currencyFormatter.format(_totalPengeluaran)}',
                          style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.navy),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: SizedBox(
                        height: 10,
                        child: LinearProgressIndicator(
                          value: _totalPemasukan > 0
                              ? (_totalPengeluaran / _totalPemasukan).clamp(0.0, 1.0)
                              : 0.0,
                          backgroundColor: AppColors.white,
                          valueColor: const AlwaysStoppedAnimation<Color>(AppColors.navy),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Category Breakdown Title
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Pengeluaran per Kategori',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const Text(
                '4 Kategori',
                style: TextStyle(
                  color: AppColors.textSecondary,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Category Breakdown Cards
          _buildCategoryProgressBar(
            category: 'Groceries & Belanja',
            amount: 420000.0,
            percent: 58.5,
            icon: Icons.shopping_bag_rounded,
            color: AppColors.lime,
          ),
          const SizedBox(height: 8),
          _buildCategoryProgressBar(
            category: 'Tagihan & Listrik',
            amount: 100000.0,
            percent: 13.9,
            icon: Icons.bolt_rounded,
            color: AppColors.blue,
          ),
          const SizedBox(height: 8),
          _buildCategoryProgressBar(
            category: 'Hiburan & Langganan',
            amount: 75000.0,
            percent: 10.4,
            icon: Icons.subscriptions_rounded,
            color: AppColors.yellow,
          ),
          const SizedBox(height: 8),
          _buildCategoryProgressBar(
            category: 'Food & Beverage',
            amount: 73000.0,
            percent: 10.2,
            icon: Icons.restaurant_rounded,
            color: AppColors.orange,
          ),
          const SizedBox(height: 8),
          _buildCategoryProgressBar(
            category: 'Transportasi',
            amount: 50000.0,
            percent: 7.0,
            icon: Icons.directions_car_rounded,
            color: AppColors.blue,
          ),
          const SizedBox(height: 16),

          // CEAMIS AI Doctor Insight Card
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 14,
            shadowOffset: 3,
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppColors.lime,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.navy, width: 2.0),
                  ),
                  child: const Icon(Icons.lightbulb_rounded, color: AppColors.navy, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Rekomendasi AI Keuangan',
                        style: TextStyle(
                          color: AppColors.navy,
                          fontWeight: FontWeight.w900,
                          fontSize: 14,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Pola pengeluaranmu bulan ini sangat terkontrol dengan rasio tabungan mencapai 87.9%. Alokasikan kelebihan saldo ke tabungan darurat atau pelunasan cicilan produktif.',
                        style: TextStyle(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600,
                          fontSize: 12,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Export Button
          NeoBrutalButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: const Text('Laporan keuangan September 2026 berhasil diekspor!'),
                  backgroundColor: AppColors.navy,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              );
            },
            backgroundColor: AppColors.surface,
            textColor: AppColors.navy,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.download_rounded, size: 20),
                SizedBox(width: 8),
                Text('Unduh Ringkasan Laporan (PDF/Excel)'),
              ],
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildCategoryProgressBar({
    required String category,
    required double amount,
    required double percent,
    required IconData icon,
    required Color color,
  }) {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 12,
      shadowOffset: 2,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Column(
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.navy, width: 1.5),
                ),
                child: Icon(icon, color: AppColors.navy, size: 16),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  category,
                  style: const TextStyle(
                    color: AppColors.navy,
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
              ),
              Text(
                currencyFormatter.format(amount),
                style: const TextStyle(
                  color: AppColors.navy,
                  fontWeight: FontWeight.w900,
                  fontSize: 13,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: SizedBox(
                    height: 7,
                    child: LinearProgressIndicator(
                      value: percent / 100,
                      backgroundColor: AppColors.background,
                      valueColor: AlwaysStoppedAnimation<Color>(color == AppColors.lime ? AppColors.navy : color),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${percent.toStringAsFixed(1)}%',
                style: const TextStyle(
                  color: AppColors.textSecondary,
                  fontWeight: FontWeight.w700,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  void _showTransactionDetail(BuildContext context, Map<String, dynamic> tx) {
    final isExpense = tx['isExpense'] as bool;
    final amount = tx['amount'] as double;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: const BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            border: Border(
              top: BorderSide(color: AppColors.navy, width: 3),
              left: BorderSide(color: AppColors.navy, width: 3),
              right: BorderSide(color: AppColors.navy, width: 3),
            ),
          ),
          padding: const EdgeInsets.all(22),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 44,
                  height: 5,
                  decoration: BoxDecoration(
                    color: AppColors.navy.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Rincian Transaksi',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const SizedBox(height: 16),

              // Amount Badge
              Center(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                  decoration: BoxDecoration(
                    color: isExpense
                        ? AppColors.orange.withValues(alpha: 0.15)
                        : AppColors.lime,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.navy, width: 2),
                  ),
                  child: Text(
                    '${isExpense ? '-' : '+'}${currencyFormatter.format(amount)}',
                    style: TextStyle(
                      color: isExpense ? AppColors.orange : AppColors.navy,
                      fontWeight: FontWeight.w900,
                      fontSize: 22,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              _buildDetailRow('Deskripsi', tx['title'] as String),
              const Divider(height: 16),
              _buildDetailRow('Kategori', tx['category'] as String),
              const Divider(height: 16),
              _buildDetailRow('Merchant / Toko', tx['merchant'] as String),
              const Divider(height: 16),
              _buildDetailRow('Waktu', tx['date'] as String),
              const Divider(height: 16),
              _buildDetailRow('Metode Pembayaran', tx['method'] as String),
              const SizedBox(height: 24),

              NeoBrutalButton(
                onPressed: () => Navigator.pop(context),
                backgroundColor: AppColors.navy,
                textColor: AppColors.lime,
                child: const Text('Tutup'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: AppColors.textSecondary,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: AppColors.navy,
            fontWeight: FontWeight.w800,
            fontSize: 13,
          ),
        ),
      ],
    );
  }
}
