# BÀI 2b: Chi tiết Dataset MovieLens 1M

---

## Tổng quan Dataset

```
MovieLens 1M gồm 3 files, tách nhau bằng dấu :: (double colon)

┌─────────────┬────────────┬─────────────┐
│ File         │ Dòng       │ Kích thước │
├─────────────┼────────────┼─────────────┤
│ ratings.dat │ 1,000,209 │ ~6 MB       │
│ movies.dat  │ 3,883      │ ~150 KB     │
│ users.dat   │ 6,040      │ ~150 KB     │
└─────────────┴────────────┴─────────────┘

Lưu ý: File KHÔNG có dòng header.
```

---

## 1. RATINGS.DAT — Lịch sử đánh giá

### 1.1 Cấu trúc (4 cột)

```
Format: UserID::MovieID::Rating::Timestamp

Ví dụ 10 dòng đầu:
1::1193::5::978300760
1::661::3::978302109
1::914::3::978301968
1::3408::4::978300275
1::2355::5::978824291
1::1197::3::978302268
1::1287::5::978302039
1::2804::5::978300719
1::594::4::978302268
1::919::4::978301368
```

### 1.2 Giải thích từng cột

```
┌──────────────────────────────────────────────────────────────────┐
│ CỘT 1: UserID                                                   │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer                                               │
│ Giá trị:  1 → 6040                                             │
│ Ý nghĩa:  ID của người dùng                                    │
│ Ví dụ:    User 1 đã đánh giá...                               │
│ Số lượng: 6,040 users duy nhất                                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 2: MovieID                                                 │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer                                               │
│ Giá trị:  1 → ~3952                                            │
│ Ý nghĩa:  ID của bộ phim                                        │
│ Ví dụ:    Movie 1193 = "One Flew Over the Cuckoo's Nest"      │
│ Số lượng: 3,706 movies có ít nhất 1 rating                    │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 3: Rating                                                   │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer                                               │
│ Giá trị:  1 → 5 (1 sao đến 5 sao)                            │
│ Ý nghĩa:  Mức độ thích của user đối với phim                 │
│ Phân bố:  1 (ít) ─────────────── 5 (nhiều)                  │
│           Rating 4 sao chiếm nhiều nhất (~34%)                 │
│           Rating 1-2 sao rất ít (~15%)                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 4: Timestamp                                               │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer (Unix timestamp)                              │
│ Ví dụ:    978300760                                           │
│ Chuyển:   978300760 giây kể từ 1970-01-01                   │
│ Thời gian: 2000-04-24 04:12:40 UTC                           │
│ Khoảng:   ~2000-2003 (dataset thu thập trong 3 năm)           │
│                                                           │
│ ⚠️  ĐÂY LÀ CONTEXT FEATURE — CÓ THỂ DÙNG ĐƯỢC!          │
└──────────────────────────────────────────────────────────────────┘
```

### 1.3 Dùng cho thuật toán nào?

```
RATINGS.DAT dùng cho:

✅ Collaborative Filtering (CF)
   → User-Based CF: Tìm user giống nhau dựa trên rating
   → Item-Based CF: Tìm phim giống nhau dựa trên rating
   → Matrix Factorization (SVD): Phân rã ma trận rating

✅ Evaluation
   → Chia train/test để đánh giá model
   → Tính RMSE, Precision, Recall

✅ Temporal Analysis (CONTEXT FEATURE)
   → Trích xuất timestamp → hour, day, month, year
   → Phân tích: "User rating khác nhau theo thời gian không?"
```

---

## 2. MOVIES.DAT — Thông tin phim

### 2.1 Cấu trúc (3 cột)

```
Format: MovieID::Title::Genres

Ví dụ 10 dòng đầu:
1::Toy Story (1995)::Animation|Children's|Comedy
2::Jumanji (1995)::Adventure|Children's|Fantasy
3::Grumpier Old Men (1995)::Comedy|Romance
4::Waiting to Exhale (1995)::Comedy|Drama
5::Father of the Bride Part II (1995)::Comedy
6::Heat (1995)::Action|Crime|Thriller
7::Sabrina (1995)::Comedy|Romance
8::Tom and Huck (1995)::Adventure|Children's
9::Sudden Death (1995)::Action
10::GoldenEye (1995)::Action|Adventure|Thriller
```

