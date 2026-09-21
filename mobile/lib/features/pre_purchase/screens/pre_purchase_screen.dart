// lib/features/pre_purchase/screens/pre_purchase_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';
import '../../../core/widgets/neo_brutal_dropdown.dart';
import '../providers/pre_purchase_provider.dart';
import 'pre_purchase_result_screen.dart';

/// Pre-Purchase Check Screen — Form Input rencana belanja
/// Fitur inti CEAMIS 2.0 dengan gaya Neo-Brutalism.
class PrePurchaseScreen extends ConsumerStatefulWidget {
  const PrePurchaseScreen({super.key});

  @override
  ConsumerState<PrePurchaseScreen> createState() => _PrePurchaseScreenState();
}

class _PrePurchaseScreenState extends ConsumerState<PrePurchaseScreen>
    with SingleTickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _merchantController = TextEditingController();
  final _notesController = TextEditingController();

  String _selectedCategory = 'Shopping';
  bool _isLoading = false;

  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  final List<Map<String, dynamic>> _categories = [
    {'name': 'Shopping', 'icon': Icons.shopping_bag_rounded, 'color': AppColors.lime},
    {'name': 'F&B', 'icon': Icons.restaurant_rounded, 'color': AppColors.orange},
    {'name': 'Entertainment', 'icon': Icons.movie_rounded, 'color': AppColors.blue},
    {'name': 'Transport', 'icon': Icons.directions_car_rounded, 'color': AppColors.yellow},
    {'name': 'Tagihan', 'icon': Icons.receipt_long_rounded, 'color': AppColors.blue},
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    )..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.05).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _amountController.dispose();
    _merchantController.dispose();
    _notesController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final amount = double.tryParse(
      _amountController.text.replaceAll(RegExp(r'[^\d]'), ''),
    ) ?? 0;

    final result = await ref.read(prePurchaseProvider.notifier).checkRisk(
      amount: amount,
      categoryId: _selectedCategory.toLowerCase(),
      categoryName: _selectedCategory,
      merchantName: _merchantController.text.trim(),
      notes: _notesController.text.trim(),
    );

    if (!mounted) return;
    setState(() => _isLoading = false);

    if (result != null) {
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
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20, bottom: 120),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              _buildHeader(context),
              const SizedBox(height: 24),

              // Info Banner
              _buildInfoBanner(),
              const SizedBox(height: 24),

              // Form
              Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Unified Form Card with Harmonized Field Sizes
                    NeoBrutalCard(
                      backgroundColor: AppColors.surface,
                      padding: const EdgeInsets.all(20),
                      borderRadius: 16,
                      shadowOffset: 4,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // 1. Nominal Input (Standardized Size)
                          _buildAmountInput(context),
                          const SizedBox(height: 16),

                          // 2. Kategori Dropdown (The 4+ categories in a clean dropdown)
                          _buildCategoryDropdown(context),
                          const SizedBox(height: 16),

                          // 3. Merchant Input (Standardized Size)
                          _buildMerchantInput(context),
                          const SizedBox(height: 16),

                          // 4. Notes Input (Standardized Size)
                          _buildNotesInput(context),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Submit Button
                    ScaleTransition(
                      scale: _pulseAnimation,
                      child: NeoBrutalButton(
                        onPressed: _isLoading ? null : _handleSubmit,
                        isLoading: _isLoading,
                        backgroundColor: AppColors.lime,
                        textColor: AppColors.navy,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.shield_rounded, color: AppColors.navy, size: 22),
                            SizedBox(width: 10),
                            Text(
                              'Cek Risiko Sekarang',
                              style: TextStyle(
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.purple,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border, width: AppColors.borderWidth),
            boxShadow: const [
              BoxShadow(color: AppColors.navy, offset: Offset(3, 3), blurRadius: 0),
            ],
          ),
          child: const Icon(Icons.shield_rounded, color: AppColors.white, size: 26),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Cek Pra-Pembelian',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              Text(
                'Pikirkan sebelum membeli',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
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

  Widget _buildInfoBanner() {
    return NeoBrutalCard(
      backgroundColor: AppColors.surface,
      padding: const EdgeInsets.all(14),
      shadowOffset: 3,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.lime,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: AppColors.border, width: 2),
            ),
            child: const Icon(Icons.lightbulb_rounded, color: AppColors.navy, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              'Masukkan rencana belanjamu untuk mengecek tingkat risiko keuangan sebelum memutuskan.',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.navy,
                    fontWeight: FontWeight.w700,
                    height: 1.4,
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryDropdown(BuildContext context) {
    return NeoBrutalDropdown<String>(
      label: 'Kategori',
      value: _selectedCategory,
      prefixIcon: Icons.category_outlined,
      items: _categories.map((cat) {
        return NeoDropdownItem<String>(
          value: cat['name'] as String,
          label: cat['name'] as String,
          icon: cat['icon'] as IconData,
          color: cat['color'] as Color?,
        );
      }).toList(),
      onChanged: (val) {
        setState(() => _selectedCategory = val);
      },
    );
  }

  Widget _buildAmountInput(BuildContext context) {
    return TextFormField(
      controller: _amountController,
      keyboardType: TextInputType.number,
      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      style: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w800,
        color: AppColors.navy,
      ),
      decoration: const InputDecoration(
        labelText: 'Nominal Belanja (Rp)',
        hintText: '0',
        prefixIcon: Icon(Icons.payments_outlined, color: AppColors.navy),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) return 'Masukkan nominal belanja';
        final amount = double.tryParse(value.replaceAll(RegExp(r'[^\d]'), ''));
        if (amount == null || amount <= 0) return 'Nominal harus lebih dari 0';
        return null;
      },
    );
  }

  Widget _buildMerchantInput(BuildContext context) {
    return TextFormField(
      controller: _merchantController,
      style: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.navy,
      ),
      decoration: const InputDecoration(
        labelText: 'Nama Merchant (Opsional)',
        hintText: 'Contoh: Uniqlo, Starbucks, Netflix',
        prefixIcon: Icon(Icons.storefront_outlined, color: AppColors.navy),
      ),
    );
  }

  Widget _buildNotesInput(BuildContext context) {
    return TextFormField(
      controller: _notesController,
      style: const TextStyle(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.navy,
      ),
      decoration: const InputDecoration(
        labelText: 'Catatan (Opsional)',
        hintText: 'Alasan rencana belanja...',
        prefixIcon: Icon(Icons.note_alt_outlined, color: AppColors.navy),
      ),
    );
  }
}
