from sentence_transformers import SentenceTransformer

print("--- Pre-downloading SBERT model for build cache ---")
try:
    SentenceTransformer("paraphrase-MiniLM-L3-v2")
    print("SUCCESS: Model cached successfully.")
except Exception as e:
    print(f"ERROR: Failed to download model: {e}")
    exit(1)
