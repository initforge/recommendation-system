# Recommender System Project

Hệ thống gợi ý phim sử dụng **5 thuật toán** với dataset **MovieLens 1M**.

## Thư viện

- **Docs**: [docs/00-README.md](docs/00-README.md) — Mục lục tài liệu
- **Slides**: [slides/notes.md](slides/notes.md) — Notes cho slide trình bày

## Bắt đầu

### 1. Colab Notebooks
```bash
# Mở Google Colab → Upload notebook từ notebooks/
# Hoặc clone repo → Upload lên Colab
```

### 2. Backend (Google Colab / FastAPI + ngrok)
```bash
# Mở notebooks/00_full_pipeline.ipynb trên Google Colab
# Chạy tất cả các cell. Cell cuối cùng sẽ khởi tạo server FastAPI và ngrok tunnel.
# Backend sẽ cung cấp một đường link kiểu `https://xyz.ngrok-free.dev`.
```

### 3. Frontend (Giao diện Tĩnh Tâm - Cloudflare Pages)
```bash
# Giao diện được deploy tĩnh hoàn toàn serverless trên Cloudflare Pages.
# Truy cập: https://movie-recsys.pages.dev/
# Dán link ngrok từ Bước 2 vào ô kết nối để sử dụng.
# Để build / deploy code mới:
cd frontend
npx wrangler pages deploy . --project-name movie-recsys
```

### 4. Dataset
```bash
# Tải MovieLens 1M
wget https://files.grouplens.org/datasets/movielens/ml-1m.zip
unzip ml-1m.zip -d data/raw/
```

## 5 Thuật toán

| # | Thuật toán | Mô tả |
|---|-----------|--------|
| 1 | User-Based CF | Tìm user giống nhau → Gợi |
| 2 | Item-Based CF | Tìm phim giống nhau → Gợi |
| 3 | SVD | Matrix Factorization — Tìm latent factors |
| 4 | Content-Based | TF-IDF + Genres similarity |
| 5 | Hybrid | SVD + Content-Based (weighted) |

## Thêm

- **Context Analysis**: Temporal (timestamp) + Demographics (gender, age, occupation)
- **Evaluation**: RMSE, MAE, Precision@K, Recall@K, MAP@K, NDCG@K

## Cấu trúc

```
docs/          ← Tài liệu lý thuyết
notebooks/     ← 8 Colab notebooks + 1 full pipeline notebook
frontend/     ← Giao diện tĩnh (HTML/CSS/JS Tailwind) - Cloudflare Pages
  ├── index.html       ← Màn hình giao diện (Zen Design)
  └── app.js           ← Logic kết nối ngrok API
src/           ← 5 Python modules (shared)
data/          ← Dataset
results/       ← Charts + reports (JSON)
slides/        ← Slide notes
```

## Chạy Evaluation (Export JSON)

Mở `notebooks/00_full_pipeline.ipynb` trên Colab và chạy toàn bộ:
- Export tất cả kết quả ra `results/reports/*.json`
- Kết quả sẽ tự động load lên web demo khi deploy
