# BÀI 3: Các thuật toán Recommender System

---

## Sơ đồ tổng quan

```
                    RECOMMENDER SYSTEM
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    COLLABORATIVE    CONTENT-BASED    KNOWLEDGE-BASED
    FILTERING (CF)       (CB)             (KB)
           │               │
           │         ┌─────┘
           │         │
           │     HYBRID ← (Kết hợp CF + CB)
           │
           ├── User-Based CF      ← Đánh giá: user giống user
           ├── Item-Based CF      ← Đánh giá: item giống item
           └── SVD (Matrix Factorization) ← Tìm latent factors
```

---

## 1. COLLABORATIVE FILTERING (CF) — "Người giống bạn"

### 1.1. Ý tưởng cốt lõi

```
NGUYÊN TẮC: "Người có gu giống bạn thích gì, bạn có thể thích cái đó"

Ví dụ:
  → Bạn thích: Phim A, B
  → Lan thích: Phim A, B, C
  → Lan giống bạn (cùng gu)
  → → Gợi: Phim C cho bạn

Không cần biết Phim C là gì — CHỈ cần biết "Lan giống bạn"
```

### 1.2. User-Item Matrix — Ma trận đánh giá

```
Cơ sở dữ liệu của CF:

              Phim A  Phim B  Phim C  Phim D
User A          5       4       ?       1
User B          4       ?       3       5
User C          ?       2       4       ?
User D          3       5       ?       4

? = Chưa rating → ĐÂY CẦN DỰ ĐOÁN

Câu hỏi: User A sẽ thích Phim C không? → Rating = ?
```

### 1.3. User-Based CF — Tìm user giống nhau

```
BƯỚC 1: Tính độ GIỐNG NHAU giữa các user

Dùng Cosine Similarity:
  Vector A = [5, 4, 3]  → User A rating Phim A, B, D
  Vector B = [4, 3, 5]  → User B rating Phim A, C, D

  Cosine(A, B) = (A·B) / (|A| × |B|)
              = (5×4 + 4×3 + 3×5) / (√50 × √50)
              = 47/50 = 0.94 → Rất giống nhau!

Kết quả: User A và User B giống nhau 94%
```

```
BƯỚC 2: Tìm K user GẦN NHẤT

User A cần dự đoán rating Phim C:
→ Tìm 5 user giống A nhất (K=5)
→ Trong 5 user đó, 3 người đã rating Phim C:
  - User B: rating = 4 (giống A: 0.94)
  - User D: rating = 3 (giống A: 0.87)
  - User E: rating = 5 (giống A: 0.82)

BƯỚC 3: Weighted Average

Predicted(A, C) =
  (0.94×4 + 0.87×3 + 0.82×5) / (0.94+0.87+0.82)
  = 10.47 / 2.63 ≈ 3.98 sao

→ Dự đoán: User A sẽ đánh giá Phim C ≈ 4 sao
```

### 1.4. Item-Based CF — Tìm item giống nhau

```
THAY VÌ tìm user giống nhau → Tìm PHIM giống nhau

Bạn thích Phim A (hành động, Marvel, RDJ)
→ Tìm phim GIỐNG Phim A:
  - Phim B: hành động, Marvel, RDJ → 95% giống
  - Phim C: hành động, DC, Batman → 70% giống
→ Gợi Phim B (giống nhất)

Ưu điểm:
  → Phim ít thay đổi hơn user (phim không "thay gu")
  → Netflix, Amazon dùng Item-Based nhiều
```

### 1.5. Code CF với thư viện

