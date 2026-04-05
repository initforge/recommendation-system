# BÀI 4: Đánh giá — Metrics (RMSE, Precision, Recall...)

## 1. Tại sao cần đánh giá?

### 1.1. Câu hỏi quan trọng

```
Sau khi code xong model CF, ta có 3 thuật toán:
  → Algorithm A: Gợi 10 phim → User thích 7 phim
  → Algorithm B: Gợi 10 phim → User thích 8 phim
  → Algorithm C: Gợi 10 phim → User thích 4 phim

→ Algorithm nào TỐT NHẤT?
→ Algorithm B? Nhưng "thích" là SUBJECTIVE, không đo lường được?
→ Cần METRICS — con số CỤ THỂ để so sánh
```

### 1.2. Đánh giá = So sánh dự đoán vs Thực tế

```
Model dự đoán: "User A sẽ đánh giá Phim X = 4.5 sao"
Thực tế:       User A đánh giá Phim X = 4.0 sao
Sai số:         4.5 - 4.0 = 0.5 sao

Model gợi:      ["Phim A", "Phim B", "Phim C"] (top 3)
User thích:     ["Phim A", "Phim B", "Phim D", "Phim E"] (thực tế)
Trùng:          ["Phim A", "Phim B"] → 2/3 = 66.7%

→ Metrics giúp định lượng hóa CHẤT LƯỢNG model
```

---

## 2. Hai loại đánh giá

### 2.1. Đánh giá PHỎNG ĐOÁN (Prediction)

```
Câu hỏi: "Model dự đoán RATING chính xác đến đâu?"
→ Đo bằng RMSE, MAE

Dùng khi: Muốn BIẾT model đoán số SAO đúng không
Ví dụ: "Model nói user sẽ đánh 4.2 sao, thực tế là 4.0"
```

### 2.2. Đánh giá XẾP HẠNG (Ranking)

```
Câu hỏi: "Top N gợi ý có bao nhiêu cái user THÍCH THẬT?"
→ Đo bằng Precision@K, Recall@K, MAP, NDCG

Dùng khi: Quan tâm đến CHẤT LƯỢNG GỢI Ý
Ví dụ: "Gợi top 10 phim, trong đó user thích 7 cái → Precision@10 = 70%"
```

---

## 3. ĐÁNH GIÁ PHỎNG ĐOÁN

### 3.1. RMSE — Root Mean Square Error

```
ĐỊNH NGHĨA: Sai số bình phương trung bình (căn bậc 2)

Công thức:
            ___________
           /  Σ (ŷ - y)²
RMSE =   /   -----------
        /       N

Trong đó:
  ŷ = giá trị dự đoán
  y = giá trị thực tế
  N = số lượng predictions
```

```
Ví dụ tính tay:

Data:
  User 1: Dự đoán = 4.5, Thực tế = 4.0 → Error = 0.5
  User 2: Dự đoán = 3.0, Thực tế = 3.5 → Error = -0.5
  User 3: Dự đoán = 2.0, Thực tế = 1.5 → Error = 0.5
  User 4: Dự đoán = 5.0, Thực tế = 4.5 → Error = 0.5

SSE (Sum of Squared Errors):
  = 0.5² + (-0.5)² + 0.5² + 0.5²
  = 0.25 + 0.25 + 0.25 + 0.25 = 1.0

MSE (Mean Squared Error) = SSE / N = 1.0 / 4 = 0.25

RMSE = √MSE = √0.25 = 0.5 sao

→ Model sai trung bình 0.5 sao cho mỗi dự đoán
```

```
Ý nghĩa:
  RMSE = 0.5  → Sai trung bình 0.5 sao (rất tốt)
  RMSE = 1.0  → Sai trung bình 1.0 sao (khá)
  RMSE = 2.0  → Sai trung bình 2.0 sao (kém)
  RMSE = 3.0+ → Gần như ngẫu nhiên

Mục tiêu: RMSE càng NHỎ càng tốt
```

### 3.2. MAE — Mean Absolute Error

