# src/models.py
"""5 recommendation algorithms."""
import numpy as np
import pandas as pd
from surprise import SVD, KNNWithMeans, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .constants import DEFAULT_K, DEFAULT_SVD_FACTORS, DEFAULT_N_EPOCHS, DEFAULT_CF_WEIGHT


# ============================================================
# USER-BASED CF
# ============================================================
def train_user_cf(ratings_df, k=DEFAULT_K):
    """
    Train User-Based CF model (KNN với cosine similarity).

    Args:
        ratings_df: DataFrame với columns [userId, movieId, rating]
        k: Số neighbors

    Returns:
        Trained model
    """
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[["userId", "movieId", "rating"]], reader)
    trainset = data.build_full_trainset()
    model = KNNWithMeans(k=k, sim_option={"name": "cosine"})
    model.fit(trainset)
    return model


def recommend_user_cf(model, user_id, ratings_df, movies_df, top_n=10):
    """Gợi phim cho user bằng User-Based CF."""
    user_movies = ratings_df[ratings_df["userId"] == user_id]["movieId"].values
    all_movies = ratings_df["movieId"].unique()
    unseen = [m for m in all_movies if m not in user_movies]

    scores = {}
    for movie_id in unseen:
        pred = model.predict(user_id, movie_id)
        scores[movie_id] = pred.est

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    results = []
    for mid, score in sorted_scores[:top_n]:
        title = movies_df[movies_df["movieId"] == mid]["title"].values
        if len(title) > 0:
            results.append({"movieId": mid, "title": title[0], "score": score})
    return results


# ============================================================
# ITEM-BASED CF
# ============================================================
def train_item_cf(ratings_df, k=DEFAULT_K):
    """
    Train Item-Based CF model (KNN với cosine similarity, user_based=False).

    Args:
        ratings_df: DataFrame với columns [userId, movieId, rating]
        k: Số neighbors

    Returns:
        Trained model
    """
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[["userId", "movieId", "rating"]], reader)
    trainset = data.build_full_trainset()
    model = KNNWithMeans(k=k, sim_option={"name": "cosine", "user_based": False})
    model.fit(trainset)
    return model


def recommend_item_cf(model, user_id, ratings_df, movies_df, top_n=10):
    """Gợi phim cho user bằng Item-Based CF."""
    user_movies = ratings_df[ratings_df["userId"] == user_id]["movieId"].values
    all_movies = ratings_df["movieId"].unique()
    unseen = [m for m in all_movies if m not in user_movies]

    scores = {}
    for movie_id in unseen:
        pred = model.predict(user_id, movie_id)
        scores[movie_id] = pred.est

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    results = []
    for mid, score in sorted_scores[:top_n]:
        title = movies_df[movies_df["movieId"] == mid]["title"].values
        if len(title) > 0:
            results.append({"movieId": mid, "title": title[0], "score": score})
    return results


# ============================================================
# SVD
# ============================================================
def train_svd(ratings_df, n_factors=DEFAULT_SVD_FACTORS, n_epochs=DEFAULT_N_EPOCHS):
    """
    Train SVD model (Matrix Factorization).

    Args:
        ratings_df: DataFrame với columns [userId, movieId, rating]
        n_factors: Số latent factors
        n_epochs: Số lần train

    Returns:
        Trained model
    """
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(ratings_df[["userId", "movieId", "rating"]], reader)
    trainset = data.build_full_trainset()
    model = SVD(n_factors=n_factors, n_epochs=n_epochs, random_state=42)
    model.fit(trainset)
    return model


def recommend_svd(model, user_id, ratings_df, movies_df, top_n=10):
    """Gợi phim cho user bằng SVD."""
    user_movies = ratings_df[ratings_df["userId"] == user_id]["movieId"].values
    all_movies = ratings_df["movieId"].unique()
    unseen = [m for m in all_movies if m not in user_movies]

    scores = {}
    for movie_id in unseen:
        pred = model.predict(user_id, movie_id)
        scores[movie_id] = pred.est

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    results = []
    for mid, score in sorted_scores[:top_n]:
        title = movies_df[movies_df["movieId"] == mid]["title"].values
        if len(title) > 0:
            results.append({"movieId": mid, "title": title[0], "score": score})
    return results