```python
# ============================================================
# COLLABORATIVE FILTERING — Dùng thư viện scikit-surprise
# ============================================================
!pip install scikit-surprise

from surprise import Dataset, Reader, KNNBasic, KNNWithMeans
from surprise.model_selection import train_test_split

# Bước 1: Load data vào format Surprise
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(
    ratings[['userId', 'movieId', 'rating']], reader
)

# Bước 2: Chia train/test (80/20)
trainset, testset = train_test_split(data, test_size=0.2)

# Bước 3: User-Based CF (KNN với cosine similarity)
model_user = KNNWithMeans(
    k=20,
    sim_option={'name': 'cosine'}  # Cosine similarity
)
model_user.fit(trainset)

# Bước 4: Item-Based CF (cosine, đo theo item)
model_item = KNNWithMeans(
    k=20,
    sim_option={'name': 'cosine', 'user_based': False}  # False = Item-Based
)
model_item.fit(trainset)

# Bước 5: Dự đoán
pred = model_user.predict(user_id=1, item_id=100)
print(f"Predicted rating: {pred.est:.2f}")

# Bước 6: Đánh giá RMSE
from surprise import accuracy
predictions = model_user.test(testset)
rmse = accuracy.rmse(predictions)
print(f"User-Based CF RMSE: {rmse:.4f}")
```

---

## 2. SVD (MATRIX FACTORIZATION)

### 2.1. Ý tưởng — Tìm "Ẩn số" đằng sau rating

```
VẤN ĐỀ CF CƠ BẢN:
  → Ma trận RATING thưa thớt (95.5% là NaN)
  → Nhiều cặp user-item không có rating

GIẢI PHÁP: Matrix Factorization

Ý tưởng:
  → Mỗi user có VECTOR ẩn: [hành động: 0.9, lãng mạn: 0.1, hài: 0.3]
  → Mỗi phim có VECTOR ẩn: [hành động: 0.95, lãng mạn: 0.05, hài: 0.1]

  → Predicted Rating = Dot(user_vector, item_vector)
  → = 0.9×0.95 + 0.1×0.05 + 0.3×0.1 ≈ 0.89 → ~4.5 sao

→ Model TỰ HỌC các latent factors từ data
→ KHÔNG cần biết trước "hành động", "lãng mạn" là gì
→ Model tự suy ra: có 1 yếu tố → thích phim hành động, 1 yếu tố → thích lãng mạn...
```

```
SVD = Singular Value Decomposition

Rating Matrix (R) = User Matrix (U) × Diagonal (Σ) × Item Matrix (V)

  R (m×n)    U (m×k)     Σ (k×k)    V (k×n)
  ┌       ┐ ┌        ┐ ┌       ┐ ┌       ┐
  │ r₁₁   │ │ u₁     │ │ sigma │ │ v₁    │
  │   r₂₃ │ │   u₂   │ │       │ │   v₂  │
  │ r₃₁   │ │     u₃ │ │       │ │     v₃│
  └       ┘ └        ┘ └       ┘ └       ┘

k = số latent factors (thường 10-100)
→ Model học k vectors này từ data
```

### 2.2. Code SVD

```python
# ============================================================
# SVD — Matrix Factorization với scikit-surprise
# ============================================================
from surprise import SVD

# Train SVD model
svd = SVD(
    n_factors=50,    # Số latent factors (mặc định 100)
    n_epochs=20,     # Số lần train
    lr_all=0.005,    # Learning rate
    random_state=42   # Reproducible
)
svd.fit(trainset)

# Dự đoán
pred = svd.predict(user_id=1, item_id=100)
print(f"SVD Predicted rating: {pred.est:.2f}")

# Đánh giá
predictions = svd.test(testset)
rmse_svd = accuracy.rmse(predictions)
print(f"SVD RMSE: {rmse_svd:.4f}")
```

---

## 3. CONTENT-BASED FILTERING (CB) — "Ghèm gì thì gợi nấy"

### 3.1. Ý tưởng

