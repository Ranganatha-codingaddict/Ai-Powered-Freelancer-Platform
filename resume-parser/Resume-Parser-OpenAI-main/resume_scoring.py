import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ✅ Load datasets with encoding detection
resume_df = pd.read_csv("C://Users//Sushma//Downloads//Resume-Parser-OpenAI-main (2)//Resume-Parser-OpenAI-main//data//resume_data.csv", encoding='utf-8')
job_skills_df = pd.read_csv("C://Users//Sushma//Downloads//Resume-Parser-OpenAI-main (2)//Resume-Parser-OpenAI-main//data//job_skills.csv", encoding='utf-8')

# ✅ Normalize column names
resume_df.rename(columns=lambda x: x.strip().lower().replace('﻿', ''), inplace=True)
job_skills_df.rename(columns=lambda x: x.strip().lower(), inplace=True)

# ✅ Check for missing columns
if "skills" not in resume_df.columns:
    raise KeyError("The 'skills' column is missing in resume_data.csv. Check column names and update the script.")

if "job_skills" not in job_skills_df.columns:
    raise KeyError("The 'job_skills' column is missing in job_skills.csv. Check column names and update the script.")

# ✅ Skill matching function
def calculate_skill_match(resume_skills, job_skills):
    resume_skills = set(resume_skills.split(", ")) if isinstance(resume_skills, str) else set()
    job_skills = set(job_skills.split(", ")) if isinstance(job_skills, str) else set()

    matched_skills = resume_skills.intersection(job_skills)
    score = (len(matched_skills) / len(job_skills)) * 100 if job_skills else 0
    return round(score, 2)

# ✅ Compute scores
scores = []
for index, row in resume_df.iterrows():
    job_skills = job_skills_df["job_skills"].values[0] if len(job_skills_df) > 0 else ""
    skill_match_score = calculate_skill_match(row["skills"], job_skills)

    job_role = row["job_position_name"] if "job_position_name" in resume_df.columns else "Unknown"

    scores.append({
        "Candidate Name": row["name"] if "name" in resume_df.columns else f"Candidate {index + 1}",
        "Job Role": job_role,
        "Skill Match Score": skill_match_score
    })

# ✅ Save results
score_df = pd.DataFrame(scores)
score_df.to_csv("C://Users//Sushma//Downloads//Resume-Parser-OpenAI-main (2)//Resume-Parser-OpenAI-main//data//resume_scores.csv", index=False)

print("✅ Resume scoring complete. Check 'resume_scores.csv' for results.")
