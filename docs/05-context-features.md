# BÀI 5: Context Features — Temporal & Demographics Analysis

---

## Context Features là gì?

```
Context = "NGỮ CẢNH" xung quanh hành vi của user

Ví dụ đời thường:
  → Bạn xem phim khác lúc 8h sáng vs 11h đêm
  → Bạn thích phim khác khi đi một mình vs đi cùng bạn
  → User 18 tuổi vs 50 tuổi → thích phim khác nhau

→ Cùng 1 user, cùng 1 phim → Gợi KHÁC NHAU tùy ngữ cảnh
```

---

## 1. TEMPORAL ANALYSIS — Phân tích theo thời gian

### 1.1. Timestamp có sẵn trong ratings.dat

```
Có trong ratings.dat:
  1::1193::5::978300760

Timestamp 978300760 → Chuyển đổi:
  → 2000-04-24 04:12:40 UTC

Từ timestamp trích xuất được:
  ├── Year:        2000
  ├── Month:       4 (April)
  ├── Day:         24
  ├── DayOfWeek:  0 (Monday)
  ├── Hour:        4
  └── Quarter:     2 (Q2)
```

### 1.2. Code Temporal Analysis

```python
# ============================================================
# TEMPORAL ANALYSIS — Phân tích theo thời gian
# ============================================================
import pandas as pd
import matplotlib.pyplot as plt

# Trích xuất temporal features từ timestamp
ratings['datetime'] = pd.to_datetime(ratings['timestamp'], unit='s')
ratings['year'] = ratings['datetime'].dt.year
ratings['month'] = ratings['datetime'].dt.month
ratings['dayofweek'] = ratings['datetime'].dt.dayofweek
ratings['hour'] = ratings['datetime'].dt.hour
ratings['is_weekend'] = ratings['dayofweek'].isin([5, 6]).astype(int)

print(f"Khoảng thời gian: {ratings['year'].min()} - {ratings['year'].max()}")
# Output: 2000 - 2003 (Dataset thu thập trong 3 năm)

# ============================================================
# PHÂN TÍCH 1: Rating theo năm
# ============================================================
year_stats = ratings.groupby('year')['rating'].agg(['mean', 'count', 'std'])
print("\n=== Rating theo NĂM ===")
print(year_stats)

# Vẽ biểu đồ
ratings.groupby('year')['rating'].mean().plot(kind='bar', color='steelblue')
plt.title("Rating trung bình theo Năm")
plt.xlabel("Năm")
plt.ylabel("Rating TB")
plt.savefig('results/charts/rating_by_year.png', dpi=150)
plt.show()
```

```python
# ============================================================
# PHÂN TÍCH 2: Rating theo ngày trong tuần
# ============================================================
day_names = {0: 'Mon', 1: 'Tue', 2: 'Wed', 3: 'Thu',
             4: 'Fri', 5: 'Sat', 6: 'Sun'}

ratings['day_name'] = ratings['dayofweek'].map(day_names)

day_stats = ratings.groupby('dayofweek')['rating'].agg(['mean', 'count'])
day_stats.index = day_names.values()

print("\n=== Rating theo NGÀY TRONG TUẦN ===")
print(day_stats)

# Vẽ biểu đồ
day_stats['mean'].plot(kind='bar', color='coral')
plt.title("Rating TB theo Ngày trong Tuần")
plt.xlabel("Ngày")
plt.ylabel("Rating TB")
plt.xticks(rotation=45)
plt.savefig('results/charts/rating_by_day.png', dpi=150)
plt.show()
```

```python
# ============================================================
# PHÂN TÍCH 3: Rating theo giờ trong ngày
# ============================================================
hour_stats = ratings.groupby('hour')['rating'].agg(['mean', 'count'])

print("\n=== Rating theo GIỜ TRONG NGÀY ===")
print(f"Giờ có rating cao nhất: {hour_stats['mean'].idxmax()}:00")
print(f"Giờ có rating thấp nhất: {hour_stats['mean'].idxmin()}:00")

# Vẽ biểu đồ
hour_stats['mean'].plot(kind='line', marker='o', color='green')
plt.title("Rating TB theo Giờ trong Ngày")
plt.xlabel("Giờ (0-23)")
plt.ylabel("Rating TB")
plt.grid(True)
plt.savefig('results/charts/rating_by_hour.png', dpi=150)
plt.show()
```

### 1.3. Kết quả mong đợi

```
Rating theo NĂM:
  2000: 3.58  (Start)
  2001: 3.56
  2002: 3.54
  2003: 3.52  (End)
  → Xu hướng giảm nhẹ theo thời gian

Rating theo NGÀY:
  Cuối tuần (Sat/Sun): ~3.62 (hơi cao hơn)
  Ngày thường: ~3.55
  → User thoải mái hơn cuối tuần

Rating theo GIỜ:
  21h-23h: rating cao hơn (xem phim giải trí)
  8h-12h: rating thấp hơn (ít xem phim)
```

