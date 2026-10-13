"""
Risk Model Training Pipeline — CEAMIS 2.0
Melatih model prediksi risiko pra-pembelian (Pre-Purchase Risk Prediction).

Alur:
  1. Generate synthetic training data (demo — production: use real transaction history)
  2. Extract 7 contextual features
  3. Temporal split per-user (WAJIB — sesuai arahan dosen)
  4. Evaluate Baseline Rule-Based, Train Logistic Regression (Model 1) & Random Forest (Model 2)
  5. Comprehensive Evaluation (Precision, Recall, F1, ROC-AUC, PR-AUC, Balanced Acc, False Alert Rate, Brier Score)
  6. Export best model as .joblib to artifacts_risk/ and export trained model registry

Referensi:
  docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md
  docs/AGENT_PERBAIKAN.md (Tugas F7)

Penggunaan:
  python -m training.train_risk_model
  
  atau dari root backend/:
  python training/train_risk_model.py
"""

import os
import sys
import json
import random
import math
import warnings
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Konfigurasi encoding stdout/stderr agar aman di Windows Console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
    average_precision_score, balanced_accuracy_score, brier_score_loss,
    classification_report, confusion_matrix,
)

warnings.filterwarnings("ignore")

# ── Paths ──────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts_risk"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

# ── Constants ──────────────────────────────────────────
RANDOM_SEED = 42
N_USERS = 30
N_TRANSACTIONS_PER_USER = (30, 80)  # min, max transactions per user
N_MONTHS = 4   # data spanning 4 months, split: months 1-3 train, month 4 test
FEATURE_NAMES = [
    "amount_ratio_median",
    "budget_remaining_ratio",
    "category_frequency",
    "day_of_week",
    "days_to_reset",
    "savings_impact",
    "deviation_from_pattern",
]

random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)


# ═══════════════════════════════════════════════════════
# STEP 1: Generate Synthetic Training Data
# ═══════════════════════════════════════════════════════

