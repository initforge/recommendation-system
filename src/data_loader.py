# src/data_loader.py
"""Load và preprocess MovieLens dataset."""
import pandas as pd
from pathlib import Path
from .constants import DATA_DIR, RATINGS_COLUMNS, MOVIES_COLUMNS, USERS_COLUMNS


def load_movielens(data_path=None):
    """
    Load MovieLens 1M dataset.

    Args:
        data_path: Đường dẫn đến thư mục ml-1m.
                   Mặc định: data/raw/ml-1m

    Returns:
        tuple: (ratings_df, movies_df, users_df)
    """
    base = Path(data_path) if data_path else Path(DATA_DIR)

    ratings = pd.read_csv(
        base / "ratings.dat",
        sep="::",
        engine="python",
        names=RATINGS_COLUMNS
    )
    movies = pd.read_csv(
        base / "movies.dat",
        sep="::",
        engine="python",
        names=MOVIES_COLUMNS,
        encoding="latin-1"
    )
    users = pd.read_csv(
        base / "users.dat",
        sep="::",
        engine="python",
        names=USERS_COLUMNS
    )
    return ratings, movies, users


def get_temporal_features(ratings_df):
    """Trích xuất temporal features từ timestamp."""
    df = ratings_df.copy()
    df["datetime"] = pd.to_datetime(df["timestamp"], unit="s")
    df["year"] = df["datetime"].dt.year
    df["month"] = df["datetime"].dt.month
    df["dayofweek"] = df["datetime"].dt.dayofweek
    df["hour"] = df["datetime"].dt.hour
    return df


def get_demographics_features(users_df):
    """Map demographics codes thành labels."""
    df = users_df.copy()

    age_map = {
        1: "Under 18",
        18: "18-24",
        25: "25-34",
        35: "35-44",
        45: "45-49",
        50: "50-55",
        56: "56+"
    }
    occ_map = {
        0: "other", 1: "academic", 2: "artist", 3: "clerical",
        4: "student", 5: "customer service", 6: "doctor",
        7: "executive", 8: "farmer", 9: "homemaker",
        10: "K-12 student", 11: "lawyer", 12: "programmer",
        13: "retired", 14: "sales", 15: "scientist",
        16: "self-employed", 17: "engineer", 18: "tradesman",
        19: "unemployed", 20: "writer"
    }
    df["age_group"] = df["age"].map(age_map)
    df["occupation_name"] = df["occupation"].map(occ_map)
    return df
