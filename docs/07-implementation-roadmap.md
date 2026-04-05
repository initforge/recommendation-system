# BÀI 7: Lộ trình Implementation

---

## Tổng quan

```
GIAI ĐOẠN 1: Setup + EDA         → Tuần 1-2
GIAI ĐOẠN 2: Collaborative Filtering → Tuần 3-4
GIAI ĐOẠN 3: SVD + Content-Based → Tuần 5
GIAI ĐOẠN 4: Hybrid              → Tuần 6
GIAI ĐOẠN 5: Context Analysis      → Tuần 7
GIAI ĐOẠN 6: Evaluation           → Tuần 8
GIAI ĐOẠN 7: Web Demo            → Tuần 9
GIAI ĐOẠN 8: Slide + Báo cáo     → Tuần 10

TỔNG: ~10 tuần
```

---

## GIAI ĐOẠN 1: Setup + EDA (Tuần 1-2)

### Bước 1.1: Setup Colab

```python
# notebook: 01_setup_eda.ipynb

# 1. Cài thư viện
!pip install scikit-surprise pandas numpy matplotlib seaborn

# 2. Tải dataset
!wget https://files.grouplens.org/datasets/movielens/ml-1m.zip
!unzip ml-1m.zip -d data/

# 3. Import
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```

### Bước 1.2: Load + Kiểm tra

```python
# Load 3 files
ratings = pd.read_csv(
    "ml-1m/ratings.dat", sep="::", engine="python",
    names=["userId", "movieId", "rating", "timestamp"])
movies = pd.read_csv(
    "ml-1m/movies.dat", sep="::", engine="python",
    names=["movieId", "title", "genres"], encoding="latin-1")
users = pd.read_csv(
    "ml-1m/users.dat", sep="::", engine="python",
    names=["userId", "gender", "age", "occupation", "zipcode"])

# Thống kê cơ bản
print(f"Ratings: {len(ratings):,}")
print(f"Movies: {len(movies):,}")
print(f"Users: {len(users):,}")
print(f"Rating TB: {ratings['rating'].mean():.2f}")
```

### Bước 1.3: EDA + Visualize

```python
# Biểu đồ 1: Phân bố rating
plt.figure(figsize=(8, 5))
ratings['rating'].value_counts().sort_index().plot(kind='bar', color='steelblue')
plt.title("Phân bố Rating")
plt.xlabel("Rating")
plt.ylabel("Số lượng")
plt.savefig('rating_distribution.png')
plt.show()

# Biểu đồ 2: Top 10 phim được rating nhiều nhất
top_movies = ratings.groupby('movieId').size().sort_values(ascending=False).head(10)
top_df = top_movies.reset_index()
top_df.columns = ['movieId', 'count']
top_df = top_df.merge(movies[['movieId', 'title']])
print(top_df[['title', 'count']])

# Biểu đồ 3: Phân bố số ratings mỗi user
plt.figure(figsize=(10, 5))
ratings.groupby('userId').size().hist(bins=50, color='coral')
plt.title("Số ratings mỗi user")
plt.savefig('user_rating_hist.png')
plt.show()
```

### Deliverable Giai đoạn 1
```
✅ notebook: 01_setup_eda.ipynb
✅ Biểu đồ: rating_distribution.png, user_rating_hist.png
✅ Hiểu: Dataset gồm 1M ratings, 6K users, 3.7K movies
```

---

## GIAI ĐOẠN 2: Collaborative Filtering (Tuần 3-4)

### Bước 2.1: User-Based CF

```python
# notebook: 02_user_cf.ipynb

from surprise import Dataset, Reader, KNNWithMeans
from surprise.model_selection import train_test_split
from surprise import accuracy

# Load data
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(
    ratings[['userId', 'movieId', 'rating']], reader)
trainset, testset = train_test_split(data, test_size=0.2)

# Train User-Based CF
model_user = KNNWithMeans(
    k=20,
    sim_option={'name': 'cosine'}
)
model_user.fit(trainset)

# Evaluate
predictions = model_user.test(testset)
rmse_user = accuracy.rmse(predictions)
print(f"User-Based CF RMSE: {rmse_user:.4f}")
```

