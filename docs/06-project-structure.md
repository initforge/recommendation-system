# BÀI 6: Cấu trúc dự án & Clean Code

---

## 1. Tổng quan cấu trúc

```
recommend-system/                      ← Thư mục gốc
│
├── 📁 docs/                          ← Tài liệu (đọc hiểu)
│   ├── 00-README.md                 ← Mục lục
│   ├── 01-gioi-thieu.md             ← Recommender System là gì
│   ├── 02-tai-sao-chon-phim.md      ← Tại sao phim + Dataset
│   ├── 02b-chi-tiet-dataset.md      ← Chi tiết dataset
│   ├── 03-thuat-toan.md              ← 5 thuật toán + code mẫu
│   ├── 04-danh-gia-metrics.md       ← RMSE, Precision, Recall, MAP, NDCG
│   ├── 05-context-features.md        ← Temporal + Demographics
│   ├── 06-project-structure.md       ← Cấu trúc này
│   └── 07-implementation-roadmap.md ← Lộ trình code
│
├── 📁 notebooks/                    ← Google Colab Notebooks
│   ├── 01_setup_eda.ipynb           ← Setup + EDA + Visualize
│   ├── 02_user_cf.ipynb             ← User-Based CF
│   ├── 03_item_cf.ipynb             ← Item-Based CF
│   ├── 04_svd.ipynb                 ← SVD (Matrix Factorization)
│   ├── 05_content_based.ipynb        ← Content-Based Filtering
│   ├── 06_hybrid.ipynb              ← Hybrid System
│   ├── 07_context_features.ipynb     ← Temporal + Demographics
│   ├── 08_evaluation.ipynb          ← So sánh + export CSV
│   └── 00_full_pipeline.ipynb        ← CHẠY NAY: toàn bộ → export JSON
│
├── 📁 frontend/                     ← Web Demo (HTML/CSS/JS) trên Cloudflare Pages
│   ├── index.html                   ← Giao diện tĩnh tâm (Zen UX)
│   └── app.js                       ← JavaScript kết nối ngrok API Backend
│
├── 📁 src/                          ← Python modules (shared)
│   ├── __init__.py                  ← Import helpers
│   ├── constants.py                 ← Config, paths
│   ├── data_loader.py              ← Load MovieLens 1M
│   ├── models.py                  ← 5 algorithms
│   ├── evaluation.py               ← RMSE, MAE, MAP, NDCG, Precision@K, Recall@K
│   └── context.py                 ← Temporal + Demographics
│
├── 📁 data/
│   ├── raw/ml-1m/                 ← Dataset gốc
│   │   ├── ratings.dat
│   │   ├── movies.dat
│   │   └── users.dat
│   └── processed/                  ← Cleaned data (notebook 01 tạo)
│
├── 📁 results/
│   ├── charts/                    ← Biểu đồ PNG
│   └── reports/                    ← Kết quả JSON (từ notebook export)
│        ├── eda_stats.json
│        ├── rmse_summary.json
│        ├── evaluation_results.json
│        ├── context_analysis.json
│        └── final_evaluation.csv
│
├── 📁 slides/                     ← Slide trình bày
│   └── notes.md
│
├── requirements.txt
├── README.md
└── DEPLOY.md
```

---

## 2. Clean Code Rules (Đã thống nhất)

```
✅ Naming:
  → File: snake_case
  → Class: PascalCase
  → Function: snake_case
  → Constant: SCREAMING_SNAKE

✅ File < 300 dòng

✅ Thứ tự trong file:
  1. Module docstring
  2. Built-in imports
  3. Third-party imports
  4. Local imports
  5. Constants
  6. Helper functions (_prefixed)
  7. Classes
  8. Public functions
  9. if __name__ == "__main__"

✅ Comment: Giải thích TẠI SAO, không lặp lại code

✅ Dependencies:
  constants → data_loader → models → evaluation
  (Không đi ngược lại)
```

---

## 3. Chi tiết src/

### 3.1. `src/constants.py`

```
Mục đích: Tất cả config ở 1 chỗ
Dòng: ~50
Phụ thuộc: Không (layer 0)
```

```python
# src/constants.py
"""Constants và cấu hình mặc định."""

DATA_DIR = "data/raw/ml-1m"
RESULTS_DIR = "results"
CHARTS_DIR = "results/charts"

# Model
DEFAULT_K = 20
MIN_RATINGS_FOR_CF = 5
DEFAULT_SVD_FACTORS = 50
DEFAULT_N_EPOCHS = 20

# Hybrid
DEFAULT_CF_WEIGHT = 0.6

# Evaluation
TEST_SIZE = 0.2
RANDOM_SEED = 42
RATING_MIN, RATING_MAX = 1.0, 5.0
```

### 3.2. `src/data_loader.py`

