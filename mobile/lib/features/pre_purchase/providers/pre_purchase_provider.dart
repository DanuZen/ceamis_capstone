// lib/features/pre_purchase/providers/pre_purchase_provider.dart

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/constants/api_endpoints.dart';
import '../../../core/network/api_client.dart';
import '../models/wishlist_model.dart';

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
  final bool isStrictOverbudget;
  final double deficitAmount;

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
    this.isStrictOverbudget = false,
    this.deficitAmount = 0.0,
  });

  factory PrePurchaseResultData.fromJson(
    Map<String, dynamic> json,
    double amount,
    String category,
    String merchant,
  ) {
    final pred = json['prediction'] as Map<String, dynamic>? ?? {};
    final bImpact = json['budget_impact'] as Map<String, dynamic>? ?? {};
    final sImpact = json['savings_impact'] as Map<String, dynamic>? ?? {};

    final limit = (bImpact['budget_limit'] as num?)?.toDouble() ?? 1560000.0;
    final before = (bImpact['remaining_before'] as num?)?.toDouble() ?? 450000.0;
    final after = (bImpact['remaining_after'] as num?)?.toDouble() ?? (before - amount);
    final isOver = after < 0;

    return PrePurchaseResultData(
      checkId: json['check_id']?.toString() ?? '',
      plannedAmount: (json['planned_amount'] as num?)?.toDouble() ?? amount,
      categoryName: category,
      merchantName: merchant,
      riskScore: (pred['risk_score'] as num?)?.toDouble() ?? (isOver ? 0.90 : 0.20),
      riskLevel: pred['risk_level']?.toString() ?? (isOver ? 'HIGH' : 'LOW'),
      triggerFactors: (pred['trigger_factors'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      budgetLimit: limit,
      budgetRemainingBefore: before,
      budgetRemainingAfter: after,
      savingsDelayedDays: (sImpact['delayed_days'] as num?)?.toInt() ?? ((amount / 35000).round()),
      savingsGoalTitle: sImpact['goal_title']?.toString() ?? 'Dana Darurat 2026',
      recommendedAction: json['recommended_action']?.toString() ?? (isOver ? 'POSTPONE' : 'PROCEED'),
      isStrictOverbudget: isOver,
      deficitAmount: isOver ? after.abs() : 0.0,
    );
  }
}

/// State untuk PrePurchase & Smart Wishlist
class PrePurchaseState {
  final bool isLoading;
  final String? errorMessage;
  final PrePurchaseResultData? result;
  final bool decisionRecorded;
  final bool feedbackRecorded;
  final List<WishlistItem> wishlistItems;
  final WishlistBudgetStatus budgetStatus;

  const PrePurchaseState({
    this.isLoading = false,
    this.errorMessage,
    this.result,
    this.decisionRecorded = false,
    this.feedbackRecorded = false,
    this.wishlistItems = const [],
    this.budgetStatus = const WishlistBudgetStatus(),
  });

  PrePurchaseState copyWith({
    bool? isLoading,
    String? errorMessage,
    PrePurchaseResultData? result,
    bool? decisionRecorded,
    bool? feedbackRecorded,
    List<WishlistItem>? wishlistItems,
    WishlistBudgetStatus? budgetStatus,
  }) {
    return PrePurchaseState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      result: result ?? this.result,
      decisionRecorded: decisionRecorded ?? this.decisionRecorded,
      feedbackRecorded: feedbackRecorded ?? this.feedbackRecorded,
      wishlistItems: wishlistItems ?? this.wishlistItems,
      budgetStatus: budgetStatus ?? this.budgetStatus,
    );
  }
}

/// StateNotifier untuk mengelola Smart Wishlist dan evaluasi risiko pra-pembelian
class PrePurchaseNotifier extends StateNotifier<PrePurchaseState> {
  PrePurchaseNotifier() : super(PrePurchaseState(wishlistItems: _getInitialWishlist())) {
    _recalculateWishlistReadiness();
  }

  final ApiClient _apiClient = ApiClient();