### Bước 2.2: Item-Based CF

```python
# notebook: 03_item_cf.ipynb

# Train Item-Based CF
model_item = KNNWithMeans(
    k=20,
    sim_option={'name': 'cosine', 'user_based': False}
)
model_item.fit(trainset)

# Evaluate
predictions = model_item.test(testset)
rmse_item = accuracy.rmse(predictions)
print(f"Item-Based CF RMSE: {rmse_item:.4f}")

# So sánh
print(f"\nSo sánh:")
print(f"  User-Based CF: RMSE = {rmse_user:.4f}")
print(f"  Item-Based CF: RMSE = {rmse_item:.4f}")
```

### Deliverable Giai đoạn 2
```
✅ notebook: 02_user_cf.ipynb
✅ notebook: 03_item_cf.ipynb
✅ So sánh RMSE: User vs Item CF
```

---

## GIAI ĐOẠN 3: SVD + Content-Based (Tuần 5)

### Bước 3.1: SVD

```python
# notebook: 04_svd.ipynb

from surprise import SVD

# Train SVD với các tham số khác nhau
results = {}
for n_factors in [20, 50, 100]:
    svd = SVD(n_factors=n_factors, n_epochs=20, random_state=42)
    svd.fit(trainset)
    preds = svd.test(testset)
    rmse = accuracy.rmse(preds)
    results[n_factors] = rmse
    print(f"SVD (n_factors={n_factors}): RMSE = {rmse:.4f}")

# Dùng tốt nhất (thường là 50)
best_svd = SVD(n_factors=50, n_epochs=20)
best_svd.fit(trainset)
```

### Bước 3.2: Content-Based

```python
# notebook: 05_content_based.ipynb

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# TF-IDF
movies['genres_clean'] = movies['genres'].str.replace('|', ' ')
tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(movies['genres_clean'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Movie index mapping
movie_idx = pd.Series(movies.index, index=movies['movieId'])

# Gợi phim cho user 1
def get_recommendations(user_id, top_n=10):
    user_ratings = ratings[ratings['userId'] == user_id]
    top_rated = user_ratings.nlargest(5, 'rating')

    scores = {}
    for _, row in top_rated.iterrows():
        mid = row['movieId']
        if mid in movie_idx.index:
            idx = movie_idx[mid]
            sims = cosine_sim[idx]
            for i, s in enumerate(sims):
                if i not in user_ratings['movieId'].values:
                    scores[i] = scores.get(i, 0) + s * row['rating']

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    results = []
    for idx, score in sorted_scores[:top_n]:
        mid = movies.iloc[idx]['movieId']
        title = movies.iloc[idx]['title']
        results.append({'movieId': mid, 'title': title, 'score': score})
    return results

recs = get_recommendations(1, 5)
for r in recs:
    print(f"  {r['title']}")
```

### Deliverable Giai đoạn 3
```
✅ notebook: 04_svd.ipynb
✅ notebook: 05_content_based.ipynb
✅ Biết: SVD vs CF vs CB khác nhau chỗ nào
```

---

## GIAI ĐOẠN 4: Hybrid (Tuần 6)

### Bước 4.1: Hybrid Recommender

