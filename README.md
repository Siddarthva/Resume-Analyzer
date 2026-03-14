# Resume Analyser Pro 🚀

Resume Analyser Pro is an AI-powered talent acquisition tool that intelligently matches resumes to job descriptions using **SBERT (Sentence-BERT)** for semantic understanding and **XGBoost** for match probability scoring. It supports direct text input as well as **PDF** and **DOCX** file uploads.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![React](https://img.shields.io/badge/react-18%2B-blue)

---

## ✨ Features

- **Intelligent Matching**: Uses SBERT embeddings to compare the semantic meaning of resumes and JDs, rather than just keyword counting.
- **Hybrid Scoring**: Combines TF-IDF cosine similarity with deep semantic embeddings processed through an XGBoost classifier.
- **File Support**: Directly upload and parse `.pdf`, `.docx`, and `.txt` resumes.
- **Skill Analysis**: Automatically identifies **Matched Skills** and **Missing Skills** in real-time.
- **Responsive Dashboard**: Modern, interactive UI built with React and Tailwind CSS.
- **Deployment Ready**: Optimized for Vercel (Frontend) and Render (Backend).

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, Uvicorn, Python.
- **ML/AI**: Sentence-Transformers (paraphrase-MiniLM-L3-v2), Scikit-learn, XGBoost, Joblib.
- **Parsing**: pdfplumber, python-docx.

---

## 🚀 Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Siddarthva/Resume-Analyzer.git
cd Resume-Analyzer
```

### 2. Backend Setup
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
*The backend will run on `http://localhost:8000`*

### 3. Frontend Setup
```bash
cd ../frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🌐 Deployment Instructions

### Backend (Render)
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set **Runtime** to `Python 3`.
4. **Build Command**: `pip install -r requirements.txt && python download_model.py`
5. **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
6. Add **Environment Variables**:
   - `FRONTEND_URL`: Your Vercel app URL (e.g., `https://resume-analyser.vercel.app`)
   - `PYTHON_VERSION`: `3.9` (or higher)

### ⚡ Performance Optimization
To prevent the Render free tier from sleeping, you can set up a "cron" or GitHub Action to ping the health endpoint every 14 minutes:
`https://resume-analyzer-pwkc.onrender.com/health`

### Frontend (Vercel)
1. Import your project into [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `frontend`.
3. Set the **Framework Preset** to `Vite`.
4. Add **Environment Variables**:
   - `VITE_API_URL`: Your Render backend URL (e.g., `https://resume-analyser-api.onrender.com`)

---

## ⚙️ Environment Variables

### Backend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `FRONTEND_URL` | Allowed CORS origin | `*` |
| `PORT` | Backend port | `8000` |
| `MODEL_PATH` | Path to XGBoost model | `ats_model.pkl` |

### Frontend (`.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | URL of the FastAPI backend |

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

---
**Made with ❤️ by [Siddarth V Acharya](https://github.com/Siddarthva)**
