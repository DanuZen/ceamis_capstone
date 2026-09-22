// lib/features/planning/models/budget_plan_model.dart

enum BudgetPillarType {
  needs,
  wants,
  savings,
}

enum GuardrailSeverity {
  safe,
  warning,
  danger,
}

class BudgetPillar {
  final BudgetPillarType type;
  final String title;
  final double ratio; // e.g. 0.50 for 50%
  final double allocatedAmount;
  final double spentAmount;
  final String iconKey;

  const BudgetPillar({
    required this.type,
    required this.title,
    required this.ratio,
    required this.allocatedAmount,
    required this.spentAmount,
    required this.iconKey,
  });

  double get remainingAmount => allocatedAmount - spentAmount;
  double get spentPercentage => allocatedAmount > 0 ? (spentAmount / allocatedAmount) : 0.0;

  bool get isOverbudget => spentAmount > allocatedAmount;
  bool get isNearLimit => spentPercentage >= 0.80 && !isOverbudget;

  GuardrailSeverity get severity {
    if (isOverbudget) return GuardrailSeverity.danger;
    if (isNearLimit) return GuardrailSeverity.warning;
    return GuardrailSeverity.safe;
  }
}

class SubCategoryBudget {
  final String id;
  final String name;
  final BudgetPillarType pillarType;
  final double allocated;
  final double spent;
  final String iconKey;

  const SubCategoryBudget({
    required this.id,
    required this.name,
    required this.pillarType,
    required this.allocated,
    required this.spent,
    required this.iconKey,
  });

  double get remaining => allocated - spent;
  double get percentage => allocated > 0 ? (spent / allocated).clamp(0.0, 1.5) : 0.0;
  bool get isOverbudget => spent > allocated;
}

class SavingsGoalItem {
  final String id;
  final String title;
  final double targetAmount;
  final double currentAmount;
  final String targetMonth;
  final String iconKey;
  final String colorHex;

  const SavingsGoalItem({
    required this.id,
    required this.title,
    required this.targetAmount,
    required this.currentAmount,
    required this.targetMonth,
    required this.iconKey,
    required this.colorHex,
  });

  double get progress => targetAmount > 0 ? (currentAmount / targetAmount).clamp(0.0, 1.0) : 0.0;
  double get remaining => targetAmount - currentAmount;
  bool get isCompleted => currentAmount >= targetAmount;
}

class RiskProfilePreset {
  final String name;
  final String description;
  final double needsRatio;
  final double wantsRatio;
  final double savingsRatio;

  const RiskProfilePreset({
    required this.name,
    required this.description,
    required this.needsRatio,
    required this.wantsRatio,
    required this.savingsRatio,
  });
}
