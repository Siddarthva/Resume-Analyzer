# ===============================
# SIMPLE ATS MODEL TRAINER
# ===============================

import pandas as pd
import numpy as np
import random, re, joblib
import xgboost as xgb
from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

DATA_PATH = r"C:\Users\Asus\.cache\kagglehub\datasets\snehaanbhawal\resume-dataset\versions\1\Resume\Resume.csv"

MODEL_FILE = "ats_model.pkl"
TFIDF_FILE = "tfidf.pkl"

# -------------------------
def clean(t):
    t = str(t).lower()
    t = re.sub(r"[^\w\s]", " ", t)
    return re.sub(r"\s+", " ", t)

# -------------------------
print("Loading dataset...")
df = pd.read_csv(DATA_PATH)
df = df.dropna()
df = df.sample(1000)

rows = []
roles = df["Category"].unique().tolist()

for _,r in df.iterrows():

    resume = clean(r["Resume_str"])
    true_role = r["Category"]

    if random.random() < 0.5:
        jd_role = true_role
        label = 1
    else:
        jd_role = random.choice(roles)
        label = 0

    jd = f"looking for {jd_role} professional"

    rows.append([resume, jd, label])

df = pd.DataFrame(rows, columns=["resume","jd","label"])

# -------------------------
print("Loading SBERT...")
sbert = SentenceTransformer("paraphrase-MiniLM-L3-v2")

print("Encoding...")
res_emb = sbert.encode(df["resume"].tolist())
jd_emb  = sbert.encode(df["jd"].tolist())

# -------------------------
print("TFIDF...")
tfidf = TfidfVectorizer(max_features=1500)
tfidf.fit(pd.concat([df["resume"],df["jd"]]))

def sim(a,b):
    v = tfidf.transform([a,b])
    return cosine_similarity(v[0],v[1])[0][0]

sims = [sim(a,b) for a,b in zip(df["resume"],df["jd"])]

X = np.hstack((res_emb, jd_emb, np.array(sims).reshape(-1,1)))
y = df["label"].values

# -------------------------
Xtr,Xte,Ytr,Yte = train_test_split(X,y,test_size=0.2)

model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.08,
    tree_method="hist"
)

model.fit(Xtr,Ytr)

pred = model.predict(Xte)
print(classification_report(Yte,pred))

joblib.dump(model, MODEL_FILE)
joblib.dump(tfidf, TFIDF_FILE)

print("MODEL SAVED")
