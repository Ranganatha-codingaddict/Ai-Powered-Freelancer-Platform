import pandas as pd
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ✅ File Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
RESUME_PATH = os.path.join(BASE_DIR, "data", "resume_data.csv")
JOB_SKILLS_PATH = os.path.join(BASE_DIR, "data", "job_skills.csv")
SCORES_PATH = os.path.join(BASE_DIR, "data", "resume_scores.csv")

# ✅ Load Data
resume_df = pd.read_csv(RESUME_PATH)
job_skills_df = pd.read_csv(JOB_SKILLS_PATH)
scores_df = pd.read_csv(SCORES_PATH)

# ✅ Normalize columns
resume_df.rename(columns=lambda x: x.strip().lower(), inplace=True)
job_skills_df.rename(columns=lambda x: x.strip().lower(), inplace=True)

# ✅ Ensure columns exist
if "skills" not in resume_df.columns or "job_skills" not in job_skills_df.columns:
    raise KeyError("Required columns missing in CSV files")

# ✅ Skill Suggestion Logic
def suggest_missing_skills(resume_skills, job_skills):
    """Identify missing skills from resumes"""
    resume_skills = set(resume_skills.split(', ')) if isinstance(resume_skills, str) else set()
    job_skills = set(job_skills.split(', ')) if isinstance(job_skills, str) else set()

    missing_skills = job_skills - resume_skills
    return list(missing_skills)

# ✅ Add missing skills to scores dataframe
missing_skills_list = []
for index, row in resume_df.iterrows():
    resume_skills = row["skills"]
    job_skills = job_skills_df["job_skills"].iloc[0]  # Using the first JD for simplicity
    missing_skills = suggest_missing_skills(resume_skills, job_skills)
    missing_skills_list.append(", ".join(missing_skills))

scores_df["Missing Skills"] = missing_skills_list
output_path = os.path.join(BASE_DIR, "data", "resume_scores_with_skills.csv")
scores_df.to_csv(output_path, index=False)

print(f"✅ Missing skills saved at {output_path}")


# ✅ Visualization Functions
def plot_resume_scores():
    """Plot the distribution of resume scores"""
    plt.figure(figsize=(12, 6))
    sns.histplot(scores_df["Skill Match Score"], bins=20, kde=True, color='skyblue')
    plt.title('Resume Score Distribution')
    plt.xlabel('Score')
    plt.ylabel('Frequency')
    plt.show()


def plot_skill_match():
    """Plot Skill Match Percentage by Candidate"""
    plt.figure(figsize=(14, 7))
    sns.barplot(x='Candidate Name', y='Skill Match Score', data=scores_df, palette='viridis')
    plt.xticks(rotation=90)
    plt.title('Skill Match Percentage by Candidate')
    plt.xlabel('Candidate')
    plt.ylabel('Skill Match Score (%)')
    plt.show()


def plot_selection_status():
    """Plot Selection Status Breakdown"""
    selection_count = scores_df['Skill Match Score'].apply(lambda x: 'Selected' if x >= 75 else 'Not Selected').value_counts()
    
    plt.figure(figsize=(8, 8))
    plt.pie(selection_count, labels=selection_count.index, autopct='%1.1f%%', startangle=140, colors=['#4CAF50', '#FF5252'])
    plt.title('Selection Status Breakdown')
    plt.show()


# ✅ Run Visualizations
plot_resume_scores()
plot_skill_match()
plot_selection_status()
