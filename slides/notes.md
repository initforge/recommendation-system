# 🎬 Slide Notes — Hướng Dẫn Trình Bày Recommender System

> **Mục tiêu của tài liệu:** Document này không chỉ là kịch bản thuyết trình, mà còn mang tính giảng giải, dẫn dắt từng yếu tố. Bạn sẽ dùng tài liệu này để giải thích cho người nghe (hoặc giám khảo) hiểu được TẠI SAO chúng ta làm thế này, CODE đằng sau hoạt động ra sao, và THUẬT TOÁN tính toán những gì.

---

## 1. MỞ ĐẦU: VẤN ĐỀ VÀ GIẢI PHÁP (Slide 1-2)

**Dẫn dắt:**
"Chào mọi người. Khi chúng ta mở Netflix hay Spotify, làm sao phần mềm biết chúng ta muốn xem gì giữa hàng triệu lựa chọn? Đó là nhờ **Recommender System** (Hệ thống gợi ý). Hôm nay, mình sẽ trình bày cách xây dựng một hệ thống như vậy từ con số 0."

**Giải thích Data (MovieLens):**
"Để làm được việc này, chúng ta cần Data. Dự án sử dụng tập dữ liệu **MovieLens 1M** (1 triệu đánh giá, 6040 người dùng, 3706 bộ phim).
- Tại sao chọn MovieLens? Vì nó là 'tiêu chuẩn vàng' trong nghiên cứu AI cho Recommender System.
- Trong thực tế, dữ liệu này là một **Ma trận Điểm số (Rating Matrix)**. Hàng là Người dùng, Cột là Phim. Tuy nhiên, 95.5% ô trong ma trận này bị trống (Sparsity) vì không ai có thể xem hết 3700 bộ phim. Bài toán của AI là: **Điền vào các ô trống đó!**"

---

## 2. GIẢI MÃ CÁC THUẬT TOÁN (Slide 3-8)

**Dẫn dắt:**
"Làm sao để đoán được điểm số cho các ô trống? Dự án của chúng ta đã code và thử nghiệm 4 thuật toán khác nhau."

### A. Collaborative Filtering (User-Based & Item-Based)
- **Giải thích Logic:** "Thuật toán này hoạt động dựa trên nguyên lý 'Hành vi đám đông'. Nếu User A thích phim X, Y, Z và User B cũng thích phim X, Y, thì khả năng cao B cũng sẽ thích Z. Hoặc ngược lại, nếu Hành động X và Hành động Y thường được xem cùng nhau, chúng ta gán chúng là tương đồng (Item-Based)."
- **Giải thích Code:** "Trong code (notebook `02_user_cf.ipynb`), chúng ta dùng thuật toán `KNNBasic` từ thư viện `Surprise`. Nó tính toán **Cosine Similarity** (độ tương đồng Cosine) giữa các vector người dùng để tìm ra 'Cụm láng giềng' gần nhất."

### B. Matrix Factorization (SVD)
- **Giải thích Logic:** "Đây là thuật toán từng giành chiến thắng giải Netflix 1 triệu đô. Nó không dựa vào bề mặt, mà đi sâu tìm **'Latent Factors' (Các nhân tố ẩn)**. Ví dụ: Máy tính không biết thể loại 'Hành động', nhưng nó tự tìm ra một trục toán học mà phim Die Hard và Terminator nằm rất gần nhau."
- **Giải thích Code:** "Chúng ta dùng model SVD. Code chia ma trận khổng lồ ra làm 2 ma trận nhỏ (Ma trận User-Feature và Ma trận Movie-Feature). Khi nhân 2 ma trận này lại, ta ra được điểm số dự đoán rất chính xác cho mọi ô trống."

