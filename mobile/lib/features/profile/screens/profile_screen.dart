// lib/features/profile/screens/profile_screen.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/network/api_client.dart';
import '../../../core/widgets/neo_brutal_card.dart';
import '../../../core/widgets/neo_brutal_button.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool _budgetAlertEnabled = true;
  bool _aiRiskCheckEnabled = true;
  bool _isLoading = true;

  // Dynamic user data with safe defaults
  String _userName = 'Pengguna';
  String _userEmail = 'email@ceamis.id';
  int _totalTransactions = 0;
  double _healthScore = 0.0;
  int _streakDays = 0;

  @override
  void initState() {
    super.initState();
    _loadProfileData();
  }

  Future<void> _loadProfileData() async {
    // 1. Fetch name & email from Supabase auth
    try {
      final user = Supabase.instance.client.auth.currentUser;
      if (user != null) {
        setState(() {
          _userEmail = user.email ?? _userEmail;
          _userName = user.userMetadata?['name'] as String? ??
              user.userMetadata?['full_name'] as String? ??
              _userEmail.split('@').first;
        });
      }
    } catch (e) {
      debugPrint('[Profile] Supabase auth read failed: $e');
    }

    // 2. Fetch stats from backend API
    try {
      final userId = Supabase.instance.client.auth.currentUser?.id;
      if (userId != null) {
        final client = ApiClient().client;

        try {
          final summaryResp = await client.get('/api/v1/transactions/summary', queryParameters: {'user_id': userId});
          if (mounted && summaryResp.data != null) {
            setState(() {
              _totalTransactions = (summaryResp.data['total_transactions'] as num?)?.toInt() ?? 0;
            });
          }
        } catch (_) {}

        try {
          final profileResp = await client.get('/api/v1/users/$userId');
          if (mounted && profileResp.data != null) {
            final data = profileResp.data;
            setState(() {
              _healthScore = (data['health_score'] as num?)?.toDouble() ?? 0.0;
              _streakDays = (data['streak'] as num?)?.toInt() ?? 0;
              if (data['name'] != null && (data['name'] as String).isNotEmpty) {
                _userName = data['name'] as String;
              }
            });
          }
        } catch (_) {}
      }
    } catch (e) {
      debugPrint('[Profile] Backend stats fetch failed: $e');
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  void _handleLogout() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.navy, width: 2.5),
        ),
        title: const Text(
          'Keluar Akun?',
          style: TextStyle(
            color: AppColors.navy,
            fontWeight: FontWeight.w900,
          ),
        ),
        content: const Text(
          'Apakah kamu yakin ingin keluar dari akun CEAMIS?',
          style: TextStyle(
            color: AppColors.navy,
            fontWeight: FontWeight.w600,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text(
              'Batal',
              style: TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w700),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.orange,
              foregroundColor: AppColors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: const BorderSide(color: AppColors.navy, width: 2),
              ),
              elevation: 0,
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await ApiClient().clearToken();
              if (mounted) {
                context.go('/login');
              }
            },
            child: const Text(
              'Ya, Keluar',
              style: TextStyle(fontWeight: FontWeight.w900),
            ),
          ),
        ],
      ),
    );
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
              // Top Bar with Back Button
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => context.pop(),
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
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
                        Icons.arrow_back_rounded,
                        color: AppColors.navy,
                        size: 22,
                      ),
                    ),
                  ),
                  Text(
                    'Detail Profil',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          color: AppColors.navy,
                          fontWeight: FontWeight.w900,
                        ),
                  ),
                  const SizedBox(width: 44), // Balancer
                ],
              ),
              const SizedBox(height: 20),

              // User Hero Card
              NeoBrutalCard(
                backgroundColor: AppColors.lime,
                borderRadius: 16,
                shadowOffset: 4,
                padding: const EdgeInsets.all(20),
                child: Row(
                  children: [
                    Stack(
                      children: [
                        Container(
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: AppColors.navy,
                            borderRadius: BorderRadius.circular(18),
                            border: Border.all(color: AppColors.navy, width: 2.5),
                          ),
                          child: const Icon(
                            Icons.person_rounded,
                            color: AppColors.lime,
                            size: 40,
                          ),
                        ),
                        Positioned(
                          bottom: -2,
                          right: -2,
                          child: Container(
                            padding: const EdgeInsets.all(3),
                            decoration: BoxDecoration(
                              color: AppColors.lime,
                              shape: BoxShape.circle,
                              border: Border.all(color: AppColors.navy, width: 2),
                            ),
                            child: const Icon(
                              Icons.verified_rounded,
                              color: AppColors.navy,
                              size: 16,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  _userName,
                                  overflow: TextOverflow.ellipsis,
                                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                        color: AppColors.navy,
                                        fontWeight: FontWeight.w900,
                                      ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppColors.surface,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppColors.navy, width: 1.5),
                                ),
                                child: const Text(
                                  'Pro User',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: AppColors.navy,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _userEmail,
                            style: const TextStyle(
                              color: AppColors.navy,
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.navy,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.local_fire_department_rounded, color: AppColors.lime, size: 14),
                                const SizedBox(width: 4),
                                Text(
                                  _isLoading
                                      ? 'Memuat...'
                                      : '$_streakDays Hari Rutin Mencatat',
                                  style: const TextStyle(
                                    color: AppColors.lime,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Gamification & Financial Stats Bento
              Text(
                'Statistik Aktivitas',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: NeoBrutalCard(
                      backgroundColor: AppColors.surface,
                      borderRadius: 14,
                      shadowOffset: 3,
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.receipt_long_rounded, color: AppColors.navy, size: 22),
                          const SizedBox(height: 8),
                          _isLoading
                              ? _buildShimmerText(width: 90)
                              : Text(
                                  '$_totalTransactions Catatan',
                                  style: const TextStyle(
                                    color: AppColors.navy,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                          const SizedBox(height: 2),
                          const Text(
                            'Total Transaksi',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
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
                      padding: const EdgeInsets.all(14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.insights_rounded, color: AppColors.navy, size: 22),
                          const SizedBox(height: 8),
                          _isLoading
                              ? _buildShimmerText(width: 80)
                              : Text(
                                  '${_healthScore.toStringAsFixed(1)} / 100',
                                  style: const TextStyle(
                                    color: AppColors.navy,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                          const SizedBox(height: 2),
                          const Text(
                            'Skor Finansial',
                            style: TextStyle(
                              color: AppColors.textSecondary,
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Account & Preferences
              Text(
                'Pengaturan Akun',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.w900,
                      color: AppColors.navy,
                    ),
              ),
              const SizedBox(height: 10),

              NeoBrutalCard(
                backgroundColor: AppColors.surface,
                borderRadius: 14,
                shadowOffset: 3,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: Column(
                  children: [
                    _buildSwitchTile(
                      icon: Icons.notifications_active_outlined,
                      title: 'Peringatan Anggaran',
                      subtitle: 'Notifikasi saat pengeluaran mendekati 80% limit',
                      value: _budgetAlertEnabled,
                      onChanged: (val) => setState(() => _budgetAlertEnabled = val),
                    ),
                    const Divider(height: 1),
                    _buildSwitchTile(
                      icon: Icons.shield_outlined,
                      title: 'AI Risk Check Reminder',
                      subtitle: 'Saran pencegahan impulsif sebelum checkout',
                      value: _aiRiskCheckEnabled,
                      onChanged: (val) => setState(() => _aiRiskCheckEnabled = val),
                    ),
                    const Divider(height: 1),
                    _buildInfoTile(
                      icon: Icons.monetization_on_outlined,
                      title: 'Mata Uang Utama',
                      value: 'IDR (Rupiah)',
                    ),
                    const Divider(height: 1),
                    _buildInfoTile(
                      icon: Icons.palette_outlined,
                      title: 'Gaya Desain',
                      value: 'Neo-Brutalism',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Logout Button
              NeoBrutalButton(
                onPressed: _handleLogout,
                backgroundColor: AppColors.orange.withValues(alpha: 0.12),
                textColor: AppColors.orange,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.logout_rounded, size: 20, color: AppColors.orange),
                    SizedBox(width: 8),
                    Text(
                      'Keluar dari Akun',
                      style: TextStyle(
                        fontWeight: FontWeight.w900,
                        color: AppColors.orange,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  /// Shimmer placeholder while loading stats
  Widget _buildShimmerText({double width = 80}) {
    return Container(
      width: width,
      height: 20,
      decoration: BoxDecoration(
        color: AppColors.navy.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(6),
      ),
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.lime,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.navy, width: 1.5),
            ),
            child: Icon(icon, color: AppColors.navy, size: 20),
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
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.w600,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: AppColors.navy,
            activeTrackColor: AppColors.lime,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildInfoTile({
    required IconData icon,
    required String title,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: AppColors.navy, width: 1.5),
            ),
            child: Icon(icon, color: AppColors.navy, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              title,
              style: const TextStyle(
                color: AppColors.navy,
                fontWeight: FontWeight.w800,
                fontSize: 13,
              ),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w700,
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}