```python
# notebook: 06_hybrid.ipynb

class HybridRecommender:
    def __init__(self, cf_weight=0.6):
        self.cf_weight = cf_weight
        self.cb_weight = 1 - cf_weight

    def fit(self, ratings_df, movies_df):
        # SVD
        self.svd = SVD(n_factors=50, n_epochs=20)
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(
            ratings_df[['userId', 'movieId', 'rating']], reader)
        self.svd.fit(data.build_full_trainset())

        # Content-Based
        movies_df = movies_df.copy()
        movies_df['genres_clean'] = movies_df['genres'].str.replace('|', ' ')
        self.tfidf = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = self.tfidf.fit_transform(movies_df['genres_clean'])
        self.cosine_sim = cosine_similarity(self.tfidf_matrix)
        self.movies = movies_df
        self.movie_idx = pd.Series(movies_df.index, index=movies_df['movieId'])
        self.ratings = ratings_df
        return self

    def recommend(self, user_id, top_n=10):
        user_movies = self.ratings[
            self.ratings['userId'] == user_id]['movieId'].values
        all_movies = self.ratings['movieId'].unique()
        unseen = [m for m in all_movies if m not in user_movies]

        hybrid_scores = {}
        for movie_id in unseen:
            svd_pred = self.svd.predict(user_id, movie_id).est
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
                results.append({'movieId': mid, 'title': title[0], 'score': score})
        return results

# Train & Test
hybrid = HybridRecommender(cf_weight=0.7)
hybrid.fit(ratings, movies)
recs = hybrid.recommend(user_id=1, top_n=10)
print("Top 10 recommendations for User 1:")
for r in recs:
    print(f"  {r['title']}")
```

### Deliverable Giai đoạn 4
```
✅ notebook: 06_hybrid.ipynb
✅ Hybrid model: SVD + Content-Based
```

---

## GIAI ĐOẠN 5: Context Analysis (Tuần 7)

### Bước 5.1: Temporal + Demographics

```python
# notebook: 07_context_analysis.ipynb

# Temporal features
ratings['datetime'] = pd.to_datetime(ratings['timestamp'], unit='s')
ratings['year'] = ratings['datetime'].dt.year
ratings['month'] = ratings['datetime'].dt.month
ratings['dayofweek'] = ratings['datetime'].dt.dayofweek

# Demographics
users['age_group'] = users['age'].map({
    1: "Under 18", 18: "18-24", 25: "25-34",
    35: "35-44", 45: "45-49", 50: "50-55", 56: "56+"
})

# Merge
df = ratings.merge(users[['userId', 'gender', 'age_group']], on='userId')

# Rating by gender
print(df.groupby('gender')['rating'].mean())

# Rating by age
print(df.groupby('age_group')['rating'].mean())

# Rating by year
print(df.groupby('year')['rating'].mean())

# Genres preference by gender
for genre in ['Action', 'Romance', 'Drama', 'Horror']:
    mask = df['genres'].str.contains(genre, na=False)
    male_avg = df[(df['gender'] == 'M') & mask]['rating'].mean()
    female_avg = df[(df['gender'] == 'F') & mask]['rating'].mean()
    print(f"{genre}: Male={male_avg:.2f}, Female={female_avg:.2f}")
```

### Deliverable Giai đoạn 5
```
✅ notebook: 07_context_analysis.ipynb
✅ Insights: Rating theo gender, age, year, genres
```

---

## GIAI ĐOẠN 6: Evaluation (Tuần 8)

### Bước 6.1: So sánh tất cả algorithms

