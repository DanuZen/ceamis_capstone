// lib/core/widgets/main_shell.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/app_colors.dart';

/// Main app shell with Neo-Brutalism floating bottom navigation dock.
/// Restored to the original signature Neo-Brutalist style:
/// White surface container, 2.5px navy border, hard brutalist shadow,
/// rounded square center action button, and 5 buttons:
/// [Beranda], [Wishlist], [+], [Rencana], [Laporan].
class MainShell extends StatelessWidget {
  final Widget child;
  const MainShell({super.key, required this.child});

  int _calculateSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location == '/') return 0;
    if (location == '/pre-purchase' || location.startsWith('/pre-purchase')) return 1;
    if (location == '/add-transaction' || location == '/ocr-scan') return 2;
    if (location == '/planning' || location.startsWith('/planning')) return 3;
    if (location == '/history-report') return 4;
    return 0;
  }

  void _onItemTapped(BuildContext context, int index) {
    switch (index) {
      case 0:
        context.go('/');
        break;
      case 1:
        context.go('/pre-purchase');
        break;
      case 2:
        context.go('/add-transaction');
        break;
      case 3:
        context.go('/planning');
        break;
      case 4:
        context.go('/history-report');
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _calculateSelectedIndex(context);

    return Scaffold(
      body: child,
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          height: 68,
          margin: const EdgeInsets.only(left: 16, right: 16, bottom: 14, top: 4),
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(
              color: AppColors.navy,
              width: AppColors.borderWidth,
            ),
            boxShadow: const [
              BoxShadow(
                color: AppColors.navy,
                offset: Offset(3, 4),
                blurRadius: 0,
              ),
            ],
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              // 0: Beranda
              Expanded(
                child: Center(
                  child: _buildNavItem(
                    context: context,
                    index: 0,
                    selectedIndex: selectedIndex,
                    inactiveIcon: Icons.grid_view_outlined,
                    activeIcon: Icons.grid_view_rounded,
                    tooltip: 'Beranda',
                  ),
                ),
              ),

              // 1: Wishlist
              Expanded(
                child: Center(
                  child: _buildNavItem(
                    context: context,
                    index: 1,
                    selectedIndex: selectedIndex,
                    inactiveIcon: Icons.stars_outlined,
                    activeIcon: Icons.stars_rounded,
                    tooltip: 'Wishlist',
                  ),
                ),
              ),

              // 2: Distinct Center Action Button for Catat Transaksi
              Expanded(
                child: Center(
                  child: _buildCenterActionButton(
                    context: context,
                    isSelected: selectedIndex == 2,
                  ),
                ),
              ),

              // 3: Rencana
              Expanded(
                child: Center(
                  child: _buildNavItem(
                    context: context,
                    index: 3,
                    selectedIndex: selectedIndex,
                    inactiveIcon: Icons.pie_chart_outline_rounded,
                    activeIcon: Icons.pie_chart_rounded,
                    tooltip: 'Rencana',
                  ),
                ),
              ),

              // 4: Laporan
              Expanded(
                child: Center(
                  child: _buildNavItem(
                    context: context,
                    index: 4,
                    selectedIndex: selectedIndex,
                    inactiveIcon: Icons.article_outlined,
                    activeIcon: Icons.article_rounded,
                    tooltip: 'Laporan',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  /// Distinctly styled, prominent Neo-Brutalist center action button for input transaksi
  Widget _buildCenterActionButton({
    required BuildContext context,
    required bool isSelected,
  }) {
    return GestureDetector(
      onTap: () => _onItemTapped(context, 2),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutCubic,
        width: 48,
        height: 48,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navy : AppColors.lime,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: AppColors.navy,
            width: 2.2,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.navy,
              offset: isSelected ? const Offset(1, 1) : const Offset(2.5, 2.5),
              blurRadius: 0,
            ),
          ],
        ),
        child: Center(
          child: Icon(
            Icons.add_rounded,
            size: 28,
            color: isSelected ? AppColors.lime : AppColors.navy,
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem({
    required BuildContext context,
    required int index,
    required int selectedIndex,
    required IconData inactiveIcon,
    required IconData activeIcon,
    required String tooltip,
  }) {
    final isSelected = index == selectedIndex;

    return GestureDetector(
      onTap: () => _onItemTapped(context, index),
      behavior: HitTestBehavior.opaque,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOutCubic,
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.navy : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: isSelected
              ? Border.all(
                  color: AppColors.navy,
                  width: 1.5,
                )
              : null,
          boxShadow: isSelected
              ? const [
                  BoxShadow(
                    color: Colors.black12,
                    offset: Offset(1, 2),
                    blurRadius: 2,
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Icon(
            isSelected ? activeIcon : inactiveIcon,
            size: 22,
            color: isSelected ? AppColors.lime : AppColors.navy.withValues(alpha: 0.65),
          ),
        ),
      ),
    );
  }
}