# ============================================================
# CONTENT-BASED
# ============================================================
class ContentBasedModel:
    """Content-Based model dùng TF-IDF trên Genres."""

    def fit(self, movies_df):
        """Train Content-Based model."""
        self.movies = movies_df.copy()
        self.movies["genres_clean"] = self.movies["genres"].str.replace("|", " ", regex=False)
        self.tfidf = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = self.tfidf.fit_transform(self.movies["genres_clean"])
        self.movie_idx = pd.Series(self.movies.index, index=self.movies["movieId"])
        return self

    def recommend(self, user_id, ratings_df, top_n=10):
        """Gợi phim cho user bằng Content-Based."""
        user_ratings = ratings_df[ratings_df["userId"] == user_id]
        top_rated = user_ratings.nlargest(5, "rating")

        scores = {}
        for _, row in top_rated.iterrows():
            mid = row["movieId"]
            if mid in self.movie_idx.index:
                idx = self.movie_idx[mid]
                sims = cosine_similarity(self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
                for i, s in enumerate(sims):
                    if i not in user_ratings["movieId"].values:
                        scores[i] = scores.get(i, 0) + s * row["rating"]

        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in sorted_scores[:top_n]:
            mid = self.movies.iloc[idx]["movieId"]
            title = self.movies.iloc[idx]["title"]
            results.append({"movieId": mid, "title": title, "score": score})
        return results


# ============================================================
# HYBRID
# ============================================================
class HybridRecommender:
    """Hybrid: SVD + Content-Based (weighted).

    Accepts pre-trained models to avoid re-training on every call.
    Uses vectorized cosine similarity for Content-Based scoring.
    """

    def __init__(self, cf_weight=DEFAULT_CF_WEIGHT):
        self.cf_weight = cf_weight
        self.cb_weight = 1 - cf_weight

    def fit(self, ratings_df, movies_df, svd_model=None, cb_model=None):
        """Train or reuse pre-trained models.

        Args:
            ratings_df: Ratings DataFrame
            movies_df: Movies DataFrame
            svd_model: Pre-trained SVD model (optional, will train if None)
            cb_model: Pre-trained ContentBasedModel (optional, will train if None)
        """
        self.svd = svd_model if svd_model is not None else train_svd(ratings_df)
        self.cb = cb_model if cb_model is not None else ContentBasedModel().fit(movies_df)

        # Pre-compute full cosine similarity matrix for vectorized scoring
        self.cosine_sim = cosine_similarity(self.cb.tfidf_matrix)

        self.ratings = ratings_df
        self.movies = movies_df
        return self

    def recommend(self, user_id, top_n=10):
        """Gợi phim cho user bằng Hybrid (SVD + Content-Based cosine similarity)."""
        user_movies = self.ratings[
            self.ratings["userId"] == user_id]["movieId"].values
        all_movies = self.ratings["movieId"].unique()
        unseen = [m for m in all_movies if m not in user_movies]

        user_ratings = self.ratings[self.ratings["userId"] == user_id]
        top_rated = user_ratings.nlargest(5, "rating")

        # Pre-compute reference indices and weights for vectorized CB scoring
        ref_indices = []
        ref_weights = []
        for _, row in top_rated.iterrows():
            mid = row["movieId"]
            if mid in self.cb.movie_idx.index:
                ref_indices.append(self.cb.movie_idx[mid])
                ref_weights.append(row["rating"])

        hybrid_scores = {}
        for movie_id in unseen:
            svd_pred = self.svd.predict(user_id, movie_id).est

            # Vectorized content score using pre-computed similarity matrix
            cb_score = 0.0
            if ref_indices and movie_id in self.cb.movie_idx.index:
                cand_idx = self.cb.movie_idx[movie_id]
                sims = self.cosine_sim[cand_idx, ref_indices]
                cb_score = np.dot(sims, ref_weights) / len(ref_indices)
            else:
                cb_score = 3.0

            hybrid_scores[movie_id] = (
                self.cf_weight * svd_pred +
                self.cb_weight * cb_score
            )

        sorted_scores = sorted(
            hybrid_scores.items(), key=lambda x: x[1], reverse=True)

        results = []
        for mid, score in sorted_scores[:top_n]:
            title = self.movies[
                self.movies["movieId"] == mid]["title"].values
            if len(title) > 0:
                results.append({"movieId": mid, "title": title[0], "score": score})
        return results