### C. Content-Based (Lọc theo Nội dung)
- **Giải thích Logic:** "Thay vì nhìn vào người khác, thuật toán này nhìn trực tiếp vào BỘ PHIM. Giống như: Bạn thích phim 'Hành Động, Viễn Tưởng', máy sẽ lôi từ kho ra các phim có đúng nhãn 'Hành Động, Viễn Tưởng'."
- **Giải thích Code:** "Trong `05_content_based.ipynb`, chúng ta áp dụng NLP cơ bản: sử dụng `TfidfVectorizer` để phân tích các Text thể loại (genres) thành các ma trận số học, sau đó tính khoảng cách vector để tìm phim giống nhau."

### D. Hybrid Blend (Trí Tuệ Lai) - *Lõi Đề Xuất Cuối Cùng*
- **Giải thích:** "Tại sao phải bầu chọn 1? Chúng ta gộp lại! SVD thì dự đoán rating giỏi, Content-Based thì bù đắp được khi người dùng quá mới (Cold-start). Lõi hệ thống (`src/models.py`) thực hiện thao tác cộng trọng số: 
  `ĐIỂM_CHUNG = (0.6 * ĐIỂM_SVD) + (0.4 * ĐIỂM_CONTENT)`"

---

## 3. GIẢI THÍCH KIẾN TRÚC HỆ THỐNG (Backend & Frontend)

**Dẫn dắt:**
"Một mô hình AI nằm trong Jupyter Notebook thì chưa thể gọi là sản phẩm. Chúng ta đã tách hệ thống làm 2 mảng cực kì độc lập (Decoupled Architecture), bám sát thực tế chuẩn doanh nghiệp."

### A. Phía Backend (Bộ Não)
- "Nằm toàn bộ trên **Google Colab** để tận dụng RAM và năng lực tính toán miễn phí.
- Thay vì xuất File CSV, chúng ta dựng thẳng một máy chủ **FastAPI** ngay trong Colab (`00_full_pipeline.ipynb`).
- Hàm `recommend` bằng Python nhận tham số `User_ID`, Load mô hình SVD đã train, tính toán điểm số và gói gọn toàn bộ kết quả vào chuẩn JSON.
- Dùng `ngrok` để tạo một đường hầm (tunnel), thông ống từ máy chủ Colab xuất ra mạng Internet toàn cầu."

### B. Phía Frontend (Giao Diện)
- "Chúng ta dùng **Cloudflare Pages** hosting tĩnh hoàn toàn miễn phí, kiến trúc serverless với giao diện thiết kế theo phong cách Zen (Tĩnh Tâm), UI mộc mạc tối giản.
- Bằng HTML/Tailwind và JS thuần (`app.js`), chúng ta lập trình luồng gọi lệnh `fetch()` đến API ngrok.
- Giao diện không có Fake Image để chèo lái, mà chỉ hiện trung thực kết quả phân tích dữ liệu: **Tên phim và Điểm số dự đoán AI (Score)**. Chữ càng rõ, điểm AI trả về càng nổi bật, chứng tỏ độ sâu của thuật toán tính toán!"

---

## 4. TỔNG KẾT VÀ DEMO
- **Mời Trải nghiệm:** "Mời ban giám khảo/khán giả truy cập đường link Cloudflare tĩnh của chúng ta (`https://movie-recsys.pages.dev`). Sau khi điền địa chỉ API do Google Colab cung cấp sáng nay, chúng ta input thử User ID `10` và chọn thuật toán Hybrid."
- **Giải thích Kết quả Demo:** "Như mọi người thấy, hệ thống KHÔNG hề trả về một danh sách cứng ngắc, mà nó đang gọi trực tiếp tới Colab. Colab nhận lệnh, model SVD tính toán nội suy với hàng ngàn phim, và trả về top 10 kèm mức điểm dự đoán (AI Score: ví dụ 4.25). 4.25 nghĩa là AI tự tin dự đoán User 10 sẽ rate phim này 4.25/5 sao!"

---

> **Note cho người trình bày:** Hãy nhớ, điểm ăn tiền nhất toàn bộ buổi thuyết trình là việc bạn giải thích rõ "Điểm dự đoán (Score) kia sinh ra từ đâu?" -> *Sinh ra từ việc nhân ma trận SVD kết hợp text nhãn Content-based, chứ không hề có sẵn trong CSDL.*
