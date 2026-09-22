// lib/core/router/app_router.dart

import 'package:go_router/go_router.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/transaction/screens/add_transaction_screen.dart';
import '../../features/ocr/screens/ocr_scan_screen.dart';
import '../../features/health_score/screens/health_score_screen.dart';
import '../../features/planning/screens/planning_screen.dart';
import '../../features/pre_purchase/screens/pre_purchase_screen.dart';
import '../../features/pre_purchase/screens/pre_purchase_result_screen.dart';
import '../../features/history_report/screens/history_report_screen.dart';
import '../../features/profile/screens/profile_screen.dart';
import '../widgets/main_shell.dart';

/// CEAMIS GoRouter configuration
final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    // Profile screen
    GoRoute(
      path: '/profile',
      name: 'profile',
      builder: (context, state) => const ProfileScreen(),
    ),

    // Auth routes
    GoRoute(
      path: '/login',
      name: 'login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      name: 'register',
      builder: (context, state) => const RegisterScreen(),
    ),

    // Pre-purchase result full screen
    GoRoute(
      path: '/pre-purchase/result',
      name: 'pre-purchase-result',
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>? ?? {};
        return PrePurchaseResultScreen(
          plannedAmount: (extra['plannedAmount'] as num?)?.toDouble() ?? 0.0,
          categoryName: extra['categoryName'] as String? ?? 'Shopping',
          merchantName: extra['merchantName'] as String? ?? '',
          riskScore: (extra['riskScore'] as num?)?.toDouble() ?? 0.0,
          riskLevel: extra['riskLevel'] as String? ?? 'LOW',
          triggerFactors: (extra['triggerFactors'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
          budgetLimit: (extra['budgetLimit'] as num?)?.toDouble() ?? 800000.0,
          budgetRemainingBefore: (extra['budgetRemainingBefore'] as num?)?.toDouble() ?? 120000.0,
          budgetRemainingAfter: (extra['budgetRemainingAfter'] as num?)?.toDouble() ?? 0.0,
          savingsDelayedDays: (extra['savingsDelayedDays'] as num?)?.toInt() ?? 0,
          savingsGoalTitle: extra['savingsGoalTitle'] as String? ?? 'Dana Darurat 2026',
        );
      },
    ),

    // Main app shell with bottom nav
    ShellRoute(
      builder: (context, state, child) => MainShell(child: child),
      routes: [
        GoRoute(
          path: '/',
          name: 'home',
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: '/health-score',
          name: 'health-score',
          builder: (context, state) => const HealthScoreScreen(),
        ),
        GoRoute(
          path: '/planning',
          name: 'planning',
          builder: (context, state) => const PlanningScreen(),
        ),
        GoRoute(
          path: '/pre-purchase',
          name: 'pre-purchase',
          builder: (context, state) => const PrePurchaseScreen(),
        ),
        GoRoute(
          path: '/add-transaction',
          name: 'add-transaction',
          builder: (context, state) => const AddTransactionScreen(),
        ),
        GoRoute(
          path: '/ocr-scan',
          name: 'ocr-scan',
          builder: (context, state) => const OcrScanScreen(),
        ),
        GoRoute(
          path: '/history-report',
          name: 'history-report',
          builder: (context, state) {
            final tab = int.tryParse(state.uri.queryParameters['tab'] ?? '') ?? 0;
            return HistoryReportScreen(initialTab: tab);
          },
        ),
      ],
    ),
  ],
);
