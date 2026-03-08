import os
import base64
import hashlib
from fastapi import FastAPI, UploadFile, File, Form
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# ================== LOAD ENV ==================

env_path = "D:/Mini-Project/Project_Code/backend/.env"
load_dotenv(env_path)

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("❌ GOOGLE_API_KEY missing")

app = FastAPI()

# ================== EMBEDDINGS ==================

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

# ================== VECTOR DB ==================

db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="agri_rag"
)

# ================== GEMINI ==================

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0
)

# ================== CACHE ==================

cache = {}

def get_cache_key(text, image_bytes):
    m = hashlib.md5()

    if text:
        m.update(text.encode())

    if image_bytes:
        m.update(image_bytes)

    return m.hexdigest()

# ================== API ==================

@app.post("/process")
async def process_query(
    text: str = Form(None),
    image: UploadFile = File(None),
    audio: UploadFile = File(None)
):

    image_bytes = None

    if image:
        image_bytes = await image.read()

    cache_key = get_cache_key(text, image_bytes)

    if cache_key in cache:
        return {"response": cache[cache_key]}

    if text and len(text.split()) < 2 and not image:
        return {"response": "Please provide more details about your crop issue."}

    context = ""

    if text:

        boosted_query = text + " farming agriculture crop disease pest kerala കൃഷി രോഗം കീടം വാഴ നെല്ല്"

        docs1 = db.similarity_search(text, k=3)
        docs2 = db.similarity_search(boosted_query, k=3)

        seen = set()
        docs = []

        for d in docs1 + docs2:
            if d.page_content not in seen:
                docs.append(d)
                seen.add(d.page_content)

        docs = docs[:3]

        context = "\n".join([d.page_content for d in docs])

    if not context.strip() and not image:
        return {
            "response": "I am not sure. Please consult a local agricultural officer."
        }

    context = context[:1500]

    prompt = f"""
You are a Kerala Krishi Bhavan agricultural officer.

Use the agricultural knowledge below to answer the farmer's question.

Context:
{context}

Farmer Question:
{text if text else "Analyze the image."}

Rules:
- Give practical agricultural advice
- Mention chemicals and dosage when relevant
- Mention organic alternatives when possible
- Keep answer under 150 words
- Respond in English and Malayalam
"""

    content = [{"type": "text", "text": prompt}]

    if image_bytes:

        encoded = base64.b64encode(image_bytes).decode("utf-8")

        content.append({
            "type": "image_url",
            "image_url": f"data:{image.content_type};base64,{encoded}"
        })

    try:

        response = llm.invoke([HumanMessage(content=content)])

        final_text = response.content[:800]

    except Exception as e:

        print("❌ Gemini Error:", e)

        return {
            "response": "AI service temporarily unavailable. Try again later."
        }

    cache[cache_key] = final_text

    return {"response": final_text}

# ================== RUN SERVER ==================

if __name__ == "__main__":

    import uvicorn

    print("🚀 FastAPI running on http://127.0.0.1:8000")

    uvicorn.run(app, host="127.0.0.1", port=8000)