### 2.2 Giải thích từng cột

```
┌──────────────────────────────────────────────────────────────────┐
│ CỘT 1: MovieID                                                 │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer                                               │
│ Giá trị:  1 → 3952                                             │
│ Ý nghĩa:  ID của phim (khớp với MovieID trong ratings.dat)     │
│ Số lượng: 3,883 movies                                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 2: Title                                                    │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     String                                                 │
│ Format:   "Tên phim (Năm)"                                      │
│ Ví dụ:    "Toy Story (1995)"                                    │
│           "Star Wars: Episode IV (1977)"                        │
│                                                           │
│ ⚠️  CÓ THỂ TRÍCH XUẤT:                                      │
│   → Năm phát hành: "1977" → year = 1977                      │
│   → Năm phim cũ vs mới → user preference?                     │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 3: Genres (THỂ LOẠI)                                      │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     String, nhiều thể loại, ngăn cách bằng |            │
│                                                           │
│ 18 thể loại có trong dataset:                                │
│                                                           │
│ ┌──────────────┬──────────────────────────────────────────┐   │
│ │ Thể loại    │ Giải thích                               │   │
│ ├──────────────┼──────────────────────────────────────────┤   │
│ │ Action       │ Hành động                               │   │
│ │ Adventure    │ Phiêu lưu                               │   │
│ │ Animation    │ Hoạt hình                               │   │
│ │ Children's   │ Phim thiếu nhi                          │   │
│ │ Comedy       │ Hài                                      │   │
│ │ Crime        │ Tội phạm                                │   │
│ │ Documentary  │ Tài liệu                                │   │
│ │ Drama        │ Chính kịch                              │   │
│ │ Fantasy      │ Giả tưởng                               │   │
│ │ Film-Noir    │ Phim cảnh sát đen                       │   │
│ │ Horror       │ Kinh dị                                 │   │
│ │ Musical      │ Nhạc kịch                              │   │
│ │ Mystery      │ Bí ẩn                                  │   │
│ │ Romance      │ Lãng mạn                               │   │
│ │ Sci-Fi       │ Khoa học viễn tưởng                     │   │
│ │ Thriller     │ Gai góc                                 │   │
│ │ War          │ Chiến tranh                             │   │
│ │ Western      │ Phim miền Tây                          │   │
│ └──────────────┴──────────────────────────────────────────┘   │
│                                                           │
│ ⚠️  PHIM CÓ THỂ CÓ NHIỀU THỂ LOẠI                          │
│   VD: "Heat" = Action|Crime|Thriller                        │
│   VD: "Toy Story" = Animation|Children's|Comedy             │
└──────────────────────────────────────────────────────────────────┘
```

### 2.3 Thống kê Genres

```
Số lượng phim theo thể loại (ước tính):

Action       ~900 phim
Comedy       ~1200 phim
Drama        ~1500 phim
Thriller     ~500 phim
Romance      ~400 phim
Adventure    ~500 phim
Sci-Fi       ~400 phim
Children's   ~300 phim
Horror       ~200 phim
...

⚠️  MỘT PHIM CÓ THỂ THUỘC NHIỀU THỂ LOẠI
   → "Heat" = Action + Crime + Thriller
   → Đếm riêng: Action tăng 1, Crime tăng 1, Thriller tăng 1
```

### 2.4 Dùng cho thuật toán nào?

```
MOVIES.DAT dùng cho:

✅ Content-Based Filtering
   → Genres → TF-IDF → Cosine Similarity
   → "User thích phim hành động → gợi phim hành động khác"

✅ Hybrid System
   → Kết hợp CF + CB dựa trên genres

✅ Temporal Analysis
   → Trích xuất năm từ Title
   → "User thích phim cũ (1970-1990) hay mới (1995-2000)?"
```

---

## 3. USERS.DAT — Thông tin người dùng

### 3.1 Cấu trúc (5 cột)

```
Format: UserID::Gender::Age::Occupation::Zip-code

Ví dụ 10 dòng đầu:
1::F::1::10::48067
2::M::56::16::70072
3::M::25::15::55117
4::M::45::7::02460
5::M::25::20::55455
6::F::50::9::55117
7::M::35::1::06810
8::M::25::12::11413
9::M::25::17::61614
10::F::35::1::95370
```

