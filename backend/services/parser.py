from __future__ import annotations

import re

from fastapi import HTTPException, UploadFile


EMAIL_REGEX = r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
PHONE_REGEX = r"(\+?\d[\d\s\-]{8,15}\d)"
LINKEDIN_REGEX = r"(?:https?://)?(?:www\.)?linkedin\.com/in/[A-Za-z0-9\-_%/]+"
GITHUB_REGEX = r"(?:https?://)?(?:www\.)?github\.com/[A-Za-z0-9\-_.]+"

SECTION_HEADERS = {
    "skills": ["skills", "technical skills", "technologies"],
    "experience": ["experience", "work experience", "professional experience"],
    "projects": ["projects", "personal projects"],
    "education": ["education", "academic background"],
    "certifications": ["certifications", "certificates"],
    "achievements": ["achievements", "awards"],
}


def _split_lines(text: str) -> list[str]:
    return [line.strip() for line in text.splitlines() if line.strip()]


def _detect_section(line: str) -> str | None:
    normalized = line.lower().rstrip(":")
    for section, headers in SECTION_HEADERS.items():
        if normalized in headers:
            return section
    return None


def _extract_sections(lines: list[str]) -> dict[str, str]:
    sections = {section: "" for section in SECTION_HEADERS}
    current_section = None

    for line in lines:
        detected_section = _detect_section(line)
        if detected_section:
            current_section = detected_section
            continue

        if current_section:
            sections[current_section] = f"{sections[current_section]}\n{line}".strip()

    return sections


def parse_resume(text: str) -> dict:
    if not text:
        return {
            "name": "",
            "email": "",
            "phone": "",
            "linkedin": "",
            "github": "",
            "summary": "",
            "skills": "",
            "experience": "",
            "projects": "",
            "education": "",
            "certifications": "",
            "achievements": "",
            "raw_text": "",
        }

    lines = _split_lines(text)
    sections = _extract_sections(lines)

    email_match = re.search(EMAIL_REGEX, text)
    phone_match = re.search(PHONE_REGEX, text)
    linkedin_match = re.search(LINKEDIN_REGEX, text, flags=re.IGNORECASE)
    github_match = re.search(GITHUB_REGEX, text, flags=re.IGNORECASE)

    return {
        "name": lines[0] if lines else "",
        "email": email_match.group() if email_match else "",
        "phone": phone_match.group() if phone_match else "",
        "linkedin": linkedin_match.group() if linkedin_match else "",
        "github": github_match.group() if github_match else "",
        "summary": "",
        "skills": sections["skills"],
        "experience": sections["experience"],
        "projects": sections["projects"],
        "education": sections["education"],
        "certifications": sections["certifications"],
        "achievements": sections["achievements"],
        "raw_text": text,
    }


async def extract_text_from_upload(file: UploadFile) -> str:
    extension = (file.filename or "").rsplit(".", 1)[-1].lower()
    if extension not in {"pdf", "docx", "txt"}:
        raise HTTPException(status_code=400, detail="Unsupported file format")

    try:
        if extension == "pdf":
            import pdfplumber

            with pdfplumber.open(file.file) as pdf:
                return " ".join(page.extract_text() or "" for page in pdf.pages).strip()

        if extension == "docx":
            import docx

            document = docx.Document(file.file)
            return " ".join(paragraph.text for paragraph in document.paragraphs).strip()

        content = await file.read()
        return content.decode("utf-8").strip()
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(exc)}") from exc