```
NGUYÊN TẮC: "Nếu bạn thích phim X → Gợi phim Y có ĐẶC ĐIỂM giống X"

Ví dụ:
  → Bạn thích "Iron Man" (hành động, Marvel, RDJ)
  → Hệ thống CB tìm phim GIỐNG:
    - "Avengers" (hành động, Marvel, RDJ) → 95% giống ✅
    - "Thor" (hành động, Marvel) → 80% giống ✅
    - "Titanic" (lãng mạn) → 5% giống ❌

Ưu điểm: KHÔNG CẦN data của user khác
→ Hoạt động với user MỚI (cold start cho CF)
```

### 3.2. TF-IDF — Trích xuất đặc điểm từ Genres

```
Dataset có Genres: "Action|Crime|Thriller"

TF-IDF đếm từ trong genres:
  - "Action": xuất hiện nhiều → TF cao
  - "Crime": đặc trưng → IDF cao
  - "Thriller": đặc trưng → IDF cao

→ TF-IDF vector cho "Heat":
  [Action: 0.8, Crime: 0.7, Thriller: 0.6, Comedy: 0.0, ...]
```

### 3.3. Code Content-Based

```python
# ============================================================
# CONTENT-BASED — TF-IDF + Cosine Similarity
# ============================================================
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Bước 1: Chuẩn bị features từ genres
movies['genres_clean'] = movies['genres'].str.replace('|', ' ', regex=False)

# Bước 2: TF-IDF Vectorizer
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['genres_clean'])

# Bước 3: Cosine Similarity Matrix (items × items)
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Bước 4: Movie ID → Index mapping
movie_idx = pd.Series(movies.index, index=movies['movieId'])

# Bước 5: Hàm gợi phim cho user
def get_content_recommendations(user_id, top_n=10):
    # Lấy phim user đã rated cao
    user_ratings = ratings[ratings['userId'] == user_id]
    top_rated = user_ratings.nlargest(5, 'rating')

    # Tính điểm tổng hợp cho mỗi phim
    scores = {}
    for _, row in top_rated.iterrows():
        movie_id = row['movieId']
        rating = row['rating']
        if movie_id in movie_idx.index:
            idx = movie_idx[movie_id]
            sims = cosine_sim[idx]
            for i, sim in enumerate(sims):
                if i not in user_ratings['movieId'].values:
                    scores[i] = scores.get(i, 0) + sim * rating

    # Sort và trả top N
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    recommendations = []
    for idx, score in sorted_scores[:top_n]:
        movie_id = movies.iloc[idx]['movieId']
        title = movies.iloc[idx]['title']
        recommendations.append({'movieId': movie_id, 'title': title, 'score': score})
    return recommendations

# Test
recs = get_content_recommendations(user_id=1, top_n=5)
for r in recs:
    print(f"  {r['title']}")
```

---

## 4. HYBRID — Kết hợp SVD + Content-Based

### 4.1. Ý tưởng

```
CF/SVD: ❌ Cold start user mới (chưa có rating)
CB:     ❌ Chỉ gợi phim cùng loại (không phát hiện điều mới)

HYBRID = SVD + CB: ✅ Bù điểm yếu nhau

SVD đủ mạnh: Dùng khi user có đủ ratings
CB bổ sung:  Dùng khi SVD không đủ thông tin
```

### 4.2. Chiến lược Hybrid

```
STRATEGY 1: Weighted — Trộn theo trọng số

  Score = w × SVD_score + (1-w) × CB_score

  w = 0.6 → SVD 60%, CB 40%
  → Dùng khi muốn kết hợp đơn giản


STRATEGY 2: Switching — Chuyển đổi

  IF user có < 5 ratings:
      → Dùng Content-Based (vì CF chưa đủ data)
  ELSE:
      → Dùng Hybrid (vì đủ data)

  → Linh hoạt giữa 2 methods


STRATEGY 3: Cascade — Lọc nhiều lớp

  Layer 1: SVD gợi 100 phim đầu
  Layer 2: CB lọc lại → 30 phim
  Layer 3: Ranking → Top 10

  → Tinh chỉnh dần dần
```

### 4.3. Code Hybrid