### 3.2 Giải thích từng cột

```
┌──────────────────────────────────────────────────────────────────┐
│ CỘT 1: UserID                                                   │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer                                               │
│ Giá trị:  1 → 6040                                             │
│ Ý nghĩa:  ID người dùng (khớp với UserID trong ratings.dat)   │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 2: Gender (GIỚI TÍNH)                                       │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Char                                                  │
│ Giá trị:  M (Male) | F (Female)                               │
│                                                           │
│ Phân bố ước tính:                                             │
│   Male:   ~70%                                                │
│   Female: ~30%                                                │
│                                                           │
│ ⚠️  CONTEXT FEATURE — DÙNG ĐƯỢC!                           │
│   → Phân tích: Nam vs Nữ thích thể loại nào khác nhau?       │
│   → "Nữ thường thích Romance nhiều hơn Nam"                  │
│   → "Nam thường thích Action/Horror nhiều hơn Nữ"             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 3: Age (ĐỘ TUỔI)                                           │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer (Mã nhóm tuổi, KHÔNG phải tuổi thật)        │
│                                                           │
│ Bảng mã:                                                      │
│ ┌─────────┬───────────────────────┐                          │
│ │ Code    │ Nhóm tuổi            │                          │
│ ├─────────┼───────────────────────┤                          │
│ │    1    │ Under 18              │                          │
│ │   18    │ 18-24                 │                          │
│ │   25    │ 25-34                 │                          │
│ │   35    │ 35-44                 │                          │
│ │   45    │ 45-49                 │                          │
│ │   50    │ 50-55                 │                          │
│ │   56    │ 56+                   │                          │
│ └─────────┴───────────────────────┘                          │
│                                                           │
│ ⚠️  CONTEXT FEATURE — DÙNG ĐƯỢC!                           │
│   → Phân tích: Nhóm tuổi nào rating cao nhất?               │
│   → "User Under 18 → thích Animation/Children's nhiều"      │
│   → "User 50+ → thích Drama/Romance nhiều hơn"               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 4: Occupation (NGHỀ NGHIỆP)                                 │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     Integer (Mã nghề)                                    │
│                                                           │
│ Bảng mã:                                                      │
│ ┌─────────┬───────────────────────────────────┐             │
│ │ Code    │ Nghề nghiệp                       │             │
│ ├─────────┼───────────────────────────────────┤             │
│ │    0    │ other / not mentioned            │             │
│ │    1    │ academic / educator              │             │
│ │    2    │ artist                            │             │
│ │    3    │ clerical / admin                 │             │
│ │    4    │ college / grad student            │             │
│ │    5    │ customer service                  │             │
│ │    6    │ doctor / health care             │             │
│ │    7    │ executive / managerial           │             │
│ │    8    │ farmer                           │             │
│ │    9    │ homemaker                        │             │
│ │   10    │ K-12 student                     │             │
│ │   11    │ lawyer                           │             │
│ │   12    │ programmer                       │             │
│ │   13    │ retired                          │             │
│ │   14    │ sales / marketing                │             │
│ │   15    │ scientist                        │             │
│ │   16    │ self-employed                    │             │
│ │   17    │ technician / engineer            │             │
│ │   18    │ tradesman / craftsman            │             │
│ │   19    │ unemployed                       │             │
│ │   20    │ writer / journalist              │             │
│ └─────────┴───────────────────────────────────┘             │
│                                                           │
│ ⚠️  CONTEXT FEATURE — DÙNG ĐƯỢC!                           │
│   → Phân tích: Nghề nào rating cao / thích thể loại nào?    │
│   → "Scientist / Engineer → thích Sci-Fi, Documentary"     │
│   → "Artist → thích Drama, Romance hơn Action"             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ CỘT 5: Zip-code (Mã bưu chính)                                │
├──────────────────────────────────────────────────────────────────┤
│ Kiểu:     String (5 chữ số)                                    │
│ Giá trị:  VD: 48067, 70072, 55117...                          │
│                                                           │
│ ⚠️  BỎ QUA                                    │
│   → Zipcode Mỹ có thể suy ra khu vực / tiểu bang            │
│   → Nhưng phức tạp (cần lookup table)                       │
│   → Bỏ qua trong đồ án này                                  │
│   → Chỉ dùng: Gender, Age, Occupation                        │
└──────────────────────────────────────────────────────────────────┘
```

