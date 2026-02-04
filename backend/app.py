from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import re
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ======================================================
# LOAD MODEL ASSETS
# ======================================================

print("Loading ML model...")
model = joblib.load("ats_model.pkl")
tfidf = joblib.load("tfidf.pkl")
sbert = SentenceTransformer("paraphrase-MiniLM-L3-v2")
print("Model loaded successfully.")

# ======================================================
# CREATE APP
# ======================================================

app = FastAPI(title="Resume Analyzer API")

# ======================================================
# ENABLE CORS
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# REQUEST SCHEMA
# ======================================================

class Request(BaseModel):
    resume_text: str
    jd_text: str

# ======================================================
# UTILS
# ======================================================

def clean(text):
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

# ======================================================
# HEALTH CHECK
# ======================================================

@app.get("/")
def root():
    return {"status": "API running"}

# ======================================================
# PREDICTION ENDPOINT
# ======================================================

@app.post("/predict")
def predict(req: Request):

    resume = clean(req.resume_text)
    jd = clean(req.jd_text)

    resume_emb = sbert.encode([resume])
    jd_emb = sbert.encode([jd])

    v = tfidf.transform([resume, jd])
    sim = cosine_similarity(v[0], v[1])[0][0]

    X = np.hstack((resume_emb, jd_emb, [[sim]]))

    probability = float(model.predict_proba(X)[0][1])

    return {
        "probability": round(probability * 100, 2)
    }

# ======================================================
# LOCAL / CLOUD ENTRYPOINT
# ======================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000)