def generate_synthetic_data() -> pd.DataFrame:
    """
    Generate realistic synthetic pre-purchase transaction data
    for N_USERS over N_MONTHS. Each row represents a transaction
    with contextual features and a binary 'is_risky' label.
    """
    print(f"\n📊 Generating synthetic data for {N_USERS} users over {N_MONTHS} months...")

    records = []
    base_date = datetime(2026, 6, 1, tzinfo=timezone.utc)

    categories = [
        {"name": "Shopping",      "median": 120000, "std": 55000, "budget": 800000},
        {"name": "F&B",           "median": 35000,  "std": 18000, "budget": 500000},
        {"name": "Entertainment", "median": 75000,  "std": 40000, "budget": 400000},
        {"name": "Transport",     "median": 25000,  "std": 12000, "budget": 300000},
        {"name": "Education",     "median": 150000, "std": 60000, "budget": 600000},
    ]

    for user_idx in range(N_USERS):
        user_id = f"user-{user_idx:03d}"
        n_trx = random.randint(*N_TRANSACTIONS_PER_USER)

        # User profile
        monthly_income = random.uniform(3000000, 8000000)
        savings_target = random.uniform(3000000, 10000000)
        savings_rate = random.uniform(0.08, 0.25)
        budget_reset_day = random.choice([1, 5, 10, 15, 25])

        # Spending personality bias
        impulsive_tendency = random.uniform(0.1, 0.6)

        for trx_idx in range(n_trx):
            # Random date within N_MONTHS range
            days_offset = random.randint(0, N_MONTHS * 30 - 1)
            trx_date = base_date + timedelta(days=days_offset)
            month_num = (trx_date - base_date).days // 30 + 1  # 1 to N_MONTHS

            # Pick category
            cat = random.choice(categories)

            # Generate amount (sometimes impulsive = higher)
            is_impulsive_buy = random.random() < impulsive_tendency
            if is_impulsive_buy:
                amount = abs(np.random.normal(cat["median"] * 2.5, cat["std"] * 1.5))
            else:
                amount = abs(np.random.normal(cat["median"], cat["std"] * 0.7))
            amount = max(5000, round(amount, -3))  # min 5k, rounded to nearest 1k

            # Simulate budget state
            days_into_month = trx_date.day
            spend_fraction = min(1.0, days_into_month / 30 + random.uniform(-0.1, 0.2))
            budget_spent = cat["budget"] * spend_fraction * random.uniform(0.5, 1.2)
            budget_remaining = max(0, cat["budget"] - budget_spent)

            # Category frequency in last 7 days
            freq_7d = random.choices(
                [0, 1, 2, 3, 4, 5, 6, 7],
                weights=[10, 25, 25, 15, 10, 7, 5, 3],
            )[0]

            # ── Extract 7 features ──
            amount_ratio_median = amount / max(cat["median"], 1)
            budget_remaining_ratio = amount / max(budget_remaining, 1)
            category_frequency = float(freq_7d)
            day_of_week = float(trx_date.weekday())

            if trx_date.day <= budget_reset_day:
                days_to_reset = float(budget_reset_day - trx_date.day)
            else:
                days_to_reset = float(30 - trx_date.day + budget_reset_day)

            savings_impact = amount / max(savings_target, 1)
            deviation_from_pattern = abs(amount - cat["median"]) / max(cat["std"], 1)

            # ── Generate label (is_risky) ──
            # Rule-inspired label generation with noise
            risk_score = 0.0
            if amount_ratio_median > 2.0:
                risk_score += 0.3
            if budget_remaining_ratio > 0.5:
                risk_score += 0.25
            if budget_remaining_ratio > 1.0:
                risk_score += 0.15
            if freq_7d >= 4:
                risk_score += 0.1
            if day_of_week >= 5:  # Weekend
                risk_score += 0.05
            if savings_impact > 0.05:
                risk_score += 0.1
            if deviation_from_pattern > 1.5:
                risk_score += 0.1

            # Add noise to prevent label from being perfectly separable
            risk_score += np.random.normal(0, 0.08)
            is_risky = 1 if risk_score >= 0.35 else 0

            # Force some correlation with impulsive personality
            if is_impulsive_buy and random.random() < 0.7:
                is_risky = 1

            records.append({
                "user_id": user_id,
                "month": month_num,
                "transaction_date": trx_date.isoformat(),
                "category": cat["name"],
                "amount": amount,
                # Features
                "amount_ratio_median": round(amount_ratio_median, 4),
                "budget_remaining_ratio": round(budget_remaining_ratio, 4),
                "category_frequency": category_frequency,
                "day_of_week": day_of_week,
                "days_to_reset": days_to_reset,
                "savings_impact": round(savings_impact, 6),
                "deviation_from_pattern": round(deviation_from_pattern, 4),
                # Label
                "is_risky": is_risky,
            })

    df = pd.DataFrame(records)
    print(f"   Generated {len(df)} transactions")
    print(f"   Label distribution: {df['is_risky'].value_counts().to_dict()}")
    print(f"   Risky rate: {df['is_risky'].mean():.1%}")
    return df


# ═══════════════════════════════════════════════════════
# STEP 2: Temporal Split (WAJIB — no random shuffle!)
# ═══════════════════════════════════════════════════════

def temporal_split(df: pd.DataFrame, train_months: int = 3):
    """
    Split data secara temporal per-user.
    Train: months 1..train_months
    Test:  month train_months+1 (bulan terakhir)
    
    Dilarang keras menggunakan shuffle=True (sesuai arahan dosen).
    """
    print(f"\n🔀 Temporal split: Train months 1-{train_months}, Test month {train_months + 1}")

    train_df = df[df["month"] <= train_months]
    test_df = df[df["month"] > train_months]

    X_train = train_df[FEATURE_NAMES].values
    y_train = train_df["is_risky"].values
    X_test = test_df[FEATURE_NAMES].values
    y_test = test_df["is_risky"].values

    print(f"   Train: {len(X_train)} samples (months 1-{train_months})")
    print(f"   Test:  {len(X_test)} samples (month {train_months + 1})")
    print(f"   Train risky rate: {y_train.mean():.1%}")
    print(f"   Test risky rate:  {y_test.mean():.1%}")

    return X_train, X_test, y_train, y_test


# ═══════════════════════════════════════════════════════
# STEP 3: Baseline & Metric Calculations
# ═══════════════════════════════════════════════════════

