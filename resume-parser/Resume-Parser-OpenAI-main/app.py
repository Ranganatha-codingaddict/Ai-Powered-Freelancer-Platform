from flask import Flask, request, jsonify
import os
import joblib
import logging
import re
import numpy as np
from sentence_transformers import SentenceTransformer, util
from flask_cors import CORS
import PyPDF2
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

# Download NLTK resources
nltk.download('punkt')
nltk.download('stopwords')

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "vectorizer.pkl")
SKILL_EMBEDDINGS_PATH = os.path.join(BASE_DIR, "models", "skill_embeddings.pkl")

# Load model and vectorizer
try:
    if not os.path.exists(MODEL_PATH) or not os.path.exists(VECTORIZER_PATH):
        logger.error("Model or vectorizer file not found at specified paths.")
        raise FileNotFoundError("Model or vectorizer not found.")
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    skill_embeddings = joblib.load(SKILL_EMBEDDINGS_PATH) if os.path.exists(SKILL_EMBEDDINGS_PATH) else None
except Exception as e:
    logger.error(f"Failed to load models: {str(e)}")
    exit(1)

# Load BERT model (using a more robust model for better semantic understanding)
try:
    bert_model = SentenceTransformer('paraphrase-mpnet-base-v2')
except Exception as e:
    logger.error(f"Failed to load BERT model: {str(e)}")
    exit(1)

# Text preprocessing
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    """Clean and normalize text for better processing."""
    try:
        # Convert to lowercase
        text = text.lower()
        # Remove special characters and numbers
        text = re.sub(r'[^a-z\s]', '', text)
        # Tokenize
        tokens = word_tokenize(text)
        # Remove stopwords and short words
        tokens = [token for token in tokens if token not in stop_words and len(token) > 2]
        return ' '.join(tokens)
    except Exception as e:
        logger.error(f"Text preprocessing error: {str(e)}")
        return text

# PDF extraction function
def extract_text_from_pdf(file):
    """Extract text from PDF file."""
    try:
        reader = PyPDF2.PdfReader(file)
        text = ''.join([page.extract_text() for page in reader.pages if page.extract_text()])
        if not text.strip():
            logger.warning("No text extracted from PDF")
            return "No text found in PDF"
        return preprocess_text(text)
    except Exception as e:
        logger.error(f"PDF Extraction Error: {str(e)}")
        return "Error extracting text from PDF"

# Suggest missing skills with semantic similarity
def suggest_skills(resume_text, job_description, top_n=5):
    """Suggest missing skills based on job description with semantic matching."""
    try:
        resume_words = set(preprocess_text(resume_text).split())
        jd_words = set(preprocess_text(job_description).split())
        
        # Find missing skills
        missing_skills = jd_words - resume_words
        
        if skill_embeddings and missing_skills:
            # Compute embeddings for missing skills
            missing_skill_list = list(missing_skills)
            skill_scores = []
            for skill in missing_skill_list:
                if skill in skill_embeddings:
                    # Compute similarity to job description
                    jd_embedding = bert_model.encode(job_description, convert_to_tensor=True)
                    skill_embedding = skill_embeddings[skill]
                    score = util.pytorch_cos_sim(skill_embedding, jd_embedding).item()
                    skill_scores.append((skill, score))
            
            # Sort by relevance and select top N
            skill_scores.sort(key=lambda x: x[1], reverse=True)
            return [skill for skill, _ in skill_scores[:top_n]]
        
        return list(missing_skills)[:top_n]
    except Exception as e:
        logger.error(f"Skill suggestion error: {str(e)}")
        return []

# Dynamic weight calculation based on job role complexity
def calculate_weights(job_role):
    """Calculate dynamic weights based on job role complexity."""
    try:
        # Simple heuristic: longer job role names or specific keywords indicate complexity
        complexity_keywords = ['senior', 'lead', 'principal', 'manager', 'director']
        role_words = len(job_role.split())
        is_complex = any(keyword in job_role.lower() for keyword in complexity_keywords)
        
        if is_complex or role_words > 2:
            # More weight to BERT for complex roles (semantic understanding)
            return {"ml": 0.4, "bert": 0.5, "skills": 0.1}
        else:
            # More weight to ML for simpler roles
            return {"ml": 0.6, "bert": 0.3, "skills": 0.1}
    except Exception as e:
        logger.error(f"Weight calculation error: {str(e)}")
        return {"ml": 0.5, "bert": 0.4, "skills": 0.1}

# Route for processing resumes
@app.route('/process', methods=['POST'])
def process():
    """Process resume and return score with skill suggestions."""
    try:
        # Validate input
        if 'pdf_doc' not in request.files:
            logger.warning("No resume file provided in request")
            return jsonify({"error": "No resume file provided"}), 400

        pdf_file = request.files['pdf_doc']
        if not pdf_file.filename.lower().endswith('.pdf'):
            logger.warning("Invalid file format provided")
            return jsonify({"error": "Invalid file format. Only PDF files are allowed."}), 400

        job_role = request.form.get("job_role", "").strip()
        job_description = request.form.get("job_description", "").strip()
        
        if not job_description:
            logger.warning("No job description provided")
            return jsonify({"error": "Job description is required"}), 400

        # Extract and preprocess resume text
        resume_text = extract_text_from_pdf(pdf_file)
        if "error" in resume_text.lower():
            logger.error("Failed to extract text from PDF")
            return jsonify({"error": resume_text}), 400

        # Calculate dynamic weights
        weights = calculate_weights(job_role)

        # TF-IDF Transformation and ML Score
        input_data = vectorizer.transform([resume_text])
        ml_score = model.predict_proba(input_data.toarray())[0][1] * 100  # Use probability for better granularity

        # BERT Similarity Score
        resume_embedding = bert_model.encode(resume_text, convert_to_tensor=True)
        jd_embedding = bert_model.encode(job_description, convert_to_tensor=True)
        similarity_score = util.pytorch_cos_sim(resume_embedding, jd_embedding).item() * 100

        # Skill-based score (based on missing skills)
        skill_suggestions = suggest_skills(resume_text, job_description)
        skill_score = 100 - (len(skill_suggestions) * 10)  # Penalize for missing skills
        skill_score = max(skill_score, 0)  # Ensure non-negative

        # Final Score with dynamic weights
        final_score = (
            weights["ml"] * ml_score +
            weights["bert"] * similarity_score +
            weights["skills"] * skill_score
        )

        # Prepare response
        response = {
            "resume_score": int(final_score),
            "ml_score": round(ml_score, 2),
            "similarity_score": round(similarity_score, 2),
            "skill_score": round(skill_score, 2),
            "skill_suggestions": skill_suggestions,
            "weights_used": weights
        }

        logger.info(f"Processed resume successfully. Final score: {final_score}")
        return jsonify(response)

    except Exception as e:
        logger.error(f"Processing error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=False)