# src/context.py
"""Context features: Temporal + Demographics analysis."""
import pandas as pd


# ============================================================
# TEMPORAL ANALYSIS
# ============================================================
def get_temporal_features(ratings_df):
    """
    Trích xuất temporal features từ timestamp.

    Args:
        ratings_df: DataFrame với column 'timestamp'

    Returns:
        DataFrame với thêm columns: datetime, year, month, dayofweek, hour
    """
    df = ratings_df.copy()
    df["datetime"] = pd.to_datetime(df["timestamp"], unit="s")
    df["year"] = df["datetime"].dt.year
    df["month"] = df["datetime"].dt.month
    df["dayofweek"] = df["datetime"].dt.dayofweek
    df["hour"] = df["datetime"].dt.hour
    return df


def rating_by_year(ratings_with_temporal):
    """Rating trung bình theo năm."""
    return ratings_with_temporal.groupby("year")["rating"].agg(["mean", "count", "std"])


def rating_by_dayofweek(ratings_with_temporal):
    """Rating trung bình theo ngày trong tuần."""
    day_names = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu",
                 4: "Fri", 5: "Sat", 6: "Sun"}
    stats = ratings_with_temporal.groupby("dayofweek")["rating"].agg(["mean", "count"])
    stats.index = stats.index.map(day_names)
    return stats


def rating_by_hour(ratings_with_temporal):
    """Rating trung bình theo giờ trong ngày."""
    return ratings_with_temporal.groupby("hour")["rating"].agg(["mean", "count"])


# ============================================================
# DEMOGRAPHICS ANALYSIS
# ============================================================
AGE_MAP = {
    1: "Under 18",
    18: "18-24",
    25: "25-34",
    35: "35-44",
    45: "45-49",
    50: "50-55",
    56: "56+"
}

OCCUPATION_MAP = {
    0: "other", 1: "academic", 2: "artist", 3: "clerical",
    4: "student", 5: "customer service", 6: "doctor",
    7: "executive", 8: "farmer", 9: "homemaker",
    10: "K-12 student", 11: "lawyer", 12: "programmer",
    13: "retired", 14: "sales", 15: "scientist",
    16: "self-employed", 17: "engineer", 18: "tradesman",
    19: "unemployed", 20: "writer"
}


def get_demographics_features(users_df):
    """Map demographics codes thành labels."""
    df = users_df.copy()
    df["age_group"] = df["age"].map(AGE_MAP)
    df["occupation_name"] = df["occupation"].map(OCCUPATION_MAP)
    return df


def rating_by_gender(ratings_df, users_df):
    """Rating trung bình theo giới tính."""
    merged = ratings_df.merge(users_df[["userId", "gender"]], on="userId")
    return merged.groupby("gender")["rating"].agg(["mean", "count"])


def rating_by_age(ratings_df, users_df):
    """Rating trung bình theo nhóm tuổi."""
    users_with_age = get_demographics_features(users_df)
    merged = ratings_df.merge(users_with_age[["userId", "age_group"]], on="userId")
    return merged.groupby("age_group")["rating"].agg(["mean", "count"])


# ============================================================
# GENRE PREFERENCES
# ============================================================
ALL_GENRES = [
    "Action", "Adventure", "Animation", "Children's", "Comedy",
    "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
    "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
    "Thriller", "War", "Western"
]


def add_genre_flags(movies_df):
    """Thêm binary columns cho mỗi genre."""
    df = movies_df.copy()
    for genre in ALL_GENRES:
        df[f"is_{genre}"] = df["genres"].str.contains(genre, na=False).astype(int)
    return df


def genre_preference_by_gender(ratings_df, movies_df, users_df):
    """
    So sánh genre preferences giữa Male và Female.

    Returns:
        DataFrame: genre, male_avg, female_avg, diff
    """
    # Merge all
    users_with_gender = users_df[["userId", "gender"]].copy()
    movies_with_genres = add_genre_flags(movies_df)
    merged = ratings_df.merge(users_with_gender, on="userId")
    merged = merged.merge(movies_with_genres[["movieId"] + [f"is_{g}" for g in ALL_GENRES]], on="movieId")

    results = []
    for genre in ALL_GENRES:
        col = f"is_{genre}"
        male_avg = merged[(merged["gender"] == "M") & (merged[col] == 1)]["rating"].mean()
        female_avg = merged[(merged["gender"] == "F") & (merged[col] == 1)]["rating"].mean()
        if pd.notna(male_avg) and pd.notna(female_avg):
            results.append({
                "genre": genre,
                "male_avg": male_avg,
                "female_avg": female_avg,
                "diff": female_avg - male_avg
            })

    return pd.DataFrame(results).sort_values("diff", ascending=False)


def genre_preference_by_age(ratings_df, movies_df, users_df):
    """
    Top genres cho mỗi nhóm tuổi.

    Returns:
        dict: {age_group: top_5_genres}
    """
    users_with_age = get_demographics_features(users_df)
    movies_with_genres = add_genre_flags(movies_df)
    merged = ratings_df.merge(users_with_age[["userId", "age_group"]], on="userId")
    merged = merged.merge(movies_with_genres[["movieId"] + [f"is_{g}" for g in ALL_GENRES]], on="movieId")

    results = {}
    for age_grp in users_with_age["age_group"].unique():
        if pd.isna(age_grp):
            continue
        subset = merged[merged["age_group"] == age_grp]
        genre_avgs = []
        for genre in ALL_GENRES:
            col = f"is_{genre}"
            avg = subset[subset[col] == 1]["rating"].mean()
            if pd.notna(avg):
                genre_avgs.append({"genre": genre, "avg_rating": avg})
        top = pd.DataFrame(genre_avgs).sort_values("avg_rating", ascending=False).head(5)
        results[age_grp] = top.to_dict("records")
    return results
