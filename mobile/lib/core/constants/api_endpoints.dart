// lib/core/constants/api_endpoints.dart

/// Centralized API endpoint constants for CEAMIS backend services.
class ApiEndpoints {
  ApiEndpoints._();

  // ── NestJS Backend (REST API) ────────────────────
  static const String login = '/api/auth/login';
  static const String register = '/api/auth/register';
  static const String profile = '/api/users/profile';
  static const String transactions = '/api/transactions';
  static const String transactionCreate = '/api/transactions';
  static const String budgets = '/api/budgets';
  static const String goals = '/api/goals';

  // ── NestJS → Gemini OCR Proxy ────────────────────
  static const String ocrParseReceipt = '/api/ocr/parse-receipt';

  // ── FastAPI AI Service ───────────────────────────
  static const String healthScore = '/api/v1/predict/health-score';
  static const String riskProfile = '/api/v1/predict/risk-profile';
  static const String chatbot = '/api/v1/chat';
  static const String dashboardInsight = '/api/v1/dashboard/insight';
  static const String education = '/api/v1/education';
  static const String recommendation = '/api/v1/recommendation';
}
