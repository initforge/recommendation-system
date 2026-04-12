# Presentation Script: Movie Recommender System

**Team Distribution & Presentation Flow:**
- **Speaker 1 (P1):** Introduction & Dataset Deep-Dive (Slides 1-8)
- **Speaker 2 (P2):** Algorithms Taxonomy & Collaborative Filtering (Slides 9-12)
- **Speaker 3 (P3):** Content-Based, Hybrid & Evaluation Metrics (Slides 13-17)
- **Speaker 4 (P4):** Context Features, System Architecture & Live Demo (Slides 18-22)

---

# SPEAKER 1: Introduction & Dataset Deep-Dive

## Slide 1: Title Slide
**English Script:** Good morning, everyone. Welcome to our presentation. Today, our team is excited to introduce our Movie Recommender System. We will walk you through how we leverage Collaborative Filtering, SVD, and Hybrid approaches to suggest the perfect movie, concluding with a live web demo.
> **Giải thích (Vietnamese):** Chào buổi sáng mọi người. Chào mừng đến với bài thuyết trình của nhóm. Hôm nay, chúng tôi rất hào hứng giới thiệu Hệ thống Gợi ý Phim. Chúng tôi sẽ đi qua cách áp dụng Lọc cộng tác, SVD và Phương pháp lai để gợi ý bộ phim hoàn hảo, và cuối cùng là một bản demo web trực tiếp.

## Slide 2: What is a Recommender System?
**English Script:** To start, what exactly is a recommender system? Simply put, it's an intelligent algorithm designed to predict user preferences. With 800 million products on platforms like Shopee, users face choice overload. A recommender acts as an AI filter to help them navigate this massive catalog efficiently.
> **Giải thích:** Bắt đầu nhé, hệ thống gợi ý chính xác là gì? Hiểu đơn giản, đây là một thuật toán thông minh thiết kế để dự đoán sở thích. Với lượng hàng hóa khổng lồ trên Shopee, người dùng bị quá tải lựa chọn. Hệ thống gợi ý đóng vai trò là một bộ lọc AI giúp họ duyệt danh mục khổng lồ này hiệu quả.

## Slide 3: Why Movies? Why MovieLens?
**English Script:** Among various domains, testing algorithms on movies is ideal. And there's no better dataset than MovieLens. It's the gold standard in recommender system research. We specifically chose the MovieLens 1M dataset to balance between computational load and sufficient data sparsity.
> **Giải thích:** Trong các lĩnh vực, kiểm tra thuật toán trên phim ảnh là lý tưởng nhất. Và không có bộ dữ liệu nào chuẩn hơn MovieLens. Nó là tiêu chuẩn vàng trong nghiên cứu. Nhóm chọn bộ 1 triệu đánh giá (1M) để cân bằng khối lượng tính toán và độ thưa thớt của dữ liệu.

## Slide 4: MovieLens 1M — Overview
**English Script:** Looking closer at our data, it comprises roughly 1 million ratings. But here is the catch: the matrix of 6,000 users by 3,800 movies is still 95.5% empty. Our engine's target is to predict the missing 95.5% accurately.
> **Giải thích:** Nhìn sát hơn vào dữ liệu, nó gồm khoảng 1 triệu lượt đánh giá. Nhưng mấu chốt là: ma trận 6,000 user và 3,800 phim vẫn trống 95.5%. Mục tiêu của máy học là dự đoán 95.5% chỗ trống đó một cách chính xác.

## Slide 5: Dataset Details: What's Inside?
**English Script:** The dataset is split into 3 files. `ratings.dat` captures user scores. `movies.dat` holds titles and 18 film genres. `users.dat` gives us demographics like age and 21 occupation categories. Each file serves a unique purpose for our different algorithms.
> **Giải thích:** Tập dữ liệu chia làm 3 file. `ratings.dat` lưu điểm số. `movies.dat` lưu tiêu đề và 18 thể loại phim. `users.dat` cho chúng ta nhân khẩu học như độ tuổi và 21 ngành nghề. Mỗi file phục vụ một mục đích riêng cho các thuật toán khác nhau.

