# Hướng dẫn Deploy Hệ thống Recommender

Kiến trúc hiện tại của dự án sử dụng mô hình **Decoupled (Tách rời Frontend và Backend)** hoàn toàn serverless, không tốn chi phí hosting duy trì máy chủ liên tục như Railway.

## Cấu trúc Hệ thống mới

```
Google Colab          Cloudflare Pages
(Backend)             (Frontend)
   │                      │
notebooks/          frontend/
   │                      │
(Train Model)       (Giao diện tĩnh)
(FastAPI)           (JS/HTML/Tailwind)
   │                      │
   └─────── ngrok ───────┘
          (Tunnel)
```

## Bước 1: Khởi động Backend (Google Colab)

Backend chịu tải toàn bộ các tác vụ nặng: Load Dataset MovieLens 1M, Train thuật toán SVD, tính toán Cosine Similarity, và mở API.

1. Truy cập [Google Colab](https://colab.research.google.com/)
2. Upload file `notebooks/00_full_pipeline.ipynb` lên Colab.
3. Chạy toàn bộ các Cell (`Runtime` > `Run all`).
4. Tại bước cuối cùng của Notebook, hệ thống sẽ yêu cầu cài đặt `ngrok`, `fastapi`, `uvicorn`. Ngrok sẽ tự động tạo một HTTP Tunnel bảo mật.
5. Copy đường link API có dạng: `https://<random-id>.ngrok-free.dev`. 
   > **⚠️ Lưu ý:** Đây là Backend API. Cứ mỗi lần restart Colab, đường link này sẽ thay đổi. Vùi lòng không tắt tab Colab nếu muốn web hoạt động.

## Bước 2: Deploy Frontend (Cloudflare Pages)

Mã nguồn Frontend (giao diện Tĩnh Tâm / Zen) nằm toàn bộ trong thư mục `frontend/`. 

### Yêu cầu:
- Đã cài đặt [Node.js](https://nodejs.org/).

### Lệnh Deploy tự động:
1. Mở Terminal (Command Prompt / PowerShell).
2. Di chuyển vào thư mục `frontend/`:
   ```bash
   cd frontend
   ```
3. Chạy lệnh deploy thông qua công cụ chính thức của Cloudflare (`wrangler`):
   ```bash
   npx wrangler pages deploy . --project-name movie-recsys
   ```
4. Đăng nhập tài khoản Cloudflare của bạn (nếu hệ thống yêu cầu).
5. Quá trình tải code (HTML/JS/CSS) sẽ diễn ra trong khoảng 5 giây.
6. Kết quả sẽ sinh ra link Production: `https://movie-recsys.pages.dev/`.

## Bước 3: Sử dụng Web App

1. Mở link Frontend vừa deploy (ví dụ: `https://movie-recsys.pages.dev/`).
2. Dán link `ngrok` (lấy từ Bước 1 bên Colab) vào ô *Link API Backend*.
3. Bấm **Kết nối ngay**. Từ lúc này, mọi thao tác phân tích phim, tính điểm SVD/Hybrid trên giao diện đều sẽ ping thẳng ngược về Google Colab để xử lý!

---

### Xử lý sự cố (Troubleshooting)

- **Lỗi ngrok-skip-browser-warning:** Code `app.js` đã tích hợp sẵn header `ngrok-skip-browser-warning: "true"` trong lệnh `fetch()` để bỏ qua trang cảnh báo của ngrok bảo vệ tự động.
- **Lỗi CORS (Cross-Origin Resource Sharing):** Trong file Colab (`00_full_pipeline.ipynb`), `CORSMiddleware` của FastAPI đã được setting `allow_origins=["*"]` để cho phép giao diện từ Cloudflare request tới. Đừng sửa dòng này.
- **Tốc độ chậm khởi đầu:** Khách viếng thăm bấm lệnh *Phân Tích & Gợi Ý* lần đầu có thể mất ~1-2 giây để hệ thống warmup, các lần sau model đã cache (nhờ `joblib`) nên tốc độ sẽ trả về ngay trong 100ms.