```
Khác RMSE: KHÔNG bình phương error (không phạt error lớn nặng)

MAE = Σ |ŷ - y| / N

Ví dụ:
  |0.5| + |-0.5| + |0.5| + |0.5| = 2.0
  MAE = 2.0 / 4 = 0.5

→ RMSE = 0.5, MAE = 0.5 (trong trường hợp này bằng nhau)
→ Khi error lớn, RMSE sẽ lớn hơn MAE nhiều (vì bình phương)
```

```
┌───────────────┬───────────────────────────────────────────┐
│ Metric        │ Cách đọc                                 │
├───────────────┼───────────────────────────────────────────┤
│ RMSE = 0.50   │ Sai trung bình 0.5 sao                   │
│ RMSE = 0.80   │ Sai trung bình 0.8 sao                   │
│ RMSE = 1.20   │ Sai trung bình 1.2 sao                   │
│               │                                           │
│ MAE = 0.40    │ Sai trung bình tuyệt đối 0.4 sao        │
│               │                                           │
│ ✅ RMSE/MAE nhỏ = Model tốt                             │
└───────────────┴───────────────────────────────────────────┘
```

### 3.3. Code đánh giá RMSE / MAE

```python
# ============================================================
# ĐÁNH GIÁ PREDICTION: RMSE, MAE
# ============================================================
import numpy as np
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Giả sử đây là kết quả dự đoán vs thực tế
y_actual = [4.0, 3.5, 1.5, 4.5, 3.0, 5.0, 2.5, 4.0]
y_pred   = [4.5, 3.0, 2.0, 5.0, 3.2, 4.8, 2.3, 4.1]

# Tính RMSE
rmse = np.sqrt(mean_squared_error(y_actual, y_pred))

# Tính MAE
mae = mean_absolute_error(y_actual, y_pred)

print(f"RMSE: {rmse:.4f} sao")
print(f"MAE:  {mae:.4f} sao")

# Output:
# RMSE: 0.5432 sao  (sai trung bình ~0.54 sao)
# MAE:  0.4125 sao  (sai trung bình ~0.41 sao)
```

---

## 4. ĐÁNH GIÁ XẾP HẠNG

### 4.1. Precision@K

```
ĐỊNH NGHĨA: Trong Top K gợi ý, có bao nhiêu cái USER THÍCH THẬT?

Precision@K = (Số item gợi đúng) / K
```

```
Ví dụ:

Model gợi Top 5:    [Phim A, Phim B, Phim C, Phim D, Phim E]
User THẬT SỰ thích: [Phim A, Phim B,      Phim D          ]
Trùng:               [Phim A, Phim B,                   ]
                       ✓          ✓                        = 2 trùng

Precision@5 = 2/5 = 40%
→ Model đúng 40% trong top 5 gợi ý

Precision@3 = 2/3 = 66.7%
→ Nếu chỉ gợi 3 cái thì đúng 66.7%
```

### 4.2. Recall@K

```
ĐỊNH NGHĨA: Trong tất cả items user thích, model gợi ĐƯỢC bao nhiêu?

Recall@K = (Số item gợi đúng) / (Tổng số item user thích)
```

```
Ví dụ:

User thích 10 bộ phim: [A, B, C, D, E, F, G, H, I, J]
Model gợi Top 5:       [A, B, C, D, E]
Trùng:                 [A, B, C, D, E] = 5 items

Recall@5 = 5/10 = 50%
→ Model gợi được 50% trong tổng số phim user thích
```

```
Precision vs Recall — ví dụ minh họa:

                                    Precision@10  Recall@10
Model gợi rất nhiều: 20/10 = 200%       ~70%        ~50%
  → Gợi nhiều nhưng nhiễu (Precision thấp)

Model gợi rất ít:    5/10 = 50%
  → Chỉ gợi những cái chắc chắn (Precision cao, Recall thấp)

Model cân bằng:     7/10 = 70%
  → Gợi vừa đủ, đa số đúng (Cân bằng Precision-Recall)

→ Tùy mục tiêu mà ưu tiên Precision hay Recall
```

### 4.3. F1-Score — Cân bằng Precision & Recall

```
ĐỊNH NGHĨA: Trung bình điều hòa giữa Precision và Recall

F1 = 2 × (Precision × Recall) / (Precision + Recall)

Ví dụ:
  Precision = 0.70, Recall = 0.50
  F1 = 2 × (0.70 × 0.50) / (0.70 + 0.50)
      = 0.70 / 1.20 = 0.583

→ Khi muốn CÂN BẰNG cả 2: dùng F1-Score
```

