# 📋 Mục lục — Recommender System Project

## 📚 Tài liệu lý thuyết
1. [01-gioi-thieu.md](./01-gioi-thieu.md) — Recommender System là gì?
2. [02-tai-sao-chon-phim.md](./02-tai-sao-chon-phim.md) — Tại sao dùng phim + MovieLens
3. [02b-chi-tiet-dataset.md](./02b-chi-tiet-dataset.md) — Chi tiết từng file trong dataset
4. [03-thuat-toan.md](./03-thuat-toan.md) — 5 thuật toán + code mẫu (User CF, Item CF, SVD, Content-Based, Hybrid)
5. [04-danh-gia-metrics.md](./04-danh-gia-metrics.md) — RMSE, Precision, Recall
6. [05-context-features.md](./05-context-features.md) — Temporal & Demographics Analysis
7. [06-project-structure.md](./06-project-structure.md) — Cấu trúc dự án, clean code
8. [07-implementation-roadmap.md](./07-implementation-roadmap.md) — Lộ trình code từng bước

---

## Thứ tự đọc

```
Bước 1: Đọc 01, 02, 02b          → Hiểu bài toán + dataset
Bước 2: Đọc 03                    → Hiểu 5 thuật toán
Bước 3: Đọc 04                     → Hiểu cách đánh giá
Bước 4: Đọc 05                     → Hiểu context features
Bước 5: Đọc 06, 07               → Hiểu tổ chức + lộ trình
```

---

## Tech Stack

```
Development:  Google Colab (.ipynb)
Web Demo:     Cloudflare Pages + FastAPI (ngrok)
ML Library:   scikit-learn, scikit-surprise
Data:         pandas, numpy
Visualize:    matplotlib, seaborn
```

---

## 5 thuật toán làm trong đồ án

```
1. User-Based CF      — Collaborative Filtering (user similarity)
2. Item-Based CF      — Collaborative Filtering (item similarity)
3. SVD              — Matrix Factorization (latent factors)
4. Content-Based    — TF-IDF + Genres similarity
5. Hybrid           — SVD + Content-Based (weighted)

+ Context Analysis  — Temporal (timestamp) + Demographics (gender, age, occupation)
```

---

## Cấu trúc project

```
recommend-system/
├── docs/           ← Tài liệu (đọc hiểu)
├── notebooks/      ← 8 Colab notebooks
├── frontend/       ← Giao diện Web (HTML/JS/CSS)
├── src/            ← 5 Python modules (shared)
│   ├── constants.py
│   ├── data_loader.py
│   ├── models.py
│   ├── evaluation.py
│   └── context.py
├── data/raw/       ← MovieLens 1M dataset
├── results/        ← Charts + reports
└── slides/         ← Presentation
```

---

## Lộ trình 10 tuần

```
Tuần 1-2: Setup + EDA
Tuần 3-4: User CF + Item CF
Tuần 5:   SVD + Content-Based
Tuần 6:   Hybrid
Tuần 7:   Context Analysis
Tuần 8:   Evaluation + So sánh
Tuần 9:   Web Demo + Deploy
Tuần 10:  Slide + Báo cáo + Trình bày
```
