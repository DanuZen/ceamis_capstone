"""
Risk Model Training Pipeline — CEAMIS 2.0
Melatih model prediksi risiko pra-pembelian (Pre-Purchase Risk Prediction).

Alur:
  1. Generate synthetic training data (demo — production: use real transaction history)
  2. Extract 7 contextual features
  3. Temporal split per-user (WAJIB — sesuai arahan dosen)
  4. Train Logistic Regression (Model 1) & Random Forest (Model 2)
  5. Evaluate & compare (Precision, Recall, F1, ROC-AUC)
  6. Export best model as .joblib to artifacts_risk/

Referensi:
  docs/ceamis 2.0/MODEL_PREDIKSI_RISIKO.md

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

import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import (
    precision_score, recall_score, f1_score, roc_auc_score,
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
# STEP 3: Train & Evaluate Models
# ═══════════════════════════════════════════════════════

def train_and_evaluate(X_train, X_test, y_train, y_test):
    """
    Train Logistic Regression & Random Forest, evaluate both.
    Return the best model and its metadata.
    """
    # Standardize features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    results = {}

    # ── Model 1: Logistic Regression ──
    print("\n🔬 Training Logistic Regression...")
    lr_model = LogisticRegression(
        random_state=RANDOM_SEED,
        max_iter=1000,
        class_weight="balanced",
        C=1.0,
    )
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)
    lr_proba = lr_model.predict_proba(X_test_scaled)[:, 1]

    lr_metrics = {
        "algorithm": "LogisticRegression",
        "precision": round(precision_score(y_test, lr_preds), 4),
        "recall": round(recall_score(y_test, lr_preds), 4),
        "f1_score": round(f1_score(y_test, lr_preds), 4),
        "roc_auc": round(roc_auc_score(y_test, lr_proba), 4),
    }
    results["logreg"] = {
        "model": lr_model,
        "metrics": lr_metrics,
        "version_tag": "v1.0.0-logreg",
    }

    print(f"   Precision: {lr_metrics['precision']:.4f}")
    print(f"   Recall:    {lr_metrics['recall']:.4f}")
    print(f"   F1-Score:  {lr_metrics['f1_score']:.4f}")
    print(f"   ROC-AUC:   {lr_metrics['roc_auc']:.4f}")

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

    rf_metrics = {
        "algorithm": "RandomForestClassifier",
        "precision": round(precision_score(y_test, rf_preds), 4),
        "recall": round(recall_score(y_test, rf_preds), 4),
        "f1_score": round(f1_score(y_test, rf_preds), 4),
        "roc_auc": round(roc_auc_score(y_test, rf_proba), 4),
    }
    results["rf"] = {
        "model": rf_model,
        "metrics": rf_metrics,
        "version_tag": "v1.1.0-rf",
    }

    print(f"   Precision: {rf_metrics['precision']:.4f}")
    print(f"   Recall:    {rf_metrics['recall']:.4f}")
    print(f"   F1-Score:  {rf_metrics['f1_score']:.4f}")
    print(f"   ROC-AUC:   {rf_metrics['roc_auc']:.4f}")

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
    """Select best model by F1-score and export as .joblib."""
    print("\n" + "=" * 60)
    print("📊 MODEL COMPARISON SUMMARY")
    print("=" * 60)

    comparison = []
    for key, res in results.items():
        m = res["metrics"]
        comparison.append({
            "Model": m["algorithm"],
            "Version": res["version_tag"],
            "Precision": m["precision"],
            "Recall": m["recall"],
            "F1": m["f1_score"],
            "ROC-AUC": m["roc_auc"],
        })

    comparison_df = pd.DataFrame(comparison)
    print(comparison_df.to_string(index=False))

    # Select best by F1 score
    best_key = max(results, key=lambda k: results[k]["metrics"]["f1_score"])
    best = results[best_key]
    best_metrics = best["metrics"]

    print(f"\n🏆 Best Model: {best_metrics['algorithm']} ({best['version_tag']})")
    print(f"   F1-Score: {best_metrics['f1_score']:.4f}")

    # Export model
    model_path = ARTIFACTS_DIR / "risk_model.joblib"
    scaler_path = ARTIFACTS_DIR / "risk_scaler.joblib"
    metadata_path = ARTIFACTS_DIR / "model_metadata.json"

    joblib.dump(best["model"], model_path)
    joblib.dump(scaler, scaler_path)

    metadata = {
        "version_tag": best["version_tag"],
        "algorithm": best_metrics["algorithm"],
        "precision": best_metrics["precision"],
        "recall": best_metrics["recall"],
        "f1_score": best_metrics["f1_score"],
        "roc_auc": best_metrics["roc_auc"],
        "feature_names": FEATURE_NAMES,
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "split_method": "temporal_per_user",
        "train_months": "1-3",
        "test_month": "4",
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    # Also export model registry
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
            "is_active": key == best_key,
            "artifact_path": f"artifacts_risk/{key}_{res['version_tag']}.joblib",
            "deployed_at": datetime.now(timezone.utc).isoformat(),
        })

    registry_path = ARTIFACTS_DIR / "model_registry.json"
    with open(registry_path, "w") as f:
        json.dump(registry, f, indent=2)

    # Export individual models
    for key, res in results.items():
        individual_path = ARTIFACTS_DIR / f"{key}_{res['version_tag']}.joblib"
        joblib.dump(res["model"], individual_path)

    print(f"\n✅ Exported to: {ARTIFACTS_DIR}/")
    print(f"   - risk_model.joblib (best model)")
    print(f"   - risk_scaler.joblib")
    print(f"   - model_metadata.json")
    print(f"   - model_registry.json")

    return best


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("🧠 CEAMIS 2.0 — Pre-Purchase Risk Model Training Pipeline")
    print("=" * 60)

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

    print("\n" + "=" * 60)
    print("✅ Training pipeline completed successfully!")
    print("=" * 60)

    return best


if __name__ == "__main__":
    main()