```python
# notebook: 08_evaluation.ipynb

# So sánh RMSE của 4 models
models = {
    'User-Based CF': model_user,
    'Item-Based CF': model_item,
    'SVD (50)': best_svd,
    'Hybrid (0.7)': hybrid
}

results = {}
for name, model in models.items():
    if name == 'Hybrid (0.7)':
        # Hybrid: đánh giá bằng cách tính predicted ratings
        preds = []
        actuals = []
        for _, row in ratings.sample(1000).iterrows():
            recs = model.recommend(row['userId'], top_n=50)
            for r in recs:
                if r['movieId'] == row['movieId']:
                    preds.append(r['score'])
                    actuals.append(row['rating'])
                    break
        if preds:
            rmse = np.sqrt(np.mean((np.array(preds) - np.array(actuals))**2))
            results[name] = rmse
    else:
        preds = model.test(testset)
        rmse = accuracy.rmse(preds)
        results[name] = rmse

results_df = pd.DataFrame(list(results.items()), columns=['Model', 'RMSE'])
results_df = results_df.sort_values('RMSE')
print(results_df)

# Vẽ biểu đồ so sánh
plt.figure(figsize=(10, 5))
plt.barh(results_df['Model'], results_df['RMSE'], color='steelblue')
plt.xlabel('RMSE (Thấp hơn = Tốt hơn)')
plt.title('So sánh RMSE các thuật toán')
for i, v in enumerate(results_df['RMSE']):
    plt.text(v + 0.005, i, f'{v:.4f}', va='center')
plt.savefig('results/charts/rmse_comparison.png', dpi=150)
plt.show()
```

### Deliverable Giai đoạn 6
```
✅ notebook: 08_evaluation.ipynb
✅ Biểu đồ: rmse_comparison.png
✅ Bảng so sánh RMSE
```

---

## GIAI ĐOẠN 7: Web Demo (Tuần 9)

### Bước 7.1: Frontend (Cloudflare Pages)

```bash
# Code HTML/JS (Zen Design) nằm tại thư mục frontend/
cd frontend
npx wrangler pages deploy . --project-name movie-recsys
# Tự động host lên Cloudflare tĩnh hoàn toàn.
```

### Bước 7.2: Backend API (Google Colab + ngrok)

Mở `notebooks/00_full_pipeline.ipynb` trên Colab → Run All.
Cell cuối cùng sẽ mở server FastAPI và kết nối `ngrok`, sinh ra một domain public (`https://xyz.ngrok...`).

### Cách hoạt động (Decoupled Architecture)

```
1. Truy cập trang web tĩnh tại Cloudflare: https://movie-recsys.pages.dev
2. Dán link ngrok từ Colab vào ô kết nối mộc mạc.
3. Web gọi API về Colab, model nội suy dữ liệu & trả về điểm số dự đoán.
```

---

## GIAI ĐOẠN 8: Slide + Báo cáo (Tuần 10)

### Cấu trúc Slide (12 slides)

```
1. Cover
2. Giới thiệu Recommender System
3. Dataset MovieLens
4. EDA Results
5. User-Based CF
6. Item-Based CF
7. SVD (Matrix Factorization)
8. Content-Based
9. Hybrid System
10. Context Analysis
11. Kết quả so sánh
12. Kết luận
```

### Cấu trúc Báo cáo (2-3 trang)

```
1. Giới thiệu
2. Cơ sở lý thuyết (5 algorithms)
3. Kết quả đánh giá
4. Kết luận
5. Tài liệu tham khảo
```

---

## Bảng deliverables

```
TUẦN 1-2:  notebooks/01_setup_eda.ipynb           ✅
TUẦN 3:   notebooks/02_user_cf.ipynb            ✅
TUẦN 4:   notebooks/03_item_cf.ipynb            ✅
TUẦN 5:   notebooks/04_svd.ipynb +
           notebooks/05_content_based.ipynb       ✅
TUẦN 6:   notebooks/06_hybrid.ipynb             ✅
TUẦN 7:   notebooks/07_context_features.ipynb    ✅
TUẦN 8:   notebooks/08_evaluation.ipynb         ✅
TUẦN 9:   notebooks/00_full_pipeline.ipynb →
           frontend/ + Cloudflare pages deploy  ✅
TUẦN 10:  slides/ + report/                    ✅
```

---

## Bắt đầu từ đâu?

```
Mục tiêu TUẦN NAY: Hoàn thành Giai đoạn 1

Bước 1: Tạo notebook 01_setup_eda.ipynb trên Colab
Bước 2: Cài thư viện
Bước 3: Load dataset
Bước 4: Chạy EDA
Bước 5: Vẽ 2-3 biểu đồ
```