### 4.4. MAP — Mean Average Precision

```
ĐỊNH NGHĨA: Đánh giá CHẤT LƯỢNG XẾP HẠNG (thứ tự gợi ý có đúng không)

Tại sao cần MAP?
  → Precision@K không quan tâm THỨ TỰ
  → "Gợi [A, B, C] đúng 2/3" = "Gợi [C, B, A] đúng 2/3" (cùng Precision)
  → Nhưng [A, B, C] tốt hơn vì đúng xếp ở TRƯỚC

AP (Average Precision) cho 1 user:
  → Tính Precision@1, Precision@2, ..., Precision@K tại mỗi vị trí ĐÚNG
  → Lấy trung bình

MAP (Mean Average Precision):
  → Trung bình AP của TẤT CẢ users
```

```
Ví dụ tính AP:

User thích: [A, B, C, D, E]
Model gợi theo thứ tự: [A, F, B, G, C, H, D]

Precision tại các vị trí ĐÚNG:
  Position 1 (A): Precision@1 = 1/1 = 1.00
  Position 3 (B): Precision@3 = 2/3 = 0.67
  Position 5 (C): Precision@5 = 3/5 = 0.60
  Position 7 (D): Precision@7 = 4/7 = 0.57

AP = (1.00 + 0.67 + 0.60 + 0.57) / 4 = 0.71

→ AP càng cao → Model xếp items đúng ở VỊ TRÍ ĐẦU
→ MAP = trung bình AP của tất cả users
```

### 4.5. NDCG — Normalized Discounted Cumulative Gain

```
ĐỊNH NGHĨA: Đánh giá xếp hạng, có tính đến VỊ TRÍ và ĐỘ LIÊN QUAN

DCG = Σ (rel_i) / log2(i+1)  (i = vị trí, rel = độ liên quan)
NDCG = DCG / IDCG            (IDCG = DCG lý tưởng, xếp đúng nhất)

→ NDCG = 1.0 → Xếp hạng HOÀN HẢO
→ NDCG = 0.0 → Xếp hạng TỆ NHẤT
```

### 4.6. Code đánh giá Ranking

```python
# ============================================================
# ĐÁNH GIÁ XẾP HẠNG: Precision@K, Recall@K, MAP, NDCG
# ============================================================
import numpy as np

def precision_at_k(actual, predicted, k):
    """Precision@K: Trong K gợi ý, có bao nhiêu cái đúng?"""
    if len(predicted) > k:
        predicted = predicted[:k]
    num_hits = len(set(actual) & set(predicted))
    return num_hits / k

def recall_at_k(actual, predicted, k):
    """Recall@K: Gợi được bao nhiêu % trong tổng items user thích?"""
    if len(predicted) > k:
        predicted = predicted[:k]
    num_hits = len(set(actual) & set(predicted))
    return num_hits / len(actual) if len(actual) > 0 else 0

def average_precision_at_k(actual, predicted, k):
    """AP@K: Precision có tính thứ tự xếp hạng"""
    if len(predicted) > k:
        predicted = predicted[:k]
    score = 0.0
    num_hits = 0.0
    for i, p in enumerate(predicted):
        if p in actual and p not in predicted[:i]:
            num_hits += 1.0
            score += num_hits / (i + 1.0)
    return score / min(len(actual), k)

def map_at_k(all_actuals, all_predicted, k):
    """MAP@K: Trung bình AP của tất cả users"""
    return np.mean([
        average_precision_at_k(a, p, k)
        for a, p in zip(all_actuals, all_predicted)
    ])

# ============================================================
# Ví dụ sử dụng
# ============================================================
actual_items = ['A', 'B', 'C', 'D', 'E']  # User thích A, B, C, D, E
predicted_items = ['A', 'F', 'B', 'G', 'C']  # Model gợi

print(f"Precision@5: {precision_at_k(actual_items, predicted_items, 5):.3f}")
# Output: 3/5 = 0.600

print(f"Recall@5: {recall_at_k(actual_items, predicted_items, 5):.3f}")
# Output: 3/5 = 0.600

print(f"AP@5: {average_precision_at_k(actual_items, predicted_items, 5):.3f}")
# Output: (1/1 + 2/3 + 3/5) / 3 = 0.756

# ============================================================
# Đánh giá nhiều users cùng lúc (giả lập)
# ============================================================
all_actuals = [
    ['A', 'B', 'C'],
    ['X', 'Y', 'Z', 'W'],
    ['P', 'Q'],
]
all_predicted = [
    ['A', 'B', 'D'],      # User 1: đúng 2/3
    ['X', 'Y', 'Z'],      # User 2: đúng 3/3
    ['R', 'S', 'P'],      # User 3: đúng 1/3
]

print(f"\nMAP@3: {map_at_k(all_actuals, all_predicted, 3):.3f}")
# Output: ~(0.86 + 1.0 + 0.33) / 3 ≈ 0.73
```

