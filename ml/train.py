"""
iQOO Adaptive Performance Intelligence - ML Model Training v2
Trains prediction models with full evaluation: precision, recall, F1, confusion matrix, latency.
"""

import os
import sys
import json
import time
import pickle
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    precision_score, recall_score, f1_score,
    confusion_matrix, classification_report,
    accuracy_score
)
import warnings
warnings.filterwarnings('ignore')

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'sample_telemetry.csv')
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'backend', 'models')


def load_data():
    """Load the generated telemetry dataset."""
    if not os.path.exists(DATA_PATH):
        print(f"[ERROR] Dataset not found at {DATA_PATH}")
        print("Run data_generator.py first.")
        sys.exit(1)
    return pd.read_csv(DATA_PATH)


def create_features(df):
    """Create additional features for better predictions."""
    df = df.copy()

    # Feature engineering
    df['cpu_gpu_ratio'] = df['cpu_usage'] / (df['gpu_usage'] + 1)
    df['thermal_stress'] = df['temperature'] * df['cpu_usage'] / 100
    df['power_draw'] = (df['cpu_usage'] + df['gpu_usage']) / 2
    df['load_imbalance'] = abs(df['cpu_usage'] - df['gpu_usage'])
    df['memory_pressure'] = df['ram_usage'] * df['background_processes'] / 100

    # Encode categorical
    if 'app_usage' in df.columns:
        le_app = LabelEncoder()
        df['app_encoded'] = le_app.fit_transform(df['app_usage'].astype(str))
    else:
        df['app_encoded'] = 0

    if 'performance_mode' in df.columns:
        le_mode = LabelEncoder()
        df['mode_encoded'] = le_mode.fit_transform(df['performance_mode'].astype(str))
    else:
        df['mode_encoded'] = 1

    return df


def evaluate_model(model, X_test, y_test, target_name):
    """Full evaluation with precision, recall, F1, confusion matrix, and latency."""
    start_time = time.time()
    y_pred = model.predict(X_test)
    latency_ms = (time.time() - start_time) * 1000

    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    accuracy = accuracy_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred).tolist()

    # Per-class metrics
    report = classification_report(y_test, y_pred, output_dict=True, zero_division=0)

    return {
        'target': target_name,
        'accuracy': round(accuracy, 4),
        'precision': round(precision, 4),
        'recall': round(recall, 4),
        'f1_score': round(f1, 4),
        'inference_latency_ms': round(latency_ms / max(1, len(y_test)), 4),
        'confusion_matrix': conf_matrix,
        'classification_report': report,
        'test_samples': len(y_test),
    }