```
Mục đích: Load + preprocess dataset
Dòng: ~80
Phụ thuộc: constants
```

```python
# src/data_loader.py
"""Load và preprocess MovieLens dataset."""
import pandas as pd
from pathlib import Path
from .constants import DATA_DIR

def load_movielens():
    """Load tất cả 3 files."""
    ratings = pd.read_csv(Path(DATA_DIR) / "ratings.dat",
        sep="::", engine="python",
        names=["userId", "movieId", "rating", "timestamp"])

    movies = pd.read_csv(Path(DATA_DIR) / "movies.dat",
        sep="::", engine="python",
        names=["movieId", "title", "genres"],
        encoding="latin-1")

    users = pd.read_csv(Path(DATA_DIR) / "users.dat",
        sep="::", engine="python",
        names=["userId", "gender", "age", "occupation", "zipcode"])

    return ratings, movies, users
```

### 3.3. `src/models.py`

```
Mục đích: 5 algorithms (gộp 1 file)
Dòng: ~200
Phụ thuộc: data_loader, constants
```

```python
# src/models.py
"""5 recommendation algorithms."""
import numpy as np
from surprise import SVD, KNNWithMeans, Dataset, Reader
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from .data_loader import load_movielens
from .constants import DEFAULT_K, DEFAULT_SVD_FACTORS, DEFAULT_N_EPOCHS


# ============================================================
# USER-BASED CF
# ============================================================
def train_user_cf(ratings_df):
    """Train User-Based CF model."""
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(
        ratings_df[['userId', 'movieId', 'rating']], reader)
    trainset = data.build_full_trainset()
    model = KNNWithMeans(k=DEFAULT_K, sim_option={'name': 'cosine'})
    model.fit(trainset)
    return model


# ============================================================
# ITEM-BASED CF
# ============================================================
def train_item_cf(ratings_df):
    """Train Item-Based CF model."""
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(
        ratings_df[['userId', 'movieId', 'rating']], reader)
    trainset = data.build_full_trainset()
    model = KNNWithMeans(k=DEFAULT_K, sim_option={
        'name': 'cosine', 'user_based': False})
    model.fit(trainset)
    return model


# ============================================================
# SVD
# ============================================================
def train_svd(ratings_df, n_factors=DEFAULT_SVD_FACTORS, n_epochs=DEFAULT_N_EPOCHS):
    """Train SVD model."""
    reader = Reader(rating_scale=(1, 5))
    data = Dataset.load_from_df(
        ratings_df[['userId', 'movieId', 'rating']], reader)
    trainset = data.build_full_trainset()
    model = SVD(n_factors=n_factors, n_epochs=n_epochs)
    model.fit(trainset)
    return model


# ============================================================
# CONTENT-BASED
# ============================================================
class ContentBasedModel:
    """Content-Based model dùng TF-IDF + Genres."""

    def fit(self, movies_df):
        movies_df = movies_df.copy()
        movies_df['genres_clean'] = movies_df['genres'].str.replace('|', ' ')
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(movies_df['genres_clean'])
        self.movies = movies_df
        self.movie_idx = pd.Series(movies_df.index, index=movies_df['movieId'])
        return self

    def recommend(self, user_id, ratings_df, top_n=10):
        user_ratings = ratings_df[ratings_df['userId'] == user_id]
        top_rated = user_ratings.nlargest(5, 'rating')

        scores = {}
        for _, row in top_rated.iterrows():
            mid = row['movieId']
            if mid in self.movie_idx.index:
                idx = self.movie_idx[mid]
                sims = cosine_similarity(
                    self.tfidf_matrix[idx], self.tfidf_matrix).flatten()
                for i, s in enumerate(sims):
                    if i not in user_ratings['movieId'].values:
                        scores[i] = scores.get(i, 0) + s * row['rating']

        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        results = []
        for idx, score in sorted_scores[:top_n]:
            mid = self.movies.iloc[idx]['movieId']
            title = self.movies.iloc[idx]['title']
            results.append({'movieId': mid, 'title': title, 'score': score})
        return results


# ============================================================
# HYBRID
# ============================================================
class HybridRecommender:
    """Hybrid: SVD + Content-Based (weighted)."""

    def __init__(self, cf_weight=0.6):
        self.cf_weight = cf_weight
        self.cb_weight = 1 - cf_weight
        self.svd = None
        self.cb = ContentBasedModel()

    def fit(self, ratings_df, movies_df):
        self.svd = train_svd(ratings_df)
        self.cb.fit(movies_df)
        self.ratings = ratings_df
        self.movies = movies_df
        return self

    def recommend(self, user_id, top_n=10):
        user_movies = self.ratings[
            self.ratings['userId'] == user_id]['movieId'].values
        all_movies = self.ratings['movieId'].unique()
        unseen = [m for m in all_movies if m not in user_movies]

        hybrid_scores = {}
        for movie_id in unseen:
            svd_pred = self.svd.predict(user_id, movie_id).est
            # Simplified hybrid
            hybrid_scores[movie_id] = (
                self.cf_weight * svd_pred +
                self.cb_weight * 3.0
            )

        sorted_scores = sorted(
            hybrid_scores.items(), key=lambda x: x[1], reverse=True)

        results = []
        for mid, score in sorted_scores[:top_n]:
            title = self.movies[
                self.movies['movieId'] == mid]['title'].values
            if len(title) > 0:
                results.append({
                    'movieId': mid,
                    'title': title[0],
                    'score': score
                })
        return results
```