  static List<WishlistItem> _getInitialWishlist() {
    return [
      const WishlistItem(
        id: 'wish-1',
        title: 'Sepatu Lari Nike Pegasus',
        estimatedPrice: 1200000.0,
        categoryName: 'Shopping & Fashion',
        budgetPillar: 'Pos Keinginan (Wants)',
        priority: 'Tinggi',
        notes: 'Untuk persiapan lomba lari 10K',
        icon: Icons.directions_run_rounded,
        iconBg: Color(0xFFFEF08A),
        readiness: WishlistReadiness.overbudget,
        deficitAmount: 750000.0,
        savingsDelayedDays: 22,
      ),
      const WishlistItem(
        id: 'wish-2',
        title: 'Kacamata Hitam Polarized',
        estimatedPrice: 250000.0,
        categoryName: 'Aksesoris',
        budgetPillar: 'Pos Keinginan (Wants)',
        priority: 'Sedang',
        notes: 'Dipakai saat berkendara siang hari',
        icon: Icons.visibility_rounded,
        iconBg: Color(0xFFB7FF00),
        readiness: WishlistReadiness.ready,
        deficitAmount: 0.0,
        savingsDelayedDays: 0,
      ),
      const WishlistItem(
        id: 'wish-3',
        title: 'Staycation Akhir Pekan',
        estimatedPrice: 800000.0,
        categoryName: 'Liburan & Healing',
        budgetPillar: 'Pos Keinginan (Wants)',
        priority: 'Sedang',
        notes: 'Healing setelah submit capstone',
        icon: Icons.hotel_rounded,
        iconBg: Color(0xFFDCEBFE),
        readiness: WishlistReadiness.overbudget,
        deficitAmount: 350000.0,
        savingsDelayedDays: 14,
      ),
    ];
  }

  void _recalculateWishlistReadiness() {
    final remaining = state.budgetStatus.monthlyWantsRemaining;
    final updated = state.wishlistItems.map((item) {
      if (item.estimatedPrice <= remaining) {
        return item.copyWith(
          readiness: WishlistReadiness.ready,
          deficitAmount: 0.0,
          savingsDelayedDays: 0,
        );
      } else {
        final deficit = item.estimatedPrice - remaining;
        final delayedDays = (deficit / 35000).round();
        return item.copyWith(
          readiness: WishlistReadiness.overbudget,
          deficitAmount: deficit,
          savingsDelayedDays: delayedDays > 0 ? delayedDays : 5,
        );
      }
    }).toList();

    state = state.copyWith(wishlistItems: updated);
  }

  /// Tambah item wishlist baru
  void addWishlistItem({
    required String title,
    required double estimatedPrice,
    required String categoryName,
    String priority = 'Sedang',
    String? notes,
  }) {
    final remaining = state.budgetStatus.monthlyWantsRemaining;
    final isOver = estimatedPrice > remaining;
    final deficit = isOver ? (estimatedPrice - remaining) : 0.0;
    final delayed = isOver ? (deficit / 35000).round() : 0;

    final newItem = WishlistItem(
      id: 'wish-${DateTime.now().millisecondsSinceEpoch}',
      title: title,
      estimatedPrice: estimatedPrice,
      categoryName: categoryName,
      budgetPillar: 'Pos Keinginan (Wants)',
      priority: priority,
      notes: notes,
      icon: _pickIconForCategory(categoryName),
      iconBg: isOver ? const Color(0xFFFEF08A) : const Color(0xFFB7FF00),
      readiness: isOver ? WishlistReadiness.overbudget : WishlistReadiness.ready,
      deficitAmount: deficit,
      savingsDelayedDays: delayed,
    );

    state = state.copyWith(wishlistItems: [newItem, ...state.wishlistItems]);
  }

  /// Hapus item wishlist
  void deleteWishlistItem(String id) {
    state = state.copyWith(
      wishlistItems: state.wishlistItems.where((it) => it.id != id).toList(),
    );
  }