```python
# ============================================================
# HYBRID — SVD + Content-Based (Weighted)
# ============================================================

class HybridRecommender:
    """Kết hợp SVD và Content-Based."""

    def __init__(self, cf_weight=0.6):
        self.cf_weight = cf_weight
        self.cb_weight = 1 - cf_weight
        self.svd = SVD(n_factors=50, n_epochs=20)
        self.tfidf = None
        self.cosine_sim = None

    def fit(self, ratings_df, movies_df):
        # Train SVD
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            ratings_df[['userId', 'movieId', 'rating']], reader
        )
        trainset = data.build_full_trainset()
        self.svd.fit(trainset)

        # Train Content-Based
        movies_df['genres_clean'] = movies_df['genres'].str.replace('|', ' ')
        self.tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = self.tfidf.fit_transform(movies_df['genres_clean'])
        self.cosine_sim = cosine_similarity(tfidf_matrix)
        self.movies = movies_df
        self.ratings = ratings_df

    def recommend(self, user_id, top_n=10):
        # SVD: gợi dựa trên toàn bộ data
        user_movies = self.ratings[
            self.ratings['userId'] == user_id
        ]['movieId'].values
        all_movies = self.ratings['movieId'].unique()
        unseen = [m for m in all_movies if m not in user_movies]

        svd_scores = {}
        for movie_id in unseen:
            pred = self.svd.predict(user_id, movie_id)
            svd_scores[movie_id] = pred.est

        # Hybrid: kết hợp với CB (simplified)
        # Score = cf_weight × SVD + cb_weight × CB (normalized)
        hybrid_scores = {}
        for movie_id in unseen:
            svd = svd_scores.get(movie_id, 3.0)
            # Normalize CB score (simplified: random for demo)
            cb = np.random.uniform(1, 5)  # placeholder
            hybrid_scores[movie_id] = self.cf_weight * svd + self.cb_weight * cb

        # Sort
        sorted_scores = sorted(
            hybrid_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )

        results = []
        for movie_id, score in sorted_scores[:top_n]:
            title = self.movies[
                self.movies['movieId'] == movie_id
            ]['title'].values
            if len(title) > 0:
                results.append({
                    'movieId': movie_id,
                    'title': title[0],
                    'score': score
                })
        return results

# Sử dụng
hybrid = HybridRecommender(cf_weight=0.7)
hybrid.fit(ratings, movies)
recs = hybrid.recommend(user_id=1, top_n=10)
```

---

## 5. Tổng kết Bài 3

```
╔══════════════════════╦═══════════════╦═══════════════════════╗
║ Thuật toán          ║ Code dùng    ║ Ứng dụng              ║
╠══════════════════════╬═══════════════╬═══════════════════════╣
║ User-Based CF       ║ KNNWithMeans ║ Hiểu cơ bản nhất    ║
║ Item-Based CF        ║ KNNWithMeans ║ So sánh với User-CF  ║
║ SVD                ║ SVD (surprise)║ MẠNH NHẤT, dùng chính ║
║ Content-Based       ║ TF-IDF + Cos ║ Cold start, gợi theo  ║
║                      ║              ║   genres                 ║
║ Hybrid             ║ SVD + CB    ║ Kết hợp cả 2          ║
╚══════════════════════╩═══════════════╩═══════════════════════╝

THỨ TỰ HỌC:
  1. User-Based CF → Hiểu cơ bản nhất (tuần 3)
  2. Item-Based CF → So sánh điểm khác nhau
  3. SVD → Thuật toán chính, mạnh nhất
  4. Content-Based → Giải cold start
  5. Hybrid → Kết hợp tốt nhất

ĐỦ CHO ĐỒ ÁN:
  → 5 thuật toán
  → So sánh RMSE, Precision
  → Demo web với Hybrid
  → Trình bày cho thầy
```

---

## Bài tiếp theo
[05-context-features.md](05-context-features.md) — Temporal & Demographics Analysis
