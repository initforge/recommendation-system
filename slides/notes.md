# 🎬 Tài Liệu Phân Tích Kỹ Thuật Chuyên Sâu (Deep-Dive Notes)

> **Mục tiêu của tài liệu:** Đây không phải là slide trình bày thông thường, mà là tài liệu "Bóc tách mã nguồn" (Code Walkthrough). Bạn sẽ sử dụng file này để hiểu đến tận cùng từng dòng code quan trọng, từng cấu trúc file, lý do tại sao lại sử dụng thư viện đó, và cơ chế tính toán toán học đằng sau 5 thuật toán lõi.

---

## 🏗️ 1. Giải phẫu Kiến trúc Hệ thống (Project Structure)

Hệ thống được thiết kế theo chuẩn **Decoupled Architecture** (Tách rời hoàn toàn giao diện và hạ tầng tính toán).

*   **`src/` (Source Code)**: Đây là trái tim của hệ thống. Chứa các file Python (`.py`) định nghĩa toàn bộ logic lõi. Mục đích của việc tách ra `src/` là tính tái sử dụng (Reusability). Thay vì viết code lặp lại rải rác trong nhiều file Notebook, ta gom nó vào `models.py` hoặc `data_loader.py` để mọi nơi đều có thể gọi `import src.models`.
*   **`notebooks/`**: Chứa môi trường phòng thí nghiệm (Jupyter Notebook). File quan trọng nhất là `00_full_pipeline.ipynb` thực thi toàn bộ quy trình từ Load Model, Train Model đến việc dựng thẳng một Server API chạy ngầm trên Google Colab.
*   **`frontend/`**: Chứa code giao diện. Được viết bằng HTML tĩnh, CSS (Tailwind) và thuần Javascript (`app.js`). Thư mục này được đẩy thẳng lên mạng phân phối nội dung (CDN) của Cloudflare Pages để người dùng load ngay lập tức trong 2 giây mà không cần Server render.

---

## 📦 2. Giải phẫu Thư Viện (Dependencies)

Tại sao lại phải `pip install` những thư viện này? Chúng đóng vai trò gì?

1.  `scikit-surprise` (Surprise):
    *   **Mục đích**: Thư viện Python sinh ra CHỈ để xây dựng Hệ thống Gợi ý (Recommender System).
    *   **Áp dụng**: Nó cung cấp sẵn bộ Reader (đọc file ratings), Dataset builder, và cấu trúc thuật toán `KNNWithMeans` cho Collaborative Filtering, thuật toán `SVD` cho Matrix Factorization. Nếu tự code từ đầu bằng Numpy sẽ mất hàng ngàn dòng code tốn kém bộ nhớ.
2.  `scikit-learn` (Sklearn):
    *   **Mục đích**: Chuyên gia về Học Máy cơ bản (Machine Learning).
    *   **Áp dụng**: Không có hàm nào trong `surprise` xử lý text. Ta dùng `TfidfVectorizer` của sklearn để cân đo đong đếm Text Thể loại phim (Genres), và dùng `cosine_similarity` để tính góc nghiêng hình học giữa 2 bộ phim.
3.  `fastapi` & `uvicorn`:
    *   **Mục đích**: Viết API Server. Nhanh hơn, hiện đại hơn, và hỗ trợ bất đồng bộ (async/await) tốt hơn Flask rất nhiều. `uvicorn` đóng vai trò là "chiếc xe" chở ứng dụng FastAPI chạy trên mạng.
4.  `pyngrok`:
    *   **Mục đích**: Google Colab nằm sâu trong tường lửa của Google. `pyngrok` đào một đường hầm riêng (Tunneling), móc một đường dẫn cấp phát ngẫu nhiên (`xyz.ngrok-free.dev`) đâm xuyên dính thẳng vào Port `8000` nội bộ của Colab để Web ở nhà có thể giao tiếp được!

---

## 🧠 3. Giải Cứu Toán Học & Bóc Tách Code (Thuật Toán)

