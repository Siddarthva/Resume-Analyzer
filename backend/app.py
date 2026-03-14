import os
import re
import joblib
import numpy as np
import pdfplumber
import docx
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ======================================================
# LOAD MODEL ASSETS
# ======================================================

print("Loading ML model...")
# Allow overriding model paths via environment variables
MODEL_PATH = os.getenv("MODEL_PATH", "ats_model.pkl")
TFIDF_PATH = os.getenv("TFIDF_PATH", "tfidf.pkl")

try:
    model = joblib.load(MODEL_PATH)
    tfidf = joblib.load(TFIDF_PATH)
    sbert = SentenceTransformer("paraphrase-MiniLM-L3-v2")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    # Fallback or exit if critical
    raise RuntimeError(f"Could not load ML assets: {e}")

# ======================================================
# CREATE APP
# ======================================================

app = FastAPI(title="Resume Analyzer API")

# ======================================================
# ENABLE CORS
# ======================================================

# In production, specify the exact frontend URL
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from functools import lru_cache

# ======================================================
# CACHED ENCODING
# ======================================================

@lru_cache(maxsize=128)
def get_embedding(text):
    return sbert.encode([text])

# ======================================================
# SCHEMAS & UTILS
# ======================================================

class PredictionRequest(BaseModel):
    resume_text: str
    jd_text: str

COMMON_SKILLS = [
    'python', 'javascript', 'react', 'node', 'java', 'aws', 'docker', 'sql', 'nosql', 
    'machine learning', 'data science', 'flask', 'fastapi', 'typescript', 'c++', 
    'kubernetes', 'agile', 'scrum', 'git', 'ci/cd', 'linux', 'azure', 'gcp', 
    'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'tableau', 'powerbi'
]

def clean(text):
    if not text: return ""
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

def extract_skills(text):
    if not text: return []
    cleaned_text = text.lower()
    words = set(re.split(r"[\s,./()]+", cleaned_text))
    
    found = []
    for skill in COMMON_SKILLS:
        if " " in skill:
            if skill in cleaned_text:
                found.append(skill)
        elif skill in words:
            found.append(skill)
    return list(set(found))

# ======================================================
# ENDPOINTS
# ======================================================

@app.get("/")
@app.get("/health")
def health():
    return {"status": "alive", "model_loaded": model is not None}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    extension = file.filename.split(".")[-1].lower()
    text = ""
    
    try:
        if extension == "pdf":
            with pdfplumber.open(file.file) as pdf:
                text = " ".join([page.extract_text() or "" for page in pdf.pages])
        elif extension == "docx":
            doc = docx.Document(file.file)
            text = " ".join([para.text for para in doc.paragraphs])
        elif extension == "txt":
            content = await file.read()
            text = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format")
            
        return {"text": text.strip()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")

@app.post("/predict")
def predict(req: PredictionRequest):
    # Validation
    if len(req.resume_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text too short for analysis.")
    if len(req.jd_text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description text too short for analysis.")

    # Processing
    resume = clean(req.resume_text)
    jd = clean(req.jd_text)

    # Features (Using Cache)
    resume_emb = get_embedding(resume)
    jd_emb = get_embedding(jd)

    v = tfidf.transform([resume, jd])
    sim_score = cosine_similarity(v[0], v[1])[0][0]

    X = np.hstack((resume_emb, jd_emb, [[sim_score]]))
    
    # Model Output
    probability = float(model.predict_proba(X)[0][1])

    # Skill Analysis (Backend logic)
    resume_skills = extract_skills(req.resume_text)
    jd_skills = extract_skills(req.jd_text)
    
    matched = [s for s in jd_skills if s in resume_skills]
    missing = [s for s in jd_skills if s not in resume_skills]

    return {
        "probability": round(probability * 100, 2),
        "analysis": {
            "matched_skills": matched,
            "missing_skills": missing,
            "semantic_similarity": round(sim_score * 100, 2)
        }
    }

