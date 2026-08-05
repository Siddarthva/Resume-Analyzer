def build_suggestions(matched_skills: list[str], missing_skills: list[str]) -> list[str]:
    suggestions = []
    if missing_skills:
        suggestions.append(f"Add or highlight these skills: {', '.join(missing_skills)}")
    if not matched_skills:
        suggestions.append("Align the resume more closely with the job description wording.")
    return suggestions
