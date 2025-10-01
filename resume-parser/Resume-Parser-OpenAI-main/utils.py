import re
import torch
import numpy as np
from transformers import BertTokenizer, BertModel

# ✅ Load BERT Model & Tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
bert_model = BertModel.from_pretrained("bert-base-uncased")

def extract_experience(text):
    match = re.search(r"(\d+)\s*(years|yrs|year)", str(text).lower())
    return int(match.group(1)) if match else 0

def get_bert_embedding(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding="max_length", max_length=512)
    with torch.no_grad():
        outputs = bert_model(**inputs)
    return outputs.last_hidden_state[:, 0, :].squeeze().numpy()