def train_models():
    """Train prediction models with full evaluation."""
    print("=" * 60)
    print("iQOO Adaptive Performance Intelligence - ML Training v2")
    print("=" * 60)

    df = load_data()
    print(f"Loaded {len(df)} samples")

    df = create_features(df)

    # Feature columns
    feature_cols = [
        'cpu_usage', 'gpu_usage', 'ram_usage', 'temperature',
        'battery_level', 'fps', 'network_usage', 'background_processes',
        'app_encoded', 'mode_encoded',
        'cpu_gpu_ratio', 'thermal_stress', 'power_draw', 'load_imbalance'
    ]

    X = df[feature_cols].values
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Targets
    targets = {
        'overheating_risk': (df['overheating_risk'] > 50).astype(int) if 'overheating_risk' in df.columns else (df['temperature'] > 40).astype(int),
        'fps_drop_risk': (df['fps_drop_risk'] > 50).astype(int) if 'fps_drop_risk' in df.columns else (df['fps'] < 50).astype(int),
        'battery_drain_risk': (df['battery_drain_risk'] > 50).astype(int) if 'battery_drain_risk' in df.columns else ((df['cpu_usage'] > 75) & (df['battery_level'] < 50)).astype(int),
        'performance_degradation': ((df['cpu_usage'] > 80) | (df['gpu_usage'] > 85) | (df['temperature'] > 42)).astype(int),
    }

    label_encoders = {}
    models = {}
    evaluation_results = []
    best_models = {}

    for target_name, y in targets.items():
        print(f"\n{'─' * 40}")
        print(f"Training: {target_name}")
        print(f"  Positive samples: {y.sum()}/{len(y)} ({y.mean()*100:.1f}%)")

        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42, stratify=y
        )

        # Try Random Forest
        rf = RandomForestClassifier(
            n_estimators=50, max_depth=10, random_state=42,
            n_jobs=-1, class_weight='balanced'
        )
        rf.fit(X_train, y_train)
        rf_eval = evaluate_model(rf, X_test, y_test, target_name + '_rf')

        # Try Gradient Boosting
        gb = GradientBoostingClassifier(
            n_estimators=50, max_depth=5, random_state=42,
            learning_rate=0.1
        )
        gb.fit(X_train, y_train)
        gb_eval = evaluate_model(gb, X_test, y_test, target_name + '_gb')

        # Pick best by F1
        if rf_eval['f1_score'] >= gb_eval['f1_score']:
            best = rf
            best_eval = rf_eval
            best_name = 'RandomForest'
        else:
            best = gb
            best_eval = gb_eval
            best_name = 'GradientBoosting'

        models[target_name] = best
        best_models[target_name] = best_name
        evaluation_results.append(best_eval)

        print(f"  Best: {best_name}")
        print(f"  Accuracy:  {best_eval['accuracy']:.4f}")
        print(f"  Precision: {best_eval['precision']:.4f}")
        print(f"  Recall:    {best_eval['recall']:.4f}")
        print(f"  F1 Score:  {best_eval['f1_score']:.4f}")
        print(f"  Latency:   {best_eval['inference_latency_ms']:.4f}ms/sample")
        print(f"  Confusion: {best_eval['confusion_matrix']}")

    # Save models
    os.makedirs(MODELS_DIR, exist_ok=True)

    with open(os.path.join(MODELS_DIR, 'prediction_models.pkl'), 'wb') as f:
        pickle.dump(models, f)
    with open(os.path.join(MODELS_DIR, 'scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    with open(os.path.join(MODELS_DIR, 'label_encoders.pkl'), 'wb') as f:
        pickle.dump(label_encoders, f)

    # Save metadata and evaluation
    metadata = {
        'training_date': time.strftime('%Y-%m-%d %H:%M:%S'),
        'dataset_size': len(df),
        'feature_columns': feature_cols,
        'models_used': best_models,
        'evaluation': evaluation_results,
        'overall_metrics': {
            'avg_accuracy': round(np.mean([e['accuracy'] for e in evaluation_results]), 4),
            'avg_precision': round(np.mean([e['precision'] for e in evaluation_results]), 4),
            'avg_recall': round(np.mean([e['recall'] for e in evaluation_results]), 4),
            'avg_f1': round(np.mean([e['f1_score'] for e in evaluation_results]), 4),
            'avg_latency_ms': round(np.mean([e['inference_latency_ms'] for e in evaluation_results]), 4),
        }
    }

    with open(os.path.join(MODELS_DIR, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\n{'=' * 60}")
    print("Training Complete!")
    print(f"{'=' * 60}")
    print(f"Models saved to: {MODELS_DIR}")
    print(f"\nOverall Metrics:")
    print(f"  Avg Accuracy:  {metadata['overall_metrics']['avg_accuracy']:.4f}")
    print(f"  Avg Precision: {metadata['overall_metrics']['avg_precision']:.4f}")
    print(f"  Avg Recall:    {metadata['overall_metrics']['avg_recall']:.4f}")
    print(f"  Avg F1 Score:  {metadata['overall_metrics']['avg_f1']:.4f}")
    print(f"  Avg Latency:   {metadata['overall_metrics']['avg_latency_ms']:.4f}ms")

    return models, scaler, metadata


if __name__ == "__main__":
    train_models()
