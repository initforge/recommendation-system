# 🎬 Recommender System Project

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

### 2. Web Demo
```bash
cd web_demo
pip install -r requirements.txt
streamlit run app.py
```

### 3. Dataset
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
- **Evaluation**: RMSE, Precision, Recall

## Cấu trúc

```
docs/          ← Tài liệu lý thuyết
notebooks/     ← 8 Colab notebooks
web_demo/      ← Streamlit web app
src/           ← 5 Python modules (shared)
data/          ← Dataset
results/       ← Charts + reports
slides/        ← Slide notes
```
