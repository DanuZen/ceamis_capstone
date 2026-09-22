// lib/features/onboarding/screens/mobile_onboarding_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';
import '../../../core/network/api_client.dart';

class MobileOnboardingScreen extends StatefulWidget {
  const MobileOnboardingScreen({super.key});

  @override
  State<MobileOnboardingScreen> createState() => _MobileOnboardingScreenState();
}

class _MobileOnboardingScreenState extends State<MobileOnboardingScreen> {
  final PageController _pageController = PageController();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  int _currentStep = 0;
  bool _isSubmitting = false;

  // Form State
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _ageController = TextEditingController();
  final TextEditingController _incomeController = TextEditingController(text: '4500000');
  final TextEditingController _expenseController = TextEditingController(text: '3000000');
  final TextEditingController _savingsMonthlyController = TextEditingController(text: '750000');

  String _incomeSource = 'gaji';
  int _cityTier = 1;
  int _tanggungan = 0;
  final Set<String> _topExpenses = {'Makan & Minum', 'Belanja Online'};
  final Set<String> _goals = {'tabungan', 'dana_darurat'};
  bool _hasSavings = true;
  int _saveHabit = 4;
  int _selfControl = 2; // 1: Langsung beli, 2: Mikir, 3: Tunda 24 jam
  int _riskTolerance = 1; // 0: Panik jual, 1: Pantau, 2: Beli lagi

