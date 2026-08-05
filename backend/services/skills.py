from utils.constants import load_skills_database


SKILLS_DATABASE = load_skills_database()


def _normalize_text(text: str) -> str:
    return text.lower()


def _contains_skill(cleaned_text: str, normalized_words: set[str], skill: str) -> bool:
    skill_lower = skill.lower()
    if " " in skill_lower or "." in skill_lower or "-" in skill_lower or "+" in skill_lower:
        return skill_lower in cleaned_text
    return skill_lower in normalized_words


def extract_skills(text: str | None) -> dict[str, list[str]]:
    if not text:
        return {category: [] for category in SKILLS_DATABASE}

    cleaned_text = _normalize_text(text)
    normalized_words = set(
        cleaned_text.replace(",", " ")
        .replace(".", " ")
        .replace("/", " ")
        .replace("(", " ")
        .replace(")", " ")
        .split()
    )

    categorized_skills: dict[str, list[str]] = {}
    for category, skills in SKILLS_DATABASE.items():
        found = []
        for skill in skills:
            if _contains_skill(cleaned_text, normalized_words, skill):
                found.append(skill)
        categorized_skills[category] = sorted(set(found))

    return categorized_skills


def flatten_skills(categorized_skills: dict[str, list[str]]) -> list[str]:
    flattened = []
    for skills in categorized_skills.values():
        flattened.extend(skills)
    return sorted(set(flattened))
