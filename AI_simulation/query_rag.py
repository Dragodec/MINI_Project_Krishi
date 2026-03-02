from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

# 1. Load the same embedding model
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# 2. Connect to the existing database
db = Chroma(
    persist_directory="./chroma_db", 
    embedding_function=embeddings,
    collection_name="agri_rag"
)

# 3. Ask a question (It doesn't have to match the JSON exactly!)
query = "What should I do if my banana plants have yellow spots?"

# 4. Search for the top 2 matches
results = db.similarity_search(query, k=2)

print("\n🔎 --- Search Results ---")
for i, doc in enumerate(results):
    print(f"\nResult #{i+1}:")
    print(doc.page_content)
    print("-" * 30)