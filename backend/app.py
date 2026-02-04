from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib, re, numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ----------------------------
# Load ML assets
# ----------------------------

model = joblib.load("ats_model.pkl")
tfidf = joblib.load("tfidf.pkl")
sbert = SentenceTransformer("paraphrase-MiniLM-L3-v2")

# ----------------------------
# Create App
# ----------------------------

app = FastAPI()

# ----------------------------
# ENABLE CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # allow React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Request Schema
# ----------------------------

class Request(BaseModel):
    resume_text: str
    jd_text: str

# ----------------------------
# Utils
# ----------------------------

def clean(t):
    t = t.lower()
    t = re.sub(r"[^\w\s]", " ", t)
    return re.sub(r"\s+", " ", t)

# ----------------------------
# Prediction Endpoint
# ----------------------------

@app.post("/predict")
def predict(req: Request):

    r = clean(req.resume_text)
    j = clean(req.jd_text)

    r_emb = sbert.encode([r])
    j_emb = sbert.encode([j])

    v = tfidf.transform([r, j])
    sim = cosine_similarity(v[0], v[1])[0][0]

    X = np.hstack((r_emb, j_emb, [[sim]]))

    prob = float(model.predict_proba(X)[0][1])

    return {"probability": round(prob * 100, 2)}