### A. Phương pháp K-Nearest Neighbors (Dùng cho User/Item-CF)

**Triết lý Toán học:** Đo khoảng cách "sở thích" giữa 2 người bằng độ đo `Cosine`. Thay vì đo đường chim bay (Euclidean) bị ảnh hưởng bởi việc người cho nhiều điểm người cho ít điểm, góc Cosine chiếu 2 người lên không gian vector. Góc càng hẹp (Cosine xấp xỉ 1) -> 2 người càng giống nhau.

**Bóc tách Syntax (Đoạn trích từ `models.py`):**
```python
def train_user_cf(ratings_df, k=20):
    # Dòng 1: Định nghĩa thanh do (Thang điểm 1 đến 5 sao)
    reader = Reader(rating_scale=(1, 5))
    
    # Dòng 2: Nạp DataFrame của Pandas vào cấu trúc C Matrix tối ưu của bộ thư viện Surprise
    data = Dataset.load_from_df(ratings_df[["userId", "movieId", "rating"]], reader)
    trainset = data.build_full_trainset()
    
    # Dòng 3 & 4: Khởi tạo mô hình KNN có hiệu chỉnh sai số trung bình (KNNWithMeans). 
    # Mệnh lệnh: Tìm k=20 người láng giềng gần nhất, dùng độ đo là 'cosine'.
    model = KNNWithMeans(k=k, sim_option={"name": "cosine"})
    model.fit(trainset) # Thực thi việc nhồi ma trận và học
    return model
```

### B. Phương pháp Singular Value Decomposition (SVD)

**Triết lý Toán học:** Trái tim của giải thưởng Netflix. Ma trận đánh giá ban đầu là ma trận R thưa thớt (Sparse - vì đa số chưa xem phim). Hệ thống cưỡng bức rã ma trận R thành `U \times V`. Trong đó `U` là ma trận Đặc Trưng Người Dùng (Latent Factors) và `V` là ma trận Đặc Trưng Phim. Các "Đặc trưng" (Factors) này là các con số vô hình có thể đại diện cho mức độ Hài Hước, Hành Động, Biệt Ly... Hệ thống tìm ra tối ưu số chiều bằng Gradient Descent.

**Bóc tách Syntax:**
```python
def train_svd(ratings_df, n_factors=50, n_epochs=20):
    # Khởi tạo mô hình SVD. Tham số sống còn:
    # n_factors = 50: Yêu cầu thuật toán phải cố tình nén toàn bộ thói quen sở thích của 6000 người 
    #                 lỗ thủng thành đúng 50 trục đặc điểm Toán học.
    # n_epochs = 20: Tự học 20 lần chạy qua lại tập data để tối thiểu hoá sai số (Gradient Descent).
    model = SVD(n_factors=n_factors, n_epochs=n_epochs, random_state=42)
    model.fit(trainset)
    return model
```

### C. Phương pháp Content-Based Filtering (Phân tích cú pháp Text)

**Triết lý Toán học:** User chưa thích bộ phim nào (Tân binh - Cold start)? CF và SVD mù màu. Giải pháp là TF-IDF: Tính toán tần số xuất hiện của một Thể Loại Phim (Ví dụ `Action`). Nếu Phim Marvel chứa chữ Action, Phim DC chứa chữ Action, chúng sẽ được gộp vào chung một cụm vector không gian.

**Bóc tách Syntax:**
```python
class ContentBasedModel:
    def fit(self, movies_df):
        # Biến "Action|Adventure" thành "Action Adventure" cho máy hiểu đây là 2 chữ riêng
        self.movies["genres_clean"] = self.movies["genres"].str.replace("|", " ", regex=False)
        
        # Dùng CountVectorizer bản nâng cấp (Tfidf), bỏ đi các từ vô nghĩa (stop_words='english')
        self.tfidf = TfidfVectorizer(stop_words="english")
        
        # Dựng Ma trận Sparse chứa toàn điểm số của các từ vựng này.
        self.tfidf_matrix = self.tfidf.fit_transform(self.movies["genres_clean"])
        return self
```

