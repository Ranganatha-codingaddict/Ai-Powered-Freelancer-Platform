import os

# ✅ Define Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ✅ Dataset Paths
DATASET_PATH = os.path.join(BASE_DIR, "data", "resume_data.csv")
PROCESSED_DATA_PATH = os.path.join(BASE_DIR, "data", "preprocessed_resume_data.csv")

# ✅ Model Paths
MODEL_DIR = os.path.join(BASE_DIR, "models")
MODEL_PATH = os.path.join(MODEL_DIR, "model.pkl")
VECTORIZER_PATH = os.path.join(MODEL_DIR, "vectorizer.pkl")

# ✅ Log Path
LOG_DIR = os.path.join(BASE_DIR, "logs")
LOG_PATH = os.path.join(LOG_DIR, "preprocess_log.txt")

# ✅ Ensure Directories Exist
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
