import pandas as pd
import random

# Generate 2000+ sample job descriptions
roles = [
    "Software Engineer", "Data Scientist", "Project Manager", "Marketing Specialist",
    "Financial Analyst", "HR Manager", "DevOps Engineer", "Business Analyst",
    "Product Manager", "Cybersecurity Analyst", "Cloud Architect", "Full-Stack Developer",
    "Machine Learning Engineer", "QA Engineer", "Network Administrator", "Graphic Designer",
    "UX/UI Designer", "Content Writer", "Legal Consultant", "Healthcare Administrator"
]

skills = [
    "Python", "Java", "SQL", "Excel", "Leadership", "Machine Learning", "Communication",
    "Project Management", "Agile Methodologies", "Cloud Computing", "Data Analysis",
    "Problem Solving", "Critical Thinking", "Teamwork", "Time Management", "Creativity",
    "Attention to Detail", "Customer Service", "Financial Modeling", "Salesforce"
]

# Create random job descriptions
job_descriptions = []
for _ in range(2200):
    role = random.choice(roles)
    job_skills = ", ".join(random.sample(skills, random.randint(5, 10)))
    description = f"{role} with expertise in {job_skills}."
    job_descriptions.append(description)

# Create a DataFrame
df = pd.DataFrame(job_descriptions, columns=["description"])

# Save the CSV file
output_path = "job_descriptions_2000.csv"
df.to_csv(output_path, index=False)

print(f"File saved as {output_path}")
