from __future__ import annotations

from services.ats import predict_probability
from services.embeddings import get_embedding
from services.formatter import format_prediction
from services.scorer import build_feature_vector, calculate_similarity, score_resume_sections
from services.skills import extract_skills, flatten_skills
from utils.cleaner import clean_text
from utils.constants import MIN_JD_TEXT_LENGTH, MIN_RESUME_TEXT_LENGTH


def predict_resume_match(model, tfidf, resume_text: str, jd_text: str) -> dict:
    if len(resume_text.strip()) < MIN_RESUME_TEXT_LENGTH:
        raise ValueError("Resume text too short for analysis.")
    if len(jd_text.strip()) < MIN_JD_TEXT_LENGTH:
        raise ValueError("Job description text too short for analysis.")

    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(jd_text)

    resume_embedding = get_embedding(cleaned_resume)
    jd_embedding = get_embedding(cleaned_jd)

    similarity = calculate_similarity(tfidf, cleaned_resume, cleaned_jd)
    features = build_feature_vector(resume_embedding, jd_embedding, similarity)
    ats_probability = predict_probability(model, features)

    resume_profile = parse_resume_text(resume_text)
    categorized_resume_skills = extract_skills(resume_text)
    categorized_jd_skills = extract_skills(jd_text)

    resume_skill_list = flatten_skills(categorized_resume_skills)
    jd_skill_list = flatten_skills(categorized_jd_skills)

    matched_skills = [skill for skill in jd_skill_list if skill in resume_skill_list]
    missing_skills = [skill for skill in jd_skill_list if skill not in resume_skill_list]

    section_scores = score_resume_sections(resume_profile, jd_text, categorized_jd_skills)
    suggestions = build_suggestions(missing_skills, section_scores)

    return {
        **format_prediction(ats_probability, matched_skills, missing_skills, similarity),
        "resume": resume_profile,
        "parsed_resume": resume_profile,
        "skills": {
            "resume": categorized_resume_skills,
            "jd": categorized_jd_skills,
        },
        "section_scores": section_scores,
        "suggestions": suggestions,
        "final_score": round(
            (ats_probability * 100) * 0.5 + section_scores["overall"] * 0.5,
            2,
        ),
    }


def parse_resume_text(text: str) -> dict:
    from services.parser import parse_resume

    return parse_resume(text)


def build_suggestions(missing_skills: list[str], section_scores: dict) -> list[str]:
    suggestions = []

    if missing_skills:
        preview = ", ".join(missing_skills[:8])
        suggestions.append(f"Highlight these missing skills more clearly: {preview}")

    if section_scores.get("skills", 0) < 60:
        suggestions.append("Strengthen the dedicated skills section with role-relevant tools and technologies.")
    if section_scores.get("projects", 0) < 60:
        suggestions.append("Add stronger project detail, including outcomes, technologies, and links when available.")
    if section_scores.get("experience", 0) < 60:
        suggestions.append("Expand experience bullets with measurable impact and concrete responsibilities.")
    if section_scores.get("education", 0) < 50:
        suggestions.append("Add education context such as degree, institution, or relevant coursework if applicable.")
    if section_scores.get("certifications", 0) < 40:
        suggestions.append("Include certifications if they are relevant to the target role.")

    return suggestions