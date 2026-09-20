// lib/features/pre_purchase/providers/pre_purchase_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';

/// Model hasil evaluasi risiko pra-pembelian
class PrePurchaseResultData {
  final String checkId;
  final double plannedAmount;
  final String categoryName;
  final String merchantName;
  final double riskScore;
  final String riskLevel;
  final List<String> triggerFactors;
  final double budgetLimit;
  final double budgetRemainingBefore;
  final double budgetRemainingAfter;
  final int savingsDelayedDays;
  final String savingsGoalTitle;
  final String recommendedAction;

  const PrePurchaseResultData({
    required this.checkId,
    required this.plannedAmount,
    required this.categoryName,
    required this.merchantName,
    required this.riskScore,
    required this.riskLevel,
    required this.triggerFactors,
    required this.budgetLimit,
    required this.budgetRemainingBefore,
    required this.budgetRemainingAfter,
    required this.savingsDelayedDays,
    required this.savingsGoalTitle,
    required this.recommendedAction,
  });

  factory PrePurchaseResultData.fromJson(Map<String, dynamic> json, double amount, String category, String merchant) {
    final pred = json['prediction'] as Map<String, dynamic>? ?? {};
    final bImpact = json['budget_impact'] as Map<String, dynamic>? ?? {};
    final sImpact = json['savings_impact'] as Map<String, dynamic>? ?? {};

    return PrePurchaseResultData(
      checkId: json['check_id']?.toString() ?? '',
      plannedAmount: (json['planned_amount'] as num?)?.toDouble() ?? amount,
      categoryName: category,
      merchantName: merchant,
      riskScore: (pred['risk_score'] as num?)?.toDouble() ?? 0.0,
      riskLevel: pred['risk_level']?.toString() ?? 'LOW',
      triggerFactors: (pred['trigger_factors'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      budgetLimit: (bImpact['budget_limit'] as num?)?.toDouble() ?? 800000.0,
      budgetRemainingBefore: (bImpact['remaining_before'] as num?)?.toDouble() ?? 120000.0,
      budgetRemainingAfter: (bImpact['remaining_after'] as num?)?.toDouble() ?? (120000.0 - amount),
      savingsDelayedDays: (sImpact['delayed_days'] as num?)?.toInt() ?? 0,
      savingsGoalTitle: sImpact['goal_title']?.toString() ?? 'Dana Darurat 2026',
      recommendedAction: json['recommended_action']?.toString() ?? 'PROCEED',
    );
  }
}

/// State untuk PrePurchase
class PrePurchaseState {
  final bool isLoading;
  final String? errorMessage;
  final PrePurchaseResultData? result;
  final bool decisionRecorded;
  final bool feedbackRecorded;

  const PrePurchaseState({
    this.isLoading = false,
    this.errorMessage,
    this.result,
    this.decisionRecorded = false,
    this.feedbackRecorded = false,
  });

  PrePurchaseState copyWith({
    bool? isLoading,
    String? errorMessage,
    PrePurchaseResultData? result,
    bool? decisionRecorded,
    bool? feedbackRecorded,
  }) {
    return PrePurchaseState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      result: result ?? this.result,
      decisionRecorded: decisionRecorded ?? this.decisionRecorded,
      feedbackRecorded: feedbackRecorded ?? this.feedbackRecorded,
    );
  }
}

/// StateNotifier untuk mengelola evaluasi risiko pra-pembelian
class PrePurchaseNotifier extends StateNotifier<PrePurchaseState> {
  PrePurchaseNotifier() : super(const PrePurchaseState());

  final ApiClient _apiClient = ApiClient();

  /// Evaluasi risiko rencana belanja
  Future<PrePurchaseResultData?> checkRisk({
    required double amount,
    required String categoryId,
    required String categoryName,
    String merchantName = '',
    String notes = '',
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final response = await _apiClient.client.post(
        ApiEndpoints.prePurchaseCheck,
        data: {
          'user_id': 'demo-user',
          'category_id': categoryId,
          'planned_amount': amount,
          'merchant_name': merchantName.isNotEmpty ? merchantName : null,
          'notes': notes.isNotEmpty ? notes : null,
        },
      );

      if (response.statusCode == 200 && response.data != null) {
        final data = PrePurchaseResultData.fromJson(
          response.data as Map<String, dynamic>,
          amount,
          categoryName,
          merchantName,
        );
        state = state.copyWith(isLoading: false, result: data);
        return data;
      }
    } catch (e) {
      // Fallback deterministik jika backend offline / network error
      final fallbackData = _createFallbackResult(
        amount: amount,
        categoryName: categoryName,
        merchantName: merchantName,
      );
      state = state.copyWith(isLoading: false, result: fallbackData);
      return fallbackData;
    }

    // Jika response tidak 200
    final fallbackData = _createFallbackResult(
      amount: amount,
      categoryName: categoryName,
      merchantName: merchantName,
    );
    state = state.copyWith(isLoading: false, result: fallbackData);
    return fallbackData;
  }