def compute_metrics_dict(algorithm: str, y_true: np.ndarray, y_pred: np.ndarray, y_proba: np.ndarray) -> dict:
    """
    Menghitung rangkaian metrik komprehensif sesuai panduan akademik:
    - Precision, Recall, F1-Score
    - ROC-AUC
    - PR-AUC (Average Precision)
    - Balanced Accuracy
    - False-Alert Rate (FP / (FP + TN))
    - Calibration Score (Brier Score)
    """
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    false_alert_rate = float(fp / (fp + tn)) if (fp + tn) > 0 else 0.0

    return {
        "algorithm": algorithm,
        "precision": round(float(precision_score(y_true, y_pred, zero_division=0)), 4),
        "recall": round(float(recall_score(y_true, y_pred, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_true, y_pred, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_true, y_proba)), 4),
        "pr_auc": round(float(average_precision_score(y_true, y_proba)), 4),
        "balanced_accuracy": round(float(balanced_accuracy_score(y_true, y_pred)), 4),
        "false_alert_rate": round(false_alert_rate, 4),
        "brier_score": round(float(brier_score_loss(y_true, y_proba)), 4),
    }


def predict_rule_based(X: np.ndarray) -> tuple[np.ndarray, np.ndarray]:
    """
    Menghitung prediksi dan skor probabilitas risiko untuk baseline rule-based
    sesuai docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md §2.1 dan app/services/pre_purchase_risk.py.
    """
    probas = []
    preds = []
    for row in X:
        ratio = row[0]          # amount_ratio_median
        budget_ratio = row[1]   # budget_remaining_ratio
        freq = row[2]           # category_frequency
        # day_of_week = row[3]
        # days_to_reset = row[4]
        sav = row[5]            # savings_impact
        dev = row[6]            # deviation_from_pattern

        score = 0.0
        if ratio > 3.0:
            score += 0.35
        elif ratio > 2.0:
            score += 0.25
        elif ratio > 1.5:
            score += 0.15

        if budget_ratio > 1.0:
            score += 0.30
        elif budget_ratio > 0.5:
            score += 0.20
        elif budget_ratio > 0.3:
            score += 0.10

        if freq >= 5:
            score += 0.10
        elif freq >= 3:
            score += 0.05

        if sav > 0.5:
            score += 0.15
        elif sav > 0.2:
            score += 0.08

        if dev > 2.0:
            score += 0.10
        elif dev > 1.5:
            score += 0.05

        risk_score = min(score, 1.0)
        probas.append(risk_score)
        # Sesuai batas level MEDIUM/HIGH dan label generation
        pred = 1 if risk_score >= 0.35 else 0
        preds.append(pred)

    return np.array(preds), np.array(probas)


