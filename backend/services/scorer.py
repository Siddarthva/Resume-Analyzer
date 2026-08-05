import numpy as np


def calculate_similarity(tfidf_vectorizer, resume_text: str, jd_text: str) -> float:
    from sklearn.metrics.pairwise import cosine_similarity

    vectors = tfidf_vectorizer.transform([resume_text, jd_text])
    return float(cosine_similarity(vectors[0], vectors[1])[0][0])


def build_feature_vector(resume_embedding: tuple, jd_embedding: tuple, similarity: float) -> np.ndarray:
    resume_array = np.asarray([resume_embedding])
    jd_array = np.asarray([jd_embedding])
    return np.hstack((resume_array, jd_array, [[similarity]]))


def score_projects(projects: str) -> float:
    score = 0
    lowered = projects.lower()

    if len(projects) > 400:
        score += 20
    if "github" in lowered:
        score += 10
    if "http" in lowered:
        score += 10
    if "react" in lowered:
        score += 10
    if "docker" in lowered:
        score += 10

    return float(min(score, 100))


def score_skills(skills_section: str, jd_skills: list[str]) -> float:
    if not skills_section:
        return 0.0

    lowered = skills_section.lower()
    score = 0

    for skill in jd_skills:
        if skill.lower() in lowered:
            score += 10

    return float(min(score, 100))


def score_experience(experience: str, jd_skills: list[str]) -> float:
    if not experience:
        return 0.0

    lowered = experience.lower()
    score = 0

    if len(experience) > 600:
        score += 20
    if "years" in lowered or "year" in lowered:
        score += 15
    if any(skill.lower() in lowered for skill in jd_skills):
        score += 25

    return float(min(score, 100))


def score_education(education: str) -> float:
    if not education:
        return 0.0

    lowered = education.lower()
    score = 0

    if "bachelor" in lowered or "master" in lowered or "phd" in lowered:
        score += 30
    if "university" in lowered or "college" in lowered:
        score += 20
    if any(keyword in lowered for keyword in ("gpa", "cgpa", "grade")):
        score += 10

    return float(min(score, 100))


def score_certifications(certifications: str) -> float:
    if not certifications:
        return 0.0

    lowered = certifications.lower()
    score = 0

    if len(certifications) > 100:
        score += 20
    if any(keyword in lowered for keyword in ("aws", "azure", "gcp", "pmp", "scrum", "cisco", "oracle")):
        score += 25

    return float(min(score, 100))


def score_resume_sections(parsed_resume: dict, jd_text: str, categorized_jd_skills: dict[str, list[str]]) -> dict:
    jd_skill_list = [skill for skills in categorized_jd_skills.values() for skill in skills]
    skills_score = score_skills(parsed_resume.get("skills", ""), jd_skill_list)
    experience_score = score_experience(parsed_resume.get("experience", ""), jd_skill_list)
    projects_score = score_projects(parsed_resume.get("projects", ""))
    education_score = score_education(parsed_resume.get("education", ""))
    certifications_score = score_certifications(parsed_resume.get("certifications", ""))

    overall = (
        skills_score * 0.30
        + experience_score * 0.25
        + projects_score * 0.20
        + education_score * 0.15
        + certifications_score * 0.10
    )

    return {
        "skills": round(skills_score, 2),
        "experience": round(experience_score, 2),
        "projects": round(projects_score, 2),
        "education": round(education_score, 2),
        "certifications": round(certifications_score, 2),
        "overall": round(overall, 2),
    }
