// lib/core/constants/api_endpoints.dart

/// Centralized API endpoint constants for CEAMIS 2.0 unified FastAPI backend.
class ApiEndpoints {
  ApiEndpoints._();

  // ── Auth & Users ──────────────────────────────────
  static const String login = '/api/v1/auth/login';
  static const String register = '/api/v1/auth/register';
  static const String profile = '/api/v1/users/profile';

  // ── Financial Management ──────────────────────────
  static const String transactions = '/api/v1/transactions';
  static const String transactionCreate = '/api/v1/transactions';
  static const String budgets = '/api/v1/budgets';
  static const String goals = '/api/v1/goals';

  // ── Core Pre-Purchase Intervention ────────────────
  static const String prePurchaseCheck = '/api/v1/pre-purchase/check';
  static const String prePurchaseDecide = '/api/v1/pre-purchase/decide';
  static const String prePurchaseFeedback = '/api/v1/pre-purchase/feedback';

  // ── Smart OCR & AI ────────────────────────────────
  static const String ocrParseReceipt = '/api/v1/ocr/parse-receipt';
  static const String healthScore = '/api/v1/predict/health-score';
  static const String dashboardInsight = '/api/v1/dashboard/insight';
}
