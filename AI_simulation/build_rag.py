import json
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# Load JSON
with open("RAG_sample_jsons/final_merged.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"📦 Loaded {len(data)} entries")

docs = []

for item in data:
    content = f"""
Farmer Question:
{item.get('user_query', '')}

Malayalam:
{item.get('user_query_ml', '')}

Crop: {item.get('crop', '')}
Category: {item.get('category', '')}

Problem:
{item.get('problem', '')}

Symptoms:
{item.get('symptoms', '')}

Cause:
{item.get('cause', '')}

Solution:
{item.get('solution', '')}

Prevention:
{item.get('prevention', '')}

Weather:
{item.get('weather_condition', '')}

Notes:
{item.get('notes', '')}
"""

    docs.append(Document(
        page_content=content.strip(),
        metadata={
            "crop": item.get("crop", ""),
            "category": item.get("category", "")
        }
    ))

print(f"🧠 Created {len(docs)} documents")

# Embeddings (FREE)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Store in Chroma
db = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="./chroma_db",
    collection_name="agri_rag"
)

print("✅ RAG database created and saved to ./chroma_db")