### 3.3 Dùng cho thuật toán nào?

```
USERS.DAT dùng cho:

✅ User Demographics Analysis (CONTEXT)
   → Gender + Age + Occupation → Phân tích sở thích theo nhóm
   → "User 18-24 tuổi, Nam → thích Action/Thriller"
   → "User 50+, Nữ → thích Drama/Romance"

✅ Context-Aware Recommendation (NÂNG CAO)
   → Gợi ý khác nhau dựa trên demographics
   → "User là K-12 student → gợi Animation/Children's nhiều hơn"

❌ KHÔNG dùng trực tiếp cho CF/Content-Based
   → CF dựa trên RATING, không dựa trên demographics
   → Chỉ dùng để PHÂN TÍCH / TĂNG CHẤT LƯỢNG GỢI Ý
```

---

## 4. Tổng hợp: Dataset có những gì?

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MOVIELENS 1M — TỔNG QUAN                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FILE          │ CỘT             │ DÙNG CHO                           │
│ ──────────────┼─────────────────┼────────────────────────────────────  │
│               │                 │                                     │
│ ratings.dat   │ userId          │ ✅ CF (User-Based, Item-Based, SVD) │
│ 1,000,209     │ movieId          │ ✅ Content-Based (liên kết movieId)│
│ dòng          │ rating (1-5)    │ ✅ Evaluation (RMSE, Precision)    │
│               │ timestamp (✅)   │ ✅ Temporal Context Analysis        │
│               │                 │                                     │
│ ──────────────┼─────────────────┼────────────────────────────────────  │
│               │                 │                                     │
│ movies.dat    │ movieId         │ ✅ Content-Based (TF-IDF genres)    │
│ 3,883         │ title + year   │ ✅ Temporal Analysis (năm phim)    │
│ dòng          │ genres (18 loại)│ ✅ Hybrid System                    │
│               │                 │                                     │
│ ──────────────┼─────────────────┼────────────────────────────────────  │
│               │                 │                                     │
│ users.dat     │ userId          │ ✅ Link với ratings để phân tích   │
│ 6,040         │ gender (M/F)   │ ✅ User Demographics Analysis        │
│ dòng         │ age (7 nhóm)   │ ✅ Context-Aware Recommendation    │
│               │ occupation (21) │ ✅ User Segmentation                │
│               │ zipcode         │ ❌ BỎ QUA                           │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

✅ = CÓ THỂ DÙNG      ❌ = KHÔNG DÙNG
```

---

## 5. Cách đọc dataset bằng Pandas

```python
# ============================================================
# ĐỌC MOVIELENS 1M BẰNG PANDAS
# ============================================================
import pandas as pd
from pathlib import Path

DATA_DIR = Path("data/raw/ml-1m")

# Load ratings
ratings = pd.read_csv(
    DATA_DIR / "ratings.dat",
    sep="::",
    engine="python",
    names=["userId", "movieId", "rating", "timestamp"]
)

# Load movies
movies = pd.read_csv(
    DATA_DIR / "movies.dat",
    sep="::",
    engine="python",
    names=["movieId", "title", "genres"],
    encoding="latin-1"  # Cần encoding vì có ký tự đặc biệt
)

# Load users
users = pd.read_csv(
    DATA_DIR / "users.dat",
    sep="::",
    engine="python",
    names=["userId", "gender", "age", "occupation", "zipcode"]
)

# ============================================================
# THỐNG KÊ CƠ BẢN
# ============================================================
print(f"Ratings:  {len(ratings):,} dòng")
print(f"Movies:   {len(movies):,} dòng")
print(f"Users:    {len(users):,} dòng")
print(f"\nUsers: {ratings['userId'].nunique():,}")
print(f"Movies: {ratings['movieId'].nunique():,}")
print(f"Rating TB: {ratings['rating'].mean():.2f}")
print(f"Rating min: {ratings['rating'].min()}")
print(f"Rating max: {ratings['rating'].max()}")