  /// Catat keputusan user (PROCEED, ADJUST, POSTPONE)
  Future<bool> recordDecision({
    required String checkId,
    required String decision,
    double? adjustedAmount,
  }) async {
    try {
      final response = await _apiClient.client.post(
        ApiEndpoints.prePurchaseDecide,
        data: {
          'check_id': checkId,
          'decision': decision,
          'adjusted_amount': adjustedAmount,
        },
      );
      if (response.statusCode == 200) {
        state = state.copyWith(decisionRecorded: true);
        return true;
      }
    } catch (_) {
      // Best-effort recording
      state = state.copyWith(decisionRecorded: true);
      return true;
    }
    return false;
  }

  /// Catat umpan balik pasca-keputusan
  Future<bool> submitFeedback({
    required String checkId,
    required bool wasImpulsive,
    int? satisfactionRating,
    String? feedbackNotes,
  }) async {
    try {
      final response = await _apiClient.client.post(
        ApiEndpoints.prePurchaseFeedback,
        data: {
          'check_id': checkId,
          'was_impulsive': wasImpulsive,
          'satisfaction_rating': satisfactionRating,
          'feedback_notes': feedbackNotes,
        },
      );
      if (response.statusCode == 200) {
        state = state.copyWith(feedbackRecorded: true);
        return true;
      }
    } catch (_) {
      state = state.copyWith(feedbackRecorded: true);
      return true;
    }
    return false;
  }

  PrePurchaseResultData _createFallbackResult({
    required double amount,
    required String categoryName,
    required String merchantName,
  }) {
    const budgetLimit = 800000.0;
    const remainingBefore = 120000.0;
    final remainingAfter = remainingBefore - amount;

    double riskScore = 0.15;
    String riskLevel = 'LOW';
    final triggers = <String>[];

    if (amount > remainingBefore) {
      riskScore = 0.88;
      riskLevel = 'HIGH';
      triggers.add('Nominal melebihi sisa anggaran (defisit Rp ${(amount - remainingBefore).toInt()})');
    } else if (amount > (remainingBefore * 0.6)) {
      riskScore = 0.58;
      riskLevel = 'MEDIUM';
      triggers.add('Menguras lebih dari 60% sisa pagu bulanan');
    }

    if (amount > 115000.0 * 2.0) {
      if (riskLevel == 'LOW') {
        riskScore = 0.52;
        riskLevel = 'MEDIUM';
      }
      triggers.add('Nominal belanja > 2x dari rata-rata riwayat');
    }

    if (triggers.isEmpty) {
      triggers.add('Pengeluaran berada dalam batas wajar anggaran bulanan');
    }

    final delayedDays = (amount / 25000).round();

    return PrePurchaseResultData(
      checkId: 'local-${DateTime.now().millisecondsSinceEpoch}',
      plannedAmount: amount,
      categoryName: categoryName,
      merchantName: merchantName,
      riskScore: riskScore,
      riskLevel: riskLevel,
      triggerFactors: triggers,
      budgetLimit: budgetLimit,
      budgetRemainingBefore: remainingBefore,
      budgetRemainingAfter: remainingAfter,
      savingsDelayedDays: delayedDays,
      savingsGoalTitle: 'Dana Darurat 2026',
      recommendedAction: riskLevel == 'HIGH'
          ? 'POSTPONE'
          : (riskLevel == 'MEDIUM' ? 'ADJUST' : 'PROCEED'),
    );
  }
}

/// Global provider untuk fitur PrePurchase
final prePurchaseProvider =
    StateNotifierProvider<PrePurchaseNotifier, PrePurchaseState>((ref) {
  return PrePurchaseNotifier();
});
