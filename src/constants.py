# src/constants.py
"""Constants và cấu hình mặc định cho toàn bộ project."""

# ============================================================
# PATHS
# ============================================================
DATA_DIR = "data/raw/ml-1m"
RESULTS_DIR = "results"
CHARTS_DIR = "results/charts"
REPORTS_DIR = "results/reports"

# ============================================================
# DATASET
# ============================================================
RATINGS_COLUMNS = ["userId", "movieId", "rating", "timestamp"]
MOVIES_COLUMNS = ["movieId", "title", "genres"]
USERS_COLUMNS = ["userId", "gender", "age", "occupation", "zipcode"]

# ============================================================
# MODEL CONFIG
# ============================================================
DEFAULT_K = 20               # Số neighbors cho KNN
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