### D. Phương pháp Trí Tuệ Lai (Hybrid Blend & Vectorized Scoring)

**Triết lý Toán học:** Không để mất một giọt sức mạnh nào. Thuật toán là sự giao thoa: `Score_Cuối = (0.6 * Điểm Trí Tuệ của SVD) + (0.4 * Điểm Phân tích thể loại của CB)`.

**Bóc tách Syntax Nâng Cao (Giải thích kỹ thuật Vectorized):**
```python
# Trong hàm get_recs_hybrid của file Colab
def get_recs_hybrid(uid, cf_weight=0.6, top_n=50):
    # ... (Trích xuất các bộ phim người dùng đã xem và top 5 phim yêu thích nhất) ...
    
    for mid in unseen: # Duyệt hàng ngàn phim chưa xem
        # Giải mã Điểm số SVD (mức độ thiên vị CF là 60%)
        svd_p = model_svd.predict(uid, mid).est  

        cb_p = 3.0 # Default fallback nếu người dùng chưa có data (Cold Start)
        
        # [KINH ĐIỂN TỐI ƯU HIỆU SUẤT TRONG CODE]
        # Thay vì Loop qua từng phim điểm danh từng vòng For (cực kì chậm chạp),
        # Code sử dụng Cơ chế Numpy Vectorized (Tính toán song song bằng ngôn ngữ C ngầm dưới Python).
        # Lấy ma trận Cosine đúc sẵn đụng ngay trực tiếp vào Mảng Array phim ứng cử (ref_indices).
        if len(ref_indices) > 0 and mid in movie_idx.index:
            sims = cosine_sim[movie_idx[mid], ref_indices]
            cb_p = np.dot(sims, ref_weights) / len(ref_indices) # Lấy trung bình cộng (Dot product chia n)
            
        # Tổng Hoà (Lõi của hệ thống)
        scores[mid] = cf_weight * svd_p + (1 - cf_weight) * cb_p
```

---

## 🚀 4. Đánh giá Cải Tiến & Hướng Mở Rộng Hệ Thống (Future Work)

Dự án hiện tại giải quyết cực tốt bài toán bằng sức mạnh của **Đại số tuyến tính** và **Phân rã Ma trận**. Tuy nhiên, để đáp ứng hàng chục triệu người dùng thực tế, đây là những phần có thể cải tiến:

1. **Neural Collaborative Filtering (Deep Learning):** Recommender System hiện đại sử dụng Mạng Nơ ron (Nueral Networks, Embeddings nhiều tầng) để bắt được các Non-linear Behaviors (hành vi phi tuyến tính bí hiểm) thay vì chỉ sử dụng Dot Product (tuyến tính) như SVD.
2. **Real-time Pipeline (Cấu trúc Stream):** Thay vì Load Full Ma Trận trên Colab (Vốn chậm và sẽ sụp nguồn nếu lên hàng tỷ ratings), hệ thống thật cần triển khai Apache Kafka kết hợp Redis để cập nhật tính toán Real-Time.
3. **Implicit vs Explicit Data:** Hệ thống chúng ta đang lấy dữ liệu Explicit (Lấy Review số sao của người dùng). Trên thực tế 99% dữ liệu ngoài đời là Implicit (Lịch sử Click chuột, Thời gian Dừng màn hình, Mua hàng ảo). Ta có thể mở rộng mô hình ALS (Alternating Least Squares) trên dữ liệu ẩn này.
4. **Deploy Cơ Sở Hạ Tầng Vật Lý:** Dời bỏ Google Colab + Ngrok. Bọc toàn bộ code Python qua một tầng `Docker Container` và Host vĩnh viễn trên Render.com hoặc Amazon AWS để sở hữu tên miền riêng rẻ nhưng mạnh.
