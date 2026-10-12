// lib/features/pre_purchase/screens/post_decision_feedback_screen.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';
import '../../../core/widgets/ceamis_app_bar.dart';
import '../providers/pre_purchase_provider.dart';

/// Halaman Konfirmasi Pasca-Keputusan (Gambar 3.13 Naskah BAB III)
/// Mengumpulkan label ground truth operasional dari pengguna (terencana vs tidak terencana)
/// untuk continuous learning model prediksi risiko pra-pembelian.
class PostDecisionFeedbackScreen extends ConsumerStatefulWidget {
  final String checkId;
  final String itemName;
  final double amount;
  final String categoryName;
  final String transactionDate;

  const PostDecisionFeedbackScreen({
    super.key,
    this.checkId = 'demo-check-001',
    this.itemName = 'Kopi Susu & Pastry',
    this.amount = 72000.0,
    this.categoryName = 'F&B (Pos Keinginan)',
    this.transactionDate = '2 hari lalu',
  });

  @override
  ConsumerState<PostDecisionFeedbackScreen> createState() => _PostDecisionFeedbackScreenState();
}

class _PostDecisionFeedbackScreenState extends ConsumerState<PostDecisionFeedbackScreen> {
  bool? _wasImpulsive; // null = belum memilih, false = Sesuai Rencana, true = Tidak Terencana
  int _satisfactionRating = 4;
  final TextEditingController _notesController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _submitFeedback() async {
    if (_wasImpulsive == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Silakan pilih salah satu: Sesuai Rencana atau Tidak Terencana'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    await ref.read(prePurchaseProvider.notifier).recordFeedback(
      checkId: widget.checkId,
      wasImpulsive: _wasImpulsive!,
      satisfactionRating: _satisfactionRating,
      feedbackNotes: _notesController.text.trim().isNotEmpty ? _notesController.text.trim() : null,
    );

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _wasImpulsive!
              ? 'Terima kasih atas refleksinya. Model akan menyesuaikan batas kewaspadaan Anda.'
              : 'Konfirmasi tersimpan! Senang keputusan belanjamu berjalan sesuai rencana.',
        ),
        backgroundColor: AppColors.navy,
        behavior: SnackBarBehavior.floating,
      ),
    );

    Navigator.of(context).pop();
  }

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
              // Header Aplikasi
              CeamisAppBar(
                title: 'Konfirmasi',
                onNotificationTap: () {},
                onProfileTap: () => context.push('/profile'),
              ),
              const SizedBox(height: 20),

              // Kartu Refleksi Belanja
              NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 16,
                shadowOffset: 4,
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF08A),
                            borderRadius: BorderRadius.circular(10),
                            border: Border.all(color: AppColors.navy, width: 2),
                          ),
                          child: const Icon(Icons.psychology_alt_rounded, color: AppColors.navy, size: 24),
                        ),
                        const SizedBox(width: 12),
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'REFLEKSI PASCA-KEPUTUSAN',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.textSecondary,
                                  letterSpacing: 0.5,
                                ),
                              ),
                              Text(
                                'Evaluasi Belanja Lalu',
                                style: TextStyle(
                                  fontSize: 17,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.navy,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Detail Transaksi
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.navy, width: 1.5),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                widget.itemName,
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w800,
                                  color: AppColors.navy,
                                ),
                              ),
                              Text(
                                'Rp ${_formatNumber(widget.amount)}',
                                style: const TextStyle(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFFDC2626),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                widget.categoryName,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                              Text(
                                widget.transactionDate,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Pertanyaan Inti Konfirmasi
              const Text(
                'Apakah transaksi ini sesuai rencana atau terasa tidak terencana / disesali?',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: AppColors.navy,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 14),

              // Pilihan 1: Sesuai Rencana (wasImpulsive = false)
              GestureDetector(
                onTap: () => setState(() => _wasImpulsive = false),
                child: NeoBrutalCard(
                  backgroundColor: _wasImpulsive == false ? AppColors.lime : AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Icon(
                        _wasImpulsive == false ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                        color: AppColors.navy,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Sesuai Rencana Anggaran',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Belanja memang dibutuhkan dan tidak mengganggu pagu kebutuhan pokok.',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Pilihan 2: Tidak Terencana / Disesali (wasImpulsive = true)
              GestureDetector(
                onTap: () => setState(() => _wasImpulsive = true),
                child: NeoBrutalCard(
                  backgroundColor: _wasImpulsive == true ? const Color(0xFFFED7AA) : AppColors.surface,
                  borderRadius: 14,
                  shadowOffset: 3,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  child: Row(
                    children: [
                      Icon(
                        _wasImpulsive == true ? Icons.check_circle_rounded : Icons.radio_button_off_rounded,
                        color: _wasImpulsive == true ? const Color(0xFFC2410C) : AppColors.navy,
                        size: 24,
                      ),
                      const SizedBox(width: 12),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Tidak Terencana / Terasa Impulsif',
                              style: TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                                color: AppColors.navy,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Keputusan emosional yang sebenarnya bisa ditunda atau dihindari.',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Penilaian Kepuasan
              NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Tingkat Kepuasan Belanja:',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: AppColors.navy,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: List.generate(5, (index) {
                        final star = index + 1;
                        return GestureDetector(
                          onTap: () => setState(() => _satisfactionRating = star),
                          child: Icon(
                            star <= _satisfactionRating ? Icons.star_rounded : Icons.star_border_rounded,
                            color: star <= _satisfactionRating ? const Color(0xFFF59E0B) : AppColors.textSecondary,
                            size: 36,
                          ),
                        );
                      }),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Tombol Kirim Konfirmasi
              NeoBrutalButton(
                onPressed: _isSubmitting ? null : _submitFeedback,
                backgroundColor: AppColors.lime,
                textColor: AppColors.navy,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (_isSubmitting)
                      const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.navy),
                      )
                    else
                      const Icon(Icons.send_rounded, color: AppColors.navy, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      _isSubmitting ? 'Menyimpan...' : 'Kirim Konfirmasi Refleksi',
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Catatan Privasi & Machine Learning
              const Center(
                child: Text(
                  'Label ini digunakan murni untuk personalisasi model ML Anda sendiri.',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textSecondary,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
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
