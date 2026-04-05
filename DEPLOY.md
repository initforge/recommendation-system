# 🚀 Hướng dẫn Deploy lên Streamlit Cloud

## Bước 1: Clone repo GitHub

Mở **Git Bash / Terminal** (không phải Claude Code):

```bash
# Clone repo về máy
git clone https://github.com/initforge/recommendation-system.git
cd recommendation-system

# Tạo thư mục web_demo (xóa file mặc định nếu có)
rm -f README.md  # hoặc giữ lại README nếu muốn
```

## Bước 2: Copy web_demo vào repo

```bash
# Copy thư mục web_demo từ P:\recommendsystem\web_demo
# (hoặc chạy script bên dưới)
```

**Script tự động copy** — chạy trong PowerShell:
```powershell
# Tạo web_demo trong repo
mkdir recommendation-system\web_demo
mkdir recommendation-system\.streamlit

# Copy app.py
Copy-Item "P:\recommendsystem\web_demo\app.py" "recommendation-system\web_demo\app.py"

# Copy config
Copy-Item "P:\recommendsystem\.streamlit\config.toml" "recommendation-system\.streamlit\config.toml"

# Copy requirements.txt
Copy-Item "P:\recommendsystem\requirements.txt" "recommendation-system\requirements.txt"
```

## Bước 3: Push lên GitHub

```bash
cd recommendation-system
git add .
git commit -m "feat: Movie Recommender web demo with 4 algorithms

- SVD (Matrix Factorization)
- Item-Based CF (KNN cosine)
- Content-Based (TF-IDF + genres)
- Hybrid (SVD + Content weighted)

- Auto-download MovieLens 1M on first run
- Streamlit Cloud compatible"
git push -u origin main
```

## Bước 4: Deploy lên Streamlit Cloud

```
1. Mở: https://streamlit.io/cloud
2. Sign in với GitHub account
3. Click "New app"
4. Repository: initforge/recommendation-system
5. Branch: main
6. Main file path: web_demo/app.py
7. Click "Deploy!"
```

## Bước 5: (Tuỳ chọn) Upload full project

```bash
# Sau khi web_demo deploy xong, push toàn bộ project:
cd recommendation-system
git checkout -b main

# Copy tất cả files
cp -r P:/recommendsystem/src/ ./src/
cp -r P:/recommendsystem/docs/ ./docs/
cp -r P:/recommendsystem/notebooks/ ./notebooks/
cp -r P:/recommendsystem/slides/ ./slides/
cp P:/recommendsystem/README.md ./README.md
cp P:/recommendsystem/.gitignore ./.gitignore
cp P:/recommendsystem/requirements.txt ./requirements.txt

# Edit .gitignore để không upload data
# (data đã được app.py download tự động)
echo "data/" >> .gitignore

git add .
git commit -m "docs: full project with notebooks, src, docs, slides"
git push origin main
```

## ⚠️ Lưu ý quan trọng

### Dataset
- Dataset MovieLens 1M **KHÔNG commit lên git** (1M rows = ~25MB compressed)
- `app.py` tự động download dataset khi app khởi động (lần đầu ~10s)
- Dataset được lưu trong temp directory của Streamlit Cloud

### Requirements
```txt
# requirements.txt cho web_demo (đã copy ở bước 2)
scikit-surprise>=1.1.3
scikit-learn>=1.3.0
pandas>=2.0.0
numpy>=1.24.0
streamlit>=1.28.0
```

### Sau khi deploy
- URL sẽ có dạng: `https://<username>-recommendation-system.streamlit.app`
- Share link này với Professor để demo!
- Không cần server — hoàn toàn miễn phí với Streamlit Cloud
