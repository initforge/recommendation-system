# 🎬 Slide Notes — Recommender System Presentation

## Cấu trúc Presentation

```
Presentation gồm 12 slides, mỗi slide ~2 phút nói
Tổng thời gian: ~25 phút
```

---

## SLIDE 1: GIỚI THIỆU — Recommender System là gì?

**Nội dung:**
- Recommender System = Hệ thống gợi ý
- Bài toán: "Quá nhiều lựa chọn" → cần gợi đúng thứ cho đúng người

**Ví dụ thực tế:**
- Netflix: "Because you watched X..."
- YouTube: "Up next"
- Spotify: "Discover Weekly"
- Amazon: "Frequently bought together"
- TikTok: For You Page

**Tại sao quan trọng?**
- 80% what people watch on Netflix comes from recommendations
- 35% of Amazon purchases come from recommendations
- Netflix saves $1B/year from reduced churn due to recommendations

**Nói:**
> "Mỗi khi bạn xem Netflix, có AI chọn phim cho bạn. Đó chính là Recommender System."

---

## SLIDE 2: TẠI SAO CHỌN PHIM? DATASET MOVIELENS

**Nội dung:**
- MovieLens 1M: 1 triệu ratings, 6,040 users, 3,706 phim
- Thuộc GroupLens Research (University of Minnesota)
- Classic dataset cho Recommender Systems research
- Đủ lớn để demo, đủ nhỏ để chạy nhanh

**Dataset structure:**
```
ratings.dat   :: 1M ratings (userId::movieId::rating::timestamp)
movies.dat    :: 3.8K movies (movieId::title::genres)
users.dat     :: 6K users (userId::gender::age::occupation)
```

**Phân bố rating:**
- Rating 4★ chiếm nhiều nhất (có thiên lệch positive)
- Sparsity = 95.5% (ma trận rating gần như trống)

**Nói:**
> "MovieLens giống như 'Hello World' của Recommender Systems. Đủ đơn giản để hiểu, đủ phức tạp để nghiên cứu."

---

## SLIDE 3: OVERVIEW — 5 THUẬT TOÁN

**Nội dung:**
```
1. User-Based CF  — Tìm user giống nhau → Gợi
2. Item-Based CF   — Tìm phim giống nhau → Gợi
3. SVD            — Matrix Factorization → Tìm latent factors
4. Content-Based  — TF-IDF + Genres → Gợi phim tương tự
5. Hybrid         — Kết hợp SVD + Content → Gợi tốt nhất
```

**Sơ đồ:**
```
┌──────────┐    ┌──────────┐    ┌──────────┐
│  Users   │───▶│ Ratings  │◀───│  Movies  │
└──────────┘    └────┬─────┘    └──────────┘
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  User-Based   Matrix Factor.  Content-Based
  CF           (SVD)           (Genres)
       │            │            │
       └────────────┼────────────┘
                    ▼
              HYBRID (Kết hợp)
```

---

## SLIDE 4: COLLABORATIVE FILTERING — Ý TƯỞNG

**Nội dung:**
> "Người dùng giống nhau sẽ thích phim giống nhau"

**Cách hoạt động:**
1. Tính similarity giữa các users (cosine similarity)
2. Chọn K users giống A nhất (K-Nearest Neighbors)
3. Dự đoán rating của A cho phim i dựa trên K neighbors

**Ví dụ:**
```
User A thích: Phim X, Y, Z
User B giống A nhất và thích: Phim W

→ Gợi: Phim W cho User A (vì B giống A)
```

**Điểm mạnh:** Không cần hiểu nội dung phim
**Điểm yếu:** Cold-start problem (user mới = không có data)

---

## SLIDE 5: USER-BASED vs ITEM-BASED CF

**So sánh:**

| | User-Based | Item-Based |
|---|---|---|
| Similarity | Giữa users | Giữa items (phim) |
| Tốc độ | Chậm (6K users) | Nhanh hơn (3.7K movies) |
| Ổn định | Users thay đổi | Items ít thay đổi |
| RMSE | ~0.89 | ~0.88 |