# ============================================================
# CHUYỂN TIMESTAMP → DATETIME (TRÍCH XUẤT TEMPORAL)
# ============================================================
ratings["datetime"] = pd.to_datetime(ratings["timestamp"], unit="s")
ratings["year"] = ratings["datetime"].dt.year
ratings["month"] = ratings["datetime"].dt.month
ratings["dayofweek"] = ratings["datetime"].dt.dayofweek
ratings["hour"] = ratings["datetime"].dt.hour

# ============================================================
# CHUYỂN AGE CODE → NHÓM TUỔI (GIẺI THÍCH)
# ============================================================
age_map = {1: "Under 18", 18: "18-24", 25: "25-34",
           35: "35-44", 45: "45-49", 50: "50-55", 56: "56+"}
users["age_group"] = users["age"].map(age_map)

# ============================================================
# CHUYỂN OCCUPATION CODE → TÊN NGHỀ
# ============================================================
occupation_map = {
    0: "other", 1: "academic", 2: "artist", 3: "clerical",
    4: "student", 5: "customer service", 6: "doctor",
    7: "executive", 8: "farmer", 9: "homemaker", 10: "K-12 student",
    11: "lawyer", 12: "programmer", 13: "retired",
    14: "sales", 15: "scientist", 16: "self-employed",
    17: "engineer", 18: "tradesman", 19: "unemployed", 20: "writer"
}
users["occupation_name"] = users["occupation"].map(occupation_map)

# ============================================================
# TÁCH GENRES (1 PHIM CÓ THỂ CÓ NHIỀU THỂ LOẠI)
# ============================================================
# Tạo cột riêng cho mỗi genre (binary)
all_genres = ["Action", "Adventure", "Animation", "Children's", "Comedy",
              "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
              "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
              "Thriller", "War", "Western"]

for genre in all_genres:
    movies[f"genre_{genre}"] = movies["genres"].str.contains(genre, na=False).astype(int)

# ============================================================
# TRÍCH XUẤT NĂM TỪ TITLE
# ============================================================
import re
movies["year"] = movies["title"].str.extract(r"\((\d{4})\)").astype(float)
```

---

## 6. Các phân tích có thể làm với Dataset

```
PHÂN TÍCH ĐƠN GIẢN (CÓ THỂ LÀM TRONG COLAB):

1. Phân tích Rating
   → Phân bố rating (1-5 sao)
   → Rating TB theo user
   → Rating TB theo phim
   → Số rating mỗi user / mỗi phim

2. Phân tích Phim
   → Top phim được rating nhiều nhất
   → Top phim rating cao nhất (có ít nhất N ratings)
   → Phim mới nhất / cũ nhất

3. Phân tích Temporal (từ timestamp)
   → Rating theo năm / tháng / ngày trong tuần
   → Xu hướng rating theo thời gian

PHÂN TÍCH NÂNG CAO (CONTEXT):

4. Phân tích User Demographics
   → Rating TB theo giới tính (Nam vs Nữ)
   → Rating TB theo nhóm tuổi
   → Rating TB theo nghề nghiệp

5. Genre Preference theo Demographics
   → Giới tính nào thích thể loại nào?
   → Nhóm tuổi nào thích thể loại nào?
   → Nghề nghiệp nào thích thể loại nào?

6. Context-Aware Insights
   → User 18-24 tuổi, Nam → thích phim nào?
   → User 50+, Nữ → thích thể loại nào?
   → Student vs Engineer → khác nhau chỗ nào?
```

---

## 7. Mermaid: Data Flow

```
┌──────────────────────┐     userId     ┌──────────────────────┐
│   ratings.dat        │ ─────────────▶ │    users.dat          │
│                      │                │  (user demographics) │
│  - userId            │                │  - gender (M/F)     │
│  - movieId           │         movieId │  - age (7 nhóm)     │
│  - rating (1-5)      │ ◀──────────────│  - occupation (21)  │
│  - timestamp (✅)    │     movieId     │  - zipcode (bỏ)     │
└──────────┬───────────┘                └──────────────────────┘
           │
           │ merge
           ▼
┌──────────────────────┐
│   movies.dat         │
│  - movieId           │
│  - title + year      │
│  - genres (18 loại) │
└──────────────────────┘

                    PHÂN TÍCH:
                    ├── Collaborative Filtering (rating)
                    ├── Content-Based (genres)
                    ├── Temporal Analysis (timestamp, year)
                    └── Demographics Analysis (gender, age, occupation)
```
