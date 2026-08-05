def format_prediction(probability: float, matched_skills: list[str], missing_skills: list[str], semantic_similarity: float) -> dict:
    return {
        "probability": round(probability * 100, 2),
        "analysis": {
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "semantic_similarity": round(semantic_similarity * 100, 2),
        },
    }
