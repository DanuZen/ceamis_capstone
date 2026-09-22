// lib/features/pre_purchase/models/wishlist_model.dart

import 'package:flutter/material.dart';

enum WishlistReadiness {
  ready,      // Aman dibeli, kuota pos keinginan mencukupi
  caution,    // Kuota pas-pasan, menyisakan < 15%
  overbudget, // Melebihi kuota pos anggaran (jebol anggaran)
}

class WishlistItem {
  final String id;
  final String title;
  final double estimatedPrice;
  final String categoryName;
  final String budgetPillar; // 'Pos Keinginan (Wants)', 'Pos Kebutuhan (Needs)', etc.
  final String priority;     // 'Tinggi', 'Sedang', 'Rendah'
  final String? notes;
  final DateTime? targetDate;
  final IconData icon;
  final Color iconBg;
  final WishlistReadiness readiness;
  final double deficitAmount;
  final int savingsDelayedDays;

  const WishlistItem({
    required this.id,
    required this.title,
    required this.estimatedPrice,
    required this.categoryName,
    this.budgetPillar = 'Pos Keinginan (Wants)',
    this.priority = 'Sedang',
    this.notes,
    this.targetDate,
    required this.icon,
    required this.iconBg,
    required this.readiness,
    this.deficitAmount = 0.0,
    this.savingsDelayedDays = 0,
  });

  WishlistItem copyWith({
    String? id,
    String? title,
    double? estimatedPrice,
    String? categoryName,
    String? budgetPillar,
    String? priority,
    String? notes,
    DateTime? targetDate,
    IconData? icon,
    Color? iconBg,
    WishlistReadiness? readiness,
    double? deficitAmount,
    int? savingsDelayedDays,
  }) {
    return WishlistItem(
      id: id ?? this.id,
      title: title ?? this.title,
      estimatedPrice: estimatedPrice ?? this.estimatedPrice,
      categoryName: categoryName ?? this.categoryName,
      budgetPillar: budgetPillar ?? this.budgetPillar,
      priority: priority ?? this.priority,
      notes: notes ?? this.notes,
      targetDate: targetDate ?? this.targetDate,
      icon: icon ?? this.icon,
      iconBg: iconBg ?? this.iconBg,
      readiness: readiness ?? this.readiness,
      deficitAmount: deficitAmount ?? this.deficitAmount,
      savingsDelayedDays: savingsDelayedDays ?? this.savingsDelayedDays,
    );
  }
}

class WishlistBudgetStatus {
  final double monthlyWantsLimit;
  final double monthlyWantsSpent;
  final double monthlyWantsRemaining;
  final double monthlySavingsTarget;
  final String activeSavingsGoal;

  const WishlistBudgetStatus({
    this.monthlyWantsLimit = 1560000.0,
    this.monthlyWantsSpent = 1110000.0,
    this.monthlyWantsRemaining = 450000.0,
    this.monthlySavingsTarget = 1040000.0,
    this.activeSavingsGoal = 'Dana Darurat 2026',
  });
}
