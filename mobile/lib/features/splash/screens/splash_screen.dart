// lib/features/splash/screens/splash_screen.dart

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/constants/app_colors.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  double _progressValue = 0.0;
  String _statusText = 'Menginisialisasi Core Engine...';
  Timer? _progressTimer;

  @override
  void initState() {
    super.initState();

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutBack),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeIn),
    );

    _animController.forward();
    _startProgress();
  }

  void _startProgress() {
    const totalTicks = 20;
    int currentTick = 0;

    _progressTimer = Timer.periodic(const Duration(milliseconds: 90), (timer) {
      currentTick++;
      setState(() {
        _progressValue = currentTick / totalTicks;
        if (currentTick < 7) {
          _statusText = 'Menyiapkan Model Pra-Pembelian...';
        } else if (currentTick < 14) {
          _statusText = 'Menghubungkan Smart OCR Flash...';
        } else {
          _statusText = 'Siap Mengintervensi Impulsimu!';
        }
      });

      if (currentTick >= totalTicks) {
        timer.cancel();
        _navigateToNextScreen();
      }
    });
  }

  Future<void> _navigateToNextScreen() async {
    if (!mounted) return;

    // Check if user has completed onboarding
    const storage = FlutterSecureStorage();
    final hasCompletedOnboarding = await storage.read(key: 'has_completed_onboarding');

    if (!mounted) return;

    if (hasCompletedOnboarding != 'true') {
      context.go('/onboarding');
    } else {
      context.go('/');
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    _progressTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFDF8),
      body: SafeArea(
        child: AnimatedBuilder(
          animation: _animController,
          builder: (context, child) {
            return FadeTransition(
              opacity: _fadeAnimation,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 32.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Spacer(),

                      // ── Neo-Brutalist Logo Container ──
                      ScaleTransition(
                        scale: _scaleAnimation,
                        child: Container(
                          width: 120,
                          height: 120,
                          decoration: BoxDecoration(
                            color: AppColors.white,
                            border: Border.all(color: AppColors.navy, width: 3.5),
                            borderRadius: BorderRadius.circular(28),
                            boxShadow: const [
                              BoxShadow(
                                color: AppColors.navy,
                                offset: Offset(6, 6),
                                blurRadius: 0,
                              ),
                            ],
                          ),
                          padding: const EdgeInsets.all(16),
                          child: Image.asset(
                            'assets/images/logo_new.png',
                            fit: BoxFit.contain,
                            errorBuilder: (context, error, stackTrace) {
                              return const Icon(
                                Icons.shield_rounded,
                                size: 64,
                                color: AppColors.lime,
                              );
                            },
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // ── Brand Title ──
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'CEAMIS',
                            style: GoogleFonts.quicksand(
                              fontSize: 36,
                              fontWeight: FontWeight.w900,
                              color: AppColors.navy,
                              letterSpacing: -1,
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 8),

                      // ── Feature Badge ──
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.lime,
                          border: Border.all(color: AppColors.navy, width: 2),
                          borderRadius: BorderRadius.circular(100),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.navy,
                              offset: Offset(2, 2),
                              blurRadius: 0,
                            ),
                          ],
                        ),
                        child: Text(
                          '⚡ PRE-PURCHASE INTERVENTION',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: AppColors.navy,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // ── Tagline ──
                      Text(
                        'Control Every Awful Money Impulse System',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textSecondary,
                        ),
                      ),

                      const Spacer(),

                      // ── Neo-Brutalist Loading Bar ──
                      Container(
                        width: double.infinity,
                        height: 14,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE2E8F0),
                          border: Border.all(color: AppColors.navy, width: 2.5),
                          borderRadius: BorderRadius.circular(100),
                        ),
                        child: FractionallySizedBox(
                          alignment: Alignment.centerLeft,
                          widthFactor: _progressValue.clamp(0.0, 1.0),
                          child: Container(
                            decoration: BoxDecoration(
                              color: AppColors.lime,
                              borderRadius: BorderRadius.circular(100),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 12),

                      // ── Dynamic Status Text ──
                      Text(
                        _statusText,
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.navy,
                        ),
                      ),

                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
