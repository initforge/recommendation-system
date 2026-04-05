# 🎬 Tài Liệu Bóc Tách Code Căn Bản Đến Nâng Cao (File-by-File Walkthrough)

Tài liệu này được thiết kế theo đúng tư duy tổ chức thư mục của lập trình viên. Chúng ta sẽ đi "quét" từ gốc lên ngọn, đọc từng file, hiểu từng dòng code và biết chính xác tại sao file đó lại tồn tại.

---

## 1. Môi trường & Thư viện (Dependencies)

Trước khi đi vào code, dự án này yêu cầu cài đặt các 'vũ khí' sau trong `requirements.txt`:
*   **`scikit-surprise`**: Thư viện lõi sinh ra chỉ để làm Recommender System. Cung cấp sẵn các thuật toán nén ma trận (SVD) và láng giềng k-NN. Nó giúp tiết kiệm hàng nghìn dòng code so với việc tự viết bằng C/C++.
*   **`scikit-learn` & `pandas`**: Dùng Pandas để gọt 1 triệu dòng dữ liệu `.dat` thành các bảng (Dataframes). Dùng `TfidfVectorizer` của Sklearn để máy tính hiểu được nhãn chữ ("Romance", "Action") thành dạng số học.
*   **`fastapi` & `uvicorn`**: Dùng để mở một API Server. Nhanh hơn Flask, hỗ trợ Async xịn xò.
*   **`pyngrok`**: Đóng vai trò làm đường hầm. Server Colab trên cloud của Google chặn mọi thứ từ bên ngoài. Ngrok đục 1 lỗ nối cổng IP nội bộ ra internet thành đường link `https://...ngrok-free.dev`.

---

## 2. Giải Phẫu Từng Thư Mục & File Code

### 2.1. Thư mục `src/` (Bộ não tái sử dụng)
Thư mục này sinh ra để chứa các "Bản thiết kế" (.py). Code ở đây không tự chạy, mà để các Notebooks ở trên Colab gọi `import src` và xài.

#### 📄 File `src/data_loader.py`
**Chức năng:** Đi chợ mua nguyên liệu. Mở các file `.dat` thô ráp của MovieLens và tải vào bộ nhớ RAM.
**Bóc tách Code:**
```python
def load_movielens():
    # pd.read_csv: Lệnh huyền thoại của Pandas dùng để đọc file rác.
    # sep="::": Quy định dữ liệu được cắt nhau bằng dấu :: chứ không phải dấu phẩy ,
    # names=[...]: Nhãn dán cho các cột để dễ truy vấn sau này.
    ratings = pd.read_csv("ml-1m/ratings.dat", sep="::", engine="python",
                          names=["userId", "movieId", "rating", "timestamp"])
    # ... load movies và users tương tự ...
    return ratings, movies, users
```

#### 📄 File `src/models.py` (TRÁI TIM HỆ THỐNG)
**Chức năng:** Nơi chứa định nghĩa toàn bộ 5 thuật toán Machine Learning.

**1. Khối Code User & Item Collaborative Filtering (Lọc Cộng Tác)**
*Yêu cầu:* Tìm "người giống người" (User) hoặc "phim giống phim" (Item).
```python
def train_user_cf(ratings_df, k=20):
    reader = Reader(rating_scale=(1, 5)) # Định nghĩa luật chơi: Điểm số chỉ chạy từ 1 đến 5 sao
    data = Dataset.load_from_df(ratings_df[["userId", "movieId", "rating"]], reader)
    trainset = data.build_full_trainset() # Chuyển bảng Excel thành chuẩn Ma Trận của Surprise
    
    # KNNWithMeans: Thuật toán K-Nearest Neighbors nhưng có hiệu chỉnh điểm trung bình 
    # (Tránh việc user A vốn khó tính toàn chấm 2 sao, user B xởi lởi toàn chấm 5 sao).
    # sim_option={'name': 'cosine'}: Dùng Cosine để đo góc lệch giữa 2 User. Góc càng hẹp = càng thân nhau.
    model = KNNWithMeans(k=k, sim_option={"name": "cosine"})
    model.fit(trainset) # Chạy thuật toán để tìm hàng xóm (Học)
    return model
```

**2. Khối Code SVD (Matrix Factorization)**
*Yêu cầu:* Giải bài toán ma trận trống 95% bằng cách phân rã nó thành các Đặc tính (Latent Factors).
```python
def train_svd(ratings_df, n_factors=50, n_epochs=20):
    # ... đoạn nạp data tương tự ở trên ...
    
    # SVD: Singular Value Decomposition (Thuật toán vô địch Netflix).
    # n_factors=50: Ra lệnh cho máy nén sự phức tạp của 6000 người xuống trị giá 50 cái trục (VD: Trục hài hước, trục đẫm máu...)
    # n_epochs=20: Quét qua lại tập dữ liệu 20 vòng (Gradient Descent) để tính tới khi sai số nhỏ nhất mới dừng.
    model = SVD(n_factors=n_factors, n_epochs=n_epochs, random_state=42)
    model.fit(trainset)
    return model
```