**Công thức User-Based:**
```
r̂(u,i) = r̄_u + Σ(sim(u,v) × (r_v,i - r̄_v)) / Σ|sim(u,v)|
```

**Công thức Item-Based:**
```
r̂(u,i) = Σ(sim(i,j) × r(u,j)) / Σ|sim(i,j)|
```

**Nói:**
> "Item-Based thường được ưa chuộng hơn vì items ổn định, tính toán nhanh hơn."

---

## SLIDE 6: SVD — MATRIX FACTORIZATION

**Nội dung:**
> "Tìm 'đặc điểm ẩn' của users và movies"

**Ý tưởng:**
- Ma trận Ratings (users × movies) rất thưa
- Phân rã thành: R ≈ U × S × Vᵀ
- U = user factors (đặc điểm ẩn của user)
- V = item factors (đặc điểm ẩn của phim)

**Ví dụ latent factors:**
```
Factor 1: Hành động ◀──────────▶ Hài kịch
Factor 2: Phim cũ    ◀──────────▶ Phim mới
Factor 3: Phim Mỹ    ◀──────────▶ Phim nhập khẩu
```

**Công thức:**
```
r̂(u,i) = μ + b_u + b_i + p_u · q_i
  μ  = rating trung bình
  b_u = user bias
  b_i = item bias
  p_u·q_i = dot product của user & item vectors
```

**SVD đạt RMSE thấp nhất (~0.87)** — là thuật toán chiến thắng Netflix Prize 2009

---

## SLIDE 7: CONTENT-BASED FILTERING

**Nội dung:**
> "Gợi phim dựa trên ĐẶC ĐIỂM phim, không cần user data"

**Cách hoạt động:**
1. Trích xuất features từ phim (genres)
2. TF-IDF: chuyển genres thành vector
3. Cosine similarity: tìm phim tương tự
4. Gợi phim giống phim user đã thích

**TF-IDF giải thích:**
```
TF-IDF(genre) = TF(genre) × IDF(genre)
TF = tần suất genre trong phim
IDF = giảm trọng số genre phổ biến (Comedy)
```

**Ưu điểm:**
- ✅ Không cần data từ user khác
- ✅ Gợi phim mới (cold-start item)
- ✅ Explained được ("vì bạn thích X")

**Nhược điểm:**
- ❌ Thiếu diversity (chỉ gợi phim tương tự)
- ❌ Cần features tốt

---

## SLIDE 8: HYBRID RECOMMENDER

**Nội dung:**
> "Tận dụng ưu điểm của cả CF và Content-Based"

**Công thức:**
```
Hybrid_Score(u,i) = α × SVD_Score(u,i) + (1-α) × Content_Score(u,i)
  α = 0.6 → 60% SVD, 40% Content
```

**Tại sao Hybrid tốt?**
- SVD: Giỏi khi user có nhiều ratings
- Content: Giỏi khi user mới (cold-start)
- Hybrid: Tận dụng cả hai

**α tối ưu:** 0.6–0.7 (cross-validation cho thấy)

**Kết quả:**
- Hybrid đạt RMSE thấp nhất (~0.86)
- MAP@10 cao hơn tất cả các thuật toán riêng lẻ

---

## SLIDE 9: EVALUATION METRICS

**Accuracy Metrics:**
```
RMSE = √(Σ(predicted - actual)² / N)
MAE  = Σ|predicted - actual| / N
```
- RMSE nhạy hơn với large errors
- Cả hai: thấp hơn = tốt hơn

**Ranking Metrics:**
```
Precision@K = |relevant ∩ top-K| / K
Recall@K    = |relevant ∩ top-K| / |relevant|
MAP@K       = trung bình của AP@K (có tính thứ tự)
```

**Precision vs Recall:**
- Precision: "Trong K gợi ý, bao nhiêu đúng?"
- Recall: "Gợi được bao nhiêu % trong tổng?"