  IconData _pickIconForCategory(String category) {
    final lower = category.toLowerCase();
    if (lower.contains('gadget') || lower.contains('elektronik')) return Icons.devices_rounded;
    if (lower.contains('makan') || lower.contains('f&b')) return Icons.restaurant_rounded;
    if (lower.contains('liburan') || lower.contains('trip')) return Icons.flight_takeoff_rounded;
    if (lower.contains('baju') || lower.contains('fashion')) return Icons.checkroom_rounded;
    return Icons.shopping_bag_rounded;
  }

  /// Evaluasi kelayakan belanja (terhubung ke backend atau model lokal)
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
    } catch (_) {
      // Fallback cerdas berbasis guardrail pos anggaran
    }

    final fallbackData = _createSmartGuardrailResult(
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
      state = state.copyWith(decisionRecorded: true);
      return true;
    }
    return false;
  }

  /// Evaluasi guardrail ketat dengan deteksi defisit pos anggaran & efek domino tabungan
  PrePurchaseResultData _createSmartGuardrailResult({
    required double amount,
    required String categoryName,
    required String merchantName,
  }) {
    final limit = state.budgetStatus.monthlyWantsLimit; // 1.560.000
    final remainingBefore = state.budgetStatus.monthlyWantsRemaining; // 450.000
    final remainingAfter = remainingBefore - amount;
    final isStrictOverbudget = remainingAfter < 0;

    double riskScore = 0.15;
    String riskLevel = 'LOW';
    final triggers = <String>[];

    if (isStrictOverbudget) {
      riskScore = 0.92;
      riskLevel = 'HIGH';
      final defisit = remainingAfter.abs();
      triggers.add('PERINGATAN KETAT: Membeli item ini akan menjebol batas pos Keinginan sebesar -Rp ${defisit.toInt()}');
      triggers.add('Efek Domino: Memaksa mengambil 72% jatah tabungan bulan ini untuk menutupi defisit');
      triggers.add('Penundaan Target: Proyeksi pencapaian target "${state.budgetStatus.activeSavingsGoal}" mundur ${(defisit / 35000).round()} hari!');
    } else if (amount > (remainingBefore * 0.7)) {
      riskScore = 0.65;
      riskLevel = 'MEDIUM';
      triggers.add('Perhatian: Pembelian ini menghabiskan ${(amount / remainingBefore * 100).toInt()}% sisa jatah pos Keinginan bulan ini');
      triggers.add('Sisa saldo pos gaya hidup akan sangat tipis hingga tanggal gajian');
    } else {
      triggers.add('Aman! Kuota pos Keinginan masih sangat mencukupi (tersisa Rp ${remainingAfter.toInt()})');
      triggers.add('Tidak mengganggu alokasi tabungan dan kebutuhan pokok bulanan');
    }

    final delayedDays = isStrictOverbudget ? (remainingAfter.abs() / 35000).round() : 0;

    return PrePurchaseResultData(
      checkId: 'local-wish-${DateTime.now().millisecondsSinceEpoch}',
      plannedAmount: amount,
      categoryName: categoryName,
      merchantName: merchantName,
      riskScore: riskScore,
      riskLevel: riskLevel,
      triggerFactors: triggers,
      budgetLimit: limit,
      budgetRemainingBefore: remainingBefore,
      budgetRemainingAfter: remainingAfter,
      savingsDelayedDays: delayedDays,
      savingsGoalTitle: state.budgetStatus.activeSavingsGoal,
      recommendedAction: isStrictOverbudget ? 'POSTPONE' : (riskLevel == 'MEDIUM' ? 'ADJUST' : 'PROCEED'),
      isStrictOverbudget: isStrictOverbudget,
      deficitAmount: isStrictOverbudget ? remainingAfter.abs() : 0.0,
    );
  }
}

/// Global provider untuk fitur PrePurchase & Smart Wishlist
final prePurchaseProvider =
    StateNotifierProvider<PrePurchaseNotifier, PrePurchaseState>((ref) {
  return PrePurchaseNotifier();
});