def train_and_evaluate(X_train, X_test, y_train, y_test):
    """
    Evaluasi Baseline Rule-Based, latih Logistic Regression & Random Forest,
    lalu lakukan komparasi metrik komprehensif pada data uji temporal yang sama.
    """
    # Standardize features untuk model ML
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = {}

    # ── Baseline: Rule-Based (Evaluasi pada fitur asli unscaled) ──
    print("\n📏 Evaluating Baseline Rule-Based...")
    rule_preds, rule_proba = predict_rule_based(X_test)
    rule_metrics = compute_metrics_dict("RuleBasedBaseline", y_test, rule_preds, rule_proba)
    results["baseline"] = {
        "model": None,
        "metrics": rule_metrics,
        "version_tag": "v1.0.0-baseline",
    }

    print(f"   Precision:         {rule_metrics['precision']:.4f}")
    print(f"   Recall:            {rule_metrics['recall']:.4f}")
    print(f"   F1-Score:          {rule_metrics['f1_score']:.4f}")
    print(f"   ROC-AUC:           {rule_metrics['roc_auc']:.4f}")
    print(f"   PR-AUC:            {rule_metrics['pr_auc']:.4f}")
    print(f"   Balanced Accuracy: {rule_metrics['balanced_accuracy']:.4f}")
    print(f"   False Alert Rate:  {rule_metrics['false_alert_rate']:.4f}")
    print(f"   Brier Score:       {rule_metrics['brier_score']:.4f}")
    print(f"\n   Classification Report (Rule-Based Baseline):\n{classification_report(y_test, rule_preds, target_names=['Safe', 'Risky'])}")

    # ── Model 1: Logistic Regression ──
    print("🔬 Training Logistic Regression...")
    lr_model = LogisticRegression(
        random_state=RANDOM_SEED,
        max_iter=1000,
        class_weight="balanced",
        C=1.0,
    )
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)
    lr_proba = lr_model.predict_proba(X_test_scaled)[:, 1]

    lr_metrics = compute_metrics_dict("LogisticRegression", y_test, lr_preds, lr_proba)
    results["logreg"] = {
        "model": lr_model,
        "metrics": lr_metrics,
        "version_tag": "v1.0.0-logreg",
    }

    print(f"   Precision:         {lr_metrics['precision']:.4f}")
    print(f"   Recall:            {lr_metrics['recall']:.4f}")
    print(f"   F1-Score:          {lr_metrics['f1_score']:.4f}")
    print(f"   ROC-AUC:           {lr_metrics['roc_auc']:.4f}")
    print(f"   PR-AUC:            {lr_metrics['pr_auc']:.4f}")
    print(f"   Balanced Accuracy: {lr_metrics['balanced_accuracy']:.4f}")
    print(f"   False Alert Rate:  {lr_metrics['false_alert_rate']:.4f}")
    print(f"   Brier Score:       {lr_metrics['brier_score']:.4f}")

    # Feature importance (coefficients)
    print("\n   Feature Coefficients (Logistic Regression):")
    for name, coef in sorted(zip(FEATURE_NAMES, lr_model.coef_[0]), key=lambda x: abs(x[1]), reverse=True):
        print(f"     {name:30s} β = {coef:+.4f}")

    print(f"\n   Classification Report (LogReg):\n{classification_report(y_test, lr_preds, target_names=['Safe', 'Risky'])}")

    # ── Model 2: Random Forest ──
    print("🌲 Training Random Forest...")
    rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=3,
        random_state=RANDOM_SEED,
        class_weight="balanced",
        n_jobs=-1,
    )
    rf_model.fit(X_train_scaled, y_train)
    rf_preds = rf_model.predict(X_test_scaled)
    rf_proba = rf_model.predict_proba(X_test_scaled)[:, 1]

    rf_metrics = compute_metrics_dict("RandomForestClassifier", y_test, rf_preds, rf_proba)
    results["rf"] = {
        "model": rf_model,
        "metrics": rf_metrics,
        "version_tag": "v1.1.0-rf",
    }

    print(f"   Precision:         {rf_metrics['precision']:.4f}")
    print(f"   Recall:            {rf_metrics['recall']:.4f}")
    print(f"   F1-Score:          {rf_metrics['f1_score']:.4f}")
    print(f"   ROC-AUC:           {rf_metrics['roc_auc']:.4f}")
    print(f"   PR-AUC:            {rf_metrics['pr_auc']:.4f}")
    print(f"   Balanced Accuracy: {rf_metrics['balanced_accuracy']:.4f}")
    print(f"   False Alert Rate:  {rf_metrics['false_alert_rate']:.4f}")
    print(f"   Brier Score:       {rf_metrics['brier_score']:.4f}")

    # Feature importance (Gini)
    print("\n   Feature Importances (Random Forest):")
    for name, imp in sorted(zip(FEATURE_NAMES, rf_model.feature_importances_), key=lambda x: x[1], reverse=True):
        print(f"     {name:30s} importance = {imp:.4f}")

    print(f"\n   Classification Report (RF):\n{classification_report(y_test, rf_preds, target_names=['Safe', 'Risky'])}")

    return results, scaler


# ═══════════════════════════════════════════════════════
# STEP 4: Select & Export Best Model
# ═══════════════════════════════════════════════════════

