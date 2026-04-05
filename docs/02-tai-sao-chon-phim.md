# BÀI 2: Tại sao chọn phim & Dataset MovieLens

## 1. Tại sao là PHIM?

### 1.1 Lý do thực tế

```
RECOMMENDER CHO PHIM LÀ BÀI TOÁN "NGỌN CỎ ĐỦ CAO"
(tức đủ phức tạp để học, nhưng đủ đơn giản để hiểu)
```

| Tiêu chí | Phim | Sách | Sản phẩm Shopee | Nhạc |
|-----------|------|------|-----------------|------|
| **Dữ liệu sẵn có** | ✅ Rất nhiều | Có | Khó lấy | Có |
| **Đặc điểm (features) rõ ràng** | ✅ Genre, diễn viên | ✅ Tác giả, thể loại | Khó trích xuất | ✅ Ca sĩ, genre |
| **User hiểu rating** | ✅ 1-5 sao rất quen | ✅ 1-5 sao | ⏳ ít rating | ✅ 1-5 sao |
| **Demo dễ hiểu** | ✅ Ai cũng xem phim | ⏳ Ít người đọc | ⏳ Niche hơn | ✅ Ai cũng nghe nhạc |
| **Dataset chuẩn** | ✅ MovieLens | Book-Crossing | Không chuẩn | Last.fm |
| **Phổ biến trong nghiên cứu** | ✅ NHIỀU NHẤT | Ít hơn | Ít | Trung bình |

**Kết luận:** Dataset phim có **dataset chuẩn, nhiều nghiên cứu, dễ hiểu, dễ giải thích cho thầy**.

### 1.2. Phim quen thuộc với mọi người

```
Thầy hỏi: "Tại sao gợi phim này cho user?"
→ Trả lời: "Vì user này thích phim hành động, phim này cũng hành động"
→ Thầy hiểu ngay ✅

Thầy hỏi: "Tại sao gợi sản phẩm này cho user?"
→ Phải giải thích nhiều hơn về features
→ Phức tạp hơn cho người nghe ❌
```

---

## 2. Dataset là gì?

### 2.1 Định nghĩa

```
Dataset (bộ dữ liệu) = Tập hợp dữ liệu đã được thu thập và tổ chức
→ Giống như "đề thi mẫu" cho model học máy

Ví dụ:
  Muốn train model nhận diện mèo
  → Cần 10,000 ảnh mèo đã gán nhãn = dataset

  Muốn train recommender gợi phim
  → Cần 1 triệu lượt đánh giá phim = dataset
```

### 2.2. Rating Data — Dữ liệu đánh giá

```
Mấu chốt của recommender: DỮ LIỆU RATING
→ User A đánh giá Phim X = 5 sao
→ User A đánh giá Phim Y = 2 sao
→ User B đánh giá Phim X = 4 sao

Từ dữ liệu này, hệ thống học:
→ User A và User B có gu tương tự (cùng thích Phim X)
→ Phim X có thể hợp với cả A và B
→ Phim Y có thể KHÔNG hợp với B
```

### 2.3. Cấu trúc dữ liệu Rating

```
Rating = (user_id, item_id, rating, timestamp)

user_id  = ID của người dùng
item_id  = ID của sản phẩm/phim
rating   = Điểm user đánh giá (thường là 1-5 sao)
timestamp = Thời gian đánh giá
```

### 2.4. Tại sao PHẢI CÓ dataset?

```
KHÔNG CÓ DATASET = KHÔNG TRAIN ĐƯỢC MODEL

Tương tự:
  Muốn học lái xe → Cần xe để tập lái
  Muốn train model rec → Cần data để train

Model học từ data:
  data càng nhiều → model càng chính xác
  data càng chất lượng → prediction càng tốt
```

---

## 3. Dataset MovieLens

### 3.1. Giới thiệu

```
MovieLens = Bộ dữ liệu phim MIỄN PHÍ
→ Thu thập bởi GroupLens Research (Đại học Minnesota)
→ Dùng trong NGHIÊN CỨU & HỌC TẬP trên toàn thế giới
→ Có nhiều phiên bản: 100K, 1M, 25M ratings
```

**Nguồn:** https://grouplens.org/datasets/movielens/

### 3.2. Các phiên bản MovieLens

| Phiên bản | Số ratings | Số users | Số phim | Dung lượng |
|-----------|-----------|---------|--------|-----------|
| **MovieLens 100K** | 100,000 | ~943 | ~1,682 | ~1 MB |
| **MovieLens 1M** | 1,000,000 | ~6,040 | ~3,900 | ~6 MB |
| **MovieLens 25M** | 25,000,000 | ~162,000 | ~62,000 | ~250 MB |

**Đề xuất cho đồ án:** **MovieLens 1M** (đủ lớn để demo, không quá lớn để chạy chậm)

### 3.3. Cấu trúc file MovieLens 1M

