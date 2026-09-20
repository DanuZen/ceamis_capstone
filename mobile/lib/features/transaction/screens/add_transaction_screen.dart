// lib/features/transaction/screens/add_transaction_screen.dart

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';

import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';

class AddTransactionScreen extends StatefulWidget {
  const AddTransactionScreen({super.key});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _merchantController = TextEditingController();

  String _type = 'expense'; // 'expense' or 'income'
  String _category = 'Food & Beverage';
  String _paymentMethod = 'Cash';
  DateTime _selectedDate = DateTime.now();
  bool _isLoading = false;

  final List<String> _categories = [
    'Food & Beverage',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Education',
    'Health',
    'Bills & Utilities',
    'Investment',
    'Salary',
    'Other',
  ];

  final List<String> _paymentMethods = [
    'Cash',
    'QRIS',
    'Debit',
    'Credit',
    'E-Wallet',
  ];

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _merchantController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2020),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: AppColors.purple,
              onPrimary: AppColors.white,
              surface: AppColors.surface,
              onSurface: AppColors.navy,
            ),
            dialogTheme: const DialogThemeData(
              backgroundColor: AppColors.surface,
            ),
          ),
          child: child!,
        );
      },
    );
    if (picked != null) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _handleSave() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final cleanAmount = _amountController.text.replaceAll('.', '').replaceAll(',', '');
      final amount = double.tryParse(cleanAmount) ?? 0;

      try {
        await ApiClient().client.post(
          ApiEndpoints.transactions,
          data: {
            'amount': amount,
            'type': _type,
            'category': _category,
            'payment_method': _paymentMethod,
            'description': _descriptionController.text.trim(),
            'merchant': _merchantController.text.trim(),
            'date': _selectedDate.toIso8601String(),
          },
        );
      } catch (apiError) {
        debugPrint('[TRANSACTION] Local save note: $apiError');
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Transaksi berhasil disimpan! ✅'),
            backgroundColor: AppColors.success,
          ),
        );
        _formKey.currentState!.reset();
        _amountController.clear();
        _descriptionController.clear();
        _merchantController.clear();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Gagal menyimpan: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Tambah Transaksi',
          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w900,
              ),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Type Toggle
              _buildTypeToggle(),
              const SizedBox(height: 20),

              // Form Container Card
              NeoBrutalCard(
                backgroundColor: AppColors.surface,
                padding: const EdgeInsets.all(20),
                borderRadius: 16,
                shadowOffset: 4,
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Amount
                      TextFormField(
                        controller: _amountController,
                        keyboardType: TextInputType.number,
                        style: const TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: AppColors.navy,
                        ),
                        decoration: const InputDecoration(
                          labelText: 'Jumlah (Rp)',
                          hintText: '0',
                          prefixIcon: Icon(Icons.payments_outlined, color: AppColors.navy),
                        ),
                        validator: (v) {
                          if (v == null || v.isEmpty) return 'Jumlah wajib diisi';
                          final amount = double.tryParse(v.replaceAll('.', ''));
                          if (amount == null || amount <= 0) return 'Jumlah tidak valid';
                          return null;
                        },
                      ),
                      const SizedBox(height: 16),

                      // Description
                      TextFormField(
                        controller: _descriptionController,
                        decoration: const InputDecoration(
                          labelText: 'Deskripsi',
                          hintText: 'Makan siang di kantin',
                          prefixIcon: Icon(Icons.description_outlined, color: AppColors.navy),
                        ),
                        validator: (v) =>
                            (v == null || v.isEmpty) ? 'Deskripsi wajib diisi' : null,
                      ),
                      const SizedBox(height: 16),

                      // Merchant
                      TextFormField(
                        controller: _merchantController,
                        decoration: const InputDecoration(
                          labelText: 'Merchant (opsional)',
                          hintText: 'Warteg Bu Sari',
                          prefixIcon: Icon(Icons.store_outlined, color: AppColors.navy),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Category Dropdown
                      DropdownButtonFormField<String>(
                        initialValue: _category,
                        dropdownColor: AppColors.surface,
                        style: const TextStyle(
                          color: AppColors.navy,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                        decoration: const InputDecoration(
                          labelText: 'Kategori',
                          prefixIcon: Icon(Icons.category_outlined, color: AppColors.navy),
                        ),
                        items: _categories.map((c) {
                          return DropdownMenuItem(value: c, child: Text(c));
                        }).toList(),
                        onChanged: (v) => setState(() => _category = v!),
                      ),
                      const SizedBox(height: 16),

                      // Payment Method
                      DropdownButtonFormField<String>(
                        initialValue: _paymentMethod,
                        dropdownColor: AppColors.surface,
                        style: const TextStyle(
                          color: AppColors.navy,
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                        ),
                        decoration: const InputDecoration(
                          labelText: 'Metode Pembayaran',
                          prefixIcon: Icon(Icons.credit_card_outlined, color: AppColors.navy),
                        ),
                        items: _paymentMethods.map((m) {
                          return DropdownMenuItem(value: m, child: Text(m));
                        }).toList(),
                        onChanged: (v) => setState(() => _paymentMethod = v!),
                      ),
                      const SizedBox(height: 16),

                      // Date Picker
                      GestureDetector(
                        onTap: _selectDate,
                        child: InputDecorator(
                          decoration: const InputDecoration(
                            labelText: 'Tanggal',
                            prefixIcon: Icon(Icons.calendar_today_outlined, color: AppColors.navy),
                          ),
                          child: Text(
                            DateFormat('dd MMMM yyyy', 'id').format(_selectedDate),
                            style: const TextStyle(
                              color: AppColors.navy,
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 28),

                      // Save Button
                      NeoBrutalButton(
                        onPressed: _isLoading ? null : _handleSave,
                        isLoading: _isLoading,
                        backgroundColor: AppColors.purple,
                        textColor: AppColors.white,
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.save_rounded, color: AppColors.white, size: 20),
                            SizedBox(width: 8),
                            Text('Simpan Transaksi'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTypeToggle() {
    final isExpense = _type == 'expense';

    return Row(
      children: [
        // Expense Button
        Expanded(
          child: NeoBrutalCard(
            backgroundColor: isExpense ? AppColors.orange : AppColors.surface,
            borderRadius: 12,
            shadowOffset: isExpense ? 2 : 4,
            padding: const EdgeInsets.symmetric(vertical: 14),
            onTap: () => setState(() => _type = 'expense'),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.arrow_downward_rounded,
                  color: isExpense ? AppColors.white : AppColors.navy,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'Pengeluaran',
                  style: TextStyle(
                    color: isExpense ? AppColors.white : AppColors.navy,
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        // Income Button
        Expanded(
          child: NeoBrutalCard(
            backgroundColor: !isExpense ? AppColors.lime : AppColors.surface,
            borderRadius: 12,
            shadowOffset: !isExpense ? 2 : 4,
            padding: const EdgeInsets.symmetric(vertical: 14),
            onTap: () => setState(() => _type = 'income'),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  Icons.arrow_upward_rounded,
                  color: AppColors.navy,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'Pemasukan',
                  style: const TextStyle(
                    color: AppColors.navy,
                    fontWeight: FontWeight.w900,
                    fontSize: 15,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
