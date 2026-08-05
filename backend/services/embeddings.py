from functools import lru_cache

from utils.constants import SBERT_MODEL_NAME


@lru_cache(maxsize=1)
def get_sbert_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(SBERT_MODEL_NAME)


@lru_cache(maxsize=128)
def get_embedding(text: str) -> tuple:
    return tuple(get_sbert_model().encode([text])[0])
