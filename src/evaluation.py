# src/evaluation.py
"""Evaluation metrics: RMSE, MAE, Precision@K, Recall@K."""
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
