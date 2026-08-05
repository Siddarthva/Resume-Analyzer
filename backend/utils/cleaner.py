import re


def clean_text(text: str | None) -> str:
    if not text:
        return ""
    normalized = text.lower()
    normalized = re.sub(r"[^\w\s]", " ", normalized)
    return re.sub(r"\s+", " ", normalized).strip()