## Slide 6: Data Flow: File → Algorithm
**English Script:** This diagram illustrates our data flow. The ratings matrix feeds directly into our Collaborative Filtering and SVD models. The movies' metadata drives our Content-Based engine. Finally, user demographics are processed for Context-Aware features. 
> **Giải thích:** Sơ đồ này minh họa luồng dữ liệu. Ma trận đánh giá được dùng trực tiếp cho Lọc cộng tác và SVD. Siêu dữ liệu phim vận hành cỗ máy Content-Based. Cuối cùng, nhân khẩu học được xử lý cho các tính năng Ngữ cảnh (Context-Aware).

## Slide 7: Setup & EDA Pipeline
**English Script:** Our pipeline is built on Google Colab using Python and Pandas. We load the data, handle the custom double-colon separators, and prepare the dataframes. Initial stats show an average rating of 3.58 out of 5 across the entire platform.
> **Giải thích:** Pipeline của nhóm được xây trên Google Colab dùng Python và Pandas. Chúng tôi tải dữ liệu, xử lý dấu phẩy hai chấm (::), và chuẩn bị các bảng dữ liệu. Thống kê ban đầu cho thấy điểm đánh giá trung bình là 3.58/5 trên toàn hệ thống.

## Slide 8: EDA Key Findings
**English Script:** Our Exploratory Data Analysis revealed interesting behaviors. 4-star ratings are the most common, making up 34% of all reviews. We also visualized the sparsity matrix, confirming a classic long-tail distribution where a few popular movies get the most attention while thousands remain barely rated.
> **Giải thích:** Phân tích Dữ liệu Khám phá (EDA) tiết lộ nhiều hành vi thú vị. 4 sao là mức điểm phổ biến nhất, chiếm 34%. Chúng tôi cũng trực quan hóa độ thưa thớt, xác nhận phân bố đuôi dài cổ điển (long-tail) - nơi vài phim nổi tiếng hút phần lớn lượt xem, trong khi hàng ngàn phim khác hiếm khi được chú ý.

---

# SPEAKER 2: Algorithms Taxonomy & Collaborative Filtering

## Slide 9: Algorithm Taxonomy
**English Script:** Moving on to the algorithms. I will cover the core of our system. Our taxonomy is divided into three branches: Collaborative Filtering—which includes User, Item, and SVD; Content-Based Filtering; and a Hybrid approach that fuses them all together.
> **Giải thích:** Sang phần thuật toán. Tôi sẽ nói về lõi hệ thống. Phân loại thuật toán của nhóm chia làm 3 nhánh: Lọc cộng tác (gồm User, Item, và SVD); Lọc dựa trên nội dung; và phương pháp Lai kết hợp tất cả lại.

## Slide 10: User-Based Collaborative Filtering
**English Script:** Our first model is User-Based CF. The principle is simple: "similar users like similar movies". We calculate the Cosine Similarity between users to find nearest neighbors, then compute a weighted average to predict the rating. However, it's slow at scale and suffers from the cold-start problem.
> **Giải thích:** Mô hình thứ nhất là User-Based CF. Nguyên lý rất đơn giản: "người dùng giống nhau thích phim giống nhau". Nhóm dùng độ tương đồng Cosine để tìm láng giềng gần nhất, rồi tính trung bình có trọng số để dự đoán. Tuy nhiên, nó chạy chậm khi mở rộng và bị lỗi cold-start (với user mới).

## Slide 11: Item-Based Collaborative Filtering
**English Script:** To improve stability, we implemented Item-Based CF, similar to the algorithm popularized by Amazon. Instead of matching users, we match items. If two movies are frequently rated highly by the same group of people, they are similar. This significantly stabilizes the neighbor matrix.
> **Giải thích:** Để ổn định hơn, nhóm cài đặt Item-Based CF, thuật toán nổi tiếng nhờ Amazon. Thay vì ghép cặp User, ta ghép cặp Phim (Item). Nếu 2 phim thường được chấm cao bởi cùng một tệp người dùng, chúng tương đồng. Điều này giúp ma trận láng giềng ổn định hơn hẳn.