**Chọn K phù hợp:**
- K=5: Gợi ngắn, precision cao
- K=10: Cân bằng (thường dùng)
- K=20: Gợi dài, recall cao

---

## SLIDE 10: CONTEXT FEATURES — TEMPORAL

**Temporal Features:**
- Year: Rating thay đổi theo năm
- Day of week: Cuối tuần vs ngày thường
- Hour: Giờ trong ngày

**Insights:**
```
📅 Day of week:
   Sat/Sun: Rating cao hơn ngày thường
   (Cuối tuần có thời gian thư giãn hơn)

⏰ Hour:
   2-6h sáng: Rating cao nhất
   (User ít, nhưng rating cẩn thận hơn)

📆 Year:
   1999-2000: Rating có xu hướng giảm nhẹ
   (Dataset span: Nov 1999 – Feb 2000)
```

**Ứng dụng:**
- Context-aware CF: weight ratings theo recency
- Time-decay: đánh giá gần đây quan trọng hơn

---

## SLIDE 11: CONTEXT FEATURES — DEMOGRAPHICS

**Gender differences:**
```
♂ Male prefers:  Action, Sci-Fi, Thriller, War
♀ Female prefers: Romance, Drama, Comedy, Documentary
```

**Age group insights:**
```
Under 18:  Rating cao nhất (enthusiastic)
18-24:     Rating cao (main user group)
25-34:     Moderate ratings
45+:       Rating cẩn thận hơn, thích Drama
```

**Occupation:**
- Students: Rating nhiều, thích Comedy/Action
- Scientists/Engineers: Thích Sci-Fi, Documentary
- Retired: Thích Drama, War

**Ứng dụng:**
- Demographic-aware recommendation
- Bias gợi ý theo nhóm đối tượng
- Personalized features cho từng nhóm

---

## SLIDE 12: KẾT LUẬN & DEMO

**Tổng kết kết quả:**

| Thuật toán | RMSE | Đặc điểm |
|-----------|------|-----------|
| User-Based CF | ~0.89 | Tìm users giống nhau |
| Item-Based CF | ~0.88 | Tìm phim giống nhau |
| SVD | ~0.87 | ✅ Tốt nhất overall |
| Content-Based | N/A | Gợi cold-start items |
| Hybrid | ~0.86 | ✅ Tốt nhất khi kết hợp |

**5 bài học quan trọng:**
1. **SVD** thường tốt hơn CF truyền thống
2. **Hybrid** kết hợp ưu điểm nhiều thuật toán
3. **Context features** cải thiện hiểu biết về users
4. **Metrics khác nhau** đo lường khía cạnh khác nhau
5. **No free lunch** — không có thuật toán nào tốt cho mọi trường hợp

**Demo live:**
> Mở web app → nhập User ID → xem gợi ý

**Link web app:** streamlit.cloud/deploy (hoặc chạy local)

---

## CÁCH TRÌNH BÀY

### Trước khi trình bày:
- Test web demo trước 10 phút
- Chuẩn bị dataset đã preprocessed
- Backup: có sẵn screenshots của charts

### Trong khi trình bày:
- Bắt đầu bằng câu hỏi: "Ai đã từng xem Netflix?"
- Dùng ví dụ cụ thể (User 1 thích phim gì → gợi phim gì)
- Mỗi slide nói tối đa 2 phút
- Q&A: chuẩn bị 3 câu hỏi phổ biến

### Câu hỏi phỏng vấn có thể gặp:
1. "Cold-start problem là gì?" → User/item mới không có data → Content-Based giải quyết
2. "Tại sao SVD tốt hơn CF?" → Học latent features trực tiếp, không cần full similarity matrix
3. "Hybrid làm gì khi user hoàn toàn mới?" → Fallback sang pure Content-Based
4. "Zipcode có dùng không?" → Không, bị loại vì privacy và không có giá trị đủ lớn
