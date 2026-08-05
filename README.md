# 🚀 Resume Analyzer Pro

An AI-powered ATS Resume Analyzer that evaluates how well a resume matches a job description using Machine Learning and Semantic Similarity.

![Python](https://img.shields.io/badge/Python-3.13-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange)
![SBERT](https://img.shields.io/badge/SentenceBERT-NLP-red)

---

## 📌 Overview

Resume Analyzer Pro helps candidates understand how well their resume matches a target job description.

The application combines:

- Semantic NLP using Sentence-BERT
- TF-IDF Similarity
- XGBoost Machine Learning
- Resume Parsing
- ATS Skill Gap Analysis
- Section-wise Resume Evaluation

---

## ✨ Features

- 📄 Resume Upload (PDF, DOCX, TXT)
- 🤖 AI-powered ATS Match Prediction
- 🧠 Sentence-BERT Semantic Embeddings
- 📊 TF-IDF Similarity Analysis
- 🎯 Skill Matching
- ❌ Missing Skill Detection
- 📂 Resume Parsing
- 📈 Section-wise Resume Scores
- 💡 Resume Improvement Suggestions
- ⚡ FastAPI Backend
- ⚛️ React + Vite Frontend

---

## 🏗 Architecture

```
React Frontend
        │
        ▼
Axios API
        │
        ▼
FastAPI Backend
        │
        ├── Resume Parser
        ├── Skill Extraction
        ├── Section Scoring
        ├── TF-IDF Similarity
        ├── Sentence-BERT
        └── XGBoost Prediction
                │
                ▼
         Structured JSON Response
```

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- Axios
- Tailwind CSS
- Lucide Icons

### Backend

- FastAPI
- Python
- pdfplumber
- python-docx
- Joblib

### Machine Learning

- XGBoost
- Sentence Transformers
- TF-IDF
- Scikit-Learn
- NumPy

---

## 📂 Project Structure

```
Resume-Analyzer/

backend/
│
├── app.py
├── train_model.py
├── download_model.py
├── ats_model.pkl
├── tfidf.pkl
├── requirements.txt
├── start.sh
└── utils/

frontend/
│
├── src/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js

README.md
```

---

## 🚀 Installation

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/Resume-Analyzer.git

cd Resume-Analyzer
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
```

Windows

```powershell
.venv\Scripts\activate
```

Install

```bash
pip install -r requirements.txt
```

Run

```bash
uvicorn app:app --reload
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoints

### Health

```
GET /health
```

---

### Extract Resume

```
POST /extract-text
```

Supported

- PDF

- DOCX

- TXT

---

### Predict ATS Match

```
POST /predict
```

Request

```json
{
  "resume_text": "...",
  "jd_text": "..."
}
```

Response

```json
{
  "probability": 93.2,

  "analysis": {
    "matched_skills": [],
    "missing_skills": [],
    "semantic_similarity": 36.7
  }
}
```

---

## 📊 Sample Output

- ATS Match Score
- Semantic Similarity
- Matched Skills
- Missing Skills
- Resume Information
- Section Scores
- Improvement Suggestions

---

## 🧠 Machine Learning Pipeline

```
Resume
      │
      ▼
Cleaning
      │
      ▼
Sentence-BERT Embeddings
      │
      ▼
TF-IDF Similarity
      │
      ▼
Feature Vector
      │
      ▼
XGBoost
      │
      ▼
ATS Match Prediction
```

---

## 🌐 Deployment

### Backend

Render

### Frontend

Vercel

---

## 📈 Future Improvements

- Resume Rewrite using LLMs
- Better Resume Parser
- Expanded Skill Database
- Advanced ATS Formatting Checks
- Multi-Resume Comparison
- Interview Question Generation

---

## 👨‍💻 Author

**Siddarth V Acharya**

Computer Science (AI & ML)

Sahyadri College of Engineering & Management

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_PROFILE

---

## 📄 License

MIT License