## Slide 12: SVD — Matrix Factorization
**English Script:** Our most accurate traditional model is Singular Value Decomposition, or SVD. We decompose the giant rating matrix into latent factors. By learning 50 hidden characteristics through Stochastic Gradient Descent, SVD predicts the missing interaction points. It achieved the best RMSE score in our tests.
> **Giải thích:** Mô hình chuẩn xác nhất là SVD (Phân rã ma trận). Chúng tôi phân tích ma trận khổng lồ thành ma trận nhân tố ẩn (latent). Bằng cách học 50 đặc trưng ẩn thông qua thuật toán SGD, SVD dự đoán được điểm tương tác còn thiếu và đạt được sai số RMSE nhỏ nhất trong các thử nghiệm.

---

# SPEAKER 3: Content-Based, Hybrid & Evaluation Metrics

## Slide 13: Content-Based Filtering
**English Script:** Hello everyone. I will introduce our Content-Based model. Unlike CF, this doesn't rely on neighbors. Instead, we use TF-IDF vectors on the movie genres and tags. This completely solves the cold-start problem for new movies, because we can recommend films purely based on their meta-content.
> **Giải thích:** Chào mọi người. Tôi sẽ giới thiệu mô hình Content-Based. Khác với CF, thuật toán này không dựa vào láng giềng. Thay vào đó, nhóm dùng vector TF-IDF trên thể loại phim và tag. Nó giải quyết triệt để lỗi cold-start cho phim mới, vì ta có thể gợi ý chỉ dựa trên siêu dữ liệu của bản thân phim đó.

## Slide 14: Hybrid System (SVD + Content-Based)
**English Script:** To get the best of both worlds, we built a Hybrid System. It predicts a weighted score using 60% SVD and 40% Content-Based scores. If SVD lacks data, the Content-Based model acts as a safety net. This cascade strategy ensures high accuracy without sacrificing diversity.
> **Giải thích:** Để vẹn cả đôi đường, nhóm lập ra Hệ thống Lai (Hybrid). Nó dự đoán bằng trọng số: 60% từ SVD và 40% từ Content-Based. Nếu SVD thiếu dữ liệu, Content-Based sẽ làm tấm lưới an toàn. Chiến lược này đảm bảo độ chính xác cao mà không làm mất đi tính đa dạng.

## Slide 15: Why Evaluate? Two Types of Metrics
**English Script:** How do we prove our system works? We rely on rigorous evaluation, splitting data 80/20. We track two categories of metrics: Prediction metrics, which measure how close our predicted rating is to the real score, and Ranking metrics, which evaluate whether the right movies show up at the top of the list.
> **Giải thích:** Làm sao chứng minh hệ thống hoạt động tốt? Chúng tôi đánh giá nghiêm ngặt, chia dữ liệu tỉ lệ 80/20. Nhóm sử dụng 2 nhóm độ đo: Prediction metric (đo dự đoán điểm có sát thực tế không), và Ranking metric (đo xem xếp hạng danh sách phim gợi ý có đúng không).

## Slide 16: Prediction Metrics: RMSE & MAE
**English Script:** For prediction, our primary metric is RMSE (Root Mean Square Error). It heavily punishes large prediction errors. In our final tuning, the SVD model hit an impressive RMSE of 0.87, outperforming the fundamental Collaborative models which sat around 0.92.
> **Giải thích:** Với việc dự đoán, độ đo chính là RMSE (sai số toàn phương trung bình). Nó trừng phạt nặng các sai số lớn. Cuối cùng, mô hình SVD đạt mức RMSE ấn tượng là 0.87, vượt trội so với các mô hình láng giềng cơ bản (khoảng 0.92).

