from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

print("🔍 Loading embeddings...")

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("📂 Connecting to Chroma database...")

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="agri_rag"
)

retriever = db.as_retriever(search_kwargs={"k": 3})

while True:

    query = input("\nAsk a farming question: ")

    if query.lower() in ["exit", "quit"]:
        break

    # Boost query with agriculture keywords (English + Malayalam)
    boosted_query = query + " farming agriculture crop disease pest kerala കൃഷി രോഗം കീടം വാഴ നെല്ല്"

    docs1 = retriever.invoke(query)
    docs2 = retriever.invoke(boosted_query)

    seen = set()
    docs = []

    for d in docs1 + docs2:
        if d.page_content not in seen:
            docs.append(d)
            seen.add(d.page_content)

    docs = docs[:3]

    print("\n🔎 --- Search Results ---")

    for i, doc in enumerate(docs):
        print(f"\nResult #{i+1}")
        print(doc.page_content)
        print("-" * 40)