### 3.4. `src/evaluation.py`

```
Mục đích: Tính metrics
Dòng: ~80
Phụ thuộc: models
```

```python
# src/evaluation.py
"""Evaluation metrics: RMSE, MAE, Precision@K, Recall@K."""
import numpy as np
from surprise import accuracy

def evaluate_model(model, testset):
    """Đánh giá model trên test set."""
    predictions = model.test(testset)
    return {
        'RMSE': accuracy.rmse(predictions),
        'MAE': accuracy.mae(predictions)
    }

def precision_at_k(actual, predicted, k):
    """Precision@K."""
    predicted = predicted[:k]
    return len(set(actual) & set(predicted)) / k

def recall_at_k(actual, predicted, k):
    """Recall@K."""
    predicted = predicted[:k]
    return len(set(actual) & set(predicted)) / len(actual)
```

### 3.5. `src/context.py`

```
Mục đích: Temporal + Demographics analysis
Dòng: ~100
Phụ thuộc: data_loader
```

```python
# src/context.py
"""Context features: Temporal + Demographics analysis."""
import pandas as pd
from .data_loader import load_movielens

def get_temporal_features(ratings_df):
    """Trích xuất temporal features từ timestamp."""
    df = ratings_df.copy()
    df['datetime'] = pd.to_datetime(df['timestamp'], unit='s')
    df['year'] = df['datetime'].dt.year
    df['month'] = df['datetime'].dt.month
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['hour'] = df['datetime'].dt.hour
    return df

def get_demographics_features(users_df):
    """Map demographics codes thành labels."""
    df = users_df.copy()
    age_map = {1: "Under 18", 18: "18-24", 25: "25-34",
               35: "35-44", 45: "45-49", 50: "50-55", 56: "56+"}
    occ_map = {0: "other", 1: "academic", 2: "artist",
               3: "clerical", 4: "student", 5: "customer service",
               6: "doctor", 7: "executive", 8: "farmer",
               9: "homemaker", 10: "K-12 student", 11: "lawyer",
               12: "programmer", 13: "retired", 14: "sales",
               15: "scientist", 16: "self-employed", 17: "engineer",
               18: "tradesman", 19: "unemployed", 20: "writer"}
    df['age_group'] = df['age'].map(age_map)
    df['occupation_name'] = df['occupation'].map(occ_map)
    return df
```

---

## 4. Chi tiết notebooks/

```
Mỗi notebook = 1 bước, có thể chạy độc lập

01_setup_eda.ipynb
  → Setup Colab
  → Load data
  → EDA (phân tích dữ liệu)
  → Visualize

02_user_cf.ipynb
  → User-Based CF
  → Kết quả RMSE

03_item_cf.ipynb
  → Item-Based CF
  → So sánh với User-Based

04_svd.ipynb
  → SVD với scikit-surprise
  → So sánh 20/50/100 factors

05_content_based.ipynb
  → TF-IDF + Cosine
  → Genres features

06_hybrid.ipynb
  → Hybrid SVD + CB
  → Weighted combination

07_context_analysis.ipynb
  → Temporal analysis
  → Demographics analysis
  → Insights
```

---

## 5. Tổng kết

```
src/ gồm 5 files:
├── __init__.py       (~5 dòng) — Import helpers
├── constants.py      (~50 dòng) — Config, paths, defaults
├── data_loader.py    (~80 dòng) — Load MovieLens 1M
├── models.py        (~230 dòng) — 5 algorithms (Hybrid dùng cosine thật)
├── evaluation.py    (~130 dòng) — RMSE, MAE, MAP@K, NDCG@K, Precision@K, Recall@K
└── context.py      (~170 dòng) — Temporal + Demographics
= ~620 dòng total

notebooks/ gồm 9 files:
→ 1 notebook = 1 step riêng
→ notebooks 01–08: chạy riêng lẻ để học
→ notebooks/00_full_pipeline.ipynb: CHẠY CÂY NÀY → export JSON cho web
→ Mỗi file có code + kết quả + chart
```