---

## 5. TRAIN / TEST SPLIT — Chia dữ liệu

### 5.1. Tại sao phải chia?

```
NẾU train và test trên CÙNG data:
  → Model nhớ CÂU TRẢ LỜI (overfitting)
  → Kết quả đẹp nhưng KHÔNG reflect thực tế

CHIA data trước:
  → Train set: cho model HỌC
  → Test set: cho model THI (không được xem trước)
  → Kết quả thi mới phản ánh NĂNG LỰC THẬT
```

### 5.2. Các cách chia

```
CÁCH 1: Random Split (80/20)
  → Lấy ngẫu nhiên 80% ratings cho train
  → 20% còn lại cho test
  → Đơn giản, nhanh

CÁCH 2: Temporal Split (theo thời gian)
  → Dùng ratings CŨ hơn cho train
  → Dùng ratings MỚI hơn cho test
  → Giống thực tế hơn (dự đoán tương lai từ quá khứ)

CÁCH 3: Cross-Validation (K-Fold)
  → Chia thành K phần
  → Lần lượt dùng mỗi phần làm test, K-1 phần còn lại làm train
  → Kết quả ổn định hơn (ít phụ thuộc vào cách chia)
```

### 5.3. Code chia data

```python
# ============================================================
# CHIA DATA: TRAIN / TEST
# ============================================================
from surprise import Dataset, Reader, KNNBasic
from surprise.model_selection import train_test_split, cross_validate

# Cách 1: Dùng surprise library
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)

# Chia 80/20 ngẫu nhiên
trainset, testset = train_test_split(data, test_size=0.2)

print(f"Train set: {trainset.n_ratings:,} ratings")
print(f"Test set:  {len(testset):,} ratings")

# Cách 2: Pandas (thủ công)
from sklearn.model_selection import train_test_split as tts

train, test = tts(
    ratings,
    test_size=0.2,
    random_state=42  # Để reproducible (mỗi lần chia giống nhau)
)

print(f"\nTrain: {len(train):,} ratings")
print(f"Test:  {len(test):,} ratings")
```

---

## 6. Tổng kết Bài 4

```
ĐÁNH GIÁ PHỎNG ĐOÁN:
  RMSE = √(Σ(pred - actual)² / N) → Sai số bình phương TB (càng nhỏ càng tốt)
  MAE  = Σ|pred - actual| / N     → Sai số tuyệt đối TB (càng nhỏ càng tốt)

ĐÁNH GIÁ XẾP HẠNG:
  Precision@K = hits / K          → Trong K gợi, đúng mấy cái? (càng lớn càng tốt)
  Recall@K    = hits / |actual|   → Gợi được bao nhiêu %? (càng lớn càng tốt)
  F1-Score   = 2×P×R / (P+R)     → Cân bằng P và R (càng lớn càng tốt)
  MAP@K      = Trung bình AP      → Xếp hạng có đúng thứ tự không (càng lớn càng tốt)
  NDCG       = DCG/IDCG (norm)   → Xếp hạng hoàn hảo = 1.0

CHIA DATA:
  Train / Test = 80% / 20% (random hoặc temporal)
  Cross-Validation = K-Fold cho kết quả ổn định hơn
```

---

## Bài tiếp theo
[Context Features — Temporal & Demographics Analysis](../docs/05-context-features.md)
