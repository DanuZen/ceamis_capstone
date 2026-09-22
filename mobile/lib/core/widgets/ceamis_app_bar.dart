// lib/core/widgets/ceamis_app_bar.dart

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../constants/app_colors.dart';

/// Top header bar consistent across all 5 main pages of the CEAMIS mobile app:
/// [Beranda], [Wishlist], [Catat], [Rencana], and [Laporan].
class CeamisAppBar extends StatelessWidget {
  final String title;
  final String brand;
  final int notificationCount;
  final VoidCallback? onNotificationTap;
  final VoidCallback? onProfileTap;

  const CeamisAppBar({
    super.key,
    required this.title,
    this.brand = 'CEAMIS',
    this.notificationCount = 3,
    this.onNotificationTap,
    this.onProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Brand Subtitle & Page Title
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              brand,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
                letterSpacing: 0.8,
              ),
            ),
            Text(
              title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w900,
                color: AppColors.navy,
                height: 1.1,
              ),
            ),
          ],
        ),

        // Action Buttons: Notification Bell & Profile Avatar
        Row(
          children: [
            // Notification bell with red badge "3"
            GestureDetector(
              onTap: onNotificationTap ??
                  () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('$notificationCount Notifikasi baru dari CAMI AI'),
                        behavior: SnackBarBehavior.floating,
                      ),
                    );
                  },
              behavior: HitTestBehavior.opaque,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.navy, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.navy,
                          offset: Offset(2.5, 2.5),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.notifications_outlined,
                      color: AppColors.navy,
                      size: 22,
                    ),
                  ),
                  if (notificationCount > 0)
                    Positioned(
                      top: -4,
                      right: -4,
                      child: Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(
                          color: const Color(0xFFDC2626),
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.navy, width: 1.5),
                        ),
                        child: Center(
                          child: Text(
                            '$notificationCount',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
            const SizedBox(width: 10),

            // Profile Button
            GestureDetector(
              onTap: onProfileTap ?? () => context.push('/profile'),
              behavior: HitTestBehavior.opaque,
              child: Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.navy, width: 2.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.navy,
                      offset: Offset(2.5, 2.5),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: Center(
                  child: Container(
                    width: 30,
                    height: 30,
                    decoration: const BoxDecoration(
                      color: Color(0xFF0095FF),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
