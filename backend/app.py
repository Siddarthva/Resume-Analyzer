from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

import os

from services.ats import load_assets, predict_probability
from services.parser import extract_text_from_upload
from services.predictor import predict_resume_match

load_dotenv()

print("Loading ML model...")
try:
    model, tfidf = load_assets()
    print("Model loaded successfully.")
except Exception as exc:
    print(f"Error loading models: {exc}")
    raise RuntimeError(f"Could not load ML assets: {exc}") from exc

app = FastAPI(title="Resume Analyzer API")
FRONTEND_URL = os.getenv("FRONTEND_URL", "*")
allowed_origins = [FRONTEND_URL] if FRONTEND_URL != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@app.get("/health")
def health():
    return {"status": "alive", "model_loaded": model is not None}

@app.post("/extract-text")
async def extract_text(file: UploadFile = File(...)):
    return {"text": await extract_text_from_upload(file)}

@app.post("/predict")
async def predict(payload: dict):
    try:
        resume_text = payload["resume_text"]
        jd_text = payload["jd_text"]
    except KeyError as exc:
        raise HTTPException(status_code=400, detail="resume_text and jd_text are required") from exc

    try:
        return predict_resume_match(model, tfidf, resume_text, jd_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

