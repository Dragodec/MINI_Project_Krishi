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

# ================== RAG SETUP ==================
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

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

    # -------- READ IMAGE --------
    if image:
        image_bytes = await image.read()

    # -------- CACHE --------
    cache_key = get_cache_key(text, image_bytes)
    if cache_key in cache:
        return {"response": cache[cache_key]}

    # -------- SKIP WEAK QUERIES --------
    if text and len(text.split()) < 3 and not image:
        return {"response": "Please provide more details about your crop issue."}

    # -------- RAG SEARCH --------
    context = ""

    if text:
        results = db.similarity_search_with_score(text, k=2)

        filtered_docs = [doc for doc, score in results if score < 1.2]

        context = "\n".join([d.page_content for d in filtered_docs])

    # -------- NO CONTEXT → NO GEMINI --------
    if not context.strip() and not image:
        return {
            "response": "I am not sure. Please consult a local agricultural officer."
        }

    # -------- LIMIT CONTEXT SIZE --------
    context = context[:1500]

    # -------- PROMPT --------
    prompt = f"""
You are a Kerala agricultural expert.

Context:
{context}

User Query:
{text if text else "Analyze the image."}

Rules:
- Do NOT assume crop unless certain
- If unsure, say "possible"
- Give simple step-by-step advice
- Keep response short (max 150 words)
- Answer in English + Malayalam
"""

    content = [{"type": "text", "text": prompt}]

    # -------- IMAGE --------
    if image_bytes:
        encoded = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image_url",
            "image_url": f"data:{image.content_type};base64,{encoded}"
        })

    # -------- GEMINI CALL --------
    try:
        response = llm.invoke([HumanMessage(content=content)])
        final_text = response.content[:800]
    except Exception as e:
        print("❌ Gemini Error:", e)
        return {
            "response": "AI service temporarily unavailable. Try again later."
        }

    # -------- CACHE SAVE --------
    cache[cache_key] = final_text

    return {"response": final_text}


# ================== RUN SERVER ==================
if __name__ == "__main__":
    import uvicorn
    print("🚀 FastAPI running on http://127.0.0.1:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)