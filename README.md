# 🚀 Resume Analyzer Pro

> An AI-powered ATS Resume Screening Platform that evaluates resume-job compatibility using **Sentence-BERT**, **TF-IDF**, and **XGBoost**, delivering semantic matching, skill-gap analysis, section-wise scoring, and actionable resume improvement suggestions.

<p align="center">

![Python](https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)
![XGBoost](https://img.shields.io/badge/XGBoost-ML-orange?style=for-the-badge)
![SBERT](https://img.shields.io/badge/Sentence--BERT-NLP-red?style=for-the-badge)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)

</p>

---

# 🌐 Live Demo

### 🖥 Frontend

**https://resume-analyzer-five-chi.vercel.app**

### ⚙ Backend API

**https://resume-analyzer-backend-irzd.onrender.com**

### Health Endpoint

```
GET /health
```

https://resume-analyzer-backend-irzd.onrender.com/health

---

# 📌 Overview

Resume Analyzer Pro is an intelligent Applicant Tracking System (ATS) simulator designed to help candidates evaluate how well their resume aligns with a target job description.

Unlike traditional keyword matching systems, Resume Analyzer Pro combines semantic understanding with machine learning to provide meaningful ATS insights.

---

# ✨ Features

- 📄 Resume Upload (PDF, DOCX, TXT)
- 🤖 AI-powered ATS Match Prediction
- 🧠 Sentence-BERT Semantic Similarity
- 📊 TF-IDF Similarity Analysis
- 🎯 Skill Matching
- ❌ Missing Skill Detection
- 📂 Automatic Resume Parsing
- 📈 Section-wise Resume Scoring
- 💡 AI-generated Resume Suggestions
- ⚡ FastAPI REST API
- ⚛ Modern React Frontend
- 🐳 Dockerized Backend
- ☁ Cloud Deployment (Render + Vercel)

---

# 🏗 System Architecture

```
                React + Vite
                     │
                     ▼
               Axios REST API
                     │
                     ▼
              FastAPI Backend
                     │
      ┌──────────────┼──────────────┐
      │              │              │
 Resume Parser   Skill Engine   ATS Scoring
      │              │              │
      └───────┬──────┴──────────────┘
              ▼
      Sentence-BERT Embeddings
              │
              ▼
        TF-IDF Similarity
              │
              ▼
      XGBoost Classifier
              │
              ▼
     Structured JSON Response
```

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Axios
- Tailwind CSS
- Lucide Icons

## Backend

- FastAPI
- Python
- pdfplumber
- python-docx
- Joblib

## Machine Learning

- XGBoost
- Sentence Transformers (SBERT)
- TF-IDF Vectorizer
- Scikit-Learn
- NumPy

## Deployment

- Docker
- Render
- Vercel

---

# 📂 Project Structure

```
Resume-Analyzer
│
├── backend
│   ├── app.py
│   ├── train_model.py
│   ├── download_model.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── render.yaml
│   ├── services
│   ├── models
│   └── utils
│
├── frontend
│   ├── src
│   ├── public
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/<YOUR_USERNAME>/Resume-Analyzer.git

cd Resume-Analyzer
```

---

## Backend

```bash
cd backend

python -m venv .venv
```

Windows

```powershell
.venv\Scripts\activate
```

Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies

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

# 🐳 Docker

Build Image

```bash
docker build -t resume-analyzer-backend .
```

Run Container

```bash
docker run -p 8000:8000 --env-file .env resume-analyzer-backend
```

---

# 📡 API Endpoints

## Health

```
GET /health
```

---

## Extract Resume

```
POST /extract-text
```

Supported formats

- PDF
- DOCX
- TXT

---

## Predict ATS Match

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

Sample Response

```json
{
  "probability": 93.2,
  "analysis": {
    "semantic_similarity": 36.7,
    "matched_skills": [],
    "missing_skills": []
  }
}
```

---

# 📊 Output

The application generates

- ATS Match Score
- Semantic Similarity
- Matched Skills
- Missing Skills
- Parsed Resume Information
- Section-wise Resume Scores
- Resume Improvement Suggestions

---

# 🧠 Machine Learning Pipeline

```
Resume
    │
    ▼
Resume Cleaning
    │
    ▼
Sentence-BERT Embeddings
    │
    ▼
TF-IDF Similarity
    │
    ▼
Feature Engineering
    │
    ▼
XGBoost Classifier
    │
    ▼
ATS Match Probability
```

---

# 🚀 Deployment

| Service | Platform |
|----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Containerization | Docker |

---

# 🔮 Future Improvements

- AI Resume Rewriter
- LLM-powered ATS Feedback
- Advanced Resume Parser
- Expanded Skill Knowledge Base
- ATS Formatting Analysis
- Multi-Resume Comparison
- Interview Question Generator
- Resume Ranking Dashboard

---

# 👨‍💻 Author

### Siddarth V Acharya

Computer Science (AI & ML)

Sahyadri College of Engineering & Management

GitHub

https://github.com/<YOUR_USERNAME>

LinkedIn

https://linkedin.com/in/<YOUR_PROFILE>

---

# 📄 License

Licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star!