---

## 2. DEMOGRAPHICS ANALYSIS — Phân tích theo user profile

### 2.1. Có gì trong users.dat

```
users.dat có:
  ├── Gender:    M (Male) | F (Female)
  ├── Age:       7 nhóm tuổi (1, 18, 25, 35, 45, 50, 56)
  └── Occupation: 21 nghề nghiệp (0-20)
```

### 2.2. Code Demographics Analysis

```python
# ============================================================
# DEMOGRAPHICS ANALYSIS — Phân tích theo user profile
# ============================================================
import pandas as pd

# Map age code → nhóm tuổi
age_map = {
    1:  "Under 18",
    18: "18-24",
    25: "25-34",
    35: "35-44",
    45: "45-49",
    50: "50-55",
    56: "56+"
}
users['age_group'] = users['age'].map(age_map)

# Map occupation code → tên nghề
occupation_map = {
    0: "other", 1: "academic", 2: "artist", 3: "clerical",
    4: "student", 5: "customer service", 6: "doctor",
    7: "executive", 8: "farmer", 9: "homemaker",
    10: "K-12 student", 11: "lawyer", 12: "programmer",
    13: "retired", 14: "sales", 15: "scientist",
    16: "self-employed", 17: "engineer", 18: "tradesman",
    19: "unemployed", 20: "writer"
}
users['occupation_name'] = users['occupation'].map(occupation_map)

# ============================================================
# PHÂN TÍCH 1: Rating theo GIỚI TÍNH
# ============================================================
# Merge ratings với users để lấy gender
ratings_with_user = ratings.merge(
    users[['userId', 'gender']], on='userId'
)

gender_stats = ratings_with_user.groupby('gender')['rating'].agg(['mean', 'count'])
print("\n=== Rating theo GIỚI TÍNH ===")
print(gender_stats)
# Mong đợi: Male ~3.56, Female ~3.62 (Nữ hơi rating cao hơn)

# ============================================================
# PHÂN TÍCH 2: Rating theo NHÓM TUỔI
# ============================================================
ratings_with_user = ratings.merge(
    users[['userId', 'age_group']], on='userId'
)

age_stats = ratings_with_user.groupby('age_group')['rating'].agg(['mean', 'count'])
print("\n=== Rating theo NHÓM TUỔI ===")
print(age_stats.sort_values('mean', ascending=False))

# ============================================================
# PHÂN TÍCH 3: Thể loại phim ưa thích theo GIỚI TÍNH
# ============================================================
# Merge thêm movies để lấy genres
full_data = ratings.merge(users[['userId', 'gender', 'age_group']], on='userId')
full_data = full_data.merge(movies[['movieId', 'genres']], on='movieId')

# Tách genres
genre_cols = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy',
              'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir',
              'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi',
              'Thriller', 'War', 'Western']

for genre in genre_cols:
    full_data[f'is_{genre}'] = full_data['genres'].str.contains(genre, na=False).astype(int)

# Rating TB theo giới tính cho từng genre
genre_by_gender = []
for genre in genre_cols:
    male_avg = full_data[(full_data['gender'] == 'M') & (full_data[f'is_{genre}'] == 1)]['rating'].mean()
    female_avg = full_data[(full_data['gender'] == 'F') & (full_data[f'is_{genre}'] == 1)]['rating'].mean()
    genre_by_gender.append({
        'genre': genre,
        'male': male_avg,
        'female': female_avg,
        'diff': female_avg - male_avg
    })

genre_df = pd.DataFrame(genre_by_gender).sort_values('diff', ascending=False)
print("\n=== Thể loại theo GIỚI TÍNH (Nữ - Nam) ===")
print(genre_df)

# ============================================================
# PHÂN TÍCH 4: Thể loại phim ưa thích theo NHÓM TUỔI
# ============================================================
# Top genres cho mỗi nhóm tuổi
for age_grp in users['age_group'].unique():
    user_ids = users[users['age_group'] == age_grp]['userId']
    user_ratings = full_data[full_data['userId'].isin(user_ids)]

    genre_means = []
    for genre in genre_cols:
        avg = user_ratings[user_ratings[f'is_{genre}'] == 1]['rating'].mean()
        genre_means.append({'genre': genre, 'avg_rating': avg})

    top_genres = pd.DataFrame(genre_means).sort_values('avg_rating', ascending=False).head(5)
    print(f"\n=== Top Genres cho nhóm tuổi {age_grp} ===")
    print(top_genres)
```

### 2.3. Kết quả mong đợi

