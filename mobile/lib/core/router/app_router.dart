// lib/core/router/app_router.dart

import 'package:go_router/go_router.dart';
import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/register_screen.dart';
import '../../features/home/screens/home_screen.dart';
import '../../features/transaction/screens/add_transaction_screen.dart';
import '../../features/ocr/screens/ocr_scan_screen.dart';
import '../../features/health_score/screens/health_score_screen.dart';
import '../widgets/main_shell.dart';

/// CEAMIS GoRouter configuration
final appRouter = GoRouter(
  initialLocation: '/login',
  routes: [
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
          path: '/add-transaction',
          name: 'add-transaction',
          builder: (context, state) => const AddTransactionScreen(),
        ),
        GoRoute(
          path: '/ocr-scan',
          name: 'ocr-scan',
          builder: (context, state) => const OcrScanScreen(),
        ),
      ],
    ),
  ],
);
