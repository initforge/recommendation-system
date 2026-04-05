# src/constants.py
"""Constants và cấu hình mặc định cho toàn bộ project."""
from pathlib import Path

# ============================================================
# PATHS
# ============================================================
# Absolute path relative to this file — works regardless of CWD
DATA_DIR = Path(__file__).parent.parent / "data" / "raw" / "ml-1m"
RESULTS_DIR = Path(__file__).parent.parent / "results"
CHARTS_DIR = RESULTS_DIR / "charts"
REPORTS_DIR = RESULTS_DIR / "reports"

# ============================================================
# DATASET
# ============================================================
RATINGS_COLUMNS = ["userId", "movieId", "rating", "timestamp"]
MOVIES_COLUMNS = ["movieId", "title", "genres"]
USERS_COLUMNS = ["userId", "gender", "age", "occupation", "zipcode"]

# ============================================================
# MODEL CONFIG
# ============================================================
DEFAULT_K = 40               # Số neighbors cho KNN (thống nhất với notebooks)
MIN_RATINGS_FOR_CF = 5     # Tối thiểu ratings để dùng CF
DEFAULT_SVD_FACTORS = 50    # Số latent factors cho SVD
DEFAULT_N_EPOCHS = 20       # Số lần train SVD
DEFAULT_SIMILARITY = "cosine"
DEFAULT_TFIDF_MAX_FEATURES = 5000

# ============================================================
# HYBRID
# ============================================================
DEFAULT_CF_WEIGHT = 0.6
HYBRID_SWITCH_THRESHOLD = 5

# ============================================================
# EVALUATION
# ============================================================
TEST_SIZE = 0.2
RANDOM_SEED = 42
CV_FOLDS = 5
PRECISION_AT_K = [5, 10, 20]
RATING_MIN = 1.0
RATING_MAX = 5.0
RATING_DEFAULT = 3.0

# ============================================================
# USER EXPERIENCE
# ============================================================
DEFAULT_TOP_N = 10
MAX_TOP_N = 50