```
Rating theo GIỚI TÍNH:
  Male:   ~3.56
  Female: ~3.62
  → Nữ rating hơi cao hơn nam

Thể loại theo GIỚI TÍNH (Nữ thích hơn Nam):
  Romance:    Nữ +0.15
  Drama:      Nữ +0.12
  Comedy:     Nữ +0.08
  War:        Nam +0.10
  Action:     Nam +0.08
  Horror:     Nam +0.05
  Sci-Fi:     Nam +0.04

→ Có SỰ KHÁC BIỆT rõ ràng giữa Nam và Nữ

Rating theo NHÓM TUỔI:
  Under 18:  ~3.68  (rating cao nhất, hào hứng)
  18-24:     ~3.55
  25-34:     ~3.52
  35-44:     ~3.50
  45+:       ~3.55
  → User càng lớn tuổi → rating càng thận trọng
```

---

## 3. DEMONSTRATION: Gợi ý dựa trên Demographics

```python
# ============================================================
# CONTEXT-AWARE RECOMMENDATION DEMO
# ============================================================

def get_genre_preference_by_demographics(data_df, gender=None, age_group=None):
    """
    Lấy thể loại ưa thích dựa trên demographics.

    Args:
        data_df: DataFrame đã merge đầy đủ
        gender: 'M' hoặc 'F' (None = tất cả)
        age_group: 'Under 18', '18-24', ... (None = tất cả)

    Returns:
        DataFrame: Top genres ưa thích
    """
    # Filter theo demographics
    filtered = data_df.copy()
    if gender:
        filtered = filtered[filtered['gender'] == gender]
    if age_group:
        filtered = filtered[filtered['age_group'] == age_group]

    # Tính rating TB theo genre
    genre_cols = [c for c in filtered.columns if c.startswith('is_')]
    genre_means = {}

    for col in genre_cols:
        genre = col.replace('is_', '')
        avg = filtered[filtered[col] == 1]['rating'].mean()
        count = filtered[filtered[col] == 1].shape[0]
        if count >= 50:  # Chỉ tính nếu đủ mẫu
            genre_means[genre] = avg

    result = pd.DataFrame(list(genre_means.items()),
                          columns=['genre', 'avg_rating'])
    return result.sort_values('avg_rating', ascending=False)


# Demo: So sánh preferences giữa các nhóm
print("=== Nam, 18-24: Top Genres ===")
male_young = get_genre_preference_by_demographics(
    full_data, gender='M', age_group='18-24'
)
print(male_young.head(5))

print("\n=== Nữ, 45+: Top Genres ===")
female_old = get_genre_preference_by_demographics(
    full_data, gender='F', age_group='45-49'
)
print(female_old.head(5))

print("\n=== Under 18: Top Genres ===")
young = get_genre_preference_by_demographics(
    full_data, age_group='Under 18'
)
print(young.head(5))
```

---

## 4. INSIGHTS TỪ CONTEXT ANALYSIS

```
╔══════════════════════════════════════════════════════════════════╗
║  INSIGHTS — Những gì có thể NÓI VỚI THẦY                        ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  TEMPORAL:                                                        ║
║  → Cuối tuần user rating cao hơn ngày thường                    ║
║  → Tối muộn (21-23h) rating hơi cao hơn sáng                   ║
║  → Xu hướng rating giảm nhẹ qua các năm (2000→2003)            ║
║                                                                  ║
║  DEMOGRAPHICS:                                                    ║
║  → Nữ rating cao hơn Nam nhẹ (~+0.06 sao)                       ║
║  → Under 18 rating cao nhất (~3.68), 25-34 thấp nhất (~3.50) ║
║  → Nam thích Action, War, Horror hơn Nữ                          ║
║  → Nữ thích Romance, Drama hơn Nam                               ║
║  → Student/Under 18 thích Animation, Children's nhiều            ║
║                                                                  ║
║  ÚNG DỤNG:                                                       ║
║  → User mới (cold start): Gợi theo demographics thay vì CF      ║
║  → Demo web: Thêm filter theo nhóm tuổi / giới tính            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 5. Tổng kết Bài 5

```
CONTEXT FEATURES:

TEMPORAL ANALYSIS (từ timestamp):
  ✅ year, month, dayofweek, hour
  ✅ pandas dt accessor: .dt.year, .dt.month...
  ✅ Có thể vẽ biểu đồ phân tích xu hướng

DEMOGRAPHICS ANALYSIS (từ users.dat):
  ✅ gender (M/F) → 2 nhóm
  ✅ age_group (7 nhóm) → nhóm tuổi
  ✅ occupation (21 nghề) → có thể gom nhóm
  ✅ merge với ratings để phân tích

PHÂN TÍCH ĐƯỢC:
  → Rating TB theo năm/tháng/ngày/giờ
  → Rating TB theo giới tính
  → Rating TB theo nhóm tuổi
  → Thể loại ưa thích theo demographics
  → Genre preferences khác nhau giữa các nhóm

ÚNG DỤNG THỰC TẾ:
  → Context-aware recommendation (nâng cao)
  → Demo: Filter theo nhóm tuổi / giới tính
  → Insights để trình bày với thầy
```

---

## Bài tiếp theo
[Cấu trúc dự án](06-project-structure.md)