  final List<Map<String, dynamic>> _stepMeta = [
    {
      'title': 'Kenalan Dulu',
      'subtitle': 'Biar CEAMIS makin kenal kamu!',
      'icon': Icons.person_rounded,
      'color': AppColors.blue,
    },
    {
      'title': 'Pendapatan',
      'subtitle': 'Berapa rata-rata pemasukan bulananmu?',
      'icon': Icons.account_balance_wallet_rounded,
      'color': AppColors.lime,
    },
    {
      'title': 'Pengeluaran',
      'subtitle': 'Uangmu biasanya paling sering mengalir ke mana?',
      'icon': Icons.shopping_bag_rounded,
      'color': AppColors.orange,
    },
    {
      'title': 'Tujuan Finansial',
      'subtitle': 'Apa target keuangan terpentingmu saat ini?',
      'icon': Icons.track_changes_rounded,
      'color': AppColors.yellow,
    },
    {
      'title': 'Kebiasaan Menabung',
      'subtitle': 'Bagaimana caramu menyisihkan dan menyimpan dana?',
      'icon': Icons.savings_rounded,
      'color': AppColors.lime,
    },
    {
      'title': 'Mindset & Impuls',
      'subtitle': 'Bantu AI memetakan respons belanja spontanmu!',
      'icon': Icons.psychology_rounded,
      'color': AppColors.blue,
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    _nameController.dispose();
    _ageController.dispose();
    _incomeController.dispose();
    _expenseController.dispose();
    _savingsMonthlyController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentStep < _stepMeta.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _prevPage() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 250),
        curve: Curves.easeInOut,
      );
    }
  }

  Future<void> _finishOnboarding() async {
    setState(() => _isSubmitting = true);

    try {
      // 1. Save onboarding completion flag locally
      await _storage.write(key: 'has_completed_onboarding', value: 'true');
      await _storage.write(key: 'user_display_name', value: _nameController.text.trim());

      // 2. Optionally sync with backend if session is active
      final user = Supabase.instance.client.auth.currentUser;
      if (user != null) {
        try {
          await ApiClient().client.post(
            '/api/v1/users/onboarding',
            data: {
              'user_id': user.id,
              'name': _nameController.text.trim(),
              'age': int.tryParse(_ageController.text) ?? 21,
              'income': double.tryParse(_incomeController.text) ?? 0.0,
              'income_source': _incomeSource,
              'top_expenses': _topExpenses.toList(),
              'monthly_expense': double.tryParse(_expenseController.text) ?? 0.0,
              'goals': _goals.toList(),
              'city_tier_enc': _cityTier,
              'tanggungan_keluarga': _tanggungan,
              'save_habit': _saveHabit,
              'punya_tabungan': _hasSavings,
              'jumlah_tabungan_bulan': double.tryParse(_savingsMonthlyController.text) ?? 0.0,
            },
          );
        } catch (apiError) {
          debugPrint('[ONBOARDING] Backend sync note: $apiError');
        }
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Profil finansialmu berhasil disimpan! Selamat datang di CEAMIS.'),
            backgroundColor: AppColors.navy,
          ),
        );
        context.go('/');
      }
    } catch (e) {
      debugPrint('[ONBOARDING] Finish error: $e');
      if (mounted) context.go('/');
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final meta = _stepMeta[_currentStep];
    final progress = (_currentStep + 1) / _stepMeta.length;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // ── Top Header & Progress Bar ──
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: const BoxDecoration(
                color: AppColors.white,
                border: Border(bottom: BorderSide(color: AppColors.navy, width: 2.5)),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 34,
                            height: 34,
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppColors.white,
                              border: Border.all(color: AppColors.navy, width: 2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Image.asset('assets/images/logo_new.png', fit: BoxFit.contain),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Langkah ${_currentStep + 1} dari ${_stepMeta.length}',
                            style: GoogleFonts.quicksand(
                              fontSize: 13,
                              fontWeight: FontWeight.w800,
                              color: AppColors.navy,
                            ),
                          ),
                        ],
                      ),
                      GestureDetector(
                        onTap: () => context.go('/'),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF1F5F9),
                            border: Border.all(color: AppColors.navy, width: 1.5),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Lewati',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Progress Bar
                  Container(
                    height: 10,
                    width: double.infinity,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      border: Border.all(color: AppColors.navy, width: 2),
                      borderRadius: BorderRadius.circular(100),
                    ),
                    child: FractionallySizedBox(
                      alignment: Alignment.centerLeft,
                      widthFactor: progress.clamp(0.0, 1.0),
                      child: Container(
                        decoration: BoxDecoration(
                          color: meta['color'] as Color,
                          borderRadius: BorderRadius.circular(100),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // ── Step Title Header Card ──
            Container(
              margin: const EdgeInsets.all(16),
              child: NeoBrutalCard(
                backgroundColor: (meta['color'] as Color).withAlpha(38),
                borderColor: AppColors.navy,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      width: 46,
                      height: 46,
                      decoration: BoxDecoration(
                        color: meta['color'] as Color,
                        border: Border.all(color: AppColors.navy, width: 2.5),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(meta['icon'] as IconData, color: AppColors.navy, size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            meta['title'] as String,
                            style: GoogleFonts.quicksand(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: AppColors.navy,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            meta['subtitle'] as String,
                            style: GoogleFonts.inter(
                              fontSize: 12,
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

            // ── PageView Step Content ──
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (idx) => setState(() => _currentStep = idx),
                children: [
                  _buildStep1(),
                  _buildStep2(),
                  _buildStep3(),
                  _buildStep4(),
                  _buildStep5(),
                  _buildStep6(),
                ],
              ),
            ),

            // ── Bottom Action Navigation ──
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              decoration: const BoxDecoration(
                color: AppColors.white,
                border: Border(top: BorderSide(color: AppColors.navy, width: 2.5)),
              ),
              child: Row(
                children: [
                  if (_currentStep > 0) ...[
                    Expanded(
                      flex: 1,
                      child: NeoBrutalButton(
                        onPressed: _prevPage,
                        backgroundColor: AppColors.white,
                        textColor: AppColors.navy,
                        child: Text(
                          '← Kembali',
                          style: GoogleFonts.quicksand(fontWeight: FontWeight.w800),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Expanded(
                    flex: 2,
                    child: NeoBrutalButton(
                      onPressed: _isSubmitting ? null : _nextPage,
                      backgroundColor: _currentStep == _stepMeta.length - 1 ? AppColors.lime : AppColors.yellow,
                      textColor: AppColors.navy,
                      isLoading: _isSubmitting,
                      child: Text(
                        _currentStep == _stepMeta.length - 1
                            ? 'Mulai CEAMIS 🚀'
                            : 'Lanjut →',
                        style: GoogleFonts.quicksand(fontWeight: FontWeight.w900, fontSize: 15),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Step 1: Kenalan Dulu ──
  Widget _buildStep1() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Siapa nama panggilanmu?'),
          TextFormField(
            controller: _nameController,
            decoration: _inputDecoration('Contoh: Ziva'),
          ),
          const SizedBox(height: 16),

          _buildInputLabel('Berapa usiamu?'),
          TextFormField(
            controller: _ageController,
            keyboardType: TextInputType.number,
            decoration: _inputDecoration('Contoh: 21'),
          ),
          const SizedBox(height: 16),

          _buildInputLabel('Karakteristik tempat tinggal:'),
          Row(
            children: [
              _buildSelectableChip('Metro / Besar', _cityTier == 1, () => setState(() => _cityTier = 1)),
              const SizedBox(width: 8),
              _buildSelectableChip('Kota Menengah', _cityTier == 2, () => setState(() => _cityTier = 2)),
              const SizedBox(width: 8),
              _buildSelectableChip('Kabupaten', _cityTier == 3, () => setState(() => _cityTier = 3)),
            ],
          ),
          const SizedBox(height: 16),

          _buildInputLabel('Jumlah tanggungan keluarga:'),
          Row(
            children: [0, 1, 2, 3].map((val) {
              return Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(right: 6.0),
                  child: _buildSelectableChip(
                    val == 3 ? '3+ org' : '$val org',
                    _tanggungan == val,
                    () => setState(() => _tanggungan = val),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  // ── Step 2: Pendapatan ──
  Widget _buildStep2() {
    final sources = [
      {'id': 'gaji', 'label': 'Gaji Bulanan', 'icon': Icons.work_outline_rounded},
      {'id': 'freelance', 'label': 'Freelance / Proyek', 'icon': Icons.laptop_mac_rounded},
      {'id': 'bisnis', 'label': 'Bisnis / Jualan', 'icon': Icons.storefront_rounded},
      {'id': 'uang_saku', 'label': 'Uang Saku / Kiriman', 'icon': Icons.school_outlined},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Estimasi Pemasukan Bulanan (Rp)'),
          TextFormField(
            controller: _incomeController,
            keyboardType: TextInputType.number,
            decoration: _inputDecoration('4500000'),
          ),
          const SizedBox(height: 16),

          _buildInputLabel('Sumber Pemasukan Terbesar:'),
          ...sources.map((s) {
            final isSelected = _incomeSource == s['id'];
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GestureDetector(
                onTap: () => setState(() => _incomeSource = s['id'] as String),
                child: NeoBrutalCard(
                  backgroundColor: isSelected ? const Color(0xFFD2FF28) : AppColors.white,
                  borderColor: AppColors.navy,
                  borderRadius: 12,
                  shadowOffset: isSelected ? 4 : 2,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  child: Row(
                    children: [
                      Icon(s['icon'] as IconData, color: AppColors.navy),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          s['label'] as String,
                          style: GoogleFonts.quicksand(
                            fontWeight: FontWeight.w800,
                            fontSize: 14,
                            color: AppColors.navy,
                          ),
                        ),
                      ),
                      if (isSelected) const Icon(Icons.check_circle_rounded, color: AppColors.navy, size: 20),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // ── Step 3: Pengeluaran ──
  Widget _buildStep3() {
    final categories = [
      'Makan & Minum',
      'Belanja Online',
      'Kos / Kontrakan',
      'Transportasi',
      'Hiburan & Hangout',
      'Pulsa & Kuota',
      'Kesehatan',
      'Edukasi & Kursus',
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Estimasi Total Pengeluaran Bulanan (Rp)'),
          TextFormField(
            controller: _expenseController,
            keyboardType: TextInputType.number,
            decoration: _inputDecoration('3000000'),
          ),
          const SizedBox(height: 16),

          _buildInputLabel('Pos Belanja Terbesar (Pilih yang relevan):'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: categories.map((cat) {
              final isSelected = _topExpenses.contains(cat);
              return GestureDetector(
                onTap: () {
                  setState(() {
                    if (isSelected) {
                      _topExpenses.remove(cat);
                    } else {
                      _topExpenses.add(cat);
                    }
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.yellow : AppColors.white,
                    border: Border.all(color: AppColors.navy, width: 2),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.navy,
                        offset: Offset(isSelected ? 3 : 1.5, isSelected ? 3 : 1.5),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (isSelected) const Icon(Icons.check_rounded, size: 14, color: AppColors.navy),
                      if (isSelected) const SizedBox(width: 4),
                      Text(
                        cat,
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                          color: AppColors.navy,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ── Step 4: Tujuan Finansial ──
  Widget _buildStep4() {
    final goalsList = [
      {'id': 'tabungan', 'title': 'Menabung Rutin Tiap Bulan', 'desc': 'Bangun bantalan keamanan keuangan'},
      {'id': 'dana_darurat', 'title': 'Punya Dana Darurat 3-6 Bulan', 'desc': 'Kesiapan menghadapi kejadian mendesak'},
      {'id': 'bebas_utang', 'title': 'Bebas Pinjol & PayLater', 'desc': 'Bebas dari cicilan konsumtif bulanan'},
      {'id': 'beli_impian', 'title': 'Beli Gadget / Barang Impian', 'desc': 'Beli tanpa mengorbankan cashflow'},
      {'id': 'investasi', 'title': 'Mulai Portofolio Investasi', 'desc': 'Mengenal reksa dana dan saham'},
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Pilih Target Finansial Prioritasmu:'),
          ...goalsList.map((g) {
            final isSelected = _goals.contains(g['id']);
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    if (isSelected) {
                      _goals.remove(g['id']);
                    } else {
                      _goals.add(g['id'] as String);
                    }
                  });
                },
                child: NeoBrutalCard(
                  backgroundColor: isSelected ? const Color(0xFFD2FF28) : AppColors.white,
                  borderColor: AppColors.navy,
                  borderRadius: 12,
                  shadowOffset: isSelected ? 4 : 2,
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    children: [
                      Icon(
                        isSelected ? Icons.check_box_rounded : Icons.check_box_outline_blank_rounded,
                        color: AppColors.navy,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              g['title'] as String,
                              style: GoogleFonts.quicksand(
                                fontWeight: FontWeight.w800,
                                fontSize: 13,
                                color: AppColors.navy,
                              ),
                            ),
                            Text(
                              g['desc'] as String,
                              style: GoogleFonts.inter(
                                fontSize: 11,
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
            );
          }),
        ],
      ),
    );
  }

  // ── Step 5: Kebiasaan Menabung ──
  Widget _buildStep5() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Apakah kamu sudah memiliki tabungan aktif?'),
          Row(
            children: [
              Expanded(
                child: _buildSelectableChip('Ya, Sudah Ada', _hasSavings, () => setState(() => _hasSavings = true)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _buildSelectableChip('Belum Ada', !_hasSavings, () => setState(() => _hasSavings = false)),
              ),
            ],
          ),
          const SizedBox(height: 16),

          if (_hasSavings) ...[
            _buildInputLabel('Berapa yang biasa kamu sisihkan per bulan? (Rp)'),
            TextFormField(
              controller: _savingsMonthlyController,
              keyboardType: TextInputType.number,
              decoration: _inputDecoration('750000'),
            ),
            const SizedBox(height: 16),
          ],

          _buildInputLabel('Seberapa konsisten kamu menabung?'),
          Column(
            children: [
              {'val': 1, 'label': 'Hampir Tidak Pernah'},
              {'val': 2, 'label': 'Jarang / Kalau Ada Sisa'},
              {'val': 3, 'label': 'Kadang-kadang (Tergantung Mood)'},
              {'val': 4, 'label': 'Sering (Prioritas Awal Bulan)'},
              {'val': 5, 'label': 'Selalu Rutin Otomatis'},
            ].map((opt) {
              final isSel = _saveHabit == opt['val'];
              return Padding(
                padding: const EdgeInsets.only(bottom: 6.0),
                child: GestureDetector(
                  onTap: () => setState(() => _saveHabit = opt['val'] as int),
                  child: NeoBrutalCard(
                    backgroundColor: isSel ? AppColors.lime : AppColors.white,
                    borderColor: AppColors.navy,
                    borderRadius: 10,
                    shadowOffset: isSel ? 3 : 1.5,
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                    child: Row(
                      children: [
                        Text(
                          '${opt['val']}. ${opt['label']}',
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                            color: AppColors.navy,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  // ── Step 6: Mindset & Impuls ──
  Widget _buildStep6() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _buildInputLabel('Ketika melihat flash sale diskon 60%:'),
          _buildRadioOption('Langsung checkout mumpung murah!', _selfControl == 1, () => setState(() => _selfControl = 1)),
          _buildRadioOption('Mikir sebentar, baru tentukan', _selfControl == 2, () => setState(() => _selfControl = 2)),
          _buildRadioOption('Tunda 24 jam & cek kebutuhan riil', _selfControl == 3, () => setState(() => _selfControl = 3)),
          const SizedBox(height: 16),

          _buildInputLabel('Jika portofolio investasi/tabungan turun 10%:'),
          _buildRadioOption('Panik, langsung tarik sisa saldo', _riskTolerance == 0, () => setState(() => _riskTolerance = 0)),
          _buildRadioOption('Tenang dan pantau dalam jangka panjang', _riskTolerance == 1, () => setState(() => _riskTolerance = 1)),
          _buildRadioOption('Beli lagi (manfaatkan harga diskon)', _riskTolerance == 2, () => setState(() => _riskTolerance = 2)),
          const SizedBox(height: 16),

          // Completion Callout Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFD2FF28),
              border: Border.all(color: AppColors.navy, width: 2.5),
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [BoxShadow(color: AppColors.navy, offset: Offset(4, 4), blurRadius: 0)],
            ),
            child: Row(
              children: [
                const Icon(Icons.verified_user_rounded, color: AppColors.navy, size: 28),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'AI CEAMIS siap mengkalibrasi model pra-pembelian khusus untuk pola finansialmu!',
                    style: GoogleFonts.inter(fontSize: 11.5, fontWeight: FontWeight.w800, color: AppColors.navy),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  // ── Helper Widgets ──
  Widget _buildInputLabel(String label) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Text(
        label,
        style: GoogleFonts.quicksand(
          fontWeight: FontWeight.w800,
          fontSize: 13,
          color: AppColors.navy,
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      filled: true,
      fillColor: AppColors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.navy, width: 2.5),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.navy, width: 2.5),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: AppColors.navy, width: 3),
      ),
    );
  }

  Widget _buildSelectableChip(String label, bool isSelected, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.yellow : AppColors.white,
          border: Border.all(color: AppColors.navy, width: 2),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: AppColors.navy,
              offset: Offset(isSelected ? 3 : 1.5, isSelected ? 3 : 1.5),
              blurRadius: 0,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w800,
            fontSize: 11,
            color: AppColors.navy,
          ),
        ),
      ),
    );
  }

  Widget _buildRadioOption(String text, bool isSelected, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: GestureDetector(
        onTap: onTap,
        child: NeoBrutalCard(
          backgroundColor: isSelected ? const Color(0xFFD2FF28) : AppColors.white,
          borderColor: AppColors.navy,
          borderRadius: 10,
          shadowOffset: isSelected ? 3 : 1.5,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          child: Row(
            children: [
              Icon(
                isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_off_rounded,
                color: AppColors.navy,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  text,
                  style: GoogleFonts.inter(fontWeight: FontWeight.w700, fontSize: 12, color: AppColors.navy),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
