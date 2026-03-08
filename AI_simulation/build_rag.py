import json
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

print("📦 Loading dataset...")

with open("Jsons/agri_master_rag.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Loaded {len(data)} entries")

docs = []

for item in data:

    content = f"""
Farmer Question English:
{item.get('user_query','')}

Farmer Question Malayalam:
{item.get('user_query_ml','')}

Crop:
{item.get('crop','')}

Category:
{item.get('category','')}

Problem:
{item.get('problem','')}

Symptoms:
{item.get('symptoms','')}

Cause:
{item.get('cause','')}

Recommended Solution:
{item.get('solution','')}

Prevention Advice:
{item.get('prevention','')}

Weather Context:
{item.get('weather_condition','')}

Field Notes:
{item.get('notes','')}
"""

    docs.append(
        Document(
            page_content=content.strip(),
            metadata={
                "crop": item.get("crop", ""),
                "category": item.get("category", "")
            }
        )
    )

print(f"🧠 Creating {len(docs)} vector documents")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

db = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory="./chroma_db",
    collection_name="agri_rag"
)

print("✅ RAG database created successfully")