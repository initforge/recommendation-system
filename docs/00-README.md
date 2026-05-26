# Recommender System - Mục lục tài liệu

Tài liệu trong repo có hai nhóm:

- **Nhóm học thuật/giải thích**: đọc để hiểu recommender system, MovieLens, thuật toán, metrics và context analysis.
- **Nhóm current-state**: đọc để biết chính xác source hiện đang chạy như thế nào, API nằm ở đâu, frontend nối backend ra sao và rủi ro vận hành là gì.

## Current-State

| File | Nội dung |
|---|---|
| [08-current-technical-specification.md](./08-current-technical-specification.md) | Đặc tả source hiện tại: modules, notebooks, API, frontend, deploy topology, rủi ro. |
| [../DEPLOY.md](../DEPLOY.md) | Cách chạy backend Colab/FastAPI/ngrok và deploy frontend Cloudflare Pages. |

## Nền tảng lý thuyết

| File | Nội dung |
|---|---|
| [01-gioi-thieu.md](./01-gioi-thieu.md) | Recommender System là gì và bài toán lọc thông tin. |
| [02-tai-sao-chon-phim.md](./02-tai-sao-chon-phim.md) | Vì sao chọn phim và MovieLens cho đồ án. |
| [02b-chi-tiet-dataset.md](./02b-chi-tiet-dataset.md) | Cấu trúc `ratings.dat`, `movies.dat`, `users.dat`. |
| [03-thuat-toan.md](./03-thuat-toan.md) | User CF, Item CF, SVD, Content-Based, Hybrid. |
| [04-danh-gia-metrics.md](./04-danh-gia-metrics.md) | RMSE, MAE, Precision@K, Recall@K, MAP@K, NDCG@K. |
| [05-context-features.md](./05-context-features.md) | Temporal và demographics analysis. |
| [06-project-structure.md](./06-project-structure.md) | Cấu trúc thư mục và module. |
| [07-implementation-roadmap.md](./07-implementation-roadmap.md) | Lộ trình triển khai notebook/pipeline/frontend/slides. |

## Thứ tự đọc khuyến nghị

```text
1. README-vi.md hoặc README.md
2. docs/08-current-technical-specification.md
3. docs/02b-chi-tiet-dataset.md
4. docs/03-thuat-toan.md
5. docs/04-danh-gia-metrics.md
6. docs/05-context-features.md
7. DEPLOY.md nếu cần chạy demo web
```

## Tech Stack

| Layer | Stack |
|---|---|
| Data | MovieLens 1M, pandas, NumPy |
| Recommendation | scikit-surprise, scikit-learn, SciPy |
| Algorithms | KNNWithMeans, SVD, TF-IDF, cosine similarity, weighted hybrid |
| Evaluation | RMSE, MAE, Precision@K, Recall@K, F1@K, MAP@K, NDCG@K |
| Runtime demo | Google Colab, FastAPI, uvicorn, ngrok |
| Frontend | Static HTML, Tailwind CDN, vanilla JavaScript |
| Hosting | Cloudflare Pages for frontend, Colab runtime for backend |

## Cấu trúc chính

```text
src/                 Python modules dùng chung
notebooks/           8 notebooks từng bước + 00_full_pipeline.ipynb
frontend/            Static web client nối tới ngrok API
docs/                Tài liệu học thuật và đặc tả
data/raw/ml-1m/      MovieLens 1M dataset
results/             Export charts/reports từ notebooks
slides/              Presentation, notes, diagrams, formula images
```
