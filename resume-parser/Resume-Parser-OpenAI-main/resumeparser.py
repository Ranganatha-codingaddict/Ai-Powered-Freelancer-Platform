import joblib
import torch
import numpy as np
from transformers import BertTokenizer, BertModel

from train_model import extract_experience

# Load trained XGBoost model
xgb_model = joblib.load("models/xgboost_resume_model.pkl")

# Load BERT model & tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased")

def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=512)
    with torch.no_grad():
        outputs = bert_model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze().numpy()

def predict_resume_score(resume_text):
    # Extract structured features
    experience = extract_experience(resume_text)
    structured_features = np.array([experience])

    # Get BERT embedding
    bert_embedding = get_bert_embedding(resume_text).reshape(1, -1)

    # Combine features
    X_final = np.hstack((structured_features.reshape(1, -1), bert_embedding))

    # Predict score
    score = xgb_model.predict(X_final)[0]
    return max(0, min(100, score))  # Ensure within 0-100 range
