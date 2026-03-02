import os
import base64
import hashlib
from fastapi import FastAPI, UploadFile, File, Form
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

# Load env
env_path = os.path.join("..", "backend", ".env")
load_dotenv(dotenv_path=env_path)

app = FastAPI()

# --- RAG SETUP ---
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = Chroma(
    persist_directory="./chroma_db",
    embedding_function=embeddings,
    collection_name="agri_rag"
)

# --- GEMINI ---
api_key = os.getenv("GOOGLE_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=api_key,
    temperature=0
)

# --- SIMPLE CACHE ---
cache = {}

def get_cache_key(text, image_bytes):
    raw = (text or "") + str(len(image_bytes) if image_bytes else 0)
    return hashlib.md5(raw.encode()).hexdigest()

@app.post("/process")
async def process_query(
    text: str = Form(None),
    image: UploadFile = File(None),
    audio: UploadFile = File(None)
):
    image_bytes = None

    # --- READ IMAGE ---
    if image:
        image_bytes = await image.read()

    # --- CACHE CHECK ---
    cache_key = get_cache_key(text, image_bytes)
    if cache_key in cache:
        return {"response": cache[cache_key]}

    # --- RAG ---
    context = ""
    if text:
        docs = db.similarity_search(text, k=2)
        context = "\n".join([d.page_content for d in docs])

    # --- LOW CONTEXT → SKIP API ---
    if not context.strip() and not image:
        return {
            "response": "I am not sure. Please consult a local agricultural officer."
        }

    # --- BETTER PROMPT ---
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

    # --- IMAGE ---
    if image_bytes:
        encoded = base64.b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image_url",
            "image_url": f"data:{image.content_type};base64,{encoded}"
        })

    # --- AUDIO (optional skip for now) ---
    # You can disable this to reduce cost

    # --- CALL GEMINI ---
    response = llm.invoke([HumanMessage(content=content)])
    final_text = response.content[:800]  # limit size

    # --- STORE CACHE ---
    cache[cache_key] = final_text

    return {"response": final_text}