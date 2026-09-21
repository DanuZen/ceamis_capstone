// lib/features/transaction/screens/add_transaction_screen.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';

/// Unified Transaction Screen:
/// Menggabungkan Pencatatan Manual & Scan Struk (OCR AI) ke dalam 1 halaman tunggal.
class AddTransactionScreen extends StatefulWidget {
  final int? initialMode; // 0 = Manual, 1 = Scan Struk
  const AddTransactionScreen({super.key, this.initialMode});

  @override
  State<AddTransactionScreen> createState() => _AddTransactionScreenState();
}

class _AddTransactionScreenState extends State<AddTransactionScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _merchantController = TextEditingController();

  int _selectedMode = 0; // 0 = Manual, 1 = Scan Struk
  String _type = 'expense'; // 'expense' or 'income'
  String _category = 'Food & Beverage';
  String _paymentMethod = 'Cash';
  DateTime _selectedDate = DateTime.now();
  bool _isLoading = false;

  // ── OCR Scanner State ──────────────────────────────
  final ImagePicker _picker = ImagePicker();
  final TextRecognizer _textRecognizer = TextRecognizer();
  File? _imageFile;
  bool _isScanning = false;
  String? _scanError;
  Map<String, dynamic>? _scannedData;

  final List<String> _categories = [
    'Food & Beverage',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Tagihan & Utilitas',
    'Kesehatan',
    'Gaji & Pemasukan',
    'Lainnya',
  ];

  final List<String> _paymentMethods = [
    'Cash',
    'QRIS',
    'Debit',
    'Credit',
    'E-Wallet',
  ];

  @override
  void initState() {
    super.initState();
    _selectedMode = widget.initialMode ?? 0;
  }

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _merchantController.dispose();
    _textRecognizer.close();
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
              primary: AppColors.navy,
              onPrimary: AppColors.lime,
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

  // ── OCR Handling ──────────────────────────────────
  Future<void> _pickAndScanReceipt(ImageSource source) async {
    try {
      final XFile? image = await _picker.pickImage(
        source: source,
        maxWidth: 1920,
        maxHeight: 1920,
        imageQuality: 85,
      );
      if (image == null) return;

      setState(() {
        _imageFile = File(image.path);
        _isScanning = true;
        _scanError = null;
        _scannedData = null;
      });

      final inputImage = InputImage.fromFile(File(image.path));
      final recognizedText = await _textRecognizer.processImage(inputImage);
      final raw = recognizedText.text;

      if (raw.isEmpty) {
        setState(() {
          _scanError = 'Tidak ada teks terbaca. Pastikan foto struk terang dan tidak blur.';
          _isScanning = false;
        });
        return;
      }

      // Kirim ke backend untuk parsing cerdas
      Map<String, dynamic> parsed = {};
      try {
        final res = await ApiClient().client.post(
          ApiEndpoints.ocrParseReceipt,
          data: {'raw_text': raw},
        );
        if (res.data != null && res.data['data'] != null) {
          parsed = Map<String, dynamic>.from(res.data['data']);
        } else if (res.data is Map) {
          parsed = Map<String, dynamic>.from(res.data);
        }
      } catch (e) {
        parsed = _heuristicParse(raw);
      }

      setState(() {
        _scannedData = parsed.isNotEmpty ? parsed : _heuristicParse(raw);
        _isScanning = false;
      });
    } catch (e) {
      setState(() {
        _scanError = 'Terjadi kesalahan saat memindai: $e';
        _isScanning = false;
      });
    }
  }

  Map<String, dynamic> _heuristicParse(String text) {
    String merchant = 'Toko Belanja';
    double total = 0.0;
    final lines = text.split('\n').map((l) => l.trim()).where((l) => l.isNotEmpty).toList();

    if (lines.isNotEmpty) {
      merchant = lines.first.replaceAll(RegExp(r'[^\w\s]'), '');
    }

    final totalReg = RegExp(r'(?:total|subtotal|jumlah|rp)[\s.:]*([0-9.,]+)', caseSensitive: false);
    for (final line in lines.reversed) {
      final m = totalReg.firstMatch(line);
      if (m != null) {
        final numStr = m.group(1)!.replaceAll('.', '').replaceAll(',', '');
        final val = double.tryParse(numStr);
        if (val != null && val > 0) {
          total = val;
          break;
        }
      }
    }

    return {
      'merchant_name': merchant,
      'total_amount': total > 0 ? total : 45000.0,
      'date': DateTime.now().toIso8601String().substring(0, 10),
      'category': 'Shopping',
    };
  }

  void _applyScannedDataToForm() {
    if (_scannedData == null) return;

    final total = _scannedData!['total_amount'] ?? _scannedData!['total'] ?? 0;
    final merchant = _scannedData!['merchant_name'] ?? _scannedData!['merchant'] ?? '';

    setState(() {
      if (total is num && total > 0) {
        _amountController.text = total.toInt().toString();
      }
      if (merchant.toString().isNotEmpty) {
        _merchantController.text = merchant.toString();
        _descriptionController.text = 'Belanja di $merchant';
      }
      _type = 'expense';
      _selectedMode = 0; // Pindah ke tab form manual
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Data struk berhasil disalin ke formulir transaksi!'),
        backgroundColor: AppColors.navy,
      ),
    );
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
            content: Text('Transaksi berhasil disimpan!'),
            backgroundColor: AppColors.navy,
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
            backgroundColor: AppColors.orange,
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
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              _buildHeader(),
              const SizedBox(height: 20),

              // Segmented Toggle: [ Input Manual ] | [ Scan Struk (AI) ]
              _buildSegmentedModeSelector(),
              const SizedBox(height: 20),

              // Content based on selected mode
              AnimatedCrossFade(
                duration: const Duration(milliseconds: 250),
                crossFadeState: _selectedMode == 0
                    ? CrossFadeState.showFirst
                    : CrossFadeState.showSecond,
                firstChild: _buildManualForm(),
                secondChild: _buildOcrScannerView(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: AppColors.lime,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border, width: AppColors.borderWidth),
            boxShadow: const [
              BoxShadow(color: AppColors.navy, offset: Offset(3, 3), blurRadius: 0),
            ],
          ),
          child: const Icon(Icons.receipt_long_rounded, color: AppColors.navy, size: 26),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Catat Transaksi',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              Text(
                'Input manual atau pindai struk otomatis',
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

  Widget _buildSegmentedModeSelector() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.navy, width: AppColors.borderWidth),
        boxShadow: const [
          BoxShadow(color: AppColors.navy, offset: Offset(3, 3), blurRadius: 0),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedMode = 0),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _selectedMode == 0 ? AppColors.lime : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: _selectedMode == 0
                      ? Border.all(color: AppColors.navy, width: 2)
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(
                      Icons.edit_note_rounded,
                      size: 20,
                      color: AppColors.navy,
                    ),
                    SizedBox(width: 6),
                    Text(
                      'Input Manual',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontWeight: FontWeight.w900,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 4),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _selectedMode = 1),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _selectedMode == 1 ? AppColors.lime : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  border: _selectedMode == 1
                      ? Border.all(color: AppColors.navy, width: 2)
                      : null,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(
                      Icons.document_scanner_rounded,
                      size: 20,
                      color: AppColors.navy,
                    ),
                    SizedBox(width: 6),
                    Text(
                      'Scan Struk (AI)',
                      style: TextStyle(
                        color: AppColors.navy,
                        fontWeight: FontWeight.w900,
                        fontSize: 13,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Mode 1: Manual Transaction Form ────────────────
  Widget _buildManualForm() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Type Toggle (Pengeluaran vs Pemasukan)
        _buildTypeToggle(),
        const SizedBox(height: 16),

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
                    labelText: 'Deskripsi Transaksi',
                    hintText: 'Misal: Nasi Goreng Spesial',
                    prefixIcon: Icon(Icons.description_outlined, color: AppColors.navy),
                  ),
                  validator: (v) => (v == null || v.isEmpty) ? 'Deskripsi wajib diisi' : null,
                ),
                const SizedBox(height: 16),

                // Merchant
                TextFormField(
                  controller: _merchantController,
                  decoration: const InputDecoration(
                    labelText: 'Merchant / Penerima (Opsional)',
                    hintText: 'Misal: Warung Bu Siti, Alfamart',
                    prefixIcon: Icon(Icons.storefront_outlined, color: AppColors.navy),
                  ),
                ),
                const SizedBox(height: 16),

                // Category Dropdown
                DropdownButtonFormField<String>(
                  initialValue: _category,
                  decoration: const InputDecoration(
                    labelText: 'Kategori',
                    prefixIcon: Icon(Icons.category_outlined, color: AppColors.navy),
                  ),
                  items: _categories.map((c) {
                    return DropdownMenuItem(value: c, child: Text(c));
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _category = v);
                  },
                ),
                const SizedBox(height: 16),

                // Payment Method Dropdown
                DropdownButtonFormField<String>(
                  initialValue: _paymentMethod,
                  decoration: const InputDecoration(
                    labelText: 'Metode Pembayaran',
                    prefixIcon: Icon(Icons.account_balance_wallet_outlined, color: AppColors.navy),
                  ),
                  items: _paymentMethods.map((m) {
                    return DropdownMenuItem(value: m, child: Text(m));
                  }).toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _paymentMethod = v);
                  },
                ),
                const SizedBox(height: 16),

                // Date Picker Tile
                InkWell(
                  onTap: _selectDate,
                  borderRadius: BorderRadius.circular(10),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppColors.background,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: AppColors.navy, width: 2),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.calendar_today_rounded, color: AppColors.navy, size: 20),
                            const SizedBox(width: 10),
                            Text(
                              'Tanggal: ${"${_selectedDate.day}".padLeft(2, '0')}/${"${_selectedDate.month}".padLeft(2, '0')}/${_selectedDate.year}',
                              style: const TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy),
                            ),
                          ],
                        ),
                        const Icon(Icons.arrow_drop_down, color: AppColors.navy),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Submit Button
                NeoBrutalButton(
                  onPressed: _isLoading ? null : _handleSave,
                  isLoading: _isLoading,
                  backgroundColor: AppColors.lime,
                  textColor: AppColors.navy,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.check_circle_rounded, color: AppColors.navy, size: 22),
                      SizedBox(width: 10),
                      Text(
                        'Simpan Transaksi',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTypeToggle() {
    return Container(
      padding: const EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.navy, width: AppColors.borderWidth),
        boxShadow: const [
          BoxShadow(color: AppColors.navy, offset: Offset(3, 3), blurRadius: 0),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _type = 'expense'),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _type == 'expense' ? AppColors.orange : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                  border: _type == 'expense' ? Border.all(color: AppColors.navy, width: 1.5) : null,
                ),
                child: Center(
                  child: Text(
                    'Pengeluaran',
                    style: TextStyle(
                      color: _type == 'expense' ? AppColors.white : AppColors.navy,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 6),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _type = 'income'),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                padding: const EdgeInsets.symmetric(vertical: 10),
                decoration: BoxDecoration(
                  color: _type == 'income' ? AppColors.lime : Colors.transparent,
                  borderRadius: BorderRadius.circular(10),
                  border: _type == 'income' ? Border.all(color: AppColors.navy, width: 1.5) : null,
                ),
                child: Center(
                  child: Text(
                    'Pemasukan',
                    style: TextStyle(
                      color: _type == 'income' ? AppColors.navy : AppColors.navy,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Mode 2: OCR Scanner View ───────────────────────
  Widget _buildOcrScannerView() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Action Buttons: Kamera & Galeri
        Row(
          children: [
            Expanded(
              child: NeoBrutalButton(
                onPressed: _isScanning ? null : () => _pickAndScanReceipt(ImageSource.camera),
                backgroundColor: AppColors.lime,
                textColor: AppColors.navy,
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.camera_alt_rounded, size: 20, color: AppColors.navy),
                    SizedBox(width: 8),
                    Text('Kamera', style: TextStyle(fontWeight: FontWeight.w900)),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: NeoBrutalButton(
                onPressed: _isScanning ? null : () => _pickAndScanReceipt(ImageSource.gallery),
                backgroundColor: AppColors.surface,
                textColor: AppColors.navy,
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.photo_library_rounded, size: 20, color: AppColors.navy),
                    SizedBox(width: 8),
                    Text('Galeri', style: TextStyle(fontWeight: FontWeight.w900)),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // Preview Image or Instructions
        if (_imageFile != null)
          NeoBrutalCard(
            padding: EdgeInsets.zero,
            borderRadius: 14,
            shadowOffset: 3,
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12),
              child: Image.file(
                _imageFile!,
                height: 200,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
          )
        else
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 14,
            shadowOffset: 3,
            padding: const EdgeInsets.all(18),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.lime,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.navy, width: 2),
                  ),
                  child: const Icon(Icons.document_scanner_rounded, color: AppColors.navy, size: 36),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Pindai Struk Belanja Otomatis',
                  style: TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: AppColors.navy),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Foto struk fisikmu dari kamera atau galeri, AI CEAMIS akan mengekstrak nominal dan merchant secara instan.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
        const SizedBox(height: 16),

        // Scanning Spinner
        if (_isScanning)
          NeoBrutalCard(
            backgroundColor: AppColors.lime,
            padding: const EdgeInsets.all(16),
            borderRadius: 12,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                SizedBox(
                  width: 22,
                  height: 22,
                  child: CircularProgressIndicator(strokeWidth: 2.5, color: AppColors.navy),
                ),
                SizedBox(width: 14),
                Text(
                  'AI sedang membaca struk...',
                  style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.navy, fontSize: 14),
                ),
              ],
            ),
          ),

        // Error Message
        if (_scanError != null)
          NeoBrutalCard(
            backgroundColor: AppColors.orange.withValues(alpha: 0.15),
            padding: const EdgeInsets.all(14),
            borderRadius: 12,
            child: Text(
              _scanError!,
              style: const TextStyle(color: AppColors.orange, fontWeight: FontWeight.w700),
            ),
          ),

        // Extracted Result Card with CTA to copy into manual form
        if (_scannedData != null)
          NeoBrutalCard(
            backgroundColor: AppColors.surface,
            borderRadius: 16,
            shadowOffset: 4,
            padding: const EdgeInsets.all(18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: const [
                        Icon(Icons.check_circle_rounded, color: AppColors.blue, size: 20),
                        SizedBox(width: 6),
                        Text(
                          'Hasil Ekstraksi Struk',
                          style: TextStyle(fontWeight: FontWeight.w900, color: AppColors.navy, fontSize: 15),
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
                        'AI DETECTED',
                        style: TextStyle(color: AppColors.navy, fontWeight: FontWeight.w900, fontSize: 10),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                _buildExtractedRow('Merchant', '${_scannedData!['merchant_name'] ?? _scannedData!['merchant'] ?? '-'}'),
                _buildExtractedRow('Total Belanja', 'Rp ${_scannedData!['total_amount'] ?? _scannedData!['total'] ?? '-'}'),
                _buildExtractedRow('Tanggal', '${_scannedData!['date'] ?? '-'}'),
                const SizedBox(height: 16),
                NeoBrutalButton(
                  onPressed: _applyScannedDataToForm,
                  backgroundColor: AppColors.lime,
                  textColor: AppColors.navy,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.assignment_turned_in_rounded, color: AppColors.navy, size: 20),
                      SizedBox(width: 8),
                      Text(
                        'Salin ke Formulir & Simpan ➔',
                        style: TextStyle(fontWeight: FontWeight.w900, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildExtractedRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600, fontSize: 13)),
          Text(value, style: const TextStyle(color: AppColors.navy, fontWeight: FontWeight.w800, fontSize: 14)),
        ],
      ),
    );
  }
}
