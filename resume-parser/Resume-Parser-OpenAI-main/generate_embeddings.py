import pandas as pd
import torch
from sentence_transformers import SentenceTransformer
import numpy as np
import json
import os

# ✅ Define file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESUME_DATA_PATH = os.path.join(BASE_DIR, "data", "resume_data.csv")
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "processed_resume_data.csv")

# ✅ Load resume data
if not os.path.exists(RESUME_DATA_PATH):
    print(f"❌ Resume data file not found: {RESUME_DATA_PATH}")
    exit(1)

df = pd.read_csv(RESUME_DATA_PATH)

# ✅ Load BERT model
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

# ✅ Generate BERT embeddings
def generate_embeddings(text):
    """Generate BERT embeddings for a given text."""
    if pd.isna(text):
        text = ""
    embedding = bert_model.encode(text, convert_to_tensor=False).tolist()
    return json.dumps(embedding)  # Save as JSON string

# ✅ Apply BERT embeddings
print("✅ Generating BERT embeddings...")
df['bert_embedding'] = df['skills'].apply(generate_embeddings)

# ✅ Save to CSV
df.to_csv(OUTPUT_PATH, index=False)
print(f"✅ Embeddings saved at {OUTPUT_PATH}")