MovieLens 1M gồm **3 file CSV chính:**

```
Dataset/
├── movies.dat      ← Thông tin phim
├── ratings.dat    ← Lịch sử đánh giá
└── users.dat      ← Thông tin user (tuổi, giới tính, nghề nghiệp)
```

**File ratings.dat (quan trọng nhất):**
```
# Format: UserID::MovieID::Rating::Timestamp
# Ví dụ:
1::31::2.5::1260759144
1::1029::3.0::1260759179
1::1061::3.0::1260759182
1::1129::1.0::1260759185
2::31::4.0::1260759115
2::1029::4.0::1260759179

Giải thích:
  User 1 đánh phim 31 = 2.5 sao (timestamp = 2009-12-14)
  User 1 đánh phim 1029 = 3.0 sao
  User 2 đánh phim 31 = 4.0 sao  ← User 1 & 2 cùng đánh giá phim 31
```

**File movies.dat:**
```
# Format: MovieID::Title::Genres
# Ví dụ:
1::Toy Story (1995)::Animation|Children's|Comedy
2::Jumanji (1994)::Adventure|Children's|Fantasy
3::Grumpier Old Men (1997)::Comedy|Romance
31::Dumb & Dumber (1994)::Comedy

Giải thích:
  Phim 31 = "Dumb & Dumber" (1994)
  Thể loại: Comedy (Hài)
  → Có thể dùng thể loại này cho Content-Based Filtering
```

**File users.dat:**
```
# Format: UserID::Gender::Age::Occupation::Zip-code
# Ví dụ:
1::M::1::10::48067
2::F::56::16::70072
3::M::25::15::55117

Giải thích:
  User 1: Nam (M), Tuổi 18-24 (1), Nghề nghiệp 10 (other/educated)
  User 2: Nữ (F), Tuổi 45-49 (56), Nghề nghiệp 16 (healthcare)
```

### 3.4. Tải dataset về Colab

```python
# Cách 1: Tải trực tiếp từ GroupLens
!wget https://files.grouplens.org/datasets/movielens/ml-1m.zip
!unzip ml-1m.zip

# Cách 2: Dùng thư viện có sẵn
!pip install scikit-surprise  # Thư viện recommender
from surprise import Dataset
data = Dataset.load_builtin('ml-1m')  # Load luôn MovieLens 1M
```

### 3.5. Đọc dataset bằng Pandas

```python
import pandas as pd

# Đọc 3 file (thay :: bằng \t vì pandas mặc định dùng tab)
ratings = pd.read_csv(
    'ml-1m/ratings.dat',
    sep='::',
    engine='python',        # engine='python' vì dùng ::
    names=['userId', 'movieId', 'rating', 'timestamp']
)

movies = pd.read_csv(
    'ml-1m/movies.dat',
    sep='::',
    engine='python',
    names=['movieId', 'title', 'genres']
)

# Xem dữ liệu
print(f"Tổng số ratings: {len(ratings):,}")
print(f"Số users: {ratings['userId'].nunique():,}")
print(f"Số phim: {ratings['movieId'].nunique():,}")
print(f"Rating trung bình: {ratings['rating'].mean():.2f}")

# Output:
# Tổng số ratings: 1,000,209
# Số users: 6,040
# Số phim: 3,706
# Rating trung bình: 3.58
```

### 3.6. Phân bố Rating (EDA đơn giản)

```python
import matplotlib.pyplot as plt

# Đếm số lượng mỗi mức rating
rating_counts = ratings['rating'].value_counts().sort_index()

plt.figure(figsize=(8, 5))
plt.bar(rating_counts.index, rating_counts.values, color='steelblue')
plt.xlabel('Rating (Sao)')
plt.ylabel('Số lượng')
plt.title('Phân bố Rating trong Dataset')
plt.show()

# Nhận xét:
# Rating 4 sao chiếm nhiều nhất → Người ta có xu hướng đánh giá TRUNG LẬP TÍCH CỰC
# Rất ít rating 1-2 sao → Thiên lệch (bias) cần lưu ý khi đánh giá model
```

---

## 4. Tổng kết Bài 2

```
✅ Chọn phim vì: Dataset chuẩn, phổ biến, dễ hiểu, nhiều nghiên cứu
✅ Dataset = Bộ dữ liệu để train model
✅ Rating = (user_id, item_id, rating, timestamp)
✅ KHÔNG CÓ DATASET = KHÔNG TRAIN ĐƯỢC MODEL
✅ MovieLens = Dataset phim chuẩn, miễn phí, nhiều phiên bản
✅ Dùng MovieLens 1M cho đồ án (đủ lớn, không quá nặng)
✅ Dataset gồm 3 file: ratings.dat, movies.dat, users.dat
```

---

## Bài tiếp theo
[Các loại thuật toán Recommender System](./03-thuat-toan.md)
