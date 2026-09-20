// lib/features/pre_purchase/screens/pre_purchase_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';


import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';
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
    {'name': 'Shopping', 'icon': Icons.shopping_bag_rounded, 'color': AppColors.pink},
    {'name': 'F&B', 'icon': Icons.restaurant_rounded, 'color': AppColors.orange},
    {'name': 'Entertainment', 'icon': Icons.movie_rounded, 'color': AppColors.purple},
    {'name': 'Transport', 'icon': Icons.directions_car_rounded, 'color': AppColors.cyan},
    {'name': 'Education', 'icon': Icons.school_rounded, 'color': AppColors.lime},
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
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
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
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Category Selector
                    _buildCategorySelector(context),
                    const SizedBox(height: 20),

                    // Amount Input
                    _buildAmountInput(context),
                    const SizedBox(height: 16),

                    // Merchant Input
                    _buildMerchantInput(context),
                    const SizedBox(height: 16),

                    // Notes Input
                    _buildNotesInput(context),
                    const SizedBox(height: 28),

                    // Submit Button
                    ScaleTransition(
                      scale: _pulseAnimation,
                      child: NeoBrutalButton(
                        onPressed: _isLoading ? null : _handleSubmit,
                        isLoading: _isLoading,
                        backgroundColor: AppColors.purple,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: const [
                            Icon(Icons.shield_rounded, color: AppColors.white, size: 22),
                            SizedBox(width: 10),
                            Text('Cek Risiko Sekarang'),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
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
                'Pikirkan sebelum membeli ✨',
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
      backgroundColor: AppColors.lime.withValues(alpha: 0.15),
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
                    fontWeight: FontWeight.w600,
                    height: 1.4,
                  ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySelector(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Kategori',
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w800,
                color: AppColors.navy,
              ),
        ),
        const SizedBox(height: 10),
        SizedBox(
          height: 90,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: _categories.length,
            separatorBuilder: (context2, index2) => const SizedBox(width: 10),
            itemBuilder: (context, index) {
              final cat = _categories[index];
              final isSelected = _selectedCategory == cat['name'];
              return GestureDetector(
                onTap: () => setState(() => _selectedCategory = cat['name']),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 80,
                  decoration: BoxDecoration(
                    color: isSelected ? (cat['color'] as Color).withValues(alpha: 0.15) : AppColors.surface,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: isSelected ? cat['color'] : AppColors.border,
                      width: AppColors.borderWidth,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isSelected ? cat['color'] : AppColors.navy,
                        offset: Offset(isSelected ? 3 : 2, isSelected ? 3 : 2),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        cat['icon'] as IconData,
                        color: isSelected ? cat['color'] : AppColors.textSecondary,
                        size: 28,
                      ),
                      const SizedBox(height: 6),
                      Text(
                        cat['name'] as String,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                          color: isSelected ? AppColors.navy : AppColors.textSecondary,
                        ),
                        textAlign: TextAlign.center,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildAmountInput(BuildContext context) {
    return NeoBrutalCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Nominal Rencana Belanja',
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                ),
          ),
          const SizedBox(height: 10),
          TextFormField(
            controller: _amountController,
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                ),
            decoration: InputDecoration(
              prefixText: 'Rp ',
              prefixStyle: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w900,
                    color: AppColors.textSecondary,
                  ),
              hintText: '0',
              filled: true,
              fillColor: AppColors.background,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Masukkan nominal';
              final amount = double.tryParse(value.replaceAll(RegExp(r'[^\d]'), ''));
              if (amount == null || amount <= 0) return 'Nominal harus lebih dari 0';
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMerchantInput(BuildContext context) {
    return TextFormField(
      controller: _merchantController,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        color: AppColors.navy,
      ),
      decoration: const InputDecoration(
        labelText: 'Nama Merchant (opsional)',
        hintText: 'Contoh: Uniqlo, Starbucks',
        prefixIcon: Icon(Icons.storefront_rounded),
      ),
    );
  }

  Widget _buildNotesInput(BuildContext context) {
    return TextFormField(
      controller: _notesController,
      maxLines: 2,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        color: AppColors.navy,
      ),
      decoration: const InputDecoration(
        labelText: 'Catatan (opsional)',
        hintText: 'Alasan rencana belanja...',
        prefixIcon: Icon(Icons.note_rounded),
      ),
    );
  }
}
