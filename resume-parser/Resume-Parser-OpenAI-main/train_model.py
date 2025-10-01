import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier

# ✅ Load data
resume_data = pd.read_csv("data/resume_data.csv")
job_descriptions = pd.read_csv("data/job_descriptions.csv")['description'].tolist()

# ✅ Handle NaN values properly
resume_data = resume_data.assign(skills=resume_data['skills'].fillna(""))

# ✅ Prepare labels (dummy labels for now)
labels = [1 if i % 2 == 0 else 0 for i in range(len(resume_data))]

# ✅ TF-IDF Vectorizer
vectorizer = TfidfVectorizer(max_features=4312)  # Ensure consistent feature count
X = vectorizer.fit_transform(resume_data['skills'])

# ✅ Train RandomForestClassifier
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, labels)

# ✅ Save the model and vectorizer
joblib.dump(model, "models/model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("✅ Model and vectorizer retrained and saved successfully!")
