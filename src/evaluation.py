# src/evaluation.py
"""Evaluation metrics: RMSE, MAE, Precision@K, Recall@K, MAP@K, NDCG@K."""
import numpy as np
from surprise import accuracy


def evaluate_model(model, testset):
    """
    Đánh giá model trên test set.

    Args:
        model: Surprise model đã train
        testset: Test set

    Returns:
        dict: RMSE, MAE
    """
    predictions = model.test(testset)
    return {
        "RMSE": accuracy.rmse(predictions),
        "MAE": accuracy.mae(predictions)
    }


def precision_at_k(actual, predicted, k):
    """Precision@K: Trong K gợi ý, có bao nhiêu đúng?"""
    predicted = predicted[:k]
    if len(predicted) == 0:
        return 0.0
    return len(set(actual) & set(predicted)) / k


def recall_at_k(actual, predicted, k):
    """Recall@K: Gợi được bao nhiêu % trong tổng items user thích?"""
    predicted = predicted[:k]
    if len(actual) == 0:
        return 0.0
    return len(set(actual) & set(predicted)) / len(actual)


def average_precision_at_k(actual, predicted, k):
    """AP@K: Precision có tính thứ tự xếp hạng."""
    predicted = predicted[:k]
    if len(actual) == 0 or len(predicted) == 0:
        return 0.0

    score = 0.0
    num_hits = 0.0
    for i, p in enumerate(predicted):
        if p in actual and p not in predicted[:i]:
            num_hits += 1.0
            score += num_hits / (i + 1.0)
    return score / min(len(actual), k)


def map_at_k(all_actuals, all_predicted, k):
    """
    MAP@K: Mean Average Precision across all users.

    Args:
        all_actuals: List of lists of ground truth items per user
        all_predicted: List of lists of predicted items per user
        k: Top-K threshold

    Returns:
        float: MAP@K score
    """
    return float(np.mean([
        average_precision_at_k(a, p, k)
        for a, p in zip(all_actuals, all_predicted)
    ]))


def ndcg_at_k(actual, predicted, k, relevance=None):
    """
    NDCG@K: Normalized Discounted Cumulative Gain.

    Args:
        actual: List of ground truth relevant items
        predicted: List of predicted items (ranked)
        k: Top-K threshold
        relevance: Dict mapping item -> relevance score (default: binary 1 if in actual)

    Returns:
        float: NDCG@K score
    """
    predicted = predicted[:k]
    if len(actual) == 0:
        return 0.0

    if relevance is None:
        relevance = {item: 1.0 for item in actual}

    # DCG = sum(rel_i / log2(i+1)) for i = 0..k-1
    dcg = 0.0
    for i, item in enumerate(predicted):
        rel = relevance.get(item, 0.0)
        dcg += rel / np.log2(i + 2)  # i+2 because log2(1)=0

    # IDCG = ideal DCG (sorted by relevance)
    sorted_rels = sorted([relevance.get(item, 0.0) for item in actual], reverse=True)
    idcg = sum(rel / np.log2(i + 2) for i, rel in enumerate(sorted_rels))

    if idcg == 0:
        return 0.0
    return dcg / idcg


def mean_ndcg_at_k(all_actuals, all_predicted, k):
    """
    Mean NDCG@K across all users.

    Args:
        all_actuals: List of lists of ground truth items per user
        all_predicted: List of lists of predicted items per user
        k: Top-K threshold

    Returns:
        float: Mean NDCG@K score
    """
    return float(np.mean([
        ndcg_at_k(a, p, k)
        for a, p in zip(all_actuals, all_predicted)
    ]))


def f1_at_k(actual, predicted, k):
    """F1@K: Harmonic mean of Precision@K and Recall@K."""
    p = precision_at_k(actual, predicted, k)
    r = recall_at_k(actual, predicted, k)
    if p + r == 0:
        return 0.0
    return 2 * p * r / (p + r)


def evaluate_all_ranking_metrics(all_actuals, all_predicted, k_values=[5, 10, 20]):
    """
    Evaluate all ranking metrics for a set of users.

    Args:
        all_actuals: List of lists of ground truth items per user
        all_predicted: List of lists of predicted items per user
        k_values: List of K values to evaluate

    Returns:
        dict: All metrics at each K
    """
    results = {}
    for k in k_values:
        results[f"precision@{k}"] = float(np.mean([
            precision_at_k(a, p, k)
            for a, p in zip(all_actuals, all_predicted)
        ]))
        results[f"recall@{k}"] = float(np.mean([
            recall_at_k(a, p, k)
            for a, p in zip(all_actuals, all_predicted)
        ]))
        results[f"f1@{k}"] = float(np.mean([
            f1_at_k(a, p, k)
            for a, p in zip(all_actuals, all_predicted)
        ]))
        results[f"map@{k}"] = map_at_k(all_actuals, all_predicted, k)
        results[f"ndcg@{k}"] = mean_ndcg_at_k(all_actuals, all_predicted, k)
    return results