def select_and_export(results: dict, scaler):
    """
    Select best model by F1-score and export artifacts & registry.
    """
    print("\n" + "=" * 90)
    print("📊 MODEL COMPARISON SUMMARY (TEMPORAL TEST EVALUATION)")
    print("=" * 90)

    comparison = []
    for key, res in results.items():
        m = res["metrics"]
        comparison.append({
            "Model": m["algorithm"],
            "Version": res["version_tag"],
            "Precision": f"{m['precision']:.4f}",
            "Recall": f"{m['recall']:.4f}",
            "F1": f"{m['f1_score']:.4f}",
            "ROC-AUC": f"{m['roc_auc']:.4f}",
            "PR-AUC": f"{m['pr_auc']:.4f}",
            "Bal-Acc": f"{m['balanced_accuracy']:.4f}",
            "False-Alert": f"{m['false_alert_rate']:.4f}",
            "Brier": f"{m['brier_score']:.4f}",
        })

    comparison_df = pd.DataFrame(comparison)
    print(comparison_df.to_string(index=False))

    # Pilih model terlatih terbaik berdasarkan F1-Score
    trainable_results = {k: v for k, v in results.items() if v["model"] is not None}
    best_key = max(trainable_results, key=lambda k: trainable_results[k]["metrics"]["f1_score"])
    best = trainable_results[best_key]
    best_metrics = best["metrics"]

    print(f"\n🏆 Best Deployed ML Model: {best_metrics['algorithm']} ({best['version_tag']})")
    print(f"   F1-Score: {best_metrics['f1_score']:.4f} | PR-AUC: {best_metrics['pr_auc']:.4f}")

    # Export model utama dan scaler
    model_path = ARTIFACTS_DIR / "risk_model.joblib"
    scaler_path = ARTIFACTS_DIR / "risk_scaler.joblib"
    metadata_path = ARTIFACTS_DIR / "model_metadata.json"
    metadata_trained_path = ARTIFACTS_DIR / "model_metadata_trained.json"

    joblib.dump(best["model"], model_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "version_tag": best["version_tag"],
        "algorithm": best_metrics["algorithm"],
        "precision": best_metrics["precision"],
        "recall": best_metrics["recall"],
        "f1_score": best_metrics["f1_score"],
        "roc_auc": best_metrics["roc_auc"],
        "pr_auc": best_metrics["pr_auc"],
        "balanced_accuracy": best_metrics["balanced_accuracy"],
        "false_alert_rate": best_metrics["false_alert_rate"],
        "brier_score": best_metrics["brier_score"],
        "feature_names": FEATURE_NAMES,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "split_method": "temporal_per_user",
        "train_months": "1-3",
        "test_month": "4",
        "random_seed": RANDOM_SEED,
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    with open(metadata_trained_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Export model registry lengkap dari hasil pelatihan nyata
    registry = []
    for key, res in results.items():
        m = res["metrics"]
        registry.append({
            "id": f"model-{key}-001",
            "version_tag": res["version_tag"],
            "algorithm": m["algorithm"],
            "precision": m["precision"],
            "recall": m["recall"],
            "f1_score": m["f1_score"],
            "roc_auc": m["roc_auc"],
            "pr_auc": m["pr_auc"],
            "balanced_accuracy": m["balanced_accuracy"],
            "false_alert_rate": m["false_alert_rate"],
            "brier_score": m["brier_score"],
            "is_active": key == best_key,
            "artifact_path": f"artifacts_risk/{key}_{res['version_tag']}.joblib" if res["model"] is not None else None,
            "deployed_at": datetime.now(timezone.utc).isoformat(),
        })

    registry_trained_path = ARTIFACTS_DIR / "model_registry_trained.json"
    with open(registry_trained_path, "w") as f:
        json.dump(registry, f, indent=2)

    # Tulis juga ke model_registry.json untuk digunakan runtime sistem jika belum ada
    registry_path = ARTIFACTS_DIR / "model_registry.json"
    with open(registry_path, "w") as f:
        json.dump(registry, f, indent=2)

    # Export model individual .joblib
    for key, res in trainable_results.items():
        individual_path = ARTIFACTS_DIR / f"{key}_{res['version_tag']}.joblib"
        joblib.dump(res["model"], individual_path)

    print(f"\n✅ Exported artifacts to: {ARTIFACTS_DIR}/")
    print(f"   - risk_model.joblib (best model)")
    print(f"   - risk_scaler.joblib")
    print(f"   - model_metadata.json & model_metadata_trained.json")
    print(f"   - model_registry.json & model_registry_trained.json")

    return best


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

def main():
    print("=" * 90)
    print("🧠 CEAMIS 2.0 — Pre-Purchase Risk Model Training Pipeline")
    print("=" * 90)

    # 1. Generate synthetic data
    df = generate_synthetic_data()

    # Save raw data for reference
    data_path = ARTIFACTS_DIR / "training_data.csv"
    df.to_csv(data_path, index=False)
    print(f"\n💾 Training data saved: {data_path}")

    # 2. Temporal split (NO RANDOM SHUFFLE!)
    X_train, X_test, y_train, y_test = temporal_split(df, train_months=3)

    # 3. Train & evaluate
    results, scaler = train_and_evaluate(X_train, X_test, y_train, y_test)

    # 4. Select & export
    best = select_and_export(results, scaler)

    print("\n" + "=" * 90)
    print("✅ Training pipeline completed successfully!")
    print("=" * 90)

    return best


if __name__ == "__main__":
    main()
