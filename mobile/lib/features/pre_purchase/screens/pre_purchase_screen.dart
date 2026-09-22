// lib/features/pre_purchase/screens/pre_purchase_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';
import '../../../core/widgets/ceamis_app_bar.dart';
import '../models/wishlist_model.dart';
import '../providers/pre_purchase_provider.dart';
import 'pre_purchase_result_screen.dart';

/// Smart Wishlist & Hub Evaluasi Rencana Belanja
/// Menilai apakah aman secara finansial untuk mewujudkan impian belanja pengguna
/// berdasarkan sisa kuota pos anggaran yang telah ditentukan.
class PrePurchaseScreen extends ConsumerStatefulWidget {
  const PrePurchaseScreen({super.key});

  @override
  ConsumerState<PrePurchaseScreen> createState() => _PrePurchaseScreenState();
}

class _PrePurchaseScreenState extends ConsumerState<PrePurchaseScreen> {
  String _activeFilter = 'semua'; // 'semua', 'ready', 'overbudget'

  final currencyFormatter = NumberFormat.currency(
    locale: 'id_ID',
    symbol: 'Rp ',
    decimalDigits: 0,
  );

  void _openAddWishlistModal(BuildContext context) {
    final titleCtrl = TextEditingController();
    final priceCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    String selectedCategory = 'Shopping & Fashion';
    final formKey = GlobalKey<FormState>();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (modalContext, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(modalContext).viewInsets.bottom,
              ),
              child: Container(
                decoration: const BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  border: Border(
                    top: BorderSide(color: AppColors.navy, width: 2.5),
                    left: BorderSide(color: AppColors.navy, width: 2.5),
                    right: BorderSide(color: AppColors.navy, width: 2.5),
                  ),
                ),
                padding: const EdgeInsets.all(22),
                child: Form(
                  key: formKey,
                  child: SingleChildScrollView(
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
                        const SizedBox(height: 16),
                        Row(
                          children: const [
                            Icon(Icons.bookmark_add_rounded, color: AppColors.navy, size: 24),
                            SizedBox(width: 8),
                            Text(
                              'Tambah Wishlist Impian',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          'Catat barang yang kamu inginkan. AI akan menganalisis apakah aman dibeli dengan anggaranmu saat ini.',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 18),

                        // Nama Barang
                        TextFormField(
                          controller: titleCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Nama Barang / Impian',
                            hintText: 'Misal: AirPods Pro, Jaket Uniqlo',
                            prefixIcon: Icon(Icons.shopping_bag_outlined, color: AppColors.navy),
                          ),
                          validator: (v) => (v == null || v.isEmpty) ? 'Nama barang wajib diisi' : null,
                        ),
                        const SizedBox(height: 14),

                        // Estimasi Harga
                        TextFormField(
                          controller: priceCtrl,
                          keyboardType: TextInputType.number,
                          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                          decoration: const InputDecoration(
                            labelText: 'Perkiraan Harga (Rp)',
                            hintText: '0',
                            prefixIcon: Icon(Icons.payments_outlined, color: AppColors.navy),
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) return 'Harga wajib diisi';
                            final val = double.tryParse(v);
                            if (val == null || val <= 0) return 'Nominal harus lebih dari 0';
                            return null;
                          },
                        ),
                        const SizedBox(height: 14),

                        // Kategori Dropdown
                        DropdownButtonFormField<String>(
                          initialValue: selectedCategory,
                          decoration: const InputDecoration(
                            labelText: 'Kategori / Pos Penggunaan',
                            prefixIcon: Icon(Icons.category_outlined, color: AppColors.navy),
                          ),
                          items: const [
                            DropdownMenuItem(value: 'Shopping & Fashion', child: Text('Shopping & Fashion')),
                            DropdownMenuItem(value: 'Gadget & Elektronik', child: Text('Gadget & Elektronik')),
                            DropdownMenuItem(value: 'Liburan & Healing', child: Text('Liburan & Healing')),
                            DropdownMenuItem(value: 'Hobi & Hiburan', child: Text('Hobi & Hiburan')),
                            DropdownMenuItem(value: 'Aksesoris', child: Text('Aksesoris')),
                          ],
                          onChanged: (val) {
                            if (val != null) setModalState(() => selectedCategory = val);
                          },
                        ),
                        const SizedBox(height: 14),

                        // Alasan Menginginkan
                        TextFormField(
                          controller: notesCtrl,
                          decoration: const InputDecoration(
                            labelText: 'Alasan / Motivasi (Opsional)',
                            hintText: 'Kenapa kamu menginginkan barang ini?',
                            prefixIcon: Icon(Icons.note_alt_outlined, color: AppColors.navy),
                          ),
                        ),
                        const SizedBox(height: 22),

                        // Tombol Submit
                        NeoBrutalButton(
                          onPressed: () {
                            if (!formKey.currentState!.validate()) return;
                            final price = double.tryParse(priceCtrl.text) ?? 0;
                            ref.read(prePurchaseProvider.notifier).addWishlistItem(
                              title: titleCtrl.text.trim(),
                              estimatedPrice: price,
                              categoryName: selectedCategory,
                              notes: notesCtrl.text.trim(),
                            );
                            Navigator.pop(ctx);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Item berhasil ditambahkan ke Wishlist!'),
                                backgroundColor: AppColors.navy,
                              ),
                            );
                          },
                          backgroundColor: AppColors.lime,
                          textColor: AppColors.navy,
                          child: const Text('Simpan ke Wishlist ➔'),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _evaluateWishlistItem(WishlistItem item) async {
    final result = await ref.read(prePurchaseProvider.notifier).checkRisk(
      amount: item.estimatedPrice,
      categoryId: item.categoryName.toLowerCase(),
      categoryName: item.categoryName,
      merchantName: item.title,
      notes: item.notes ?? '',
    );

    if (!mounted || result == null) return;

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => PrePurchaseResultScreen(
          plannedAmount: result.plannedAmount,
          categoryName: result.categoryName,
          merchantName: result.merchantName,
          riskScore: result.riskScore,
          riskLevel: result.riskLevel,
          triggerFactors: result.triggerFactors,
          budgetLimit: result.budgetLimit,
          budgetRemainingBefore: result.budgetRemainingBefore,
          budgetRemainingAfter: result.budgetRemainingAfter,
          savingsDelayedDays: result.savingsDelayedDays,
          savingsGoalTitle: result.savingsGoalTitle,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(prePurchaseProvider);
    final items = state.wishlistItems;
    final budgetStatus = state.budgetStatus;

    final filteredItems = items.where((it) {
      if (_activeFilter == 'ready') return it.readiness == WishlistReadiness.ready;
      if (_activeFilter == 'overbudget') return it.readiness == WishlistReadiness.overbudget;
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── 1. Header ──────────────────────────────────────────────
              _buildHeader(context),
              const SizedBox(height: 18),

              // ── 2. Status Alokasi Anggaran Bulanan ──────────────────────
              _buildBudgetAllocationCard(budgetStatus),
              const SizedBox(height: 20),

              // ── 3. Filter Chips (Semua / Aman / Overbudget) ────────────
              _buildFilterChips(items),
              const SizedBox(height: 14),

              // ── 4. Wishlist List Cards ─────────────────────────────────
              if (filteredItems.isEmpty)
                _buildEmptyState()
              else
                ...filteredItems.map((item) => _buildWishlistCard(context, item)),

              const SizedBox(height: 20),

              // ── 5. Add Wishlist Button ─────────────────────────────────
              NeoBrutalButton(
                onPressed: () => _openAddWishlistModal(context),
                backgroundColor: AppColors.lime,
                textColor: AppColors.navy,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.add_circle_outline_rounded, color: AppColors.navy, size: 20),
                    SizedBox(width: 8),
                    Text(
                      'Tambah Wishlist Impian Baru',
                      style: TextStyle(fontWeight: FontWeight.w900),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return const CeamisAppBar(title: 'Wishlist');
  }

  Widget _buildBudgetAllocationCard(WishlistBudgetStatus status) {
    final spentRatio = (status.monthlyWantsSpent / status.monthlyWantsLimit).clamp(0.0, 1.0);

    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 16,
      shadowOffset: 3.5,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: const [
                  Icon(Icons.pie_chart_rounded, size: 16, color: AppColors.navy),
                  SizedBox(width: 6),
                  Text(
                    'POS ALOKASI KEINGINAN (WANTS)',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppColors.lime,
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppColors.navy, width: 1.5),
                ),
                child: const Text(
                  '71% Terpakai',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: AppColors.navy),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),

          // Sisa Kuota Saat Ini
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Sisa Kuota Belanja Bulan Ini',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
                  ),
                  Text(
                    currencyFormatter.format(status.monthlyWantsRemaining),
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                      letterSpacing: -0.5,
                    ),
                  ),
                ],
              ),
              Text(
                'dari ${currencyFormatter.format(status.monthlyWantsLimit)}',
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Progress Bar Kuota
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: SizedBox(
              height: 8,
              child: LinearProgressIndicator(
                value: spentRatio,
                backgroundColor: const Color(0xFFE2E8F0),
                valueColor: const AlwaysStoppedAnimation<Color>(AppColors.navy),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Seluruh item Wishlist diuji terhadap sisa kuota ini agar tidak mengganggu pos tabungan pokok.',
            style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips(List<WishlistItem> all) {
    final readyCount = all.where((it) => it.readiness == WishlistReadiness.ready).length;
    final overCount = all.where((it) => it.readiness == WishlistReadiness.overbudget).length;

    return Row(
      children: [
        _buildChip('Semua (${all.length})', 'semua'),
        const SizedBox(width: 8),
        _buildChip('Aman Dibeli ($readyCount)', 'ready', color: const Color(0xFF16A34A)),
        const SizedBox(width: 8),
        _buildChip('Overbudget ($overCount)', 'overbudget', color: const Color(0xFFDC2626)),
      ],
    );
  }

  Widget _buildChip(String label, String value, {Color? color}) {
    final isSelected = _activeFilter == value;
    return GestureDetector(
      onTap: () => setState(() => _activeFilter = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navy : AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.navy, width: 1.8),
          boxShadow: isSelected
              ? const [
                  BoxShadow(color: AppColors.navy, offset: Offset(1.5, 1.5), blurRadius: 0),
                ]
              : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? AppColors.lime : (color ?? AppColors.navy),
            fontWeight: FontWeight.w800,
            fontSize: 11,
          ),
        ),
      ),
    );
  }

  Widget _buildWishlistCard(BuildContext context, WishlistItem item) {
    final isReady = item.readiness == WishlistReadiness.ready;

    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      margin: const EdgeInsets.only(bottom: 12),
      borderRadius: 14,
      shadowOffset: 3,
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: item.iconBg,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppColors.navy, width: 2.0),
                ),
                child: Icon(item.icon, color: AppColors.navy, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w900,
                        color: AppColors.navy,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      '${item.categoryName}${item.notes != null ? ' • ${item.notes}' : ''}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),
              GestureDetector(
                onTap: () => ref.read(prePurchaseProvider.notifier).deleteWishlistItem(item.id),
                child: const Icon(Icons.close_rounded, size: 18, color: AppColors.textSecondary),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Harga & Status Badge Guardrail
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                currencyFormatter.format(item.estimatedPrice),
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                ),
              ),

              // Status Badge
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: isReady
                      ? const Color(0xFFDCFCE7) // soft green
                      : const Color(0xFFFEE2E2), // soft red
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: isReady ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                    width: 1.5,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      isReady ? Icons.check_circle_rounded : Icons.warning_rounded,
                      size: 14,
                      color: isReady ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      isReady ? 'AMAN DIBELI' : 'OVERBUDGET (-${currencyFormatter.format(item.deficitAmount)})',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w900,
                        color: isReady ? const Color(0xFF16A34A) : const Color(0xFFDC2626),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Action Button: Uji Kelayakan & Dampak Finansial
          GestureDetector(
            onTap: () => _evaluateWishlistItem(item),
            behavior: HitTestBehavior.opaque,
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
              decoration: BoxDecoration(
                color: isReady ? AppColors.lime : const Color(0xFFFEF08A),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.navy, width: 1.8),
                boxShadow: const [
                  BoxShadow(color: AppColors.navy, offset: Offset(2, 2), blurRadius: 0),
                ],
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    isReady ? Icons.insights_rounded : Icons.shield_rounded,
                    size: 16,
                    color: AppColors.navy,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    isReady ? 'Cek Rincian Kesiapan Belanja ➔' : 'Cek Peringatan Ketat & Dampak ➔',
                    style: const TextStyle(
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
    );
  }

  Widget _buildEmptyState() {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      borderRadius: 14,
      padding: const EdgeInsets.all(24),
      child: Center(
        child: Column(
          children: const [
            Icon(Icons.inventory_2_outlined, size: 36, color: AppColors.textSecondary),
            SizedBox(height: 10),
            Text(
              'Belum ada impian di kategori ini',
              style: TextStyle(fontWeight: FontWeight.w800, color: AppColors.navy),
            ),
            SizedBox(height: 4),
            Text(
              'Tambahkan barang yang ingin kamu beli untuk diuji kelayakannya.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
