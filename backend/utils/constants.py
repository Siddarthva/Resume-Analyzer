from pathlib import Path
import json

BASE_DIR = Path(__file__).resolve().parents[1]
MODEL_DIR = BASE_DIR / "models"
DATA_DIR = BASE_DIR / "data"
SKILLS_FILE = DATA_DIR / "skills.json"
DEFAULT_MODEL_PATH = MODEL_DIR / "ats_model.pkl"
DEFAULT_TFIDF_PATH = MODEL_DIR / "tfidf.pkl"
SBERT_MODEL_NAME = "paraphrase-MiniLM-L3-v2"

MIN_RESUME_TEXT_LENGTH = 50
MIN_JD_TEXT_LENGTH = 20


def load_skills_database() -> dict:
    with SKILLS_FILE.open("r", encoding="utf-8") as file_handle:
        return json.load(file_handle)