## Slide 17: Ranking Metrics: Precision, Recall, MAP, NDCG
**English Script:** Prediction isn't everything; top-ranking is what users see. We measure Precision and MAP at K. Our Content-based model achieved a Precision at 10 of 0.116. While numerically small, for a sparse matrix of 3,800 movies, effectively placing relevant movies in the top 10 proves our algorithm's robust retrieval capability.
> **Giải thích:** Đo điểm dự đoán không là chưa đủ; xếp hạng top mới là thứ user nhìn thấy. Chúng tôi đo Precision và MAP ở top K. Mô hình Content-Based đạt Precision@10 là 0.116. Dù con số nhỏ, nhưng với ma trận thưa 3,800 phim, việc đặt đúng phim liên quan lên top 10 chứng minh năng lực truy xuất rất tốt.

---

# SPEAKER 4: Context Features, System Architecture & Demo

## Slide 18: Temporal Analysis
**English Script:** Let's look deeper into Context-Aware features. By extracting timestamps, we performed a temporal analysis. Interestingly, users give slightly higher ratings on weekends, and peak engagement occurs between 9 PM and 11 PM. This context allows dynamic boosting of recommendations on weekend nights.
> **Giải thích:** Cùng nhìn sâu hơn vào dữ liệu ngữ cảnh. Bằng cách trích xuất thời gian (timestamp), chúng tôi phân tích hành vi theo thời gian. Khá thú vị, user chấm điểm nhỉnh hơn vào cuối tuần, và tương tác đỉnh điểm từ 9-11h tối. Ngữ cảnh này cho phép đẩy mạnh gợi ý vào các tối cuối tuần.

## Slide 19: Demographics Analysis
**English Script:** Demographics add another layer. We found female users rate slightly higher on average (about +0.06 stars). Furthermore, genre preferences split cleanly: Action and Sci-Fi dominate men's choices, while Drama and Romance rank top for women. This acts as our primary fallback strategy for brand-new users.
> **Giải thích:** Nhân khẩu học thêm một lớp thông tin nữa. Nhóm phát hiện nam/nữ có sự chênh lệch (nữ chấm cao hơn nam 0.06 sao). Hơn nữa, nhánh sở thích khá tách biệt: Nam thích Hành động/Viễn tưởng, Nữ ưu tiên Tâm lý/Tình cảm. Đây là phương án back-up hoàn hảo cho người dùng mới tinh.

## Slide 20: Project Structure
**English Script:** Architecturally, our codebase is strictly modularized. We separated Data Loaders, Model definitions, Evaluation Scripts, and Context Analyzers into pure Python functions in our `src` folder, while keeping experimentation inside Jupyter Notebooks.
> **Giải thích:** Về mặt kiến trúc, code được module hóa nghiêm ngặt. Tách biệt từ tải dữ liệu, tới mô hình, hàm lượng giá và phân tích ngữ cảnh thành các hàm Python gọn gàng trong thư mục `src`, trong khi tiến hành thử nghiệm bên trong Jupyter Notebook.

## Slide 21: System Architecture: Colab + Cloudflare
**English Script:** For deployment, we utilize a decoupled architecture. A FastAPI backend runs the heavy machine learning code on Google Colab, exposed to the web via an ngrok tunnel. Our frontend, the sleek "Zen UI", is deployed statically on Cloudflare Pages, calling our Colab backend seamlessly.
> **Giải thích:** Khi triển khai, nhóm dùng kiến trúc tách rời (decoupled). Backend chạy FastAPI xử lý máy học trên Google Colab, được công khai bằng ngrok tunnel. Ở phía Frontend là giao diện "Zen UI" hiện đại được triển khai trên Cloudflare Pages, lấy dữ liệu trực tiếp từ Colab.

## Slide 22: Live Demo & Future Work
**English Script:** This brings us to our live demo. You can scan the QR code or visit our link to experience the Zen interface yourself. Moving forward, we aim to implement Neural Collaborative Filtering and Dockerize our backend for production. Thank you for listening, and we are now open to any questions!
> **Giải thích:** Và bây giờ là phần demo trực tiếp. Bạn có thể quét mã QR hoặc vào link để trải nghiệm giao diện. Sắp tới, nhóm hướng đến việc tích hợp Neural Collaborative Filtering (mạng nơ-ron) và đóng gói Backend lên Docker để chạy production. Cảm ơn vì đã lắng nghe và mời thầy/cô đặt câu hỏi!