**3. Khối Code Trí Tuệ Lai (Hybrid)**
*Yêu cầu:* SVD thì mạnh nhưng không thể gợi ý cho User mới tò te (Cold-start). Content-Based thì bù đắp được nhưng kém sâu sắc. Ta gộp chúng lại.
```python
def get_recs_hybrid(uid, cf_weight=0.6, top_n=50):
    # Lõi sức mạnh của hệ thống là công thức tính Điểm Tổng Phục (Scores)
    for mid in unseen: # Vòng lặp quét duyệt qua tất cả các Phim mà User chưa xem
        
        # Phần 1: Gọi SVD ra mặt, yêu cầu dự đoán (.predict) người uid cho phim mid mấy điểm
        svd_p = model_svd.predict(uid, mid).est  
        
        # Phần 2: Nội suy Vector
        cb_p = 3.0 # Điểm mặc định nếu Content-Based tắt đài
        if len(ref_indices) > 0 and mid in movie_idx.index:
            # np.dot: Tính Phép nhân vô hướng (Dot Product) của mảng Cosine và điểm đánh giá quá khứ. 
            # Kỹ thuật Vectorized trên Numpy giúp code Python chạm mốc tốc độ của C++.
            sims = cosine_sim[movie_idx[mid], ref_indices]
            cb_p = np.dot(sims, ref_weights) / len(ref_indices) 
            
        # Tổng hợp: 60% tin SVD, 40% tin Content-Based
        scores[mid] = cf_weight * svd_p + (1 - cf_weight) * cb_p
```

---

### 2.2. Thư mục `notebooks/` (Bộ vi xử lý trên Cloud)

Các file từ `01` đến `08` dùng để làm nháp từng bước. Nhưng ngôi sao sáng nhất là `00_full_pipeline.ipynb`. File này làm 2 nhiệm vụ cốt lõi:

**Nhiệm vụ 1: Gọi toàn bộ thuât toán ở `src/` ra luyện tập cùng lúc.**
`svd.fit(trainset)`
Sau khi rèn luyện xong, nó xuất ra một file cứng bằng `joblib`. Đây là trò lưu 캐시 (Cache): lần tới chạy chỉ tốn 0.5 giây để bốc Models ra thay vì học 10 phút lại từ đầu.

**Nhiệm vụ 2: Mở Cổng API Server (FastAPI)**
File này quyết làm hệ thống chạy thực: 
```python
# Mở một cánh cổng tiếp tân API
api = FastAPI(title='Movie Recommender API')

# Định nghĩa tuyến đường (Route).
# Khi Frontend đẩy data JSON lên đường dẫn /api/recommend, hàm này kích hoạt.
@api.post('/api/recommend')
def api_recommend(req: RecommendRequest):
    # Phân tích xem Request đòi SVD hay Hybrid
    if algo == 'Hybrid':
        recs_with_scores = get_recs_hybrid(uid, req.cf_weight) # Chạy hàm Toán Học
        
    # Chuẩn bị dĩa thức ăn JSON trả về cho Frontend
    results = []
    for mid, score in recs_with_scores:
        # Bốc tên phim, nhãn dán, và KÈM THEO ĐIỂM SỐ CHÍNH XÁC TỪNG SỐ THẬP PHÂN
        results.append({'movieId': int(mid), 'title': row['title'], 'score': round(float(score), 2)})
    return {'recommendations': results}
```

---

### 2.3. Thư mục `frontend/` (Giao diện Tĩnh Tâm)

Đây là tầng Giao Tiếp bọc ngoài bằng công nghệ cực nhẹ. Do API nằm hết trên Colab, Web sẽ được host ở Cloudflare Pages mà không sinh ra một xu chi phí vận hành Server.

#### 📄 File `app.js` (Thị Giác & Cử Động)
**Chức năng:** Trực tiếp bấm bụng gọi ngrok (Colab), sau đó đổ JSON ra thành cái List Đẹp đẽ trên màn hình.
**Bóc tách Code:**
```javascript
// Bước 1: Fetch() lệnh thần thánh của JS để đi vay mượn data từ Server Khác
const res = await fetch(`${API_URL}/api/recommend`, {
    method: 'POST', // Đẩy ID của User lên
    headers: {
        'Content-Type': 'application/json',
        // ngrok-skip-browser-warning: Dòng Code Cứu Rỗi! 
        // Vì ngrok là máy chủ tạm nên nó hay quăng ra 1 cái trang cảnh báo HTML màu xanh le. 
        // Header này báo ngrok hãy im mồm và cứ trả về JSON trong suốt cho Frontend.
        'ngrok-skip-browser-warning': 'true' 
    },
    body: JSON.stringify({ user_id: userId, algorithm: algorithm, top_n: 10 })
});

const data = await res.json(); // Biến rác thành Vàng

// Bước 2: Map Data vào Giao diện (Màu Sage Green)
resultsGrid.innerHTML = data.recommendations.map((m, i) => {
    // Nếu thuật toán có trả về con Score tâm huyết, thì in nó ra. Không thì để Dấu ?.
    const score = m.score ? parseFloat(m.score).toFixed(2) : "?";
    return `
        <!-- Xây dựng cục HTML nhúng động biến "${m.title}" -->
        <span class="text-sage">${score}</span>
    `
}).join(''); // Nối các mảnh HTML vào Khung Trắng
```

Đến đây, bạn đã thấu hiểu nguyên lý tận cùng của Project: **Data (MovieLens) -> Luyện Công (Surprise/Sklearn) -> Đóng kén Server (FastAPI + Ngrok) -> Trải Lên Giấy (Cloudflare JS)**. Mọi thứ được thiết kế chặt chẽ và không thể tách rời.
