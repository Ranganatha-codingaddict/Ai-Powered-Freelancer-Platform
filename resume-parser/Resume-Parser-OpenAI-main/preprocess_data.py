import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np

# Load the resume data
data_path = "C:\\Users\\Sushma\\Downloads\\Resume-Parser-OpenAI-main (2)\\Resume-Parser-OpenAI-main\\data\\resume_data.csv"
df = pd.read_csv(data_path)

# Use only a subset of resumes to prevent memory issues
df = df.sample(min(len(df), 500))  # Reduced to 500 resumes

# Extract resume text
resume_texts = df['career_objective'].fillna('').tolist()

# Load sentence-transformers model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Generate embeddings in batches
batch_size = 20
embeddings = []

for i in range(0, len(resume_texts), batch_size):
    batch = resume_texts[i:i + batch_size]
    batch_embeddings = model.encode(batch, batch_size=batch_size, show_progress_bar=True)
    embeddings.extend(batch_embeddings)

# Convert embeddings to NumPy array
embeddings = np.array(embeddings)

# Save the processed data
output_path = "C:\\Users\\Sushma\\Downloads\\Resume-Parser-OpenAI-main (2)\\Resume-Parser-OpenAI-main\\processed_resume_data.csv"
np.savetxt(output_path, embeddings, delimiter=",")

print(f"Embeddings saved to {output_path}")
