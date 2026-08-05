import os
from pathlib import Path

import joblib

from utils.constants import BASE_DIR, DEFAULT_MODEL_PATH, DEFAULT_TFIDF_PATH


def _resolve_model_path(env_var: str, default_path: Path) -> Path:
    raw_path = os.getenv(env_var)
    if not raw_path:
        return default_path

    candidate = Path(raw_path)
    if not candidate.is_absolute():
        candidate = BASE_DIR / candidate
    return candidate


def load_assets() -> tuple:
    model_path = _resolve_model_path("MODEL_PATH", DEFAULT_MODEL_PATH)
    tfidf_path = _resolve_model_path("TFIDF_PATH", DEFAULT_TFIDF_PATH)
    model = joblib.load(str(model_path))
    tfidf = joblib.load(str(tfidf_path))
    return model, tfidf


def predict_probability(model, features) -> float:
    return float(model.predict_proba(features)[0][1])
